# 段階 6 の計画の指示（Q・R・S は済、QN・T・U は 2026-10-04 に追加）

2026-10-04（JST）に作った、`2026-10-04-plan-stage6-and-followups.md` の段階 1 と段階 2 を別の会話で始めるための指示です。Q と S は別リポジトリ（Q は houki-egov-mcp、S は houki-hub）なので並行できます。

| 指示 | 段階 | 内容 | 始める条件・状態 |
| --- | --- | --- | --- |
| Q | 1 | houki-egov-mcp 0.19.1 の仕様 PR（#107） | 済（PR #112） |
| R | 1 | houki-egov-mcp 0.19.1 の実装 PR（#107） | 済（PR #113、v0.19.1 を 2026-10-04 に publish） |
| QN | 1b | houki-nta-mcp 0.24.1 の仕様 PR（#139） | 済（PR #140、main `c29cd3c`） |
| RN | 1b | houki-nta-mcp 0.24.1 の実装 PR（#139） | 済（v0.24.1 を 2026-10-04 に publish） |
| T | 3 | houki-egov-mcp 0.20.0 の仕様 PR（#108・#110） | 済（PR #114、main `5847995`） |
| U | 3 | houki-nta-mcp 0.25.0 の仕様 PR（#138・#137） | 済（PR #142、main `8f98023`、承認日 2026-10-05） |
| W | 3 | houki-nta-mcp 0.25.0 の実装 PR（#138・#137） | 済（PR #143、v0.25.0 を 2026-10-05 に publish） |
| X | 3 | 呼び出し例の取り直しと契約の確認（egov 0.20.0 / nta 0.25.0、全 46 例） | 済（hub PR #40、劣化 1） |
| XS | 3 | houki-research-skill の追随（egov 0.20.0 / nta 0.25.0） | 済（Skill PR #27、0.19.0） |
| Q146 | 3b | houki-nta-mcp #146 の仕様 PR（実装の変更: 不要） | 済（PR #148、main `156acfd`。差分は次の実装 PR の取り込みで releases へ移す） |
| QH | 3c | houki-nta-mcp 0.25.1 の仕様 PR（#147、h3） | 済（PR #149、main `94fbaec`。案 B（level を足す）で承認） |
| RH | 3c | houki-nta-mcp 0.25.1 の実装 PR（#147） | 済（v0.25.1 を 2026-10-05 に publish） |
| Q26 | 3b | houki-nta-mcp 0.26.0 の仕様 PR（#144・#145） | すぐ（2026-10-06 に追加） |
| V | 3 | houki-egov-mcp 0.20.0 の実装 PR（#108・#110） | 済（v0.20.0 を 2026-10-04 に publish） |
| S | 2 | 全 47 例の契約の確認（C）と呼び出し例の取り直し（6a） | 済（hub PR #38・#39、記録 `2026-10-04-regression-check-egov-0.19.1-nta-0.24.0.md`、劣化 0） |

---

## 指示 Q: houki-egov-mcp 0.19.1 の仕様 PR（#107）

```text
houki-egov-mcp #107（施行日の当日に配り直される版を unchanged として飛ばす）の仕様 PR を書いてください。この会話の役は Spec Steward です（AGENTS.md の「役割」）。実装・テストは書きません。急ぎます: shuji の DB（0.19.0、2026-10-03 作成）で、施行日が 2026-10-04〜10-31 の UnEnforced の版が 21 ありました（2026-10-04 JST）。施行日ごとでは 10-05 が 5、10-16 が 7、10-23 が 1、10-24 が 5、10-30 が 2、10-31 が 1 です。Issue の「次に起きるのは 2026-11-01」は当たっていません。0.19.1 の publish の目標は 2026-10-15（10-16 の前日）で、10-05 の 5 版は 0.19.1 の後から直す前提です。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-egov-mcp）
- 起点: main の bc96b9a（v0.19.0 の f3b7fc1 の上に docs のコミットが 1 つ）。作業の前に git ls-remote https://github.com/shuji-bonji/houki-egov-mcp refs/heads/main で origin と同じか確かめる（VM から ssh の remote には届かない）
- ブランチ: spec/<作業日の yyyymmdd>-ingest-redistributed-revisions
- 版: 0.19.1（patch）。DB のスキーマの版は 3 のまま

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md（仕様 PR の範囲、仕様 ID、承認日の決まり。CONTRIBUTING の「ローカル DB を使う開発」）
2. houki-hub の docs/notes/2026-10-04-plan-stage6-and-followups.md の 4 章「段階 1」、5.1 の「取り込みの判定を変える」の行、5.3、8.2 の Q2・Q3
3. Issue #107 の本文（gh が無ければ curl https://api.github.com/repos/shuji-bonji/houki-egov-mcp/issues/107。認証なしは 1 時間 60 回まで）
4. specs/current/cli_bulk_download/spec.md（SPEC-EGOV-CLI-BULK-DOWNLOAD-011・014・016、「できないこと」の「前の版・廃止を e-Gov の履歴から正確に判定すること」）、specs/current/cli_sync/spec.md（SPEC-EGOV-CLI-SYNC-006）、specs/current/search_fulltext/spec.md（SPEC-EGOV-SEARCH-FULLTEXT-008）
5. src/services/bulk/ingester.ts（316〜320 行目の unchanged の判定、demoteOlderRevisions / demoteIfNewerExists、buildLawRow）
6. 手本として specs/releases/v0.19.0/20261003-db-cli/proposal.md

## 出発点（勧める案。proposal.md の「人が判断すること」に書いて承認を受ける）

- 直し方（Issue の決めること 1）: 案 A。content_hash が前回と同じでも、CSV の未施行の欄から決めた current_revision_status が DB の値と違えば、laws の状態だけを書き換え、SPEC-EGOV-CLI-BULK-DOWNLOAD-016 の「古い現行の版を下げる」処理を通す。条の本文（articles・articles_fts）は入れ直さない。件数は unchanged と別に status_changed を数える案（名前と、--sync・--bulk-download-* の出力に行を足すかはこの会話で決め、proposal.md に書く）
- 前日に未施行の欄が空で届く版（決めること 2）: 案 A。e-Gov の CSV に従う（1 日早く現行になる）
- 既に状態が残った DB（決めること 3）: 次の 2 つを入れる案（計画書 4 章の段階 1「利用者の DB の直し方」）
  1. 案 A の判定は全件の zip の取り込みにも効くので、0.19.1 に上げた後の --bulk-download-everything 1 回で状態が直る（条の本文は入れ直さない）。これを受入テストにし、CHANGELOG と README に「0.19.0 で 2026-10-04 以降に --sync した DB は、0.19.1 に上げた後に --bulk-download-everything を 1 回実行する」と書く
  2. --sync と --status で、amendment_enforcement_date が今日（日本時間）以前なのに current_revision_status が UnEnforced の版を数え、1 件以上なら [WARN] の行で --bulk-download-everything を案内する（終了コードは変えない）。cli_sync・cli_status の ADDED
  施行日ごとの内訳は確かめ済み（上の冒頭。2026-10-04 JST に shuji が Mac の DB で GROUP BY amendment_enforcement_date を実行）。proposal.md の「確かめた値」に写す。10-05 の 5 版の law_revision_id を、2026-10-05 以降に shuji の DB で取り出し（SELECT law_revision_id FROM laws WHERE current_revision_status='UnEnforced' AND amendment_enforcement_date='2026-10-05'）、受入の例に使えるかを確かめる
- 版（決めること 4）: スキーマの版を上げず 0.19.1。INGEST_VERSION も上げない（上げると全利用者の全件の入れ直しになる）
- 受入の例: Issue の医師法施行規則（323M40000100047）の 4 版の表（取り込み後の状態 → 正しい状態）を、差分の spec.md の例にそのまま写す。差分 zip（2026-09-02 → 09-17 → 10-01）の件数（upserted 26 / 14・unchanged 5 / 338・unchanged 5）も Issue のとおり写し、確かめた日と方法（Issue の本文、main f3b7fc1 のクローンで ingestZip）を添える

## 守ること

- specs/changes/<yyyymmdd-slug>/ の下だけを書く（proposal.md と specs/<dir>/spec.md）。specs/current/ は触らない
- 新しい仕様 ID は npx spec-ids next <dir> で取る
- proposal.md の「- 承認日:」は空欄で残す（承認日は私がマージの前に書く。pr-scope は空欄で止まるが、それは想定どおり）
- proposal.md には「今の動き」「変えた後の動き」「変わる仕様 ID（ADDED / MODIFIED / REMOVED）」「変わらない振る舞い」「互換性（0.19.1 の CHANGELOG に書くもの）」「実装 PR で直す文書」「実装の変更」「取り込みのとき（Publisher）」「人が判断すること」「確かめた値」「確かめていない点」を書く
- MCP のツールの応答は変えない（変えるなら proposal.md に書き、計画書 5.2 の契約の確認が要ることを書く）。CLI の出力の行を足すときは、既存の行の形は変えない
- 実装 PR で、shuji の Mac の DB のコピーに 0.19.1 の --bulk-download-everything を実行し、CurrentEnforced の版が 1 法令に 1 つであること（SELECT law_id FROM laws WHERE current_revision_status='CurrentEnforced' GROUP BY law_id HAVING count(*) > 1 が 0 行）を確かめる手順を、proposal.md の「取り込みのとき」の前に「publish の前の確認」として書く（計画書 5.1・5.2）
- 仕様の文は実際の値・フィールド名・列名で書く（比喩を使わない）。確かめていない値は「確かめていない」と書く
- コミットを作るところまで。署名・push・PR の作成・マージは私が行う
- Cowork の VM（device_bash）で作業する場合: git を使う前に houki-hub フォルダーの削除許可を取る（接続し直すと許可が消える）。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す。.git/objects/maintenance.lock や index.lock が残ったら消す。npm install・npm rebuild はしない（node_modules は Mac と共有）。VM から npm の registry には届かない。npx spec-ids は既存の node_modules で動く

## 終わったら報告すること

- ブランチ名・コミットのハッシュと件名
- ADDED / MODIFIED / REMOVED の数と、触った dir の一覧
- npx spec-ids check の結果と、BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs の結果（承認日の空欄以外の指摘が無いこと）
- 「人が判断すること」の一覧（勧める案つき）
- shuji に Mac で実行してもらう問い合わせ（上の UnEnforced の件数）
- PR 本文の草案（Refs #107。Closes は実装 PR で書く。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
- 実装 PR（指示 R）に渡すこと: 受入テストの fixture の作り方の案（小さな zip と CSV）、0.19.1 の CHANGELOG の「互換性」の候補
```

