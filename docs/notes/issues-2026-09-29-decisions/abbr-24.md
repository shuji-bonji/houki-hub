houki-hub の 2026-09-29 の決定（テーマ T3 全角・半角・ダッシュ類の正規化）に従います。T3 の規則は「揃える場所を houki-abbreviations の関数に一本化する」で、この Issue の 3 つの「決めること」の中身までは決めていません。3 つとも T3 の仕様 PR で決めます。

### 決定の要点と、この Issue の「決めること」への答え

- **`normalizeLawNum` で、年と番号の位置（`〜年`・`第〜号`）だけを変換するか** → 仕様 PR で決めます。`normalizeLawNum` は houki-egov-mcp・houki-nta-mcp が `lookupByLawNum` を通して使う入口なので、変換後の文字列を人に見せる用途があるかを含めて決めます
- **桁数に上限を設けるか（超えたら変換しない、または `kanjiToNumber` は `null`）** → 仕様 PR で決めます
- **`levenshtein` をコードポイント単位で数えるか** → 仕様 PR で決めます（`findSimilar` の `maxDistance` の判定に効くので、#20 の短い query の扱いと合わせて見ます）

いずれも v0.6.0 の辞書には当たる形が無く、今の結果には影響しません。決めた結果は表の各入力（`千葉県条例第一号`、`三重県`、20 桁の番号、`'𠮷'` と `'吉'`）の値として仕様に書き、受入テストにします。

### 対応する版と進め方

- houki-abbreviations **0.7.0**（段階 3）。#21・#19・#24 を T3 の仕様 PR 1 本（`spec/<日付>-normalize`、`specs/changes/` だけ。`normalize_law_num` / `kanji_to_number` / `levenshtein` の「入力」の節）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #24` は実装 PR に書きます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T3 正規化」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 3」・7 章
