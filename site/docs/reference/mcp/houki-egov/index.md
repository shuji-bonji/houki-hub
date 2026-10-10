---
title: "houki-egov-mcp — ツールリファレンス"
description: "houki-egov-mcp v0.20.0 の全 14 ツールの一覧（tools/list から自動生成）"
---

# houki-egov-mcp — ツールリファレンス

<!-- GENERATED FILE — 手で編集しない。一覧はサーバーの tools/list から。 -->

::: info
**v0.20.0** の `tools/list` から自動生成しました（14 ツール・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

**このページは自動生成のリファレンスの入り口です。** ツールごとに 1 ページあり、何をするか・引数・実測の呼び出し例・扱わないことを、動いているサーバーの `tools/list` と、各リポジトリの仕様書（`specs/current/`）から写しています。サーバー全体の説明と導入は[解説ページ](/mcp/houki-egov)にあります。

`search_fulltext` だけはローカル DB（`houki-egov-mcp --bulk-download-everything` で構築）を引きます。DB が無いときは `search_law` の結果を `source: "api-fallback"` として返します。他のツールは e-Gov 法令 API v2 をその場で呼びます。

## ツール一覧

一言はサーバーの `tools/list` の説明の最初の 1 文です。ツールの名前から、ツールごとのページを開けます。

| ツールのページ | 一言 | 仕様書ページ |
|---|---|---|
| [`search_law`](/reference/mcp/houki-egov/search_law) | 日本の法令を、法令の題名のキーワードや略称で検索します。 | [仕様（仕様項目 18 件）](/specs/houki-egov/search_law) |
| [`get_law`](/reference/mcp/houki-egov/get_law) | 日本の法令から条文を取得します。 | [仕様（仕様項目 43 件）](/specs/houki-egov/get_law) |
| [`get_toc`](/reference/mcp/houki-egov/get_toc) | 法令の目次（編・章・節・条の構造）のみを取得する。 | [仕様（仕様項目 28 件）](/specs/houki-egov/get_toc) |
| [`get_law_range`](/reference/mcp/houki-egov/get_law_range) | 法令の編・章・節・款・目のいずれか、または附則 1 本を範囲にして、その中の条を本文ごと取得する。 | [仕様（仕様項目 35 件）](/specs/houki-egov/get_law_range) |
| [`search_fulltext`](/reference/mcp/houki-egov/search_fulltext) | 法令の条文本文をキーワードで横断して全文検索します（ローカル SQLite FTS5）。 | [仕様（仕様項目 42 件）](/specs/houki-egov/search_fulltext) |
| [`resolve_abbreviation`](/reference/mcp/houki-egov/resolve_abbreviation) | 略称・通称から正式な法令名と law_id を解決する。 | [仕様（仕様項目 13 件）](/specs/houki-egov/resolve_abbreviation) |
| [`get_law_revisions`](/reference/mcp/houki-egov/get_law_revisions) | 法令の改正履歴を取得します。 | [仕様（仕様項目 18 件）](/specs/houki-egov/get_law_revisions) |
| [`explain_law_type`](/reference/mcp/houki-egov/explain_law_type) | 法令種別（憲法・法律・政令・省令・規則・条例・告示・通達 等）の制定主体・階層上の位置・国民への拘束力・実務上の注意点を解説する。 | [仕様（仕様項目 22 件）](/specs/houki-egov/explain_law_type) |
| [`get_related_laws`](/reference/mcp/houki-egov/get_related_laws) | 法令名の規則で関連する法令を引きます。 | [仕様（仕様項目 20 件）](/specs/houki-egov/get_related_laws) |
| [`get_article_references`](/reference/mcp/houki-egov/get_article_references) | 条文本文が引用している参照を取り出します。 | [仕様（仕様項目 52 件）](/specs/houki-egov/get_article_references) |
| [`verify_citations`](/reference/mcp/houki-egov/verify_citations) | LLM が組み立てた法令の引用リストを、1 回の呼び出しでまとめて実在確認します。 | [仕様（仕様項目 48 件）](/specs/houki-egov/verify_citations) |
| [`list_attachments`](/reference/mcp/houki-egov/list_attachments) | 法令に付いている添付ファイル（別表・様式・別記の図。jpg / pdf）の一覧を返す。 | [仕様（仕様項目 25 件）](/specs/houki-egov/list_attachments) |
| [`get_attachment`](/reference/mcp/houki-egov/get_attachment) | 添付ファイル 1 件（src 指定）か、その法令履歴の添付ファイルをまとめた zip（src 省略）を取る。 | [仕様（仕様項目 31 件）](/specs/houki-egov/get_attachment) |
| [`get_law_file`](/reference/mcp/houki-egov/get_law_file) | 法令本文を 1 つのファイル（xml / json / html / rtf / docx）で取る道を返す。 | [仕様（仕様項目 23 件）](/specs/houki-egov/get_law_file) |
