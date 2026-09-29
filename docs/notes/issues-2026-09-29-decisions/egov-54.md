houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **`limit`・`latest`・`depth` を inputSchema で整数と範囲に限り、`common_errors` の引数検査で `INVALID_ARGUMENT` にするか。それとも各ツールで丸めるか** → inputSchema で止め、丸めません。`search_law` の `limit`（`type: "integer"`、`minimum: 1`、`maximum: 50`）、`get_law_revisions` の `latest`（`type: "integer"`、`minimum: 1`。上限は仕様 PR で決める）、`get_toc` の `depth`（`type: "integer"`、`minimum: 1`。上限は仕様 PR で決める）を書き、0・負の数・小数・上限超えは `INVALID_ARGUMENT`（`detail.issues[].path` に引数名、`detail.tool` にツール名）にします。`limit: 100` で 100 件返る動き、`latest: 0` で全件返る動き、`2.5` の切り捨ては無くなります
- **`search_fulltext` の `limit` の 1〜30 への丸めと揃えるか** → `search_fulltext` の丸めは既存の約束で、T1 の規則どおり `INVALID_ARGUMENT` に変えるかは未決です（既存の仕様 ID の MODIFIED になるため。houki-hub `docs/DECISIONS.md` の「未決」）。T1 の仕様 PR で決めます
- **`get_law` で範囲表記の `article`（`"534:535"`）を受け付ける入力として約束するか** → 決定では答えきれないので、仕様 PR で決めます

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#47・#48・#53・#54・#57 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #54` は実装 PR に書きます
- inputSchema を厳しくする前に、houki-hub `scripts/reference-examples/` と houki-research-skill の `examples/` `workflows/` `SKILL.md` の呼び出し例を grep し、`limit: 100` のような例があれば先に直します（計画書 5.1）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」と「未決」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・5.1・7 章・8 章
