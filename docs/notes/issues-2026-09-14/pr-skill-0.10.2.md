## 何をしたか

houki-egov-mcp v0.14.0 で入った `get_law_range`（編・章・節、または附則 1 本を範囲にした条文の取得。egov#22）を、Skill 側の一覧に反映しました。**手順は変えていません**。

- `SKILL.md` の family ツール表 — houki-egov-mcp のツールに `get_law_range`（v0.14.0 以上）を足しました。民法・会社法・消費税法のように `get_law` で 1 条ずつ引くと手数がかかる法令で、章・節をまとめて取れます
- `docs/ERROR-CODES.md` の「リソース未発見」 — `RANGE_NOT_FOUND`（指定された編・章・節、または附則の番号が見つからない、`retryable: false`、houki-egov-mcp 0.14.0+）を足しました

範囲が複数の章に当たったとき（民法の `chapter: "2"` は 5 つの編にあります）は `INVALID_ARGUMENT` で候補のパスが返るので、その行は既存のままにしています。

## 手順を書き換えていない理由

`workflows/feasibility-check.md` の「民法・会社法を `get_law` で丸ごと取るな」の節と、`SKILL.md` の応答型の表（「法令名だけ（条は不明）→ `get_toc` → `get_law`」）は、範囲取得を挟む形に書き直す余地があります。ただし実測した手順に差し替える作業になるので、このリリースでは語彙とツール一覧までにしました。

## 版

`0.10.2`（patch）。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01VtG4YjaPNXLTpyaWV3xrcE
