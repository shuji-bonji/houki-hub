::: details 呼び出し例 — 「改正通達 0025004-026 の PDF は、どれをどう読めばよいか」
- 実測: v0.20.0（2026-09-21）
- ローカル DB: あり

**引数**

```jsonc
{ "docType": "kaisei", "docId": "0025004-026" }
```

**返る JSON**（`layout_note` は先頭の 1 件だけ載せ、他は `…` で省略。3 件とも同じ文）

```jsonc
{
  "docType": "kaisei",
  "docId": "0025004-026",
  "title": "消費税法基本通達の一部改正について（法令解釈通達）",
  "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
  "attachedPdfs": [
    {
      "title": "別紙1（PDF/221KB）",
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf",
      "sizeKb": 221,
      "kind": "comparison",
      "read_strategy": "tables",
      "layout_note": "改正後と改正前を左右 2 列に並べた表。国税庁の新旧対照表は左が改正後、右が改正前のことが多いが、見出し行で確かめる。変更箇所には下線が引かれる。改正前の側の「（同左）」は改正後と同じ文、両側の「（省略）」は改正に関係しない部分の省略。新設・削除の印は丸括弧「（新設）」「（削除）」のものと、墨付き括弧「【新設】」「【削除】」「【一部改正】」（改正前にもある項で内容が変わったもの）のものの 2 通りがある。どちらも新設の印は改正前の側、削除の印は改正後の側に置かれる。改正通達の「別紙 N」は本文の新旧対照表、「【参考】…対応表」は章の構成（通達番号）の対応表のことがある。表として取れるなら表で、取れないなら左右 2 列に分けて読む（1 列として読むと改正後と改正前の文が混ざる）"
    },
    { "title": "別紙2（PDF/449KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf", "sizeKb": 449, "kind": "comparison", "read_strategy": "tables", "layout_note": "…" },
    { "title": "【参考】… 新旧対応表 …（PDF/399KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf", "sizeKb": 399, "kind": "comparison", "read_strategy": "tables", "layout_note": "…" }
  ],
  "next_actions": [
    {
      "action": "pdf-reader-mcp:read_url",
      "reason": "新旧対照表を URL のまま本文として読む。左右の列が混ざらないよう split_columns: 2 を付ける。表として取るには、この tool を save: true で呼び直して saved[].path を extract_tables に渡す",
      "example": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf", "split_columns": 2 }
    },
    {
      "action": "read_pdf",
      "reason": "pdf-reader-mcp が無いときは、使っている PDF 読み取りツールに url（save: true で保存したときは path）を渡す。読み方は attachedPdfs[].read_strategy と layout_note のとおり",
      "example": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf" }
    }
  ],
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`attachedPdfs[].kind` は PDF のタイトルから分類したもので、`read_strategy` と `layout_note` はその kind に応じた読み方です。道具の名前を含まないので、pdf-reader-mcp 以外の PDF 読み取りツールでもそのまま使えます。`next_actions` は kind ごとに 1 件（同じ kind が複数あれば先頭の PDF）と、最後に pdf-reader-mcp が無い環境向けの `read_pdf` が付きます。`save` を付けていないので、pdf-reader-mcp 向けの例は URL のまま読む `read_url` です。本文は含まないので、全文が要るときは `nta_get_kaisei_tsutatsu` を使います。

「別紙1」「別紙2」は本文の新旧対照表で、「【参考】… 新旧対応表」は第 8 章の通達番号の対応表です。v0.20.0 から、改正通達（kaisei）でタイトルが「別紙」と番号だけの PDF は `comparison` として返します（[houki-nta-mcp#44](https://github.com/shuji-bonji/houki-nta-mcp/issues/44)）。v0.19.0 では別紙 1・2 が `attachment` になり、`kind: "comparison"` で絞ると参考の対応表だけが返っていました。DB の中身は変えていないので、再投入は要りません。

v0.18.3 までは `next_actions` の代わりに `reader_hints` が付いていました。その `examples[].args` は `{ "url": … }` で `extract_tables` を指していましたが、pdf-reader-mcp の `extract_tables` は `file_path` しか受け取らないため、そのままでは呼べませんでした。
:::

::: details 呼び出し例 — 「新旧対照表だけを保存して、表として取る」
- 実測: v0.20.0（2026-09-21）
- ローカル DB: あり

**引数**

```jsonc
{ "docType": "kaisei", "docId": "0025004-026", "kind": "comparison", "save": true }
```

**返る JSON**（`attachedPdfs` と `legal_status` は上と同じなので省略。保存先は既定の `~/.cache` の形で書いた）

```jsonc
{
  "docType": "kaisei",
  "docId": "0025004-026",
  "attachedPdfs": [ { "kind": "comparison", "read_strategy": "tables", "…": "…" }, { "…": "…" }, { "…": "…" } ],
  "saved": [
    {
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf",
      "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/01.pdf",
      "bytes": 225944,
      "cached": true
    },
    {
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf",
      "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/02.pdf",
      "bytes": 459477,
      "cached": true
    },
    {
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf",
      "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/b0025003-111.pdf",
      "bytes": 408826,
      "cached": true
    }
  ],
  "next_actions": [
    {
      "action": "pdf-reader-mcp:extract_tables",
      "reason": "新旧対照表を表として取る。タグ付き PDF なら行と列がそのまま返る。表が 0 件（タグ無し）なら read_text に split_columns: 2 を付けて同じ file_path を読む",
      "example": { "file_path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/01.pdf" }
    },
    {
      "action": "read_pdf",
      "reason": "pdf-reader-mcp が無いときは、使っている PDF 読み取りツールに url（save: true で保存したときは path）を渡す。読み方は attachedPdfs[].read_strategy と layout_note のとおり",
      "example": {
        "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf",
        "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/01.pdf"
      }
    }
  ]
}
```

`kind: "comparison"` で新旧対照表 3 件（別紙 1・別紙 2・参考の対応表）に絞り、`save: true` でサーバー側の保存先（`HOUKI_NTA_FILES_DIR`、無ければ `${XDG_CACHE_HOME:-~/.cache}/houki-nta-mcp/files/<docType>/<docId>/`）に置きます。`saved[].path` は絶対パスで返るので、`next_actions[0].example` をそのまま pdf-reader-mcp の `extract_tables` に渡せます。`next_actions` は kind ごとに 1 件なので、`example` に入るのは先頭の別紙 1 だけです。別紙 2 と参考の対応表は `saved[1].path` / `saved[2].path` を同じ `extract_tables` に渡します。上の実測は同じ PDF を前に保存していたので `saved[].cached` が `true` になっています。初めて呼んだときは取得して `false` になり、同じ引数でもう一度呼ぶと再取得はせず `true` になります。取得に失敗した PDF は `saved[].path` が `null` になり、`error`（`HTTP 404`、`PDF ではありません（Content-Type: text/html）` など）と、`note` に件数が入ります。その PDF は URL のまま読みます。

別紙 1（本文の新旧対照表）はタグ付きなので `extract_tables` が見出し行「改正後 | 改正前」の表を返します。参考の対応表はタグ無しで `extract_tables` が 0 件になるので、`read_text` に `split_columns: 2` を付けて同じ `file_path` を読みます。新旧対照表から改正点を取り出す手順（左右どちらが改正後かを見出し行で確かめる、「（同左）」「（省略）」「（新設）」「（削除）」と「【新設】」「【削除】」「【一部改正】」の扱い）は houki-research-skill の鉄則 3 にあります。
:::
