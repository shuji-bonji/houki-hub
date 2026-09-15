Discussion #20 の「劣っている点 › 配布と制約」5 項目のうち、機能の作業になるのは発見性だけでした。残りは調査 Issue か `docs/DECISIONS.md` に移します。

当初の本文は「パッケージ名が長い、キーワードが弱い、Star が少ない」と書いていましたが、これは症状です。原因は次の 2 つだと整理しました。

1. 1 つの仕事を終えるのに、plugin を 3 つ入れる必要がある
2. その仕事に名前が付いていないため、誰に向けた何なのかが伝わらない

## やること

- [ ] `shuji-bonji/claude-plugins` の `marketplace.json` で、`houki-research` に `"dependencies": ["houki-egov-mcp", "houki-nta-mcp"]` を宣言する。`pdf-publish` が `pdf-writer-mcp` で同じ形を取っています
- [ ] 仕事の名前を 1 つ決める
- [ ] README の 1 行目、npm の `description`、`marketplace.json` の `description` を、決めた名前に揃える
- [ ] その名前で houki-hub site のトップとガイドを書く
- [ ] MCP ディレクトリ（mcp.so / PulseMCP / Smithery / awesome-mcp-servers）に出す

## 仕事の名前について

`tax-law-mcp` と同じ「税務の裏取り」は名乗れません。README / DISCLAIMER が業としての利用を想定外としており、税理士法 52 条を明記しているためです（配布 3）。同じ土俵に乗ると、裁決 1,950 件を持たないまま看板も使えない形になります。

houki だけが答えられる問いを名前にします。

> 見つけた通達・質疑応答事例が今も生きているかを、根拠条文まで遡って確かめる

根拠となる実装は次のとおりです。

| 機能 | 版 | 答える問い |
|---|---|---|
| `orphaned_at` / `index_status` | nta v0.17.0 | いま国税庁の索引に残っているか |
| `legal_status` | nta | 国民を拘束するのか、行政内部の指示なのか |
| `next_actions`（通達→法律本文） | nta v0.11.0 / v0.12.0 | 根拠条文はどれか |
| `freshness` / `source` | egov / nta v0.16.0 | 何日時点のデータか |

`tax-law-mcp` は最終更新が 2026-03 で、通達と法令を同じツールに載せています。

## 測り方

npm の週次ダウンロードは導入者数を表しません（MCP は起動のたびに `npx -y` で落ちます）。plugin の導入数と、記事から site への流入で見ます。

## 移すもの

- 配布 1（better-sqlite3）/ 配布 2（Node.js 22 以上）→ {{I}}
- 配布 3（ライセンス文言）/ 配布 4（公式 MCP が出たあとの位置）→ `docs/DECISIONS.md`。コードの作業ではありません

出典: #20
