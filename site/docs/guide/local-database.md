---
title: ローカル DB（全文検索用）
description: houki-egov-mcp の laws.db と houki-nta-mcp の cache.db は役割が違います。2 つの違いと、DB のファイルの決まり方、起動のしかたごとに開くファイル、版をまたぐときの注意をまとめます
---

# ローカル DB（全文検索用）

houki-egov-mcp と houki-nta-mcp は、条文や通達の本文を手元の SQLite に取り込んで検索します。
ただし、2 つの DB は役割が違います。共通しているのは、取り込み方と検索の仕組み、鮮度の判定、置き場所の決まり方です。
このページはその共通部分を説明し、それぞれの中身は各 MCP のページに譲ります。

**どちらも必須ではありません。** ローカル DB を作っていなくても MCP サーバーは起動し、ツールも呼べます。
何ができなくなるかは DB ごとに違うので、下の比較表と各ページを見てください。

## 取り込みと利用は別のコマンドです

MCP サーバーが自分でダウンロードを始めることはありません。DB に書き込むのは、引数を付けて起動した CLI です（houki-nta-mcp は、国税庁サイトから取得した結果を書き戻す取得ツール 3 つも書き込みます）。

| すること | 実行するもの | DB への操作 |
| --- | --- | --- |
| 取り込む | `--bulk-download-everything` などを付けた CLI | 書き込みます |
| 検索・取得する | 引数なしで起動した MCP サーバー | 読みます |
| 最新にする | houki-egov-mcp は `--sync`（最終同期日からの日次差分）、houki-nta-mcp は `--refresh-stale=N --apply` | 書き込みます |
| 取り直す | 同じ取り込みコマンドの再実行 | 書き込みます |

houki-egov-mcp は、書き込むのが CLI だけなので、取り込み中に検索しても壊れません。

## コマンドの書き方

このサイトのコマンドは、どのフォルダーからでも動く `npx -y @shuji-bonji/<パッケージ名>@latest <フラグ>` の形で書きます。

```sh
npx -y @shuji-bonji/houki-egov-mcp@latest --status
npx -y @shuji-bonji/houki-nta-mcp@latest --refresh-stale=30
```

| 書き方 | 動くとき |
| --- | --- |
| `npx -y @shuji-bonji/houki-egov-mcp@latest --status` | いつでも |
| `houki-egov-mcp --status` | `npm install -g @shuji-bonji/houki-egov-mcp` でグローバルにインストールしたときだけ。インストールしていないと `command not found` |
| `npx houki-egov-mcp --status` | リポジトリのフォルダーの中でだけ。ほかの場所では、npm に `houki-egov-mcp` という名前のパッケージが無いので 404 |

`@latest` を付けるのは、plugin と同じ最新版で DB を作り、更新するためです。版を付けないと、npx が以前に取得した古い版を使うことがあります。古い版で新しい版の DB を開くと全テーブルが消えることがあるので（下の「版をまたぐときの注意」）、古い版を使わないことが大切です。

MCP の応答の `next_actions` や `--help` には `houki-egov-mcp --bulk-download-everything` のような短い形で出ます。グローバルにインストールしていないときは、上の形に読み替えてください。

## 2 つの DB の違い

