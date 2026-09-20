::: tip 条文に入らないものはここから
別表・様式・別記の図は `get_law` の Markdown には入りません（`Fig` 要素は落ちます）。届書の書式や旗の寸法図が要るときは、まずこのツールで一覧と URL を取ります。URL は認証なしで開けるので、pdf は pdf-reader-mcp の `read_url` にそのまま渡せます。
:::

::: details 呼び出し例 — 「国旗国歌法の日章旗の寸法図はどこにあるか」
- 実測: v0.15.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "国旗及び国歌に関する法律" }
```

**返る JSON**

```jsonc
{
  "meta": {
    "law_id": "411AC0000000127",
    "title": "国旗及び国歌に関する法律",
    "law_num": "平成十一年法律第百二十七号",
    "law_revision_id": "411AC0000000127_19990813_000000000000000",   // 添付ファイルはこの履歴に付く
    "retrieved_at": "2026-09-20T13:49:27.274Z",
    "url": "https://laws.e-gov.go.jp/law/411AC0000000127"
  },
  "count": 2,
  "attachments": [
    {
      "src": "./pict/H11HO127-001.jpg",                 // get_attachment の src にそのまま渡す
      "file_name": "H11HO127-001.jpg",
      "file_type": "jpg",
      "content_type": "image/jpeg",
      "url": "https://laws.e-gov.go.jp/api/2/attachment/411AC0000000127_19990813_000000000000000?src=.%2Fpict%2FH11HO127-001.jpg",
      "location": { "tag": "AppdxNote", "title": "別記第一", "related_article": "（第一条関係）" },   // 日章旗の制式
      "updated": "2024-07-25T00:20:13+09:00"
    },
    {
      "src": "./pict/H11HO127-002.jpg",
      "file_name": "H11HO127-002.jpg",
      "file_type": "jpg",
      "content_type": "image/jpeg",
      "url": "https://laws.e-gov.go.jp/api/2/attachment/411AC0000000127_19990813_000000000000000?src=.%2Fpict%2FH11HO127-002.jpg",
      "location": { "tag": "AppdxNote", "title": "別記第二", "related_article": "（第二条関係）" },   // 君が代の楽譜
      "updated": "2024-07-25T00:20:13+09:00"
    }
  ],
  "zip_url": "https://laws.e-gov.go.jp/api/2/attachment/411AC0000000127_19990813_000000000000000",
  "note": "国旗及び国歌に関する法律 の添付ファイル 2 件（jpg 2 件）。url は認証なしで開けます。",
  "next_actions": [
    {
      "action": "get_attachment",
      "reason": "1 件を保存するときは save: true を付ける（保存しないなら一覧の url をそのまま使えます）",
      "example": { "law_name": "国旗及び国歌に関する法律", "src": "./pict/H11HO127-001.jpg", "save": true }
    }
  ]
}
```

`location` は e-Gov の一覧（`attached_files_info`）には無い情報で、本文の `Fig` 要素がどの別表・様式の下にあるかから付けています。
:::

::: details 呼び出し例 — 「戸籍法施行規則の様式（届書の書式）を一覧で」
- 実測: v0.15.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "戸籍法施行規則" }
```

**返る JSON（抜粋）**

```jsonc
{
  "meta": { "law_id": "322M40000010094", "title": "戸籍法施行規則", "law_revision_id": "322M40000010094_20260626_508M60000010043", "…": "…" },
  "count": 42,
  "attachments": [
    {
      "src": "./pict/2JH00000247973.jpg", "file_type": "jpg", "content_type": "image/jpeg",
      "url": "https://laws.e-gov.go.jp/api/2/attachment/322M40000010094_20260626_508M60000010043?src=.%2Fpict%2F2JH00000247973.jpg",
      "location": { "tag": "AppdxTable", "title": "別表第二", "related_article": "（第三十条の二関係）" },
      "updated": "2026-07-15T10:10:29+09:00"
    },
    // … jpg 7 件
    {
      "src": "./pict/2FH00000007000.pdf", "file_type": "pdf", "content_type": "application/pdf",
      "url": "https://laws.e-gov.go.jp/api/2/attachment/322M40000010094_20260626_508M60000010043?src=.%2Fpict%2F2FH00000007000.pdf",
      "location": { "tag": "AppdxStyle", "title": "附録第一号様式", "related_article": "戸籍（第一条関係）" },
      "updated": "2026-07-15T10:10:24+09:00"
    },
    {
      "src": "./pict/2FH00000076885.pdf", "file_type": "pdf", "content_type": "application/pdf",
      "url": "https://laws.e-gov.go.jp/api/2/attachment/322M40000010094_20260626_508M60000010043?src=.%2Fpict%2F2FH00000076885.pdf",
      "location": { "tag": "AppdxStyle", "title": "附録第十一号様式", "related_article": "出生の届書（日本産業規格Ａ列四番）（第五十九条関係）" },
      "updated": "2026-07-15T10:10:24+09:00"
    }
    // … pdf 35 件（別表 7・様式 22・書式 13）
  ],
  "note": "戸籍法施行規則 の添付ファイル 42 件（jpg 7 件、pdf 35 件）。url は認証なしで開けます。",
  "next_actions": [
    { "action": "get_attachment", "reason": "…", "example": { "law_name": "戸籍法施行規則", "src": "./pict/2JH00000247973.jpg", "save": true } },
    { "action": "pdf-reader-mcp:read_url", "reason": "pdf の添付は pdf-reader-mcp の read_url に url を渡すと本文を読めます", "example": { "url": "https://laws.e-gov.go.jp/api/2/attachment/322M40000010094_20260626_508M60000010043?src=.%2Fpict%2F2FH00000007000.pdf" } }
  ]
}
```

`location.title` で「附録第十一号様式」を選び、その `url` を pdf-reader-mcp の `read_url` に渡せば出生届の書式が読めます。添付が無い法令（民法）では `count: 0` の成功応答で、エラーにはなりません。
:::
