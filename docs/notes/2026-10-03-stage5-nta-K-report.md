# 段階 5 指示 K の結果（houki-nta-mcp 0.24.0 の仕様 PR: DB と CLI）

2026-10-03（JST）に、指示 K（`2026-10-03-stage5-spec-instructions.md`）で houki-nta-mcp の DB と CLI の仕様 PR を書いた記録です。0.24.0 の実装 PR の指示を作るときに使います。

## ブランチ（未署名・未 push・承認日は空欄）

| ブランチ | 起点 | コミット | Issue |
|---|---|---|---|
| `spec/20261003-db-cli` | main `67224f0`（J の 3 本はマージ済み） | `940c4d1` | #106・#107・#109・#110・#111・#112（#128 の索引の保存先を含む） |

| dir | ADDED | MODIFIED | REMOVED |
|---|---|---|---|
| db_schema | 021〜025 | 001・006・007・010〜014・019 | — |
| cli_entry | 006〜008 | 003〜005 | — |
| cli_bulk_download | 011〜013 | 010 | — |
| cli_refresh | 007 | 005・006 | — |
| cli_health_check | 007 | 001・003 | — |
| 計 | 13 | 17 | 0 |

`npx spec-ids check` は OK（current 242 IDs、changes 59 IDs）。`check-pr-scope.mjs` の指摘は承認日の空欄だけ。

## 要点

- スキーマの版は 11 → 12。足すのは `tax_answer_index`・`tax_answer_index_page`（#128）と `document.doc_type` の `CHECK`（#112）。`taxonomy` は制限しない
- 版 3〜11 はどの入口でも行を保って 12 に移行するので、0.24.0 で利用者の取り込み直しは要らない。版 12 にした DB を 0.23.x 以前で開くと全テーブルが消える（CHANGELOG に書く）
- egov 0.19.0 の規則から変えた点は 11 個（proposal.md の「egov 0.19.0 の規則から変えた点」の表）。大きいのは、投入の 9 フラグのどれでも DB を作る、書き戻すツール（`nta_get_tsutatsu`・`nta_get_qa`・`nta_get_tax_answer`）は DB が無ければ作る、版 3〜11 はツールからも移行する、の 3 つ
- houki-egov-mcp #102（数値の環境変数）は当たらない（nta の環境変数は 4 つで、数値のものは無い）
- 人が判断すること 17 件は proposal.md の末尾

## PR 本文の草案

```markdown
## 概要

houki-nta-mcp 0.24.0 の DB と CLI の仕様 PR です（段階 5、指示 K）。仕様の差分だけで、実装・テストは含みません。

- DB の状態（無い・版の記録が無い・同じ・古い・新しい・読めない・開けない）と、入口（投入・取り直し・一覧・読むだけのツール・書き戻すツール）ごとの扱い（#107。houki-egov-mcp 0.19.0 の #60 の規則を写し、nta 固有の点を変えた）
- スキーマの版 12: `document.doc_type` の `CHECK`（#112）とタックスアンサーの索引の 2 テーブル（#128）。版 11 からは行を保って移行し、取り込み直しは要らない
- CLI の引数の検査（形 → 値 → 組み合わせ、誤りは終了コード 2）と `--version` の文（#106。egov #61 と同じ規則）
- `--refresh-stale=<日数> --apply --refresh`（#109）、税目を絞った投入の `orphaned_at`（#110）、`--check-baseline-drift` の `not-applicable`（#111）

ADDED 13 / MODIFIED 17 / REMOVED 0。egov 0.19.0 から変えた点と「人が判断すること」は `specs/changes/20261003-db-cli/proposal.md` にあります。

Refs #106 #107 #109 #110 #111 #112 #128

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01NRCH3HasmvfwQ9ZzxcFMay
```
