houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **`paragraph` を inputSchema で 1 以上の整数に限り、`common_errors` の引数検査で `INVALID_ARGUMENT` にするか** → します。`get_law` / `verify_citations` / `get_article_references` の inputSchema の `paragraph` を `type: "integer"`、`minimum: 1` にし、0・負の数・小数は `INVALID_ARGUMENT`（`detail.issues[].path` は `paragraph`、`detail.tool` にツール名）にします。`ARTICLE_NOT_FOUND` は「法令はあるが、求めた項が無い」ときだけになります
- **それとも、`item` と揃えて `INVALID_ARTICLE_NUM` にするか** → 揃えません。`item` は数値でも文字列（`"8の2"` など）でも受け付ける（SPEC-EGOV-GET-LAW-002）ので inputSchema では止められず、読めない形を `INVALID_ARTICLE_NUM` にする今の扱いのままです。`paragraph` は整数しか受け付けないので、T1 の規則どおり inputSchema で止めます

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#47・#48・#53・#54・#57 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #48` は実装 PR に書きます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
