---
title: "houki-nta-mcp — ツールリファレンス"
description: "houki-nta-mcp v0.27.0 の全 14 ツールの引数・型・既定値（tools/list から自動生成）と実測の呼び出し例"
---

# houki-nta-mcp — ツールリファレンス

<!-- GENERATED FILE — 手で編集しない。引数はサーバーの tools/list、呼び出し例は scripts/reference-examples/ から。 -->

::: info
**v0.27.0** の `tools/list` から自動生成しました（14 ツール・2026-10-09）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
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
| [`nta_inspect_pdf_meta`](#nta-inspect-pdf-meta) | 指定した文書の添付 PDF の一覧を返す。 |
| [`resolve_abbreviation`](#resolve-abbreviation) | 略称・通称から houki-abbreviations 経由でエントリを解決する。 |

## nta_search_tsutatsu

国税庁の基本通達（消基通・所基通・法基通・相基通の 4 通達）を FTS5 でキーワード検索する。事前に `--bulk-download-all` で DB 投入が必要。結果に現れた通達ごとに、解釈の対象になる法律の対応表（base_laws_by_tsutatsu）と、houki-egov-mcp の get_law を案内する next_actions を付ける。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string (minLength 1) | **必須** |  | 検索キーワード。例: "軽減税率", "電子帳簿", "棚卸資産"。略称も可（例: "電帳法"）。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `limit` | integer (1–50) | 任意 | `10` | 取得件数。1 以上 50 以下の整数（デフォルト: 10）。範囲の外は丸めずに INVALID_ARGUMENT |

::: warning ローカル DB が必要です
`npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-all` で基本通達 4 種を取り込んでいないと、結果は空になります。応答の `freshness.staleness` が `outdated` のときは、同じコマンドで取り直してください。
:::

::: details 呼び出し例 — 「軽減税率に関係する通達の節は」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（`staleness: "fresh"`）

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
      "snippet": " … 施して行う飲食料品の譲渡に該当し<b>軽減税率</b>の適用対象となるのかは、当該飲食 … ",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/05/09.htm",
      "score": 0.4414,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00"]
    },
    {
      "tsutatsu": "消費税法基本通達",
      "abbr": "消基通",
      "clauseNumber": "5-9-5",
      "title": "自動販売機による譲渡",
      "snippet": " … 食料品を販売するものであるから、<b>軽減税率</b>の適用対象となる飲食料品の譲渡に … ",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/05/09.htm",
      "score": 0.4384,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:14:49.904Z",
    "newest_fetched_at": "2026-10-04T03:24:14.467Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
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
- 版の照合: しない（126 日たった DB を用意できず、取り直せないため）

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
    "warning": "一部ドキュメントが 126 日前のデータです。最新化するには `npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-all` を実行してください",
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  }
  // legal_status は同じ
}
```

この例の JSON は v0.10.2 の実測に、v0.25.0 で変わった 2 か所を仕様（SPEC-NTA-SEARCH-RULES-017・022）に合わせて書き足したものです。`warning` のコマンドが `npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-all` の形になり（v0.24.x まではフラグだけ）、`freshness.db_path` が付きます。126 日たった DB を用意できないため、v0.25.0 では実測していません。

`staleness` が `fresh` 以外のときは、返ってきた本文が国税庁サイトの現在の内容と違う可能性があります。回答にその旨を書き、`warning` にあるコマンドの実行を利用者に案内してください。`days_since_oldest` は範囲内で最も古い文書の経過日数なので、一部だけが古い場合もこの値になります。
:::

## nta_get_tsutatsu

基本通達の本文を取得する。略称（消基通・所基通・法基通・相基通）対応、条項指定可能。DB に条項があれば DB から返す。無ければ、bulk download（`--bulk-download-all`）済みの通達はエラー ARTICLE_NOT_FOUND、それ以外は国税庁サイトの目次から候補ページを選んで取る（1 回の呼び出しで 10 ページまで。取ったページは DB に書き戻す）。応答に解釈の対象になる法律（base_laws）を付け、next_actions で houki-egov-mcp の get_law を案内する。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `name` | string (minLength 1) | **必須** |  | 通達名または略称。例: "消費税法基本通達", "消基通", "所得税基本通達", "所基通" |
| `clause` | string | 任意 |  | 通達番号。形は通達ごとに違う。消費税法基本通達: 章-節-条（例 "5-1-9", "1-4-13の2"）。法人税基本通達: 章-節-条で、節に枝番号が付くことがある（例 "1-1-1", "1-3の2-1"）。所得税基本通達: 条-項。複数の条に共通する通達は "条~条共-項"（例 "34-1", "2-4の2", "23~35共-6"）。相続税法基本通達: 条-項。複数の条に共通する通達は "条・条共-項"（例 "3-1", "1の3・1の4共-1"）。全角の数字・ハイフンは半角に揃えて読む（DB から返すときも、国税庁サイトから取るときも） |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「消基通 1-7-2（登録番号の構成）の本文」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（`source: "db"`。DB に無ければ国税庁サイトから取得し、`source` が `"live"` になります）

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
      { "indent": 2, "text": "(1) 法人番号を有する課税事業者 法人番号（…）及びその前に付されたローマ字の大文字Tにより構成されるもの" },
      { "indent": 2, "text": "(2) (1)以外の課税事業者 13桁の数字（法人番号と重複しないものとし、…）及びその前に付されたローマ字の大文字Tにより構成されるもの" }
    ],
    "fullText": "登録番号の構成\n適格請求書発行事業者登録簿（…"
  },
  "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/01/07.htm",
  "fetchedAt": "2026-10-04T03:14:56.689Z",
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

`clause` の形は通達ごとに違います。消費税法基本通達・法人税基本通達は「章-節-条」（`1-7-2`、`1-3の2-1`）、所得税基本通達・相続税法基本通達は「条-項」（`34-1`、`23~35共-6`、`1の3・1の4共-1`）です。全角の数字・ハイフンで渡しても半角に揃えてから読みます。

DB に無い条項は、基本通達 4 種とも国税庁サイトから取得します（v0.21.0 から。v0.20.x までは消費税法基本通達だけでした）。消費税法基本通達以外は目次ページから候補のページを選び、1 回の呼び出しで最大 10 ページまで順に取得します。取得したページは DB に書き戻すので、同じ節の条項は次から `source: "db"` で返ります。候補のどのページにも無いときは `ARTICLE_NOT_FOUND` と、見たページの番号（`available_clauses`）・URL（`searched_urls`）が返ります（[houki-nta-mcp#54](https://github.com/shuji-bonji/houki-nta-mcp/issues/54)）。

`base_laws` は、この通達が解釈している法律・政令・省令です（v0.11.0 から）。`next_actions` の `example` をそのまま houki-egov-mcp の `get_law` に渡すと、根拠になる法律の本文を引けます。条番号は付きません。本文中の「法第57条の2第4項」のような参照を読んで、`article` を足してください。
:::

## nta_search_qa

国税庁の質疑応答事例（9 税目: 所得税/源泉所得税/譲渡所得/相続税・贈与税/財産の評価/法人税/消費税/印紙税/法定調書）を FTS5 でキーワード検索する。事前に `--bulk-download-qa` で DB 投入が必要。この種別の文書が DB に 1 件も無いときはエラー DOC_NOT_FOUND を返す（キーワードに合わないだけの 0 件は results: [] で返す）。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string (minLength 1) | **必須** |  | 検索キーワード。例: "社内会議 軽減税率", "テレワーク 必要経費"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `topic` | `"shotoku"` \| `"gensen"` \| `"joto"` \| `"sozoku"` \| `"hyoka"` \| `"hojin"` \| `"shohi"` \| `"inshi"` \| `"hotei"` | 任意 |  | 税目で絞り込み。shotoku=所得税 / gensen=源泉所得税 / joto=譲渡所得 / sozoku=相続税・贈与税 / hyoka=財産の評価 / hojin=法人税 / shohi=消費税 / inshi=印紙税 / hotei=法定調書 |
| `limit` | integer (1–50) | 任意 | `10` | 取得件数。1 以上 50 以下の整数（デフォルト: 10）。範囲の外は丸めずに INVALID_ARGUMENT |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。質疑応答事例は現状すべて HTML のみで PDF を持たないため true 指定時は空配列になる |

::: details 呼び出し例 — 「テレワークに関係する質疑応答事例」
- 実測: v0.25.0（2026-10-05）
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
      "issuedAt": null,
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/shitsugi/hojin/04/16.htm",
      "snippet": " … 活動の用に直接供される器具備品（<b>テレワーク</b>用電子計算機等）、ソフトウエア（ … ",
      "score": 0.341,
      "scoreReasons": ["doc_type=qa weight 0.70"],
      "index_status": null,
      "orphaned_at": null
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:51:26.746Z",
    "newest_fetched_at": "2026-10-04T04:26:15.744Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`docId` の `hojin/04/16` は、`nta_get_qa` の `topic` / `category` / `id` にそのまま分かれます。質疑応答事例は PDF を持たないので、`hasPdf: true` を付けると `results: []` と、`hint`「DB の質疑応答事例 1,841 件に、PDF 付きの文書はありません。hasPdf を外して検索してください」が返ります。`issuedAt`・`basisDate` は質疑応答事例の検索結果では `null` です（基準日は `nta_get_qa` の `qa.basisDate` で読めます）。
:::

::: details 呼び出し例 — 税目（topic）で絞る
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "軽減税率", "topic": "shohi", "limit": 3 }
```

