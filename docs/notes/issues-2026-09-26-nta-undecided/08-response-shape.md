同じ種類の応答なのに、フィールドの有無や名前がツールや状況によって違う箇所があります。呼び出す側が状況ごとに読み方を変える必要があるため、揃えるかどうかを決めます。

### いまの状態

| ツール | 違い |
|---|---|
| `nta_search_tsutatsu` | ヒットしたときは `count` が付くが、0 件のときは付かない（`hits: []` と `message`）。文書系の検索は `results` / `hint` で、名前も違う |
| `nta_get_tsutatsu` | `available_clauses` が、DB の経路（SPEC-NTA-GET-TSUTATSU-005）は最大 50 件、国税庁サイトの経路（010）は取得したページ内の全件 |
| `nta_get_jimu_unei` | markdown に「取得元」の行が無い（`nta_get_qa` にはある）。DB だけを引くツールなので不要とみなすか |
| `nta_inspect_pdf_meta` | `save: true` で絞った結果が 0 件のとき、`saved: []` ではなくフィールドごと無い |
| `nta_inspect_pdf_meta` | 国税庁の索引から外れた文書に、`nta_get_*` が付ける `index_status`・`orphaned_at`・`notice` が付かない |

### 決めること

- 項目ごとに、揃えるか今の形を意図とするか
- `nta_search_tsutatsu` と文書系検索の応答の名前（`hits` / `results`、`message` / `hint`）を揃えるか。揃えるなら互換の扱い

### 完了条件

- 上の各項目の形が決まり、`specs/current/` に書かれている

出典: `specs/current/` の「未決」— nta_search_tsutatsu 10、nta_get_tsutatsu 4、nta_get_jimu_unei 7、nta_inspect_pdf_meta 5・1
