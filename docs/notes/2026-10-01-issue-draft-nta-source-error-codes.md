# issue 草案: 国税庁サイトとの通信の失敗を `SOURCE_API_ERROR` 1 つで返している

対象リポジトリ: houki-nta-mcp（2026-10-01 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
タイトル案: 国税庁サイトとの通信の失敗を、houki-egov-mcp と同じ 4 つの code（`SOURCE_TIMEOUT` / `SOURCE_RATE_LIMITED` / `SOURCE_UNAVAILABLE` / `SOURCE_API_ERROR`）に分けるか
ラベル案: spec, question

---

## 背景

T2 の仕様差分 `specs/changes/20261001-t2-error-codes`（SPEC-NTA-COMMON-ERRORS-016）で、`SOURCE_API_ERROR` を「国税庁サイトとの通信が失敗した（接続できない・時間切れ・5xx・429）ときだけ」に限り、ページが無い（404・410・`/error/404.htm` への転送）ことは `DOC_NOT_FOUND` にしました（#65）。通信の失敗の側は 1 つの code のままです。

houki-egov-mcp は、同じ T2 の差分（SPEC-EGOV-COMMON-ERRORS-027・028）で通信の失敗を 4 つに分けています。

| e-Gov への要求の終わり方 | houki-egov-mcp の `code` | `retryable` |
| --- | --- | --- |
| HTTP 429 | `SOURCE_RATE_LIMITED` | `true` |
| 応答を待ちきれなかった | `SOURCE_TIMEOUT` | `true` |
| HTTP 5xx | `SOURCE_API_ERROR` | `true` |
| HTTP 4xx（429 を除く） | `SOURCE_API_ERROR` | `false` |
| 接続できない（`cause.code` が `ENOTFOUND` / `EAI_AGAIN` / `ECONNREFUSED` / `ECONNRESET` / `ETIMEDOUT`） | `SOURCE_UNAVAILABLE` | `true` |

houki-nta-mcp の `specs/current/common_errors/spec.md` の code の表には `SOURCE_TIMEOUT` / `SOURCE_RATE_LIMITED` の行がありますが、「v0.21.0 ではどのツールも返さない」と書いています。`SOURCE_UNAVAILABLE` は表にありません。

## 現状（v0.21.3、`src/services/nta-scraper.ts` と `src/tools/handlers.ts`）

- `fetchNtaPage()` は、`FETCH_CONFIG`（`src/config.ts`: `timeoutMs: 30_000`、`maxRetries: 3`、`retryBaseMs: 1_000`）で取り直し、最後も失敗したら `NtaFetchError`（`message` は `failed after 4 attempt(s): <元の文>`、`status` は HTTP の応答があったときだけ、`cause` に元の例外）を投げる
- 4xx は取り直さずにそのまま投げる（`status` 付き）
- `handlers.ts` は `NtaFetchError` を受けると、`status` の値を見ずに `SOURCE_API_ERROR`・`retryable: true`・`next_actions: [retry_later]`・`detail.status`（あれば）を返す（`nta_get_qa`、`nta_get_tax_answer`、`nta_get_tsutatsu` の `renderLiveResult`）
- 時間切れ（`AbortController` の中断）も、DNS の失敗（`fetch failed`、`cause.code: "ENOTFOUND"`）も、503 も、429 も、同じ `SOURCE_API_ERROR` になる。LLM は `detail.status` の有無と `error` の文（`failed after 4 attempt(s): …`）からしか見分けられない

## 困ること

- houki-research-skill の `docs/ERROR-HANDLING.md` と `SKILL.md` は、`SOURCE_TIMEOUT` / `SOURCE_UNAVAILABLE` を「最大 2 回まで retry。失敗時は平易に説明」、`SOURCE_RATE_LIMITED` を「間隔を空ける」と分けて案内している。nta ではこの分岐に入る code が返らないので、案内が効かない
- family で同じ場面に別の code が付く（egov は `SOURCE_UNAVAILABLE`、nta は `SOURCE_API_ERROR`）。`docs/ERROR-CODES.md` の表の nta の列に、どの code が返るかを正しく書けない

## 決めること

1. houki-egov-mcp の SPEC-EGOV-COMMON-ERRORS-027・028 と同じ表を houki-nta-mcp の `common_errors` に足すか（`SOURCE_TIMEOUT` / `SOURCE_RATE_LIMITED` / `SOURCE_UNAVAILABLE` を実際に返す）。それとも、nta は `SOURCE_API_ERROR` 1 つのままとし、code の表と Skill の `ERROR-CODES.md` に「nta は分けない」と書くか
2. 分けるなら、`NtaFetchError` に「どの種類の失敗か」を持たせるか（`status: 0` を時間切れの印にする egov の `EgovHttpError` と同じ形にするか、`kind` のようなフィールドを足すか）
3. 分けるなら、4xx（429 と、404・410 以外）を egov と同じ `SOURCE_API_ERROR`・`retryable: false` にするか。v0.21.3 では 4xx も `retryable: true` で返している
4. どの版で入れるか。T2 の差分は 0.22.0 に入れる予定で、この Issue はその外（段階 5 か、T2 の追加の差分）

## 関係する場所

- `specs/current/common_errors/spec.md` の「エラーの code」の表、T2 の SPEC-NTA-COMMON-ERRORS-016
- `src/services/nta-scraper.ts`（`NtaFetchError`、`fetchNtaPage`）、`src/tools/handlers.ts`（`NtaFetchError` を `SOURCE_API_ERROR` にしている 3 か所）
- houki-egov-mcp `specs/changes/20261001-t2-error-codes/specs/common_errors/spec.md`（027・028）
- houki-research-skill `docs/ERROR-CODES.md`、`docs/ERROR-HANDLING.md`

## 出典

- houki-hub `docs/DECISIONS.md` 2026-09-29「T2 code」
- houki-nta-mcp `specs/changes/20261001-t2-error-codes/proposal.md`「人が判断すること」2
