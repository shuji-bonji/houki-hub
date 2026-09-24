# houki-nta-mcp#50: ツールごとの spec.md を起こすときの指示（別チャット用）

- 日付: 2026-09-24（JST）
- 対象: houki-nta-mcp Issue #50「specs/ を構築」。残り 13 ツール
- 前提: PR #49 マージ済み（`nta_get_tsutatsu` が見本）。`@shuji-bonji/spec-ids` に切り替える PR（ブランチ `spec/use-spec-ids-package`）のマージ後に着手する

## 1 ツール分の作業（1 チャット = 1 ツールが目安）

役は Spec Steward。実装とテストの期待値は書き換えない。

1. 対象を 1 つ決める（例: `nta_get_qa`）。ブランチは `spec/<tool>`（例: `spec/nta-get-qa`）
2. 読むもの: `src/tools/definitions.ts` のそのツールの定義、`src/tools/handlers.ts` の handler、そのツールを扱う `*.test.ts`（`src/tools/` と `src/services/`）。見本として `specs/current/nta_get_tsutatsu/spec.md`
3. `specs/current/<tool>/spec.md` を書く。節は見本と同じ: 先頭のメタ（機能 ID、版、承認日は空欄、起こした元の版とファイル）、アクター、入力、できること、できないこと、未決
4. 「できること」は振る舞い 1 つにつき `### <ID> <題>` 1 つ。ID は `npx spec-ids next <tool> --count N` で取る（`N` は振る舞いの数）。実装コードの関数名・テーブル名は書かない。応答のフィールド名・エラー `code`・引数名は書く
5. 既存テストの `it`（または `describe`）の名前の先頭に、対応する ID を付ける。期待値と本文は変えない。1 つの振る舞いにテストが複数あれば全部に同じ ID を付ける
6. テストが無い振る舞いは「できること」に ID を振らず、「未決」に「ID を振るのは受入テストを書いてから」と書く（見本の未決 2〜4 と同じ形）
7. 不具合に見える動きは「できること」に入れず「未決」に書く（意図か不具合かは人が決める）
8. `npx spec-ids check` が exit 0 になることを確認。ID を 1 つ壊して exit 1 になることも確認して戻す
9. `npx vitest --run <触ったテスト>` が通ることを確認
10. コミットは 2 つ（`spec: <tool> の初版草案` / `test: <tool> のテスト名に仕様 ID`）。署名 → push → PR。PR 本文に「未決」の件数と、人が判断する項目を書く
11. #50 のチェックボックスにチェックを入れる

## 守ること

- `specs/current/` の既存の `spec.md`（他のツール分）は触らない
- 同じ振る舞いを 2 つのツールで書かない。共通の振る舞い（略称解決、DB 優先取得、`DOC_NOT_FOUND` など）は、そのツールの `spec.md` に「〜と同じ」と書かず、そのツールの応答として独立に書く（ID はツールごと）
- 実装を直したくなっても直さない。`specs/changes/` の候補として PR 本文に書く
- 承認日は Steward は空欄のままにする。人がマージする前に、そのブランチで JST の日付と PR 番号を書く（houki-nta-mcp の AGENTS.md「仕様の正本」）

## 順序の目安

見本と構造が近いものから。

1. `nta_get_qa` / `nta_get_tax_answer`（DB 優先取得、`source`、Issue #29 の形。テストが `get-db-first.test.ts` に揃っている）
2. `nta_get_bunshokaitou` / `nta_get_jimu_unei` / `nta_get_kaisei_tsutatsu`（取得系。`DOC_NOT_FOUND` と docId の分離は `get-doc-not-found.test.ts`）
3. `nta_search_*` 5 本（検索系。0 件の扱いは `doc-search-zero-hit.test.ts`、`search_notes`、`base_laws_by_tsutatsu`、`orphaned_at`）
4. `resolve_abbreviation`（ディレクトリ名に `nta_` が無いので ID は `SPEC-NTA-RESOLVE-ABBREVIATION-###`）
5. `nta_inspect_pdf_meta`

## Issue #50 の一覧の直し

一覧に重複（`nta_get_tsutatsu` など 6 本が 2 回）と誤記（`Fresolve_abbreviation`）がある。14 本に直す。

```
- [x] nta_get_tsutatsu
- [ ] nta_search_tsutatsu
- [ ] nta_get_kaisei_tsutatsu
- [ ] nta_search_kaisei_tsutatsu
- [ ] nta_get_jimu_unei
- [ ] nta_search_jimu_unei
- [ ] nta_get_bunshokaitou
- [ ] nta_search_bunshokaitou
- [ ] nta_get_tax_answer
- [ ] nta_search_tax_answer
- [ ] nta_get_qa
- [ ] nta_search_qa
- [ ] nta_inspect_pdf_meta
- [ ] resolve_abbreviation
```

## 別チャットに貼る指示文

```
houki-nta-mcp の Issue #50 で、ツール <tool> の仕様の正本 specs/current/<tool>/spec.md を起こしてください。
役は Spec Steward です。実装とテストの期待値は書き換えません。
手順と守ることは houki-hub の docs/notes/2026-09-24-instructions-nta-issue50-specs.md にあります。
見本は specs/current/nta_get_tsutatsu/spec.md、規則は AGENTS.md です。
ID は npx spec-ids next <tool> --count N で取り、npx spec-ids check が exit 0 になるまで進めてください。
終わったら、未決の件数と人が判断する項目を PR 本文にまとめてください。
```
