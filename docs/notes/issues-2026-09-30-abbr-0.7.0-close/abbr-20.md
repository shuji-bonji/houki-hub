v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。`findSimilar` は距離を名前の長さで補い、`suggestCorrection` は `query` と一致したエントリを候補から外します。

### 「決めること」への答え

- **`query` の最短文字数を設けるか、距離を名前の長さで割るなど長さを補うか** → 長さで補います。距離 ÷ 長い方の文字数が 1/3 を超える名前は返しません（`距離 × 3 ≤ 長い方の文字数`。SPEC-ABBR-FIND-SIMILAR-021）。最短文字数は設けず、距離 0 は文字数によらず返します（022）。`findSimilar('民法')` は `民`（0）・`民訴`・`民執`・`民保`（1）の 4 件、`findSimilar('法')` は `[]` です。1/3 にした根拠は v0.6.1 の辞書（174 件、名前 482 個）での実測で、0.3 にすると `労基側` → `労基法` の 3 文字の打ち間違いが拾えず、0.4 にすると `労働基準法` → `労働契約法` が残ります。比を指定する項目（`maxRatio` など）は足していません。分母はコードポイント数です（#24）
- **`suggestCorrection` で `query` と一致したエントリを候補から外すか** → 外します。距離 0 のエントリを除いてから `limit` 件で打ち切ります（SPEC-ABBR-SUGGEST-CORRECTION-009）。`suggestCorrection('民法')` に `民法` は入りません
- **今のままにする場合、「近い名前を返す関数で、訂正の候補とは限らない」ことを仕様と README に書くか** → 動きを変えましたが、`findSimilar` の「アクター」と README・JSDoc に「編集距離で近い名前を返す関数で、一覧が欲しいときは `searchByName`」を書きました。混同しやすい文字の表（例↔令、規↔則）による訂正は、別の Issue で検討します

利用側で変わること: `findSimilar` / `suggestCorrection` の候補が減ります。

### 出典

- 仕様 PR [#32](https://github.com/shuji-bonji/houki-abbreviations/pull/32)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md)（「#20」「しきい値を決めた根拠（実データ）」「人が判断すること」7・8）
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) の判断の表「houki-abbreviations #20（`findSimilar` / `suggestCorrection`）」（2026-09-30）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「`findSimilar` / `suggestCorrection` の候補が減る」
