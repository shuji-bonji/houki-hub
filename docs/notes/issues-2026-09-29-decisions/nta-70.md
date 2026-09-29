houki-hub の 2026-09-29 の決定（テーマ T5 文書と実装の食い違い）に従います。行ごとに「文書を直す」か「動きを直す」かを振り分け、動きを変える必要が無い行（`hint` や説明文の文言）は文書を直し（仕様 PR 不要、実装 PR 1 本）、応答の形を変える行だけ仕様 PR に入れます。

### 決定の要点と、この Issue の「決めること」への答え

- **各項目を直すか、今の文面を意図とするか**
  - `nta_get_tax_answer` の未対応の番号帯のエラー文（「v0.2.x では未対応」「Phase 2 で対応予定」）: 文言を直します。版名と予定を書かず、対応している番号帯だけを書きます。実装 PR で直します
  - `nta_search_tsutatsu` の `TSUTATSU_NOT_FOUND`（SPEC-NTA-SEARCH-TSUTATSU-003）の `hint` / `next_actions` の `--bulk-download` と、説明文・`freshness.warning` の `--bulk-download-all`: 文言を実際の動きに合わせます。1 つの通達が無いときと 4 種すべてが無いときで案内するフラグが違ってよいかは、実装 PR で確かめて揃えます
  - `resolve_abbreviation` の `hint` が `${source_mcp_hint}-mcp` で `houki-court-mcp` などまだ無い MCP 名を組み立てる件: 存在する MCP（houki-egov-mcp / houki-nta-mcp）だけを案内する文言に直します（実装 PR）。`nta_get_tsutatsu` の `OUT_OF_SCOPE` と同じ `next_actions` を付ける件は応答の形を変えるので、仕様 PR に入れます
  - `resolve_abbreviation` の tools/list の `abbr` の例が `電帳法`（houki-egov の管轄）: 例を houki-nta の管轄の略称（`消基通` など）に直します（実装 PR）
  - `nta_search_tax_answer` の `next_actions` で `nta_get_tax_answer` を案内しない件: `next_actions` を足すので仕様 PR に入れます（フィールドを足すだけで、消しません）
  - `nta_search_kaisei_tsutatsu` の SPEC-NTA-SEARCH-KAISEI-TSUTATSU-002 の `hint` が空の案内文を連結して句点で終わる件: 不具合として文言を直します（実装 PR）
  - `nta_get_jimu_unei` の json の `legal_status.note` が事務運営指針を名指ししない件: markdown の注と同じ「通達・事務運営指針は…」に直します（実装 PR）
- **`nta_get_tax_answer` の `8xxx` 帯に対応する予定があるか** → 決定では答えきれないので、仕様 PR で決めます（対応しないなら、エラー文にその旨を書くだけで済みます）

### 対応する版と進め方

- houki-nta-mcp **0.23.0**（段階 4。T4 + T5）。応答の形を変える行（`resolve_abbreviation` の `next_actions`、`nta_search_tax_answer` の `next_actions`）を T5 の仕様 PR（`spec/<日付>-t5-docs-mismatch`、`specs/changes/` だけ）に入れ、文言だけの行は実装 PR に直接入れます。`hint` / `next_actions` を仕様 ID に含めるものは受入テストを足します。`Closes #70` は実装 PR に書きます
- `--bulk-download*` のフラグの案内は、nta #75 で置く `cli_bulk_download` の spec.md と同じ名前を使います

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T5 文書と実装の食い違い」「T4 応答の形」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 0」「段階 1」「段階 4」・7 章
