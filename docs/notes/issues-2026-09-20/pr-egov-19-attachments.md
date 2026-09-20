## 何をしたか

法令に付いた添付ファイル（別表・様式・別記の図。jpg / pdf）と、法令本文を 1 つのファイルにした xml / json / html / rtf / docx を取る 3 ツールを足しました（Closes #19、houki-hub#20 の機能 1）。設計は houki-hub の `docs/notes/2026-09-20-design-egov-19-attachments.md` です。

| ツール | 返すもの |
|---|---|
| `list_attachments` | 添付ファイルの一覧。各ファイルに認証なしで開ける `url` と `location`（「別表第一（第一条関係）」「附録第十一号様式」のような置き場所） |
| `get_attachment` | 添付 1 件（`src`）か zip（省略）。既定は URL とメタ情報だけ、`save: true` で保存して `saved.path` |
| `get_law_file` | 法令本文ファイル（`file_type`: xml / json / html / rtf / docx、`at` は e-Gov の asof）。既定は URL、`save: true` で保存 |

```
list_attachments(law_name="戸籍法施行規則")
  → 42 件（jpg 7・pdf 35）。location.title「附録第十一号様式」の pdf の url を pdf-reader-mcp の read_url に渡せる
get_attachment(law_name="戸籍法施行規則", src="./pict/2FH00000007000.pdf", save=true)
  → ~/.cache/houki-egov-mcp/files/322M40000010094_20260626_508M60000010043/2FH00000007000.pdf（37.5 KB）
get_law_file(law_name="民法", file_type="docx", save=true)
  → …/129AC0000000089_20260624_508AC0000000045.docx（182 KB）。saved.law_revision_id にどの履歴かが入る
```

## 決めたこと

- **中身は返さない**。base64 は使わず、URL（認証なしの直リンク）と、`save: true` のときだけ保存先の絶対パスを返す
- **保存先はサーバー側で決める**。`${XDG_CACHE_HOME:-~/.cache}/houki-egov-mcp/files/<law_revision_id>/`（環境変数 `HOUKI_EGOV_FILES_DIR` で変更）。ツールの引数にパスは無い。ファイル名は basename に丸め、50 MB 超は保存せず `INVALID_ARGUMENT`
- **置き場所を付ける**。e-Gov の `attached_files_info` には `src` と更新日時しか無いので、本文の `Fig` 要素の祖先（`AppdxTable` / `AppdxStyle` / `AppdxFormat` / `AppdxNote` / `Article` / `SupplProvision`）から見出し・関係条文・条番号を付ける
- **エラーコード `ATTACHMENT_NOT_FOUND`** を足した（`src` が無い / 添付が 1 件も無い / e-Gov が code 404003）。`list_attachments` で添付が無い法令は `count: 0` の成功応答

## 実測（2026-09-20）

- 国旗及び国歌に関する法律: jpg 2（別記第一・第二）。戸籍法施行規則: 42 件（別表 7・様式 22・書式 13）。いずれも `attached_files_info` と本文の `Fig` が 1 対 1 で一致。民法: 0 件
- e-Gov は jpg を `image/jpeg`、pdf と法令ファイルを `application/octet-stream` で返す。添付が無い履歴の `/attachment` は 400 または 404 で `{"code":"404003"}`
- 3 ツールとも実 API で保存まで確認（jpg 12.3 KB、pdf 37.5 KB、zip 50 KB、html 37.6 KB、rtf 1.8 MB）

## 変更

- `src/services/law-files.ts`（新規）: 3 ツールの本体。`src/services/file-store.ts`（新規）: 保存先
- `src/services/egov-client.ts`: `getAttachment()` / `getLawFile()`、`EgovHttpError.body` / `egovErrorCode()`、`attached_files_info` の型
- `src/services/law-tree.ts`: `extractFigures()`。`src/services/law-service.ts`: `fetchLawData` / `egovHttpErrorToLawError` / `checkAbbreviationScope` を export
- `src/config.ts`: `EGOV_API.attachment` / `lawFile`、`FILES_CONFIG`。`src/constants.ts`: `LAW_FILE_TYPES`。`src/errors.ts`: `ATTACHMENT_NOT_FOUND`
- `src/tools/definitions.ts` / `handlers.ts` / `types/index.ts`: 3 ツールの配線
- テスト 20 件を追加（`law-files.test.ts` 18、`file-store.test.ts` 2）。全 456 件が通る
- README / CHANGELOG / `docs/DESIGN.md`、版 0.15.0（package.json / server.json / plugin.json）

## 残り（別途）

- houki-research-skill: `docs/ERROR-CODES.md` に `ATTACHMENT_NOT_FOUND`、ツール表に 3 ツール
- houki-hub: `generate-stack.mjs` の note（11 → 14 tools）、ツールリファレンスと reference-examples、hub#21 の機能 1 のチェック
- claude-plugins の 0.15.0 追随

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01KdxoAKhWuWBktGny5d4pWd
