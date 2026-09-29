houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **列挙で検査するか、今のように受け付けて `available_taxonomies` で正しい値を返す形を意図とするか** → T1 の規則は数値（`type: "integer"`、`minimum` / `maximum`）・日付（`pattern`）・必須の文字列（`minLength: 1`）を対象にしていて、`taxonomy` を列挙にするかは決めていません。仕様 PR で決めます。DB に入る税目フォルダは国税庁サイトの構成で増えるので、`nta_search_bunshokaitou` / `nta_search_jimu_unei` / `nta_search_kaisei_tsutatsu` の 3 ツールで「受け付けて、DB に無い値のときは `available_taxonomies` で正しい値を返す」今の動きを意図として仕様に書く（「実装の変更: 不要」の仕様 PR）案を、houki-hub 側で候補に挙げています（計画書 5.4）。その場合は `nta_search_jimu_unei` の inputSchema にも `available_taxonomies` の応答が書かれ、3 ツールで同じ仕様 ID の形になります
- **意図とする場合、ツールの説明文にその扱いを書くか** → 書きます（T5 の規則: 動きを変えない行は文書を直す）。`nta_search_kaisei_tsutatsu` の説明の 4 つの値は例として残し、「DB に無い値のときは `available_taxonomies` で正しい値を返す」を 3 ツールの説明に足します

### 対応する版と進め方

- houki-nta-mcp **0.22.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#66・#67・#68・#69・#79 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめます。この Issue が「今の動きを意図とする」になれば、その部分は「実装の変更: 不要」で、実装 PR では受入テストと説明文だけを足します。`Closes #67` は実装 PR に書きます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」「T5 文書と実装の食い違い」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・5.4・7 章
