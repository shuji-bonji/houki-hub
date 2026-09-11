::: details 呼び出し例 — 「消費税の質疑応答事例 02/19 の照会と回答、関係法令通達」
- 実測: v0.12.0（2026-09-11）
- ローカル DB: 不要（この例では国税庁サイトから取得）

**引数**

```jsonc
{ "topic": "shohi", "category": "02", "id": "19", "format": "json" }
```

**返る JSON（抜粋）**

```jsonc
{
  "qa": {
    "topic": "shohi",
    "category": "02",
    "id": "19",
    "title": "個人事業者が所有するゴルフ会員権の譲渡",
    "question": [
      "個人事業者がゴルフ会員権を譲渡した場合、課税の対象となるのでしょうか。"
    ],
    "answer": [
      "個人事業者が所有するゴルフ会員権は、会員権販売業者が所有している場合には棚卸資産に当たり、その譲渡は課税の対象となりますが、その他の個人事業者が所有している場合には生活用資産に当たり、その譲渡は課税の対象となりません（基通5－1－1（注）1）。"
    ],
    "relatedLaws": [
      "消費税法第2条第1項第8号、消費税法基本通達5-1-1"
    ],
    "notice": "令和7年8月1日現在の法令・通達等に基づいて作成しています。\n\nこの質疑事例は、照会に係る事実関係を前提とした一般的な回答であり、…この回答内容と異なる課税関係が生ずることがあることにご注意ください。",
    "basisDate": "2025-08-01",
    "sourceUrl": "https://www.nta.go.jp/law/shitsugi/shohi/02/19.htm",
    "fetchedAt": "2026-09-11T11:50:13.932Z"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  },
  "related_laws": [
    { "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8, "raw": "消費税法第2条第1項第8号" }
  ],
  "related_tsutatsu": [
    { "name": "消費税法基本通達", "clause": "5-1-1", "raw": "消費税法基本通達5-1-1" }
  ],
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "質疑応答事例は参考資料で法的拘束力がない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8 }
    },
    {
      "action": "nta_get_tsutatsu",
      "reason": "質疑応答事例が挙げている通達の本文を確認する",
      "example": { "name": "消費税法基本通達", "clause": "5-1-1" }
    }
  ]
}
```

【関係法令通達】の原文は `relatedLaws` にそのまま残り、法令は `related_laws`、通達は `related_tsutatsu` に分けて入ります。`next_actions` の `example` は、そのまま houki-egov-mcp の `get_law` と `nta_get_tsutatsu` の引数として使えます。

ページ下部の国税庁の注記（何年何月何日現在の法令に基づくか、個別の取引には異なる課税関係が生じうること）は `notice` に入り、基準日は `basisDate` に入ります。この注記は回答に残してください。
:::

::: details 呼び出し例 — 枝番号の号を挙げている事例（法人税 33/02）
- 実測: v0.14.0（2026-09-12）

**引数**

```jsonc
{ "topic": "hojin", "category": "33", "id": "02", "format": "json" }
```

**返る JSON**（`related_laws` と `next_actions` の抜粋）

```jsonc
{
  "related_laws": [
    { "law_name": "法人税法", "article": "2", "item": "12の8", "raw": "法人税法第2条第12号の8" },
    { "law_name": "法人税法施行令", "article": "4の3", "paragraph": 4, "item": 1, "raw": "法人税法施行令第4条の3第4項第1号" },
    { "law_name": "法人税法施行規則", "article": "3", "raw": "法人税法施行規則第3条" }
  ],
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "質疑応答事例は参考資料で法的拘束力がない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "法人税法", "article": "2", "item": "12の8" }
    }
    // 施行令・施行規則への案内が続く
  ]
  // qa / legal_status は上の例と同じ形
}
```

「第2条第12号の8」のような枝番号の号は、v0.14.0 から `item` に文字列（`"12の8"`）で入ります（v0.13.0 までは `item` を入れていませんでした）。この `example` を houki-egov-mcp の `get_law` にそのまま渡せるのは v0.6.0 以上です。法人税法 2 条は項が 1 つだけなので、`paragraph` が無くても号を引けます。
:::
