#!/usr/bin/env node
/**
 * 内容规范校验脚本
 *
 * 用途：在 npm run build 之前，拦截「构建不会报错、但线上渲染是错的」这类静默失败。
 * 背景：2026-09-30 实操中发现两类问题——手写 `> [!tip]` 会残留为字面文本、
 *        `repo` 字段拼错会导致外链静默消失，两者 build 都不报错。
 *
 * 用法：
 *   npm run check                 全量校验
 *   npm run check -- --grep darwin 只校验文件名/标题含该关键字的条目
 *   npm run check -- --json       输出 JSON
 *
 * 退出码：有「错误」→ 1；仅「警告」或全通过 → 0
 *
 * 纯 Node 标准库实现，无需额外依赖。
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'src', 'content');
const PUBLIC_DIR = join(ROOT, 'public');

// ---------- CLI 参数 ----------
const argv = process.argv.slice(2);
const AS_JSON = argv.includes('--json');
const grepIdx = argv.indexOf('--grep');
const GREP = grepIdx !== -1 ? argv[grepIdx + 1] : null;

// ---------- 结果收集 ----------
const errors = [];
const warnings = [];
const notes = [];

function err(file, msg) { errors.push({ file, msg }); }
function warn(file, msg) { warnings.push({ file, msg }); }
function note(file, msg) { notes.push({ file, msg }); }

// ---------- 工具函数 ----------

/** 极简 frontmatter 解析：只支持本项目用到的标量 / 数组 / 布尔形式 */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: null, body: raw };

  const fm = m[1];
  const body = raw.slice(m[0].length);
  const data = {};

  const lines = fm.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // 跳过注释与空行
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }

    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!kv) {
      err(null, `frontmatter 存在无法解析的行：${line.trim().slice(0, 60)}`);
      i++; continue;
    }
    const key = kv[1];
    let val = kv[2].trim();

    // 去掉行尾注释（仅当 # 前有空格时）
    val = val.replace(/\s+#\s.*$/, '').trim();

    if (val === '') {
      // 可能是块级数组（后续以 "- " 开头的行）
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(stripQuotes(lines[j].replace(/^\s*-\s+/, '').trim()));
        j++;
      }
      data[key] = items.length ? items : '';
      i = items.length ? j : i + 1;
      continue;
    }

    // 行内数组
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      data[key] = inner === ''
        ? []
        : inner.split(',').map((s) => stripQuotes(s.trim())).filter((s) => s !== '');
    } else if (val === 'true' || val === 'false') {
      data[key] = val === 'true';
    } else {
      data[key] = stripQuotes(val);
    }
    i++;
  }
  return { data, body };
}

function stripQuotes(s) {
  if (s.length >= 2) {
    const a = s[0], b = s[s.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) return s.slice(1, -1);
  }
  return s;
}

