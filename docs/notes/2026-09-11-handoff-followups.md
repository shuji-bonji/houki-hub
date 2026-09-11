# 引き継ぎ: houki-nta-mcp v0.12.0 の試用で見つかった 3 件

作成: 2026-09-11 22:15（JST, +09:00）
前のチャットで終わったこと: houki-nta-mcp #20・#21・#22 の対応（v0.11.0 / v0.11.1 / v0.12.0 publish、3 件とも close）、houki-research-skill v0.4.0、houki-hub の追随（main `f534c4e` まで push 済み）

---

## 3 件の一覧

| # | 対象 | 内容 | 詳細 | 進め方 |
| --- | --- | --- | --- | --- |
| 1 | houki-egov-mcp | `get_law` の Markdown で、枝番号の条の見出しが「第70の6条」になり、号の見出し・Column・イロハが区切りなしでつながる | [issue 草案](2026-09-11-issue-draft-egov-get-law-markdown.md) | ユーザーが起票 → 実装 → v0.5.4 |
| 2 | houki-nta-mcp | 文書系の検索 5 ツールが 0 件のとき、DB にデータがあっても「DB 投入済みか確認してください」と出る | [issue 草案](2026-09-11-issue-draft-nta-zero-hit-hint.md) | ユーザーが起票し、案 A（patch）か案 B（エラー化）を決める → 実装 |
| 3 | houki-research-skill | 質疑応答事例（`nta_get_qa`）から `next_actions` で法律本文と通達へ戻る手順を足す | [作業計画](2026-09-11-plan-research-skill-qa-next-actions.md) | 起票なしで実装 → v0.5.0 |

3 件は互いに依存しません。3 の手順の中で `get_law` に号まで指定するので、1 が先に直っていると試用の出力が読みやすくなります。

## リポジトリの状態（2026-09-11 時点）

| リポジトリ | 版 | ブランチ | 備考 |
| --- | --- | --- | --- |
| houki-egov-mcp | 0.5.3（publish 済み） | main `2d7e3f1` | 作業コピーは `houki-hub/mcp/houki-egov-mcp` |
| houki-nta-mcp | 0.12.0（publish 済み） | main `6d64826` | 作業コピーは `houki-hub/mcp/houki-nta-mcp`。ユーザーの DB は `--bulk-download-qa --refresh` 済み（1,841 件） |
| houki-abbreviations | 0.5.0（egov・nta が取り込んでいるのは 0.4.1） | — | 今回は触らない |
| houki-research-skill | 0.4.0 | main `d0d0b34` | `/Users/bonji/workspace/shuji-bonji/skills/houki-research-skill` |
| houki-hub | — | main `f534c4e` | この引き継ぎメモと草案 3 つは未コミット |

## 作業の決まりごと（前のチャットで確かめたもの）

### 実行場所

- ユーザーの Mac のフォルダーは、Claude の作業用 Linux VM（`device_bash`）の `$HOME/mnt/houki-hub` と `$HOME/mnt/skills` から見える
- **共有の `node_modules` で `npm install` / `npm rebuild` をしない。** better-sqlite3 などが Linux 用に置き換わり、Mac 側のテストとサーバーが壊れる。テストは VM の `$HOME/tmp/nta` のように、ソースを tar でコピーして `npm ci` した場所で行う（`$HOME/tmp/nta` は 0.12.0 のコピーが残っている。egov 用は無いので作る）
- houki-hub のリファレンス再生成は `$HOME/tmp/hubgen`（`mcp/houki-nta-mcp` → `$HOME/tmp/nta` のシンボリックリンク）、サイトのビルド確認は `$HOME/buildcheck/site` で行う。本番のビルドと `generate-stack` はユーザーが Mac で行う（VM からは `npm view` が 403）
- 国税庁サイトは VM・クラウドとも取得できない（proxy 403）。取得を伴う確認は、ユーザーが Mac で動かしている MCP（`houki-*-dev` と plugin）で行う
- plugin のツール一覧と説明は、チャットの開始時点のもの。途中で plugin を更新しても説明文は変わらないことがある

### git

- `device_bash` で git を使う前に、`device_request_delete_permission` で houki-hub（と skills）の削除を許可してもらう。無いと `.git/index.lock` が残る。許可は再接続で消えることがある
- 読むだけのときは `git --no-optional-locks`
- ブランチを切ってからコミットし、`-c user.name='shuji-bonji' -c user.email='bonji@mikuro.jp'` を付ける。末尾の Co-Authored-By と Claude-Session はそのチャットで指示されたものを使う
- 署名・main への取り込み・push・publish・plugin 更新はユーザーが行う。`Closes #N` を書いても自動で閉じないことがあった（#21）

