# 个人网站（Astro · Apple 风格 · 中英双语）

这是一个**零代码维护**的个人网站：内容用 Markdown 写（直接在 Obsidian 里编辑），推送后自动上线。

- 技术栈：Astro（静态站点，加载飞快）
- 风格：Apple 设计语言（简洁、留白、淡入动效）
- 语言：中文 `/` · 英文 `/en`
- 托管：Netlify（免费）

> ✅ **部署状态（已上线）**：https://magnificent-toffee-7658ee.netlify.app/
> GitHub 仓库 `JasonWithMiracle/personal-site` 已与 Netlify 连通，推送即自动部署；
> 本地 `main` 与 GitHub `main` 历史已对齐，GitHub Desktop 连接后直接 up-to-date，无需 Pull。

---

## 一、目录结构（你日常只会碰到 `src/content`）

```
个人网站编写测试/
├─ src/
│  ├─ content/
│  │  ├─ about/      ← 个人简介（zh.md / en.md），一般不用改
│  │  ├─ projects/   ← 作品集（一件作品一个 .md，可填 repo 同步 GitHub 数据，见第八节）
│  │  ├─ articles/   ← 文章（你日常写的地方，排版规范见第九节）
│  │  └─ practice/   ← 实践经验（从知识库「组织过程资产/经验总结」自动导入，见第七节）
│  ├─ pages/         ← 页面代码（不用碰。portfolio/ 下 index.astro 是列表、[...id].astro 是详情）
│  ├─ components/    ← 组件（不用碰）
│  ├─ styles/        ← 设计风格（想换颜色改这里）
│  └─ lib/           ← 双语文字（一般不用碰）
├─ scripts/          ← 导入与同步脚本（import-practice / sync-github-projects / check-content）
├─ public/           ← 图片等静态文件
├─ 10-审查与方案/     ← 迭代方案（已纳入版本控制）
├─ 20-执行/           ← 内容规范 / 排版规范（已纳入版本控制）
├─ 40-收尾/           ← 收尾与交接文档（2026-10-09 起纳入版本控制）
├─ VERSION           ← ★ 版本号单一事实源（页脚与台账均以此为准）
├─ 版本迭代台账.md    ← 每次迭代登记一行
├─ netlify.toml      ← 部署配置（已配好）
└─ package.json
```

> 这个目录本身就在你的 Obsidian 库里，**文章 Markdown 可以直接在 Obsidian 中打开、编辑**，无需任何同步工具。

---

## 二、日常怎么发一篇文章（零代码）

1. 打开 Obsidian，进入 `个人网站编写测试/src/content/articles/`。
2. 新建一个笔记，命名为 `zh/你的标题缩写.md`（英文版放 `en/` 下）。
3. 顶部按下面的模板填写，**正文用普通 Markdown 写**：

   ```markdown
   ---
   title: 文章标题
   lang: zh
   date: 2026-08-04
   summary: 一句话摘要，会显示在卡片上
   tags: [标签1, 标签2]
   draft: false
   ---

   这里是正文，支持 **加粗**、列表、引用、代码等。
   ```

   - `draft: true` 表示先存草稿、不上线；
   - 想配封面图，把图片放进 `public/` 后加一行 `cover: /图片名.png`。
4. 打开 **GitHub Desktop**（第一次需要我帮你连好仓库），左侧会看到改动 →
   在左下角写一句说明（如“新增一篇文章”）→ 点 **Commit to main** → 点 **Push origin**。
5. 几秒后 Netlify 自动重新构建，刷新网站即可看到。

> 加作品集同理：在 `projects/` 下新建 `zh/xxx.md`，字段见下方“作品模板”。

---

## 三、作品集模板（projects/zh/xxx.md）

> 一件作品 = 一个 `.md` = 一张卡片 = 一个详情页。
> 有 `repo` 字段 → 卡片和详情页自动出现 **GitHub 仓库 ↗** 外链按钮；没有则只显示「查看详情」。

```markdown
---
title: 作品名称
lang: zh
summary: 一句话介绍（显示在卡片上）
tags: [设计, 工具]
repo: JasonWithMiracle/仓库名    # ← 填了才会同步元数据与外链；本地项目删掉这行
role: 独立开发                    # 可选，显示在详情页「我的角色」
year: 2025
demo: https://example.com         # 可选，在线演示（GitHub 之外再给一个按钮）
featured: true                    # true 会显示在首页精选
order: 1                          # 排序，数字越小越靠前
draft: false                      # true 不上线

# ⚠️ 以下 4 行由同步脚本自动回写，请勿手改
github: "https://github.com/..."
stars: 0
language: "Python"
updated: "2026-09-20"
---

这里写作品详情正文（建议按：背景 → 我做了什么 → 关键决策/难点 → 结果）。
```

---

## 四、第一次部署（我帮你做，你只需准备）

