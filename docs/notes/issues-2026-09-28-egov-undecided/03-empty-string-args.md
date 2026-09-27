必須の文字列の引数に空文字（または空白だけ）を渡したときの応答が、ツールごとに違います。inputSchema の検査は空文字を通すので、各ツールの処理がそれぞれ別の code を返しています。

### いまの状態（v0.15.1）

| ツール | 入力 | 結果 |
|---|---|---|
| `search_law` | `keyword: ""` | `INVALID_ARGUMENT`（SPEC-EGOV-SEARCH-LAW-001） |
| `get_law` | `law_name: ""` | `LAW_NOT_FOUND` |
| `resolve_abbreviation` | `abbr: ""` | エラーにせず `resolved: null` と、`example: { keyword: "" }` の `search_law` の案内。この案内どおりに呼ぶと `search_law` は `INVALID_ARGUMENT` を返す |
| `search_fulltext` | `keyword: ""`（空白だけを含む） | DB に条があれば `source: "bulk"`・`hits: []`。DB が無ければ切り替え先の `search_law` の `INVALID_ARGUMENT` が `fallback` の中に入り、ツールの応答は通常の `source: "api-fallback"` |
| `get_attachment` | `src: ""` / `src: " "` | `""` は省いたときと同じく zip を対象にする。`" "` は前後の空白を除いた空文字を一覧と照らし、`ATTACHMENT_NOT_FOUND`（`error` は「添付ファイルが見つかりません: 」） |

### 決めること

- 必須の文字列の引数の空文字・空白だけを、どのツールでも `INVALID_ARGUMENT` にするか。inputSchema に `minLength: 1` や `pattern` を書けば、common_errors の引数検査で一律に止められる（空白だけは各ツールの処理で見る必要がある）
- `get_attachment` の任意の `src` で、空白だけを省いたときと同じに扱うか

### 完了条件

- 決めた規則が 5 ツール（と common_errors）の `specs/current/<dir>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_law 14、resolve_abbreviation 4、search_fulltext 1、get_attachment 2（初版起こし）
