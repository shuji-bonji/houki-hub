---
title: houki-nta-mcp
description: 国税庁サイトの基本通達・改正通達・事務運営指針・文書回答事例・タックスアンサー・質疑応答事例を取得・全文検索する MCP サーバー
---

# houki-nta-mcp

国税庁（NTA）公式サイトの **基本通達・改正通達・事務運営指針・文書回答事例・タックスアンサー・質疑応答事例** を
ローカル SQLite に取り込み、FTS5 で全文検索する MCP サーバーです。
法律本文（法・政令・省令）は [houki-egov-mcp](/mcp/houki-egov) が担当します。

- npm: [`@shuji-bonji/houki-nta-mcp`](https://www.npmjs.com/package/@shuji-bonji/houki-nta-mcp)（0.14.1）
- リポジトリ: [shuji-bonji/houki-nta-mcp](https://github.com/shuji-bonji/houki-nta-mcp)
- 動作環境: Node.js 22 以上

## 扱うコンテンツ

| コンテンツ | 内容 | `legal_status` |
| --- | --- | --- |
| 基本通達 4 種 | 消費税法基本通達・所得税基本通達・法人税基本通達・相続税法基本通達 | 税務職員を拘束する行政内部の解釈指針。国民・裁判所は拘束しない |
| 改正通達 | 各年の改正通達と添付 PDF（新旧対照表など） | 同上 |
| 事務運営指針 | 税務執行の運営方針 | 同上 |
| 文書回答事例 | 事前照会に対する国税庁・国税局の回答 | 個別の事案への回答。一般的な法的拘束力はない |
| タックスアンサー | 一般向けの税務 Q&A | 参考情報 |
| 質疑応答事例 | 国税庁が公表する解釈事例 | 参考情報 |

すべての応答に `legal_status` が付きます。通達に書いてあることを「法律で決まっている」と言い換えないためです。
通達と解説資料がほかの種類の文書（法律・政令・裁決・判例など）と比べて誰を拘束するかは、[文書の種類と拘束力](/guide/document-types) にまとめています。

## 基本通達と、解釈の対象になる法律

通達は国民と裁判所を拘束しないので、根拠は法律の条文で確かめる必要があります。
基本通達 4 種が解釈している法律と、その政令・省令は次のとおりです。いずれも [houki-egov-mcp](/mcp/houki-egov) の `get_law` に `law_name` として渡すと本文を引けます（2026-09-11 に `search_law` で 12 件とも見つかることを確認）。

| 基本通達 | 法律 | 政令 | 省令 |
| --- | --- | --- | --- |
| 消費税法基本通達 | 消費税法 | 消費税法施行令 | 消費税法施行規則 |
| 所得税基本通達 | 所得税法 | 所得税法施行令 | 所得税法施行規則 |
| 法人税基本通達 | 法人税法 | 法人税法施行令 | 法人税法施行規則 |
| 相続税法基本通達 | 相続税法 | 相続税法施行令 | 相続税法施行規則 |

v0.11.0 から、この対応が応答に入ります（[houki-nta-mcp#20](https://github.com/shuji-bonji/houki-nta-mcp/issues/20)）。

| ツール | 付くフィールド | 中身 |
| --- | --- | --- |
| `nta_get_tsutatsu` | `base_laws` | その通達の法律・政令・省令の配列。Markdown 応答では出典の後に「解釈の対象になる法律: …」の行が入ります |
| `nta_search_tsutatsu` | `base_laws_by_tsutatsu` | 検索結果に現れた通達ごとの対応表。対応は通達単位なので、hit ごとではなく応答に 1 回だけ置きます |

どちらの応答にも `next_actions` が付き、`example` に houki-egov-mcp の `get_law` に渡す法律名が入っています。検索では通達ごとに 1 件です。
通達の項と法律の条の対応は一律ではないため、応答にもこの表にも条番号は入りません。通達の本文にある「法第57条の2第4項」のような参照を読んで、`get_law` の `article` を指定してください。

## ツール

引数の詳細と実測の呼び出し例は[ツールリファレンス](/reference/mcp/houki-nta)にあります。

| ツール | 用途 |
| --- | --- |
| `nta_get_tsutatsu` / `nta_search_tsutatsu` | 基本通達の本文取得と全文検索 |
| `nta_get_kaisei_tsutatsu` / `nta_search_kaisei_tsutatsu` | 改正通達の取得と検索。添付 PDF は種別（新旧対照表・別紙・Q&A など）に分類して表で返します |
| `nta_get_jimu_unei` / `nta_search_jimu_unei` | 事務運営指針の取得と検索 |
| `nta_get_bunshokaitou` / `nta_search_bunshokaitou` | 文書回答事例の取得と検索 |
| `nta_get_tax_answer` / `nta_search_tax_answer` | タックスアンサーの取得と検索 |
| `nta_get_qa` / `nta_search_qa` | 質疑応答事例の取得と検索 |
| `nta_inspect_pdf_meta` | 文書に添付された PDF のメタ情報と、pdf-reader-mcp での読み方の例だけを返します |
| `resolve_abbreviation` | 略称の解決を診断します |

検索ツールは `hasPdf` で PDF 付きの文書だけに絞れ、応答に `freshness`（取り込みからの経過）が付きます。`nta_search_qa` は `topic`（`shotoku`・`shohi` などの税目）で絞り込めます（v0.13.0 から）。

引数は `tools/list` の inputSchema どおりに渡してください。v0.14.0 から、inputSchema に無い引数は `INVALID_ARGUMENT` になります。`nta_search_tsutatsu` の `type` と `domain` は、絞り込みに使われていなかったので v0.14.0 で削除しました。

文書回答事例の `taxonomy` は URL の税目フォルダ名です。国税局のページは本庁と違う名前を使うことがある（相続税は `sozoku` と `souzoku`、源泉所得税は `gensen` と `gensenshotoku`、譲渡所得・山林所得は `joto-sanrin` と `joto_sanrin`）ため、v0.14.0 からはどちらを指定しても両方を検索します。

キーワードが略称辞書に載っている場合の扱いは次のとおりです（v0.11.1 から）。

| キーワード | 例 | 検索のしかた |
| --- | --- | --- |
| 略称そのもの | 「消基通」「消法」 | 元の語と正式名（消費税法基本通達・消費税法）の両方で検索します |
| 通称 | 「インボイス」「軽減税率」「適格請求書発行事業者」 | 元の語で検索し、0 件のときだけ正式名（消費税法）で検索し直します。そのときは `search_notes` にその旨が入ります |

通称で常に正式名まで広げると、「消費税法」という語が出てくるだけの文書が混ざり、キーワードを含む文書が `limit` から押し出されるためです（[houki-nta-mcp#21](https://github.com/shuji-bonji/houki-nta-mcp/issues/21)）。

## 質疑応答事例の関係法令通達

質疑応答事例は国税庁の参考資料で、誰も拘束しません。回答の根拠は、各ページの【関係法令通達】に挙がっている法律と通達で確かめます。
v0.12.0 から、`nta_get_qa` を `format: "json"` で呼ぶと、この欄を法令と通達に分けて返します（[houki-nta-mcp#22](https://github.com/shuji-bonji/houki-nta-mcp/issues/22)）。

| フィールド | 中身 |
| --- | --- |
| `related_laws` | 法令の参照。`law_name`・`article`・`paragraph`・`item`（別表の場合は `appendix`）と、原文の `raw` |
| `related_tsutatsu` | 通達の参照。`name`・`clause` と、原文の `raw` |
| `next_actions` | houki-egov-mcp の `get_law` と `nta_get_tsutatsu` に渡す引数の例 |
| `notice` / `basisDate` | ページ下部の国税庁の注記と、その基準日（例: `2025-08-01`） |

「所得税法第27条、第34条、第37条」のように法令名を省いて続く条番号は、直前の法令名を補って読みます。枝番号の号（「法人税法第2条第12号の8」）は、v0.14.0 から `item: "12の8"` の文字列で入り、`next_actions` の `get_law` にも渡ります（houki-egov-mcp v0.6.0 以上が必要です）。【関係法令通達】の原文は、これまでどおり `relatedLaws` に残ります。

次の参照は `related_laws` や `related_tsutatsu` には入りますが、`next_actions` は付きません。

| 参照 | 理由 |
| --- | --- |
| 租税条約 | e-Gov の法令 API では引けないため |
| 「旧」「改正前」の付いた条文 | どの時点の条文かが応答から決まらず、`get_law` の `at` に渡す日付を示せないため |
| 条番号の無い法令 | `get_law` に渡す条を決められないため |
| 基本通達 4 種以外の通達（租税特別措置法関係通達など） | `nta_get_tsutatsu` が扱わないため |

v0.12.0 で取り込んだ 1,834 件の【関係法令通達】を区切ると 5,059 個の参照になり、そのうち 94.2% を法令か通達として読み取れました。読み取れなかった参照は、`relatedLaws` の原文にだけ残ります。

ページ下部の注記は、v0.11.1 までは【関係法令通達】（その欄が無いページでは【回答要旨】）に混ざっていました。v0.11.1 までに作ったローカル DB では、「異なる課税関係が生ずる」のような注記の文言で、ほぼ全件の質疑応答事例がヒットします。`houki-nta-mcp --bulk-download-qa --refresh` で取り込み直してください。取り込み直すとほぼ全件の本文が変わるため、最後に「構造変質の疑い」の警告が出ますが、解析方法を変えたためで、国税庁のページが変わったわけではありません。

## 検索が 0 件のとき

文書系の検索 5 ツール（`nta_search_qa`・`nta_search_tax_answer`・`nta_search_kaisei_tsutatsu`・`nta_search_jimu_unei`・`nta_search_bunshokaitou`）は、0 件になった理由を分けて返します（v0.13.0 から。[houki-nta-mcp#23](https://github.com/shuji-bonji/houki-nta-mcp/issues/23)）。

| DB の状態 | 応答 |
| --- | --- |
| その種別の文書が DB に 1 件も無い | エラー `DOC_NOT_FOUND`。「該当なし」という検索結果ではないことを示します。`hint` に MCP サーバーが開いている DB ファイルのパスと投入コマンドが入ります |
| 税目の絞り込みの範囲に文書が無い | `results: []`。`available_taxonomies` に、DB にある税目の一覧が入ります |
| `hasPdf` の条件に合う文書が無い | `results: []`。`hasPdf` を外すよう案内します |
| 文書はあるが、キーワードに合わない | `results: []`。`hint` に「該当なし」と検索した件数（例: 「DB の質疑応答事例 1,841 件に」）が入ります |

LLM が `results: []` を受け取ったときは「国税庁の資料にこの語を含む文書は無い」と読めますが、`DOC_NOT_FOUND` のときは検索そのものができていないので、そう答えてはいけません。
その種別を投入していない、`--bulk-download-everything` の途中でその種別だけ失敗した、bulk download を実行したシェルと MCP サーバーとで環境変数 `HOUKI_NTA_DB_PATH` / `XDG_CACHE_HOME` が違う、のいずれかです。

v0.12.0 までは、どの場合も「DB 投入済みか確認してください」という同じ `hint` だったため、文書が入っている DB でも投入をやり直すよう案内していました。
また、v0.12.0 までの `nta_search_qa` は `domain` を指定すると必ず 0 件でした。v0.13.0 からは `domain: "tax"` は絞り込まずに検索し、税目で絞るときは `topic` を使います。

## docId が見つからないとき

取得系の 3 ツール（`nta_get_kaisei_tsutatsu`・`nta_get_jimu_unei`・`nta_get_bunshokaitou`）は DB だけを見ます。指定された docId が DB に無いとき、理由を 2 つに分けて返します（v0.14.1 から）。

| DB の状態 | 応答 |
| --- | --- |
| その種別の文書が DB に 1 件も無い | 「ローカル DB に◯◯が 1 件も無いため、docId=… を取得できません」。`hint` に DB ファイルのパスと環境変数、`next_actions` に投入コマンド（`action` は `cli_bulk_download`） |
| 文書はあるが、その docId が無い | 「◯◯ docId=… は見つかりません」。`available_doc_ids`（新しい順に 30 件。`docId`・`title`・`issuedAt`）と、検索ツールへの `next_actions` |

v0.14.0 までは、どちらの場合も「DB に未投入です」と返して投入コマンドを案内していたため、docId を打ち間違えただけの利用者にも投入をやり直すよう勧めていました。検索が 0 件のときの分け方（上の節）と同じ考え方です。

LLM は `next_actions[0].action` を見て、`cli_bulk_download` なら投入を案内し、検索ツール（`nta_search_*`）なら `available_doc_ids` から選ぶか検索して docId を探し直します。

## ローカル DB の作り方

```sh
npx -y @shuji-bonji/houki-nta-mcp --bulk-download-everything
```

DB は `~/.cache/houki-nta-mcp/cache.db` にできます。DB がないときも、基本通達・タックスアンサー・質疑応答事例の取得（`nta_get_tsutatsu`・`nta_get_tax_answer`・`nta_get_qa`）は国税庁サイトから直接取得して応答します（1 件あたり 1 秒弱）。改正通達・事務運営指針・文書回答事例の取得と、すべての検索には DB が必要です。
2 回目以降は国税庁サイトが `304 Not Modified` を返す節を飛ばすので短時間で終わります。
節の本文を解析し直したいとき（v0.10.0 以前の DB に算式画像のプレースホルダを入れる場合など）は `--refresh` を付けます。

## 国税庁サイトの変更への備え

国税庁サイトは URL の世代が変わることがあります（`sozoku` → `sozoku2`、`hyoka` → `hyoka_new` など）。
`--health-check` で取得先が生きているかを確かめ、`--check-baseline-drift` で `menu.htm` を正典に世代移行を事前に検知します。
存在しないページが 404 ではなく `/error/404.htm` に着地する場合も、本文として取り込まずに失敗として扱います。

## PDF Agent Stack との組み合わせ

改正通達の新旧対照表は PDF で提供されます。`nta_inspect_pdf_meta` は、その PDF を
[pdf-reader-mcp](https://shuji-bonji.github.io/pdf-agent-stack/ja/mcp/pdf-reader) の `extract_tables` で表構造を保ったまま読むための呼び出し例を返します。

利用範囲と通達の法的な位置づけは[免責事項と利用範囲](/guide/disclaimer)と、リポジトリの [DISCLAIMER.md](https://github.com/shuji-bonji/houki-nta-mcp/blob/main/DISCLAIMER.md) を参照してください。

houki-nta-mcp は family の中で最も長く開発しており、他の MCP サーバーの参照実装になっています
（正規化を取り込み時と検索時の両方で通す、`freshness` と `legal_status` を必ず付ける、取得先の変更を検知する、など）。
