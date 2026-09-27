# houki-egov-mcp: 初版 specs/ の設置（houki-hub #26 / #27）

- 日付: 2026-09-28（JST）
- 対象: houki-egov-mcp v0.15.1
- 目的: 外から見える単位ごとに、テストで確かめられる約束を `specs/current/<dir>/spec.md` に置き、#26（仕様を担保するエージェント）と #27（仕様からツールごとの説明ページを生成）の入力にする
- 見本: houki-nta-mcp（14 ツール + common_errors / search_rules）、houki-abbreviations（公開関数 23 件、PR #10）

## ブランチ（いずれも未署名・未 push、承認日は空欄）

| 順 | ブランチ | コミット | 内容 | pr-scope |
|---|---|---|---|---|
| 1 | `ci/spec-ids` | `10c6490` | devDependencies `@shuji-bonji/spec-ids ^0.2.0`（lockfile は 2 か所だけ追加）、`specs/spec-ids.json`（EGOV・接頭辞なし）、`.gitkeep`、ci.yml に spec-gate と pr-scope、`.github/scripts/check-pr-scope{,.test}.mjs`、AGENTS.md | OK（実装 PR 扱い） |
| 2 | `spec-init/egov-initial`（1 の上） | `daa85e1` spec / `afce288` test | 20 単位の spec.md と、テスト名 377 か所への ID 追加 | 承認日の空欄 20 件だけ |

- 1 を先にマージする。2 に基盤のファイルを含めると `spec-init/` の範囲外で pr-scope が RED になるため分けた
- check-pr-scope.mjs は abbreviations の版（`.gitkeep` と取り込み済み差分の残りの扱い）に、nta の「ID の付いたテスト名に別の ID を足すのは通す」判定を合わせた。node:test 18 件 pass
- 確認済み: `spec-ids check` exit 0（current 20 files / 216 IDs、tests 216 IDs）、vitest 28 files / 456 tests pass（VM で `npm ci` し直した作業コピー）、biome format 変更なし
- 承認日は、マージ前に 20 本の spec.md の「- 承認日:」へ書く（例: `- 承認日: 2026-09-28（PR #N）`）

## 20 単位と件数

| dir | 種類 | ID | 未決（うちテスト無し） |
|---|---|---|---|
| search_law | ツール | 1 | 10（5） |
| get_law | ツール | 18 | 20（11） |
| get_toc | ツール | 11 | 9（6） |
| search_fulltext | ツール | 23 | 9（5） |
| resolve_abbreviation | ツール | 4 | 6（3） |
| get_law_revisions | ツール | 1 | 12（6） |
| explain_law_type | ツール | 10 | 8（5） |
| get_related_laws | ツール | 8 | 7（4） |
| get_article_references | ツール | 22 | 17（10） |
| verify_citations | ツール | 19 | 18（13） |
| get_law_range | ツール | 16 | 9（7） |
| list_attachments | ツール | 9 | 8（6） |
| get_attachment | ツール | 10 | 12（7） |
| get_law_file | ツール | 7 | 11（6） |
| common_errors | 共通 | 11 | 11（4） |
| db_schema | DB | 11 | 10（6） |
| cli_entry | CLI | 4 | 5（2） |
| cli_bulk_download | CLI | 19 | 7（2） |
| cli_sync | CLI | 8 | 4（3） |
| cli_status | CLI | 4 | 5（2） |
| 計 | | 216 | 198（113） |

search_law と get_law_revisions は、e-Gov の応答を差し替えてツールを通すテストが無く、ID が 1 件ずつしかない。

## 判断が要る未決のうち、複数のツールにまたがるもの（Issue は 1 件ずつにまとめる候補）

1. 法令名が完全一致しないとき、e-Gov の検索結果の先頭の法令を知らせずに使う（get_law / get_toc / get_law_range / get_law_revisions / get_related_laws / get_article_references）
2. 法令名を法令 ID にするための e-Gov の検索が失敗しても `LAW_NOT_FOUND` を返し、`SOURCE_*` にならない（get_law / get_law_revisions / get_related_laws / get_article_references / list_attachments / get_attachment / get_law_file。verify_citations は逆に全体を `SOURCE_API_ERROR` にする）
3. `at` の形（YYYY-MM-DD）を確かめずに e-Gov に渡す（get_law / verify_citations / get_article_references / list_attachments / get_attachment / get_law_file）
4. `paragraph` の 0・負の数・小数が `ARTICLE_NOT_FOUND` になる（`item` の同じ値は `INVALID_ARTICLE_NUM`）（get_law / verify_citations）
5. 50 MB を超えるファイルが `INVALID_ARGUMENT` になる（get_attachment / get_law_file）
6. README・description とのずれ: エラー code の表（common_errors の未決 6・7・10・11）

## 単独で影響の大きいもの

- search_law: `domain` を受け付けるが絞り込みに使わない。`limit` の上限 50 をかけない（100 で 100 件返る）
- cli_bulk_download: `--bulk-download-by-date` が `last_sync_date` を実行日にするため、その後の `--sync` が間の日を飛ばす。`last_sync_date` は UTC の日付
- db_schema: 新しい版の DB を古い版のサーバーで開くと、版が違うだけで作り直して中身が消える
- get_law_file: Content-Disposition が無いと `saved.law_revision_id` に法令 ID が入る
- get_article_references: 「附則第三条」が本則の条への internal になる

## 次の手順（nta・abbreviations と同じ）

1. `ci/spec-ids` を署名 → push → PR → CI → ff マージ
2. `spec-init/egov-initial` を main に載せ直し、承認日を書いて署名 → push → PR → CI → ff マージ
3. 判断が要る未決（85 件）を種別ごとに Issue にまとめ、spec.md の未決を「→ #N」に縮める仕様 PR
4. テストが無いだけの未決（113 件）に受入テストを足す仕様 PR → Test Designer → 実装 PR
5. #27 の生成スクリプトに egov の 20 単位を加える（「- 種類:」で節を分ける）
