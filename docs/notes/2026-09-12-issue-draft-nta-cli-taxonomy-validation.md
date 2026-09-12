# issue 草案: bulk download の税目フラグが、値を検証しないまま受け取る

対象リポジトリ: houki-nta-mcp（2026-09-12 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
タイトル案: `--bunsho-taxonomy` / `--tax-answer-taxonomy` / `--qa-topic` の値を検証する

---

## 背景

v0.13.0 で、文書系の検索が 0 件のときに `--bunsho-taxonomy=<値>` で追加投入できると案内するようにしました（#23）。v0.14.0 では、綴り間違いなど本庁の索引に無い値ではこの案内を出さないようにしています（`bunshoMainTaxonomy()`）。

案内する側は直しましたが、**案内された CLI の側は値を見ていません**。利用者が税目を打ち間違えても、そのまま実行され、何も投入されずに終わります。

## 現状（v0.14.1、`src/cli.ts` の `parseArgs()`）

3 つのフラグは、カンマ区切りを分割して空文字を捨てるだけです。

| フラグ | 受け取り方 | 有効な値の一覧 |
| --- | --- | --- |
| `--bunsho-taxonomy=<csv>` | `csv.split(',').map(trim).filter(Boolean)` | `BUNSHO_MAIN_TAXONOMIES`（`src/constants.ts`。10 個）と、その別表記（`BUNSHO_TAXONOMY_GROUPS`） |
| `--tax-answer-taxonomy=<csv>` | 同じ | `TAX_ANSWER_FOLDER_MAP` の値（8 個） |
| `--qa-topic=<csv>` | 同じ。さらに `as QaTopic[]` でそのまま型を付けている | `QA_TOPICS`（9 個） |

指定した値が有効かどうかを確かめる箇所は、どのフラグにもありません。

### 実行するとどうなるか

- `--bulk-download-bunshokaitou --bunsho-taxonomy=zzz`: メイン索引を取得したあと、`allow` に一致する税目が 0 個になるので（`bunshokaitou-bulk-downloader.ts`）、個別ページを 1 件も取りに行かずに正常終了します。標準出力の結果は 0 件です
- `--bulk-download-tax-answer --tax-answer-taxonomy=zzz`: 同じ形で 0 件になります
- `--bulk-download-qa --qa-topic=zzz`: `https://www.nta.go.jp/law/shitsugi/zzz/01.htm` を取りに行って失敗し、`logger.warn` で「税目別索引失敗: zzz」を出して次へ進みます。指定が 1 つだけなら 0 件で終わります

いずれも終了コードは 0 で、「その税目は存在しない」という表示はありません。利用者からは「時間をかけずに終わったが DB が増えていない」ように見えます。

## 提案

### 1. 既知の値と照合し、不明な値があれば実行前に終了する

有効な値は 3 つとも定数にあるので、索引を取りに行く前に判定できます。

| フラグ | 照合先 |
| --- | --- |
| `--bunsho-taxonomy` | `bunshoMainTaxonomy(値)` が `undefined` なら不明（別表記の `souzoku` などは通る） |
| `--tax-answer-taxonomy` | `Object.values(TAX_ANSWER_FOLDER_MAP)` |
| `--qa-topic` | `QA_TOPICS` |

不明な値があれば、stderr に次のような 1 行を出して終了コード 1 で終わります。

```text
[bulk-download-bunshokaitou] 税目 "zzz" は文書回答事例の索引にありません。使える値: shotoku, gensen, joto-sanrin, sozoku, zoyo, hyoka, hojin, shohi, shozei, sonota
```

`--qa-topic` の `as QaTopic[]` も、この判定の結果で型を付けられるので外せます。

### 2. `--help` に使える値を書く

いまの `--help` は `--bunsho-taxonomy=shotoku,hojin` のような例だけで、一覧はありません。3 つのフラグの行に、使える値を書き足します。

## 決めること

1. 不明な値を **エラーにする**（上の案）か、**警告だけ出して有効な値だけで続ける**か。複数指定（`--qa-topic=shohi,zzz`）のときに、`shohi` の投入まで止めてよいかの判断です
2. `--bunsho-taxonomy` に国税局の別表記（`souzoku` など）を渡せるようにするか。検索ツールは v0.14.0 からどちらでも引けますが、bulk download の索引は本庁の表記なので、`bunshoMainTaxonomy()` で本庁の表記に直してから使うことになります

## 影響

- 既存の正しい指定の動きは変わりません。変わるのは、これまで黙って 0 件で終わっていた指定だけです
- 版は patch（v0.14.2）を想定しています

## テスト

- `parseArgs()` に不明な値を渡したときの判定（3 フラグ × 不明 / 有効 / 別表記）
- 複数指定で 1 つだけ不明なときの挙動（上の「決めること 1」で決めた形）

## 補足（この issue に含めるかは別）

`parseArgs()` は、知らない引数をすべて黙って捨てています（`else` 節がありません）。`--bulk-download-qa2` のような打ち間違いは、MCP サーバーが起動するだけで終わります。同じ「黙って何もしない」問題ですが、影響範囲が広いので分けたほうがよいかもしれません。
