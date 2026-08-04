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
    link: z.string().optional(),
    year: z.coerce.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
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

export const collections = { about, projects, articles };
