::: warning 附則の条は編・章の外に平らに並びます（既知の課題）
`depth` で本則の階層は打ち切れますが、附則（各改正法の経過措置）の条は階層の外に「第1条（施行期日）」の並びとして出ます。民法のように改正の多い法令では、この部分が長くなります。本則の構造だけを見たいときは `toc` 配列の `tag` が `Part` / `Chapter` の要素を読んでください。
:::

::: details 呼び出し例 — 「民法の大区分だけ見たい」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "民法", "depth": 1 }
```

**返る JSON（抜粋）**

```jsonc
{
  "markdown": "# 民法 — 目次\n\n- 第一編　総則\n- 第二編　物権\n- 第三編　債権\n- 第四編　親族\n- 第五編　相続\n- 第1条\n…",
  "toc": [
    { "tag": "Part", "num": "1", "title": "第一編　総則", "children": [] },
    { "tag": "Part", "num": "2", "title": "第二編　物権", "children": [] },
    { "tag": "Part", "num": "3", "title": "第三編　債権", "children": [] },
    { "tag": "Part", "num": "4", "title": "第四編　親族", "children": [] },
    { "tag": "Part", "num": "5", "title": "第五編　相続", "children": [] },
    { "tag": "Article", "num": "1", "title": "第一条", "caption": "", "children": [] }
    // …以下、附則の条が続く
  ],
  "meta": {
    "law_id": "129AC0000000089",
    "title": "民法",
    "law_num": "明治二十九年法律第八十九号",
    "retrieved_at": "2026-09-07T20:13:53.579Z",
    "url": "https://laws.e-gov.go.jp/law/129AC0000000089"
  },
  "node_count": 206,
  "truncated": true
}
```

`truncated: true` は応答を切り詰めたことを示します。特定の条を探すだけなら、`get_toc` より `search_fulltext` に「民法 不法行為」のように法令名と語を渡す方が短く済みます。
:::
