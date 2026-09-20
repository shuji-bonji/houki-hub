## 何をしたか

0.10.2 で保留した手順の書き換えを入れました。houki-egov-mcp v0.14.0 の `get_law_range`（編・章・節、または附則 1 本を範囲にした条文の取得）を、法律本文の入口の選び方と `feasibility-check` の手順に置いています。

## 入口を 4 つから 5 つに

`SKILL.md` の「法律本文 (③) の入口」の表に 1 行足しました。

| 分かっていること | 呼ぶ tool |
|---|---|
| 法令名 + 条番号 | `get_law` |
| 法令名だけ（条は不明） | `get_toc` → `get_law` |
| **法令名 + 章・節（「民法の契約の章」）** | **`get_toc` → `get_law_range`** |
| 法令名すら不確か | `search_law` → `get_law` |
| どの法令の何条かが不明 | `search_fulltext` → `get_law` |

## feasibility-check のステップ ④

「民法・会社法のような長い法令は `get_law` を条の単位で呼ぶ」の後に、章・節を通して読むときの 3 手を足しました。呼び出し例の数値は v0.14.0 の実測です。

```jsonc
{ "tool": "get_toc", "args": { "law_name": "民法", "depth": 2 } }
// → toc[2].children[1].path = "Part3/Chapter2"（第三編 債権 第二章 契約）
{ "tool": "get_law_range", "args": { "law_name": "民法", "path": "Part3/Chapter2" } }
// → 198 条のうち 186 条（第521条〜第684条、本文 29,911 文字）。range.truncated: true
{ "tool": "get_law_range", "args": { "law_name": "民法", "path": "Part3/Chapter2", "from_article": "685" } }
```

あわせて使い分けの目安の表（条が分かっているなら `get_law`、章・節を通して読むなら `get_law_range`、どの条にあるか探すなら `get_toc` か `search_fulltext`）と、章番号が編ごとに振り直される注意を書いています。

## アンチパターンに 1 件

- ❌ `range.truncated` が `true` なのに、返った条だけで「この章の規定はこれだけ」と書く → `range.next_from_article` を `from_article` に渡して続きを取る

打ち切りは既定で本文 30,000 文字です。民法の章はほとんどが 1 回で収まりますが、会社法・所得税法の大きい章は 2〜3 回に分かれます。

## 版

`0.11.0`（minor）。0.10.2（ツール表とエラーコードの追記、PR #12）の上に乗ります。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01VtG4YjaPNXLTpyaWV3xrcE
