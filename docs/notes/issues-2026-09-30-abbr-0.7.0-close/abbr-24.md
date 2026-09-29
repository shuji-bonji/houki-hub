v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。漢数字は年・番号の位置だけを変換し、桁数の大きい数は丸めず、`levenshtein` はコードポイント単位で数えます。

### 「決めること」への答え

- **`normalizeLawNum` で年と番号の位置だけを変換するか** → 直後が `年` か `号`、直前が `第`、直前か直後がダッシュ（`-` に揃えた後）の漢数字だけを算用数字にします（SPEC-ABBR-NORMALIZE-LAW-NUM-015）。`千葉県条例第一号` は `千葉県条例第1号`、`平成十五年一般法律第三号` は `平成15年一般法律第3号` になります。egov・nta は `normalizeLawNum` を直接呼んでおらず、`lookupByLawNum` の結果は変わりません
- **桁数に上限を設けるか** → `normalizeLawNum` は上限を設けず、先頭の 0 を文字列の操作で取って丸めません（SPEC-ABBR-NORMALIZE-LAW-NUM-016）。`昭和25年法律第12345678901234567890号` はそのままの桁で返ります。`kanjiToNumber` は `number` を返すので、位ごとの並びが 16 文字以上なら `null` です（SPEC-ABBR-KANJI-TO-NUMBER-009）
- **`levenshtein` をコードポイント単位で数えるか** → 数えます。`levenshtein('𠮷', '吉')` は 1 です（SPEC-ABBR-LEVENSHTEIN-002 の MODIFIED、005）。`findSimilar` / `suggestCorrection` の `distance` と、#20 の距離の比の分母も同じ数え方です

利用側で変わること: `normalizeLawNum` / `kanjiToNumber` / `levenshtein` を直接呼んでいる場合だけ結果が変わります。辞書を引く結果は変わりません。

### 出典

- 仕様 PR [#30](https://github.com/shuji-bonji/houki-abbreviations/pull/30)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-normalize/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-normalize/proposal.md)（「#24」「人が判断すること」6・7）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「正規化の結果が変わる入力」
