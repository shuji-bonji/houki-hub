`nta_search_qa` の `domain` 引数は、`tax` 以外を渡すと必ず 0 件になります。引数として残す意味があるか、残すならその扱いを決めます。

### いまの状態

- `domain` はスキーマの列挙（houki-abbreviations の分野の一覧）で検証されるが、`tax` 以外はすべて DB を引かずに `results: []` と `hint` を返す（SPEC-NTA-SEARCH-QA-002）
- DB を開かないので、DB に事例が 1 件も無くても `DOC_NOT_FOUND` にならず、`freshness` も付かない
- 税目で絞るのは `topic` で、`domain` は絞り込みに使われない（SPEC-NTA-SEARCH-QA-003）

### 決めること

- `domain` を残すか、`topic` に一本化するか
- 残すなら、`tax` 以外のときにも DB の有無を確かめるか

### 完了条件

- `domain` の扱いが決まり、tools/list の説明と `specs/current/` が同じことを書いている

出典: `specs/current/` の「未決」— nta_search_qa 8・9
