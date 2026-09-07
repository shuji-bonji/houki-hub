::: details 呼び出し例 — 「消費税法の直近の改正と施行日」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "消費税法", "latest": 2 }
```

**返る JSON**

```jsonc
{
  "meta": {
    "law_id": "363AC0000000108",
    "title": "消費税法",
    "law_num": "昭和六十三年法律第百八号",
    "retrieved_at": "2026-09-07T20:14:07.925Z",
    "url": "https://laws.e-gov.go.jp/law/363AC0000000108"
  },
  "total": 65,
  "revisions": [
    {
      "law_revision_id": "363AC0000000108_20300619_507AC0000000074",
      "amendment_promulgate_date": "2025-06-20",
      "amendment_enforcement_date": "2030-06-19",
      "amendment_enforcement_comment": "公布の日から起算して五年を超えない範囲内において政令で定める日",
      "amendment_law_num": "令和七年法律第七十四号",
      "amendment_law_title": "社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律",
      "amendment_law_id": "507AC0000000074",
      "current_revision_status": "UnEnforced"
    },
    {
      "law_revision_id": "363AC0000000108_20280401_508AC0000000012",
      "amendment_promulgate_date": "2026-03-31",
      "amendment_enforcement_date": "2028-04-01",
      "amendment_enforcement_comment": null,
      "amendment_law_num": "令和八年法律第十二号",
      "amendment_law_title": "所得税法等の一部を改正する法律",
      "amendment_law_id": "508AC0000000012",
      "current_revision_status": "UnEnforced"
    }
  ]
}
```

`current_revision_status` が `UnEnforced` のものは公布済みで未施行です。`amendment_enforcement_comment` に「政令で定める日」とあるときは、`amendment_enforcement_date` は上限の見込みで、確定日ではありません。`total` は全改正数で、`latest` を省略すると全件が返ります。
:::
