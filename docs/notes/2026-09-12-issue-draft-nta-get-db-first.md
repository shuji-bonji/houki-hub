# issue 草案: 取得ツールの DB の使い方が 3 通りに分かれていて、説明と食い違う

対象リポジトリ: houki-nta-mcp（2026-09-12 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
タイトル案: 取得ツールの DB の使い方を揃える（`nta_get_tax_answer` / `nta_get_qa` は DB を引いていない）

---

## 観察

v0.15.0 の試用中に、`nta_get_tax_answer` で 1535 を引いたところ `fetchedAt` が実行時刻になっていました。同じ文書を `nta_search_tax_answer` で引くと DB の取得日時（2026-09-07）が返るので、取得ツールだけ国税庁サイトを取りに行っています。

```jsonc
// nta_get_tax_answer { "no": "1535" }
"fetchedAt": "2026-09-12T14:28:37.740Z"   // 実行時刻

// nta_get_tsutatsu { "name": "消基通", "clause": "5-9-10" }
"fetchedAt": "2026-09-07T20:39:59.426Z",
"source": "db"
```

## 実態

6 つの取得ツールが 3 通りに分かれています。

| ツール | DB を先に引く | 見つからないとき | DB へ書き戻す | 応答の `source` |
| --- | --- | --- | --- | --- |
| `nta_get_tsutatsu` | 引く | 国税庁サイトから取得 | 書き戻す | `"db"` / `"live"` |
| `nta_get_qa` | **引かない** | （常に取得） | 書き戻さない | 無し |
| `nta_get_tax_answer` | **引かない** | （常に取得） | 書き戻さない | 無し |
| `nta_get_kaisei_tsutatsu` | 引く | **`DOC_NOT_FOUND`** | — | 無し |
| `nta_get_jimu_unei` | 引く | **`DOC_NOT_FOUND`** | — | 無し |
| `nta_get_bunshokaitou` | 引く | **`DOC_NOT_FOUND`** | — | 無し |

`getTaxAnswer`（`src/tools/handlers.ts`）は引数を検証したあと、DB を見ずに `fetchNtaPage` を呼びます。`getQa` も同じ形です。

## 説明との食い違い

3 か所が「DB を先に引き、無ければ取得する」と読める書き方になっています。

| 場所 | 記述 |
| --- | --- |
| README「主な機能」 | 取得（DB-first → live fallback） |
| README「主な機能」 | bulk DL 済なら DB から即時応答（~10ms）。未投入なら live fetch（~700ms/件）でフォールバック |
| houki-hub `/reference/mcp/houki-nta` の前書き | `nta_get_*` はローカル DB を先に引き、無ければ国税庁サイトから直接取得します |

実際にこの通りなのは `nta_get_tsutatsu` だけです。文書回答事例・改正通達・事務運営指針は DB に無ければ取得せずエラーを返し、質疑応答事例・タックスアンサーは DB があっても毎回取得します。

利用者から見ると次のように現れます。

- `--bulk-download-tax-answer` に約 15 分かけても、`nta_get_tax_answer` は毎回 700ms かかる
- 国税庁サイトが落ちていると、DB があるのに `nta_get_tax_answer` だけ失敗する
- `nta_get_bunshokaitou` は DB を作っていないと本文が取れない（案内は出るので、エラーの内容自体は妥当）

## 提案

### 1. 説明を実態に合わせる（どの案を採っても必要）

README とサイトに、上の表を載せます。「DB-first」の一言で 6 つをまとめるのをやめ、ツールごとに書きます。

### 2. `nta_get_qa` / `nta_get_tax_answer` を `nta_get_tsutatsu` に揃える

DB を先に引き、無ければ取得して書き戻し、応答に `source` を付けます。

- 本文は `document` テーブルに入っています（`--bulk-download-qa` / `--bulk-download-tax-answer` が投入する）。読み出す経路は `nta_search_*` が既に使っています
- タックスアンサーの `docId` は番号そのもの（`"1535"`）なので、`no` から引けます。質疑応答事例の `docId` は `"hotei/1/07"` の形なので、`nta_get_qa` の引数との対応を確かめる必要があります
- 応答は現状パーサーが組み立てた構造（`sections` など）を返しており、DB の `full_text` は平文です。**DB から同じ構造を復元できるか**が実装上の分かれ目になります。復元できないなら、DB には無い情報として live のままにするか、構造を保存する形に変える判断が要ります

### 3. DB のみの 3 つに live fallback を足すか

`nta_get_kaisei_tsutatsu` / `nta_get_jimu_unei` / `nta_get_bunshokaitou` は、DB に無ければエラーを返します。`nta_get_tsutatsu` に揃えるなら取得しに行くことになりますが、これらは docId から URL を組み立てる必要があり、税目フォルダの世代差（`sozoku` / `sozoku2` 等）を踏みます。

**急いで揃える必要は無いと考えます。** 現状のエラーは `--bulk-download-*` を案内しており、利用者が次に何をすればよいか分かる形になっています。

## 推奨

1 と 2 を 1 版で行い、3 は別に判断する、という順序を推します。2 の可否は「DB から応答の構造を復元できるか」で決まるので、実装前にそこを確かめる必要があります。

## 関連

- Issue #27（正規化の共通化。試用中に本件を見つけた）
