版が合わない DB を全テーブルを消して作り直し、全データを消す機能に CLI の入口が無く `HOUKI_NTA_REFRESH=1` の説明だけがある
ローカル DB を作り直す・消す場面の約束が決まっていません。利用者が houki-nta-mcp を古い版に戻すと、投入した中身がすべて消えることがあります。houki-egov-mcp #60 と同じ問題なので、houki-egov-mcp 0.19.0 で決める規則と同じにします。

### いまの状態（v0.21.3）

- **版が合わない DB を開くと全テーブルを消す:** `initSchema` は `schema_meta.schema_version` が 3〜9 のときは 1 段ずつ移行して中身を保つが、版 3 より前（v0.3.0 より前の DB）と `SCHEMA_VERSION`（10）より大きい版のときは `dropAndRecreate` で全テーブルを消して作り直す。後者は、新しい版の houki-nta-mcp で作った DB を古い版で開いたときに起き、MCP クライアントが古い版のサーバーを起動しただけで投入した中身が消える。テストが無い
- **全データを消す機能がテストにだけある:** `clearAllData`（`document`・`clause`・`section`・`chapter`・`tsutatsu_toc`・`tsutatsu` を空にし、索引を作り直す）は `src/db/schema.test.ts` からしか呼ばれず、CLI にもツールにも入口が無い
- **説明にある環境変数を読む実装が無い:** `src/db/index.ts` の説明には `HOUKI_NTA_REFRESH=1` で起動時に DB を消すと書いてあるが、その環境変数を読む実装は無い。`--refresh` は対象の通達の節と条項だけを消す（cli_refresh の未決 2）

### 決めること

- DB の版がサーバーより新しいときは触らずにエラーにするか（作り直すのは古い版の DB だけにするか）。houki-egov-mcp #60 と同じ規則にする
- 版 3 より前の DB を消して作り直すことを仕様に書くか（v0.3.0 より前の DB がまだあるか）
- 全データを消す機能を利用者に出すか（CLI のフラグなど）、`clearAllData` を内部の機能として仕様から外すか。出さないなら `src/db/index.ts` の `HOUKI_NTA_REFRESH=1` の説明を消す

### 完了条件

- 決めた規則が db_schema の `specs/current/db_schema/spec.md` に書かれ、受入テストがある。`src/db/index.ts` の説明が実装と合っている

出典: `specs/current/` の「未決」— db_schema 2・4（#75 の初版起こし）。houki-egov-mcp #60
