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
| Q26 | 3b | houki-nta-mcp 0.26.0 の仕様 PR（#144・#145） | 済（PR #152、main `c696f4a`、承認日 2026-10-06） |
| R26 | 3b | houki-nta-mcp 0.26.0 の実装 PR（#144・#145） | 済（PR #153、v0.26.0 を 2026-10-07 に publish） |
| Q156 | 3b | houki-nta-mcp #156 の仕様 PR（実装の変更: 不要の見込み） | 済（PR #157） |
| XS26 | 3b | houki-research-skill の nta 0.26.0 への追随 | 済（Skill PR #28、v0.19.1、claude-plugins も更新済み） |
| S5 | 残りの順序 3 | spec-ids#5 の設計 PR | 済（spec-ids PR #6、main `d0ce8b7`） |
| R5 | 残りの順序 3 | spec-ids 0.3.0 の実装 PR | 済（spec-ids PR #7、v0.3.0 を 2026-10-09 に publish） |
| CE | 残りの順序 3 | houki-egov-mcp の変換の PR | 済（egov PR #117、Closes #116） |
| CN | 残りの順序 3 | houki-nta-mcp の変換の PR（前直し F1・F2・F5） | 済（nta PR #159、Closes #158） |
| CA | 残りの順序 3 | houki-abbreviations の変換の PR（前直し F3・F4） | 済（abbr PR #38、Closes #37） |
| D5 | 残りの順序 3 | spec-ids の docs の PR（operations.md）と Issue 草案 2 件、#5 を閉じる | 済（spec-ids PR #10、#5 を閉じた。Issue #8・#9） |
| Q27 | 残りの順序 2 | houki-nta-mcp 0.27.0 の仕様 PR（#154・#155） | 済（nta PR #160、main `a2a9e5f`） |
| R27 | 残りの順序 2 | houki-nta-mcp 0.27.0 の実装 PR（#154・#155、#156 を閉じる） | 済（nta PR #161、v0.27.0 を 2026-10-09 に publish） |
| D5b | 残りの順序 3 | spec-ids の docs の PR（operations.md 5 章、ID の無い節の書き方） | 済（spec-ids PR #11） |
| XS27 | 残りの順序 2 | houki-research-skill の nta 0.27.0 への追随 | 済（Skill PR #29、v0.20.0） |
| Y1 | 段階 4 | #27 の仕様書ページと scope-by-audience（設計と試作） | 済（hub PR #46、main `690ac1e`） |
| Y2 | 段階 4 | #27 の仕様書ページの全部の生成と公開 | 済（hub PR #47、main `eff9bd9`） |
| Y3 | 段階 4 | ツールごとのページ（リファレンスを分ける。Q27' の B、houki-hub#48） | 済（hub PR #49、main `e518da9`） |
| Y4 | 段階 4 | 人が書くページのコンテナと図（Q28' の A） | 済（hub PR #50、main `2d3d92e`） |
| Z1 | 段階 4 | hub#5 ② と呼び出し例の照合のスクリプト（#44）の設計と試作 | 済（hub PR #51、main `e664481`） |
| Y5 | 段階 4 | scope-by-audience の (1)・(2) と houki-nta.md の `--tsutatsu` の説明 | 済（hub PR #52、main `2eb0dc1`） |
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

---

## 指示 R26: houki-nta-mcp 0.26.0 の実装 PR（#144・#145）

仕様 PR #152（差分 `20261006-db-failure-paths`、main `c696f4a`、承認日 2026-10-06）のマージの後に、新しい会話に貼ります。2026-10-06 JST に origin の main が `c696f4a` で、`specs/changes/` に `20261006-db-failure-paths` だけがあることを確かめました。差分は ADDED 2（SPEC-NTA-DB-SCHEMA-030、SPEC-NTA-CLI-BULK-DOWNLOAD-014）・MODIFIED 17、触る dir は 14 です。

承認された案は、指示 Q26 の出発点から 2 か所が変わっています。

- 「人が判断すること」7: 書き戻す 3 ツールで国税庁サイトからも取れないときに、開けない DB の応答にするのは、取りに行く先の無い通達（SPEC-NTA-GET-TSUTATSU-007）だけにしました。通信の失敗（`SOURCE_*`）・404・解析の失敗・条項が無いときは今までの応答のままで、`next_actions` から `cli_bulk_download` だけを外します。`SOURCE_*` の `retryable: true` と、原因を示す `hint` を残すためです
- 「人が判断すること」10: 置き場所のフォルダーに入る権限が無いときは、この差分では変えず、別の Issue にします

```text
houki-nta-mcp 0.26.0（#144 ローカル DB を開けないときの読むだけのツールと書き戻すツールの応答、#145 --bulk-download-tax-answer が索引を保存できないときの終わり方）の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR #152 は承認・マージ済みで、この会話では仕様の意図を変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の c696f4a。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に 20261006-db-failure-paths だけがあることを確かめる
- ブランチ: feat/<作業日の yyyymmdd>-0.26.0
- 版: 0.25.1 → 0.26.0（minor）。DB のスキーマの版は 12 のまま
- この PR で閉じる Issue: #144・#145

## 最初に読むもの（この順）

1. AGENTS.md と CONTRIBUTING.md（「ローカル DB を使う開発」「コーディング規約」）
2. specs/changes/20261006-db-failure-paths/proposal.md と specs/*/spec.md の 14 個。とくに「実装の変更」「実装 PR で直す文書」「互換性」「publish の前の確認」「取り込みのとき（Publisher）」「人が判断すること」
3. houki-hub の docs/DECISIONS.md の 2026-10-04 の「T6」「#137」の行
4. proposal.md の「実装の変更」に挙がった src/ のファイル: src/db/index.ts（openReadDb・openWriteBackDb・probeDbState）、src/db/location.ts（displayDbPath・guideCommand）、src/tools/handlers.ts（explainDbState、getTsutatsu・getQa・getTaxAnswer、renderLiveResult）、src/services/tax-answer-bulk-downloader.ts（saveTaxAnswerIndex の呼び出しと TaxAnswerIndexDbError）、src/cli.ts（runBulkDownloadTaxAnswer と --bulk-download-everything の種別ごとの失敗）
5. 受入テストの手本: src/tools/spec-20261004-db-location.test.ts（makeBrokenIndexDb・siteRecordingIndexHeaders・captureWarns）と src/spec-20261004-db-location.test.ts（vi.mock の作り）
6. 手本: specs/releases/v0.25.0/（minor の実装 PR の形）と CHANGELOG.md の 0.25.0

proposal.md の「人が判断すること」1〜16 は、書かれている勧める案で承認済みです。仕様に書かれていない細部（関数の分け方、fixture の取り方、テストの組み立てなど）はこの会話で決めてよく、決めたことは報告の「実装で決めたこと」に書く。応答の code・hint・retryable・detail・next_actions、warn の行の scope と meta、CLI の [WARN] の行、終了コードを仕様の文と例から変えたくなったら、止めて私に聞く（案を並べ、勧める案を 1 つ書く）。私の答えが仕様の変更になるときは、この PR とは別の specs/changes が要ることを書く（この会話では specs/changes を書かない）。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる。テストを消して GREEN にしない
- 開けない DB のファイルの大きさと中身を変えない（読むだけのツール・書き戻すツールの両方。受入テストで確かめる）
- chmod 000 のテストは、root で走るときに飛ばす（proposal.md の「実装の変更」の受入テストの項）。利用者のホームのパスはテストに書かない。HOME は一時フォルダーに差し替える
- 「人が判断すること」7 のとおり、書き戻す 3 ツールで国税庁サイトから取れなかったときの code と retryable は、取りに行く先の無い通達（GET-TSUTATSU-007）を除いて今までのまま
- 応答のフィールドを消す・名前を変える変更はしない（T4）
- TS のコードで文字列を + でつながない（テンプレートリテラル）。公開文書の文は「〜します」「〜です」
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順（案。差分の構成と合わないときは理由を書いて変えてよい）

1. test: → feat: 開けない DB で読むだけのツールが DOC_NOT_FOUND / TSUTATSU_NOT_FOUND と開けないときの hint を返す（db_schema 021・029、common_errors 006、検索 6 ツール・DB だけを引く 3 ツール・nta_inspect_pdf_meta の ID）。文の中のホームを ~ にする関数も
2. test: → feat: 書き戻す 3 ツールが開けない DB で国税庁サイトから取り、warn を出す（db_schema 030、nta_get_tsutatsu 007・010）
3. test: → fix: --bulk-download-tax-answer が索引を保存できなくても記事の取り込みを続ける（cli_bulk_download 014、db_schema 025）
4. docs: proposal.md の「実装 PR で直す文書」1〜5（README・docs/DATABASE.md）
5. chore: v0.26.0 — package.json・package-lock.json・server.json の版と CHANGELOG（「互換性」の文、Changed に #144、Fixed に #145）。.claude-plugin/plugin.json は 0.25.x の慣習に合わせる
6. spec: 差分を specs/current/ に取り込み、specs/releases/v0.26.0/ へ移す（最後のコミット。承認日は「2026-10-06（PR #152）」）。取り込みの後、specs/changes/ に .gitkeep だけが残ることを確かめる

test: のコミットでは新しいテストが落ち、次の feat: / fix: で通ることを確かめる。

## 検証

- npm run build・npm test・npm run check（biome）・npx tsc --noEmit・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す。VM では $HOME/tmp/nta に複製して回せることがある
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す
- proposal.md の「publish の前の確認」1〜9 は私が Mac で行う（公開版の cache.db には触らず、/tmp/nta-026/ の下だけを使う）。手順をそのまま報告に写し、この PR で変わったコマンド名や出力の文があれば直して書く。proposal.md の「確かめていない点」3（別のプロセスとして起動したときの今の動き）と 6（call.sh が応答を返すか）は、この PR の作業の中で確かめられれば確かめて報告に書く
- Cowork の VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果
- 実装で決めたこと、止めて聞いたことと答え
- publish の前の確認の手順
- proposal.md の「この差分の外で見つけたこと」1（置き場所のフォルダーに入る権限が無いときの判定）と 2（GET-TSUTATSU-007 の案内のコマンドが --tsutatsu で受け付けられない）の Issue の下書き（docs/ ではなく報告の本文に。置き場所と投稿は私が決める）
- houki-research-skill で直す箇所（proposal.md の「互換性」の Skill の表の 5 か所を、main で grep し直して確かめる）
- houki-hub で直すもの（呼び出し例は proposal.md では影響なし。site の local-database.md・mcp/houki-nta.md に開けない DB の扱いを足すかの案）
- PR 本文の草案（Closes #144 #145、仕様 PR #152 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 Q156 と XS26（2026-10-07 に追加）

2026-10-07 JST に shuji が計画書の Q16 を案 A に決めました。#156（仕様の文だけ）と houki-research-skill の 0.26.0 への追随を今行い、#154・#155 は spec-ids#5 の後に nta 0.27.0 にまとめます。Q156 は houki-nta-mcp、XS26 は houki-research-skill で、別のリポジトリなので並行できます。

2026-10-07 JST に、houki-nta-mcp の origin の main が `c5bbb43`（v0.26.0）で `specs/changes/` が `.gitkeep` だけであること、houki-research-skill の origin の main が `0889824`（v0.19.0）であることを確かめました。

---

## 指示 Q156: houki-nta-mcp #156 の仕様 PR（実装の変更: 不要の見込み）

```text
houki-nta-mcp #156（nta_inspect_pdf_meta の inputSchema は docType: "qa-jirei" を受け付けないのに、仕様の表と例が qa-jirei を使っている）の仕様 PR を書いてください。この会話の役は Spec Steward です（AGENTS.md の「役割」）。仕様の文だけを直し、実装・テストは変えない見込みです。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の c5bbb43（v0.26.0）。git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ が .gitkeep だけであることを確かめる
- ブランチ: spec/<作業日の yyyymmdd>-inspect-pdf-meta-qa-jirei

## 最初に読むもの

1. AGENTS.md の「PR の種類」（proposal.md が「- 実装の変更: 不要」のときは、仕様 PR で specs/current/ も書いてよい）
2. Issue #156 の本文（curl https://api.github.com/repos/shuji-bonji/houki-nta-mcp/issues/156）
3. specs/current/nta_inspect_pdf_meta/spec.md（19 行目の引数の表は「質疑応答事例（qa-jirei）は PDF を持たないので選べない」と書き、67・68・70 行目は qa-jirei を使っている）と specs/current/db_schema/spec.md の 391 行目（029 の下の表の nta_inspect_pdf_meta の行）と 414 行目（例）
4. src/tools/definitions.ts 395 行目（docType の enum が 4 つ）と、src/tools/handlers.ts・src/services/pdf-meta.ts の docType の扱い（qa-jirei の枝があるか）
5. 手本: specs/releases/v0.25.1/20261005-tax-answer-018-example/（実装の変更: 不要の差分で current を直した前例、#146）と specs/releases/v0.24.0/20261003-specs-current-catchup/
6. 0.26.0 の差分 specs/releases/v0.26.0/20261006-db-failure-paths/proposal.md の「publish の前の確認」5（qa-jirei を使っている）

## 出発点（勧める案。proposal.md の「人が判断すること」に書いて承認を受ける）

- 直し方: Issue の案のとおり、仕様から qa-jirei の行と例を外し、inputSchema（4 つ）に合わせる。nta_inspect_pdf_meta の 67・68・70 行目、db_schema の 391・414 行目。19 行目の「選べない」の文は残す
- 外した例の代わりが要るところは、tax-answer か kaisei の例にする（例の値は、今ある別の例か、確かめられる値を使う）
- 実装の変更: 不要。ただし src に qa-jirei の枝が残っている場合は、「実装の変更: 不要」のまま「この差分の外で見つけたこと」に書く（届かない枝を消すかは別に決める）。inputSchema を広げて qa-jirei を受け付ける案（質疑応答事例は PDF を持たないので意味が無い）は「人が判断すること」に並べるだけにする
- 0.26.0 の proposal.md（releases の下）は取り込み済みの記録なので書き換えない。「publish の前の確認」5 の誤りは、この差分の proposal.md に書く
- 受入テストがハンドラーを直接呼ぶため inputSchema の検査を通らない、という Issue の指摘は、この差分では扱わない。「この差分の外で見つけたこと」に、tools/list の inputSchema と仕様の例を突き合わせる確かめ方（たとえば呼び出し例の照合のスクリプト houki-hub#44 で扱えるか）を書く

## 守ること・報告すること

