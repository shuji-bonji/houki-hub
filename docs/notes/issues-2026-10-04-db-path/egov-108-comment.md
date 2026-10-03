## 追記: 応答と起動時のログにも、開いた DB のパスを出す（2026-10-04 JST）

この Issue の「決めること」1 は、DB が見つからないときの `note` にパスを入れる話です。同じ仕様 PR で、**DB を開けたとき**にもパスを返すことを決めたいので追記します。

### 何が足りないか

2026-10-04 に shuji の環境で、plugin と手元のサーバー（houki-egov-dev）が別の DB を開いていました。plugin は `laws.db`、houki-egov-dev は `HOUKI_EGOV_DB_PATH` が指す `laws.v3.db` です。どちらも `source: "bulk"` を返している間は、どのファイルの結果かが応答から分かりません。CLI の `--status` は `DB: <パス>` を出します（SPEC-EGOV-CLI-STATUS-005）が、MCP サーバーの応答と起動時のログには出ません。

### 足したいこと

1. `search_fulltext` の `freshness` に `db_path`（開いた DB の絶対パス）を足す。`api-fallback` のときは、開こうとしたパスを `note` に入れる（この Issue の 1）
2. MCP サーバーの起動時のログ（`src/index.ts` の `… started`）に、DB のパスと、それを決めた設定を出す（`HOUKI_EGOV_DB_PATH` / `XDG_CACHE_HOME` / 既定）。標準エラー出力なので、MCP の応答の形は変わらない

### 決めること（足す分）

- `freshness.db_path` を足すか。足すなら、`null`（DB を使っていない）を含めて常にキーを置く（T4 の決め方）
- ホームのパスを `~` に置き換えて返すか、絶対パスのまま返すか（応答を他人に貼るときに、利用者名が出る）

### 関連

- 同じ場面を CLI で確かめるコマンドと、別の版の DB が残っていることの警告は、別の Issue にしました（DB の場所と残っている DB を確かめる）
- houki-nta-mcp にも同じ追記を Issue で出しました
