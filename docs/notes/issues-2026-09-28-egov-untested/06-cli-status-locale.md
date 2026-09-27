`--status` の件数の区切り文字が、実行する環境の言語設定で変わります。同じ DB でも、表示を読むスクリプトや利用者の環境によって `1,234,567` と `1.234.567` が混ざります。

### いまの状態（v0.15.1）

- `laws:` と `articles:` の件数を `toLocaleString()` で表示している（`src/cli/index.ts` の 334・335 行目）
- 既定の言語設定では `1,234,567`、`LANG=de_DE.UTF-8` では `1.234.567` になる

### 決めること

- 区切りを固定するか（`toLocaleString('en-US')`、または区切りなし）

### 完了条件

- 決めた表示が `specs/current/cli_status/spec.md` に書かれ、受入テストがある

出典: cli_status 1 の一部（差分 `20260928-untested-behaviors` で約束にしなかった部分）
