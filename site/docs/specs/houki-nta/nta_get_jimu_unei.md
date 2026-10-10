---
title: "nta_get_jimu_unei — houki-nta-mcp の仕様"
description: "houki-nta-mcp の nta_get_jimu_unei（事務運営指針を 1 件取得する）の仕様。目的・入力・処理の流れと、仕様 ID ごとの仕様項目（specs/current から自動生成）"
---

# nta_get_jimu_unei の仕様

<!-- GENERATED FILE — 手で編集しない。本文は houki-nta-mcp の specs/current/nta_get_jimu_unei/spec.md の写し。 -->

::: info
houki-nta-mcp **v0.27.0** の `specs/current/nta_get_jimu_unei/spec.md` から自動生成しました（仕様 ID 11 件・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

事務運営指針を 1 件取得する

使いどころ・引数・実測の呼び出し例は、[ツールのページ](/reference/mcp/houki-nta/nta_get_jimu_unei)にあります。

最後に仕様が変わったのは v0.26.0 の「ローカル DB を開けないときの読むだけのツールと書き戻すツールの応答、`--bulk-download-tax-answer` が索引を保存できないときの終わり方（nta #144・#145）」（2026-10-06 承認）です。それまでの経緯は[承認の履歴](#承認の履歴)にあります。

## 利用者と得られる結果

この機能の利用者と、利用者が渡すもの・得られる結果を示します。

- MCP クライアント（Claude などの LLM、または CLI から呼ぶ人）。`docId` を渡して、ローカル DB に取り込んである国税庁の事務運営指針 1 件の本文と添付 PDF の一覧を受け取る

## 入力

呼び出すときに渡す値です。

| 引数     | 必須 | 内容                                                                                                                                                       |
| -------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docId`  | 必須 | 文書 ID。例: `"shotoku/shinkoku/170331"` / `"sozoku/170111_1"`。`nta_search_jimu_unei` の結果や、見つからなかったときの応答の `available_doc_ids` から取る。空文字・空白だけは不可（009）。形は 010。全角の数字・ダッシュ類は半角に揃えてから読む（011） |
| `format` | 任意 | `markdown`（既定）または `json`                                                                                                                            |

このツールはローカル DB だけを引く。事務運営指針は `--bulk-download-jimu-unei` で DB に入れておく。

## 扱わないこと

この機能が意図して扱わないことです。

- 国税庁サイトから事務運営指針を取ること（DB に無い文書はエラーになる。DB に入れるのは `--bulk-download-jimu-unei`）
- 取得した文書を DB に書き戻すこと（ローカル DB だけを引くので書き戻しは起きない）
- 題名やキーワードから docId を探すこと（探すのは `nta_search_jimu_unei`）
- 添付 PDF の本文を読むこと（URL と種別・読み方の案内を返すだけ。読むのは pdf-reader-mcp などの PDF 読み取りツール、表のメタ情報は `nta_inspect_pdf_meta`）
- 事務運営指針が今も有効かどうか、改正されているかを判定すること

## 処理の流れ

呼び出しを受けてから応答を返すまでに、何をどの順で確かめるかを示します。図の中の番号は「できること」の仕様 ID の末尾 3 桁です。

```mermaid
flowchart TD
  A["呼び出し（docId・format）"] --> W{"docId が空白だけでなく、全角を半角に揃えて受け付ける形か（009・010・011）"}
  W -- いいえ --> E0["DB を引かずに INVALID_ARGUMENT を返す（009・010）"]
  W -- はい --> B{"その docId の事務運営指針がローカル DB にあるか"}
  B -- 無い --> D{"DB に事務運営指針が 1 件でもあるか"}
  D -- 1 件も無い --> E1["DOC_NOT_FOUND と bulk download の案内を返す（001）"]
  D -- ある --> E2["DOC_NOT_FOUND と available_doc_ids・nta_search_jimu_unei の案内を返す（002）"]
  B -- ある --> C["DB の内容をそのまま使う（003。国税庁サイトには取りに行かない）"]
  C --> F{"国税庁の索引から外れているか（004）"}
  F -- はい --> G["索引から外れた印を付ける（004。json は index_status・orphaned_at・notice、markdown は索引の状態の行と注記）"]
  F -- いいえ --> H{"format"}
  G --> H
  H -- markdown --> I["markdown の文字列を返す（003・006。添付 PDF の節は 007）"]
  H -- json --> J["document を持つオブジェクトを返す（003・005。attachedPdfs は 007）"]
