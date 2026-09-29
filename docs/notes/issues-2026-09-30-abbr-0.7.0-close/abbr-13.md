v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。辞書の各エントリ・`aliases`・公開定数を `Object.freeze` し、代入は `TypeError` にしました。

### 「決めること」への答え

- **エントリ・`aliases`・公開定数も `Object.freeze` するか、利用側が書き換えない前提のままにするか** → 凍結します。`abbreviationEntries` の各エントリと `aliases` の配列（SPEC-ABBR-ABBREVIATION-ENTRIES-019）、`DOMAINS` / `CATEGORIES` / `SOURCE_MCP_HINTS` / `LAW_TYPE_CODES` / `STALENESS_THRESHOLDS`（SPEC-ABBR-PUBLIC-CONSTANTS-009）です。`resolveAbbreviation('消法').formal = 'X'`、`DOMAINS.push('x')`、`STALENESS_THRESHOLDS.fresh_days = 100` は strict mode（ES モジュール、TypeScript の出力）で `TypeError` を投げます（非 strict では代入が無視されます）。`listByDomain` などが返す配列と `getAbbreviationStats` の戻り値は呼ぶたびに新しいので、凍結しません
- **凍結する場合、版の上げ方と CHANGELOG の書き方** → 0.7.0（minor。段階 3 の他の差分と同じ版）です。CHANGELOG の 0.7.0 に「互換性」の節を書き、「返り値のエントリと公開定数への代入は `TypeError` になる。書き換えていたコードは `structuredClone(entry)` か `{ ...entry }` で自分のコピーを作る」と書きました。houki-egov-mcp / houki-nta-mcp の `src/` に代入は無いことを 2026-09-30 に確かめました（`DOMAINS` は `[...DOMAINS]` で読むだけ、`STALENESS_THRESHOLDS` は読むだけ）
- **凍結しない場合、「返り値は辞書のエントリそのもので、書き換えてはいけない」を仕様と README に書くか** → 凍結するので、仕様には「返り値は辞書のエントリそのもので、凍結されている」と書きました（019。`resolve_abbreviation` など 6 単位の「戻り値」には文言だけを足す）。README の「上書きしない」は「凍結されているので代入は `TypeError`」に直しました（#17）

### 出典

- 仕様 PR [#33](https://github.com/shuji-bonji/houki-abbreviations/pull/33)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-freeze/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-freeze/proposal.md)（「Issue の『決めること』への答え」「人が判断すること」2〜4）
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) の判断の表「houki-abbreviations #13（凍結）」（案 A、2026-09-30）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「凍結により代入が `TypeError` になる」