- テストと src/ は触らない
- specs/changes/<yyyymmdd>-inspect-pdf-meta-qa-jirei/proposal.md（「- 実装の変更: 不要」。なぜ・直す箇所・変わらない振る舞い・人が判断すること・この差分の外で見つけたこと・承認日は空欄）と、直した specs/current の 2 ファイル。MODIFIED の扱いと承認日の行の足し方は、前例（#146 の差分）に合わせる（spec-ids#5 で形を変える予定だが、それまでは今の形のまま）
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す（承認日の空欄以外の指摘が無いこと）
- コミットを作るところまで。署名・push・PR・マージは私が行う。VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ
- 報告: ブランチ・コミット、直した文の前後、spec-ids check と pr-scope の結果、src の qa-jirei の枝の有無、PR 本文の草案（Closes #156 を仕様 PR に書いてよいかを、前例の #146 の PR #148 の本文で確かめて書く。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、取り込みのとき（次の実装 PR で releases へ移す版）
```

---

## 指示 XS26: houki-research-skill の houki-nta-mcp 0.26.0 への追随

```text
houki-research-skill を houki-nta-mcp 0.26.0（#144 開けないローカル DB の応答、#145 --bulk-download-tax-answer の [WARN]）に追随させてください。この会話の役は、Skill の文書を直す作業者です。MCP のリポジトリは触りません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/skills/houki-research-skill（device_bash では $HOME/mnt/skills/houki-research-skill）
- 起点: main の 0889824（v0.19.0）。作業の前に git ls-remote https://github.com/shuji-bonji/houki-research-skill refs/heads/main で origin と同じか確かめる
- ブランチ: docs/<作業日の yyyymmdd>-nta-0.26.0
- 版: 0.19.0 → 0.19.1 を勧める（文書の表と説明を直すだけで、手順を足さないため。0.18.1 の前例「文の引用を直すだけなら patch」）。手順を足すことになったら 0.20.0 にし、理由を報告に書く

## 最初に読むもの（この順）

1. README と CHANGELOG の 0.19.0（直し方と書き方の手本）
2. houki-nta-mcp の specs/releases/v0.26.0/20261006-db-failure-paths/proposal.md（$HOME/mnt/houki-hub/mcp/houki-nta-mcp の下）の「互換性」、とくに末尾の「houki-research-skill で関係する箇所」の表（5 か所）
3. houki-nta-mcp の specs/current/db_schema/spec.md の SPEC-NTA-DB-SCHEMA-029（開けないときの行）・030、specs/current/cli_bulk_download/spec.md の SPEC-NTA-CLI-BULK-DOWNLOAD-014、specs/current/common_errors/spec.md の 006
4. houki-nta-mcp の CHANGELOG の 0.26.0

## 直すこと

proposal.md の表の 5 か所を出発点にし、main で grep し直して行番号と文を確かめる（表は 2026-10-06 の v0.19.0 の行番号）。

1. skills/houki-research/docs/ERROR-HANDLING.md の houki-nta-mcp の hint の先頭の表（84〜92 行目付近）: 「ローカル DB（<パス>）を開けません」の行（DB を開けない。next_actions は無い。--status で理由を確かめ、パス・権限・ファイルを直す。retryable: false）を足す
2. 同 71 行目付近の「いずれも next_actions の action が cli_bulk_download」: 投入で直る場面に限る文にする
3. 同 206〜214 行目付近（INTERNAL_ERROR）: houki-nta-mcp 0.25.x 以前では、DB を開けないときも INTERNAL_ERROR（detail.cause が file is not a database など）で、不具合ではないことを、214 行目の例外に足すかを決める。勧める案は足す（0.25.x 以前のサーバーを使っている利用者が、不具合として報告しないため）
4. skills/houki-research/docs/ERROR-CODES.md の TSUTATSU_NOT_FOUND・DOC_NOT_FOUND（78・79 行目付近）: 「ローカル DB を開けないときも（houki-nta-mcp v0.26.0 以上）」を足す
5. README の推奨最小バージョンの表（156 行目付近）: houki-nta-mcp v0.26.0 の 3 つの変更（開けない DB の DOC_NOT_FOUND / TSUTATSU_NOT_FOUND、書き戻す 3 ツールの国税庁サイトからの取得と warn、--bulk-download-tax-answer の [WARN]）を足す
6. scripts/mcp-refs.config.json の houki-nta-mcp の版を 0.25.0 → 0.26.0 にし、node scripts/update-mcp-snapshots.mjs で mcp-snapshots/houki-nta.json を作り直す（VM から npm の registry に届かないときは、$HOME/mnt/houki-hub/mcp/houki-nta-mcp の dist を使えるか確かめ、使えなければ私が Mac で実行するコマンドを報告に書く）

上の 5 か所のほかに、0.26.0 で古くなった文が無いかを、「開けな」「INTERNAL_ERROR」「cli_bulk_download」「bulk-download-tax-answer」「索引」で grep し直す（CHANGELOG を除く）。版を書いた実測の記録（examples/ の v0.22.0 の実測など）は書き換えず、そのまま残す。

## 守ること

- Skill の文書の文は「〜します」「〜です」。houki-nta-mcp の仕様 ID を引用し、仕様の文を言い換えて意味を変えない
- 0.25.x 以前と 0.26.0 で違う箇所は、版を書いて両方が分かるようにする（0.19.0 の「v0.24.x の文として残し」と同じ扱い）
- node scripts/check-mcp-refs.mjs と node --test 'scripts/test/*.test.mjs' を通す
- コミットを作るところまで。署名・push・PR・マージ・タグは私が行う。VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ（git を使う前に skills フォルダーの削除の許可を取る）

## 終わったら報告すること

- ブランチ・コミット（ハッシュと件名）
- 直した箇所の一覧（ファイル・行・前後の文）と、grep し直して足した箇所・足さなかった箇所の理由
- check-mcp-refs と test の結果、mcp-snapshots の差分（または Mac で実行するコマンド）
- CHANGELOG 0.19.1（または 0.20.0）の文
- PR 本文の草案（houki-nta-mcp 0.26.0・#144・#145 への言及。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
- claude-plugins の追随が要るか
```

---

## 指示 S5: spec-ids#5 の設計 PR（承認の記録を proposal.md の front matter に移す）

計画書の「残りの順序」の 3 です。spec-ids には、自分自身の `specs/` がありません（2026-10-09 JST に確かめた。0.1.0・0.2.0 は README・CHANGELOG・`docs/operations.md` で振る舞いを書き、PR #2 で実装した）。そのため、#5 の「進め方」1 の「仕様 PR」は、`docs/` に置く設計の文書（変わる振る舞い・変わらない振る舞い・人が判断すること）を 1 本の PR にし、人が承認してから実装 PR（進め方 2）に進む形にします（計画書の Q21）。

この指示の出発点は、計画書の Q18〜Q21 の勧める案です。**shuji が Q18〜Q21 を決めてから新しい会話に貼ります。** 勧める案と違う決定になったら、下の「出発点」を直してから貼ります。

2026-10-09 JST に、spec-ids の origin の main が `6e3964c`（0.2.0 の後、docs の 2 コミット）であることを確かめました。作業コピーに未追跡の `Claude outputs/`（`issue-approval-front-matter.md`、#5 の起票の下書きと見られる）があります。

```text
spec-ids#5（承認の記録を proposal.md の front matter に移し、current の承認日の行を手で書き足さないようにする）の設計 PR を書いてください。この会話の役は Spec Steward です（spec-ids の docs/operations.md 1.3）。実装・テストは書きません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/spec-ids（Cowork の device_bash では $HOME/mnt/spec-ids）
- 起点: main の 6e3964c。作業の前に git ls-remote https://github.com/shuji-bonji/spec-ids refs/heads/main で origin と同じか確かめる
- ブランチ: spec/<作業日の yyyymmdd>-approval-front-matter
- 置くもの: docs/proposals/<作業日の yyyymmdd>-approval-front-matter.md の 1 本（docs/proposals/ が無ければ作る）。spec-ids には specs/ が無いので、houki 系の proposal.md と同じ節の並びをこの文書に持たせる
- 未追跡の「Claude outputs/」は触らない（コミットに入れない）

## 最初に読むもの（この順）

1. spec-ids の README・CHANGELOG・docs/operations.md（とくに 1.2 PR の種類、3.2 承認日、4 CI）
2. Issue #5 の本文（curl https://api.github.com/repos/shuji-bonji/spec-ids/issues/5）
3. src/scan.mjs・src/check.mjs・bin/spec-ids.mjs（今の走査と出力の形）
4. 利用側の今の形（読むだけ）: houki-egov-mcp・houki-nta-mcp・houki-abbreviations（/Users/bonji/workspace/shuji-bonji/houki-hub/mcp/ の下と、houki-abbreviations の作業コピー）の specs/current/<dir>/spec.md の「- 承認日:」の行、specs/releases/*/*/proposal.md の冒頭の「- 対象:」「- 実装の変更:」「- 承認日:」の行、.github/scripts/check-pr-scope.mjs の APPROVAL_RE
5. Issue #5 の「今の形のままでは履歴を集計できない」の表（egov の 3 件の食い違い）。nta・abbr にも同じ食い違いがあるかを、releases の specs/<dir>/ の有無と current の行を突き合わせて数える

## 出発点（勧める案。文書の「人が判断すること」に書いて承認を受ける）

- Q18 front matter のキー名: Issue の案のまま。proposal.md は approved・pr・implementation・targets、current の spec.md は spec_id・kind・approved・pr。implementation の値（required / none の 2 つか、今の「要 / 不要」をそのまま使うか）は文書で決める
- Q19 current に approvals: の配列を置かない。履歴は spec-ids history <dir> の出力だけにする（history --write は作らない）
- Q20 check-pr-scope.mjs の取り込みは #5 の後の版で行う（spec-ids pr-scope）。#5 の版では、3 リポジトリのコピーの APPROVAL_RE を front matter の判定に替える手順だけを書く
- targets の検査（specs/<dir>/spec.md があるのに targets に無い差分を止める）は spec-ids check に足す。逆向き（targets にあるのに specs/<dir>/ が無い）は、「実装の変更: 不要」の差分（current を直接直す）で正しく起きるので止めない、を出発点にする
- 変換（Issue の進め方 3・4）: 変換スクリプトの置き場所（spec-ids の bin のサブコマンドにするか、一度だけ使う scripts/ にするか）と、変換の前後で一致を確かめる方法（今の current の行から作った「差分 ID → 機能」の表と、変換後の spec-ids history の出力を比べる）を書く。Issue の表の食い違い（current の行と releases の specs/<dir>/ が合わない差分）を、変換で current の行と releases のどちらに合わせるかを「人が判断すること」に並べる
- 移行の間の扱い: 変換を済ませたリポジトリと済ませていないリポジトリが並ぶ間、spec-ids check は両方の形を受け付けるか（受け付けるなら、いつ古い形をやめるか）を書く
- 版: 0.3.0（check が front matter と targets を見るようになり、出力が変わるため）を出発点にする

## 守ること・報告すること

- docs/proposals/ の 1 本だけを書く。src/・test/・README・CHANGELOG・docs/operations.md は変えない（operations.md の 3.2 と 6 章を直すのは実装 PR か、その後の docs の PR。その範囲を文書に書く）
- 文書の節: なぜ変えるか・今の動き・変えた後の動き（front matter の形、history の出力の例、check の新しい検査、pr-scope の判定）・変わらない振る舞い・互換性（利用側の 3 リポジトリで何がいつ変わるか）・変換の手順・実装 PR で直す文書・人が判断すること（勧める案つき）・確かめた値（実際に数えた件数と、どのコマンドで数えたか）・確かめていない点
- 例は実在の差分 ID と PR 番号で書く（egov の 20261002-t1-followups の PR 番号など、releases の proposal.md から写す）
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に spec-ids フォルダーの削除の許可を取る（houki-hub の指示書の「共通: Cowork の VM で作業するときの注意」と同じ。VM の git には GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"、COMMITTER も同じ）
- 報告: ブランチ・コミット、文書の要約（変わる振る舞い 3〜5 行）、「人が判断すること」の一覧と勧める案、3 リポジトリで数えた食い違いの件数、PR 本文の草案（Refs #5。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、実装 PR に渡すこと
```

---

## 指示 R5: spec-ids 0.3.0 の実装 PR（#5）

設計 PR #6（`docs/proposals/20261009-approval-front-matter.md`、main `d0ce8b7`、承認日 2026-10-09）のマージの後に、新しい会話に貼ります。設計の「人が判断すること」Q18〜Q31 は勧める案で承認済みです。2026-10-09 JST に、spec-ids の origin の main が `d0ce8b7` であることを確かめました。

```text
spec-ids 0.3.0（#5 承認の記録を proposal.md の front matter に移す）の実装 PR を作ってください。この会話の役は Test Designer → Coder です（spec-ids の docs/operations.md 1.3）。設計 PR #6 は承認・マージ済みで、この会話では設計の意図を変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/spec-ids（Cowork の device_bash では $HOME/mnt/spec-ids）
- 起点: main の d0ce8b7。作業の前に git ls-remote https://github.com/shuji-bonji/spec-ids refs/heads/main で origin と同じか確かめる
- ブランチ: feat/<作業日の yyyymmdd>-0.3.0
- 版: 0.2.0 → 0.3.0
- この PR で閉じる Issue: #5 は閉じない（3 リポジトリの変換が終わるまで open。PR 本文は Refs #5）
- 未追跡の「Claude outputs/」は触らない

## 最初に読むもの（この順）

1. docs/proposals/20261009-approval-front-matter.md の全文。とくに「変えた後の動き」（front matter の表、history の出力、check の検査 5〜7、front matter の読み方）、「変わらない振る舞い」、「互換性」、「変換の手順」の migrate の表と読み取りの規則、「実装 PR で直す文書」の spec-ids の部分、「人が判断すること」Q18〜Q31
2. README・CHANGELOG・docs/operations.md
3. src/*.mjs・bin/spec-ids.mjs・test/*.test.mjs・test/helpers.mjs（fixture の作り方）
4. migrate の読み取りの規則の元になる、利用側の今の形（読むだけ）: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp と houki-nta-mcp の specs/current/*/spec.md の冒頭の行、specs/releases/*/*/proposal.md の冒頭の行。houki-abbreviations の作業コピーの同じもの（場所が分からなければ私に聞く）

## 実装するもの

- src/ に front matter の読み取り（設計の「front matter の読み方」の書式だけ。依存パッケージは足さない）と、Node の API の readFrontMatter
- spec-ids check に検査 5〜7。出力の 2 行目に proposals: の行。check() の戻り値に changesProposals・releasesProposals・frontMatter[]・missingTargets[]・legacyLines[] を足し、既存のキーは変えない
- spec-ids history <dir>（--json・--all）。出力の形は設計の get_toc の例のとおり
- spec-ids migrate（なし・--json・--write）。読み取りの規則と、食い違いがあれば exit 1・--write は食い違いが無いときだけ書く、のとおり。0.4.0 で外す旨をコードのコメントと CHANGELOG に書く
- bin の USAGE、README（「実装 PR で直す文書」の README の行）、CHANGELOG 0.3.0（「互換性」の節）、package.json の版
- templates/agents-section.md は変えない（Q30）。docs/operations.md も変えない（後の docs の PR）

## 守ること

