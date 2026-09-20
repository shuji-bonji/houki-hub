::: tip 条文を読むなら get_law / get_law_range
`xml` / `json` は法令全体で、民法は 1.6 MB あります。条文を読むだけなら `get_law`（1 条）か `get_law_range`（章・節）のほうが小さく済みます。このツールは、人が Word やブラウザーで開く版（`docx` / `html` / `rtf`）が要るときと、法令標準 XML をそのまま処理したいときのものです。
:::

::: details 呼び出し例 — 「民法の全文を Word で」（URL だけ）
- 実測: v0.15.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "民法", "file_type": "docx" }
```

**返る JSON**

```jsonc
{
  "meta": {
    "law_id": "129AC0000000089",
    "title": "民法",
    "law_num": "明治二十九年法律第八十九号",
    "retrieved_at": "2026-09-20T13:49:48.560Z",
    "url": "https://laws.e-gov.go.jp/law/129AC0000000089"
  },
  "file_type": "docx",
  "content_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "url": "https://laws.e-gov.go.jp/api/2/law_file/docx/129AC0000000089",     // 認証なしで開ける
  "note": "民法 の本文を docx で取る URL です。認証なしで開けます（現時点で最新の履歴）。ファイルをディスクに置くには save: true を付けてください（/Users/you/.cache/houki-egov-mcp/files 以下に保存します）。"
}
```

`save` を付けないと e-Gov には法令名の解決（`/laws`）しか問い合わせません。`at` を付けると URL に `?asof=YYYY-MM-DD` が付き、その時点以前で最新の履歴の本文になります。
:::

::: details 呼び出し例 — 「2020 年 4 月 1 日時点の国旗国歌法を HTML で保存」
- 実測: v0.15.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "国旗及び国歌に関する法律", "file_type": "html", "at": "2020-04-01", "save": true }
```

**返る JSON（抜粋）**

```jsonc
{
  "meta": { "law_id": "411AC0000000127", "title": "国旗及び国歌に関する法律", "at": "2020-04-01", "…": "…" },
  "file_type": "html",
  "content_type": "text/html",
  "url": "https://laws.e-gov.go.jp/api/2/law_file/html/411AC0000000127?asof=2020-04-01",
  "saved": {
    "path": "/Users/you/.cache/houki-egov-mcp/files/411AC0000000127_19990813_000000000000000/411AC0000000127_19990813_000000000000000.html",
    "bytes": 38537,
    "file_name": "411AC0000000127_19990813_000000000000000.html",   // e-Gov の Content-Disposition のまま
    "law_revision_id": "411AC0000000127_19990813_000000000000000"    // ファイル名から分かる「どの履歴の本文か」
  },
  "note": "411AC0000000127_19990813_000000000000000.html（37.6 KB）を … に保存しました。"
}
```

保存すると e-Gov のファイル名から法令履歴 ID が取れます（URL だけのときは分かりません）。実測では民法の docx が 182 KB、消費税法の rtf が 1.8 MB でした。1 ファイル 50 MB を超えるときは保存せず `INVALID_ARGUMENT` を返します。
:::
