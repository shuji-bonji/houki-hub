# ROADMAP — 法規シリーズの現状と予定

最終更新: 2026-09-18（JST）。版はすべて `npm view` と各リポジトリの `package.json` の実測。
詳細な定点観測は `docs/reports/` に日付ごとに置く。本ファイルは「いま何が動いていて、次に何をするか」だけを持つ。

## 現状（2026-09-07）

```mermaid
graph TB
    subgraph Skill層["Skill 層（正典）"]
        SKILL["houki-research-skill v0.8.1<br/>error contract / citation / 業法独占規定<br/>workflow は問いの形で選ぶ（feasibility-check / tax-research）"]
    end
    subgraph MCP層["MCP 層（SDK v2 / Node 22 / Biome に統一済み）"]
        EGOV["houki-egov-mcp v0.8.0<br/>e-Gov 法令 API v2 / 7 tools<br/>bulk DL → SQLite FTS5 全文検索まで完了"]
        NTA["houki-nta-mcp v0.18.1<br/>国税庁 / 14 tools<br/>Phase 1〜6 完了。v1.0 判定待ち"]
    end
    subgraph 共有層["共有ライブラリ層"]
        ABBR["houki-abbreviations v0.5.1<br/>174 エントリ / 6 分野<br/>normalize + freshness + 逆引き + 検証"]
    end
    subgraph 外部["外部（束ねの外）"]
        PDF["pdf-reader-mcp<br/>(PDF Agent Stack)"]
        PLUGINS["claude-plugins<br/>marketplace"]
    end
    SKILL -->|行動指針| EGOV & NTA
    EGOV & NTA -->|dependency| ABBR
    NTA -.->|reader_hints| PDF
    EGOV & NTA & SKILL -.->|plugin 配布| PLUGINS
    subgraph 将来["予定・構想"]
        META["houki-metadata-mcp 📅<br/>公布→施行ラグ / 改正予定"]
        MHLW["houki-mhlw-mcp 📅"]
        SAIKETSU["houki-saiketsu-mcp 💭"]
        COURT["houki-court-mcp 💭"]
        AGENT["houki-specialist-plugin 💭"]
    end
```

