# 題名

tax-research.md のステップ ② が `source_mcp_hint` の値を `"egov"` / `"nta"` と書いている（正しくは `houki-egov` / `houki-nta`）

# 本文

## 起きていること

`skills/houki-research/workflows/tax-research.md` のステップ ②（略称解決）の 92 行目（v0.17.0）に、次の文があります。

> `source_mcp_hint` が `"egov"` なら houki-egov-mcp を、`"nta"` なら houki-nta-mcp を主軸にする。

`resolve_abbreviation` の応答の `resolved.source_mcp_hint` は `"houki-egov"` / `"houki-nta"` です。この文のとおりに値を比べると、どちらにも当たりません。

- 正本: houki-nta-mcp `specs/current/resolve_abbreviation/spec.md` の応答の表（`source_mcp_hint`: 本文を持つ MCP の名前。例: `houki-nta` / `houki-egov`）と、SPEC-NTA-RESOLVE-ABBREVIATION-003 の表
- 同じ節の直前の呼び出し例のコメントは `source_mcp_hint: "houki-nta"` で、正本と合っています。食い違っているのは 92 行目の文だけです

## 見つけた経緯

2026-10-03 JST、houki-research-skill 0.17.0（houki-egov-mcp 0.17.0・houki-nta-mcp 0.23.0 への追随）の作業中に見つけました。0.17.0 の変更とは関係なく、それより前からある記述です。0.17.0 の PR では「正本と合わない記述は直さずに報告する」としたので、直していません。

## 直し方の案

92 行目を次のようにします。

> `source_mcp_hint` が `"houki-egov"` なら houki-egov-mcp を、`"houki-nta"` なら houki-nta-mcp を主軸にする。

ほかの文書（`SKILL.md`・`docs/`・`examples/`）には、同じ書き方は見つかりませんでした（`grep -rn '"egov"\|"nta"' skills`）。

## 検査で見つからなかった理由

`scripts/check-mcp-refs.mjs` はツール名・引数名と `code` を突き合わせますが、応答のフィールドの値は検査しません。
