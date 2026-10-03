houki-egov-mcp で 2026-10-04 に見つかった「起動の経路ごとに別の DB を開き、それに気付けない」問題が、houki-nta-mcp にも同じ形であります。houki-egov-mcp 側の Issue（#108 への追記、DB の場所を確かめる Issue、DB のファイル名に版を入れる Issue）と同じ方針で決めるために起票します。

## 今の houki-nta-mcp（0.24.0 / main `527322a`）

- DB のパスは `--db-path`（CLI だけ）→ `HOUKI_NTA_DB_PATH` → `${XDG_CACHE_HOME:-~/.cache}/houki-nta-mcp/cache.db`（`src/db/index.ts` の `defaultDbPath()`）
- plugin は `env` を持たないので、`~/.cache/houki-nta-mcp/cache.db` を開く。macOS の Claude Desktop はシェルの `.zshrc` の環境変数を受け継がないので、`.zshrc` で `XDG_CACHE_HOME` を設定している利用者は、CLI で投入した DB を plugin が見つけられない
- DB に 1 件も無いときの `hint` には、開いた DB のパスが入る（houki-egov-mcp より進んでいる）。成功した応答（`freshness`）と、MCP サーバーの起動時のログにはパスが出ない
- 0.23.x 以前は、版が新しい DB を全テーブルを消して作り直す。0.24.0 の CHANGELOG の冒頭で「0.24.0 に上げた後は、同じ DB を 0.23.x 以前で開かない」と注意している

## 足したいこと（houki-egov-mcp と同じ形）

1. **応答と起動時のログに DB のパスを出す**: 検索の `freshness` に `db_path` を足す。MCP サーバーの起動時のログに、パスとそれを決めた設定を出す
2. **DB の場所を確かめるコマンド**: 解決したパスと、それを決めた設定、同じフォルダーにある `*.db` の一覧（大きさ・最終更新・DB の版）を出す。別の DB が残っていれば知らせる
3. **DB のファイル名に版を入れるか**: 次に DB の版を上げる版（版 13）で、既定のファイル名を `cache.v13.db` のようにするか

## 決めること

1. 上の 1〜3 を houki-egov-mcp と同じ形にするか（決めた内容は houki-hub `docs/DECISIONS.md` に書く）
2. 確かめるコマンドの名前（houki-egov-mcp の Issue と同じ名前にする）
3. `--db-path` を使ったときも、確かめるコマンドで同じように表示するか
4. 3 のファイル名の版を、どの版から始めるか（今すぐは変えない。全利用者が投入し直しになるため）

## 関連

- houki-egov-mcp #108 と、同時に起票した 2 つの Issue
- 0.24.0 の CHANGELOG の冒頭の注意、SPEC-NTA-DB-SCHEMA-021・022
- houki-hub `docs/notes/2026-10-04-handoff-egov-db-path.md`