- テストは設計の表と例から先に書き（test: のコミット）、落ちることを確かめてから実装する（feat: のコミット）。テストの名前に設計の節か検査の番号を入れる（spec-ids には仕様 ID が無いので、たとえば「検査 6 targets の漏れ: …」）
- fixture は test/helpers.mjs の作り方で一時ディレクトリに書く。利用側のリポジトリのファイルをテストから読まない
- 0.2.0 の 4 つの検査の結果と出力の行が変わらないことを、既存のテストで確かめる（既存のテストの期待値を変えるのは、出力の行が 1 行増える箇所だけ）
- 依存パッケージを足さない。Biome（npm run lint・npm run format:check）を通す
- 設計の文と例から外れたくなったら、止めて私に聞く（案を並べ、勧める案を 1 つ書く）。設計に書いていない細部（関数の分け方、エラーの文の言い回し、JSON のキーの並び）は決めてよく、報告の「実装で決めたこと」に書く
- コミットを作るところまで。署名・push・PR・マージ・タグ・publish は私が行う。git を使う前に spec-ids フォルダーの削除の許可を取る。VM の git には GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）。npm install・npm rebuild はしない（node_modules は Mac と共有）

## 検証

- npm test（node:test）、npm run lint、npm run format:check を VM で回せれば回し、回せなければ私が Mac で回すコマンドを書く
- 実データでの確かめ（書き換えない）: houki-egov-mcp の作業コピーで node <spec-ids の作業コピー>/bin/spec-ids.mjs migrate と migrate --json を実行し、食い違いが 0 件で、設計の「確かめた値」の件数（egov は current 20 本・proposal.md 16 本）と合うことを確かめる。--write はしない。houki-nta-mcp と houki-abbreviations でも migrate（なし）を実行し、設計の前直し F1〜F4 だけが食い違いとして出ることを確かめる。nta では specs/changes/20261009-inspect-pdf-meta-qa-jirei/ も食い違い（targets が空）として出る見込み（設計の「変換の時期」）
- 結果を報告に貼る

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 足したテストの数と、設計の節・検査ごとの対応
- npm test・lint・format:check の結果（または Mac で回すコマンド）
- 実データでの migrate の結果（3 リポジトリ）
- 実装で決めたこと、止めて聞いたことと答え
- CHANGELOG 0.3.0 の文
- PR 本文の草案（Refs #5、設計 PR #6 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
- 3 リポジトリの変換の PR に渡すこと（とくに設計の「確かめていない点」1・4）
```

---

## 指示 CE: houki-egov-mcp の変換の PR（spec-ids 0.3.0、承認の記録を front matter へ）

spec-ids 0.3.0（PR #7、main・タグ `v0.3.0` `c82c0b4`、npm の latest 0.3.0 は 2026-10-09 14:49 JST）の publish の後に、新しい会話に貼ります。設計 `docs/proposals/20261009-approval-front-matter.md` の「変換の手順」の 1 つ目のリポジトリで、前直しはありません。2026-10-09 JST に、houki-egov-mcp の origin の main が `326006f` で `specs/changes/` が `.gitkeep` だけであることを確かめました。

設計の「確かめていない点」1（変換の PR の CI が PR のブランチの `check-pr-scope.mjs` を動かすか）は、houki-egov-mcp の `ci.yml` の `pr-scope` ジョブが `pull_request` の既定の checkout（PR をマージした形のコミット）で `node .github/scripts/check-pr-scope.mjs` を動かすので、PR のブランチの版が動きます（2026-10-09 JST に `ci.yml` を読んで確かめた。CI の実行では確かめていない）。

```text
houki-egov-mcp の specs/ を spec-ids 0.3.0 の形（承認の記録を front matter に書く）に変換する PR を作ってください。この会話の役は、変換を行う作業者です。仕様の意図（ID の付いた本文）は変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-egov-mcp）
- 起点: main の 326006f。作業の前に git ls-remote https://github.com/shuji-bonji/houki-egov-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ が .gitkeep だけであることを確かめる
- ブランチ: chore/<作業日の yyyymmdd>-approval-front-matter（pr-scope の「実装 PR」に当たる形。設計の「互換性」）
- 使う spec-ids: /Users/bonji/workspace/shuji-bonji/spec-ids の作業コピー（$HOME/mnt/spec-ids。タグ v0.3.0 の c82c0b4 であることを確かめる）の bin/spec-ids.mjs。VM から npm の registry に届かないので、node_modules の spec-ids は 0.2.0 のまま使わない
- 版: houki-egov-mcp の版は上げず、publish もしない（実行時の振る舞いは変わらないため）。CHANGELOG に書くかは、devDependencies だけを変えたときの今までの慣習に合わせ、報告に書く

## 最初に読むもの（この順）

1. spec-ids の docs/proposals/20261009-approval-front-matter.md の全文。とくに「変えた後の動き」の front matter の表と pr-scope の判定、「互換性」の「3 リポジトリで何がいつ変わるか」、「変換の手順」（migrate の動きと読み取りの規則、前後の一致の確かめ方）、「実装 PR で直す文書」の「各リポジトリの変換の PR で直すもの」
2. spec-ids の README と CHANGELOG 0.3.0（readFrontMatter の使い方、history・migrate のオプション）
3. houki-egov-mcp の AGENTS.md・CONTRIBUTING.md、.github/workflows/ci.yml、.github/scripts/check-pr-scope.mjs と check-pr-scope.test.mjs

## コミットの順（1 本の PR に入れる。途中のコミットで CI が通らなくてよいが、最後のコミットで通ること）

1. chore: package.json の @shuji-bonji/spec-ids を ^0.3.0 にする。package-lock.json は VM では更新できないので、私が Mac で実行するコマンド（npm install -D @shuji-bonji/spec-ids@^0.3.0）を報告に書き、私が同じブランチにコミットを足す
2. chore: specs/ を変換する。手順は設計の「前後の一致の確かめ方」のとおり:
   - node $HOME/mnt/spec-ids/bin/spec-ids.mjs migrate（食い違いが 0 件であることを確かめる）
   - … migrate --json > <VM の作業用のフォルダー>/before.json
   - … migrate --write
   - … history --all --json > <同>/after.json
   - before と after を機能ごとに「初版の承認」と「(差分 ID, 承認日, PR) の集合」に直して比べるスクリプトを書き（リポジトリには入れない）、一致を確かめる。一致しなければ git checkout -- specs/ で戻して止め、私に聞く
   - … check が通ることを確かめる
3. ci: .github/scripts/check-pr-scope.mjs の 3 つの判定（APPROVAL_RE・PR_NUMBER_RE・NO_IMPL_RE）を、設計の「pr-scope の判定」のとおり front matter の判定に替える。読み取りは @shuji-bonji/spec-ids の readFrontMatter を import する（処理を書き写さない）。エラーの文と先頭のコメントも直す。check-pr-scope.test.mjs の fixture と期待値を front matter の形にし、node --test .github/scripts/check-pr-scope.test.mjs を通す
4. docs: AGENTS.md の承認日と Publisher の手順（32 行目付近の「承認日は…」、Spec Publisher の行）を、設計の「変えた後の動き」に合わせて直す（仕様 PR では proposal.md の front matter の approved・pr を書く、取り込みで current に承認を書き足さない、履歴は spec-ids history で見る）。CONTRIBUTING.md などほかに「承認日」を書いている文書があれば同じく直す（grep -rn "承認日" --include=*.md . で、specs/ と node_modules を除く）

## 守ること

- specs/ の書き換えは migrate --write だけで行い、手で直さない。migrate が食い違いを出したら止めて私に聞く（egov は設計の「確かめた値」で前直しが要らないことになっている）
- ID の付いた見出しと本文、テスト、src/ は変えない
- 前後の一致を比べたスクリプトと、その出力（一致した機能の数と行の数）は PR 本文に貼る（設計の「比べるスクリプトは spec-ids に入れず、変換の PR の本文に貼る」）
- 設計の「確かめていない点」3・4 を、この PR で分かる範囲で確かめる（4: Biome などの整形・検査が front matter のある spec.md に何かを言うか。npm run lint・npm run format:check を VM で回せれば回し、回せなければ私が Mac で回すコマンドを書く）
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る（この文書の「共通: Cowork の VM で作業するときの注意」と同じ。VM の git の名前とメールも同じ）。npm install・npm rebuild はしない

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）と、私が Mac で足すコミット（package-lock.json）のコマンド
- migrate の結果（current の本数・proposal.md の本数・食い違いの件数）、前後の一致の結果、spec-ids check の出力
- check-pr-scope の変更点と、テストの結果
- AGENTS.md などで直した箇所
- 設計の「確かめていない点」3・4 で分かったこと
- houki-nta-mcp・houki-abbreviations の変換に渡すこと（egov で手順を回して分かった落とし穴）
- Issue の草案（houki-egov-mcp に立てる。題: 「specs/ の承認の記録を spec-ids 0.3.0 の front matter に移す」。本文に spec-ids#5・設計 PR #6・実装 PR #7 へのリンク）と、PR 本文の草案（Closes <その Issue>、Refs shuji-bonji/spec-ids#5。前後の比較のスクリプトと出力を含む。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 CN と CA の前に: egov の変換（指示 CE）で分かったこと

houki-egov-mcp の変換は PR #117（main `0cadfe8`、Closes #116）で済みました。nta・abbr に渡すことは次のとおりです。

1. `check-pr-scope.mjs` が `readFrontMatter` を import するので、`ci.yml` の `pr-scope` ジョブに `npm ci` が要る。nta・abbr の `pr-scope` ジョブにも `npm ci` が無い（2026-10-09 JST に `ci.yml` を読んで確かめた）
2. 前後の一致は 2 通りで比べる。A: `migrate --json` と `history --all --json`、B: 変換の前のコミットの本文（`git show`）と releases の `specs/<dir>/` を migrate を通さずに読んだ値と `history --all --json`。比べるスクリプト `compare-approvals.mjs` は egov の PR #117 の本文にある
3. `package-lock.json` は Mac で `npm install -D @shuji-bonji/spec-ids@^0.3.0` を実行して足す
4. egov では Biome の対象が `src` だけで、specs/ は検査の外だった。nta の `biome.json` も `src/**` などで同じ形。abbr は eslint・prettier で、npm scripts は `src` だけ

nta に固有の点: **nta の変換の PR は、今の `pr-scope` の規則に当たる。** `specs/changes/20261009-inspect-pdf-meta-qa-jirei/proposal.md` が残っていて（計画書の Q22' の案 A）、`migrate --write` はこの proposal.md も書き換える。nta の `check-pr-scope.mjs` は、実装 PR（`spec/`・`spec-init/` 以外のブランチ）で `specs/changes/` を変えることを、`specs/releases/` への移動を除いて止める（「仕様 PR の外で specs/changes/ を変えています」）。扱いは計画書の Q23' で決める。

---

## 指示 CN: houki-nta-mcp の変換の PR（前直し F1・F2・F5）

計画書の Q23' を決めてから貼ります。下の文は Q23' が勧める案 A（`pr-scope` に変換の書き換えだけを通す例外を足す）のときの形です。

2026-10-09 JST に、houki-nta-mcp の origin の main が `c75e86a` で、`specs/changes/` に `20261009-inspect-pdf-meta-qa-jirei/` があることを確かめました。

```text
houki-nta-mcp の specs/ を spec-ids 0.3.0 の形（承認の記録を front matter に書く）に変換する PR を作ってください。この会話の役は、変換を行う作業者です。仕様の意図（ID の付いた本文）は変えません。houki-egov-mcp で同じ変換を済ませています（PR #117）。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の c75e86a。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に 20261009-inspect-pdf-meta-qa-jirei/ だけがあることを確かめる
- ブランチ: chore/<作業日の yyyymmdd>-approval-front-matter
- 使う spec-ids: /Users/bonji/workspace/shuji-bonji/spec-ids の作業コピー（$HOME/mnt/spec-ids。タグ v0.3.0 であることを確かめる）の bin/spec-ids.mjs
- 版: 上げず、publish もしない

## 最初に読むもの（この順）

1. spec-ids の docs/proposals/20261009-approval-front-matter.md。とくに「変換の手順」の前直しの表（F1・F2）と「変換の時期」
2. houki-egov-mcp の PR #117 の本文（curl https://api.github.com/repos/shuji-bonji/houki-egov-mcp/pulls/117）。コミットの分け方、比べるスクリプト compare-approvals.mjs、pr-scope の変更、ci.yml の npm ci
3. houki-egov-mcp の main の .github/scripts/check-pr-scope.mjs と check-pr-scope.test.mjs（$HOME/mnt/houki-hub/mcp/houki-egov-mcp。変換後の形の手本）
4. houki-hub の docs/notes/2026-10-04-plan-stage6-and-followups.md の Q22'（F5）と Q23'
5. houki-nta-mcp の AGENTS.md・CONTRIBUTING.md、.github/workflows/ci.yml、.github/scripts/check-pr-scope.mjs と test

## コミットの順（1 本の PR）

1. docs(specs): 前直し F1・F2・F5（古い形のまま、手で直す。1 件 1 コミットでもよい）
   - F1: 差分 20260930-cli-db-undecided-to-issues（PR #114）を、db_schema・cli_entry・cli_bulk_download・cli_refresh・cli_health_check の 5 本の current の「- 承認日:」の行に「差分 `20260930-cli-db-undecided-to-issues` は 2026-09-30（PR #114）」として足す（設計の F1。コミット 099b6ce が変えた 5 本と同じことを git show で確かめる）
   - F2: specs/releases の 20260924-tsutatsu-clause-forms/proposal.md に「- 承認日: 2026-09-24（PR #53）」と「- 実装の変更: 要」を足す（設計の F2）
   - F5: 差分 20261009-inspect-pdf-meta-qa-jirei（PR #157）を、specs/current/nta_inspect_pdf_meta/spec.md と specs/current/db_schema/spec.md の「- 承認日:」の行に「差分 `20261009-inspect-pdf-meta-qa-jirei` は 2026-10-09（PR #157）」として足す（計画書の Q22'）。差分のフォルダーは specs/changes/ に残す
   - 前直しの後に node $HOME/mnt/spec-ids/bin/spec-ids.mjs migrate を実行し、食い違いが 0 件になることを確かめる。残れば止めて私に聞く
2. chore: package.json の @shuji-bonji/spec-ids を ^0.3.0 にする（package-lock.json は私が Mac で足す）
3. chore: specs/ を migrate --write で変換する。egov と同じく、変換の前のコミットを控え、compare-approvals.mjs の A・B の 2 通りで前後の一致を確かめ、spec-ids check を通す
4. ci: check-pr-scope.mjs を egov と同じ形で front matter の判定に替え、テストを直し、ci.yml の pr-scope ジョブに npm ci を足す。加えて Q23' の案 A の例外を足す: 実装 PR で specs/changes/<id>/proposal.md を変えていても、その差分が「先頭に front matter の行を足す」「「- 承認日:」「- 実装の変更:」で始まる行を消す」「「- 実装の変更の補足:」で始まる行を足す」だけなら止めない（変換の書き換え）。それ以外の行の変更は今までどおり止める。テストに、通る場合と止める場合（本文の行を変えた proposal.md）を足す。コードのコメントに「spec-ids migrate の変換のための例外。pr-scope を spec-ids に取り込むとき（spec-ids#5 の後の版）に外す」と書く
5. docs: AGENTS.md（31 行目付近の承認日の文と Spec Publisher の手順）を egov の PR #117 と同じ形に直す。CONTRIBUTING.md などほかに「承認日」があれば同じく直す（specs/ と node_modules を除いて grep）

## 守ること

- specs/ の書き換えは、前直し（手で、古い形のまま）と migrate --write だけで行う。変換の後の specs/ を手で直さない
- ID の付いた見出しと本文、テスト（.github/scripts の pr-scope のテストを除く）、src/ は変えない
- このブランチを新しい pr-scope に通し（BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs）、OK になることを確かめる
- 比べるスクリプトと出力は PR 本文に貼る
- 設計の Q23'（pr-scope の例外）が私の答えと違っていたら、4 の例外の部分はその答えに合わせる
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る（この文書の「共通」と同じ）。npm install・npm rebuild はしない

## 終わったら報告すること

- コミットの一覧、私が Mac で足すコミット（package-lock.json）のコマンド
- 前直しの前後の migrate の結果、変換の結果、前後の一致（A・B）、spec-ids check の出力
- pr-scope の変更点（例外を含む）とテストの結果、このブランチを通した結果
- AGENTS.md などで直した箇所
- houki-abbreviations の変換に渡すこと
- Issue の草案（houki-nta-mcp に立てる。題と本文は egov の #116 と同じ形）と PR 本文の草案（Closes <その Issue>、Refs shuji-bonji/spec-ids#5、Refs #156（F5 で current の行に足したこと。#156 は 0.27.0 で閉じる）。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 CA: houki-abbreviations の変換の PR（前直し F3・F4）

nta の変換（PR #159、main `9ed0832`、Closes #158）で分かったことを入れて直しました（2026-10-09 JST）。2026-10-09 JST に、houki-abbreviations の origin の main が `50bd63b` で `specs/changes/` が `.gitkeep` だけであることを確かめました。abbr は `specs/changes/` が空なので、Q23' の例外には当たりません。

```text
houki-abbreviations の specs/ を spec-ids 0.3.0 の形（承認の記録を front matter に書く）に変換する PR を作ってください。この会話の役は、変換を行う作業者です。仕様の意図（ID の付いた本文）は変えません。houki-egov-mcp（PR #117）と houki-nta-mcp で同じ変換を済ませています。

