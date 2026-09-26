検索系ツールの `taxonomy`（税目）は、どんな文字列でも受け付けます。`nta_search_qa` の `topic` は列挙で検査しているため、同じ種類の引数で扱いが分かれています。

### いまの状態

| ツール | 今の動き |
|---|---|
| `nta_search_bunshokaitou` | 本庁の索引に無い値（`zzz` など）でも DB を引き、0 件の応答（SPEC-NTA-SEARCH-BUNSHOKAITOU-002、`available_taxonomies` 付き）を返す |
| `nta_search_jimu_unei` | inputSchema に列挙が無く、どの文字列も受け付けて DB を引く |
| `nta_search_kaisei_tsutatsu` | 引数の説明には `shohi` / `shotoku` / `hojin` / `sisan/sozoku` の 4 つを書いているが、検査はしない。DB に無い値は SPEC-NTA-SEARCH-KAISEI-TSUTATSU-002 の応答 |

DB に入る税目フォルダは国税庁サイトの構成で増えうるため、列挙にしない選択にも理由があります。

### 決めること

- 列挙で検査するか、今のように受け付けて `available_taxonomies` で正しい値を返す形を意図とするか
- 意図とする場合、ツールの説明文にその扱いを書くか

### 完了条件

- 3 ツールの `taxonomy` の扱いが揃い、`specs/current/` に仕様 ID がある

出典: `specs/current/` の「未決」— nta_search_bunshokaitou 8、nta_search_jimu_unei 7、nta_search_kaisei_tsutatsu 1
