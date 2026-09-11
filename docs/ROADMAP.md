# ROADMAP — 法規シリーズの現状と予定

最終更新: 2026-09-11（JST）。版はすべて `npm view` と各リポジトリの `package.json` の実測。
詳細な定点観測は `docs/reports/` に日付ごとに置く。本ファイルは「いま何が動いていて、次に何をするか」だけを持つ。

## 現状（2026-09-07）

```mermaid
graph TB
    subgraph Skill層["Skill 層（正典）"]
        SKILL["houki-research-skill v0.4.0<br/>error contract / citation / 業法独占規定<br/>plugin 化済み。workflow は tax-research のみ"]
    end
    subgraph MCP層["MCP 層（SDK v2 / Node 22 / Biome に統一済み）"]
        EGOV["houki-egov-mcp v0.5.4<br/>e-Gov 法令 API v2 / 7 tools<br/>bulk DL → SQLite FTS5 全文検索まで完了"]
        NTA["houki-nta-mcp v0.13.0<br/>国税庁 / 14 tools<br/>Phase 1〜6 完了。v1.0 判定待ち"]
    end
    subgraph 共有層["共有ライブラリ層"]
        ABBR["houki-abbreviations v0.5.0<br/>174 エントリ / 6 分野<br/>normalize + freshness + 逆引き + 検証"]
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
| houki-egov-mcp | 0.5.4 | Phase 2-7（`search_fulltext` を FTS5 に接続）完了。編（Part）を持つ法令の取り込み漏れを v0.5.1 で修正。tools/call の引数を `inputSchema` で検証し `INVALID_ARGUMENT` を返す（v0.5.3）。`get_law` の Markdown で、枝番号の条の見出しを「第70条の6」に、号を「八 資産の譲渡等　…」に、号の下のイ・ロ・ハを箇条書きにし、項の直下の表（所得税法 89 条 1 項の税率表など）を Markdown の表で出すように修正（v0.5.4 / #16）。枝番号の号（`item: "8の2"`）の指定は未対応で、起票待ち |
| houki-nta-mcp | 0.13.0 | SDK v2 移行（v0.10.0）でエラー応答を family contract に統一。Issue #17 / #18 対応（v0.10.1 / v0.10.2）。文書回答事例の本文（表と別紙）を取り込むように修正し、`--refresh` を全 6 種別に効かせた（v0.10.3 / v0.10.4）。基本通達の応答に `base_laws`（検索は `base_laws_by_tsutatsu`）と houki-egov の `get_law` への成功時 `next_actions` を追加（v0.11.0 / #20）。通称（aliases）の OR 展開は元の語で 0 件のときだけに変更、略称そのものは常時展開のまま（v0.11.1 / #21）。#20 の提案 3 を #22 に切り出し、質疑応答事例の【関係法令通達】を `related_laws` / `related_tsutatsu` に構造化して `get_law` と `nta_get_tsutatsu` への成功時 `next_actions` を追加、ページ下部の注記を `notice` / `basisDate` に分離（v0.12.0 / #22。参照 5,059 個の 94.2% を構造化）。文書系の検索 5 ツールで、その種別の文書が DB に無いときはエラー `DOC_NOT_FOUND`、キーワードに合わないだけの 0 件は件数付きの `hint` に分け、`nta_search_qa` の `domain` が必ず 0 件になる不具合を直して `topic` を追加（v0.13.0 / #23）。family の参照実装 |
| houki-abbreviations | 0.5.0（MCP が取り込んでいるのは 0.4.1） | 逆引き（`lookupByLawId` / `lookupByLawNum`）+ 検証（`validateAllEntries` / `extractLawNames`）。両 MCP の依存は `^0.4.1` で、0.x の `^` は minor を跨がないため 0.5.0 は入っていない（辞書は同一・MCP が呼ぶ 3 関数は両版にあるので動作差なし）。toolchain は ESLint + Prettier のまま（MCP 2 つは Biome） |
| houki-research-skill | 0.4.0 | 2026-09-11 に nta 0.11.0 へ追随（鉄則 3 に「通達を先に引いたら、next_actions に従って法律本文へ戻る」、tax-research にステップ ④'、前提 nta を 0.11.0 以上に。v0.4.0）。2026-09-10 に当てはめの応答型（返すもの / 返さないもの）を固定（v0.3.0）。2026-09-07 に egov 0.5.3 / nta 0.10.x へ追随（例文の引数名を `inputSchema` と一致させ、`search_fulltext` を手順に追加、`INVALID_ARGUMENT` の `detail.issues` を明記）。plugin 化 + Release 自動化済み。`docs/` に ARCHITECTURE / BUSINESS-LAW / CITATION / ERROR-HANDLING / ERROR-CODES。examples は invoice-registration と error-recovery-patterns |
| houki-hub（本 repo） | — | 2026-09-07 に pdf-agent-stack 同型へ再構成。site/ は VitePress の雛形のみ。未公開 |

## 次にやること（優先度順）

1. **houki-hub site の中身を埋める**（本 repo）
   - ガイド 4 ページ（overview / architecture / getting-started / roadmap）の文章を仕上げる
   - `generate-reference.mjs` を pdf-agent-stack から移植し、`tools/list` からツールリファレンスを生成する。houki-nta-mcp は better-sqlite3 を使うので、CI で起動できるかを先に確かめる
   - 公開の条件（DECISIONS.md の未決）を満たしたら deploy.yml の push トリガーを有効化する
2. **houki-nta-mcp v1.0.0 判定**
   - ローカル DB が古い（126 日以上）→ `--bulk-download-all` / `--bulk-download-tax-answer` を再実行して現行データで最終確認
   - Issue #3（synonym 展開）は abbreviations v0.6.0 の `expandToFormalNames` と連動。v1.0 に含めるかを決める
   - 完了後 1 か月の soft 期間を置いてから v1.0.0
   - #22（質疑応答事例の relatedLaws を法令名・条番号と通達番号に分ける。ページ下部の注記が混ざる不具合も）を v1.0 に含めるかを決める
3. **houki-egov-mcp Phase 2-8 / 2-13**
   - 2-8: 差分同期（`file_section=3&update_date` 方式）
   - 2-13: API enrichment で `category` を投入し、domain 絞り込みを実効化
   - 既知の未対応: `get_toc` が附則の条を編・章の外に平坦に並べる / 民法・消費税法の応答が長い
4. **houki-abbreviations v0.5.1 → v0.6.0**（計画は abbreviations の `docs/v0.5.1-v0.6.0-plan.md`）
   - v0.5.1: `verify-law-ids.mjs` の本実装と月次 workflow 化
   - v0.6.0: `expandToFormalNames`（nta #3 と連動）。**minor を上げたら egov / nta の `package.json` を `^0.6.0` に上げて publish し直す**（0.x の `^` は minor を跨がない）
   - `verify-law-ids.mjs` の月次 GitHub Actions 化（雛形のみの状態）
   - `lookupByLawNum` の漢数字↔算用数字正規化、`isValidLawId` の DF 系・M 省令系パターン
   - 任意: toolchain を Biome / TS 7 に揃える
5. **houki-research-skill v0.2.0 の公開 → v0.3.0**
   - v0.2.0 を push し、tag を打って Release。claude-plugins の version 表と marketplace.json を 0.2.0 に
   - workflow 追加: `revision-tracking.md`（MCP の完成を待たずに書ける）
   - examples 追加: 電帳法、相続税改正
   - `ARCHITECTURE.md` の配布形態セクションを plugin 化後の記述に更新
6. **新 MCP は houki-metadata-mcp を先に**
   - 主用途は J-SOX 型の「公布→施行ラグ」期。施行前フォロー期に時系列の横串クエリが多発する
   - 3 つ目の MCP なので、abbreviations Track 5（ルーティング）の再評価トリガーになる
7. **検査の移植**（本 repo）
   - `skill-contract-probe.mjs`: houki-research が分岐に使うフィールド（`isError` / `code` / `legal_status` / `freshness`）が公開版の応答に実在するかを起動して確かめる
   - `version-mentions.mjs`: 文中の版が未来の版になっていないかを見る

## 本筋外（優先度は上記の後）

`docs/notes/2026-08-25-scope-and-professional-use.md` に記録済み。相談メモ、士業ルーティング、e-shiwake 組み込み時の有償化、士業向け profile。
本筋（国民が法規を知り活用する）の妨げにならない範囲で、必要になったときに再開する。

## 直近の履歴

| 日付 | できごと |
|---|---|
| 2026-09-12 | houki-nta-mcp #23 起票・v0.13.0 publish（文書系の検索 5 ツールで、DB に無い種別は `DOC_NOT_FOUND`、キーワードに合わないだけの 0 件は件数付きの `hint`）。実装中に見つけた `nta_search_qa` の `domain` の不具合（必ず 0 件）も同じ版で修正し `topic` を追加。`toolHandlers` の `any` を inputSchema から導いた型に置き換える件を issue 草案にした。houki-hub の nta の版表記を 0.13.0 に更新し、ツールリファレンスを再生成 |
| 2026-09-11 〜 09-12 | houki-egov-mcp #16 起票・v0.5.4 publish（`get_law` の Markdown の条見出し・号・イロハ・表）。houki-hub の egov の版表記を 0.5.4 に更新し、ツールリファレンスを再生成 |
| 2026-09-11 | houki-hub に「文書の種類と拘束力」ページ（hub#10）。houki-nta-mcp v0.11.0 publish（#20: `base_laws` / `base_laws_by_tsutatsu` / 成功時 `next_actions`、#20 close）と v0.11.1 publish（#21: 通称の展開は 0 件のときだけ）。#22 起票。houki-research-skill v0.4.0（nta 0.11.0 への追随）。houki-nta-mcp v0.12.0 publish（#22: 質疑応答事例の関係法令通達の構造化と注記の分離。`--bulk-download-qa --refresh` で 1,841 件を取り込み直し）。houki-hub のツールリファレンスを 0.12.0 で再生成し、nta の呼び出し例を取り直し |
| 2026-09-10 | houki-research-skill v0.3.0（当てはめの応答型） |
| 2026-09-08 | houki-nta-mcp v0.10.3 / v0.10.4 publish（文書回答事例の本文取り込み、`--refresh` の 5 種別漏れ）。houki-hub のツールリファレンス自動生成と全 21 ツールの実測呼び出し例を追加。サイトを GitHub Pages に公開 |
| 2026-09-07 | houki-nta-mcp v0.10.0〜v0.10.2 publish（SDK v2 / Issue #17, #18）。houki-egov-mcp v0.5.2 / v0.5.3 publish。family 全 MCP が SDK v2 / Node 22 / Biome に揃う。houki-hub を pdf-agent-stack 同型に再構成 |
| 2026-07-19 | 現状把握レポート（`docs/reports/2026-07-19-status.md`） |
| 2026-07-14 | houki-nta-mcp v0.9.5（plugin manifest）、houki-abbreviations v0.5.0 |
| 2026-05-10 | houki-hub-doc 廃止 |
