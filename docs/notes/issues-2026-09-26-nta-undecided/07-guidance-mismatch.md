エラーの `hint`・`next_actions`・ツールの説明文が、実際の動きや他のツールと合っていない箇所があります。LLM はこれらの文面を見て次の呼び出しを組み立てるため、案内の誤りはそのまま誤った呼び出しにつながります。

### いまの状態

| ツール | 食い違い |
|---|---|
| `nta_get_tax_answer` | 未対応の番号帯のエラーに「houki-nta-mcp v0.2.x では未対応」「Phase 2 で対応予定」と古い版が書かれている。`8xxx` 帯を対応する意図があるかも決まっていない |
| `nta_search_tsutatsu` | `TSUTATSU_NOT_FOUND`（SPEC-NTA-SEARCH-TSUTATSU-003）の `hint` と `next_actions` は `--bulk-download`（通達 1 つ）を案内するが、ツールの説明文と `freshness.warning` は `--bulk-download-all`（4 種）を案内する |
| `resolve_abbreviation` | `hint` を `${source_mcp_hint}-mcp` で組み立てるため、`houki-court-mcp` などまだ無い MCP 名を案内する。`nta_get_tsutatsu` の `OUT_OF_SCOPE` と違い `next_actions` を付けない |
| `resolve_abbreviation` | tools/list の `abbr` の例が `電帳法`（法律で houki-egov の管轄）で、このツールでは `in_scope: false` になる |
| `nta_search_tax_answer` | 結果に番号（`docId`）はあるが、`next_actions` で `nta_get_tax_answer` を案内しない |
| `nta_search_kaisei_tsutatsu` | SPEC-NTA-SEARCH-KAISEI-TSUTATSU-002 の `hint` が、税目を絞って投入するフラグが無い種別では案内文が空のまま連結され、句点で終わる |
| `nta_get_jimu_unei` | json の `legal_status.note` が「通達は行政内部文書。…」で事務運営指針を名指ししない（markdown の注は「通達・事務運営指針は…」） |

### 決めること

- 各項目を直すか、今の文面を意図とするか
- `nta_get_tax_answer` の `8xxx` 帯に対応する予定があるか

### 完了条件

- 上の文面が実際の動きと一致している。`hint` / `next_actions` を仕様 ID に含めるものは受入テストがある

出典: `specs/current/` の「未決」— nta_get_tax_answer 4、nta_search_tsutatsu 8、resolve_abbreviation 4・5、nta_search_tax_answer 8、nta_search_kaisei_tsutatsu 9、nta_get_jimu_unei 6
