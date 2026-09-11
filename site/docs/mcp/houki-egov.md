---
title: houki-egov-mcp
description: e-Gov 法令 API v2 から法律・政令・省令の本文・目次・改正履歴を取得し、ローカル DB で全文検索する MCP サーバー
---

# houki-egov-mcp

日本の法令（憲法・法律・政令・省令・規則）を **e-Gov 法令 API v2** 経由で取得する MCP サーバーです。
条文をキーワード・略称・分野で検索し、特定の条・項・号を Markdown または JSON で取り出し、改正履歴を引けます。

- npm: [`@shuji-bonji/houki-egov-mcp`](https://www.npmjs.com/package/@shuji-bonji/houki-egov-mcp)（0.5.4）
- リポジトリ: [shuji-bonji/houki-egov-mcp](https://github.com/shuji-bonji/houki-egov-mcp)
- 動作環境: Node.js 22 以上

## ツール

引数の詳細と実測の呼び出し例は[ツールリファレンス](/reference/mcp/houki-egov)にあります。

| ツール | 用途 |
| --- | --- |
| `search_law` | 法令名でキーワード検索します。略称（「法人税法」「個情法」）は正式名に解決してから検索します |
| `get_law` | 条・項・号の単位で本文を取得します。Markdown / JSON / 目次のみ、を選べます |
| `get_toc` | 目次だけを取得します。長い法令で本文を読む前に構造を掴むためのものです |
| `get_law_revisions` | 改正履歴（公布日・施行日・状態）を取得します |
| `search_fulltext` | 条文本文を横断して全文検索します。ローカル DB が必要で、無いときは `search_law` の結果を `source: "api-fallback"` として返します |
| `resolve_abbreviation` | 略称が正式名と法令 ID にどう解決されるかを診断します |
| `explain_law_type` | 法令の種別（憲法・法律・政令・省令・通達など）と、それぞれの拘束力を説明します |

## 全文検索のためのローカル DB

`search_fulltext` は、e-Gov の一括ダウンロードから SQLite（FTS5）を作って検索します。

```sh
npx -y @shuji-bonji/houki-egov-mcp --bulk-download-everything
```

DB の場所は `~/.cache/houki-egov-mcp/laws.db`（`HOUKI_EGOV_DB_PATH` で変更可）です。
書き込みは CLI だけが行い、MCP サーバーは読むだけなので、取り込み中に検索しても壊れません。

検索は次のように動きます。

- 「民法 不法行為」のように法令名と語を並べると、法令名で絞り込んでから本文を検索します
- 「民法 第709条」「消費税法 第57条の2」のように法令名と条番号だけなら、検索せずにその条を直接返します
- 2 文字の語（「株主」「責任」）は索引に乗らないため、ヒットした本文に含まれるかで補完します

## 知っておくとよいこと

- v0.5.1 より前に作った DB には、編（Part）を持つ法令（民法・会社法など）の本則が入っていません。`--bulk-download-everything` を再実行してください
- `get_toc` は附則の条を編・章の外に平坦に並べます（既知の課題）
- 民法・消費税法のような大きな法令は応答が長くなります。`get_toc` で位置を確かめてから `get_law` で条を指定してください

## デジタル庁公式の MCP との関係

本サーバーは e-Gov 法令 API v2 のクライアントで、デジタル庁公式の MCP ではありません。
デジタル庁は 2025 年 12 月〜2026 年 3 月の「法令 × デジタル」ハッカソンで法令 API と MCP の試作を参加者向けに試行提供しました。
法令本文を返す公式 MCP が一般提供された場合は、本サーバーのコアをそちらに委譲する方針です。

詳しい設計と Phase ごとの進捗は、リポジトリの `docs/` にあります。利用範囲は[免責事項と利用範囲](/guide/disclaimer)と、リポジトリの [DISCLAIMER.md](https://github.com/shuji-bonji/houki-egov-mcp/blob/main/DISCLAIMER.md) を参照してください。
