日次差分の取り込みで、`last_sync_date` の決め方と、差分の無い日の HTTP 500 の扱いが、`--sync` と `--bulk-download-by-date` で揃っていません。取り込んでいない日を「最新」と扱うことがあり、DB の法令が古いまま検索結果に出ます。

### いまの状態（v0.15.1）

- **`--bulk-download-by-date` の `last_sync_date`:** 指定した日ではなく実行した日にする。今日 `--bulk-download-by-date 20260801` を実行すると `last_sync_date` が今日になり、その後の `--sync` は今日からしか確かめないので、8 月 2 日から昨日までの差分を取り込まないまま「最新」と扱う
- **`last_sync_date` の日付:** 取り込みを始めた時刻を UTC の日時で持ち、その先頭 10 文字を `last_sync_date` にする。日本時間の 0 時から 9 時の間に実行すると前日の日付になる。`--sync` は日本時間で日付を数えるので、1 日余分に確かめる
- **差分の無い日（`--bulk-download-by-date`）:** e-Gov は差分の無い日に HTTP 500 を返す。`--bulk-download-by-date` は 500 を失敗として `HOUKI_EGOV_BULK_RETRY` 回取り直し、`[ERROR] HTTP 500 ...` を出して終了コード 1 で終わる
- **差分の無い日（`--sync`）:** 500 を「差分なし」と扱うが、1 日分の取得では失敗として `HOUKI_EGOV_BULK_RETRY`（既定 3）回まで、1 秒・2 秒と間をあけて取り直してから「差分なし」にする。差分の無い日 1 日ごとに 3 秒ほど余計にかかり、90 日分を追うと数分になる

### 決めること

- `--bulk-download-by-date` の `last_sync_date` を、指定した日にするか、動かさないか
- `last_sync_date` を日本時間の日付にするか
- 差分の無い日の 404・500 を、1 回目で「差分なし」とするか。`--bulk-download-by-date` でも「差分なし」と表示して終了コード 0 にするか

### 完了条件

- 決めた規則が cli_bulk_download・cli_sync の `specs/current/<dir>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— cli_bulk_download 2・3・5、cli_sync 3（初版起こし）
