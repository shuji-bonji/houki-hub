# 今週の変更の回帰確認（2026-09-21 JST）

9/14〜9/21 の 1 週間で houki-egov-mcp は 0.7.0 → 0.15.1（17 コミット）、houki-research-skill は 0.7.0 → 0.13.0（11 コミット）、houki-nta-mcp は 0.18.2 → 0.19.0（8 コミット）と進んだ。CI（単体テスト）と nta の Canary（国税庁サイトへの実接続）は main で success だが、どちらも「ツールの応答の形が先週と同じか」「Skill の手順どおりに呼んで最後まで通るか」は見ていない。この 2 点を確かめた記録。

結論: **劣化は見つからなかった。** 代わりに Skill の例文の誤りが 1 件、改善の種が 3 件見つかった（末尾の「見つかったこと」と `issues-2026-09-21/` の草案）。

## やり方

1. 契約の確認 — `scripts/reference-examples/{houki-egov,houki-nta}/ja/*.md` の呼び出し例（ツールごとに「この引数で、この版で、この JSON が返った」を実測で残したもの）を、同じ引数で現行版（egov 0.15.1 / nta 0.19.0、Claude Desktop の plugin 経由）に流し、例の本文の主張と食い違う点を表にした。本文の一字一句ではなく「形」と「主張」を比べる。egov 24 例、nta 23 例
2. 手順の確認 — houki-research-skill の `examples/invoice-registration.md`（略称解決 → 法律 → 通達 → 改正 → 添付 PDF）を、現行の 3 つで最初から最後まで通した。PDF の段は nta 0.19.0 の `save: true` → pdf-reader-mcp の `extract_tables` まで

判定の意味: 「一致」は例の主張がすべて成り立った。「差分あり」は形か値が変わったが主張は成り立つ（フィールドの追加、DB の取り込み日による値の変化、文言だけの差）。「劣化」は例の主張が成り立たなくなったもの。

## 1. 契約の確認 — houki-egov-mcp 0.15.1

