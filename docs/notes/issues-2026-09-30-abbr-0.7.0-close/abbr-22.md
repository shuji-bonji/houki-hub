v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。3 つの関数の `limit` を「1 以上 500 以下の整数だけ。それ以外は例外」に揃えました。

### 「決めること」への答え

- **`NaN`（と `Infinity`）を既定値として扱うか、例外にするか** → 例外にします。`NaN` / `±Infinity` は `RangeError`、数でない値は `TypeError` です（SPEC-ABBR-SEARCH-BY-NAME-019、SPEC-ABBR-FIND-SIMILAR-019、SPEC-ABBR-SUGGEST-CORRECTION-007）。`undefined` は既定値（50 / 5 / 5）のままです
- **`findSimilar` / `suggestCorrection` にも上限を設けるか。設けるなら値** → 設けます。`searchByName` と同じ 500 で、500 超は丸めずに `RangeError` です（SPEC-ABBR-SEARCH-BY-NAME-020、SPEC-ABBR-FIND-SIMILAR-020、SPEC-ABBR-SUGGEST-CORRECTION-008）
- Issue 本文では「1 未満は 1 件」を今の動きのままにする前提でしたが、houki-hub の T1（引数の検査は丸めない）に揃え、1 未満と小数も例外にしました（SPEC-ABBR-SEARCH-BY-NAME-017・018、SPEC-ABBR-FIND-SIMILAR-013・018、SPEC-ABBR-SUGGEST-CORRECTION-004・006）。`findSimilar` の `maxDistance` と `extractLawNames` の `minLength` の丸めは変えていません

利用側で変わること: v0.6.1 で 1 件や 0 件になっていた呼び出しが例外になります。MCP サーバーの inputSchema で止めた後に届く値は正しいので、通常の呼び出しでは起きません。

### 出典

- 仕様 PR [#31](https://github.com/shuji-bonji/houki-abbreviations/pull/31)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-input-guards/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-input-guards/proposal.md)（「#22」「人が判断すること」2・3）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「例外を投げるようになった引数」
