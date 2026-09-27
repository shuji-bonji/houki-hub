数値の引数に、上限・整数・0 以下の扱いが約束されていません。inputSchema の型は `number` だけで、説明に書いた上限をかけていない引数や、説明に無い形を受け付ける引数があります。`paragraph` の同じ問題は #48 で扱います。

### いまの状態（v0.15.1）

| ツール | 引数 | 起きること |
|---|---|---|
| `search_law` | `limit` | 説明は「最大: 50」だが、値をそのまま e-Gov に渡す。`keyword: "法", limit: 100` で 100 件返る。0・負の数・小数の扱いも決まっていない |
| `get_law_revisions` | `latest` | 0 や負の数なら全件を返し、`2.5` は切り捨てた 2 件になる。エラーにしない |
| `get_toc` | `depth` | `depth: 1.5` は `depth: 2` と同じ結果になる |
| `get_law` | `article` | `"534:535"` や `"五百三十四:五百三十五"`（削除された条の範囲表記）を受け付け、本文「削除」の条を返す。`get_law_range` の `from_article` の読み取りを共有しているためで、description には書いていない |

`search_fulltext` の `limit` は 1〜30 に丸めます（既定 10）。

### 決めること

- `limit`・`latest`・`depth` を inputSchema で整数と範囲（`type: "integer"`、`minimum`・`maximum`）に限り、common_errors の引数検査で `INVALID_ARGUMENT` にするか。それとも各ツールで丸めるか（`search_fulltext` と揃えるか）
- `get_law` で範囲表記の `article` を受け付ける入力として約束するか

### 完了条件

- 決めた規則が 4 ツールの `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— search_law 2、get_law_revisions 3、get_toc 8、get_law 16（初版起こし）
