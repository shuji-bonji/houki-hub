Discussion #20 の「劣っている点 › 機能」9 項目を、実装先ごとの Issue に割り付けました。本 Issue は進捗を束ねるためのもので、ここでは実装しません。

割り付けの全体と、起票前の実測による訂正は `docs/ROADMAP.md` の「Discussion #20 の指摘（14 項目）の割り付け」と `docs/notes/2026-09-14-issue-21-22-breakdown.md` にあります。

## houki-egov-mcp

- [ ] 漢数字の条番号・号番号を受け付ける（機能 4）— {{A}}
- [ ] 引用の実在確認ツール（機能 3）— {{B}}
- [ ] 添付ファイルと法令ファイル形式を出す（機能 1）— {{C}}
- [ ] 施行令・施行規則の関連付け（機能 2）— {{D}}
- [ ] 差分同期の運用経路（機能 5 / Phase 2-8）— {{E}}
- [ ] 章・節単位の分割取得（機能 6）— {{F}}
- [ ] 2 文字語の本文検索（機能 7）— {{G}}
- [ ] `get_toc` の附則の配置（機能 8）— {{H}}

## houki-abbreviations

- [ ] `lookupByLawNum` の漢数字↔算用数字正規化 — {{J}}

機能 4 とは対象が違います（条番号 / 法令番号）。層を分けたまま、両方で正規化します。

## 起票前の実測による訂正

Discussion の記述と実態が食い違っていた 2 件です。Issue 本文は実態に合わせています。

| Discussion の記述 | 実測（egov v0.6.0） |
|---|---|
| 機能 5「DB 更新は全件再取り込みだけ」 | `src/cli/index.ts` に `--bulk-download-by-date <YYYYMMDD>` があり、`downloadIncrementalZip`（`file_section=3`）で単日差分を取り込みます。`sync_state` もあります。欠けているのは、前回同期日から今日までの未取得日を自動で回す入口です |
| 機能 8「附則を平坦に並べる」 | `src/services/law-search.ts` に `isSupplementaryArticle` と `附則(3) 1` の表示があります。欠けているのは `get_toc` の階層配置です |

## Issue にしない項目

**機能 9（裁決・判例・厚労通達が別リポジトリ）** は欠落ではなく、責務を分けた設計の結果です。回答は `docs/ROADMAP.md` の新 MCP（houki-metadata / houki-mhlw / houki-saiketsu / houki-court）です。ここで追跡すると閉じられないため、含めません。

## 注意

機能 2（参照を辿る）は #8（GraphRAG・KAG による法令グラフ）と対象が重なります。実装前に、どちらの層で参照関係を持つかを決めてください。

出典: #20
