# 段階 4 の後半の仕様 PR の指示（egov 0.17.0 / nta 0.23.0、T4 + T5）

2026-10-03（JST）に、段階 4 の前半を進めた Spec Steward の会話で作った、後半の仕様 PR を新しい会話に渡すための指示です。前半の会話は文脈が長くなったので、後半は新しい会話で始めます。

- 指示 D: T4（応答の形）と T5（文書と実装の食い違い）の仕様 PR を、houki-egov-mcp と houki-nta-mcp に書く（新しい会話にそのまま貼る）
- 実装 PR の指示（egov 0.17.0 / nta 0.23.0）と、publish の日の houki-research-skill の指示は、仕様 PR がマージされた後に指示 D の会話で `docs/notes/` に書く（前半の `2026-10-01-stage4-impl-instructions.md` と同じ形）

## 2026-10-03 時点の状態

| リポジトリ | main | 版 | 備考 |
| --- | --- | --- | --- |
| houki-egov-mcp | `7b22169` | 0.16.0 | `specs/changes/` は空。main はマージコミット（AGENTS.md の ff-only と違う形。中身は問題なし） |
| houki-nta-mcp | `3b2a0f9` | 0.22.0 | `specs/changes/` は空 |
| houki-research-skill | `932943c` | 0.16.1 | PR #22（エラーの扱いの記述 4 件）はマージ済み |
| houki-hub | `34972ce` の上に本ファイルのコミット | — | origin より先行（push は shuji） |

`specs/changes/` が両方とも空なので、後半は採番の衝突（同じ ID の見出しが `specs/changes/` に 2 つある状態）を気にせず、`specs/current/` の ID をふつうの `MODIFIED` で書けます。T4 と T5 の間では衝突しうるので、前半と同じく直列に積みます。

---

## 指示 D: T4 + T5 の仕様 PR（egov と nta）

