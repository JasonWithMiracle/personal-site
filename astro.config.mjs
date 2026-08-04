// @ts-check
import { defineConfig } from 'astro/config';

// 部署到 Netlify 时的正式域名（含 https://）
export default defineConfig({
  site: 'https://magnificent-toffee-7658ee.netlify.app',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
