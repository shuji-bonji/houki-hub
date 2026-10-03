保存したタックスアンサーの索引を読むときの SQL の例外をすべて「索引が無い」として扱うため、壊れた索引の表では呼び出しのたびに索引を取り直し、利用者に何も知らせない

`nta_get_tax_answer` が DB に無い記事の URL を決めるとき、`readStoredTaxAnswerIndex`（`src/services/tax-answer-index.ts`）は、保存してある索引を読む SQL の例外をすべて受け取って `null` を返します。呼び出し元の `resolveTaxAnswerUrl`（`src/tools/handlers.ts`）は `null` を「索引をまだ保存していない」と同じに扱います。v0.24.0 の実装 PR #136 のレビューで「止めるほどではない点」として挙がったものです。

### いまの状態（v0.24.0）

| 場面 | `readStoredTaxAnswerIndex` の戻り値 | その後の動き |
|---|---|---|
| 索引をまだ取っていない（`tax_answer_index_page` に行が無い） | `null` | 索引を取り、保存し、URL を決める（SPEC-NTA-GET-TAX-ANSWER-016）。意図どおり |
| `tax_answer_index` か `tax_answer_index_page` が壊れている・列が足りない（`SELECT` が例外） | `null`（例外は捨てる） | 条件を付けずに索引を取り直す。`saveTaxAnswerIndex` も例外になるが、`catch {}`（「best effort」）で捨てる。取った索引で URL は決まるので、記事は返る |

2 行目の場面では、次のことが起きます。

- 同じ DB で `nta_get_tax_answer` を呼ぶたびに、国税庁の索引のページを条件なしで取り直します（`If-None-Match` / `If-Modified-Since` を付けられません）。索引と記事の間の 0.3 秒の待ちも毎回入ります
- 保存に失敗したことは、応答にもログにも出ません。利用者は DB が壊れていることに気付けません

版 12 の DB では `initSchema` が 2 つの表を `CREATE TABLE IF NOT EXISTS` で作るので、表が無いことは通常ありません。2 行目は、表が壊れた・手で変えられた DB の場面です。

### 決めること

- `readStoredTaxAnswerIndex` が `null` を返すのを「索引の行が無い」ときだけにし、それ以外の SQL の例外は `INTERNAL_ERROR` で返すか
- 返すなら `hint` に何を書くか（例: `--bulk-download-tax-answer --refresh` で入れ直す、DB を作り直す）
- `saveTaxAnswerIndex` と `touchTaxAnswerIndexPage` の失敗を、今のまま捨てるか。捨てるなら、少なくともログ（`logger.warn`）に出すか
- 上のどれかを変えるなら、記事は返せるのに `INTERNAL_ERROR` にするのか、記事を返したうえで知らせるのか（応答にどう載せるか）

### 完了条件

- 決めた動きが `specs/current/nta_get_tax_answer/spec.md`（SPEC-NTA-GET-TAX-ANSWER-016 の周り）と、必要なら `specs/current/db_schema/spec.md`（SPEC-NTA-DB-SCHEMA-025）に書かれ、壊れた表の DB を使う受入テストがある

### 出典

- 実装 PR [#136](https://github.com/shuji-bonji/houki-nta-mcp/pull/136) のレビュー（2026-10-04）「止めるほどではない点」2 つ目
- `src/services/tax-answer-index.ts` の `readStoredTaxAnswerIndex`、`src/tools/handlers.ts` の `resolveTaxAnswerUrl`