| ツール | 例の見出し | 例の実測版 | 判定 | 差分の中身 |
| --- | --- | --- | --- | --- |
| explain_law_type | 「通達は守らなくてよいのか」 | v0.5.3 | 一致 | |
| get_article_references | 「所得税法 57 条の 2 第 2 項が引いている法令」 | v0.10.0 | 一致 | references 10 件・delegations 2 件（count 7/7）・next_actions 7 件、kind/resolved の値まで同一 |
| get_attachment | 「日章旗の寸法図をディスクに置く」 | v0.15.0 | 一致 | kind "file"、saved.bytes 12614、response_content_type "image/jpeg"、location 別記第一（第一条関係）。saved.path のホームは例の `/Users/you` が実行環境の値になる |
| get_attachment | 一覧に無い src を渡したとき（ATTACHMENT_NOT_FOUND） | v0.15.0 | 一致 | code / hint（添付 2 件列挙）/ next_actions[0].action "list_attachments" いずれも同一 |
| get_law | 「消費税法 57 条の 2 第 1 項の本文を JSON で」 | v0.5.3 | 一致 | data.article_num "57_2"、node 構造、meta 同一 |
| get_law | 「消費税法 30 条 2 項を Markdown で」（号と、号の下のイ・ロ） | v0.5.4 | 一致 | 号は「一」「二」、イ・ロは `- イ …` の箇条書き、見出し語と本文の間は全角空白 |
| get_law | 「所得税法 89 条 1 項を Markdown で」（項の直下の表） | v0.5.4 | 一致 | 見出し行が空の Markdown 表 7 行、meta.law_num「昭和四十年法律第三十三号」 |
| get_law | 枝番号の号（消費税法 2 条 1 項 8 号の 2） | v0.6.0 | 一致 | 見出し「第2条第1項第8号の2」、本文「八の二 特定資産の譲渡等　…」 |
| get_law | 存在しない条を指定したとき（ARTICLE_NOT_FOUND） | v0.5.3 | 一致 | error / code / hint / next_actions[0]（get_toc、example {law_name: 消費税法}）同一 |
| get_law_file | 「民法の全文を Word で」（URL だけ） | v0.15.0 | 一致 | content_type・url・note 同一。saved 無し |
| get_law_file | 「2020 年 4 月 1 日時点の国旗国歌法を HTML で保存」 | v0.15.0 | 一致 | url に `?asof=2020-04-01`、saved.bytes 38537、law_revision_id `411AC0000000127_19990813_000000000000000`、meta.at "2020-04-01" |
| get_law_range | 「民法の契約の章をまとめて読みたい」 | v0.14.0 | 差分あり | range.body_chars: 例 29911 → 現行 29919。他は同一（article_count 198、returned_count 186、truncated true、first 第521条、last 第684条、next_from_article "685"） |
| get_law_range | 「遺留分の章だけ読みたい」（path で指定） | v0.14.0 | 一致 | article_count 8、body_chars 2284、第1044条に caption 無し、truncated false |
| get_law_range | 「章だけ指定したら候補が返ってきた」 | v0.14.0 | 一致 | INVALID_ARGUMENT、hint に 5 パス、next_actions 5 件（見出し付き） |
| get_law_range | 「附則の 7 本目を読む」 | v0.14.0 | 一致 | article_count 0、body_chars 21、articles []、note「条を持たず項だけ…」 |
| get_law_revisions | 「消費税法の直近の改正と施行日」 | v0.5.3 | 一致 | total 65、2 件の law_revision_id・日付・status "UnEnforced" 同一 |
| get_related_laws | 「所得税法の施行令と施行規則」 | v0.10.0 | 一致 | related 2 件（abbr 所令 / 所規）、not_found []、method "law_name_rule" |
| get_toc | 「民法の大区分だけ見たい」 | v0.14.0 | 一致 | toc 5 件（path Part1〜Part5）、suppl.count 67 / article_count 201、node_count 5、truncated true、附則(1) paragraph_only true、附則(3) extract true |
| list_attachments | 「国旗国歌法の日章旗の寸法図はどこにあるか」 | v0.15.0 | 一致 | count 2、location 別記第一/別記第二、zip_url、next_actions 1 件 |
| list_attachments | 「戸籍法施行規則の様式（届書の書式）を一覧で」 | v0.15.0 | 差分あり | `2FH00000076885.pdf`（附録第十一号様式）の updated: 例 "2026-07-15T10:10:24+09:00" → 現行 "2026-07-15T10:10:26+09:00"。count 42・jpg 7・pdf 35・law_revision_id・next_actions は同一 |
| resolve_abbreviation | 「消基通 は何の略で、どのサーバーが担当か」 | v0.5.3 | 一致 | law_id null、source_mcp_hint "houki-nta" |
| search_fulltext | 「民法で不法行為に関係する条は」 | v0.5.3 | 差分あり | freshness: 例 last_sync_date "2026-09-07" / days_since_sync 0 → 現行 "2026-09-19" / 2（staleness "fresh" のまま）。score が小数第 3 位で変化（0.703 → 0.705 など）。source "bulk"、count 3、ヒット順 724 / 724の2 / 719 は同一 |
| search_law | 「個情法の正式名と法令番号を知りたい」 | v0.5.3 | 一致 | query.resolved「個人情報の保護に関する法律」、total_count 3、1・2 件目同一 |
| verify_citations | 「書こうとしている引用 5 件をまとめて確かめる」 | v0.14.0 | 差分あり | (1) index 2（not_found、民法）に `resolved_by: "abbreviation"` が付いた。(2) index 3（ambiguous、所得税法）に `law` オブジェクトと `resolved_by` が付いた。(3) 最上位に `meta: { retrieved_at }` が増えた。(4) note の末尾の文が長い（例は … で省略）。summary（3/1/1、all_found false）、各 status、code、next_actions は同一 |

劣化: なし。差分 4 件はいずれもフィールドの追加（verify_citations の `meta.retrieved_at`、`law`、`resolved_by`）か、データ側の更新（search_fulltext の同期日と score、get_law_range の body_chars 8 文字、list_attachments の updated 2 秒差）。

書き足しておく価値があるもの: verify_citations の `resolved_by` は「民法」「所得税法」のような正式名でも `"abbreviation"` になる。例の本文は「消法」についてだけ「略称辞書で」と述べており矛盾はしないが、正式名でも同じ値が付くことは例に書かれていない。

## 2. 契約の確認 — houki-nta-mcp 0.19.0

