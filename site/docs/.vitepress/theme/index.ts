import type { Theme } from 'vitepress';
import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
// リファレンスが 1 ページだったころの錨（#get-law など）→ ツールのページ。scripts/generate-reference.mjs が生成する
import referenceAnchors from '../reference-anchors.json';

/**
 * 1 ページだったころのリファレンスの錨（/reference/mcp/houki-egov#get-law など）で開かれたときに、
 * ツールのページ（/reference/mcp/houki-egov/get_law）へ移す（houki-hub#48、2026-10-10）。
 * 古い URL は末尾の / が無いが、GitHub Pages は /houki-egov を /houki-egov/ に移し、# の後ろはそのまま残る。
 * どちらの形で来ても同じ表を引く。表に無い錨は何もしない。
 */
const anchors = referenceAnchors as Record<string, Record<string, string>>;

function redirectTarget(href: string, base: string): string | null {
  const url = new URL(href, 'http://a.com');
  if (!url.hash || !url.pathname.startsWith(base)) return null;
  const path = `/${url.pathname.slice(base.length)}`.replace(/\.html$/, '').replace(/\/?$/, '/');
  const target = anchors[path]?.[decodeURIComponent(url.hash.slice(1))];
  return target ? `${base}${target.slice(1)}` : null;
}

// Mermaid 図の全画面表示（svg-pan-zoom）は、図が本文幅で読めなくなったら
// pdf-agent-stack の theme/index.ts から移す。
export default {
  extends: DefaultTheme,
  enhanceApp({ router, siteData }) {
    if (!inBrowser) return;
    const base = siteData.value.base;
    // 開いた最初のページ: 読み込み直して移る（古いページを描かない）
    const first = redirectTarget(location.href, base);
    if (first) {
      location.replace(first);
      return;
    }
    // サイトの中のリンクから古い錨へ移るとき
    const before = router.onBeforeRouteChange;
    router.onBeforeRouteChange = async (to) => {
      if ((await before?.(to)) === false) return false;
      const target = redirectTarget(to, base);
      if (!target) return;
      await router.go(target);
      return false;
    };
  }
} satisfies Theme;
