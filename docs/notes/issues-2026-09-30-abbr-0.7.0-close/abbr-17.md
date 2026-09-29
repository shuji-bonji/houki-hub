v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。表の各行は、動きを変えずに文書を実際の結果に合わせました（CI の 1 行だけ `ci.yml` を直しました）。

### 「決めること」への答え

- **行ごとに、文書を実際に合わせるか、実装を文書に合わせるか** → 次のとおりです（コミット `07780c0`・`de48820`）
  - `resolveAbbreviation('消　法', { normalize: true })`: 文書を直しました。README と JSDoc の例を `null`（途中の空白は取り除かない。前後の全角スペースは吸収する）にしました。2026-09-29 のコメントでは「動きを直す側」としましたが、仕様 PR #30 で空白の扱いは変えないと決めました
  - `findSimilar('労働基準法施行例')`: 文書を直しました。README・JSDoc の例を `労基則`（`労働基準法施行規則`、distance 2）にしました
  - `suggestCorrection('労働基準法施行例')`: 文書を直しました。`['労働基準法施行規則']` です。`src/search.test.ts` の SPEC-ABBR-SUGGEST-CORRECTION-001 は、この値をそのまま確かめるテストにしました
  - README の `listByDomain('tax')`: 26 件を 35 件に直しました
  - README の「CI で `npm run validate` を呼ぶ」: `ci.yml` の build ジョブで `npm run build` の後に `npm run validate` を呼ぶようにしました
  - CONTRIBUTING.md と `src/types.ts` の「実エントリは `constitution`〜`rule` だけ」: 「法令系と `kihon-tsutatsu`（8 件）・`kobetsu-tsutatsu`（1 件）」に直しました
  - `SOURCE_MCP_HINTS` の `houki-jaish` の説明: 次の項目のとおりです
- **`houki-jaish` がどちらの機関を指すか** → 「労働安全衛生の通達（JAISH: 安全衛生情報センター）」に直しました（README と `src/types.ts` の JSDoc）。あわせて `houki-egov` の説明から「告示」を外しました（#25）

0.7.0 では直していないもの: `docs/v0.4.0-roadmap.md` の `労働基準法施行令`（distance 1）の例と、`src/search.test.ts` の SPEC-ABBR-FIND-SIMILAR-002 の `findSimilar('労働基準法施行例')` のテスト（距離 2 以下であることだけを確かめる）。

### 出典

- 実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`。`07780c0` が README・CONTRIBUTING・JSDoc、`de48820` が `ci.yml`）。仕様 PR は不要（動きを変えない行だけ）
- [CHANGELOG 0.7.0](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「Documentation」「Added」
- houki-hub `docs/DECISIONS.md` 2026-09-29「T5 文書と実装の食い違い」
