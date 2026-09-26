辞書の配列 `abbreviationEntries` は凍結されていますが、要素のエントリと公開定数は凍結されていません。利用側のコードが返り値や定数に代入すると、同じプロセスの中でこのパッケージの他の関数の結果まで変わります。houki-egov-mcp・houki-nta-mcp など、辞書を読み込む MCP サーバーすべてに影響します。

### いまの状態

| 対象 | 凍結 | 代入したときに起きること |
|---|---|---|
| `abbreviationEntries`（配列） | されている | `push` は `TypeError` |
| 各エントリと、その `aliases` の配列 | されていない | `abbreviationEntries[0].formal = "X"` のあと、`resolveAbbreviation("所法").formal` も `"X"` |
| `resolveAbbreviation` / `listByDomain` / `listByCategory` / `listBySourceMcpHint` / `lookupByLawId` / `lookupByLawNum` の返り値 | されていない（辞書のエントリそのもの） | `resolveAbbreviation('消法').formal = 'X'` のあと、`lookupByLawNum('昭和63年法律第108号')?.formal` も `'X'` |
| `STALENESS_THRESHOLDS` | されていない | `STALENESS_THRESHOLDS.fresh_days = 100` のあと、`judgeStaleness(50)` は `"fresh"`。README は「上書きしない」と書いている |
| `DOMAINS` / `CATEGORIES` / `SOURCE_MCP_HINTS` / `LAW_TYPE_CODES` | されていない | `DOMAINS.push("x")` のあと、`DOMAINS.length` は `7` |

書き換えを止めているのは、TypeScript の型（`readonly AbbreviationEntry[]`、`as const`）だけです。`AbbreviationEntry` のフィールドは `readonly` ではありません。

### 決めること

- エントリ・`aliases`・公開定数も `Object.freeze` するか、利用側が書き換えない前提のままにするか
- 凍結する場合、利用側が書き換えていたときに `TypeError` になるので、版の上げ方（minor か）と CHANGELOG の書き方
- 凍結しない場合、「返り値は辞書のエントリそのもので、書き換えてはいけない」ことを仕様と README に書くか

### 完了条件

- 上の方針が決まり、`specs/current/` の該当する仕様（`abbreviation_entries` の SPEC-ABBR-ABBREVIATION-ENTRIES-010 など）と README・実装が同じことを書いている

出典: `specs/current/` の「未決」— abbreviation_entries 1、judge_staleness 4、list_by_category 1、list_by_domain 2、list_by_source_mcp_hint 1、lookup_by_law_id 3、lookup_by_law_num 5、public_constants 1、resolve_abbreviation 2（初版起こし、PR #10）
