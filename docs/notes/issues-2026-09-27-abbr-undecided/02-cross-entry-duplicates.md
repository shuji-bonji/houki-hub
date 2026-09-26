辞書の約束として一意にしているのは `abbr` だけです。`formal` や `aliases` が別のエントリと重なったときに、名前から 1 件を返す関数がどのエントリを返すかは、関数によって違います。また、`validateAllEntries` はこの重なりも、一覧に無い `category` / `domain` も検出しません。

v0.6.0 の辞書には、エントリをまたぐ名前の重なりは 0 件です（`normalizeJpText` を通した後も 0 件）。そのため、今は結果が食い違いません。エントリを足したときに初めて表に出ます。

### いまの状態

同じ名前が 2 件のエントリにあるときに返るエントリ:

| 関数 | 返るエントリ |
|---|---|
| `resolveAbbreviation(name)` | 辞書で後に並ぶエントリ |
| `resolveAbbreviation(name, { normalize: true })` | 半角にする前の名前で一致すれば後のエントリ、半角にした名前で一致したときは先のエントリ |
| `getAllNames(name)` | 辞書で先に並ぶエントリ |

`validateAllEntries` が検出しないもの:

| 入力 | 結果 |
|---|---|
| `{ abbr: "A1", formal: "F" }` と `{ abbr: "A2", formal: "F" }` | `valid: true`、`warnings: []` |
| 2 件のエントリが同じ別名を持つ、別名がほかのエントリの `formal` と同じ | 同上 |
| `category: "foo"`、`domain: "x"`、`source_mcp_hint: "houki-zzz"` | 同上。辞書のテスト（`src/index.test.ts`）は値を確かめているが、この関数は確かめない |

### 決めること

- 辞書の約束として、エントリをまたぐ名前の重なりを禁じるか。禁じるなら `validateAllEntries` のエラーにし、テストで固定する
- 禁じない場合、重なったときに返すエントリ（先か後か）を、3 つの関数で揃えて仕様に書く
- `validateAllEntries` で、一覧に無い `category` / `domain` / `source_mcp_hint` をエラーにするか

### 完了条件

- 方針が `specs/current/`（abbreviation_entries・resolve_abbreviation・get_all_names・validate_all_entries）に書かれ、受入テストがある

出典: `specs/current/` の「未決」— abbreviation_entries 2、get_all_names 4、resolve_abbreviation 5、validate_all_entries 2・3（初版起こし、PR #10）
