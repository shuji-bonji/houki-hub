## 何が起きるか

DB のパスは `HOUKI_EGOV_DB_PATH` → `${XDG_CACHE_HOME:-~/.cache}/houki-egov-mcp/laws.db` の順で決まります（`src/db/index.ts`）。決め方は 1 つですが、起動の経路ごとに環境変数が違うと、別のファイルを開きます。今は、それを確かめる手段が `--status` の 1 行（`DB: <パス>`）しかありません。

### 2026-10-04 JST に起きたこと

- `~/.cache/houki-egov-mcp/` に `laws.db`（版 2、7.6 GB）と `laws.v3.db`（版 3、5.0 GB）があった。`laws.v3.db` は `HOUKI_EGOV_DB_PATH` を付けた CLI で作ったもの
- plugin（`env` を持たない）は `laws.db` を開き、0.19.0 では版が古いので、`search_fulltext` が `search_law` に切り替わっていた
- `--status` は、そのとき開いた 1 つのファイルしか表示しない。同じフォルダーに別の版の DB が残っていることには気付けなかった

### まだ起きていないが、起きうること

macOS の Claude Desktop を Dock から起動すると、シェルの `.zshrc` の環境変数を受け継ぎません。`.zshrc` で `XDG_CACHE_HOME` を設定している利用者は、CLI で作った DB（`$XDG_CACHE_HOME/houki-egov-mcp/laws.db`）を plugin が見つけられません（plugin は `~/.cache/houki-egov-mcp/laws.db` を開く）。

## 足したいこと

1. **DB の場所を確かめるコマンド**（名前は決めること 1）。次を標準出力に出して exit 0
   - 解決したパスと、それを決めた設定（`HOUKI_EGOV_DB_PATH` / `XDG_CACHE_HOME` / 既定）
   - そのフォルダーにある `laws*.db` の一覧と、それぞれの大きさ・最終更新・DB の版（`schema_meta.schema_version`）
   - 「MCP クライアント（Claude Desktop など）から起動したサーバーは、シェルの環境変数を受け継がないことがある」という注意（`XDG_CACHE_HOME` か `HOUKI_EGOV_DB_PATH` がシェルに設定されているときだけ）
2. **`--status` の警告**: 開いた DB と同じフォルダーに `laws*.db` が他にもあれば、`[WARN]` の行で知らせる（exit コードは変えない）

どちらも DB を読むだけで、作らず、書き換えません（SPEC-EGOV-DB-SCHEMA-025 と同じ）。

## 決めること

1. コマンドの名前: `--where` / `--db-info` / `--status` に `--verbose` を足す、のどれにするか
2. 一覧に出すファイルの範囲: `laws*.db` だけか、`*.db` すべてか。`-wal` / `-shm` も出すか
3. 退避したファイル（例: `laws.v2.bak.db`）も警告の対象にするか
4. houki-nta-mcp と同じ形にするか（houki-nta-mcp にも同じ Issue を出しました。決めた内容は houki-hub `docs/DECISIONS.md` に書く）

## 関連

- #108（`api-fallback` の `note` に開こうとしたパスを入れる。応答と起動時のログに `db_path` を出す追記あり）
- SPEC-EGOV-CLI-STATUS-005（`--status` の `DB:` の行）、SPEC-EGOV-DB-SCHEMA-025
- houki-hub `docs/notes/2026-10-04-handoff-egov-db-path.md`
