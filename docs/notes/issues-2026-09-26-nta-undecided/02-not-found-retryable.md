国税庁サイトから取るツールで、存在しない番号を指定したときに「時間をおいて再試行する」よう案内するエラーが返ります。番号の誤りは再試行しても直らないため、利用者を誤った次の行動へ導きます。

### いまの状態

| ツール | 入力 | 今の応答 |
|---|---|---|
| `nta_get_qa` | 存在しない `topic` / `category` / `id` の組 | 国税庁サイトが 404 を返し、`SOURCE_API_ERROR`（`retryable: true`、`next_actions` は再試行の案内） |
| `nta_get_tax_answer` | 存在しない `no` | 同じく `SOURCE_API_ERROR`（`retryable: true`、`url`、`detail.status`） |

一方、`nta_get_bunshokaitou` などは番号の誤りを `DOC_NOT_FOUND` で返し、`nta_get_tsutatsu` は候補ページの 404 を再試行できるエラーにしていません（SPEC-NTA-GET-TSUTATSU-009）。

### 決めること

- 404（と 410）を、番号の誤りとして再試行できないエラー（例: `DOC_NOT_FOUND`、`retryable: false`）にするか
- そのときの `next_actions`（`nta_search_qa` / `nta_search_tax_answer` で番号を探す案内）

### 完了条件

- 2 ツールで、存在しない番号に対して再試行を案内しない
- この応答に仕様 ID と受入テストがある（今はこのエラー自体のテストが無い）

出典: `specs/current/` の「未決」— nta_get_qa 1、nta_get_tax_answer 1
