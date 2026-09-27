# houki-nta-mcp「未決」のうちテストが無いだけの項目（A）の差分草案（2026-09-27）

houki-nta-mcp の初版起こし（#50）で「未決」に残った項目のうち、今の振る舞いのままでよくテストが無いだけのもの（A、65 件。一覧は `../issues-2026-09-26-nta-undecided/README.md`）に仕様 ID を足す差分草案をまとめた記録です。あわせて、差分を書いている途中で見つかった「意図か不具合かの判断が要る点」を Issue の下書きにしました。

## 差分草案（houki-nta-mcp の仕様 PR、7 本）

どれも `main` から切ったブランチに 1 コミットで、未署名・未 push です。proposal.md は「- 実装の変更: 要」、承認日は空欄です。`npx spec-ids check` は 7 本とも通り、`pr-scope` が報告するのは承認日の空欄だけです。

| ブランチ | 足す ID | 共通の spec.md に寄せたもの | ツール固有のもの | 消す未決 |
|---|---|---|---|---|
| `spec/20260927-index-status-marks` | 4 | 検索系 4 ツールの印は既存の SEARCH-RULES-011 で受ける | GET-BUNSHOKAITOU-004、GET-KAISEI-TSUTATSU-004、GET-QA-010、GET-TAX-ANSWER-009 | 8 件 |
| `spec/20260927-argument-and-parse-errors` | 3 | COMMON-ERRORS-007（INVALID_ARGUMENT の案内）・008（処理に進まない）・009（ページの解析の失敗）。5 件は既存の 003・004 で受ける | なし | 8 件 + common_errors 2 件 |
| `spec/20260927-search-hit-responses` | 2 | SEARCH-RULES-015（文書系 5 ツールのヒットの応答）。nta_search_tsutatsu 2 は既存の 012〜014 で受ける | SEARCH-TSUTATSU-010（legal_status はヒット時だけ） | 7 件 |
| `spec/20260927-search-keyword-rules` | 1 | SEARCH-RULES-016（展開の対象の範囲）。12 件は既存の 001〜010 で受ける | なし | 13 件 + search_rules 3 件 |
| `spec/20260927-search-zero-hits` | 6 | SEARCH-RULES-017（freshness の段階と warning） | SEARCH-BUNSHOKAITOU-005・006、SEARCH-JIMU-UNEI-005・006、SEARCH-TAX-ANSWER-003。nta_search_qa 10 はテスト名の修正だけ | 9 件 + search_rules 1 件 |
| `spec/20260927-get-responses` | 16 | なし | GET-BUNSHOKAITOU-005〜007、GET-JIMU-UNEI-005〜007、GET-KAISEI-TSUTATSU-005〜007、GET-TSUTATSU-016、GET-QA-011、RESOLVE-ABBREVIATION-006、INSPECT-PDF-META-014〜017 | 16 件 |
| `spec/20260927-fetch-paths` | 2 | なし | GET-QA-012、GET-TAX-ANSWER-010。tax_answer 8・tsutatsu 1 と #63 の 005・008・014 は既存 ID でテストだけ | 4 件 |

合計: 足す ID 34 件、A の 65 件すべてを「取り込みのときに消す未決」に割り当て済み。共通の spec.md（common_errors・search_rules）の未決も、同じテストで満たせる 6 件（common_errors 1・2、search_rules 1・6・10・13）を消す対象に入れました。

ID は `spec-ids next` が `specs/current/` しか見ないため、7 本のあいだで重ならないように手で振りました。7 本はどの順にマージしても衝突しません（同じ spec.md の「できること」の末尾に足す取り込みは、実装 PR の中で順に行います）。

## Issue にするもの（houki-nta-mcp に 4 件）

| # | 本文 | 題名 | 見つけた差分 |
|---|---|---|---|
| 01 | `01-multiple-argument-violations.md` | 引数に inputSchema の違反が 2 つ以上あると、detail.issues が 1 件にまとまり違反を取りこぼす | argument-and-parse-errors |
| 02 | `02-short-abbreviation-search.md` | 3 文字未満の略称（消法など）で略称そのものを含む文書が返らず、search_notes の説明とも合わない | search-keyword-rules |
| 03 | `03-short-latin-token-filter.md` | 英字の 2 文字の語と 3 文字以上の語を混ぜると、本文にその語があっても 0 件になる | search-keyword-rules |
| 04 | `04-search-hit-issued-at.md` | 検索のヒットの要素に issuedAt が付くかどうかが種別によって違う | search-hit-responses |

02・03 は search_rules の「未決」8・9 にすでに書かれていた項目で、差分を書く中で手元で呼んで確かめました。01・04 は今回新しく見つけたものです。

### 手順

1. `DRY_RUN=1 ./scripts/create-issues-2026-09-27-nta-untested.sh` で題名を確かめ、`./scripts/create-issues-2026-09-27-nta-untested.sh` で起票する（番号は `created.tsv` に残る）
2. `./scripts/apply-issue-numbers-2026-09-27-nta-untested.sh` で、3 本のブランチの proposal.md にある仮の番号 `#ISSUE-01`〜`#ISSUE-04` を実際の番号に置き換え、各ブランチのコミットに amend する
3. 7 本のブランチを署名して push し、仕様 PR を開く

## 受入テストで見つかった不具合（1 件、2026-09-28）

7 差分の受入テストを書いたとき、`test/20260927-search-hit-responses` の 1 件（SPEC-NTA-SEARCH-RULES-015、`nta_search_bunshokaitou`）が RED になりました。仕様どおりで実装が合っていないので、不具合の Issue にします。

| # | 本文 | 題名 |
|---|---|---|
| 05 | `05-snippet-cut-mid-word.md` | 検索の snippet が、4 文字以上の語の途中で `<b>` を閉じて切れる |

起票は 1 件なので、`create-issues-2026-09-27-nta-untested.sh`（01〜04 を起票する）は使わず、次のコマンドで行います。

```sh
url=$(gh issue create -R shuji-bonji/houki-nta-mcp \
  -t '検索の snippet が、4 文字以上の語の途中で <b> を閉じて切れる' \
  -F docs/notes/issues-2026-09-27-nta-untested/05-snippet-cut-mid-word.md)
printf '%s\t%s\t%s\n' 05-snippet-cut-mid-word.md "${url##*/}" "$url" >> docs/notes/issues-2026-09-27-nta-untested/created.tsv
```

ほかの 6 差分の受入テストは main に入りました（2026-09-28）。残りは、この Issue の fix PR → `test/20260927-search-hit-responses` の rebase → `chore: v0.21.1` → Publisher（7 差分の取り込み）です。
