件数の上限を受け取る 3 つの関数で、`limit` に `NaN` や小数を渡したときの結果と、上限の有無が違います。

### いまの状態

| 関数 | 既定 | 1 未満 | 小数 | `NaN` | 上限 |
|---|---|---|---|---|---|
| `searchByName` | 50 | 1 件 | 切り上げ（`2.5` → 3 件） | 打ち切らない（`searchByName('法', { limit: NaN })` は 167 件） | 500。ただし `NaN` のときは効かない |
| `findSimilar` | 5 | 1 件 | 切り捨て（`2.5` → 2 件） | 0 件 | 無い |
| `suggestCorrection` | 5 | 1 件 | 切り捨て（`suggestCorrection('法', 2.5)` → 2 件） | `findSimilar` と同じ | 無い |

既定の件数と「1 未満は 1 件」は今の動きのまま受入テストを足します（各 spec.md の未決）。`searchByName` の小数の切り上げは今の動きのまま仕様にしました（SPEC-ABBR-SEARCH-BY-NAME-018、`spec/20260927-untested-behaviors`）。この Issue では `NaN`・上限と、`findSimilar` / `suggestCorrection` の小数を扱います。

### 決めること

- `NaN`（と `Infinity`）を既定値として扱うか、例外にするか
- 小数を切り上げと切り捨てのどちらに揃えるか
- `findSimilar` / `suggestCorrection` にも上限を設けるか。設けるなら値

### 完了条件

- 3 つの関数で `limit` の `NaN` と小数の結果が同じ規則になり、仕様と受入テストがある

出典: `specs/current/` の「未決」— search_by_name 5、find_similar 8、suggest_correction 5（初版起こし PR #10 の未決を分けたもの）
