#!/usr/bin/env python3
"""通过 GitHub Git Data API 镜像推送本地提交（沙箱 git push 不可用时的兜底）。

原理：Git 对象内容寻址——只要 API 端用与本地完全相同的 tree/parent/author/
committer/date/message 重建提交，SHA 必然一致。
"""
import json
import os
import base64
import subprocess
import sys
import urllib.request

OWNER = "JasonWithMiracle"
REPO = "personal-site"
BRANCH = "main"
API = f"https://api.github.com/repos/{OWNER}/{REPO}"

# 仓库目录：优先取环境变量 SITE_REPO_DIR，否则按脚本位置推导（scripts/ 的上一级）
REPO_DIR = os.environ.get("SITE_REPO_DIR") or os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

TOKEN = os.environ.get("GH_TOKEN")
if not TOKEN:
    print("ERROR: GH_TOKEN not set")
    sys.exit(1)


def api(method, path, payload=None):
    url = f"{API}{path}"
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if data:
        req.add_header("Content-Type", "application/json")
    # 绕过系统代理直连（api.github.com 直连与代理均可，优先直连）
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    with opener.open(req, timeout=60) as r:
        body = r.read().decode()
    return json.loads(body) if body.strip() else {}


def git(*args, **kw):
    return subprocess.run(["git", *args], cwd=REPO_DIR,
                          capture_output=True, **kw)


# ---------- 1. 取远程状态 ----------
ref = api("GET", f"/git/refs/heads/{BRANCH}")
PARENT = ref["object"]["sha"]
print(f"远程 {BRANCH} = {PARENT}")

parent_commit = api("GET", f"/git/commits/{PARENT}")
BASE_TREE = parent_commit["tree"]["sha"]
print(f"BASE_TREE = {BASE_TREE}")

# ---------- 2. 本地状态 ----------
local_sha = git("rev-parse", "HEAD").stdout.decode().strip()
local_tree = git("write-tree").stdout.decode().strip()
print(f"本地 HEAD = {local_sha}")
print(f"本地 tree = {local_tree}")

# 变更文件列表：与 PARENT 的差异
# 必须关掉 quotePath，否则含中文的路径会被转义成 "20-\346..." 形式导致读不到文件
diff = git("-c", "core.quotePath=false", "diff", "--name-only", PARENT, "HEAD").stdout.decode().strip()
CHANGED = [p for p in diff.split("\n") if p.strip()]
print(f"变更文件 {len(CHANGED)} 个:")
for p in CHANGED:
    print(f"  {p}")

# 提交元数据（与本地提交一致）
meta = git("log", "-1", "--format=%an%n%ae%n%aI%n%cn%n%ce%n%cI").stdout.decode().strip().split("\n")
A_NAME, A_EMAIL, A_DATE, C_NAME, C_EMAIL, C_DATE = meta

# 提交消息原始字节（与本地存储一致）
MSG_BYTES = git("log", "-1", "--format=%B").stdout
MSG = MSG_BYTES.decode()
print(f"作者日期 = {A_DATE}")

# 断言 parent 对齐
if PARENT != git("rev-parse", "HEAD~1").stdout.decode().strip():
    print("ERROR: 本地 HEAD~1 != 远程 HEAD，需先核对历史")
    sys.exit(1)

# ---------- 3. 逐个文件建 blob ----------
tree_entries = []
for path in CHANGED:
    full = os.path.join(REPO_DIR, path)
    if not os.path.exists(full):
        print(f"  跳过（已删除）: {path}")
        continue
    with open(full, "rb") as f:
        content = f.read()
    # autocrlf 归一：仓库以 LF 存储
    content = content.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    b64 = base64.b64encode(content).decode()
    blob = api("POST", "/git/blobs", {"content": b64, "encoding": "base64"})
    tree_entries.append({
        "path": path.replace("\\", "/"),
        "mode": "100644",
        "type": "blob",
        "sha": blob["sha"],
    })
    print(f"  blob {blob['sha'][:8]}  {path}")

# ---------- 4. 建 tree ----------
api_tree = api("POST", "/git/trees", {
    "base_tree": BASE_TREE,
    "tree": tree_entries,
})["sha"]
print(f"API tree = {api_tree}")
if api_tree != local_tree:
    print(f"WARNING: tree 不一致（本地 {local_tree}）")
else:
    print("tree 一致 ✓")

# ---------- 5. 建 commit ----------
iso_a = A_DATE
iso_c = C_DATE
api_commit = api("POST", "/git/commits", {
    "message": MSG,
    "tree": api_tree,
    "parents": [PARENT],
    "author": {"name": A_NAME, "email": A_EMAIL, "date": iso_a},
    "committer": {"name": C_NAME, "email": C_EMAIL, "date": iso_c},
})
new_sha = api_commit["sha"]
print(f"API commit = {new_sha}")
print(f"本地 HEAD  = {local_sha}")
if new_sha != local_sha:
    print("WARNING: commit SHA 不一致，需用返回的 message 重建本地提交")
    print(json.dumps(api_commit.get("message", "")))
else:
    print("commit SHA 一致 ✓")

# ---------- 6. 推进 ref ----------
api("PATCH", f"/git/refs/heads/{BRANCH}", {"sha": new_sha, "force": False})
print(f"已推进远程 {BRANCH} → {new_sha[:8]}")

# ---------- 7. 同步本地引用 ----------
git("update-ref", f"refs/remotes/origin/{BRANCH}", new_sha)
print("本地 origin 引用已同步 ✓")

print("\n推送完成。")