---

## 指示 S: 全 47 例の契約の確認（C）と呼び出し例の取り直し（6a）

```text
houki-hub の呼び出し例（scripts/reference-examples/）47 件を、houki-egov-mcp 0.19.x と houki-nta-mcp 0.24.0 で流し直してください。1 回の実測で 2 つの作業を兼ねます。

1. 契約の確認（C）: 例の主張が今も成り立つかを「一致 / 差分あり / 劣化 / 未確認」で表にする。劣化が 1 件でもあれば、2 に進まずに報告する
2. 呼び出し例の取り直し（6a）: 同じ応答で、例の「実測: vX（日付）」・JSON・例の後の文を差し替える。例の見出しは変えない

## 場所

- houki-hub: /Users/bonji/workspace/shuji-bonji/houki-hub（device_bash では $HOME/mnt/houki-hub）。起点は main（2026-10-04 時点 9be6b65。docs/ のコミットが足されている可能性がある）。作業の前に git ls-remote https://github.com/shuji-bonji/houki-hub refs/heads/main で origin と同じか確かめる
- ブランチ: docs/<作業日の yyyymmdd>-examples-egov-0.19-nta-0.24（例の差し替え。scripts/ の変更なので PR にする）
- 記録: docs/notes/<作業日>-regression-check-egov-0.19.0-nta-0.24.0.md（docs/ なので main に直接コミットしてよい。egov が 0.19.1 なら名前も 0.19.1 にする）

## 最初に読むもの（この順）

1. docs/notes/2026-10-04-plan-stage6-and-followups.md の 4 章「段階 2」と 5.2、8.2 の Q1
2. docs/notes/2026-10-03-regression-check-egov-0.17.0-nta-0.23.0.md（方法・判定の意味・表の形・「見つかったこと」）。今回の記録はこの形に合わせる
3. 段階 5 の版の変更: houki-egov-mcp の CHANGELOG.md の 0.18.0・0.19.0、houki-nta-mcp の CHANGELOG.md の 0.24.0 の「互換性」の節。各 specs/releases/v0.18.0/・v0.19.0/・v0.24.0/ の proposal.md の「呼び出し例への影響」「互換性」
4. scripts/generate-reference.mjs の 223 行目付近（例のファイルの読み方）と、例の先頭の「- 実測: vX（日付）」の書き方

## 流し方

- 呼ぶのは Claude Desktop の plugin の houki-egov-mcp と houki-nta-mcp（ツール名に plugin_houki-egov-mcp / plugin_houki-nta-mcp が付くもの）。houki-egov-dev・houki-nta-dev（手で書いたサーバー）は使わない（houki-egov-dev は HOUKI_EGOV_DB_PATH が今は無いファイルを指している。docs/notes/2026-10-04-handoff-egov-db-path.md の 2）
- 流す前に、plugin の版を私に確かめてもらう（Mac で npx -y @shuji-bonji/houki-egov-mcp@latest --version と npx -y @shuji-bonji/houki-nta-mcp@latest --version）。DB は egov・nta とも 2026-10-04 に新しくした。egov は npx -y @shuji-bonji/houki-egov-mcp@latest --status の出力を記録に写す（私が Mac で実行して貼る）
- 例と同じ引数で 1 回ずつ呼ぶ。比べるのは一字一句ではなく、例が述べている形と主張（件数・ID・順・code・next_actions の action など）
- 2026-10-03 の回の「見つかったこと」1 の 3 件は必ず直す: egov get_law_file の「50 MB を超えるときは … INVALID_ARGUMENT」→ FILE_TOO_LARGE、nta nta_get_kaisei_tsutatsu の code TSUTATSU_NOT_FOUND → DOC_NOT_FOUND、egov resolve_abbreviation の resolved.aliases（今は返らない）と in_scope・hint
- 段階 5 の proposal.md の「呼び出し例への影響」に挙がった箇所も直す: egov get_article_references.md の「kind は 3 つです」（suppl を足して 4 つ）、egov search_law.md・search_fulltext.md の total_count・hint・next_actions・expanded_keywords、nta nta_search_qa.md 84 行目の domain の説明（0.24.0 で domain は外れ、渡すと INVALID_ARGUMENT）
- 例の JSON の中の利用者のホームのパスは ~ に置き換える（今の例と同じ）
- 未確認の 1 例（nta nta_search_tsutatsu の「DB が古いとき」、126 日たった DB が要る）は流さない。check-example-versions.mjs（hub#5 の③、main に入っていれば）の照合から外す書き方を決めて報告する
- ツールごとに 1 コミット（docs(examples): <ツール名> を egov 0.19.x / nta 0.24.0 で取り直す）

## 守ること

- 判定に迷う差分（例の主張が成り立つかどうか決められないもの）は「判断できない」として表に残し、例は差し替えずに報告する
- 劣化を見つけたら、例を差し替えずに Issue の草案を docs/notes/issues-<作業日>-regression/ に置く（投稿は私が gh で行う）
- 例の文は「〜します」「〜です」で書く。code・フィールド名は応答の値をそのまま使う
- コミットを作るところまで。署名・push・PR の作成・マージは私が行う
- VM の git の注意: git を使う前に houki-hub フォルダーの削除許可を取る。GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）。.git の lock ファイルが残ったら消す。npm install・npm rebuild はしない

## 終わったら報告すること

- 記録のパスと、判定の件数（一致 / 差分あり / 劣化 / 未確認 / 判断できない）
- 劣化があればその一覧と Issue の草案のパス
- 例のブランチ名とコミットの一覧
- node scripts/check-example-versions.mjs の結果（main に無ければ、私が Mac で 0-a の後に回すコマンド）
- 6b のために私が Mac で回すコマンド（egov・nta の作業コピーでの npm run build と node scripts/generate-reference.mjs）
- T6（計画書の段階 3）で取り直しになる 7 ファイルの、今回の freshness の値（段階 3 の比較元にする）
- PR 本文の草案（末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 R: houki-egov-mcp 0.19.1 の実装 PR（#107）

仕様 PR #112（差分 `20261004-ingest-redistributed-revisions`、main `c88a3c9`）のマージの後に、新しい会話に貼ります。2026-10-04 JST に origin の main が `c88a3c9` であることを `git ls-remote` で確かめました。

```text
houki-egov-mcp 0.19.1（#107、施行日の当日に配り直される版の状態を取り込む）の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR #112 は承認・マージ済みで、この会話では仕様の意図を変えません。publish の目標は 2026-10-15（施行日 2026-10-16 の 7 版の前日）です。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-egov-mcp）
- 起点: main の c88a3c9。作業の前に git ls-remote https://github.com/shuji-bonji/houki-egov-mcp refs/heads/main で origin と同じか確かめる（VM から ssh の remote には届かない）。specs/changes/ に 20261004-ingest-redistributed-revisions だけがあることを確かめる
- ブランチ: fix/<作業日の yyyymmdd>-0.19.1
- 版: 0.19.0 → 0.19.1（patch）。DB のスキーマの版は 3、INGEST_VERSION は 2 のまま
- この PR で閉じる Issue: #107

## 最初に読むもの（この順）

1. AGENTS.md（PR の種類・役割・仕様 ID・ff マージ）と CONTRIBUTING.md の「ローカル DB を使う開発」「コーディング規約」
2. specs/changes/20261004-ingest-redistributed-revisions/proposal.md と specs/{cli_bulk_download,cli_sync,cli_status}/spec.md
3. 差分が参照する specs/current/<dir>/spec.md の仕様 ID（cli_bulk_download の 011・014・016・020・021、cli_sync の 002・006・010・014〜018、cli_status の 005、search_fulltext の 008）
4. src/services/bulk/ingester.ts（316〜320 行目、ingestBatch、demoteOlderRevisions・demoteIfNewerExists、IngestZipOptions・IngestResult）と src/cli/index.ts（formatIngestCounts、printSyncResult、runStatus、ingestZip の呼び出し 3 か所）
5. 前の版の実装 PR の形の手本: specs/releases/v0.19.0/ と CHANGELOG.md の 0.19.0

proposal.md の「実装の変更」「実装 PR で直す文書」「互換性」「publish の前の確認」「取り込みのとき（Publisher）」が、この会話の作業の一覧です。「人が判断すること」1〜11 は書かれている側で承認済みです（033 を入れる、[WARN] は last_sync_date より前と比べる、status_changed は条件つきの新しい行、など）。仕様の本文が正で、proposal.md の表は要約です。仕様に書かれていない判断が要ったら、実装で決めずに止めて私に聞いてください。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる。031 の医師法施行規則（323M40000100047）の 4 版の表は、小さな zip と CSV の fixture（09-02 → 09-17 → 10-01 の 3 回の取り込みと、033 用の全件の取り込み）で受入テストにする。e-Gov への実際の問い合わせはテストで行わない
- テストを消して GREEN にしない。既存のテストの期待値が承認済みの差分で変わるとき（014 の「unchanged の版は何も書き換えない」など）は、その差分の仕様 ID を名前に入れて書き換える
- CLI の既存の行の形と終了コードを変えない。新しい行（032・SYNC-020 の「状態の更新」、SYNC-021・STATUS-012 の [WARN]）は条件を満たすときだけ出す
- MCP のツールの応答（フィールド・code・note・next_actions）は変えない
- 033 は --bulk-download-everything のときだけ（IngestZipOptions に source とは別のオプションを足す。proposal.md の「実装の変更」）。--sync・--bulk-download-by-date では走らせない
- TS のコードで文字列を + でつながない（テンプレートリテラル）
- 公開文書（README・CHANGELOG・JSDoc）の文は「〜します」「〜です」で書く
- 仕様と実装の食い違いや、仕様どおりにすると壊れる箇所を見つけたら、コードで勝手に合わせずに報告する（新しい specs/changes が要る）
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. test: 031・033・014・016・011 の受入テスト（fixture を含む）
2. fix: 同じ XML で欄が空になった版の状態だけを書き換える（031・014・016・011）
3. fix: 全件の取り込みで、全件の CSV に無い未施行の版を前の版にする（033）
4. test: → feat: 件数の表示（032・SYNC-020）と [WARN]（SYNC-021・STATUS-012、件数を数える関数を 1 つにして --sync と --status で使う）
5. docs: proposal.md の「実装 PR で直す文書」の 1〜3（CHANGELOG の例は 7 のコミットで入れてよい、README の DB の節、ingester.ts の JSDoc と INGEST_VERSION の JSDoc）
6. chore: v0.19.1 — package.json・package-lock.json・server.json・.claude-plugin/plugin.json の版と CHANGELOG
7. spec: 差分を specs/current/ に取り込み、specs/releases/v0.19.1/ へ移す（最後のコミット）

