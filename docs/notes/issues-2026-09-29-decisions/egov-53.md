houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **必須の文字列の引数の空文字・空白だけを、どのツールでも `INVALID_ARGUMENT` にするか** → します。必須の文字列（`search_law` の `keyword`、`get_law` の `law_name`、`resolve_abbreviation` の `abbr`、`search_fulltext` の `keyword` など）の inputSchema に `minLength: 1` を書き、空文字は `common_errors` の引数検査で一律に `INVALID_ARGUMENT` にします。空白だけの文字列は inputSchema では止められないので、各ツールの処理で同じ `INVALID_ARGUMENT`（`detail.issues[].path` に引数名、`detail.tool` にツール名）にします。表の 5 ツールの結果は次のとおりです
  - `get_law` の `law_name: ""` → `LAW_NOT_FOUND` をやめ `INVALID_ARGUMENT`
  - `resolve_abbreviation` の `abbr: ""` → `resolved: null` と `example: { keyword: "" }` の案内をやめ `INVALID_ARGUMENT`
  - `search_fulltext` の空白だけの `keyword` → `hits: []` や `fallback` の中の `INVALID_ARGUMENT` をやめ、ツールの応答として `INVALID_ARGUMENT`
  - `search_law` の `keyword: ""` → 今のまま `INVALID_ARGUMENT`（SPEC-EGOV-SEARCH-LAW-001）。`detail` の形は #57 に揃える
- **`get_attachment` の任意の `src` で、空白だけを省いたときと同じに扱うか** → T1 の規則は必須の引数を対象にしているので、任意の `src` の空白だけの扱いは仕様 PR で決めます

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#47・#48・#53・#54・#57 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #53` は実装 PR に書きます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