| リポジトリ | 版 | 状態の要点 |
|---|---|---|
| houki-egov-mcp | 0.8.0 | `--sync` で最終同期日から今日までの日次差分を取り込む。差分が無い日は飛ばし、途中で失敗しても成功した日までを記録。同じ法令の現行の版を施行日が最も新しい 1 つに保つ（v0.8.0 / #21、Phase 2-8 完了）。`get_law` の `article` / `item` で漢数字（"第三十条の二" / "八の二"）と全角数字を受け付け、`INVALID_ARTICLE_NUM` の文言から「漢数字には未対応です」を外した（v0.7.0 / #17。Discussion #20 の機能 1〜8 で最初の完了）。Phase 2-7（`search_fulltext` を FTS5 に接続）完了。編（Part）を持つ法令の取り込み漏れを v0.5.1 で修正。tools/call の引数を `inputSchema` で検証し `INVALID_ARGUMENT` を返す（v0.5.3）。`get_law` の Markdown で、枝番号の条の見出しを「第70条の6」に、号を「八 資産の譲渡等　…」に、号の下のイ・ロ・ハを箇条書きにし、項の直下の表（所得税法 89 条 1 項の税率表など）を Markdown の表で出すように修正（v0.5.4 / #16）。`get_law` の `item` で枝番号の号（`"8の2"`）を指定でき、項が 1 つの条は `paragraph` なしで号を引ける。引数の型を inputSchema から導き（json-schema-to-ts）、inputSchema に無い引数は `INVALID_ARGUMENT`（v0.6.0）。README 1 行目と npm の description を family の仕事の 1 行に揃え、`mcpName` と `server.json` を足した（v0.6.1、コード変更なし） |
| houki-nta-mcp | 0.18.1 | SDK v2 移行（v0.10.0）でエラー応答を family contract に統一。Issue #17 / #18 対応（v0.10.1 / v0.10.2）。文書回答事例の本文（表と別紙）を取り込むように修正し、`--refresh` を全 6 種別に効かせた（v0.10.3 / v0.10.4）。基本通達の応答に `base_laws`（検索は `base_laws_by_tsutatsu`）と houki-egov の `get_law` への成功時 `next_actions` を追加（v0.11.0 / #20）。通称（aliases）の OR 展開は元の語で 0 件のときだけに変更、略称そのものは常時展開のまま（v0.11.1 / #21）。#20 の提案 3 を #22 に切り出し、質疑応答事例の【関係法令通達】を `related_laws` / `related_tsutatsu` に構造化して `get_law` と `nta_get_tsutatsu` への成功時 `next_actions` を追加、ページ下部の注記を `notice` / `basisDate` に分離（v0.12.0 / #22。参照 5,059 個の 94.2% を構造化）。文書系の検索 5 ツールで、その種別の文書が DB に無いときはエラー `DOC_NOT_FOUND`、キーワードに合わないだけの 0 件は件数付きの `hint` に分け、`nta_search_qa` の `domain` が必ず 0 件になる不具合を直して `topic` を追加（v0.13.0 / #23）。引数の型を inputSchema から導き未知の引数を拒否、`nta_search_tsutatsu` の使われていない `type` / `domain` を削除、文書回答事例の税目の別表記（`sozoku` / `souzoku` など）をまとめて検索、枝番号の号を `related_laws[].item` に文字列で入れて `get_law` に渡す（v0.14.0）。取得系 3 ツールで、docId の誤りと DB にその種別が無いことを分けて返すようにした（v0.14.1）。bulk download の税目フラグ（`--bunsho-taxonomy` / `--tax-answer-taxonomy` / `--qa-topic`）の値を検証し、一覧に無い値は何も投入せず exit 1（v0.14.2 / #25）。全角英字が半角にならず `ＮＩＳＡ` と `NISA` で検索結果が分断されていた問題を直し、既存 DB を起動時に一度だけ入れ直す（v0.15.0 / #27）。`nta_get_qa` と `nta_get_tax_answer` がローカル DB を見ずに毎回国税庁サイトを取りに行っていたのを `nta_get_tsutatsu` と同じ形に揃え、応答に `source` を付けた。DB から live と同じ構造を返すため `document` に `structured_json` を足した（v0.16.0 / #29）。国税庁の索引から消えた文書に `orphaned_at` で印を付け、検索・取得の応答で現行の文書と区別できるようにした。あわせて、消えた件数が構造的に常に 0 だった集計を索引との突き合わせに変えた（v0.17.0 / #30）。初めて入れた人が数分で 1 件の通達を引けるよう `--quickstart`（通達 1 本、約 3〜5 分）を足し、`--help` を「まず試す → 種別を足す → 全部入り → 保守」の順にし、全部入りの開始時に種別ごとの目安を出す（v0.18.0 / #35）。README 1 行目と npm の description を揃え、`mcpName` と `server.json` を足した（v0.18.1、コード変更なし）。family の参照実装 |
| houki-abbreviations | 0.5.1（MCP が取り込んでいるのは 0.4.1） | 逆引き（`lookupByLawId` / `lookupByLawNum`）+ 検証（`validateAllEntries` / `extractLawNames`）。両 MCP の依存は `^0.4.1` で、0.x の `^` は minor を跨がないため 0.5.0 は入っていない（辞書は同一・MCP が呼ぶ 3 関数は両版にあるので動作差なし）。toolchain は ESLint + Prettier のまま（MCP 2 つは Biome） |
| houki-research-skill | 0.8.1 | 2026-09-19 に feasibility-check を実際の問い（領収書 PDF の保存機能）で通し `examples/electronic-bookkeeping.md` に実測を記録、手順書に 4 点反映（v0.8.1）。同日 `workflows/feasibility-check.md`（実装前に仕様が法令のどこに触れるかを条文で確かめる 7 ステップ）と、SKILL.md に問いの形 → workflow の表を追加。`description` の先頭は全法規の横断調査のままにし、問いの形を 4 つ並べる（先頭を絞ると他の問いで発火しないため。v0.8.0）。2026-09-14 に `plugin.json` と claude-plugins の `marketplace.json` に `dependencies: ["houki-egov-mcp", "houki-nta-mcp"]` を宣言し、この skill を入れれば 2 つの MCP も入るようにした（v0.7.0、hub#22 の (a)）。2026-09-13 に nta 0.16.0 / 0.17.0 へ追随（鉄則 3 に「索引から消えた文書は現行の取扱いとして引用しない」と「取得ツールの `source` は取得時刻の意味を変える」、`docs/CITATION.md` の基本原則に印の注記、`docs/ARCHITECTURE.md` の応答契約に `source` と `index_status`。前提の最小版は v0.12.0 のまま据え置き。v0.6.0）。2026-09-12 に `next_actions[].example` の渡し方を修正（`mcp` と `tool` は引数ではないので除いてから渡す。egov 0.6.0 以上では INVALID_ARGUMENT になっていた）、nta 0.14.1 の取得系のエラーに追随（v0.5.1）。同日 nta 0.12.0〜0.14.0 へ追随（質疑応答事例から `next_actions` で法律本文と通達へ戻る手順、検索の `DOC_NOT_FOUND` は該当なしと答えず投入を案内、前提 nta を 0.12.0 以上に。v0.5.0）。2026-09-11 に nta 0.11.0 へ追随（鉄則 3 に「通達を先に引いたら、next_actions に従って法律本文へ戻る」、tax-research にステップ ④'、前提 nta を 0.11.0 以上に。v0.4.0）。2026-09-10 に当てはめの応答型（返すもの / 返さないもの）を固定（v0.3.0）。2026-09-07 に egov 0.5.3 / nta 0.10.x へ追随（例文の引数名を `inputSchema` と一致させ、`search_fulltext` を手順に追加、`INVALID_ARGUMENT` の `detail.issues` を明記）。plugin 化 + Release 自動化済み。`docs/` に ARCHITECTURE / BUSINESS-LAW / CITATION / ERROR-HANDLING / ERROR-CODES。examples は invoice-registration と error-recovery-patterns |
| houki-hub（本 repo） | — | 2026-09-07 に pdf-agent-stack 同型へ再構成。site/ は VitePress の雛形のみ。未公開 |

