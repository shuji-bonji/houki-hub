# houki-nta-mcp #164 の PR 本文と取り込みの手順（2026-10-12 JST）

houki-nta-mcp #164（`nta_get_tsutatsu` の `ARTICLE_NOT_FOUND`（DB の経路）の `hint` が案内コマンドの形（027）に合わず、`next_actions` と `available_clauses` の打ち切りの印が無い）の対応。仕様 PR と実装 PR の 2 本。どちらも shuji の Mac の `houki-hub/mcp/houki-nta-mcp` に未署名・未 push で置いてある。

## ブランチとコミット

| ブランチ | コミット | 内容 |
| --- | --- | --- |
| `spec/20261012-tsutatsu-db-not-found-guide`（main `388353f` から） | `eacc403` | `specs/changes/20261012-tsutatsu-db-not-found-guide/`（proposal.md、`specs/nta_get_tsutatsu/spec.md`、`specs/db_schema/spec.md`） |
| `fix/20261012-tsutatsu-db-not-found-guide`（spec ブランチの上） | `c6eaf53` test / `7f30a27` fix / `5e8441c` chore: v0.27.1 / `1cb2ab9` 取り込み（current へ反映、`specs/releases/v0.27.1/` へ移動） | 受入テスト 5 件 + 既存 1 件の拡張、`src/tools/handlers.ts`・`src/errors.ts`・`src/services/db-search.ts`、CHANGELOG・版 4 ファイル |

確かめたこと（Cowork の VM、Linux aarch64、Node 22.23.2、2026-10-12 JST）: `tsc --noEmit` OK、`biome check src/` OK、vitest 2173 件中 2168 pass・4 skip・1 fail（`doc-search-zero-hit.test.ts` の 1 件。VM の一時フォルダーがホームの下にあり、`hint` のパスが `~` に置き換わるため。main でも同じ。Mac と CI では当たらない）、`spec-ids check` は ID とテストが一致（current 277 ID）。残る指摘は `releases/v0.27.1/…/proposal.md` の `approved`・`pr` の空欄だけで、下の手順 1 で埋まる。

## 取り込みの手順

1. `spec/20261012-tsutatsu-db-not-found-guide` で proposal.md の front matter に `approved: 2026-10-12`（マージする日、JST）と `pr: <仕様 PR の番号>` を書いてコミット → 署名（`git rebase --exec 'git commit --amend --no-edit -S' main`）→ push → 仕様 PR（本文は下）→ CI（spec-gate・pr-scope）→ `git merge --ff-only` で main へ
2. `fix/20261012-tsutatsu-db-not-found-guide` を main（= 1 を取り込んだ後）に載せ直す（`git rebase main`。取り込みコミット `1cb2ab9` の proposal.md の移動は、1 の front matter の変更と rename として合流する）。CHANGELOG 0.27.1 の `#PR-SPEC` を仕様 PR の番号に置き換えてコミット（または `chore: v0.27.1` に `fixup`）→ 署名 → push → 実装 PR（本文は下、`Closes #164`）→ CI → `git merge --ff-only` → タグ `v0.27.1` を push → publish.yml（npm）→ MCP Registry（`mcp-publisher`）→ claude-plugins の追随
3. publish の前の確認は proposal.md の「publish の前の確認」（公開版の DB で `{"name":"消基通","clause":"99-9-9"}` を呼び、`hint` のコマンドと `available_clauses_total` を確かめる）

## 仕様 PR の本文

題: `spec: nta_get_tsutatsu の DB の経路の ARTICLE_NOT_FOUND の案内を国税庁サイトの経路とそろえ、available_clauses_total を足す（#164）`

```markdown
差分 `specs/changes/20261012-tsutatsu-db-not-found-guide/`（houki-nta-mcp #164）。仕様 PR なので `src/`・テスト・`specs/current/` は変えません。

## 何を変えるか

- **SPEC-NTA-GET-TSUTATSU-005（MODIFIED）**: bulk download 済みの通達に求めた条項が無いとき（DB の経路）の `hint` と `next_actions` を、国税庁サイトの経路（010）と同じ組み立てにする。(a) 基本通達 4 種は、番号の形の確認・`nta_search_tsutatsu`・SPEC-NTA-DB-SCHEMA-027 の形の `--bulk-download --tsutatsu="<正式名>"` を `hint` に書き、`next_actions` は `nta_search_tsutatsu` と `cli_bulk_download` の 2 件。(b) 4 種以外の通達の条項が DB に残っているとき（0.23.x 以前の DB）は投入できないので、`hint` にその旨を書き、`next_actions` は `nta_search_tsutatsu` の 1 件
- **SPEC-NTA-GET-TSUTATSU-019（ADDED）**: `available_clauses` を返すとき（005・010）は、一覧の元になった条項の総数を `available_clauses_total` に常に付け、50 件を超えたときは `hint` の末尾に `available_clauses は先頭 50 件です（全 N 件）` を書く
- **SPEC-NTA-GET-TSUTATSU-010（MODIFIED）**: 019 と 027 への参照を足す（振る舞いは変えない）
- **SPEC-NTA-DB-SCHEMA-027（MODIFIED）**: 「この形にしない」から 005 の `hint`（フラグだけの `--bulk-download`）を外し、「当てはまる箇所」の表に 005 を足す。0.27.0 までは、005 の `hint` がこの形の外にあることが仕様の文に書かれていた（今の `hint` は仕様どおりで、仕様の側が 010 と食い違っていた）

ADDED 1、MODIFIED 3、REMOVED 0。

## 人が判断すること（proposal.md の節。勧める案を太字に）

1. 005 (a) の `hint` の後半: **A（`…で全節を取り直すと、DB に投入した後の改正を反映できます`。010 の「DB に入れると…」は場面に合わない）** / B 010 と同じ文
2. 005 (b)（4 種以外が DB に残っているとき）: **A この差分で投入できない文にする** / B 変えない
3. 打ち切りの示し方: **A `available_clauses_total` + 50 件を超えたときだけ `hint` の文** / B `available_clauses_truncated` / C `hint` の文だけ
4. `available_clauses_total` は `available_clauses` を返すエラーだけに付ける（`null` も置かない）: **このまま**
5. 版: **A 0.27.1（patch）** / B 0.28.0
6. `cli_bulk_download` の `reason`（`ローカル DB に未投入のため…`）が 005 (a) に合わない: **A この差分では変えず別の Issue** / B `reason` を渡せるようにする
7. 承認日と PR 番号を、マージの前にこのブランチの front matter に書く

## 確かめたこと

- 起点 main `388353f`（origin と同じ）、`specs/changes/` は空
- 新しい ID は `npx spec-ids next` で `SPEC-NTA-GET-TSUTATSU-019`
- `spec-ids check` OK（changes 2 files, 4 IDs）、`pr-scope` は承認日の空欄だけ

関連: #164
```

