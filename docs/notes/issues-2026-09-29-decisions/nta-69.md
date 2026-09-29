houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **空（と、語が 1 つも残らない入力）を `INVALID_ARGUMENT` にするか、`hint` で「探していない」ことを区別するか** → `INVALID_ARGUMENT` にします。7 ツール（`nta_search_qa` / `nta_search_tax_answer` / `nta_search_bunshokaitou` / `nta_search_jimu_unei` / `nta_search_kaisei_tsutatsu` / `resolve_abbreviation` / `nta_search_tsutatsu`）の必須の文字列（`keyword`、`abbr`）の inputSchema に `minLength: 1` を書き、空文字は `common_errors` の引数検査で一律に止めます。空白だけの文字列は inputSchema では止められないので、各ツールの処理で同じ `INVALID_ARGUMENT` にします。「探していないのに 0 件と読める」応答（`results: []` と「該当なし」の `hint`、`resolved: null`）は無くなります。FTS5 の記号だけ・1 文字の語だけのように「語が 1 つも残らない」入力は T1 の規則に書いていないので仕様 PR で決めますが、T1 の理由（探していないのに 0 件を無くす）に沿えば同じ `INVALID_ARGUMENT` です
- **`nta_search_tsutatsu` の `INVALID_ARGUMENT` の形を、inputSchema 違反のときと揃えるか** → 揃えます。SPEC-NTA-SEARCH-TSUTATSU-002 の応答にも、001 と同じ `detail.issues`（`[{ path: "keyword", message: "<日本語>" }]`）・`detail.tool`・`hint`・`next_actions` を付けます

### 対応する版と進め方

- houki-nta-mcp **0.22.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#66・#67・#68・#69・#79 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #69` は実装 PR に書きます。SPEC-NTA-SEARCH-QA-007 / SPEC-NTA-RESOLVE-ABBREVIATION-004 など、空の入力を「該当なし」と約束している既存の仕様 ID は MODIFIED になります

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
