::: details 呼び出し例 — 「医療費控除のタックスアンサー」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "医療費控除", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "医療費控除",
  "results": [
    {
      "docType": "tax-answer",
      "docId": "1131",
      "taxonomy": "shotoku",
      "title": "セルフメディケーション税制と通常の医療費控除との選択適用",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1131.htm",
      "snippet": " … 療費控除の特例であり、通常の<b>医療費控</b> … ",
      "score": 0.253,
      "scoreReasons": ["doc_type=tax-answer weight 0.60"]
    },
    {
      "docType": "tax-answer",
      "docId": "1127",
      "taxonomy": "shotoku",
      "title": "医療費控除の対象となる介護保険制度下での居宅サービス等の対価",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1127.htm",
      "score": 0.250 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T21:01:50.511Z",
    "newest_fetched_at": "2026-09-07T21:15:57.646Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`docId` がタックスアンサー番号です。そのまま `nta_get_tax_answer` の `no` に渡します。`legal_status.binds_tax_office` も `false` で、通達と違い税務職員も拘束しない参考資料です。
:::
