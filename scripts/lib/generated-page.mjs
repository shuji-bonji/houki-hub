/**
 * generated-page.mjs — 生成ページの書き込みを、リファレンスと仕様書ページで共有する。
 *
 * generate-reference.mjs（tools/list と .d.ts からのリファレンス）と spec-pages.mjs
 * （specs/ と workflows/ からの仕様書ページ）が同じ規則でページを書くために分けた（2026-10-09）。
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

/* ---------------- 生成ページの書き込み ----------------
 *
 * 冒頭の「…・YYYY-MM-DD）。手で編集しないでください」の日付は、内容が最後に変わった日として使う。
 * 新しく作った本文の日付を既存ファイルの日付に差し替えて比べ、同じなら書かない。
 * 違いがあれば新しい日付のまま書く。
 */
export const GENERATED_DATE = /(・)(\d{4}-\d{2}-\d{2})(）。手で編集しないでください)/;

export function writeGenerated(outPath, text) {
  if (existsSync(outPath)) {
    const before = readFileSync(outPath, 'utf8');
    const prev = before.match(GENERATED_DATE);
    if (prev) {
      const sameExceptDate = text.replace(GENERATED_DATE, `$1${prev[2]}$3`);
      if (sameExceptDate === before) return { written: false, date: prev[2] };
    }
  }
  writeFileSync(outPath, text);
  const now = text.match(GENERATED_DATE);
  return { written: true, date: now ? now[2] : null };
}

/** サイトの読者と同じ時計（JST）の今日の日付 YYYY-MM-DD */
export function todayJst() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}
