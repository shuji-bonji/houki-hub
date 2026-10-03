# 段階 5 指示 J の結果（houki-nta-mcp 0.24.0 の仕様 PR 3 本）

2026-10-03（JST）に、指示 J（`2026-10-03-stage5-spec-instructions.md`）で houki-nta-mcp の仕様 PR を 3 本書いた記録です。指示 K（DB と CLI）と、0.24.0 の後の houki-research-skill の追随で使います。

## ブランチ（main `9ae81aa` から積んだ。未署名・未 push・承認日は空欄）

| 順 | ブランチ | コミット | Issue | ADDED / MODIFIED / REMOVED |
|---|---|---|---|---|
| 1 | `spec/20261003-specs-current-catchup` | `0804ea5` | #123 | 0 / 0 / 0（実装の変更: 不要。specs/current の 13 本を直接直した） |
| 2 | `spec/20261003-search-rules` | `9419117` | #81・#80・#72 | 2 / 4 / 2 |
| 3 | `spec/20261003-source-paths` | `67b58ea` | #120・#128・#131 | 4 / 16 / 1 |

## 指示 K に渡すこと（#128 の索引の保存先）

`spec/20261003-source-paths` の proposal.md の「索引を DB に保存するためのスキーマ（指示 K に渡す）」の節を読む。勧める案 1 は、タックスアンサーの索引（`/taxes/shiraberu/taxanswer/code/`）を入れる新しいテーブルを、#107・#112 の版上げと同じ 1 回で足すもの。案 3（DB に保存しない）を採るなら K に渡すものは無い。

- 足すもの: 1 行 1 記事（番号・記事の URL・税目フォルダ・題名）と、索引のページの取得の記録（URL・取得日時・Last-Modified・ETag）
- #112 の `taxonomy` の CHECK を入れるなら、タックスアンサーの値は 13 個（`shotoku` `gensen` `joto` `sozoku` `zoyo` `hyoka` `hojin` `shohi` `inshi` `hotei` `fufuku` `saigai` `osirase`）
- `--bulk-download-tax-answer` が索引を同じテーブルに保存するか、`--refresh` で消すかは K で決める
- `cli_bulk_download` の `--tax-answer-taxonomy` の一覧（入力の表）は source-paths の差分で 13 個にした。K は同じ spec.md の別の行を触るので、source-paths の上に積む

## houki-research-skill で 0.24.0 の後に直す箇所

| ファイル | 箇所 | 直すこと | Issue |
|---|---|---|---|
| `skills/houki-research/docs/ERROR-CODES.md` | 「取得元からの取得の失敗」の表 | `SOURCE_API_ERROR` の意味から「houki-nta-mcp は、接続できない・時間切れ・5xx・429 もこの code で返す」を消す。`SOURCE_UNAVAILABLE` の houki-nta-mcp の列に ○ | #120 |
| 同上 | 「正本に載っているが返さない code」 | houki-nta-mcp の `SOURCE_TIMEOUT`・`SOURCE_RATE_LIMITED` の行を消す（節ごと空になる） | #120 |
| 同上 | 「`retryable` の読み方」 | `SOURCE_API_ERROR` の 4xx が `retryable: false` になるのは houki-egov-mcp だけでなく houki-nta-mcp（0.24.0）も、と書く。houki-nta-mcp は 429 を取り直さない | #120 |
| 同上 | `DOC_NOT_FOUND` の行 | `nta_get_tax_answer` で国税庁の索引に番号が無いときも、を足す | #128 |
| `skills/houki-research/docs/ERROR-HANDLING.md` | 冒頭の図（`SOURCE_TIMEOUT/RATE_LIMITED/UNAVAILABLE` → 「retry: 1〜数回」） | retry の回数の書き方を揃える（下の行） | #120 のコメント 2026-10-03 |
| 同上 | 「`SOURCE_TIMEOUT` / `SOURCE_UNAVAILABLE`」の節 | 「1 回まで自動 retry」と注意の「最大 2 回まで」を、「1 回の呼び出しで何回」と「1 セッションで合計何回」に分けて書く。ユーザーに見せる文の「e-Gov 側の」を「取得元（e-Gov・国税庁サイト）の」にする | #120 |
| 同上 | 「`SOURCE_API_ERROR`」の節の原因の行 | houki-nta-mcp も houki-egov-mcp と同じく、時間切れ・429・接続できないときは別の `SOURCE_*` を返す（0.24.0）。403・400 などは `retryable: false` | #120 |
| 同上 | アンチパターンの表の「最大 2 回まで」 | 上の書き分けに合わせる | #120 |
| `skills/houki-research/examples/error-recovery-patterns.md` | シナリオ 4（`nta_get_tsutatsu` の `SOURCE_TIMEOUT`） | 例の `code` はそのまま使える。houki-nta-mcp の版の注記を 0.24.0 以上にする。「1 回 retry」「1 セッション最大 2 回」を ERROR-HANDLING.md の書き分けに合わせる | #120 のコメント 2026-10-03 |
| `skills/houki-research/SKILL.md` | 鉄則 5 の表（`SOURCE_TIMEOUT` / `SOURCE_UNAVAILABLE` は「最大 2 回まで retry」） | ERROR-HANDLING.md の書き分けに合わせる | #120 |
| 同上 | 166 行目付近の「8xxx 帯の docId は `nta_get_tax_answer` で取れない」の段落 | 消す（0.24.0 で取れる） | #128 |
| `skills/houki-research/workflows/tax-research.md` | 223 行目付近の同じ段落 | 消す | #128 |
| `skills/houki-research/workflows/feasibility-check.md` 86 行目と `scripts/test/tool-refs.test.mjs` | `search_law { "keyword": "<語>", "domain": "tax" }` | houki-egov-mcp 0.18.0（egov #55）の追随で直す。nta の #72 とは別（`nta_search_qa` に `domain` を渡す例は Skill に無い） | egov #55 |

## egov #88 に当たる場面（nta の検索ツールの keyword 全体が houki-egov の管轄の略称）

今の動き（2026-10-03 JST、houki-nta-dev 0.23.0）: OUT_OF_SCOPE にせず、略称を正式名に広げて検索する（SPEC-NTA-SEARCH-RULES-016 で houki-egov の管轄の項目も広げると決めてある）。

- `nta_search_tsutatsu { keyword: "電帳法" }` → 消基通 1-8-2 を 1 件。`scoreReasons` に `abbreviation expanded: 電帳法 → 電子計算機を使用して作成する国税関係帳簿書類の保存方法等の特例に関する法律`
- `nta_search_jimu_unei { keyword: "電帳法" }` → 2 件（本文に「電帳法通達」と、法律の正式名）
- `nta_search_qa { keyword: "労基法" }` → 1 件（本文に「労働基準法」）

egov #88 と向きが逆で、意図して違う。e-Gov の法令の本文に通達の略称はほぼ出てこない（egov では `消基通` の本文検索が 0 件）が、国税庁の通達・事例の本文には法令名がよく出てくるので、nta で法令の略称を検索するのは、その法令に触れた通達・事例を探す使い方になる。Issue にしない判断を勧める。Issue にするなら論点は 1 つで、「検索結果が法令の本文ではないことを、`next_actions`（houki-egov の `get_law` への案内）で示すか」。`nta_search_tsutatsu` はすでに `base_laws_by_tsutatsu` と `get_law` の案内を返している。
