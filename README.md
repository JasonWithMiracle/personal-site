# 个人网站（Astro · Apple 风格 · 中英双语）

这是一个**零代码维护**的个人网站：内容用 Markdown 写（直接在 Obsidian 里编辑），推送后自动上线。

- 技术栈：Astro（静态站点，加载飞快）
- 风格：Apple 设计语言（简洁、留白、淡入动效）
- 语言：中文 `/` · 英文 `/en`
- 托管：Netlify（免费）

---

## 一、目录结构（你日常只会碰到 `src/content`）

```
个人网站编写测试/
├─ src/
│  ├─ content/
│  │  ├─ about/      ← 个人简介（zh.md / en.md），一般不用改
│  │  ├─ projects/   ← 作品集（每件作品一个 .md）
│  │  └─ articles/   ← 文章（你日常写的地方）
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
