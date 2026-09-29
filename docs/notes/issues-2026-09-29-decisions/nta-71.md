houki-hub の 2026-09-29 の決定（テーマ T4 応答の形）に従います。規則は「値が無いフィールドは `null` を入れ、フィールドを消さない。応答の形を場面で変えない。フィールドを消す変更は入れない（足すか `null` にするだけ）」です。

### 決定の要点と、この Issue の「決めること」への答え

- **項目ごとに、揃えるか今の形を意図とするか**
  - `nta_search_tsutatsu` の `count`: 0 件のときも付けます（`count: 0`）。場面でフィールドの有無を変えません
  - `nta_get_tsutatsu` の `available_clauses` の件数（DB の経路は最大 50 件、国税庁サイトの経路は全件）: 決定では答えきれないので、仕様 PR で決めます
  - `nta_get_jimu_unei` の markdown の「取得元」の行: 付けます。DB だけを引くツールでも「取得元: ローカル DB」のように書き、`nta_get_qa` と同じ行を持たせます
  - `nta_inspect_pdf_meta` の `save: true` で 0 件のとき: `saved: []` を付けます（フィールドごと無い形をやめる）
  - `nta_inspect_pdf_meta` の `index_status` / `orphaned_at` / `notice`: 付けます。`nta_get_*` と同じ形で、索引にある文書では `orphaned_at` と `notice` を `null` にします
- **`nta_search_tsutatsu` と文書系検索の応答の名前（`hits` / `results`、`message` / `hint`）を揃えるか。揃えるなら互換の扱い** → 0.23.0 では付け替えません。計画書 5.1 の「フィールドを消す変更は入れない」により、`hits` を `results` に付け替える（`hits` を消す）変更はこの版に入れません。今の名前を意図として仕様に書くか、別の版で揃えるか（揃えるなら CHANGELOG の「互換性」の節と minor での公開）は仕様 PR で決めます
- `meta`（`at` と `retrieved_at`）を常に付ける規則について → houki-nta-mcp の応答には `meta` が無いので、この Issue の対象ではありません。nta に `meta` を足すかは仕様 PR で決めます

### 対応する版と進め方

- houki-nta-mcp **0.23.0**（段階 4。T4 + T5）。#71・#82 を T4 の仕様 PR 1 本（`spec/<日付>-t4-response-shape`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #71` は実装 PR に書きます。0.22.0（T1 + T2 + T3）の後です
- houki-hub `scripts/reference-examples/houki-nta/ja/*.md` と houki-research-skill の例は `null` を前提にした文に直します（計画書 5.1）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T4 応答の形」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・5.1・7 章
