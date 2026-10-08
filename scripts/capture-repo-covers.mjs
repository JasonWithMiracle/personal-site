/**
 * 生成作品集卡片封面：以仓库 README 信息为素材的「标题型」封面。
 *
 * 设计要点：
 *   1. 不直接截 GitHub 页面 —— 仓库页 README 被多层 max-width 容器夹住，
 *      右侧大片留白，且页面有导航/侧栏/汉堡按钮等干扰元素。
 *      改为：取 README 的渲染后 HTML，注入到自建干净页面中渲染，宽度完全可控。
 *   2. 卡片在页面上实际宽度只有约 290px，封面缩到约 1/5 尺寸。
 *      此时正文级字号（20px 上下）会糊成一团 —— 故封面**只保留主标题**，
 *      不留简介；标题用超大字号并整体居中，缩略后仍然清晰。
 *   3. 标题可覆盖 —— 部分仓库 README 的 H1 是英文 slug（如 workbuddy-token-audit），
 *      直接当封面像代码仓；可配置 titleOverride 换成作品名。
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
  },
  {
    slug: 'shooting-plan-workbench',
    repo: 'JasonWithMiracle/shooting-plan-workbench',
    // 该仓库 README 的 H1 已是中英双语标题，无需覆盖
    titleOverride: null,
  },
];

const W = 1600;
const H = 1000;

// GitHub 暗色主题参考色
const C = {
  bg: '#0d1117',
  fg: '#e6edf3',
  border: '#3d444d',
  link: '#4493f8',
  codeBg: 'rgba(110,118,129,0.2)',
};

/**
 * 标题型封面样式：
 *   - 整块 flex 居中（水平 + 垂直），只有标题一个主视觉元素；
 *   - 字号按标题长度自适应（见 scaleTitle），保证长短标题都有合适占幅；
 *   - 不再渲染简介，避免缩到卡片宽时糊成一团。
 */
const COVER_CSS = `
  html, body { margin:0; padding:0; background:${C.bg}; }
  .cover {
    width: ${W}px; height: ${H}px;
    box-sizing: border-box;
    padding: 96px 110px;
    background: ${C.bg};
    color: ${C.fg};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial,
                 "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .cover h1 {
    font-size: 96px;
    line-height: 1.26;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0;
    word-break: break-word;
  }
  /* 若标题里含中英双语（如「拍摄策划工作台 Shooting Plan Workbench」），
     用较弱的视觉权重呈现英文部分，主次分明 */
  .cover .sub {
    display: block;
    font-size: 0.5em;
    font-weight: 400;
    color: ${C.link};
    margin-top: 0.32em;
    letter-spacing: 0;
  }
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

    // 提取 README 的主标题文本（GitHub 把标题包在 div.markdown-heading 里）
    const rawTitle = await fetchPage.$eval('article.markdown-body', (el) => {
      for (const child of [...el.children]) {
        if (/^H[1-6]$/.test(child.tagName)) return child.textContent.trim();
        const h = child.querySelector && child.querySelector('h1,h2');
        if (h) return h.textContent.trim();
      }
      return '';
    });
    await fetchPage.close();

    // ---------- 渲染页：完全离线，只画一个居中的标题 ----------
    const renderPage = await ctx.newPage();
    await renderPage.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('data:') || u.startsWith('about:') || u.startsWith('blob:')) {
        return route.continue();
      }
      return route.abort(); // 自建页面全内联，不需要任何外部资源
    });

    const title = t.titleOverride || rawTitle || t.slug;

    // 标题若形如「中文 English」（中英混排），拆成主标题 + 副标题显示更清晰
    const m = title.match(/^(.+?)\s+([A-Za-z][A-Za-z0-9\s\-&.]*)$/);
    const main = m ? m[1].trim() : title;
    const sub = m ? m[2].trim() : '';
    const titleHtml = sub
      ? `${escapeHtml(main)}<span class="sub">${escapeHtml(sub)}</span>`
      : escapeHtml(title);

    const doc = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
      <style>${COVER_CSS}</style></head>
      <body><div class="cover"><h1>${titleHtml}</h1></div></body></html>`;

    await renderPage.setContent(doc, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await renderPage.waitForTimeout(400);

    // 标题字号自适应：目标是让标题横向占满画面约 78%，
    // 缩到卡片实际宽度（约 290px）后仍清晰可读。
    await renderPage.evaluate(() => {
      const h1 = document.querySelector('.cover h1');
      const cover = document.querySelector('.cover');
      if (!h1 || !cover) return;
      const avail = cover.clientWidth; // 已扣掉 padding
      const target = avail * 0.78;

      // 从大到小试探，找到不超过目标宽度的最大字号
      let size = 200;
      h1.style.fontSize = size + 'px';
      while (size > 40 && h1.scrollWidth > target) {
        size -= 2;
        h1.style.fontSize = size + 'px';
      }
      // 高度也要塞得进（多行标题时）
      const maxH = cover.clientHeight * 0.82;
      while (size > 40 && h1.scrollHeight > maxH) {
        size -= 2;
        h1.style.fontSize = size + 'px';
      }
    });
    await renderPage.waitForTimeout(200);

    await renderPage.screenshot({
      path: resolve(OUT_DIR, `${t.slug}.png`),
      clip: { x: 0, y: 0, width: W, height: H },
      fullPage: false,
    });

    console.log(`✓ ${t.slug} → public/covers/${t.slug}.png  「${main}${sub ? ' / ' + sub : ''}」`);
    await renderPage.close();
  }

  await browser.close();
  console.log('\n完成。');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

main().catch((e) => {
  console.error('截图失败:', e.message);
  process.exit(1);
});
