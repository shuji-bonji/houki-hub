# houki-nta-mcp #120 への追記コメント（草案）

houki-research-skill 側で、この Issue の結論に合わせて直す箇所を足します（2026-10-03 JST、houki-research-skill 0.17.0 の作業中に確認）。

## 直す箇所

`skills/houki-research/examples/error-recovery-patterns.md` のシナリオ 4 は、`nta_get_tsutatsu` が国税庁サイトの時間切れで次の応答を返す例です。

- `code: "SOURCE_TIMEOUT"`
- `retryable: true`
- `next_actions: [{ action: "retry_later", … }]`

houki-nta-mcp 0.23.0 の正本（`specs/current/common_errors/spec.md`）では、時間切れも `SOURCE_API_ERROR` で返し、`SOURCE_TIMEOUT` はどのツールも返しません。そのため、シナリオ 4 の例は今の houki-nta-mcp の応答と合いません。

この Issue の決めること 1 の結論で、Skill 側の直し方が変わります。

| 結論 | シナリオ 4 の直し方 |
| --- | --- |
| 4 つの code に分ける | 例の `code` はそのまま使える。houki-nta-mcp の版の注記を、分けた版にする |
| `SOURCE_API_ERROR` 1 つのまま | 例の `code` を `SOURCE_API_ERROR` にし、`detail.status` が無いことと `error` の文で時間切れと分かる、と書く |

どちらの場合も、houki-nta-mcp の版を出した日に houki-research-skill を追随させるときに直します。それまで Skill 側では直しません。

## あわせて見直すこと

この Issue の本文で引いている「最大 2 回まで retry」（`SKILL.md` の鉄則 5 の表）は、`docs/ERROR-HANDLING.md` の中でも書き方が揃っていません。

- `SOURCE_TIMEOUT` / `SOURCE_UNAVAILABLE` の節: 「1 回まで自動 retry」。注意の行は「同一セッション内では最大 2 回まで」
- 基本フローの図: 「retry: 1〜数回」
- アンチパターンの表: 「最大 2 回まで」

「1 回の呼び出しで何回 retry するか」と「1 セッションで合計何回まで retry するか」が区別されていません。この Issue の結論に合わせて Skill を直すときに、あわせて揃えます。
