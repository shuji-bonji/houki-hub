# issue 草案: 法令本文の取得で e-Gov が 404 を返したときの code がツールで違う

対象リポジトリ: houki-egov-mcp（2026-10-01 作成）
提出先: https://github.com/shuji-bonji/houki-egov-mcp/issues/87
タイトル案: law_id が決まった後の e-Gov の 400・404 を、`SOURCE_API_ERROR`（`get_law` など）と `LAW_NOT_FOUND`（`verify_citations`）のどちらに揃えるか
ラベル案: spec, question

---

## 背景

T2 の仕様差分 `specs/changes/20261001-t2-error-codes`（SPEC-EGOV-COMMON-ERRORS-027）で、「`SOURCE_*` は e-Gov との通信が失敗したときだけ、`*_NOT_FOUND` は問い合わせが成功して求めたものが無かったときだけ」を規則にしました。houki-hub の 2026-09-29 の決定（T2）は、取得元の 404 を「番号の誤り」として `*_NOT_FOUND`（`retryable: false`）にする、と書いています（houki-nta-mcp #65 に適用）。

ただし T2 の差分は #46・#49・#69 の場面（法令名の検索の失敗、接続できないとき、50 MB 超）だけを変え、**law_id が決まった後の法令本文の取得で e-Gov が 4xx を返す場面は変えていません**。この場面は v0.15.4 の時点でツールによって code が違います。

## 現状（v0.15.4）

| 場面                                                          | code                                                                                  | 仕様 ID                                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `get_law` で法令本文の取得が 404（429 以外の 4xx）            | `SOURCE_API_ERROR`、`retryable: false`、`detail.status: 404`                          | SPEC-EGOV-GET-LAW-031                                                                  |
| `get_toc` / `get_law_range` / `get_law_revisions` の同じ場面  | `SOURCE_API_ERROR`、`retryable: false`                                                | SPEC-EGOV-GET-TOC-014、SPEC-EGOV-GET-LAW-RANGE-019、SPEC-EGOV-GET-LAW-REVISIONS-008    |
| `get_attachment` で e-Gov が 400・404（404003 以外）          | `SOURCE_API_ERROR`、`retryable: false`、`detail.cause` に応答本文                     | SPEC-EGOV-GET-ATTACHMENT-018                                                           |
| `get_attachment` で e-Gov が 404003（添付の実体が無い）       | `ATTACHMENT_NOT_FOUND`                                                                | SPEC-EGOV-GET-ATTACHMENT-010                                                           |
| `get_law_file` の同じ場面                                     | `SOURCE_API_ERROR`、`retryable: false`                                                | SPEC-EGOV-GET-LAW-FILE-014                                                             |
| `verify_citations` で `law_id` を書いた件に e-Gov が 400・404 | その件を `status: "not_found"`・`code: "LAW_NOT_FOUND"`（ツール全体はエラーにしない） | SPEC-EGOV-VERIFY-CITATIONS-015（`src/services/law-service.ts` の `isLawIdRejected()`） |

同じ「e-Gov がその law_id を知らない」を、`verify_citations` だけが `LAW_NOT_FOUND` にしています。

## いつ起きるか

law_id は略称辞書か法令名検索から取るので、通常は e-Gov が知らない law_id にはなりません。起きるのは次のときです。

- 略称辞書の `law_id` が古い（法令の廃止・統合で e-Gov から消えた）
- `verify_citations` の `law_id` を LLM が書き間違えた
- `at` で指定した時点にその法令が無い（e-Gov が 400 か 404 を返す。#47 の T1 で `at` の形は検査するようになったが、時点に法令が無いことは検査できない）

## 決めること

1. T2 の規則を当てて、法令本文の取得の 400・404 を `LAW_NOT_FOUND`（`retryable: false`）に揃えるか。それとも `verify_citations` の 015 を `SOURCE_API_ERROR` 側に揃えるか。どちらにしても、SPEC-EGOV-GET-LAW-031 / GET-TOC-014 / GET-LAW-RANGE-019 / GET-LAW-REVISIONS-008 / GET-ATTACHMENT-018 / GET-LAW-FILE-014 / VERIFY-CITATIONS-015 のどれかを MODIFIED にする仕様差分になる
2. `LAW_NOT_FOUND` にするなら、`hint` に「略称辞書の law_id が古いか、`at` の時点にこの法令が無い」の旨と、`next_actions` に `search_law`（`keyword` は法令名）と `get_law_revisions`（`at` を疑うとき）を入れるか
3. 400 を 404 と同じに扱うか。e-Gov は `at` の形の誤りにも 400 を返すので（#47）、400 を `LAW_NOT_FOUND` にすると引数の誤りが「法令が無い」と読まれる。T1 で `at` の形は inputSchema で止めるので、残る 400 は「その時点に無い」だけになる見込みだが、実データで確かめる
4. どの版で入れるか。段階 5 の 0.18.0（法令の引き当て #45・#51・#63）に近い話なので、そこに入れるか

## 関係する場所

- `src/services/law-service.ts` の `egovHttpErrorToLawError()`（4xx を `SOURCE_API_ERROR`・`retryable: false` にしている）と `isLawIdRejected()`
- `src/services/law-files.ts`（`get_attachment` / `get_law_file` の 400・404）
- 上の表の仕様 ID、`specs/changes/20261001-t2-error-codes/specs/common_errors/spec.md` の 027

## 出典

- houki-hub `docs/DECISIONS.md` 2026-09-29「T2 code」
- houki-egov-mcp `specs/changes/20261001-t2-error-codes/proposal.md`「人が判断すること」6
