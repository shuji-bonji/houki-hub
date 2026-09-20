# 設計メモ: 添付ファイルと法令本文ファイルをどう出すか（egov#19）

対象リポジトリ: houki-egov-mcp（`houki-hub/mcp/houki-egov-mcp`、2026-09-20 JST 作成）
ブランチ: `feat/19-attachments`
版の案: **v0.15.0**（ツールを 3 本足すので minor）
出典: [egov#19](https://github.com/shuji-bonji/houki-egov-mcp/issues/19) / houki-hub#20 の機能 1（添付ファイルと法令ファイル形式）/ houki-hub#21

---

## 1. 何が空いていたか

houki-egov-mcp は e-Gov 法令API v2 のうち `/laws`・`/law_data`・`/law_revisions` だけを使っていました。API には他に 2 つの道があります。

| エンドポイント | 返すもの | 例 |
|---|---|---|
| `GET /attachment/{law_revision_id}?src=…` | 法令に付いた添付ファイル 1 件（jpg / pdf）。`src` を省くと zip | 国旗及び国歌に関する法律の別記第一（日章旗の寸法図）、戸籍法施行規則の附録第十一号様式（出生届） |
| `GET /law_file/{xml\|json\|html\|rtf\|docx}/{law_id}?asof=` | 法令本文を 1 つのファイルにしたもの | 民法の docx（182 KB）、xml（1.6 MB） |

`get_law` の Markdown は本文の文字列だけで、`Fig` 要素（図）は落ちます。様式の図が要る作業（届書の書式を確かめる、旗の寸法を見る）は条文だけでは済まず、kannkyo/e-gov-law-mcp にはある道が無い、というのが houki-hub#20 の指摘でした。

## 2. 実測で分かったこと（2026-09-20）

| 項目 | 値 |
|---|---|
| 添付の一覧 | `/law_data` の `attached_files_info.attached_files[]`。1 件は `law_revision_id` / `src`（`./pict/H11HO127-001.jpg`）/ `updated` の 3 つだけ |
| 置き場所 | 一覧には無い。本文の木を歩くと `Fig@src` が `AppdxNote`（別記）/ `AppdxTable`（別表）/ `AppdxStyle`（様式）/ `AppdxFormat`（書式）の下にあり、見出し（`AppdxStyleTitle`）と関係条文（`RelatedArticleNum`）が兄弟にある |
| 一致 | 国旗国歌法 2 件、戸籍法施行規則 42 件（jpg 7・pdf 35）とも、一覧と本文の `Fig` は 1 対 1 で一致 |
| Content-Type | jpg は `image/jpeg`。pdf と法令ファイルは `application/octet-stream`（種別は拡張子で決めるしかない） |
| Content-Disposition | 法令ファイルは `attachment; filename="<law_revision_id>.docx"`。ここから履歴 ID が分かる |
| 添付が無い履歴 | `/attachment` は **400 または 404** で `{"code":"404003","message":"指定のパラメータで取得できる添付ファイルは存在しません。"}`。同じ code が 2 つのステータスで返る |
| law_revision_id の誤り | 400 で `{"code":"400039"}` |
| 認証 | 不要。URL をそのまま開ける |
| サイズ | 添付は 12 KB〜数十 KB。法令ファイルは民法 xml 1.6 MB・docx 182 KB、消費税法 rtf 1.8 MB |

## 3. 決めたこと

### 3-1. 3 ツールに分けた（ユーザー判断、2026-09-20）

| 案 | 判断 |
|---|---|
| A. `list_attachments` / `get_attachment` / `get_law_file` の 3 本 | **採用** |
| B. `get_attachments`（`src` 省略で一覧、指定で 1 件）と `get_law_file` の 2 本 | 見送り。1 ツールの応答が 2 形になる |
| C. `get_law` に `with_attachments` と `format: xml/html/…` を足す | 見送り。応答の形が条文と違う（#22 で `get_law_range` を別ツールにしたのと同じ理由） |

### 3-2. 中身は返さず、URL を返す。保存は `save: true` のときだけ（ユーザー判断、同日）

| 案 | 判断 | 理由 |
|---|---|---|
| URL とメタ情報だけ | **既定** | 認証なしの直リンクなので pdf-reader-mcp の `read_url` と利用者のブラウザーにそのまま渡せる。応答が小さい |
| サーバー側の保存先に書いてパスを返す | **`save: true` のときだけ** | ディスクに置きたい作業（Word で開く、pdf-reader-mcp の `read_text`）のため |
| base64 で応答に入れる | 採らない | 1.6 MB を LLM のコンテキストに入れる意味が無い。text 応答の base64 は画像としても読めない |
| MCP の image コンテンツで jpg を返す | 今回は採らない | `server.ts` の応答の組み立てを text 以外に広げる変更になる。要るなら別 Issue |
| 保存先を引数で受ける（kannkyo と同じ） | 採らない | LLM が渡した文字列をパスに使わない |

保存先は `${XDG_CACHE_HOME:-~/.cache}/houki-egov-mcp/files/<law_revision_id>/<ファイル名>`（bulk DB `laws.db` と同じ親）。上書きは環境変数 `HOUKI_EGOV_FILES_DIR` だけ。ファイル名は `basename` に丸め（`../` は残らない）、1 ファイル 50 MB を超えたら保存せず `INVALID_ARGUMENT`。

`get_attachment` は `save` が無いと `/attachment` を呼びません（`/law_data` は引く。一覧に無い `src` を弾くため）。`get_law_file` は `save` が無いと法令名の解決だけで、`/law_data` も引きません。

### 3-3. 置き場所（location）を付ける

`attached_files_info` だけでは「別表第一の図か、第十一号様式の図か」が分からないので、本文の木の祖先から付けます。

| 図がある場所 | `location` |
|---|---|
| 別表・別記・様式・書式・別図・付録（`Appdx*`） | `tag`（要素名）、`title`（見出し）、`related_article`（関係条文）|
| 条の中 | `tag: "Article"`、`article`（e-Gov 形式の条番号）、`title`（条見出し） |
| 附則の項の中 | `tag: "SupplProvision"`、`amend_law_num` |
| 附則の中の別表 | 上の `Appdx*` に `amend_law_num` を足す |

一覧にだけあって本文の `Fig` に無いファイルは `location: null` にし、`note` に件数を書きます（実測ではゼロでしたが、e-Gov 側の収録のずれに備えて）。

### 3-4. エラーコード `ATTACHMENT_NOT_FOUND` を足す

| 場面 | code |
|---|---|
| `get_attachment` の `src` がその履歴の添付に無い | `ATTACHMENT_NOT_FOUND`（`hint` に候補、`next_actions` に `list_attachments`） |
| 添付が 1 件も無い法令で `get_attachment` | `ATTACHMENT_NOT_FOUND`（`next_actions` に `get_law_revisions`。別の時点には付いていることがある） |
| e-Gov の `/attachment` が `404003` | `ATTACHMENT_NOT_FOUND`（`detail.cause` に e-Gov の本文） |
| 添付が無い法令で `list_attachments` | エラーにせず `count: 0` の成功応答 |

family の語彙の正典は houki-research-skill の `docs/ERROR-CODES.md` なので、そちらへの追記が要ります（#22 の `RANGE_NOT_FOUND` と同じ手順）。

## 4. 応答の形

```jsonc
// list_attachments({ law_name: "国旗及び国歌に関する法律" })
{
  "meta": { "law_id": "411AC0000000127", "title": "国旗及び国歌に関する法律",
            "law_revision_id": "411AC0000000127_19990813_000000000000000", "url": "https://laws.e-gov.go.jp/law/411AC0000000127" },
  "count": 2,
  "attachments": [
    { "src": "./pict/H11HO127-001.jpg", "file_name": "H11HO127-001.jpg", "file_type": "jpg", "content_type": "image/jpeg",
      "url": "https://laws.e-gov.go.jp/api/2/attachment/411AC0000000127_19990813_000000000000000?src=.%2Fpict%2FH11HO127-001.jpg",
      "location": { "tag": "AppdxNote", "title": "別記第一", "related_article": "（第一条関係）" },
      "updated": "2024-07-25T00:20:13+09:00" }
  ],
  "zip_url": "https://laws.e-gov.go.jp/api/2/attachment/411AC0000000127_19990813_000000000000000",
  "note": "国旗及び国歌に関する法律 の添付ファイル 2 件（jpg 2 件）。url は認証なしで開けます。",
  "next_actions": [{ "action": "get_attachment", "example": { "law_name": "…", "src": "./pict/H11HO127-001.jpg", "save": true } }]
}

// get_attachment({ law_name: "戸籍法施行規則", src: "./pict/2FH00000007000.pdf", save: true })
{
  "kind": "file", "file_type": "pdf", "content_type": "application/pdf",
  "location": { "tag": "AppdxStyle", "title": "附録第一号様式", "related_article": "戸籍（第一条関係）" },
  "saved": { "path": "~/.cache/houki-egov-mcp/files/322M40000010094_20260626_508M60000010043/2FH00000007000.pdf",
             "bytes": 38403, "response_content_type": "application/octet-stream" },
  "next_actions": [{ "action": "pdf-reader-mcp:read_text", "example": { "path": "…/2FH00000007000.pdf" } }]
}

// get_law_file({ law_name: "民法", file_type: "docx" })  ← save なし
{ "file_type": "docx", "url": "https://laws.e-gov.go.jp/api/2/law_file/docx/129AC0000000089",
  "content_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "note": "民法 の本文を docx で取る URL です。認証なしで開けます（現時点で最新の履歴）。…" }
```

## 5. 残したこと

- `get_law` / `get_law_range` の Markdown に図の印（`![別記第一](url)`）を入れる。formatter が `law_revision_id` を知らないため今回は入れていない。要るなら別 Issue
- jpg を MCP の image コンテンツで返す（3-2）
- houki-research-skill: `docs/ERROR-CODES.md` に `ATTACHMENT_NOT_FOUND`、SKILL.md の family ツール表に 3 ツール、`feasibility-check` に「様式の図は `list_attachments` → pdf-reader-mcp」の 1 手
- houki-hub: `scripts/generate-stack.mjs` の egov の note（「11 tools」→ 14）、ツールリファレンスの再生成、reference-examples に 3 ツールの呼び出し例、hub#21 の機能 1 のチェック
- claude-plugins の egov 0.15.0 追随

## 6. 実測に使った法令

| 法令 | law_id | 添付 |
|---|---|---|
| 国旗及び国歌に関する法律 | 411AC0000000127 | jpg 2（別記第一・第二） |
| 戸籍法施行規則 | 322M40000010094 | jpg 7・pdf 35（別表 7・様式 22・書式 13） |
| 民法 | 129AC0000000089 | 0 |
| 消費税法 | 363AC0000000108 | 0（rtf 1.8 MB の実測に使用） |
