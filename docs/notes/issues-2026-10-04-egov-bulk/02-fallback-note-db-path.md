ローカル DB が見つからないときの `search_fulltext` の `note` と `next_actions`、CLI のエラーの文は、利用者が原因を見分けられず、案内するコマンドもそのままでは動かないことがあります。

## 何が起きるか（0.19.0）

### 1. 「DB をまだ作っていない」と「別のファイルを開いている」を区別しない

DB のファイルが無いときの `note` は、どちらの場合も `bulk DL 未実行のため、search_law (法令名のタイトル一致) にフォールバックしています。…` で始まる（SPEC-EGOV-SEARCH-FULLTEXT-002・039）。開こうとしたファイルのパスも入らない。

2026-10-04 JST に shuji の環境で起きたこと:

- `~/.cache/houki-egov-mcp/` に `laws.db`（版 2）と `laws.v3.db`（版 3。`HOUKI_EGOV_DB_PATH` を付けた CLI で作った）があった。plugin（0.19.0）は `env` を持たないので `laws.db` を開き、`note` は `bulk DB の版 (2) がこの houki-egov-mcp (3) より古いため` だった。この場合は版の違いが文で分かる
- `laws.v3.db` を `laws.db` に名前を変えた後、`HOUKI_EGOV_DB_PATH` が `laws.v3.db` を指したままの手元のサーバー（houki-egov-dev）は、`note` が `bulk DL 未実行のため` になった。DB は作ってあるので文は事実と違い、どのファイルを探したのかも分からない

houki-nta-mcp は、同じ場面の `hint` に開いた DB のパスを入れている（README の「投入済みかどうかを素早く確認する」）。

### 2. 案内するコマンドがそのままでは動かないことがある

`next_actions[0].example.command` は `houki-egov-mcp --bulk-download-everything`（SPEC-EGOV-SEARCH-FULLTEXT-002）。`note` の文（`src/tools/handlers.ts` の `BUILD_DB_REMEDY` など）と、CLI のエラーの文（`[ERROR] DB がまだありません。先に houki-egov-mcp --bulk-download-everything を実行してください` など）も同じ形。

- グローバルにインストールしていないと `command not found`
- `npx houki-egov-mcp …` は、npm に `houki-egov-mcp` という名前のパッケージが無いので 404
- どこからでも動くのは `npx -y @shuji-bonji/houki-egov-mcp@latest --bulk-download-everything`
- `HOUKI_EGOV_DB_PATH` を付けて起動したサーバーの案内に従って、環境変数を付けずに実行すると、別のファイル（既定の `laws.db`）に作ってしまう

## 決めること

1. `note` に開こうとした DB のパスを入れるか（勧める）。入れるなら、`bulk DL 未実行のため` を「ローカル DB (`<パス>`) が無いため」のような文に変えるか、先頭は今の文のまま後ろにパスを足すか（先頭の文は README の表と `note` の先頭で原因を見分ける案内に使っている）
2. `HOUKI_EGOV_DB_PATH` が設定されていてファイルが無いときに、文を分けるか（例: 「`HOUKI_EGOV_DB_PATH` が指すファイル (`<パス>`) がありません」）
3. `example.command` と各文のコマンドの形
   - 案 A（勧める）: `npx -y @shuji-bonji/houki-egov-mcp@latest --bulk-download-everything` にする。`HOUKI_EGOV_DB_PATH` が設定されているときは `HOUKI_EGOV_DB_PATH=<パス> npx -y …` のように付ける
   - 案 B: `houki-egov-mcp --bulk-download-everything` のまま、README と `--help` の読み替えの説明だけで済ませる（0.19.x の README の書き方）
4. CLI のエラーの文（`--sync`・`--status`・`--bulk-download-by-date`）も同じ形にそろえるか
5. 版。応答の文が変わるので、仕様 PR（SPEC-EGOV-SEARCH-FULLTEXT-002・027・036・039・040 と、CLI のエラーの文の仕様）を通して minor で出すか

## 関係する場所

- `src/tools/handlers.ts`（`BUILD_DB_REMEDY`、`why` の 4 通り、`next_actions` の `example.command`）
- `specs/current/search_fulltext/spec.md`（002・027・036・039・040）
- `specs/current/cli_sync/spec.md`・`cli_status/spec.md`・`cli_bulk_download/spec.md`（エラーの文）
- README の「`search_fulltext` が `api-fallback` になるとき」（文を変えたら表を直す）
