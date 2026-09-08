::: details 呼び出し例 — 「改正通達 0025004-026 の PDF を pdf-reader-mcp でどう読むか」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり

**引数**

```jsonc
{ "docType": "kaisei", "docId": "0025004-026" }
```

**返る JSON**

```jsonc
{
  "docType": "kaisei",
  "docId": "0025004-026",
  "title": "消費税法基本通達の一部改正について（法令解釈通達）",
  "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
  "attachedPdfs": [
    { "title": "【参考】… 新旧対応表 …（PDF/399KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf", "sizeKb": 399, "kind": "comparison" },
    { "title": "別紙1（PDF/221KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf", "sizeKb": 221, "kind": "attachment" },
    { "title": "別紙2（PDF/449KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf", "sizeKb": 449, "kind": "attachment" }
  ],
  "reader_hints": {
    "tool": "@shuji-bonji/pdf-reader-mcp",
    "primary_action": "extract_tables",
    "min_pdf_reader_version": "0.3.0",
    "note": "本文取得は pdf-reader-mcp に委譲（責務分離）。comparison / attachment は extract_tables (v0.3.0+) で表構造を保持したまま抽出するのが最優先。それ以外は read_text。…",
    "examples": [
      { "kind": "comparison", "tool": "extract_tables", "args": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf" }, "note": "extract_tables で改正後/改正前の差分を表として抽出するのが最優先。失敗時は read_text に fallback。" },
      { "kind": "attachment", "tool": "extract_tables", "args": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf" }, "note": "extract_tables で表組みの別紙・別表・様式を構造化抽出。…" }
    ]
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`attachedPdfs[].kind` は PDF のタイトルから分類したもので、`comparison`（新旧対照表）と `attachment`（別紙・別表）は表として読むのが向いています。`reader_hints.examples[].args` をそのまま pdf-reader-mcp の `extract_tables` に渡せます。本文は含まないので、全文が要るときは `nta_get_kaisei_tsutatsu` を使います。
:::
