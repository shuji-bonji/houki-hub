houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **`tool` を付けて houki-nta-mcp と揃えるか** → 付けます。inputSchema の検査の `INVALID_ARGUMENT` の `detail` に、呼んだツール名の `tool` を付けます
- **`path` に引数名を入れ、違反 1 件ごとに `detail.issues` の要素を分けるか** → そうします。`detail.issues` は違反 1 件ごとに `{ path, message }` の要素に分け、`path` には引数名を入れます。必須の引数が無いときも `path` は空文字でなくその引数名（`name` など）です。inputSchema に無い引数が 2 つ以上あるときも `typo, foo` のようにまとめず、1 つずつ分けます（houki-nta-mcp #79 と同じ形）
- **`message` を日本語に揃えるか** → 揃えます。型・enum の違反も日本語にします（`must be string` などの検査の部品の文はそのまま返しません）
- **返さない code（`ABBREVIATION_NOT_FOUND`、`EGOV_API_ERROR`・`EGOV_TIMEOUT`・`EGOV_RATE_LIMITED`）を語彙から外すか。外すなら houki-research-skill の error contract も直すか** → 決定では答えきれないので、仕様 PR で決めます。外す場合は T2 の互換の扱い（CHANGELOG の「互換性」の節、同じ日に houki-research-skill の `docs/ERROR-CODES.md` を直す、minor で出す）に従います

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#47・#48・#53・#54・#57 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、`specs/current/common_errors/spec.md` を直してから実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #57` は実装 PR に書きます
- T2（#46・#49・#69）も `common_errors` を触るので、同じ版に入れます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」「T2 の互換の扱い」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
