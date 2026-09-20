::: tip 本則と附則は別に返ります（v0.13.0）
本則は `toc`、附則は改正法ごとに `suppl_provisions` へ分かれます。既定（`suppl: "list"`）では附則は見出しと条数だけで、中の条は返りません。`toc` の構造ノードに付く `path`（例 `Part3/Chapter2`）は、`get_law_range` にそのまま渡して章・節の条文を取れます（v0.14.0）。
:::

::: details 呼び出し例 — 「民法の大区分だけ見たい」
- 実測: v0.14.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "民法", "depth": 1 }
```

**返る JSON（抜粋）**

```jsonc
{
  "markdown": "# 民法 — 目次\n\n## 本則\n\n- 第一編　総則\n- 第二編　物権\n- 第三編　債権\n- 第四編　親族\n- 第五編　相続\n\n## 附則（67 本・条 201 件）\n\n- 附則(1) 大正一五年四月二四日法律第六九号 — 項のみ\n…",
  "toc": [
    { "tag": "Part", "num": "1", "title": "第一編　総則", "path": "Part1", "children": [] },
    { "tag": "Part", "num": "2", "title": "第二編　物権", "path": "Part2", "children": [] },
    { "tag": "Part", "num": "3", "title": "第三編　債権", "path": "Part3", "children": [] },
    { "tag": "Part", "num": "4", "title": "第四編　親族", "path": "Part4", "children": [] },
    { "tag": "Part", "num": "5", "title": "第五編　相続", "path": "Part5", "children": [] }
  ],
  "suppl_provisions": [
    {
      "index": 1,
      "label": "附則",
      "amend_law_num": "大正一五年四月二四日法律第六九号",
      "extract": false,
      "article_count": 0,
      "paragraph_only": true,   // 条を立てず項だけで書かれた附則
      "children": []
    },
    {
      "index": 3,
      "label": "附則",
      "amend_law_num": "昭和二二年四月一六日法律第六一号",
      "extract": true,          // 抄（改正法の附則の一部だけを載せた形）
      "article_count": 1,
      "paragraph_only": false,
      "children": []
    }
    // …計 67 件
  ],
  "suppl": {
    "mode": "list",
    "count": 67,
    "article_count": 201,
    "note": "附則 67 本の見出しと条数だけを返しました（条は合計 201 件）。中の条まで要るときは suppl: \"full\" を指定してください"
  },
  "meta": {
    "law_id": "129AC0000000089",
    "title": "民法",
    "law_num": "明治二十九年法律第八十九号",
    "retrieved_at": "2026-09-20T10:25:04.777Z",
    "url": "https://laws.e-gov.go.jp/law/129AC0000000089"
  },
  "node_count": 5,
  "truncated": true
}
```

`node_count` は本則のノード数、`truncated: true` は `depth` で本則の階層を打ち切ったことを示します（附則の本数は `depth` では変わりません）。`toc[].path` を `get_law_range` に渡すと、その編・章の条文を本文ごと取れます。特定の条を探すだけなら、`get_toc` より `search_fulltext` に「民法 不法行為」のように法令名と語を渡す方が短く済みます。
:::
