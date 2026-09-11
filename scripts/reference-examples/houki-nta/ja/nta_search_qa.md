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

`docId` の `hojin/04/16` は、`nta_get_qa` の `topic` / `category` / `id` にそのまま分かれます。質疑応答事例は PDF を持たないので、`hasPdf: true` を付けると `results: []` と「PDF 付きの文書はありません」という `hint` が返ります。
:::

::: details 呼び出し例 — 税目（topic）で絞る
- 実測: v0.13.0（2026-09-12）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "軽減税率", "topic": "shohi", "limit": 3 }
```

**返る JSON**

```jsonc
{
  "keyword": "軽減税率",
  "results": [
    {
      "docType": "qa-jirei",
      "docId": "shohi/21/10",
      "taxonomy": "shohi",
      "title": "令和元年10月1日前の借入金の返済に充てる補助金の交付を受けた場合",
      "sourceUrl": "https://www.nta.go.jp/law/shitsugi/shohi/21/10.htm",
      "snippet": " … 税率7.8％（<b>軽減税率</b>が適用される課 … ",
      "score": 0.198,
      "scoreReasons": ["doc_type=qa weight 0.70"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-11T11:01:16.620Z",
    "newest_fetched_at": "2026-09-11T11:06:24.096Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  }
  // legal_status は上の例と同じ
}
```

`topic` は `--qa-topic` と同じ値（`shotoku` / `gensen` / `joto` / `sozoku` / `hyoka` / `hojin` / `shohi` / `inshi` / `hotei`）です。`freshness` は、絞り込んだ税目の文書の取得時点を示します。
`domain` は分野（`tax` など）の引数で、質疑応答事例はすべて税務なので `"tax"` では絞り込まれません。v0.12.0 までは `domain` を付けると必ず 0 件でした。
:::

::: details 呼び出し例 — キーワードに合う文書が無いとき
- 実測: v0.13.0（2026-09-12）
- ローカル DB: あり（質疑応答事例 1,841 件）

**引数**

```jsonc
{ "keyword": "異なる課税関係が生ずる" }
```

**返る JSON**

```jsonc
{
  "results": [],
  "keyword": "異なる課税関係が生ずる",
  "hint": "該当なし。DB の質疑応答事例 1,841 件に「異なる課税関係が生ずる」に合う文書はありません。別のキーワードで試してください",
  "freshness": {
    "oldest_fetched_at": "2026-09-11T10:37:09.480Z",
    "newest_fetched_at": "2026-09-11T11:11:55.474Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  }
  // legal_status は上の例と同じ
}
```

この語はページ下部の注記の文言で、v0.12.0 から注記は本文から外しているので 0 件になります。`hint` の件数で、DB に質疑応答事例が入っていることが分かります。
質疑応答事例が DB に 1 件も無いときは、`results: []` ではなくエラー `DOC_NOT_FOUND` が返ります。`hint` に MCP サーバーが開いている DB ファイルのパスが、`next_actions` に `houki-nta-mcp --bulk-download-qa` が入ります。
:::
