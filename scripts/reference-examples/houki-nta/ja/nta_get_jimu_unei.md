::: details 呼び出し例 — 「酒税の書面添付制度の事務運営指針」（検索結果の 2 件目）
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`source: "db"`）

**引数**

```jsonc
{ "docId": "shozei/090401", "format": "json" }
```

**返る JSON（本文は抜粋）**

```jsonc
{
  "document": {
    "docType": "jimu-unei",
    "docId": "shozei/090401",
    "taxonomy": "shozei",
    "title": "酒税に関する書面添付制度の運用に当たっての基本的な考え方及び事務手続等について（事務運営指針）",
    "issuedAt": "2009-04-01",
    "issuer": "各国税局長 殿 沖縄国税事務所長 殿\n国税庁長官",
    "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/01.htm",
    "fetchedAt": "2026-09-07T20:51:36.147Z",
    "fullText": "課酒6-3 課総2-8 官総-38 平成21年4月1日 改正 平成22年6月11日 改正 平成24年12月19日 改正 令和6年3月27日\n各国税局長 殿 沖縄国税事務所長 殿\n国税庁長官\n標題のことについては、下記のとおり定めたから、平成21年7月10日以降、これにより適切な運営を図られたい。…\n（趣旨） 書面添付制度（税理士法（昭和26年法律第237号。以下「法」という。）の平成13年度改正により、…\n記\n…\n【第1章 書面添付制度の運用に当たっての基本的な考え方】\n【1 制度の適正・円滑な運用及び普及・定着の推進】\n…\n【第2章 書面添付制度に係る事務手続及び留意事項】\n【1 意見聴取の実施】\n…\n【5 更正前の意見聴取】",
    "attachedPdfs": [
      { "title": "別紙1(PDF/191KB)", "url": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/pdf/01.pdf", "sizeKb": 191 },
      { "title": "別紙2(PDF/158KB)", "url": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/pdf/02.pdf", "sizeKb": 158 }
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

`fullText` の 1 行目に文書番号と改正日が並びます。この例では平成 21 年に定め、令和 6 年 3 月 27 日まで 3 回改正されています。`issuedAt` は制定日で、最終改正日ではありません。最終改正がいつかは 1 行目から読んでください。

末尾の `【…】` は章・節の見出しです。様式（応接簿など）は `attachedPdfs` にあり、`nta_inspect_pdf_meta` に `docType: "jimu-unei"` を指定すると pdf-reader-mcp での読み方の例が返ります。
:::
