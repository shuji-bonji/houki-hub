v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。`aliases` に自分の `abbr` / `formal` と同じ値を入れることを禁じ、辞書の 33 件を直し、`extractLawNames` の側でも同じ一致を 1 件にしました。

### 「決めること」への答え

- **自分の `abbr` / `formal` と同じ値を `aliases` に入れることを許すか。許さないなら辞書の 33 件を直し、`validateAllEntries` の警告にする** → 許しません（SPEC-ABBR-ABBREVIATION-ENTRIES-018）。警告ではなくエラー `alias_equals_own_name` にしました（SPEC-ABBR-VALIDATE-ALL-ENTRIES-016）。辞書の 33 件（`消基通` `所基通` `法基通` `相基通` `通基通` `徴基通` `措通` `印基通` `最賃法` `社労士法` `会社` `会社規` `商` `商登法` `金商法` `不競法` `消契法` `民` `民訴` `破` `不登` `住民台帳法` `人訴` `憲` `国賠法` `刑` `都計法` `司書法` `行書法` `大防法` `水濁法` `電通事業法` `デジ庁設置法`）の `aliases` から `formal` と同じ値を外しました（`憲` の `aliases` は `["憲法"]`、`消基通` は `aliases` を持たない）。`abbr` と `formal` が同じ値（`酒税法` など）は許します
- **`extractLawNames` の側で、同じエントリの同じ位置・同じ長さの一致を常に 1 件にするか** → 1 件にします（SPEC-ABBR-EXTRACT-LAW-NAMES-019）。`abbr` と `formal` が同じ 33 件は辞書を直しても残るので、関数の側でも要ります。`extractLawNames('民法の解釈')` は `民法` の一致 1 件です

利用側で変わること: 名前で引ける範囲は変わりません。`getAllNames` の結果と `entry.aliases` の中身が変わります。

### 出典

- 仕様 PR [#32](https://github.com/shuji-bonji/houki-abbreviations/pull/32)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`）
- [`specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md)（「#15」「人が判断すること」4）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「辞書 33 件の `aliases` の修正」「`extractLawNames` の結果が減る」
