import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

// 既定テーマのまま。Mermaid 図の全画面表示（svg-pan-zoom）は、図が本文幅で読めなくなったら
// pdf-agent-stack の theme/index.ts から移す。
export default {
  extends: DefaultTheme
} satisfies Theme;
