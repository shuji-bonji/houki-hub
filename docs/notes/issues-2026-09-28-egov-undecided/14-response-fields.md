同じ種類の応答なのに、場合によってフィールドが付いたり付かなかったりします。呼び出し側（LLM）は、応答の形からは値の有無の理由を読み取れず、打ち切りの続きを取るときに条件が変わることもあります。

### いまの状態（v0.15.1）

| ツール | 場面 | 起きること |
|---|---|---|
| `get_law` | 目次（`format: "toc"`、または `article` 省略） | 条文の応答の `meta` には `at` が付くが、目次の `meta` には付かない（Markdown の `時点:` の行は付く） |
| `get_law` | `item` だけを指定し、項が 1 つの条の号を返したとき（SPEC-EGOV-GET-LAW-011） | json の `data.paragraph_num` が付かず、`data.node` は号。補った項番号（`1`）を返さない |
| `get_law_range` | 打ち切ったとき（SPEC-EGOV-GET-LAW-RANGE-008） | `range.next_actions[0].example` は `law_name`・`path`（または `suppl_index`）・`from_article` だけで、呼び出し側が渡した `max_chars` を含まない。例のとおりに呼び直すと既定の 30,000 文字で返る |

### 決めること

- 目次の `meta` にも `at` を付けるか
- 項を補ったときに `data.paragraph_num` を返すか
- 続きの呼び出し例に、渡された `max_chars` を入れるか

### 完了条件

- 決めた規則が get_law・get_law_range の `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_law 17・18、get_law_range 8（初版起こし）
