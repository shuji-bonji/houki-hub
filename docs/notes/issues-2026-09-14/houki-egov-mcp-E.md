### いまの状態

Discussion #20 は「DB 更新は全件再取り込みだけ」と書いていますが、実測では部品が揃っています。

- `src/services/bulk/zip-fetcher.ts` に `downloadIncrementalZip`（`file_section=3`）
- `src/config.ts` に `EGOV_BULK.incrementalDownloadUrl(yyyymmdd)`
- `src/cli/index.ts` に `--bulk-download-by-date <YYYYMMDD>`（コメントは「デバッグ用」）
- `ingestZip({ source: 'incremental' })`
- `sync_state` テーブル（`--status` が読んでいる）

欠けているのは、**前回同期日から今日までの未取得日を自動で回す入口**です。

### やること

- `--sync` を追加する。`sync_state` の最終同期日から今日までを日付順に取得して ingest する
- 取得できない日（差分 zip が無い日）を飛ばす
- 途中で失敗したら、成功した日までを `sync_state` に記録して終える
- 何日ぶんをどれだけの時間で取り込んだかを表示する
- 最終同期から一定日数（既定 90 日）以上空いている場合は、全件取り込みを促して終える
- `--help` と README に追記する

### 完了条件

- 全件取り込み済みの DB に対して `--sync` を実行すると、差分だけが入る
- 2 回続けて実行したとき、2 回目は取り込む日が無いことを表示して正常終了する
- `--status` の `freshness` が更新される

出典: houki-hub#20 機能 5 / houki-hub#21 / ROADMAP Phase 2-8
