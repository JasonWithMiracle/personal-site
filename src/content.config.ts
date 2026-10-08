import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 内容集合：每篇内容都是一个 Markdown 文件，存放在 src/content 下对应目录。
// 文件名形如 zh/xxx.md 与 en/xxx.md，id 即 "zh/xxx" / "en/xxx"，用于双语路由。

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    tagline: z.string(),
    location: z.string().optional(),
    email: z.string().optional(),
    lang: z.enum(['zh', 'en']),
    bio: z.string().default(''),
    skills: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['zh', 'en']),
    summary: z.string(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // 外链（保留向后兼容：早期作品用 link 指向外部地址）
    link: z.string().optional(),
    // GitHub 仓库标识 "owner/name" —— 同步脚本的主键，也是详情页外链依据
    repo: z.string().optional(),
    // 仓库主页 URL（脚本按 repo 回写；无 repo 时也可手写）
    github: z.string().optional(),
    // 在线演示地址（可选）
    demo: z.string().optional(),
    // 详情页外链模式：为 true 时不生成站内详情页，
    // 卡片「查看详情」直接跳转到 demo（用于纯在线站点型作品，无站点内正文）
    detail_external: z.boolean().default(false),
    // 以下三项由 scripts/sync-github-projects.mjs 从 GitHub API 回写，请勿手改
    stars: z.number().optional(),
    language: z.string().optional(),
    updated: z.string().optional(),
    // 内容侧字段
    role: z.string().optional(),
    year: z.coerce.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['zh', 'en']),
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const practice = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/practice' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['zh', 'en']),
    summary: z.string(),
    project_category: z.string(),
    project_category_en: z.string().optional(),
    work_type: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).default([]),
    has_diagrams: z.boolean().default(false),
    order: z.number().default(999),
    status: z.string().default('published'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { about, projects, articles, practice };