test: のコミットでは新しいテストが落ち、次の fix: / feat: で通ることを確かめる。

## CHANGELOG の 0.19.1

- 日付は仮に作業日を書く。publish する日に私が直す
- Fixed に #107。「互換性」の節に proposal.md の「互換性」の表と案内の文（「人が判断すること」7 のとおり、[WARN] が出たときも同じ、を足す。正確な範囲の補足は README から docs/NOTES.md に回す）
- 取り込みの件数の出力の例（`  ingest 完了: …` と `  状態の更新: …` の 2 行）は、publish の前の確認の 3 の実測の値で書く。実測の前は仮の値を置き、仮であることを報告に書く

## houki-hub の文書（proposal.md の「実装 PR で直す文書」4）

- houki-hub の site/docs/mcp/houki-egov.md の「元データが変わったときに何が起きるか」に、施行日の当日の配り直しで状態が変わることと、0.19.0 の DB の直し方を書く。houki-hub（$HOME/mnt/houki-hub）のブランチ docs/<作業日の yyyymmdd>-egov-0.19.1 に 1 コミット（site/ の変更なので main に直接入れない）。egov の PR とは別に報告する

## 取り込み（最後のコミット）

- proposal.md の「取り込みのとき（Publisher）」に従う。承認日の行は proposal.md の「- 承認日: 2026-10-04（PR #112）」を写す
- git mv で差分を specs/releases/v0.19.1/ へ移し、proposal.md の「状態」を「取り込み済み（v0.19.1）」にする
- npx spec-ids check と、BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す
- 計画書（houki-hub docs/notes/2026-10-04-plan-stage6-and-followups.md）の 9 章への記入は私が行う。書く内容（コミット・テストの数）を報告に含める

## 検証

- npm run build・npm test・npm run lint・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す
- proposal.md の「publish の前の確認」1〜7 は私が Mac で行う。手順をそのまま報告に写し、この PR で変わったコマンド名や出力の文があれば直して書く
- Cowork の VM（device_bash）で作業する場合: git を使う前に houki-hub フォルダーの削除許可を取る（.git の lock が残るため。接続し直すと許可が消える）。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す。.git/objects/maintenance.lock や index.lock が残ったら消す。node_modules は Mac と共有しているので npm install・npm rebuild はしない。VM から npm の registry には届かない。vitest・biome は VM の別の場所に複製して回せることがある（houki-hub docs/notes/2026-09-29-plan-spec-issues.md の段階 2 の進捗、nta の $HOME/tmp/nta の例）

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）。houki-hub のブランチとコミットも
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果
- 仕様に無い判断が要った点、食い違いの報告
- publish の前の確認の手順（Mac で私が実行するコマンドの一覧）
- houki-research-skill で直す箇所があるか（--sync・--status の出力や [WARN] を引用している箇所を grep）
- PR 本文の草案（Closes #107、仕様 PR #112 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 共通: Cowork の VM で作業するときの注意（QN・T・U）

指示 Q・R・S と同じです。git を使う前に houki-hub フォルダーの削除許可を取る（接続し直すと許可が消える。消えたまま git を使うと `.git` に `HEAD.lock`・`index.lock`・`objects/maintenance.lock`・`tmp_obj_*` が残り、ブランチの切り替えが途中で止まる）。VM の git には `GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"`（COMMITTER も同じ）を渡す。`npm install`・`npm rebuild` はしない（`node_modules` は Mac と共有）。VM から npm の registry には届かない。origin との比較は `git ls-remote https://github.com/shuji-bonji/<repo> refs/heads/main`。

---

## 指示 QN: houki-nta-mcp 0.24.1 の仕様 PR（#139）

2026-10-04 JST に shuji が「0.24.1 で先に直す」と決めました（計画書 8.1、DECISIONS.md 2026-10-04）。2026-10-07 に No.2882 の行が 30 日を超え、タックスアンサーの検索が `outdated` を返し始めます。

```text
houki-nta-mcp #139（検索の freshness が、国税庁の索引から消えた文書の古い取得日時で止まり、投入をやり直しても fresh に戻らない）の仕様 PR を書いてください。この会話の役は Spec Steward です（AGENTS.md の「役割」）。実装・テストは書きません。版は 0.24.1（patch）で、2026-10-07 より前の publish を目指します。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の 527322a（v0.24.0）。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめる。specs/changes/ は空のはず
- ブランチ: spec/<作業日の yyyymmdd>-freshness-orphaned

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md
2. houki-hub の docs/DECISIONS.md の 2026-10-04 の行「期限や日付で害が増える不具合は patch で先に出す」
3. Issue #139 の本文（gh が無ければ curl https://api.github.com/repos/shuji-bonji/houki-nta-mcp/issues/139）と、その草案の元の記録 houki-hub docs/notes/2026-10-04-regression-check-egov-0.19.1-nta-0.24.0.md の「見つかったこと」7
4. specs/current/search_rules/spec.md の SPEC-NTA-SEARCH-RULES-011（索引から消えた文書の印）と 017（freshness の範囲と段階）、検索 6 ツールの spec.md の freshness の行
5. freshness を計算する実装（src/ を grep: oldest_fetched_at / days_since_oldest）
6. 手本として specs/releases/v0.24.0/ の proposal.md

## 出発点（勧める案。proposal.md の「人が判断すること」に書いて承認を受ける）

- 決めること 1: 案 A。orphaned_at の付いた行を freshness の範囲（oldest_fetched_at・newest_fetched_at・days_since_oldest）から外し、索引にある文書だけで鮮度を判定する。SPEC-NTA-SEARCH-RULES-017 を MODIFIED
- 決めること 2: 範囲に索引にある文書が 1 件も無いときは、017 の「範囲に文書が 1 件も無いときは付けない」と同じに扱う
- 決めること 3: freshness にフィールドを足さない（検索結果の要素の index_status・orphaned_at で分かる。T4 の「足すだけ」に当たるが、patch では足さない）。足す案は「人が判断すること」に並べる
- 決めること 4: 0.24.1（patch）。応答のフィールドは変えず、値の計算だけが変わる
- 受入の例: No.2882 の形（doc_type = 'tax-answer'、orphaned_at 付き、fetched_at 2026-09-07T21:06:49.516Z の行が 1 件、他の行は 2026-10-04）。記録にある実測の値と SQL の結果を、確かめた日と方法を添えて写す
- 5 種別（タックスアンサー・質疑応答事例・改正通達・事務運営指針・文書回答事例）すべてに効くことを例で書く。通達（nta_search_tsutatsu）は索引から消えた印を持つかを確かめて、持たないなら対象外と書く

## 守ること・報告すること

- specs/changes/<yyyymmdd-slug>/ の下だけを書く。新しい仕様 ID は npx spec-ids next <dir>。proposal.md の「- 承認日:」は空欄
- proposal.md の節は、egov の specs/releases/v0.19.1/20261004-ingest-redistributed-revisions/proposal.md と同じ並び（今の動き・変えた後の動き・変わる仕様 ID・変わらない振る舞い・互換性・実装 PR で直す文書・実装の変更・publish の前の確認・取り込みのとき・人が判断すること・確かめた値・確かめていない点）
- publish の前の確認には、検索 6 ツールの呼び出し例（houki-hub scripts/reference-examples/houki-nta/ja/nta_search_*.md）を流し、freshness 以外が変わらないことを確かめる手順を書く（計画書 5.2）
- コミットを作るところまで。署名・push・PR・マージは私が行う。VM の注意は上の「共通」
- 報告: ブランチ・コミット、ADDED / MODIFIED / REMOVED の数、spec-ids check と pr-scope の結果、「人が判断すること」の一覧、PR 本文の草案（Refs #139。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、実装 PR（指示 RN）に渡すこと
```

---

## 指示 T: houki-egov-mcp 0.20.0 の仕様 PR（T6: #108・#110）

2026-10-04 JST に T6 の規則が決まりました（DECISIONS.md 2026-10-04 の「T6 ローカル DB の場所の見え方」）。#111 は決定を書いて閉じるので、この仕様 PR には入れません。

