/**
 * 生成作品集卡片封面：截取 GitHub 仓库 README 顶部（标题 + 简介 + 要点）。
 *
 * 设计要点：
 *   1. 不直接截 GitHub 页面 —— 仓库页 README 被多层 max-width 容器夹住，
 *      右侧大片留白，且页面有导航/侧栏/汉堡按钮等干扰元素。
 *      改为：取 README 的渲染后 HTML，注入到自建干净页面中渲染，宽度完全可控。
 *   2. 标题可覆盖 —— 部分仓库 README 的 H1 是英文 slug（如 workbuddy-token-audit），
 *      直接当封面像代码仓；可配置 titleOverride 换成作品名。
 *   3. 内容裁剪 —— 只保留「标题 + 简介 + 要点行」，遇到第一个内容分节（h2/hr/大段）
 *      即停止，保证不同仓库封面信息量均衡。
 *
 * 用法：
 *   node scripts/capture-repo-covers.mjs
 *
 * 输出：public/covers/<slug>.png（1600×1000，DPR=2 → 实际 3200×2000 像素）
 *
 * 依赖：playwright（受管 node workspace 内已装）。
 *       ESM 的 import 不认 NODE_PATH，故用 WORKBUDDY_PW 环境变量指向其安装位置，
 *       未设置时回退到受管 workspace 的默认路径。
 */

import { mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PW_HOME =
  process.env.WORKBUDDY_PW ||
  'C:/Users/Jason\'s Destop/.workbuddy/binaries/node/workspace/node_modules/playwright/index.mjs';
const pw = await import(pathToFileURL(PW_HOME).href);
const chromium = pw.chromium ?? pw.default?.chromium;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'public', 'covers');

const TARGETS = [
  {
    slug: 'workbuddy-token-audit',
    repo: 'JasonWithMiracle/workbuddy-token-audit',
    // README 的 H1 是英文 slug，封面改用网站上的作品名
    titleOverride: 'WorkBuddy Token 审计工具',
    // README 原简介是中英混排的术语句，封面换成更直白的表述（不改仓库 README）
    summaryOverride:
      '读取 WorkBuddy 本地请求日志，按任务维度核算 Token 消耗与成本，支持峰谷分时与缓存分档计价。',
  },
  {
    slug: 'shooting-plan-workbench',
    repo: 'JasonWithMiracle/shooting-plan-workbench',
    // 该仓库 README 的 H1 已是中英双语标题，无需覆盖
    titleOverride: null,
    // README 原简介是「不是什么」的对比式表述，封面换成先说清「是什么」
    summaryOverride:
      '面向摄影工作室的单文件策划工具：双击即用、离线可填，从方案到通告一站式完成，一键导出 PDF + DOCX。',
  },
];

const W = 1600;
const H = 1000;

// GitHub 暗色主题参考色
const C = {
  bg: '#0d1117',
  fg: '#e6edf3',
  fgMuted: '#9198a1',
  border: '#3d444d',
  link: '#4493f8',
  codeBg: 'rgba(110,118,129,0.2)',
};

