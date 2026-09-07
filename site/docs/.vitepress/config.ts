import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';
import { withMermaid } from 'vitepress-plugin-mermaid';

/** プロジェクトページなので base を含む。OGP の URL は絶対でなければ無視される。 */
const BASE = '/houki-hub/';
const SITE = `https://shuji-bonji.github.io${BASE}`;

/** cleanUrls に合わせたページパス。index.md はディレクトリ、それ以外は拡張子なし。先頭スラッシュ無し。 */
const pageUrlPath = (relativePath: string) =>
  relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');

// 当面は日本語のみ。英語ページを足すときは pdf-agent-stack の config.ts のように
// locales と nav/sidebar の prefix 化を入れる（DECISIONS.md の未決）。
const nav = [
  { text: 'ガイド', link: '/guide/overview' },
  { text: 'MCP', link: '/mcp/' },
  { text: 'ライブラリ', link: '/lib/houki-abbreviations' },
  { text: 'Skill', link: '/skills/houki-research' },
  { text: 'ロードマップ', link: '/guide/roadmap' }
];

const sidebar = {
  '/guide/': [
    {
      text: 'ガイド',
      items: [
        { text: 'houki-hub とは', link: '/guide/overview' },
        { text: '全体構成と責務', link: '/guide/architecture' },
        { text: '導入手順', link: '/guide/getting-started' },
        { text: '現状と予定', link: '/guide/roadmap' }
      ]
    }
  ],
  '/mcp/': [
    {
      text: 'MCP サーバー',
      items: [
        { text: '一覧', link: '/mcp/' },
        { text: 'houki-egov-mcp', link: '/mcp/houki-egov' },
        { text: 'houki-nta-mcp', link: '/mcp/houki-nta' }
      ]
    }
  ],
  '/lib/': [
    {
      text: 'ライブラリ',
      items: [{ text: 'houki-abbreviations', link: '/lib/houki-abbreviations' }]
    }
  ],
  '/skills/': [
    {
      text: 'Skill',
      items: [{ text: 'houki-research', link: '/skills/houki-research' }]
    }
  ]
};

export default withMermaid(
  defineConfig({
    lang: 'ja',
    title: 'houki-hub',
    description:
      '日本の法令・通達・行政解釈を、出典付きで LLM から引くための MCP サーバー・ライブラリ・Skill 群（法規シリーズ）',
    base: BASE,
    // GitHub Pages は /foo を /foo.html にリダイレクトなしで出す。既定の .html URL だと
    // 拡張子なし 200 と本文が二重になり、Google がサイトマップ URL を正規にしない。
    cleanUrls: true,
    lastUpdated: true,
    // markdown-it-attrs を無効化する。ツールリファレンスの例示行の行末 {...} を
    // attrs が属性として消費し、不正な属性名を生む（pdf-agent-stack で踏んだ）。
    markdown: { attrs: { disable: true } },
    sitemap: { hostname: SITE },
    // llms.txt 生成はビルド時のみ有効化する。
    // プラグインの dev ミドルウェアは「.md で終わる全リクエスト」を横取りして
    // dist の生 Markdown を返すため、dist が存在すると dev の SPA 遷移が全ページで壊れる。
    vite: {
      plugins: [llmstxt().map((p) => ({ ...p, apply: 'build' as const }))],
      // mermaid の依存のうち CJS/UMD のものは名指しで事前バンドルしないと dev で読めない
      optimizeDeps: {
        include: ['fastdom', 'fastdom/extensions/fastdom-promised.js', 'cytoscape-fcose']
      }
    },
    head: [
      ['meta', { name: 'theme-color', content: '#1f4e79' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'houki-hub' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:creator', content: '@shuji_bonji' }]
    ],
    transformPageData(pageData) {
      const url = `${SITE}${pageUrlPath(pageData.relativePath)}`;
      const pageTitle = (pageData.frontmatter.title ?? pageData.title ?? '').trim();
      const title = pageTitle ? `${pageTitle} | houki-hub` : 'houki-hub';
      const description =
        pageData.frontmatter.description ??
        '日本の法令・通達・行政解釈を出典付きで LLM から引くための MCP サーバー・ライブラリ・Skill 群';
      pageData.frontmatter.head ??= [];
      pageData.frontmatter.head.push(
        ['link', { rel: 'canonical', href: url }],
        ['meta', { property: 'og:url', content: url }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }],
        ['meta', { property: 'og:locale', content: 'ja_JP' }],
        ['meta', { name: 'twitter:title', content: title }],
        ['meta', { name: 'twitter:description', content: description }]
      );
    },
    themeConfig: {
      siteTitle: 'houki-hub',
      nav,
      sidebar,
      search: { provider: 'local' },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/shuji-bonji/houki-hub' },
        { icon: 'npm', link: 'https://www.npmjs.com/~shuji-bonji' }
      ],
      outline: { label: 'このページの内容' },
      docFooter: { prev: '前のページ', next: '次のページ' },
      lastUpdated: { text: '最終更新' },
      footer: {
        message:
          '本サイトの内容は調査の出発点であり、法的助言ではありません。個別の事案は資格を持つ専門家に相談してください。',
        copyright: 'MIT Licensed | © shuji-bonji'
      }
    }
  })
);
