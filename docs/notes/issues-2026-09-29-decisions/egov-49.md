houki-hub の 2026-09-29 の決定（テーマ T2「見つからない」と「取得元の失敗」の code）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **この場面の code を何にするか。別の code にするなら family 共通の語彙にも足すか** → `INVALID_ARGUMENT` をやめ、`FILE_TOO_LARGE` にします。pdf-reader-mcp に既にある code なので同じ名前を使い、houki-research-skill の `docs/ERROR-CODES.md`（family の語彙）に足します。`retryable: false` で、`hint`（「保存せず url をそのまま使ってください」）と `detail.url` は今のままです
- **取得の前（Content-Length）か取得の途中で打ち切るか** → 決定では答えきれないので、仕様 PR で決めます
- **上限の 50 MB（`FILES_CONFIG.maxBytes`）を利用者が変えられるようにするか** → 決定では答えきれないので、仕様 PR で決めます

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#46・#49・#69 を T2 の仕様 PR 1 本（`spec/<日付>-t2-error-codes`、`specs/changes/` だけ）にまとめ、`specs/current/common_errors/spec.md` の code の表と `get_attachment` / `get_law_file` の spec.md を直してから、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #49` は実装 PR に書きます
- code を置き換えるので、CHANGELOG に「互換性」の節（`INVALID_ARGUMENT` → `FILE_TOO_LARGE`、この場面だけ）を書き、同じ日に houki-research-skill の `docs/ERROR-CODES.md` を直します（T2 の互換の扱い）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T2 code」「T2 の互換の扱い」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