1. 注册一个免费 **GitHub** 账号（https://github.com）。
2. 我帮你把本项目推送到一个仓库（如 `personal-site`）。
3. 注册免费 **Netlify** 账号（https://netlify.com）→ “Add new site” → 选 GitHub 里的 `personal-site`。
4. 部署完成，得到一个 `xxx.netlify.app` 免费地址。

以后换自己的域名：在 Netlify 后台填域名 + 做 DNS 解析即可（域名约几十元/年）。

---

## 五、本地预览（可选）

想先在电脑上看效果，在项目目录运行：

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址（通常是 http://localhost:4321）。

---

## 六、想改风格

打开 `src/styles/global.css` 顶部的 `:root`，里面有颜色、圆角、阴影等变量，改这里就能整体换肤。

---

## 七、发布实践经验（从 Obsidian 知识库导入）

「实践经验」栏目把知识库 `组织过程资产/经验总结/` 下**已标记发布**的结构化经验，自动转换成网站上的中英双语案例。

### 1. 在知识库里标记要发布的笔记

在任意一篇 `组织过程资产/经验总结/<项目类别>/<工作类型>/<日期>-<主题>.md` 的 frontmatter 上加发布开关：

```markdown
---
title: 经验标题
date: 2026-07-31
project_category: 工具链开发      # 中文分类（列表页按此分组）
work_type: MCP集成               # 工作类型（卡片副标题）
website_publish: true            # ← 发布开关：true 才同步到网站
website_slug: modao-requirement-prototype   # ← 固定 slug，决定 URL
website_order: 2                 # ← 同组内排序，越小越靠前
has_diagrams: true               # ← 含 mermaid 图时写 true
tags: [opa, 工具链开发, MCP集成, 墨刀]
---
```

- **英文版**：在同目录放一个同名 `.en.md`（如 `xxx.en.md`），只需写 `title` / `summary` / `project_category`（英文分类名）；中文版自动生成。
- 不写 `website_publish: true` 的笔记不会被同步，兼顾隐私与质量。

### 2. 运行导入脚本

在本地仓库目录执行（脚本会扫描知识库、转译 callout / mermaid / wikilink，生成 `src/content/practice/zh|en/*.md`）：

```bash
node scripts/import-practice.mjs
```

### 3. 提交并推送

```bash
git add src/content/practice scripts
git commit -m "chore: import practice entries"
git push
```

Netlify 自动重建后，以下页面即生效：

- 列表页：中文 `/practice/` · 英文 `/en/practice/`
- 详情页：`/practice/zh/<slug>/` · `/practice/en/<slug>/`

### 4. 其他约定

- **Mermaid 图表**：详情页通过 CDN 按需加载 `mermaid@11`，运行时套用浅色适配主题（白底、浅蓝节点、`#0071e3` 边框），参考 `beautiful-mermaid` 的「清晰优先、充足留白」排版理念。
- **底部版本号**：页脚显示 `v<SITE_VERSION>`，`SITE_VERSION` 由仓库根目录的 **`VERSION` 文件**在构建期读取（**单一事实源**，见第十节）。改版本号**只改 `VERSION` 一处**，并同步登记 `版本迭代台账.md`。
- **Obsidian 独有语法**在**导入链路**（`import-practice.mjs`）中会被自动转译：`> [!tip]` 等 callout → 带样式的提示框；`[[wikilink]]` → 纯文本；本地绝对路径 → “本地 Obsidian vault”。

> ⚠️ **手写文章时请注意**：上述转译**只发生在导入脚本里**。你直接在 `src/content/` 下写的 md **不经过该脚本**，写了 `> [!tip]` 会原样残留成字面文本（构建不报错，只有打开页面才看得到）。
>
> 手写请直接用 HTML 形式：
> ```html
> <div class="callout callout-tip">
> <p class="callout-title">标题</p>
> <p>正文。</p>
> </div>
> ```
> 可用类型：`callout-tip`（绿）/ `callout-warning`（橙）/ `callout-important`（蓝）/ `callout-note`（灰）/ `callout-danger`（红）。
>
> `npm run check` 会自动拦截这类残留。

---

## 八、作品集：同步 GitHub 项目元数据

作品卡片上的 star 数、语言、更新时间、仓库外链，都不用手写，一个命令从 GitHub 拉：

```bash
npm run sync:projects          # 同步并写入 md
npm run sync:projects:dry      # 先预演，看会改什么（不写文件）
npm run list:repos             # 列出 GitHub 上全部公开仓库，方便挑作品
```

- 只对**写了 `repo:` 字段**的作品生效；没写的作品原样跳过（所以本地未开源项目可以混排）。
- 只改写 `github / stars / language / updated` 四个字段，**正文和其余字段一律不动**。
- 未配置 `GITHUB_TOKEN` 时限速 60 次/小时，够用；需要更高额度就先 `set GITHUB_TOKEN=ghp_xxx`。

新增一件 GitHub 作品的正确顺序：

1. 在 `src/content/projects/zh/` 新建 `<slug>.md`，frontmatter 填 `repo: JasonWithMiracle/<仓库名>`
2. 写正文（背景 → 我做了什么 → 关键决策/难点 → 结果）
3. 跑 `npm run sync:projects`
4. 提交推送

