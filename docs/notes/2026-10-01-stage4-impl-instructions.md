# 段階 4 の実装 PR の指示（egov 0.16.0 / nta 0.22.0）

2026-10-01（JST）に Spec Steward の会話で作った、実装を別の会話に渡すための指示です。仕様 PR（T1・T2・T3）は egov・nta とも承認・マージ済みです。AGENTS.md の決まり（Steward と Coder は同じ会話で起動しない）に従い、実装は新しい会話で行います。

- 指示 A: houki-egov-mcp 0.16.0（新しい会話にそのまま貼る）
- 指示 B: houki-nta-mcp 0.22.0（別の新しい会話にそのまま貼る）
- 指示 C: 2 つを publish した日に houki-research-skill を 0.16.0 として追随させる（さらに別の会話。2026-10-02 に書き直した）

A と B は別リポジトリなので並行してよい。C は A と B の両方を publish した後。A（egov 0.16.0）と B（nta 0.22.0）は 2026-10-02 に main に入った。

---

## 指示 A: houki-egov-mcp 0.16.0

```text
houki-egov-mcp の段階 4 の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR は 3 本とも承認・マージ済みで、この会話では仕様の意図を変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-egov-mcp）
- 起点: main の 70e3227（T3 のマージ）
- ブランチ: feat/20261001-0.16.0
- 版: 0.15.4 → 0.16.0
- この PR で閉じる Issue: #46 #47 #48 #49 #52 #53 #54 #57 #69

## 最初に読むもの（この順）

1. AGENTS.md（PR の種類・役割・仕様 ID・ff マージ）と CONTRIBUTING.md の「コーディング規約」
2. specs/changes/20261001-t1-argument-guards/ の proposal.md と specs/*/spec.md（承認 2026-10-01、PR #84）
3. specs/changes/20261001-t2-error-codes/（PR #85）
4. specs/changes/20261001-t3-normalize/（PR #86）
5. 差分が参照する specs/current/<dir>/spec.md の仕様 ID
6. ../../lib/houki-abbreviations/CHANGELOG.md の 0.7.0 の「互換性」の節

各 proposal.md の「人が判断すること」は、書かれている側で承認済みです。仕様の本文が正で、proposal.md の表は要約です。仕様に書かれていない判断が要ったら、実装で決めずに止めて私に聞いてください。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる（例: it('SPEC-EGOV-COMMON-ERRORS-021 ...')）
- テストを消して GREEN にしない。既存のテストの期待値が承認済みの差分で変わるとき（limit の丸め、50 MB 超の INVALID_ARGUMENT、法令名検索の失敗の LAW_NOT_FOUND など）は、その差分の仕様 ID を名前に入れて書き換える。REMOVED の ID（SPEC-EGOV-GET-TOC-022、SPEC-EGOV-SEARCH-FULLTEXT-025・026）のテストは、取り込みのコミットで外す
- TS のコードで文字列を + でつながない（テンプレートリテラル）
- 仕様と実装の食い違いや、仕様どおりにすると壊れる箇所を見つけたら、コードで勝手に合わせずに報告する（新しい specs/changes が要る）
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. chore: houki-abbreviations を ^0.7.0 に上げる — package.json と package-lock.json。0.7.0 の互換性の節に従って既存のコードを直す最小限（src/services/freshness.ts の判定、AbbreviationStats の型、Category に kokuji が増えたことなど）。このコミットの時点で既存のテストが通ること
2. test: T1 … → fix: T1 …（#47 #48 #53 #54 #57）
3. test: T2 … → fix: T2 …（#46 #49 #69 と、freshness の例外）
4. test: T3 … → feat: T3 …（#52）
5. docs: … README と tools/list の description を合わせる（下の一覧）
6. chore: v0.16.0 — package.json・server.json の版と CHANGELOG
7. spec: 20261001-t1/t2/t3 を specs/current/ に取り込み、releases/v0.16.0/ へ移す（最後のコミット）

test: のコミットでは新しいテストが落ち、次の fix: / feat: で通ることを確かめる。

## 文書で直すもの（proposal.md に「実装 PR で」とあるもの）

- src/errors.ts の型と README から、返さない code（ABBREVIATION_NOT_FOUND・EGOV_API_ERROR・EGOV_TIMEOUT・EGOV_RATE_LIMITED）を消す（T1 #57）
- README の INVALID_ARGUMENT の行の「保存でファイルが 50 MB を超えた」と、get_attachment の注意書き「50 MB を超えるときは保存せず INVALID_ARGUMENT」を FILE_TOO_LARGE に直す（T2 #49）
- resolve_abbreviation の tools/list の description に「辞書のエントリはどの管轄でも返し、in_scope と hint で管轄を示す」の旨を足す（T3 #52）
- inputSchema の変更（integer・minimum・maximum、at の pattern、必須の文字列の minLength: 1）は T1 の fix: に含める

## CHANGELOG の 0.16.0

- 日付は仮に 2026-10-01 と書く。publish する日に私が直す
- 「互換性」の節に次を書く（各項目に Issue 番号と仕様 ID）
  - T2: code が変わる 3 場面（法令名検索が通信の失敗 LAW_NOT_FOUND → SOURCE_*、接続できない SOURCE_API_ERROR → SOURCE_UNAVAILABLE、50 MB 超 INVALID_ARGUMENT → FILE_TOO_LARGE）
  - T1: limit・latest・depth・paragraph を丸めずに INVALID_ARGUMENT、空文字・空白だけ・at の形で INVALID_ARGUMENT、detail.issues の分け方と日本語の message
  - T3: search_law の管轄外の略称が 0 件の成功から OUT_OF_SCOPE に、resolve_abbreviation に in_scope と hint を足した
  - 依存を houki-abbreviations ^0.7.0 に上げた。DB の検索用列のダッシュ類は 0.19.0 の取り込みまで入れ直さない（SPEC-EGOV-DB-SCHEMA-024）

## 取り込み（最後のコミット）

- 3 つの proposal.md の「取り込みのとき（Publisher）」に従う。ADDED は「できること」の末尾に足し、MODIFIED は本文を置き換え、REMOVED は見出しを外す。「入力」の表・「処理の流れ」の図・「未決」の項目も指示どおりに直す
- 各 spec.md の承認日の行に「差分 `20261001-t1-argument-guards` は 2026-10-01（PR #84）」のように足す（T2 は PR #85、T3 は PR #86）
- git mv で specs/changes/20261001-t1-argument-guards・t2-error-codes・t3-normalize を specs/releases/v0.16.0/ へ移し、各 proposal.md の「状態」を「取り込み済み（v0.16.0）」にする
- npx spec-ids check（specs/current の ID にすべてテストがある）と、BASE_REF=main HEAD_REF=feat/20261001-0.16.0 node .github/scripts/check-pr-scope.mjs を通す

## 実装の前に私に頼むこと（Mac のターミナルで実行してもらう）

T3 の「人が判断すること」3 の確認です。

    sqlite3 ~/.cache/houki-egov-mcp/laws.db "SELECT COUNT(*) FROM articles; SELECT COUNT(*) FROM articles WHERE body GLOB '*[‐‑–—―−]*';"

2 つ目が 1 つ目の 1% を超えるなら、0.19.0 まで入れ直さないという SPEC-EGOV-DB-SCHEMA-024 を見直す必要があります。その場合は T3 の実装を止めて報告してください（新しい仕様の差分を別の会話で書きます）。

## 検証

- npm run build・npm test・npm run lint・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す
- Cowork の VM（device_bash）で作業する場合: git を使う前に houki-hub フォルダーの削除許可を取る（.git の lock が残るため）。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す。node_modules は Mac と共有しているので npm install・npm rebuild はしない（better-sqlite3 などが Linux 用に上書きされる）。VM から npm の registry と GitHub の SSH には届かない

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果
- 仕様に無い判断が要った点、食い違いの報告
- PR 本文の草案（Closes #46 #47 #48 #49 #52 #53 #54 #57 #69、仕様 PR #84 #85 #86 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 B: houki-nta-mcp 0.22.0

```text
houki-nta-mcp の段階 4 の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR は 3 本とも承認・マージ済みで、この会話では仕様の意図を変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の 8d4653c（T3 のマージ）
- ブランチ: feat/20261001-0.22.0
- 版: 0.21.3 → 0.22.0
- この PR で閉じる Issue: #64 #65 #66 #67 #68 #69 #79

