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

### 2. houki-nta-mcp #23（2026-09-12 01:15 JST 時点）

- 決めたこと（ユーザー判断）: 案 B（その種別の文書が DB に 1 件も無いときはエラー `DOC_NOT_FOUND`、v0.13.0）。キーワードに合わないだけの 0 件は従来どおり `results: []`。絞り込みの範囲に無い・`hasPdf` に合わない場合も成功のまま `hint` で案内。`DOC_NOT_FOUND` の `hint` に DB ファイルのパスを入れる。`--help` の文言は同じ版の別コミット
- 着手後に見つけて v0.13.0 に含めたもの（ユーザー判断）: `nta_search_qa` の `domain`（`tax` / `labor` …）を `taxonomy`（`shotoku` / `shohi` …）と比べていたため、指定すると必ず 0 件だった（dev で「軽減税率」: `domain` なし 3 件、`domain: "tax"` 0 件）。`topic`（`QA_TOPICS`）を追加し、`domain: "tax"` は絞り込まない、それ以外は `topic` を案内する 0 件にした
- ブランチ `fix/doc-search-zero-hit` にコミット済み（未 push）: `ef12616`（`--help`）、`d5123ac`（本体・CHANGELOG・README・版 0.13.0）
- 確認: VM は npm registry 403 のため、`vitest` shim と `better-sqlite3` → `node:sqlite` の shim（`$HOME/tmp/nta/shim`）で `doc-search-zero-hit.test.ts` 19 件・`handlers.test.ts` 48 件・`db-search.test.ts` 43 件・`constants.test.ts` 10 件が通過。新しいテストは v0.12.0 の `handlers.ts` では 18 件落ちることも確認。biome はクラウドに置いた linux 版（2.5.12）で `check --write` 済み。`tsc` と `npm test` 全体（594 件の見込み）はユーザーが Mac で行う
- dev で試すこと: 5 ツールでキーワードに合わない 0 件（`nta_search_qa` に「異なる課税関係が生ずる」）、`nta_search_qa` の `topic: "shohi"` と `domain: "tax"` / `"labor"`、`hasPdf: true`、`nta_search_bunshokaitou` の `taxonomy` に DB に無い税目。`DOC_NOT_FOUND` は `HOUKI_NTA_DB_PATH` を空のファイルに向けた dev で確かめられる
- 残り: ユーザーが Mac で `npm test`・`npm run build`・`npm run check` → dev 再起動・試用 → 署名・main 取り込み・push・publish（v0.13.0）・plugin 更新 → plugin で試用 → houki-hub の追随
- houki-hub の追随で直すもの: `scripts/reference-examples/houki-nta/ja/nta_search_bunshokaitou.md` の 95 行目（0 件の `hint` の説明が v0.12.0 のまま）、ツールリファレンスの再生成（`nta_search_qa` に `topic`、5 ツールの `description` に `DOC_NOT_FOUND`）、版表記、`docs/ROADMAP.md`
- 別件として残したもの:
  - houki-research-skill の `docs/ERROR-HANDLING.md` は `DOC_NOT_FOUND` を「docId の誤り → 略称解決・検索でフォールバック」としか書いていない。検索ツールが返す `DOC_NOT_FOUND`（`next_actions` が `cli_bulk_download`）は、フォールバックせずにユーザーへ投入を案内する、と足す必要がある（空の DB での `TSUTATSU_NOT_FOUND` も同じ）。3 の v0.5.0 に含めるか判断する
  - `nta_search_tsutatsu` は inputSchema に `type` と `domain` があるが、`searchTsutatsu()` はどちらも使っていない（指定しても絞り込まれない）
