::: details 呼び出し例 — 「所得税法 57 条の 2 第 2 項が引いている法令」
- 実測: v0.10.0（2026-09-19）
- ローカル DB: 不要（`next_actions` の `search_fulltext` を実行するときだけ必要）

**引数**

```jsonc
{ "law_name": "所得税法", "article": "57の2", "paragraph": 2 }
```

**返る JSON**

```jsonc
{
  "meta": {
    "law_id": "340AC0000000033",
    "title": "所得税法",
    "law_num": "昭和四十年法律第三十三号",
    "retrieved_at": "2026-09-19T12:28:54.305Z",
    "url": "https://laws.e-gov.go.jp/law/340AC0000000033",
    "article": "57の2",
    "paragraph": 2
  },
  "references": [
    {
      "kind": "relative",
      "raw": "前項",
      "resolved": false
    },
    {
      "kind": "internal",
      "raw": "第二十八条第一項",
      "article": "28",
      "paragraph": 1
    },
    {
      "kind": "external",
      "raw": "雇用保険法（昭和四十九年法律第百十六号）第十条第五項第一号",
      "law_name": "雇用保険法",
      "law_num": "昭和四十九年法律第百十六号",
      "law_id": "349AC0000000116",
      "article": "10",
      "paragraph": 5,
      "item": "1",
      "resolved": true
    },
    {
      "kind": "external",
      "raw": "母子及び父子並びに寡婦福祉法（昭和三十九年法律第百二十九号）第三十一条第一号",
      "law_name": "母子及び父子並びに寡婦福祉法",
      "law_num": "昭和三十九年法律第百二十九号",
      "law_id": "339AC0000000129",
      "article": "31",
      "item": "1",
      "resolved": true
    },
    {
      "kind": "relative",
      "raw": "同法第三十一条の十",
      "resolved": false
    },
    {
      "kind": "relative",
      "raw": "同号",
      "resolved": false
    },
    {
      "kind": "external",
      "raw": "職業能力開発促進法第三十条の三",
      "law_name": "職業能力開発促進法",
      "article": "30の3",
      "resolved": true,
      "law_num": "昭和四十四年法律第六十四号",
      "law_id": "344AC0000000064"
    },
    {
      "kind": "relative",
      "raw": "次号",
      "resolved": false
    },
    {
      "kind": "external",
      "raw": "雇用保険法第六十条の二第一項",
      "law_name": "雇用保険法",
      "law_num": "昭和四十九年法律第百十六号",
      "law_id": "349AC0000000116",
      "article": "60の2",
      "paragraph": 1,
      "resolved": true
    },
    {
      "kind": "relative",
      "raw": "同号",
      "resolved": false
    }
  ],
  "delegations": [
    {
      "kind": "delegation",
      "raw": "財務省令で定める",
      "count": 7,
      "target": "enforcement_rule",
      "target_law": {
        "relation": "enforcement_rule",
        "law_id": "340M50000040011",
        "title": "所得税法施行規則",
        "url": "https://laws.e-gov.go.jp/law/340M50000040011"
      }
    },
    {
      "kind": "delegation",
      "raw": "政令で定める",
      "count": 7,
      "target": "enforcement_order",
      "target_law": {
        "relation": "enforcement_order",
        "law_id": "340CO0000000096",
        "title": "所得税法施行令",
        "url": "https://laws.e-gov.go.jp/law/340CO0000000096"
      }
    }
  ],
  "coverage": {
    "method": "regex",
    "note": "本文の文字列から正規表現で取れた参照だけを返しています。取れなかった参照があっても検出できません。「前項」「同法」「同条」などは解決していません（resolved: false）。法令名の候補が e-Gov に無かった参照も resolved: false のままです。委任先の条は特定していません（target_law は法令単位）。網羅性は保証しません"
  },
  "next_actions": [
    {
      "action": "get_law",
      "reason": "同一法令内の参照先を読めます",
      "example": {
        "law_name": "所得税法",
        "article": "28",
        "paragraph": 1
      }
    },
    {
      "action": "get_law",
      "reason": "引用先の条を読めます",
      "example": {
        "law_name": "雇用保険法",
        "article": "10",
        "paragraph": 5,
        "item": "1"
      }
    },
    {
      "action": "get_law",
      "reason": "引用先の条を読めます",
      "example": {
        "law_name": "母子及び父子並びに寡婦福祉法",
        "article": "31",
        "item": "1"
      }
    },
    {
      "action": "get_law",
      "reason": "引用先の条を読めます",
      "example": {
        "law_name": "職業能力開発促進法",
        "article": "30の3"
      }
    },
    {
      "action": "get_law",
      "reason": "引用先の条を読めます",
      "example": {
        "law_name": "雇用保険法",
        "article": "60の2",
        "paragraph": 1
      }
    },
    {
      "action": "search_fulltext",
      "reason": "所得税法施行規則の中で第57条の2を受けている条を探せます（ローカル DB がある場合。無ければ get_toc で目次から探してください）",
      "example": {
        "keyword": "所得税法施行規則 法第五十七条の二"
      }
    },
    {
      "action": "search_fulltext",
      "reason": "所得税法施行令の中で第57条の2を受けている条を探せます（ローカル DB がある場合。無ければ get_toc で目次から探してください）",
      "example": {
        "keyword": "所得税法施行令 法第五十七条の二"
      }
    }
  ]
}
```

`kind` は 3 つです。`external` は他法令への参照で、`law_name`（法令番号）の形なら法令番号で、法令番号が無ければ候補名の完全一致で `law_id` を解決します（職業能力開発促進法がその例）。解決できなければ `resolved: false` のまま `law_name` に候補が入ります。`internal` は同一法令内の参照で、条も項も無い「第N号」にはその文が属する項の番号が付きます。`relative`（「前項」「同法第三十一条の十」「同号」）は解決しません。`delegations[]` の `target_law` は法令単位で、どの条が受けているかは `next_actions` の `search_fulltext`（ローカル DB）か `get_toc` で探します。`next_actions[].example` はそのまま `get_law` の引数になります。
:::
