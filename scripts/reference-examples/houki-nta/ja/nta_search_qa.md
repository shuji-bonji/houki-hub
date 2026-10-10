::: details 呼び出し例 — 「テレワークに関係する質疑応答事例」
- 実測: v0.25.0（2026-10-05）
- 確かめた版: v0.27.0（2026-10-10）
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
      "issuedAt": null,
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/shitsugi/hojin/04/16.htm",
      "snippet": " … 活動の用に直接供される器具備品（<b>テレワーク</b>用電子計算機等）、ソフトウエア（ … ",
      "score": 0.341,
      "scoreReasons": ["doc_type=qa weight 0.70"],
      "index_status": null,
      "orphaned_at": null
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:51:26.746Z",
    "newest_fetched_at": "2026-10-04T04:26:15.744Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`docId` の `hojin/04/16` は、`nta_get_qa` の `topic` / `category` / `id` にそのまま分かれます。質疑応答事例は PDF を持たないので、`hasPdf: true` を付けると `results: []` と、`hint`「DB の質疑応答事例 1,841 件に、PDF 付きの文書はありません。hasPdf を外して検索してください」が返ります。`issuedAt`・`basisDate` は質疑応答事例の検索結果では `null` です（基準日は `nta_get_qa` の `qa.basisDate` で読めます）。
:::

::: details 呼び出し例 — 税目（topic）で絞る
- 実測: v0.25.0（2026-10-05）
- 確かめた版: v0.27.0（2026-10-10）
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
      "issuedAt": null,
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/shitsugi/shohi/21/10.htm",
      "snippet": " … は、原則として消費税率7.8％（<b>軽減税率</b>が適用される課税仕入れ等に係る支 … ",
      "score": 0.199,
      "scoreReasons": ["doc_type=qa weight 0.70"],
      "index_status": null,
      "orphaned_at": null
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T04:15:37.962Z",
    "newest_fetched_at": "2026-10-04T04:20:45.581Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  }
  // legal_status は上の例と同じ
}
```

`topic` は `--qa-topic` と同じ値（`shotoku` / `gensen` / `joto` / `sozoku` / `hyoka` / `hojin` / `shohi` / `inshi` / `hotei`）です。`freshness` は、絞り込んだ税目の文書の取得時点を示します。
分野の引数 `domain` は v0.24.0 で外しました。渡すと `INVALID_ARGUMENT`（`detail.issues[0].path: "domain"`）になるので、税目で絞るときは `topic` を使います（v0.23.x までは `domain: "tax"` を受け付けて、省いたときと同じ結果を返していました）。
:::

::: details 呼び出し例 — キーワードに合う文書が無いとき
- 実測: v0.25.0（2026-10-05）
- 確かめた版: v0.27.0（2026-10-10）
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
    "oldest_fetched_at": "2026-10-04T03:51:26.746Z",
    "newest_fetched_at": "2026-10-04T04:26:15.744Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  }
  // legal_status は上の例と同じ
}
```

この語はページ下部の注記の文言で、v0.12.0 から注記は本文から外しているので 0 件になります。`hint` の件数で、DB に質疑応答事例が入っていることが分かります。
質疑応答事例が DB に 1 件も無いときは、`results: []` ではなくエラー `DOC_NOT_FOUND` が返ります。`hint` は DB の状態ごとに先頭の文が変わり、どれも開こうとした DB のパス（ホームは `~`）を含みます（v0.25.0 から）。DB のファイルが無いときは「ローカル DB（~/.cache/houki-nta-mcp/cache.db）がありません。…」、質疑応答事例だけが無いときは「ローカル DB（~/.cache/houki-nta-mcp/cache.db）に質疑応答事例（doc_type="qa-jirei"）が入っていません。…」で始まります。`next_actions` の `example.command` は `npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-qa` です。
:::
