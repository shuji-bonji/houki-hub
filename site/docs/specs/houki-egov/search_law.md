---
title: "search_law — houki-egov-mcp の仕様"
description: "houki-egov-mcp の search_law（法令をタイトルのキーワード・略称で検索する）の仕様。目的・入力・処理の流れと、仕様 ID ごとの仕様項目（specs/current から自動生成）"
---

# search_law の仕様

<!-- GENERATED FILE — 手で編集しない。本文は houki-egov-mcp の specs/current/search_law/spec.md の写し。 -->

::: info
houki-egov-mcp **v0.20.1** の `specs/current/search_law/spec.md` から自動生成しました（仕様 ID 18 件・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

法令をタイトルのキーワード・略称で検索する

使いどころ・引数・実測の呼び出し例は、[ツールのページ](/reference/mcp/houki-egov/search_law)にあります。

最後に仕様が変わったのは v0.18.0 の「law_type の勅令の値を e-Gov に揃え、条の無い参照から get_toc を案内する（段階 5 追加分）」（2026-10-03 承認）です。それまでの経緯は[承認の履歴](#承認の履歴)にあります。

## 利用者と得られる結果

この機能の利用者と、利用者が渡すもの・得られる結果を示します。

- MCP クライアント（Claude などの LLM、または CLI から呼ぶ人）。`keyword`（法令名の一部または略称）を渡して、e-Gov 法令API v2 で法令名が一致する法令の一覧（法令 ID・題名・法令番号・種別・e-Gov の URL）を受け取る

## 入力

呼び出すときに渡す値です。

| 引数       | 必須 | 内容                                                                                                                                      |
| ---------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `keyword`  | 必須 | 検索キーワード。法令名の一部（例: `"消費税"`、`"労働基準"`）か略称（例: `"消法"`、`"労基法"`）                                            |
| `law_type` | 任意 | 法令種別で絞り込む。`Constitution` / `Act` / `CabinetOrder` / `ImperialOrder` / `MinisterialOrdinance` / `Rule` のどれか（[SPEC-EGOV-SEARCH-LAW-018](#spec-egov-search-law-018)。e-Gov の `law_type` の値と同じ） |
| `limit`    | 任意 | 取得件数。既定は 10。1 以上 50 以下の整数（[SPEC-EGOV-SEARCH-LAW-013](#spec-egov-search-law-013)） |

## 扱わないこと

この機能が意図して扱わないことです。

- 条文の本文を検索すること（本文の全文検索は `search_fulltext`）
- 条文を返すこと（条文の取得は `get_law`）
- 通達を検索すること（通達は e-Gov に収録されていない）
- 略称辞書の内容を確かめること（`resolve_abbreviation`）
- 時点を指定して、その時点の法令名で検索すること

## 処理の流れ

呼び出しを受けてから応答を返すまでに、何をどの順で確かめるかを示します。図の中の番号は「できること」の仕様 ID の末尾 3 桁です。ID の無い枝はテストが無い振る舞いで、「未決」に書いています。

```mermaid
flowchart TD
  A["呼び出し（keyword・law_type・limit）。domain は inputSchema で止まる（016）"] --> B{"keyword は空か"}
  B -- はい --> E1["INVALID_ARGUMENT を返す（001）"]
  B -- いいえ --> C{"keyword が略称辞書にあるか（全角英数字・ダッシュ類・全角空白を揃えて照合する。014）"}
  C -- "ある・管轄外" --> E3["OUT_OF_SCOPE を返し、e-Gov を引かない（015）"]
  C -- ある --> D["正式名称で e-Gov を検索する（未決 4）"]
  C -- 無い --> F["keyword のまま e-Gov を検索する"]
  D --> G{"e-Gov から応答を得たか"}
  F --> G
  G -- "失敗した" --> E2["SOURCE_* のエラーを返す（未決 8）"]
  G -- 得た --> H{"一致が 0 件か"}
  H -- いいえ --> H1["query・total_count（一致した総数）・results を返す（006）"]
  H -- はい --> H2["hint と next_actions を付けて返す（017）"]
```

## 仕様項目

この機能の仕様項目を、仕様 ID ごとに並べています。見出しは仕様項目を 1 文で表したもので、条件・応答の細部・例は「詳細」を開くと読めます。仕様 ID はそれぞれ受入テストと対応していて、テストの無い ID があると各リポジトリの CI が止まります。

<a id="spec-egov-search-law-001"></a>

### SPEC-EGOV-SEARCH-LAW-001 空の keyword は検索せずにエラー `INVALID_ARGUMENT` を返す

::: details 詳細
`keyword` が空文字のときは、inputSchema の `minLength: 1` の検査（[SPEC-EGOV-COMMON-ERRORS-025](/specs/houki-egov/common_errors#spec-egov-common-errors-025)）で止まり、e-Gov を検索せずにエラー `INVALID_ARGUMENT` を返す。本文は inputSchema の検査のエラーの形（[SPEC-EGOV-COMMON-ERRORS-013](/specs/houki-egov/common_errors#spec-egov-common-errors-013)・014・020・021・022）で、`tool: "search_law"`、`detail.issues` は `[{ path: "keyword", message: "空文字は指定できません" }]`。

例: `keyword: ""` は `isError: true`・`code: "INVALID_ARGUMENT"`・`tool: "search_law"`・`error: "引数が tools/list の inputSchema に合いません: keyword: 空文字は指定できません"` で、e-Gov への問い合わせは 0 回。
:::

<a id="spec-egov-search-law-002"></a>

### SPEC-EGOV-SEARCH-LAW-002 略称は正式名称に置き換えて検索し、`query.resolved` に正式名称を入れる

::: details 詳細
`keyword` が略称辞書の略称と一致するときは、その正式名称を e-Gov の `/laws` の `law_title` に渡して検索し、応答の `query.resolved` に正式名称を入れる。

例: `keyword: "消法"` は、e-Gov に `law_title=消費税法` で問い合わせ、応答は `query.keyword: "消法"`・`query.resolved: "消費税法"`。e-Gov が `消費税法`・`消費税法施行令` の 2 件を返せば、`results` の先頭は `title: "消費税法"`。
:::

<a id="spec-egov-search-law-003"></a>

### SPEC-EGOV-SEARCH-LAW-003 辞書に無い keyword はそのまま検索し、`query.resolved` を付けない

::: details 詳細
`keyword` が略称辞書の略称・正式名称・別名のどれとも一致しないときは、`keyword` をそのまま `law_title` に渡して検索し、応答の `query` に `resolved` のキーを付けない。

例: `keyword: "消費税法施行"` は、e-Gov に `law_title=消費税法施行` で問い合わせ、応答の `query` は `{ "keyword": "消費税法施行" }`（`resolved` のキーが無い）。
:::

<a id="spec-egov-search-law-004"></a>

### SPEC-EGOV-SEARCH-LAW-004 正式名称・別名も、辞書の正式名称に置き換えて検索する

::: details 詳細
`keyword` が略称辞書のエントリの正式名称や別名と一致するときも、[SPEC-EGOV-SEARCH-LAW-002](#spec-egov-search-law-002) と同じく、そのエントリの正式名称で検索し、`query.resolved` に正式名称を入れる。

例: `keyword: "消費税"`（`消法` の別名）と `keyword: "インボイス"`（`消法` の別名）は、どちらも e-Gov に `law_title=消費税法` で問い合わせ、`query.resolved: "消費税法"`。`query.keyword` は渡した `"消費税"`・`"インボイス"` のまま。
:::

<a id="spec-egov-search-law-005"></a>

### SPEC-EGOV-SEARCH-LAW-005 前後の空白を除いてから略称辞書と照合し、`query.keyword` は渡した値のまま返す

::: details 詳細
`keyword` の前後の空白を除いてから略称辞書と照合し、除いた後の文字列で検索する。応答の `query.keyword` には、除く前の渡した値をそのまま入れる。

例: `keyword: " 消法 "` は `query.keyword: " 消法 "`・`query.resolved: "消費税法"` で、e-Gov への問い合わせは `law_title=消費税法`。
:::

<a id="spec-egov-search-law-006"></a>

### SPEC-EGOV-SEARCH-LAW-006 成功時の応答の形

::: details 詳細
成功したときは、エラーにせず（`isError` を付けず）、`content[0].text` に次の形の JSON の文字列を返す。

| フィールド     | 内容                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `query`        | `keyword`（渡した値）。`law_type`（渡したときだけ）、`resolved`（[SPEC-EGOV-SEARCH-LAW-002](#spec-egov-search-law-002)）            |
| `total_count`  | e-Gov で一致した法令の総数（e-Gov の応答の `total_count`。`limit` で切る前の件数）。`results` の件数とは限らない |
| `results`      | e-Gov が返した法令の配列。e-Gov が返した順。件数は `limit` 以下                                        |
| `hint`         | 一致が 0 件のときの案内の文（[SPEC-EGOV-SEARCH-LAW-017](#spec-egov-search-law-017)）。1 件以上のときは `null`                      |
| `next_actions` | 一致が 0 件のときの次の手（[SPEC-EGOV-SEARCH-LAW-017](#spec-egov-search-law-017)）。1 件以上のときは `[]`                            |

`results` の要素は次のフィールドを持つ。

| フィールド          | 内容                                                           |
| ------------------- | -------------------------------------------------------------- |
| `law_id`            | 法令 ID                                                        |
| `title`             | 法令名                                                         |
| `law_num`           | 法令番号                                                       |
| `law_type`          | 法令種別（`Act` など。e-Gov の値のまま）                       |
| `promulgation_date` | 公布日（`YYYY-MM-DD`）。e-Gov の応答に無ければ付かない         |
| `url`               | `https://laws.e-gov.go.jp/law/<law_id>`                        |

出力の形式を選ぶ引数（`format` など）は無い。`format` を渡すと、inputSchema に無い引数として `INVALID_ARGUMENT`（`detail.issues[0].path: "format"`）を返す。

例: `keyword: "消法"` で e-Gov が消費税法（法令 ID `363AC0000000108`、法令番号 `昭和六十三年法律第百八号`、公布日 `1988-12-30`）を返すと、`results[0]` は `law_id: "363AC0000000108"`・`title: "消費税法"`・`law_num: "昭和六十三年法律第百八号"`・`law_type: "Act"`・`promulgation_date: "1988-12-30"`・`url: "https://laws.e-gov.go.jp/law/363AC0000000108"`、`hint: null`、`next_actions: []`。`keyword: "保険", limit: 2`（辞書に無い）は、2026-10-03 10:20 JST の e-Gov が `/laws?law_title=保険` に `total_count: 278` を返すので、`total_count: 278`・`results` は 2 件（v0.17.0 では `total_count: 2`。同じ時刻に houki-egov-dev 0.17.0 で確かめた）。e-Gov が 0 件を返すと（`keyword: "存在しない"`）、`total_count: 0`・`results: []` で、エラーにせず [SPEC-EGOV-SEARCH-LAW-017](#spec-egov-search-law-017) の `hint` と `next_actions` を付ける。
:::

<a id="spec-egov-search-law-007"></a>

### SPEC-EGOV-SEARCH-LAW-007 空白だけの keyword も検索せずにエラー `INVALID_ARGUMENT` を返す

::: details 詳細
`keyword` が空白（半角スペース・全角スペース・タブ・改行）だけのときは、e-Gov に問い合わせずにエラー `INVALID_ARGUMENT` を返す。本文は [SPEC-EGOV-COMMON-ERRORS-026](/specs/houki-egov/common_errors#spec-egov-common-errors-026) の形で、`tool: "search_law"`、`error: "keyword が空です"`、`detail.issues` は `[{ path: "keyword", message: "空白だけは指定できません" }]`、`hint` には検索したい法令名・略称・キーワードを指定するよう書く（例: `"消費税"`、`"労基"`）。

例: `keyword: "   "` と `keyword: "\t\n"` は、どちらも `isError: true`・`code: "INVALID_ARGUMENT"`・`tool: "search_law"`・`error: "keyword が空です"`・`detail.issues[0].path: "keyword"` で、e-Gov への問い合わせは 0 回。
:::

<a id="spec-egov-search-law-008"></a>

### SPEC-EGOV-SEARCH-LAW-008 law_type を e-Gov の検索に渡し、`query.law_type` に入れる

::: details 詳細
`law_type` を渡すと、e-Gov の `/laws` の `law_type` に同じ値を渡して問い合わせ、応答の `query.law_type` に渡した値を入れる。種別での絞り込みは e-Gov が行う。`law_type` を渡さないときは、問い合わせに `law_type` を付けず、応答の `query` に `law_type` のキーを付けない。

例: `keyword: "労働基準", law_type: "Act"` は、e-Gov に `law_title=労働基準&law_type=Act` で問い合わせ、`query.law_type: "Act"`。e-Gov が `労働基準法` の 1 件を返せば、`results` は `title: "労働基準法"`・`law_type: "Act"` の 1 件。`keyword: "消法"`（`law_type` なし）の応答の `query` には `law_type` のキーが無い。
:::

<a id="spec-egov-search-law-009"></a>

### SPEC-EGOV-SEARCH-LAW-009 e-Gov が 429 を返したら `SOURCE_RATE_LIMITED` を返す

::: details 詳細
e-Gov が 429 を返し続けたときは、エラー `SOURCE_RATE_LIMITED` を返す。`retryable: true`、`detail` は `status: 429` と `url`（問い合わせた URL）、`next_actions[0].action` は `retry_later`。

例: `keyword: "err429"` で e-Gov が常に 429 を返すと、`isError: true`・`code: "SOURCE_RATE_LIMITED"`・`retryable: true`・`detail.status: 429`・`detail.url: "https://laws.e-gov.go.jp/api/2/laws?law_title=err429&limit=10"`。
:::

<a id="spec-egov-search-law-010"></a>

### SPEC-EGOV-SEARCH-LAW-010 e-Gov への問い合わせがタイムアウトしたら `SOURCE_TIMEOUT` を返す

::: details 詳細
e-Gov への問い合わせが時間切れで打ち切られたときは、エラー `SOURCE_TIMEOUT` を返す。`retryable: true`、`detail` は `url`（問い合わせた URL）だけを持ち `status` を持たない。`next_actions` は `retry_later` と `visit_egov_site` の順。

例: `keyword: "errabort"` で問い合わせが打ち切られる（`fetch` が `name: "AbortError"` の例外で失敗する）と、`isError: true`・`code: "SOURCE_TIMEOUT"`・`retryable: true`・`detail.url: "https://laws.e-gov.go.jp/api/2/laws?law_title=errabort&limit=10"`。
:::

<a id="spec-egov-search-law-011"></a>

### SPEC-EGOV-SEARCH-LAW-011 e-Gov が 5xx を返したら `retryable: true` の `SOURCE_API_ERROR` を返す

::: details 詳細
e-Gov が 500 以上の status を返し続けたときは、エラー `SOURCE_API_ERROR` を `retryable: true` で返す。`detail` は `status` と `url`、`next_actions` は `retry_later` と `visit_egov_site` の順。

例: `keyword: "err503"` で e-Gov が常に 503 を返すと、`isError: true`・`code: "SOURCE_API_ERROR"`・`retryable: true`・`detail.status: 503`・`error: "e-Gov API がサーバーエラーを返しました（503）"`。
:::

<a id="spec-egov-search-law-012"></a>

### SPEC-EGOV-SEARCH-LAW-012 e-Gov が 429 以外の 4xx を返したら `retryable: false` の `SOURCE_API_ERROR` を返す

::: details 詳細
e-Gov が 429 以外の 400〜499 の status を返したときは、エラー `SOURCE_API_ERROR` を `retryable: false` で返す。`detail` は `status` と `url`。

例: `keyword: "err400"` で e-Gov が 400 を返すと、`isError: true`・`code: "SOURCE_API_ERROR"`・`retryable: false`・`detail.status: 400`・`detail.url: "https://laws.e-gov.go.jp/api/2/laws?law_title=err400&limit=10"`。404 でも同じく `retryable: false`（`detail.status: 404`）。
:::

<a id="spec-egov-search-law-013"></a>

### SPEC-EGOV-SEARCH-LAW-013 `limit` は 1 以上 50 以下の整数で、範囲の外は `INVALID_ARGUMENT` にして丸めない

::: details 詳細
tools/list の inputSchema の `limit` は `type: "integer"`、`minimum: 1`、`maximum: 50` を持つ（[SPEC-EGOV-COMMON-ERRORS-023](/specs/houki-egov/common_errors#spec-egov-common-errors-023)）。0・負の数・小数・51 以上・数値でない値を渡すと、inputSchema の検査で `INVALID_ARGUMENT`（`tool: "search_law"`、`detail.issues[0].path: "limit"`）を返し、e-Gov に問い合わせない。50 以下に切り詰めたり、既定の 10 に戻したりしない。1 以上 50 以下の整数は、その件数を e-Gov に渡す。

例: `keyword: "消費税", limit: 100` は `code: "INVALID_ARGUMENT"`、`detail.issues` は `[{ path: "limit", message: "50 以下で指定してください" }]` で、e-Gov への問い合わせは 0 回（v0.15.4 では 100 件返っていた）。`limit: 0` は `[{ path: "limit", message: "1 以上で指定してください" }]`、`limit: 2.5` は `[{ path: "limit", message: "整数で指定してください" }]`、`limit: "10"` も `整数で指定してください`。`limit: 50` は e-Gov の `/laws` を `limit=50` で引く。`limit: 1` は `limit=1` で引く。
:::

<a id="spec-egov-search-law-014"></a>

### SPEC-EGOV-SEARCH-LAW-014 `keyword` の略称の照合で全角英数字・ダッシュ類・全角空白を吸収する

::: details 詳細
`keyword` を略称辞書と照合するとき（[SPEC-EGOV-SEARCH-LAW-002](#spec-egov-search-law-002)）は、houki-abbreviations の `resolveAbbreviation(name, { normalize: true })` の規則（全角英数字を半角に、ダッシュ類を `-` に、全角チルダを `~` に、全角空白を半角空白にし、前後の空白を除く。大文字と小文字は区別する）で揃えてから照合する。辞書に当たれば正式名称を e-Gov に渡し、当たらなければ前後の空白を除いた渡した値のまま `law_title` に渡す（揃えない）。応答の `query.keyword` は渡した値のまま。

例: `keyword: "ＰＬ法"` は e-Gov に `law_title=製造物責任法` で問い合わせ、`query.keyword: "ＰＬ法"`・`query.resolved: "製造物責任法"`（v0.15.4 では `law_title=ＰＬ法` で問い合わせて 0 件だった）。
:::

<a id="spec-egov-search-law-015"></a>

### SPEC-EGOV-SEARCH-LAW-015 houki-egov の管轄でない略称は `OUT_OF_SCOPE` を返し、e-Gov を引かない

::: details 詳細
`keyword` が略称辞書で houki-egov 以外の管轄（通達は houki-nta など）と分かる名前のときは、エラー `OUT_OF_SCOPE` を返し、e-Gov には問い合わせない。本文は `get_law` の [SPEC-EGOV-GET-LAW-001](/specs/houki-egov/get_law#spec-egov-get-law-001)・032 と同じ（`error` に正式名称と管轄、`hint` に管轄先の MCP、`next_actions` に `delegate_to_mcp`）。

例: `keyword: "消基通"` は `code: "OUT_OF_SCOPE"` で、e-Gov への問い合わせは 0 回（v0.15.4 では `law_title=消費税法基本通達` で問い合わせて `results: []` だった）。`keyword: "消費税"`（辞書に無い）は今までどおり e-Gov を検索する。
:::

<a id="spec-egov-search-law-016"></a>

### SPEC-EGOV-SEARCH-LAW-016 `domain` は引数に無く、渡すと `INVALID_ARGUMENT` にする

::: details 詳細
tools/list の `search_law` の inputSchema は `domain` を持たない（0.17.0 までは受け付けたが、e-Gov の検索にも結果の選別にも使っていなかった）。`domain` を渡すと、inputSchema に無い引数として [SPEC-EGOV-COMMON-ERRORS-004](/specs/houki-egov/common_errors#spec-egov-common-errors-004) の `INVALID_ARGUMENT`（`tool: "search_law"`、`detail.issues: [{ path: "domain", message: "inputSchema に無い引数です" }]`）を返し、e-Gov に問い合わせない。

例: `{ keyword: "労働基準", domain: "tax", law_type: "Act" }` は `code: "INVALID_ARGUMENT"`、`detail.issues[0].path: "domain"`（v0.17.0 では `domain` を使わずに検索し、労働分野の `労働基準法` を返していた）。`{ keyword: "労働基準", law_type: "Act" }` は今までどおり検索する。
:::

<a id="spec-egov-search-law-017"></a>

### SPEC-EGOV-SEARCH-LAW-017 一致が 0 件のときは、法令の題名だけを探したことと次の手を返す

::: details 詳細
e-Gov の検索が成功して 0 件だったときは、エラーにせず（`total_count: 0`・`results: []`）、次の `hint` と `next_actions` を付ける。

- `hint`: `「<検索した名前>」を題名に含む法令は e-Gov にありません。search_law は法令の題名だけを探します。条文の本文にある語なら search_fulltext、略称なら resolve_abbreviation を試してください`。`<検索した名前>` は e-Gov に渡した `law_title`（略称なら正式名称）
- `next_actions`（この順）:
  1. `law_type` を渡したときだけ、`{ action: "search_law", reason: "法令種別を外して探せます", example: { keyword: <渡した keyword>, limit: <渡した limit（渡したときだけ）> } }`
  2. `{ action: "search_fulltext", reason: "条文の本文から語を探せます（ローカル DB がある場合）", example: { keyword: <前後の空白を除いた keyword> } }`
  3. `{ action: "resolve_abbreviation", reason: "略称・通称かどうかを確かめられます", example: { abbr: <前後の空白を除いた keyword> } }`

例: `{ keyword: "存在しない" }` は `total_count: 0`、`results: []`、`hint` は `「存在しない」を題名に含む法令は e-Gov にありません。…` で始まり、`next_actions` の `action` は `["search_fulltext", "resolve_abbreviation"]`。`{ keyword: "存在しない", law_type: "Act" }` は `["search_law", "search_fulltext", "resolve_abbreviation"]` で、1 件目の `example` は `{ keyword: "存在しない" }`。v0.17.0 では `hint` も `next_actions` も無かった。
:::

<a id="spec-egov-search-law-018"></a>

### SPEC-EGOV-SEARCH-LAW-018 `law_type` の選択肢は e-Gov の `law_type` の値と同じで、勅令は `ImperialOrder`

::: details 詳細
tools/list の `search_law` の inputSchema の `law_type` は、`enum: ["Constitution", "Act", "CabinetOrder", "ImperialOrder", "MinisterialOrdinance", "Rule"]` を持つ。どれも e-Gov 法令 API v2 の `/laws` の `law_type` が受け付け、応答の `results[].law_type` に入る値である。`ImperialOrdinance` は選択肢に無く、渡すと inputSchema の検査で `INVALID_ARGUMENT`（`tool: "search_law"`、`detail.issues: [{ path: "law_type", message: "Constitution・Act・CabinetOrder・ImperialOrder・MinisterialOrdinance・Rule のどれかで指定してください" }]`）を返し、e-Gov に問い合わせない。

例: `{ keyword: "健康保険法", law_type: "ImperialOrder" }` は、e-Gov に `law_title=健康保険法&law_type=ImperialOrder` で問い合わせ、`results` に健康保険法施行令（`215IO0000000243`、大正十五年勅令第二百四十三号、`law_type: "ImperialOrder"`）が入る。`{ keyword: "健康保険法", law_type: "ImperialOrdinance" }` は `code: "INVALID_ARGUMENT"`・`detail.issues[0].path: "law_type"` で、e-Gov への問い合わせは 0 回（v0.17.0 では inputSchema を通り、e-Gov が 400・`400001` を返して `SOURCE_API_ERROR`・`retryable: false` だった。2026-10-03 10:19 JST に houki-egov-dev 0.17.0 で確かめた）。`{ keyword: "日本国憲法", law_type: "Constitution" }` は日本国憲法（`321CONSTITUTION`）を返す（v0.17.0 では `Constitution` が選択肢に無く `INVALID_ARGUMENT`）。

2026-10-03 10:18 JST に e-Gov の `/laws?law_type=<値>&limit=1` で確かめた値: `Constitution` 1 件、`ImperialOrder` 74 件、`Rule` 453 件（いずれも 200）、`ImperialOrdinance` は 400・`{"code":"400001","message":"法令種別（law_type、law_num_type）が誤っています。"}`。
:::

## 検討中のこと

仕様を書き起こしたときに見つかった項目のうち、扱いを Issue で検討しているものです。ここに挙げたことは、今後の版で変わることがあります。開くと、元の仕様書の記述をそのまま読めます。

::: details 仕様書の「未決」の節
初版起こしで見つけた、意図か不具合かを人が決める項目です。決まったら「できること」に ID を振るか、`specs/changes/` の差分にします。

意図か不具合かの判断が要る項目は houki-egov-mcp の Issue に移し、ここには題と Issue の番号だけを残します。今の振る舞いのままでよくテストが無いだけの項目は、受入テストを書いてから「できること」に ID を振ります。

4. **略称を正式名称に置き換えて検索する。** → [SPEC-EGOV-SEARCH-LAW-002](#spec-egov-search-law-002)・[SPEC-EGOV-SEARCH-LAW-003](#spec-egov-search-law-003)・[SPEC-EGOV-SEARCH-LAW-004](#spec-egov-search-law-004)・[SPEC-EGOV-SEARCH-LAW-005](#spec-egov-search-law-005)
5. **成功時の応答の形。** → [SPEC-EGOV-SEARCH-LAW-006](#spec-egov-search-law-006)
6. **空白だけの `keyword`。** → [SPEC-EGOV-SEARCH-LAW-007](#spec-egov-search-law-007)
7. **`law_type` で絞り込む。** → [SPEC-EGOV-SEARCH-LAW-008](#spec-egov-search-law-008)
8. **e-Gov への問い合わせに失敗したときのエラー。** → [SPEC-EGOV-SEARCH-LAW-009](#spec-egov-search-law-009)・[SPEC-EGOV-SEARCH-LAW-010](#spec-egov-search-law-010)・[SPEC-EGOV-SEARCH-LAW-011](#spec-egov-search-law-011)・[SPEC-EGOV-SEARCH-LAW-012](#spec-egov-search-law-012)（一部は約束にしていない。差分 `20260928-untested-behaviors` の proposal.md を参照）
:::

## 承認の履歴

この機能の仕様が、いつ、どの変更で承認されたかを新しい順に並べています。各リポジトリの `npx spec-ids history search_law` と同じ内容です。変更の名前から、変更の理由と前後の振る舞いを書いた文書（GitHub）を開けます。

::: details 承認の履歴（7 件）
| 承認日 | 版 | 変更 | 仕様 PR |
|---|---|---|---|
| 2026-10-03 | v0.18.0 | [law_type の勅令の値を e-Gov に揃え、条の無い参照から get_toc を案内する（段階 5 追加分）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.18.0/20261003-law-type-and-reference-actions/proposal.md) | [#99](https://github.com/shuji-bonji/houki-egov-mcp/pull/99) |
| 2026-10-03 | v0.18.0 | [検索の件数・0 件の案内・通称の展開・管轄外の略称、法令種別の解説、附則の別表の図の置き場所（段階 5 検索と解説と添付）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.18.0/20261003-search-explain-attachment/proposal.md) | [#96](https://github.com/shuji-bonji/houki-egov-mcp/pull/96) |
| 2026-10-01 | v0.16.0 | [全角・半角・ダッシュ類の揃え方を houki-abbreviations 0.7.0 に一本化する（T3）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.16.0/20261001-t3-normalize/proposal.md) | [#86](https://github.com/shuji-bonji/houki-egov-mcp/pull/86) |
| 2026-10-01 | v0.16.0 | [引数の検査を inputSchema に書き、丸めずに `INVALID_ARGUMENT` にする（T1）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.16.0/20261001-t1-argument-guards/proposal.md) | [#84](https://github.com/shuji-bonji/houki-egov-mcp/pull/84) |
| 2026-09-28 | v0.15.2 | [テストが無いだけの振る舞いに仕様 ID を振る](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.15.2/20260928-untested-behaviors/proposal.md) | [#76](https://github.com/shuji-bonji/houki-egov-mcp/pull/76) |
| 2026-09-28 | v0.15.2 | [「未決」のうち判断が要る 85 件を Issue に移す](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.15.2/20260928-undecided-to-issues/proposal.md) | [#68](https://github.com/shuji-bonji/houki-egov-mcp/pull/68) |
| 2026-09-28 | — | 初版 | [#50](https://github.com/shuji-bonji/houki-egov-mcp/pull/50) |
:::

## 関連ページ

このページの元になった文書と、あわせて読むページです。

- [houki-egov-mcp の仕様の一覧](/specs/houki-egov/)
- [houki-egov-mcp の解説](/mcp/houki-egov)
- [search_law のツールのページ（リファレンス）](/reference/mcp/houki-egov/search_law)
- [元の仕様書（GitHub、v0.20.1）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/current/search_law/spec.md)