## 場所

- リポジトリ: houki-hub の lib/houki-abbreviations（/Users/bonji/workspace/shuji-bonji/houki-hub/lib/houki-abbreviations、Cowork の device_bash では $HOME/mnt/houki-hub/lib/houki-abbreviations）
- 起点: main の 50bd63b。作業の前に git ls-remote https://github.com/shuji-bonji/houki-abbreviations refs/heads/main で origin と同じか確かめ、specs/changes/ が .gitkeep だけであることを確かめる
- ブランチ: chore/<作業日の yyyymmdd>-approval-front-matter
- 使う spec-ids: $HOME/mnt/spec-ids の作業コピー（v0.3.0）の bin/spec-ids.mjs
- 版: 上げず、publish もしない

## 最初に読むもの（この順）

1. spec-ids の docs/proposals/20261009-approval-front-matter.md の「変換の手順」の前直しの表（F3・F4）
2. houki-egov-mcp の PR #117 と houki-nta-mcp の PR #159 の本文（curl https://api.github.com/repos/shuji-bonji/houki-nta-mcp/pulls/159）。比べるスクリプト compare-approvals.mjs は nta の版（初版と差分が同じ PR の行、差分で作った機能の行を読み、新設の差分を差分の集合から外す）を出発点にする
3. houki-egov-mcp の main の .github/scripts/check-pr-scope.mjs と test（手本）
4. houki-abbreviations の AGENTS.md・CONTRIBUTING.md、.github/workflows/ci.yml と spec-gate.yml、.github/scripts/check-pr-scope.mjs と test

## コミットの順（1 本の PR）

1. docs(specs): 前直し F3・F4（古い形のまま）
   - F3: 差分 20260927-untested-behaviors の PR 番号を、current の 22 本の行で #28 から #27 に直す（設計の Q28。#27 が仕様 PR、#28 は受入テストの PR）
   - F4: current の 23 本の初版を「2026-09-27（PR #10）」に戻し、「差分 `20260927-undecided-to-issues` は 2026-09-27（PR #26）」を足す（設計の Q29。コミット 151d255 が初版の PR 番号を書き換えていたことを git show で確かめる）
   - 前直しの後に migrate を実行し、食い違いが 0 件になることを確かめる
2. chore: package.json の @shuji-bonji/spec-ids を ^0.3.0 にする（package-lock.json は私が Mac で足す）
3. chore: migrate --write で変換し、A・B の 2 通りで前後の一致を確かめ、spec-ids check を通す。B の読み取りが abbr の「- 承認日:」の行の書き方（前直しの後の F3・F4 の形を含む）を読めるかを先に確かめ、読めない書き方があればスクリプトに足して PR 本文に書く。after.json を壊して不一致が出ることも確かめる
4. ci: check-pr-scope.mjs の 3 つの判定を egov・nta と同じく front matter の判定に替え（readFrontMatter を import）、テストを直し、ci.yml の pr-scope ジョブに npm ci（と cache: npm）を足す。nta で足した specs/changes/ の変換の例外（Q23'）は入れない（abbr は specs/changes/ が空で当たらない。egov のコピーにも無い）。egov と nta のコピーは、もともと .gitkeep の除外などで違いがあるので、3 つを同じにするのは pr-scope を spec-ids に取り込むとき（Q20）に行う。abbr のコピーと egov・nta のコピーの違いを報告に書く
5. docs: AGENTS.md（32 行目付近）と、ほかに「承認日」を書いている文書を直す

## 守ること・報告すること

- 指示 CN と同じ（specs/ の書き換えは前直しと migrate --write だけ、ID の付いた本文・テスト・src/ は変えない、このブランチを新しい pr-scope に通す、比べるスクリプトと出力は PR 本文に、コミットまで、VM の注意）
- 報告: コミットの一覧と Mac で足すコマンド、前直しの前後の migrate、変換の結果、前後の一致、spec-ids check、pr-scope の変更とテスト、Issue の草案（houki-abbreviations に立てる）と PR 本文の草案（Closes <その Issue>、Refs shuji-bonji/spec-ids#5。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、spec-ids の docs の PR（docs/operations.md）に渡すこと
```

---

## 指示 D5: spec-ids の docs の PR（docs/operations.md）と、次の 2 件の Issue の草案

3 リポジトリの変換（egov PR #117・nta PR #159・abbr PR #38）が済んだ後に、新しい会話に貼ります。設計 `docs/proposals/20261009-approval-front-matter.md` の「実装 PR で直す文書」のうち「実装 PR の後の docs の PR で直すもの」を行い、spec-ids#5 を閉じます。あわせて、#5 の後に回した 2 件（spec-ids 自身の `specs/`、`pr-scope` の取り込み）の Issue の草案を書きます。2026-10-09 JST に、spec-ids の origin の main が `c82c0b4`（v0.3.0）であることを確かめました。

```text
spec-ids の docs/operations.md を 0.3.0（承認の記録を front matter に書く）に合わせる docs の PR を作ってください。あわせて、spec-ids に立てる Issue 2 件の草案を書きます。この会話の役は、文書を直す作業者です。src/・test/ は変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/spec-ids（Cowork の device_bash では $HOME/mnt/spec-ids）
- 起点: main の c82c0b4（v0.3.0）。作業の前に git ls-remote https://github.com/shuji-bonji/spec-ids refs/heads/main で origin と同じか確かめる
- ブランチ: docs/<作業日の yyyymmdd>-operations-front-matter
- 版: 上げない（文書だけ）。未追跡の「Claude outputs/」は触らない

## 最初に読むもの（この順）

1. docs/proposals/20261009-approval-front-matter.md の「実装 PR で直す文書」の「実装 PR の後の docs の PR で直すもの」の表（1.2・2.1・2.2・3・3.2・4・6 章 Steward・6 章 Publisher・7 章・9 章・10 章）と「この差分の外で見つけたこと」
2. docs/operations.md の全文、README、CHANGELOG 0.3.0
3. 3 リポジトリの変換の PR の本文（curl で読む）: https://api.github.com/repos/shuji-bonji/houki-egov-mcp/pulls/117、.../houki-nta-mcp/pulls/159、.../houki-abbreviations/pulls/38。とくに abbr の PR #38 の「3 つのコピーの違い」の表と、nta の PR #159 の Q23' の例外
4. 変換後の利用側の AGENTS.md（読むだけ）: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp/AGENTS.md ほか。operations.md の文と食い違わないようにする

## 直すこと

- 設計の表のとおりに docs/operations.md を直す。7 章（起きたこと）には、abbr の 151d255 の一括書き換え（設計の「この差分の外で見つけたこと」2 つ目）と、変換で見つかった食い違い（50 件中 20 件、前直し F1〜F5）を 1〜2 行で足す。F5 は houki-hub の計画書の Q22'（nta の #156 の差分を current の行に足してから変換した）
- 5 章（差分の書き方）と実際の書き方の食い違い（ID の無い節の直しを proposal.md の「取り込みのとき」に文章で書く書き方が nta 9 件・egov 2 件ある。設計の「この差分の外で見つけたこと」1 つ目）は、targets がどちらも受け付けることを書き足すにとどめ、どちらに寄せるかは「人が判断すること」として PR 本文に並べる（勧める案を 1 つ書く）
- 9 章（導入）と 10 章: pr-scope は今は 3 リポジトリのコピーで、readFrontMatter を import するので pr-scope ジョブに npm ci が要ることを書く。spec-ids に取り込む予定（下の Issue 草案 2）を書く
- README に、変換が 3 リポジトリで済んだことを書く必要があるかを確かめ、要るなら直す（migrate を 0.4.0 で外す予定の文はそのまま）

## Issue の草案（docs/ ではなく報告の本文に書く。投稿は私が行う）

1. 「spec-ids 自身の仕様を specs/ に置く（初版起こし）」: houki-hub の計画書の Q21 の案 A'。最初から front matter の形で書く。spec-gate は作業ツリーの bin ではなく、1 つ前に publish した版（npx -y @shuji-bonji/spec-ids@<前の版> check）で回す理由（自分の check の不具合が自分の検査を素通りさせない）。check の正しさは今までどおり test/*.test.mjs（check を使わない fixture のテスト）で守る。対象の機能の候補（check・next・init・history・migrate・format・config・frontmatter など、dir の切り方は Issue の「決めること」にする）
2. 「pr-scope を spec-ids のサブコマンドとして取り込む（spec-ids pr-scope）」: 設計の Q20。3 つのコピーの違い（abbr の PR #38 の表: onlyIdsAdded の判定、.gitkeep の除外、取り込み済み差分の specs/changes/ の残りを消すこと、nta の変換の例外、テストの件数）をどちらにそろえるかを「決めること」に並べる。nta の変換の例外（Q23'）はこのときに外す。migrate を外す 0.4.0 と同じ版にするかも「決めること」にする

## 守ること・報告すること

- docs/operations.md と（要れば）README だけを変える。docs/proposals/ の設計の文書は書き換えない（承認済みの記録）
- 文は「〜します」「〜です」。実在の PR 番号・コミット・件数で書く
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に spec-ids フォルダーの削除の許可を取る。VM の git の名前とメールは houki-hub の指示書の「共通」と同じ
- 報告: ブランチ・コミット、直した節の一覧、PR 本文の草案（Closes #5。3 リポジトリの変換の PR へのリンク、「人が判断すること」（5 章の書き方）。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、Issue の草案 2 件
```

---

## 指示 Q27: houki-nta-mcp 0.27.0 の仕様 PR（#154・#155、front matter の形で書く最初の仕様 PR）

spec-ids#5 が閉じた後（spec-ids PR #10、main `0b626cc`）に、新しい会話に貼ります。houki-nta-mcp で、承認の記録を front matter に書く形になってから最初の仕様 PR です。下の出発点は計画書の Q24'（spec-ids の D1）が勧める案 A のときの形です。2026-10-09 JST に、houki-nta-mcp の origin の main が `9ed0832` で、`specs/changes/` に `20261009-inspect-pdf-meta-qa-jirei/`（#156、front matter に変換済み、`implementation: none`）だけがあることを確かめました。

```text
houki-nta-mcp 0.27.0（#154 置き場所のフォルダーに入る権限が無いときの DB の判定、#155 GET-TSUTATSU-007 が実行できないコマンドを案内する）の仕様 PR を書いてください。この会話の役は Spec Steward です（AGENTS.md の「役割」）。実装・テストは書きません。承認の記録を front matter に書く形（spec-ids 0.3.0）になってから最初の仕様 PR です。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の 9ed0832。git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に 20261009-inspect-pdf-meta-qa-jirei/ だけがあることを確かめる（この差分は触らない。0.27.0 の実装 PR で releases へ移す）
- ブランチ: spec/<作業日の yyyymmdd>-db-folder-access-and-tsutatsu-guide
- npx spec-ids は node_modules の 0.3.0 を使う（package-lock.json が 0.3.0）。VM で動かなければ $HOME/mnt/spec-ids/bin/spec-ids.mjs を使う

## 最初に読むもの（この順）

1. AGENTS.md（変換後の承認の記録の書き方）と CONTRIBUTING.md
2. spec-ids の docs/operations.md（PR #10 の後。3.2「承認の記録」と 5 章「差分の書き方」）と README の front matter の表
3. Issue #154・#155 の本文（curl https://api.github.com/repos/shuji-bonji/houki-nta-mcp/issues/154 と /155）
4. specs/releases/v0.26.0/20261006-db-failure-paths/proposal.md の「人が判断すること」10 と「この差分の外で見つけたこと」1・2（#154・#155 の出所）
5. specs/changes/20261009-inspect-pdf-meta-qa-jirei/proposal.md の「この差分の外で見つけたこと」（とくに 4: search_rules の docId の説明）
6. specs/current の db_schema（021・029・030、probeDbState の判定）、cli_status（004・007）、cli_bulk_download（011。--tsutatsu が受け付ける値）、nta_get_tsutatsu（007・010）、search_rules（docId の説明）
7. src/db/index.ts の probeDbState、src/tools/handlers.ts の getTsutatsu の 007 の枝、src/cli.ts の --tsutatsu の値の検査

## 出発点（勧める案。proposal.md の「人が判断すること」に書いて承認を受ける）

