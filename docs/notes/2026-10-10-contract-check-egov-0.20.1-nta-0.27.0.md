# 呼び出し例の照合 — houki-egov-mcp 0.20.1 / houki-nta-mcp 0.27.0（2026-10-10 JST）

- 日付: 2026-10-10（JST）
- 実行: shuji の Mac、`node scripts/check-examples-contract.mjs`（ブランチ `feat/20261010-hub5-enable-and-examples`）
- 起動: npx で houki-egov-mcp 0.20.1・houki-nta-mcp 0.27.0（`stack.json` の `published`）
- ローカル DB: 手元の DB を引いた（`--db present`。取り込み直していない）
- 手順: `docs/notes/2026-10-10-procedure-contract-check-after-publish.md`

照合のスクリプトで全 48 例を流した最初の記録。結論: **形の違い 0、MCP の劣化 0**。データ側の差分 4 件は、どれも例の書き方によるもので、規則で 3 件を吸収し、例を 1 件直した。直した後の 2 回目は一致 47・照合しない 1 で、一致した 47 例に「- 確かめた版:」を書いた。

## 結果

| 回 | 時刻（JST） | 一致 | データ側の差分 | 形の違い | 未確認 | 照合しない |
| --- | --- | --- | --- | --- | --- | --- |
| 1 回目 | 19:12 | 43 | 4 | 0 | 0 | 1 |
| 2 回目（規則と例を直した後、`--write-verified`） | 19:19 | 47 | 0 | 0 | 0 | 1 |

照合しない 1 例は `nta_search_tsutatsu` の「DB が古いとき」（`- 版の照合: しない`。126 日たった DB を用意できない）。

## データ側の差分の分け方（1 回目）

どの断片が合わないかは、Mac で各例の応答の文字列を「…」の断片ごとに探して確かめた。

| 例 | 違い | 原因 | 分け方 | コミット |
| --- | --- | --- | --- | --- |
| egov `search_fulltext`「民法で不法行為に関係する条は」 | `hits[0].rank` -15.07 → -15.070028… | 例は FTS5 の bm25 の値を小数 2 桁に丸めて書いている | 規則で吸収: `VOLATILE_RULES` に `**.rank` ±0.01 | `deaaa60` |
| nta `nta_get_kaisei_tsutatsu`「令和 7 年 4 月 1 日の消基通改正」 | `document.fullText` の断片「 別紙2 」が見つからない | 例は「2 … 別紙2 … 令和8年…」と「…」の前後に空白を入れているが、本文は「別紙2「…」」で空白が無い | 規則で吸収: 「…」の前後の空白（半角・全角、改行は含めない）は省略の記号の一部 | `deaaa60` |
| nta `nta_inspect_pdf_meta`「改正通達 0025004-026 の PDF」 | `attachedPdfs[2].title` の断片「 新旧対応表 」が見つからない | 同じく「【参考】… 新旧対応表 …」の空白 | 同上 | `deaaa60` |
| nta `nta_get_bunshokaitou` 国税局系（`tokyo/shohi/251017`） | `document.fullText` の断片「\n関係する法令条項等: …\n〔回答〕…」が見つからない | 例の抜粋が「添付書類: ー」の行を「…」を置かずに省いていた。応答は 2026-10-04 の取り込みの DB の行（`source: "db"`）で、本庁系の例は「添付書類:」の行を載せている | 例を直す（行を足す。実測の版と日付は変えない） | `93cfe4b` |

Issue にするもの（MCP の劣化）は無かったので、`issues-2026-10-10-contract/` は作っていない。

## 1 回目の表

<details>
<summary>全 48 例</summary>

