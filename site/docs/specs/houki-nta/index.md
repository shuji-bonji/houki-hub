---
title: "houki-nta-mcp の仕様"
description: "houki-nta-mcp の全 22 機能の仕様の一覧（specs/current から自動生成）"
---

# houki-nta-mcp の仕様

<!-- GENERATED FILE — 手で編集しない。houki-nta-mcp の specs/current/ から生成。 -->

::: info
houki-nta-mcp **v0.27.0** の `specs/current/` から自動生成しました（22 機能・仕様 ID 276 件・2026-10-09）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

houki-nta-mcp が何をするかを、機能ごとに 1 ページで説明します。全体の使い方は[解説](/mcp/houki-nta)に、引数の一覧は[リファレンス](/reference/mcp/houki-nta)にあります。

試作のため、ページがあるのは 1 機能だけです。ほかの機能は一覧にだけ載せています。

## ツール

MCP クライアント（Claude などの LLM）から呼ぶツールです。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `nta_get_bunshokaitou` | 文書回答事例を docId で 1 件取得する | 11 |
| `nta_get_jimu_unei` | 事務運営指針を 1 件取得する | 11 |
| `nta_get_kaisei_tsutatsu` | 改正通達を docId で 1 件取得する | 11 |
| `nta_get_qa` | 質疑応答事例を 1 件取得する | 16 |
| `nta_get_tax_answer` | タックスアンサーを番号で 1 件取得する | 18 |
| [`nta_get_tsutatsu`](/specs/houki-nta/nta_get_tsutatsu) | 基本通達の条項を 1 つ取得する | 18 |
| `nta_inspect_pdf_meta` | 文書の添付 PDF の一覧と読み方を返す | 20 |
| `nta_search_bunshokaitou` | 文書回答事例をキーワードで検索する | 8 |
| `nta_search_jimu_unei` | 事務運営指針をキーワードで検索する | 8 |
| `nta_search_kaisei_tsutatsu` | 改正通達をキーワードで検索する | 6 |
| `nta_search_qa` | 質疑応答事例をキーワードで検索する | 8 |
| `nta_search_tax_answer` | タックスアンサーをキーワードで検索する | 6 |
| `nta_search_tsutatsu` | 基本通達の条項をキーワードで検索する | 11 |
| `resolve_abbreviation` | 略称・通称から辞書のエントリを 1 件解決する | 8 |

## 共通の規則

複数のツールに共通する規則（エラー応答の形や検索語の扱いなど）です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `common_errors` | 全ツールに共通するエラー応答の形と引数の検査 | 19 |
| `search_rules` | 検索系ツールに共通するキーワードの扱いと結果の付記 | 22 |

## ローカル DB

ローカル DB の置き場所・版・中身についての約束です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `db_schema` | 通達と文書を持つローカル SQLite DB の版・移行・書き戻し | 30 |

## コマンドライン

コマンドラインから実行する機能（DB への投入や状態の確認など）です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `cli_bulk_download` | 国税庁サイトから通達と文書を取得してローカル DB に入れる | 14 |
| `cli_entry` | `houki-nta-mcp` コマンドの起動と引数の振り分け | 9 |
| `cli_health_check` | 国税庁サイトの代表ページの確認と、基準（baseline）との比較 | 7 |
| `cli_refresh` | 取り込み済みの通達と文書の取り直し | 7 |
| `cli_status` | `--status` で DB の場所と中身を確かめる | 8 |
