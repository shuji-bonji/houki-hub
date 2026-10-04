## メンテナンスの終了と再実行（2026-10-04 JST）

e-Gov 法令 API は 2026-10-04 JST に `GET https://laws.e-gov.go.jp/api/2/laws?limit=1` で HTTP 200 を返しました。`verify-law-ids` を `workflow_dispatch` で再実行し、成功しました。

- 実行: {{RUN_URL}}

コードの修正は要らなかったので閉じます。毎月 1 日の定期実行がメンテナンスと重なることへの備えとして、定期実行を毎月 2 日 03:17 UTC（12:17 JST）にずらします（ブランチ `ci/20261004-verify-law-ids-cron`）。
