#!/usr/bin/env node
/**
 * reference-regen.yml の中で流した呼び出し例の照合（check-examples-contract.mjs --db absent --json）の結果を、
 * 実行の要約と PR の本文に載せる Markdown にする（Q38'、houki-hub#44）。
 *
 *   node .github/scripts/contract-summary.mjs <contract.json> --headline   # PR の本文の先頭に置く 1 段落（件数）
 *   node .github/scripts/contract-summary.mjs <contract.json>              # 「呼び出し例の照合」の節（表つき）
 *
 * JSON が無い・読めないとき（照合のスクリプトが落ちたとき）も、その旨の文を出して終了コード 0 で終わる。
 * 「形の違い」があっても workflow は失敗にしない（失敗にするかは運用を見てから決める）。
 *
 * 依存なし（Node 22+）。関数は contract-summary.test.mjs で検査する。
 */

import { existsSync, readFileSync } from 'node:fs';
import { isMainModule } from '../../scripts/check-example-versions.mjs';
import { contractSummaryLine, renderContractTable } from '../../scripts/check-examples-contract.mjs';

/** JSON を読む。無い・読めないときは null */
export function loadContractResult(file) {
  if (!file || !existsSync(file)) return null;
  try {
    const json = JSON.parse(readFileSync(file, 'utf8'));
    return json && json.summary && Array.isArray(json.examples) ? json : null;
  } catch {
    return null;
  }
}

/** PR の本文の先頭に置く段落。形の違いがあれば GitHub の警告の囲みにする */
export function renderHeadline(result) {
  if (!result) return '> [!WARNING]\n> 呼び出し例の照合（DB の要らない例）を流せませんでした。実行ログの「呼び出し例を照合する」の step を見てください。';
  const s = result.summary;
  const counts = `一致 ${s.match}・データ側の差分 ${s.data}・形の違い ${s.shape}・未確認 ${s.unverified}・照合しない ${s.skipped}`;
  if (s.shape > 0) {
    return `> [!WARNING]\n> 呼び出し例の照合（DB の要らない例）で「形の違い」が **${s.shape} 件** あります（${counts}）。下の「呼び出し例の照合」の表を見て、例を取り直すか、MCP の劣化として Issue にするかを決めてください。`;
  }
  return `呼び出し例の照合（DB の要らない例）: 形の違い **0 件**（${counts}）。`;
}

/** 「呼び出し例の照合」の節。表は形の違い・データ側の差分の例だけを先に出し、全件は折りたたむ */
export function renderSection(result) {
  const L = ['## 呼び出し例の照合', ''];
  if (!result) {
    L.push('照合のスクリプトの結果がありません（落ちたか、JSON を書けなかった）。実行ログを見てください。');
    return L.join('\n');
  }
  const who = Object.entries(result.launched ?? {})
    .map(([server, l]) => `${server} v${l.version}（${l.label}）`)
    .join(' / ');
  L.push(
    '`node scripts/check-examples-contract.mjs --db absent` の結果です。DB の無い環境なので、DB の要る例は「未確認」です（DB の要る例は Mac で流します。`scripts/reference-examples/README.md` の「公開の後に流す」）。',
  );
  L.push('');
  L.push(`- 起動: ${who || '（起動していない）'}`);
  L.push(`- ${contractSummaryLine(result.summary)}`);
  L.push('');
  const notable = result.examples.filter((r) => r.status === 'shape' || r.status === 'data');
  if (notable.length) {
    L.push(renderContractTable(notable));
    L.push('');
  } else {
    L.push('形の違いとデータ側の差分の例はありません。');
    L.push('');
  }
  L.push('<details>');
  L.push(`<summary>全件（${result.examples.length} 例）</summary>`);
  L.push('');
  L.push(renderContractTable(result.examples));
  L.push('');
  L.push('</details>');
  return L.join('\n');
}

if (isMainModule(process.argv[1], import.meta.url)) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith('--'));
  const result = loadContractResult(file);
  console.log(args.includes('--headline') ? renderHeadline(result) : renderSection(result));
}