### 試用の順序

1. 実装してコミット（ブランチ）→ ユーザーが Mac でビルドして `houki-*-dev` を再起動 → dev で試用
2. ユーザーが署名・main 取り込み・publish・plugin 更新 → plugin で試用
3. houki-hub の追随（ツールリファレンスの再生成、呼び出し例の取り直し、版表記、`docs/ROADMAP.md`）→ 1 回のコミット

### 文章

- 日付は JST。VM とセッションの日付は UTC なので、夜に作業すると 1 日ずれる（前のチャットで 1 回間違えた）
- 公開文書（README・サイト）は「です・ます」で、利用者が何を受け取るかを書く。CHANGELOG と開発メモは体言止めでよい

## 新しいチャットに渡す文の例

```text
houki-hub/docs/notes/2026-09-11-handoff-followups.md を読んで、3 件のうち <番号> に着手してください。
草案や計画に「決めること」があれば、最初に確認してください。
```

## 進捗

### 1. houki-egov-mcp #16（2026-09-11 23:10 JST 時点）

- 決めたこと: 号の番号は `ItemTitle` の漢数字をそのまま出す／イ・ロ・ハは Markdown の箇条書き（`- イ …`、深さ 2 は `  - （１） …`）／エラーメッセージの条表示もそろえる／枝番号の号の指定（`item: "8の2"`）は別 issue（[草案](2026-09-11-issue-draft-egov-branch-item.md)）
- ブランチ `fix/get-law-markdown-structure` にコミット済み（v0.5.4、未 push）
- VM・クラウドとも npm registry が 403 で `npm ci` できず、`tsc`（TypeScript 7 はネイティブ版）・vitest・biome を VM で動かせなかった。新しいテスト 2 ファイルは、`vitest` を置き換える小さな shim と Node の型除去で実行して 20 件すべて通過。`npm test`・`npm run build`・`npm run check` はユーザーが Mac で行う
- 2026-09-11 23:30 JST: ユーザーの Mac で `npm test` 通過・ビルド・`houki-egov-dev` 再起動。dev で 消費税法 2条1項（枝番号の号）・2条1項8号・30条2項（イ・ロ）、租税特別措置法 70条の6第9項、エラー文 2 種、目次の「第19条の2」を確認
- 試用で見つかった v0.5.3 からある問題: 項の直下の `TableStruct`（所得税法 89条1項の税率表）が Markdown に出ない。`formatParagraph()` が `ParagraphSentence` と `Item` しか見ていないため。`format: "json"` には入っている
- 表の件は v0.5.4 に含めることに決定（ユーザー判断）。`a7e96fe` で項の直下と号・イロハの中の `TableStruct` を Markdown の表にした（見出し行が無い表は見出し行を空欄、結合セルは空欄、`TableStructTitle` は前・`Remarks` は後）。テストは合計 277 件の見込み
- 2026-09-11 23:40 JST: `a7e96fe` をビルドした dev で、所得税法 89 条（1 項の税率表 7 行が Markdown の表で出る、2 項が続く）と、消費税法 30 条 2 項・2 条 1 項 8 号（前回と同じ出力）を確認。見出し行や結合セルを持つ実際の表は dev では未確認（ユニットテストのみ）
- 残り: ユーザーが署名・main 取り込み・push・publish（v0.5.4）・plugin 更新 → plugin で試用 → houki-hub の追随（`get_law` の呼び出し例の取り直し、版表記、ROADMAP）
- 2026-09-12 00:00 JST: v0.5.4 publish・plugin 更新済み（main `d4c4cee`）。plugin で 所法 89条1項（税率表）、消法 30条2項（イ・ロ）、租税特別措置法 70条の6第9項、消費税法 2条1項8号、号が見つからないときのエラー文を確認し、dev と同じ出力
- houki-hub の既存の呼び出し例（`scripts/reference-examples/houki-egov/ja/get_law.md` は JSON と `第3000条` のエラー、`get_toc.md` は民法の目次）は今回の変更で出力が変わらない。追随は版表記（`stack.json`・README は `generate-stack`、`docs/ROADMAP.md`）が中心
- houki-hub の追随: 版表記（site の roadmap / houki-abbreviations ページ、`docs/ROADMAP.md`）を 0.5.4 に更新。`scripts/reference-examples/houki-egov/ja/get_law.md` に Markdown の呼び出し例 2 つ（消法 30条2項・所法 89条1項、plugin v0.5.4 の実測）を追加。`docs/notes/` の 5 ファイルも同じコミットに含める（ユーザー了承）
