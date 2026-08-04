// 双语相关的工具与界面文案。新增界面文案请同时维护 zh / en 两份。

export type Locale = 'zh' | 'en';

interface UIStrings {
  nav: { home: string; portfolio: string; articles: string; practice: string };
  aboutTitle: string;
  featured: string;
  recent: string;
  viewAll: string;
  backToTop: string;
  langLabel: string;
  switchTo: string;
  portfolioDesc: string;
  articlesDesc: string;
  practiceDesc: string;
  readMore: string;
  notFound: string;
}

export const UI: Record<Locale, UIStrings> = {
  zh: {
    nav: { home: '首页', portfolio: '作品集', articles: '文章', practice: '实践' },
    aboutTitle: '关于我',
    featured: '精选作品',
    recent: '最近文章',
    viewAll: '查看全部',
    backToTop: '回到顶部',
    langLabel: 'EN',
    switchTo: 'English',
    portfolioDesc: '这里收集了我做过的一些项目与作品。',
    articlesDesc: '记录学习、思考与实践中写下的一些文字。',
    practiceDesc: '把知识库里落地实践的项目经验，沉淀成可复用的案例。',
    readMore: '阅读全文',
    notFound: '页面不存在',
  },
  en: {
    nav: { home: 'Home', portfolio: 'Work', articles: 'Writing', practice: 'Practice' },
    aboutTitle: 'About',
    featured: 'Featured Work',
    recent: 'Recent Writing',
    viewAll: 'View all',
    backToTop: 'Back to top',
    langLabel: '中文',
    switchTo: '中文',
    portfolioDesc: 'A selection of projects and work I have done.',
    articlesDesc: 'Notes on learning, thinking, and practice.',
    practiceDesc: 'Field-tested project experience from my knowledge base, distilled into reusable case studies.',
    readMore: 'Read more',
    notFound: 'Page not found',
  },
};

export function otherLocale(l: Locale): Locale {
  return l === 'zh' ? 'en' : 'zh';
}

/**
 * 根据当前路径生成“切换语言”的目标地址。
 * 路由约定：
 *  - 栏目页（首页 / 作品集 / 文章列表 / 实践列表）：中文无前缀，英文用 /en 前缀；
 *  - 文章详情 / 实践详情：中英文都挂在 <section>/<lang>/<slug>，语言段内嵌在路径中。
 */
export function toggleLocale(pathname: string, to: Locale): string {
  // 文章详情：直接替换路径内嵌的语言段（不产生 /en 前缀）
  const art = pathname.match(/^\/articles\/(zh|en)\/(.+)$/);
  if (art) {
    const other = art[1] === 'zh' ? 'en' : 'zh';
    return `/articles/${other}/${art[2]}/`;
  }
  // 实践详情：语言段内嵌在路径中（/practice/<lang>/<slug>）
  const prac = pathname.match(/^\/practice\/(zh|en)\/(.+)$/);
  if (prac) {
    const other = prac[1] === 'zh' ? 'en' : 'zh';
    return `/practice/${other}/${prac[2]}/`;
  }
  // 栏目页：通过 /en 前缀切换
  let p = pathname;
  if (p.startsWith('/en')) p = p.slice(3) || '/';
  if (to === 'en') return p === '/' ? '/en/' : '/en' + p;
  return p;
}
