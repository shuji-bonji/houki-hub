# 決定事項・未決事項

## 決定済み

| 日付 | 決定 |
|---|---|
| 2026-05-10 | `houki-hub-doc`（Material for MkDocs + GH Pages）は廃止・削除。ドキュメント集約は mikuro.net 上で行う **→ 2026-09-07 に変更（下記）** |
| 2026-07-19 | 紹介サイトの起点リポジトリを **houki-hub**（本 repo）に確定。当面はレポート・設計メモ置き場として運用 |
| 2026-08-25 | 本筋 = 「国民が法規を知り活用する」。エンジニア向けスタンス。houki-nta は生業として提示しない。shuji が LLM をホストして「答えるサービス」にする構造は作らない。相談メモ・士業ルーティング・profile 切替は本筋外 → `docs/notes/2026-08-25-scope-and-professional-use.md` |
| 2026-09-07 | リポジトリ構成を **pdf-agent-stack と同型**にする。`mcp/ lib/ skill/ agent/` は各リポジトリの作業コピー（.gitignore）、`site/` だけを本 repo からビルドする。`stack.json` + `scripts/generate-stack.mjs` を移植し、版は npm の実測を正典にする |
| 2026-09-07 | 公開先を **GitHub Pages `https://shuji-bonji.github.io/houki-hub/`** に変更。2026-05-10 の「mikuro.net に集約」は取り下げ。mikuro.net は将来カスタムドメインを当てる候補として残す。理由: pdf-agent-stack で deploy.yml / llms.txt 生成 / OGP の型ができており、そのまま流用できる |
| 2026-09-07 | サイトの技術スタックは **VitePress**（+ vitepress-plugin-llms + vitepress-plugin-mermaid）。SvelteKit / Astro 案は取り下げ。SvelteKit の実戦場は別プロジェクトで確保する |
| 2026-09-07 | `docs/`（レポート・議論メモ・本ファイル）は **git で追跡して公開する**。pdf-agent-stack は docs/ を非公開にしているが、houki-hub は family 全体の現状と判断の経緯を GitHub 上で辿れることに価値があるため |
| 2026-09-07 | サイトは**当面日本語のみ**。日本の法令が対象なので、まず日本語の利用者に届くことを優先する。英語ページを足すときは、日本語を正として英訳する（pdf-agent-stack は英語が先で、日本語に直訳の癖が残った）。想定読者は、日本に拠点を持つ海外企業の担当者、日本で働く外国人など、日本の法令に従う必要があるが日本語で条文を読めない人 |
| 2026-09-07 | サイトは当面**公開しない**。deploy.yml は `workflow_dispatch` のみで、push トリガーはコメントアウト。GitHub の Pages 設定も有効化しない **→ 2026-09-08 に取り下げ（下記）** |
| 2026-09-08 | サイトを**公開する**。理由: サイトが説明する単位（法令は全分野、通達・Q&A は国税庁のみ）が実物と一致しており、未対応省庁は欠落ではなく対応範囲の境界として書けている。ツールリファレンスの自動生成は公開の必須条件ではなく磨き込みなので公開後に回す。公開前に済ませたもの: 導入ページの marketplace コマンド転記、`mcp/index.md` の「未着手」という開発メモの削除、family 共通の免責ページ `/guide/disclaimer` の新設（フッターと各 MCP ページからリンク）、旧名 `houki-hub-mcp` がサイト内に無いことの確認 |
| 2026-09-12 | **ライブラリのリファレンスも実装から生成する**。`houki-abbreviations` は npm に MIT で公開しているので export はすでに公開契約であり、サイトに載せるかどうかで契約の有無は変わらない。手で書くと必ずずれる（README の `## API` 節が `searchByName(entries, query)` のまま内部関数の形を書いていた）ため、`scripts/generate-reference.mjs` に `dist/index.d.ts` を読む経路を足して `/reference/lib/houki-abbreviations` を生成する。版と節分けは JSDoc の `@since` / `@group`、「family での使用」列は `mcp/*/src` の import 走査から取り、どれも手書きしない。0.x の間は minor で破壊的変更が入り得ることをページの冒頭に書く |
| 2026-09-14 | **条文の参照関係は、houki-hub#8（法令グラフ）と対象が重なっても MCP のツールとして実装する**（houki-egov-mcp#20）。理由: RAG は Claude のサービス側にあり、自分で組むなら API 経由になる。GraphRAG のエンティティ・関係抽出も Claude API に頼ることになる。MCP が出すべきなのは、LLM の判断を挟まずに引ける参照関係である。層は分ける — egov#20 は法令 XML と法令名の規則から決定論的に引ける参照（同じ入力に同じ出力）、hub#8 は意味的な近さや趣旨の関連（Claude API による抽出）。egov#20 の出力は hub#8 の入力にもなるので、重複ではなく段。egov#20 は網羅性を主張せず、抽出できた範囲であることを応答に書く |
| 2026-09-14 | **Discussion #24 の「方向」（自分用の公開ツールとして保つ / 他者の作業に入れる）は当面決めない**。どちらでも効く 2 件（初回 100 分の試用経路、改正通達の PDF の読み方）だけを先に進める。措通・評基通の追加と裁決は、立場が決まってから着手する。理由: 立場を決めずに進められる範囲がはっきりしており、どちらに転んでも無駄にならない。Discussion #24 自身が、初回 100 分について「自分用でも重い」と書いている |
| 2026-09-14 | **「1 回の導入で終わらせる」は手数と時間の 2 段構えとして扱う**（houki-hub#22）。plugin の `dependencies` 宣言は手数を 1 回に減らすが、入れた直後に egov は約 290 MB、nta は約 100 分の取り込みが始まる。時間を下げないと手数の削減は効かない |
| 2026-09-14 | **一括 install は meta-package ではなく plugin の `dependencies` で行う**。`houki-research` の `.claude-plugin/plugin.json`（v0.7.0）と claude-plugins の `marketplace.json` の両方に `"dependencies": ["houki-egov-mcp", "houki-nta-mcp"]` を書く。Claude Code は dependencies を宣言した plugin を install すると依存も解決して install し、有効化も連動する。pdf family（pdf-publish / pdf-trust / pdf-read / pdf-specialist）が同じ形を採っている。**版の範囲は付けず名前だけ**にする — 範囲を付けると `houki-egov-mcp--v0.6.0` の形の git tag が要るが、各 MCP のタグは `v0.6.0` の形なので解決できない。`pdf-reader-mcp` は PDF に当たったときだけ要るので入れず、houki-nta-mcp#36 の結論が出てから決める。`houki-abbreviations` は各 MCP に内蔵されるライブラリで plugin ではないため対象外。公開の順序は houki-research-skill → claude-plugins（`marketplace-version-check` が GitHub 上の `plugin.json` を正として突き合わせるため） |