---

## 九、内容增改：规范与校验

> **两份规范，分工明确**：工程正确性看总纲，阅读体验看排版规范。

| 文档 | 管什么 |
| ---- | ------ |
| `20-执行/2026-09-30-内容增改管理规范.md` | **总纲**：四类内容集合的字段契约、增改流程、四道人工门禁、校验脚本说明、场景速查表 |
| `20-执行/2026-09-27-文章润色与排版规范.md` | **排版**：渲染语法、frontmatter 写法、结构规范、**SVG 图表规范**、项目栏目排版、推送前验证 |

### 内容校验脚本

`npm run check` 用于拦截「构建不报错、但线上渲染是错的」这类静默失败：

```bash
npm run check                    # 全量校验
npm run check -- --grep darwin   # 只校验匹配关键字的条目
npm run check -- --json          # 输出 JSON，便于接入其它工具
```

校验项包括：frontmatter 必填字段、`lang` 与目录一致性、slug 命名、日期格式、
**Obsidian 语法残留**、SVG 可访问性（`role` / `aria-labelledby` / `viewBox`）、
内部链接、图片引用、双语配对、`repo` 字段格式。

**错误**必须修复（退出码 1）；**警告**需人工判断。

### 标准流程（五步）

```bash
# 1 定位：确定集合（articles / practice / projects / about）与 slug
# 2 撰写：按字段契约写 frontmatter，按排版规范写正文

# 3 校验（不通过不得继续）
npm run check

# 4 构建 + 预览（必须实际打开页面看）
npm run build
npm run preview

# 5 推送（需人工确认，push 即上线）
git add src/content && git commit -m "content: 新增 <slug>" && git push
```

> **构建被 safe-delete 拦截时**：`mv dist "_stale_dist_$(date +%H%M%S)"` 隔离旧产物后重建，不要反复重试 `rm`。

### 四条排版关键约定

1. 中文强调用 `**加粗**`，**不要用斜体**（中文是合成斜体，难看）；斜体留给图注
2. 图注写法：图片**独占一段**，紧跟着的那段只写一句 `*说明文字*`，会自动变成居中灰色小字
3. 对比/并列信息用表格，关键判断用 callout，别写成一大段
4. **图表一律用内联 SVG，不用 Mermaid**（构建时渲染、零依赖、样式可控）

> SVG 图的完整绘制规范见排版规范第七节（骨架、配色令牌、版式纪律、自检清单）。

---

## 十、版本号与仓库受控范围（2026-10-09 起）

### 1. 版本号单一事实源

| 项 | 说明 |
| ---- | ---- |
| 唯一来源 | 仓库根目录 **`VERSION`** 文件（内容形如 `2.1.2`） |
| 页脚 | `Footer.astro` 读取 `src/lib/site.ts` 导出的 `SITE_VERSION`（构建期从 `VERSION` 读取），显示为 `v2.1.2` |
| 台账 | 项目内 `版本迭代台账.md` 每次迭代登记一行；组织级 `组织过程资产/项目版本台账.md` 同步 PRJ-2026-007 行 |
| 规则 | 改动 ≤30% → PATCH；30%<x≤50% → MINOR；>50% → MAJOR（`组织过程资产/工具/项目收尾/version_bump.py`） |
| 铁律 | **改版本号只改 `VERSION` 一处**，再同步台账三处，杜绝页脚/台账双轨漂移 |

### 2. 仓库受控范围（git 跟踪）

| 类别 | 路径 | 状态 |
| ---- | ---- | ---- |
| 源码 | `src/`（content / pages / components / layouts / lib / styles） | ✅ 纳入 |
| 脚本 | `scripts/`（含 `push_via_api.py`） | ✅ 纳入 |
| 静态资源 | `public/` | ✅ 纳入 |
| 部署与工程配置 | `netlify.toml` / `astro.config.mjs` / `package.json` / `package-lock.json` / `.gitignore` | ✅ 纳入 |
| 项目文档 | `README.md` / `版本迭代台账.md` / `10-审查与方案/` / `20-执行/` / `40-收尾/` | ✅ 纳入 |
| 版本源 | `VERSION` | ✅ 纳入 |
| 构建产物与依赖 | `node_modules/` / `dist/` / `.astro/` / `_stale_*` | ⛔ 忽略（可重建） |
| 私密差异项 | `src/content/projects/zh/voicedesk.md`（仓库转 public 前不提交） | ⛔ 忽略（上线时移除该行） |

### 3. 沙箱受限时的推送兜底

若 `git push` 因网络出口被拦截失败，改用 GitHub Git Data API 镜像推送：

```bash
# 需先设置 GH_TOKEN（不在仓库中硬编码任何凭证）
set GH_TOKEN=ghp_xxx
python scripts/push_via_api.py
```

脚本按**脚本自身位置**推导仓库目录（也可用环境变量 `SITE_REPO_DIR` 覆盖），不再硬编码本机路径。
