法令名や本文の語から関係法令・委任先を推定する規則が、名前の形に頼りすぎていて、実在しない法令や実際と違う法令を指すことがあります。

### いまの状態（v0.15.1）

| ツール | 入力・本文 | 起きること |
|---|---|---|
| `get_related_laws` | `国税通則法施行令の一部を改正する政令` のような、末尾が「施行令」「施行規則」でない政令・省令 | 法律と同じ扱いになり、`国税通則法施行令の一部を改正する政令施行令` のような実在しえない名前を候補にして `not_found` に入れる |
| `get_article_references` | 施行規則の本文の「令第五条第一項」 | 候補名 `令` の `resolved: false` の external になり、`next_actions` を作らない。「法第N条」だけが親の法律に解決される |
| `get_article_references` | 「厚生労働省令で定める」「主務省令で定める」 | 「財務省令で定める」と同じく `target: "enforcement_rule"` になり、`target_law` は `<法律名>施行規則`。所管の違う省令や、名前が「施行規則」でない省令に委任している法律では、実際と違う法令を指しうる |

### 決めること

- `get_related_laws` で、法律でない法令からは候補を作らないか
- `get_article_references` で「令」「規則」を兄弟の施行令・施行規則に解決するか
- 省令の名前（所管）ごとに委任先を分けるか、確かでないときは `target_law` を付けないか

### 完了条件

- 決めた規則が get_related_laws・get_article_references の `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_related_laws 7、get_article_references 15・16（初版起こし）
