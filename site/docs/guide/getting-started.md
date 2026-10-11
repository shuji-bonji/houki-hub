---
title: 導入手順
description: houki-egov-mcp / houki-nta-mcp / houki-research Skill を Claude Desktop・Claude Code に入れる手順
---

# 導入手順

## 0. 前提と、2 つの入れ方

必要なものは Node.js 22 以上だけです。データベースの構築は任意で、なくても API 経由で動きます。

```sh
node -v   # v22.0.0 以上であること
```

Node.js が無い、または古いときは [nodejs.org](https://nodejs.org/) から LTS 版を入れてください。`npx` は Node.js に付いてくるので、別に入れる必要はありません。

入れ方は 2 つあります。使っているクライアントで選んでください。

| 使っているもの | 入れ方 | 読む手順 |
| --- | --- | --- |
| Claude Code・Cowork | **Skill の plugin を 1 つ入れる**。houki-research の plugin に 2 つの MCP サーバーも含まれているので、設定ファイルは書きません | [3. houki-research Skill を入れる](#_3-houki-research-skill-を入れる) → [4. 動作を確かめる](#_4-動作を確かめる) |
| Claude Desktop、その他の MCP クライアント | **MCP サーバーを設定ファイルに書く**。Skill は後から、使えるクライアントなら足します | [1. MCP サーバーを設定に追加する](#_1-mcp-サーバーを設定に追加する) から順に |

どちらで入れても、動く MCP サーバーは同じで、ローカル DB（手順 2）も共通です。

## 1. MCP サーバーを設定に追加する

MCP クライアントの設定ファイルに次を追加します。ファイルの場所はクライアントごとに違います。

| クライアント | 設定ファイル |
| --- | --- |
| Claude Desktop（macOS） | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop（Windows） | `%APPDATA%\Claude\claude_desktop_config.json` |
| Claude Code | プロジェクトの `.mcp.json`（プロジェクト単位）、または `claude mcp add` コマンド |

まずは houki-egov-mcp だけで十分です。

```jsonc
{
  "mcpServers": {
    "houki-egov": {
      "command": "npx",
      "args": ["-y", "@shuji-bonji/houki-egov-mcp@latest"]
    },
    // 税務の通達・Q&A が必要になったら追加
    "houki-nta": {
      "command": "npx",
      "args": ["-y", "@shuji-bonji/houki-nta-mcp@latest"]
    }
  }
}
```

再起動後、「消費税法第 57 条の 2 を見せて」「インボイス制度の登録要件は」のように尋ねると、
`search_law` → `get_law` の順に呼ばれ、法令番号と e-Gov の URL 付きで本文が返ります。

## 2. ローカル DB を作る（全文検索を使う場合）

houki-egov-mcp の `search_fulltext` は、条文本文を横断検索するツールです。
ローカル DB がないときは `search_law`（法令名の検索）に切り替わり、応答の `source` が `"api-fallback"` になります。
本文の全文検索を使うには、一度だけ次を実行します。

```sh
npx -y @shuji-bonji/houki-egov-mcp@latest --bulk-download-everything
```

DB は `~/.cache/houki-egov-mcp/laws.db` にでき、`HOUKI_EGOV_DB_PATH` で場所を変えられます。
構築後に MCP サーバーを再起動する必要はありません。

houki-nta-mcp も同じ形で、通達本体・改正通達・タックスアンサーなどを取り込みます。初めて入れたときは、通達 1 本だけを入れて動くことを確かめてください。

```sh
npx -y @shuji-bonji/houki-nta-mcp@latest --quickstart
```

消費税法基本通達 1 本を約 3〜5 分で取り込みます（v0.18.0）。終わると、その通達に対して検索と取得が使えます。
DB が無い状態でも、取得ツール（`nta_get_tsutatsu` など）は国税庁サイトから直接取ります。DB が要るのは検索ツールだけです。

6 種別すべてを取り込むときは次を実行します。国税庁サイトを 1 ページずつ取りに行くので**約 100 分**かかります。

```sh
npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-everything
```

税目を絞って必要な分だけ先に入れることもできます。2 回目以降も取得自体は行いますが、内容が変わっていない節は投入を省きます。

2 つの DB は役割が違います。違いと、共通している置き場所・鮮度の判定は
[ローカル DB（全文検索用）](/guide/local-database)にまとめています。
作り方と取り直し方は、[houki-egov-mcp](/mcp/houki-egov#全文検索のためのローカル-db) と [houki-nta-mcp](/mcp/houki-nta#ローカル-db) の各ページにあります。

## 3. houki-research Skill を入れる

Skill は「どの MCP をどの順に呼ぶか」「出典をどう書くか」「業法の注意喚起をいつ出すか」を LLM に指示します。
Claude Code では、marketplace の [claude-plugins](https://github.com/shuji-bonji/claude-plugins) から plugin として入れます。Claude Code の入力欄で次の 2 行を順に実行します（`/plugin` は Claude Code のコマンドです）。

```text
/plugin marketplace add shuji-bonji/claude-plugins
/plugin install houki-research@shuji-bonji
```

この 2 行で、houki-research Skill と、それが依存する houki-egov-mcp・houki-nta-mcp の 3 つが入ります（houki-research v0.7.0 から）。手順 1 の設定ファイルを書く必要はありません。

MCP サーバーだけを plugin で入れたいとき（Skill は使わないとき）は、代わりに次を実行します。

```text
/plugin install houki-egov-mcp@shuji-bonji
/plugin install houki-nta-mcp@shuji-bonji
```

Cowork では、Settings → Customize → Plugins → Marketplace に `https://github.com/shuji-bonji/claude-plugins` を追加するか、
[houki-research-skill の Release](https://github.com/shuji-bonji/houki-research-skill/releases) にある `houki-research-<版>.plugin` を drag&drop します。

Claude Desktop など plugin の仕組みがない環境では、
[houki-research-skill](https://github.com/shuji-bonji/houki-research-skill) の `skills/houki-research/` を
プロジェクトの `.claude/skills/` に置いてください。

## 4. 動作を確かめる

次の 3 つを順に尋ねると、各層が動いていることを確認できます。

| 尋ねること | 動く部品 | 応答に含まれるもの |
| --- | --- | --- |
| 「法基通 とは正式には何ですか」 | houki-abbreviations（`resolve_abbreviation`） | 正式名称「法人税基本通達」と担当 MCP の案内 |
| 「民法第 709 条の本文」 | houki-egov-mcp（`get_law`） | 法令番号（明治二十九年法律第八十九号）、条文、e-Gov の URL |
| 「消基通で軽減税率の対象を確認したい」 | houki-nta-mcp（`nta_search_tsutatsu`） | 通達番号、本文、`legal_status`（通達は国民を拘束しない旨） |

## 次に読むもの

- [ローカル DB（全文検索用）](/guide/local-database) — 2 つの DB の違いと、共通する取り込み方・鮮度の判定
- [全体構成と責務](/guide/architecture) — 3 層がそれぞれ何を決めるか
- [houki-egov-mcp](/mcp/houki-egov) / [houki-nta-mcp](/mcp/houki-nta) — ツールごとの説明
- [houki-research Skill](/skills/houki-research) — 手順と注意喚起の中身
