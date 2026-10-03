# 次の計画（段階 6 と、計画の後に立った Issue）を立てる会話への指示（2026-10-04 JST）

`2026-09-29-plan-spec-issues.md`（Issue 57 件の対応計画）は、2026-10-04 に「Issue の対応としては完了」として締めた（同ファイルの末尾「この計画の締め」）。残った段階 6 と、計画の後に立った Issue を 1 つの新しい計画にまとめるため、別の会話に渡す指示です。下の text ブロックを新しい会話にそのまま貼ります。

---

## 指示 P: 次の計画を立てる

```text
houki-hub family の次の対応計画を立ててください。対象は (1) 前の計画で残った「段階 6」と最後の契約の確認、(2) 前の計画の後に立った Issue 9 件です。この会話の役は計画を立てることで、仕様 PR・実装は書きません（それぞれ別の会話に渡す指示までを作ります）。

## 場所

- houki-hub: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）。main は 9be6b65（2026-10-04 時点）
- houki-egov-mcp: houki-hub/mcp/houki-egov-mcp。main f3b7fc1 = v0.19.0
- houki-nta-mcp: houki-hub/mcp/houki-nta-mcp。main 527322a = v0.24.0
- houki-abbreviations: houki-hub/lib/houki-abbreviations。main 21fbdd7（0.7.0）
- houki-research-skill: houki-hub/skill/houki-research-skill。main 7e07f03 = 0.18.0
- 作業の前に、各リポジトリの main が origin と同じか git ls-remote で確かめる

## 最初に読むもの（この順）

1. houki-hub の docs/notes/2026-09-29-plan-spec-issues.md。とくに 4 章（段階の分け方）、5 章（劣化を起こさないための決まり。5.2 の契約の確認）、7 章（版の予定）、9 章の末尾「この計画の締め（2026-10-04 JST）」。新しい計画の形はこの文書に合わせる
2. houki-hub の docs/DECISIONS.md（T1〜T5 の規則。今後の Issue もこの規則で判断する）
3. 各 MCP の AGENTS.md と CONTRIBUTING.md（仕様 PR と実装 PR の 2 本運用、spec-gate、pr-scope、役割）
4. 前の計画の最後の確認の記録: docs/notes/2026-10-03-regression-check-egov-0.17.0-nta-0.23.0.md（方法と「見つかったこと」）
5. 各 Issue の本文とコメント。gh が無ければ curl https://api.github.com/repos/shuji-bonji/<repo>/issues/<N>（認証なしは 1 時間 60 回まで）
6. 関係する引き継ぎの文書: docs/notes/2026-10-04-handoff-egov-db-path.md、docs/notes/issues-2026-10-04-egov-bulk/、docs/notes/issues-2026-10-04-db-path/、docs/notes/issues-2026-10-04-nta-0.24.0-followups/

## 計画に入れるもの (1): 前の計画から引き継ぐもの

| # | 内容 | 入力 |
| --- | --- | --- |
| C | 5.2 の契約の確認を egov 0.19.0 / nta 0.24.0 で全 47 例について行う（劣化 0 件の確認。まだ行っていない）。DB は egov・nta とも 2026-10-04 に新しい状態 | 2026-10-03 の回の記録の方法。scripts/reference-examples/{houki-egov,houki-nta}/ja/*.md |
| 6a | 呼び出し例の取り直し: 段階 2〜5 で振る舞いが変わったツールの例を新しい版で実測し直す（見出しは変えず、実測の版と JSON を差し替える） | 2026-10-03 の回の「見つかったこと」1・2（get_law_file の 50 MB の文、nta_get_kaisei_tsutatsu の TSUTATSU_NOT_FOUND、resolve_abbreviation の aliases、T4 の null のフィールド）、egov・nta の specs/releases/v0.18.0・v0.19.0・v0.24.0 の各 proposal.md の「呼び出し例への影響」 |
| 6b | リファレンスの再生成（node scripts/generate-reference.mjs。shuji の Mac で回す） | — |
| 6c | houki-hub#27 の仕様書ページ（specs/current/<dir>/spec.md から生成）と、docs/notes/2026-09-29-scope-by-audience.md の 2 節・4 節を site に載せること | 前の計画の段階 6 の表 |
| 6d | houki-hub#26 を閉じる判断 | 前の計画の段階 6 の表 |
| 6e | houki-hub#5 の②（CI でのリファレンスの再生成）をいつ入れるか（前の計画の 8 章の未決） | houki-hub#5 |

## 計画に入れるもの (2): 前の計画の後に立った Issue（2026-10-04 時点で open）

| リポジトリ | Issue | 内容（要約） | 備考 |
| --- | --- | --- | --- |
| houki-egov-mcp | #107 | 施行日の当日に e-Gov が配り直す版を、取り込みが unchanged として飛ばす。施行後も未施行のまま、旧版が現行のまま残り、search_fulltext が改正前の条文を返す | **期限がある。** 次に起きるのは 2026-11-01（消費税法の 363AC0000000108_20261101_507AC0000000013 など）。`--sync` でも全件の取り込み直しでも直らない |
| houki-egov-mcp | #108 | search_fulltext の api-fallback の note と案内のコマンドが、DB が無い・別のファイルを開いている・版が合わないを区別しない。案内の `houki-egov-mcp …` はそのままでは動かないことがある | 2026-10-04 の追記: freshness.db_path と起動時のログに DB のパスを出す（A） |
| houki-egov-mcp | #110 | 開いている DB の場所と、同じフォルダーに残っている別の版の DB を確かめるコマンド。`--status` の警告（B） | #108・#111・nta #138 と同じ方針で決める |
| houki-egov-mcp | #111 | 次に DB の版を上げるとき、既定のファイル名に版を入れるか（E） | 今すぐは変えない前提。決めた内容は DECISIONS.md へ |
| houki-egov-mcp | #105 | 法令名の完全一致の照合（0.18.0）で、時点（asof）の題名を取りこぼす可能性。確かめることが先 | ずれが見つかったら specs/changes の差分にする |
| houki-nta-mcp | #138 | #108（A）・#110（B）・#111（E）の nta 版（cache.db、--db-path、HOUKI_NTA_DB_PATH） | egov と同じ方針 |
| houki-nta-mcp | #137 | readStoredTaxAnswerIndex が SQL の例外をすべて null にし、壊れた表と表が無い DB を区別できない | 0.24.0 の実装 PR #136 のレビューで「止めるほどではない」とされた点 |
| houki-nta-mcp | #116 | 基本通達の範囲（消・所・法・相の 4 種）を、財産評価・措置法関係・通則・徴収・印紙・税理士法などに広げるか | 機能の拡張。まず範囲を検討する。裁決は houki-saiketsu-mcp 側 |
| houki-abbreviations | #35 | e-Gov 法令検索のメンテナンスで API が 403 になった記録（2026-10-01） | 不具合ではない。メンテナンスが終わっていれば、CI が通ることを確かめて閉じられるかを判断する |

## 計画書に書くこと

- 置き場所: houki-hub の docs/notes/<作業日の yyyy-mm-dd>-plan-stage6-and-followups.md。houki-hub の docs/ は main に直接コミットしてよい（コミットは私が行う）
- 2026-09-29 の計画と同じ章立てを基本にする: 時点の状態、Issue の割り付け（種類・害・段階）、依存関係（Mermaid）、着手の順序、劣化を起こさないための決まり（前の計画の 5 章を引き継ぎ、足すものだけ書く）、版の予定、決定の記録、まだ決めていないこと
- 順序の考え方として、少なくとも次を検討して書く
  - C（契約の確認）を最初に行うか。行うなら、6a の取り直しと同じ実測で兼ねられるか
  - egov #107 は 2026-11-01 より前に出す必要があるか。出すなら、DB のスキーマを変えるか（変えるなら #111 の「ファイル名に版を入れる」と同じ版で決める必要がある）
  - #108・#110・#111・nta #138 を 1 つのテーマ（DB の場所の見え方）として egov と nta で同じ仕様にするか。決めた規則は DECISIONS.md に書く
  - 6a の取り直しは、新しい版の publish の後にまとめるか、今の版で先に行うか（版が変わるたびに取り直しになる）
  - #116 をこの計画に入れるか、別の構想として外すか
- 各段階について、別の会話に渡す指示（仕様 PR の指示、実装 PR の指示、Skill の追随の指示）の形を決める。前の計画では docs/notes/2026-10-03-stage5-spec-instructions.md と 2026-10-04-stage5-impl-instructions.md の形を使った

## 守ること

- 判断が要る点は、案を並べて勧める案を 1 つ書き、「人が判断すること」として私に聞く。私が決めたことは計画書の「決定の記録」に日付つきで書く
- 事実（版・コミット・Issue の内容・実測の値）は、確かめた日と方法を添える。確かめていないことは「確かめていない」と書く
- 文書は「〜します」「〜です」で、比喩を使わず、フィールド名・コマンド・エラーの文など目に見える名前で書く
- GitHub への投稿（Issue の起票・コメント）は、このセッションからはできないことがある。そのときは本文を docs/notes/ に置き、私が Mac で実行する gh のスクリプト（scripts/ の既存のものと同じ形。DRY_RUN と posted.tsv 付き）を用意する
- Cowork の VM（device_bash）で git を使う前に houki-hub フォルダーの削除許可を取る（.git の index.lock や objects/maintenance.lock が残るため）。npm install・npm rebuild はしない（node_modules は Mac と共有）。VM から npm の registry には届かない

## 終わったら報告すること

- 計画書のパスと、章ごとの要点
- 「人が判断すること」の一覧（勧める案つき）
- 最初に着手する作業と、その指示（別の会話に貼る text ブロック）
- 契約の確認（C）をこの会話で行った場合は、その記録のパスと劣化の件数
```

---

## 補足（指示 P の外）

- 前の計画の文書の流れ: `2026-09-29-plan-spec-issues.md`（計画）→ `2026-10-03-stage5-spec-instructions.md`（仕様 PR の指示 H〜K）→ `2026-10-04-stage5-impl-instructions.md`（実装の指示 L〜O）→ `2026-10-03-regression-check-egov-0.17.0-nta-0.23.0.md`（契約の確認の記録）
- egov #107 は期限（2026-11-01）があるので、計画を立てる会話の最初に、#107 を他より先に出すかを決めてもらうとよい