- #154: 置き場所のフォルダー（またはパスの途中のフォルダー）に入る権限が無いときは、statSync の EACCES を見て「開けない」（unopenable）と判定する。読むだけのツールは 029 の開けないときの応答（DOC_NOT_FOUND / TSUTATSU_NOT_FOUND と開けないときの hint）、書き戻す 3 ツールは 030 の動き、--status は [ERROR] DB を開けません と終了コード 1（CLI-STATUS-007 の側に入る。004 の「DB が無い」から外れる）、投入のフラグは今のまま（終了コード 1）。入口の扱いがそろう。--status の終了コードが変わるので 0.27.0（minor）。ほかの案（今のまま、または --status だけを変える）を並べる
- #155: 案 A。GET-TSUTATSU-007 で、--tsutatsu が受け付けない通達（基本通達 4 種以外）には cli_bulk_download の案内を付けず、hint で「この通達は今は取り込めない」こと（取り込めるのは --tsutatsu の 4 種）を書く。next_actions は今の 007 の形から cli_bulk_download を外す（残りが無ければ消す）。基本通達 4 種の案内は今のまま。案 B（--tsutatsu に対応する通達を増やす）は #116（範囲の検討。計画の外）に当たるので並べるだけにする。DB-SCHEMA-027 の表の該当行も直す
- 同じ差分に入れる仕様の文の直し: search_rules の docId の説明（「nta_inspect_pdf_meta にそのまま渡せる。例: 質疑応答事例は shohi/02/19」）を、nta_inspect_pdf_meta に渡せるのは 4 つの種別だけ、に直す（#156 の差分の「この差分の外で見つけたこと」4）
- ID の無い節（## 未決、処理の流れの図など）を直すときは、差分の spec.md にその節を見出しの単位で書く（spec-ids の D1 の案 A。proposal.md の「取り込みのとき」に文章で書かない）
- 実装 PR に渡すもの（proposal.md の「実装の変更」に書く）: (1) #156 の差分のフォルダーを specs/releases/v0.27.0/ へ移し、実装 PR に Closes #156 を書く。(2) 受入テストの 3 か所が nta_inspect_pdf_meta を docType: 'qa-jirei' で直接呼んでいる（#156 の差分の「この差分の外で見つけたこと」1）。4 つの値のどれかに置き換えるか外す。(3) LEGAL_STATUS_BY_DOCTYPE の qa-jirei の項と handleNtaInspectPdfMetaInner のコメント（同 2）を消すか

## 守ること・報告すること

- specs/changes/<yyyymmdd-slug>/ の下だけを書く。新しい仕様 ID は npx spec-ids next <dir>
- proposal.md の先頭に front matter を書く: implementation: required、targets: [<この差分が書き換える specs/current の dir をすべて>]、approved: と pr: は空（私がマージの前に書く）。本文に「- 承認日:」の行は書かない（spec-ids check の検査 7 が止める）。targets には、差分の specs/<dir>/spec.md を置く dir と、ID の無い節を直す dir をすべて入れる
- proposal.md の節は v0.26.0 の proposal.md と同じ並び（なぜ変えるか・今の動き・変えた後の動き・変わる仕様 ID・変わらない振る舞い・互換性・呼び出し例への影響・実装 PR で直す文書・実装の変更・publish の前の確認・取り込みのとき・人が判断すること・確かめた値・確かめていない点・この差分の外で見つけたこと）
- 「取り込みのとき（Publisher）」には、current に承認を書き足さないこと（spec-ids 0.3.0 の運用）と、#156 の差分も同じ実装 PR で releases へ移すことを書く
- npx spec-ids check と BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す（pr-scope は approved・pr の空欄だけで止まることを確かめる）
- コミットを作るところまで。署名・push・PR・マージは私が行う。VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ
- 報告: ブランチ・コミット、ADDED / MODIFIED / REMOVED の数と targets、spec-ids check と pr-scope の結果、「人が判断すること」の一覧（勧める案つき）、PR 本文の草案（Refs #154 #155。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）、実装 PR に渡すこと、front matter の形で仕様 PR を書いて気付いたこと（spec-ids や AGENTS.md の文の分かりにくさなど）
```

---

## 指示 R27: houki-nta-mcp 0.27.0 の実装 PR（#154・#155、#156 を閉じる）

仕様 PR #160（差分 `20261009-db-folder-access-and-tsutatsu-guide`、main `a2a9e5f`、front matter の `approved: 2026-10-09`・`pr: 160`）のマージの後に、新しい会話に貼ります。2026-10-09 JST に、origin の main が `a2a9e5f` で、`specs/changes/` に `20261009-db-folder-access-and-tsutatsu-guide` と `20261009-inspect-pdf-meta-qa-jirei`（#156）の 2 つがあることを確かめました。差分は MODIFIED 9（ADDED・REMOVED なし）、targets は cli_status・common_errors・db_schema・nta_get_tsutatsu・search_rules です。「人が判断すること」1〜14 は勧める案で承認されています（11 は出発点に無く仕様 PR で足した点: 007 は DB の状態によらず同じ応答）。

```text
houki-nta-mcp 0.27.0（#154 置き場所のフォルダーに入る権限が無い DB を「開けない」にそろえる、#155 取り込めない通達に投入を案内しない）の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR #160 は承認・マージ済みで、この会話では仕様の意図を変えません。承認の記録を front matter に書く形（spec-ids 0.3.0）になってから最初の実装 PR です。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の a2a9e5f。作業の前に git ls-remote https://github.com/shuji-bonji/houki-nta-mcp refs/heads/main で origin と同じか確かめ、specs/changes/ に上の 2 つの差分があることを確かめる
- ブランチ: feat/<作業日の yyyymmdd>-0.27.0
- 版: 0.26.0 → 0.27.0（minor）。DB のスキーマの版は 12 のまま
- この PR で閉じる Issue: #154・#155・#156

## 最初に読むもの（この順）

