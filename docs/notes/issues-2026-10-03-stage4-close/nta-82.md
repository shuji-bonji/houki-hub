v0.23.0 で対応しました（npm 公開 2026-10-03 JST）。

### 「決めること」への答え

- **検索の `results` に `issuedAt` を全種別で付けるか** → 付けます。質疑応答事例とタックスアンサーは発出日を持たないので常に `null` です（SPEC-NTA-SEARCH-RULES-015）
- **値が無いときに `null` を入れるか（検索と取得で揃えるか）** → `null` を入れ、検索と取得で揃えました。取得ツールの json の `document.issuedAt` / `document.issuer` も、DB に値が無ければキーを消さずに `null` です（改正通達・事務運営指針・文書回答事例の json の ID）
- **タックスアンサーの日付（法令時点）をどう出すか** → `issuedAt` には入れず、別の名前の `basisDate`（`YYYY-MM-DD`）で出します。名前は `nta_get_qa` の `qa.basisDate` と同じです。`results[].basisDate` はタックスアンサーだけが値を持ち、ほかの種別は `null` です。取得側にも同じ値の `taxAnswer.basisDate` を足しました（SPEC-NTA-GET-TAX-ANSWER-008）。`taxAnswer.effectiveDate` はページの文字列（`令和7年4月1日現在法令等`）のままです

`basisDate` は記事を書いた時点の法令の日付で、発出日ではありません。houki-research-skill 0.17.0 の `docs/CITATION.md` に、`basisDate` を発出日として引用しないことを書きました。

### 出典

- 仕様 PR [#125](https://github.com/shuji-bonji/houki-nta-mcp/pull/125)（T4）、実装 PR [#127](https://github.com/shuji-bonji/houki-nta-mcp/pull/127)
- [`specs/releases/v0.23.0/20261003-t4-response-shape/proposal.md`](https://github.com/shuji-bonji/houki-nta-mcp/blob/main/specs/releases/v0.23.0/20261003-t4-response-shape/proposal.md)（「Issue の『決めること』への答え」#82）
- [CHANGELOG 0.23.0](https://github.com/shuji-bonji/houki-nta-mcp/blob/main/CHANGELOG.md)「互換性」の T4