```text
houki-egov-mcp と houki-nta-mcp の、段階 4 の後半（T4 応答の形・T5 文書と実装の食い違い）の仕様 PR を書いてください。この会話の役は Spec Steward です（各リポジトリの AGENTS.md の「役割」）。実装とテストは書きません。実装は、仕様 PR のマージ後に別の会話で行います（Steward と Coder を同じ会話で起動しない決まり）。

## 場所

- houki-hub: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- houki-egov-mcp: mcp/houki-egov-mcp（main 7b22169、0.16.0）
- houki-nta-mcp: mcp/houki-nta-mcp（main 3b2a0f9、0.22.0）
- 作業の前に、両リポジトリで git fetch https://github.com/shuji-bonji/<repo>.git main を行い、main が origin と同じか確かめる

## 対象

| 版 | テーマ | egov | nta |
| --- | --- | --- | --- |
| egov 0.17.0 / nta 0.23.0 | T4 応答の形 | #64・#65・#66 | #71・#82 |
| 同上 | T5 文書と実装の食い違い | #56 | #70・#108 |

Issue の本文の草案（投稿した文と同じ）は houki-hub の docs/notes/ にある:

- egov #56 issues-2026-09-28-egov-undecided/06-docs-mismatch.md
- egov #64 issues-2026-09-28-egov-undecided/14-response-fields.md
- egov #65 issues-2026-09-28-egov-undecided/15-revisions-semantics.md
- egov #66 issues-2026-09-28-egov-undecided/16-file-names.md
- nta #70 issues-2026-09-26-nta-undecided/07-guidance-mismatch.md
- nta #71 issues-2026-09-26-nta-undecided/08-response-shape.md
- nta #82 issues-2026-09-27-nta-untested/04-search-hit-issued-at.md
- nta #108 issues-2026-09-30-nta-cli-db/03-docs-mismatch.md

草案は v0.15.1 / v0.21.x の時点の記述です。0.16.0 / 0.22.0（T1・T2・T3）で片付いた行や、文面が変わった行があるので、各行を今の main の specs/current/ と src/ で確かめてから書く。GitHub の Issue にその後のコメントがあれば、それも読む（git の HTTPS は通る。gh が無ければ https://api.github.com/repos/shuji-bonji/<repo>/issues/<N>/comments を curl で読む）。

## 最初に読むもの（この順）

1. 各リポジトリの AGENTS.md（差分の書き方・仕様 ID・PR の種類）と CONTRIBUTING.md
2. houki-hub の docs/DECISIONS.md の 2026-09-29 の T4・T5 の行（規則の本文）
3. houki-hub の docs/notes/2026-09-29-plan-spec-issues.md の 4 章「段階 1」の T4・T5、5.1（フィールドを消す変更は入れない）、6 章「段階 4」、末尾の「段階 1 の転記で見つかった、計画書との食い違い」
4. 前半の差分（書き方の手本）: egov specs/releases/v0.16.0/、nta specs/releases/v0.22.0/ の proposal.md と spec.md
5. 対象 Issue が指す specs/current/<dir>/spec.md の「未決」と仕様 ID

## 決まっている規則（DECISIONS.md の T4・T5）

- T4: 値が無いフィールドは null を入れ、フィールドを消さない。meta には at（時点）と retrieved_at を常に付ける。検索の results[] には全種別で issuedAt を付け、タックスアンサーの日付は発出日ではなく「法令時点」なので別のフィールド名（例: basisDate。nta_get_qa の qa.basisDate と同じ）で付ける。フィールドを消す変更・名前を付け替える変更は入れない（足すか null にするだけ）
- T5: 行ごとに振り分ける。動きを変える必要が無い行は文書を直す（仕様 PR に入れず、実装 PR で直す）。動きを変える行だけ仕様 PR に入れる。egov #56 の INTERNAL_ERROR は retryable: false に直す（hint の「報告してください」と合わせる。動きを変える側）

## 計画書に書いてある、仕様 PR で決めること

1. T4 の「meta に at と retrieved_at を常に付ける」は egov の形で、nta の応答には meta が無い。nta に meta を足すか、nta では対象外とするかを決めて、proposal.md の「人が判断すること」に書く
2. egov の get_toc の meta と SPEC-EGOV-GET-ARTICLE-REFERENCES-034 は「at を省いたときは付かない」と約束しているので、null に揃えるなら MODIFIED になる
3. nta #71 の hits / results、message / hint の名前を揃える案は 5.1 と衝突するので、0.23.0 では付け替えない（今の名前を意図とする側で書く）
4. egov #65 の latest の順と状態の値、egov #66 のファイル名の重なりは、T4 の規則だけでは決まらない。案を 1 つに絞って書き、ほかの案は「人が判断すること」に併記する。実際の値は houki-egov-dev / houki-nta-dev の MCP ツールで呼んで確かめてよい（確かめた日と値を proposal.md に書く）
5. T5 の行のうち文書だけを直す行は、仕様 ID を作らずに T5 の proposal.md の「実装 PR で直す文書」に一覧で書く（実装の会話はこの一覧を見て直す）

## 分け方

- リポジトリごとに 2 本を直列に積む: main → T4 spec/20261003-t4-response-shape → T5 spec/20261003-t5-docs-mismatch。マージもこの順
- 差分の場所: specs/changes/20261003-t4-response-shape/、specs/changes/20261003-t5-docs-mismatch/
- テーマごとに egov → nta の順に続けて書く（null の書き方・meta の文・proposal.md の表を同じ文にするため）
- 1 つの仕様 ID を T4 と T5 の両方で MODIFIED にしない（spec-ids check が採番の衝突として止める）。両方に関わる ID は T4 にまとめ、T5 の proposal.md で「T4 の ID に含めた」と書く

## 守ること

- 変えてよいのは各リポジトリの specs/changes/ の下だけ。specs/current/・src/・テストは変えない
- proposal.md の「承認日」は空欄で置く（shuji が PR 番号と一緒に書く）。「実装の変更」は要/不要と理由を書く
- 新しい ID は spec-ids next で採番し、見出しは ### SPEC-... の形にする
- 公開文書（README・tool description）の文を差分に書くときは「〜します」「〜です」の文体にする
- コミットを作るところまで。署名・push・PR の作成・マージは shuji が行う

## Cowork の VM で git を使う場合

- 先に houki-hub フォルダーの削除許可を取る（git が .git/*.lock を残すため。接続し直すと許可が消える）
- VM の git には user.name が無いので、GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（GIT_COMMITTER_* も同じ）を渡す
- 作業ツリーの main を切り替えずにブランチを作るなら、一時的な GIT_INDEX_FILE と hash-object -w / update-index --cacheinfo / write-tree / commit-tree / update-ref で作る。.git/objects の tmp_obj が消せないときは git -c core.createObject=rename を付ける
- npm install / npm rebuild はしない（node_modules は Mac と共有）。検査は $HOME/tmp に git clone --shared した作業コピーで、node_modules をリンクして行う

## 確かめること（各ブランチで）

- npx spec-ids check が exit 0
- node .github/scripts/check-pr-scope.mjs（spec/* ブランチは specs/changes/ だけを変えている。承認日の空欄の指摘だけが出る）
- 差分が指す current の仕様 ID が実在する（MODIFIED の ID が current にある、REMOVED があればその ID を指す本文が残らない）

## 終わったら報告すること

- ブランチ・コミット・ADDED / MODIFIED / REMOVED の件数（リポジトリ × テーマの 4 本）
- 各 proposal.md の「人が判断すること」の要点
- T5 の「実装 PR で直す文書」の行数
- 0.16.0 / 0.22.0 で既に片付いていた Issue の行（Issue にコメントして消す候補）
- PR の本文の草案（Refs #N と、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
- houki-hub の docs/notes/2026-09-29-plan-spec-issues.md の「段階 4 の進捗」に足す段落の草案（書き込みは shuji の確認の後）
```

---

## 前半から持ち越した、shuji が行うこと

- houki-hub の main を push する（origin より先行）
- Mac で `node scripts/generate-stack.mjs --readme` を回し、`stack.json` と README の表を egov 0.16.0 / nta 0.22.0 / skill 0.16.1 に上げる
- 0.16.0 / 0.22.0 の実装 PR の `Closes` に書いた Issue（egov は #46・#47・#48・#49・#52・#53・#54・#57・#69）が、GitHub で閉じているか確かめる
- 段階 6 の houki-hub の呼び出し例（`get_law_file.md` の 50 MB の `INVALID_ARGUMENT`、`nta_get_kaisei_tsutatsu.md` の `TSUTATSU_NOT_FOUND`、`resolve_abbreviation.md` の `in_scope` など）を、0.16.0 / 0.22.0 の分だけ先に出すか、段階 5 の後にまとめるかを決める
