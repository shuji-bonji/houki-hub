::: tip 本文で検索できます（v0.10.3 以降）
v0.10.2 以前は表と別紙を取り込んでいなかったため、題名の語でしか当たりませんでした。いまは回答内容・関係する法令条項等・別紙の照会文まで検索の対象です。v0.10.2 以前に作った DB を使っている場合は `npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-bunshokaitou --refresh` で再投入してください。
:::

::: details 呼び出し例 — 「産科医療の給付金に関する文書回答事例」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "産科医療", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "産科医療",
  "results": [
    {
      "docType": "bunshokaitou",
      "docId": "shotoku/081102",
      "taxonomy": "shotoku",
      "title": "産科医療補償制度に基づき支払われる補償金の所得税法上の取扱いについて",
      "issuedAt": "2008-11-06",
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/081102/index.htm",
      "snippet": " … 施行令第30条\n添付書類: ・ <b>産科医療</b>補償制度標準補償約款 ・ <b>産科医療</b> … ",
      "score": 0.518,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "bunshokaitou",
      "docId": "shotoku/250416",
      "taxonomy": "shotoku",
      "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
      "issuedAt": "2025-04-07",
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm",
      "snippet": " … 法施行令第30条\n添付書類: ・<b>産科医療</b>特別給付事業 実施要綱\n〔回答〕 … ",
      "score": 0.490,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"],
      "index_status": null,
      "orphaned_at": null
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:27:23.963Z",
    "newest_fetched_at": "2026-10-04T03:37:07.872Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "文書回答事例は照会者・国税庁双方の合意に基づく個別事案回答であり、一般的な法的拘束力はない。同じ事案で同様の判断を期待することは可能だが、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`snippet` が添付書類の行から取れていることから、題名ではなく表の中身に当たっているのが分かります。`docId` をそのまま `nta_get_bunshokaitou` に渡せます。`basisDate`（文書の基準日）は文書回答事例には無いので `null` です。`index_status`・`orphaned_at` は、国税庁の索引から文書が消えたときに値が入ります。
:::

::: details 呼び出し例 — 別紙の本文にしかない語で引く
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（上の例と同じ DB。検索の対象はローカル DB だけ。SPEC-NTA-SEARCH-BUNSHOKAITOU-001）

「宇宙空間」は題名にも回答内容にもなく、別紙の照会文にだけ出てくる語です。

**引数**

```jsonc
{ "keyword": "宇宙空間", "limit": 3 }
```

**返る JSON（抜粋）**

```jsonc
{
  "keyword": "宇宙空間",
  "results": [
    {
      "docType": "bunshokaitou",
      "docId": "tokyo/shohi/251017",
      "taxonomy": "shohi",
      "title": "人工衛星打上げ輸送サービスに係る消費税の取扱いについて",
      "issuedAt": "2025-10-17",
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/about/organization/tokyo/bunshokaito/shohi/251017/index.htm",
      "snippet": " … を発射する機能を有する施設）より<b>宇宙空間</b>における所定の軌道に投入するまで … ",
      "score": 0.536,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"],
      "index_status": null,
      "orphaned_at": null
    }
  ]
  // freshness / legal_status は上の例と同じ
}
```

キーワードに合う文書が無いときは、`results: []` と、検索した件数を書いた `hint`（例: 「該当なし。DB の文書回答事例（taxonomy="inshi"）6 件に「配当」に合う文書はありません」）が返ります（v0.13.0 から）。`taxonomy` に DB に無い税目を指定したときは、`available_taxonomies` に DB にある税目の一覧が入ります。文書回答事例が DB に 1 件も無いときは、エラー `DOC_NOT_FOUND` が返ります。
:::

::: details 呼び出し例 — 税目の別表記をまとめて検索する（`taxonomy: "sozoku"`）
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "小規模宅地等", "taxonomy": "sozoku", "limit": 5 }
```

**返る JSON**（抜粋）

```jsonc
{
  "keyword": "小規模宅地等",
  "results": [
    { "docId": "tokyo/souzoku/181207", "taxonomy": "souzoku", "title": "老人ホームに入居中に自宅を相続した場合の小規模宅地等についての相続税の課税価格の計算の特例（租税特別措置法第69条の4）の適用について", "issuedAt": "2018-12-07" },
    { "docId": "tokyo/souzoku/211224", "taxonomy": "souzoku", "title": "市街地再開発事業により中断した貸付事業を相続開始前3年以内に再開した場合の小規模宅地等についての相続税の課税価格の計算の特例（租税特別措置法第69条の4）の適用について", "issuedAt": "2021-11-26" },
    { "docId": "kantoshinetsu/sozoku/160822", "taxonomy": "sozoku", "title": "庭先部分を相続した場合の小規模宅地等についての相続税の課税価格の計算の特例（租税特別措置法第69条の4）の適用について", "issuedAt": "2016-08-22" }
    // docType / basisDate / sourceUrl / snippet / score / scoreReasons / index_status / orphaned_at は省略
  ],
  "search_notes": [
    "taxonomy=\"sozoku\" は、同じ税目の別表記 \"souzoku\" の文書もまとめて検索しました（国税局のページは本庁と違う税目フォルダ名を使うことがあるため）"
  ]
  // freshness は絞った税目の範囲（oldest 2026-10-04T03:31:32.294Z、fresh）。legal_status は上の例と同じ
}
```

国税局のページは本庁と違う税目フォルダ名を使うことがあり（東京局の `souzoku` など）、v0.13.0 までは `taxonomy: "sozoku"` で東京局の文書が出ませんでした。v0.14.0 からは、`sozoku` と `souzoku`、`gensen` と `gensenshotoku`、`joto-sanrin` と `joto_sanrin` をまとめて検索します。
:::
