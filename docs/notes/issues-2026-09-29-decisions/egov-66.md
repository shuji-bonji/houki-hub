houki-hub の 2026-09-29 の決定（テーマ T4 応答の形）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **ファイル名だけで複数の添付に当たるときに、エラー（候補の `src` 付き）にするか** → 決定では答えきれないので、仕様 PR で決めます
- **Content-Disposition が無いときに `saved.law_revision_id` を `null` にするか** → `null` にします。値が無いフィールドは `null` を入れる規則です。`<law_id>.<file_type>` の名前で保存する経路では、`saved.law_revision_id` に法令 ID（`129AC0000000089`）を入れず `null` にし、`saved.file_name` の `null` と揃えます。保存先のディレクトリ名をどうするかは仕様 PR で決めます
- **`filename*` を優先するか** → 決定では答えきれないので、仕様 PR で決めます（e-Gov は `filename` だけを返す 2026-09-20 の実測を前提にします）

### 対応する版と進め方

- houki-egov-mcp **0.17.0**（段階 4。T4 + T5）。#64・#65・#66 を T4 の仕様 PR 1 本（`spec/<日付>-t4-response-shape`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #66` は実装 PR に書きます
- Content-Disposition が無い経路と `filename` / `filename*` の経路にはテストが無いので、実装 PR で受入テストを足します

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T4 応答の形」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
