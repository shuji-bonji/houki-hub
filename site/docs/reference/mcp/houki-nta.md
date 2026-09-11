---
title: "houki-nta-mcp — ツールリファレンス"
description: "houki-nta-mcp v0.12.0 の全 14 ツールの引数・型・既定値（tools/list から自動生成）と実測の呼び出し例"
---

# houki-nta-mcp — ツールリファレンス

<!-- GENERATED FILE — 手で編集しない。引数はサーバーの tools/list、呼び出し例は scripts/reference-examples/ から。 -->

::: info
**v0.12.0** の `tools/list` から自動生成しました（14 ツール・2026-09-12）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

**このページは自動生成のリファレンスです。** 全ツールの引数の名前・型・必須・既定値・説明を、動いているサーバーの `tools/list` から写しています（正典はサーバー自身です）。責務や使いどころの説明は[解説ページ](/mcp/houki-nta)にあります。呼び出し例の応答 JSON は実測で、版を添えています。

`nta_get_*` はローカル DB（`houki-nta-mcp --bulk-download-everything` で構築）を先に引き、無ければ国税庁サイトから直接取得します。`nta_search_*` はローカル DB の FTS5 を使うので、DB が無いと結果が空になります。すべての応答に `legal_status`（通達は国民を拘束しない旨）と、DB から返した場合は `freshness` が付きます。

## ツール一覧

