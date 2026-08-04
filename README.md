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
│  │  ├─ projects/   ← 作品集（每件作品一个 .md）
│  │  ├─ articles/   ← 文章（你日常写的地方）
│  │  └─ practice/   ← 实践经验（从知识库「组织过程资产/经验总结」自动导入，见第七节）
│  ├─ pages/         ← 页面代码（不用碰）
│  ├─ components/    ← 组件（不用碰）
│  ├─ styles/        ← 设计风格（想换颜色改这里）
│  └─ lib/           ← 双语文字（一般不用碰）
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

```markdown
---
title: 作品名称
lang: zh
summary: 一句话介绍
tags: [设计, 工具]
link: https://example.com   # 可留空
year: 2025
featured: true             # true 会显示在首页精选；false 只进作品集页
order: 1                   # 排序，数字越小越靠前
---

这里写作品详情（可选）。
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
