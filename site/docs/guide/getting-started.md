---
title: 導入手順
description: houki-egov-mcp / houki-nta-mcp / houki-research Skill を Claude Desktop・Claude Code に入れる手順
---

# 導入手順

必要なものは Node.js 22 以上だけです。データベースの構築は任意で、なくても API 経由で動きます。

## 1. MCP サーバーを設定に追加する

Claude Desktop の `claude_desktop_config.json`、または Claude Code の `.mcp.json` に次を追加します。
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
npx -y @shuji-bonji/houki-egov-mcp --bulk-download-everything
```

DB は `~/.cache/houki-egov-mcp/laws.db` にでき、`HOUKI_EGOV_DB_PATH` で場所を変えられます。
構築後に MCP サーバーを再起動する必要はありません。

houki-nta-mcp も同じ形で、通達本体・改正通達・タックスアンサーなどを取り込みます。

```sh
npx -y @shuji-bonji/houki-nta-mcp --bulk-download-everything
```

国税庁サイトを 1 ページずつ取りに行くので、6 種別すべてでは**約 100 分**かかります。
税目を絞って必要な分だけ先に入れることもできます。2 回目以降も取得自体は行いますが、内容が変わっていない節は投入を省きます。

2 つの DB は役割が違います。違いと、共通している置き場所・鮮度の判定は
[ローカル DB（全文検索用）](/guide/local-database)にまとめています。
作り方と取り直し方は、[houki-egov-mcp](/mcp/houki-egov#全文検索のためのローカル-db) と [houki-nta-mcp](/mcp/houki-nta#ローカル-db) の各ページにあります。

## 3. houki-research Skill を入れる

Skill は「どの MCP をどの順に呼ぶか」「出典をどう書くか」「業法の注意喚起をいつ出すか」を LLM に指示します。
Claude Code では、marketplace の [claude-plugins](https://github.com/shuji-bonji/claude-plugins) から plugin として入れるのが簡単です。

```text
/plugin marketplace add shuji-bonji/claude-plugins
/plugin install houki-research@shuji-bonji
```

同じ marketplace に `houki-egov-mcp` / `houki-nta-mcp` の plugin もあり、こちらを使えば手順 1 の設定を手で書かずに済みます。

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
