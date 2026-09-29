houki-hub の 2026-09-29 の決定（テーマ T2「見つからない」と「取得元の失敗」の code）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **`err.cause.code`（`ENOTFOUND`・`ECONNREFUSED`・`EAI_AGAIN` など）も見て `SOURCE_UNAVAILABLE` にするか** → します。`src/services/law-service.ts` のエラーを code に変える処理で、`err.message` だけでなく `err.cause.code` を見て、`ENOTFOUND` / `ECONNREFUSED` / `EAI_AGAIN` は `SOURCE_UNAVAILABLE` にします。Node 22 の `fetch` が投げる `TypeError('fetch failed', { cause })` の形を差し替えた受入テストを書きます。e-Gov を呼ぶ 11 ツールに共通です
- **接続できないときも取り直すか** → 決定では答えきれないので、仕様 PR で決めます

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#46・#49・#69 を T2 の仕様 PR 1 本（`spec/<日付>-t2-error-codes`、`specs/changes/` だけ）にまとめ、`specs/current/common_errors/spec.md` を直してから実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #69` は実装 PR に書きます
- この変更で新しく `SOURCE_UNAVAILABLE` が返るようになるので、houki-research-skill の `docs/ERROR-HANDLING.md` の分岐が実際に効くことを段階 6 で確かめます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T2 code」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
