文書系の検索ツールで、ヒットした文書の `results` の要素に `issuedAt` が付くかどうかが種別によって違います。発出日で新しい文書を選びたい利用者（LLM）は、ツールごとに読み方を変える必要があります。

### いまの状態（v0.21.0、手元で呼んだ結果）

| ツール | `results[].issuedAt` |
|---|---|
| `nta_search_kaisei_tsutatsu` / `nta_search_jimu_unei` / `nta_search_bunshokaitou` | 付く。DB に発出日が無い文書では `null` |
| `nta_search_qa` | 付かない（質疑応答事例は DB に日付を持たない） |
| `nta_search_tax_answer` | 付かない。DB には記事の「法令時点」から読んだ日付が入っているが、応答に出さない |

取得ツールの側でも、`nta_get_*` の json の `document.issuedAt` は値が無ければフィールドごと付かず、検索の `null` と扱いが違います。

### 決めること

- 検索の `results` に `issuedAt` を全種別で付けるか、今のまま種別で分けるか
- 値が無いときに `null` を入れるか、フィールドを付けないか（検索と取得で揃えるか）
- タックスアンサーの日付（法令時点）を `issuedAt` として出すか。出すなら「発出日」とは意味が違うことをどう示すか

### 完了条件

- `issuedAt` の扱いが決まり、`specs/current/search_rules/spec.md`（SPEC-NTA-SEARCH-RULES-015 を足す差分 `20260927-search-hit-responses` の取り込み後）に書かれている

出典: `specs/current/` の「未決」— nta_search_bunshokaitou 1、nta_search_jimu_unei 10、nta_search_kaisei_tsutatsu 4 のうち `issuedAt` の部分（差分 `20260927-search-hit-responses` では約束にせず、この Issue に移した）

関連: houki-nta-mcp #71（同じ種類の応答でフィールドの有無や名前が揃っていない）。#71 に含めて扱ってもよい
