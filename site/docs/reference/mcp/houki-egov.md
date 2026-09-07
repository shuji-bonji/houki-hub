---
title: "houki-egov-mcp — ツールリファレンス"
description: "houki-egov-mcp v0.5.3 の全 7 ツールの引数・型・既定値（tools/list から自動生成）と実測の呼び出し例"
---

# houki-egov-mcp — ツールリファレンス

<!-- GENERATED FILE — 手で編集しない。引数はサーバーの tools/list、呼び出し例は scripts/reference-examples/ から。 -->

::: info
**v0.5.3** の `tools/list` から自動生成しました（7 ツール・2026-09-08）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

**このページは自動生成のリファレンスです。** 全ツールの引数の名前・型・必須・既定値・説明を、動いているサーバーの `tools/list` から写しています（正典はサーバー自身です）。責務や使いどころの説明は[解説ページ](/mcp/houki-egov)にあります。呼び出し例の応答 JSON は実測で、版を添えています。

`search_fulltext` だけはローカル DB（`houki-egov-mcp --bulk-download-everything` で構築）を引きます。DB が無いときは `search_law` の結果を `source: "api-fallback"` として返します。他のツールは e-Gov 法令 API v2 をその場で呼びます。

## ツール一覧

| ツール | 概要 |
|---|---|
| [`search_law`](#search-law) | 日本の法令をキーワード・略称・分野で検索する。 |
| [`get_law`](#get-law) | 日本の法令から条文を取得する。 |
| [`get_toc`](#get-toc) | 法令の目次（編・章・節・条の構造）のみを取得する。 |
| [`search_fulltext`](#search-fulltext) | 法令の条文本文をキーワードで横断全文検索する（ローカル SQLite FTS5）。 |
| [`resolve_abbreviation`](#resolve-abbreviation) | 略称・通称から正式な法令名と law_id を解決する。 |
| [`get_law_revisions`](#get-law-revisions) | 法令の改正履歴を取得する。 |
| [`explain_law_type`](#explain-law-type) | 法令種別（憲法・法律・政令・省令・規則・条例・告示・通達 等）の制定主体・階層上の位置・国民への拘束力・実務上の注意点を解説する。 |

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

日本の法令から条文を取得する。略称（消法・所法・労基法 等）対応。条/項/号レベル指定可能。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称。例: "消費税法", "消法", "労基法", "民法" |
| `article` | string | 任意 |  | 条番号。例: "30", "30の2"。format="toc" の場合は省略可 |
| `paragraph` | number | 任意 |  | 項番号。省略時は条文全体 |
| `item` | number | 任意 |  | 号番号。省略時は項全体 |
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

法令の目次（編・章・節・条の構造）のみを取得する。トークン節約用。depth で階層を浅く打ち切れる（民法・会社法のような大規模法令の概観把握向け）。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `law_name` | string | **必須** |  | 法令名または略称 |
| `at` | string | 任意 |  | 時点指定（YYYY-MM-DD） |
| `depth` | number | 任意 |  | 構造階層の打ち切り深さ。1=編まで、2=章まで、3=節まで。省略時は全階層。例: 民法を depth=1 で取得すると「第一編 総則」「第二編 物権」のような大区分のみが返る |

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

## search_fulltext

法令の条文本文をキーワードで横断全文検索する（ローカル SQLite FTS5）。`houki-egov-mcp --bulk-download-everything` で構築した bulk DB を引き、略称は正式名称に OR 展開（例: "消法" → "消費税法"）。各ヒットに条番号・snippet・score・DB の鮮度 (freshness) を付けて返す。bulk DB 未構築時は search_law（法令名のタイトル一致）にフォールバックし、その旨を note で返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。スペース区切りで AND 検索。法令名・略称を含めると（例: "民法 不法行為", "労基法 時間外"）その法令の条に絞って本文を検索する。「第30条」を含めると該当条番号のヒットを上位に寄せる（漢数字は未対応） |
| `domain` | `"tax"` \| `"labor"` \| `"accounting"` \| `"commercial"` \| `"civil"` \| `"administrative"` | 任意 |  | 分野タグ。v0.5.0 では受け付けるが絞り込みは行わない（bulk DB の category 列が未投入のため。Phase 2-13 で実効化） |
| `law_type` | `"Act"` \| `"CabinetOrder"` \| `"ImperialOrdinance"` \| `"MinisterialOrdinance"` \| `"Rule"` | 任意 |  | 法令種別で絞り込み |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 30） |

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
