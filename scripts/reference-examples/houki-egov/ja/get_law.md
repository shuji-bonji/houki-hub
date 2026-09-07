::: tip 引数名は `law_name` です
過去の文書に `lawNumber` と書かれていたことがありますが、そのような引数はありません。渡すと `INVALID_ARGUMENT` になります。条番号の枝番は「57の2」のように「の」で書きます。
:::

::: details 呼び出し例 — 「消費税法 57 条の 2 第 1 項の本文を JSON で」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "消費税法", "article": "57の2", "paragraph": 1, "format": "json" }
```

**返る JSON**

```jsonc
{
  "format": "json",
  "data": {
    "article_num": "57_2",
    "paragraph_num": 1,
    "node": {
      "tag": "Paragraph",
      "attr": { "Num": "1" },
      "children": [
        { "tag": "ParagraphNum", "attr": {}, "children": [] },
        {
          "tag": "ParagraphSentence",
          "attr": {},
          "children": [
            {
              "tag": "Sentence",
              "attr": { "Num": "1", "WritingMode": "vertical" },
              "children": [
                "国内において課税資産の譲渡等を行い、又は行おうとする事業者であつて、第五十七条の四第一項に規定する適格請求書の交付をしようとする事業者（第九条第一項本文の規定により消費税を納める義務が免除される事業者を除く。）は、税務署長の登録を受けることができる。"
              ]
            }
          ]
        }
      ]
    }
  },
  "meta": {
    "law_id": "363AC0000000108",
    "title": "消費税法",
    "law_num": "昭和六十三年法律第百八号",
    "retrieved_at": "2026-09-07T20:13:51.255Z",
    "url": "https://laws.e-gov.go.jp/law/363AC0000000108"
  }
}
```

`format` を省略すると Markdown の本文が返ります。引用するときは `meta.law_num`・`meta.url`・`meta.retrieved_at` を添えてください。
:::

::: details 呼び出し例 — 存在しない条を指定したとき（`ARTICLE_NOT_FOUND`）
- 実測: v0.5.3（2026-09-08）

**引数**

```jsonc
{ "law_name": "消費税法", "article": "3000" }
```

**返る JSON**（`isError: true` 付き）

```jsonc
{
  "error": "条文が見つかりません: 第3000条 in 消費税法",
  "code": "ARTICLE_NOT_FOUND",
  "hint": "法令名・条番号を確認してください。format: \"toc\" で目次を確認できます",
  "next_actions": [
    {
      "action": "get_toc",
      "reason": "目次を確認して正しい条番号を特定できます",
      "example": { "law_name": "消費税法" }
    }
  ]
}
```

`next_actions[0]` に次に呼ぶべきツールと引数の例が入っています。エラーコードの語彙と、コードごとの対処は [houki-research Skill](/skills/houki-research) が定めています。
:::
