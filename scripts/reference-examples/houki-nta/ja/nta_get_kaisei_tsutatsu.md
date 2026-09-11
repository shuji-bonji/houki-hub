::: details 呼び出し例 — 「令和 7 年 4 月 1 日の消基通改正の本文と添付 PDF」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`source: "db"`）

**引数**

```jsonc
{ "docId": "0025004-026", "format": "json" }
```

**返る JSON**

```jsonc
{
  "document": {
    "docType": "kaisei",
    "docId": "0025004-026",
    "taxonomy": "shohi",
    "title": "消費税法基本通達の一部改正について（法令解釈通達）",
    "issuedAt": "2025-04-01",
    "issuer": "各国税局長 殿 沖縄国税事務所長 殿 各税関長 殿 沖縄地区税関長 殿\n国税庁長官 （官印省略）",
    "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
    "fetchedAt": "2026-09-07T20:49:03.281Z",
    "fullText": "課消2-4 課総11-10 … 令和7年4月1日\n…\n記\n1 消費税法基本通達について、別紙1「消費税法基本通達新旧対照表」の「改正前」欄に掲げる部分を「改正後」欄に掲げる部分のとおり改めることとし、令和7年4月1日から適用する。\n2 … 別紙2 … 令和8年11月1日から適用する。\n…",
    "attachedPdfs": [
      { "title": "別紙1（PDF/221KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf", "sizeKb": 221 },
      { "title": "別紙2（PDF/449KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf", "sizeKb": 449 },
      { "title": "【参考】令和８年11月１日から適用される「消費税法基本通達（第８章）」の構成及び新旧対応表（令和７年４月１日）（PDF/399KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf", "sizeKb": 399 }
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

本文は「別紙のとおり改める」までで、改正の中身は `attachedPdfs` の新旧対照表にあります。PDF の読み方は `nta_inspect_pdf_meta` が返す `reader_hints` を参照してください。この例では別紙 1 が令和 7 年 4 月 1 日から、別紙 2 が令和 8 年 11 月 1 日から適用と、適用日が 2 つに分かれています。
:::

::: details 呼び出し例 — 「docId を打ち間違えたとき」
- 実測: v0.14.1（2026-09-12）
- ローカル DB: あり（改正通達 118 件）

**引数**

```jsonc
{ "docId": "0025004-999" }
```

**返る JSON**（`isError: true`）

```jsonc
{
  "error": "改正通達 docId=\"0025004-999\" は見つかりません",
  "code": "TSUTATSU_NOT_FOUND",
  "hint": "DB の改正通達 118 件に、この docId はありません。available_doc_ids（新しい順に 30 件）から選ぶか、nta_search_kaisei_tsutatsu で検索して docId を確かめてください。DB を投入した後に国税庁が公開した文書は、`houki-nta-mcp --bulk-download-kaisei` をもう一度実行すると取り込めます",
  "next_actions": [
    { "action": "nta_search_kaisei_tsutatsu", "reason": "キーワード検索で正しい docId を探せます" }
  ],
  "available_doc_ids": [
    { "docId": "260807", "title": "法人税基本通達等の一部改正について（法令解釈通達）", "issuedAt": "2026-08-07" },
    { "docId": "0026003-067", "title": "消費税法基本通達の一部改正について（法令解釈通達）", "issuedAt": "2026-04-01" },
    { "docId": "0025004-026", "title": "消費税法基本通達の一部改正について（法令解釈通達）", "issuedAt": "2025-04-01" }
    // … 新しい順に 30 件
  ],
  "tool": "nta_get_kaisei_tsutatsu"
}
```

`available_doc_ids` には題名と発出日が入るので、探していた改正（この例では令和 7 年 4 月 1 日の消基通改正）を選び直せます。

改正通達が DB に 1 件も入っていないときは、同じ `code` でも中身が変わります。`error` が「ローカル DB に改正通達が 1 件も無いため、docId=… を取得できません」になり、`next_actions[0].action` が `cli_bulk_download`（`example.command` は `houki-nta-mcp --bulk-download-kaisei`）、`hint` に MCP サーバーが開いている DB ファイルのパスが入り、`available_doc_ids` は付きません。`next_actions[0].action` を見れば、投入が必要なのか docId が誤っているのかを区別できます（v0.14.1 から）。

`nta_get_jimu_unei` と `nta_get_bunshokaitou` も同じ形で返します。
:::
