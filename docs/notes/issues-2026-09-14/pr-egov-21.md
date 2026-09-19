## 何をしたか

`--sync` を足し、全件取り込み済みの DB を日次差分で最新化できるようにしました（Closes #21、Phase 2-8）。

部品（`downloadIncrementalZip` / `ingestZip({ source: 'incremental' })` / `sync_state`）はすでにあったので、「どの日を、どの順で、どこまで進めたか」だけを `src/services/bulk/sync.ts` に置き、CLI は実際の DL / ingest と表示だけを持ちます。

- 開始日は `last_sync_date` **を含めます**。e-Gov の日次 zip はその日の 15 時ごろに生成される（PHASE2-SPIKE §5）ので、午前に同期した日の差分を次回に拾い直すためです。同じ zip を二度入れても `content_hash` で no-op になります
- 差分が無い日は e-Gov が HTTP 500（HTML のエラーページ）を返します（2026-09-19 実測。日曜日・未来の日付・存在しない日付が同じ応答）。障害と区別するため、同期の前に `https://laws.e-gov.go.jp/bulkdownload/` に HEAD で届くことを確かめ、届かなければ何もせず終わります。届くなら 500 を「その日の差分なし」として飛ばします
- 1 日ごとに `sync_state.last_sync_date` を進めます。途中で失敗しても成功した日までは残り、再実行で続きから同期します
- `last_sync_date` から `HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS`（既定 90 日）を超えて空いていたら何もせず、`--bulk-download-everything` を促して exit 1
- `--bulk-download-incremental`（`docs/PHASE2-DESIGN.md` で予定していた名前）も同じ動作
- `freshness.warning` と `--status` の案内を `--sync` に変えました。これまでは存在しない `--bulk-download-incremental` を案内していました

## 合わせて直したこと（ingester）

- 差分 zip で同じ法令の新しい版が現行として届いたとき、前の版を `PreviousEnforced` に落とします。これまでは前の版も `CurrentEnforced` のまま残り、`search_fulltext` の revision 重複対策（`CurrentEnforced` に絞る）をすり抜けて同じ法令が 2 度ヒットする経路がありました（`--bulk-download-by-date` でも同じ）。実測の 7 日分で 13 件がこの経路に当たりました
- `source: 'incremental'` の ingest で `sync_state.total_laws` に差分 CSV の行数を書いていたのを、DB の法令数に変えました
- `ingestZip` に `updateSyncState`（既定 true）を足しました

## 完了条件との対応

| Issue の完了条件 | 確認 |
|---|---|
| 全件取り込み済みの DB に `--sync` で差分だけが入る | VM で `last_sync_date` を 2026-09-13 にした DB に対し 7 日分を確認、5 日に差分あり（234 件 upsert、25 件 unchanged）、2 日は差分なし、1 分 11 秒 |
| 2 回続けて実行したとき、2 回目は取り込む日が無いことを表示して正常終了 | 当日 1 日だけを確認し直し「新たに取り込んだ法令はありません」で exit 0（開始日を含める設計のため「0 日」ではなく「当日の再確認」になります） |
| `--status` の `freshness` が更新される | `last_sync_date: 2026-09-19` / `days_since_sync: 0` / `staleness: fresh` |

## テスト

- `src/services/bulk/sync.test.ts`（18 件）: 日付ヘルパ、計画、差分なしの判定、進行（成功・途中失敗・接続不可・進捗コールバック）、SQLite の store
- `src/services/bulk/ingester.test.ts` に 5 件: `total_laws`、`updateSyncState=false`、前の版の降格、未施行の版は現行に触れない

VM では TS 7 / biome が動かないので、`biome-linux-arm64` 2.5.12 と TypeScript 5.9.3 で `biome check` と `tsc --noEmit` を通し、テストは vitest の代替（`better-sqlite3` を `node:sqlite` に差し替え）で通しました。Mac で `npm test && npm run build && npm run check` をお願いします。README の「287 tests」は `npm test` の件数に合わせて直してください。

## 取り込み後

1. タグ `v0.8.0` で publish
2. `mcp-publisher login github && mcp-publisher publish`（`server.json` は 0.8.0 に更新済み）
3. claude-plugins の `houki-egov-mcp` を 0.8.0 に
4. 手元の DB は 12 日ほど古いので、`houki-egov-mcp --sync` で最新化できます（初回の実測になります）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01GNRnL5TVWf5Chs91BpQS8w
