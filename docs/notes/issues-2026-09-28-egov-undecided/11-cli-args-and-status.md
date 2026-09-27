CLI が引数の打ち間違いを知らせず、`--status` の表示の一部が見出しや設定と合いません。

### いまの状態（v0.15.1）

- **位置引数と余分な引数:** 最初の引数が `-` で始まらない（例: `houki-egov-mcp status`）ときは、エラーを出さずに MCP サーバーとして起動し、入力を待ち続ける。2 番目以降の引数は見ないので、`houki-egov-mcp --status extra` や `houki-egov-mcp --help --version` もエラーにならない
- **`laws:` の件数:** 法令の数ではなく版の数。前の版（`PreviousEnforced`）や未施行の版も 1 件として数え、同じ法令の版が複数あれば重ねて数える
- **警告の「90 日」:** SPEC-EGOV-CLI-STATUS-004 の警告の文は 90 日と書いてあり、`--sync` が使う上限の日数 `HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS` を変えても変わらない

### 決めること

- `-` で始まらない最初の引数と、余分な引数をエラー（終了コード 1 と使い方の表示）にするか
- `laws:` を法令の数にするか、版の数であることを表示に書くか
- 警告に設定した日数を出すか

### 完了条件

- 決めた規則が cli_entry・cli_status の `specs/current/<dir>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— cli_entry 2、cli_status 4・5（初版起こし）