| ツール | 例の見出し | 例の実測版 | 判定 | 差分の中身 |
|---|---|---|---|---|
| nta_get_bunshokaitou | 「産科医療特別給付事業の給付金は非課税か」（本庁系） | v0.10.4 | 差分あり（軽微） | `fullText` の末尾。例は `…以上` で終わるが、現行は `以上\n←上記照会の内容に対する回答はこちら` とページ内リンクの文言が 1 行付く。他（document / legal_status / source: "db"、関係する法令条項等、【別紙】の位置、fetchedAt）は一致 |
| nta_get_bunshokaitou | 国税局系（`tokyo/shohi/251017`） | v0.10.4 | 一致 | issuer「東京国税局」、別紙の `イ` `ロ` `ハ` が 1 行ずつ、`source: "db"`。本文は `以上` で終わり余分な行なし |
| nta_get_jimu_unei | 「酒税の書面添付制度の事務運営指針」 | v0.10.4 | 一致 | 1 行目の通達番号と改正日、`issuedAt: 2009-04-01`、`attachedPdfs` 2 件（191KB/158KB）、`binds_tax_office: true`、`source: "db"`。`fetchedAt` は 2026-09-07 → 2026-09-12（DB 再投入） |
| nta_get_kaisei_tsutatsu | 「令和 7 年 4 月 1 日の消基通改正の本文と添付 PDF」 | v0.10.4 | 一致 | `attachedPdfs` 3 件（221/449/399KB）、「別紙1…令和7年4月1日から適用」「別紙2…令和8年11月1日から適用」、`source: "db"` |
| nta_get_kaisei_tsutatsu | 「docId を打ち間違えたとき」 | v0.14.1 | 一致 | `code: TSUTATSU_NOT_FOUND`、`hint` に「DB の改正通達 118 件」、`next_actions[0].action: nta_search_kaisei_tsutatsu`、`available_doc_ids` 30 件（先頭 `260807`）。「DB が空のときは cli_bulk_download」の分岐は空 DB が無いため未検証 |
| nta_get_qa | 「消費税の質疑応答事例 02/19 …」 | v0.17.0 | 一致 | `source: "db"`、`basisDate: 2025-08-01`、`related_laws`（消費税法 2 条 1 項 8 号）、`related_tsutatsu`（5-1-1）、`next_actions` 2 件、`index_status` は付かない |
| nta_get_qa | 枝番号の号を挙げている事例（法人税 33/02） | v0.14.0 | 一致 | `related_laws[0].item: "12の8"`（文字列）、施行令 `article: "4の3", paragraph: 4, item: 1`、`next_actions` 3 件。現行は `source: "live"`（この DB では初回取得。例は `source` が無い版） |
| nta_get_tax_answer | 「No.6101 消費税の基本的なしくみ」 | v0.17.0 | 一致 | `sections[]` 7 節、`effectiveDate: 令和7年4月1日現在法令等`、`source: "db"` |
| nta_get_tsutatsu | 「消基通 1-7-2（登録番号の構成）の本文」 | v0.11.0 | 一致 | `paragraphs` 3 件（indent 1/2/2）、`base_laws: [消費税法, 消費税法施行令, 消費税法施行規則]`、`next_actions[0].example.law_name: 消費税法`、`source: "db"`。例は「大文字Ｔ」（全角）、現行は「大文字T」（半角。正規化による） |
| nta_inspect_pdf_meta | 「改正通達 0025004-026 の PDF は、どれをどう読めばよいか」 | v0.19.0 | 一致 | kind = comparison / attachment / attachment、`read_strategy: tables`、`next_actions` 3 件（`pdf-reader-mcp:read_url` ×2、`read_pdf`）、1 件目に `split_columns: 2` |
| nta_inspect_pdf_meta | 「新旧対照表だけを保存して、表として取る」 | v0.19.0 | 一致 | `saved[0].path: ~/.cache/houki-nta-mcp/files/kaisei/0025004-026/b0025003-111.pdf`、`bytes: 408826`、1 回目 `cached: false`、2 回目 `cached: true`。`next_actions[0].action: pdf-reader-mcp:extract_tables`（`file_path`） |
| nta_search_bunshokaitou | 「産科医療の給付金に関する文書回答事例」 | v0.10.4 | 一致 | 2 件（`shotoku/081102`, `shotoku/250416`）、score 0.5176 / 0.4892。`freshness.staleness` は例 `fresh` → 現行 `stale`（12 日） |
| nta_search_bunshokaitou | 別紙の本文にしかない語で引く（宇宙空間） | v0.10.4 | 一致 | 1 件 `tokyo/shohi/251017`、snippet に `<b>宇宙空間</b>`、score 0.5356 |
| nta_search_bunshokaitou | 税目の別表記をまとめて検索する（`taxonomy: "sozoku"`） | v0.14.0 | 一致 | 3 件（`tokyo/souzoku/181207`, `tokyo/souzoku/211224`, `kantoshinetsu/sozoku/160822`）、`search_notes` に別表記 "souzoku" をまとめた旨 |
| nta_search_jimu_unei | 「書面添付制度の事務運営指針」 | v0.10.4 | 一致 | 2 件（`hojin/090401-2` 0.4635、`shozei/090401` 0.4480）、`binds_tax_office: true` |
| nta_search_kaisei_tsutatsu | 「インボイス関係の改正通達を新旧対照表付きで」 | v0.10.4 | 差分あり（追加） | 2 件（`0025004-026` 0.2517、`191001` 0.2495）と `scoreReasons` の略称展開は一致。現行は最上位に `search_notes`（「"インボイス" を含む文書は見つかりませんでした。略称辞書で…」）が増えた |
| nta_search_qa | 「テレワークに関係する質疑応答事例」 | v0.10.4 | 一致 | 1 件 `hojin/04/16`、score 0.3406。`freshness.newest_fetched_at` に直前の live 取得（hojin/33/02）が反映された |
| nta_search_qa | 税目（topic）で絞る | v0.13.0 | 一致 | 1 件 `shohi/21/10`、score 0.1983 |
| nta_search_qa | キーワードに合う文書が無いとき | v0.13.0 | 一致 | `results: []`、`hint: 該当なし。DB の質疑応答事例 1,841 件に「異なる課税関係が生ずる」に合う文書はありません。…` |
| nta_search_tax_answer | 「医療費控除のタックスアンサー」 | v0.10.4 | 一致 | 2 件（`1131` 0.2528、`1127` 0.2495）、`binds_tax_office: false` |
| nta_search_tsutatsu | 「軽減税率に関係する通達の節は」 | v0.11.1 | 一致 | `count: 2`、hits `5-9-10` 0.4413 / `5-9-5` 0.4383、`search_notes` 無し、`base_laws_by_tsutatsu` に消基通 → 3 法令、`next_actions` 1 件 |
| nta_search_tsutatsu | DB が古いとき（`staleness: "outdated"`） | v0.10.2 | 未確認 | 126 日前の DB を用意できないため再現不可。現行 DB（13 日）は `stale` で `warning` は付かない（例の主張と矛盾はしない） |
| resolve_abbreviation | 「電帳法 は houki-nta-mcp で引けるか」 | v0.10.4 | 一致 | `resolved.formal`、`aliases` 4 件、`source_mcp_hint: houki-egov`、`in_scope: false`、`hint` 文言まで同一 |

