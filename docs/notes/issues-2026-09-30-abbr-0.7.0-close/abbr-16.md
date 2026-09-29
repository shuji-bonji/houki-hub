v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。実数は約束にせず、`getAbbreviationStats` は定数の全値をキーに持って 0 件は `0` を返します。

### 「決めること」への答え

- **版ごとの実数を仕様に書いて固定するか、約束にしないか** → 固定しません。仕様の例に版の値を書くだけです。`byDomain` の 6 キーがどれも 1 以上であること（SPEC-ABBR-GET-ABBREVIATION-STATS-003）は変わりません
- **件数 0 の種別・分野・MCP もキーに入れて `0` を返すか** → 入れます。`DOMAINS` / `CATEGORIES` / `SOURCE_MCP_HINTS` の全値を定数の順でキーに持ち、0 件は `0` です（SPEC-ABBR-GET-ABBREVIATION-STATS-005・006）。`getAbbreviationStats().byCategory.hanrei` は `undefined` ではなく `0` です
- **型を `Record<Domain, number>` / `Record<Category, number>` / `Record<SourceMcpHint, number>` にするか** → します（「戻り値」の MODIFIED）。`AbbreviationStats` の `byDomain` / `byCategory` / `bySourceMcpHint` が `Record<string, number>` から変わります

利用側で変わること: 起動時のログなどで `byCategory` のキーを列挙すると、0 件の種別（`kokuji` を含む 13 値すべて）も出ます。

### 出典

- 仕様 PR [#32](https://github.com/shuji-bonji/houki-abbreviations/pull/32)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md)（「#16」）
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) の判断の表「houki-abbreviations #16（`getAbbreviationStats`）」（案 A、2026-09-30）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「型の変更」
