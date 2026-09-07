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
| 2026-09-07 | サイトは当面**公開しない**。deploy.yml は `workflow_dispatch` のみで、push トリガーはコメントアウト。GitHub の Pages 設定も有効化しない |

## 未決（サイト公開までに決める）

- 公開の条件: 何が揃ったら push トリガーを有効化するか（候補: ガイド 4 ページ + MCP 2 ページ + Skill 1 ページ + ツールリファレンス自動生成が通ること）
- ツールリファレンスの生成: pdf-agent-stack の `scripts/generate-reference.mjs`（MCP サーバーを stdio で起動して `tools/list` を Markdown にする）を移植するか。houki-nta-mcp は better-sqlite3 を使うため CI で起動できるかの確認が要る
- llms.txt: vitepress-plugin-llms でサイト全体の llms.txt を出す。各 MCP リポジトリの llms.txt（houki-nta-mcp は自己生成済み）との関係をどうするか（サイトから各リポジトリの llms.txt にリンクするだけにする案が有力）
- 英語ページ（`/en/`）を足す時期: 公開後、英語圏からのアクセスや問い合わせがあってから。足すときの順序と読者像は上の決定済みを参照。条文本文の英訳は自前で持たず、法務省の日本法令外国語訳データベース（JLT）への参照と、DeepL MCP など精度の高い翻訳ツールの利用案内で対応する案。法令用語の対訳辞書（JLT の標準対訳辞書）を houki-abbreviations 側で提供する案もある
- houki-research-skill の配布方法: claude-plugins marketplace 経由で足りるか、GitHub Release も併用するか
- meta-package `@shuji-bonji/houki-hub`（一括 install）を本 repo に同居させるか。pdf-agent-stack には無い要素なので、必要になるまで作らない
- skill-contract-probe / version-mentions の移植時期
- `agent/` に置くもの: `houki-specialist-plugin`（pdf-specialist-plugin と同型）を作るか、claude-plugins の既存 plugin で足りるか
