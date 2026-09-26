名前や番号を受け取る公開関数の間で、入力の全角・半角、ダッシュ類、大文字・小文字の扱いが揃っていません。同じ入力でも、関数によって見つかったり見つからなかったりします。

### いまの状態

| 関数 | 全角の英数字 | ダッシュ類（`‐` `―` `−` など） | 大文字・小文字 |
|---|---|---|---|
| `resolveAbbreviation(name, { normalize: true })`、`searchByName`・`findSimilar`（既定） | 半角にする | `－`（全角ハイフン）だけ `-` にする | 区別する |
| `resolveAbbreviation(name)`（既定） | 揃えない | 揃えない | 区別する |
| `getAllNames`、`lookupByLawId`、`extractLawNames` | 揃えない（`normalize` の指定も無い） | 揃えない | 区別する |
| `lookupByLawNum`、`normalizeLawNum` | 半角にする | `‐` `‑` `–` `—` `―` `−` も `-` にする | — |
| `normalizeJpText` | 半角にする | `－` だけ | 区別する |
| `normalizeSearchQuery` | 半角にする | `－` だけ | 小文字にする。JSDoc は「ASCII 大文字」だが、`Ⅰ`→`ⅰ`、`Α`→`α`、`À`→`à` も小文字にする |

例:

- `getAllNames('ＰＬ法')` は `[]`、`resolveAbbreviation('ＰＬ法', { normalize: true })` は `製造物責任法`
- `lookupByLawId('３６３AC0000000108')` は `null`、`lookupByLawNum('昭和６３年法律第１０８号')` は `消費税法`
- `normalizeJpText('１８３―２')` は `'183―2'`、`normalizeLawNum` は同じ文字を `-` にする

### 決めること

- 名前を受け取る関数（`getAllNames`・`extractLawNames`）に `normalize` の指定を足すか、既定を揃えるか
- `lookupByLawId` で全角を半角にしてから比べるか
- `normalizeJpText` でもダッシュ類を `-` に揃えるか
- `normalizeSearchQuery` の小文字化を ASCII だけにするか、ドキュメントを直すか

### 完了条件

- 関数ごとの入力の扱いが決まり、`specs/current/` の各関数の「入力」の節と実装が同じことを書いている

出典: `specs/current/` の「未決」— get_all_names 3、lookup_by_law_id 1、normalize_jp_text 3、normalize_search_query 1（初版起こし、PR #10）