| サーバー | ツール | 例の見出し | 例の実測版 | 判定 | 違いの中身 |
| --- | --- | --- | --- | --- | --- |
| houki-egov | explain_law_type | 「通達は守らなくてよいのか」 | v0.20.0 | 一致 |  |
| houki-egov | get_article_references | 「所得税法 57 条の 2 第 2 項が引いている法令」 | v0.20.0 | 一致 |  |
| houki-egov | get_attachment | 「日章旗の寸法図をディスクに置く」 | v0.20.0 | 一致 |  |
| houki-egov | get_attachment | 一覧に無い `src` を渡したとき（`ATTACHMENT_NOT_FOUND`） | v0.20.0 | 一致 |  |
| houki-egov | get_law | 「消費税法 57 条の 2 第 1 項の本文を JSON で」 | v0.20.0 | 一致 |  |
| houki-egov | get_law | 「消費税法 30 条 2 項を Markdown で」（号と、号の下のイ・ロ） | v0.20.0 | 一致 |  |
| houki-egov | get_law | 「所得税法 89 条 1 項を Markdown で」（項の直下の表） | v0.20.0 | 一致 |  |
| houki-egov | get_law | 枝番号の号（消費税法 2 条 1 項 8 号の 2） | v0.20.0 | 一致 |  |
| houki-egov | get_law | 存在しない条を指定したとき（`ARTICLE_NOT_FOUND`） | v0.20.0 | 一致 |  |
| houki-egov | get_law_file | 「民法の全文を Word で」（URL だけ） | v0.20.0 | 一致 |  |
| houki-egov | get_law_file | 「2020 年 4 月 1 日時点の国旗国歌法を HTML で保存」 | v0.20.0 | 一致 |  |
| houki-egov | get_law_range | 「民法の契約の章をまとめて読みたい」 | v0.20.0 | 一致 |  |
| houki-egov | get_law_range | 「遺留分の章だけ読みたい」（`path` で指定） | v0.20.0 | 一致 |  |
| houki-egov | get_law_range | 「章だけ指定したら候補が返ってきた」 | v0.20.0 | 一致 |  |
| houki-egov | get_law_range | 「附則の 7 本目を読む」 | v0.20.0 | 一致 | 増えた: `（応答の全体）` 例に無いキー: meta |
| houki-egov | get_law_revisions | 「消費税法の直近の改正と施行日」 | v0.20.0 | 一致 |  |
| houki-egov | get_related_laws | 「所得税法の施行令と施行規則」 | v0.20.0 | 一致 |  |
| houki-egov | get_toc | 「民法の大区分だけ見たい」 | v0.20.0 | 一致 |  |
| houki-egov | list_attachments | 「国旗国歌法の日章旗の寸法図はどこにあるか」 | v0.20.0 | 一致 |  |
| houki-egov | list_attachments | 「戸籍法施行規則の様式（届書の書式）を一覧で」 | v0.20.0 | 一致 |  |
| houki-egov | resolve_abbreviation | 「消基通 は何の略で、どのサーバーが担当か」 | v0.20.0 | 一致 |  |
| houki-egov | search_fulltext | 「民法で不法行為に関係する条は」 | v0.20.0 | データ側の差分 | データ: `hits[0].rank` -15.07 → -15.070028182166215 |
| houki-egov | search_law | 「個情法の正式名と法令番号を知りたい」 | v0.20.0 | 一致 |  |
| houki-egov | verify_citations | 「書こうとしている引用 5 件をまとめて確かめる」 | v0.20.0 | 一致 |  |
| houki-nta | nta_get_bunshokaitou | 「産科医療特別給付事業の給付金は非課税か」（本庁系） | v0.25.0 | 一致 |  |
| houki-nta | nta_get_bunshokaitou | 国税局系（`tokyo/shohi/251017`） | v0.25.0 | データ側の差分 | データ: `document.fullText` "【取引等に係る税務上の取扱い等に関する事前照会】\n〔照会〕\n…\n関係する法令条項等: 消費税法第4条、第7… → "【取引等に係る税務上の取扱い等に関する事前照会】\n〔照会〕\n照会の内容 事前照会の趣旨（法令解釈・適用上の疑… |
| houki-nta | nta_get_jimu_unei | 「酒税の書面添付制度の事務運営指針」 | v0.25.0 | 一致 |  |
| houki-nta | nta_get_kaisei_tsutatsu | 「令和 7 年 4 月 1 日の消基通改正の本文と添付 PDF」 | v0.25.0 | データ側の差分 | データ: `document.fullText` "課消2-4 課総11-10 … 令和7年4月1日\n…\n記\n1 消費税法基本通達について、別紙1「消費税法基… → "課消2-4 課総11-10 課個2-3 課法5-10 課軽2-1 課審8-11 官企2-79 徴管2-23 徴徴… |
| houki-nta | nta_get_kaisei_tsutatsu | 「docId を打ち間違えたとき」 | v0.25.0 | 一致 |  |
| houki-nta | nta_get_qa | 「消費税の質疑応答事例 02/19 の照会と回答、関係法令通達」 | v0.25.0 | 一致 |  |
| houki-nta | nta_get_qa | 枝番号の号を挙げている事例（法人税 33/02） | v0.25.0 | 一致 |  |
| houki-nta | nta_get_tax_answer | 「No.6101 消費税の基本的なしくみ」 | v0.25.1 | 一致 |  |
| houki-nta | nta_get_tax_answer | 「No.1222 耐震改修工事をした場合（住宅耐震改修特別控除）」（見出しの直後に小見出しが続く記事） | v0.25.1 | 一致 |  |
| houki-nta | nta_get_tsutatsu | 「消基通 1-7-2（登録番号の構成）の本文」 | v0.25.0 | 一致 |  |
| houki-nta | nta_inspect_pdf_meta | 「改正通達 0025004-026 の PDF は、どれをどう読めばよいか」 | v0.25.0 | データ側の差分 | データ: `attachedPdfs[2].title` "【参考】… 新旧対応表 …（PDF/399KB）" → "【参考】令和８年11月１日から適用される「消費税法基本通達（第８章）」の構成及び新旧対応表（令和７年４月１日）（… |
| houki-nta | nta_inspect_pdf_meta | 「新旧対照表だけを保存して、表として取る」 | v0.25.0 | 一致 |  |
| houki-nta | nta_search_bunshokaitou | 「産科医療の給付金に関する文書回答事例」 | v0.25.0 | 一致 |  |
| houki-nta | nta_search_bunshokaitou | 別紙の本文にしかない語で引く | v0.25.0 | 一致 |  |
| houki-nta | nta_search_bunshokaitou | 税目の別表記をまとめて検索する（`taxonomy: "sozoku"`） | v0.25.0 | 一致 |  |
| houki-nta | nta_search_jimu_unei | 「書面添付制度の事務運営指針」 | v0.25.0 | 一致 |  |
| houki-nta | nta_search_kaisei_tsutatsu | 「インボイス関係の改正通達を新旧対照表付きで」 | v0.25.0 | 一致 |  |
| houki-nta | nta_search_qa | 「テレワークに関係する質疑応答事例」 | v0.25.0 | 一致 |  |
| houki-nta | nta_search_qa | 税目（topic）で絞る | v0.25.0 | 一致 |  |
| houki-nta | nta_search_qa | キーワードに合う文書が無いとき | v0.25.0 | 一致 |  |
| houki-nta | nta_search_tax_answer | 「医療費控除のタックスアンサー」 | v0.25.1 | 一致 |  |
| houki-nta | nta_search_tsutatsu | 「軽減税率に関係する通達の節は」 | v0.25.0 | 一致 |  |
| houki-nta | nta_search_tsutatsu | DB が古いとき（`staleness: "outdated"`） | v0.10.2 | 照合しない | 例の「- 版の照合: しない」（126 日たった DB を用意できず、取り直せないため） |
| houki-nta | resolve_abbreviation | 「電帳法 は houki-nta-mcp で引けるか」 | v0.25.0 | 一致 |  |

</details>
