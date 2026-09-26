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
├─ scripts/          ← 导入与同步脚本（import-practice / sync-github-projects）
├─ public/           ← 图片等静态文件
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
- **底部版本号**：页脚显示 `v<SITE_VERSION>`（`src/lib/site.ts` 中的 `SITE_VERSION`），方便快速迭代监看；每次大改可手动 +1。
- **Obsidian 独有语法**会被转译：`> [!tip]` 等 callout → 带样式的提示框；`[[wikilink]]` → 纯文本；本地绝对路径 → “本地 Obsidian vault”。

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

## 九、写文章：排版规范

Markdown 只管结构、不管好看。站点已升级 `.prose` 排版系统（标题层级、引用卡片化、表格、图注、任务列表、代码块阴影），配合润色规范使用：

- **完整规范与检查清单**：`20-执行/2026-09-27-文章润色与排版规范.md`
- 关键约定三条：
  1. 中文强调用 `**加粗**`，**不要用斜体**（中文是合成斜体，难看）；斜体留给图注
  2. 图注写法：图片**独占一段**，紧跟着的那段只写一句 `*说明文字*`，会自动变成居中灰色小字
  3. 对比/并列信息用表格，关键判断用 `>` 引用卡片，别写成一大段

文章发布流程：选文 → 按规范润色 → 写入 `src/content/articles/zh/<slug>.md` → `npm run build` 验证 → GitHub Desktop 推送。