1. AGENTS.md（「承認の記録」と Spec Publisher の手順。spec-ids 0.3.0 の形）と CONTRIBUTING.md
2. specs/changes/20261009-db-folder-access-and-tsutatsu-guide/proposal.md と specs/*/spec.md。とくに「実装の変更」「実装 PR で直す文書」「互換性」「publish の前の確認」「取り込みのとき（Publisher）」「人が判断すること」1〜14
3. specs/changes/20261009-inspect-pdf-meta-qa-jirei/proposal.md の「取り込みのとき」
4. 「実装の変更」に挙がった src/ のファイルと既存のテスト（src/tools/handlers.test.ts、src/tools/spec-20261006-db-failure-paths.test.ts、src/tools/spec-20261004-db-location.test.ts）
5. 手本: specs/releases/v0.26.0/ と CHANGELOG.md の 0.26.0（PR #153）

proposal.md に書かれていない細部（関数の分け方、テストの組み立て、後片付けの書き方など）はこの会話で決めてよく、決めたことは報告の「実装で決めたこと」に書く。応答の code・hint・error・retryable・detail・next_actions、warn の行、CLI の [ERROR] の行と終了コードを仕様の文と例から変えたくなったら、止めて私に聞く（案を並べ、勧める案を 1 つ書く）。

## 守ること

- specs/changes/ は書き換えない。specs/current/ への取り込みと releases への移動は最後のコミットでだけ行う
- 取り込みでは、current の spec.md の front matter と本文に承認を書き足さない（spec-ids 0.3.0 の運用）。2 つの差分のフォルダーを specs/releases/v0.27.0/ へ git mv し、それぞれの proposal.md の「状態」を「取り込みのとき」の文にする。移した後、specs/changes/ が .gitkeep だけであること、npx spec-ids check と pr-scope が通ること、npx spec-ids history db_schema と history nta_inspect_pdf_meta にこの 2 つの差分が v0.27.0 で出ることを確かめる
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる。テストを消して GREEN にしない（人が判断すること 12 の qa-jirei の 3 か所を A で置き換えるのは、最初の test: のコミットで理由を書いて行う）
- chmod を使うテストは root で走るときに飛ばし、後片付けで権限を戻す
- 応答のフィールドを消す・名前を変える変更はしない（T4）
- TS のコードで文字列を + でつながない（テンプレートリテラル）。公開文書の文は「〜します」「〜です」
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う。VM の注意は、この文書の「共通: Cowork の VM で作業するときの注意」と同じ

## コミットの順（案）

1. test: qa-jirei の 3 か所を tax-answer の 6101 に置き換える（人が判断すること 12）。期待値は変わらず通ることを確かめる
2. test: → feat: probeDbState の EACCES を unopenable にする（DB-SCHEMA-021・029・030、CLI-STATUS-004・007、COMMON-ERRORS-006）
3. test: → feat: GET-TSUTATSU-007 を DB の状態によらず「今は取り込めない」応答にする（GET-TSUTATSU-007、DB-SCHEMA-030、人が判断すること 11）
4. refactor/chore: handleNtaInspectPdfMetaInner のコメントと LEGAL_STATUS_BY_DOCTYPE の qa-jirei の項（人が判断すること 13。項の扱いは型を見て決め、報告に書く）
5. docs: proposal.md の「実装 PR で直す文書」1〜5（README・docs/DATABASE.md）
6. chore: v0.27.0 — package.json・package-lock.json・server.json の版と CHANGELOG（「互換性」の節、Changed に #154・#155）。.claude-plugin/plugin.json は 0.26.0 の慣習に合わせる
7. spec: 2 つの差分を specs/current/ に取り込み、specs/releases/v0.27.0/ へ移す（最後のコミット）

test: のコミットでは新しいテストが落ち、次の feat: で通ることを確かめる。

## 検証

- npm run build・npm test・npm run check（biome）・npx tsc --noEmit・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す。VM では $HOME/tmp/nta に複製して回せることがある
- BASE_REF=main HEAD_REF=<ブランチ> node .github/scripts/check-pr-scope.mjs を通す（実装 PR が specs/changes/ を releases へ移すことは許される）
- proposal.md の「publish の前の確認」1〜8 は私が Mac で行う（公開版の cache.db には触らず、/tmp/nta-027/ の下だけを使う）。手順をそのまま報告に写し、この PR で変わったコマンド名や出力の文があれば直して書く

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check・pr-scope・history の結果
- 実装で決めたこと、止めて聞いたことと答え
- publish の前の確認の手順
- houki-research-skill で直す箇所（proposal.md の「互換性」の Skill の表を main で grep し直して確かめる）と、houki-hub で直すもの（proposal.md の「実装 PR で直す文書」8。呼び出し例は影響なし）
- PR 本文の草案（Closes #154 #155 #156、仕様 PR #160・#157 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
- spec-ids 0.3.0 の形で取り込みを行って気付いたこと（AGENTS.md や spec-ids の文の分かりにくさなど）
```

---

## 指示 D5b: spec-ids の docs の PR（operations.md 5 章、ID の無い節の書き方を決める）

2026-10-09 JST に shuji が計画書の Q24'（spec-ids PR #10 の D1）を案 A に決めました。ID の無い節（`## 未決` など）の直しは、差分の spec.md に節として書く形に寄せます。過去の 11 件（nta 9・egov 2）は書き直しません。houki-nta-mcp の仕様 PR #160 がすでにこの形で書かれています。2026-10-09 JST に、spec-ids の origin の main が `0b626cc` であることを確かめました。R27（nta 0.27.0 の実装 PR）と並行してよい作業です。

```text
spec-ids の docs/operations.md の 5 章（差分の書き方）と 10 章（まだ決まっていないこと）を、決まった書き方に合わせる docs の PR を作ってください。この会話の役は、文書を直す作業者です。src/・test/・docs/proposals/ は変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/spec-ids（Cowork の device_bash では $HOME/mnt/spec-ids）
- 起点: main の 0b626cc。作業の前に git ls-remote https://github.com/shuji-bonji/spec-ids refs/heads/main で origin と同じか確かめる
- ブランチ: docs/<作業日の yyyymmdd>-id-less-sections
- 版: 上げない。未追跡の「Claude outputs/」は触らない

## 決まったこと（2026-10-09 JST、shuji。spec-ids PR #10 の D1 の案 A）

- ID の無い節（## 入力・## できないこと・## 未決・## 処理の流れ など）の直しは、差分の spec.md に節として書く（見出しの単位で、current の同じ見出しの節と置き換える）
- proposal.md の「取り込みのとき（Publisher）」に文章で書く形は、これからの差分では使わない
- 過去の 11 件（取り込み済みのうち houki-nta-mcp の 9 件・houki-egov-mcp の 2 件）は書き直さない
- targets には、差分の spec.md を置いた機能をすべて入れる（ID の無い節だけを直す機能も、差分の specs/<dir>/spec.md を置くので targets に入る）
- 理由: 取り込みが見出し単位の置き換えだけで済み、後で取り込みを機械で行うとき（spec-ids apply などを作るとき）にも扱える。文章で書く形は Publisher の解釈が要る

## 直すこと

1. 5 章: 「ID の無い節の直しは…両方…どちらに寄せるかは決まっていません（10 章）」の段落を、上の決まったことに書き直す。過去の 11 件は文章で書いた形のまま残っていること、targets はその 11 件も含めてどちらの形も受け付けること（spec-ids check の検査 6 は止めない）を 1〜2 文で残す
2. 10 章: 「ID の無い節の直しの書き方（5 章）」の行を外す（決まったため）
3. 6 章の Steward と Publisher の指示文に、ID の無い節を proposal.md に文章で書かないこと（Steward）、差分の spec.md の ID の無い節を current の同じ見出しの節と置き換えること（Publisher）が書かれているかを確かめ、無ければ 1 文ずつ足す
4. 実例として、houki-nta-mcp の仕様 PR #160（差分 20261009-db-folder-access-and-tsutatsu-guide。db_schema の「処理の流れ」と nta_get_tsutatsu の「できないこと」を差分の spec.md に節として書いた）を 5 章に 1 行で挙げる

## 守ること・報告すること

- docs/operations.md だけを変える。文は「〜します」「〜です」
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に spec-ids フォルダーの削除の許可を取る。VM の git の名前とメールは houki-hub の指示書の「共通」と同じ
- 報告: ブランチ・コミット、直した箇所の前後の文、PR 本文の草案（spec-ids PR #10 の D1 を決めたこと、houki-nta-mcp PR #160 への言及。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 XS27: houki-research-skill の houki-nta-mcp 0.27.0 への追随

houki-nta-mcp 0.27.0（PR #161、main・タグ `v0.27.0` `c728de5`、npm 0.27.0 は 2026-10-09 21:19 JST、MCP Registry 登録済み）の publish の後に、新しい会話に貼ります。2026-10-09 JST に、houki-research-skill の origin の main が `4c549d8`（v0.19.1）であることを確かめました。

```text
houki-research-skill を houki-nta-mcp 0.27.0（#154 置き場所のフォルダーに入る権限が無い DB を「開けない」と判定、#155 取り込めない通達に投入を案内しない）に追随させてください。この会話の役は、Skill の文書を直す作業者です。MCP のリポジトリは触りません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/skills/houki-research-skill（device_bash では $HOME/mnt/skills/houki-research-skill）
- 起点: main の 4c549d8（v0.19.1）。作業の前に git ls-remote https://github.com/shuji-bonji/houki-research-skill refs/heads/main で origin と同じか確かめる
- ブランチ: docs/<作業日の yyyymmdd>-nta-0.27.0
- 版: 文書の表と説明を直すだけなら 0.19.2。SKILL.md の手順（エラーの見分け方の表）に行を足して LLM の動きを変えるなら 0.20.0。勧める案は下の 4 を足して 0.20.0（取り込めない通達で、投入を勧めずに通達なしで部分回答する、という動きの変更になるため）。どちらにしたかと理由を報告に書く

## 最初に読むもの（この順）

1. README と CHANGELOG の 0.19.1・0.19.0（直し方と書き方の手本）
2. houki-nta-mcp の specs/releases/v0.27.0/20261009-db-folder-access-and-tsutatsu-guide/proposal.md（$HOME/mnt/houki-hub/mcp/houki-nta-mcp の下）の「互換性」、とくに末尾の「houki-research-skill で関係する箇所」の表（5 行）
3. houki-nta-mcp の specs/current の db_schema（021・029）、cli_status（004・007）、nta_get_tsutatsu（007）と CHANGELOG の 0.27.0

## 直すこと

proposal.md の表の 5 行を出発点にし、main で grep し直して行番号と文を確かめる（表は 2026-10-09 の v0.19.1 の行番号）。

1. skills/houki-research/docs/ERROR-HANDLING.md の hint の先頭の表の「ローカル DB（<パス>）を開けません」の行（93 行目付近）: 開けない場面の列挙に「置き場所のフォルダー（またはパスの途中のフォルダー）に入る権限が無い（houki-nta-mcp v0.27.0 以上）」を足す
2. 同 140 行目付近（--status の開けないとき）: v0.26.x 以前では、置き場所のフォルダーに入る権限が無いと「DB がまだありません」で終了コード 0 になることを足す（勧める案: 足す。v0.26.x 以前を使っている利用者が、投入しても直らない理由に気付けるため）
3. 同 69〜75 行目付近と skills/houki-research/docs/ERROR-CODES.md 78 行目付近: proposal.md のとおり古くならないことを確かめる。直さない
4. skills/houki-research/SKILL.md 260・261 行目付近のエラーの見分け方の表: TSUTATSU_NOT_FOUND で hint が「この通達（…）は、今は取り込めません」で始まるときの行を足す（houki-nta-mcp では基本通達 4 種以外の通達は取れない。投入を勧めず、通達なしで条文と国税庁サイトの案内までで部分回答する。houki-nta-mcp v0.26.x 以前は同じ場面で実行できない --bulk-download --tsutatsu=… を案内していたので、それを実行させない）
5. README の推奨最小バージョンの表: houki-nta-mcp v0.27.0 の 2 つの変更を足す
6. scripts/mcp-refs.config.json の houki-nta-mcp の版を 0.26.0 → 0.27.0 にし、node scripts/update-mcp-snapshots.mjs で mcp-snapshots/houki-nta.json を作り直す（VM から npm の registry に届かないときは、$HOME/mnt/houki-hub/mcp/houki-nta-mcp の dist を使えるか確かめ、使えなければ私が Mac で実行するコマンドを報告に書く）

上のほかに、0.27.0 で古くなった文が無いかを「開けな」「EACCES」「TSUTATSU_NOT_FOUND」「--tsutatsu」「電帳法」で grep し直す（CHANGELOG を除く）。版を書いた実測の記録は書き換えない。

## 守ること

- 文は「〜します」「〜です」。houki-nta-mcp の仕様 ID を引用し、仕様の文を言い換えて意味を変えない
- 0.26.x 以前と 0.27.0 で違う箇所は、版を書いて両方が分かるようにする
- node scripts/check-mcp-refs.mjs と node --test 'scripts/test/*.test.mjs' と node scripts/update-mcp-snapshots.mjs --check を通す
- コミットを作るところまで。署名・push・PR・マージ・タグは私が行う。git を使う前に skills フォルダーの削除の許可を取る（houki-hub の指示書の「共通」と同じ。VM の git の名前とメールも同じ）

## 終わったら報告すること

- ブランチ・コミット（ハッシュと件名）
- 直した箇所の一覧（ファイル・行・前後の文）と、grep し直して足した箇所・足さなかった箇所の理由
- 版（0.19.2 か 0.20.0）と理由、CHANGELOG の文
- check-mcp-refs・test・snapshots の結果
- PR 本文の草案（houki-nta-mcp 0.27.0・#154・#155 への言及。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
- claude-plugins の追随が要るか
```

---

## 指示 Y1: #27 の仕様書ページと scope-by-audience のページ（設計と試作）

段階 4 の最初です（計画書の 6c-1・6c-2）。#27 の仕様書ページは、各リポジトリの `specs/current/<dir>/spec.md`（egov・nta・abbr）と Skill の `workflows/*.md` から生成します。承認の記録は spec-ids 0.3.0 の front matter と `spec-ids history` で読めるようになりました（spec-ids#5、2026-10-09 に 3 リポジトリとも変換済み）。

ページの作りに決めることが多いので、最初の会話は「設計と試作」に分けます。全部のページの生成と公開（Y2）は、私が試作を見て決めた後に別の会話で行います。2026-10-09 JST に、houki-hub の origin の main が `8733173`（Skill 0.20.0 の追随）であることを確かめました。

```text
houki-hub#27（houki-hub シリーズの仕様書の提供）の仕様書ページと、scope-by-audience のページの設計と試作をしてください。この会話では、生成スクリプトの試作と、試作のページを数枚作るところまでを行い、全部のページの生成と公開は行いません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- 起点: main。作業の前に git ls-remote https://github.com/shuji-bonji/houki-hub refs/heads/main で origin と同じか確かめる
- ブランチ: docs/<作業日の yyyymmdd>-spec-pages-prototype（site/ と scripts/ を変えるので main 直接にしない）
- 読む材料（読むだけ）: mcp/houki-egov-mcp・mcp/houki-nta-mcp・lib/houki-abbreviations の specs/current/<dir>/spec.md と specs/releases/*/*/proposal.md、/Users/bonji/workspace/shuji-bonji/skills/houki-research-skill の SKILL.md と workflows/*.md

## 最初に読むもの（この順）

1. houki-hub#27 の本文とコメント（curl https://api.github.com/repos/shuji-bonji/houki-hub/issues/27 と /comments）。コメント 2026-09-27「Skill のページは spec.md ではなく SKILL.md と workflows/ から作る」（docs/notes/2026-09-28-comment-hub-27-skill-pages.md も同じ内容）
2. docs/notes/2026-10-04-plan-stage6-and-followups.md の 4 章の段階 4（6c-1・6c-2・6c-3・6e・6f）と 8.3（URL とサイドバーは 6c-1 の会話で決める）、末尾の「この後の順」
3. docs/notes/2026-09-29-scope-by-audience.md（2 節・4 節を利用者向けに書き直す。3 節は載せない。6 章「公開への切り出し」）
4. scripts/generate-reference.mjs（今のリファレンスの生成。#27 の生成は同じ 1 本に入力を足す方針）と site/docs/.vitepress/config.ts（nav・sidebar）、site/docs/reference/ と site/docs/guide/ の今のページ
5. spec-ids の README の front matter の表と history（$HOME/mnt/spec-ids）。各リポジトリで npx spec-ids history <dir> --json を実行すると承認の履歴が JSON で出る（node_modules の 0.3.0）

## 決めること（案を並べて勧める案を書き、試作はその案で作る）

1. ページの URL と sidebar（計画書 8.3）。出発点: /specs/<repo>/<dir>（Skill は /specs/houki-research-skill/<workflow>）、sidebar はリポジトリごとの節
2. ページに何を載せるか。#27 の本文は「目的・使い方・処理の流れが中心、コードの詳細は避ける（必要ならリファレンス）」。spec.md は実装者向けの文（仕様 ID ごとの約束と例）なので、そのまま載せると #27 の狙いより細かい。案: (A) spec.md の節を見出し単位でそのまま載せる（ID・本文・例） / (B) spec.md の冒頭（目的・入力・できないこと・処理の流れ）を前に出し、ID ごとの約束は折りたたみや 2 段目にする / (C) 人が書く利用者向けの要約と、spec.md の生成部分を分ける。試作は勧める案で作り、他の案との違いを報告に書く
3. 承認の履歴（spec-ids history の出力）をページに載せるか、どの形で載せるか
4. 生成スクリプトの置き場所（generate-reference.mjs に入力を足すか、別のスクリプトにして共通部分を分けるか。計画書は同じ 1 本の方針）と、CI で生成し直すとき（hub#5 ②、6e）に必要なもの（各リポジトリの specs/ をどこから読むか: 作業コピーか、npm のパッケージか、GitHub か）
5. scope-by-audience のページの置き場所（計画書の案: site/docs/guide/ に 1 ページ、overview.md と disclaimer.md からリンク）と、仕様書ページとの結び方（利用者別の線のページから、関係する仕様 ID のページへのリンク）

## 試作するもの

- 生成スクリプトの試作（決めること 4 の案で）
- 試作のページ: houki-nta-mcp の 1 ツール（nta_get_tsutatsu を勧める。0.27.0 で変わった 007 があり、履歴の例にもなる）、houki-egov-mcp の 1 ツール（search_fulltext を勧める）、houki-abbreviations の 1 機能、Skill の workflow 1 つ（tax-research）
- scope-by-audience のページの草案（2 節・4 節。3 節は載せない。利用者向けの公開文書の文体: 「〜します」「〜です」、内部の関数名・変数名を避ける）
- config.ts の sidebar の試作（試作のページだけ）
- 手元で VitePress を動かせれば npm run docs:build（site/ の package.json のスクリプト名を確かめる）で通ることを確かめる。動かせなければ私が Mac で回すコマンドを書く

## 守ること・報告すること

- site/ の公開文書は「〜します」「〜です」で、利用者が何を受け取るかを文で書く。体言止めや開発メモの文体を持ち込まない。見出しの節には目的の一文を付ける
- 生成したページは、元の spec.md・workflows の文を言い換えて意味を変えない（生成部分は写すだけにし、人が書く部分と分ける）
- 公開（main への取り込み）はしない。コミットはブランチに作るところまで。署名・push・PR は私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る（この文書の「共通」と同じ）
- 報告: ブランチ・コミット、決めること 1〜5 の案と勧める案（試作に使った案）、試作のページのパスと見どころ、生成スクリプトの入力と出力、全部のページを生成すると何ページになるか（リポジトリごとの数）、Y2（全部の生成と公開）と hub#5 ②（CI での生成し直し）に渡すこと
```

---

## 指示 Y2: #27 の仕様書ページの全部の生成と公開

Y1（設計と試作）は houki-hub PR #46 で main に入りました（`690ac1e`、2026-10-09）。`site/**` の push で GitHub Pages に公開されるので、試作の 4 機能のページと「仕様」の nav は、すでに公開されています。Y2 では `SPEC_REGISTRY` の `only` を外して全部のページを作り、試作で決めた形を確定します。

Y1 で決まった形（計画書の Q26' で shuji が確かめる）:

| # | 決めること | Y1 の形 |
| --- | --- | --- |
| 1 | URL と sidebar | `/specs/<サイトの短い名前>/<dir>`（`houki-egov`・`houki-nta`・`houki-abbreviations`・`houki-research`。`/mcp/`・`/reference/` と同じ名前）。sidebar は `site/docs/.vitepress/specs-sidebar.json` を生成して読む |
| 2 | 載せるもの | spec.md の節を言い換えずに写す（使う人と受け取るもの・入力・戻り値・できないこと・処理の流れ・仕様 ID ごとの約束（条件と例は折りたたみ））。人が書く「使いどころ」の節を `scripts/spec-pages/<site>/<dir>.md` から差し込める |
| 3 | 承認の履歴 | 載せる。spec-ids 0.3.0 の `history()` で集める |
| 4 | 生成スクリプト | `scripts/spec-pages.mjs`。`node scripts/generate-reference.mjs specs`（`specs:<site>`）で呼ぶ。入力は houki-hub の作業コピーの `mcp/`・`lib/`・`skill/` の下 |
| 5 | scope-by-audience | `site/docs/guide/scope-by-audience.md`。`overview.md`・`disclaimer.md` からリンク |

```text
houki-hub#27 の仕様書ページを、試作（Y1、PR #46）の形のまま全部の機能について生成し、公開できる状態にしてください。この会話の役は、生成と文書の作業者です。各リポジトリの specs/ は読むだけで、変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- 起点: main。作業の前に git ls-remote https://github.com/shuji-bonji/houki-hub refs/heads/main で origin と同じか確かめる。mcp/houki-egov-mcp・mcp/houki-nta-mcp・lib/houki-abbreviations・skill/houki-research-skill の作業コピーが、それぞれの origin の main と同じかも確かめる（違えば止めて私に聞く。生成の元が古くなるため）
- ブランチ: docs/<作業日の yyyymmdd>-spec-pages（site/ を変えるので PR にする）

## 最初に読むもの

1. houki-hub PR #46 の本文（curl https://api.github.com/repos/shuji-bonji/houki-hub/pulls/46）と、コミット 690ac1e のメッセージ
2. scripts/spec-pages.mjs と scripts/lib/generated-page.mjs、site/docs/specs/index.md（読み方のページ）、試作の 4 ページ
3. docs/notes/2026-10-04-stage6-instructions.md の「指示 Y2」の前の表（Y1 で決まった形）と、計画書の Q26'

## やること

1. SPEC_REGISTRY の only を外し、egov 20・nta 22・abbr 23 の機能と、Skill の workflow 2 つ（tax-research・feasibility-check）のページを生成する（リポジトリごとの一覧と specs-sidebar.json も作り直す）
2. 生成したページを全部 VitePress で組み、壊れたリンク・Mermaid の描画の誤り・見出しの重複が無いかを確かめる。機能ごとに spec.md の書き方が違う（例: 種類が CLI・DB・共通の機能、## 処理の流れが無い機能、ID の無い節の書き方が古い形の機能）ので、試作の 4 ページで見えなかった崩れを探し、生成スクリプトで直す。spec.md を直す必要があるものは直さずに一覧にして報告する
3. 「使いどころ」（人が書く節）は、計画書の Q26' の答えに合わせる（勧める案: Y2 では新しく書かない。今ある nta_get_tsutatsu の 1 つだけにし、ほかは後で足す）
4. リファレンスのページ（site/docs/reference/）の各ツールから、同じ機能の仕様書ページへのリンクを張るかを決め、張るなら generate-reference.mjs で行う（勧める案: 張る。仕様書ページからリファレンスへのリンクは試作ですでにある）
5. scope-by-audience のページは、試作の文を shuji が読んで直すまで変えない（このページは業法の線を書くので、文の確認は私が行う）。直す点があれば報告に挙げるだけにする

## 守ること・報告すること

- 生成したページは手で直さない（直すのは生成スクリプトか、人が書く節のファイル）。仕様書の本文を言い換えない
- 公開文書の文は「〜します」「〜です」
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る（この文書の「共通」と同じ）
- 報告: ブランチ・コミット、生成したページの数（リポジトリごと）、VitePress の組み立ての結果、生成スクリプトで直した崩れの一覧、spec.md 側で直すとよいものの一覧（リポジトリ・機能・何が崩れるか）、リファレンスからのリンクの扱い、hub#5 ②（CI での生成し直し）に渡すこと（作業コピーに頼っている入力と、CI で用意するもの）、PR 本文の草案（Refs #27。#27 を閉じるかは私が決める。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 Y3: ツールごとのページ（#27 の続き、リファレンスを分ける）

Y2 は houki-hub PR #47 で main に入り（`eff9bd9`、2026-10-09）、公開しました。仕様書ページは spec.md の写しで、契約とテストの索引です。人がツールを理解するための文書にはなっていません。2026-10-09 JST に shuji が計画書の Q27' を案 B、Q28' を案 A に決めました。

決まったこと（Q27' の B と、Issue 草案の「決めること」1〜3 の勧める案）:

| # | 決めたこと |
| --- | --- |
| 1 | 3 層（解説 `/mcp/<server>`・リファレンス・仕様 `/specs/`）は残す。仕様 ID は契約とテストの索引のままにし、人が読む本文は仕様書ページに寄せない |
| 2 | リファレンスをツールごとのページに分ける: `/reference/mcp/<server>/<tool>`、ライブラリは `/reference/lib/houki-abbreviations/<関数の dir>`。人が読む単位はこのページ |
| 3 | ツールのページに載せるもの: 使いどころ（人が書く）、spec.md の「使う人と受け取るもの」「処理の流れ」「できないこと」の写し、`tools/list` の引数（ライブラリは `.d.ts` のシグネチャ）、実測の呼び出し例、約束の見出しの一覧（畳む。各行は仕様書ページの ID へリンク） |
| 4 | spec.md の経緯の文（「v0.26.x では…」）は言い換えないために出す。経緯の多い節は畳んでよい |
| 5 | 今の 1 ページのリファレンス（`/reference/mcp/<server>`）は、ツールの一覧と共通の前置きだけにする。今の錨（`#get-law` など）から新しいページへ移す |
| 6 | 仕様書ページの先頭は、spec.md の h1 の一言とツールのページへのリンクにする。「使いどころ」はツールのページへ移す（仕様書ページには出さない） |
| 7 | 図とコンテナは Q28' の A: spec.md の処理の流れの図は畳む。人向けの小さな図（ノード 10 個ほどまで）は人が書く節に置ける形にする（Y3 では枠だけ。書くのは Y4 以降） |

見本: `docs/notes/issues-2026-10-09-hub27-tool-pages/sample-get_law.md`（作り方は同じフォルダーの `sample-build.py`）。Issue は houki-hub#48（2026-10-09 に shuji が起票。本文は同じフォルダーの `issue-tool-pages.md` と同じ）。

```text
houki-hub のリファレンスを、ツール（関数）ごとのページに分けてください。人が「このツールは何をして、どう使い、何を返すか」を 1 ページで読めるようにします。この会話の役は、生成スクリプトと文書の作業者です。各リポジトリの specs/ と、サーバーの tools/list は読むだけで、変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- 起点: main。作業の前に git ls-remote https://github.com/shuji-bonji/houki-hub refs/heads/main で origin と同じか確かめる。mcp/houki-egov-mcp・mcp/houki-nta-mcp・lib/houki-abbreviations・skill/houki-research-skill の作業コピーが、それぞれの origin の main と同じかも確かめる。違うときは、生成の元（specs/・package.json の版・SKILL.md・workflows/・dist）に差があるかを見て、差があれば止めて私に聞く（差が README などだけなら、進めて報告に書く）
- ブランチ: docs/<作業日の yyyymmdd>-tool-pages（site/ を変えるので PR にする）

## 最初に読むもの（この順）

1. docs/notes/issues-2026-10-09-hub27-tool-pages/issue-tool-pages.md（Issue の草案）と、同じフォルダーの sample-get_law.md（見本）
2. docs/notes/2026-10-04-stage6-instructions.md の「指示 Y3」の前の表（決まったこと 1〜7）と、計画書の Q27'・Q28' と「Y2 の後」
3. scripts/generate-reference.mjs（renderPage・renderLibPage・REGISTRY・LIB_REGISTRY）、scripts/spec-pages.mjs（readSpecFeature・transformMarkdown・mermaidSafe・specPageIndex・renderSpecPage）、scripts/lib/generated-page.mjs
4. site/docs/.vitepress/config.ts（sidebar・nav、cleanUrls、markdown の設定）と site/README.md の「書き方」

## やること

1. ツールのページを生成する。generate-reference.mjs から、MCP は tools/list、ライブラリは .d.ts、spec.md の 3 節は spec-pages.mjs の読み込みと変換を使い回す（生成済みの仕様書ページから写さない。見本では節の目的の一文が重なった）。spec.md の中の仕様 ID のリンクは、仕様書ページの ID（/specs/<site>/<dir>#spec-…）へ向ける
2. ページの並び: 一言（tools/list の description）→ 使いどころ（人が書く節。あれば）→ 使う人と受け取るもの → 引数 → 呼び出し例 → できないこと → 処理の流れ（spec.md の図。::: details に畳む）→ 約束の見出しの一覧（畳む）→ 関連ページ。見本と違い、処理の流れを後ろに回して畳む（Q28' の A）。畳んだ中で Mermaid が描けるか（幅 0 で描かれない・開いたときに描かれる）をブラウザで確かめ、描けなければ畳まずに末尾の節にして報告する
3. 人が書く節のファイルは scripts/spec-pages/<site>/<dir>.md をそのまま使い、ツールのページに差し込む。仕様書ページからは外す（決まったこと 6）。人向けの小さな図を置く場所（同じファイルの中の節）を決め、置き方を site/README.md の「書き方」に 1〜2 文で書く。Y3 で新しく書く人の節は無い
4. 1 ページのリファレンス（/reference/mcp/<server>、/reference/lib/houki-abbreviations）を、ツールの一覧（一言・ツールのページ・仕様書ページの 3 列）と共通の前置きだけにする。今の錨（#get-law など）で開かれたときに新しいページへ移す仕組みを置く（生成するページの中の小さなスクリプトか theme の側。どちらにしたかを報告する）
5. 仕様書ページの先頭を、spec.md の h1 の一言・ツールのページへのリンク・最後に仕様が変わった変更の 1 文にする（今の info と承認の履歴は残す）。spec-pages.mjs の referenceLink と specPageIndex の行き先も、新しいツールのページに合わせる
6. sidebar: /reference/ の下にサーバーごとのツールのページを並べる（config.ts の sidebar を生成した JSON から読む形にするかは任せる。specs-sidebar.json と同じ形が望ましい）
7. 呼び出し例のファイル（scripts/reference-examples/）と、例を読むスクリプト（check-example-versions.mjs など）が、ページが分かれても今どおり動くかを確かめる

## 確かめること

- VitePress で組めること。組み立ては作業コピーの node_modules（Mac 用）を使わず、site/ を VM のホームの下（mnt/ の外）に写して npm ci してから行う。houki-hub の node_modules で npm install・npm rebuild はしない
- 壊れたリンクとアンカー: 生成した HTML の id と href を突き合わせる。VitePress は濁点を含む見出しの id を NFD で作るので、NFC で書いた錨は合わない（Y2 で見つかった。比べるときは NFC/NFD の違いも見る）
- Mermaid: 全部の図を mermaid 11 で parse する（jsdom で足りる）。ブラウザでの描画は、dist を tar にして houki-hub に一時的に置き、cloud のコンテナに stage して Playwright で見る（使い終わった tar は消す）
- もう一度生成して、書き換わるファイルが無いこと

## 守ること・報告すること

- 生成したページは手で直さない。仕様書の本文と tools/list の説明を言い換えない。公開文書の文は「〜します」「〜です」
- scope-by-audience と、人が書くページ（guide/・mcp/・lib/・skills/ の解説）は変えない（Y4 で扱う）。ただし、ツールのページへのリンクの行き先が変わって壊れる箇所があれば、その行き先だけを直してよい（直した箇所を報告に挙げる）
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る（この文書の「共通」と同じ）
- 報告: ブランチ・コミット、生成したページの数（サーバー・ライブラリごと）、ページの並びの最終形と見本からの違い、畳んだ Mermaid の描画の結果、今の錨の移し方、組み立てと確認の結果、生成スクリプトで直した崩れ、spec.md や tools/list の説明の側で直すとよいもの、hub#5 ② に渡すこと（Y2 の報告からの増減）、PR 本文の草案（Refs #27・#48。#48 を閉じるかは私が決める。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

## 指示 Y4: 人が書くページのコンテナと図（Q28' の A）

Y3 の後に始めます。人が書く 14 ページ（guide/・mcp/・lib/・skills/ の解説と index.md）は、2026-10-09 時点でコンテナが 2 個（tip 1・warning 1）、図が 9 個です。Q28' の A で、コンテナの種類ごとに意味を 1 つに決め、人向けの図はノード 10 個ほどまでの手書きにしました。業法の線を書く文が入るので、文の確認は shuji が行います。

決まったこと（Q28' の A）:

| コンテナ | 意味 | 例 |
| --- | --- | --- |
| `tip` | 使いどころ・近道 | 番号が分からないときは先に `nta_search_tsutatsu` |
| `info` | 前提・版の条件 | v0.19.0 以上、ローカル DB が要る |
| `warning` | 間違えやすいこと・業法の線 | 通達は納税者を拘束しない。結論は返さない |
| `danger` | 取り消せない操作 | 0.18.x 以前で新しい DB を開くと全テーブルが消える |
| `details` | 長い例・経緯・spec.md の図 | 呼び出し例の応答 JSON |

```text
houki-hub の人が書くページに、決まった使い分けでカスタムコンテナと図を足してください。この会話の役は、文書の作業者です。生成したページ（reference/・specs/）は手で変えません（やることの 7 で生成スクリプトを直して生成し直すのは除く）。scope-by-audience は変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- 起点: main（Y3 が入った後）。作業の前に git ls-remote https://github.com/shuji-bonji/houki-hub refs/heads/main で origin と同じか確かめる
- ブランチ: docs/<作業日の yyyymmdd>-containers-diagrams（site/ を変えるので PR にする）

## 最初に読むもの（この順）

1. docs/notes/2026-10-04-stage6-instructions.md の「指示 Y4」の前の表（コンテナの使い分け）と、docs/notes/issues-2026-10-09-hub27-tool-pages/issue-tool-pages.md の「コンテナと図の使い分け」
2. 計画書の「Y2 の後」の表（壊れたリンク 2 つ）
3. site/README.md と、対象のページ: index.md、guide/overview.md・architecture.md・getting-started.md・local-database.md・disclaimer.md・document-types.md・roadmap.md、mcp/index.md・houki-egov.md・houki-nta.md、lib/houki-abbreviations.md、skills/houki-research.md

## やること

1. コンテナの使い分けを site/README.md の「書き方」に表で書く
2. 対象のページで、今ある文のうち使い分けに当たるもの（前提・版の条件、取り消せない操作、業法の線、長い例）をコンテナに入れる。文は変えずに入れるのを基本にし、文を変えるときは報告に前後を挙げる。新しい注意書きは足さない
3. 図を足す（ノード 10 個ほどまで。1 ページに 1〜2 個まで）:
   - guide/overview.md・architecture.md: 構成図（クライアント → Skill → MCP 群 → e-Gov API・国税庁サイト・ローカル DB）。architecture.md の今の図と重なるなら、重ならない方をどちらかに置く
   - mcp/houki-egov.md・houki-nta.md: 外の API とローカル DB のどちらを引くかの図と、DB を作る・最新にする・作り直す流れ
   - guide/local-database.md: 版をまたぐときの判断のフロー
   - skills/houki-research.md: workflow でツールを呼ぶ順のシーケンス（tax-research と feasibility-check。Y3 のツールのページへリンク）
4. mcp/houki-egov.md・houki-nta.md のツール表を「一言・ツールのページ・仕様書ページ」の 3 列にする（Y3 の URL。仕様 ID は出さない）
5. 壊れたリンク 2 つの直し方を決める。勧める案: config.ts の markdown.anchor の slugify で見出しの id を NFC にそろえる（サイト全体の id が NFC になり、手で書いた錨がそのまま合う）。変えた後に全ページのリンクとアンカーを確かめる。scope-by-audience の 93 行目は、slugify で直るなら本文は変えない
6. houki-nta.md の `--tsutatsu` の説明（186・198・201 行目あたり。受け付けるのが基本通達 4 種だけであることを書いていない）は、直す案を報告に挙げるだけにする（site は都度確認）
7. 「約束」を言い換える（2026-10-10 JST に shuji が決めた。計画書の Q30'）。仕様 ID 1 つが表すものの呼び名は「仕様項目」にする（見出し・表の列名・用語の説明。例: 「仕様項目の一覧」「1 つの仕様 ID が 1 つの仕様項目を表します」）。説明文で、ツールが何をするか（応答・終了コード・扱い）を述べるときは「振る舞い」を使ってよい（例: 「この仕様項目は、DB を開けないときの振る舞いを決めます」）。2 つの語の役割を混ぜない（「仕様項目」は項目そのもの、「振る舞い」はツールの動き）。直す場所は、生成スクリプト（scripts/spec-pages.mjs・scripts/generate-reference.mjs。ツールのページの「約束の一覧」、仕様書ページの「仕様 ID ごとの約束」など）、読み方のページ（site/docs/specs/index.md）、人が書くページ（site/docs/lib/houki-abbreviations.md ほか。grep -rn "約束" site/docs scripts で、生成したページと .vitepress/dist を除いて探す）。生成スクリプトを直した後に生成し直し、生成したページ（specs/・reference/）の差分が「約束」の置き換えだけであることを確かめる。錨（見出しの id）が変わるので、ページの中のリンクとアンカーも確かめ直す
8. 生成したページの節の名前を変える（2026-10-10 JST に shuji が決めた。計画書の Q31'）。spec.md の見出しは変えず、生成スクリプトの対応表（scripts/spec-pages.mjs の src → title。generate-reference.mjs のツールのページも同じ表を使っているかを確かめる）で、サイトでの名前だけを変える:
   - spec.md の `## アクター` → サイトの「使う人と受け取るもの」を「利用者と得られる結果」に
   - spec.md の `## できないこと` → サイトの「できないこと」を「扱わないこと」に
   - spec.md の `## 未決` → サイトの「まだ決めていないこと」を「検討中のこと」に
   見出しだけでなく、関わる文も確かめて直す:
   - 各節の冒頭の一文（対応表の lead。例: 「この機能が引き受けないことです。」→「この機能が意図して扱わないことです。」のように、新しい見出しに合う文にする。「検討中のこと」の lead には、ここに挙げたことは今後の版で変わりうること、Issue で検討していることを書く）
   - 読み方のページ（site/docs/specs/index.md）の「ページの組み立て」の表と本文。今の「本文は言い換えずに写している」の説明に、節の見出しはサイト用の名前に置き換えていること（spec.md の見出しとの対応）を 1 文か小さな表で足す
   - site/README.md 38 行目の「使う人と受け取るもの」「できないこと」（と「約束の一覧」。やることの 7）
   - 生成スクリプトの中で節の名前を文に埋め込んでいる箇所（「できないこと」の節へのリンクの文など）
   直さないもの: guide/scope-by-audience.md・overview.md・disclaimer.md の「できることとできないこと」は、利用者が何をできるかという別の意味で、ツールの節の名前ではないので変えない。guide/document-types.md 6 行目の「未決」はコメントの中の別の話なので変えない。迷ったら変えずに報告に挙げる
   生成し直した後、生成したページ（specs/・reference/）の差分が、節の名前・冒頭の一文・やることの 7 の置き換えだけであることを確かめる。見出しの id が変わるので、リンクとアンカー（サイトの中から `#できないこと` などへ張ったリンク）も確かめ直す

## 守ること・報告すること

- 公開文書の文は「〜します」「〜です」。比喩を使わず、何が起きるかを書く
- 業法の線（warning に入れる文）は、今ある文を動かすだけにする。言い回しを変える必要があれば、報告に挙げて私が決める
- 確かめること（組み立て・リンクとアンカー・Mermaid の parse とブラウザでの描画）は指示 Y3 と同じ方法で行う。幅 390 でも図が読めるかを見る
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る
- 報告: ブランチ・コミット、ページごとに足したコンテナと図、文を変えた箇所の前後、slugify を変えた影響（id が変わったページの数、外から張られているかもしれない錨）、組み立てと確認の結果、houki-nta.md の `--tsutatsu` の直す案、「約束」を置き換えた箇所の数と、節の名前を変えた箇所の数、置き換えに迷った文（「仕様項目」と「振る舞い」のどちらか決めにくいもの）、PR 本文の草案（Refs #27。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```


---

## 指示 Z1: hub#5 ② と呼び出し例の照合のスクリプト（#44）の設計と試作

段階 4 の残りです（計画書の 6e・6f）。#27 と同じく、最初の会話は設計と試作に分けます。Y3 でリファレンスがツールごとのページに分かれ、ページの作り直しは `scripts/generate-reference.mjs`（MCP の `tools/list`、houki-abbreviations の `dist/index.d.ts`、`scripts/spec-pages.mjs` 経由の各リポジトリの `specs/current/`、Skill の `workflows/`）に集まりました。2026-10-10 JST に、houki-hub の origin の main が `2d3d92e`（Y4）の後であることを確かめました。

調べて分かっている前提（2026-10-10 JST）:

- 3 つの npm パッケージ（houki-egov-mcp・houki-nta-mcp・houki-abbreviations）の `files` は `dist` だけで、`specs/` は npm に入っていない。CI で仕様書ページを作り直すには、各リポジトリを GitHub から取る必要がある（Skill も npm に無い）
- 呼び出し例の多くはローカル DB を前提にしている（egov の DB は数 GB）。#44 の照合を CI で回すのは難しく、shuji の Mac で回す形が出発点になる
- `stack-check.yml`（毎日・Issue を立てる）と `scripts/check-example-versions.mjs`（呼び出し例の「実測: vX」と npm の版の照合）は動いている（hub#5 の①③）

```text
houki-hub#5 の②（CI でリファレンスと仕様書ページを作り直し、差分があれば PR を開く。サイトと各リポジトリの版のずれを検出する）と、houki-hub#44（呼び出し例を同じ引数で流し、例と同じ応答が返るかを機械で確かめる）の設計と試作をしてください。この会話では、設計の文書と試作のスクリプトを作るところまでを行い、定期実行の有効化と全部の例の書き換えは行いません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- 起点: main。作業の前に git ls-remote https://github.com/shuji-bonji/houki-hub refs/heads/main で origin と同じか確かめる
- ブランチ: feat/<作業日の yyyymmdd>-hub5-regen-and-examples-check（.github/ と scripts/ を変えるので PR にする）

## 最初に読むもの（この順）

1. houki-hub#5 の本文（curl https://api.github.com/repos/shuji-bonji/houki-hub/issues/5）と docs/notes/2026-10-01-hub5-change-detection.md（①③の経緯）
2. houki-hub#44 の本文（/issues/44）と、草案 docs/notes/issues-2026-10-06-hub43/issue-example-check-script.md、docs/notes/issues-2026-10-06-hub43/comment-example-versions.md
3. docs/notes/2026-10-04-plan-stage6-and-followups.md の 4 章の段階 4（6e・6f）、Q14（「確かめた版」を書き戻す案 B）、「Y2 の後」の表の「サイトと各リポジトリの版のずれの検出」、末尾の「Y4 の後」
4. scripts/generate-reference.mjs（REGISTRY・LIB_REGISTRY・stdio の起動）、scripts/spec-pages.mjs（SPEC_REGISTRY の入力の場所）、scripts/check-example-versions.mjs、scripts/reference-examples/README.md と例のファイル、.github/workflows/stack-check.yml・deploy.yml、.github/scripts/stack-drift-issue.mjs
5. docs/notes/2026-09-21-regression-check.md（今の手作業の契約の確認の手順）と、最近の記録 docs/notes/2026-10-05-regression-check-egov-0.20.0-nta-0.25.0.md

## 決めること（案を並べて勧める案を書き、試作はその案で作る）

hub#5 ②（CI での作り直し）:
1. 入力の取り方。MCP の tools/list は npx -y @shuji-bonji/<pkg>@<版> で起動するか、各リポジトリを最新の公開タグで checkout して build するか。specs/ と Skill の workflows/ は GitHub から取るしかない（npm に無い）ので、checkout に揃える案と、tools/list だけ npx にする案を比べる。houki-nta-mcp の better-sqlite3 が CI の上で tools/list まで動くかを確かめる
2. どの版で作るか（npm の latest と各リポジトリの最新のタグが同じことを前提にするか、stack.json の published に合わせるか）
3. 差分があったときの出し方（PR を開く／既存の PR を更新する／Issue にする）と、使うトークン（GITHUB_TOKEN で PR を開けるか。PR からの CI が動かない制約）
4. 版のずれの検出（生成したページの冒頭の版と、各リポジトリの最新の公開タグを比べる）を stack-check.yml に足すか、新しい workflow にするか
5. いつ回すか（毎日・タグの push を受けて・手動）

#44（呼び出し例の照合）:
6. 置き場所と回す場所（勧める案: scripts/check-examples-contract.mjs を shuji の Mac で回す。ローカル DB が要るため CI では回さない）。MCP の起動は generate-reference.mjs の REGISTRY と stdio のクライアントを使い回す（共通部分を scripts/lib/ に分けるか）
7. 比べ方の規則（草案の「比べ方の規則」の表: 書いてあるキーがあるか、値が同じか、「…」と /* … */ と途中で切った配列の扱い、毎回変わる値のパスの一覧、データ側の差分と形の違いの分け方）
8. 例ごとの例外の書き方（草案の「- 照合:」の行）と、今の例の前提の行（「- ローカル DB:」「- 版の照合: しない」）との関係
9. 「一致」した例に「確かめた版」を書き戻すか（Q14 の案 B）と、check-example-versions.mjs と stack-check.yml の Issue がそれを読む形
10. 結果の出し方（表の Markdown と JSON。docs/notes の regression-check の記録と同じ形にするか）

