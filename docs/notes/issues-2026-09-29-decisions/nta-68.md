houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **丸める動きを意図として認めるか、`INVALID_ARGUMENT` にするか、丸めたことを応答（`search_notes` など）に示すか** → `INVALID_ARGUMENT` にし、丸めません。`nta_search_tsutatsu` / `nta_search_qa` / `nta_search_tax_answer` / `nta_search_bunshokaitou` / `nta_search_jimu_unei` / `nta_search_kaisei_tsutatsu` の 6 ツールで、1 未満・50 超え・小数・数値でない値は `common_errors` の引数検査で `INVALID_ARGUMENT`（`detail.issues[].path` は `limit`、`detail.tool` にツール名、`message` は日本語）になります。`nta_search_qa` の「数値であることも確かめない」も同じ検査で止まります
- **inputSchema に `minimum` / `maximum` を書くか** → 書きます。6 ツールの `limit` を `type: "integer"`、`minimum: 1`、`maximum: 50` にし、tools/list を読む LLM にも伝わるようにします。既定の 10 件（または各ツールの既定）は変えません

### 対応する版と進め方

- houki-nta-mcp **0.22.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#66・#67・#68・#69・#79 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #68` は実装 PR に書きます
- inputSchema を厳しくする前に、houki-hub `scripts/reference-examples/houki-nta/ja/*.md` と houki-research-skill の `examples/` `workflows/` `SKILL.md` に `limit: 100` のような例が無いことを grep で確かめ、あれば先に直します（計画書 5.1）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・5.1・7 章
