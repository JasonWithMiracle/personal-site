// @ts-check
import { defineConfig } from 'astro/config';

// 部署到 Netlify / Vercel 时，把下面的 site 改成你的正式域名（含 https://）
// 免费子域名阶段可先保留占位值，不影响本地构建。
export default defineConfig({
  site: 'https://example.netlify.app',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
