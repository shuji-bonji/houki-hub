# issue 草案: 文書系の検索が 0 件のとき、DB が空なのか、キーワードに合う文書が無いのかを分けて伝える

対象リポジトリ: houki-nta-mcp（2026-09-11 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
タイトル案: 文書系の検索が 0 件のとき、DB が空か、該当が無いだけかで hint を分ける

---

## 背景

v0.12.0 の試用で、`nta_search_qa` に注記の文言「異なる課税関係が生ずる」を渡したところ、`--refresh` 後の DB で 0 件になりました。これは期待どおりです。ところが応答の `hint` は次のとおりで、質疑応答事例が 1,841 件入っている DB でも同じ文が出ます。

```json
{
  "results": [],
  "keyword": "異なる課税関係が生ずる",
  "hint": "該当なし。`--bulk-download-qa` で DB 投入済みか確認してください"
}
```

利用者や LLM がこの文を読むと、DB が空なのかと考えて bulk download をやり直すおそれがあります。質疑応答事例の bulk download は数十分かかります。

## 現状（v0.12.0、2026-09-11 に確認）

文書系の検索 5 ツールは、0 件のとき DB の中身を見ずに、同じ形の `hint` を返しています（`src/tools/handlers.ts`）。

| ツール | 0 件のときの `hint` |
| --- | --- |
| `nta_search_qa` | 該当なし。`--bulk-download-qa` で DB 投入済みか確認してください |
| `nta_search_tax_answer` | 該当なし。`--bulk-download-tax-answer` で DB 投入済みか確認してください |
| `nta_search_kaisei_tsutatsu` | 該当なし。`--bulk-download-kaisei` で DB 投入済みか確認してください。 別キーワードで再試行も推奨 |
| `nta_search_jimu_unei` | 該当なし。`--bulk-download-jimu-unei` で DB 投入済みか確認してください |
| `nta_search_bunshokaitou` | 該当なし。`--bulk-download-bunshokaitou` で DB 投入済みか確認してください |

一方、`nta_search_tsutatsu` はすでに分けています。

- DB に通達が 1 件も無い（`hasAnyClause(db)` が false）: エラー `TSUTATSU_NOT_FOUND` と、`next_actions` に `NEXT_ACTIONS.bulkDownload()`
- 通達はあるが該当が無い: `message: "\"…\" にマッチする clause はありません"`

また、0 件になる理由はほかにもありますが、いまの `hint` はそれに触れていません。

- `nta_search_qa` に `hasPdf: true` を渡した場合: 質疑応答事例は PDF を持たないので必ず 0 件です（ツールの説明には書いてあります）
- `domain` や `taxonomy` で絞り込んだ結果が 0 件の場合

## 提案

### 1. 0 件のときに、その種別の文書が DB にあるかを数える

`summarizeFreshnessFromDocument(db, docType, taxonomyFilter)` はその種別の件数を数えて、0 件なら `null` を返します。検索が 0 件のときだけ、これを 2 回呼び分けます。

1. `taxonomyFilter` なしで呼び、`null` なら「その種別の文書が DB に無い」
2. 1. で文書があり、`domain` / `taxonomy` を指定していれば、指定ありで呼び、`null` なら「絞り込んだ範囲に文書が無い」

| DB の状態 | 応答 |
| --- | --- |
| その種別の文書が 0 件 | `hint` で bulk download を案内し、`next_actions` にそのコマンドを入れる |
| `domain` / `taxonomy` で絞り込んだ範囲に文書が無い | `hint` で、絞り込みを外すか値を変えるよう案内する |
| `hasPdf: true` で、その種別に PDF 付きの文書が無い | `hint` にその旨を書く（質疑応答事例は常にこれ） |
| 文書はあるが、キーワードに合わない | `hint`: 「該当なし。別のキーワードで試してください」。`freshness` も付けて、DB がいつの時点かを示す |

`next_actions` のコマンドは種別ごとに違います（`--bulk-download-qa` など）。`NEXT_ACTIONS.bulkDownload()` はいま通達用（`--bulk-download --tsutatsu=…`）なので、種別を受け取れるようにするか、別の関数を足します。

### 2. DB が空のときの応答の形を決める

| 案 | 内容 | 影響 |
| --- | --- | --- |
| A | いまと同じ成功の形（`results: []`）のまま、`hint` と `next_actions` だけ変える | 応答の形は変わらないので patch（v0.12.1）で出せる |
| B | `nta_search_tsutatsu` と同じくエラー（`*_NOT_FOUND` など）にする | family のエラー契約にそろうが、いまは成功で返しているものがエラーになる。minor（v0.13.0） |

ユーザーが決めること: A と B のどちらにするか。A で出して、B は family 全体でエラー契約を見直すときに回す案もあります。

## 確認すること

- 5 ツールすべてで、DB が空のとき・該当が無いとき・`hasPdf: true` のときの応答（テストの DB は `tests/` の既存の作り方に合わせる）
- `nta_search_tsutatsu` の挙動は変えないこと
- houki-hub のツールリファレンスに、0 件の応答を載せた呼び出し例があれば取り直す

## 関連

- houki-nta-mcp#22（v0.12.0 の試用で見つけた）
- `nta_search_tsutatsu` の空 DB の扱い（`hasAnyClause()` と `TSUTATSU_NOT_FOUND`）