| ツール | 概要 |
|---|---|
| [`nta_search_tsutatsu`](#nta-search-tsutatsu) | 国税庁の基本通達（消基通・所基通・法基通・相基通の 4 通達）を FTS5 でキーワード検索する。 |
| [`nta_get_tsutatsu`](#nta-get-tsutatsu) | 基本通達の本文を取得する。 |
| [`nta_search_qa`](#nta-search-qa) | 国税庁の質疑応答事例（9 税目: 所得税/源泉所得税/譲渡所得/相続税・贈与税/財産の評価/法人税/消費税/印紙税/法定調書）を FTS5 でキーワード検索する。 |
| [`nta_get_qa`](#nta-get-qa) | 国税庁の質疑応答事例 1 件を取得する。 |
| [`nta_search_tax_answer`](#nta-search-tax-answer) | タックスアンサー（一般納税者向け解説、約 750 件）を FTS5 でキーワード検索する。 |
| [`nta_get_tax_answer`](#nta-get-tax-answer) | 国税庁のタックスアンサー（よくある税の質問）本文を番号で取得する。 |
| [`nta_search_kaisei_tsutatsu`](#nta-search-kaisei-tsutatsu) | 改正通達（一部改正通達）を FTS5 でキーワード検索する。 |
| [`nta_get_kaisei_tsutatsu`](#nta-get-kaisei-tsutatsu) | 改正通達の本文を docId で取得する（DB 経由）。 |
| [`nta_search_jimu_unei`](#nta-search-jimu-unei) | 事務運営指針（jimu-unei）を FTS5 でキーワード検索する。 |
| [`nta_get_jimu_unei`](#nta-get-jimu-unei) | 事務運営指針の本文を docId で取得する（DB 経由）。 |
| [`nta_search_bunshokaitou`](#nta-search-bunshokaitou) | 文書回答事例（bunshokaitou）を FTS5 でキーワード検索する。 |
| [`nta_get_bunshokaitou`](#nta-get-bunshokaitou) | 文書回答事例の本文を docId で取得する（DB 経由）。 |
| [`nta_inspect_pdf_meta`](#nta-inspect-pdf-meta) | 指定した文書の添付 PDF メタ一覧（kind / size / URL）と pdf-reader-mcp 呼び出し例だけを返す軽量 API。 |
| [`resolve_abbreviation`](#resolve-abbreviation) | 略称・通称から houki-abbreviations 経由でエントリを解決する。 |

## nta_search_tsutatsu

国税庁の基本通達（消基通・所基通・法基通・相基通の 4 通達）を FTS5 でキーワード検索する。事前に `--bulk-download-all` で DB 投入が必要。結果に現れた通達ごとに、解釈の対象になる法律の対応表（base_laws_by_tsutatsu）と、houki-egov-mcp の get_law を案内する next_actions を付ける。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。例: "軽減税率", "電子帳簿", "棚卸資産"。略称も可（例: "電帳法"）。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `type` | `"kihon-tsutatsu"` \| `"kobetsu-tsutatsu"` | 任意 |  | 通達種別で絞り込み。kihon-tsutatsu=法令解釈通達, kobetsu-tsutatsu=個別通達 |
| `domain` | `"tax"` \| `"labor"` \| `"accounting"` \| `"commercial"` \| `"civil"` \| `"administrative"` | 任意 |  | 分野タグで絞り込み（略称辞書ベース） |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 50） |

::: warning ローカル DB が必要です
`houki-nta-mcp --bulk-download-all` で基本通達 4 種を取り込んでいないと、結果は空になります。応答の `freshness.staleness` が `outdated` のときは、同じコマンドで取り直してください。
:::

::: details 呼び出し例 — 「軽減税率に関係する通達の節は」
- 実測: v0.11.1（2026-09-11）
- ローカル DB: あり（`--bulk-download-everything` から 3 日で `staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "軽減税率", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "軽減税率",
  "count": 2,
  "hits": [
    {
      "tsutatsu": "消費税法基本通達",
      "abbr": "消基通",
      "clauseNumber": "5-9-10",
      "title": "持ち帰りのための飲食料品の譲渡か否かの判定",
      "snippet": " … の譲渡に該当し<b>軽減税率</b>の適用対象とな … ",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/05/09.htm",
      "score": 0.4413,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00"]
    },
    {
      "tsutatsu": "消費税法基本通達",
      "abbr": "消基通",
      "clauseNumber": "5-9-5",
      "title": "自動販売機による譲渡",
      "snippet": " … のであるから、<b>軽減税率</b>の適用対象とな … ",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/05/09.htm",
      "score": 0.4383,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T20:39:32.057Z",
    "newest_fetched_at": "2026-09-07T20:49:00.912Z",
    "staleness": "fresh",
    "days_since_oldest": 3
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "base_laws_by_tsutatsu": {
    "消費税法基本通達": ["消費税法", "消費税法施行令", "消費税法施行規則"]
  },
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "通達は国民・裁判所を拘束しない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法" }
    }
  ]
}
```

`hits[].clauseNumber` と `hits[].abbr` をそのまま `nta_get_tsutatsu` の `clause` / `name` に渡すと本文が取れます。

`base_laws_by_tsutatsu` は、結果に現れた通達ごとの、解釈の対象になる法律・政令・省令の対応表です（v0.11.0 から）。対応は通達単位の事実なので、hit ごとではなく応答に 1 回だけ置いています。`hits[].tsutatsu` をキーにして引いてください。`next_actions` は通達ごとに 1 件で、houki-egov-mcp の `get_law` に渡す法律名が入っています。

「軽減税率」は略称辞書で消費税法の通称として登録されていますが、本文に「軽減税率」を含む条項があるので、「消費税法」には広げずに検索しています（v0.11.1 から）。本文に出てこない通称（「インボイス」など）で 0 件になったときだけ「消費税法」に広げ、その旨を `search_notes` に書き、`scoreReasons` に `abbreviation expanded: インボイス → 消費税法` が付きます。v0.11.0 までは通称でも常に広げていたため、「消費税法」が出てくるだけの条項が混ざることがありました（[houki-nta-mcp#21](https://github.com/shuji-bonji/houki-nta-mcp/issues/21)）。
:::

::: details 呼び出し例 — DB が古いとき（`staleness: "outdated"`）
- 実測: v0.10.2（2026-09-07）。同じ呼び出しを、最後の取り込みから 126 日たった DB に対して行ったときの応答です

引数は上の例と同じです。違うのは `freshness` だけで、`hits` の中身は変わりません。

```jsonc
{
  "keyword": "軽減税率",
  "count": 2,
  "hits": [ /* 上の例と同じ */ ],
  "freshness": {
    "oldest_fetched_at": "2026-05-04T00:34:38.918Z",
    "newest_fetched_at": "2026-09-07T11:53:51.084Z",
    "staleness": "outdated",
    "days_since_oldest": 126,
    "warning": "一部ドキュメントが 126 日前のデータです。最新化するには `--bulk-download-all` を実行してください"
  }
  // legal_status は同じ
}
```

`staleness` が `fresh` 以外のときは、返ってきた本文が国税庁サイトの現在の内容と違う可能性があります。回答にその旨を書き、`warning` にあるコマンドの実行を利用者に案内してください。`days_since_oldest` は範囲内で最も古い文書の経過日数なので、一部だけが古い場合もこの値になります。
:::

## nta_get_tsutatsu

基本通達の本文を取得する。略称（消基通・所基通・法基通・相基通）対応、条項指定可能。DB 投入済（`--bulk-download-all`）の場合は DB から、未投入の場合はライブ fetch（結果は DB に書き戻し）。応答に解釈の対象になる法律（base_laws）を付け、next_actions で houki-egov-mcp の get_law を案内する。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `name` | string | **必須** |  | 通達名または略称。例: "消費税法基本通達", "消基通", "所得税基本通達", "所基通" |
| `clause` | string | 任意 |  | 通達番号。例: "5-1-9", "11-2-10"（章-項-号 形式） |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「消基通 1-7-2（登録番号の構成）の本文」
- 実測: v0.11.0（2026-09-11）
- ローカル DB: あり（`source: "db"`。無ければ国税庁サイトから取得し `source` が `"live"` になります）

**引数**

```jsonc
{ "name": "消基通", "clause": "1-7-2", "format": "json" }
```

**返る JSON**

```jsonc
{
  "tsutatsu": "消費税法基本通達",
  "clause": {
    "clauseNumber": "1-7-2",
    "title": "登録番号の構成",
    "paragraphs": [
      { "indent": 1, "text": "適格請求書発行事業者登録簿（法第57条の2第4項《適格請求書発行事業者の登録等》に規定する「適格請求書発行事業者登録簿」をいう。…）に登載する登録番号（…）は、次の区分に応じ、それぞれ次によるものとする。（令5課消2-9により追加、令7課消2-4により改正）" },
      { "indent": 2, "text": "(1) 法人番号を有する課税事業者 法人番号（…）及びその前に付されたローマ字の大文字Ｔにより構成されるもの" },
      { "indent": 2, "text": "(2) (1)以外の課税事業者 13桁の数字（法人番号と重複しないものとし、…）及びその前に付されたローマ字の大文字Ｔにより構成されるもの" }
    ],
    "fullText": "登録番号の構成\n適格請求書発行事業者登録簿（…"
  },
  "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/01/07.htm",
  "fetchedAt": "2026-09-07T20:39:38.910Z",
  "source": "db",
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "base_laws": ["消費税法", "消費税法施行令", "消費税法施行規則"],
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "通達は国民・裁判所を拘束しない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法" }
    }
  ]
}
```

引用するときは「消費税法基本通達 1-7-2」と `sourceUrl` を添え、`legal_status.binds_citizens: false`（通達は国民を拘束しない）を回答に残してください。`name` に法令名（「消費税法」）を渡すと、`OUT_OF_SCOPE` で houki-egov-mcp への案内が返ります。

`base_laws` は、この通達が解釈している法律・政令・省令です（v0.11.0 から）。`next_actions` の `example` をそのまま houki-egov-mcp の `get_law` に渡すと、根拠になる法律の本文を引けます。条番号は付きません。本文中の「法第57条の2第4項」のような参照を読んで、`article` を足してください。
:::

## nta_search_qa

国税庁の質疑応答事例（9 税目: 所得税/源泉所得税/譲渡所得/相続税・贈与税/財産の評価/法人税/消費税/印紙税/法定調書）を FTS5 でキーワード検索する。事前に `--bulk-download-qa` で DB 投入が必要。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。例: "社内会議 軽減税率", "テレワーク 必要経費"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `domain` | `"tax"` \| `"labor"` \| `"accounting"` \| `"commercial"` \| `"civil"` \| `"administrative"` | 任意 |  | 税目で絞り込み |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 50） |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。質疑応答事例は現状すべて HTML のみで PDF を持たないため true 指定時は空配列になる |

::: details 呼び出し例 — 「テレワークに関係する質疑応答事例」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "テレワーク", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "テレワーク",
  "results": [
    {
      "docType": "qa-jirei",
      "docId": "hojin/04/16",
      "taxonomy": "hojin",
      "title": "中小企業者等が取得をした働き方改革に資する減価償却資産の中小企業経営強化税制（租税特別措置法第42条の12の4）の適用について",
      "sourceUrl": "https://www.nta.go.jp/law/shitsugi/hojin/04/16.htm",
      "snippet": " … る器具備品（<b>テレワーク</b>用電子計算機等 … ",
      "score": 0.334,
      "scoreReasons": ["doc_type=qa weight 0.70"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T21:16:06.923Z",
    "newest_fetched_at": "2026-09-07T21:51:02.316Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`docId` の `hojin/04/16` は、`nta_get_qa` の `topic` / `category` / `id` にそのまま分かれます。質疑応答事例は PDF を持たないので `hasPdf: true` を付けると空になります。
:::

## nta_get_qa

国税庁の質疑応答事例 1 件を取得する。URL 形式: /law/shitsugi/{topic}/{category}/{id}.htm。format=json では【関係法令通達】を法令（related_laws）と通達（related_tsutatsu）に分け、next_actions で houki-egov-mcp の get_law と nta_get_tsutatsu を案内する。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `topic` | `"shotoku"` \| `"gensen"` \| `"joto"` \| `"sozoku"` \| `"hyoka"` \| `"hojin"` \| `"shohi"` \| `"inshi"` \| `"hotei"` | **必須** |  | 税目フォルダ。shotoku=所得税, gensen=源泉所得税, joto=譲渡所得, sozoku=相続税・贈与税, hyoka=財産の評価, hojin=法人税, shohi=消費税, inshi=印紙税, hotei=法定調書 |
| `category` | string | **必須** |  | カテゴリ番号（章相当）。例: "01", "02"。/law/shitsugi/{topic}/01.htm の TOC で確認できる |
| `id` | string | **必須** |  | 事例番号。例: "19" |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「消費税の質疑応答事例 02/19 の照会と回答、関係法令通達」
- 実測: v0.12.0（2026-09-11）
- ローカル DB: 不要（この例では国税庁サイトから取得）

**引数**

```jsonc
{ "topic": "shohi", "category": "02", "id": "19", "format": "json" }
```

**返る JSON（抜粋）**

```jsonc
{
  "qa": {
    "topic": "shohi",
    "category": "02",
    "id": "19",
    "title": "個人事業者が所有するゴルフ会員権の譲渡",
    "question": [
      "個人事業者がゴルフ会員権を譲渡した場合、課税の対象となるのでしょうか。"
    ],
    "answer": [
      "個人事業者が所有するゴルフ会員権は、会員権販売業者が所有している場合には棚卸資産に当たり、その譲渡は課税の対象となりますが、その他の個人事業者が所有している場合には生活用資産に当たり、その譲渡は課税の対象となりません（基通5－1－1（注）1）。"
    ],
    "relatedLaws": [
      "消費税法第2条第1項第8号、消費税法基本通達5-1-1"
    ],
    "notice": "令和7年8月1日現在の法令・通達等に基づいて作成しています。\n\nこの質疑事例は、照会に係る事実関係を前提とした一般的な回答であり、…この回答内容と異なる課税関係が生ずることがあることにご注意ください。",
    "basisDate": "2025-08-01",
    "sourceUrl": "https://www.nta.go.jp/law/shitsugi/shohi/02/19.htm",
    "fetchedAt": "2026-09-11T11:50:13.932Z"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  },
  "related_laws": [
    { "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8, "raw": "消費税法第2条第1項第8号" }
  ],
  "related_tsutatsu": [
    { "name": "消費税法基本通達", "clause": "5-1-1", "raw": "消費税法基本通達5-1-1" }
  ],
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "質疑応答事例は参考資料で法的拘束力がない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8 }
    },
    {
      "action": "nta_get_tsutatsu",
      "reason": "質疑応答事例が挙げている通達の本文を確認する",
      "example": { "name": "消費税法基本通達", "clause": "5-1-1" }
    }
  ]
}
```

【関係法令通達】の原文は `relatedLaws` にそのまま残り、法令は `related_laws`、通達は `related_tsutatsu` に分けて入ります。`next_actions` の `example` は、そのまま houki-egov-mcp の `get_law` と `nta_get_tsutatsu` の引数として使えます。

ページ下部の国税庁の注記（何年何月何日現在の法令に基づくか、個別の取引には異なる課税関係が生じうること）は `notice` に入り、基準日は `basisDate` に入ります。この注記は回答に残してください。
:::

## nta_search_tax_answer

タックスアンサー（一般納税者向け解説、約 750 件）を FTS5 でキーワード検索する。事前に `--bulk-download-tax-answer` で DB 投入が必要。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。例: "ふるさと納税", "医療費控除"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 50） |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。様式・別表系の説明など PDF 添付がある重要トピックを抽出したい時に true を指定 |

::: details 呼び出し例 — 「医療費控除のタックスアンサー」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "医療費控除", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "医療費控除",
  "results": [
    {
      "docType": "tax-answer",
      "docId": "1131",
      "taxonomy": "shotoku",
      "title": "セルフメディケーション税制と通常の医療費控除との選択適用",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1131.htm",
      "snippet": " … 療費控除の特例であり、通常の<b>医療費控</b> … ",
      "score": 0.253,
      "scoreReasons": ["doc_type=tax-answer weight 0.60"]
    },
    {
      "docType": "tax-answer",
      "docId": "1127",
      "taxonomy": "shotoku",
      "title": "医療費控除の対象となる介護保険制度下での居宅サービス等の対価",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1127.htm",
      "score": 0.250 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T21:01:50.511Z",
    "newest_fetched_at": "2026-09-07T21:15:57.646Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`docId` がタックスアンサー番号です。そのまま `nta_get_tax_answer` の `no` に渡します。`legal_status.binds_tax_office` も `false` で、通達と違い税務職員も拘束しない参考資料です。
:::

## nta_get_tax_answer

国税庁のタックスアンサー（よくある税の質問）本文を番号で取得する。番号の先頭桁から税目フォルダを自動判定。例: 6101 → 消費税の基本的なしくみ

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `no` | string | **必須** |  | タックスアンサー番号。先頭桁で税目決定: 1xxx=所得税, 2xxx=源泉, 3xxx=譲渡, 4xxx=相続・贈与, 5xxx=法人税, 6xxx=消費税, 7xxx=印紙税, 9xxx=お知らせ。例: "6101", "1120" |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: tip 引数名は `no` です
`id` ではありません。番号の先頭の桁で税目（1xxx=所得税、6xxx=消費税 など）を判定します。
:::

::: details 呼び出し例 — 「No.6101 消費税の基本的なしくみ」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: 不要（この例では国税庁サイトから取得。`fetchedAt` が呼び出し時刻）

**引数**

```jsonc
{ "no": "6101", "format": "json" }
```

**返る JSON（抜粋）**

```jsonc
{
  "taxAnswer": {
    "no": "6101",
    "title": "消費税の基本的なしくみ",
    "sections": [
      { "heading": "概要", "paragraphs": ["消費税は、特定の物品やサービスに課税する個別消費税（酒税・たばこ税等）とは異なり、消費一般に広く公平に課税する間接税です。…", "…"] },
      { "heading": "消費税の負担者", "paragraphs": ["…"] },
      { "heading": "課税のしくみ", "paragraphs": ["…", "令和５年10月１日から開始した「適格請求書等保存方式（インボイス制度）」では、…"] },
      { "heading": "申告・納付", "paragraphs": ["…"] },
      { "heading": "納税事務の負担軽減措置等", "paragraphs": ["1 事業者免税点制度", "…", "3 ２割特例（経過措置）", "…"] },
      { "heading": "根拠法令等", "paragraphs": ["消費税法など"] },
      { "heading": "関連リンク", "paragraphs": ["…"] }
    ],
    "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6101.htm",
    "fetchedAt": "2026-09-08T08:12:18.517Z",
    "effectiveDate": "令和7年4月1日現在法令等",
    "taxCategory": "消費税"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`effectiveDate` は国税庁がページに書いている「何年何月何日現在の法令等に基づくか」で、取得日ではありません。`sections[].heading` が「根拠法令等」の節に法令名が入るので、そこから houki-egov-mcp の `get_law` につなげられます。
:::

## nta_search_kaisei_tsutatsu

改正通達（一部改正通達）を FTS5 でキーワード検索する。事前に `--bulk-download-kaisei` で DB 投入が必要。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。例: "電子帳簿", "インボイス", "軽減税率"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `taxonomy` | string | 任意 |  | 税目フォルダで絞り込み。"shohi" / "shotoku" / "hojin" / "sisan/sozoku" のいずれか |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 50） |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。改正通達は新旧対照表 PDF を持つことが多く、改正点だけ知りたい時は true 推奨 |

::: tip 改正点だけ知りたいときは `hasPdf: true`
改正通達の本文は「別紙のとおり改める」という短い文で、実際の差分は新旧対照表の PDF にあります。`hasPdf: true` で PDF 付きの文書に絞り、`docId` を `nta_inspect_pdf_meta` に渡すと PDF の一覧と読み方の例が返ります。
:::

::: details 呼び出し例 — 「インボイス関係の改正通達を新旧対照表付きで」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "インボイス", "hasPdf": true, "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "インボイス",
  "results": [
    {
      "docType": "kaisei",
      "docId": "0025004-026",
      "taxonomy": "shohi",
      "title": "消費税法基本通達の一部改正について（法令解釈通達）",
      "issuedAt": "2025-04-01",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
      "snippet": " … （官印省略）\n<b>消費税法</b>基本通達（平成 … ",
      "score": 0.252,
      "scoreReasons": ["doc_type=kaisei weight 0.95", "abbreviation expanded: インボイス → 消費税法"]
    },
    {
      "docType": "kaisei",
      "docId": "191001",
      "taxonomy": "shohi",
      "title": "消費税法基本通達の一部改正について（法令解釈通達）",
      "issuedAt": "2019-10-01",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/191001/index.htm",
      "score": 0.250 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T20:49:01.018Z",
    "newest_fetched_at": "2026-09-07T20:51:23.491Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`docId` には新形式（`0025004-026`）と旧形式（`191001`）が混在します。どちらもそのまま `nta_get_kaisei_tsutatsu` に渡せます。
:::

## nta_get_kaisei_tsutatsu

改正通達の本文を docId で取得する（DB 経由）。本文 + 添付 PDF URL（pdf-reader-mcp で読み取り推奨）を返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docId` | string | **必須** |  | 文書 ID。新形式 "0026003-067" または旧形式 "240401" 等。`nta_search_kaisei_tsutatsu` 結果や DB hint で取得 |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「令和 7 年 4 月 1 日の消基通改正の本文と添付 PDF」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`source: "db"`）

**引数**

```jsonc
{ "docId": "0025004-026", "format": "json" }
```

**返る JSON**

```jsonc
{
  "document": {
    "docType": "kaisei",
    "docId": "0025004-026",
    "taxonomy": "shohi",
    "title": "消費税法基本通達の一部改正について（法令解釈通達）",
    "issuedAt": "2025-04-01",
    "issuer": "各国税局長 殿 沖縄国税事務所長 殿 各税関長 殿 沖縄地区税関長 殿\n国税庁長官 （官印省略）",
    "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
    "fetchedAt": "2026-09-07T20:49:03.281Z",
    "fullText": "課消2-4 課総11-10 … 令和7年4月1日\n…\n記\n1 消費税法基本通達について、別紙1「消費税法基本通達新旧対照表」の「改正前」欄に掲げる部分を「改正後」欄に掲げる部分のとおり改めることとし、令和7年4月1日から適用する。\n2 … 別紙2 … 令和8年11月1日から適用する。\n…",
    "attachedPdfs": [
      { "title": "別紙1（PDF/221KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf", "sizeKb": 221 },
      { "title": "別紙2（PDF/449KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf", "sizeKb": 449 },
      { "title": "【参考】令和８年11月１日から適用される「消費税法基本通達（第８章）」の構成及び新旧対応表（令和７年４月１日）（PDF/399KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf", "sizeKb": 399 }
    ]
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "source": "db"
}
```

本文は「別紙のとおり改める」までで、改正の中身は `attachedPdfs` の新旧対照表にあります。PDF の読み方は `nta_inspect_pdf_meta` が返す `reader_hints` を参照してください。この例では別紙 1 が令和 7 年 4 月 1 日から、別紙 2 が令和 8 年 11 月 1 日から適用と、適用日が 2 つに分かれています。
:::

## nta_search_jimu_unei

事務運営指針（jimu-unei）を FTS5 でキーワード検索する。事前に `--bulk-download-jimu-unei` で DB 投入が必要。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。例: "書面添付", "重加算税"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `taxonomy` | string | 任意 |  | 税目で絞り込み。"shotoku" / "hojin" / "sozoku" / "shohi" 等 |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 50） |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。別紙・別表 PDF を伴う指針だけを抽出したい時に true を指定 |

::: details 呼び出し例 — 「書面添付制度の事務運営指針」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "書面添付", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "書面添付",
  "results": [
    {
      "docType": "jimu-unei",
      "docId": "hojin/090401-2",
      "taxonomy": "hojin",
      "title": "調査課における書面添付制度の運用に当たっての基本的な考え方及び事務手続等について（事務運営指針）",
      "issuedAt": "2009-04-01",
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/01.htm",
      "snippet": " … <b>書面添付</b>制度適用法人について「<b>書面添</b> … ",
      "score": 0.465,
      "scoreReasons": ["doc_type=jimu-unei weight 0.85"]
    },
    {
      "docType": "jimu-unei",
      "docId": "shozei/090401",
      "taxonomy": "shozei",
      "title": "酒税に関する書面添付制度の運用に当たっての基本的な考え方及び事務手続等について（事務運営指針）",
      "issuedAt": "2009-04-01",
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/01.htm",
      "score": 0.450 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T20:51:23.604Z",
    "newest_fetched_at": "2026-09-07T20:51:58.985Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`docId` は `税目/日付` の形（`hojin/090401-2`）で、そのまま `nta_get_jimu_unei` に渡します。事務運営指針は通達と同じく税務職員を拘束し、国民は拘束しません（`binds_tax_office: true`）。
:::

## nta_get_jimu_unei

事務運営指針の本文を docId で取得する（DB 経由）。本文 + 添付 PDF URL（pdf-reader-mcp で読み取り推奨）を返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docId` | string | **必須** |  | 文書 ID。例: "shotoku/shinkoku/170331" / "sozoku/170111_1"。`nta_search_jimu_unei` 結果や DB hint で取得 |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「酒税の書面添付制度の事務運営指針」（検索結果の 2 件目）
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`source: "db"`）

**引数**

```jsonc
{ "docId": "shozei/090401", "format": "json" }
```

**返る JSON（本文は抜粋）**

```jsonc
{
  "document": {
    "docType": "jimu-unei",
    "docId": "shozei/090401",
    "taxonomy": "shozei",
    "title": "酒税に関する書面添付制度の運用に当たっての基本的な考え方及び事務手続等について（事務運営指針）",
    "issuedAt": "2009-04-01",
    "issuer": "各国税局長 殿 沖縄国税事務所長 殿\n国税庁長官",
    "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/01.htm",
    "fetchedAt": "2026-09-07T20:51:36.147Z",
    "fullText": "課酒6-3 課総2-8 官総-38 平成21年4月1日 改正 平成22年6月11日 改正 平成24年12月19日 改正 令和6年3月27日\n各国税局長 殿 沖縄国税事務所長 殿\n国税庁長官\n標題のことについては、下記のとおり定めたから、平成21年7月10日以降、これにより適切な運営を図られたい。…\n（趣旨） 書面添付制度（税理士法（昭和26年法律第237号。以下「法」という。）の平成13年度改正により、…\n記\n…\n【第1章 書面添付制度の運用に当たっての基本的な考え方】\n【1 制度の適正・円滑な運用及び普及・定着の推進】\n…\n【第2章 書面添付制度に係る事務手続及び留意事項】\n【1 意見聴取の実施】\n…\n【5 更正前の意見聴取】",
    "attachedPdfs": [
      { "title": "別紙1(PDF/191KB)", "url": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/pdf/01.pdf", "sizeKb": 191 },
      { "title": "別紙2(PDF/158KB)", "url": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/pdf/02.pdf", "sizeKb": 158 }
    ]
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "source": "db"
}
```

`fullText` の 1 行目に文書番号と改正日が並びます。この例では平成 21 年に定め、令和 6 年 3 月 27 日まで 3 回改正されています。`issuedAt` は制定日で、最終改正日ではありません。最終改正がいつかは 1 行目から読んでください。

末尾の `【…】` は章・節の見出しです。様式（応接簿など）は `attachedPdfs` にあり、`nta_inspect_pdf_meta` に `docType: "jimu-unei"` を指定すると pdf-reader-mcp での読み方の例が返ります。
:::

## nta_search_bunshokaitou

文書回答事例（bunshokaitou）を FTS5 でキーワード検索する。事前に `--bulk-download-bunshokaitou` で DB 投入が必要。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string | **必須** |  | 検索キーワード。例: "電子帳簿", "適格請求書", "災害損失"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `taxonomy` | string | 任意 |  | 税目で絞り込み。"shotoku" / "hojin" / "sozoku" / "gensen" / "joto-sanrin" / "shohi" 等 |
| `limit` | number | 任意 | `10` | 取得件数（デフォルト: 10、最大: 50） |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。回答書本文 PDF を持つ事例だけを抽出したい時に true を指定 |

::: tip 本文で検索できます（v0.10.3 以降）
v0.10.2 以前は表と別紙を取り込んでいなかったため、題名の語でしか当たりませんでした。いまは回答内容・関係する法令条項等・別紙の照会文まで検索の対象です。v0.10.2 以前に作った DB を使っている場合は `houki-nta-mcp --bulk-download-bunshokaitou --refresh` で再投入してください。
:::

::: details 呼び出し例 — 「産科医療の給付金に関する文書回答事例」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "産科医療", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "産科医療",
  "results": [
    {
      "docType": "bunshokaitou",
      "docId": "shotoku/081102",
      "taxonomy": "shotoku",
      "title": "産科医療補償制度に基づき支払われる補償金の所得税法上の取扱いについて",
      "issuedAt": "2008-11-06",
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/081102/index.htm",
      "snippet": " … ・ <b>産科医療</b>補償制度標準補償約款 ・ … ",
      "score": 0.519,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"]
    },
    {
      "docType": "bunshokaitou",
      "docId": "shotoku/250416",
      "taxonomy": "shotoku",
      "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
      "issuedAt": "2025-04-07",
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm",
      "snippet": " … ・<b>産科医療</b>特別給付事業 実施要綱\n〔 … ",
      "score": 0.492,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-08T07:27:19.397Z",
    "newest_fetched_at": "2026-09-08T07:46:15.519Z",
    "staleness": "fresh",
    "days_since_oldest": 0
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "文書回答事例は照会者・国税庁双方の合意に基づく個別事案回答であり、一般的な法的拘束力はない。同じ事案で同様の判断を期待することは可能だが、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`snippet` が添付書類の行から取れていることから、題名ではなく表の中身に当たっているのが分かります。`docId` をそのまま `nta_get_bunshokaitou` に渡せます。
:::

::: details 呼び出し例 — 別紙の本文にしかない語で引く
- 実測: v0.10.4（2026-09-08）

「宇宙空間」は題名にも回答内容にもなく、別紙の照会文にだけ出てくる語です。

**引数**

```jsonc
{ "keyword": "宇宙空間", "limit": 3 }
```

**返る JSON（抜粋）**

```jsonc
{
  "keyword": "宇宙空間",
  "results": [
    {
      "docType": "bunshokaitou",
      "docId": "tokyo/shohi/251017",
      "taxonomy": "shohi",
      "title": "人工衛星打上げ輸送サービスに係る消費税の取扱いについて",
      "issuedAt": "2025-10-17",
      "sourceUrl": "https://www.nta.go.jp/about/organization/tokyo/bunshokaito/shohi/251017/index.htm",
      "snippet": " … する施設）より<b>宇宙空間</b>における所定の … ",
      "score": 0.537,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"]
    }
  ]
  // freshness / legal_status は上の例と同じ
}
```

0 件のときは `results: []` と `hint`（「該当なし。`--bulk-download-bunshokaitou` で DB 投入済みか確認してください」）が返ります。この応答だけでは「DB が空」なのか「本当に該当がない」のかを区別できないので、他の語でも 0 件なら DB の投入状況を確かめてください。
:::

## nta_get_bunshokaitou

文書回答事例の本文を docId で取得する（DB 経由）。本庁系は "shotoku/250416"、国税局系は "tokyo/shotoku/260218" のような形式。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docId` | string | **必須** |  | 文書 ID。例: "shotoku/250416" (本庁) / "tokyo/shotoku/260218" (東京国税局) |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: tip 本文は「表 + 別紙」でできています
文書回答事例のページは、照会者・関係する法令条項等・回答年月日・回答者・回答内容が表に入り、照会の趣旨・事実関係・理由は「別紙」（別ページ）にあります。v0.10.3 / v0.10.4 から、表の各行を「見出し: 値」の形で取り込み、別紙を `【別紙】` として本文の末尾に連結します。v0.10.2 以前に作った DB には本文が入っていないので、`houki-nta-mcp --bulk-download-bunshokaitou --refresh` で再投入してください。
:::

::: details 呼び出し例 — 「産科医療特別給付事業の給付金は非課税か」（本庁系）
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり（`--bulk-download-bunshokaitou --refresh` の直後）

**引数**

```jsonc
{ "docId": "shotoku/250416", "format": "json" }
```

**返る JSON（本文は抜粋）**

```jsonc
{
  "document": {
    "docType": "bunshokaitou",
    "docId": "shotoku/250416",
    "taxonomy": "shotoku",
    "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
    "issuedAt": "2025-04-07",
    "issuer": "国税庁",
    "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm",
    "fetchedAt": "2026-09-08T07:27:21.701Z",
    "fullText": "取引等に係る税務上の取扱い等に関する照会（同業者団体等用）\n〔照会〕\n照会者 （フリガナ） 団体の名称: （コウセイロウドウショウ） 厚生労働省\n…\n関係する法令条項等: 所得税法第9条第1項18号、所得税法施行令第30条\n添付書類: ・産科医療特別給付事業 実施要綱\n〔回答〕\n回答年月日: 令和7年4月7日\n回答者: 国税庁課税部審理室長\n回答内容: 標題のことについては、ご照会に係る事実関係を前提とする限り、貴見のとおりで差し支えありません。 ただし、次のことを申し添えます。 (1) この文書回答は、…個々の納税者が行う具体的な取引等に適用する場合においては、この回答内容と異なる課税関係が生ずることがあります。 (2) この回答内容は国税庁としての見解であり、個々の納税者の申告内容等を拘束するものではありません。\n【別紙】\n別紙\n医政地発0331第4号 令和7年3月31日\n国税庁 課税部審理室長 殿\n厚生労働省医政局地域医療計画課長\n産科医療補償制度（以下「本体制度」といいます。）は、…\n記\n【1 本件事業の概要】\n【(1) 本件事業の給付対象】\n…\n【2 本件給付対象者に支払われる本件給付金が非課税所得として取り扱われる理由】\n…\n以上",
    "attachedPdfs": []
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "文書回答事例は照会者・国税庁双方の合意に基づく個別事案回答であり、一般的な法的拘束力はない。同じ事案で同様の判断を期待することは可能だが、実務判断は通達・法令本文に基づく必要がある"
  },
  "source": "db"
}
```

読むときの手がかりは 3 つあります。`関係する法令条項等` に法令名と条番号が入るので、そこから houki-egov-mcp の `get_law` につなげられます。`回答内容` が国税庁の結論で、この例では「貴見のとおりで差し支えありません」と、個別の取引では課税関係が異なりうるという但し書きが付いています。`【別紙】` 以降が照会者の主張と事実関係で、結論の理由はここにあります。

引用するときは `sourceUrl` と `issuedAt`（回答年月日）を添え、`legal_status` のとおり「照会者以外を拘束しない個別事案の回答」であることを残してください。
:::

::: details 呼び出し例 — 国税局系（`tokyo/shohi/251017`）
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり

国税局系は `docId` が局名から始まり、回答者が国税局の審理課長になります。別紙の置き場所もページごとに違います（`another.htm` / `01.htm#a01` / `besshi.htm`）が、呼び出す側が意識する必要はありません。

**引数**

```jsonc
{ "docId": "tokyo/shohi/251017", "format": "json" }
```

**返る JSON（本文は抜粋）**

```jsonc
{
  "document": {
    "docId": "tokyo/shohi/251017",
    "taxonomy": "shohi",
    "title": "人工衛星打上げ輸送サービスに係る消費税の取扱いについて",
    "issuedAt": "2025-10-17",
    "issuer": "東京国税局",
    "sourceUrl": "https://www.nta.go.jp/about/organization/tokyo/bunshokaito/shohi/251017/index.htm",
    "fetchedAt": "2026-09-08T07:43:12.416Z",
    "fullText": "【取引等に係る税務上の取扱い等に関する事前照会】\n〔照会〕\n…\n関係する法令条項等: 消費税法第4条、第7条 消費税法施行令第6条 消費税法施行規則第5条 消費税法基本通達5-7-13\n〔回答〕\n回答年月日 令和7年10月17日 回答者 東京国税局審理課長\n回答内容: 標題のことについては、ご照会に係る事実関係を前提とする限り、貴見のとおりで差し支えありません。…\n【別紙】\n【1 事前照会の趣旨】\n当社は、人工衛星を所有する顧客より発注を受け、ロケットによる人工衛星打上げ輸送サービス…\n【2 事前照会に係る取引等の事実関係】\n(1) 本件サービスについて …\nイ ロケットの準備 人工衛星の打上げが可能なロケットを調達する。\n…\n【3 上記2の事実関係に対して事前照会者の求める見解となることの理由】\n…\nロ 宇宙空間は「国内以外の地域」に該当するか …宇宙空間は、消費税法における「国内」に該当せず、「国内以外の地域」に該当するものと考えます。\n…\n以上",
    "attachedPdfs": []
  },
  // legal_status は上の例と同じ
  "source": "db"
}
```

別紙の箇条書き（`イ` `ロ` `ハ` や `(1)` `(2)`）は、階層をたたんで 1 行ずつの段落として入ります。この文書では本文が約 7,000 文字あり、その大半が別紙です。
:::

## nta_inspect_pdf_meta

指定した文書の添付 PDF メタ一覧（kind / size / URL）と pdf-reader-mcp 呼び出し例だけを返す軽量 API。本文は含まない。`nta_get_*` で全文を取得すると重い場合や、PDF だけを確認したい時に使う。Phase 4-2 (v0.7.1) で追加。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docType` | `"kaisei"` \| `"jimu-unei"` \| `"bunshokaitou"` \| `"tax-answer"` | **必須** |  | 文書種別。改正通達 (kaisei) / 事務運営指針 (jimu-unei) / 文書回答事例 (bunshokaitou) / タックスアンサー (tax-answer)。質疑応答事例 (qa-jirei) は PDF を持たないため対象外 |
| `docId` | string | **必須** |  | 文書 ID。各 docType の `nta_search_*` 結果や `nta_get_*` のレスポンスから得られる |

::: details 呼び出し例 — 「改正通達 0025004-026 の PDF を pdf-reader-mcp でどう読むか」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: あり

**引数**

```jsonc
{ "docType": "kaisei", "docId": "0025004-026" }
```

**返る JSON**

```jsonc
{
  "docType": "kaisei",
  "docId": "0025004-026",
  "title": "消費税法基本通達の一部改正について（法令解釈通達）",
  "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
  "attachedPdfs": [
    { "title": "【参考】… 新旧対応表 …（PDF/399KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf", "sizeKb": 399, "kind": "comparison" },
    { "title": "別紙1（PDF/221KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf", "sizeKb": 221, "kind": "attachment" },
    { "title": "別紙2（PDF/449KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf", "sizeKb": 449, "kind": "attachment" }
  ],
  "reader_hints": {
    "tool": "@shuji-bonji/pdf-reader-mcp",
    "primary_action": "extract_tables",
    "min_pdf_reader_version": "0.3.0",
    "note": "本文取得は pdf-reader-mcp に委譲（責務分離）。comparison / attachment は extract_tables (v0.3.0+) で表構造を保持したまま抽出するのが最優先。それ以外は read_text。…",
    "examples": [
      { "kind": "comparison", "tool": "extract_tables", "args": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf" }, "note": "extract_tables で改正後/改正前の差分を表として抽出するのが最優先。失敗時は read_text に fallback。" },
      { "kind": "attachment", "tool": "extract_tables", "args": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf" }, "note": "extract_tables で表組みの別紙・別表・様式を構造化抽出。…" }
    ]
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`attachedPdfs[].kind` は PDF のタイトルから分類したもので、`comparison`（新旧対照表）と `attachment`（別紙・別表）は表として読むのが向いています。`reader_hints.examples[].args` をそのまま pdf-reader-mcp の `extract_tables` に渡せます。本文は含まないので、全文が要るときは `nta_get_kaisei_tsutatsu` を使います。
:::

## resolve_abbreviation

略称・通称から houki-abbreviations 経由でエントリを解決する。houki-nta-mcp 管轄外（法令系等）の場合は「他 MCP に誘導」のヒントを返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `abbr` | string | **必須** |  | 略称。例: "消基通", "所基通", "電帳法" |

::: details 呼び出し例 — 「電帳法 は houki-nta-mcp で引けるか」
- 実測: v0.10.4（2026-09-08）
- ローカル DB: 不要

**引数**

```jsonc
{ "abbr": "電帳法" }
```

**返る JSON**

```jsonc
{
  "abbr": "電帳法",
  "resolved": {
    "abbr": "電帳法",
    "formal": "電子計算機を使用して作成する国税関係帳簿書類の保存方法等の特例に関する法律",
    "law_id": null,
    "law_type": "Act",
    "domain": "tax",
    "category": "law",
    "source_mcp_hint": "houki-egov",
    "aliases": ["電子帳簿保存法", "電子帳簿保存", "電帳", "電子帳簿等保存制度"],
    "note": "通称: 電子帳簿保存法 (電帳法)"
  },
  "in_scope": false,
  "hint": "このエントリは houki-egov の管轄です。houki-egov-mcp で取得してください。"
}
```

`in_scope: false` は、この略称が houki-nta-mcp の管轄外（法律なので houki-egov-mcp）であることを示します。houki-egov-mcp 側の同名ツールとの違いはこの `in_scope` と `hint` で、辞書は同じ houki-abbreviations です。「消基通」「所基通」のような通達の略称なら `in_scope: true` になります。
:::
