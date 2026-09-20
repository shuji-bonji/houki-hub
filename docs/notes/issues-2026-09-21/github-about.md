# GitHub About の差し替え文（2026-09-21）

houki-hub#29 の後始末。各リポジトリの Settings（About の歯車）で description と topics を差し替える。方針は「日本語 1 文 → 英語 1 文」の併記で、英語の 1 文は `server.json`（MCP Registry）と同じ文字列にする。GitHub の検索は description の語に当たり、日本語と英語の順序は順位に関係しない。topics は英小文字・数字・ハイフンしか使えない。

## houki-egov-mcp

description:

```
日本の法令（憲法・法律・政令・省令・規則）を e-Gov 法令API v2 から、条・項・号の単位で、法令番号と URL を添えて返す MCP サーバー。Japanese statutes from e-Gov Law API v2 — laws and ordinances per article, with law number and URL.
```

topics: 変更なし（`egov` `hourei` `japan` `japanese-law` `law` `legal` `llm` `mcp` `mcp-server` `typescript`）

## houki-nta-mcp

description:

```
国税庁の基本通達・改正通達・事務運営指針・文書回答事例・タックスアンサー・質疑応答事例を全文検索し、legal_status と根拠条文への案内と鮮度を添えて返す MCP サーバー。Japan NTA tax notices (tsutatsu) and Q&A, marked with legal_status and linked back to the law.
```

topics: `mcp-serve` → `mcp-server`（他は変更なし: `japan` `japanese-law` `legal` `llm` `mcp` `nta` `tax` `tsutatsu` `typescript`）

## houki-research-skill

description: 変更なし

topics: `leagal` → `legal`

## houki-hub / houki-abbreviations

変更なし。

## 反映後に確かめること

- GitHub のリポジトリ検索 `japanese law mcp` に houki-nta-mcp が出る（2026-09-21 時点では egov 19 位、nta は 31 件中に無し）
- `https://api.github.com/repos/shuji-bonji/houki-nta-mcp` の `description` と `topics` が上の文と一致する
- npm と Registry は v0.15.1 / v0.18.3 の publish 後に、`https://registry.npmjs.org/@shuji-bonji%2Fhouki-egov-mcp` の `versions[latest].description` と `https://registry.modelcontextprotocol.io/v0/servers?search=io.github.shuji-bonji/houki-egov-mcp` の `description` を見る
