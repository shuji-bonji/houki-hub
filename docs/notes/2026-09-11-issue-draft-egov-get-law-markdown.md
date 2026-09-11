# issue 草案: get_law の Markdown で、枝番号の条の見出しと、号・イロハの区切りが崩れる

対象リポジトリ: houki-egov-mcp（2026-09-11 作成）
提出先: https://github.com/shuji-bonji/houki-egov-mcp/issues
タイトル案: get_law の Markdown で、枝番号の条の見出しが「第70の6条」になり、号の見出し・本文・イロハが区切りなしでつながる

---

## 背景

houki-nta-mcp v0.12.0 で、質疑応答事例の【関係法令通達】から houki-egov-mcp の `get_law` へ案内する `next_actions` を追加しました（houki-nta-mcp#22）。案内どおりに `get_law` を呼ぶと、条・項・号を指定した取得そのものはできますが、`format: "markdown"`（既定）の出力に次の崩れがあります。条文の文字は正しく、崩れているのは見出しと区切りです。

## 現状（v0.5.3、2026-09-11 に plugin 経由で確認）

### 1. 枝番号の条の見出しが「第70の6条」になる

`{ "law_name": "租税特別措置法", "article": "70の6", "paragraph": 9 }` の見出しは次のとおりです。

```text
# 租税特別措置法 第70の6条第9項
```

正しくは「第70条の6第9項」です。`src/formatters/markdown.ts` の `formatArticleMarkdown()` が、`fromEgovArticleNum()` の戻り値（`"70の6"`）を `第${articleNumDisplay}条` に埋め込んでいるためです。同じ組み立て方が `formatTocMarkdown()` の `appendTocLines()`（目次の `- 第${numDisplay}条`）にもあります。

### 2. 号を指定すると、号番号・号の見出し・本文がつながる

`{ "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8 }` の本文は次のとおりです。

```text
八資産の譲渡等事業として対価を得て行われる資産の譲渡及び貸付け並びに役務の提供（…）をいう。
```

`format: "json"` で見ると、この号は次の構造です。

```text
Item Num="8"
├─ ItemTitle: 八
└─ ItemSentence
   ├─ Column Num="1": 資産の譲渡等
   └─ Column Num="2": 事業として対価を得て行われる…をいう。
```

`formatArticleMarkdown()` は号を指定されたとき `extractText(item)` をそのまま本文にしています。`extractText()`（`src/services/law-tree.ts`）は子の文字列を区切りなしで連結するので、`ItemTitle` と 2 つの `Column` がつながります。

### 3. 項や条をまとめて取るときも、Column とイロハがつながる

`formatParagraph()` は号の先頭の漢数字を取り除いて `8 ` のように付け直していますが、号の中身は同じく `extractText(item)` です。そのため Column と、号の下の `Subitem1`（イ・ロ・ハ）がつながります。

`{ "law_name": "消費税法", "article": "30", "paragraph": 2 }` の第 1 号は次のとおりです。

```text
1 当該課税期間中に…その区分が明らかにされている場合イに掲げる金額にロに掲げる金額を加算する方法イ課税資産の譲渡等にのみ要する…の合計額ロ課税資産の譲渡等とその他の資産の譲渡等に共通して要する…計算した金額
```

「…場合」「イに掲げる金額に…方法」「イ 課税資産の…」「ロ 課税資産の…」の 4 つが 1 行になっていて、LLM も人間もどこでイ・ロが始まるかを読み取れません。

## 提案

### 1. 条の表示を 1 か所で組み立てる

`"70_6"`（e-Gov の `Num`）から「第70条の6」を作る関数を `src/utils/article-num.ts` に置き、`formatArticleMarkdown()` の見出しと `appendTocLines()` の両方で使います。`"42_12_4"` は「第42条の12の4」です。

### 2. 号の中身を構造どおりに組み立てる

号（`Item`）と、その下の `Subitem1`〜`Subitem10` を次の規則で文字列にする関数を作り、`formatArticleMarkdown()`（号指定）と `formatParagraph()` の両方で使います。

| 要素 | 出し方 |
| --- | --- |
| `ItemTitle` / `Subitem1Title` など | 行頭に置き、後ろに空白を 1 つ入れる |
| `Column` が複数ある `ItemSentence` など | Column の間に全角空白を入れる（e-Gov の画面表示と同じ） |
| `Subitem1`〜 | 改行し、深さに応じて字下げする |

号指定の出力は、たとえば次のようになります。

```text
八 資産の譲渡等　事業として対価を得て行われる…をいう。
```

`formatParagraph()` の号番号は、いまは算用数字（`8 `）に付け直していますが、`ItemTitle` の漢数字をそのまま使うかどうかも決めます。見出し（`第2条第1項第8号`）は算用数字なので、本文は e-Gov の表示どおり漢数字にしても食い違いにはなりません。

### 3. エラーメッセージの条表示もそろえる（任意）

`src/services/law-service.ts` の「条文が見つかりません: 第${opts.article}条」は、利用者が `"70の6"` を渡すと「第70の6条」になります。1. の関数を通すと「第70条の6」になります。

## 確認すること

- 表（`TableStruct`）や `List` を含む号・項の出力が、今回の変更で悪くならないこと
- `format: "json"` の出力は変えないこと（構造はすでに正しい）
- `search_fulltext` の結果の条表示（`src/services/law-search.ts` の `fromEgovArticleNum()`）は `"30の2"` の形の値で、見出しではないので対象外
- houki-hub のツールリファレンスの `get_law` の呼び出し例に枝番号の条や号指定があれば、取り直す

## 関連

- houki-nta-mcp#22（質疑応答事例から `get_law` へ案内する `next_actions`）
- 見つけた経緯: 2026-09-11、houki-nta-mcp v0.12.0 の plugin 試用で `next_actions` の例をそのまま `get_law` に渡したとき
