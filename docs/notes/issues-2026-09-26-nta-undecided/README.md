# houki-nta-mcp 初版仕様の「未決」の振り分け（2026-09-26）

houki-nta-mcp #50 で全 14 ツールの `specs/current/<tool>/spec.md` を起こしたときに、「未決」に 110 件が残りました。これを、利用者にとって解決が要る事項（B）と、振る舞いは今のままでよくテストが無いだけの事項（A）に分け、B を種別ごとの Issue にするための下書きです。

## 方針（2026-09-26 に決定）

- **A（テストが無いだけ、65 件）**: 仕様 ID を足す方向で進めます。仕様 PR で ADDED の差分を `specs/changes/` に出し、実装 PR で Test Designer がテストを書き、Publisher が `specs/current/` に取り込みます。
- **B（判断が要る、45 件）**: 初版起こしは現状把握が目的なので、ここで見つかった問題は Issue にします。同じ問題が複数のツールに出ているものは 1 件にまとめ、10 件にしました。

## B: 起票する Issue（houki-nta-mcp）

| # | 本文 | 題名 | 対象の未決 |
|---|---|---|---|
| 01 | `01-error-code.md` | 取得系ツールと resolve_abbreviation の「見つからない」ときのエラー code を揃える | 4 件 |
| 02 | `02-not-found-retryable.md` | 存在しない番号を指定すると、再試行を案内するエラー（SOURCE_API_ERROR）になる | 2 件 |
| 03 | `03-identifier-form.md` | 取得系ツールで識別子の形と全角の表記の扱いが揃っていない | 6 件 |
| 04 | `04-taxonomy-check.md` | 検索系ツールで taxonomy の値を検査しない | 3 件 |
| 05 | `05-limit-rounding.md` | 検索系ツールで limit の範囲外の値を黙って丸める | 6 件 |
| 06 | `06-empty-keyword.md` | 空のキーワードをエラーにせず「該当なし」として返す | 7 件 |
| 07 | `07-guidance-mismatch.md` | hint・next_actions・説明文の案内が実際の動きと合わない | 7 件 |
| 08 | `08-response-shape.md` | 同じ種類の応答でフィールドの有無や名前が揃っていない | 5 件 |
| 09 | `09-qa-domain.md` | nta_search_qa の domain 引数の扱い | 2 件 |
| 10 | `10-stored-values.md` | DB に入れる値と保存するファイル名の扱い（不具合の疑い） | 3 件 |

起票は `scripts/create-issues-2026-09-26.sh` で行います（`DRY_RUN=1` で題名だけ表示）。作成した番号は `created.tsv` に残ります。起票後、各 `spec.md` の「未決」の該当項目は「→ houki-nta-mcp #N」の 1 行に縮めます（仕様 PR、「実装の変更: 不要」）。

## A: テストを足す項目（65 件）

「未決」の番号で示します。B に振った番号は含みません。

| ツール | 未決の番号 |
|---|---|
| nta_get_bunshokaitou | 2, 3, 4, 5 |
| nta_get_jimu_unei | 2, 3, 4, 5 |
| nta_get_kaisei_tsutatsu | 1, 2, 3, 4, 7 |
| nta_get_qa | 3, 4, 5, 6 |
| nta_get_tax_answer | 5, 6, 7, 8 |
| nta_get_tsutatsu | 1, 2, 3 |
| nta_inspect_pdf_meta | 2, 3, 4, 7, 8 |
| nta_search_bunshokaitou | 1, 2, 3, 4, 5 |
| nta_search_jimu_unei | 1, 2, 3, 4, 8, 9, 10 |
| nta_search_kaisei_tsutatsu | 4, 5, 6, 7, 8 |
| nta_search_qa | 1, 3, 4, 5, 6, 10 |
| nta_search_tax_answer | 1, 2, 3, 4, 5 |
| nta_search_tsutatsu | 2, 3, 4, 5, 6, 7, 11 |
| resolve_abbreviation | 6 |

補足:

- `nta_search_qa` の 10 はテスト名の誤り（名前に `nta_search_qa` とあるが `nta_search_tax_answer` を呼んでいる）で、テストを書くときに名前を直します。
- 同じ種類の項目（索引から消えた文書の印、`INTERNAL_ERROR`、短い語と通称の展開、ヒットしたときの応答の形、inputSchema 違反の `INVALID_ARGUMENT`）は、ツールをまたいで同じ形のテストになるので、テーマごとに 1 本の仕様 PR にまとめられます。
- `spec/20260926-processing-flow` で書き直した nta_get_tsutatsu の 005・008・014 の条件にもテストが無く、A と同じ扱いにします。
