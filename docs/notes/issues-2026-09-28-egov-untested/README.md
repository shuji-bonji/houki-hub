# houki-egov-mcp: テストが無いだけの未決 113 件の対応（2026-09-28）

houki-egov-mcp の初版仕様の「未決」のうち、今の振る舞いのままでよくテストが無いだけの 113 件に、仕様 ID と受入テストを足した記録です。あわせて、その途中で見つかった問題を Issue の下書きにしました。

## ブランチ（houki-egov-mcp、いずれも未署名・未 push）

| ブランチ | コミット | 内容 |
|---|---|---|
| `spec/20260928-untested-behaviors` | `26915b5` | 仕様 PR。`specs/changes/20260928-untested-behaviors/`（proposal.md と 20 本の差分）。ADDED 200 件。承認日は空欄 |
| `test/20260928-untested-behaviors`（上の上） | `363ced2` test / `46db295` chore v0.15.2 / `a670710` 取り込み | 実装 PR。受入テスト 20 本（`src/spec-tests/untested-20260928/`）、版 0.15.2、2 差分の `specs/current/` への取り込みと `specs/releases/v0.15.2/` への移動 |

- 113 件のうち 111 件に ID を振った。振らなかったのは get_law 1（既存の 004〜018 で受け、tools/call のテストを足した）と db_schema 7（不具合に見えるので Issue 03）
- `spec-ids check` OK（current 416 / tests 416）、vitest 48 files / 859 tests pass、biome format・lint 変更なし、pr-scope は実装 PR が OK、仕様 PR は承認日の空欄だけ
- 取り込みのコミットでは、20 本の承認日の行に `差分 20260928-untested-behaviors は 2026-09-28（PR #PR-SPEC）` を仮に書いた。仕様 PR の番号が決まったら置き換える

## Issue にするもの（houki-egov-mcp に 7 件）

| # | 本文 | 題名 |
|---|---|---|
| 01 | `01-connection-failure-code.md` | e-Gov に接続できないとき SOURCE_UNAVAILABLE を返さず、SOURCE_API_ERROR（fetch failed）になる |
| 02 | `02-verify-citations-duplicate-law-id.md` | verify_citations で同じ未知の law_id が並ぶと、2 件目以降の search_law の keyword が law_name にならない |
| 03 | `03-db-integrity.md` | laws.law_revision_id に NULL が入り、版を読めない DB は例外で開けない |
| 04 | `04-suppl-appendix-figure-location.md` | 附則の別表・様式にある図の location が附則全体になり、見出しが付かない |
| 05 | `05-explain-law-type-prototype-keys.md` | explain_law_type が toString・constructor で found: true を返し、info が無い |
| 06 | `06-cli-status-locale.md` | --status の件数の区切り文字が環境の言語設定で変わる |
| 07 | `07-bulk-download-progress.md` | 取得の進捗が、終わった時点で 100% にならない（SPEC-EGOV-CLI-BULK-DOWNLOAD-006 と実装の食い違い） |

02 は受入テストまで書いてあります（RED のため実装 PR からは外し、本文に貼りました）。

既存の Issue にはコメントで材料を足します（`comments.tsv`）: #54（search_fulltext の `limit` の小数で SqliteError）、#57（引数の問題が 2 つ以上あるときの `detail.issues`）、#63（施行規則からの呼び名 `規則`）。

## 起票

`scripts/create-issues-2026-09-28-egov-untested.sh`（`DRY_RUN=1` で題名だけ表示）。7 件を起票して `created.tsv` に番号を残し、続けて 3 件のコメントを足します。
