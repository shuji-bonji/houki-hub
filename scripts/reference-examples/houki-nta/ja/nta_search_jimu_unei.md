::: details 呼び出し例 — 「書面添付制度の事務運営指針」
- 実測: v0.25.0（2026-10-05）
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
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/01.htm",
      "snippet": " … の一部改正に伴う調査課における新<b>書面添付</b>制度の運用に当たっての基本的な考 … ",
      "score": 0.463,
      "scoreReasons": ["doc_type=jimu-unei weight 0.85"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "jimu-unei",
      "docId": "shotoku/shinkoku/090401",
      "taxonomy": "shotoku",
      "title": "個人課税部門における書面添付制度の運用に当たっての基本的な考え方及び事務手続等について(事務運営指針)",
      "issuedAt": "2009-04-01",
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/shotoku/shinkoku/090401/01.htm",
      "score": 0.446 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:26:38.243Z",
    "newest_fetched_at": "2026-10-04T03:27:13.440Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達・事務運営指針は行政内部文書であり、納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`docId` は `税目/日付` の形（`hojin/090401-2`）か `税目/…/日付` の形（`shotoku/shinkoku/090401`）で、そのまま `nta_get_jimu_unei` に渡します。書面添付制度の事務運営指針は部門ごとに 5 件あり（調査課・個人課税・酒税・法人課税・資産税）、2 件目以降は score がほぼ同じ（0.446〜0.441）なので、DB を取り込み直すと順が入れ替わることがあります。事務運営指針は通達と同じく税務職員を拘束し、国民は拘束しません（`binds_tax_office: true`）。
:::
