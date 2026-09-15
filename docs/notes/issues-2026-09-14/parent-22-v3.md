Discussion #20 の「劣っている点 › 配布と制約」5 項目のうち、機能の作業になるのは発見性だけでした。残りは調査 Issue か `docs/DECISIONS.md` に移します。

当初の本文は「パッケージ名が長い、キーワードが弱い、Star が少ない」と書いていましたが、これは症状です。原因は次の 2 つだと整理しました。

1. 1 つの仕事を終えるのに、plugin を 3 つ入れる必要がある
2. その仕事に名前が付いていないため、誰に向けた何なのかが伝わらない

## 「1 回の導入」は 2 段構えです

Discussion #24（nta の評価）で、当初の想定に抜けがあることが分かりました。plugin をまとめても、入れた直後に取り込みが始まります。

| 段階 | egov | nta |
|---|---|---|
| plugin を入れる | `dependencies` で 1 回に減る | 同左 |
| **使える状態にする** | `--bulk-download-everything` で約 290 MB | **6 種別で約 100 分** |

手数（a）と時間（b）の両方を下げないと、「1 回の導入で終わる」になりません。

## やること

### (a) 導入の手数 — 実装済み（公開待ち）

- [x] `houki-research-skill` の `.claude-plugin/plugin.json` に `"dependencies": ["houki-egov-mcp", "houki-nta-mcp"]` を宣言（v0.7.0）
- [x] `shuji-bonji/claude-plugins` の `marketplace.json` の `houki-research` にも同じ `dependencies` を書く（`pdf-publish` / `pdf-trust` / `pdf-read` と同じ形。pdf family は plugin.json と marketplace.json の両方に書いています）
- [x] `docs/DECISIONS.md` の未決「meta-package `@shuji-bonji/houki-hub`（一括 install）」→ **この方式で足りるため作らない**と判断

版の範囲は付けず、名前だけを書いています。範囲を付けると `houki-egov-mcp--v0.6.0` の形の git tag が要りますが、各 MCP のタグは `v0.6.0` の形なので解決できません。名前だけなら marketplace の最新が入ります。

`@shuji-bonji/pdf-reader-mcp` は入れていません。PDF に当たったときだけ要るもので、条文と通達を引く流れでは使いません。shuji-bonji/houki-nta-mcp#36（改正通達の PDF の読み方）の結論が出てから決めます。

公開の順序は、houki-research-skill の main を先に push → タグ `v0.7.0` で Release → そのあと claude-plugins を push、です。逆にすると `marketplace-version-check` が落ちます（GitHub 上の `plugin.json` を正として突き合わせるため）。

### (b) 導入の時間

- [ ] nta の初回取り込みを数分で試せるようにする — shuji-bonji/houki-nta-mcp#35
- [ ] egov 側も同じ構造（290 MB / `source: "api-fallback"`）なので、試用の経路を README の先頭に書く

### (c) 名前と掲載

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

- 配布 1（better-sqlite3）/ 配布 2（Node.js 22 以上）→ #23
- 配布 3（ライセンス文言）/ 配布 4（公式 MCP が出たあとの位置）→ `docs/DECISIONS.md`。コードの作業ではありません

出典: #20 / #24