## 試作するもの

- 設計の文書: docs/notes/<作業日>-design-hub5-regen-and-examples-check.md（決めること 1〜10 の案と勧める案、確かめた値、確かめていない点）
- hub#5 ②: CI の workflow の試作（workflow_dispatch だけで動く形。schedule は付けない）と、REGISTRY の起動を環境変数で npx か checkout に切り替える変更。VM から npm の registry に届かない場合は、私が Mac で確かめるコマンドを書く
- #44: scripts/check-examples-contract.mjs の試作。比べ方の規則のうち、キーの有無・値の一致・「…」の扱い・毎回変わる値の一覧までを実装し、ローカル DB の要らない例（resolve_abbreviation、get_law の e-Gov API を引く例など。DB の要る例は私の Mac で回す）を 3〜5 例流して結果の表を出す。テストは scripts/*.test.mjs の形で、比べ方の規則の関数に付ける
- 例のファイルの書き換え（「- 照合:」の行を足すなど）は、試作で 1〜2 例だけにする

## 守ること・報告すること

- .github/workflows/ を足す・変えるときは workflow_dispatch だけにし、schedule と push のトリガーは付けない（有効にするのは私が試作を見てから）
- 生成したページ（site/docs/reference/・site/docs/specs/）は手で変えない
- 公開文書（site/）は変えない。設計の文書は docs/notes/ に置く
- コミットを作るところまで。署名・push・PR は私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る（この文書の「共通」と同じ）
- 報告: ブランチ・コミット、決めること 1〜10 の案と勧める案（試作に使った案）、試作で確かめたこと（CI で npx の起動が通るか、照合のスクリプトで流した例と結果）、私が Mac で回すコマンド、Z2（有効化と全部の例）に渡すこと、PR 本文の草案（Refs #5 #44。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 Y5: scope-by-audience の (1)・(2) と houki-nta.md の `--tsutatsu` の説明

