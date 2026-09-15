### 背景

`kuro6061/e-gov-mcp` の `follow_law_chain` / `explain_law_article` / `find_related_laws` に相当する処理がありません。「この条が指す施行令はどれか」をサーバーが解決しないため、LLM が次の `search_law` を自分で組み立てています。

### 先に決めること

houki-hub#8（GraphRAG・KAG による法令グラフ）と対象が重なります。

- 参照関係を MCP のツールとして持つのか、グラフ側に持つのか
- 条文中の参照表現（「〜に規定する」「〜で定める」）をどこで解析するのか
- `houki-abbreviations` の逆引き（`lookupByLawId` / `lookupByLawNum`）をどう使うのか

これを決めてから実装に入ります。

### やること（暫定）

- 法令名から施行令・施行規則を引く（名称規則ベース）
- 条文中の他法令への参照を抽出する
- 成功時の `next_actions` に、辿り先の `get_law` 呼び出しを入れる

出典: houki-hub#20 機能 2 / houki-hub#21 / houki-hub#8