## 最初に読むもの（この順）

1. AGENTS.md（PR の種類・役割・仕様 ID・ff マージ）と CONTRIBUTING.md
2. specs/changes/20261001-t1-argument-guards/ の proposal.md と specs/*/spec.md（承認 2026-10-01、PR #117）
3. specs/changes/20261001-t2-error-codes/（PR #118）
4. specs/changes/20261001-t3-normalize/（PR #119）
5. 差分が参照する specs/current/<dir>/spec.md の仕様 ID（とくに db_schema の 006〜009 の移行の書き方）
6. ../../lib/houki-abbreviations/CHANGELOG.md の 0.7.0 の「互換性」の節

各 proposal.md の「人が判断すること」は、書かれている側で承認済みです。仕様の本文が正で、proposal.md の表は要約です。仕様に書かれていない判断が要ったら、実装で決めずに止めて私に聞いてください。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。既存のテストと同じく it（または describe）の名前の先頭に仕様 ID を入れる（例: it('SPEC-NTA-COMMON-ERRORS-010 ...')）
- テストを消して GREEN にしない。既存のテストの期待値が承認済みの差分で変わるとき（limit の丸め、空の keyword の「該当なし」、TSUTATSU_NOT_FOUND、404 の SOURCE_API_ERROR など）は、その差分の仕様 ID を名前に入れて書き換える
- TS のコードで文字列を + でつながない（テンプレートリテラル）
- 仕様と実装の食い違いや、仕様どおりにすると壊れる箇所を見つけたら、コードで勝手に合わせずに報告する（新しい specs/changes が要る）
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. chore: houki-abbreviations を ^0.7.0 に上げる — package.json と package-lock.json。0.7.0 の互換性の節に従って既存のコードを直す最小限（src/services/freshness.ts、AbbreviationStats の型、Category に kokuji が増えたことなど）。このコミットの時点で既存のテストが通ること
2. test: T1 … → fix: T1 …（#66 の形の検査、#67、#68、#69、#79）
3. test: T2 … → fix: T2 …（#64、#65、freshness の例外）
4. test: T3 … → feat: T3 …（#66 の全角、スキーマの版 11 の移行）
5. docs: … README と tools/list の description を合わせる（下の一覧）
6. chore: v0.22.0 — package.json・server.json の版と CHANGELOG
7. spec: 20261001-t1/t2/t3 を specs/current/ に取り込み、releases/v0.22.0/ へ移す（最後のコミット）

test: のコミットでは新しいテストが落ち、次の fix: / feat: で通ることを確かめる。

## 実装の要点（詳しくは差分の spec.md が正）

- T1: 識別子の形（docId・category・id・no）は inputSchema の pattern ではなく各ハンドラーで、DB と国税庁サイトを引く前に確かめる（SPEC-NTA-COMMON-ERRORS-015）。T3 の正規化をその前に通せるようにするため
- T2: explainDocIdNotFound() の JSDoc「code は v0.14.0 から変えない」を書き換える。nta_get_qa / nta_get_tax_answer の 404・410・soft-404（nta-scraper の isNtaSoft404）は DOC_NOT_FOUND・retryable: false
- T3: 版 10 → 11 の移行は、版 4 → 5 の renormalizeClauses / renormalizeSections / renormalizeDocuments と同じ手順（SPEC-NTA-DB-SCHEMA-019・020）。SPEC-NTA-GET-TAX-ANSWER-001 の 1 文の置き換えは、T3 の nta_get_tax_answer/spec.md の冒頭の箇条書きの指示で行う（同じ ID を 2 つの差分で MODIFIED にしていない）

## 文書で直すもの（proposal.md に「実装 PR で」とあるもの）

- nta_search_bunshokaitou・nta_search_jimu_unei・nta_search_kaisei_tsutatsu の inputSchema の taxonomy の description に「DB に無い値のときは available_taxonomies で正しい値を返す」を足す。nta_search_kaisei_tsutatsu の 4 つの値は例として残す（T1 #67）
- README で nta_get_kaisei_tsutatsu / nta_get_jimu_unei が TSUTATSU_NOT_FOUND を返すと書いている箇所（応答の例 "code": "TSUTATSU_NOT_FOUND" を含む。grep -n TSUTATSU_NOT_FOUND README.md で探す）を DOC_NOT_FOUND に直す。nta_search_tsutatsu / nta_get_tsutatsu の TSUTATSU_NOT_FOUND は変えない（T2）

## CHANGELOG の 0.22.0

- 日付は仮に 2026-10-01 と書く。publish する日に私が直す
- 「互換性」の節に次を書く（各項目に Issue 番号と仕様 ID）
  - T2: nta_get_jimu_unei / nta_get_kaisei_tsutatsu の TSUTATSU_NOT_FOUND → DOC_NOT_FOUND、nta_get_qa / nta_get_tax_answer の 404 の SOURCE_API_ERROR → DOC_NOT_FOUND
  - T1: limit を丸めずに INVALID_ARGUMENT、空文字・空白だけの keyword などを INVALID_ARGUMENT、識別子の形、detail.issues の分け方と日本語の message、nta_get_tax_answer の no は 4 桁
  - T3: 識別子と略称の全角を半角に揃える。スキーマの版が 11 になり、0.22.0 で開いた DB は 0.21.x で開けない
  - 依存を houki-abbreviations ^0.7.0 に上げた

## 取り込み（最後のコミット）

- 3 つの proposal.md の「取り込みのとき（Publisher）」に従う。ADDED は「できること」の末尾に足し、MODIFIED は本文を置き換える。「入力」の表・「処理の流れ」の図・「未決」の項目も指示どおりに直す。db_schema の 006・007・010〜014 の「版 10」は「版 11」に読み替えて直す
- 各 spec.md の承認日の行に「差分 `20261001-t1-argument-guards` は 2026-10-01（PR #117）」のように足す（T2 は PR #118、T3 は PR #119）
- git mv で specs/changes/20261001-t1-argument-guards・t2-error-codes・t3-normalize を specs/releases/v0.22.0/ へ移し、各 proposal.md の「状態」を「取り込み済み（v0.22.0）」にする
- specs/changes/20260930-cli-db-undecided-to-issues/（PR #114、実装の変更: 不要、specs/current には反映済み）も specs/releases/v0.22.0/ へ移す（その proposal.md の「状態」に書かれた指示）
- npx spec-ids check と、BASE_REF=main HEAD_REF=feat/20261001-0.22.0 node .github/scripts/check-pr-scope.mjs を通す

## 実装の前に私に頼むこと（Mac のターミナルで実行してもらう）

1. （2026-10-02 追記）この確認で合わない docId が見つかり、差分 `20261002-t1-docid-forms`（PR #121、2026-10-02 マージ、`322b67f`）で SPEC-NTA-GET-KAISEI-TSUTATSU-010・SPEC-NTA-GET-JIMU-UNEI-010・SPEC-NTA-GET-BUNSHOKAITOU-010 の形を緩めた。T1 の実装は、その仕様 PR のマージ後の T1 の差分の本文で行う。下は訂正前の確認の記録

   T1 の「人が判断すること」1（docId の形）の確認。何も出なければ OK です

       sqlite3 ~/.cache/houki-nta-mcp/cache.db "SELECT doc_type, doc_id FROM document" | awk -F'|' '
         $1=="kaisei"       && $2 !~ /^([0-9]{7}-[0-9]{3}|[0-9]{6})$/ {print}
         $1=="jimu-unei"    && $2 !~ /^[a-z0-9-]+(\/[a-z0-9_-]+)*\/[0-9]{6}(_[0-9]+)?$/ {print}
         $1=="bunshokaitou" && $2 !~ /^([a-z0-9_-]+\/)?[a-z0-9_-]+\/[0-9]{6}$/ {print}
         $1=="tax-answer"   && $2 !~ /^[0-9]{4}$/ {print}'

   1 行でも出たら、その文書が 0.22.0 で引けなくなります。T1 の実装を止めて報告してください（新しい仕様の差分を別の会話で書きます）

2. T3 の「人が判断すること」2（ダッシュ類の件数）

       sqlite3 ~/.cache/houki-nta-mcp/cache.db "SELECT COUNT(*) FROM clause WHERE full_text GLOB '*[‐‑–—―−]*'; SELECT COUNT(*) FROM document WHERE full_text GLOB '*[‐‑–—―−]*';"

   承認済みの仕様は「版 11 で入れ直す」なので、0 件でも実装は仕様どおりに進めてよい。件数は報告に入れる

## 検証

- npm run build・npm test・npm run lint・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す
- Cowork の VM（device_bash）で作業する場合: git を使う前に houki-hub フォルダーの削除許可を取る（.git の lock が残るため）。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す。node_modules は Mac と共有しているので npm install・npm rebuild はしない（better-sqlite3 が Linux 用に上書きされる）。VM から npm の registry と GitHub の SSH には届かない

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果、上の 2 つの確認の結果
- 仕様に無い判断が要った点、食い違いの報告
- PR 本文の草案（Closes #64 #65 #66 #67 #68 #69 #79、仕様 PR #117 #118 #119 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 C: houki-research-skill 0.16.0（egov 0.16.0 と nta 0.22.0 を publish した日）

2026-10-02 に書き直した。初めの版は「`mcp-refs.config.json` の版と `mcp-snapshots/` は段階 6 で上げる」としていたが、Skill の CI（`ci.yml`）は `update-mcp-snapshots.mjs --check` と `check-mcp-refs.mjs` を走らせ、`docs/ERROR-CODES.md` の各 MCP の列の印を `mcp-snapshots/` の code の一覧と突き合わせる。そのため、`ERROR-CODES.md` で houki-egov-mcp の列に `FILE_TOO_LARGE` の印を付けるには、同じ PR で版と `mcp-snapshots/` も上げる必要がある（印だけ付けると「正本に無い」、版だけ上げると「表に印が無い」で止まる）。週 1 回の `mcp-drift.yml`（npm の latest と突き合わせる）も、この PR を入れるまで `FILE_TOO_LARGE` で落ちる。

```text
houki-egov-mcp 0.16.0 と houki-nta-mcp 0.22.0 を publish しました。T2 の「互換の扱い」（houki-hub docs/DECISIONS.md 2026-09-29）に従い、同じ日に houki-research-skill を 0.16.0 として追随させてください。この会話の役は Skill の文書の追随です。MCP の仕様（各 MCP の specs/current/）は変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/skill/houki-research-skill（実体は skills フォルダー側。Cowork の device_bash では $HOME/mnt/houki-hub/skill/houki-research-skill）
- ブランチ: docs/20261002-egov016-nta022
- 版: 0.15.1 → 0.16.0（.claude-plugin/plugin.json と CHANGELOG.md）

## 最初に読むもの

1. CHANGELOG.md の 0.15.0・0.15.1（ERROR-CODES.md の位置づけと、版を上げたときの書き方）
2. scripts/mcp-refs.config.json、scripts/update-mcp-snapshots.mjs と scripts/check-mcp-refs.mjs の冒頭のコメント、.github/workflows/ci.yml
3. code の正本: ../../mcp/houki-egov-mcp/specs/current/common_errors/spec.md と ../../mcp/houki-nta-mcp/specs/current/common_errors/spec.md の「エラーの code」の表（どちらも 0.16.0 / 0.22.0 を取り込んだ後）
4. 互換性の正本: 両 MCP の CHANGELOG.md の 0.16.0 / 0.22.0 の「互換性」の節

## 手順

1. 私（Mac）に次を実行してもらい、npm と GitHub のタグが揃っていることを確かめる（VM の npm と GitHub は 403 になる）
   - npm view @shuji-bonji/houki-egov-mcp version → 0.16.0
   - npm view @shuji-bonji/houki-nta-mcp version → 0.22.0
   - GitHub に v0.16.0 / v0.22.0 のタグがある（update-mcp-snapshots.mjs はタグの specs/current/common_errors/spec.md を読む）
2. scripts/mcp-refs.config.json の houki-egov を 0.16.0、houki-nta を 0.22.0 にする
3. 私の Mac で node scripts/update-mcp-snapshots.mjs を実行してもらう（npm からの取得と MCP の起動が要るので VM では動かない）。mcp-snapshots/ の差分を確かめる。見込みは次のとおりで、違ったら止めて報告する
   - houki-egov: errorCodes に FILE_TOO_LARGE が増える。ツール名・引数名・必須は変わらない（T1〜T3 は inputSchema の制約だけを変えた）
   - houki-nta: errorCodes は変わらない（TSUTATSU_NOT_FOUND は基本通達で残る）。ツールも変わらない
4. 文書を直す（下の一覧）
5. node --test 'scripts/test/*.test.mjs'、node scripts/check-mcp-refs.mjs、node scripts/update-mcp-snapshots.mjs --check を通す（最後の 1 つは Mac で）
6. plugin.json の版と CHANGELOG.md の 0.16.0 を書く

## 直すもの

- skills/houki-research/docs/ERROR-CODES.md
  - FILE_TOO_LARGE: houki-egov-mcp の列に ○。説明を「ファイルが大きさの上限（50 MB）を超えている（pdf-reader-mcp は PDF、houki-egov-mcp は get_attachment / get_law_file の save: true）」にする
  - TSUTATSU_NOT_FOUND: 説明から「（改正通達・事務運営指針を含む）」を外す（houki-nta-mcp 0.22.0 で DOC_NOT_FOUND に揃えた。基本通達の場面だけが残る）
  - DOC_NOT_FOUND: houki-nta-mcp の説明に「国税庁サイトにそのページが無い（nta_get_qa / nta_get_tax_answer の 404）」を足す
  - LAW_NOT_FOUND と SOURCE_* の説明が「検索が成功して 0 件」と「通信の失敗」を分けているかを確かめ、分けていなければ両 MCP の common_errors の表の文に合わせる
- skills/houki-research/examples/error-recovery-patterns.md の「シナリオ 2 — TSUTATSU_NOT_FOUND」: nta_get_kaisei_tsutatsu の例なので、見出しと応答の例の code を DOC_NOT_FOUND に、版の注記を houki-nta-mcp v0.22.0 にする。hint などほかのフィールドは 0.22.0 の SPEC-NTA-GET-KAISEI-TSUTATSU-002 の本文と照らして、違えば直す
- skills/houki-research/SKILL.md の表（258〜259 行あたり）: 「取得ツールの DOC_NOT_FOUND / TSUTATSU_NOT_FOUND で available_doc_ids が付く」を DOC_NOT_FOUND だけにする。検索ツールの行（cli_bulk_download）は nta_search_tsutatsu が TSUTATSU_NOT_FOUND を返すので残す
- skills/houki-research/docs/ERROR-HANDLING.md
  - 「LAW_NOT_FOUND / … / DOC_NOT_FOUND」の節: nta_get_qa / nta_get_tax_answer で国税庁サイトにページが無いときも DOC_NOT_FOUND（retryable: false、next_actions は検索ツール）であることを 1 行足す
  - 「OUT_OF_SCOPE」の節: houki-egov-mcp 0.16.0 の search_law も管轄外の略称で OUT_OF_SCOPE を返すことを 1 行足す
  - 「INTERNAL_ERROR / UNKNOWN_TOOL」の節: 両 MCP とも、DB の取得時点・同期の記録の日付を読めないときは INTERNAL_ERROR・retryable: false で、next_actions（nta）または hint（egov）が取り込みのやり直しを案内する。この場合は「MCP のバグ」ではなく、案内のコマンドをユーザーに伝える、と書く
  - FILE_TOO_LARGE の扱い（保存せず、応答の url をそのまま使う）が無ければ、PDF の code の節の近くに短く足す
- 段階 6 の houki-hub の呼び出し例（scripts/reference-examples/）とリファレンスの再生成は、この PR に入れない

## 守ること

- 各 MCP の仕様と CHANGELOG を正本にし、Skill 側で code の意味を新しく決めない。正本と合わない記述を見つけたら直さずに報告する
- 文字列の連結（スクリプトを触る場合）は + を使わずテンプレートリテラル
- コミットを作るところまで。署名・push・PR・マージ・タグは私が行う
- Cowork の VM で git を使うなら、先に houki-hub と skills の両方のフォルダーの削除許可を取る。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す

## 終わったら報告すること

- コミットのハッシュと件名
- mcp-snapshots/ の差分（code とツールの増減）
- check-mcp-refs.mjs の結果（文書の件数、呼び出し例・ツール名・code の数）
- 正本と合わずに直さなかった記述
- PR 本文の草案（houki-egov-mcp 0.16.0・houki-nta-mcp 0.22.0 への追随であること、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```
