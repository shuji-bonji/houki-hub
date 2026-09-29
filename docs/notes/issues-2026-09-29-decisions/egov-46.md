houki-hub の 2026-09-29 の決定（テーマ T2「見つからない」と「取得元の失敗」の code）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **法令名検索の失敗を、どのツールでも `SOURCE_*`（`retryable` 付き）にするか。`LAW_NOT_FOUND` は「検索が成功して 0 件だった」ときに限るか** → そのとおりにします。`SOURCE_*` は e-Gov との通信が失敗した（通信の失敗・タイムアウト・5xx・429）ときだけ、`LAW_NOT_FOUND` は法令名検索が成功して 0 件だったときだけです。表の 10 ツール（`get_law` / `get_toc` / `get_law_range` / `get_law_revisions` / `get_related_laws` / `get_article_references` / `list_attachments` / `get_attachment` / `get_law_file` / `verify_citations`）で同じ規則にします。接続できないとき（`err.cause.code` が `ENOTFOUND` / `ECONNREFUSED` / `EAI_AGAIN`）は `SOURCE_UNAVAILABLE` です（#69）
- **`verify_citations` で、e-Gov と関係の無い例外を `SOURCE_*` と別の code にするか** → T2 の規則では `SOURCE_*` は取得元との通信の失敗に限るので、e-Gov と関係の無い処理中の例外は `SOURCE_*` にしません。`common_errors` の語彙では `INTERNAL_ERROR`（処理中の想定外の例外）が当たります。`INTERNAL_ERROR` の `retryable` は #56 で `false` に直します。description・JSDoc・README の「タイムアウト・接続不能・5xx」は、429 を含めて実際の code（`SOURCE_TIMEOUT` / `SOURCE_UNAVAILABLE` / `SOURCE_API_ERROR` / `SOURCE_RATE_LIMITED`）に合わせて直します。法令名の検索が返した 4xx を `SOURCE_API_ERROR` のままにするかは仕様 PR で決めます
- **`verify_citations` で、1 件の失敗のときにそれまでに判定できた件を返すか** → 決定では答えきれないので、仕様 PR で決めます

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#46・#49・#69 を T2 の仕様 PR 1 本（`spec/<日付>-t2-error-codes`、`specs/changes/` だけ）にまとめ、`specs/current/common_errors/spec.md` と各ツールの spec.md を先に直してから、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #46` は実装 PR に書きます
- T1 も `common_errors` を触るので、T1 の仕様 PR と同じ版に入れます
- code の意味を変えるので、CHANGELOG に「互換性」の節を書き、同じ日に houki-research-skill の `docs/ERROR-CODES.md` と `docs/ERROR-HANDLING.md` を直します（T2 の互換の扱い）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T2 code」「T2 の互換の扱い」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
