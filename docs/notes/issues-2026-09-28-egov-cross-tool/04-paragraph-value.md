項番号の引数 `paragraph` に 0・負の数・小数を渡すと、引数の検査を通り、「その項が無い」として `ARTICLE_NOT_FOUND` になります。同じ値を号番号の `item` に渡したときは `INVALID_ARTICLE_NUM` になるので、項と号で扱いが揃っていません。

### いまの状態（v0.15.1）

inputSchema の `paragraph` は `type: "number"` だけで、`minimum` も整数の指定もありません。

| ツール | `paragraph: 0` / `-1` / `1.5` | `item` に同じ値 |
|---|---|---|
| `get_law` | `ARTICLE_NOT_FOUND`（項が見つからない） | `INVALID_ARTICLE_NUM` |
| `verify_citations` | その件が `ARTICLE_NOT_FOUND`（例: 「第1.5項はありません」） | その件が `INVALID_ARTICLE_NUM` |
| `get_article_references` | `ARTICLE_NOT_FOUND`（「項が見つかりません: 第N条第1.5項」） | —（`item` は無い） |

`get_law` と `get_article_references` は、`hint` に「項番号は 1 始まりで指定してください」と書いているので、1 始まりの整数であることは意図しています。

### 決めること

- `paragraph` を inputSchema で 1 以上の整数（`type: "integer"`、`minimum: 1`）に限り、common_errors の引数検査で `INVALID_ARGUMENT` にするか
- それとも、`item` と揃えて `INVALID_ARTICLE_NUM` にするか

### 完了条件

- 決めた規則が get_law・verify_citations（と get_article_references）の `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_law 19、verify_citations 4（初版起こし、ブランチ `spec-init/egov-initial`）。get_article_references は同じ経路を通るが、未決には挙がっていない
