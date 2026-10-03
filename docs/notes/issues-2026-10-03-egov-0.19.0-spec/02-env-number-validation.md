数値を取る環境変数 `HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS` と `HOUKI_EGOV_BULK_RETRY` の値を検査していません。`0` や `abc` は黙って既定値になり、負の数はそのまま使われます。負の数を渡すと、`--sync` は毎回「上限を超えた」で終わり、全件の取得は 1 回も試さずに失敗します。

## 何が起きるか

`src/config.ts` は次のように読みます。

```ts
bulkRetry: Number.parseInt(process.env.HOUKI_EGOV_BULK_RETRY ?? '', 10) || 3,
incrementalLimitDays:
  Number.parseInt(process.env.HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS ?? '', 10) || 90,
```

| 値 | `Number.parseInt(…, 10)` | 使われる値 |
| --- | --- | --- |
| （無い）・空文字 | `NaN` | 既定値（3 / 90） |
| `abc` | `NaN` | 既定値 |
| `0` | `0` | 既定値（`0` は偽なので `||` の右） |
| `1.5` | `1` | `1` |
| `-5` | `-5` | `-5` |
| `90days` | `90` | `90` |

`-5` のときの動き（コードを読んで分かったこと。実行して確かめてはいません）:

- `HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS=-5`: `--sync` は `last_sync_date` から今日までの日数（0 以上）が上限 `-5` を超えるので、毎回 SPEC-EGOV-CLI-SYNC-010 の「日次差分の公開範囲 (-5 日) を超えているので、--bulk-download-everything を実行してください」で終了コード 1 になる
- `HOUKI_EGOV_BULK_RETRY=-5`: `src/services/bulk/zip-fetcher.ts` の `downloadZip()` の `for (let attempt = 1; attempt <= maxRetries; …)` が 1 回も回らず、`bulk DL に -5 回失敗しました: undefined` を投げる

どちらも、利用者は設定の誤りではなく e-Gov 側か DB の問題だと読みます。

## 決めること

1. 不正な値をどう扱うか
   - 案 A（勧める）: CLI の起動時にエラーにする。1 以上の整数でなければ `ERROR: HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS は 1 以上の整数で指定してください: <値>` のような文を出し、終了コード 2（引数の誤りと同じ。0.19.0 の仕様 PR の「場面ごとの規則」表 1）
   - 案 B: 既定値に戻し、警告を 1 行出す
   - 案 C: 今のまま、負の数と小数だけ既定値にする
2. MCP サーバーを起動するときも同じ検査をするか。`HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS` は 0.19.0 から `search_fulltext` の `freshness.warning` の文にも出る（0.19.0 の仕様 PR の SPEC-EGOV-SEARCH-FULLTEXT-023）。MCP サーバーは起動時に終了すると利用者にエラーが見えにくいので、既定値に戻してログに出す案もある
3. 同じ読み方をしているほかの環境変数（`HOUKI_EGOV_CONCURRENCY` など）も同じ規則にするか

## 関係する場所

- houki-nta-mcp #106（知らないフラグ・不正な日数・未対応の通達名）。nta の「不正な日数」はフラグ `--refresh-stale=<日数>` の値で、0.19.0 の仕様 PR の表 1 の「値の形が違う」（終了コード 2）に当たる。egov の環境変数も同じ規則にそろえるかを、ここで決める
- `specs/current/cli_entry/spec.md` の SPEC-EGOV-CLI-ENTRY-002（使い方に環境変数が並ぶ）、`cli_sync`・`cli_bulk_download` の「入力」の表

## 時期

段階 5 の 0.19.0（DB と CLI）に入れる候補です。0.19.0 で警告の文に設定の日数を出すようにするので、不正な値がそのまま利用者に見えるようになります。

## 出典

houki-egov-mcp `specs/changes/20261003-db-cli/proposal.md`（0.19.0 の仕様 PR、ブランチ `spec/20261003-db-cli`）の「この差分の外で見つけたこと」2
