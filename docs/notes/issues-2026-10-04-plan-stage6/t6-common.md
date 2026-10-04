## 方針を決めました（2026-10-04 JST）: T6 ローカル DB の場所の見え方

houki-egov-mcp #108・#110・#111 と houki-nta-mcp #138 は、houki-egov-mcp と houki-nta-mcp で同じ規則にします。規則は houki-hub の `docs/DECISIONS.md` の 2026-10-04 の行「T6 ローカル DB の場所の見え方」に書きました。

| 項目 | 決めたこと |
| --- | --- |
| 応答のパス | 検索の `freshness` に `db_path` を常に置く（DB を使っていないときは `null`）。MCP の応答ではホームを `~` に置き換える。CLI の出力と起動時のログは絶対パスのまま |
| DB が無いときの文 | `note`（egov）・`hint`（nta）に開こうとしたパスを入れ、先頭の文を事実に合う文に変える。`HOUKI_EGOV_DB_PATH` / `HOUKI_NTA_DB_PATH` が指すファイルが無いときは文を分ける |
| 案内のコマンド | `npx -y @shuji-bonji/<パッケージ>@latest <フラグ>`。環境変数で DB を決めて起動したときは、同じ変数を前に付ける |
| 起動時のログ | DB のパスと、それを決めた設定（環境変数 / `XDG_CACHE_HOME` / 既定）を出す |
| 確かめる手段 | `--status`。egov は既存の `--status` に「決めた設定」の行と、同じフォルダーに別の DB があるときの `[WARN]` を足す。nta には同じ形の `--status` を新しく作る |
| ファイル名の版 | 入れない。0.19.0 / 0.24.0 からは新しい版の DB を書き換えないので、残る事故は 0.18.x / 0.23.x 以前のサーバーだけで、ファイル名を変えても防げない。開発で版を上げるときは `HOUKI_*_DB_PATH` で別のファイルを使う |

版は houki-egov-mcp 0.20.0、houki-nta-mcp 0.25.0 です。仕様 PR を egov → nta の順に書きます（`note`・`hint` の文と `freshness.db_path` の説明を同じ文にするため）。進め方は houki-hub `docs/notes/2026-10-04-plan-stage6-and-followups.md` の段階 3 です。