- 2026-09-12 01:35 JST: ユーザーの Mac で `npm test` 594 件通過（4 skipped）、`npm run check` はエラーなし。ユーザーの指示で文字列の連結をテンプレートリテラルにそろえた（`df2a897`。biome `useTemplate` の 17 件と、行をまたぐ `'…' +` の連結。出力される文字列は変わらない）。`biome.json` の変更（`ignoreUnknown: true` など）はユーザーの作業コピーの変更なのでコミットに含めていない
- 2026-09-12 02:05 JST: ユーザーの指示で logger を変更（`c268791`。`meta` を `JsonObject` に、`toMeta(err: unknown)` を追加、`logger.error` は `unknown` を受ける、bulk download の catch 10 か所を `toMeta(err)` に。CHANGELOG にも追記）。VM に TypeScript 5.9.3（GitHub Releases の tgz）を置き、`tsc --noEmit` がブランチ全体で通ることを確認（`Error` / `bigint` / `Map` / `interface` を `meta` に渡すと型エラーになることも確認）。`toolHandlers` の `any` は別 issue にする（[草案](2026-09-12-issue-draft-nta-typed-tool-args.md)、ユーザーが起票）
- 2026-09-12 03:00 JST: dev（`c268791` 相当をビルド）で試用。`nta_search_qa`「異なる課税関係が生ずる」→「該当なし。DB の質疑応答事例 1841 件に…」+ freshness、`domain: "tax"` → 3 件、`domain: "labor"` → topic の案内、`hasPdf: true` → PDF 付き無しの案内、`topic: "shohi"` → 1 件、`topic: "inshi"` のキーワード不一致 → 243 件の案内、`nta_search_kaisei_tsutatsu` の `taxonomy: "sozoku"` → `available_taxonomies`（hojin / shohi / shotoku / sisan/sozoku）、タックスアンサー・改正通達のキーワード不一致も期待どおり。`DOC_NOT_FOUND` は dev では未確認（DB に 6 種別すべて入っているため。ユニットテストのみ）
- 試用で見つけて直したもの: 件数に 3 桁区切りが無い（1841）、「（taxonomy="inshi"） 6 件」の括弧の後ろの空白 → `6e3325c`。`.claude-plugin/plugin.json` の version が 0.12.0 のまま（ユーザー指摘）→ `5950f96`
- ユーザーが `fix/doc-search-zero-hit` を main に fast-forward で取り込み済み（logger のコミットに biome.json の整形を fixup、`018d23e`）。上の 2 コミットは、それに気づかず main に直接コミットした（main は origin より 6 つ先、未 push）
- 2026-09-12 03:15 JST: v0.13.0 publish・plugin 更新済み（ユーザー）。plugin で dev と同じ呼び出しを試し、すべて期待どおり（件数は「1,841 件」、括弧の後ろの空白なし）。plugin の tools/list にも `topic` と 5 ツールの新しい description が出ている
- plugin の試用で気づいたこと（未対応）:
  - `nta_search_bunshokaitou` の `available_taxonomies` に、同じ税目の別表記が混ざっている（`gensen` / `gensenshotoku`、`joto-sanrin` / `joto_sanrin`、`sozoku` / `souzoku`、ほかに `shozei` / `zoyo` / `sonota`）。国税庁の URL のフォルダ名の違いがそのまま taxonomy に入っているため。`taxonomy: "sozoku"` では `souzoku` の文書が出ない。別 issue 候補
  - 税目の絞り込みの範囲に文書が無いときの `--bunsho-taxonomy=<値>` の案内は、綴り間違いの値（例: `zzz`）でも出る。CLI は値を検証していない（国税庁の索引に無い税目は 0 件で終わるだけ）
- 残り: houki-hub の追随（reference-examples の nta_search_bunshokaitou.md 95 行目、ツールリファレンスの再生成、版表記、ROADMAP、issue 草案と引き継ぎメモのコミット）
- 2026-09-12 03:30 JST: houki-hub の追随。ユーザーが Mac で `npm run build`（リファレンス再生成、nta 14/14）と `generate-stack --readme` を実行済み。Claude が次を編集: `site/docs/mcp/houki-nta.md`（「検索が 0 件のとき」の節、`topic`、DB が無いときに直接取得できるのは基本通達・タックスアンサー・質疑応答事例だけという記述の訂正）、`site/docs/guide/roadmap.md`（nta 0.11.1 → 0.13.0）、`site/docs/lib/houki-abbreviations.md`、`docs/ROADMAP.md`、呼び出し例 `nta_search_qa.md`（topic とキーワード不一致の 2 例を追加、plugin v0.13.0 の実測）と `nta_search_bunshokaitou.md`（0 件の説明）。呼び出し例を変えたので、リファレンスをもう一度生成してからコミットする

---

## 2026-09-12 残りの一括対応（issue は立てない。ユーザー指示）

対象: egov の枝番号の号・引数の型、nta の引数の型・`nta_search_tsutatsu` の `type` / `domain`・文書回答事例の税目の表記ゆれ・枝番号の号の `next_actions`、houki-research-skill v0.5.0（引き継ぎ 3）、houki-hub 追随。

決めたこと（ユーザー判断、2026-09-12 04:00 JST 頃）:

- 引数の型は json-schema-to-ts の `FromSchema` で inputSchema から導く（devDependencies、ユーザーが Mac で `npm install -D json-schema-to-ts@^3.1.1` 済み）
- 全ツールの inputSchema に `additionalProperties: false`。nta の `nta_search_tsutatsu` の `type` / `domain` は inputSchema から消す
- egov の `get_law` の `item` は数値と文字列（`"8の2"`・`"第8号の2"`）。inputSchema は `type: ["number", "string"]`（houki-hub のリファレンス生成が oneOf を表示できないため）。漢数字は未対応のまま
- skill は作業計画の推奨案（v0.5.0、鉄則 3 の見出しを広げる、タックスアンサーは根拠法令等の節を読むと書くだけ）
- 税目の表記ゆれは DB を変えず、検索時に別表記も含める（Claude の推奨で進行）

