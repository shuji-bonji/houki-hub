::: tip 改正点だけ知りたいときは `hasPdf: true`
改正通達の本文は「別紙のとおり改める」という短い文で、実際の差分は新旧対照表の PDF にあります。`hasPdf: true` で PDF 付きの文書に絞り、`docId` を `nta_inspect_pdf_meta` に渡すと PDF の一覧と読み方の例が返ります。
:::

::: details 呼び出し例 — 「インボイス関係の改正通達を新旧対照表付きで」
- 実測: v0.24.0（2026-10-04）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "インボイス", "hasPdf": true, "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "インボイス",
  "results": [
    {
      "docType": "kaisei",
      "docId": "0025004-026",
      "taxonomy": "shohi",
      "title": "消費税法基本通達の一部改正について（法令解釈通達）",
      "issuedAt": "2025-04-01",
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
      "snippet": " …  殿\n国税庁長官 （官印省略）\n<b>消費税法</b>基本通達（平成7年12月25日付 … ",
      "score": 0.250,
      "scoreReasons": ["doc_type=kaisei weight 0.95", "abbreviation expanded: インボイス → 消費税法"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "kaisei",
      "docId": "191001",
      "taxonomy": "shohi",
      "title": "消費税法基本通達の一部改正について（法令解釈通達）",
      "issuedAt": "2019-10-01",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/191001/index.htm",
      "score": 0.248 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:24:14.576Z",
    "newest_fetched_at": "2026-10-04T03:26:38.132Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "search_notes": [
    "\"インボイス\" を含む文書は見つかりませんでした。略称辞書で \"インボイス\" は 消費税法 の通称として登録されているため、\"消費税法\" を含む文書に広げて検索しました。\"消費税法\" という語が出てくるだけの文書も含まれます"
  ],
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

「インボイス」という語を含む改正通達は無いので、略称辞書で通称として登録されている「消費税法」に広げて検索しています。そのことは `search_notes` と `scoreReasons` の `abbreviation expanded` に出ます。`basisDate`・`index_status`・`orphaned_at` は、改正通達では `null` です（索引から消えた文書では `orphaned_at` に日時が入ります）。

`docId` には新形式（`0025004-026`）と旧形式（`191001`）が混在します。どちらもそのまま `nta_get_kaisei_tsutatsu` に渡せます。
:::