**返る JSON**

```jsonc
{
  "keyword": "軽減税率",
  "results": [
    {
      "docType": "qa-jirei",
      "docId": "shohi/21/10",
      "taxonomy": "shohi",
      "title": "令和元年10月1日前の借入金の返済に充てる補助金の交付を受けた場合",
      "issuedAt": null,
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/shitsugi/shohi/21/10.htm",
      "snippet": " … は、原則として消費税率7.8％（<b>軽減税率</b>が適用される課税仕入れ等に係る支 … ",
      "score": 0.199,
      "scoreReasons": ["doc_type=qa weight 0.70"],
      "index_status": null,
      "orphaned_at": null
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T04:15:37.962Z",
    "newest_fetched_at": "2026-10-04T04:20:45.581Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  }
  // legal_status は上の例と同じ
}
```

`topic` は `--qa-topic` と同じ値（`shotoku` / `gensen` / `joto` / `sozoku` / `hyoka` / `hojin` / `shohi` / `inshi` / `hotei`）です。`freshness` は、絞り込んだ税目の文書の取得時点を示します。
分野の引数 `domain` は v0.24.0 で外しました。渡すと `INVALID_ARGUMENT`（`detail.issues[0].path: "domain"`）になるので、税目で絞るときは `topic` を使います（v0.23.x までは `domain: "tax"` を受け付けて、省いたときと同じ結果を返していました）。
:::

::: details 呼び出し例 — キーワードに合う文書が無いとき
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（質疑応答事例 1,841 件）

**引数**

```jsonc
{ "keyword": "異なる課税関係が生ずる" }
```

**返る JSON**

```jsonc
{
  "results": [],
  "keyword": "異なる課税関係が生ずる",
  "hint": "該当なし。DB の質疑応答事例 1,841 件に「異なる課税関係が生ずる」に合う文書はありません。別のキーワードで試してください",
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:51:26.746Z",
    "newest_fetched_at": "2026-10-04T04:26:15.744Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  }
  // legal_status は上の例と同じ
}
```

この語はページ下部の注記の文言で、v0.12.0 から注記は本文から外しているので 0 件になります。`hint` の件数で、DB に質疑応答事例が入っていることが分かります。
質疑応答事例が DB に 1 件も無いときは、`results: []` ではなくエラー `DOC_NOT_FOUND` が返ります。`hint` は DB の状態ごとに先頭の文が変わり、どれも開こうとした DB のパス（ホームは `~`）を含みます（v0.25.0 から）。DB のファイルが無いときは「ローカル DB（~/.cache/houki-nta-mcp/cache.db）がありません。…」、質疑応答事例だけが無いときは「ローカル DB（~/.cache/houki-nta-mcp/cache.db）に質疑応答事例（doc_type="qa-jirei"）が入っていません。…」で始まります。`next_actions` の `example.command` は `npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-qa` です。
:::

## nta_get_qa

国税庁の質疑応答事例 1 件を取得する。URL 形式: /law/shitsugi/{topic}/{category}/{id}.htm。国税庁サイトにそのページが無いときはエラー DOC_NOT_FOUND を返し、nta_search_qa を案内する。format=json では【関係法令通達】を法令（related_laws）と通達（related_tsutatsu）に分け、next_actions で houki-egov-mcp の get_law と nta_get_tsutatsu を案内する。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `topic` | `"shotoku"` \| `"gensen"` \| `"joto"` \| `"sozoku"` \| `"hyoka"` \| `"hojin"` \| `"shohi"` \| `"inshi"` \| `"hotei"` | **必須** |  | 税目フォルダ。shotoku=所得税, gensen=源泉所得税, joto=譲渡所得, sozoku=相続税・贈与税, hyoka=財産の評価, hojin=法人税, shohi=消費税, inshi=印紙税, hotei=法定調書 |
| `category` | string (minLength 1) | **必須** |  | カテゴリ番号（章相当）。1 桁か 2 桁の数字。例: "01", "02"。全角の数字は半角に揃えて読む。/law/shitsugi/{topic}/01.htm の TOC で確認できる |
| `id` | string (minLength 1) | **必須** |  | 事例番号。1 桁か 2 桁の数字。例: "19"。全角の数字は半角に揃えて読む |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「消費税の質疑応答事例 02/19 の照会と回答、関係法令通達」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: 不要。ただし DB に構造があればそこから返る（この例は 2 回目の呼び出しで `source: "db"`）

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
    "fetchedAt": "2026-10-04T04:15:41.363Z"
  },
  "source": "db",
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
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

