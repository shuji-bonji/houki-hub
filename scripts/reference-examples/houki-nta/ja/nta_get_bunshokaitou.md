::: details 呼び出し例 — 「文書回答事例 shotoku/250416」
- 実測: v0.10.2（2026-09-08）
- ローカル DB: あり（`source: "db"`）

**引数**

```jsonc
{ "docId": "shotoku/250416", "format": "json" }
```

**返る JSON**

```jsonc
{
  "document": {
    "docType": "bunshokaitou",
    "docId": "shotoku/250416",
    "taxonomy": "shotoku",
    "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
    "issuer": "国税庁",
    "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm",
    "fetchedAt": "2026-05-03T03:03:16.454Z",
    "fullText": "取引等に係る税務上の取扱い等に関する照会（同業者団体等用）\n〔照会〕\n〔回答〕",
    "attachedPdfs": []
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "文書回答事例は照会者・国税庁双方の合意に基づく個別事案回答であり、一般的な法的拘束力はない。…"
  },
  "source": "db"
}
```

この文書では `fullText` が見出しだけで、`attachedPdfs` も空でした。照会と回答の本文が国税庁ページ上でこの形（別ページの PDF へのリンク）になっている文書があり、その場合はここからは本文を読めません。`sourceUrl` を開いて確かめてください。国税局系の文書は `docId` が `tokyo/shotoku/260218` のように局名から始まります。
:::