### egov v0.6.0（ブランチ `feat/get-law-branch-item`、未 push）

- `9f289bb` item の枝番号: `toEgovItemNum()` / `formatItemLabel()`、`findItem(paragraph, itemNum: string)`、見出し「第2条第1項第8号の2」、`item` だけで `paragraph` が無いと `INVALID_ARGUMENT`（これまで黙って無視していた）
- `0085555` 引数の型: `src/tools/tool-args.ts`（`ArgsOf` / `ToolHandler` / `bindTool` / `toMcpTool`）、定義を `xxxTool = {…} as const satisfies ToolSpec` に分割、`types/index.ts` は `ArgsOf<typeof xxxTool.inputSchema>`、server.ts の `validateArgs()` を `bindTool()` に移動、未知の引数は `detail.issues[].path` に引数名
- 型の罠: `bindTool<T extends ToolSpec>(spec: T, handler: (args: NoInfer<ArgsOf<T['inputSchema']>>) => …)` にしないと、呼び出し側で handler から逆推論して TS2589（型の展開が深すぎる）。関数の中で `ArgsOf<T['inputSchema']>` を式に書いても TS2589 になるので、呼び出しは `handler as unknown as ToolHandler` で受ける
- 確認: VM の tsc 5.9.3（本物の json-schema-to-ts で、誤った引数・未知の引数・合わない handler が型エラーになることも確認）、shim で article-num / law-tree / markdown / handlers のテスト、biome check（warning 0）。server.test は `vi.mock` のため Mac で
- VM に biome の linux-arm64 版を置いた（`$HOME/tmp/bin/biome`。VM は aarch64）

### egov v0.6.0 の追加修正

- `19aee6a` item だけで paragraph が無いとき: 項が 1 つの条はその項の号として探す（`findParagraphForItem()`）。「消費税法施行令第14条の3第1号」のように、項が 1 つの条では第1項を書かないため。nta の質疑応答事例の next_actions も paragraph なしで item を渡すことがある。項が複数ある条は項の数を示して INVALID_ARGUMENT。最初の実装（paragraph が無ければ一律 INVALID_ARGUMENT）は、正しい引用をエラーにしていた

### nta v0.14.0（ブランチ `feat/typed-tool-args`、未 push）

- `04ac0bf` 引数の型（egov と同じ `tool-args.ts`）、`additionalProperties: false`、`nta_search_tsutatsu` の `type` / `domain` を削除
- `d2e286e` 文書回答事例の税目の別表記: `BUNSHO_TAXONOMY_GROUPS`（sozoku/souzoku、gensen/gensenshotoku、joto-sanrin/joto_sanrin）。2026-09-12 に plugin で確認した DB の値: 本庁の索引（フィクスチャ 01.htm）は shotoku / gensen / joto-sanrin / sozoku / zoyo / hyoka / hojin / shohi / shozei / sonota。国税局の文書は souzoku / gensenshotoku / joto_sanrin を使う（tokyo・takamatsu・nagoya など）。zoyo（贈与税）は本庁にも国税局にもあり、sozoku とは別の税目なのでまとめない
- `a67b4a2` 枝番号の号: `related_laws[].item` を "12の8" の文字列にし、next_actions の get_law に渡す（egov v0.6.0 以上が必要。**publish は egov を先に**）
- `12fb628` v0.14.0 の CHANGELOG / README / package.json / plugin.json
- 確認: VM の tsc 5.9.3、shim で constants / related-law-parser / db-search / doc-search-zero-hit / handlers、biome check（warning 0）。server.test は Mac で。テストは合計 604 件の見込み

### houki-research-skill v0.5.0（ブランチ `feat/qa-next-actions`、未 push）

- `542d496` 作業計画どおり（SKILL.md 鉄則 3・5、tax-research.md ④''、CITATION / ARCHITECTURE / ERROR-HANDLING、README と release.yml の前提 nta を 0.12.0 以上、plugin.json 0.5.0、CHANGELOG）。ERROR-HANDLING.md に検索ツールの `DOC_NOT_FOUND`（投入を案内、該当なしと答えない）の節を足した

### houki-hub（ブランチ `docs/followups-2026-09-12`、未コミット）

- 編集済み: `site/docs/mcp/houki-egov.md`（item の枝番号、未知の引数、paragraph なしの item）、`site/docs/mcp/houki-nta.md`（未知の引数、tsutatsu の type/domain 削除、税目の別表記、枝番号の号）、`site/docs/skills/houki-research.md`（0.5.0、質疑応答事例の手順、DOC_NOT_FOUND の行）、`site/docs/guide/roadmap.md`、`site/docs/lib/houki-abbreviations.md`、`docs/ROADMAP.md`、typed-tool-args の草案に「実装済み」を追記
- 残り: egov / nta の dev での試用 → 呼び出し例の追加（`get_law` の `item: "8の2"`、`nta_search_bunshokaitou` の別表記）→ publish 後にユーザーが `npm run build`（リファレンス再生成）と `generate-stack --readme` → 1 コミット

