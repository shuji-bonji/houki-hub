::: warning 本文の大半は PDF なので、キーワードは題名に含まれる語で
文書回答事例は、国税庁のページに「照会」「回答」の見出しだけがあり、中身は PDF で提供されることが多いため、取り込んだ本文が題名と見出しだけになる文書があります。「適格請求書」「電子帳簿」では 0 件でしたが、題名にある「産科医療」では引けました（下の例）。本文の語で探したいときは、`hasPdf: true` で PDF 付きに絞り、`nta_inspect_pdf_meta` から pdf-reader-mcp で読んでください。
:::

::: details 呼び出し例 — 「産科医療の給付金の文書回答事例」
- 実測: v0.10.2（2026-09-08）
- ローカル DB: あり（`staleness: "outdated"` の警告付き）

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
      "issuedAt": null,
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/081102/index.htm",
      "snippet": "取引等に係る税務上の取扱い等に関する … ",
      "score": 0.480,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"]
    },
    {
      "docType": "bunshokaitou",
      "docId": "shotoku/250416",
      "taxonomy": "shotoku",
      "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
      "issuedAt": null,
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm",
      "score": 0.479 /* … */
    }
  ],
  "freshness": { "staleness": "outdated", "days_since_oldest": 127, "warning": "… `--bulk-download-bunshokaitou` を実行してください" /* … */ },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "文書回答事例は照会者・国税庁双方の合意に基づく個別事案回答であり、一般的な法的拘束力はない。同じ事案で同様の判断を期待することは可能だが、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

0 件のときは `results: []` と `hint`（「該当なし。`--bulk-download-bunshokaitou` で DB 投入済みか確認してください」）が返ります。DB が空なのか、語が本文に無いのかは、この応答だけでは区別できません。
:::
