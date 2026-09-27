ローカル DB を作る・作り直す・消す場面の約束が、README と実際で違います。利用者が houki-egov-mcp を古い版に戻すと、約 290 MB の取り込みが消えることがあります。

### いまの状態（v0.15.1）

- **古い版のサーバーで新しい版の DB を開く:** 作り直しは DB の版がサーバーと「違う」ときに起き、DB の版がサーバーより新しいときも全テーブルを消す。取り込みをやり直すことになる
- **MCP サーバーが DB に書き込む:** README は「書き込みは CLI だけが行い、MCP server は読むだけ」と書くが、`search_fulltext` が DB を開くと、DB ファイルやディレクトリが無ければ作り、スキーマを作り、版が違えば作り直す
- **`--status` が DB を作る:** 状態を見るだけのコマンドだが、DB ファイル（とそのフォルダー）が無いときは作ってから件数 0 を表示し、ファイルが残る
- **`sync_state.schema_version` 列:** 既定値は 2 だが、スキーマの版が上がっても連動せず、取り込みもこの列に書かない。スキーマの版は `schema_meta` だけが持つ
- **全データを消す機能:** `laws`・`articles`・`revisions_meta`・`sync_state` の行を消し `schema_meta` を残す機能はテストで確かめているが、CLI にもツールにも入口が無い

### 決めること

- DB の版がサーバーより新しいときは触らずにエラーにするか（作り直すのは古い版の DB だけにするか）
- MCP サーバー（`search_fulltext`）と `--status` からは DB を作らない・作り直さないようにするか、README を直すか。作らない場合、DB が無いときの `--status` の表示
- `sync_state.schema_version` 列を外すか
- 全データを消す機能を利用者に出すか（CLI のフラグなど）、内部の機能として仕様から外すか

### 完了条件

- 決めた規則が db_schema・cli_status・search_fulltext の `specs/current/<dir>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— db_schema 3・4・5・10、cli_status 3（初版起こし）