劣化: なし。差分 2 件は `search_notes` の追加と、`nta_get_bunshokaitou`（本庁系 `shotoku/250416`）の `fullText` 末尾に混ざるページ内リンクの文言「←上記照会の内容に対する回答はこちら」。後者は parser の取りこぼしで、issue の種（`issues-2026-09-21/issue-nta-bunshokaitou-nav-text.md`）。

## 3. 手順の確認 — invoice-registration を現行の 3 つで 1 周

| 段 | 呼び出し | 結果 |
|---|---|---|
| ② 略称解決 | `resolve_abbreviation { abbr: "インボイス" }` | 消費税法（363AC0000000108）、`source_mcp_hint: houki-egov`、`in_scope: false` |
| ③ 法律本文 | `search_law { keyword: "適格請求書発行事業者の登録" }` | **`total_count: 0`**。例文は「→ 消費税法 第 57 条の 2」と書いているが返らない（下記） |
| ③' 代わりに | `search_fulltext { keyword: "消費税法 適格請求書発行事業者の登録" }` | 57 条の 2「（適格請求書発行事業者の登録等）」が `article_caption_match` 付きで 1 位（score 0.306）、附則(137) 44 が 2 位 |
| ③ 本文 | `get_law { law_name: "消費税法", article: "57の2", paragraph: 1 }` | 本文が返る。`legal_status` は付かない（例文は「+ legal_status」と書いている） |
| ④ 通達 | `nta_get_tsutatsu { name: "消基通", clause: "1-7-2", format: "json" }` | `base_laws` 3 件、`next_actions[0]` は `delegate_to_mcp`（houki-egov / get_law / 消費税法）、`source: "db"` |
| ⑤ 改正履歴 | `nta_search_kaisei_tsutatsu { keyword: "インボイス", hasPdf: true }` | `0025004-026`（2025-04-01）と `191001` |
| ⑥ PDF の読み方 | `nta_inspect_pdf_meta { docType: "kaisei", docId: "0025004-026", kind: "comparison", save: true }` | 1 件（`b0025003-111.pdf`）を保存。`next_actions[0]` は `pdf-reader-mcp:extract_tables { file_path }` |
| ⑦ 表として取る | `extract_tables { file_path: …/b0025003-111.pdf, pages: "1" }` | `isTagged: false`、`totalTables: 0`（タグ無し） |
| ⑦' 分岐 | `read_text { file_path: 同上, pages: "1", split_columns: 2 }` | 左に「改正後」の通達番号一覧、右に「改正前」の一覧が分かれて返った。記号は「【削除】」「【新設】」「【一部改正】」「（同左）」 |
| 参考 | `nta_inspect_pdf_meta { …, kind: "attachment", save: true }` → `summarize` / `extract_tables` on `01.pdf` | 別紙 1 は `isTagged: true`。`extract_tables` が見出し行「改正後 | 改正前」の表を返し、第 2 条第 16 項（改正後）/ 第 15 項（改正前）の差が 1 行に並んだ。記号は「（省略）」「（同左）」 |

