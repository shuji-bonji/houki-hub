条番号で条を探すツールが、本則と附則を区別しません。本則に無い条番号でも附則に同じ番号の条があれば、その条を本則の条と同じ形で返します。利用者（LLM）は附則の条を本則の条として引用するおそれがあります。

### いまの状態（v0.15.1）

| ツール | 起きること |
|---|---|
| `get_law` | `article` の条を法令本文の全体から探し、先に見つかった条を返す。附則の条が返っても、応答に附則である印が付かない |
| `verify_citations` | 本則に無い条番号でも、附則に同じ番号の条があれば `found` になる。`article.label` は `第N条` のままで、附則だと分からない |
| `get_article_references` | 本文の「附則第三条」は、法令名の付かない条として `{ kind: "internal", raw: "第三条", article: "3" }` になり、`next_actions` の `get_law` は本則の第 3 条を指す |

`get_toc`（#24）と `get_law_range`（`suppl_index`）は、本則と附則を分けて扱っています。

### 決めること

- `get_law` と `verify_citations` で、条を探す範囲を本則に限るか。限らないなら、附則の条に一致したときの印（例: `suppl: true` と改正法令の番号）を応答に付けるか
- 附則の条を指定する方法を `get_law` に設けるか（`get_law_range` の `suppl_index` と揃えるか）
- `get_article_references` で「附則第N条」を別の種類の参照にするか、参照から外すか

### 完了条件

- 決めた規則が 3 ツールの `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_law 15、verify_citations 1、get_article_references 14（初版起こし）
