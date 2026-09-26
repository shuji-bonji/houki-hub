検索系ツールの `limit` は、範囲外の値を渡してもエラーにも注記にもならず、黙って丸められます。利用者は、指定した件数で探されなかったことに気付けません。

### いまの状態

`nta_search_tsutatsu` / `nta_search_qa` / `nta_search_tax_answer` / `nta_search_bunshokaitou` / `nta_search_jimu_unei` / `nta_search_kaisei_tsutatsu` の 6 ツールとも、1 未満は 1 に、50 を超える値は 50 に丸めて検索します。

- tools/list の説明は「最大: 50」とだけ書いており、超えたときにどうなるかは書いていない
- inputSchema に上限・下限（`minimum` / `maximum`）が無い
- `nta_search_qa` は数値であることも確かめない
- どのツールにも、丸めを確かめるテストが無い

### 決めること

- 丸める動きを意図として認めるか、`INVALID_ARGUMENT` にするか、丸めたことを応答（`search_notes` など）に示すか
- inputSchema に `minimum` / `maximum` を書くか

### 完了条件

- 6 ツールの `limit` の扱いが揃い、`specs/current/` に仕様 ID と受入テストがある

出典: `specs/current/` の「未決」— nta_search_tsutatsu 1、nta_search_qa 2、nta_search_tax_answer 6、nta_search_bunshokaitou 6、nta_search_jimu_unei 5、nta_search_kaisei_tsutatsu 3
