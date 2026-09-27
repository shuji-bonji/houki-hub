引数に inputSchema の違反が 2 つ以上あると、`INVALID_ARGUMENT` の `detail.issues` が 1 件にまとまり、2 つ目以降の引数名が分からなくなったり、違反そのものが応答から消えたりします。呼び出す側（LLM）は `detail.issues[].path` を見て引数を直すので、直すべき引数を取りこぼします。

### いまの状態（v0.21.0、tools/call の受け口を手元で呼んだ結果）

| 渡した引数 | `detail.issues` |
|---|---|
| `nta_search_kaisei_tsutatsu` に `{ keyword: 1, limit: "x" }` | `[{ path: "keyword", message: "must be string, data/limit must be number" }]`（`limit` の違反が `message` の中に `data/limit` の形で残る） |
| `nta_get_qa` に `{ topic: "zzz" }` | `[{ path: "", message: "must have required property 'category', data must have required property 'id', data/topic must be equal to one of the allowed values" }]` |
| `nta_inspect_pdf_meta` に `{ docType: "kaisei", docId: "x", kind: "zzz", save: "yes" }` | `[{ path: "kind", message: "must be equal to one of the allowed values, data/save must be boolean" }]` |
| `nta_search_kaisei_tsutatsu` に `{ keyword: "a", limit: "x", zz: 1 }` | `[{ path: "zz", message: "inputSchema に無い引数です" }]`（`limit` の型の違反が応答に出ない） |

inputSchema に無い引数が 2 つ以上あるときは、`path` に `"a, b"` のように並べて入る（common_errors の未決 4）。

違反が 1 つだけのときは SPEC-NTA-COMMON-ERRORS-003・004 のとおりに返るので、差分 `20260927-argument-and-parse-errors` は違反が 1 つの場合だけを約束にしています。

### 決めること

- 違反ごとに `detail.issues` の要素を分けるか（分けるなら、inputSchema に無い引数も 1 つずつ分けるか）
- 型の違反と inputSchema に無い引数が同時にあるとき、両方を返すか
- `message` に残る検査の部品の文（`data/limit must be number` など）をそのまま返すか、整えるか

### 完了条件

- 違反が 2 つ以上あるときの `detail.issues` の形が決まり、`specs/current/common_errors/spec.md` に書かれている

出典: `specs/current/common_errors/spec.md` の「未決」4、差分 `20260927-argument-and-parse-errors`（手元での確認）
