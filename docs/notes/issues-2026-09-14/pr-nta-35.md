## 何をしたか

初めて入れた人が数分で 1 件の通達を引けるようにしました。全部入り（`--bulk-download-everything`）は 6 種別で約 100 分かかり、`--help` の先頭に「推奨」として出ていたため、そこで止まる人が多い状態でした。取り込みの中身は変えていません。

- **`--quickstart`**: 通達 1 本（既定: 消費税法基本通達、`--tsutatsu=<正式名>` で変更可）だけを投入します。約 3〜5 分。処理は `--bulk-download` と同じで、違いは実行前に何を入れるかを出し、完了後に次の一手（別の通達を足す / 4 種 / 全部入り）を出すことです
- **`--bulk-download-everything` の開始時に、種別ごとの件数と所要時間の目安を出します**（`formatBulkEstimates`。README の表と同じ値。合計 約 100 分、税目で絞る方法、`--quickstart` への案内）
- **`--help` の並びを「まず試す → 種別を足す → 全部入り → 保守」に変えました**。DB が無くても `nta_get_*` は国税庁サイトから直接取れること（検索だけは DB が要る）も書きました
- **README「初回セットアップ」の先頭に「まず数分で試す」**。2 箇所に残っていた「約 50 分」を「約 100 分」に直しました（表の合計と `--help` は以前から約 100 分でした）。`docs/HOUKI-FAMILY-INTEGRATION.md` も同様
- 0.17.0 → 0.18.0（`package.json` / `package-lock.json` / `.claude-plugin/plugin.json`）

## テスト

`src/cli.test.ts` に 7 件追加しました。

- `parseArgs`: 既定 false、`--quickstart` で true
- `--quickstart` は `bulkDownloadTsutatsu` を 1 回、`formalName: '消費税法基本通達'`、`forceReload: false` で呼ぶ
- `--quickstart --tsutatsu=所得税基本通達` で別の通達 1 本にできる
- 実行前と完了後に、所要時間と次の一手を stderr に出す
- `formatBulkEstimates` に 6 種別と「合計 約 100 分」と `--quickstart` の案内がある
- `--bulk-download-everything` の開始時に目安表が出る
- `--help` に「まず試す」があり、`--quickstart` が `--bulk-download-everything` より先に出る

VM では TypeScript 7 と biome のネイティブ版が動かないため、`node --experimental-strip-types --check` で構文だけ確かめました。`npm test` / `npm run build` / `npm run check` は Mac 側でお願いします。

## 関連

houki-hub#22（発見性 — 1 種類の仕事を 1 回の導入で終わらせる）の (b) 導入の時間。plugin の `dependencies`（houki-research v0.7.0）で導入の手数は 1 回になりましたが、入れた直後に約 100 分の取り込みが始まる状態は変わっていませんでした。

Closes #35

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01GNRnL5TVWf5Chs91BpQS8w