```text
houki-egov-mcp の 0.20.0（T6 ローカル DB の場所の見え方。#108・#110）の仕様 PR を書いてください。この会話の役は Spec Steward です。実装・テストは書きません。規則は決まっているので、この会話の仕事は規則を仕様 ID に落とすことです。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp（device_bash では $HOME/mnt/houki-hub/mcp/houki-egov-mcp）
- 起点: main の 3ca848e（v0.19.1）。git ls-remote で origin と同じか確かめる。specs/changes/ は空のはず
- ブランチ: spec/<作業日の yyyymmdd>-db-location

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md（「ローカル DB を使う開発」を含む）
2. houki-hub の docs/DECISIONS.md の 2026-10-04 の行「T6 ローカル DB の場所の見え方」（a〜f）。これが規則の正本
3. houki-hub の docs/notes/2026-10-04-plan-stage6-and-followups.md の 2.2、4 章の段階 3、5.1 の「応答にパスを足す」「note・hint の文を変える」「CLI の出力を変える」の行
4. Issue #108（本文と 2026-10-04 の追記のコメント）・#110 の本文と、houki-hub docs/notes/2026-10-04-handoff-egov-db-path.md
5. specs/current の search_fulltext（002・027・036・039・040 と freshness の行）、cli_status（005 など）、db_schema（025 のエラーの文の表）、cli_sync・cli_bulk_download・cli_entry・common_errors の中で `houki-egov-mcp --` の形のコマンドを書いている ID（2026-10-04 の grep で 7 つの spec.md に出てくる）
6. src/db/index.ts（パスの決め方）、src/tools/handlers.ts（BUILD_DB_REMEDY、why の 4 通り、next_actions の example.command）、src/index.ts（起動時のログ）、src/cli/index.ts（runStatus）
7. README の「`search_fulltext` が `api-fallback` になるとき」の表（note の先頭ごとの原因）

## 規則から仕様に落とすこと（DECISIONS.md の a〜e）

- a: search_fulltext の freshness に db_path を常に置く。DB を使っていないとき（api-fallback）は null。ホームは ~ に置き換える（置き換えの規則: HOME で始まるときだけ先頭を ~ にする、など。決めきれない点は案を並べる）
- b: api-fallback の note に開こうとしたパス（~ に置き換えた形）を入れ、先頭の文を事実に合う文にする。場面（ファイルが無い / HOUKI_EGOV_DB_PATH が指すファイルが無い / 版が古い / 新しい / 読めない / 開けない）ごとの文の表を作る。README の表は「実装 PR で直す文書」に入れる
- c: next_actions[].example.command と、note・CLI のエラーの文のコマンドを npx -y @shuji-bonji/houki-egov-mcp@latest <フラグ> にする。HOUKI_EGOV_DB_PATH で DB を決めているときは HOUKI_EGOV_DB_PATH=<パス> を前に付ける（このときのパスを ~ にするか絶対パスにするかは、シェルでそのまま動くかで決め、案を並べる）
- d: MCP サーバーの起動時のログ（標準エラー出力）に DB のパスと決めた設定（HOUKI_EGOV_DB_PATH / XDG_CACHE_HOME / 既定）を出す。MCP の応答ではないが、cli_entry か db_schema に仕様 ID を置く（どちらに置くかを決める）
- e: --status に「決めた設定」の行を足し、同じフォルダーに laws*.db が他にもあれば [WARN] の行を足す。既存の行の形と終了コードは変えない。一覧に出す範囲（laws*.db だけか、-wal / -shm を除くか、退避したファイル名）は #110 の決めること 2・3 を案として並べ、勧める案を書く
- 応答のフィールドを消す・名前を変える変更はしない（T4）。code は変えない

## 守ること・報告すること

- specs/changes/<yyyymmdd-slug>/ の下だけを書く。新しい仕様 ID は npx spec-ids next <dir>。proposal.md の「- 承認日:」は空欄
- proposal.md の節は v0.19.1 の proposal.md と同じ並び。「houki-nta-mcp に写すとき」の節を作り、nta（指示 U）がそのまま写せる表（場面・文・egov の仕様 ID）を置く。nta 固有の事情（--db-path、cache.db、--status が無い）は「写せない点」として書く
- 「呼び出し例への影響」に、houki-hub の scripts/reference-examples/houki-egov/ja/search_fulltext.md の freshness を書く（段階 3 で取り直す）。houki-research-skill の api-fallback の説明（SKILL.md・workflows/tax-research.md・workflows/feasibility-check.md・examples/invoice-registration.md・docs/ERROR-HANDLING.md・docs/ARCHITECTURE.md、2026-10-04 の grep）を grep し直して「互換性」に書く
- 仕様の文は実際の値・フィールド名・コマンドで書く。確かめていない値は「確かめていない」と書く
- コミットを作るところまで。署名・push・PR・マージは私が行う。VM の注意は上の「共通」
- 報告: ブランチ・コミット、ADDED / MODIFIED / REMOVED の数と触った dir、spec-ids check と pr-scope の結果、「人が判断すること」の一覧（勧める案つき）、PR 本文の草案（Refs #108 #110。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、指示 U に渡すこと
```

---

## 指示 U: houki-nta-mcp 0.25.0 の仕様 PR（T6: #138、#137）

指示 T の仕様 PR が承認・マージされた後に、新しい会話に貼ります（egov で決めた文と表を写すため）。0.24.1（指示 QN・RN）の実装が main に入っていれば、その main から切ります。

```text
houki-nta-mcp の 0.25.0（T6 ローカル DB の場所の見え方の nta 版 #138 と、#137）の仕様 PR を書いてください。この会話の役は Spec Steward です。実装・テストは書きません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main（0.24.1 が出ていればその後）。git ls-remote で origin と同じか確かめ、specs/changes/ が空であることを確かめる
- ブランチ: spec/<作業日の yyyymmdd>-db-location

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md
2. houki-hub の docs/DECISIONS.md の 2026-10-04 の行（T6 の a〜f と #137）
3. houki-egov-mcp の T6 の差分（指示 T の仕様 PR。マージ後は houki-egov-mcp の specs/changes/<日付>-db-location/）の proposal.md、とくに「houki-nta-mcp に写すとき」の節
4. Issue #138・#137 の本文
5. specs/current の search_rules（017・019）、cli_entry（006・007。--db-path）、db_schema、cli_bulk_download・cli_refresh、検索 6 ツールと DB だけを引く 3 ツール（nta_get_kaisei_tsutatsu・nta_get_jimu_unei・nta_get_bunshokaitou）の「DB に 1 件も無い」ときの hint、nta_get_tax_answer の SPEC-NTA-GET-TAX-ANSWER-016 と db_schema の SPEC-NTA-DB-SCHEMA-025
6. src/db/index.ts（defaultDbPath）、src/index.ts（起動時のログ）、src/cli.ts（フラグの表）、src/services/tax-answer-index.ts（readStoredTaxAnswerIndex・saveTaxAnswerIndex・touchTaxAnswerIndexPage）、src/tools/handlers.ts（resolveTaxAnswerUrl）

## 仕様に落とすこと

- #138: egov の差分の a〜e を写す。nta 固有の点: (1) --db-path（CLI だけ）を「決めた設定」の 1 つとして表示に含める。(2) nta には --status が無いので、cli_status の spec.md を新しく置き（ADDED。初版起こしではなく、この仕様 PR の ADDED として）、egov の --status と同じ形の行（DB のパス・決めた設定・種別ごとの件数と取得日時の範囲・同じフォルダーの別の *.db の [WARN]）を決める。DB が無くても終了コード 0。DB を作らない・移行しない（読むだけ。DECISIONS.md 2026-10-04 の nta 0.24.0 の (2)「どの入口でも移行する」との関係を「人が判断すること」に書く）。(3) DB が無いときの hint は既にパスを入れているので、~ への置き換えと先頭の文・コマンドの形だけを揃える
- #137: DECISIONS.md の行のとおり。SPEC-NTA-GET-TAX-ANSWER-016 の周りと db_schema 025 の MODIFIED か ADDED。壊れた表の DB の受入の例を書く
- CONTRIBUTING.md に egov と同じ「ローカル DB を使う開発」の節を足すことを「実装 PR で直す文書」に入れる（T6 の f）

## 守ること・報告すること

- 指示 T と同じ（specs/changes の下だけ、承認日は空欄、節の並び、実際の値で書く、コミットまで、VM の注意は上の「共通」）
- egov と文を変えた箇所は、理由を proposal.md に書く
- 「呼び出し例への影響」に、houki-hub の scripts/reference-examples/houki-nta/ja/nta_search_*.md の freshness を書く（段階 3 で取り直す）
- 報告: ブランチ・コミット、ADDED / MODIFIED / REMOVED の数と触った dir、spec-ids check と pr-scope の結果、「人が判断すること」の一覧、PR 本文の草案（Refs #138 #137。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 RN: houki-nta-mcp 0.24.1 の実装 PR（#139）

仕様 PR #140（差分 `20261004-freshness-orphaned`、main `c29cd3c`）のマージの後に、新しい会話に貼ります。2026-10-04 JST に origin の main が `c29cd3c` であることを `git ls-remote` で確かめました。

```text
houki-nta-mcp 0.24.1（#139、検索の freshness の範囲から国税庁の索引から消えた文書を外す）の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR #140 は承認・マージ済みで、この会話では仕様の意図を変えません。急ぎます: タックスアンサー No.2882 の行が 2026-10-08 06:06:49 JST に 30 日に達し、nta_search_tax_answer が outdated を返し始めます。それより前の publish を目指します。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の c29cd3c。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に 20261004-freshness-orphaned だけがあることを確かめる
- ブランチ: fix/<作業日の yyyymmdd>-0.24.1
- 版: 0.24.0 → 0.24.1（patch）。DB のスキーマの版は 12 のまま
- この PR で閉じる Issue: #139

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md の「コーディング規約」
2. specs/changes/20261004-freshness-orphaned/proposal.md と specs/search_rules/spec.md（SPEC-NTA-SEARCH-RULES-017 の MODIFIED、例 2・3・4）
3. specs/current/search_rules/spec.md の 011・015・017 と、検索 5 ツールの spec.md の freshness の行
4. src/services/freshness.ts（summarizeFreshnessFromDocument・summarizeFreshnessFromSection）、src/tools/handlers.ts（5 ツールと explainDocZeroHits の fresh()）、src/services/index-status.ts（markOrphanedDocuments）
5. 手本: specs/releases/v0.24.0/ と CHANGELOG.md の 0.24.0、houki-egov-mcp の specs/releases/v0.19.1/（patch の実装 PR の形）

