#!/usr/bin/env node
/**
 * 作品集 · GitHub 元数据同步脚本
 *
 * 作用：读取 src/content/projects/**\/*.md 中带 `repo: owner/name` 的作品，
 *      调用 GitHub API 拉取仓库元数据，回写到 frontmatter：
 *        - github   仓库主页 URL（详情页外链按钮用）
 *        - stars    star 数
 *        - language 主要语言
 *        - updated  最近推送日期（字符串，渲染为「最近更新」）
 *
 * 约定：
 *  - 只改写上述 4 个键；其余字段与正文原样保留（正文永不触碰）。
 *  - 没有 repo 字段的作品直接跳过 —— 支持「本地未开源项目」与 GitHub 项目混排。
 *  - 建议把脚本回写的字段视为只读，人工改会被下次同步覆盖。
 *
 * 用法：
 *   node scripts/sync-github-projects.mjs              # 同步并写入
 *   node scripts/sync-github-projects.mjs --dry-run    # 只预览将要写入的内容
 *   node scripts/sync-github-projects.mjs --list-repos # 列出该用户全部公开仓库（用于挑选作品）
 *
 * 鉴权（可选）：未鉴权时 GitHub 限速 60 次/小时，够用；
 *   如需更高额度：set GITHUB_TOKEN=ghp_xxx 后再运行。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'src', 'content', 'projects');

const GITHUB_USER = process.env.GITHUB_USER || 'JasonWithMiracle';
const TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = process.env.GITHUB_OWNER || GITHUB_USER;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIST_REPOS = args.includes('--list-repos');

const UA = { 'User-Agent': 'personal-site-project-sync' };
const HEADERS = TOKEN
  ? { ...UA, Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' }
  : { ...UA, Accept: 'application/vnd.github+json' };

function walkMd(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMd(p));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** 取出 frontmatter 文本块（不含分隔线） */
function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  return { block: m[0], body: m[1], rest: text.slice(m[0].length) };
}

/** 读取 frontmatter 中的简单键值（够用即可，不引入 yaml 依赖） */
function readKey(body, key) {
  const m = body.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, 'm'));
  if (!m) return null;
  return m[1].trim().replace(/^['"]|['"]$/g, '');
}

function formatValue(v) {
  if (typeof v === 'number') return String(v);
  const s = String(v).replace(/"/g, '\\"');
  return `"${s}"`; // 统一加引号，避免日期/URL 被 YAML 解析成别的类型
}

/** 就地更新指定键；已存在则替换其值，不存在则追加到 frontmatter 末尾 */
function upsertKeys(text, updates) {
  const fm = splitFrontmatter(text);
  if (!fm) return text;
  const lines = fm.body.split(/\r?\n/);
  const out = [];
  const seen = new Set();
  for (const line of lines) {
    const km = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/);
    if (km && Object.prototype.hasOwnProperty.call(updates, km[1])) {
      out.push(`${km[1]}: ${formatValue(updates[km[1]])}`);
      seen.add(km[1]);
      continue;
    }
    out.push(line);
  }
  for (const [k, v] of Object.entries(updates)) {
    if (!seen.has(k)) out.push(`${k}: ${formatValue(v)}`);
  }
  return `---\n${out.join('\n')}\n---\n${fm.rest}`;
}

async function gh(pathname) {
  const res = await fetch(`https://api.github.com${pathname}`, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} ${res.statusText} — ${pathname}`);
  }
  return res.json();
}

async function listRepos() {
  const repos = await gh(`/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
  console.log(`\nGitHub 用户 ${GITHUB_USER} 的公开仓库（共 ${repos.length} 个）：\n`);
  console.log('仓库名'.padEnd(30) + '语言'.padEnd(12) + 'star'.padEnd(8) + '更新');
  console.log('-'.repeat(72));
  for (const r of repos) {
    console.log(
      r.name.padEnd(30) +
        (r.language || '-').padEnd(12) +
        String(r.stargazers_count).padEnd(8) +
        r.pushed_at.slice(0, 10)
    );
  }
  console.log(
    '\n挑选后，在 src/content/projects/zh/<slug>.md 的 frontmatter 写 repo: "JasonWithMiracle/<仓库名>"，\n' +
      '再运行 node scripts/sync-github-projects.mjs 即可自动补齐外链与元数据。\n'
  );
}

async function sync() {
  const files = walkMd(PROJECTS_DIR);
  if (files.length === 0) {
    console.log('未找到任何作品 md 文件');
    return;
  }

  const rows = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const fm = splitFrontmatter(text);
    if (!fm) {
      rows.push({ file, status: '跳过（无 frontmatter）' });
      continue;
    }
    const repo = readKey(fm.body, 'repo');
    if (!repo) {
      rows.push({ file, status: '跳过（无 repo 字段，视为本地项目）' });
      continue;
    }

    try {
      const data = await gh(`/repos/${repo}`);
      const updates = {
        github: data.html_url,
        stars: data.stargazers_count,
        language: data.language || '',
        updated: data.pushed_at.slice(0, 10),
      };
      const next = upsertKeys(text, updates);
      if (!DRY_RUN && next !== text) {
        fs.writeFileSync(file, next, 'utf8');
      }
      rows.push({
        file,
        status: DRY_RUN ? '预演（未写入）' : '已同步',
        repo: data.full_name,
        stars: data.stargazers_count,
        language: data.language || '-',
        updated: data.pushed_at.slice(0, 10),
      });
    } catch (e) {
      rows.push({ file, status: `失败：${e.message}`, repo });
    }
  }

  const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
  console.log(`\n同步结果${DRY_RUN ? '（预演模式，未写入文件）' : ''}：\n`);
  for (const r of rows) {
    const extra = r.repo ? `  ${r.repo} · ★${r.stars} · ${r.language} · ${r.updated}` : '';
    console.log(`- ${rel(r.file)} → ${r.status}${extra}`);
  }
  const ok = rows.filter((r) => r.status === '已同步').length;
  console.log(`\n合计 ${rows.length} 个文件，成功同步 ${ok} 个。\n`);
}

(LIST_REPOS ? listRepos() : sync()).catch((e) => {
  console.error('执行失败：', e.message);
  process.exit(1);
});
