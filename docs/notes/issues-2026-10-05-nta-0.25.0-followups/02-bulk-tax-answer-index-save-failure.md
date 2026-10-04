`--bulk-download-tax-answer` がタックスアンサーの索引を DB に保存できなかったとき、投入がどう終わるかが仕様に決まっていません。

## 何が起きるか（0.25.0）

`--bulk-download-tax-answer`（と `--bulk-download-everything` のタックスアンサーの段）は、国税庁の索引を取った後、記事を取りに行く前に `tax_answer_index`・`tax_answer_index_page` へ保存する（SPEC-NTA-CLI-BULK-DOWNLOAD-013、SPEC-NTA-DB-SCHEMA-025）。

この保存の例外は受け取っていない（`src/services/tax-answer-bulk-downloader.ts`）。表の列が足りないなどで保存が失敗すると、例外のまま上へ伝わる。コードから読むと次のように見込まれるが、確かめていない。

- `--bulk-download-tax-answer`: 記事を 1 件も取らずに、MCP サーバーの入口の `fatal error` のログを出して終了コード 1
- `--bulk-download-everything`: 種別ごとの失敗を受け取って次の種別へ進む作りなので、タックスアンサーだけを飛ばして質疑応答事例へ進む

0.25.0（#137）で、`nta_get_tax_answer` は同じ失敗のときに記事を返したうえで MCP サーバーのログに `warn` を出すようにした（SPEC-NTA-GET-TAX-ANSWER-018）。bulk download の側は、差分 `20261004-db-location` では「変えない」とした（SPEC-NTA-DB-SCHEMA-025、proposal.md の「人が判断すること」17）。0.25.0 では、外から見える動きを変えないよう、SQLite の元の例外を投げ直している。

## 決めること

1. 索引の保存に失敗したときに、記事の取り込みを続けるか止めるか
   - 案 A: 続ける。記事の URL は取った索引で決められるので、取り込みはできる。保存の失敗は標準エラー出力に `[WARN]` の行で出す（`nta_get_tax_answer` の 018 と同じ考え方）
   - 案 B: 止める。終了コード 1 で、原因（表の名前と DB のパス）を `[ERROR]` の行で出す
2. 終了コード（案 A なら 0 か、投入はできたが保存に失敗したことを示す別の値か）
3. `--bulk-download-everything` のときの扱い（ほかの種別へ進むか）
4. 受入テストで確かめる（今は動きをテストしていない）

## 関連

- houki-nta-mcp #137（保存したタックスアンサーの索引を読めないとき。0.25.0）
- 差分 `specs/releases/v0.25.0/20261004-db-location/proposal.md` の「人が判断すること」17