|  | houki-egov-mcp / `laws.db` | houki-nta-mcp / `cache.db` |
| --- | --- | --- |
| **役割** | 公式の一括配布データの写しと、全文検索の索引 | 国税庁サイトを構造化した唯一の形 |
| **作っていないとき** | 全文検索だけが使えません（ほかは API で動きます） | 検索と、一部の取得ができません |
| 取得元 | e-Gov 配布の全件 zip（約 290 MB）1 本と日次差分 zip | 国税庁の HTML を 1 ページずつ |
| DB が要るツール | 14 のうち 1（`search_fulltext`） | 14 のうち 9 |
| 単位 | `law_revision_id`（法令の**版**） | 通達は 章 → 節 → 条、文書は `doc_type` と `doc_id` |
| テーブル | `laws` `articles` `revisions_meta` `sync_state` | `tsutatsu` `chapter` `section` `clause` `document` |
| 鮮度の持ち方 | `sync_state`（DB 全体で 1 行） | 行ごとの `fetched_at` |
| 更新の粒度 | 日ごと（`--sync` で最終同期日からの差分。90 日を超えたら全件） | 節・文書ごと |
| 元データが変わると | 新しい版を入れ、同じ法令の施行日が前の版は `PreviousEnforced` にします。古い版は残りますが、検索は現行の版に絞ります | 新規・更新・索引から消えた・移動の推定、の 4 つに分けて数えます。索引から消えた文書も残り、印が付くので検索結果で現行の文書と区別できます |
| 詳しくは | [houki-egov-mcp](/mcp/houki-egov#全文検索のためのローカル-db) | [houki-nta-mcp](/mcp/houki-nta#ローカル-db) |

## DB のファイルの決まり方

どちらの MCP も、開く DB のファイルを次の順で決めます。

| | houki-egov-mcp | houki-nta-mcp |
| --- | --- | --- |
| 1. コマンドラインの指定 | ありません | CLI の `--db-path=<ファイル>` |
| 2. 環境変数 | `HOUKI_EGOV_DB_PATH` | `HOUKI_NTA_DB_PATH` |
| 3. 既定の場所 | `${XDG_CACHE_HOME:-~/.cache}/houki-egov-mcp/laws.db` | `${XDG_CACHE_HOME:-~/.cache}/houki-nta-mcp/cache.db` |

環境変数には、フォルダーではなくファイル名まで書きます。MCP の設定ファイル（JSON）の `env` はシェルを通らないので、`~` を使わずに絶対パスで書きます。

### 起動のしかたごとに開くファイル

環境変数が渡るかどうかは、起動のしかたで違います。

| 起動のしかた | 渡る環境変数 | 開くファイル |
| --- | --- | --- |
| Claude Code plugin（`npx -y …@latest`） | plugin は `env` を持ちません。Claude Desktop のような GUI アプリは、シェルの環境変数も受け継ぎません | 既定の場所（`~/.cache/houki-egov-mcp/laws.db`・`~/.cache/houki-nta-mcp/cache.db`） |
| MCP の設定ファイル（`claude_desktop_config.json`・`.mcp.json`）に書いたサーバー | 設定の `env` だけ | `env` に環境変数があればそのファイル。無ければ既定の場所 |
| ターミナルの CLI | そのシェルの環境変数 | 環境変数があればそのファイル。無ければ既定の場所 |

**環境変数を付けずに CLI を実行すると、plugin が使う DB を作り、更新します。** plugin で使う DB は、環境変数を付けずに CLI で作り、更新してください。
シェルの設定（`~/.zshrc` など）で環境変数を `export` しているときは、`env -u HOUKI_EGOV_DB_PATH npx -y @shuji-bonji/houki-egov-mcp@latest --sync` のように外して実行します。

逆に、環境変数を片方にだけ設定すると、CLI と MCP サーバーが別々のファイルを開きます。
houki-egov-mcp では `search_fulltext` が `source: "api-fallback"` になり、`note` が `bulk DL 未実行のため` で始まります。この文は「DB をまだ作っていない」と「別のファイルを開いている」を区別しないので、MCP サーバーと同じ環境変数で `--status` を実行し、2 行目の `DB:` のファイルを確かめてください。
houki-nta-mcp では検索ツールが `DOC_NOT_FOUND` を返し、`hint` に開いた DB のパスが入ります。

## 日々の更新と作り直し

| 場面 | houki-egov-mcp | houki-nta-mcp |
| --- | --- | --- |
| ふだんの更新 | `--sync` | `--refresh-stale=N --apply`（N 日より古い節・文書を取り直す） |
| 初めて作るとき | `--bulk-download-everything` | `--quickstart` か `--bulk-download-*` |
| しばらく更新しなかったとき | 最後の同期から 90 日を超えたら `--bulk-download-everything`（`--sync` が促します） | `--refresh-stale=N --apply` のまま |
| パッケージを上げて DB の版が変わったとき | `--bulk-download-everything` が作り直します（0.19.0 で版 3。取り込んだ中身は消えます） | 最初に開いたときに行を保ったまま移行します（0.24.0 で版 12。取り込み直しは不要） |

houki-egov-mcp の `--bulk-download-everything` は、版が同じ DB に実行しても作り直しません。全件の zip を取り直して、中身の変わった法令だけを書き換えます。ふだんの更新は `--sync` で足ります。

## 版をまたぐときの注意

DB には、作った版の houki-egov-mcp・houki-nta-mcp のスキーマの版が記録されています。

| | houki-egov-mcp | houki-nta-mcp |
| --- | --- | --- |
| 今の版 | 0.19.0 から版 3 | 0.24.0 から版 12 |
| 古い版の DB を新しいパッケージで開くと | `--bulk-download-everything` だけが作り直します。ほかの入口は DB を書き換えず、`search_fulltext` は `search_law` に切り替わります | 版 3〜11 は行を保ったまま移行します。版 1・2 は投入のフラグが作り直します |
| 新しい版の DB を古いパッケージで開くと | **0.18.x 以前は全テーブルを消します** | **0.23.x 以前は全テーブルを消して作り直します** |

上げた後は、同じ DB を古い版の CLI や MCP サーバーで開かないでください。plugin などで版を固定しているときは、CLI と同じ版にそろえます。

### 別のファイルで作った DB を既定の場所に移す

houki-egov-mcp の版を上げるときに、`HOUKI_EGOV_DB_PATH` で別のファイル（例: `laws.v3.db`）に新しい版の DB を作った場合は、名前を `laws.db` に変えれば、取り込み直さずに plugin から使えます。
手順は [houki-egov-mcp の README の「別のファイルで作った DB を laws.db に移す」](https://github.com/shuji-bonji/houki-egov-mcp#別のファイルで作った-db-を-lawsdb-に移す)にあります。MCP サーバーを止め、`PRAGMA wal_checkpoint(TRUNCATE)` で WAL を書き戻してから名前を変えます。

### 開発で手元のビルドを使うとき

手元のビルド（`node dist/index.js`）も、環境変数が無ければ plugin と同じ既定の場所の DB を開きます。
古いコミットを試すときや、DB の版を上げる変更を試すときは、環境変数で開発用の別のファイル（例: `~/.cache/houki-egov-mcp/laws.dev.db`）に向けてください。共有したままだと、古い版のビルドが公開版の DB の全テーブルを消すことがあります。

## 共通していること

- **SQLite + FTS5 の trigram tokenizer** を使います。日本語を語に分けずに 3 文字単位で索引するため、2 文字の語（「株主」「責任」）は索引に乗らず、別の方法で補います
- **正規化を [`@shuji-bonji/houki-abbreviations`](/lib/houki-abbreviations) で揃えます。** 取り込み時と検索時の両方に同じ関数を通すので、`ＮＩＳＡ` と `NISA` のような表記違いで結果が分かれません
- **鮮度の判定のしきい値が同じです。** 検索の応答に付く `freshness` は、最後に取得してからの経過日数を次のように読み替えます（`STALENESS_THRESHOLDS`）

  | 判定 | 経過日数 | 意味 |
  | --- | --- | --- |
  | `fresh` | 7 日未満 | そのまま使えます |
  | `stale` | 7 日以上 30 日未満 | 改正が入っている可能性があります |
  | `outdated` | 30 日以上 | 取り直しを勧めます |

## 取り込みの手順

それぞれのページに、作り方・所要時間・更新のしかた・版が上がったときの扱いをまとめています。

- [houki-egov-mcp の「全文検索のためのローカル DB」](/mcp/houki-egov#全文検索のためのローカル-db)
- [houki-nta-mcp の「ローカル DB」](/mcp/houki-nta#ローカル-db)

初めて設定するときの手順は[導入手順](/guide/getting-started)にあります。