proposal.md の「実装の変更」「実装 PR で直す文書」「互換性」「publish の前の確認」「取り込みのとき（Publisher）」が、この会話の作業の一覧です。「人が判断すること」1〜9 は書かれている側で承認済みです（案 A、印の付いた行しか無い範囲では freshness を付けない、フィールドを足さない、各ツールの spec.md は MODIFIED しない、「移動」とみなした行は扱わない、など）。仕様に書かれていない判断が要ったら、実装で決めずに止めて私に聞いてください。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは 017 の本文と例 2・3・4 から書き、実装を見て期待値を足さない。it の名前の先頭に SPEC-NTA-SEARCH-RULES-017 を入れる。5 種別（tax-answer・qa・kaisei・jimu-unei・bunshokaitou）それぞれで、印の付いた古い行がある DB と、範囲の行がすべて印付きの DB（freshness が付かない）を確かめる。nta_search_tsutatsu が変わらないことも確かめる
- テストを消して GREEN にしない。既存のテストの期待値が 017 の MODIFIED で変わるときは、仕様 ID を名前に入れて書き換える
- 応答のフィールド・code・検索結果（件数・順・score・snippet・index_status・orphaned_at・search_notes）・0 件の hint の件数・DOC_NOT_FOUND の判定は変えない（proposal.md の「変わらない振る舞い」）
- TS のコードで文字列を + でつながない（テンプレートリテラル）。公開文書の文は「〜します」「〜です」
- 仕様と実装の食い違いを見つけたら、コードで勝手に合わせずに報告する
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. test: freshness-orphaned 017 の受入テスト（5 種別、すべて印付きの範囲、nta_search_tsutatsu）
2. fix: summarizeFreshnessFromDocument の範囲を索引にある文書だけにする（#139）
3. docs: proposal.md の「実装 PR で直す文書」の 2〜5（README・llms.txt・freshness.ts の JSDoc・docs/RESILIENCE.md 6.2。5 を直さないなら PR 本文にそう書く）
4. chore: v0.24.1 — package.json・package-lock.json・server.json の版と CHANGELOG（Fixed に #139、「互換性」の表と案内の文）。.claude-plugin/plugin.json の扱いは 0.24.0 の慣習に合わせる
5. spec: 差分を specs/current/ に取り込み、specs/releases/v0.24.1/ へ移す（最後のコミット。承認日は proposal.md の「- 承認日: 2026-10-04（PR #140）」を写す）

test: のコミットでは新しいテストが落ち、次の fix: で通ることを確かめる。

## houki-hub の文書（proposal.md の「実装 PR で直す文書」6）

- houki-hub の scripts/reference-examples/houki-nta/ja/nta_search_tax_answer.md の 3 行目（「staleness は stale。理由は下」）と 60 行目の段落（No.2882 の説明）は、0.24.1 の publish の後に、0.24.1 で取り直した値に直す。この会話では直す箇所と直し方の案だけを報告し、houki-hub は触らない（publish の後に私か別の会話で行う）

## 検証

- npm run build・npm test・npm run lint（biome）・npx tsc --noEmit・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す。VM では $HOME/tmp/nta に複製して vitest・biome・tsc を回せることがある（houki-hub docs/notes/2026-09-29-plan-spec-issues.md の段階 2 の進捗）
- proposal.md の「publish の前の確認」1〜6 は私が Mac で行う。手順をそのまま報告に写す
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す
- Cowork の VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数
- spec-ids check と pr-scope の結果
- 仕様に無い判断が要った点、食い違いの報告
- publish の前の確認の手順（Mac で私が実行するコマンドと SQL）
- houki-hub の呼び出し例で直す箇所と直し方の案
- houki-research-skill で直す箇所があるか（freshness の範囲・stale の説明を grep）
- PR 本文の草案（Closes #139、仕様 PR #140 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 V: houki-egov-mcp 0.20.0 の実装 PR（T6: #108・#110）

仕様 PR #114（差分 `20261004-db-location`、main `5847995`）のマージの後に、新しい会話に貼ります。2026-10-04 JST に origin の main が `5847995` であることを `git ls-remote` で確かめました。差分は ADDED 8・MODIFIED 18、触る dir は `search_fulltext`・`db_schema`・`cli_status`・`cli_sync`・`cli_bulk_download`・`cli_entry`・`common_errors` の 7 つです。