## 実装 PR の本文

題: `fix: nta_get_tsutatsu の DB の経路の ARTICLE_NOT_FOUND の hint・next_actions を国税庁サイトの経路とそろえ、available_clauses_total を付ける（#164）`

```markdown
Closes #164

仕様 PR #<仕様 PR の番号>（差分 `20261012-tsutatsu-db-not-found-guide`）の実装。版 0.27.1（patch）。DB のスキーマの版は 12 のまま。

## コミット

1. `test:` 受入テスト（Test Designer）。新しいファイル `src/tools/spec-20261012-tsutatsu-db-not-found-guide.test.ts`（005 (a)・(b)、019 × 3）と、`spec-20261003-t4-response-shape.test.ts` の 80 件のテストに `available_clauses_total` と `hint` の末尾の期待値を追加（テスト名に 019 を並べた）。main では 4 件が RED
2. `fix:` `src/tools/handlers.ts` の 005 の枝（`hint` を 010 と同じ組み立て、`next_actions`、`available_clauses_total`）と `renderLiveResult` の `not_found`（`available_clauses_total`、打ち切りの文）。`src/errors.ts` に `available_clauses_total`、`src/services/db-search.ts` に `countClauses`
3. `chore: v0.27.1` CHANGELOG（Fixed に #164 の 2 件、Changed に spec-ids 0.4.0 への切り替え）、版 4 ファイル
4. `spec:` 取り込み（Publisher）。current の 005・010 を置き換え、019 を追加、027 を置き換え。差分を `specs/releases/v0.27.1/` へ移動

## 応答の変化（0.27.0 → 0.27.1）

| 場面 | 0.27.0 | 0.27.1 |
| --- | --- | --- |
| bulk download 済みの基本通達 4 種に求めた条項が無い | `hint`: `別の clause 番号を試すか、\`--bulk-download\` で再取得してください（最新の改正反映用）`、`next_actions` 無し | `hint`: `<正式名>の番号の形は …。番号の形を確かめてください。\`nta_search_tsutatsu\` で条項を検索するか、\`npx -y @shuji-bonji/houki-nta-mcp@latest --bulk-download --tsutatsu="<正式名>"\` で全節を取り直すと、DB に投入した後の改正を反映できます`、`next_actions`: `nta_search_tsutatsu`・`cli_bulk_download` |
| 4 種以外の通達の条項が DB に残っていて、求めた条項が無い | 同上（実行できない投入を案内） | `hint`: 国税庁サイトから取れず投入もできないこと + `nta_search_tsutatsu`、`next_actions`: `nta_search_tsutatsu` |
| `available_clauses` を返すとき（005・010） | 総数無し | `available_clauses_total` に総数。50 件を超えたときは `hint` の末尾に `available_clauses は先頭 50 件です（全 N 件）` |

`code`・`error`・既存のフィールドは変えていない。

## 確かめたこと

- Cowork の VM（Linux aarch64、Node 22.23.2）: `tsc --noEmit` OK、`biome check src/` OK、vitest 2168 pass（`doc-search-zero-hit.test.ts` の 1 件は VM の一時フォルダーがホームの下にあるための失敗で、main でも同じ）
- `spec-ids check` は current 277 ID とテストが一致。`pr-scope`（base = 仕様ブランチ）OK
- publish の前の確認（proposal.md の節）: <shuji が Mac で実施して結果を書く>

## この PR の外

- `NEXT_ACTIONS.bulkDownload` の `reason`（`ローカル DB に未投入のため bulk download が必要`）は 005 (a) の場面（投入済み）に合わない。別の Issue（proposal.md「この差分の外で見つけたこと」1）
- houki-research-skill `docs/ERROR-HANDLING.md` の「投入の要否の見分け方」に `available_clauses` を足すかは Skill の追随で決める（同 2）
- houki-hub の呼び出し例 `nta_get_tsutatsu.md` に `available_clauses_total` を足すかは hub の追随で決める
```
