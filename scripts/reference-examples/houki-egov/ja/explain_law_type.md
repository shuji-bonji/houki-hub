::: details 呼び出し例 — 「通達は守らなくてよいのか」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要（サーバー内蔵の知識）

**引数**

```jsonc
{ "name": "通達" }
```

**返る JSON**

```jsonc
{
  "name": "通達",
  "found": true,
  "info": {
    "name": "通達",
    "aliases": ["通知", "基本通達", "取扱通達"],
    "enacting_body": "上級行政機関（各省庁・国税庁・最高裁等）",
    "hierarchy_rank": 99,
    "level": "agency-internal",
    "binds_citizens": false,
    "can_set_penalties": false,
    "description": "行政機関内部に対する解釈指針・運用指示。**法令ではなく、国民を直接拘束しない**（裁判所も通達には拘束されない）。ただし行政の運用は通達に従って行われるため、**実務上は通達を踏まえないと申請等で不利益**を受けることがある。…",
    "examples": ["消費税法基本通達（消基通）", "所得税基本通達（所基通）", "法人税基本通達（法基通）", "電子帳簿保存法取扱通達", "36協定関係の厚生労働省通達"],
    "sources": [
      { "label": "国税庁ウェブサイト", "url": "https://www.nta.go.jp/law/tsutatsu/" },
      { "label": "厚生労働省 法令等データベース", "url": "https://www.mhlw.go.jp/hourei_db/" },
      { "label": "安全衛生情報センター（JAISH）", "url": "https://www.jaish.gr.jp/" }
    ],
    "notes": [
      "「AI が通達を引用したから OK」とは言えない — 法的根拠は法律・政令・省令にある",
      "税務署・労基署等は通達に従って判断するため、実務では確認必須",
      "e-Gov には掲載されない — 各省庁サイト経由で取得"
    ]
  },
  "related_tools": ["search_law", "get_law", "get_toc"],
  "see_also": "docs/LAW-HIERARCHY.md"
}
```

`binds_citizens: false` が、通達が国民を拘束しないことを表します。「施行令」「施行規則」「Act」のような別名も `name` に渡せます。
:::