### publish の順番

1. houki-egov-mcp v0.6.0（nta の `next_actions` が文字列の `item` を渡すため、先に出す）
2. houki-nta-mcp v0.14.0
3. houki-research-skill v0.5.0（Release は tag で自動。Claude Plugin の更新を忘れない）
4. houki-hub

### dev での試用（2026-09-12 04:20〜04:25 JST。途中で Mac との接続が一度切れた）

- egov v0.6.0: 消費税法 2条1項 `item: "8の2"` → 「第2条第1項第8号の2」／消費税法施行令 14条の3 `item: 1`（paragraph なし）→ 第1項第1号／法人税法 2条 `item: "第12号の8"`（paragraph なし）→ 第12号の8 とイロハ／消費税法 30条 `item: 1`（paragraph なし）→ 「第30条は項が 13 個あるため…」INVALID_ARGUMENT／`"八の二"` → INVALID_ARTICLE_NUM／`"99の9"` → 「号が見つかりません: 第2条第1項第99号の9」
- nta v0.14.0: `nta_search_tsutatsu` に `domain` → INVALID_ARGUMENT（path: domain）／`nta_search_bunshokaitou` `taxonomy: "sozoku"` → tokyo/souzoku 2 件と kantoshinetsu/sozoku 1 件 + search_notes／`nta_get_qa` hojin/33/02 → `related_laws` の `item: "12の8"` と next_actions、その example（施行令 4条の3第4項第1号）を egov に渡して取得できた
- 観察: 国税局でも `sozoku` を使う局がある（関東信越）。paragraph を補ったときの見出しは「第14条の3第1項第1号」（第1項を含む）で、引用の慣行とは違うが誤りではない。v0.6.0 はこのまま
- houki-hub の呼び出し例を追加: `houki-egov/ja/get_law.md`（枝番号の号）、`houki-nta/ja/nta_search_bunshokaitou.md`（税目の別表記）、`houki-nta/ja/nta_get_qa.md`（枝番号の号の next_actions）

### houki-research-skill のタグとリリースのずれ（2026-09-12 04:40 JST 頃に判明）

- ユーザーの `marketplace-version-check.mjs` で houki-research が「台帳 0.4.0 / GitHub 0.5.0」
- 調べた結果: タグ `v0.4.0` が v0.5.0 のコミット `9edab88`（plugin.json は 0.5.0）に付いていて、GitHub のリリース v0.4.0（2026-09-11 19:34 UTC 作成、タイトルはコミットメッセージ、添付 2 件）も `9edab88` を指している。`v0.5.0` のタグとリリースは無い。本来の v0.4.0 は `d0d0b34`（plugin.json 0.4.0）。リリース一覧では v0.4.0 の正しいリリースは見当たらない
- 直し方（ユーザーが Mac で）: 誤ったリリース v0.4.0 とタグを削除 → `v0.4.0` を `d0d0b34` に付け直して push → `v0.5.0` を `9edab88` に付けて push（Release ワークフローが plugin.json とタグの版を照合して .plugin を作る）→ claude-plugins で `marketplace-version-check.mjs --write`
- 2026-09-12 04:50 JST 頃、ユーザーが直した: タグ `v0.4.0` → `d0d0b34`、`v0.5.0` → `9edab88`。Release ワークフローが両方成功し、リリース v0.4.0（「houki-research-skill v0.4.0」、添付 3 件）と v0.5.0（添付 3 件）ができた。claude-plugins は `marketplace-version-check.mjs --write` で houki-research を 0.5.0 に書き換え済み（commit・push はユーザー）
- 教訓: リリースは GitHub の画面で作らず、タグの push だけにする（ワークフローが plugin.json とタグの版を照合する）。WebFetch の結果は 15 分キャッシュされるので、直した直後の確認は URL にクエリを付けて取り直す
- 2026-09-12 05:00 JST 頃: egov v0.6.0 / nta v0.14.0 / houki-research v0.5.0 は publish・リリース済み（ユーザー）。ユーザーが `npm run build`（リファレンスを egov v0.6.0 / nta v0.14.0 で再生成）と `generate-stack --readme` を実行。houki-hub の追随をブランチ `docs/followups-2026-09-12` に 1 コミット（Claude）。残り: ユーザーが署名・main 取り込み・push、claude-plugins の marketplace.json（houki-research 0.5.0）の commit・push と plugin の更新
