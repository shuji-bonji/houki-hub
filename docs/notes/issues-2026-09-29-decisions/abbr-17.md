houki-hub の 2026-09-29 の決定（テーマ T5 文書と実装の食い違い）に従います。行ごとに「文書を直す」か「動きを直す」かを振り分け、動きを変える必要が無い行は文書を直し（仕様 PR 不要、実装 PR 1 本）、動きを変える行だけ仕様 PR に入れます。

### 決定の要点と、この Issue の「決めること」への答え

- **行ごとに、文書を実際に合わせるか、実装を文書に合わせるか**
  - `resolveAbbreviation('消　法', { normalize: true })` が `消費税法` にならない行: 動きを直す側です。`normalize: true` で名前の途中の空白（全角空白を含む）を取り除く扱いを、T3 の仕様 PR（`spec/<日付>-normalize`、#21・#19・#24）に含めます
  - `findSimilar('労働基準法施行例')` の例が `労基法施行令`（辞書に無い）: 文書を直します。実際の結果 `労基則`（`労働基準法施行規則`、distance 2）に合わせ、README・JSDoc・`docs/v0.4.0-roadmap.md` を直します
  - `suggestCorrection('労働基準法施行例')` の例: 文書を直します。`['労働基準法施行規則']` にします
  - README の `listByDomain('tax')` が 26 件: 文書を直します（35 件。ただし #16 の決め方によっては実数を書かない形にします）
  - README の「CI で `npm run validate` を呼ぶ」: `ci.yml` に足します。動き（公開関数の結果）を変えないので、実装 PR で直します。`npm run validate` は build の後に置きます
  - CONTRIBUTING.md と `src/types.ts` の「実エントリは `constitution`〜`rule` だけ」: 文書を直します（`kihon-tsutatsu` 8 件、`kobetsu-tsutatsu` 1 件がある）
  - `SOURCE_MCP_HINTS` の `houki-jaish` の説明: 文書を直します（次の項目）
  - `findSimilar` / `suggestCorrection` の緩いテスト（距離 2 以下、空配列でも通る）: 実装 PR で、例のとおりの値を確かめる受入テストに書き換えます
- **`houki-jaish` がどちらの機関を指すか** → 説明の文を jaish.gr.jp の運営元（中央労働災害防止協会 安全衛生情報センター）に合わせて直します。決定では機関名までは決めていないので、実装 PR で運営元を確かめてから書きます

### 対応する版と進め方

- houki-abbreviations **0.7.0**（段階 3）。段階 3 の最後にまとめて文書を直します。仕様 PR が要るのは `normalize: true` の空白の行だけで、T3 の仕様 PR に含めます。ほかの行は実装 PR（`test/<日付>-0.7.0` にまとめてよい）に直接入れます。`Closes #17` は実装 PR に書きます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T5 文書と実装の食い違い」「T3 正規化」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 3」・7 章
