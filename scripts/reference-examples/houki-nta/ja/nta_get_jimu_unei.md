::: details 呼び出し例 — 「書面添付制度の事務運営指針（法人税）の本文と別紙」
- 実測: v0.10.2（2026-09-08）
- ローカル DB: あり（`source: "db"`）

**引数**

```jsonc
{ "docId": "hojin/090401-2", "format": "json" }
```

**返る JSON（抜粋）**

```jsonc
{
  "document": {
    "docType": "jimu-unei",
    "docId": "hojin/090401-2",
    "taxonomy": "hojin",
    "title": "調査課における書面添付制度の運用に当たっての基本的な考え方及び事務手続等について（事務運営指針）",
    "issuedAt": "2009-04-01",
    "issuer": "各国税局長 殿 沖縄国税事務所長 殿\n国税庁長官",
    "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/01.htm",
    "fetchedAt": "2026-05-03T01:59:35.872Z",
    "fullText": "査調2-24 官総6-36 課法4-9 平成21年4月1日 改正 平成22年6月11日 改正 平成24年12月19日 改正 令和6年3月26日\n…\n（趣旨） 書面添付制度（税理士法（昭和26年法律第237号。…）の平成13年度改正により、…\n記\n…\n【第1章 書面添付制度の運用に当たっての基本的な考え方】\n…",
    "attachedPdfs": [
      { "title": "別紙1(PDF/67KB)", "url": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/pdf/01.pdf", "sizeKb": 67 },
      { "title": "別紙2（PDF/126KB）", "url": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/pdf/02.pdf", "sizeKb": 126 },
      { "title": "別紙3(PDF/140KB)", "url": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/pdf/03.pdf", "sizeKb": 140 }
    ]
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "source": "db"
}
```

`fullText` の先頭行に文書番号と改正日（この例では平成 21 年制定、令和 6 年 3 月 26 日まで 3 回改正）が入ります。別紙の様式は `attachedPdfs` にあり、`nta_inspect_pdf_meta` で `docType: "jimu-unei"` を指定すると読み方の例が返ります。
:::
