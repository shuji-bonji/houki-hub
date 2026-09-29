CLI が知らないフラグ・不正な日数・未対応の通達名を知らせずに MCP サーバーを起動するか例外で終わり、`--version` の文が houki-egov-mcp と違う
`houki-nta-mcp` コマンドが引数の誤りを利用者に知らせません。打ち間違えたフラグのまま MCP サーバーが起動してターミナルで待ち続けるか、想定外の例外で終わります。houki-egov-mcp は同じ場面を SPEC-EGOV-CLI-ENTRY-004 で終了コード 2 にしているので（houki-egov-mcp #61 と同じ種類）、揃え方を決めます。

### いまの状態（v0.21.3）

| 引数 | 今の動き | 出典 |
|---|---|---|
| `--bulk-downlod`（打ち間違い） | `parseArgs` のどの分岐にも当たらず読み飛ばす。処理を選ぶフラグが残らないので `runCliIfRequested` が `false` を返し、MCP サーバーが起動して標準入力を待ち続ける | cli_entry 2 |
| `--db-path /path`（`=` の無い形） | `--db-path` も `/path` も読み飛ばし、上と同じ | cli_entry 2 |
| `--db-path=<path>` だけ | `args.dbPath` に入るが、MCP サーバーの DB の場所は `HOUKI_NTA_DB_PATH` / `XDG_CACHE_HOME` だけで決まるので使われない。MCP サーバーが起動する | cli_entry 2 |
| `--refresh-stale=abc`（数でない日数） | `parseInt` が `NaN` になり `args.staleDays` は指定なし（SPEC-NTA-CLI-REFRESH-006）。ほかに処理を選ぶフラグが無ければ MCP サーバーが起動する | cli_refresh 4 |
| `--tsutatsu=国税通則法基本通達`（`TSUTATSU_URL_ROOTS` に無い正式名） | 投入の処理が例外を投げ、`[server] fatal error` のログを出して終了コード 1。使い方も使える値も出ない | cli_bulk_download 3 |
| `--bunsho-taxonomy=xxx`（一覧に無い税目） | 参考: SPEC-NTA-CLI-BULK-DOWNLOAD-010 で `formatInvalidTaxonomyValues` が使える値を並べて終了コード 1 にする（#25 で決めた動き） | — |
| `--version` / `-v` | 版の数字だけ（例: `0.21.3`）を 1 行出して終了コード 0。houki-egov-mcp は `<パッケージ名> v<版>`（SPEC-EGOV-CLI-ENTRY-003・005） | cli_entry 1 |

`--help` / `--version` が終了コード 0 で終わることは今の動きのままでよく、受入テストが無いだけです（cli_entry 1 の後半）。

### 決めること

- `-` で始まるのにどのフラグにも当たらない引数（打ち間違い、`=` の無い形）を、houki-egov-mcp と同じく `ERROR: 未知のフラグ: <フラグ>` と使い方を出して終了コード 2 にするか
- `--refresh-stale=<日数>` の日数が 0 以上の整数でないときも同じくエラーにするか
- `--tsutatsu=<正式名>` が `TSUTATSU_URL_ROOTS` に無いとき、税目フラグ（SPEC-NTA-CLI-BULK-DOWNLOAD-010）と同じく使える値を出して終了コード 1 にするか
- `--db-path=<path>` だけを渡したとき（処理を選ぶフラグが無い）をエラーにするか、MCP サーバーがそのパスを使うようにするか
- `--version` の文を `<パッケージ名> v<版>` に揃えるか、今のまま（版の数字だけ）を仕様にするか

### 完了条件

- 決めた規則が cli_entry・cli_refresh・cli_bulk_download の `specs/current/<dir>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— cli_entry 1・2、cli_refresh 4、cli_bulk_download 3（#75 の初版起こし）
