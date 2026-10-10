---
title: "abbreviationEntries — houki-abbreviations の仕様"
description: "houki-abbreviations の abbreviationEntries（全分野の略称辞書のエントリを 1 つの配列で渡す）の仕様。目的・入力・処理の流れと、仕様 ID ごとの仕様項目（specs/current から自動生成）"
---

# abbreviationEntries の仕様

<!-- GENERATED FILE — 手で編集しない。本文は houki-abbreviations の specs/current/abbreviation_entries/spec.md の写し。 -->

::: info
houki-abbreviations **v0.7.0** の `specs/current/abbreviation_entries/spec.md` から自動生成しました（仕様 ID 19 件・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

全分野の略称辞書のエントリを 1 つの配列で渡す

使いどころ・引数・実測の呼び出し例は、[値のページ](/reference/lib/houki-abbreviations/abbreviation_entries)にあります。

最後に仕様が変わったのは v0.7.0 の「辞書のエントリと公開定数を凍結する」（2026-09-30 承認）です。それまでの経緯は[承認の履歴](#承認の履歴)にあります。

## 利用者と得られる結果

この機能の利用者と、利用者が渡すもの・得られる結果を示します。

- houki-hub family の MCP サーバー（houki-egov-mcp、houki-nta-mcp など）。`abbreviationEntries` を import し、辞書の全エントリを走査して自分の管轄のエントリを取り出したり、独自の索引を作ったりする
- このパッケージの他の公開関数（`resolveAbbreviation`・`listByDomain`・`searchByName`・`lookupByLawId`・`validateAllEntries` など）。どれもこの配列を対象に動く
- 辞書にエントリを足す人。`src/data/<domain>.json` を編集し、テストでこの配列が約束を満たすことを確かめる

## 値

このパッケージが公開している値と、その中身です。

`readonly AbbreviationEntry[]`。1 要素が 1 つの法令・通達などを表す。関数ではないので引数は無い。

### 各エントリのフィールド

| フィールド        | 必須 | 内容                                                                                                                                                                                                                                                                               |
| ----------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abbr`            | 必須 | 略称・通称。例: `消法` / `民` / `消基通`。辞書全体で重複しない                                                                                                                                                                                                                     |
| `formal`          | 必須 | 正式名称。例: `消費税法` / `民法` / `消費税法基本通達`                                                                                                                                                                                                                             |
| `law_id`          | 必須 | e-Gov の法令 ID。e-Gov で確かめたものだけ入る。確かめていないもの、e-Gov に無いもの（通達など）は `null`。例: `363AC0000000108` / `321CONSTITUTION`                                                                                                                                |
| `law_num`         | 任意 | 法令番号（漢数字）。例: `昭和六十三年法律第百八号`                                                                                                                                                                                                                                 |
| `law_type`        | 任意 | e-Gov の法令種別。`Act` / `CabinetOrder` / `ImperialOrdinance` / `MinisterialOrdinance` / `Rule` のどれか。法令系のエントリにだけ付く。型では非推奨（`category` へ寄せる予定）                                                                                                     |
| `domain`          | 必須 | 分野。`DOMAINS` の値（`tax` / `labor` / `accounting` / `commercial` / `civil` / `administrative`）のどれか                                                                                                                                                                         |
| `category`        | 必須 | 文書の種類。`CATEGORIES` の値（`constitution` / `law` / `cabinet-order` / `imperial-ordinance` / `ministerial-ordinance` / `rule` / `kokuji` / `kihon-tsutatsu` / `kobetsu-tsutatsu` / `qa-jirei` / `tax-answer` / `hanrei` / `saiketsu`）のどれか。`kokuji`（告示）は v0.7.0 から |
| `source_mcp_hint` | 必須 | 本文を持つ MCP の名前。`SOURCE_MCP_HINTS` の値（`houki-egov` / `houki-nta` / `houki-mhlw` / `houki-jaish` / `houki-court` / `houki-saiketsu`）のどれか                                                                                                                             |
| `aliases`         | 任意 | 別名の配列。通称・関連制度名・正式名称の別表記など。例: 消費税法の `インボイス` / `軽減税率`。自分の `abbr` / `formal` と同じ値は入れない（018）。別のエントリの名前とも重ならない（017）                                                                                          |
| `note`            | 任意 | 備考の文                                                                                                                                                                                                                                                                           |

エントリは取得日時などの運用上の状態を持たない（鮮度の判定は `judgeStaleness` の担当）。

### 並び

分野ごとの JSON ファイルを `tax.json` → `labor.json` → `accounting.json` → `commercial.json` → `civil.json` → `administrative.json` の順に結合し、各ファイルの中はファイルに書かれた順のまま並ぶ。先頭は `所法`（所得税法）、末尾は `デジ庁設置法`。各ファイルのエントリの `domain` はファイル名と同じ値になっている（v0.6.0 で全件）。

### v0.7.0 の実数

以下は v0.7.0 の辞書を node で数えた値です。テストで固定している値ではありません（件数は約束にしない。[SPEC-ABBR-GET-ABBREVIATION-STATS-005](/specs/houki-abbreviations/get_abbreviation_stats#spec-abbr-get-abbreviation-stats-005)・006 は 0 件のキーだけを約束する）。

| 数え方                  | 件数                                                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 総数                    | 174                                                                                                                                                                    |
| 分野別                  | `tax` 35 / `labor` 28 / `accounting` 9 / `commercial` 31 / `civil` 23 / `administrative` 48                                                                            |
| カテゴリ別              | `law` 138 / `ministerial-ordinance` 16 / `cabinet-order` 8 / `kihon-tsutatsu` 8 / `rule` 2 / `kobetsu-tsutatsu` 1 / `constitution` 1。他の 6 種（`kokuji` を含む）は 0 |
| 管轄別                  | `houki-egov` 165 / `houki-nta` 9。他の 4 種は 0                                                                                                                        |
| `law_id` が入っている   | 9（`所法` / `法法` / `消法` / `労基法` / `育介法` / `会社` / `商` / `民` / `憲`）。残り 165 は `null`                                                                  |
| `law_num` が入っている  | 9（`law_id` が入っている 9 件と同じ）                                                                                                                                  |
| `law_type` が入っている | 164（入っていないのは houki-nta 管轄の 9 件と `憲`）                                                                                                                   |
| `aliases` が入っている  | 65（v0.6.1 の 94 から、自分の `formal` と同じ値だけを持っていた 29 件が `aliases` を持たなくなった）                                                                   |
| `note` が入っている     | 41                                                                                                                                                                     |

houki-nta 管轄の 9 件は `消基通` / `所基通` / `法基通` / `相基通` / `通基通` / `徴基通` / `措通` / `印基通`（以上 `kihon-tsutatsu`）と `電帳法取通`（`kobetsu-tsutatsu`）。9 件とも `domain: "tax"`、`law_id: null`。

## 扱わないこと

この機能が意図して扱わないことです。

- 名前からエントリを 1 件引くこと（`resolveAbbreviation`）
- 分野・カテゴリ・管轄で絞った一覧を返すこと（`listByDomain` / `listByCategory` / `listBySourceMcpHint`）
- 件数を集計すること（`getAbbreviationStats`）
- 部分一致・あいまい一致で探すこと（`searchByName` / `findSimilar` / `suggestCorrection`）
- `law_id` や法令番号から引くこと（`lookupByLawId` / `lookupByLawNum`）
- 辞書の整合性を検査した結果を返すこと（`validateAllEntries`）
- 実行中にエントリを足す・消す・差し替えること、エントリのフィールドを書き換えること（配列・各エントリ・`aliases` は凍結されている。エントリは `src/data/<domain>.json` を編集して次の版で出す）
- `law_id` が e-Gov に実在し、`formal` / `law_num` が e-Gov の値と一致することを保証すること。`scripts/verify-law-ids.mjs` が月次で e-Gov と突き合わせるが、開発用のスクリプトで、パッケージには含まれない（`package.json` の `files` は `dist` だけ）。`scripts/migrate.mjs`（houki-hub-mcp からの取り込み）と `scripts/copy-assets.mjs`（ビルド時に JSON を `dist/data/` へ写す）も同じく公開 API ではない
- 分野ごとの JSON ファイルを個別に import させること（`package.json` の `exports` は `.` だけ）
- 取得日時などの鮮度の情報を持つこと（各 MCP のローカル DB が持ち、判定は `judgeStaleness`）
- 通達・法令の本文を持つこと（本文は `source_mcp_hint` が示す MCP から取る）

## 処理の流れ

パッケージを読み込んだときに、この配列ができるまでを示します。図の中の番号は「できること」の仕様 ID の末尾 3 桁です。

```mermaid
flowchart TD
  A["src/data/ の分野ごとの JSON 6 ファイル"] --> B["tax → labor → accounting → commercial → civil → administrative の順に結合する（001）"]
  B --> C["配列・各エントリ・aliases を凍結する（010・019）"]
  C --> D["abbreviationEntries として公開する"]
  D --> E["辞書全体が満たす約束（002〜009、011、017・018）をテストで確かめる"]
```

## 仕様項目

この機能の仕様項目を、仕様 ID ごとに並べています。見出しは仕様項目を 1 文で表したもので、条件・応答の細部・例は「詳細」を開くと読めます。仕様 ID はそれぞれ受入テストと対応していて、テストの無い ID があると各リポジトリの CI が止まります。

<a id="spec-abbr-abbreviation-entries-001"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-001 6 分野すべてのエントリを 1 つの配列に持つ

::: details 詳細
`DOMAINS` の 6 分野（`tax` / `labor` / `accounting` / `commercial` / `civil` / `administrative`）のそれぞれについて、`domain` がその値のエントリを 1 件以上持つ。総数は 100 件を超える。

例: v0.6.0 では総数 174、最も少ない `accounting` でも 9 件。
:::

<a id="spec-abbr-abbreviation-entries-002"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-002 全エントリが必須フィールドを持ち、値は定義された一覧の中にある

::: details 詳細
どのエントリも `abbr` と `formal` が空でない文字列で、`domain` は `DOMAINS`、`category` は `CATEGORIES`、`source_mcp_hint` は `SOURCE_MCP_HINTS` のどれかの値を持つ。
:::

<a id="spec-abbr-abbreviation-entries-003"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-003 law_id が入っているときは e-Gov の法令 ID の形をしている

::: details 詳細
`law_id` が `null` でないエントリは、どれも `isValidLawId` が `true` を返す形をしている。

例: `363AC0000000108`（消費税法）、`321CONSTITUTION`（日本国憲法）。
:::

<a id="spec-abbr-abbreviation-entries-004"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-004 law_type が入っているときは e-Gov の法令種別のどれかである

::: details 詳細
`law_type` を持つエントリは、どれも `Act` / `CabinetOrder` / `ImperialOrdinance` / `MinisterialOrdinance` / `Rule` のどれかの値を持つ。
:::

<a id="spec-abbr-abbreviation-entries-005"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-005 abbr は全分野を通して重複しない

::: details 詳細
`abbr` の値は、6 つの JSON ファイルをまたいでも 2 件以上のエントリに現れない。
:::

<a id="spec-abbr-abbreviation-entries-006"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-006 law_type と category が対応している

::: details 詳細
`law_type` を持つエントリの `category` は、`law_type` に対応する次の値になっている。

| `law_type`             | `category`              |
| ---------------------- | ----------------------- |
| `Act`                  | `law`                   |
| `CabinetOrder`         | `cabinet-order`         |
| `ImperialOrdinance`    | `imperial-ordinance`    |
| `MinisterialOrdinance` | `ministerial-ordinance` |
| `Rule`                 | `rule`                  |
:::

<a id="spec-abbr-abbreviation-entries-007"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-007 日本国憲法のエントリを持つ

::: details 詳細
`category` が `constitution` のエントリがあり、その `formal` は `日本国憲法`、`law_id` は `321CONSTITUTION`。

例: `{ abbr: "憲", formal: "日本国憲法", law_id: "321CONSTITUTION", law_num: "昭和二十一年憲法", domain: "administrative", category: "constitution", source_mcp_hint: "houki-egov", aliases: ["憲法"] }`（v0.6.1 の `aliases` にあった `日本国憲法` は `formal` と同じ値なので、[SPEC-ABBR-ABBREVIATION-ENTRIES-018](#spec-abbr-abbreviation-entries-018) により外す）。
:::

<a id="spec-abbr-abbreviation-entries-008"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-008 houki-egov 管轄のエントリが houki-nta 管轄より多く、100 件を超える

::: details 詳細
`source_mcp_hint` が `houki-egov` のエントリの件数は、`houki-nta` のエントリの件数より多く、100 件を超える。

例: v0.6.0 では `houki-egov` 165 件、`houki-nta` 9 件。
:::

<a id="spec-abbr-abbreviation-entries-009"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-009 houki-nta 管轄のエントリは通達・告示系のカテゴリだけである

::: details 詳細
`source_mcp_hint` が `houki-nta` のエントリが 1 件以上あり、その `category` はどれも `kihon-tsutatsu` / `kobetsu-tsutatsu` / `kokuji` / `qa-jirei` / `tax-answer` のどれか。

例: `消基通` は `kihon-tsutatsu`、`電帳法取通` は `kobetsu-tsutatsu`。v0.6.1 の辞書に `kokuji` のエントリは無い。
:::

<a id="spec-abbr-abbreviation-entries-010"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-010 配列は凍結されていて要素を足せない

::: details 詳細
`abbreviationEntries` は `Object.isFrozen` が `true` を返す配列で、要素の追加・削除・差し替えはできない。

例: `abbreviationEntries.push({})` は `TypeError: Cannot add property 174, object is not extensible` を投げる。`abbreviationEntries[0] = {}` と `abbreviationEntries.length = 0` も `TypeError`。

要素（各エントリのオブジェクト）と `aliases` の配列も凍結されている（[SPEC-ABBR-ABBREVIATION-ENTRIES-019](#spec-abbr-abbreviation-entries-019)）。
:::

<a id="spec-abbr-abbreviation-entries-011"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-011 よく使われる通称・制度名を別名に持つ

::: details 詳細
次のエントリは、`aliases` に次の値を含む。

| `abbr`           | `aliases` に含む値                       |
| ---------------- | ---------------------------------------- |
| `消法`           | `インボイス` / `適格請求書` / `軽減税率` |
| `所法`           | `ふるさと納税` / `寄附金控除`            |
| `電帳法`         | `電子帳簿保存` / `電帳`                  |
| `マイナンバー法` | `マイナ` / `個人番号`                    |

これにより、略称・正式名称を知らずに通称で引いても、それぞれの法律のエントリに行き着く（引き方は `resolveAbbreviation` と `searchByName` の担当）。
:::

<a id="spec-abbr-abbreviation-entries-012"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-012 分野の JSON ファイルの順に結合し、ファイルの中の順を保って並ぶ

::: details 詳細
`abbreviationEntries` は、`src/data/tax.json` → `labor.json` → `accounting.json` → `commercial.json` → `civil.json` → `administrative.json` の順に各ファイルのエントリをつなげた並びになる。各ファイルの中のエントリは、ファイルに書かれた順のまま並ぶ。`searchByName` などが返す順は、この並びに従う。

例: v0.6.0 では先頭が `所法`（`tax.json` の先頭）、`labor` の最初のエントリ `労基法` は 36 番目（添字 35）、末尾が `デジ庁設置法`（`administrative.json` の末尾）。`searchByName("基通")` は `消基通` / `所基通` / `法基通` / `相基通` / `通基通` / `徴基通` / `印基通` を `tax.json` に書かれた順で返す。
:::

<a id="spec-abbr-abbreviation-entries-013"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-013 全エントリが law_id のキーを持ち、値は文字列か null である

::: details 詳細
どのエントリも `law_id` のキーを持ち、その値は文字列か `null` のどちらか。`undefined` のエントリやキーの無いエントリは無い。

例: `所法` の `law_id` は `"340AC0000000033"`、`消基通` の `law_id` は `null`。
:::

<a id="spec-abbr-abbreviation-entries-014"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-014 各エントリの domain は、そのエントリが書かれた JSON ファイルの名前と同じである

::: details 詳細
`src/data/<domain>.json` に書かれたエントリの `domain` は、どれもファイル名の `<domain>` と同じ値を持つ。

例: `tax.json` の `電帳法取通` は `domain: "tax"`、`administrative.json` の `憲` は `domain: "administrative"`。
:::

<a id="spec-abbr-abbreviation-entries-015"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-015 houki-nta 管轄のエントリは law_id が null である

::: details 詳細
`source_mcp_hint` が `houki-nta` のエントリは、どれも `law_id` が `null`。通達などは e-Gov の法令 ID を持たない。

例: `消基通`・`措通`・`電帳法取通` の `law_id` はどれも `null`。
:::

<a id="spec-abbr-abbreviation-entries-016"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-016 houki-egov 管轄のエントリは法令系のカテゴリだけである

::: details 詳細
`source_mcp_hint` が `houki-egov` のエントリの `category` は、どれも `constitution` / `law` / `cabinet-order` / `imperial-ordinance` / `ministerial-ordinance` / `rule` のどれか。

例: `憲` は `constitution`、`所法` は `law`。v0.6.0 では `imperial-ordinance` のエントリは無い。
:::

<a id="spec-abbr-abbreviation-entries-017"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-017 名前は別のエントリの間で重ならない

::: details 詳細
どのエントリの `abbr`・`formal`・`aliases` の値も、`normalizeJpText` を通した後で比べて、別のエントリの `abbr`・`formal`・`aliases` のどの値とも同じにならない。名前から 1 件を返す関数（`resolveAbbreviation` / `getAllNames` / `findSimilar` の `distance: 0`）が、どの名前でも 1 件に決まる。`validateAllEntries` はこの約束の違反を `duplicate_name`（`abbr` どうしは `duplicate_abbr`）のエラーにする。

例: v0.6.1 の辞書 174 件の名前 482 個（重なりを除いて 416 個）は、エントリをまたいで重なるものが 0 件（`normalizeJpText` を通した後も 0 件）。`aliases: ["消費税法"]` を持つ別のエントリを足すと違反になる（`消費税法` は `消法` の `formal`）。
:::

<a id="spec-abbr-abbreviation-entries-018"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-018 aliases に自分の abbr・formal と同じ値を入れない

::: details 詳細
どのエントリの `aliases` にも、そのエントリの `abbr` や `formal` と同じ値は入れない。`abbr` と `formal` が同じ値であることは許す（`酒税法` など 33 件）。`validateAllEntries` はこの約束の違反を `alias_equals_own_name` のエラーにする。

例: v0.6.1 の `消基通` は `formal: "消費税法基本通達"` で `aliases: ["消費税法基本通達"]` だったが、0.7.0 では `aliases` を持たない。v0.6.1 で `aliases` に自分の `formal` を持つエントリは 33 件（`消基通` `所基通` `法基通` `相基通` `通基通` `徴基通` `措通` `印基通` `最賃法` `社労士法` `会社` `会社規` `商` `商登法` `金商法` `不競法` `消契法` `民` `民訴` `破` `不登` `住民台帳法` `人訴` `憲` `国賠法` `刑` `都計法` `司書法` `行書法` `大防法` `水濁法` `電通事業法` `デジ庁設置法`）で、実装 PR で直す。
:::

<a id="spec-abbr-abbreviation-entries-019"></a>

### SPEC-ABBR-ABBREVIATION-ENTRIES-019 各エントリと aliases は凍結されていて、代入は TypeError になる

::: details 詳細
`abbreviationEntries` の各要素（エントリのオブジェクト）と、その `aliases` の配列は、`Object.isFrozen` が `true` を返す。フィールドへの代入・追加・削除と `aliases` への追加は、strict mode（ES モジュール、TypeScript の出力）では `TypeError` を投げ、値は変わらない。名前から引く関数（`resolveAbbreviation` / `lookupByLawId` / `lookupByLawNum`）と一覧を返す関数（`listByDomain` / `listByCategory` / `listBySourceMcpHint` / `searchByName`、`findSimilar` の `entry`、`extractLawNames` の `entry`）が返すエントリは、この配列の要素そのもの（同じオブジェクト）なので、同じく凍結されている。

例: `Object.isFrozen(abbreviationEntries[0])` と `Object.isFrozen(resolveAbbreviation('消法'))` と `Object.isFrozen(resolveAbbreviation('消法').aliases)` は、どれも `true`。`abbreviationEntries[0].formal = 'X'` は `TypeError` を投げ、その後の `resolveAbbreviation('所法').formal` は `'所得税法'` のまま（v0.6.1 では代入が通り、`'X'` になっていた）。`resolveAbbreviation('消法').aliases.push('x')` は `TypeError`。`delete resolveAbbreviation('消法').note` も `TypeError`。`listByDomain('tax')` が返す配列そのものは呼ぶたびに新しく、凍結されていない（[SPEC-ABBR-LIST-BY-DOMAIN-004](/specs/houki-abbreviations/list_by_domain#spec-abbr-list-by-domain-004)）。
:::

## 検討中のこと

仕様を書き起こしたときに見つかった項目のうち、扱いを Issue で検討しているものです。ここに挙げたことは、今後の版で変わることがあります。開くと、元の仕様書の記述をそのまま読めます。

::: details 仕様書の「未決」の節
初版起こしで見つけた、意図か不具合かを人が決める項目です。決まったら「できること」に ID を振るか、`specs/changes/` の差分にします。

意図か不具合かの判断が要る項目は houki-abbreviations の Issue に移し、ここには題と Issue の番号だけを残します。今の振る舞いのままでよくテストが無いだけの項目は、受入テストを書いてから「できること」に ID を振ります。

1. **エントリのオブジェクトが凍結されていない。** → [SPEC-ABBR-ABBREVIATION-ENTRIES-019](#spec-abbr-abbreviation-entries-019)
2. **略称・正式名称・別名が別のエントリの間で重複しないこと。** → [SPEC-ABBR-ABBREVIATION-ENTRIES-017](#spec-abbr-abbreviation-entries-017)
3. **並びの順。** → [SPEC-ABBR-ABBREVIATION-ENTRIES-012](#spec-abbr-abbreviation-entries-012)
4. **`law_id` フィールドが全エントリにあること。** → [SPEC-ABBR-ABBREVIATION-ENTRIES-013](#spec-abbr-abbreviation-entries-013)
5. **各エントリの `domain` が JSON のファイル名と同じであること。** → [SPEC-ABBR-ABBREVIATION-ENTRIES-014](#spec-abbr-abbreviation-entries-014)
6. **管轄とカテゴリ・`law_id` の組み合わせ。** → [SPEC-ABBR-ABBREVIATION-ENTRIES-015](#spec-abbr-abbreviation-entries-015)、[SPEC-ABBR-ABBREVIATION-ENTRIES-016](#spec-abbr-abbreviation-entries-016)（`law_num` を持つのが `law_id` を持つエントリだけであること、houki-nta 管轄の `domain` は約束にしない）
7. **件数を約束にするか。** → [SPEC-ABBR-GET-ABBREVIATION-STATS-005](/specs/houki-abbreviations/get_abbreviation_stats#spec-abbr-get-abbreviation-stats-005)、[SPEC-ABBR-GET-ABBREVIATION-STATS-006](/specs/houki-abbreviations/get_abbreviation_stats#spec-abbr-get-abbreviation-stats-006)（実数は約束にしない）
8. **別名に正式名称と同じ値を入れているエントリ。** → [SPEC-ABBR-ABBREVIATION-ENTRIES-018](#spec-abbr-abbreviation-entries-018)
9. **ドキュメントの記述が今の辞書と合わない。** → houki-abbreviations #17
:::

## 承認の履歴

この機能の仕様が、いつ、どの変更で承認されたかを新しい順に並べています。各リポジトリの `npx spec-ids history abbreviation_entries` と同じ内容です。変更の名前から、変更の理由と前後の振る舞いを書いた文書（GitHub）を開けます。

::: details 承認の履歴（5 件）
| 承認日 | 版 | 変更 | 仕様 PR |
|---|---|---|---|
| 2026-09-30 | v0.7.0 | [辞書のエントリと公開定数を凍結する](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/releases/v0.7.0/20261001-freeze/proposal.md) | [#33](https://github.com/shuji-bonji/houki-abbreviations/pull/33) |
| 2026-09-30 | v0.7.0 | [辞書の約束（名前の重なり・別名・告示）と、件数・近さの決め方](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/releases/v0.7.0/20261001-dictionary-rules/proposal.md) | [#32](https://github.com/shuji-bonji/houki-abbreviations/pull/32) |
| 2026-09-27 | v0.6.1 | [テストが無いだけの振る舞いに仕様 ID を振る](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/releases/v0.6.1/20260927-untested-behaviors/proposal.md) | [#27](https://github.com/shuji-bonji/houki-abbreviations/pull/27) |
| 2026-09-27 | v0.6.1 | [「未決」のうち判断が要る 52 件を Issue に移す](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/releases/v0.6.1/20260927-undecided-to-issues/proposal.md) | [#26](https://github.com/shuji-bonji/houki-abbreviations/pull/26) |
| 2026-09-27 | — | 初版 | [#10](https://github.com/shuji-bonji/houki-abbreviations/pull/10) |
:::

## 関連ページ

このページの元になった文書と、あわせて読むページです。

- [houki-abbreviations の仕様の一覧](/specs/houki-abbreviations/)
- [houki-abbreviations の解説](/lib/houki-abbreviations)
- [abbreviationEntries の値のページ（リファレンス）](/reference/lib/houki-abbreviations/abbreviation_entries)
- [元の仕様書（GitHub、v0.7.0）](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/current/abbreviation_entries/spec.md)
