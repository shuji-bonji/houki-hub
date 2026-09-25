# houki-nta-mcp#50: 残り 12 ツールの初版起こしの状態と取り込み方

- 日付: 2026-09-26（JST）
- 対象: houki-nta-mcp Issue #50「specs/ を構築」。`nta_get_tsutatsu`（PR #49）と `nta_get_qa`（PR #52）に続く残り 12 ツール
- 手順: spec-ids `docs/operations.md` 2.2「初版を起こす」と、houki-hub `docs/notes/2026-09-24-instructions-nta-issue50-specs.md`
- PR 本文: `docs/notes/2026-09-26-nta-issue50-pr-bodies.md`（ツールごとの節と、まとめ PR の本文）

## 1. できているもの（すべて未署名・未 push）

12 ツールを並列で起こし（Spec Steward をツールごとに 1 会話）、その成果を houki-nta-mcp の手元のリポジトリにブランチとして置いた。

| ブランチ | 先頭 | ID | テスト名に足した ID | 未決 |
|---|---|---|---|---|
| `spec-init/nta-get-tax-answer` | `0a29305` | 8 | 9 | 9 |
| `spec-init/nta-get-bunshokaitou` | `5d222e1` | 3 | 4 | 6 |
| `spec-init/nta-get-jimu-unei` | `65b773b` | 4 | 5 | 7 |
| `spec-init/nta-get-kaisei-tsutatsu` | `ecd1fb9` | 3 | 4 | 8 |
| `spec-init/nta-search-tsutatsu` | `4d8599b` | 9 | 14 | 11 |
| `spec-init/nta-search-kaisei-tsutatsu` | `073816e` | 4 | 4 | 9 |
| `spec-init/nta-search-jimu-unei` | `f74b6c8` | 4 | 4 | 10 |
| `spec-init/nta-search-bunshokaitou` | `e0d7937` | 4 | 8 | 8 |
| `spec-init/nta-search-tax-answer` | `5837812` | 2 | 4 | 8 |
| `spec-init/nta-search-qa` | `e6530e8` | 7 | 9 | 10 |
| `spec-init/resolve-abbreviation` | `cb8c921` | 5 | 8 | 6 |
| `spec-init/nta-inspect-pdf-meta` | `e9ae354` | 13 | 18 | 8 |
| `spec-init/issue-50-remaining`（上の 12 を順に載せたもの） | `9e86ea7` | 66 | 91 | 100 |

- ツールごとのブランチは、どれも main（`1fec384`）から切って 2 コミット（`spec: <tool> の初版草案` / `test: <tool> のテスト名に仕様 ID`）
- まとめブランチは main から切り、同じ 2 コミット × 12 = 24 コミット。ツールごとのブランチとは別のコミット（同じ内容を順に適用したもの）なので、両方を main に入れることはしない
- どのブランチでも `npx spec-ids check` は exit 0。`check-pr-scope.mjs` は「承認日がありません」以外を報告しない（テストの変更が ID の追加だけであることを通っている）
- まとめブランチで `vitest --run src/tools src/server.test.ts` は 152 件 pass・3 件 skip（Cowork の VM で実行）。`biome check` は変更したテストファイルで指摘なし
- 承認日はすべて空欄（`- 承認日:` の行だけ）

## 2. 取り込み方の選択

2 つの方法がある。同じテストの行（`for` ループの `it`、`server.test.ts` の 1 件）に複数のツールの ID が乗るので、ツールごとのブランチは互いに独立ではない。

| 方法 | 手順 | 向く場合 |
|---|---|---|
| A. まとめて 1 本の PR | `spec-init/issue-50-remaining` を署名・push → PR（本文は「まとめ PR の本文」）→ 12 ファイルの `spec.md` に承認日を書く → ff マージ | 未決の判断を 1 回のレビューで済ませたいとき。CI は 1 回 |
| B. ツールごとに 12 本の PR | 1 本目を署名・push → PR → 承認日 → ff マージ。2 本目からは `git rebase main` してから同じ手順（同じ行に ID を足しているので rebase で衝突しうる。衝突したら両方の ID を残す） | ツールごとに承認の記録（PR 番号）を分けたいとき |