## Discussion #20 / #24 の指摘の割り付け

### Discussion #20（houki-egov-mcp）の割り付け（14 項目）

2026-09-14 の [Discussion #20](https://github.com/shuji-bonji/houki-hub/discussions/20) で挙げた「劣っている点」14 項目を、実装先ごとに割り付けた。起票文と実測による訂正は `docs/notes/2026-09-14-issue-21-22-breakdown.md` に置く（起票は `scripts/create-issues-2026-09-14.sh`）。hub#21（機能 9 項目）と hub#22（配布と制約 5 項目）は、評価の転記から進捗を束ねる親 Issue に書き換える。

| # | 内容 | 実装先 | 既存計画との関係 |
|---|---|---|---|
| 機能 1 | 添付ファイル・法令ファイル形式 | egov#19 | 新規 |
| 機能 2 | 条文の参照を辿る | egov#20 | hub#8（法令グラフ）と対象が重なるが、重なったまま MCP のツールとして実装する（2026-09-14 決定。下記） |
| 機能 3 | 引用の実在確認 | egov#18 | 新規。既存の `get_law` / `search_fulltext` で組める |
| 機能 4 | 漢数字の条番号 | egov#17 | 新規。`src/utils/article-num.ts` の 1 ファイル。14 項目で最も費用が小さい |
| 機能 5 | 差分同期 | egov#21 | 下記 4 の Phase 2-8。**部品は実装済み**（下記の訂正） |
| 機能 6 | 章・節単位の分割取得 | egov#22 | 下記 4 の「民法・消費税法の応答が長い」と同じ |
| 機能 7 | 2 文字語の本文索引 | egov#23 | 新規 |
| 機能 8 | 附則の目次配置 | egov#24 | 下記 4 の「既知の未対応」と同じ |
| 機能 9 | 裁決・判例・厚労通達 | — | 下記 7 の新 MCP が回答。欠落ではなく責務を分けた結果なので Issue にしない |
| 配布 1 | better-sqlite3 | hub#23（調査） | 下記 9。下記 1 の「CI で起動できるか」と同じ依存 |
| 配布 2 | Node.js 22 以上 | hub#23 | 配布 1 と同じ Issue |
| 配布 3 | ライセンス文言 | `docs/DECISIONS.md` | 「本筋外」の士業向けの線引きと接する |
| 配布 4 | 公式 MCP 後の位置 | `docs/DECISIONS.md` | 新規 |
| 配布 5 | 発見性 | hub#22 | 下記 2 |

あわせて houki-abbreviations に 1 本（abbr#6 `lookupByLawNum` の漢数字↔算用数字正規化）。これは下記 5 に既出で、機能 4 とは対象が違う（条番号 / 法令番号）。

### Discussion #24（houki-nta-mcp）の割り付け

[Discussion #24](https://github.com/shuji-bonji/houki-hub/discussions/24) の「劣っている点」7 項目のうち、新しく起票したのは 2 件だけ。残りは #20 の割り付けがすでに持っている。#20 と #24 は別々の対象から出発して同じ結論に収束した。**残っている壁は機能ではなく導入**である。

| # | 内容 | 行き先 |
|---|---|---|
| 劣 1 | 基本通達の本数が少ない（評基通・措通 6 種ほか） | 立場が決まってから。「他者の作業に入れる」を取る場合のみ |
| 劣 2 | 裁決が無い | 下記 7 の houki-saiketsu-mcp。#20 の機能 9 と同じ構造で Issue にしない |
| 劣 3 | 法令と通達が同じ導入にならない | hub#22 |
| 劣 4 | 初回約 100 分 | nta に新規起票。下記 2 の (b) と不可分 |
| 劣 5 | PDF 本文を読まない | nta に新規起票 |
| 劣 6 | 名前と発見 | hub#22 |
| 劣 7 | 業としての利用を想定外 | `docs/DECISIONS.md`（配布 3 と同じ） |

Discussion #24 は「自分用の公開ツールとして保つ」か「他者の作業に入れる」かの二択を置いている。当面どちらも選ばず、**どちらでも効く劣 4 と劣 5 だけ**を進める。劣 4 は Discussion #24 自身が「自分用でも重い」と書いている。

### 条文の参照関係をどこに持つか（2026-09-14 決定）

機能 2（egov#20）と hub#8（GraphRAG・KAG による法令グラフ）は対象が重なるが、**重なったまま MCP のツールとして実装する**。RAG は Claude のサービス側にあり、GraphRAG のエンティティ・関係抽出も Claude API に頼ることになるため、MCP が出すべきなのは LLM の判断を挟まずに引ける参照関係だ、という判断。

| 層 | 返すもの | 作り方 |
|---|---|---|
| egov#20 | 法令 XML と法令名の規則から決定論的に引ける参照。同じ入力に同じ出力 | egov のコード |
| hub#8 | 意味的な近さ、趣旨の関連、条をまたぐ要約 | Claude API による抽出 |

egov#20 の出力は hub#8 の入力にもなる。重複ではなく段。

> Issue 番号は 3 つのリポジトリで独立に振られ、しかも重なっている（`egov#21` と `hub#21` は別物）。本ファイルでは `egov#` = houki-egov-mcp、`hub#` = houki-hub、`abbr#` = houki-abbreviations として書く。

### 実測による訂正

起票前に egov v0.6.0 のソースを確認したところ、Discussion の記述と実態が食い違う箇所があった。

| Discussion の記述 | 実測（egov v0.6.0） |
|---|---|
| 機能 5「DB 更新は全件再取り込みだけ」 | `--bulk-download-by-date <YYYYMMDD>` が `downloadIncrementalZip`（`file_section=3`）で単日差分を取り込む。`sync_state` もある。欠けているのは、前回同期日から今日までの未取得日を自動で回す入口 |
| 機能 8「附則を平坦に並べる」 | `isSupplementaryArticle` と `附則(3) 1` の表示はある。欠けているのは `get_toc` の階層配置 |

## 次にやること（優先度順）

1. **houki-hub site の中身を埋める**（本 repo）
   - ガイド 4 ページ（overview / architecture / getting-started / roadmap）の文章を仕上げる
   - `generate-reference.mjs` を pdf-agent-stack から移植し、`tools/list` からツールリファレンスを生成する。houki-nta-mcp は better-sqlite3 を使うので、CI で起動できるかを先に確かめる
   - 公開の条件（DECISIONS.md の未決）を満たしたら deploy.yml の push トリガーを有効化する
2. **発見性 — 1 種類の仕事を 1 回の導入で終わらせる**（hub#22 / 配布 5）
   - 対象は claude-plugins の `marketplace.json`、egov と nta の npm `description`、houki-hub site、MCP ディレクトリ。egov 単体の話ではない
   - **2 段構え**。(a) 手数: `dependencies` 宣言で plugin を 1 回に。(b) 時間: 入れた直後に egov は約 290 MB、nta は約 100 分の取り込みが始まる。(b) を下げないと (a) は効かない
   - (a) は 2026-09-14 に実装済み（公開待ち）。houki-research-skill v0.7.0 の `plugin.json` と claude-plugins の `marketplace.json` の両方に `"dependencies": ["houki-egov-mcp", "houki-nta-mcp"]`。**公開の順序は houki-research-skill を先に push・タグ付け → そのあと claude-plugins**（`marketplace-version-check` が GitHub 上の `plugin.json` を正として突き合わせるため）
   - (b) nta 側は 2026-09-18 に公開済み（nta v0.18.0、PR #37、nta#35 close）。`--quickstart`（通達 1 本、約 3〜5 分）、`--help` の並び替え、全部入りの開始時に目安表。PR 本文は `docs/notes/issues-2026-09-14/pr-nta-35.md`
   - (b) egov 側は 2026-09-19 に README を書き換え（ブランチ `docs/22b-readme-try-first`、PR 待ち）。冒頭に「まず試す（ローカル DB なし）」— 7 ツールのうち 6 つは DB 無しで動き、要るのは `search_fulltext` だけ — を置き、DB あり / なしの対応表を添えた。コードは変えていない。PR 本文は `docs/notes/issues-2026-09-14/pr-egov-22b.md`
   - (c) 名前と掲載: 候補と文言案と掲載先の手順を `docs/notes/2026-09-19-job-name-and-listing.md` に置いた（2026-09-19）。仕事の 1 行（推奨 J1「実装する前に、その仕様が法令のどこに触れるかを条文で確かめる」）と違いの 1 行（推奨 D1「法律で決まっている」と「通達でそうなっている」を混ぜずに返す）の 2 層。掲載先は公式 MCP Registry を先に（family の MCP はどれも未登録。`mcpName` を入れた publish が要る）。**2026-09-19 に J1 + D1 で決定**。アクターごとの違いは MCP ではなく Skill の workflow に置く（問いの形 1 つに workflow 1 つ。ノートの §8）
   - 文言の差し替えは 2026-09-19 に実施し、egov 0.6.1（PR #26）/ nta 0.18.1（PR #38）を publish、claude-plugins も push 済み。公式 MCP Registry に egov 0.6.1 / nta 0.18.1 を登録済み（2026-09-19 08:25 / 08:28 JST。`server.json` の description は 100 文字制限のため英語 1 文。ノートの §9）。hub: hero / README / overview / 3 つの場面（main 直接）。egov: README 1 行目・npm description・`mcpName`・`server.json`・0.6.1（ブランチ `docs/22c-name-and-registry`）。nta: 同じく 0.18.1（同名ブランチ）。claude-plugins: 3 件の description（ブランチ `docs/houki-job-name`。egov / nta の publish 後に push）。PR 本文は `docs/notes/issues-2026-09-14/pr-egov-22c.md` / `pr-nta-22c.md`
   - 公式 MCP Registry への登録は、各 publish 後に `mcp-publisher login github` → `publish`。MCP ディレクトリ（awesome-mcp-servers / Glama / PulseMCP）と記事は Registry の後
   - `shuji-bonji/claude-plugins` の `marketplace.json` で、`houki-research` に `"dependencies": ["houki-egov-mcp", "houki-nta-mcp"]` を宣言する。いまは houki の plugin が 3 つ並んでいて、1 つの仕事に 3 回の導入が要る。`pdf-publish` が `pdf-writer-mcp` で同じ形を取っている
   - 仕事の名前を 1 つ決める。`tax-law-mcp` と同じ「税務の裏取り」は、README / DISCLAIMER が業としての利用を想定外としているため名乗れない（配布 3）。houki だけが答えられる問い（索引から消えたか / 拘束力 / 根拠条文 / 取得日時）を名前にする
   - README の 1 行目、npm の `description`、`marketplace.json` の `description` を、決めた名前に揃える
   - MCP ディレクトリ（mcp.so / PulseMCP / Smithery / awesome-mcp-servers）に出す。site が空のまま出すと着地点が無いので 1 の後
   - 測り方は npm の週次ダウンロードではなく、plugin の導入数と記事から site への流入で見る
3. **houki-nta-mcp v1.0.0 判定**
   - ローカル DB が古い（126 日以上）→ `--bulk-download-all` / `--bulk-download-tax-answer` を再実行して現行データで最終確認
   - Issue #3（synonym 展開）は abbreviations v0.6.0 の `expandToFormalNames` と連動。v1.0 に含めるかを決める
   - 完了後 1 か月の soft 期間を置いてから v1.0.0
   - Discussion #24 から新規 2 件（劣 4 初回 100 分の試用経路 / 劣 5 改正通達の PDF の読み方）。v1.0 に含めるかを決める。劣 4 は上記 2 の (b) と不可分
4. **houki-egov-mcp — Phase 2-8 / 2-13 と Discussion #20 機能 1〜8**
   - ~~漢数字の条番号・号番号（egov#17 / 機能 4）~~: 2026-09-19 に v0.7.0 で publish。`search_fulltext` の keyword 中の漢数字を boost に使うかは別件
   - ~~2-8 差分同期（egov#21 / 機能 5）~~: 2026-09-19 に v0.8.0 で publish
   - 引用の実在確認（egov#18 / 機能 3）: `verify_citations` 相当。既存の `get_law` / `search_fulltext` で組める。新しいデータ源は要らない
   - 添付ファイルと法令ファイル形式（egov#19 / 機能 1）: 応答でバイナリをどう返すか（保存先パス / base64 / URL のみ）を先に決めて `docs/DESIGN.md` に書く
   - 施行令・施行規則の関連付け（egov#20 / 機能 2）: hub#8 と重なったまま MCP のツールとして実装する。決定論で引ける参照だけを返し、網羅性は主張しない
   - 章・節単位の分割取得（egov#22 / 機能 6）: 既知の未対応「民法・消費税法の応答が長い」と同じ
   - `get_toc` の附則の階層配置（egov#24 / 機能 8）: 既知の未対応。本則と附則を別の枝にし、附則は改正法ごとにまとめる
   - 2 文字語の本文検索（egov#23 / 機能 7）: `articles_fts` / `laws_fts` は `tokenize = 'trigram'` で 3 文字以上。まず挙動を応答で明示するところから
   - 2-13: API enrichment で `category` を投入し、domain 絞り込みを実効化
5. **houki-abbreviations v0.5.1 → v0.6.0**（計画は abbreviations の `docs/v0.5.1-v0.6.0-plan.md`）
   - v0.5.1: `verify-law-ids.mjs` の本実装と月次 workflow 化
   - v0.6.0: `expandToFormalNames`（nta #3 と連動）。**minor を上げたら egov / nta の `package.json` を `^0.6.0` に上げて publish し直す**（0.x の `^` は minor を跨がない）
   - `verify-law-ids.mjs` の月次 GitHub Actions 化（雛形のみの状態）
   - `lookupByLawNum` の漢数字↔算用数字正規化（abbr#6）、`isValidLawId` の DF 系・M 省令系パターン（Discussion #20 機能 4 と対。対象は法令番号で、egov の条番号とは別）
   - 任意: toolchain を Biome / TS 7 に揃える
6. **houki-research-skill の次の版**
   - ~~workflow 追加: `feasibility-check.md`~~ → 2026-09-19 に v0.8.0 として公開（PR #6、description の直し #7）。7 ステップ（語の置き換え → 法令 → 条文 → 委任先 → 通達 → 施行日 → 制約の一覧）。SKILL.md に問いの形 → workflow の表。PR 本文は `docs/notes/issues-2026-09-14/pr-skill-0.8.0.md`
   - ~~examples 追加: `electronic-bookkeeping.md`~~ → 2026-09-19 に実測して作成し v0.8.1 として公開（claude-plugins も 0.8.1）。12 回の呼び出しで電帳法 7 条 → 施行規則 4 条 → 準用先 → 法人税法施行規則 59 条 → 2027-01-01 の未施行改正まで。手順書に 4 点反映（除外した法令の記録 / DB があれば規則も同時に当たる / 二段目の委任 / `at` で未施行版）
   - workflow 追加: `revision-tracking.md`（MCP の完成を待たずに書ける）
   - examples 追加: 電帳法、相続税改正
   - 印が付いた文書の実例が出たら、`docs/CITATION.md` の書き方の例を実測に差し替える（v0.6.0 では `<題名>` `<docId>` の形で書いている）
   - egov に `verify_citations` が入ったら、citation 手順から呼ぶ
7. **新 MCP は houki-metadata-mcp を先に**
   - 主用途は J-SOX 型の「公布→施行ラグ」期。施行前フォロー期に時系列の横串クエリが多発する
   - 3 つ目の MCP なので、abbreviations Track 5（ルーティング）の再評価トリガーになる
   - Discussion #20 の機能 9（裁決・判例・厚労通達）への回答はここ。houki-saiketsu / houki-court / houki-mhlw の着手順は metadata の後に決める
8. **検査の移植**（本 repo）
   - `skill-contract-probe.mjs`: houki-research が分岐に使うフィールド（`isError` / `code` / `legal_status` / `freshness`）が公開版の応答に実在するかを起動して確かめる
   - `version-mentions.mjs`: 文中の版が未来の版になっていないかを見る
9. **better-sqlite3 と Node 22 以上の見直し（調査）**（hub#23 / 配布 1・2）
   - 標準の `node:sqlite` で FTS5・トリガ・WAL・プリペアドステートメントが満たせるか
   - 満たせる場合、安定版として使える Node の最小版。`engines` の `>=22.0.0` を上げる必要があるか。上げると Claude Desktop の同梱ランタイムで動くか
   - 移行しない場合の代替（ビルド失敗時に読み取り専用へ落とす、など）
   - egov と nta の両方が対象。結論は `docs/DECISIONS.md` へ

## 本筋外（優先度は上記の後）

`docs/notes/2026-08-25-scope-and-professional-use.md` に記録済み。相談メモ、士業ルーティング、e-shiwake 組み込み時の有償化、士業向け profile。
本筋（国民が法規を知り活用する）の妨げにならない範囲で、必要になったときに再開する。

## 直近の履歴

| 日付 | できごと |
|---|---|
| 2026-09-19 | houki-egov-mcp #21（差分同期 `--sync`）を PR #29 で取り込み、v0.8.0 を publish。公式 MCP Registry と claude-plugins も 0.8.0 に。実環境の初回実測: 2026-09-07 に全件取り込みした DB（laws 10,810 件）に対して 13 日分を 2 分 50 秒で確認、10 日に差分あり（341 件 upsert、44 件 unchanged）、3 日（土日と当日）は差分なし。1 日分の zip は 26 KB〜30 MB で、取り込み時間はほぼ zip の大きさに比例（30 MB で約 37 秒）。`last_sync_date` から今日までの日次差分を日付順に取り込み、差分が無い日（e-Gov は HTTP 500 を返す）は飛ばし、途中で失敗しても成功した日までを記録する。合わせて、差分で同じ法令の新しい版が現行として届いたときに前の版を `PreviousEnforced` に落とすようにした（これまでは `search_fulltext` で同じ法令が 2 度ヒットする経路があった）。VM で 7 日分を実測: 1 分 11 秒、234 件 upsert。Discussion #20 の機能 5 |
| 2026-09-19 | houki-egov-mcp #17（漢数字の条番号・号番号）を PR #28 で取り込み、v0.7.0 を publish。公式 MCP Registry と claude-plugins の追随は同日の手順で実施。`get_law` の `article` / `item` に "第三十条の二" / "八の二" と全角数字を渡せるようにし、`INVALID_ARTICLE_NUM` の文言から「漢数字には未対応です」を外した。`search_fulltext` のキーワード中の漢数字は本文のトークンのままにし、boost に回すかは別に検討（条文本文が他の条を漢数字で参照するため）。Discussion #20 の機能 1〜8 で最初の完了 |
| 2026-09-19 | houki-research-skill v0.8.1 を公開: feasibility-check を実際の問い（領収書 PDF の保存機能）で通し、`examples/electronic-bookkeeping.md` に実測を記録。電帳法は 2027-01-01 施行の未施行改正があり（令和七年法律第十三号）、7 条の本文は同一。電帳法 Q&A（一問一答）は nta の対象外で、タックスアンサー 5930 自身が国税庁サイトへ案内している |
| 2026-09-19 | houki-research-skill v0.8.0 を公開（`workflows/feasibility-check.md`、問いの形 → workflow の表）。SKILL.md の `description` の先頭を「実装する前に…」にしていたのを、全法規の横断調査に戻して問いの形を並べる形に直した（先頭を絞ると「私の場合は」「今も有効か」で発火しないため）。claude-plugins 0.8.0 に追随 |
| 2026-09-19 | houki-research-skill v0.8.0（ブランチ、PR 待ち）: `workflows/feasibility-check.md` と、SKILL.md に問いの形 → workflow の表。hub#22 の (c) で決めた入口の 1 行に対応する手順書。利用者ごとの違いを Skill の workflow に置く方針の最初の実装 |
| 2026-09-19 | 公式 MCP Registry に `io.github.shuji-bonji/houki-egov-mcp` 0.6.1 と `houki-nta-mcp` 0.18.1 を登録。日本の法令を扱う MCP は Registry 上で初。`server.json` の description が 100 文字制限で一度 422 になり、英語 1 文に直した（ブランチ `fix/server-json-description`、PR 待ち） |
| 2026-09-19 | egov 0.6.1（PR #26）/ nta 0.18.1（PR #38）を publish（README 1 行目・npm description・`mcpName`・`server.json`）。claude-plugins の 3 件の description を push。houki-hub の stack / site を追随。公式 MCP Registry は未登録（`mcp-publisher publish` が残り） |
| 2026-09-19 | hub#22 の (c)。仕事の 1 行を J1「実装する前に、その仕様が法令のどこに触れるかを条文で確かめる」、違いの 1 行を D1「『法律で決まっている』と『通達でそうなっている』を混ぜずに返す」に決定。hub の hero / README / overview を差し替え、「3 つの場面」を置いた。egov 0.6.1 / nta 0.18.1 のブランチで README 1 行目・npm description・`mcpName`・`server.json`。claude-plugins の 3 件の description。アクターごとの違いは Skill の workflow に置く方針（`feasibility-check.md` を次の版で） |
| 2026-09-18 | houki-nta-mcp #35 を実装し PR #37 で取り込み、v0.18.0 を publish。claude-plugins は版のみ追随。`--quickstart` で通達 1 本を約 3〜5 分で入れられるようにし、`--help` を「まず試す → 種別を足す → 全部入り → 保守」の順に。README の「約 50 分」2 箇所を約 100 分に訂正。hub#22 の (b) 導入の時間の nta 側 |
| 2026-09-14 | hub#22 の (a) 導入の手数を実装。houki-research v0.7.0 の `plugin.json` と claude-plugins の `marketplace.json` に `"dependencies": ["houki-egov-mcp", "houki-nta-mcp"]` を宣言し、`houki-research` を入れれば条文と通達の両方が揃うようにした。版の範囲は付けず名前だけ（各 MCP の git tag が `v0.6.0` 形式で、範囲解決に要る `houki-egov-mcp--v0.6.0` 形式ではないため）。`pdf-reader-mcp` は nta#36 の結論待ちで入れていない。未公開 |
| 2026-09-14 | Discussion #24（nta の価値を整理）を割り付け。7 項目のうち新規は 2 件（劣 4 の試用経路、劣 5 の PDF）で、劣 3・6・7 は hub#22 と DECISIONS.md がすでに持っていた。#20 と #24 が同じ結論（壁は機能ではなく導入）に収束したため、hub#22 を (a) 手数 / (b) 時間 / (c) 名前と掲載 に分割。あわせて、条文の参照関係は hub#8 と重なったまま MCP のツールとして実装すると決定（egov#20） |
| 2026-09-14 | Discussion #20 で houki-egov-mcp の価値を整理し、「劣っている点」14 項目を hub#21（機能 9 件）と hub#22（配布と制約 5 件）に起票。本 ROADMAP に割り付け表を追加し、起票文を `docs/notes/2026-09-14-issue-21-22-breakdown.md` に置いた。起票前の実測で 2 件を訂正（機能 5 の差分同期は `--bulk-download-by-date` で部品が実装済み、機能 8 の附則は表示はあり `get_toc` の階層配置だけが不足） |
| 2026-09-13 | houki-research-skill v0.6.0 公開（nta 0.16.0 / 0.17.0 への追随。索引から消えた文書を現在の取扱いの根拠にしない手順と、`source: "db"` のときの取得時刻の扱い）。plugin 更新済み |
| 2026-09-13 | houki-nta-mcp #30 起票・v0.17.0 publish（索引から消えた文書に `orphaned_at` で印を付け、検索 5 ツールの各件に `index_status` と `orphaned_at`、取得 5 ツールに `notice` を付ける。索引から消えた件数が構造的に常に 0 だったのを、索引から集めた URL 集合と DB の突き合わせに変えた）。公開版を plugin から試用し、`--bulk-download-jimu-unei` の 32 件で `marked: 0` / `totalOrphaned: 0` を確認 |
| 2026-09-13 | houki-nta-mcp #29 起票・v0.16.0 publish（`nta_get_qa` / `nta_get_tax_answer` がローカル DB を先に引き、無ければ取得して書き戻す。応答に `source`。`document` に `structured_json` を足し SCHEMA_VERSION 5 → 6）。公開版で 1535 と shohi/02/19 を 2 回ずつ引き、1 回目 `live` → 2 回目 `db` で `fetchedAt` が変わらないことを確認 |
| 2026-09-12 | houki-abbreviations の API リファレンスを追加（hub）。`generate-reference.mjs` に `dist/index.d.ts` を読む経路を足し、`/reference/lib/houki-abbreviations` を生成。版と節は JSDoc の `@since` / `@group`、「family での使用」列は `mcp/*/src` の import 走査から取る。あわせて houki-abbreviations の README の `searchByName` ほか 3 関数の第 1 引数の誤りと、JSDoc の例の古い実数を修正 |
| 2026-09-12 | houki-nta-mcp #25 起票・v0.14.2 publish（bulk download の税目フラグの値を検証し、打ち間違いは何も投入せず使える値を表示して exit 1。`--bunsho-taxonomy` は国税局の表記も受け付け本庁の表記に直す。`--help` と README に値の一覧）。houki-hub の版表記と bulk download の節を更新 |
| 2026-09-12 | houki-research-skill v0.5.0 の点検で 6 件を修正（issue は立てずに進めた）。houki-nta-mcp v0.14.1（取得系 3 ツールで、docId の誤りと DB にその種別が無いことを分けて返す）、houki-research-skill v0.5.1（`next_actions[].example` から `mcp` と `tool` を除いて渡す、エラー回復例を実測に差し替え、`INVALID_ARGUMENT` の未知の引数、鉄則の数）。houki-hub の版表記と説明を更新 |
| 2026-09-12 | 残りの一括対応（issue は立てずに進めた）。houki-egov-mcp v0.6.0（`get_law` の `item` の枝番号、引数の型を inputSchema から導く、未知の引数を拒否）、houki-nta-mcp v0.14.0（同じ仕組み、`nta_search_tsutatsu` の `type` / `domain` 削除、文書回答事例の税目の別表記、枝番号の号の `next_actions`）、houki-research-skill v0.5.0（質疑応答事例の手順、検索の `DOC_NOT_FOUND`）。houki-hub の版表記と説明を更新 |
| 2026-09-12 | houki-nta-mcp #23 起票・v0.13.0 publish（文書系の検索 5 ツールで、DB に無い種別は `DOC_NOT_FOUND`、キーワードに合わないだけの 0 件は件数付きの `hint`）。実装中に見つけた `nta_search_qa` の `domain` の不具合（必ず 0 件）も同じ版で修正し `topic` を追加。`toolHandlers` の `any` を inputSchema から導いた型に置き換える件を issue 草案にした（同日、issue を立てずに egov v0.6.0 / nta v0.14.0 で実装）。houki-hub の nta の版表記を 0.13.0 に更新し、ツールリファレンスを再生成 |
| 2026-09-11 〜 09-12 | houki-egov-mcp #16 起票・v0.5.4 publish（`get_law` の Markdown の条見出し・号・イロハ・表）。houki-hub の egov の版表記を 0.5.4 に更新し、ツールリファレンスを再生成 |
| 2026-09-11 | houki-hub に「文書の種類と拘束力」ページ（hub#10）。houki-nta-mcp v0.11.0 publish（#20: `base_laws` / `base_laws_by_tsutatsu` / 成功時 `next_actions`、#20 close）と v0.11.1 publish（#21: 通称の展開は 0 件のときだけ）。#22 起票。houki-research-skill v0.4.0（nta 0.11.0 への追随）。houki-nta-mcp v0.12.0 publish（#22: 質疑応答事例の関係法令通達の構造化と注記の分離。`--bulk-download-qa --refresh` で 1,841 件を取り込み直し）。houki-hub のツールリファレンスを 0.12.0 で再生成し、nta の呼び出し例を取り直し |
| 2026-09-10 | houki-research-skill v0.3.0（当てはめの応答型） |
| 2026-09-08 | houki-nta-mcp v0.10.3 / v0.10.4 publish（文書回答事例の本文取り込み、`--refresh` の 5 種別漏れ）。houki-hub のツールリファレンス自動生成と全 21 ツールの実測呼び出し例を追加。サイトを GitHub Pages に公開 |
| 2026-09-07 | houki-nta-mcp v0.10.0〜v0.10.2 publish（SDK v2 / Issue #17, #18）。houki-egov-mcp v0.5.2 / v0.5.3 publish。family 全 MCP が SDK v2 / Node 22 / Biome に揃う。houki-hub を pdf-agent-stack 同型に再構成 |
| 2026-07-19 | 現状把握レポート（`docs/reports/2026-07-19-status.md`） |
| 2026-07-14 | houki-nta-mcp v0.9.5（plugin manifest）、houki-abbreviations v0.5.0 |
| 2026-05-10 | houki-hub-doc 廃止 |
