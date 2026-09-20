::: tip 範囲の指定は 3 通り、同時には 1 つだけ
編・章・節・款・目の番号（`part` / `chapter` / `section` / `subsection` / `division`）、範囲のパス（`path`）、附則の番号（`suppl_index`）のいずれか 1 つを指定します。2 通り以上を渡すと `INVALID_ARGUMENT` になります。
:::

::: details 呼び出し例 — 「民法の契約の章をまとめて読みたい」
- 実測: v0.14.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "民法", "part": 3, "chapter": 2 }
```

**返る JSON（抜粋）**

```jsonc
{
  "markdown": "# 民法 第三編　債権 第二章　契約\n\n## 第521条\n（契約の締結及び内容の自由）\n\n何人も、法令に特別の定めがある場合を除き、契約をするかどうかを自由に決定することができる。\n\n**第2項**\n契約の当事者は、法令の制限内において、契約の内容を自由に決定することができる。\n…",
  "range": {
    "path": "Part3/Chapter2",
    "titles": ["第三編　債権", "第二章　契約"],
    "tag": "Chapter",
    "article_count": 198,      // この章が持つ条の数
    "returned_count": 186,     // 本文を返した条の数
    "skipped_count": 0,
    "truncated": true,
    "body_chars": 29911,
    "max_chars": 30000,
    "first_article": "第521条",
    "last_article": "第684条",
    "next_from_article": "685",
    "note": "範囲の条 198 件のうち 186 件を返しました（第521条〜第684条）。本文 29,911 文字（上限 30,000 文字）。上限で打ち切りました。続きは from_article: \"685\" を付けて同じ範囲を呼び直してください。",
    "next_actions": [
      {
        "action": "get_law_range",
        "reason": "同じ範囲の続きの条から取れます",
        "example": { "law_name": "民法", "path": "Part3/Chapter2", "from_article": "685" }
      }
    ]
  },
  "articles": [
    { "num": "521", "label": "第521条", "caption": "（契約の締結及び内容の自由）" },
    { "num": "522", "label": "第522条", "caption": "（契約の成立と方式）" }
    // …計 186 件
  ],
  "meta": {
    "law_id": "129AC0000000089",
    "title": "民法",
    "law_num": "明治二十九年法律第八十九号",
    "retrieved_at": "2026-09-20T10:25:04.783Z",
    "url": "https://laws.e-gov.go.jp/law/129AC0000000089"
  }
}
```

上限（既定 30,000 文字）に達したので、198 条のうち 186 条で打ち切っています。条の途中では切りません。続きは `{ "law_name": "民法", "path": "Part3/Chapter2", "from_article": "685" }` で取れます（`range.next_actions` にそのまま入っています）。
:::

::: details 呼び出し例 — 「遺留分の章だけ読みたい」（`path` で指定）
- 実測: v0.14.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "民法", "path": "Part5/Chapter9" }
```

`path` は `get_toc` の応答の `toc[].path` をそのまま渡した値です。

**返る JSON（抜粋）**

```jsonc
{
  "range": {
    "path": "Part5/Chapter9",
    "titles": ["第五編　相続", "第九章　遺留分"],
    "tag": "Chapter",
    "article_count": 8,
    "returned_count": 8,
    "skipped_count": 0,
    "truncated": false,
    "body_chars": 2284,
    "max_chars": 30000,
    "first_article": "第1042条",
    "last_article": "第1049条",
    "note": "範囲の条 8 件のうち 8 件を返しました（第1042条〜第1049条）。本文 2,284 文字（上限 30,000 文字）。"
  },
  "articles": [
    { "num": "1042", "label": "第1042条", "caption": "（遺留分の帰属及びその割合）" },
    { "num": "1043", "label": "第1043条", "caption": "（遺留分を算定するための財産の価額）" },
    { "num": "1044", "label": "第1044条" },
    { "num": "1046", "label": "第1046条", "caption": "（遺留分侵害額の請求）" }
    // …計 8 件
  ]
}
```

条見出し（`caption`）が無い条もあります（第1044条）。`truncated: false` なら、その範囲の条はすべて返っています。
:::

::: details 呼び出し例 — 「章だけ指定したら候補が返ってきた」
- 実測: v0.14.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "民法", "chapter": 2 }
```

**返る JSON**

```jsonc
{
  "error": "指定された範囲が 5 か所あります。上位の階層も指定してください",
  "code": "INVALID_ARGUMENT",
  "hint": "該当するパス: Part1/Chapter2, Part2/Chapter2, Part3/Chapter2, Part4/Chapter2, Part5/Chapter2（Chapter@Num は編ごとに振り直されます）",
  "next_actions": [
    { "action": "get_law_range", "reason": "第一編　総則 第二章　人",
      "example": { "law_name": "民法", "path": "Part1/Chapter2" } },
    { "action": "get_law_range", "reason": "第三編　債権 第二章　契約",
      "example": { "law_name": "民法", "path": "Part3/Chapter2" } }
    // …計 5 件
  ]
}
```

章番号は編ごとに振り直されます。民法には第一章が 5 つ、第一節が 19、会社法には第一節が 22 あります。どれか 1 つを推測で選ばず、候補の見出しとパスを返します。`next_actions` の `example` をそのまま次の呼び出しに使えます。
:::

::: details 呼び出し例 — 「附則の 7 本目を読む」
- 実測: v0.14.0（2026-09-20）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "消費税法", "suppl_index": 7 }
```

`suppl_index` は `get_toc` の `suppl_provisions[].index`（`search_fulltext` が「附則(7) 1」と表示する番号）と同じです。

**返る JSON**

```jsonc
{
  "markdown": "# 消費税法 附則(7) 平成二年六月二二日法律第三六号（抄）\n\nこの法律は、平成二年十月一日から施行する。\n…",
  "range": {
    "suppl_index": 7,
    "titles": ["附則(7) 平成二年六月二二日法律第三六号（抄）"],
    "tag": "SupplProvision",
    "article_count": 0,
    "returned_count": 0,
    "skipped_count": 0,
    "truncated": false,
    "body_chars": 21,
    "max_chars": 30000,
    "note": "この範囲は条を持たず項だけで書かれているため、範囲の本文をそのまま返しました（21 文字）"
  },
  "articles": []
}
```

条を立てず項だけで書かれた附則（消費税法に 9 本あります）は `article_count: 0` になり、範囲の本文をそのまま返します。
:::