```

## 仕様項目

この機能の仕様項目を、仕様 ID ごとに並べています。見出しは仕様項目を 1 文で表したもので、条件・応答の細部・例は「詳細」を開くと読めます。仕様 ID はそれぞれ受入テストと対応していて、テストの無い ID があると各リポジトリの CI が止まります。

<a id="spec-nta-get-jimu-unei-001"></a>

### SPEC-NTA-GET-JIMU-UNEI-001 事務運営指針が DB に 1 件も無いときは投入を案内する

::: details 詳細
ローカル DB に事務運営指針が 1 件も無い（別の種別の文書しか無い DB、DB のファイルが無い・版の記録が無い・版が合わない・開けない場合を含む）ときは、エラー `DOC_NOT_FOUND` を返す。国税庁サイトには取りに行かない。

- `error` は `ローカル DB に事務運営指針が 1 件も無いため、docId="<docId>" を取得できません`
- `hint` は DB の状態ごとの文（[SPEC-NTA-DB-SCHEMA-029](/specs/houki-nta/db_schema#spec-nta-db-schema-029)。`<種別>` は `事務運営指針`、フラグは `--bulk-download-jimu-unei`）。どの文も開こうとした DB のパスを含む
- `next_actions` は `cli_bulk_download` の 1 件で、`example.command` は `--bulk-download-jimu-unei` を付けた案内のコマンド（[SPEC-NTA-DB-SCHEMA-027](/specs/houki-nta/db_schema#spec-nta-db-schema-027)）。版が新しい・読めない DB と、開けない DB では入れない（[SPEC-NTA-DB-SCHEMA-021](/specs/houki-nta/db_schema#spec-nta-db-schema-021)・029）
- `tool` は `nta_get_jimu_unei`。`available_doc_ids` は付けない
- 開けない DB では `retryable: false` と `detail.cause` も付ける（[SPEC-NTA-DB-SCHEMA-029](/specs/houki-nta/db_schema#spec-nta-db-schema-029)。v0.25.x では [SPEC-NTA-COMMON-ERRORS-006](/specs/houki-nta/common_errors#spec-nta-common-errors-006) の `INTERNAL_ERROR` だった）

v0.21.3 では code が `TSUTATSU_NOT_FOUND` だった。文書系 3 ツールで `DOC_NOT_FOUND` に揃えた（houki-nta-mcp #64、[SPEC-NTA-COMMON-ERRORS-016](/specs/houki-nta/common_errors#spec-nta-common-errors-016)）。

例: `HOUKI_NTA_DB_PATH=/Users/bonji/.cache/houki-nta-mcp/cache.v12.db` で起動し（ホームディレクトリが `/Users/bonji`）、そのファイルが無いときに `{ docId: "shotoku/000101" }` を渡すと、`hint` は ``HOUKI_NTA_DB_PATH が指すファイル（~/.cache/houki-nta-mcp/cache.v12.db）がありません。HOUKI_NTA_DB_PATH を投入した DB のファイルに直すか、`HOUKI_NTA_DB_PATH="$HOME/.cache/houki-nta-mcp/cache.v12.db" npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-jimu-unei` でこのパスに事務運営指針を投入してください``（v0.24.x では `MCP サーバーが開いている DB（/Users/bonji/.cache/houki-nta-mcp/cache.v12.db）に事務運営指針（doc_type="jimu-unei"）が入っていません。…`）。
:::

<a id="spec-nta-get-jimu-unei-002"></a>

### SPEC-NTA-GET-JIMU-UNEI-002 事務運営指針はあるが docId が無いときは「見つかりません」と候補を返す

::: details 詳細
ローカル DB に事務運営指針はあるが、その `docId` の文書が無いときは、エラー `DOC_NOT_FOUND` を返す。投入を勧める文言（「未投入」）は使わない。

- `error` は `事務運営指針 docId="<docId>" は見つかりません`
- `hint` に、DB にある事務運営指針の件数（例: `DB の事務運営指針 32 件に、この docId はありません`）、`available_doc_ids` から選ぶか `nta_search_jimu_unei` で探す案内、DB を投入した後に公開された文書は `` `<コマンド>` `` をもう一度実行すると取り込める旨を書く。`<コマンド>` は `--bulk-download-jimu-unei` を付けた案内のコマンド（[SPEC-NTA-DB-SCHEMA-027](/specs/houki-nta/db_schema#spec-nta-db-schema-027)）
- `available_doc_ids` に、DB にある事務運営指針を新しい順に最大 30 件入れる。要素は `docId`・`title`・`issuedAt`。他の種別（改正通達・文書回答事例など）の docId は入れない
- `next_actions` は `{ action: "nta_search_jimu_unei", reason: "キーワード検索で正しい docId を探せます" }` の 1 件
- `tool` は `nta_get_jimu_unei`

v0.21.3 では code が `TSUTATSU_NOT_FOUND` だった。文書系 3 ツールで `DOC_NOT_FOUND` に揃えた（houki-nta-mcp #64、[SPEC-NTA-COMMON-ERRORS-016](/specs/houki-nta/common_errors#spec-nta-common-errors-016)）。

例: 環境変数を付けずに起動すると、`hint` の末尾は ``DB を投入した後に国税庁が公開した文書は、`npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download-jimu-unei` をもう一度実行すると取り込めます``（v0.24.x では `houki-nta-mcp --bulk-download-jimu-unei`）。
:::

<a id="spec-nta-get-jimu-unei-003"></a>

### SPEC-NTA-GET-JIMU-UNEI-003 ローカル DB にある事務運営指針を返す

::: details 詳細
その `docId` の事務運営指針がローカル DB にあるときは、エラーを返さずその内容を返す。`format` を省けば markdown の文字列、`json` なら `document` を持つオブジェクトである。国税庁サイトには取りに行かず、DB の内容をそのまま返す（`fetchedAt` は DB に入れたときの日時のまま）。
:::

<a id="spec-nta-get-jimu-unei-004"></a>

### SPEC-NTA-GET-JIMU-UNEI-004 国税庁の索引から消えた文書に印を付け、索引にある文書では印のキーを null にする

::: details 詳細
DB から返す文書が国税庁の索引から外れている（bulk download で外れたことを確認した日時が付いている）ときは、応答に印を付ける。

- `format` が `json` のとき: `index_status: "removed_from_index"`、`orphaned_at`（確認した日時。例: `"2026-10-01T00:30:00Z"`）、`notice`（索引から外れている旨と、過去の課税期間では意味を持つ場合があること、現在の取扱いは最新の通達で確かめること、出典 URL が 404 になることがあることの注記）を付ける。`document.orphanedAt` にも同じ日時が入る。索引にある文書では、`index_status`・`orphaned_at`・`notice`・`document.orphanedAt` をどれも `null` にする（キーは無くならない）
- `format` を省くか `markdown` のとき: 文書の先頭の情報に `- **索引の状態**: removed_from_index（<確認した日時> に確認）` の行と、`>` で始まる注記の行を入れる。索引にある文書ではこの行を入れない

例: 索引にある事務運営指針を `format: "json"` で取ると、`index_status: null`・`orphaned_at: null`・`notice: null`・`document.orphanedAt: null` を持つ（v0.22.0 ではどのキーも無かった）。
:::

<a id="spec-nta-get-jimu-unei-005"></a>

### SPEC-NTA-GET-JIMU-UNEI-005 json の応答

::: details 詳細
`format` を `json` にしたとき、応答は次のフィールドを持つ。値の無いフィールドは `null` にし、キーは無くさない。

| フィールド | 内容 |
|---|---|
| `document.docType` | `jimu-unei` |
| `document.docId` / `document.taxonomy` / `document.title` | 文書 ID・税目・題名 |
| `document.issuedAt` / `document.issuer` | 発出日（`YYYY-MM-DD`）と宛先・発出者。DB に無ければ `null` |
| `document.sourceUrl` / `document.fetchedAt` | 出典 URL と DB に入れた日時 |
| `document.orphanedAt` | 索引から消えたことを確認した日時。索引にある文書では `null`（[SPEC-NTA-GET-JIMU-UNEI-004](#spec-nta-get-jimu-unei-004)） |
| `document.fullText` | 本文 |
| `document.attachedPdfs` | 添付 PDF の配列（[SPEC-NTA-GET-JIMU-UNEI-007](#spec-nta-get-jimu-unei-007)） |
| `index_status` / `orphaned_at` / `notice` | [SPEC-NTA-GET-JIMU-UNEI-004](#spec-nta-get-jimu-unei-004)。索引にある文書では `null` |
| `legal_status` | `binds_citizens: false` / `binds_courts: false` / `binds_tax_office: true` と、`note: "通達・事務運営指針は行政内部文書であり、納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"`。`nta_search_jimu_unei`（[SPEC-NTA-SEARCH-JIMU-UNEI-002](/specs/houki-nta/nta_search_jimu_unei#spec-nta-search-jimu-unei-002)・003）と `nta_inspect_pdf_meta` の `docType: "jimu-unei"`（[SPEC-NTA-INSPECT-PDF-META-016](/specs/houki-nta/nta_inspect_pdf_meta#spec-nta-inspect-pdf-meta-016)）も同じ値 |
| `source` | `db` |

例: 発出日と宛先が DB に無い事務運営指針では、`document.issuedAt: null`・`document.issuer: null`（v0.22.0 ではどちらのキーも無かった）。`{ docId: "shozei/090401", format: "json" }` の `legal_status.note` は `通達・事務運営指針は行政内部文書であり、` で始まる（2026-10-03 JST に plugin の houki-nta-mcp 0.23.0 で確かめた。houki-nta-mcp #131）。
:::

<a id="spec-nta-get-jimu-unei-006"></a>

### SPEC-NTA-GET-JIMU-UNEI-006 markdown（既定）の応答

::: details 詳細
`format` を省くか `markdown` にしたとき、応答は次の順に並ぶ文字列である。

- 見出し `# <題名>`
- `- **種別**: 事務運営指針`、`- **発出日**: <発出日>`（DB にあるときだけ）、`- **税目**: <税目>`（DB にあるときだけ）、`` - **docId**: `<docId>` ``、`- **出典**: <国税庁ページの URL>`、`- **取得**: <DB に入れた日時>`、`- **取得元**: ローカル DB（bulk download で取り込んだもの）` の行
- 国税庁の索引から消えた文書では、索引の状態の行と注記（[SPEC-NTA-GET-JIMU-UNEI-004](#spec-nta-get-jimu-unei-004)）
- 宛先・発出者が DB にある文書では `## 宛先・発出者` の節。各行を `> ` で引用する
- `## 本文` の節と本文
- 添付 PDF がある文書では `## 添付 PDF (<件数> 件)` の節（[SPEC-NTA-GET-JIMU-UNEI-007](#spec-nta-get-jimu-unei-007)）
- 最後に `---` と、`*通達・事務運営指針は行政内部文書であり、納税者・裁判所への直接的拘束力なし（最高裁 昭和43.12.24）*` の注

「取得元」の行は、`nta_get_qa` / `nta_get_tax_answer` の markdown の `取得元:` の行（ローカル DB か国税庁サイトか）に合わせて置く。このツールは DB だけを引くので、値は常に `ローカル DB（bulk download で取り込んだもの）` である（v0.22.0 ではこの行が無かった）。
:::

<a id="spec-nta-get-jimu-unei-007"></a>

### SPEC-NTA-GET-JIMU-UNEI-007 添付 PDF の一覧を返す

::: details 詳細
json では `document.attachedPdfs` に、DB にある添付 PDF を入れる。要素は `title`・`url`・`sizeKb`・`kind`。`kind` は全要素に付く（DB に無ければ [SPEC-NTA-GET-JIMU-UNEI-008](#spec-nta-get-jimu-unei-008) で題名から決める）。添付が無ければ空の配列。

markdown では、添付 PDF がある文書に限り、`## 本文` の後に `## 添付 PDF (<件数> 件)` の節を置く。節の中身は次のとおり。

- PDF の本文はこのサーバーが読まないことと、pdf-reader-mcp の `read_url` か、`nta_inspect_pdf_meta` を `save: true` で呼んで `extract_tables` に渡す読み方の案内（`>` の引用）
- 種別・タイトル・サイズ・読み方・URL の表（種別は [SPEC-NTA-GET-JIMU-UNEI-008](#spec-nta-get-jimu-unei-008) で補った後のもの）。行は種別の順（新旧対照表・別紙・Q&A・参考資料・通知・その他）で、同じ種別の中は DB に入っている順
- `### 読み方` の節。表に現れた種別ごとに 1 行ずつ、その種別の PDF の読み方（`nta_inspect_pdf_meta` の `layout_note` と同じ文。[SPEC-NTA-INSPECT-PDF-META-005](/specs/houki-nta/nta_inspect_pdf_meta#spec-nta-inspect-pdf-meta-005)）
:::

<a id="spec-nta-get-jimu-unei-008"></a>

### SPEC-NTA-GET-JIMU-UNEI-008 kind の無い添付 PDF は題名から kind を決めて返す

::: details 詳細
DB に入っている添付 PDF に `kind` が無い（v0.6.0 期に投入した文書）ときは、題名から `kind` を決めて応答に入れる。判定は `nta_inspect_pdf_meta` の [SPEC-NTA-INSPECT-PDF-META-003](/specs/houki-nta/nta_inspect_pdf_meta#spec-nta-inspect-pdf-meta-003) と同じ（「新旧対照表」「新旧対応表」「対比表」は `comparison`、「Q&A」「質疑応答」「FAQ」は `qa-pdf`、「別紙」「別表」「様式」「付録」「添付資料」は `attachment`、「通知」「お知らせ」「連絡」は `notice`、「参考」「参考資料」「関連資料」は `related`、どれにも当たらなければ `unknown`）。改正通達の「別紙 N」を `comparison` に付け替える扱い（[SPEC-NTA-GET-KAISEI-TSUTATSU-007](/specs/houki-nta/nta_get_kaisei_tsutatsu#spec-nta-get-kaisei-tsutatsu-007)）は nta_get_jimu_unei では行わない（`docType` が `kaisei` でないため）。json の `document.attachedPdfs` の全要素に `kind` が付き、markdown の表と `### 読み方` では決めた種別の行になる（「その他」になるのは `unknown` のときだけ）。DB の内容は書き換えない。

例: `kind` の無い「参考資料」「別紙1」「Q&A」を持つ事務運営指針を `json` で取ると、`document.attachedPdfs` の `kind` は順に `related`・`attachment`・`qa-pdf`。markdown の表には「別紙」「Q&A」「参考資料」の行があり、「その他」の行は無い。同じ文書を `nta_inspect_pdf_meta` で見たときと `kind` が一致する。
:::

<a id="spec-nta-get-jimu-unei-009"></a>

### SPEC-NTA-GET-JIMU-UNEI-009 docId が空文字・空白だけのときはDBを引かずに `INVALID_ARGUMENT` を返す

::: details 詳細
空文字は inputSchema の `minLength: 1` の検査（[SPEC-NTA-COMMON-ERRORS-013](/specs/houki-nta/common_errors#spec-nta-common-errors-013)）で止まり、`INVALID_ARGUMENT`（`tool: "nta_get_jimu_unei"`、`detail.issues: [{ path: "docId", message: "空文字は指定できません" }]`）を返す。空白（半角スペース・全角スペース・タブ・改行）だけのときは、ツールの処理がDBを引く前に、[SPEC-NTA-COMMON-ERRORS-014](/specs/houki-nta/common_errors#spec-nta-common-errors-014) の形の `INVALID_ARGUMENT`（`tool: "nta_get_jimu_unei"`、`error: "docId が空です"`、`detail.issues: [{ path: "docId", message: "空白だけは指定できません" }]`、`hint` に`nta_search_jimu_unei` の結果か `available_doc_ids` の `docId`を渡すよう書く）を返す。

例: `docId: ""` は `code: "INVALID_ARGUMENT"`・`detail.issues[0].message: "空文字は指定できません"`。`docId: "　"`（全角スペース）と `docId: " \n"` は `code: "INVALID_ARGUMENT"`・`error: "docId が空です"`。どれもDBは引かない。
:::

<a id="spec-nta-get-jimu-unei-010"></a>

### SPEC-NTA-GET-JIMU-UNEI-010 `docId` が受け付ける形でないときは DB を引かずに `INVALID_ARGUMENT` を返す

::: details 詳細
`docId` は、国税庁サイトの事務運営指針のページの URL（`…/law/jimu-unei/<フォルダー>/…/index.htm`）のフォルダーの並びで、`/` で区切った 2 つ以上の要素からなる。先頭の要素（税目フォルダー）は英小文字・半角の数字・`-`、2 つ目以降の要素は英小文字・半角の数字・`-`・`_` だけからなる（[SPEC-NTA-COMMON-ERRORS-015](/specs/houki-nta/common_errors#spec-nta-common-errors-015)）。フォルダー名の付け方は税目や年代によって違う（`shotoku/shinkoku/170331`・`sozoku/170111_1`・`hojin/000703-3`・`sonota/1912` など）ので、数字の桁数は確かめない。前後の空白を除き、半角に揃えた（[SPEC-NTA-GET-JIMU-UNEI-011](#spec-nta-get-jimu-unei-011)）値がこの形でないときは、DB を引く前に `INVALID_ARGUMENT`（`tool: "nta_get_jimu_unei"`、`error: "docId の形が受け付ける形ではありません: <渡した値>"`、`detail.issues: [{ path: "docId", message: "税目/…/フォルダー名 の形で、英小文字・数字・-・_ だけで指定してください（例: shotoku/shinkoku/170331）" }]`、`hint` に `nta_search_jimu_unei` の結果か `available_doc_ids` の `docId` をそのまま渡すよう書く）を返す。`DOC_NOT_FOUND` は、形に合うが DB にその文書が無いときだけになる。

例: `docId: "shotoku/shinkoku/170331"`・`"sozoku/170111_1"`・`"hojin/000703-3"`・`"sonota/1912"` は検査を通り、DB を引く。`docId: "170331"`（要素が 1 つ）・`"/shotoku/170331"`（先頭が `/`）・`"shotoku/"`（末尾が `/`）・`"shotoku/shinkoku/170331/index.htm"`（`.` を含む）・`"shotoku/申告/170331"`（漢字）は `code: "INVALID_ARGUMENT"`・`detail.issues[0].path: "docId"` で、DB は引かない（v0.21.3 では DB を引いてから「見つかりません」の応答になっていた）。
:::

<a id="spec-nta-get-jimu-unei-011"></a>

### SPEC-NTA-GET-JIMU-UNEI-011 `docId` は半角に揃えてから形を確かめる

::: details 詳細
`docId` は、前後の空白を除いた値を houki-abbreviations の `normalizeJpText` の規則（全角英数字を半角に、ダッシュ類 `－` `‐` `‑` `–` `—` `―` `−` を `-` に、全角チルダ `～` `〜` を `~` に、全角空白を半角空白にし、前後の空白を除く。罫線 `─` と長音 `ー` は変えない。大文字と小文字は区別する）で揃えてから、[SPEC-NTA-GET-JIMU-UNEI-010](#spec-nta-get-jimu-unei-010) の形の検査に進む（[SPEC-NTA-SEARCH-RULES-019](/specs/houki-nta/search_rules#spec-nta-search-rules-019)）。揃えた後の値で DB を引き、国税庁サイトの URL を組み立てる。

例: `{ docId: "shotoku/shinkoku/１７０３３１" }` は `{ docId: "shotoku/shinkoku/170331" }` と同じ応答（v0.21.3 では全角のまま DB を引いて「見つかりません」だった）。
:::

## 検討中のこと

仕様を書き起こしたときに見つかった項目のうち、扱いを Issue で検討しているものです。ここに挙げたことは、今後の版で変わることがあります。開くと、元の仕様書の記述をそのまま読めます。

::: details 仕様書の「未決」の節
初版起こしで見つけた、意図か不具合かを人が決める項目です。決まったら「できること」に ID を振るか、`specs/changes/` の差分にします。

意図か不具合かの判断が要る項目は houki-nta-mcp の Issue に移し、ここには題と Issue の番号だけを残します。今の振る舞いのままでよくテストが無いだけの項目は、受入テストを書いてから「できること」に ID を振ります。
:::

## 承認の履歴

この機能の仕様が、いつ、どの変更で承認されたかを新しい順に並べています。各リポジトリの `npx spec-ids history nta_get_jimu_unei` と同じ内容です。変更の名前から、変更の理由と前後の振る舞いを書いた文書（GitHub）を開けます。

::: details 承認の履歴（16 件）
| 承認日 | 版 | 変更 | 仕様 PR |
|---|---|---|---|
| 2026-10-06 | v0.26.0 | [ローカル DB を開けないときの読むだけのツールと書き戻すツールの応答、`--bulk-download-tax-answer` が索引を保存できないときの終わり方（nta #144・#145）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.26.0/20261006-db-failure-paths/proposal.md) | [#152](https://github.com/shuji-bonji/houki-nta-mcp/pull/152) |
| 2026-10-05 | v0.25.0 | [ローカル DB の場所を、応答・起動時のログ・`--status` で確かめられるようにし、保存したタックスアンサーの索引を読めないことをログに残す（nta #138・#137、T6）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.25.0/20261004-db-location/proposal.md) | [#142](https://github.com/shuji-bonji/houki-nta-mcp/pull/142) |
| 2026-10-03 | v0.24.0 | [国税庁サイトから取る経路（通信の失敗の code・タックスアンサーの URL と 8xxx 帯）と、事務運営指針の legal_status.note（段階 5）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.24.0/20261003-source-paths/proposal.md) | [#134](https://github.com/shuji-bonji/houki-nta-mcp/pull/134) |
| 2026-10-03 | v0.24.0 | [0.22.0 の取り込みで直し漏れた specs/current の文を、取り込んだ本文に合わせる（#123）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.24.0/20261003-specs-current-catchup/proposal.md) | [#132](https://github.com/shuji-bonji/houki-nta-mcp/pull/132) |
| 2026-10-03 | v0.23.0 | [hint・next_actions・説明文・CLI の使い方と実際の動きの食い違いを、行ごとに直す（T5 文書と実装の食い違い）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.23.0/20261003-t5-docs-mismatch/proposal.md) | [#126](https://github.com/shuji-bonji/houki-nta-mcp/pull/126) |
| 2026-10-03 | v0.23.0 | [値の無いフィールドを null にし、検索の結果に発出日と法令時点を揃えて返す（T4 応答の形）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.23.0/20261003-t4-response-shape/proposal.md) | [#125](https://github.com/shuji-bonji/houki-nta-mcp/pull/125) |
| 2026-10-02 | v0.22.0 | [文書系 3 ツールの docId の形を、DB にある実際の値に合わせて緩める（T1 の訂正）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.22.0/20261002-t1-docid-forms/proposal.md) | [#121](https://github.com/shuji-bonji/houki-nta-mcp/pull/121) |
| 2026-10-01 | v0.22.0 | [全角・半角・ダッシュ類の揃え方を houki-abbreviations 0.7.0 に一本化する（T3）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.22.0/20261001-t3-normalize/proposal.md) | [#119](https://github.com/shuji-bonji/houki-nta-mcp/pull/119) |
| 2026-10-01 | v0.22.0 | [「見つからない」と「取得元の失敗」の code を分ける（T2）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.22.0/20261001-t2-error-codes/proposal.md) | [#118](https://github.com/shuji-bonji/houki-nta-mcp/pull/118) |
| 2026-10-01 | v0.22.0 | [引数の検査を inputSchema に書き、丸めずに `INVALID_ARGUMENT` にする（T1）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.22.0/20261001-t1-argument-guards/proposal.md) | [#117](https://github.com/shuji-bonji/houki-nta-mcp/pull/117) |
| 2026-09-30 | v0.21.3 | [DB に入れる値と保存するファイル名の扱いを直す（#73）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.21.3/20260930-nta-73-db-values/proposal.md) | [#104](https://github.com/shuji-bonji/houki-nta-mcp/pull/104) |
| 2026-09-27 | v0.21.1 | [取得系ツールと nta_inspect_pdf_meta の応答の形に仕様 ID を振る](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.21.1/20260927-get-responses/proposal.md) | [#89](https://github.com/shuji-bonji/houki-nta-mcp/pull/89) |
| 2026-09-27 | v0.21.1 | [引数の検査と、国税庁のページの解析の失敗のエラーに仕様 ID を振る](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.21.1/20260927-argument-and-parse-errors/proposal.md) | [#84](https://github.com/shuji-bonji/houki-nta-mcp/pull/84) |
| 2026-09-26 | v0.21.1 | [「未決」のうち判断が要る 45 件を Issue に移す](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.21.1/20260926-undecided-to-issues/proposal.md) | [#74](https://github.com/shuji-bonji/houki-nta-mcp/pull/74) |
| 2026-09-26 | v0.21.1 | [全 14 ツールの spec.md に「処理の流れ」の節を足す](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/releases/v0.21.1/20260926-processing-flow/proposal.md) | [#63](https://github.com/shuji-bonji/houki-nta-mcp/pull/63) |
| 2026-09-26 | — | 初版 | [#63](https://github.com/shuji-bonji/houki-nta-mcp/pull/63) |
:::

## 関連ページ

このページの元になった文書と、あわせて読むページです。

- [houki-nta-mcp の仕様の一覧](/specs/houki-nta/)
- [houki-nta-mcp の解説](/mcp/houki-nta)
- [nta_get_jimu_unei のツールのページ（リファレンス）](/reference/mcp/houki-nta/nta_get_jimu_unei)
- [元の仕様書（GitHub、v0.27.0）](https://github.com/shuji-bonji/houki-nta-mcp/blob/v0.27.0/specs/current/nta_get_jimu_unei/spec.md)