Y4 の後に始めます。Z1 とは触るファイルが重ならないので並行できます。計画書の Q32' で決めた (1)・(2) と、Y4 で直す案を挙げるだけにしていた `--tsutatsu` の説明を、1 本の小さな PR にします。scope-by-audience の (3)（業法の線の言い回し）はこの指示に入れません。

```text
houki-hub の人が書くページ 2 つ（guide/scope-by-audience.md と mcp/houki-nta.md）の文を直してください。この会話の役は、文書の作業者です。生成したページ（reference/・specs/）は変えません。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- 起点: main。作業の前に git ls-remote https://github.com/shuji-bonji/houki-hub refs/heads/main で origin と同じか確かめる（Y4 の PR #50 が入った後）
- ブランチ: docs/<作業日の yyyymmdd>-scope-by-audience-fixes（site/ を変えるので PR にする）

## 最初に読むもの（この順）

1. docs/notes/2026-10-04-plan-stage6-and-followups.md の Q32'
2. site/docs/guide/scope-by-audience.md の全体
3. site/docs/specs/houki-egov/verify_citations.md・common_errors.md の「エラー応答のフィールド」、site/docs/specs/houki-nta/common_errors.md の同じ表、site/docs/specs/houki-research/feasibility-check.md の「このワークフローを使う場面」
4. site/docs/mcp/houki-nta.md の `--tsutatsu` の箇所（grep -n -- "--tsutatsu"）と、site/docs/specs/houki-nta/cli_bulk_download.md の `--tsutatsu` の行と、基本通達 4 種のほかの値を拒む仕様項目

## やること

1. (1) 「法規シリーズが提供するもの」の表の設計者・実装者の行を、今あるものと今後の対応に書き分ける。士業者の行の書き方（「（いずれも今後の対応）」）に合わせる。案: 「法令の構造化データ、仕様と法令の対応付け（[feasibility-check](/specs/houki-research/feasibility-check)）。改正による差分と、毎回同じ結果になる部品（計算・期限）は今後の対応」。同じ節の「設計者・実装者に向けた範囲は、法令の構造化データと、毎回同じ結果になる部品です。」の文も、部品が今後の対応であることが分かる形にそろえる。93 行目あたりの「今の法規シリーズが実際に提供している範囲は…」の文と食い違わないかを確かめる
2. (2) 「この位置を支えている仕様」の表にリンクを足し、`<!-- Y2: … -->` のコメントを消す。新しい行は作らず、今の行に足す:
   - 法源への到達: 今の行の書き方（「[nta_get_tsutatsu の SPEC-NTA-GET-TSUTATSU-013](…)」のように、ツール名と代表の仕様 ID を 1 つのリンクにする）に合わせて、次の 3 つを足す（Q32' の (2)、案 A）
     - [verify_citations の SPEC-EGOV-VERIFY-CITATIONS-004](/specs/houki-egov/verify_citations#spec-egov-verify-citations-004)（存在しない引用が混ざっていても、引用 1 件ごとに条・項・号があるかを返す）
     - [common_errors の SPEC-EGOV-COMMON-ERRORS-032](/specs/houki-egov/common_errors#spec-egov-common-errors-032)（法令名が題名と完全に一致しないときは、候補の正式名を next_actions に添えて返す）
     - [get_related_laws の SPEC-EGOV-GET-RELATED-LAWS-008](/specs/houki-egov/get_related_laws#spec-egov-get-related-laws-008)（法律から、委任先の施行令・施行規則の目次へ進む案内を next_actions に添える）
   - 論点の抽出: [feasibility-check](/specs/houki-research/feasibility-check)（実装する前に、仕様が法令のどこに触れるかを条文で確かめる手順）。Skill の workflow には仕様 ID が無いので、tax-research と同じくページへのリンクにする
   - 錨は生成したページの見出しの id を見て確かめる（Y4 で id を NFC にそろえた）
   - 括弧の説明は、今の行と同じ長さ（1 句）にする。上の「専門家の仕事の中での位置」の表の法源への到達の行（「引用した法令が実在するかを確かめるツールと、次に読むべき法令を応答に添える仕組み」）と、足すリンクが 1 対 1 で対応するかを確かめる
3. mcp/houki-nta.md の `--tsutatsu` の説明（`--quickstart` の案内の文と、`--quickstart`・`--bulk-download` の表の行）に、受け付けるのは基本通達 4 種（消費税法基本通達・所得税基本通達・法人税基本通達・相続税法基本通達）の正式名だけで、ほかの値は取り込みを始めずにエラーで終わることを書く。根拠の仕様項目（cli_bulk_download の該当の ID）へリンクする。表の中は短くし、4 種の列挙は表の下か案内の文に置く

## 守ること・報告すること

- 公開文書の文は「〜します」「〜です」。比喩を使わず、何が起きるかを書く
- scope-by-audience の業法の線に触れる文（「当てはめ」の行、図の A3 など）は変えない。(3) は私が決めてから別に直す
- 確かめること: 組み立て（npm run docs:build か、リポジトリの決まったコマンド）、変えた 2 ページのリンクとアンカーが全部開くこと（指示 Y3 と同じ方法）
- コミットを作るところまで。署名・push・PR・マージは私が行う。git を使う前に houki-hub フォルダーの削除の許可を取る
- 報告: ブランチ・コミット、変えた文の前後（3 か所とも）、足したリンクと錨、組み立てとリンクの確認の結果、迷った点、PR 本文の草案（Refs #27。末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```
