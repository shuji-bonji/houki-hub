::: tip 既定ではファイルを取りません
`save` を付けないと e-Gov の `/attachment` は呼ばず、URL と置き場所だけを返します。URL は `list_attachments` にも入っているので、保存したいときだけこのツールを `save: true` で呼びます。保存先はサーバー側で決まり（既定 `${XDG_CACHE_HOME:-~/.cache}/houki-egov-mcp/files/<law_revision_id>/`、環境変数 `HOUKI_EGOV_FILES_DIR` で変更）、引数では指定できません。
:::

::: details 呼び出し例 — 「日章旗の寸法図をディスクに置く」
- 実測: v0.15.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "国旗及び国歌に関する法律", "src": "./pict/H11HO127-001.jpg", "save": true }
```

**返る JSON**

```jsonc
{
  "meta": { "law_id": "411AC0000000127", "title": "国旗及び国歌に関する法律", "law_revision_id": "411AC0000000127_19990813_000000000000000", "…": "…" },
  "kind": "file",                                   // src を省くと "zip"
  "src": "./pict/H11HO127-001.jpg",
  "file_name": "H11HO127-001.jpg",
  "file_type": "jpg",
  "content_type": "image/jpeg",
  "url": "https://laws.e-gov.go.jp/api/2/attachment/411AC0000000127_19990813_000000000000000?src=.%2Fpict%2FH11HO127-001.jpg",
  "location": { "tag": "AppdxNote", "title": "別記第一", "related_article": "（第一条関係）" },
  "updated": "2024-07-25T00:20:13+09:00",
  "saved": {
    "path": "/Users/you/.cache/houki-egov-mcp/files/411AC0000000127_19990813_000000000000000/H11HO127-001.jpg",
    "bytes": 12614,
    "response_content_type": "image/jpeg"           // e-Gov の応答ヘッダー。pdf は application/octet-stream で返る
  },
  "note": "H11HO127-001.jpg（12.3 KB）を /Users/you/.cache/houki-egov-mcp/files/411AC0000000127_19990813_000000000000000/H11HO127-001.jpg に保存しました。"
}
```

`src` はファイル名だけ（`"H11HO127-001.jpg"`）でも引けます。pdf を保存したときは `next_actions` に pdf-reader-mcp の `read_text`（`path` 付き）が入ります。
:::

::: details 呼び出し例 — 一覧に無い `src` を渡したとき（`ATTACHMENT_NOT_FOUND`）
- 実測: v0.15.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "国旗及び国歌に関する法律", "src": "nope.jpg" }
```

**返る JSON**

```jsonc
{
  "error": "添付ファイルが見つかりません: nope.jpg（国旗及び国歌に関する法律、履歴 411AC0000000127_19990813_000000000000000）",
  "code": "ATTACHMENT_NOT_FOUND",
  "hint": "この履歴の添付ファイル 2 件: ./pict/H11HO127-001.jpg, ./pict/H11HO127-002.jpg",
  "next_actions": [
    { "action": "list_attachments", "reason": "添付ファイルの一覧から src を選び直せます", "example": { "law_name": "国旗及び国歌に関する法律" } }
  ]
}
```

添付が 1 件も無い法令（民法）で呼んだときも `ATTACHMENT_NOT_FOUND` です。一覧にはあるのに e-Gov の `/attachment` が「存在しない」（code 404003）を返したときも同じ code で、`detail.cause` に e-Gov の応答本文が入ります。
:::
