houki-hub の 2026-09-29 の決定（テーマ T2「見つからない」と「取得元の失敗」の code）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **404（と 410）を、番号の誤りとして再試行できないエラーにするか** → します。`nta_get_qa`（存在しない `topic` / `category` / `id` の組）と `nta_get_tax_answer`（存在しない `no`）で、国税庁サイトの 404 は `DOC_NOT_FOUND`、`retryable: false` にします。`SOURCE_API_ERROR` は国税庁サイトとの通信が失敗した（接続できない・タイムアウト・5xx・429）ときだけです。410 も 404 と同じ扱いにするかは仕様 PR で決めます
- **そのときの `next_actions`** → 再試行の案内をやめ、番号を探すツール（`nta_get_qa` なら `nta_search_qa`、`nta_get_tax_answer` なら `nta_search_tax_answer`）を入れます。`example` の引数は仕様 PR で決めます

### 対応する版と進め方

- houki-nta-mcp **0.22.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#64・#65 を T2 の仕様 PR 1 本（`spec/<日付>-t2-error-codes`、`specs/changes/` だけ）にまとめ、`nta_get_qa` / `nta_get_tax_answer` の spec.md にこの応答の仕様 ID を足してから、実装 PR（404 を差し替えた受入テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #65` は実装 PR に書きます
- 2 ツールで `SOURCE_API_ERROR` だった場面が `DOC_NOT_FOUND` に変わるので、CHANGELOG に「互換性」の節で書き、同じ日に houki-research-skill の `docs/ERROR-CODES.md` を直します（T2 の互換の扱い）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T2 code」「T2 の互換の扱い」「houki-nta-mcp #64・#65 の code は置き換える」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章・8 章