## 見つかったこと

1. **Skill の例文の誤り（要修正、skill 0.13.1）**: `examples/invoice-registration.md` と `workflows/tax-research.md` のステップ ③ の `search_law { keyword: "適格請求書発行事業者の登録" }` は 0 件になる。`search_law` は法令名の検索で、略称辞書の alias「適格請求書発行事業者」には当たるが「の登録」が付くと当たらない。条を探すなら `search_fulltext { keyword: "消費税法 適格請求書発行事業者の登録" }`。同じ箇所の「`get_law` → 条文本文 + legal_status」も、`get_law` は `legal_status` を返さないので誤り（返すのは `explain_law_type`）。→ `issues-2026-09-21/issue-skill-search-law-example.md`
2. **kind の分類の限界（nta の改善）**: 0025004-026 では、`kind: "comparison"` に分類されたのは「【参考】…構成及び新旧対応表」（章番号の対応表、タグ無し）で、本当の新旧対照表は「別紙1」（タイトルに手がかりが無いので `attachment`）だった。別紙 1 はタグ付きで `extract_tables` がそのまま効く。改正通達（kaisei）の「別紙 N」は新旧対照表本体のことが多い。→ `issues-2026-09-21/issue-nta-kaisei-attachment-kind.md`
3. **`layout_note` の記号（nta の小さな改善）**: 参考の対応表は「【新設】」「【削除】」「【一部改正】」の墨付き括弧、別紙 1 は「（同左）」「（省略）」の丸括弧。いまの文は丸括弧だけ。→ 同上の草案に含める
4. **`nta_get_bunshokaitou` の本文にページ内リンクの文言が混ざる**（nta の改善）→ `issues-2026-09-21/issue-nta-bunshokaitou-nav-text.md`
5. `extract_tables` が 0 件のときの分岐（`read_text` に `split_columns: 2`）は `next_actions[].reason` に書いたとおりに動いた

## 次に同じ確認を軽くするために

houki-hub の reference-examples は「その版で実際にそう返った」ものなので回帰の基準になった。houki-research-skill の `examples/` は手順を示すために書かれた箇所が残っており（③ がそれ）、同じ基準にはならない。次に Skill を直すときに、例文の呼び出しを 1 度ずつ実行して「実測: vX.Y.Z」を付ける作業を入れる。

実行環境: Claude Desktop の plugin（houki-egov-mcp 0.15.1 / houki-nta-mcp 0.19.0 / pdf-reader-mcp 0.15.5）、ローカル DB は egov 2026-09-19 同期、nta 2026-09-07〜09-19 取り込み。契約の確認は 2 つのサブエージェントに分けて並行で流し、手順の確認は手で行った。
