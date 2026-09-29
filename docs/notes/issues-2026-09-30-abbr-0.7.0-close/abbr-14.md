v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。エントリをまたぐ名前の重なりは辞書の約束として禁じ、`validateAllEntries` のエラーで CI に固定します。

### 「決めること」への答え

- **エントリをまたぐ名前の重なりを禁じるか。禁じるなら `validateAllEntries` のエラーにし、テストで固定する** → 禁じます。名前（`abbr` / `formal` / `aliases`）は `normalizeJpText` を通した後もエントリをまたいで重なりません（SPEC-ABBR-ABBREVIATION-ENTRIES-017）。`validateAllEntries` は `duplicate_name` のエラーにします（SPEC-ABBR-VALIDATE-ALL-ENTRIES-015）。`normalizeJpText` 後で比べるのは、`resolveAbbreviation({ normalize: true })` の索引が半角にした名前で引くためです（`PL法` と `ＰＬ法` を別のエントリに持てない）
- **禁じない場合、重なったときに返すエントリを 3 つの関数で揃えて仕様に書くか** → 禁じるので書きません。`resolve_abbreviation` 5 と `get_all_names` 4 の未決は 017 を根拠に消しました
- **一覧に無い `category` / `domain` / `source_mcp_hint` をエラーにするか** → エラーにします。`invalid_domain` / `invalid_category` / `invalid_source_mcp_hint` です（SPEC-ABBR-VALIDATE-ALL-ENTRIES-017）

利用側で変わること: v0.6.1 で警告だった「別名がほかのエントリの `abbr` と同じ」（`alias_collides_with_abbr`）は `duplicate_name` のエラーに含めたので、警告は無くしました（SPEC-ABBR-VALIDATE-ALL-ENTRIES-008 を REMOVED）。`warnings` の `code` を見ていたコードは `errors` を見ます。同梱の辞書は違反 0 件です。

### 出典

- 仕様 PR [#32](https://github.com/shuji-bonji/houki-abbreviations/pull/32)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md)（「#14」「人が判断すること」4〜6）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「`validateAllEntries` のエラーが増え、警告 `alias_collides_with_abbr` が無くなる」
