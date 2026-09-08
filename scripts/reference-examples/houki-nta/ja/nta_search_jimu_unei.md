::: details 呼び出し例 — 「書面添付制度の事務運営指針」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "書面添付", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "書面添付",
  "results": [
    {
      "docType": "jimu-unei",
      "docId": "hojin/090401-2",
      "taxonomy": "hojin",
      "title": "調査課における書面添付制度の運用に当たっての基本的な考え方及び事務手続等について（事務運営指針）",
      "issuedAt": "2009-04-01",
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/01.htm",
      "snippet": " … <b>書面添付</b>制度適用法人について「<b>書面添</b> … ",
      "score": 0.465,
      "scoreReasons": ["doc_type=jimu-unei weight 0.85"]
    },
    {
      "docType": "jimu-unei",
      "docId": "shozei/090401",
      "taxonomy": "shozei",
      "title": "酒税に関する書面添付制度の運用に当たっての基本的な考え方及び事務手続等について（事務運営指針）",
      "issuedAt": "2009-04-01",
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/01.htm",
      "score": 0.450 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T20:51:23.604Z",
    "newest_fetched_at": "2026-09-07T20:51:58.985Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`docId` は `税目/日付` の形（`hojin/090401-2`）で、そのまま `nta_get_jimu_unei` に渡します。事務運営指針は通達と同じく税務職員を拘束し、国民は拘束しません（`binds_tax_office: true`）。
:::
