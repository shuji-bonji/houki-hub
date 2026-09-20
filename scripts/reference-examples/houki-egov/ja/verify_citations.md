::: tip リストごと渡します
引用が 1 件でも 50 件でも 1 回の呼び出しで確かめます。存在しない引用が混ざっていても、ツール全体はエラーになりません（件ごとに `status` が付きます）。
:::

::: details 呼び出し例 — 「書こうとしている引用 5 件をまとめて確かめる」
- 実測: v0.14.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{
  "citations": [
    { "law_name": "消法", "article": "30", "paragraph": 1, "label": "消費税法第30条第1項（仕入税額控除）" },
    { "law_name": "電子帳簿保存法", "article": "7", "label": "電帳法7条（電子取引の保存）" },
    { "law_name": "民法", "article": "9999", "label": "民法第9999条" },
    { "law_name": "所得税法", "article": "2", "item": 8, "label": "所法2条8号" },
    { "law_name": "所得税法施行規則", "article": "36の4", "label": "所規36条の4" }
  ]
}
```

**返る JSON（抜粋）**

```jsonc
{
  "summary": { "total": 5, "found": 3, "not_found": 1, "ambiguous": 1, "all_found": false },
  "results": [
    {
      "index": 0,
      "input": { "law_name": "消法", "article": "30", "paragraph": 1, "label": "消費税法第30条第1項（仕入税額控除）" },
      "status": "found",
      "law": {
        "law_id": "363AC0000000108",
        "title": "消費税法",
        "law_num": "昭和六十三年法律第百八号",
        "law_type": "Act",
        "url": "https://laws.e-gov.go.jp/law/363AC0000000108"
      },
      "resolved_by": "abbreviation",          // 略称辞書で「消法」→「消費税法」
      "article": { "num": "30", "label": "第30条", "caption": "（仕入れに係る消費税額の控除）" },
      "paragraph": 1
    },
    {
      "index": 1,
      "input": { "law_name": "電子帳簿保存法", "article": "7", "label": "電帳法7条（電子取引の保存）" },
      "status": "found",
      "law": {
        "law_id": "410AC0000000025",
        "title": "電子計算機を使用して作成する国税関係帳簿書類の保存方法等の特例に関する法律",
        "law_num": "平成十年法律第二十五号",
        "law_type": "Act",
        "url": "https://laws.e-gov.go.jp/law/410AC0000000025"
      },
      "resolved_by": "exact_title",
      "article": { "num": "7", "label": "第7条", "caption": "（電子取引の取引情報に係る電磁的記録の保存）" }
    },
    {
      "index": 2,
      "input": { "law_name": "民法", "article": "9999", "label": "民法第9999条" },
      "status": "not_found",
      "law": { "law_id": "129AC0000000089", "title": "民法", "law_num": "明治二十九年法律第八十九号", "law_type": "Act", "url": "https://laws.e-gov.go.jp/law/129AC0000000089" },
      "code": "ARTICLE_NOT_FOUND",
      "reason": "民法に第9999条はありません",
      "next_actions": [
        { "action": "get_toc", "reason": "目次を確認して正しい条番号を特定できます", "example": { "law_name": "民法" } }
      ]
    },
    {
      "index": 3,
      "input": { "law_name": "所得税法", "article": "2", "item": 8, "label": "所法2条8号" },
      "status": "ambiguous",
      "article": { "num": "2", "label": "第2条", "caption": "（定義）" },
      "code": "INVALID_ARGUMENT",
      "reason": "所得税法第2条は項が 2 個あるため、号だけではどの項の号か決まりません",
      "next_actions": [
        { "action": "add_paragraph", "reason": "同じ引用に paragraph（項番号）を足すと判定できます",
          "example": { "law_name": "所得税法", "article": "2", "paragraph": 1 } }
      ]
    },
    {
      "index": 4,
      "input": { "law_name": "所得税法施行規則", "article": "36の4", "label": "所規36条の4" },
      "status": "found",
      "law": { "law_id": "340M50000040011", "title": "所得税法施行規則", "law_num": "昭和四十年大蔵省令第十一号", "law_type": "MinisterialOrdinance", "url": "https://laws.e-gov.go.jp/law/340M50000040011" },
      "resolved_by": "exact_title",
      "article": { "num": "36_4", "label": "第36条の4", "caption": "（青色専従者給与に関する届出書の記載事項等）" }
    }
  ],
  "method": "per_citation_lookup",
  "note": "各件について「その条（指定があれば項・号）が e-Gov の法令にあるか」だけを確かめています。引用した条文が主張を支えるかどうかは判定していません。…"
}
```

`label` は判定に使わず、そのまま `results[].input` に返るので、書きかけの原稿の表記と突き合わせられます。`not_found` の件は citation から外し、`next_actions` の `get_toc` で条番号を引き直します。`ambiguous` の件は、`candidates[]`（法令名が複数当たった場合）か `next_actions`（項を足す場合）を見て指定を直します。

**確かめていないこと**: 引用が主張を支えるかどうかは判定しません。また削除された条（e-Gov が `Num="534:535"` でまとめている条）を個別の条番号で渡すと `not_found` になります。
:::
