::: tip 本文で検索できます（v0.10.3 以降）
v0.10.2 以前は表と別紙を取り込んでいなかったため、題名の語でしか当たりませんでした。いまは回答内容・関係する法令条項等・別紙の照会文まで検索の対象です。v0.10.2 以前に作った DB を使っている場合は `houki-nta-mcp --bulk-download-bunshokaitou --refresh` で再投入してください。
:::

::: details 呼び出し例 — 「産科医療の給付金に関する文書回答事例」
- 実測: v0.10.4（2026-09-08）
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
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/081102/index.htm",
      "snippet": " … ・ <b>産科医療</b>補償制度標準補償約款 ・ … ",
      "score": 0.519,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"]
    },
    {
      "docType": "bunshokaitou",
      "docId": "shotoku/250416",
      "taxonomy": "shotoku",
      "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
      "issuedAt": "2025-04-07",
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm",
      "snippet": " … ・<b>産科医療</b>特別給付事業 実施要綱\n〔 … ",
      "score": 0.492,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-08T07:27:19.397Z",
    "newest_fetched_at": "2026-09-08T07:46:15.519Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "文書回答事例は照会者・国税庁双方の合意に基づく個別事案回答であり、一般的な法的拘束力はない。同じ事案で同様の判断を期待することは可能だが、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`snippet` が添付書類の行から取れていることから、題名ではなく表の中身に当たっているのが分かります。`docId` をそのまま `nta_get_bunshokaitou` に渡せます。
:::

::: details 呼び出し例 — 別紙の本文にしかない語で引く
- 実測: v0.10.4（2026-09-08）

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
      "sourceUrl": "https://www.nta.go.jp/about/organization/tokyo/bunshokaito/shohi/251017/index.htm",
      "snippet": " … する施設）より<b>宇宙空間</b>における所定の … ",
      "score": 0.537,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"]
    }
  ]
  // freshness / legal_status は上の例と同じ
}
```

キーワードに合う文書が無いときは、`results: []` と、検索した件数を書いた `hint`（例: 「該当なし。DB の文書回答事例（taxonomy="inshi"）6 件に「配当」に合う文書はありません」）が返ります（v0.13.0 から）。`taxonomy` に DB に無い税目を指定したときは、`available_taxonomies` に DB にある税目の一覧が入ります。文書回答事例が DB に 1 件も無いときは、エラー `DOC_NOT_FOUND` が返ります。
:::
