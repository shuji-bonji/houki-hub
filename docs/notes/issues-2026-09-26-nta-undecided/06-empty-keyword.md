空のキーワード（や空の略称）を渡すと、多くのツールがエラーにせず「該当なし」を返します。実際には探していないのに「合う文書が無い」と読めるため、利用者が誤った結論を出すおそれがあります。

### いまの状態

| ツール | 入力 | 今の応答 |
|---|---|---|
| `nta_search_qa` | 空文字・空白だけ・FTS5 の記号（`"` `*` `:` `(` `)`）だけ | 検索して 0 件（SPEC-NTA-SEARCH-QA-007 の「該当なし」） |
| `nta_search_tax_answer` | 空文字・空白だけ・1 文字の語だけ | DB にタックスアンサーがあれば `results: []` と「該当なし」の `hint` |
| `nta_search_bunshokaitou` | `keyword: ""` | inputSchema の検証を通り、「「」に合う文書はありません」の `hint` |
| `nta_search_jimu_unei` | `""` や 1 文字だけ | 同じく「「」に合う文書はありません」 |
| `nta_search_kaisei_tsutatsu` | `""` や空白だけ | 同じく「「」に合う文書はありません」 |
| `resolve_abbreviation` | `""` や `"  "` | SPEC-NTA-RESOLVE-ABBREVIATION-004 の `resolved: null` |
| `nta_search_tsutatsu` | 空・空白だけ | `INVALID_ARGUMENT`（SPEC-NTA-SEARCH-TSUTATSU-002）だが、inputSchema 違反のとき（001）と違い `hint`・`next_actions`・`detail` が付かない |

`nta_search_tsutatsu` だけが空のキーワードを拒否しています。

### 決めること

- 空（と、語が 1 つも残らない入力）を `INVALID_ARGUMENT` にするか、`hint` で「探していない」ことを区別するか
- `nta_search_tsutatsu` の `INVALID_ARGUMENT` の形を、inputSchema 違反のときと揃えるか

### 完了条件

- 7 ツールで空の入力の扱いが揃い、`specs/current/` に仕様 ID と受入テストがある

出典: `specs/current/` の「未決」— nta_search_qa 7、nta_search_tax_answer 7、nta_search_bunshokaitou 7、nta_search_jimu_unei 6、nta_search_kaisei_tsutatsu 2、resolve_abbreviation 3、nta_search_tsutatsu 9
