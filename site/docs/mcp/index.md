---
title: MCP サーバー一覧
description: houki-hub family の MCP サーバーと、それぞれが束ねる一次資料
---

# MCP サーバー一覧

各サーバーは独立した npm パッケージで、単独で動きます。名前の `houki-{単位}-mcp` の「単位」は、
組織（e-Gov / 国税庁 / 厚労省）かコンテンツ種（メタデータ / 裁決 / 判例）のどちらかです。

| サーバー | 束ねる単位 | 取得元 | 版 | 状態 |
| --- | --- | --- | --- | --- |
| [houki-egov-mcp](/mcp/houki-egov) | e-Gov（法律・政令・省令） | e-Gov 法令 API v2 | 0.5.3 | 公開済み |
| [houki-nta-mcp](/mcp/houki-nta) | 国税庁（通達・Q&A・タックスアンサー） | www.nta.go.jp | 0.10.2 | 公開済み |
| houki-metadata-mcp | 法令メタデータ（公布日・施行日・改正予定） | e-Gov 法令 API v2 ほか | — | 予定 |
| houki-mhlw-mcp | 厚生労働省（労働・社会保険の通達・通知） | www.mhlw.go.jp | — | 予定 |
| houki-saiketsu-mcp | 裁決全般（初版は国税不服審判所） | kfs.go.jp | — | 構想 |
| houki-court-mcp | 判例全般（初版は民事判決オープンデータ） | 裁判所 | — | 構想 |

## 全サーバーに共通すること

- 略称の解決に [houki-abbreviations](/lib/houki-abbreviations) を使います。管轄外の略称を渡すと、本文を取りに行かずに担当サーバーへの案内を返します
- 応答に取得元 URL と取得日時を含めます。ローカル DB から返した場合は `freshness` で鮮度を示します
- エラーは `isError: true` と `code`（`UNKNOWN_TOOL` / `INVALID_ARGUMENT` / `INTERNAL_ERROR` と各サーバー固有のコード）で返します。LLM が取るべき行動は [houki-research Skill](/skills/houki-research) が定めています
- 引数は各ツールの `inputSchema` で検証し、違反は `INVALID_ARGUMENT` で返します
- Node.js 22 以上、MCP SDK v2（`@modelcontextprotocol/server`）で動きます

## ツールリファレンス

ツールごとの引数の正本は、各サーバーが `tools/list` で返す `inputSchema` と、各リポジトリの README のツール表です。
このサイトでは各サーバーのページに用途の一覧を置き、引数の詳細は README に送っています。

## 免責事項

各サーバーが返すのは一次情報と出典 URL で、個別の事案への当てはめは想定していません。詳しくは[免責事項と利用範囲](/guide/disclaimer)を参照してください。
