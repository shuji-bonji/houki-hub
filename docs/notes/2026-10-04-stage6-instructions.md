# 次の計画の最初の指示（P: egov 0.19.1 の仕様 PR / R: 契約の確認と呼び出し例の取り直し）

2026-10-04（JST）に作った、`2026-10-04-plan-stage6-and-followups.md` の段階 1 と段階 2 を別の会話で始めるための指示です。P と R は別リポジトリ（P は houki-egov-mcp、R は houki-hub）なので並行できます。

| 指示 | 段階 | 内容 | 始める条件 |
| --- | --- | --- | --- |
| P | 1 | houki-egov-mcp 0.19.1 の仕様 PR（#107） | すぐ（0.19.1 の publish の目標は 2026-10-15。10-16 に 7 版が施行される） |
| R | 2 | 全 47 例の契約の確認（C）と呼び出し例の取り直し（6a） | 計画書の段階 0 の 0-a（hub#5 ①③）が main に入った後が望ましい。入っていなくても始められる（最後の③の確認だけ後に回す） |

---

## 指示 P: houki-egov-mcp 0.19.1 の仕様 PR（#107）

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
- 実装 PR（指示 Q）に渡すこと: 受入テストの fixture の作り方の案（小さな zip と CSV）、0.19.1 の CHANGELOG の「互換性」の候補
```

---

## 指示 R: 全 47 例の契約の確認（C）と呼び出し例の取り直し（6a）

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
