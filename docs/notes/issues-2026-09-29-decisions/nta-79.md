houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **違反ごとに `detail.issues` の要素を分けるか（inputSchema に無い引数も 1 つずつ分けるか）** → 分けます。`detail.issues` は違反 1 件ごとに `{ path, message }` の要素にし、`path` に引数名を入れます。`{ keyword: 1, limit: "x" }` は `[{ path: "keyword", … }, { path: "limit", … }]`、必須の引数が 2 つ無いときも 1 つずつ（`path` は `category`、`id`）、inputSchema に無い引数が 2 つ以上あるときも `"a, b"` にまとめず 1 つずつ分けます
- **型の違反と inputSchema に無い引数が同時にあるとき、両方を返すか** → 返します。`{ keyword: "a", limit: "x", zz: 1 }` は `limit` の型の違反と `zz` の両方が `detail.issues` に入ります
- **`message` に残る検査の部品の文（`data/limit must be number` など）をそのまま返すか、整えるか** → 整えます。`message` は違反 1 件の日本語の文にし、`data/limit must be number` のような部品の文は残しません。`detail.tool` にツール名を付ける今の形は変えません

houki-egov-mcp#57 で同じ形（`tool`・`path`・違反ごとの要素・日本語の `message`）に揃えるので、houki-research-skill の `docs/ERROR-HANDLING.md` は 1 通りの説明で済みます。

### 対応する版と進め方

- houki-nta-mcp **0.22.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#66・#67・#68・#69・#79 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、`specs/current/common_errors/spec.md` に「違反が 2 つ以上のとき」の仕様 ID を足してから、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #79` は実装 PR に書きます
- T2（#64・#65）も `common_errors` を触るので、同じ版に入れます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
