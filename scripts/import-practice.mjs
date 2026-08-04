import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OPA_ROOT = path.resolve(ROOT, '..', '组织过程资产', '经验总结');
const OUT_BASE = path.resolve(ROOT, 'src', 'content', 'practice');

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  const fmRaw = m[1];
  const body = m[2];
  const data = {};
  for (const line of fmRaw.split('\n')) {
    const mm = line.match(/^([\w-]+):\s*(.*)$/);
    if (!mm) continue;
    const key = mm[1];
    let val = mm[2].trim();
    if (val === 'true') data[key] = true;
    else if (val === 'false') data[key] = false;
    else if (/^-?\d+$/.test(val)) data[key] = Number(val);
    else if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter((s) => s.length);
    } else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      data[key] = val.slice(1, -1);
    } else {
      data[key] = val;
    }
  }
  return { data, body };
}

function applyLinks(s) {
  return s
    .replace(/\[\[([^\]]+)\]\]/g, (m, inner) => {
      const [t, a] = inner.split('|');
      return (a || t).trim();
    })
    .replace(/I:\\ObsidianCatalogue\\Workbuddy\\WorkBuddy/g, '本地 Obsidian vault');
}

function inlineFmt(s) {
  return s
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function removeLeadingH1(body) {
  const lines = body.split('\n');
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && /^#\s/.test(lines[i])) {
    lines.splice(i, 1);
    if (i < lines.length && lines[i].trim() === '') lines.splice(i, 1);
  }
  return lines.join('\n');
}

function transformBody(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  let callout = null;
  const flush = () => {
    if (callout) {
      out.push('</div>');
      callout = null;
    }
  };
  while (i < lines.length) {
    const line = lines[i];
    const co = line.match(/^>\s*\[!(\w+)\](.*)$/);
    if (co) {
      flush();
      const type = co[1].toLowerCase();
      const title = co[2].trim();
      out.push(`<div class="callout callout-${type}">`);
      if (title) out.push(`<p class="callout-title">${inlineFmt(applyLinks(title))}</p>`);
      callout = type;
      i++;
      continue;
    }
    if (callout) {
      if (line.startsWith('>')) {
        const c = applyLinks(line.replace(/^>\s?/, ''));
        if (c.trim() === '') out.push('<p></p>');
        else out.push(`<p>${inlineFmt(c)}</p>`);
        i++;
        continue;
      } else {
        flush();
      }
    }
    if (/^```mermaid\s*$/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      const escaped = buf.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      out.push(`<div class="mermaid">\n${escaped}\n</div>`);
      continue;
    }
    out.push(applyLinks(line));
    i++;
  }
  flush();
  return out.join('\n');
}

function deriveSummary(body) {
  for (const para of body.split('\n')) {
    const t = para.replace(/[#*`>]/g, '').trim();
    if (t.length > 10) return t.slice(0, 160);
  }
  return '';
}

function writeEntry(lang, slug, meta, body) {
  const dir = path.join(OUT_BASE, lang);
  fs.mkdirSync(dir, { recursive: true });
  const fm = [
    '---',
    `title: ${JSON.stringify(meta.title)}`,
    `lang: ${lang}`,
    `summary: ${JSON.stringify(meta.summary)}`,
    `project_category: ${JSON.stringify(meta.project_category)}`,
    meta.project_category_en ? `project_category_en: ${JSON.stringify(meta.project_category_en)}` : null,
    meta.work_type ? `work_type: ${JSON.stringify(meta.work_type)}` : null,
    meta.date ? `date: ${JSON.stringify(meta.date)}` : null,
    `tags: [${meta.tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    `has_diagrams: ${meta.hasDiagrams}`,
    `order: ${meta.order}`,
    `status: "published"`,
    `draft: false`,
    '---',
  ]
    .filter(Boolean)
    .join('\n');
  fs.writeFileSync(path.join(dir, slug + '.md'), fm + '\n\n' + body);
}

const files = walk(OPA_ROOT).filter((f) => f.endsWith('.md') && !f.endsWith('.en.md'));
let count = 0;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const { data, body } = parseFrontmatter(text);
  if (data.website_publish !== true) continue;
  const slug = data.website_slug;
  if (!slug) {
    console.warn('SKIP (no website_slug):', f);
    continue;
  }
  const rel = path.relative(OPA_ROOT, f);
  const parts = rel.split(path.sep);
  const projCat = data.project_category || parts[0] || '未分类';
  const workType = data.work_type || (parts.length > 1 ? parts[1] : '');
  const date = data.date || '';
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const hasDiagrams = data.has_diagrams === true || /```mermaid/.test(body);
  const order = typeof data.website_order === 'number' ? data.website_order : 999;

  const zhBody = transformBody(removeLeadingH1(body));
  writeEntry('zh', slug, {
    title: data.title || slug,
    summary: data.summary || deriveSummary(body),
    project_category: projCat,
    project_category_en: undefined,
    work_type: workType,
    date,
    tags,
    hasDiagrams,
    order,
  }, zhBody);

  const enPath = f.replace(/\.md$/, '.en.md');
  if (fs.existsSync(enPath)) {
    const enText = fs.readFileSync(enPath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    const en = parseFrontmatter(enText);
    const enBody = transformBody(removeLeadingH1(en.body));
    writeEntry('en', slug, {
      title: en.data.title || data.title || slug,
      summary: en.data.summary || data.summary || '',
      project_category: projCat,
      project_category_en: en.data.project_category || undefined,
      work_type: en.data.work_type || workType,
      date,
      tags,
      hasDiagrams,
      order,
    }, enBody);
    console.log('IMPORT zh+en:', slug);
  } else {
    console.log('IMPORT zh only:', slug);
  }
  count++;
}
console.log(`DONE. imported ${count} source entr(y/ies).`);