/** 递归列出目录下所有 .md */
function walkMd(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkMd(p, acc);
    else if (name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

function rel(p) { return relative(ROOT, p).replace(/\\/g, '/'); }

// ---------- 各集合的必填字段 ----------
const SCHEMA = {
  articles: { required: ['title', 'lang', 'date', 'summary'], bilingual: true },
  practice: { required: ['title', 'lang', 'summary', 'project_category'], bilingual: true },
  projects: { required: ['title', 'lang', 'summary'], bilingual: true },
  about:   { required: ['name', 'role', 'tagline', 'lang'], bilingual: false },
};

// ---------- 校验单条 ----------

/** 收集站内可访问的路由（用于链接校验） */
const knownSlugs = new Map(); // collection -> Set<slug>

function checkEntry(collection, file) {
  const raw = readFileSync(file, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const f = rel(file);

  if (!data) {
    err(f, '缺少 frontmatter（文件未以 --- 开头）');
    return null;
  }

  const spec = SCHEMA[collection];
  if (!spec) {
    err(f, `未知集合：${collection}`);
    return null;
  }

  // 1. 必填字段
  for (const key of spec.required) {
    if (data[key] === undefined || data[key] === '') {
      err(f, `缺少必填字段 \`${key}\``);
    }
  }

  // 2. lang 与目录一致性
  // 相对路径形如 src/content/<collection>/<lang>/<file>.md
  const parts = rel(file).split('/');
  const collIdx = parts.indexOf(collection);     // 指向集合名
  const langIdx = collIdx + 1;                   // 紧邻其后的目录名
  const dirLang = parts[langIdx];
  if (['zh', 'en'].includes(dirLang)) {
    if (data.lang !== dirLang) {
      err(f, `lang 与目录不一致：目录为 \`${dirLang}\`，字段为 \`${data.lang}\``);
    }
  } else if (collection !== 'about') {
    err(f, `文件未放在 zh/ 或 en/ 目录下（当前：${dirLang ?? '无'}）`);
  }

  // 3. slug 命名
  const slug = parts[parts.length - 1].replace(/\.md$/, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    err(f, `slug 命名不合规：\`${slug}\`（应为小写英文 + 连字符）`);
  }
  if (slug.length > 60) {
    warn(f, `slug 过长（${slug.length} 字符），建议精简`);
  }

  // 4. draft 类型
  if (data.draft !== undefined && typeof data.draft !== 'boolean') {
    err(f, `\`draft\` 应为布尔值，当前为 \`${data.draft}\``);
  }

  // 5. date 可解析
  if (data.date !== undefined && data.date !== '') {
    const t = Date.parse(String(data.date));
    if (Number.isNaN(t)) err(f, `\`date\` 无法解析：\`${data.date}\``);
  }

  // 6. summary 长度（中文按字符数，英文按单词数）
  if (typeof data.summary === 'string' && data.summary.length > 0) {
    if (data.lang === 'en') {
      const words = data.summary.trim().split(/\s+/).length;
      if (words > 45) warn(f, `summary 偏长（${words} 词），卡片上可能撑破版式，建议 ≤ 30 词`);
      if (words < 5) warn(f, `summary 偏短（${words} 词），信息量可能不足`);
    } else {
      if (data.summary.length > 80) {
        warn(f, `summary 偏长（${data.summary.length} 字），卡片上可能撑破版式，建议 ≤ 60 字`);
      }
      if (data.summary.length < 10) {
        warn(f, `summary 偏短（${data.summary.length} 字），信息量可能不足`);
      }
    }
  }

  // 7. Obsidian 语法残留
  const obsidianPatterns = [
    { re: /^\s*>\s*\[!\w+\]/m, label: 'Obsidian callout 语法 `> [!tip]`（手写请用 <div class="callout callout-tip">）' },
    { re: /\[\[[^\]]+\]\]/, label: 'Obsidian wikilink `[[...]]`' },
    { re: /!\[\[[^\]]+\]\]/, label: 'Obsidian 嵌入 `![[...]]`' },
  ];
  for (const { re, label } of obsidianPatterns) {
    if (re.test(body)) err(f, `正文残留 ${label}`);
  }

  // 8. SVG 可访问性（若含内联 svg）
  const svgCount = (body.match(/<svg\b/g) || []).length;
  const mermaidCount = (body.match(/```mermaid/g) || []).length;
  const hasAnyFigure = svgCount > 0 || mermaidCount > 0 || /!\[[^\]]*\]\(/.test(body);

  if (svgCount > 0) {
    const opens = body.match(/<svg\b[^>]*>/g) || [];
    opens.forEach((tag, idx) => {
      const n = idx + 1;
      if (!/viewBox=/.test(tag)) err(f, `第 ${n} 个 <svg> 缺少 viewBox`);
      if (!/width=["']100%["']/.test(tag)) warn(f, `第 ${n} 个 <svg> 建议设 width="100%"`);
      if (!/role=["']img["']/.test(tag)) err(f, `第 ${n} 个 <svg> 缺少 role="img"`);
      if (!/aria-labelledby=/.test(tag)) err(f, `第 ${n} 个 <svg> 缺少 aria-labelledby`);
    });
    // 外层包裹
    if (!/<div[^>]*overflow-x:\s*auto[^>]*>\s*<svg/i.test(body)) {
      warn(f, `含 <svg> 但未用 <div style="...overflow-x: auto;"> 包裹，窄屏可能横向溢出`);
    }
  }

  // Mermaid 已弃用（2026-09-30 起新图一律用 SVG），旧内容仍可能存在
  if (mermaidCount > 0) {
    note(f, `正文含 ${mermaidCount} 处 \`\`\`mermaid 代码块（新图请改用内联 SVG，规范见排版规范第七节）`);
  }

  // has_diagrams 与实际图形的一致性
  if (data.has_diagrams === true && !hasAnyFigure) {
    warn(f, `\`has_diagrams: true\` 但正文未发现 SVG / Mermaid / 图片`);
  }
  if (collection === 'practice' && hasAnyFigure && data.has_diagrams !== true) {
    note(f, `正文含图形但 \`has_diagrams\` 未设为 true（仅影响元数据标记）`);
  }

  // 9. 内部链接
  const linkRe = /\]\((\/[^)\s#]*)/g;
  let lm;
  while ((lm = linkRe.exec(body)) !== null) {
    const url = lm[1];
    if (!checkInternalLink(url, collection, data.lang)) {
      warn(f, `站内链接可能失效：\`${url}\``);
    }
  }

  // 10. cover 图片存在性
  if (typeof data.cover === 'string' && data.cover.startsWith('/')) {
    const p = join(PUBLIC_DIR, data.cover.replace(/^\//, ''));
    if (!existsSync(p)) warn(f, `cover 图片不存在：\`${data.cover}\``);
  }

  // 11. 正文图片存在性
  const imgRe = /!\[[^\]]*\]\((\/[^)\s]+)\)/g;
  let im;
  while ((im = imgRe.exec(body)) !== null) {
    const p = join(PUBLIC_DIR, im[1].replace(/^\//, ''));
    if (!existsSync(p)) warn(f, `正文图片不存在：\`${im[1]}\``);
  }

  // 12. practice 分类命名一致性
  if (collection === 'practice' && data.project_category) {
    if (!knownSlugs.has('practice:cat:zh')) knownSlugs.set('practice:cat:zh', new Set());
    if (!knownSlugs.has('practice:cat:en')) knownSlugs.set('practice:cat:en', new Set());
    if (data.lang === 'zh') knownSlugs.get('practice:cat:zh').add(data.project_category);
    if (data.lang === 'en') knownSlugs.get('practice:cat:en').add(data.project_category);
  }

  // 13. projects 的手写只读字段
  if (collection === 'projects') {
    for (const key of ['github', 'stars', 'language', 'updated']) {
      if (data[key] !== undefined) {
        note(f, `\`${key}\` 由 sync-github-projects.mjs 自动回写，手写可能被覆盖`);
      }
    }
    if (data.repo !== undefined && !/^[\w.-]+\/[\w.-]+$/.test(String(data.repo))) {
      err(f, `\`repo\` 格式应为 "owner/name"，当前为 \`${data.repo}\``);
    }
  }

  // 记录 slug 供其它条目做链接校验
  if (collection !== 'about') {
    if (!knownSlugs.has(collection)) knownSlugs.set(collection, new Set());
    knownSlugs.get(collection).add(`${data.lang}/${slug}`);
  }

  return { collection, slug, lang: data.lang, data, file: rel(file) };
}

/** 站内链接存在性校验（宽松：仅做明显错误判断） */
function checkInternalLink(url, collection, lang) {
  // 形如 /practice/zh/<slug>/ 或 /articles/zh/<slug>/
  const m = url.match(/^\/(articles|practice|portfolio)\/(zh|en)\/([^/]+)/);
  if (m) {
    const [, coll, l, slug] = m;
    const key = coll === 'portfolio' ? 'projects' : coll;
    const set = knownSlugs.get(key);
    // 同批已全部解析完才会准确，这里保守处理：找不到就警告
    if (set && !set.has(`${l}/${slug}`)) return false;
  }
  return true;
}

// ---------- 双语配对检查 ----------
function checkBilingual(entries) {
  const byColl = new Map();
  for (const e of entries) {
    if (!e || e.collection === 'about') continue;
    const key = e.collection;
    if (!byColl.has(key)) byColl.set(key, new Map());
    byColl.get(key).set(`${e.slug}::${e.lang}`, e);
  }

  for (const [coll, map] of byColl) {
    const spec = SCHEMA[coll];
    if (!spec?.bilingual) continue;
    for (const [k, e] of map) {
      if (e.lang !== 'zh') continue;
      const enKey = `${e.slug}::en`;
      if (!map.has(enKey)) {
        const isDraft = e.data.draft === true;
        if (isDraft) note(e.file, `草稿，尚无英文版（草稿可忽略）`);
        else warn(e.file, `缺少英文版（en/${e.slug}.md）；如需双语请补齐`);
      }
    }
  }
}

// ---------- 主流程 ----------
function main() {
  if (!existsSync(CONTENT_DIR)) {
    console.error(`未找到内容目录：${CONTENT_DIR}`);
    process.exit(1);
  }

  const allFiles = [];
  for (const collection of Object.keys(SCHEMA)) {
    const dir = join(CONTENT_DIR, collection);
    if (!existsSync(dir)) continue;
    for (const f of walkMd(dir)) {
      if (GREP) {
        const r = rel(f);
        if (!r.toLowerCase().includes(GREP.toLowerCase())) continue;
      }
      allFiles.push({ collection, file: f });
    }
  }

  if (allFiles.length === 0) {
    console.log(GREP ? `未找到匹配 "${GREP}" 的内容文件。` : '未找到任何内容文件。');
    process.exit(0);
  }

  // 两轮：先收集 slug，再校验链接
  const entries = [];
  for (const { collection, file } of allFiles) {
    entries.push(checkEntry(collection, file));
  }
  // 链接校验需要完整 slug 表，故对链接告警做二次确认
  const filteredWarnings = [];
  for (const w of warnings) {
    if (w.msg.startsWith('站内链接可能失效')) {
      const href = w.msg.match(/`(\/[^`]+)`/)?.[1];
      if (href && checkInternalLink(href, null, null)) continue; // 实际存在，撤销告警
    }
    filteredWarnings.push(w);
  }
  warnings.length = 0;
  warnings.push(...filteredWarnings);

  checkBilingual(entries);

  // ---------- 输出 ----------
  const valid = entries.filter(Boolean);

  if (AS_JSON) {
    console.log(JSON.stringify({
      summary: {
        checked: allFiles.length,
        errors: errors.length,
        warnings: warnings.length,
        notes: notes.length,
      },
      errors, warnings, notes,
    }, null, 2));
  } else {
    console.log('');
    console.log(`内容校验 · 共 ${allFiles.length} 个文件`);
    console.log('─'.repeat(56));

    if (errors.length) {
      console.log(`\n错误 ${errors.length} 项（必须修复）：`);
      for (const e of errors) console.log(`  ✗ ${e.file}\n      ${e.msg}`);
    }
    if (warnings.length) {
      console.log(`\n警告 ${warnings.length} 项（需人工判断）：`);
      for (const w of warnings) console.log(`  ! ${w.file}\n      ${w.msg}`);
    }
    if (notes.length) {
      console.log(`\n提示 ${notes.length} 项：`);
      for (const n of notes) console.log(`  · ${n.file}\n      ${n.msg}`);
    }

    console.log('');
    console.log('─'.repeat(56));
    if (errors.length === 0) {
      console.log(`通过：无错误${warnings.length ? `，${warnings.length} 项警告待确认` : ''}。`);
    } else {
      console.log(`未通过：${errors.length} 项错误需修复。`);
    }
    console.log('');
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
