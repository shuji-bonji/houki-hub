::: details 呼び出し例 — 「消基通 1-7-2（登録番号の構成）の本文」
- 実測: v0.10.2（2026-09-08）
- ローカル DB: あり（`source: "db"`。無ければ国税庁サイトから取得し `source` が `"live"` になります）

**引数**

```jsonc
{ "name": "消基通", "clause": "1-7-2", "format": "json" }
```

**返る JSON**

```jsonc
{
  "tsutatsu": "消費税法基本通達",
  "clause": {
    "clauseNumber": "1-7-2",
    "title": "登録番号の構成",
    "paragraphs": [
      { "indent": 1, "text": "適格請求書発行事業者登録簿（法第57条の2第4項《適格請求書発行事業者の登録等》に規定する「適格請求書発行事業者登録簿」をいう。…）に登載する登録番号（…）は、次の区分に応じ、それぞれ次によるものとする。（令5課消2-9により追加、令7課消2-4により改正）" },
      { "indent": 2, "text": "(1) 法人番号を有する課税事業者 法人番号（…）及びその前に付されたローマ字の大文字Ｔにより構成されるもの" },
      { "indent": 2, "text": "(2) (1)以外の課税事業者 13桁の数字（法人番号と重複しないものとし、…）及びその前に付されたローマ字の大文字Ｔにより構成されるもの" }
    ],
    "fullText": "登録番号の構成\n適格請求書発行事業者登録簿（…"
  },
  "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/01/07.htm",
  "fetchedAt": "2026-09-07T11:47:23.588Z",
  "source": "db",
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

引用するときは「消費税法基本通達 1-7-2」と `sourceUrl` を添え、`legal_status.binds_citizens: false`（通達は国民を拘束しない）を回答に残してください。`name` に法令名（「消費税法」）を渡すと、`OUT_OF_SCOPE` で houki-egov-mcp への案内が返ります。
:::
