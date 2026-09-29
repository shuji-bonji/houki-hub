CLI の使い方の `--refresh` の説明・環境変数の欄・`--refresh-stale` の「N 日以上」が実際の動きと合わない
`houki-nta-mcp --help` が出す使い方の記述が、v0.21.3 の実際の動きと合いません。行ごとに、文書を直すか動きを文書に合わせるかを決めます（houki-nta-mcp #70、houki-egov-mcp #56 と同じ種類。houki-hub `docs/DECISIONS.md` の T5 の規則で振り分ける）。

### いまの状態（v0.21.3）

| 使い方の記述 | 実際 | 出典 |
|---|---|---|
| `--refresh` は「既存 DB を消去して再 DL」 | 消すのは対象の通達の節と条項だけ。文書系 5 種別では行を消さずに取り直した内容で置き換え、索引から消えた文書の行は残る。ほかの通達・ほかの種別の行には触れない。DB 全体を消す入口は無い（#ISSUE-02） | cli_refresh 2 |
| 「環境変数」の欄は `HOUKI_NTA_DB_PATH` と `XDG_CACHE_HOME` の 2 つ | `HOUKI_NTA_BASELINE_DIR`（bulk download の記録と `--health-check` の baseline の置き場所）と `HOUKI_NTA_FILES_DIR`（`nta_inspect_pdf_meta` の `save: true` の保存先）も読むが載っていない | cli_entry 5 |
| `--refresh-stale=<日数>` は「N 日以上古い section」 | `findStaleSections` は `fetched_at < datetime('now', '-N days')` で、実行時点の N 日前より前の節を列挙する（ちょうど N 日前は含まない）。標準エラー出力の `(<日数> 日以上古い section を対象)` も同じ文言。テストは 60 日前と 45 日前しか確かめていない | cli_refresh 6 |

### 決めること

- `--refresh` の説明を「対象の通達の節と条項を消して取り直す。文書系は取り直した内容で置き換える」に直すか、DB を消す動きにするか
- `HOUKI_NTA_BASELINE_DIR`・`HOUKI_NTA_FILES_DIR` を使い方の「環境変数」に載せるか
- `--refresh-stale` の文言を「N 日より古い」に直すか、境界を「以上」（`<=`）に変えるか

### 完了条件

- 動きを変えない行は使い方の文と `specs/current/<dir>/spec.md` の入力の説明が直り、動きを変える行は `specs/current/` に書かれて受入テストがある

出典: `specs/current/` の「未決」— cli_refresh 2・6、cli_entry 5（#75 の初版起こし）
