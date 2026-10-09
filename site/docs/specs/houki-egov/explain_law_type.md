---
title: "explain_law_type — houki-egov-mcp の仕様"
description: "houki-egov-mcp の explain_law_type（法令種別の制定主体・階層・拘束力を解説する）の仕様。目的・入力・処理の流れと、仕様 ID ごとの約束（specs/current から自動生成）"
---

# explain_law_type の仕様

<!-- GENERATED FILE — 手で編集しない。本文は houki-egov-mcp の specs/current/explain_law_type/spec.md の写し。 -->

::: info
houki-egov-mcp **v0.20.0** の `specs/current/explain_law_type/spec.md` から自動生成しました（仕様 ID 22 件・2026-10-09）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

このページは、houki-egov-mcp のツール「explain_law_type（法令種別の制定主体・階層・拘束力を解説する）」の仕様です。「承認の履歴」の前までは、仕様書の本文を言い換えずに写しています。
引数の型と既定値の一覧と、実測の呼び出し例は[リファレンス](/reference/mcp/houki-egov#explain-law-type)にあります。

最後に仕様が変わったのは v0.18.0 の「検索の件数・0 件の案内・通称の展開・管轄外の略称、法令種別の解説、附則の別表の図の置き場所（段階 5 検索と解説と添付）」（2026-10-03 承認）です。それまでの経緯は[承認の履歴](#承認の履歴)にあります。

## 使う人と受け取るもの

この機能を誰が呼び、何を渡して何を受け取るかを示します。

- MCP クライアント（Claude などの LLM、または CLI から呼ぶ人）。法令種別の名前（`政令`・`通達` など）を渡して、その種別を誰が定めるか・法令の階層のどこにあるか・国民を拘束するか・罰則を設けられるかの解説を受け取る。法務の専門家でない利用者が「政令と省令の違い」「通達は守らなくてよいのか」を確かめるのに使う

## 入力

呼び出すときに渡す値です。

| 引数   | 必須 | 内容                                                                                                                                                                                                     |
| ------ | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | 必須 | 法令種別の名前。例: `"法律"`、`"政令"`、`"省令"`、`"規則"`、`"条例"`、`"告示"`、`"通達"`、`"訓令"`、`"憲法"`。別名（`"施行令"`・`"施行規則"` など）と e-Gov の法令種別コード（`"Act"`・`"Constitution"`・`"Rule"` など。[SPEC-EGOV-EXPLAIN-LAW-TYPE-022](#spec-egov-explain-law-type-022)）も受け付ける |

## できないこと

この機能が引き受けないことです。

- 個々の法令（例: `消費税法施行令`）がどの種別かを判定すること（法令の種別は `search_law` や `get_law` の応答の `law_type`）
- 法令や通達の本文を返すこと
- 通達・条例・告示を e-Gov から取ること（`sources` で取得元を示すだけ）
- 個別の事案で、ある通達や告示に従う必要があるかを判断すること

## 処理の流れ

呼び出しを受けてから応答を返すまでに、何をどの順で確かめるかを示します。図の中の番号は「できること」の仕様 ID の末尾 3 桁です。

```mermaid
flowchart TD
  A["呼び出し（name）"] --> B["name の前後の空白を除く（004）"]
  B --> C{"収録している種別の名前と一致するか（007）"}
  C -- する --> R["found: true と info を返す（001・006・008・009・010）"]
  C -- しない --> D{"種別の別名と一致するか"}
  D -- する --> R2["その種別の info を返す（002）"]
  D -- しない --> E{"e-Gov の法令種別コードと一致するか"}
  E -- する --> R3["その種別の info を返す（003）"]
  E -- しない --> N["found: false と試せる名前の hint を返す（005）"]
```

## 仕様 ID ごとの約束

この機能が守る約束を、仕様 ID ごとに並べています。見出しは約束を 1 文で表したもので、条件・応答の細部・例は「詳細」を開くと読めます。仕様 ID はそれぞれ受入テストと対応していて、テストの無い ID があると各リポジトリの CI が止まります。

<a id="spec-egov-explain-law-type-001"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-001 種別の名前から解説を返す

::: details 詳細
`name` が収録している種別の名前と一致するときは、エラーにせず（`isError` を付けず）、`name`（渡した値）・`found: true`・`info`（その種別の解説）を持つ応答を返す。

例: `name: "政令"` は `name: "政令"`・`found: true` で、`info.name: "政令"`・`info.enacting_body: "内閣"`・`info.binds_citizens: true`。
:::

<a id="spec-egov-explain-law-type-002"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-002 別名から、その種別の解説を返す

::: details 詳細
`name` が種別の別名と一致するときは、その種別の `info` を返す（`found: true`）。

例: `施行令` は `info.name: "政令"`、`施行規則` は `info.name: "省令"`、`日本国憲法` は `info.name: "憲法"`。
:::

<a id="spec-egov-explain-law-type-003"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-003 e-Gov の法令種別コードから、その種別の解説を返す

::: details 詳細
`name` が e-Gov の法令種別コードと一致するときは、その種別の `info` を返す（`found: true`）。

例: `Act` は `info.name: "法律"`、`CabinetOrder` は `info.name: "政令"`、`MinisterialOrdinance` は `info.name: "省令"`。
:::

<a id="spec-egov-explain-law-type-004"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-004 前後の空白を除いてから照合する

::: details 詳細
`name` の前後の空白を除いてから照合する。

例: `"  通達  "` は `info.name: "通達"` の解説を返す。
:::

<a id="spec-egov-explain-law-type-005"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-005 知らない名前は、エラーにせず `found: false` と試せる名前を返す

::: details 詳細
`name` が種別の名前・別名・法令種別コードのどれとも一致しないときは、エラーにせず（`isError` を付けず）、`name`（渡した値）・`found: false`・`hint` を持つ応答を返す。`hint` は `知らない法令種別です。試せる名前: ` の後に、収録している種別の名前を `, ` 区切りで並べる。

例: `架空法令` は `found: false` で、`hint` に `試せる名前` を含む。`存在しない法令種別`・`知らない種別` も `found: false`。
:::

<a id="spec-egov-explain-law-type-006"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-006 `info` のフィールド

::: details 詳細
どの種別の `info` も次のフィールドを持つ。

| フィールド          | 内容                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| `name`              | 種別の名前（主名）。別名や法令種別コードで引いたときも主名                     |
| `enacting_body`     | 制定する者（例: `内閣`）                                                       |
| `hierarchy_rank`    | 階層の順位を表す数。小さいほど上位                                             |
| `level`             | 適用される範囲。`national` / `local` / `agency-internal` / `judicial` のどれか |
| `binds_citizens`    | 国民を直接拘束するか（真偽値）                                                 |
| `can_set_penalties` | 罰則を新たに設けられるか（真偽値）                                             |
| `description`       | 説明（実務上の注意を含む）                                                     |
| `examples`          | 具体例の配列。1 件以上                                                         |
| `sources`           | 取得元の配列                                                                   |
:::

<a id="spec-egov-explain-law-type-007"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-007 収録している種別

::: details 詳細
少なくとも `憲法`・`法律`・`政令`・`省令`・`規則`・`条例`・`告示`・`訓令`・`通達` の 9 種を収録する。[SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005) の `hint` に並べる名前は 9 個以上。
:::

<a id="spec-egov-explain-law-type-008"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-008 `hierarchy_rank` は憲法・法律・政令・省令の順に大きくなる

::: details 詳細
`hierarchy_rank` は `憲法` < `法律` < `政令` < `省令` の順に大きい。
:::

<a id="spec-egov-explain-law-type-009"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-009 通達と訓令は国民を直接拘束しない

::: details 詳細
`通達` と `訓令` の `info.binds_citizens` は `false`。
:::

<a id="spec-egov-explain-law-type-010"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-010 罰則を設けられるのは法律・政令・省令・条例で、通達と告示は設けられない

::: details 詳細
`info.can_set_penalties` は、`法律`・`政令`・`省令`・`条例` で `true`、`通達`・`告示` で `false`。
:::

<a id="spec-egov-explain-law-type-011"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-011 `found: true` の応答は `related_tools` を持つ

::: details 詳細
[SPEC-EGOV-EXPLAIN-LAW-TYPE-001](#spec-egov-explain-law-type-001)・002・003 の応答（`found: true`）は、`related_tools: ["search_law", "get_law", "get_toc"]` を持つ。どの種別でも同じ配列を、この順で返す。

例: `name: "政令"` も `name: "通達"` も `related_tools` は `["search_law", "get_law", "get_toc"]`。
:::

<a id="spec-egov-explain-law-type-012"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-012 `info` の任意のフィールド `aliases`・`law_type_code`・`notes`

::: details 詳細
`info` は、[SPEC-EGOV-EXPLAIN-LAW-TYPE-006](#spec-egov-explain-law-type-006) のフィールドのほかに、種別によって次のフィールドを持つ。

| フィールド      | 内容                                                                             |
| --------------- | -------------------------------------------------------------------------------- |
| `aliases`       | 別名の配列（文字列）                                                             |
| `law_type_code` | e-Gov の法令種別コード（文字列）                                                 |
| `notes`         | 補足の注意の配列（文字列）。1 件以上                                             |

`憲法` の `law_type_code` は `Constitution`、`法律` は `Act`、`政令` は `CabinetOrder`、`省令` は `MinisterialOrdinance`、`規則` は `Rule`（[SPEC-EGOV-EXPLAIN-LAW-TYPE-022](#spec-egov-explain-law-type-022)）。

例: `name: "政令"` の `info` は `aliases: ["施行令", "CabinetOrder"]`・`law_type_code: "CabinetOrder"`・`notes`（1 件）を持つ。`name: "法律"` の `info` は `law_type_code: "Act"` を持ち、`aliases` と `notes` を持たない。`name: "憲法"` の `info` は `aliases: ["日本国憲法"]` と `law_type_code: "Constitution"` を持つ（v0.17.0 では `law_type_code` を持たなかった）。`name: "通達"` の `info.aliases` は `["基本通達", "取扱通達"]`（[SPEC-EGOV-EXPLAIN-LAW-TYPE-021](#spec-egov-explain-law-type-021)）。
:::

<a id="spec-egov-explain-law-type-013"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-013 `sources` の要素は `label` と `url` を持ち、`url` は空文字のことがある

::: details 詳細
`info.sources` の各要素は `label`（取得元の名前）と `url`（文字列）を持つ。Web 上の場所を 1 つに決められない取得元（自治体の例規集・各省庁のウェブサイトなど）は `url: ""`。

例: `name: "憲法"` の `sources` は `[{ label: "e-Gov 法令検索", url: "https://laws.e-gov.go.jp/law/321CONSTITUTION" }]`。`name: "条例"` の `sources` は `[{ label: "各自治体の例規集（自治体ウェブサイト）", url: "" }]`。`name: "規則"` の `sources` の 2 件目は `{ label: "各自治体例規集", url: "" }`。
:::

<a id="spec-egov-explain-law-type-014"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-014 `found: false` の応答は、収録している種別の名前を `next_actions` で示す

::: details 詳細
[SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005) の応答（`found: false`）は `next_actions` を持つ。`next_actions` は 1 件で、`action: "list_known_law_types"`・`reason: "知られている法令種別は次のとおり"`・`example.names`（収録している種別の名前の配列）を持つ。`example.names` の名前と順は、`hint` の `試せる名前: ` の後に並べた名前と同じ。

例: `name: "架空法令"` の `next_actions[0].action` は `list_known_law_types` で、`example.names` は `憲法`・`法律`・`政令`・`省令`・`規則`・`条例`・`告示`・`訓令`・`通達` を含み、`example.names.join(", ")` は `hint` の `試せる名前: ` より後ろの文字列と同じ。
:::

<a id="spec-egov-explain-law-type-015"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-015 応答の `name` は渡した値のまま返す

::: details 詳細
応答の `name` には、前後の空白を除く前の、渡した値をそのまま入れる。`info.name` は種別の主名。`found: false` のときも、応答の `name` は渡した値のまま。

例: `name: " 政令 "` は応答の `name` が `" 政令 "` で、`info.name` は `"政令"`。`name: "施行令"` は応答の `name` が `"施行令"` で、`info.name` は `"政令"`。`name: "架空法令"` は応答の `name` が `"架空法令"`（`found: false`）。
:::

<a id="spec-egov-explain-law-type-016"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-016 大文字と小文字、全角と半角を区別して照合する

::: details 詳細
種別の名前・別名・法令種別コードとの照合では、英字の大文字と小文字、全角と半角を同じ文字として扱わない。一致しなければ [SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005) の `found: false` を返す。

例: `name: "Act"` は `info.name: "法律"`（`found: true`）。`name: "act"`・`name: "ACT"`・`name: "ＡＣＴ"` は、どれも `found: false`。
:::

<a id="spec-egov-explain-law-type-017"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-017 府令・内閣府令は省令、基本通達・取扱通達は通達の解説を返す

::: details 詳細
[SPEC-EGOV-EXPLAIN-LAW-TYPE-002](#spec-egov-explain-law-type-002) の別名には、次のものも含む。

| `name`     | `info.name` |
| ---------- | ----------- |
| `府令`     | `省令`      |
| `内閣府令` | `省令`      |
| `基本通達` | `通達`      |
| `取扱通達` | `通達`      |

例: `name: "府令"` は `found: true`・`info.name: "省令"`・`info.enacting_body: "各省大臣／内閣府の主任の大臣"`。`name: "取扱通達"` は `found: true`・`info.name: "通達"`・`info.binds_citizens: false`。
:::

<a id="spec-egov-explain-law-type-018"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-018 `Object.prototype` のプロパティの名前は知らない名前として `found: false` を返す

::: details 詳細
`name` が `toString`・`constructor`・`hasOwnProperty`・`valueOf`・`__proto__` など、JavaScript の `Object.prototype` のプロパティの名前であっても、収録している種別の名前・別名・法令種別コードのどれとも一致しないので、[SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005) と同じ `found: false` の応答を返す。応答は `name`（渡した値）・`found: false`・`hint`・`next_actions`（[SPEC-EGOV-EXPLAIN-LAW-TYPE-014](#spec-egov-explain-law-type-014)）を持ち、`info` と `related_tools` を持たない。エラーにはしない（`isError` を付けない）。

例: `name: "toString"` と `name: "constructor"` は、どちらも `found: false` で、`hint` は `知らない法令種別です。試せる名前: ` で始まり、`next_actions[0].action` は `list_known_law_types`、`next_actions[0].example.names` は `憲法`・`法律`・`政令`・`省令`・`規則`・`条例`・`告示`・`訓令`・`通達` を含む。応答に `info` は無い。`name: "hasOwnProperty"`・`name: "valueOf"`・`name: "__proto__"` も同じ。

（v0.15.3 までは、収録している種別の表をオブジェクトのプロパティとして引いていたため、これらの名前で `found: true` になり、応答に `info` が無かった。houki-egov-mcp #73）
:::

<a id="spec-egov-explain-law-type-019"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-019 name が空文字・空白だけのときは収録している種別の表と照合せずに `INVALID_ARGUMENT` を返す

::: details 詳細
空文字は inputSchema の `minLength: 1` の検査（[SPEC-EGOV-COMMON-ERRORS-025](/specs/houki-egov/common_errors#spec-egov-common-errors-025)）で止まり、`INVALID_ARGUMENT`（`tool: "explain_law_type"`、`detail.issues: [{ path: "name", message: "空文字は指定できません" }]`）を返す。空白（半角スペース・全角スペース・タブ・改行）だけのときは、ツールの処理が収録している種別の表と照合する前に、[SPEC-EGOV-COMMON-ERRORS-026](/specs/houki-egov/common_errors#spec-egov-common-errors-026) の形の `INVALID_ARGUMENT`（`tool: "explain_law_type"`、`error: "name が空です"`、`detail.issues: [{ path: "name", message: "空白だけは指定できません" }]`、`hint` に法令種別の名前・別名・法令種別コードを渡すよう書く）を返す。

例: `name: ""` は `code: "INVALID_ARGUMENT"`・`detail.issues[0].message: "空文字は指定できません"`。`name: "　"`（全角スペース）と `name: " \n"` は `code: "INVALID_ARGUMENT"`・`error: "name が空です"`。どれも収録している種別の表とは照合しない。

空白だけの `name` は、[SPEC-EGOV-EXPLAIN-LAW-TYPE-004](#spec-egov-explain-law-type-004) の「前後の空白を除いてから照合する」の対象ではなく、照合の前に止まる。`found: false` の応答（[SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005)）ではない。
:::

<a id="spec-egov-explain-law-type-020"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-020 `see_also` は MCP クライアントから開ける GitHub の URL

::: details 詳細
`found: true` の応答（[SPEC-EGOV-EXPLAIN-LAW-TYPE-001](#spec-egov-explain-law-type-001)〜003）と `found: false` の応答（[SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005)）は、どちらも `see_also` に `https://github.com/shuji-bonji/houki-egov-mcp/blob/main/docs/LAW-HIERARCHY.md` を入れる。リポジトリの中の相対パス（`docs/LAW-HIERARCHY.md`）は、npm のパッケージに入らず MCP クライアントからは開けないので使わない。キーは消さない。

例: `name: "政令"` の `see_also` も `name: "架空法令"` の `see_also` も `https://github.com/shuji-bonji/houki-egov-mcp/blob/main/docs/LAW-HIERARCHY.md`（v0.16.0 では `docs/LAW-HIERARCHY.md`）。
:::

<a id="spec-egov-explain-law-type-021"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-021 `通知` は `通達` と別の種別として解説し、`通達` の別名に入れない

::: details 詳細
`通知` は、収録している種別の 1 つ（`info.name: "通知"`）として解説する。`通達` の `info.aliases` に `通知` を入れない。`name: "通知"` は、種別の名前の一致（[SPEC-EGOV-EXPLAIN-LAW-TYPE-001](#spec-egov-explain-law-type-001)）で `通知` の `info` を返す。

`通知` の `info` は、`enacting_body: "行政機関"`、`hierarchy_rank: 99`、`level: "agency-internal"`、`binds_citizens: false`、`can_set_penalties: false` を持つ。[SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005) の `hint` と [SPEC-EGOV-EXPLAIN-LAW-TYPE-014](#spec-egov-explain-law-type-014) の `next_actions` に並べる名前に `通知` を含める（今までどおり）。

例: `name: "通知"` は `found: true`・`info.name: "通知"`・`info.binds_citizens: false`（今までどおり）。`name: "通達"` の `info.aliases` は `["基本通達", "取扱通達"]`（v0.17.0 では `["通知", "基本通達", "取扱通達"]` で、`通知` で引くと `通達` ではなく `通知` の解説が返るのに、`通達` の別名に `通知` が載っていた）。
:::

<a id="spec-egov-explain-law-type-022"></a>

### SPEC-EGOV-EXPLAIN-LAW-TYPE-022 e-Gov の法令種別コード `Constitution`・`Rule` から、憲法・規則の解説を返す

::: details 詳細
`name` が `Constitution` のときは `憲法` の `info`、`Rule` のときは `規則` の `info` を返す（`found: true`。[SPEC-EGOV-EXPLAIN-LAW-TYPE-003](#spec-egov-explain-law-type-003) と同じ引き方）。e-Gov 法令 API v2 の `law_type` が返す値のうち、`ImperialOrder`（勅令）と `Misc` は、収録している種別に当たらないので今までどおり `found: false`（[SPEC-EGOV-EXPLAIN-LAW-TYPE-005](#spec-egov-explain-law-type-005)）。`ImperialOrdinance` も `found: false`。

e-Gov の `law_type` の値（2026-10-03 10:18 JST に `/laws?law_type=<値>&limit=1` で確かめた）: `Constitution`（1 件）・`Act`・`CabinetOrder`・`ImperialOrder`（74 件）・`MinisterialOrdinance`・`Rule`（453 件）は 200、`Misc` は 200 で 0 件、`ImperialOrdinance` は 400・`{"code":"400001","message":"法令種別（law_type、law_num_type）が誤っています。"}`。

例: `name: "Constitution"` は `found: true`・`info.name: "憲法"`。`name: "Rule"` は `found: true`・`info.name: "規則"`。v0.17.0 ではどちらも `found: false` だった。`name: "ImperialOrder"` は `found: false`（2026-10-03 10:19 JST に houki-egov-dev 0.17.0 でも `found: false`）。
:::

## まだ決めていないこと

仕様を書き起こしたときに見つかった項目のうち、扱いを決めている途中のものです。開くと、元の仕様書の記述をそのまま読めます。

::: details 仕様書の「未決」の節
初版起こしで見つけた、意図か不具合かを人が決める項目です。決まったら「できること」に ID を振るか、`specs/changes/` の差分にします。

意図か不具合かの判断が要る項目は houki-egov-mcp の Issue に移し、ここには題と Issue の番号だけを残します。今の振る舞いのままでよくテストが無いだけの項目は、受入テストを書いてから「できること」に ID を振ります。

3. **`found: true` の応答の `related_tools` と `see_also`、`info` の任意のフィールド。** → [SPEC-EGOV-EXPLAIN-LAW-TYPE-011](#spec-egov-explain-law-type-011)・[SPEC-EGOV-EXPLAIN-LAW-TYPE-012](#spec-egov-explain-law-type-012)・[SPEC-EGOV-EXPLAIN-LAW-TYPE-013](#spec-egov-explain-law-type-013)・[SPEC-EGOV-EXPLAIN-LAW-TYPE-020](#spec-egov-explain-law-type-020)
4. **`found: false` の応答の `next_actions` と `see_also`。** → [SPEC-EGOV-EXPLAIN-LAW-TYPE-014](#spec-egov-explain-law-type-014)・[SPEC-EGOV-EXPLAIN-LAW-TYPE-020](#spec-egov-explain-law-type-020)
5. **応答の `name` は渡した値のまま返す。** → [SPEC-EGOV-EXPLAIN-LAW-TYPE-015](#spec-egov-explain-law-type-015)
6. **大文字と小文字、全角と半角を区別する。** → [SPEC-EGOV-EXPLAIN-LAW-TYPE-016](#spec-egov-explain-law-type-016)
7. **`see_also` がリポジトリの中の相対パスで、MCP クライアントからは開けない。** → [SPEC-EGOV-EXPLAIN-LAW-TYPE-020](#spec-egov-explain-law-type-020)
8. **別名の一覧。** → [SPEC-EGOV-EXPLAIN-LAW-TYPE-017](#spec-egov-explain-law-type-017)
:::

## 承認の履歴

この機能の仕様が、いつ、どの変更で承認されたかを新しい順に並べています。各リポジトリの `npx spec-ids history explain_law_type` と同じ内容です。変更の名前から、変更の理由と前後の振る舞いを書いた文書（GitHub）を開けます。

::: details 承認の履歴（7 件）
| 承認日 | 版 | 変更 | 仕様 PR |
|---|---|---|---|
| 2026-10-03 | v0.18.0 | [検索の件数・0 件の案内・通称の展開・管轄外の略称、法令種別の解説、附則の別表の図の置き場所（段階 5 検索と解説と添付）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.0/specs/releases/v0.18.0/20261003-search-explain-attachment/proposal.md) | [#96](https://github.com/shuji-bonji/houki-egov-mcp/pull/96) |
| 2026-10-03 | v0.17.0 | [README・使い方・tool description と実際の動きの食い違いを、行ごとに直す（T5 文書と実装の食い違い）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.0/specs/releases/v0.17.0/20261003-t5-docs-mismatch/proposal.md) | [#92](https://github.com/shuji-bonji/houki-egov-mcp/pull/92) |
| 2026-10-01 | v0.16.0 | [引数の検査を inputSchema に書き、丸めずに `INVALID_ARGUMENT` にする（T1）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.0/specs/releases/v0.16.0/20261001-t1-argument-guards/proposal.md) | [#84](https://github.com/shuji-bonji/houki-egov-mcp/pull/84) |
| 2026-09-30 | v0.15.4 | [判断の要らない不具合 3 件の仕様（#73・#74・#75 の一括修正）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.0/specs/releases/v0.15.4/20260930-bugfix-batch/proposal.md) | [#81](https://github.com/shuji-bonji/houki-egov-mcp/pull/81) |
| 2026-09-28 | v0.15.2 | [テストが無いだけの振る舞いに仕様 ID を振る](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.0/specs/releases/v0.15.2/20260928-untested-behaviors/proposal.md) | [#76](https://github.com/shuji-bonji/houki-egov-mcp/pull/76) |
| 2026-09-28 | v0.15.2 | [「未決」のうち判断が要る 85 件を Issue に移す](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.0/specs/releases/v0.15.2/20260928-undecided-to-issues/proposal.md) | [#68](https://github.com/shuji-bonji/houki-egov-mcp/pull/68) |
| 2026-09-28 | — | 初版 | [#50](https://github.com/shuji-bonji/houki-egov-mcp/pull/50) |
:::

## 関連ページ

このページの元になった文書と、あわせて読むページです。

- [houki-egov-mcp の仕様の一覧](/specs/houki-egov/)
- [houki-egov-mcp の解説](/mcp/houki-egov)
- [リファレンスの explain_law_type](/reference/mcp/houki-egov#explain-law-type)
- [元の仕様書（GitHub、v0.20.0）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.0/specs/current/explain_law_type/spec.md)
