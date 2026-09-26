README・JSDoc・CONTRIBUTING.md・`src/types.ts` の説明の一部が、v0.6.0 の実際の結果と違います。利用者（LLM を含む）は例をそのまま信じて使うため、例の誤りは呼び出しの誤りにつながります。

### いまの状態

| 書いてある場所 | 書いてあること | 実際 |
|---|---|---|
| README「正規化 API」、`resolveAbbreviation` の JSDoc | `resolveAbbreviation('消　法', { normalize: true })` は `消費税法` | `null`。全角空白は半角空白になるだけで取り除かれず、辞書に空白を含む名前は無い |
| README、`findSimilar` の JSDoc、`docs/v0.4.0-roadmap.md` | `findSimilar('労働基準法施行例')` は `労基法施行令`（distance 1） | 辞書に `労働基準法施行令` は無く、`労基則`（`労働基準法施行規則`、distance 2） |
| README、`suggestCorrection` の JSDoc | `suggestCorrection('労働基準法施行例')` は `['労働基準法施行令']` | `['労働基準法施行規則']` |
| README | `listByDomain('tax')` は 26 件 | 35 件（JSDoc の 35 件は合っている） |
| README | CI で `npm run validate` を呼ぶ | `ci.yml` は呼んでいない。`npm run validate` は build の後でないと動かない |
| CONTRIBUTING.md、`src/types.ts` | 実エントリがあるのは `constitution`〜`rule` だけ | `kihon-tsutatsu` 8 件、`kobetsu-tsutatsu` 1 件がある |
| `src/types.ts` の `SOURCE_MCP_HINTS` の説明 | `houki-jaish` は「労災（労働安全衛生総合研究所）」 | JAISH は中央労働災害防止協会の安全衛生情報センター（jaish.gr.jp）で、労働安全衛生総合研究所（JNIOSH）とは別の機関 |

テストの一部も、この誤りを見逃す書き方になっています。

- `findSimilar` のテスト「1 文字 typo (例: 法 → 例) で distance=1 のヒットが返る」は、2 以下であることだけを確かめている
- `suggestCorrection` のテスト「typo に近い formal を文字列配列で返す」は、結果が空配列でも通る

### 決めること

- 行ごとに、文書を実際に合わせるか、実装を文書に合わせるか。実装を変えるものの例: `normalize: true` で名前の途中の空白を取り除く、CI に `npm run validate` を足す
- `houki-jaish` がどちらの機関を指すか

### 完了条件

- 上の表の各行について、文書と実装が同じことを書いている
- 文書だけを直す行は `specs/changes/` は不要（実装 PR 1 本）。実装を変える行は仕様 PR から

出典: `specs/current/` の「未決」— abbreviation_entries 9、find_similar 1、list_by_domain 1、public_constants 3、resolve_abbreviation 1、suggest_correction 1、validate_all_entries 7（初版起こし、PR #10）
