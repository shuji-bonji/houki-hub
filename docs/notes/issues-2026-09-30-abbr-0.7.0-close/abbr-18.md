v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。壊れた取得時刻は `0` を返さず、`computeDaysSince` / `judgeStaleness` が例外を投げます。

### 「決めること」への答え

- **解釈できない取得時刻を `0` と区別できる値で返すか、呼び出し側の責任のままにするか** → 値を返さず `RangeError` を投げます（SPEC-ABBR-COMPUTE-DAYS-SINCE-003 の MODIFIED）。戻り値を `number | null` にすると `judgeStaleness(computeDaysSince(...))` の型が通らなくなるので、値ではなく例外にしました。今より後の取得時刻は時計のずれで起きるので、壊れた値とは扱わず `0` のままです（002）
- **ISO 8601 以外の書き方、時差の無い時刻、存在しない日付を受け付けるか** → 受け付けません。受け付けるのは `YYYY-MM-DD`（UTC の 0 時）/ `YYYY-MM-DDTHH:mm:ss(.sss)Z` / `YYYY-MM-DDTHH:mm:ss(.sss)±hh:mm` の 3 つの形だけです（SPEC-ABBR-COMPUTE-DAYS-SINCE-005）。`2026/05/07` `May 7, 2026`（006）、`2026-05-07T08:00:00`（007）、`2026-02-30T00:00:00Z`（008）は `RangeError`、文字列でない値は `TypeError`（010）です。`nowMs` の `NaN` / `±Infinity` は `RangeError`、数でない値は `TypeError` です（009）
- **`judgeStaleness` が `NaN` と負の値をどう扱うか** → 例外です。負の値は `RangeError`（SPEC-ABBR-JUDGE-STALENESS-005）、`NaN` / `±Infinity` は `RangeError`、数でない値は `TypeError`（006）。`StalenessLevel` の 3 つの値は family の応答に使われているので増やしません

利用側で変わること: houki-egov-mcp / houki-nta-mcp の `freshness.ts` は DB の `fetched_at` / `last_sync_date` を渡すので、壊れた値が `fresh` になる代わりに例外になります。どの `code` で返すかは段階 4（依存を `^0.7.0` に上げる実装 PR）で MCP 側の仕様に書きます。

### 出典

- 仕様 PR [#31](https://github.com/shuji-bonji/houki-abbreviations/pull/31)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-input-guards/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-input-guards/proposal.md)（「#18」「人が判断すること」4〜6）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「例外を投げるようになった引数」、「Notes」
