houki-hub の 2026-09-29 の決定（テーマ T4 応答の形）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **検索の `results` に `issuedAt` を全種別で付けるか、今のまま種別で分けるか** → 全種別で付けます。`nta_search_qa` と `nta_search_tax_answer` の `results[]` にも `issuedAt` を付けます
- **値が無いときに `null` を入れるか、フィールドを付けないか（検索と取得で揃えるか）** → `null` を入れ、検索と取得で揃えます。`nta_search_qa` の `results[].issuedAt` は日付を持たないので `null`、`nta_get_*` の json の `document.issuedAt` も値が無ければフィールドを消さず `null` にします
- **タックスアンサーの日付（法令時点）を `issuedAt` として出すか。出すなら「発出日」とは意味が違うことをどう示すか** → `issuedAt` としては出さず（`nta_search_tax_answer` の `results[].issuedAt` は `null`）、「法令時点」であることをフィールド名で示す別のフィールド（例: `basisDate`。`nta_get_qa` の `qa.basisDate` と同じ名前）を `results[]` に付けます。フィールド名は仕様 PR で確定します（`nta_get_tax_answer` の取得側の `effectiveDate` と揃えるか、`basisDate` にするか）

### 対応する版と進め方

- houki-nta-mcp **0.23.0**（段階 4。T4 + T5）。#71・#82 を T4 の仕様 PR 1 本（`spec/<日付>-t4-response-shape`、`specs/changes/` だけ）にまとめ、`specs/current/search_rules/spec.md`（差分 `20260927-search-hit-responses` の取り込み後）に書いてから、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #82` は実装 PR に書きます
- フィールドを足すか `null` にするだけで、消す変更は入れません（計画書 5.1）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T4 応答の形」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・5.1・7 章
