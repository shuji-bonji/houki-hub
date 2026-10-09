---
title: "houki-egov-mcp の仕様"
description: "houki-egov-mcp の全 20 機能の仕様の一覧（specs/current から自動生成）"
---

# houki-egov-mcp の仕様

<!-- GENERATED FILE — 手で編集しない。houki-egov-mcp の specs/current/ から生成。 -->

::: info
houki-egov-mcp **v0.20.0** の `specs/current/` から自動生成しました（20 機能・仕様 ID 559 件・2026-10-09）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

houki-egov-mcp が何をするかを、機能ごとに 1 ページで説明します。全体の使い方は[解説](/mcp/houki-egov)に、引数の一覧は[リファレンス](/reference/mcp/houki-egov)にあります。

試作のため、ページがあるのは 1 機能だけです。ほかの機能は一覧にだけ載せています。

## ツール

MCP クライアント（Claude などの LLM）から呼ぶツールです。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `explain_law_type` | 法令種別の制定主体・階層・拘束力を解説する | 22 |
| `get_article_references` | 条文本文が引用している参照と委任を取り出す | 52 |
| `get_attachment` | 添付ファイル 1 件か、まとめた zip の URL を返し、求められたら保存する | 31 |
| `get_law` | 法令の条・項・号を 1 つ取得する。条を省くと目次を返す | 43 |
| `get_law_file` | 法令本文を 1 つのファイルで取る URL を返し、求められたら保存する | 23 |
| `get_law_range` | 編・章・節、または附則 1 本を範囲にして、条を本文ごと返す | 35 |
| `get_law_revisions` | 法令の改正履歴を取得する | 18 |
| `get_related_laws` | 法令名の規則で施行令・施行規則、または親の法律を引く | 20 |
| `get_toc` | 法令の目次を、本則と附則に分けて返す | 28 |
| `list_attachments` | 法令の添付ファイルの一覧を返す | 25 |
| `resolve_abbreviation` | 略称から略称辞書のエントリを引く | 13 |
| [`search_fulltext`](/specs/houki-egov/search_fulltext) | 法令の条文本文をキーワードで横断検索する | 42 |
| `search_law` | 法令をタイトルのキーワード・略称で検索する | 18 |
| `verify_citations` | 法令の引用のリストをまとめて実在確認する | 48 |

## 共通の規則

複数のツールに共通する規則（エラー応答の形や検索語の扱いなど）です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `common_errors` | 全ツールに共通するエラー応答の形と引数の検査、ツールの登録 | 33 |

## ローカル DB

ローカル DB の置き場所・版・中身についての約束です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `db_schema` | 全文検索に使うローカル SQLite DB の置き場所とテーブル | 28 |

## コマンドライン

コマンドラインから実行する機能（DB への投入や状態の確認など）です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `cli_bulk_download` | e-Gov の一括ダウンロードの zip を取得してローカル DB に取り込む | 33 |
| `cli_entry` | `houki-egov-mcp` コマンドの起動と引数の振り分け | 12 |
| `cli_status` | ローカル DB の同期の状態と件数を表示する | 14 |
| `cli_sync` | 全件取り込み済みのローカル DB を日次差分で最新化する | 21 |
