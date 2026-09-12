---
title: ローカル DB（全文検索用）
description: houki-egov-mcp の laws.db と houki-nta-mcp の cache.db は役割が違います。2 つの違いと、共通している取り込み方・鮮度の判定・置き場所をまとめます
---

# ローカル DB（全文検索用）

houki-egov-mcp と houki-nta-mcp は、条文や通達の本文を手元の SQLite に取り込んで検索します。
ただし、2 つの DB は役割が違います。共通しているのは、取り込み方と検索の仕組み、鮮度の判定、置き場所の規約です。
このページはその共通部分を説明し、それぞれの中身は各 MCP のページに譲ります。

**どちらも必須ではありません。** ローカル DB を作っていなくても MCP サーバーは起動し、ツールも呼べます。
何ができなくなるかは DB ごとに違うので、下の比較表と各ページを見てください。

## 取り込みと利用は別のコマンドです

MCP サーバーが自分でダウンロードを始めることはありません。DB に書き込むのは、引数を付けて起動した CLI だけです。

| すること | 実行するもの | DB への操作 |
| --- | --- | --- |
| 取り込む | `--bulk-download-everything` などを付けた CLI | 書き込みます |
| 検索・取得する | 引数なしで起動した MCP サーバー | 読むだけです |
| 取り直す | 同じ取り込みコマンドの再実行（houki-nta-mcp は `--refresh` や `--refresh-stale=N --apply` も使えます） | 書き込みます |

houki-egov-mcp は、書き込むのが CLI だけなので、取り込み中に検索しても壊れません。

## 2 つの DB の違い

|  | houki-egov-mcp / `laws.db` | houki-nta-mcp / `cache.db` |
| --- | --- | --- |
| **役割** | 公式の一括配布データの写しと、全文検索の索引 | 国税庁サイトを構造化した唯一の形 |
| **作っていないとき** | 全文検索だけが使えません（ほかは API で動きます） | 検索と、一部の取得ができません |
| 取得元 | e-Gov 配布の全件 zip（約 290 MB）1 本 | 国税庁の HTML を 1 ページずつ |
| DB が要るツール | 7 つ中 1 つ（`search_fulltext`） | 14 つ中 9 つ |
| 単位 | `law_revision_id`（法令の**版**） | 通達は 章 → 節 → 条、文書は `doc_type` と `doc_id` |
| テーブル | `laws` `articles` `revisions_meta` `sync_state` | `tsutatsu` `chapter` `section` `clause` `document` |
| 鮮度の持ち方 | `sync_state`（DB 全体で 1 行） | 行ごとの `fetched_at` |
| 更新の粒度 | 全件のみ（差分同期は未実装） | 節・文書ごと |
| 元データが変わると | `content_hash` が変わった版だけ入れ直します。古い版は残りますが、検索は現行の版に絞ります | 新規・更新・索引から消えた・移動の推定、の 4 つに分けて数えます。索引から消えた文書も残り、印が付かないので検索に出ます |
| 詳しくは | [houki-egov-mcp](/mcp/houki-egov#全文検索のためのローカル-db) | [houki-nta-mcp](/mcp/houki-nta#ローカル-db) |

## 共通していること

- **SQLite + FTS5 の trigram tokenizer** を使います。日本語を語に分けずに 3 文字単位で索引するため、2 文字の語（「株主」「責任」）は索引に乗らず、別の方法で補います
- **正規化を [`@shuji-bonji/houki-abbreviations`](/lib/houki-abbreviations) で揃えます。** 取り込み時と検索時の両方に同じ関数を通すので、`ＮＩＳＡ` と `NISA` のような表記違いで結果が分かれません
- **鮮度の判定のしきい値が同じです。** 検索の応答に付く `freshness` は、最後に取得してからの経過日数を次のように読み替えます（`STALENESS_THRESHOLDS`）

  | 判定 | 経過日数 | 意味 |
  | --- | --- | --- |
  | `fresh` | 7 日未満 | そのまま使えます |
  | `stale` | 7 日以上 30 日未満 | 改正が入っている可能性があります |
  | `outdated` | 30 日以上 | 取り直しを勧めます |

- **置き場所の規約が同じです。** 既定は `${XDG_CACHE_HOME:-~/.cache}/<パッケージ名>/` の下で、環境変数（`HOUKI_EGOV_DB_PATH` / `HOUKI_NTA_DB_PATH`）で変えられます

## 取り込みの手順

それぞれのページに、作り方・所要時間・更新のしかた・版が上がったときの扱いをまとめています。

- [houki-egov-mcp の「全文検索のためのローカル DB」](/mcp/houki-egov#全文検索のためのローカル-db)
- [houki-nta-mcp の「ローカル DB」](/mcp/houki-nta#ローカル-db)

初めて設定するときの手順は[導入手順](/guide/getting-started)にあります。
