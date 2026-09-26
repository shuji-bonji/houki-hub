辞書の一部のエントリは、`aliases` に自分の `formal` や `abbr` と同じ値を持っています。そのため、`extractLawNames` は同じ位置・同じ長さの一致を 2 件返します。

### いまの状態

- `aliases` に `formal` と同じ文字列を持つエントリ: 33 件（例: `消基通` の `aliases` は `["消費税法基本通達"]`、`民` は `formal: "民法"` で `aliases: ["民法"]`）
- `abbr` / `formal` / `aliases` のどれか 2 つが同じ値のエントリ: 66 件（例: `酒税法` は `abbr` と `formal` がどちらも `酒税法`）
- `validateAllEntries` は、これを警告しない

`extractLawNames` の結果:

| 入力 | 結果 |
|---|---|
| `酒税法` | `matchedKey: "酒税法"`、`position: 0` を 2 件 |
| `民法の解釈` | `民法` の一致を 2 件（エントリはどちらも `民`） |
| `消費税法基本通達の取扱い` | `消費税法基本通達` の一致を 2 件 |

長さが同じなので、`preferLonger: true`（既定）でも除かれません。`dedupe: true` を渡せば 1 件になります。`getAllNames` は重複を除くので、結果は変わりません。

### 決めること

- 辞書の書き方として、自分の `abbr` / `formal` と同じ値を `aliases` に入れることを許すか。許さないなら辞書の 33 件を直し、`validateAllEntries` の警告にする
- `extractLawNames` の側で、同じエントリの同じ位置・同じ長さの一致を常に 1 件にするか

### 完了条件

- `extractLawNames('民法の解釈')` が返す件数が仕様に書かれ、受入テストがある

出典: `specs/current/` の「未決」— abbreviation_entries 8、extract_law_names 1、validate_all_entries 4（初版起こし、PR #10）
