v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。またがる一致は `preferLonger: true`（既定）で除き、全角の吸収は `options.normalize` で行います。

### 「決めること」への答え

- **ほかの一致にまたがる一致を除くか** → 除きます。より長い一致と 1 文字でも重なる短い一致は返しません。長さが同じ一致どうし（`所得税法人税法` の `所得税法` と `法人税法`）は両方返します（SPEC-ABBR-EXTRACT-LAW-NAMES-005・010 の MODIFIED、015）。`extractLawNames('消費税法法人税法')` は `消費税法`（位置 0）と `法人税法`（位置 4）の 2 件になり、`法法` は返しません（v0.6.1 は 3 件）
- **探す前に `normalizeJpText` を通すか。通すなら `position` と `length` を元の文字列の位置で返すか** → `options.normalize: true`（既定 `false`）のときだけ通し、`position` / `length` は元の `text` の位置と長さで返します。`matchedKey` は辞書の表記のままです（SPEC-ABBR-EXTRACT-LAW-NAMES-016〜018）。`extractLawNames('ＰＬ法', { normalize: true })` は `製造物責任法` の一致を返します。型は `ExtractOptions.normalize` です
- あわせて、同じエントリの同じ位置・同じ長さの一致（`酒税法` の `abbr` と `formal`）は 1 件にしました（#15、SPEC-ABBR-EXTRACT-LAW-NAMES-019）

利用側で変わること: `preferLonger: true` の結果が減ります。MCP サーバーは入口で `normalize: true` を渡します。

### 出典

- 仕様 PR [#30](https://github.com/shuji-bonji/houki-abbreviations/pull/30)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-normalize/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-normalize/proposal.md)（「#19」「人が判断すること」5）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「`extractLawNames` の結果が減る」