`source` はローカル DB（`"db"`）と国税庁サイト（`"live"`）のどちらから返したかです（v0.16.0 から）。1 回目は `"live"` で、その結果が DB に書き戻されるので 2 回目からは `"db"` になります。`"db"` の `fetchedAt` は呼び出した時刻ではなく DB に取り込んだ日時なので、引用するときはその値をそのまま書きます。v0.15.0 までは毎回国税庁サイトから取得していました（[houki-nta-mcp #29](https://github.com/shuji-bonji/houki-nta-mcp/issues/29)）。

国税庁の索引から外れた文書では、上の段の `index_status` が `"removed_from_index"` になり、`orphaned_at` と `notice` に値が入ります（v0.17.0 から）。この事例は索引にあるので、3 つとも `null` です（キーは v0.23.0 から常にあります）。上の段の `notice` は索引の注記で、`qa.notice`（国税庁のページ下部の注記）とは別のものです。
:::

::: details 呼び出し例 — 枝番号の号を挙げている事例（法人税 33/02）
- 実測: v0.25.0（2026-10-05）

**引数**

```jsonc
{ "topic": "hojin", "category": "33", "id": "02", "format": "json" }
```

**返る JSON**（`related_laws` と `next_actions` の抜粋）

```jsonc
{
  "related_laws": [
    { "law_name": "法人税法", "article": "2", "item": "12の8", "raw": "法人税法第2条第12号の8" },
    { "law_name": "法人税法施行令", "article": "4の3", "paragraph": 4, "item": 1, "raw": "法人税法施行令第4条の3第4項第1号" },
    { "law_name": "法人税法施行規則", "article": "3", "raw": "法人税法施行規則第3条" }
  ],
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "質疑応答事例は参考資料で法的拘束力がない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "法人税法", "article": "2", "item": "12の8" }
    }
    // 施行令・施行規則への案内が続く
  ]
  // qa / legal_status は上の例と同じ形
}
```

「第2条第12号の8」のような枝番号の号は、v0.14.0 から `item` に文字列（`"12の8"`）で入ります（v0.13.0 までは `item` を入れていませんでした）。この `example` を houki-egov-mcp の `get_law` にそのまま渡せるのは v0.6.0 以上です。法人税法 2 条は項が 1 つだけなので、`paragraph` が無くても号を引けます。
:::

## nta_search_tax_answer

タックスアンサー（一般納税者向け解説、約 750 件）を FTS5 でキーワード検索する。事前に `--bulk-download-tax-answer` で DB 投入が必要。この種別の文書が DB に 1 件も無いときはエラー DOC_NOT_FOUND を返す（キーワードに合わないだけの 0 件は results: [] で返す）。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string (minLength 1) | **必須** |  | 検索キーワード。例: "ふるさと納税", "医療費控除"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `limit` | integer (1–50) | 任意 | `10` | 取得件数。1 以上 50 以下の整数（デフォルト: 10）。範囲の外は丸めずに INVALID_ARGUMENT |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。様式・別表系の説明など PDF 添付がある重要トピックを抽出したい時に true を指定 |

::: details 呼び出し例 — 「医療費控除のタックスアンサー」
- 実測: v0.25.1（2026-10-05。タックスアンサーを `--bulk-download-tax-answer --refresh` で入れ直した DB）
- ローカル DB: あり（`staleness: "fresh"`。国税庁の索引から消えた記事が 1 件ある DB）

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
      "issuedAt": null,
      "basisDate": "2026-04-01",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1131.htm",
      "snippet": " … ルフメディケーション税制と通常の<b>医療費控除</b>との選択適用\n\n[令和8年4月1 … ",
      "score": 0.2529,
      "scoreReasons": ["doc_type=tax-answer weight 0.60"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "tax-answer",
      "docId": "1127",
      "taxonomy": "shotoku",
      "title": "医療費控除の対象となる介護保険制度下での居宅サービス等の対価",
      "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1127.htm",
      "snippet": "<b>医療費控除</b>の対象となる介護保険制度下での居 … ",
      "score": 0.2510 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-05T05:34:49.324Z",
    "newest_fetched_at": "2026-10-05T05:49:00.545Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  },
  "next_actions": [
    { "action": "nta_get_tax_answer", "reason": "記事の本文を読めます", "example": { "no": "1131" } }
  ]
}
```

`docId` がタックスアンサー番号です。そのまま `nta_get_tax_answer` の `no` に渡します。`next_actions` に先頭の記事を読む呼び出しが入っています（v0.23.0 から）。`basisDate` は記事の「令和8年4月1日現在法令等」を `YYYY-MM-DD` にしたもので、取得日ではありません。2 件目以降は score がほぼ同じ（0.25 前後）なので、DB を取り込み直すと順が入れ替わることがあります。v0.25.1 で入れ直す前の DB では、2 件目は No.1128（医療費控除の対象となる歯の治療費の具体例、score 0.2495）でした。v0.25.1 から本文に小見出し（h3）の文字列が `【<小見出し>】` として入り、記事の本文の長さが変わって score が少し動いたためです。小見出しの語（例: `消費税の負担者`）でも記事が当たるようになりました。

`freshness` は、国税庁の索引にある記事だけの取得日時の範囲です（v0.24.1 から）。索引から消えた記事（`orphaned_at` が付いた行）は投入で取り直されないので、範囲から外しています。この DB では No.2882 が 2026-10-04 に索引から消え、2026-09-07 の取得日時のまま残っていますが、`oldest_fetched_at` はその日時にならず、`staleness` は `fresh` です。v0.24.0 までは、この記事の日時が `oldest_fetched_at` になり、投入をやり直しても `stale` のままでした（[houki-nta-mcp#139](https://github.com/shuji-bonji/houki-nta-mcp/issues/139)）。`freshness.db_path` は引いた DB のパスで、ホームディレクトリの部分は `~` に置き換えてあります（v0.25.0 から）。`legal_status.binds_tax_office` も `false` で、通達と違い税務職員も拘束しない参考資料です。
:::

## nta_get_tax_answer

国税庁のタックスアンサー（よくある税の質問）本文を番号で取得する。国税庁の索引で番号から記事の URL を決める。8xxx（災害）も取れる。例: 6101 → 消費税の基本的なしくみ。国税庁の索引に番号が無いとき、または国税庁サイトにそのページが無いときはエラー DOC_NOT_FOUND を返し、nta_search_tax_answer を案内する

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `no` | string (minLength 1) | **必須** |  | タックスアンサー番号。4 桁の数字（全角の数字は半角に揃えて読む）。国税庁の索引で番号から記事の URL を決める。8xxx（災害）も取れる。例: "6101", "1120", "8001" |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: tip 引数名は `no` です
`id` ではありません。記事の URL は国税庁の索引で番号から決めます（v0.24.0 から。それまでは番号の先頭の桁で税目のフォルダーを決めていました）。8xxx（災害）の記事も取れます。索引に無い番号は、記事を取りに行かずに `DOC_NOT_FOUND` を返します。
:::

::: details 呼び出し例 — 「No.6101 消費税の基本的なしくみ」
- 実測: v0.25.1（2026-10-05）
- ローカル DB: 不要。ただし DB に構造があればそこから返る（この例は `--bulk-download-tax-answer --refresh` で入れ直した DB から返した `source: "db"`）

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
    "effectiveDate": "令和8年4月1日現在法令等",
    "basisDate": "2026-04-01",
    "taxCategory": "消費税",
    "sections": [
      { "heading": "概要", "paragraphs": ["消費税は、特定の物品やサービスに課税する個別消費税（酒税・たばこ税等）とは異なり、消費一般に広く公平に課税する間接税です。…", "…"], "level": 2 },
      { "heading": "消費税の負担者", "paragraphs": ["消費税は、事業者に負担を求めるものではありません。…"], "level": 3 },
      { "heading": "課税のしくみ", "paragraphs": ["…", "令和5年10月1日から開始した「適格請求書等保存方式（インボイス制度）」では、…", "…"], "level": 3 },
      { "heading": "申告・納付", "paragraphs": ["…"], "level": 3 },
      { "heading": "納税事務の負担軽減措置等", "paragraphs": ["…", "1 事業者免税点制度", "…", "3 2割特例・3割特例（経過措置）", "…"], "level": 3 },
      { "heading": "根拠法令等", "paragraphs": ["消費税法など"], "level": 2 },
      { "heading": "関連リンク", "paragraphs": ["…"], "level": 2 }
    ],
    "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6101.htm",
    "fetchedAt": "2026-10-05T05:45:26.899Z"
  },
  "source": "db",
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`sections` はページの見出し（h2）と小見出し（h3）ごとの節で、ページの順に 1 つの配列に並びます。`level` は見出しの段で、h2 の節が `2`、h3 の節が `3` です（v0.25.1 から）。h3 の節がどの見出しの下にあるかは、その前にある最も近い `level: 2` の節で分かります。この例では「消費税の負担者」から「納税事務の負担軽減措置等」までの 4 つが「概要」の下の小見出しです。`format` を省いた markdown の応答では、h2 の節を `## `、h3 の節を `### ` で書きます。

v0.25.0 までは小見出しの文字列が落ち、その段落が上の見出しの節に続けて入っていました。この記事では `sections` が「概要」（26 段落）・「根拠法令等」・「関連リンク」の 3 つでした（[houki-nta-mcp#147](https://github.com/shuji-bonji/houki-nta-mcp/issues/147)）。v0.25.0 以前に取り込んだ DB の行は、`--bulk-download-tax-answer --refresh` で入れ直すまで以前の分け方のまま返り、`level` はすべて `2` になります。

`effectiveDate` は国税庁がページに書いている「何年何月何日現在の法令等に基づくか」で、取得日ではありません。同じ日付を `YYYY-MM-DD` にしたものが `basisDate` です。`index_status`・`orphaned_at`・`notice` は国税庁の索引から記事が消えたときに値が入り、この例では `null` です。「根拠法令等」の節に法令名が入るので、そこから houki-egov-mcp の `get_law` につなげられます。

`source` はローカル DB（`"db"`）と国税庁サイト（`"live"`）のどちらから返したかです（v0.16.0 から）。DB に無い記事は国税庁サイトから取り（`"live"`、`fetchedAt` は取得した時刻）、その結果を DB に書き戻すので、同じ番号の 2 回目からは `"db"` になり `fetchedAt` は 1 回目の値のまま変わりません。この例の `fetchedAt` は `--bulk-download-tax-answer` で取り込んだ日時です。**`"db"` の `fetchedAt` は呼び出した時刻ではなく、DB に取り込んだ日時です。** 引用するときはその値をそのまま書きます。

v0.15.0 までは DB を引かずに毎回国税庁サイトから取得していたため、`fetchedAt` は常に呼び出し時刻でした（[houki-nta-mcp #29](https://github.com/shuji-bonji/houki-nta-mcp/issues/29)）。
:::

::: details 呼び出し例 — 「No.1222 耐震改修工事をした場合（住宅耐震改修特別控除）」（見出しの直後に小見出しが続く記事）
- 実測: v0.25.1（2026-10-05）
- ローカル DB: 不要（この例は `--bulk-download-tax-answer --refresh` で入れ直した DB から返した `source: "db"`）

**引数**

```jsonc
{ "no": "1222", "format": "json" }
```

**返る JSON の `taxAnswer.sections`（見出しと `level` と段落の数）**

```jsonc
[
  { "heading": "概要", "level": 2 /* 段落 4 */ },
  { "heading": "対象者または対象物", "paragraphs": [], "level": 2 },
  { "heading": "対象者", "level": 3 /* 段落 1 */ },
  { "heading": "控除の適用を受けるための要件", "level": 3 /* 段落 2 */ },
  { "heading": "計算方法・計算式", "paragraphs": [], "level": 2 },
  { "heading": "住宅耐震改修特別控除の控除額の計算方法", "level": 3 /* 段落 26 */ },
  { "heading": "手続き", "paragraphs": [], "level": 2 },
  { "heading": "申告等の方法", "level": 3 /* 段落 2 */ },
  { "heading": "申告先等", "level": 3 /* 段落 1 */ },
  { "heading": "提出書類等", "level": 2 /* 段落 4 */ },
  { "heading": "根拠法令等", "level": 2 /* 段落 1 */ },
  { "heading": "関連リンク", "level": 2 /* 段落 8 */ }
]
```

**`format` を省いた markdown の応答（見出しの行の部分）**

```markdown
## 対象者または対象物

### 対象者

マイホームについて住宅耐震改修を行った方

### 控除の適用を受けるための要件

…

## 計算方法・計算式

### 住宅耐震改修特別控除の控除額の計算方法

…

## 手続き

### 申告等の方法

…

### 申告先等

所轄税務署
```

見出し（h2）の直後に段落が無く、すぐ小見出し（h3）が続くときは、その見出しの節を `paragraphs: []` で返します。「手続き」のような見出しの文字列を残すためで、markdown では `## 手続き` の行だけになります。段落が空になるのはこの場合だけです。

`申告先等` が何についての話かは、その前にある最も近い `level: 2` の節（「手続き」）で分かります。v0.25.0 では、この記事の `sections` は 7 つで、小見出しの文字列はどこにも入らず、「手続き」の節に「申告等の方法」と「申告先等」の段落が続けて入っていました。
:::

## nta_search_kaisei_tsutatsu

改正通達（一部改正通達）を FTS5 でキーワード検索する。事前に `--bulk-download-kaisei` で DB 投入が必要。この種別の文書が DB に 1 件も無いときはエラー DOC_NOT_FOUND を返す（キーワードに合わないだけの 0 件は results: [] で返す）。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string (minLength 1) | **必須** |  | 検索キーワード。例: "電子帳簿", "インボイス", "軽減税率"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `taxonomy` | string | 任意 |  | 税目フォルダで絞り込み。例: "shohi" / "shotoku" / "hojin" / "sisan/sozoku"。値は列挙で検査しない。DB に無い値のときは available_taxonomies で正しい値を返す |
| `limit` | integer (1–50) | 任意 | `10` | 取得件数。1 以上 50 以下の整数（デフォルト: 10）。範囲の外は丸めずに INVALID_ARGUMENT |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。改正通達は新旧対照表 PDF を持つことが多く、改正点だけ知りたい時は true 推奨 |

::: tip 改正点だけ知りたいときは `hasPdf: true`
改正通達の本文は「別紙のとおり改める」という短い文で、実際の差分は新旧対照表の PDF にあります。`hasPdf: true` で PDF 付きの文書に絞り、`docId` を `nta_inspect_pdf_meta` に渡すと PDF の一覧と読み方の例が返ります。
:::

::: details 呼び出し例 — 「インボイス関係の改正通達を新旧対照表付きで」
- 実測: v0.25.0（2026-10-05）
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
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
      "snippet": " …  殿\n国税庁長官 （官印省略）\n<b>消費税法</b>基本通達（平成7年12月25日付 … ",
      "score": 0.250,
      "scoreReasons": ["doc_type=kaisei weight 0.95", "abbreviation expanded: インボイス → 消費税法"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "kaisei",
      "docId": "191001",
      "taxonomy": "shohi",
      "title": "消費税法基本通達の一部改正について（法令解釈通達）",
      "issuedAt": "2019-10-01",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/191001/index.htm",
      "score": 0.248 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:24:14.576Z",
    "newest_fetched_at": "2026-10-04T03:26:38.132Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "search_notes": [
    "\"インボイス\" を含む文書は見つかりませんでした。略称辞書で \"インボイス\" は 消費税法 の通称として登録されているため、\"消費税法\" を含む文書に広げて検索しました。\"消費税法\" という語が出てくるだけの文書も含まれます"
  ],
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

「インボイス」という語を含む改正通達は無いので、略称辞書で通称として登録されている「消費税法」に広げて検索しています。そのことは `search_notes` と `scoreReasons` の `abbreviation expanded` に出ます。`basisDate`・`index_status`・`orphaned_at` は、改正通達では `null` です（索引から消えた文書では `orphaned_at` に日時が入ります）。

`docId` には新形式（`0025004-026`）と旧形式（`191001`）が混在します。どちらもそのまま `nta_get_kaisei_tsutatsu` に渡せます。
:::

## nta_get_kaisei_tsutatsu

改正通達の本文を docId で取得する（DB 経由）。本文 + 添付 PDF URL（pdf-reader-mcp で読み取り推奨）を返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docId` | string (minLength 1) | **必須** |  | 文書 ID。英小文字・数字・- だけの値（例: "0026003-067"、"240401"）。全角の数字・ハイフンは半角に揃えて読む。`nta_search_kaisei_tsutatsu` 結果や DB hint で取得 |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「令和 7 年 4 月 1 日の消基通改正の本文と添付 PDF」
- 実測: v0.25.0（2026-10-05）
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
    "fetchedAt": "2026-10-04T03:24:16.836Z",
    "fullText": "課消2-4 課総11-10 … 令和7年4月1日\n…\n記\n1 消費税法基本通達について、別紙1「消費税法基本通達新旧対照表」の「改正前」欄に掲げる部分を「改正後」欄に掲げる部分のとおり改めることとし、令和7年4月1日から適用する。\n2 … 別紙2 … 令和8年11月1日から適用する。\n…",
    "attachedPdfs": [
      { "title": "別紙1（PDF/221KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf", "sizeKb": 221, "kind": "comparison" },
      { "title": "別紙2（PDF/449KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf", "sizeKb": 449, "kind": "comparison" },
      { "title": "【参考】令和８年11月１日から適用される「消費税法基本通達（第８章）」の構成及び新旧対応表（令和７年４月１日）（PDF/399KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf", "sizeKb": 399, "kind": "comparison" }
    ],
    "orphanedAt": null
  },
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "source": "db"
}
```

本文は「別紙のとおり改める」までで、改正の中身は `attachedPdfs` の新旧対照表にあります。3 件とも `kind: "comparison"`（新旧対照表）です。PDF の読み方は `nta_inspect_pdf_meta` が返す `attachedPdfs[].read_strategy` / `layout_note` と `next_actions` を参照してください（`save: true` で保存すれば pdf-reader-mcp の `extract_tables` で表として取れます）。この例では別紙 1 が令和 7 年 4 月 1 日から、別紙 2 が令和 8 年 11 月 1 日から適用と、適用日が 2 つに分かれています。
:::

::: details 呼び出し例 — 「docId を打ち間違えたとき」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（改正通達 118 件）

**引数**

```jsonc
{ "docId": "0025004-999" }
```

**返る JSON**（`isError: true`）

```jsonc
{
  "error": "改正通達 docId=\"0025004-999\" は見つかりません",
  "code": "DOC_NOT_FOUND",
  "hint": "DB の改正通達 118 件に、この docId はありません。available_doc_ids（新しい順に 30 件）から選ぶか、nta_search_kaisei_tsutatsu で検索して docId を確かめてください。DB を投入した後に国税庁が公開した文書は、`npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-kaisei` をもう一度実行すると取り込めます",
  "next_actions": [
    { "action": "nta_search_kaisei_tsutatsu", "reason": "キーワード検索で正しい docId を探せます" }
  ],
  "available_doc_ids": [
    { "docId": "260807", "title": "法人税基本通達等の一部改正について（法令解釈通達）", "issuedAt": "2026-08-07" },
    { "docId": "2606xx", "title": "法人税基本通達等の一部改正について（法令解釈通達）", "issuedAt": "2026-06-30" },
    { "docId": "2606", "title": "「所得税基本通達の制定について」の一部改正について（法令解釈通達）", "issuedAt": "2026-06-30" },
    // … 新しい順に 30 件。15 件目が { "docId": "0025004-026", …, "issuedAt": "2025-04-01" }
  ],
  "tool": "nta_get_kaisei_tsutatsu"
}
```

`available_doc_ids` には題名と発出日が入るので、探していた改正（この例では令和 7 年 4 月 1 日の消基通改正）を選び直せます。

改正通達が DB に 1 件も入っていないときも `code` は同じ `DOC_NOT_FOUND` ですが、中身が変わります。`error` が「ローカル DB に改正通達が 1 件も無いため、docId=… を取得できません」になり、`next_actions[0].action` が `cli_bulk_download`（`example.command` は `npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-kaisei`）になり、`available_doc_ids` は付きません。`next_actions[0].action` を見れば、投入が必要なのか docId が誤っているのかを区別できます（v0.14.1 から）。`hint` は DB の状態ごとに先頭の文が変わり、どれも開こうとした DB のパス（ホームは `~`）を含みます（v0.25.0 から）。DB のファイルが無いときは「ローカル DB（~/.cache/houki-nta-mcp/cache.db）がありません。…」、改正通達だけが無いときは「ローカル DB（~/.cache/houki-nta-mcp/cache.db）に改正通達（doc_type="kaisei"）が入っていません。…」で始まり、後者には投入したシェルで `--status` を実行して DB が同じか確かめる手順が続きます。

`nta_get_jimu_unei` と `nta_get_bunshokaitou` も同じ形（`code: "DOC_NOT_FOUND"`）で返します。v0.21.3 までの改正通達の `code` は `TSUTATSU_NOT_FOUND` でした。

`docId` に英小文字・数字・`-` 以外の文字が入っているときは、DB を引く前に `INVALID_ARGUMENT` になります。`DOC_NOT_FOUND` は、形は合っているが DB にその文書が無いときだけです。
:::

## nta_search_jimu_unei

事務運営指針（jimu-unei）を FTS5 でキーワード検索する。事前に `--bulk-download-jimu-unei` で DB 投入が必要。この種別の文書が DB に 1 件も無いときはエラー DOC_NOT_FOUND を返す（キーワードに合わないだけの 0 件は results: [] で返す）。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string (minLength 1) | **必須** |  | 検索キーワード。例: "書面添付", "重加算税"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `taxonomy` | string | 任意 |  | 税目で絞り込み。例: "shotoku" / "hojin" / "sozoku" / "shohi"。値は列挙で検査しない。DB に無い値のときは available_taxonomies で正しい値を返す |
| `limit` | integer (1–50) | 任意 | `10` | 取得件数。1 以上 50 以下の整数（デフォルト: 10）。範囲の外は丸めずに INVALID_ARGUMENT |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。別紙・別表 PDF を伴う指針だけを抽出したい時に true を指定 |

::: details 呼び出し例 — 「書面添付制度の事務運営指針」
- 実測: v0.25.0（2026-10-05）
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
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/hojin/090401-2/01.htm",
      "snippet": " … の一部改正に伴う調査課における新<b>書面添付</b>制度の運用に当たっての基本的な考 … ",
      "score": 0.463,
      "scoreReasons": ["doc_type=jimu-unei weight 0.85"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "jimu-unei",
      "docId": "shotoku/shinkoku/090401",
      "taxonomy": "shotoku",
      "title": "個人課税部門における書面添付制度の運用に当たっての基本的な考え方及び事務手続等について(事務運営指針)",
      "issuedAt": "2009-04-01",
      "sourceUrl": "https://www.nta.go.jp/law/jimu-unei/shotoku/shinkoku/090401/01.htm",
      "score": 0.446 /* … */
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:26:38.243Z",
    "newest_fetched_at": "2026-10-04T03:27:13.440Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達・事務運営指針は行政内部文書であり、納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`docId` は `税目/日付` の形（`hojin/090401-2`）か `税目/…/日付` の形（`shotoku/shinkoku/090401`）で、そのまま `nta_get_jimu_unei` に渡します。書面添付制度の事務運営指針は部門ごとに 5 件あり（調査課・個人課税・酒税・法人課税・資産税）、2 件目以降は score がほぼ同じ（0.446〜0.441）なので、DB を取り込み直すと順が入れ替わることがあります。事務運営指針は通達と同じく税務職員を拘束し、国民は拘束しません（`binds_tax_office: true`）。
:::

## nta_get_jimu_unei

事務運営指針の本文を docId で取得する（DB 経由）。本文 + 添付 PDF URL（pdf-reader-mcp で読み取り推奨）を返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docId` | string (minLength 1) | **必須** |  | 文書 ID。税目/…/フォルダー名 の形（例: "shotoku/shinkoku/170331" / "sozoku/170111_1"）。全角の数字・ハイフンは半角に揃えて読む。`nta_search_jimu_unei` 結果や DB hint で取得 |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: details 呼び出し例 — 「酒税の書面添付制度の事務運営指針」
- 実測: v0.25.0（2026-10-05）
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
    "fetchedAt": "2026-10-04T03:26:50.715Z",
    "fullText": "課酒6-3 課総2-8 官総-38 平成21年4月1日 改正 平成22年6月11日 改正 平成24年12月19日 改正 令和6年3月27日 改正 令和8年9月17日\n各国税局長 殿 沖縄国税事務所長 殿\n国税庁長官\n標題のことについては、下記のとおり定めたから、平成21年7月10日以降、これにより適切な運営を図られたい。…\n（趣旨） 書面添付制度（税理士法（昭和26年法律第237号。以下「法」という。）の平成13年度改正により、…\n記\n…\n【第1章 書面添付制度の運用に当たっての基本的な考え方】\n【1 制度の適正・円滑な運用及び普及・定着の推進】\n…\n【第2章 書面添付制度に係る事務手続及び留意事項】\n【1 意見聴取の実施】\n…\n【5 更正前の意見聴取】",
    "attachedPdfs": [
      { "title": "別紙1(PDF/87KB)", "url": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/pdf/01.pdf", "sizeKb": 87, "kind": "attachment" },
      { "title": "別紙2(PDF/69KB)", "url": "https://www.nta.go.jp/law/jimu-unei/shozei/090401/pdf/02.pdf", "sizeKb": 69, "kind": "attachment" }
    ],
    "orphanedAt": null
  },
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達・事務運営指針は行政内部文書であり、納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "source": "db"
}
```

`fullText` の 1 行目に文書番号と改正日が並びます。この例では平成 21 年に定め、令和 8 年 9 月 17 日まで 4 回改正されています（2026-10-04 の取り込みで、令和 8 年 9 月 17 日の改正が加わりました）。`issuedAt` は制定日で、最終改正日ではありません。最終改正がいつかは 1 行目から読んでください。

末尾の `【…】` は章・節の見出しです。様式（応接簿など）は `attachedPdfs` にあり、どれも `kind: "attachment"`（別紙・別表）です。`nta_inspect_pdf_meta` に `docType: "jimu-unei"` を指定すると、PDF ごとの読み方（`read_strategy` / `layout_note`）と pdf-reader-mcp の呼び出し例（`next_actions`）が返ります。
:::

## nta_search_bunshokaitou

文書回答事例（bunshokaitou）を FTS5 でキーワード検索する。事前に `--bulk-download-bunshokaitou` で DB 投入が必要。この種別の文書が DB に 1 件も無いときはエラー DOC_NOT_FOUND を返す（キーワードに合わないだけの 0 件は results: [] で返す）。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `keyword` | string (minLength 1) | **必須** |  | 検索キーワード。例: "電子帳簿", "適格請求書", "災害損失"。3 文字以上の語を推奨（FTS5 trigram のため）。2 文字の語は本文の部分一致で補完し、その旨を応答の search_notes に示す |
| `taxonomy` | string | 任意 |  | 税目で絞り込み。"shotoku" / "hojin" / "sozoku" / "gensen" / "joto-sanrin" / "shohi" 等（URL の税目フォルダ名）。国税局のページの別表記（"souzoku" / "gensenshotoku" / "joto_sanrin"）は、同じ税目としてまとめて検索する。値は列挙で検査しない。DB に無い値のときは available_taxonomies で正しい値を返す |
| `limit` | integer (1–50) | 任意 | `10` | 取得件数。1 以上 50 以下の整数（デフォルト: 10）。範囲の外は丸めずに INVALID_ARGUMENT |
| `hasPdf` | boolean | 任意 |  | 添付 PDF の有無で絞り込む（true=PDF 付き / false=PDF 無し / 未指定=絞らない）。回答書本文 PDF を持つ事例だけを抽出したい時に true を指定 |

::: tip 本文で検索できます（v0.10.3 以降）
v0.10.2 以前は表と別紙を取り込んでいなかったため、題名の語でしか当たりませんでした。いまは回答内容・関係する法令条項等・別紙の照会文まで検索の対象です。v0.10.2 以前に作った DB を使っている場合は `npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-bunshokaitou --refresh` で再投入してください。
:::

::: details 呼び出し例 — 「産科医療の給付金に関する文書回答事例」
- 実測: v0.25.0（2026-10-05）
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
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/081102/index.htm",
      "snippet": " … 施行令第30条\n添付書類: ・ <b>産科医療</b>補償制度標準補償約款 ・ <b>産科医療</b> … ",
      "score": 0.518,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"],
      "index_status": null,
      "orphaned_at": null
    },
    {
      "docType": "bunshokaitou",
      "docId": "shotoku/250416",
      "taxonomy": "shotoku",
      "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
      "issuedAt": "2025-04-07",
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm",
      "snippet": " … 法施行令第30条\n添付書類: ・<b>産科医療</b>特別給付事業 実施要綱\n〔回答〕 … ",
      "score": 0.490,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"],
      "index_status": null,
      "orphaned_at": null
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-10-04T03:27:23.963Z",
    "newest_fetched_at": "2026-10-04T03:37:07.872Z",
    "staleness": "fresh",
    "days_since_oldest": 0,
    "db_path": "~/.cache/houki-nta-mcp/cache.db"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "文書回答事例は照会者・国税庁双方の合意に基づく個別事案回答であり、一般的な法的拘束力はない。同じ事案で同様の判断を期待することは可能だが、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`snippet` が添付書類の行から取れていることから、題名ではなく表の中身に当たっているのが分かります。`docId` をそのまま `nta_get_bunshokaitou` に渡せます。`basisDate`（文書の基準日）は文書回答事例には無いので `null` です。`index_status`・`orphaned_at` は、国税庁の索引から文書が消えたときに値が入ります。
:::

::: details 呼び出し例 — 別紙の本文にしかない語で引く
- 実測: v0.25.0（2026-10-05）

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
      "basisDate": null,
      "sourceUrl": "https://www.nta.go.jp/about/organization/tokyo/bunshokaito/shohi/251017/index.htm",
      "snippet": " … を発射する機能を有する施設）より<b>宇宙空間</b>における所定の軌道に投入するまで … ",
      "score": 0.536,
      "scoreReasons": ["doc_type=bunshokaitou weight 0.90"],
      "index_status": null,
      "orphaned_at": null
    }
  ]
  // freshness / legal_status は上の例と同じ
}
```

キーワードに合う文書が無いときは、`results: []` と、検索した件数を書いた `hint`（例: 「該当なし。DB の文書回答事例（taxonomy="inshi"）6 件に「配当」に合う文書はありません」）が返ります（v0.13.0 から）。`taxonomy` に DB に無い税目を指定したときは、`available_taxonomies` に DB にある税目の一覧が入ります。文書回答事例が DB に 1 件も無いときは、エラー `DOC_NOT_FOUND` が返ります。
:::

::: details 呼び出し例 — 税目の別表記をまとめて検索する（`taxonomy: "sozoku"`）
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（`staleness: "fresh"`）

**引数**

```jsonc
{ "keyword": "小規模宅地等", "taxonomy": "sozoku", "limit": 5 }
```

**返る JSON**（抜粋）

```jsonc
{
  "keyword": "小規模宅地等",
  "results": [
    { "docId": "tokyo/souzoku/181207", "taxonomy": "souzoku", "title": "老人ホームに入居中に自宅を相続した場合の小規模宅地等についての相続税の課税価格の計算の特例（租税特別措置法第69条の4）の適用について", "issuedAt": "2018-12-07" },
    { "docId": "tokyo/souzoku/211224", "taxonomy": "souzoku", "title": "市街地再開発事業により中断した貸付事業を相続開始前3年以内に再開した場合の小規模宅地等についての相続税の課税価格の計算の特例（租税特別措置法第69条の4）の適用について", "issuedAt": "2021-11-26" },
    { "docId": "kantoshinetsu/sozoku/160822", "taxonomy": "sozoku", "title": "庭先部分を相続した場合の小規模宅地等についての相続税の課税価格の計算の特例（租税特別措置法第69条の4）の適用について", "issuedAt": "2016-08-22" }
    // docType / basisDate / sourceUrl / snippet / score / scoreReasons / index_status / orphaned_at は省略
  ],
  "search_notes": [
    "taxonomy=\"sozoku\" は、同じ税目の別表記 \"souzoku\" の文書もまとめて検索しました（国税局のページは本庁と違う税目フォルダ名を使うことがあるため）"
  ]
  // freshness は絞った税目の範囲（oldest 2026-10-04T03:31:32.294Z、fresh）。legal_status は上の例と同じ
}
```

国税局のページは本庁と違う税目フォルダ名を使うことがあり（東京局の `souzoku` など）、v0.13.0 までは `taxonomy: "sozoku"` で東京局の文書が出ませんでした。v0.14.0 からは、`sozoku` と `souzoku`、`gensen` と `gensenshotoku`、`joto-sanrin` と `joto_sanrin` をまとめて検索します。
:::

## nta_get_bunshokaitou

文書回答事例の本文を docId で取得する（DB 経由）。本庁系は "shotoku/250416"、国税局系は "tokyo/shotoku/260218" のような形式。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docId` | string (minLength 1) | **必須** |  | 文書 ID。税目/フォルダー名（本庁。例: "shotoku/250416"）か 局/税目/フォルダー名（国税局。例: "tokyo/shotoku/260218"）。全角の数字・ハイフンは半角に揃えて読む |
| `format` | `"markdown"` \| `"json"` | 任意 | `"markdown"` | 出力形式 |

::: tip 本文は「表 + 別紙」でできています
文書回答事例のページは、照会者・関係する法令条項等・回答年月日・回答者・回答内容が表に入り、照会の趣旨・事実関係・理由は「別紙」（別ページ）にあります。v0.10.3 / v0.10.4 から、表の各行を「見出し: 値」の形で取り込み、別紙を `【別紙】` として本文の末尾に連結します。v0.10.2 以前に作った DB には本文が入っていないので、`npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-bunshokaitou --refresh` で再投入してください。
:::

::: details 呼び出し例 — 「産科医療特別給付事業の給付金は非課税か」（本庁系）
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり（この文書の `fetchedAt` は 2026-10-04 の取り込み）

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
    "fetchedAt": "2026-10-04T03:27:25.095Z",
    "fullText": "取引等に係る税務上の取扱い等に関する照会（同業者団体等用）\n〔照会〕\n照会者 （フリガナ） 団体の名称: （コウセイロウドウショウ） 厚生労働省\n…\n関係する法令条項等: 所得税法第9条第1項18号、所得税法施行令第30条\n添付書類: ・産科医療特別給付事業 実施要綱\n〔回答〕\n回答年月日: 令和7年4月7日\n回答者: 国税庁課税部審理室長\n回答内容: 標題のことについては、ご照会に係る事実関係を前提とする限り、貴見のとおりで差し支えありません。 ただし、次のことを申し添えます。 (1) この文書回答は、…個々の納税者が行う具体的な取引等に適用する場合においては、この回答内容と異なる課税関係が生ずることがあります。 (2) この回答内容は国税庁としての見解であり、個々の納税者の申告内容等を拘束するものではありません。\n【別紙】\n別紙\n医政地発0331第4号 令和7年3月31日\n国税庁 課税部審理室長 殿\n厚生労働省医政局地域医療計画課長\n産科医療補償制度（以下「本体制度」といいます。）は、…\n記\n【1 本件事業の概要】\n【(1) 本件事業の給付対象】\n…\n【2 本件給付対象者に支払われる本件給付金が非課税所得として取り扱われる理由】\n…\n以上",
    "attachedPdfs": [],
    "orphanedAt": null
  },
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
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

