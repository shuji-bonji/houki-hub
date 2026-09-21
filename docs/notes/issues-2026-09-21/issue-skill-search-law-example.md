# issue 草案: invoice-registration とステップ ③ の例文が、そのままでは動かない

対象リポジトリ: houki-research-skill（2026-09-21 JST 作成）
提出先: https://github.com/shuji-bonji/houki-research-skill/issues
タイトル案: ステップ ③ の例文を直す（`search_law` は条を探せない、`get_law` は `legal_status` を返さない）

---

## 観察

`examples/invoice-registration.md` と `workflows/tax-research.md` のステップ ③ は次のように書いている。

```jsonc
{ "tool": "search_law", "args": { "keyword": "適格請求書発行事業者の登録" } }
// → 消費税法 第 57 条の 2

{ "tool": "get_law", "args": { "law_name": "消費税法", "article": "57の2" } }
// → 条文本文 + legal_status (binds_citizens=true / binds_courts=true)
```

houki-egov-mcp 0.15.1 で実行すると（2026-09-21）:

- `search_law { keyword: "適格請求書発行事業者の登録" }` は `total_count: 0`、`results: []`。`search_law` は法令名の検索で、略称辞書の alias「適格請求書発行事業者」には当たる（`query.resolved: "消費税法"` で 5 件）が、「の登録」が付くと当たらない
- `get_law { law_name: "消費税法", article: "57の2" }` は本文と `meta`（law_id / title / law_num / retrieved_at / url）を返す。`legal_status` は付かない。`legal_status` を返す egov のツールは `explain_law_type`

SKILL.md 鉄則 3 の表は「『どの法令の何条に書いてあるか』自体が不明 → `search_fulltext` → `get_law`」と正しく書いており、例文だけが古い。

## 直し方

ステップ ③ を次にする。

```jsonc
{ "tool": "search_fulltext", "args": { "keyword": "消費税法 適格請求書発行事業者の登録" } }
// → hits[0]: 消費税法 57の2「（適格請求書発行事業者の登録等）」（score_reasons に article_caption_match）
//    hits[1]: 附則(137) 44「（適格請求書発行事業者の登録等に関する経過措置）」
//    実測: houki-egov-mcp v0.15.1（2026-09-21）。ローカル DB が無いと source が "api-fallback" になり search_law の結果が返る

{ "tool": "get_law", "args": { "law_name": "消費税法", "article": "57の2" } }
// → 条文本文 + meta。法律の拘束力（binds_citizens / binds_courts が true）は explain_law_type の応答か、SKILL.md の階層の説明を根拠にする
```

`workflows/tax-research.md` の同じ箇所（112 行目付近）も同じ直し。`examples/invoice-registration.md` のステップ ⑧ の citation に `legal_status` を書いている箇所があれば、出所を `explain_law_type` に改める。

## ついでに

この例文は「手順を示すために書かれたもの」で、その版で実際にそう返ったものではなかった。直すときに、例文の呼び出しを 1 度ずつ実行して「実測: vX.Y.Z（日付）」を付ける（houki-hub の `scripts/reference-examples` と同じ書き方）。そうしておくと、回帰確認のときに Skill の例文も基準として使える。

## 受け入れ条件

- ステップ ③ の例文を、書いてあるとおりに呼んで、書いてあるとおりの結果が返る
- `get_law` の応答に無いフィールド（`legal_status`）を例文が主張していない
- 直した例文に実測版と日付が付いている

出典: houki-hub `docs/notes/2026-09-21-regression-check.md` の「手順の確認」
