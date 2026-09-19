::: details 呼び出し例 — 「所得税法の施行令と施行規則」
- 実測: v0.10.0（2026-09-19）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "所得税法" }
```

**返る JSON**

```jsonc
{
  "law": {
    "law_id": "340AC0000000033",
    "title": "所得税法",
    "law_num": "昭和四十年法律第三十三号"
  },
  "related": [
    {
      "relation": "enforcement_order",
      "law_id": "340CO0000000096",
      "title": "所得税法施行令",
      "law_num": "昭和四十年政令第九十六号",
      "law_type": "CabinetOrder",
      "abbr": "所令",
      "url": "https://laws.e-gov.go.jp/law/340CO0000000096"
    },
    {
      "relation": "enforcement_rule",
      "law_id": "340M50000040011",
      "title": "所得税法施行規則",
      "law_num": "昭和四十年大蔵省令第十一号",
      "law_type": "MinisterialOrdinance",
      "abbr": "所規",
      "url": "https://laws.e-gov.go.jp/law/340M50000040011"
    }
  ],
  "not_found": [],
  "method": "law_name_rule",
  "note": "法令名の末尾に「施行令」「施行規則」を付けた（または落とした）名前で e-Gov に実在するものだけを返しています。「…の施行に関する省令」など別の名前の下位法令、複数の省令、告示は対象外です。網羅性は保証しません",
  "next_actions": [
    {
      "action": "get_toc",
      "reason": "施行令の目次を見て、委任先の条を探せます",
      "example": {
        "law_name": "所得税法施行令"
      }
    },
    {
      "action": "get_toc",
      "reason": "施行規則の目次を見て、委任先の条を探せます",
      "example": {
        "law_name": "所得税法施行規則"
      }
    }
  ],
  "meta": {
    "retrieved_at": "2026-09-19T12:28:50.927Z"
  }
}
```

`related[]` は、法令名の末尾に「施行令」「施行規則」を付けた候補を e-Gov に問い合わせ、`law_title` が完全一致した 1 件だけです。無かった候補は `not_found[]` に残ります（民法なら `related` が空で `not_found` に 2 件）。`abbr` は略称辞書にあるときだけ付きます。施行令を渡すと `relation: "parent_act"` で親の法律と、兄弟の施行規則が返ります。「…の施行に関する省令」のような別の名前の下位法令は返らないので、`note` を citation に添えてください。
:::