## 未決（公開後に決める）

- ~~ツールリファレンスの生成: pdf-agent-stack の `scripts/generate-reference.mjs`（MCP サーバーを stdio で起動して `tools/list` を Markdown にする）を移植するか。houki-nta-mcp は better-sqlite3 を使うため CI で起動できるかの確認が要る~~ → **2026-09-08 に移植済み。2026-09-12 にライブラリ（.d.ts）経路も追加**
- llms.txt: vitepress-plugin-llms でサイト全体の llms.txt を出す。各 MCP リポジトリの llms.txt（houki-nta-mcp は自己生成済み）との関係をどうするか（サイトから各リポジトリの llms.txt にリンクするだけにする案が有力）
- 英語ページ（`/en/`）を足す時期: 公開後、英語圏からのアクセスや問い合わせがあってから。足すときの順序と読者像は上の決定済みを参照。条文本文の英訳は自前で持たず、法務省の日本法令外国語訳データベース（JLT）への参照と、DeepL MCP など精度の高い翻訳ツールの利用案内で対応する案。法令用語の対訳辞書（JLT の標準対訳辞書）を houki-abbreviations 側で提供する案もある
- houki-research-skill の配布方法: claude-plugins marketplace 経由で足りるか、GitHub Release も併用するか
- ~~meta-package `@shuji-bonji/houki-hub`（一括 install）を本 repo に同居させるか~~ → **2026-09-14 に決定。作らない**。`houki-research` の `dependencies` で足りる（上の決定済みを参照）
- skill-contract-probe / version-mentions の移植時期
- `agent/` に置くもの: `houki-specialist-plugin`（pdf-specialist-plugin と同型）を作るか、claude-plugins の既存 plugin で足りるか
