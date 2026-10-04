::: details 呼び出し例 — 「医療費控除のタックスアンサー」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（`staleness: "fresh"`。国税庁の索引から消えた記事が 1 件ある DB）

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
      "issuedAt": null,
      "basisDate": "2026-04-01",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1131.htm",
      "snippet": " … ルフメディケーション税制と通常の<b>医療費控除</b>との選択適用\n\n[令和8年4月1 … ",
      "score": 0.253,
      "scoreReasons": ["doc_type=tax-answer weight 0.60"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "tax-answer",
      "docId": "1128",
      "taxonomy": "shotoku",
      "title": "医療費控除の対象となる歯の治療費の具体例",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1128.htm",
      "score": 0.250 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:37:08.048Z",
    "newest_fetched_at": "2026-10-04T03:51:17.445Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  },
  "next_actions": [
    { "action": "nta_get_tax_answer", "reason": "記事の本文を読めます", "example": { "no": "1131" } }
  ]
}
```

`docId` がタックスアンサー番号です。そのまま `nta_get_tax_answer` の `no` に渡します。`next_actions` に先頭の記事を読む呼び出しが入っています（v0.23.0 から）。`basisDate` は記事の「令和8年4月1日現在法令等」を `YYYY-MM-DD` にしたもので、取得日ではありません。2 件目以降は score がほぼ同じ（0.2495 前後）なので、DB を取り込み直すと順が入れ替わることがあります。

`freshness` は、国税庁の索引にある記事だけの取得日時の範囲です（v0.24.1 から）。索引から消えた記事（`orphaned_at` が付いた行）は投入で取り直されないので、範囲から外しています。この DB では No.2882 が 2026-10-04 に索引から消え、2026-09-07 の取得日時のまま残っていますが、`oldest_fetched_at` はその日時にならず、`staleness` は `fresh` です。v0.24.0 までは、この記事の日時が `oldest_fetched_at` になり、投入をやり直しても `stale` のままでした（[houki-nta-mcp#139](https://github.com/shuji-bonji/houki-nta-mcp/issues/139)）。`freshness.db_path` は引いた DB のパスで、ホームディレクトリの部分は `~` に置き換えてあります（v0.25.0 から）。`legal_status.binds_tax_office` も `false` で、通達と違い税務職員も拘束しない参考資料です。
:::
