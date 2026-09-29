houki-hub の 2026-09-29 の決定（テーマ T5 文書と実装の食い違い）に従います。行ごとに「文書を直す」か「動きを直す」かを振り分け、動きを変える必要が無い行は文書を直し（仕様 PR 不要、実装 PR 1 本）、動きを変える行だけ仕様 PR に入れます。

### 決定の要点と、この Issue の「決めること」への答え

- **`INTERNAL_ERROR` の `retryable` と `hint`** → 動きを直します。`retryable: false` にし、`next_actions` の `retry_later` を外して、`hint` の「再現手順を添えて GitHub issue でご報告ください」と合わせます。README の表はそのままです。仕様 PR に入れます
- **`UNKNOWN_TOOL` の文面と `retryable`** → `retryable: false` を付けます（T4 の「フィールドを消さない、応答の形を場面で変えない」に合わせ、README の表のとおり）。`error` を日本語にするかは仕様 PR で決めます
- **`DOCS:` 欄と `see_also` を GitHub の URL にするか、外すか** → CLI の使い方の `DOCS:` 欄は文書の行なので実装 PR で直します（URL にするか外すかはそこで決める）。`explain_law_type` の `see_also` は応答の値なので仕様 PR に入れ、URL にするか外すかをそこで決めます
- **`--bulk-download-incremental` と `-v` を使い方に載せるか** → 載せます。受け付ける動きは変えずに文書を合わせる側です。実装 PR で直します
- **`depth` を「上から N 階層」と説明し直すか、編・章・節に固定した意味にするか** → 説明し直します。最上位の階層から数える今の動きを変えず、tool description を「上から N 階層」に直します。実装 PR で直します
- README の「9 ツールのうち 8 つ」→「14 ツールのうち、ローカル DB が要るのは `search_fulltext` の 1 つ」に直します。文書の行です

### 対応する版と進め方

- houki-egov-mcp **0.17.0**（段階 4。T4 + T5）。動きを変える行（`INTERNAL_ERROR`、`UNKNOWN_TOOL`、`see_also`）を T5 の仕様 PR（`spec/<日付>-t5-docs-mismatch`、`specs/changes/` だけ。`specs/current/common_errors/spec.md` と `explain_law_type/spec.md`）に入れ、文書だけの行は実装 PR に直接入れます。`Closes #56` は実装 PR に書きます
- `INTERNAL_ERROR` の `retryable` を変えるので、houki-research-skill の `docs/ERROR-CODES.md` と `docs/ERROR-HANDLING.md` を同じ日に直します（T2 の互換の扱いと同じ）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T5 文書と実装の食い違い」「T4 応答の形」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
