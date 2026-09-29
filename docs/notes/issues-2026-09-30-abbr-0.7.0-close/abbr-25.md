v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。`CATEGORIES` に `kokuji`（告示）を足し、`houki-egov` の説明から「告示」を外しました。

### 「決めること」への答え

- **`CATEGORIES` に告示の値を足すか。足すなら `law_type` との対応と `law_id` の形** → `kokuji` を `rule` の次に足しました（SPEC-ABBR-PUBLIC-CONSTANTS-007 の MODIFIED）。`law_type` は持たず（`LAW_TYPE_CODES` に足さない）、`law_id` は `null` です（`isValidLawId` に告示の形は無い）。`source_mcp_hint` は `houki-nta` / `houki-mhlw` で、`category_hint_mismatch` の許容表に足しました（SPEC-ABBR-VALIDATE-ALL-ENTRIES-018）。辞書にエントリはまだありません
- **足さない場合、`houki-egov` の説明から「告示」を外すか** → 足しますが、e-Gov 法令 API は告示を持たない（2026-10-01 に全 9,570 件を取得して種別を数えた結果、告示に当たる `law_id` の形は無い）ので、`houki-egov` の説明から「告示」を外し、`houki-nta` / `houki-mhlw` の説明に「告示」を足しました（`SOURCE_MCP_HINTS` の節の MODIFIED）

利用側で変わること: `Category` に `'kokuji'` が増え、`CATEGORIES` は 13 値になります。`kokuji` は `rule` の次なので、`CATEGORIES[6]` 以降の添字が 1 つずれます。`getAbbreviationStats().byCategory.kokuji` は `0` です（#16）。

### 出典

- 仕様 PR [#32](https://github.com/shuji-bonji/houki-abbreviations/pull/32)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md)（「#25」「人が判断すること」2・3）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「型の変更」、「Added」
