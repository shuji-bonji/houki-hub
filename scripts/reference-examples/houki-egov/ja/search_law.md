::: tip 略称はそのまま渡せます
「個情法」「消法」「労基法」のような略称は、houki-abbreviations の辞書で正式名に直してから検索します。応答の `query.resolved` に、何に直したかが入ります。
:::

::: details 呼び出し例 — 「個情法の正式名と法令番号を知りたい」
- 実測: v0.20.0（2026-10-05）
- ローカル DB: 不要（e-Gov 法令 API v2 をその場で呼びます）

**引数**

```jsonc
{ "keyword": "個情法", "limit": 3 }
```

**返る JSON**

```jsonc
{
  "query": { "keyword": "個情法", "resolved": "個人情報の保護に関する法律" },
  "total_count": 17,
  "results": [
    {
      "law_id": "415AC0000000057",
      "title": "個人情報の保護に関する法律",
      "law_num": "平成十五年法律第五十七号",
      "law_type": "Act",
      "promulgation_date": "2003-05-30",
      "url": "https://laws.e-gov.go.jp/law/415AC0000000057"
    },
    {
      "law_id": "415AC0000000058",
      "title": "行政機関の保有する個人情報の保護に関する法律",
      "law_num": "平成十五年法律第五十八号",
      "law_type": "Act",
      "promulgation_date": "2003-05-30",
      "url": "https://laws.e-gov.go.jp/law/415AC0000000058"
    },
    {
      "law_id": "415AC0000000059",
      "title": "独立行政法人等の保有する個人情報の保護に関する法律",
      "law_num": "平成十五年法律第五十九号",
      "law_type": "Act",
      "promulgation_date": "2003-05-30",
      "url": "https://laws.e-gov.go.jp/law/415AC0000000059"
    }
  ],
  "hint": null,
  "next_actions": []
}
```

`total_count` は e-Gov で題名が一致した法令の総数（17 件）で、`limit: 3` で返した `results` の件数とは違います（v0.18.0 から。それまでは `results` の件数でした）。1 件以上当たったときは `hint` が `null`、`next_actions` が `[]` です。0 件のときは、条文の本文を探す `search_fulltext` と略称を確かめる `resolve_abbreviation` が `hint` と `next_actions` に入ります。

`results[].law_id` をそのまま次の `get_law` / `get_toc` に渡せます。タイトル一致の検索なので、条文本文の中の語を探すときは `search_fulltext` を使ってください。
:::
