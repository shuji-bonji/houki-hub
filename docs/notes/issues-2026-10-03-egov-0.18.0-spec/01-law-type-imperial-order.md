`search_law` と `search_fulltext` の引数 `law_type` の選択肢 `ImperialOrdinance`（勅令）は、e-Gov 法令 API v2 が受け付けない値です。e-Gov の値は `ImperialOrder` です。そのため、勅令で絞り込む呼び出しは、`search_law` では必ずエラーになり、`search_fulltext` では黙って 0 件になります。

## 何が起きるか（v0.17.0 / main `80ce271`）

| 呼び出し | 結果 |
| --- | --- |
| `search_law { keyword: "健康保険法", law_type: "ImperialOrdinance" }` | `SOURCE_API_ERROR`、`retryable: false`、`detail.status: 400`。e-Gov の `/laws?…&law_type=ImperialOrdinance` が 400 を返す |
| `search_fulltext { keyword: "健康保険法施行令", law_type: "ImperialOrdinance" }`（ローカル DB あり） | `count: 0`・`hits: []` の成功。`law_type` を外すと、健康保険法施行令（大正十五年勅令第二百四十三号、`law_type: "ImperialOrder"`）の条が当たる |

2026-10-03 10:19〜10:25 JST に houki-egov-dev（main の手元のビルド）で確かめました。

e-Gov の `/laws?law_type=<値>&limit=1` の応答（2026-10-03 10:18 JST）:

| 値 | 応答 |
| --- | --- |
| `Constitution` | 200、1 件 |
| `Act` / `CabinetOrder` / `MinisterialOrdinance` | 200 |
| `ImperialOrder` | 200、74 件 |
| `Rule` | 200、453 件 |
| `Misc` | 200、0 件 |
| `ImperialOrdinance` | 400、`{"code":"400001","message":"法令種別（law_type、law_num_type）が誤っています。"}` |

## ずれている箇所

- `src/tools/definitions.ts` の `search_law`（38 行目）と `search_fulltext`（168 行目）の inputSchema の `enum` が `ImperialOrdinance`
- `specs/current/search_law/spec.md` と `specs/current/search_fulltext/spec.md` の「入力」の表も `ImperialOrdinance`
- 一方、応答の `results[].law_type`・`hits[].law_type` は e-Gov の値の `ImperialOrder` で返る。取り込み（`src/services/bulk/ingester.ts`。`specs/current/cli_bulk_download/spec.md` の法令種別の表）も `勅令: 'ImperialOrder'` でローカル DB に入れている

利用者（LLM）は、応答で見た `law_type` の値（`ImperialOrder`）を引数に渡すと inputSchema で `INVALID_ARGUMENT` になり、inputSchema の値（`ImperialOrdinance`）を渡すと上の表の結果になります。勅令で絞り込む方法がありません。

## 決めること

1. inputSchema の値をどうするか
   - 案 A（勧める）: `enum` の `ImperialOrdinance` を `ImperialOrder` に替える。応答の `law_type` と同じ値になる。`ImperialOrdinance` は今まで一度も正しく動いていないので、替えて失うものは無い
   - 案 B: 両方を受け付け、`ImperialOrdinance` は `ImperialOrder` に直して e-Gov と DB に渡す（受け付ける値が 2 つになり、仕様も 2 通りになる）
2. `Constitution`（日本国憲法の 1 件）を `enum` に足すか
3. どの版で入れるか。0.18.0（段階 5。`search_law` の #55 と同じ版）に入れるか、patch で先に出すか。`enum` を変えるので、仕様 PR で `search_law` / `search_fulltext` の「入力」の表と、SPEC-EGOV-COMMON-ERRORS-013 の例（`Act・CabinetOrder・ImperialOrdinance・…` の文）を直す

## 関係する場所

- `explain_law_type` の法令種別コード（#62。`ImperialOrder` は解説に結び付けない、と 0.18.0 の仕様で決めた）
- houki-research-skill の手順に `ImperialOrdinance` を書いた箇所が無いかの確認

## 出典

houki-egov-mcp `specs/changes/20261003-search-explain-attachment/proposal.md`（0.18.0 の仕様 PR）の「この差分の外で見つけたこと」1
