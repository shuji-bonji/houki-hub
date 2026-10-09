---
title: "houki-nta-mcp — ツールリファレンス"
description: "houki-nta-mcp v0.27.0 の全 14 ツールの一覧（tools/list から自動生成）"
---

# houki-nta-mcp — ツールリファレンス

<!-- GENERATED FILE — 手で編集しない。一覧はサーバーの tools/list から。 -->

::: info
**v0.27.0** の `tools/list` から自動生成しました（14 ツール・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

**このページは自動生成のリファレンスの入り口です。** ツールごとに 1 ページあり、何をするか・引数・実測の呼び出し例・できないことを、動いているサーバーの `tools/list` と、各リポジトリの仕様書（`specs/current/`）から写しています。サーバー全体の説明と導入は[解説ページ](/mcp/houki-nta)にあります。

`nta_get_*` はローカル DB（`houki-nta-mcp --bulk-download-everything` で構築）を先に引き、無ければ国税庁サイトから直接取得します。`nta_search_*` はローカル DB の FTS5 を使うので、DB が無いと結果が空になります。すべての応答に `legal_status`（通達は国民を拘束しない旨）と、DB から返した場合は `freshness` が付きます。

## ツール一覧

一言はサーバーの `tools/list` の説明の最初の 1 文です。ツールの名前から、ツールごとのページを開けます。

| ツールのページ | 一言 | 仕様書ページ |
|---|---|---|
| [`nta_search_tsutatsu`](/reference/mcp/houki-nta/nta_search_tsutatsu) | 国税庁の基本通達（消基通・所基通・法基通・相基通の 4 通達）を FTS5 でキーワード検索する。 | [仕様（約束 11 件）](/specs/houki-nta/nta_search_tsutatsu) |
| [`nta_get_tsutatsu`](/reference/mcp/houki-nta/nta_get_tsutatsu) | 基本通達の本文を取得する。 | [仕様（約束 18 件）](/specs/houki-nta/nta_get_tsutatsu) |
| [`nta_search_qa`](/reference/mcp/houki-nta/nta_search_qa) | 国税庁の質疑応答事例（9 税目: 所得税/源泉所得税/譲渡所得/相続税・贈与税/財産の評価/法人税/消費税/印紙税/法定調書）を FTS5 でキーワード検索する。 | [仕様（約束 8 件）](/specs/houki-nta/nta_search_qa) |
| [`nta_get_qa`](/reference/mcp/houki-nta/nta_get_qa) | 国税庁の質疑応答事例 1 件を取得する。 | [仕様（約束 16 件）](/specs/houki-nta/nta_get_qa) |
| [`nta_search_tax_answer`](/reference/mcp/houki-nta/nta_search_tax_answer) | タックスアンサー（一般納税者向け解説、約 750 件）を FTS5 でキーワード検索する。 | [仕様（約束 6 件）](/specs/houki-nta/nta_search_tax_answer) |
| [`nta_get_tax_answer`](/reference/mcp/houki-nta/nta_get_tax_answer) | 国税庁のタックスアンサー（よくある税の質問）本文を番号で取得する。 | [仕様（約束 18 件）](/specs/houki-nta/nta_get_tax_answer) |
| [`nta_search_kaisei_tsutatsu`](/reference/mcp/houki-nta/nta_search_kaisei_tsutatsu) | 改正通達（一部改正通達）を FTS5 でキーワード検索する。 | [仕様（約束 6 件）](/specs/houki-nta/nta_search_kaisei_tsutatsu) |
| [`nta_get_kaisei_tsutatsu`](/reference/mcp/houki-nta/nta_get_kaisei_tsutatsu) | 改正通達の本文を docId で取得する（DB 経由）。 | [仕様（約束 11 件）](/specs/houki-nta/nta_get_kaisei_tsutatsu) |
| [`nta_search_jimu_unei`](/reference/mcp/houki-nta/nta_search_jimu_unei) | 事務運営指針（jimu-unei）を FTS5 でキーワード検索する。 | [仕様（約束 8 件）](/specs/houki-nta/nta_search_jimu_unei) |
| [`nta_get_jimu_unei`](/reference/mcp/houki-nta/nta_get_jimu_unei) | 事務運営指針の本文を docId で取得する（DB 経由）。 | [仕様（約束 11 件）](/specs/houki-nta/nta_get_jimu_unei) |
| [`nta_search_bunshokaitou`](/reference/mcp/houki-nta/nta_search_bunshokaitou) | 文書回答事例（bunshokaitou）を FTS5 でキーワード検索する。 | [仕様（約束 8 件）](/specs/houki-nta/nta_search_bunshokaitou) |
| [`nta_get_bunshokaitou`](/reference/mcp/houki-nta/nta_get_bunshokaitou) | 文書回答事例の本文を docId で取得する（DB 経由）。 | [仕様（約束 11 件）](/specs/houki-nta/nta_get_bunshokaitou) |
| [`nta_inspect_pdf_meta`](/reference/mcp/houki-nta/nta_inspect_pdf_meta) | 指定した文書の添付 PDF の一覧を返す。 | [仕様（約束 20 件）](/specs/houki-nta/nta_inspect_pdf_meta) |
| [`resolve_abbreviation`](/reference/mcp/houki-nta/resolve_abbreviation) | 略称・通称から houki-abbreviations 経由でエントリを解決する。 | [仕様（約束 8 件）](/specs/houki-nta/resolve_abbreviation) |
