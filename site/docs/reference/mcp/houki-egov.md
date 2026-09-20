---
title: "houki-egov-mcp — ツールリファレンス"
description: "houki-egov-mcp v0.15.1 の全 11 ツールの引数・型・既定値（tools/list から自動生成）と実測の呼び出し例"
---

# houki-egov-mcp — ツールリファレンス

<!-- GENERATED FILE — 手で編集しない。引数はサーバーの tools/list、呼び出し例は scripts/reference-examples/ から。 -->

::: info
**v0.15.1** の `tools/list` から自動生成しました（11 ツール・2026-09-21）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

**このページは自動生成のリファレンスです。** 全ツールの引数の名前・型・必須・既定値・説明を、動いているサーバーの `tools/list` から写しています（正典はサーバー自身です）。責務や使いどころの説明は[解説ページ](/mcp/houki-egov)にあります。呼び出し例の応答 JSON は実測で、版を添えています。

`search_fulltext` だけはローカル DB（`houki-egov-mcp --bulk-download-everything` で構築）を引きます。DB が無いときは `search_law` の結果を `source: "api-fallback"` として返します。他のツールは e-Gov 法令 API v2 をその場で呼びます。

## ツール一覧

| ツール | 概要 |
|---|---|
| [`search_law`](#search-law) | 日本の法令をキーワード・略称・分野で検索する。 |
| [`get_law`](#get-law) | 日本の法令から条文を取得する。 |
| [`get_toc`](#get-toc) | 法令の目次（編・章・節・条の構造）のみを取得する。 |
| [`get_law_range`](#get-law-range) | 法令の編・章・節・款・目のいずれか、または附則 1 本を範囲にして、その中の条を本文ごと取得する。 |
| [`search_fulltext`](#search-fulltext) | 法令の条文本文をキーワードで横断全文検索する（ローカル SQLite FTS5）。 |
| [`resolve_abbreviation`](#resolve-abbreviation) | 略称・通称から正式な法令名と law_id を解決する。 |
| [`get_law_revisions`](#get-law-revisions) | 法令の改正履歴を取得する。 |
| [`explain_law_type`](#explain-law-type) | 法令種別（憲法・法律・政令・省令・規則・条例・告示・通達 等）の制定主体・階層上の位置・国民への拘束力・実務上の注意点を解説する。 |
| [`get_related_laws`](#get-related-laws) | 法令名の規則で関連する法令を引く。 |
| [`get_article_references`](#get-article-references) | 条文本文が引用している参照を取り出す。 |
| [`verify_citations`](#verify-citations) | LLM が組み立てた法令の引用リストを、1 回の呼び出しでまとめて実在確認する。 |

## search_law

日本の法令をキーワード・略称・分野で検索する。e-Gov法令API v2 を使用。略称辞書による正式名称への自動補完あり。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。例: "消費税", "労働基準", "育児休業"。略称も可（例: "消法", "労基法"） |
| `law_type` | `"Act"` \| `"CabinetOrder"` \| `"ImperialOrdinance"` \| `"MinisterialOrdinance"` \| `"Rule"` | 任意 |  | 法令種別で絞り込み |
| `domain` | `"tax"` \| `"labor"` \| `"accounting"` \| `"commercial"` \| `"civil"` \| `"administrative"` | 任意 |  | 分野タグで絞り込み（略称辞書ベース） |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 50） |

::: tip 略称はそのまま渡せます
「個情法」「消法」「労基法」のような略称は、houki-abbreviations の辞書で正式名に直してから検索します。応答の `query.resolved` に、何に直したかが入ります。
:::

::: details 呼び出し例 — 「個情法の正式名と法令番号を知りたい」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要（e-Gov 法令 API v2 をその場で呼びます）

**引数**

```jsonc
{ "keyword": "個情法", "limit": 3 }
```

**返る JSON**

```jsonc
{
  "query": { "keyword": "個情法", "resolved": "個人情報の保護に関する法律" },
  "total_count": 3,
  "results": [
    {
      "law_id": "415AC0000000057",
      "title": "個人情報の保護に関する法律",
      "law_num": "平成十五年法律第五十七号",
      "law_type": "Act",
      "promulgation_date": "2003-05-30",
      "url": "https://laws.e-gov.go.jp/law/415AC0000000057"
    },
    {
      "law_id": "415AC0000000058",
      "title": "行政機関の保有する個人情報の保護に関する法律",
      "law_num": "平成十五年法律第五十八号",
      "law_type": "Act",
      "promulgation_date": "2003-05-30",
      "url": "https://laws.e-gov.go.jp/law/415AC0000000058"
    }
    // …3 件目は省略
  ]
}
```

`results[].law_id` をそのまま次の `get_law` / `get_toc` に渡せます。タイトル一致の検索なので、条文本文の中の語を探すときは `search_fulltext` を使ってください。
:::

## get_law

日本の法令から条文を取得する。略称（消法・所法・労基法 等）対応。条/項/号レベル指定可能。章・節をまとめて取るときは get_law_range を使う。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称。例: "消費税法", "消法", "労基法", "民法" |
| `article` | string | 任意 |  | 条番号。例: "30", "30の2", "第30条の2"。漢数字（"第三十条", "三十の二"）と全角数字も可（v0.7.0）。format="toc" の場合は省略可 |
| `paragraph` | number | 任意 |  | 項番号。省略時は条文全体 |
| `item` | number \| string | 任意 |  | 号番号。数値（8）か文字列（"8"・"8の2"・"第8号の2"・"八の二"）。枝番号の号（第8号の2）は文字列で指定する。漢数字と全角数字も可（v0.7.0）。項が複数ある条では paragraph も指定する（項が 1 つの条では省略可）。省略時は項全体 |
| `format` | `"markdown"` \| `"json"` \| `"toc"` | 任意 | `"markdown"` | 出力形式。"markdown"=条文全文（デフォルト）, "toc"=目次のみ（トークン節約）, "json"=構造化 |
| `at` | string | 任意 |  | 時点指定。YYYY-MM-DD 形式。例: "2024-04-01" でその時点の条文を取得（e-Gov v2 対応） |

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

::: details 呼び出し例 — 「消費税法 30 条 2 項を Markdown で」（号と、号の下のイ・ロ）
- 実測: v0.5.4（2026-09-11）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "消法", "article": "30", "paragraph": 2 }
```

**返る JSON（抜粋）**

```jsonc
{
  "format": "markdown",
  "markdown": "# 消費税法 第30条第2項\n（仕入れに係る消費税額の控除）\n\n**第2項**\n前項の場合において、…",
  "meta": {
    "law_id": "363AC0000000108",
    "title": "消費税法",
    "law_num": "昭和六十三年法律第百八号",
    "retrieved_at": "2026-09-11T14:54:59.963Z",
    "url": "https://laws.e-gov.go.jp/law/363AC0000000108"
  }
}
```

**`markdown` の中身（抜粋。「…」は省略した部分）**

```text
# 消費税法 第30条第2項
（仕入れに係る消費税額の控除）

**第2項**
前項の場合において、…次の各号に掲げる場合の区分に応じ当該各号に定める方法により計算した金額とする。
一 当該課税期間中に国内において行つた課税仕入れ…にその区分が明らかにされている場合　イに掲げる金額にロに掲げる金額を加算する方法
- イ 課税資産の譲渡等にのみ要する課税仕入れ、特定課税仕入れ及び課税貨物に係る課税仕入れ等の税額の合計額
- ロ 課税資産の譲渡等とその他の資産の譲渡等に共通して要する課税仕入れ、特定課税仕入れ及び課税貨物に係る課税仕入れ等の税額の合計額に課税売上割合を乗じて計算した金額
二 前号に掲げる場合以外の場合　当該課税期間における課税仕入れ等の税額の合計額に課税売上割合を乗じて計算する方法

---
出典：e-Gov法令検索（デジタル庁）
URL: https://laws.e-gov.go.jp/law/363AC0000000108
取得日時: 2026-09-11T14:54:59.963Z
```

号は「一」「二」のように e-Gov の表示どおりの漢数字で始まり、見出し語と本文の間は全角空白です。号の下のイ・ロ・ハは `- イ …` の箇条書きになります。
:::

::: details 呼び出し例 — 「所得税法 89 条 1 項を Markdown で」（項の直下の表）
- 実測: v0.5.4（2026-09-11）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "所法", "article": "89", "paragraph": 1 }
```

**`markdown` の中身**

```text
# 所得税法 第89条第1項
（税率）

居住者に対して課する所得税の額は、その年分の課税総所得金額又は課税退職所得金額をそれぞれ次の表の上欄に掲げる金額に区分してそれぞれの金額に同表の下欄に掲げる税率を乗じて計算した金額を合計した金額と、その年分の課税山林所得金額の五分の一に相当する金額を同表の上欄に掲げる金額に区分してそれぞれの金額に同表の下欄に掲げる税率を乗じて計算した金額を合計した金額に五を乗じて計算した金額との合計額とする。

|  |  |
| --- | --- |
| 百九十五万円以下の金額 | 百分の五 |
| 百九十五万円を超え三百三十万円以下の金額 | 百分の十 |
| 三百三十万円を超え六百九十五万円以下の金額 | 百分の二十 |
| 六百九十五万円を超え九百万円以下の金額 | 百分の二十三 |
| 九百万円を超え千八百万円以下の金額 | 百分の三十三 |
| 千八百万円を超え四千万円以下の金額 | 百分の四十 |
| 四千万円を超える金額 | 百分の四十五 |

---
出典：e-Gov法令検索（デジタル庁）
URL: https://laws.e-gov.go.jp/law/340AC0000000033
取得日時: 2026-09-11T14:54:56.829Z
```

条文中の表は Markdown の表で返ります。法令の表の多くは見出し行を持たないため、1 行目（見出し行）は空欄です。`meta` は上の例と同じ形です（`law_num` は「昭和四十年法律第三十三号」）。
:::

::: details 呼び出し例 — 枝番号の号（消費税法 2 条 1 項 8 号の 2）
- 実測: v0.6.0（2026-09-12）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "消費税法", "article": "2", "paragraph": 1, "item": "8の2" }
```

**返る JSON（抜粋）**

```jsonc
{
  "format": "markdown",
  "markdown": "# 消費税法 第2条第1項第8号の2\n（定義）\n\n八の二 特定資産の譲渡等　事業者向け電気通信利用役務の提供及び特定役務の提供をいう。\n\n---\n出典：e-Gov法令検索（デジタル庁）\n…",
  "meta": {
    "law_id": "363AC0000000108",
    "title": "消費税法",
    "law_num": "昭和六十三年法律第百八号",
    "url": "https://laws.e-gov.go.jp/law/363AC0000000108"
    // retrieved_at は省略
  }
}
```

枝番号の号は `item` に文字列で渡します（`"8の2"`・`"第8号の2"`。v0.6.0 から）。項が 1 つだけの条（法人税法 2 条など）は `paragraph` を省けます。項が複数ある条で `paragraph` を省くと、`INVALID_ARGUMENT`（「第30条は項が 13 個あるため、item（号番号）を指定するときは paragraph（項番号）も指定してください」）になります。
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

## get_toc

法令の目次（編・章・節・条の構造）のみを取得する。トークン節約用。本則は `toc`、附則は改正法ごとに `suppl_provisions` へ分けて返す（現行の規定と、改正法ごとの施行日・経過措置を混ぜないため）。既定では附則は見出しと条数だけを返し、`suppl: "full"` で附則の中の条まで返す。depth で階層を浅く打ち切れる（民法・会社法のような大規模法令の概観把握向け）。応答の toc[].path（例 "Part3/Chapter2"）は get_law_range にそのまま渡せる。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称 |
| `at` | string | 任意 |  | 時点指定（YYYY-MM-DD） |
| `depth` | number | 任意 |  | 構造階層の打ち切り深さ。1=編まで、2=章まで、3=節まで。省略時は全階層。例: 民法を depth=1 で取得すると「第一編 総則」「第二編 物権」のような大区分のみが返る |
| `suppl` | `"list"` \| `"full"` \| `"none"` | 任意 | `"list"` | 附則をどこまで返すか。"list"（デフォルト）=改正法ごとの見出しと条数だけ、"full"=附則の中の条まで、"none"=附則を返さない。附則は改正法ごとに積み上がり、所得税法は 352 本・条 983 件あるため、既定では見出しだけを返す |
| `with_amend_titles` | boolean | 任意 | `false` | 附則に改正法の題名を付ける（デフォルト: false）。附則の属性には法令番号しか無いため、改正履歴（get_law_revisions と同じ e-Gov の応答）を 1 回引いて法令番号で照合する。e-Gov の改正履歴は近年の改正が中心なので、それより古い改正法の題名は付かない（付いた本数と付かなかった本数は応答の suppl.amend_law_titles に入る） |

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

## get_law_range

法令の編・章・節・款・目のいずれか、または附則 1 本を範囲にして、その中の条を本文ごと取得する。1 条ずつ引く get_law と、目次だけを返す get_toc の間を埋める（民法・会社法・消費税法のように get_law で 1 条ずつ引くと手数がかかり、法令全体では長すぎる場合に使う）。範囲は条の単位で文字数の上限まで返し、入り切らなかったときは truncated と続きの条番号（next_from_article）を返す。返した範囲（パス・見出し・条の数・最初と最後の条）は応答の range に入る。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称。例: "民法", "会社法", "消法" |
| `part` | string \| number | 任意 |  | 編の番号。"3" / 3 / "三" / "第三編" / 枝番号は "2の2"。上位の階層は無いので単独で指定できる |
| `chapter` | string \| number | 任意 |  | 章の番号。章番号は編ごとに振り直されるため（民法には第一章が 5 つある）、編を持つ法令では part も指定する。指定が複数の範囲に当たるときは、候補のパスを付けた INVALID_ARGUMENT を返す |
| `section` | string \| number | 任意 |  | 節の番号。上位の part / chapter も指定すると範囲が一つに決まる |
| `subsection` | string \| number | 任意 |  | 款の番号 |
| `division` | string \| number | 任意 |  | 目の番号 |
| `path` | string | 任意 |  | 範囲のパス。get_toc が返す toc[].path をそのまま渡せる。例: "Part3/Chapter2"（民法第三編第二章）、"Chapter2/Section1/Subsection2"。編・章・節の番号との同時指定はできない |
| `suppl_index` | number | 任意 |  | 附則の番号（1 始まり）。get_toc が返す suppl_provisions[].index と同じ番号で、search_fulltext が「附則(3) 1」と表示する番号でもある。条を持たず項だけで書かれた附則は、範囲の本文をそのまま返す |
| `from_article` | string | 任意 |  | 範囲の中のこの条から返す。前の応答が truncated だったときに next_from_article の値を渡して続きを取る。例: "561", "548の4", "第五百六十一条" |
| `max_chars` | number (2000–120000) | 任意 | `30000` | 返す条本文の文字数の上限（デフォルト: 30000、2000〜120000）。条の途中では切らないため、1 条目だけは上限を超えても返す |
| `at` | string | 任意 |  | 時点指定。YYYY-MM-DD 形式（get_law と同じ） |

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

## search_fulltext

法令の条文本文をキーワードで横断全文検索する（ローカル SQLite FTS5）。`houki-egov-mcp --bulk-download-everything` で構築した bulk DB を引き、略称は正式名称に OR 展開（例: "消法" → "消費税法"）。各ヒットに条番号・snippet・score・DB の鮮度 (freshness) を付けて返す。bulk DB 未構築時は search_law（法令名のタイトル一致）にフォールバックし、その旨を note で返す。2 文字の語（「相殺」「時効」）は本文の索引（trigram）に載らないため既定では本文を引かず、何をして結果を出したかを応答の short_tokens に返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。スペース区切りで AND 検索。法令名・略称を含めると（例: "民法 不法行為", "労基法 時間外"）その法令の条に絞って本文を検索する。「第30条」を含めると該当条番号のヒットを上位に寄せ、法令名 + 条番号だけ（例: "民法 第709条"）ならその条を直接返す（漢数字は未対応）。2 文字の語だけのとき（例: "相殺"）は索引を引けないため、既定では条本文を引かず法令名の照合だけを返す。法令名か 3 文字以上の語を添えると索引で本文を引ける |
| `domain` | `"tax"` \| `"labor"` \| `"accounting"` \| `"commercial"` \| `"civil"` \| `"administrative"` | 任意 |  | 分野タグ。v0.5.0 では受け付けるが絞り込みは行わない（bulk DB の category 列が未投入のため。Phase 2-13 で実効化） |
| `law_type` | `"Act"` \| `"CabinetOrder"` \| `"ImperialOrdinance"` \| `"MinisterialOrdinance"` \| `"Rule"` | 任意 |  | 法令種別で絞り込み |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 30） |
| `scan_body` | boolean | 任意 | `false` | 2 文字の語だけのクエリ（例: "相殺"）で、索引を使わずに全法令の条本文を端から照合する（デフォルト: false）。索引を引けない語の本文を探す最後の手段で、5〜20 秒かかり、並び順も関連度順にならない。法令名を添えられるなら（例: "民法 相殺"）そちらが速く正確。3 文字以上の語を含むクエリでは索引を引くので、この引数は効かない |

::: warning ローカル DB が必要です
`houki-egov-mcp --bulk-download-everything` で DB を作っていないと、応答の `source` が `"api-fallback"` になり、`search_law`（法令名のタイトル一致）の結果が `fallback` に入って返ります。そのときは本文検索は行われていません。`note` と `next_actions` に構築コマンドが入っています。
:::

::: details 呼び出し例 — 「民法で不法行為に関係する条は」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: あり（`freshness.last_sync_date` が 2026-09-07 の DB）

**引数**

```jsonc
{ "keyword": "民法 不法行為", "limit": 3 }
```

**返る JSON**

```jsonc
{
  "keyword": "民法 不法行為",
  "source": "bulk",
  "count": 3,
  "hits": [
    {
      "match_type": "article",
      "law_id": "129AC0000000089",
      "law_revision_id": "129AC0000000089_20260624_508AC0000000045",
      "law_title": "民法",
      "law_num": "明治二十九年法律第八十九号",
      "law_type": "Act",
      "article_num": "724",
      "caption": "（不法行為による損害賠償請求権の消滅時効）",
      "chapter_path": "第三編　債権 第五章　不法行為",
      "snippet": "<b>不法行為</b>による損害賠償の請求権は、次 … ",
      "rank": -15.18,
      "score": 0.703,
      "score_reasons": ["fts rank -15.18 → base 0.603", "article_caption_match"],
      "url": "https://laws.e-gov.go.jp/law/129AC0000000089"
    },
    { "article_num": "724の2", "caption": "（人の生命又は身体を害する不法行為による損害賠償請求権の消滅時効）", "score": 0.687 /* … */ },
    { "article_num": "719", "caption": "（共同不法行為者の責任）", "score": 0.679 /* … */ }
  ],
  "freshness": {
    "last_sync_date": "2026-09-07",
    "last_full_dl_at": "2026-09-07T04:53:21.112Z",
    "staleness": "fresh",
    "days_since_sync": 0
  },
  "filters": {
    "law_type": null,
    "domain": { "requested": null, "applied": false, "note": "domain 絞り込みは v0.5.0 では未実効です (…)" }
  },
  "law_scope": [{ "token": "民法", "law_title": "民法", "law_id": "129AC0000000089" }]
}
```

- `law_scope` は、キーワードの中で法令名として認識した語です。ここに入った法令の条だけを検索しています
- `chapter_path` に編・章が入るので、`get_toc` を呼ばなくても位置が分かります
- 「民法 第709条」のように法令名と条番号だけを渡すと、検索せずにその条を直接返します
- `freshness.staleness` が `fresh` 以外なら、`--bulk-download-everything` の再実行を検討してください
:::

## resolve_abbreviation

略称・通称から正式な法令名と law_id を解決する。略称辞書の内容を確認するための診断ツール。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `abbr` | string | **必須** |  | 略称。例: "消法", "所法", "労基法", "民" |

::: details 呼び出し例 — 「消基通 は何の略で、どのサーバーが担当か」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要（辞書は houki-abbreviations に内蔵）

**引数**

```jsonc
{ "abbr": "消基通" }
```

**返る JSON**

```jsonc
{
  "abbr": "消基通",
  "resolved": {
    "abbr": "消基通",
    "formal": "消費税法基本通達",
    "law_id": null,
    "domain": "tax",
    "category": "kihon-tsutatsu",
    "source_mcp_hint": "houki-nta",
    "aliases": ["消費税法基本通達"],
    "note": "国税庁長官が発する消費税法の解釈通達。実務の主要参照"
  }
}
```

`source_mcp_hint` が `"houki-nta"` なので、この略称の本文は houki-egov-mcp ではなく houki-nta-mcp（`nta_get_tsutatsu`）で取ります。通達は e-Gov に載っていないため `law_id` は `null` です。法律の略称（「消法」「個情法」）なら `law_id` に e-Gov の ID が入り、`source_mcp_hint` は `"houki-egov"` になります。
:::

## get_law_revisions

法令の改正履歴を取得する。e-Gov v2 /law_revisions を使用。各改正の公布日・施行日・改正法令番号・状態（現行/旧法/未施行）等を返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称。例: "消費税法", "消法", "民法" |
| `latest` | number | 任意 |  | 最新N件のみ返却（省略時は全件）。例: 5 |

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

## explain_law_type

法令種別（憲法・法律・政令・省令・規則・条例・告示・通達 等）の制定主体・階層上の位置・国民への拘束力・実務上の注意点を解説する。法務専門家でない利用者が「政令と省令の違い」「通達は守らなくていいのか」等を確認するための知識ツール。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `name` | string | **必須** |  | 法令種別の名前。例: "法律", "政令", "省令", "規則", "条例", "告示", "通達", "訓令", "憲法"。aliases も解決可（例: "施行令" → 政令、"施行規則" → 省令、"Act" → 法律） |

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

## get_related_laws

法令名の規則で関連する法令を引く。法律なら施行令・施行規則、施行令・施行規則なら親の法律と兄弟を、e-Gov に実在するものだけ返す（law_id 付き）。名前の末尾に「施行令」「施行規則」を付けた（落とした）候補だけを試すので、別の名前の下位法令や告示は返らない。網羅性は主張しない。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称。例: "所得税法", "所法", "所得税法施行令" |

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

## get_article_references

条文本文が引用している参照を取り出す。他法令の条（法令名と法令番号から law_id を解決）、同一法令内の条・項・号、「政令で定める」「財務省令で定める」の委任（施行令・施行規則を法令単位で付ける）を返し、各参照に get_law の引数を next_actions で付ける。「前項」「同法」は解決しない。正規表現で取れた範囲だけを返し、網羅性は主張しない。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称。例: "所得税法", "所法" |
| `article` | string | **必須** |  | 条番号。例: "57の2", "第57条の2", "第五十七条の二" |
| `paragraph` | number | 任意 |  | 項番号。指定するとその項の本文だけを対象にする。省略時は条全体 |
| `at` | string | 任意 |  | 時点指定。YYYY-MM-DD 形式（get_law と同じ） |

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

## verify_citations

LLM が組み立てた法令の引用リストを、1 回の呼び出しでまとめて実在確認する。件ごとに found / not_found / ambiguous を返し、リストの中に存在しない引用が混ざっていてもツール全体はエラーにしない。found の件には正式名称・法令番号・条見出し・law_id・URL を付ける。確かめるのは「その条（指定があれば項・号）が e-Gov の法令にあるか」だけで、引用が主張を支えるかどうかは判定しない。略称は略称辞書で正式名称に直してから照合する。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `citations` | object[] | **必須** |  | 確かめたい引用の配列（最大 50 件） |
| `citations[].law_name` | string | 任意 |  | 法令名または略称。例: "所得税法", "所法"。law_id を書くなら省略可 |
| `citations[].law_id` | string | 任意 |  | e-Gov の law_id。例: "340AC0000000033"。law_name より優先する。law_name と両方省略はできない |
| `citations[].article` | string | **必須** |  | 条番号。例: "30", "30の2", "第三十条の二" |
| `citations[].paragraph` | number | 任意 |  | 項番号。省略すると条までを確かめる |
| `citations[].item` | number \| string | 任意 |  | 号番号。数値（8）か文字列（"8"・"8の2"・"八の二"）。項が複数ある条で項を書かずに号だけを指定すると ambiguous になる |
| `citations[].label` | string | 任意 |  | 引用元の表示文字列。判定には使わず、そのまま results に返す |
| `at` | string | 任意 |  | 時点指定。YYYY-MM-DD 形式。全件に同じ時点を適用する |

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
