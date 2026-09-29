v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。揃える場所を `normalizeJpText` の 1 か所にし、名前と ID を受け取る関数に `normalize` の指定を足しました。

### 「決めること」への答え

- **`getAllNames`・`extractLawNames` に `normalize` の指定を足すか、既定を揃えるか** → `options.normalize` を足しました。既定は `resolveAbbreviation` と同じ `false` です（SPEC-ABBR-GET-ALL-NAMES-009・010、SPEC-ABBR-EXTRACT-LAW-NAMES-016〜018）。`options` なしの呼び出しの結果は変わりません。MCP サーバーは入口で `true` を渡します
- **`lookupByLawId` で全角を半角にしてから比べるか** → `options.normalize: true` のときだけ半角にします。小文字は大文字にしません（SPEC-ABBR-LOOKUP-BY-LAW-ID-005〜007）。`lookupByLawId('３６３AC0000000108', { normalize: true })` は `消費税法` です
- **`normalizeJpText` でもダッシュ類を `-` に揃えるか** → 揃えました。`‐` `‑` `–` `—` `―` `−` `－` の 7 文字で、`normalizeLawNum` と同じ範囲です。罫線 `─` と長音 `ー` は変えません（SPEC-ABBR-NORMALIZE-JP-TEXT-012・013）。`normalizeJpText('１８３―２')` は `'183-2'` になります。`normalizeJpText` を通した文字列を検索用の列に入れている houki-egov-mcp・houki-nta-mcp は、投入済みの列と検索語が食い違うので、依存を `^0.7.0` に上げるときに列の再正規化か作り直しが要ります（段階 4 で決めます）
- **`normalizeSearchQuery` の小文字化を ASCII だけにするか、ドキュメントを直すか** → ASCII（`A`〜`Z`、全角なら `Ａ`〜`Ｚ`）だけにしました。`Ⅰ` `Α` `À` は変えません（SPEC-ABBR-NORMALIZE-SEARCH-QUERY-002 の MODIFIED、008）。egov・nta の FTS5（`unicode61`）は大文字小文字を区別しないので、検索結果は変わりません

### 出典

- 仕様 PR [#30](https://github.com/shuji-bonji/houki-abbreviations/pull/30)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-normalize/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-normalize/proposal.md)（「Issue の『決めること』への答え」「人が判断すること」2〜4・8）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「正規化の結果が変わる入力」