`index_status`・`orphaned_at`・`notice`（と `document.orphanedAt`）は、国税庁の索引からこの文書が消えたときに値が入ります。この例では索引に載っているので、どれも `null` です。

引用するときは `sourceUrl` と `issuedAt`（回答年月日）を添え、`legal_status` のとおり「照会者以外を拘束しない個別事案の回答」であることを残してください。
:::

::: details 呼び出し例 — 国税局系（`tokyo/shohi/251017`）
- 実測: v0.25.0（2026-10-05）
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
    "docType": "bunshokaitou",
    "docId": "tokyo/shohi/251017",
    "taxonomy": "shohi",
    "title": "人工衛星打上げ輸送サービスに係る消費税の取扱いについて",
    "issuedAt": "2025-10-17",
    "issuer": "東京国税局",
    "sourceUrl": "https://www.nta.go.jp/about/organization/tokyo/bunshokaito/shohi/251017/index.htm",
    "fetchedAt": "2026-10-04T03:35:35.116Z",
    "fullText": "【取引等に係る税務上の取扱い等に関する事前照会】\n〔照会〕\n…\n関係する法令条項等: 消費税法第4条、第7条 消費税法施行令第6条 消費税法施行規則第5条 消費税法基本通達5-7-13\n〔回答〕\n回答年月日 令和7年10月17日 回答者 東京国税局審理課長\n回答内容: 標題のことについては、ご照会に係る事実関係を前提とする限り、貴見のとおりで差し支えありません。…\n【別紙】\n【1 事前照会の趣旨】\n当社は、人工衛星を所有する顧客より発注を受け、ロケットによる人工衛星打上げ輸送サービス…\n【2 事前照会に係る取引等の事実関係】\n(1) 本件サービスについて …\nイ ロケットの準備 人工衛星の打上げが可能なロケットを調達する。\n…\n【3 上記2の事実関係に対して事前照会者の求める見解となることの理由】\n…\nロ 宇宙空間は「国内以外の地域」に該当するか …宇宙空間は、消費税法における「国内」に該当せず、「国内以外の地域」に該当するものと考えます。\n…\n以上",
    "attachedPdfs": [],
    "orphanedAt": null
  },
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
  // legal_status は上の例と同じ
  "source": "db"
}
```

別紙の箇条書き（`イ` `ロ` `ハ` や `(1)` `(2)`）は、階層をたたんで 1 行ずつの段落として入ります。この文書では本文が約 7,000 文字あり、その大半が別紙です。
:::

## nta_inspect_pdf_meta

指定した文書の添付 PDF の一覧を返す。本文は読まない。各 PDF に kind（comparison=新旧対照表 / attachment=別紙・別表 / qa-pdf / related / notice / unknown）と、読み方（read_strategy: tables=表として取る / text=本文として読む / sample=先頭を見て決める、layout_note: 紙面の組み方）を付ける。save: true のときだけ PDF をサーバー側の保存先（既定は XDG_CACHE_HOME か ~/.cache の下の houki-nta-mcp/files/。環境変数 HOUKI_NTA_FILES_DIR で変更）に取得し、saved[] に絶対パスを返す。next_actions に pdf-reader-mcp の呼び出し例（保存済みなら extract_tables / read_text に file_path、未保存なら read_url に url）と、他の PDF 読み取りツール向けの汎用の 1 件を置く。読み手は固定しない。`nta_get_*` で全文を取得すると重い場合や、PDF だけを確認したい時に使う。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `docType` | `"kaisei"` \| `"jimu-unei"` \| `"bunshokaitou"` \| `"tax-answer"` | **必須** |  | 文書種別。改正通達 (kaisei) / 事務運営指針 (jimu-unei) / 文書回答事例 (bunshokaitou) / タックスアンサー (tax-answer)。質疑応答事例 (qa-jirei) は PDF を持たないため対象外 |
| `docId` | string (minLength 1) | **必須** |  | 文書 ID。各 docType の `nta_search_*` 結果や `nta_get_*` のレスポンスから得られる。全角の数字・ハイフンは半角に揃えて読む |
| `kind` | `"comparison"` \| `"attachment"` \| `"qa-pdf"` \| `"related"` \| `"notice"` \| `"unknown"` | 任意 |  | この種別の PDF だけを返す。改正点だけ見たいときは comparison。改正通達（kaisei）でタイトルが「別紙 N」だけの PDF は新旧対照表本体のことが多いので comparison として返す。省略すると全件 |
| `save` | boolean | 任意 |  | true のとき、返す PDF をサーバー側の保存先に取得し、saved[] に絶対パスを返す。pdf-reader-mcp の extract_tables / read_text はローカルファイルしか読まないので、表として取るときに使う。既に保存済みなら再取得しない（saved[].cached が true）。既定 false |

::: details 呼び出し例 — 「改正通達 0025004-026 の PDF は、どれをどう読めばよいか」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり

**引数**

```jsonc
{ "docType": "kaisei", "docId": "0025004-026" }
```

**返る JSON**（`layout_note` は先頭の 1 件だけ載せ、他は `…` で省略。3 件とも同じ文）

```jsonc
{
  "docType": "kaisei",
  "docId": "0025004-026",
  "title": "消費税法基本通達の一部改正について（法令解釈通達）",
  "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/index.htm",
  "attachedPdfs": [
    {
      "title": "別紙1（PDF/221KB）",
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf",
      "sizeKb": 221,
      "kind": "comparison",
      "read_strategy": "tables",
      "layout_note": "改正後と改正前を左右 2 列に並べた表。国税庁の新旧対照表は左が改正後、右が改正前のことが多いが、見出し行で確かめる。変更箇所には下線が引かれる。改正前の側の「（同左）」は改正後と同じ文、両側の「（省略）」は改正に関係しない部分の省略。新設・削除の印は丸括弧「（新設）」「（削除）」のものと、墨付き括弧「【新設】」「【削除】」「【一部改正】」（改正前にもある項で内容が変わったもの）のものの 2 通りがある。どちらも新設の印は改正前の側、削除の印は改正後の側に置かれる。改正通達の「別紙 N」は本文の新旧対照表、「【参考】…対応表」は章の構成（通達番号）の対応表のことがある。表として取れるなら表で、取れないなら左右 2 列に分けて読む（1 列として読むと改正後と改正前の文が混ざる）"
    },
    { "title": "別紙2（PDF/449KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf", "sizeKb": 449, "kind": "comparison", "read_strategy": "tables", "layout_note": "…" },
    { "title": "【参考】… 新旧対応表 …（PDF/399KB）", "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf", "sizeKb": 399, "kind": "comparison", "read_strategy": "tables", "layout_note": "…" }
  ],
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
  "next_actions": [
    {
      "action": "pdf-reader-mcp:read_url",
      "reason": "新旧対照表を URL のまま本文として読む。左右の列が混ざらないよう split_columns: 2 を付ける。表として取るには、この tool を save: true で呼び直して saved[].path を extract_tables に渡す",
      "example": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf", "split_columns": 2 }
    },
    {
      "action": "read_pdf",
      "reason": "pdf-reader-mcp が無いときは、使っている PDF 読み取りツールに url（save: true で保存したときは path）を渡す。読み方は attachedPdfs[].read_strategy と layout_note のとおり",
      "example": { "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf" }
    }
  ],
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`attachedPdfs[].kind` は PDF のタイトルから分類したもので、`read_strategy` と `layout_note` はその kind に応じた読み方です。道具の名前を含まないので、pdf-reader-mcp 以外の PDF 読み取りツールでもそのまま使えます。`next_actions` は kind ごとに 1 件（同じ kind が複数あれば先頭の PDF）と、最後に pdf-reader-mcp が無い環境向けの `read_pdf` が付きます。`save` を付けていないので、pdf-reader-mcp 向けの例は URL のまま読む `read_url` です。本文は含まないので、全文が要るときは `nta_get_kaisei_tsutatsu` を使います。`index_status`・`orphaned_at`・`notice` は `nta_get_kaisei_tsutatsu` と同じ索引の印で、文書が国税庁の索引に載っている間は `null` です。

「別紙1」「別紙2」は本文の新旧対照表で、「【参考】… 新旧対応表」は第 8 章の通達番号の対応表です。v0.20.0 から、改正通達（kaisei）でタイトルが「別紙」と番号だけの PDF は `comparison` として返します（[houki-nta-mcp#44](https://github.com/shuji-bonji/houki-nta-mcp/issues/44)）。v0.19.0 では別紙 1・2 が `attachment` になり、`kind: "comparison"` で絞ると参考の対応表だけが返っていました。DB の中身は変えていないので、再投入は要りません。

v0.18.3 までは `next_actions` の代わりに `reader_hints` が付いていました。その `examples[].args` は `{ "url": … }` で `extract_tables` を指していましたが、pdf-reader-mcp の `extract_tables` は `file_path` しか受け取らないため、そのままでは呼べませんでした。
:::

::: details 呼び出し例 — 「新旧対照表だけを保存して、表として取る」
- 実測: v0.25.0（2026-10-05）
- ローカル DB: あり

**引数**

```jsonc
{ "docType": "kaisei", "docId": "0025004-026", "kind": "comparison", "save": true }
```

**返る JSON**（`attachedPdfs` と `legal_status` は上と同じなので省略。保存先は既定の `~/.cache` の形で書いた）

```jsonc
{
  "docType": "kaisei",
  "docId": "0025004-026",
  "attachedPdfs": [ { "kind": "comparison", "read_strategy": "tables", "…": "…" }, { "…": "…" }, { "…": "…" } ],
  "saved": [
    {
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf",
      "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/01.pdf",
      "bytes": 225944,
      "cached": true
    },
    {
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/02.pdf",
      "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/02.pdf",
      "bytes": 459477,
      "cached": true
    },
    {
      "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/pdf/b0025003-111.pdf",
      "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/b0025003-111.pdf",
      "bytes": 408826,
      "cached": true
    }
  ],
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
  "next_actions": [
    {
      "action": "pdf-reader-mcp:extract_tables",
      "reason": "新旧対照表を表として取る。タグ付き PDF なら行と列がそのまま返る。表が 0 件（タグ無し）なら read_text に split_columns: 2 を付けて同じ file_path を読む",
      "example": { "file_path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/01.pdf" }
    },
    {
      "action": "read_pdf",
      "reason": "pdf-reader-mcp が無いときは、使っている PDF 読み取りツールに url（save: true で保存したときは path）を渡す。読み方は attachedPdfs[].read_strategy と layout_note のとおり",
      "example": {
        "url": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/kaisei/0025004-026/pdf/01.pdf",
        "path": "~/.cache/houki-nta-mcp/files/kaisei/0025004-026/01.pdf"
      }
    }
  ]
}
```

`kind: "comparison"` で新旧対照表 3 件（別紙 1・別紙 2・参考の対応表）に絞り、`save: true` でサーバー側の保存先（`HOUKI_NTA_FILES_DIR`、無ければ `${XDG_CACHE_HOME:-~/.cache}/houki-nta-mcp/files/<docType>/<docId>/`）に置きます。`saved[].path` は絶対パスで返るので、`next_actions[0].example` をそのまま pdf-reader-mcp の `extract_tables` に渡せます。`next_actions` は kind ごとに 1 件なので、`example` に入るのは先頭の別紙 1 だけです。別紙 2 と参考の対応表は `saved[1].path` / `saved[2].path` を同じ `extract_tables` に渡します。上の実測は同じ PDF を前に保存していたので `saved[].cached` が `true` になっています。初めて呼んだときは取得して `false` になり、同じ引数でもう一度呼ぶと再取得はせず `true` になります。取得に失敗した PDF は `saved[].path` が `null` になり、`error`（`HTTP 404`、`PDF ではありません（Content-Type: text/html）` など）と、`note` に件数が入ります。その PDF は URL のまま読みます。

別紙 1（本文の新旧対照表）はタグ付きなので `extract_tables` が見出し行「改正後 | 改正前」の表を返します。参考の対応表はタグ無しで `extract_tables` が 0 件になるので、`read_text` に `split_columns: 2` を付けて同じ `file_path` を読みます。新旧対照表から改正点を取り出す手順（左右どちらが改正後かを見出し行で確かめる、「（同左）」「（省略）」「（新設）」「（削除）」と「【新設】」「【削除】」「【一部改正】」の扱い）は houki-research-skill の鉄則 3 にあります。
:::

## resolve_abbreviation

略称・通称から houki-abbreviations 経由でエントリを解決する。houki-nta-mcp 管轄外（法令系等）の場合は「他 MCP に誘導」のヒントを返す。

### 引数

| 引数 | 型 | 必須 | 既定値 | 説明 |
|---|---|---|---|---|
| `abbr` | string (minLength 1) | **必須** |  | 略称。例: "消基通", "所基通", "法基通"。全角の英数字・ダッシュ類・全角スペースは半角に揃えてから引く |

::: details 呼び出し例 — 「電帳法 は houki-nta-mcp で引けるか」
- 実測: v0.25.0（2026-10-05）
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
  "hint": "このエントリは houki-egov の管轄です。houki-egov-mcp で取得してください。",
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "houki-egov の管轄リソースです。該当 MCP に切り替えてください",
      "example": { "mcp": "houki-egov" }
    }
  ]
}
```

`in_scope: false` は、この略称が houki-nta-mcp の管轄外（法律なので houki-egov-mcp）であることを示します。houki-egov-mcp 側の同名ツールとの違いはこの `in_scope` と `hint` で、辞書は同じ houki-abbreviations です。「消基通」「所基通」のような通達の略称なら `in_scope: true` になります。管轄外のときは `next_actions` に `delegate_to_mcp`（`example.mcp` は担当のサーバー）が 1 件付きます（v0.23.0 から）。
:::
