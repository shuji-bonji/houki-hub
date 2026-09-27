時点を指定する引数 `at` は、どのツールの説明にも「YYYY-MM-DD 形式」と書いてありますが、サーバーは形を確かめずに e-Gov に渡します。形の違う値や、法令の成立より前の日付を渡したときの結果がツールによって違い、何が悪かったかが呼び出し側に伝わりません。

### いまの状態（v0.15.1）

inputSchema の `at` は `type: "string"` だけで、`pattern` や `format` がありません。

| ツール | 形の違う `at` を渡したとき |
|---|---|
| `get_law` | e-Gov のエラーがそのまま `SOURCE_API_ERROR` になりうる |
| `get_article_references` | e-Gov の応答次第 |
| `list_attachments` / `get_attachment` | e-Gov の 4xx が `SOURCE_API_ERROR`（`retryable: false`）になる |
| `get_law_file` | `save` なしでは e-Gov に問い合わせないので、成功の応答に `asof=<その値>` 付きの URL が入る。開いたときに初めて失敗が分かる |
| `verify_citations` | 本文の取得で e-Gov が 400 か 404 を返すと、原因が `at` でも、その件を `LAW_NOT_FOUND`（`reason` は「e-Gov に law_id … の法令がありません」）にする。また `at` は法令名の検索と略称辞書の引き当てには使わない |

法令の成立より前の日付（その時点に法令がまだ無い）も、形の誤りと同じく上のどれかになります。

### 決めること

- `at` の形（`YYYY-MM-DD` で、実在する日付か）をサーバーで確かめて `INVALID_ARGUMENT` にするか。inputSchema に `pattern` を書けば、common_errors の引数検査で一律に止められる
- 形は正しいが、その時点に法令がまだ無いときに何を返すか（`LAW_NOT_FOUND` と別の code か、`reason` で言い分けるか）
- `verify_citations` で `at` を法令名の検索にも使うか

### 完了条件

- 決めた規則が `at` を持つツールの `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_law 20、get_article_references 11、list_attachments 2、get_attachment 5、get_law_file 4、verify_citations 2（初版起こし、ブランチ `spec-init/egov-initial`）
