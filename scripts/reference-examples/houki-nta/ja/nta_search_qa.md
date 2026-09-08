::: details 呼び出し例 — 「テレワークに関係する質疑応答事例」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "テレワーク", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "テレワーク",
  "results": [
    {
      "docType": "qa-jirei",
      "docId": "hojin/04/16",
      "taxonomy": "hojin",
      "title": "中小企業者等が取得をした働き方改革に資する減価償却資産の中小企業経営強化税制（租税特別措置法第42条の12の4）の適用について",
      "sourceUrl": "https://www.nta.go.jp/law/shitsugi/hojin/04/16.htm",
      "snippet": " … る器具備品（<b>テレワーク</b>用電子計算機等 … ",
      "score": 0.334,
      "scoreReasons": ["doc_type=qa weight 0.70"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T21:16:06.923Z",
    "newest_fetched_at": "2026-09-07T21:51:02.316Z",
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

`docId` の `hojin/04/16` は、`nta_get_qa` の `topic` / `category` / `id` にそのまま分かれます。質疑応答事例は PDF を持たないので `hasPdf: true` を付けると空になります。
:::