```text
houki-egov-mcp 0.20.0（T6 ローカル DB の場所の見え方。#108・#110）の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR #114 は承認・マージ済みで、この会話では仕様の意図を変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-egov-mcp）
- 起点: main の 5847995。作業の前に git ls-remote https://github.com/shuji-bonji/houki-egov-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に 20261004-db-location だけがあることを確かめる
- ブランチ: feat/<作業日の yyyymmdd>-0.20.0
- 版: 0.19.1 → 0.20.0（minor）。DB のスキーマの版は 3、INGEST_VERSION は 2 のまま
- この PR で閉じる Issue: #108・#110（#111 は決定を書いて閉じ済み）

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md（「ローカル DB を使う開発」「コーディング規約」）
2. houki-hub の docs/DECISIONS.md の 2026-10-04 の行「T6 ローカル DB の場所の見え方」（規則の正本）
3. specs/changes/20261004-db-location/proposal.md と specs/*/spec.md の 7 つ
4. 差分が参照する specs/current/<dir>/spec.md の仕様 ID
5. src/db/index.ts（パスの決め方）、src/tools/handlers.ts（BUILD_DB_REMEDY、why の場面、next_actions の example.command）、src/services/freshness.ts、src/index.ts（起動時のログ）、src/cli/index.ts（runStatus・printSyncResult・エラーの文）
6. 手本: specs/releases/v0.19.1/ と CHANGELOG.md の 0.19.1

proposal.md の「実装の変更」「実装 PR で直す文書」「互換性」「publish の前の確認」「取り込みのとき（Publisher）」が、この会話の作業の一覧です。「人が判断すること」は書かれている側で承認済みです。proposal.md の「houki-nta-mcp に写すとき」は nta の会話（指示 U）が読むので、この会話では触りません。仕様に書かれていない判断が要ったら、実装で決めずに止めて私に聞いてください。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる。~ への置き換えと、HOUKI_EGOV_DB_PATH・XDG_CACHE_HOME・既定の 3 通りは、環境変数と HOME を差し替えて確かめる（利用者のホームのパスをテストに書かない）
- テストを消して GREEN にしない。既存のテストの期待値が MODIFIED で変わるとき（note の先頭の文、案内のコマンド、--status の行）は、その仕様 ID を名前に入れて書き換える
- 応答のフィールドを消す・名前を変える変更はしない（T4）。code は変えない
- --status の既存の行の形と終了コードは、仕様の MODIFIED のとおりに変え、それ以外は変えない
- TS のコードで文字列を + でつながない（テンプレートリテラル）。公開文書の文は「〜します」「〜です」
- 仕様と実装の食い違いを見つけたら、コードで勝手に合わせずに報告する
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. test: → feat: パスの決め方と ~ への置き換え、案内のコマンドの組み立て（db_schema 028・029、025、common_errors 031）
2. test: → feat: search_fulltext の freshness.db_path と note の文の表（042・043・044、002・023・027・035・039・040）
3. test: → feat: 起動時のログ（cli_entry 012）
4. test: → feat: --status の「DB の場所の設定」の行と [WARN]、CLI のエラーの文（cli_status 013・014 と MODIFIED、cli_sync 019・021、cli_bulk_download 030）
5. docs: proposal.md の「実装 PR で直す文書」（README の「api-fallback になるとき」の表、--help など）
6. chore: v0.20.0 — package.json・package-lock.json・server.json・.claude-plugin/plugin.json の版と CHANGELOG（「互換性」の表）
7. spec: 差分を specs/current/ に取り込み、specs/releases/v0.20.0/ へ移す（最後のコミット。承認日は proposal.md の「- 承認日: 2026-10-04（PR #114）」を写す）

1〜4 の順は、仕様の依存（パスの組み立てを先に）に合わせた案です。差分の構成と合わないときは、理由を報告に書いて変えてよい。

## 検証

- npm run build・npm test・npm run lint・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す
- proposal.md の「publish の前の確認」は私が Mac で行う。手順をそのまま報告に写す
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す
- Cowork の VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果
- 仕様に無い判断が要った点、食い違いの報告（とくに nta に写すときに効くもの。指示 U の会話に渡す）
- publish の前の確認の手順
- 契約の確認で変わる例（houki-hub の scripts/reference-examples/houki-egov/ja/search_fulltext.md の freshness.db_path など）
- houki-research-skill で直す箇所（api-fallback の note の文・案内のコマンドを引用している箇所を grep）
- PR 本文の草案（Closes #108 #110、仕様 PR #114 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 W: houki-nta-mcp 0.25.0 の実装 PR（T6: #138、#137）

仕様 PR #142（差分 `20261004-db-location`、main `8f98023`、承認日 2026-10-05）のマージの後に、新しい会話に貼ります。2026-10-05 JST に origin の main が `8f98023` であることを `git ls-remote` で確かめました。差分は ADDED 15・MODIFIED 23、触る dir は 16（`cli_status` は新しい spec.md）です。

shuji の方針（2026-10-05）: 「人が判断すること」1〜19 はほぼ勧める案（A）で承認した。そのうえで、実装の側でも判断してよい。この指示では、判断してよい範囲と、止めて聞く範囲を分けて書きます。AGENTS.md の「Coder は振る舞いの許し方を決めない」は変えず、仕様に書かれていない細部を実装で決め、決めたことを報告に残す、という形にします。

```text
houki-nta-mcp 0.25.0（T6 ローカル DB の場所の見え方の nta 版 #138 と、#137）の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR #142 は承認・マージ済みです。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の 8f98023。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に 20261004-db-location だけがあることを確かめる
- ブランチ: feat/<作業日の yyyymmdd>-0.25.0
- 版: 0.24.1 → 0.25.0（minor）。DB のスキーマの版は 12 のまま
- この PR で閉じる Issue: #138・#137

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md
2. houki-hub の docs/DECISIONS.md の 2026-10-04 の「T6」「#137」の行と、2026-10-05 の「nta の --status は版 3〜11 の DB を移行しない」の行
3. specs/changes/20261004-db-location/proposal.md と specs/*/spec.md の 16 個。とくに「実装の変更」「実装 PR で直す文書」「互換性」「publish の前の確認」「取り込みのとき」「人が判断すること」
4. 写す元の houki-egov-mcp 0.20.0: houki-hub/mcp/houki-egov-mcp の specs/releases/v0.20.0/20261004-db-location/ と、src/ の同じ役目の関数（パスの ~ への置き換え、シェル用のパス、案内のコマンドの組み立て、--status の [WARN]）。読んで参考にするが、共有ライブラリには出さず、nta の中に独自に書く（family の方針）
5. 差分が参照する specs/current/<dir>/spec.md の仕様 ID と、proposal.md の「実装の変更」に挙がった src/ のファイル

## 実装の側で判断してよいこと（決めたら報告の「実装で決めたこと」に書く）

仕様の本文と例に書かれていない細部は、この会話で決めてよい。止めて聞かなくてよい。

- 関数・型・ファイルの分け方、名前（proposal.md の「例:」の名前は案。変えてよい）
- 仕様が形だけを決めていて値の作り方を決めていない箇所の作り方（例: `cache*.db` の一覧の並び順、`readdirSync` で読めないフォルダーのときの扱い、ログの `meta` に入れる値の型）。ただし応答・CLI の出力・終了コードに出るものは、仕様の文と例に必ず合わせる
- テストの組み立て（fixture、HOME と環境変数の差し替え方、一時フォルダー）。利用者のホームのパスはテストに書かない
- 既存のテストが MODIFIED の ID で期待値を変えるときの書き換え方（ID を名前に入れる）
- 「人が判断すること」13・17（この差分の外）の Issue の下書きを書くこと。投稿は shuji が行う
- 仕様のとおりに書くと実装が不自然・危険になる箇所で、応答・出力・終了コードを変えずに済む回り道（例: 読み取り専用で開けない環境での --status の開き方）

## 止めて聞くこと（実装で決めない）

- 応答のフィールド・`code`・`hint` と `note` の文・案内のコマンド・CLI の出力の行・終了コードを、仕様の文と例から変えること
- 仕様の文どうしが食い違う、または仕様どおりにすると既存の約束（specs/current の別の ID）を破る箇所
- 「人が判断すること」の勧める案（A）と違う形にしたくなったとき

聞くときは、案を 2〜3 並べて勧める案を 1 つ書く。私の答えが仕様の変更になるときは、この PR とは別の specs/changes が要ることを書く（この会話では specs/changes を書かない）。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる。テストを消して GREEN にしない
- 応答のフィールドを消す・名前を変える変更はしない（T4）
- --status は DB を書き換えない（CLI-STATUS-008）。読み取り専用で開く
- TS のコードで文字列を + でつながない（テンプレートリテラル）。公開文書の文は「〜します」「〜です」
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順（案。差分の構成と合わないときは理由を書いて変えてよい）

1. test: → feat: DB の場所の決め方・応答用とシェル用のパス・案内のコマンドの組み立て（db_schema 026〜029、021・025 の文、common_errors 017）
2. test: → feat: 検索 6 ツールの freshness（db_path を常に置く、範囲が空なら取得日時を null）と warning のコマンド（search_rules 022・017、search_tsutatsu 003・004、各検索ツールの 001 など）
3. test: → feat: DB が無い・版の記録が無いときの hint（取得 3 ツール・nta_inspect_pdf_meta・検索の 0 件）
4. test: → feat: 起動時のログ（cli_entry 009）と --status（cli_status 001〜008、cli_entry 002・004・007）
5. test: → fix: タックスアンサーの索引の読み書きの失敗をログに出す（#137。nta_get_tax_answer 018、db_schema 025）
6. docs: proposal.md の「実装 PR で直す文書」（README・llms.txt・--help・CONTRIBUTING.md の「ローカル DB を使う開発」の節など）
7. chore: v0.25.0 — package.json・package-lock.json・server.json の版と CHANGELOG（「互換性」の表）。.claude-plugin/plugin.json の扱いは 0.24.x の慣習に合わせる
8. spec: 差分を specs/current/ に取り込み、specs/releases/v0.25.0/ へ移す（最後のコミット。承認日は proposal.md の「- 承認日: 2026-10-05（PR #142）」を写す）

## 検証

- npm run build・npm test・npm run check（biome）・npx tsc --noEmit・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す。VM では $HOME/tmp/nta に複製して回せることがある
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す
- proposal.md の「publish の前の確認」1〜7 は私が Mac で行う。手順をそのまま報告に写し、この PR で変わったコマンド名や出力の文があれば直して書く
- Cowork の VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果
- 実装で決めたこと（上の「判断してよいこと」で決めたもの。応答や出力に出るものは、仕様のどの文に合わせたか）
- 止めて聞いたことと、その答え
- 「人が判断すること」13・17 の Issue の下書き（docs/ ではなく報告の本文に。置き場所は私が決める）
- publish の前の確認の手順
- 契約の確認で変わる例（houki-hub の scripts/reference-examples/houki-nta/ja/nta_search_*.md の freshness.db_path、nta_search_tsutatsu.md の「DB が古いとき」の warning の文、nta_search_tax_answer.md 60 行目からの説明など）
- houki-research-skill で直す箇所（ERROR-HANDLING.md の「MCP サーバーが開いている DB」の見分けの文、freshness の有無で判断している箇所など。grep し直す）
- PR 本文の草案（Closes #138 #137、仕様 PR #142 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 Q146 と QH の順

2 つとも houki-nta-mcp の同じ作業コピーを使い、同じ `specs/current/nta_get_tax_answer/spec.md` に関わります（Q146 は 018 を `specs/current` で直接直し、QH は `specs/changes` に 007・008 などの差分を置く）。触る仕様 ID は重なりませんが、同じチェックアウトで同時には動かせません。**Q146 を先に（小さく、すぐマージできる）、マージ後の main から QH を切る**順にします。1 つの会話で続けて行ってもかまいません（ブランチを分けること）。

2026-10-05 JST に origin の main が `b246079`（v0.25.0）で、`specs/changes/` が空であることを確かめました。

---

## 指示 Q146: houki-nta-mcp #146 の仕様 PR（実装の変更: 不要）

```text
houki-nta-mcp #146（SPEC-NTA-GET-TAX-ANSWER-018 の例の「同じ DB でもう一度呼ぶと」が前提を書き落としている）の仕様 PR を書いてください。この会話の役は Spec Steward です。仕様の文だけを直し、実装・テストは変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の b246079（v0.25.0）。git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ が空であることを確かめる
- ブランチ: spec/<作業日の yyyymmdd>-tax-answer-018-example

## 最初に読むもの

1. AGENTS.md の「PR の種類」（proposal.md が「- 実装の変更: 不要」のときは、仕様 PR で specs/current/ も書いてよい）
2. Issue #146 の本文（curl https://api.github.com/repos/shuji-bonji/houki-nta-mcp/issues/146）
3. specs/current/nta_get_tax_answer/spec.md の SPEC-NTA-GET-TAX-ANSWER-016・018
4. 手本: specs/releases/v0.24.0/20261003-specs-current-catchup/（実装の変更: 不要の差分で current を直した前例）
5. 0.25.0 の受入テスト src/tools/spec-20261004-db-location.test.ts の 018 の it（2 回目の前に document の 6101 の行を消している）

## 書くもの

- specs/changes/<yyyymmdd>-tax-answer-018-example/proposal.md（「- 実装の変更: 不要」。なぜ・直す箇所・変わらない振る舞い・人が判断すること・承認日は空欄）
- specs/current/nta_get_tax_answer/spec.md の 018 の「例（壊れた表の DB）」の最後の箇条書きを、Issue の「直し方（案）」の文にする。016 との関係（同じ番号の 2 回目は DB の経路で返り、索引を引かない）を書く。018 の見出しの題と本文のほかの行は変えない
- MODIFIED の扱いは前例（catchup）に合わせる。specs/changes/ の下に差分の spec.md を置くかどうかも前例どおり
- 承認日の行（current の spec.md の「- 承認日:」）に足す文は、前例の書き方に合わせる（spec-ids#5 で承認の記録の形を変える予定だが、それまでは今の形のまま）

## 守ること・報告すること

- テストと src/ は触らない。テスト名の文（「記事の行を消してから呼ぶ」）もそのまま
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す（承認日の空欄以外の指摘が無いこと）
- コミットを作るところまで。署名・push・PR・マージは私が行う。VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ
- 報告: ブランチ・コミット、直した文の前後、spec-ids check と pr-scope の結果、PR 本文の草案（「実装の変更: 不要」なので Closes #146 を仕様 PR に書いてよいかを、前例 catchup の PR #132 の本文で確かめて書く。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 QH: houki-nta-mcp 0.25.1 の仕様 PR（#147、タックスアンサーの小見出し h3）

```text
houki-nta-mcp #147（nta_get_tax_answer の sections が、国税庁のページの小見出し h3 を落とし、「概要」の 1 節にまとめてしまう）の仕様 PR を書いてください。この会話の役は Spec Steward です（AGENTS.md の「役割」）。実装・テストは書きません。版は 0.25.1（patch）の案です。今も小見出しの欠けた内容を返しているので、できるだけ早く出します。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: #146 の仕様 PR（指示 Q146）がマージされた後の main。git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に #146 の差分（実装の変更: 不要。次の取り込みで releases へ移す）だけがあることを確かめる
- ブランチ: spec/<作業日の yyyymmdd>-tax-answer-h3-sections

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md
2. Issue #147 の本文（curl https://api.github.com/repos/shuji-bonji/houki-nta-mcp/issues/147）と、元の記録 houki-hub docs/notes/2026-10-05-regression-check-egov-0.20.0-nta-0.25.0.md の「見つかったこと」1
3. houki-hub の docs/notes/2026-10-04-plan-stage6-and-followups.md の「段階 3 の契約の確認の結果」と「残りの順序」
4. specs/current/nta_get_tax_answer/spec.md（007 markdown の節、008 json の sections、010 節の構造を持たない行の取り直し、006 書き戻し）、specs/current/nta_search_tax_answer/spec.md と search_rules（full_text の検索）、cli_bulk_download と cli_refresh（タックスアンサーの投入と取り直し）、db_schema
5. src/services/tax-answer-parser.ts（extractSections は h2 だけで節を切り、h3 を集めない。buildTaxAnswerFullText は sections から full_text を作る）、src/services/tax-answer-bulk-downloader.ts（内容が変わったかの判定と、304 のときに解析し直すか）、src/services/health-check.ts（タックスアンサーの parse を確かめる canary）
6. 手本: specs/releases/v0.24.1/20261004-freshness-orphaned/proposal.md（patch の差分の形）

## 出発点（勧める案。proposal.md の「人が判断すること」に書いて承認を受ける）

- 直し方: Issue の案 A。h3 も節の区切りにし、sections は平らな配列のまま `{ heading: "<h3 の文字列>", paragraphs: [...] }` を並べる。応答のフィールドは変えない。h2 の直後に h3 が続き、h2 自身の段落が 0 件のときに h2 の節を作るか（今は paragraphs が 0 件の節は作らない）を例で決める。案 B（sections[].level を足す）・案 C（paragraphs に見出しの行を入れる）は「人が判断すること」に並べる
- 007 の markdown: h3 の節を `## ` にするか `### ` にするか（案 A なら json が平らなので `## ` に揃える案）。今の 007 の例「`## 課税のしくみ`」と合うかを確かめる
- full_text と検索: buildTaxAnswerFullText は sections から作るので、直すと `【<小見出し>】` が full_text に戻る。nta_search_tax_answer の snippet・score が変わりうる。これは「変わる振る舞い」に書く（仕様 ID を MODIFIED するかは、search 側の仕様が full_text の作り方を約束しているかで決める）
- 取り込み済みの DB の行: 0.25.0 以前に h3 のページを取り込んだ行は、小見出しを落とした sections と full_text のまま。直し方を決める。案は (A) 利用者に `--bulk-download-tax-answer` の取り直しを案内する（ただし、304 で内容を解析し直さない作りなら直らないので、src を読んで確かめる。直らないなら `--refresh` の類のフラグを案内する） / (B) 解析の版を DB に記録し、古い版で作った行を 010 と同じく取り直す（スキーマの版を上げることになるので patch では重い） / (C) nta_get_tax_answer が DB の行を返すときに h3 を落とした形かを見分けて取り直す。shuji の DB で何件が当たるかは、Issue の「確かめ方」の SQL（full_text に「消費税の負担者」が無いか）を shuji に実行してもらい、「確かめた値」に書く
- health-check の canary: タックスアンサーの parse の確かめ方に、h3 の節を数える項目を足すかを決める（ページの形の変化を次から早く見つけるため）
- 実データ: 2026-10-05 JST の国税庁の No.6101 のページの見出しの並び（Issue の本文）を例に写す。VM から nta.go.jp に届けば、curl でページを取り、h2・h3 の並びを確かめて「確かめた値」に書く。届かなければ「確かめていない」と書く

## 守ること・報告すること

- specs/changes/<yyyymmdd-slug>/ の下だけを書く。新しい仕様 ID は npx spec-ids next <dir>。proposal.md の「- 承認日:」は空欄
- proposal.md の節は、v0.24.1 の proposal.md と同じ並び（今の動き・変えた後の動き・変わる仕様 ID・変わらない振る舞い・互換性・実装 PR で直す文書・実装の変更・publish の前の確認・取り込みのとき・人が判断すること・確かめた値・確かめていない点）
- publish の前の確認に、houki-hub の scripts/reference-examples/houki-nta/ja/nta_get_tax_answer.md の例（No.6101、v0.24.0 の実測のまま保留中）を 0.25.1 で流し、sections が 7 つ（概要・消費税の負担者・課税のしくみ・申告・納付・納税事務の負担軽減措置等・根拠法令等・関連リンク）に戻ることを確かめる手順を書く。nta_search_tax_answer の例も流す
- 取り込みのとき（Publisher）には、#146 の差分（実装の変更: 不要）も同じ実装 PR で specs/releases/v0.25.1/ へ移すことを書く
- 応答のフィールドを消す・名前を変える変更はしない（T4）。code は変えない
- コミットを作るところまで。署名・push・PR・マージは私が行う。VM の注意は、この文書の「共通」と同じ
- 報告: ブランチ・コミット、ADDED / MODIFIED / REMOVED の数と触った dir、spec-ids check と pr-scope の結果、「人が判断すること」の一覧（勧める案つき）、shuji に Mac で実行してもらう SQL、PR 本文の草案（Refs #147。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、実装 PR に渡すこと
```

---

## 指示 RH: houki-nta-mcp 0.25.1 の実装 PR（#147、タックスアンサーの小見出し h3）

仕様 PR #149（差分 `20261005-tax-answer-h3-sections`、main `94fbaec`、承認日 2026-10-05）のマージの後に、新しい会話に貼ります。2026-10-05 JST に origin の main が `94fbaec` で、`specs/changes/` に `20261005-tax-answer-018-example`（#146、実装の変更: 不要）と `20261005-tax-answer-h3-sections` の 2 つがあることを確かめました。

承認された案は、指示 QH の出発点（Issue の案 A）から変わっています: **案 B（`sections` の要素に `level`（2 / 3）を足す）**、h2 の直後に h3 が続くときは h2 の節を `paragraphs: []` で作る、markdown の h3 の節は `### `、取り込み済みの行は `--bulk-download-tax-answer --refresh` を案内する。新しい仕様 ID は SPEC-NTA-GET-TAX-ANSWER-019、MODIFIED は 007・008 です。仕様 PR の調べで、小見出しの欠けは No.6101 だけでなく、標本の 9 割近い記事で以前から起きていたことが分かっています。

```text
houki-nta-mcp 0.25.1（#147、nta_get_tax_answer の sections で国税庁のページの小見出し h3 も節にし、節ごとに level を返す）の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR #149 は承認・マージ済みで、この会話では仕様の意図を変えません。今も小見出しの欠けた内容を返しているので、できるだけ早く出します。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の 94fbaec。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に 20261005-tax-answer-018-example と 20261005-tax-answer-h3-sections の 2 つがあることを確かめる
- ブランチ: fix/<作業日の yyyymmdd>-0.25.1
- 版: 0.25.0 → 0.25.1（patch）。DB のスキーマの版は 12 のまま
- この PR で閉じる Issue: #147（と、まだ open なら #146）

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md（「ローカル DB を使う開発」「コーディング規約」）
2. specs/changes/20261005-tax-answer-h3-sections/proposal.md と specs/nta_get_tax_answer/spec.md（007・008 の MODIFIED、019 の ADDED と例 1〜4）。とくに「実装の変更」「実装 PR で直す文書」「互換性」「publish の前の確認」「取り込みのとき（Publisher）」
3. specs/changes/20261005-tax-answer-018-example/proposal.md（#146。実装の変更: 不要。取り込みのときに releases へ移すだけ）
4. specs/current/nta_get_tax_answer/spec.md の 006・010（書き戻しと、節の構造を持たない行）
5. src/services/tax-answer-parser.ts（extractSections・buildTaxAnswerFullText）、src/services/tax-answer-render.ts（renderTaxAnswerMarkdown）、src/types/tax-answer.ts、src/tools/handlers.ts（structured_json を読む箇所）、src/services/tax-answer-bulk-downloader.ts（304 と updateDocumentMetaOnly の経路）
6. 手本: specs/releases/v0.24.1/（patch の実装 PR の形）と CHANGELOG.md の 0.24.1

proposal.md の「人が判断すること」1〜10 は書かれている側で承認済みです（案 B の level、空の h2 の節、### 、--refresh の案内、検索の仕様 ID は変えない、health-check は変えない、0.25.1、019 を立てる、level は 2 / 3）。仕様に書かれていない細部（関数の分け方、fixture の取り方など）はこの会話で決めてよく、決めたことは報告の「実装で決めたこと」に書く。応答のフィールド・markdown の行・CLI の出力を仕様の文と例から変えたくなったら、止めて私に聞く（案を並べ、勧める案を 1 つ書く）。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは 019 の本文と例 1〜4、007・008 の sections の行から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる。テストを消して GREEN にしない
- fixture は proposal.md の案（2026-10-05 の No.6101（h3 あり）と No.1222（h2 の直後に h3）を新しく保存、既存の h2 だけの 6101 は例 3 に残す）を出発点にする。VM から nta.go.jp に届かなければ、私が Mac で保存するコマンドを報告に書く
- DB から返す経路で level の無い節に 2 を補う（019 の例 4）。補うのは読んだ直後の 1 か所にし、json と markdown の両方がその値を使う
- buildTaxAnswerFullText と health-check は変えない
- 応答のフィールドを消す・名前を変える変更はしない（T4）。code は変えない
- TS のコードで文字列を + でつながない（テンプレートリテラル）。公開文書の文は「〜します」「〜です」
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. test: 019 の受入テスト（例 1〜4）と 007・008 の sections の行、fixture
2. fix: extractSections で h2・h3 を節にし level を入れる。空の h2 の節（#147）
3. fix: DB から返す経路で level を補う、markdown で level 3 を ### にする（#147）
4. docs: proposal.md の「実装 PR で直す文書」（CHANGELOG の「互換性」と --refresh の案内、README など）
5. chore: v0.25.1 — package.json・package-lock.json・server.json の版と CHANGELOG（Fixed に #147、Added に level）。.claude-plugin/plugin.json は 0.24.x・0.25.0 の慣習に合わせる
6. spec: 2 つの差分を specs/releases/v0.25.1/ へ移す（最後のコミット）。h3-sections は specs/current/ に取り込み、承認日は「2026-10-05（PR #149）」。018-example は current への反映が済んでいるので、移して proposal.md の「状態」を直すだけ（その proposal.md の「取り込みのとき」のとおり）。取り込みの後、specs/changes/ に .gitkeep だけが残ることを確かめる

test: のコミットでは新しいテストが落ち、次の fix: で通ることを確かめる。

## 検証

- npm run build・npm test・npm run check（biome）・npx tsc --noEmit・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す。VM では $HOME/tmp/nta に複製して回せることがある
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す
- proposal.md の「publish の前の確認」1〜10 は私が Mac で行う（公開版の cache.db ではなく cache.dev.db で、--bulk-download-tax-answer --refresh を含む）。手順をそのまま報告に写し、この PR で変わったコマンド名や出力の文があれば直して書く
- Cowork の VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果
- 実装で決めたこと、止めて聞いたことと答え
- publish の前の確認の手順
- houki-hub で直すもの: scripts/reference-examples/houki-nta/ja/nta_get_tax_answer.md（v0.24.0 の実測のまま保留中。0.25.1 と入れ直した DB で取り直し、level を足す）、nta_search_tax_answer.md（full_text が変わるので score・snippet）。proposal.md の「この差分の外で見つけたこと」の、h3 を以前から持つ記事（No.4102 か No.1222）の例を足す案も
- houki-research-skill で直す箇所（sections の形・level を引用している箇所を grep。無ければ無いと書く）
- PR 本文の草案（Closes #147、#146 が open なら Closes #146、仕様 PR #148・#149 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 Q26: houki-nta-mcp 0.26.0 の仕様 PR（#144・#145）

計画書の「残りの順序」の 2（段階 3b）です。#144・#145 は 0.25.0 の実装 PR で差分 `20261004-db-location` の外として残した 2 件（同 proposal.md の「人が判断すること」13・17）で、どちらも「ローカル DB が使えないときに、利用者がどのファイルが原因かを知れるようにする」ための変更です。期限は無く、害は小さいので patch ではなく 0.26.0（#144 で `code` が変わるため minor）にします。

2026-10-06 JST に shuji が、下の「出発点」の勧める案で進めると決めました（計画書 8.1）。

2026-10-06 JST に、origin の main が `c029602`（v0.25.1）で、`specs/changes/` が `.gitkeep` だけであることを確かめました。

```text
houki-nta-mcp 0.26.0（#144 開けないローカル DB の読むだけのツールの応答、#145 --bulk-download-tax-answer が索引を保存できないときの終わり方）の仕様 PR を書いてください。この会話の役は Spec Steward です（AGENTS.md の「役割」）。実装・テストは書きません。2 件は同じ差分（specs/changes/ のフォルダー 1 つ）にまとめます。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の c029602（v0.25.1）。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ が .gitkeep だけであることを確かめる
- ブランチ: spec/<作業日の yyyymmdd>-db-failure-paths

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md
2. Issue #144・#145 の本文（curl https://api.github.com/repos/shuji-bonji/houki-nta-mcp/issues/144 と /145）
3. specs/releases/v0.25.0/20261004-db-location/proposal.md の「人が判断すること」13・17 と「houki-egov-mcp と文を変えた箇所」
4. houki-hub の docs/DECISIONS.md の 2026-10-04 の行（T6 の a〜f、#137）と 2026-10-05 の行（--status は移行しない）
5. specs/current の common_errors（SPEC-NTA-COMMON-ERRORS-006 の INTERNAL_ERROR の意味）、db_schema（021 とその注 1・注 2、025、029）、cli_status（007）、cli_bulk_download（013 と、記事ごとの失敗・種別ごとの失敗のときの終了コードの決まり）、nta_get_tax_answer（016・018）、DB だけを引く 3 ツールと検索 6 ツール・nta_inspect_pdf_meta の「DB に 1 件も無い」ときの応答
6. 比べるために houki-egov-mcp の specs/current/search_fulltext/spec.md の SPEC-EGOV-SEARCH-FULLTEXT-027・044（開けない DB で search_law に切り替え、note にパスを入れる）
7. src/db/index.ts（DB を開く所と例外）、src/tools/handlers.ts（例外を INTERNAL_ERROR にしている所）、src/services/tax-answer-bulk-downloader.ts 137 行目付近（saveTaxAnswerIndex の呼び出し）、src/cli.ts（--bulk-download-everything の種別ごとの失敗の受け取り方と process.exitCode）
8. 手本: specs/releases/v0.25.0/20261004-db-location/proposal.md（minor の差分の形）

## 出発点（2026-10-06 JST に shuji がこの案で進めると決めた。proposal.md の「人が判断すること」にも並べ、仕様 PR で最終の承認を受ける）

#144（開けない DB。対象は、SQLite でないファイル・フォルダー・パスの途中が普通のファイル・権限が無い、の 4 つ）:

- 決めること 1（code）: 案 A。DOC_NOT_FOUND（基本通達は TSUTATSU_NOT_FOUND）にし、SPEC-NTA-DB-SCHEMA-029 の表（DB の状態ごとの hint）に「開けない」の行を足す。理由: 「DB に 1 件も無い」ときの応答と同じ形になり、family の code の一覧（houki-research-skill の docs/ERROR-CODES.md）と houki-egov-mcp に影響しない。INTERNAL_ERROR は「不具合の報告を求める」意味（006）で、利用者のファイルの状態とは合わない。案 B（INTERNAL_ERROR のまま hint だけ変える）・案 C（新しい code）は並べる
- 決めること 2（hint）: Issue の例の文を出発点にし、パスは T6 の (a) のとおりホームを ~ に置き換え、案内のコマンドは T6 の (c) の形（npx -y @shuji-bonji/houki-nta-mcp@latest --status、環境変数で決めたときは同じ変数を前に付ける）にする。SQLite の文（file is not a database など）は hint に入れるか detail.cause に残すかを例で決める
- 決めること 3（retryable）: false
- 決めること 4（next_actions）: cli_bulk_download は入れない（ファイルを直さないと投入も失敗する）。--status を next_actions に入れられる形が今の next_actions にあるかを src で確かめ、無ければ hint の文だけで案内する
- 決めること 5（書き戻す 3 ツール: nta_get_tsutatsu・nta_get_qa・nta_get_tax_answer）: 同じ差分で決める。まず今の動き（開けない DB で国税庁サイトから取った内容を返すか、例外になるか）を src とテストで確かめて「今の動き」に書く。勧める案は、国税庁サイトから取れた内容は返し、DB に書けないことを logger.warn に DB のパスと一緒に出す（DECISIONS.md の #137 と SPEC-NTA-GET-TAX-ANSWER-018 と同じ考え方）。サイトからも取れないときは、上の 1〜4 の応答にする
- CLI（[ERROR] DB を開けません と終了コード 1）は変えない
- houki-egov-mcp と違う点（egov は search_law に切り替える。nta には切り替える先が無い）を proposal.md の「houki-egov-mcp と文を変えた箇所」に書く

#145（--bulk-download-tax-answer が索引を保存できないとき）:

- 決めること 1: 案 A。記事の取り込みを続け、保存の失敗は標準エラー出力に [WARN] の行（表の名前と DB のパス）で出す。理由: 記事の URL は取った索引で決まり、保存した索引は nta_get_tax_answer が索引を取り直さずに済むための写しなので、保存できなくても取り込みの目的は果たせる（#137・018 と同じ考え方）
- 決めること 2（終了コード）: cli_bulk_download の今の決まりのうち、「記事ごとの失敗」があったときの終了コードに揃える。決まりが無ければ、その旨を「今の動き」に書き、0 と 1 の 2 案を並べる（勧める案は、記事を取り込めたなら 0。[WARN] の行で気付ける）
- 決めること 3（--bulk-download-everything）: 案 A なら、タックスアンサーの段は失敗しないので次の種別へ進む。今の「種別ごとの失敗を受け取って次へ進む」作りは変えない
- 決めること 4: 受入テストを書く（壊れた表の DB。018 の受入テスト src/tools/spec-20261004-db-location.test.ts の作り方を写す）。Issue が「確かめていない」とした今の動き（fatal error で終了コード 1、everything ではタックスアンサーを飛ばす）は、コードを読んだ結果として「今の動き」に書き、実行して確かめたかどうかを分けて書く

## 守ること・報告すること

- specs/changes/<yyyymmdd-slug>/ の下だけを書く。新しい仕様 ID は npx spec-ids next <dir>。proposal.md の「- 承認日:」は空欄（spec-ids#5 で承認の記録の形を変える予定だが、この差分は今の形のまま）
- proposal.md の節は v0.25.0 の proposal.md と同じ並び（なぜ変えるか・今の動き・変えた後の動き・変わる仕様 ID・変わらない振る舞い・互換性・呼び出し例への影響・houki-egov-mcp と文を変えた箇所・実装 PR で直す文書・実装の変更・publish の前の確認・取り込みのとき・人が判断すること・確かめた値・確かめていない点）
- 互換性: #144 は code が INTERNAL_ERROR から変わるので、CHANGELOG の「互換性」に書く文を用意する。応答のフィールドは消さない・名前を変えない（T4）
- 実装 PR で直す文書: houki-research-skill（$HOME/mnt/skills/houki-research-skill）の docs/ERROR-CODES.md・docs/ERROR-HANDLING.md などで、nta の開けない DB を INTERNAL_ERROR と書いている箇所を grep して列挙する。houki-hub の呼び出し例（scripts/reference-examples/houki-nta/ja/）に開けない DB の例があるかを確かめ、無ければ「影響なし」と書く
- publish の前の確認: 4 つの開けない DB（SQLite でないファイル・フォルダー・パスの途中が普通のファイル・権限が無い）を HOUKI_NTA_DB_PATH で指して、読むだけのツール・書き戻す 3 ツール・--status の 3 つで応答を確かめる手順を書く。shuji の Mac の公開版の DB（~/.cache/houki-nta-mcp/cache.db）には触らない手順にする
- コミットを作るところまで。署名・push・PR・マージは私が行う。VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ
- 報告: ブランチ・コミット、ADDED / MODIFIED / REMOVED の数と触った dir、spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs の結果、「人が判断すること」の一覧（勧める案つき）、PR 本文の草案（Refs #144 #145。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、実装 PR に渡すこと
```