A を勧める。B は 12 回の rebase と CI が要り、衝突の解消で ID を落とす危険がある。A でも `git log` にはツールごとのコミットが残るので、承認の単位はコミットで追える。

A の手順（Cowork で push できないので、人が手元で行う）:

```bash
cd /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp
git switch spec-init/issue-50-remaining
git rebase --exec 'git commit --amend --no-edit -S' main   # 24 コミットに署名
git push -u origin spec-init/issue-50-remaining
# GitHub で PR を開く（本文は docs/notes/2026-09-26-nta-issue50-pr-bodies.md の「まとめ PR の本文」）
# 未決を読んで意図 / 不具合を切り分ける。不具合は Issue に
# 12 ファイルの specs/current/<tool>/spec.md の「- 承認日:」に「YYYY-MM-DD（PR #N）」を書いて 1 コミット、push（pr-scope が GREEN になる）
git switch main && git merge --ff-only spec-init/issue-50-remaining && git push origin main
```

承認日を書くコミットは、初版起こしの範囲（`specs/current/<dir>/spec.md`）に収まるので `pr-scope` を通る。

## 3. 人が決めること（ツールをまたぐもの）

各ツールの未決は PR 本文の節にある。ここには複数のツールで同じ判断になるものだけを置く。

1. 取得系のエラー `code`: `nta_get_jimu_unei` / `nta_get_kaisei_tsutatsu` は `TSUTATSU_NOT_FOUND`、`nta_get_bunshokaitou` は `DOC_NOT_FOUND`。README の表は 3 つとも `DOC_NOT_FOUND`。spec.md は実装どおり
2. 文書系の検索 5 ツールの、ヒットしたときの応答（`results` の要素・`score`・`freshness`・`legal_status`）と、短い語の補完・通称の展開・索引の印: ツールの応答としてのテストが無く、5 ツールとも未決。受入テストをまとめて書く Issue にするか
3. `limit` の丸め（1 未満 → 1、50 超 → 50）と、空の `keyword` が「該当なし」になること: 検索 6 ツールに共通。意図として認めるか `INVALID_ARGUMENT` にするか
4. `for` ループのテスト（`doc-search-zero-hit.test.ts` 1 か所、`get-doc-not-found.test.ts` 4 か所）に、対象ツール全部の ID（最大 5 つ）が並ぶ。テストを分けるなら別の実装 PR
5. `server.test.ts` の inputSchema 違反のテスト 1 件に `resolve_abbreviation` と `nta_search_tsutatsu` の両方の ID が付く。ツール横断の error contract に各ツールの ID を付ける扱いでよいか
6. `doc-search-zero-hit.test.ts` の「nta_search_qa: 他の種別だけが入っている DB（qa のみ）でタックスアンサーを検索すると DOC_NOT_FOUND」は名前と違って `nta_search_tax_answer` を呼ぶ。`nta_search_tax_answer` の 001 を付け、`nta_search_qa` の ID は付けていない。名前を直すなら別の PR

## 4. 今回の進め方で分かったこと

- ツールごとの Steward を 12 会話並列に走らせ、成果（`spec.md`・テスト名に足す ID の一覧・PR 本文）を作業ツリーの外に置いてから、1 つのスクリプトでブランチに適用した。作業ツリーを同時に触らないので、git の衝突は起きない
- ID の一覧は「ファイル・テスト名・ID」の組で受け取り、適用時にテスト名（先に付いた ID を除いたもの）でその行を探す。同じ行に複数のツールの ID を順に足せる
- `spec-ids check` は 1 つの名前に複数の ID があっても両方を数える。`check-pr-scope.mjs` の「ID の追加だけか」の検査も複数の ID を除いて比べるので通る
- 見本（`nta_get_qa`）と同じ節の構成・文体で書けたが、生成した文には「受け口」のような比喩が混ざることがあり、通読して直した
- #50 のチェックボックス（手順の 11）は、PR のマージ後に人が入れる