const COVER_CSS = `
  html, body { margin:0; padding:0; background:${C.bg}; }
  .cover {
    width: ${W}px; height: ${H}px;
    box-sizing: border-box;
    padding: 130px 100px;
    background: ${C.bg};
    color: ${C.fg};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial,
                 "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    font-size: 23px;
    line-height: 1.7;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .cover-inner { width: 100%; }
  .cover h1 {
    font-size: 68px; line-height: 1.2; font-weight: 600;
    margin: 0 0 32px; padding-bottom: 26px;
    border-bottom: 1px solid ${C.border};
  }
  .cover p { margin: 0 0 18px; color: ${C.fgMuted}; font-size: 24px; line-height: 1.65; }
  .cover strong { color: ${C.fg}; font-weight: 600; }
  .cover a { color: ${C.link}; text-decoration: none; }
  .cover code {
    background: ${C.codeBg}; border-radius: 6px; padding: 2px 7px; font-size: 0.88em;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }
  /* 徽章/图片一律不展示，避免封面出现零碎小图标 */
  .cover img, .cover svg { display: none !important; }
  /* 隐藏式分隔线（徽章行清空后留下的） */
  .cover hr { display: none !important; }
  /* 内容不足 1 段的空 p（被隐藏徽章留下的空行）直接折叠 */
  .cover-inner > p:empty { display: none !important; }
  /*
   * 只保留「标题 + 简介 + 要点」三段资讯，其余裁掉防信息过载。
   * 注意：README 结构不一致（有的第 3 个元素是 hr、有的是版本行），
   * 故这里不用 nth-child 硬切，而是在 JS 侧按“可见内容块”计数后再裁，
   * 见下方 trimCover()。
   */
`;

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function main() {
  ensureDir(OUT_DIR);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    locale: 'zh-CN',
  });

  for (const t of TARGETS) {
    // ---------- 抓取页：只负责取 README HTML（需要正常联网） ----------
    const fetchPage = await ctx.newPage();
    await fetchPage.goto(`https://github.com/${t.repo}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await fetchPage.waitForSelector('article.markdown-body', { timeout: 30000 });
    const readmeHtml = await fetchPage.$eval('article.markdown-body', (el) => el.innerHTML);
    await fetchPage.close();

    // ---------- 渲染页：只负责把 HTML 渲染成封面（完全离线） ----------
    // 独立页面 + 阻断一切外部请求，避免 README 里的外链图片/字体拖垮 setContent
    const renderPage = await ctx.newPage();
    await renderPage.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('data:') || u.startsWith('about:') || u.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort(); // 注入页面自带内联样式，不需要任何外部资源
    });

    const doc = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
      <style>${COVER_CSS}</style></head>
      <body><div class="cover"><div class="cover-inner">${readmeHtml}</div></div></body></html>`;

    await renderPage.setContent(doc, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await renderPage.waitForTimeout(400);

    // 3~5 步统一在一段 evaluate 里完成，避免多次 DOM 改写互相干扰
    await renderPage.evaluate(
      ({ titleOverride, summaryOverride }) => {
        const inner = document.querySelector('.cover-inner');
        if (!inner) return;

        // ---- a) 定位主标题元素（GitHub 用 div.markdown-heading 包 h1；也可能直接是 h1）----
        let titleEl = null; // 承载标题文本的元素
        for (const el of [...inner.children]) {
          if (/^H[1-6]$/.test(el.tagName)) { titleEl = el; break; }
          const h = el.querySelector && el.querySelector('h1,h2');
          if (h) { titleEl = h; break; }
        }
        if (titleEl && titleOverride) titleEl.textContent = titleOverride;

        // 记录标题所在顶层块，后续据此判断“标题是否已出现”
        const titleTop = titleEl ? titleEl.closest('.cover-inner > *') : null;

        // ---- b) 覆盖简介：标题块之后第一个非空 BLOCKQUOTE / P ----
        const isHeadingBlock2 = (el) =>
          /^H[1-6]$/.test(el.tagName) || !!(el.querySelector && el.querySelector('h1,h2,h3,h4,h5,h6'));
        if (summaryOverride) {
          let passedTitle = false;
          for (const el of [...inner.children]) {
            if (isHeadingBlock2(el)) { passedTitle = true; continue; }
            if (!passedTitle) continue;
            if (el.tagName === 'BLOCKQUOTE' || el.tagName === 'P') {
              if (!(el.textContent || '').trim()) continue;
              el.textContent = summaryOverride;
              break;
            }
          }
        }

        // ---- c) 裁剪：保留主标题 + 其后 2 个正文块，其余隐藏 ----
        //     注意：GitHub 的标题可能包在 <div class="markdown-heading"> 里，
        //     所以判“是不是标题块”要看它内部是否含标题元素，而非自身 tagName。
        const isHeadingBlock = (el) =>
          /^H[1-6]$/.test(el.tagName) || !!(el.querySelector && el.querySelector('h1,h2,h3,h4,h5,h6'));

        let seenTitle = false;
        let kept = 0;
        // 封面信息结构：主标题 + 1 段简介。多于此会让封面像 README 而非卡片封面。
        const KEEP_BLOCKS = 1;
        for (const el of [...inner.children]) {
          const text = (el.textContent || '').trim();

          if (!text || el.tagName === 'HR') { el.style.display = 'none'; continue; }

          if (isHeadingBlock(el)) {
            if (!seenTitle) { seenTitle = true; continue; } // 主标题保留
            el.style.display = 'none';                      // 后续小标题裁掉
            continue;
          }

          if (!seenTitle) { el.style.display = 'none'; continue; }

          kept += 1;
          if (kept > KEEP_BLOCKS) el.style.display = 'none';
        }
      },
      { titleOverride: t.titleOverride, summaryOverride: t.summaryOverride },
    );
    await renderPage.waitForTimeout(250);

    // 4) 截图（固定 16:10 画布，内容垂直居中）
    await renderPage.screenshot({
      path: resolve(OUT_DIR, `${t.slug}.png`),
      clip: { x: 0, y: 0, width: W, height: H },
      fullPage: false,
    });

    console.log(`✓ ${t.slug} → public/covers/${t.slug}.png  (${W}×${H})`);
    await renderPage.close();
  }

  await browser.close();
  console.log('\n完成。');
}

main().catch((e) => {
  console.error('截图失败:', e.message);
  process.exit(1);
});
