## 関係する Issue（2026-10-04 に同時に起票）

DB のパスの見え方と DB のファイル名を、houki-egov-mcp と houki-nta-mcp で同じ方針にするための 4 件です。本文の「同時に起票した Issue」は、次の番号を指します。

| Issue | 内容 |
| --- | --- |
| houki-egov-mcp #108 | `api-fallback` の `note` に開こうとしたパスを入れる。追記: `freshness.db_path` と起動時のログにパスを出す |
| houki-egov-mcp #110 | 開いている DB の場所と、同じフォルダーに残っている別の版の DB を確かめるコマンド。`--status` の警告 |
| houki-egov-mcp #111 | 次に DB の版を上げるとき、既定のファイル名に版を入れるか |
| houki-nta-mcp #138 | 上の 3 件の houki-nta-mcp 版（`cache.db`、`--db-path`、`HOUKI_NTA_DB_PATH`） |

決めた内容は houki-hub の `docs/DECISIONS.md` に書きます。
