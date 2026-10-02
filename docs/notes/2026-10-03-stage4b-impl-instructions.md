# 段階 4 後半の実装 PR の指示（egov 0.17.0 / nta 0.23.0）

2026-10-03（JST）に Spec Steward の会話で作った、実装を別の会話に渡すための指示です。仕様 PR（T4・T5）は egov・nta とも承認・マージ済みです（egov PR #91・#92、nta PR #124・#126。main は egov `3105adb`、nta `15edd5d`）。AGENTS.md の決まり（Steward と Coder は同じ会話で起動しない）に従い、実装は新しい会話で行います。

- 指示 E: houki-egov-mcp 0.17.0（新しい会話にそのまま貼る）
- 指示 F: houki-nta-mcp 0.23.0（別の新しい会話にそのまま貼る）
- 指示 G: 2 つを publish した日に houki-research-skill を 0.17.0 として追随させる（さらに別の会話）

E と F は別リポジトリなので並行してよい。G は E と F の両方を publish した後。前半（T1〜T3）の指示は `2026-10-01-stage4-impl-instructions.md`（A〜C）、後半の仕様 PR の指示は D です。

---

## 指示 E: houki-egov-mcp 0.17.0

```text
houki-egov-mcp の段階 4 後半の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR は 2 本とも承認・マージ済みで、この会話では仕様の意図を変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-egov-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-egov-mcp）
- 起点: main の 3105adb（T5 のマージ）。作業の前に git fetch https://github.com/shuji-bonji/houki-egov-mcp.git main で main が origin と同じか確かめる
- ブランチ: feat/20261003-0.17.0
- 版: 0.16.0 → 0.17.0
- この PR で閉じる Issue: #56 #64 #65 #66

## 最初に読むもの（この順）

1. AGENTS.md（PR の種類・役割・仕様 ID・ff マージ）と CONTRIBUTING.md の「コーディング規約」
2. specs/changes/20261003-t4-response-shape/ の proposal.md と specs/*/spec.md（PR #91）
3. specs/changes/20261003-t5-docs-mismatch/ の proposal.md と specs/*/spec.md（PR #92）。とくに「実装 PR で直す文書」の表
4. 差分が参照する specs/current/<dir>/spec.md の仕様 ID
5. 前の版の実装 PR の形の手本: specs/releases/v0.16.0/ と CHANGELOG.md の 0.16.0

各 proposal.md の「人が判断すること」は、書かれている側で承認済みです。仕様の本文が正で、proposal.md の表は要約です。仕様に書かれていない判断が要ったら、実装で決めずに止めて私に聞いてください。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。it の名前の先頭に仕様 ID を入れる（例: it('SPEC-EGOV-GET-LAW-040 ...')）
- テストを消して GREEN にしない。既存のテストの期待値が承認済みの差分で変わるとき（「meta に at のキーが無い」「data に paragraph_num が無い」「INTERNAL_ERROR は retryable: true で retry_later」「UNKNOWN_TOOL の error は Unknown tool」「see_also は docs/LAW-HIERARCHY.md」など）は、その差分の仕様 ID を名前に入れて書き換える
- 値の無いフィールドは null で置き、キーを消さない（T4）。消すフィールド・名前を付け替えるフィールドは作らない。例外は SPEC-EGOV-COMMON-ERRORS-018 の INTERNAL_ERROR の next_actions だけ（承認済み）
- TS のコードで文字列を + でつながない（テンプレートリテラル）
- 公開文書（README・tools/list の description・CLI の使い方）の文は「〜します」「〜です」で書く
- 仕様と実装の食い違いや、仕様どおりにすると壊れる箇所を見つけたら、コードで勝手に合わせずに報告する（新しい specs/changes が要る）
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. test: T4 … → feat: T4 …（#64・#65・#66）
2. test: T5 … → fix: T5 …（#56）
3. docs: … T5 の「実装 PR で直す文書」の 6 行（README・CLI の使い方・tools/list の description）
4. chore: v0.17.0 — package.json・server.json の版と CHANGELOG
5. spec: 20261003-t4/t5 を specs/current/ に取り込み、releases/v0.17.0/ へ移す（最後のコミット）

test: のコミットでは新しいテストが落ち、次の feat: / fix: で通ることを確かめる。T4 と T5 のコミットを分けにくい箇所があれば、T4 → T5 の順を崩さずに分ける。

## 実装の要点（詳しくは差分の spec.md が正）

- T4 meta: meta を持つ 10 ツール（get_law・get_toc・get_law_range・get_law_revisions・get_related_laws・get_article_references・list_attachments・get_attachment・get_law_file・verify_citations）で meta.at を常に置く。at: opts.at は undefined のとき JSON に出ないので opts.at ?? null にする。get_law の目次の meta に at を足す。get_law_revisions と get_related_laws は常に null
- T4 get_law: json の data.paragraph_num / item_num を常に置き、item だけで項を補ったときは paragraph_num: 1（SPEC-EGOV-GET-LAW-040）。get_article_references の meta.paragraph も常に置く
- T4 get_law_range: 続きの例（range.next_actions[0].example）に、呼び出し側が渡した max_chars と at だけを入れる（省いた引数は入れない。SPEC-EGOV-GET-LAW-RANGE-008）
- T4 get_law_revisions: 施行日の新しい順に安定ソートし（同じ日は e-Gov の順、施行日 null は先頭。016）、8 つのキーを ?? null で埋める（002）。017（状態の値は e-Gov のまま）は今の振る舞いなので受入テストを足すだけ
- T4 get_attachment: ファイル名での照合で当たった件数を数え、2 件以上なら SPEC-EGOV-GET-ATTACHMENT-029 の INVALID_ARGUMENT（tool・retryable: false・detail.issues・候補ごとの next_actions、渡したときは at と save を example に）
- T4 get_law_file: saved.law_revision_id は Content-Disposition のファイル名からだけ読む（ファイル名が無いときは null。保存先は <law_id>/<law_id>.<file_type> のまま。003）。Content-Disposition の読み取りは filename* を先に探す（ヘッダーの中の順によらない。004）
- T5: src/server.ts の UNKNOWN_TOOL は error「存在しないツールです: <name>」と retryable: false。想定外の例外の INTERNAL_ERROR は retryable: false で next_actions を渡さない（SPEC-EGOV-COMMON-ERRORS-031 の INTERNAL_ERROR は変えない）。explain_law_type の see_also は 2 か所とも GitHub の URL（SPEC-EGOV-EXPLAIN-LAW-TYPE-020）
- 文書 5（get_law_revisions の description の並びの文）は T4 の並べ替えと同じ PR に入るので、docs: のコミットで直してよい

## CHANGELOG の 0.17.0

- 日付は仮に 2026-10-03 と書く。publish する日に私が直す
- 「互換性」の節に次を書く（各項目に Issue 番号と仕様 ID）
  - T4: 今まで「キーが無い」だった場面で null になるフィールド（meta.at、data.paragraph_num / item_num、meta.paragraph、revisions[] の 8 つのキー、saved.law_revision_id）。キーの有無で読む側は値で読むように直す必要があること
  - T4: get_law_revisions はツールが施行日の新しい順に並べる（2026-10-03 の e-Gov の順と同じなので見た目は変わらない）
  - T4: get_attachment のファイル名だけの src が 2 件以上に当たると、成功（先の添付）から INVALID_ARGUMENT に変わる
  - T4: get_law_file の Content-Disposition が無いときの saved.law_revision_id が法令 ID から null に変わる。filename* を優先する
  - T5: INTERNAL_ERROR が retryable: false になり、next_actions（retry_later）が無くなる。UNKNOWN_TOOL の error が日本語になり retryable: false が付く。explain_law_type の see_also が GitHub の URL になる
- code は変えていないことを書く

## 取り込み（最後のコミット）

- 2 つの proposal.md の「取り込みのとき（Publisher）」に従う。ADDED は「できること」の末尾に足し、MODIFIED は見出しの行（題）も含めて差分の見出しと本文に置き換える。「処理の流れ」の図・「エラーの code」の表・「未決」の項目も指示どおりに直す
- 各 spec.md の承認日の行に「差分 `20261003-t4-response-shape` は <proposal.md の承認日>（PR #91）」「差分 `20261003-t5-docs-mismatch` は <proposal.md の承認日>（PR #92）」を足す。日付は各 proposal.md の「- 承認日:」の行の値をそのまま写す
- git mv で specs/changes/20261003-t4-response-shape・20261003-t5-docs-mismatch を specs/releases/v0.17.0/ へ移し、各 proposal.md の「状態」を「取り込み済み（v0.17.0）」にする
- npx spec-ids check（specs/current の ID にすべてテストがある）と、BASE_REF=main HEAD_REF=feat/20261003-0.17.0 node .github/scripts/check-pr-scope.mjs を通す

## 検証

- npm run build・npm test・npm run lint・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す
- Cowork の VM（device_bash）で作業する場合: git を使う前に houki-hub フォルダーの削除許可を取る（.git の lock が残るため。接続し直すと許可が消える）。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す。node_modules は Mac と共有しているので npm install・npm rebuild はしない（better-sqlite3 などが Linux 用に上書きされる）。VM から npm の registry と GitHub の SSH には届かない
- publish の前の「契約の確認」（計画書 5.2）は私が Mac で行う。対象は変えたツール（get_law・get_toc・get_law_range・get_law_revisions・get_related_laws・get_article_references・list_attachments・get_attachment・get_law_file・verify_citations・explain_law_type）の houki-hub scripts/reference-examples/houki-egov/ja/ の例。期待する差分（meta.at: null が足される、など）を報告に一覧で書く

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果
- 仕様に無い判断が要った点、食い違いの報告
- 契約の確認で出るはずの差分の一覧（ツールごと）
- PR 本文の草案（Closes #56 #64 #65 #66、仕様 PR #91 #92 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 F: houki-nta-mcp 0.23.0

```text
houki-nta-mcp の段階 4 後半の実装 PR を作ってください。この会話の役は Test Designer → Coder → Spec Publisher です（AGENTS.md の「役割」）。仕様 PR は 2 本とも承認・マージ済みで、この会話では仕様の意図を変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/mcp/houki-nta-mcp（Cowork の device_bash では $HOME/mnt/houki-hub/mcp/houki-nta-mcp）
- 起点: main の 15edd5d（T5 のマージ）。作業の前に git fetch https://github.com/shuji-bonji/houki-nta-mcp.git main で main が origin と同じか確かめる
- ブランチ: feat/20261003-0.23.0
- 版: 0.22.0 → 0.23.0
- この PR で閉じる Issue: #70 #71 #82 #108

## 最初に読むもの（この順）

1. AGENTS.md（PR の種類・役割・仕様 ID）と CONTRIBUTING.md
2. specs/changes/20261003-t4-response-shape/ の proposal.md と specs/*/spec.md（PR #124）
3. specs/changes/20261003-t5-docs-mismatch/ の proposal.md と specs/*/spec.md（PR #126）。とくに「実装 PR で直す文書」の表
4. 差分が参照する specs/current/<dir>/spec.md の仕様 ID
5. 前の版の実装 PR の形の手本: specs/releases/v0.22.0/ と CHANGELOG.md の 0.22.0

各 proposal.md の「人が判断すること」は、書かれている側で承認済みです（meta は足さない、索引の印は null で常に置く、「取得元」の行は 3 ツール、taxAnswer.basisDate を足す、available_clauses は 50 件、INTERNAL_ERROR / UNKNOWN_TOOL は egov に揃える、など）。仕様の本文が正で、proposal.md の表は要約です。仕様に書かれていない判断が要ったら、実装で決めずに止めて私に聞いてください。

## 守ること

- specs/changes/ は書き換えない。specs/current/ は最後の取り込みのコミットでだけ書く
- テストは仕様の本文と「例:」から書き、実装を見て期待値を足さない。既存のテストと同じく it（または describe）の名前の先頭に仕様 ID を入れる
- テストを消して GREEN にしない。既存のテストの期待値が承認済みの差分で変わるとき（「索引にある文書には index_status が無い」「issuedAt が無い」「0 件のときに count が無い」「INTERNAL_ERROR は retryable: true」「TSUTATSU_NOT_FOUND の案内は --bulk-download」など）は、その差分の仕様 ID を名前に入れて書き換える
- 値の無いフィールドは null で置き、キーを消さない（T4）。例外は SPEC-NTA-COMMON-ERRORS-006 の INTERNAL_ERROR の next_actions だけ（承認済み）
- TS のコードで文字列を + でつながない（テンプレートリテラル）
- 公開文書（README・tools/list の description・CLI の使い方）の文は「〜します」「〜です」で書く
- 仕様と実装の食い違いや、仕様どおりにすると壊れる箇所を見つけたら、コードで勝手に合わせずに報告する（新しい specs/changes が要る）
- コミットを作るところまで。署名・push・PR の作成・マージ・タグは私が行う

## コミットの順

1. test: T4 … → feat: T4 …（#71・#82）
2. test: T5 … → fix: T5 …（#70・#108 と、INTERNAL_ERROR / UNKNOWN_TOOL）
3. docs: … T5 の「実装 PR で直す文書」の 8 行（README・CLI の使い方・tools/list の description・hint の文）
4. chore: v0.23.0 — package.json・server.json の版と CHANGELOG
5. spec: 20261003-t4/t5 を specs/current/ に取り込み、releases/v0.23.0/ へ移す（最後のコミット）

test: のコミットでは新しいテストが落ち、次の feat: / fix: で通ることを確かめる。

## 実装の要点（詳しくは差分の spec.md が正）

- T4 検索: 文書系 5 ツールの results[] に issuedAt と basisDate を全種別で置く（SPEC-NTA-SEARCH-RULES-015）。issuedAt は改正通達・事務運営指針・文書回答事例だけ DB の値で、質疑応答事例とタックスアンサーは null。basisDate はタックスアンサーだけ document.issued_at（bulk download が parseEffectiveDate で法令時点から入れた値）で、ほかは null
- T4 索引の印: indexStatusFields は索引にある文書でも { index_status: null, orphaned_at: null } を返す（SPEC-NTA-SEARCH-RULES-011）。取得ツールの json は notice と document.orphanedAt も null（各 004）
- T4 nta_search_tsutatsu: 0 件で count: 0・freshness・legal_status を足す。base_laws_by_tsutatsu と next_actions は付けない（005・010）
- T4 nta_get_tsutatsu: 国税庁サイトの経路の available_clauses を 50 件で切る（010）
- T4 取得ツールの json: document.issuedAt / issuer、qa.notice / basisDate、taxAnswer.effectiveDate / taxCategory を ?? null で置く。taxAnswer.basisDate を足す（国税庁サイトの経路も parseEffectiveDate と同じ読み方。DB の経路は document.issued_at と同じ値になること）
- T4 markdown: 改正通達・事務運営指針・文書回答事例の `- **取得**` の行の次に `- **取得元**: ローカル DB（bulk download で取り込んだもの）`。改正通達・文書回答事例の索引の状態の行は「取得元」の行の次に置く
- T4 nta_inspect_pdf_meta: 索引の印（index_status / orphaned_at / notice。索引にあれば null）を足し、save: true なら 0 件でも saved: []（save なしは今までどおり saved を付けない）
- T4 SPEC-NTA-SEARCH-RULES-020（hits / results の名前）と SPEC-NTA-COMMON-ERRORS-017（対象を検索 6 ツールに）はコードを変えない。020 は受入テストを足す。017 は 0.22.0 の受入テストのまま
- T5 common_errors: UNKNOWN_TOOL は error「存在しないツールです: <name>」と retryable: false（002）。想定外の例外の INTERNAL_ERROR は retryable: false で next_actions を渡さない（006）。ページの解析の失敗の 3 か所に retryable: false（009）。017 の INTERNAL_ERROR は変えない
- T5 resolve_abbreviation: 管轄外で source_mcp_hint が houki-egov なら今の hint に NEXT_ACTIONS.delegateTo('houki-egov') を足す。それ以外（辞書 0.7.0 には無い）は「対応する MCP サーバーはまだありません」の hint で next_actions を付けない（003）。辞書に該当するエントリが無いので、後者は hint と next_actions を組み立てる関数の単位でテストしてよい
- T5 nta_search_tsutatsu: 空の DB の hint と next_actions を --bulk-download-all に（003）。NEXT_ACTIONS.bulkDownload() は nta_get_tsutatsu（SPEC-NTA-GET-TSUTATSU-007）でも使っているので、そちらの案内は変えない
- T5 nta_search_tax_answer: ヒットしたとき next_actions に { action: "nta_get_tax_answer", reason: "記事の本文を読めます", example: { no: results[0].docId } }（006）。0 件では付けない

## CHANGELOG の 0.23.0

- 日付は仮に 2026-10-03 と書く。publish する日に私が直す
- 「互換性」の節に次を書く（各項目に Issue 番号と仕様 ID）
  - T4: 今まで「キーが無い」だった場面で null になるフィールド（検索の results[].issuedAt・index_status・orphaned_at、取得の json の document.issuedAt / issuer / orphanedAt・qa.notice / basisDate・taxAnswer.effectiveDate / taxCategory・index_status・orphaned_at・notice）。キーの有無で「索引から消えたか」を見ていた側は値で見るように直す必要があること
  - T4: 足したフィールド（results[].basisDate、taxAnswer.basisDate、nta_search_tsutatsu の 0 件の count・freshness・legal_status、nta_inspect_pdf_meta の索引の印、markdown の「取得元」の行）
  - T4: nta_get_tsutatsu の国税庁サイトの経路の available_clauses が最大 50 件になる
  - T5: INTERNAL_ERROR が retryable: false になり、next_actions（retry_later）が無くなる。ページの解析の失敗にも retryable: false が付く。UNKNOWN_TOOL の error が日本語になり retryable: false が付く
  - T5: resolve_abbreviation と nta_search_tax_answer に next_actions を足した。nta_search_tsutatsu の空の DB の案内が --bulk-download-all になる
- code は変えていないことを書く

## 取り込み（最後のコミット）

- 2 つの proposal.md の「取り込みのとき（Publisher）」に従う。ADDED は「できること」の末尾に足し、MODIFIED は見出しの行（題）も含めて差分の見出しと本文に置き換える。「エラーの code」の表・「未決」の項目も指示どおりに直す（search_rules の未決 3 は書き換え、cli_refresh の未決 5 は「日より古い」に直す）
- 各 spec.md の承認日の行に「差分 `20261003-t4-response-shape` は <proposal.md の承認日>（PR #124）」「差分 `20261003-t5-docs-mismatch` は <proposal.md の承認日>（PR #126）」を足す。日付は各 proposal.md の「- 承認日:」の行の値をそのまま写す
- git mv で specs/changes/20261003-t4-response-shape・20261003-t5-docs-mismatch を specs/releases/v0.23.0/ へ移し、各 proposal.md の「状態」を「取り込み済み（v0.23.0）」にする
- npx spec-ids check と、BASE_REF=main HEAD_REF=feat/20261003-0.23.0 node .github/scripts/check-pr-scope.mjs を通す

## 実装の前に私に頼むこと（Mac のターミナルで実行してもらう）

T5 の「人が判断すること」3（8xxx 帯）と、basisDate の値の確認です。

    sqlite3 ~/.cache/houki-nta-mcp/cache.db "SELECT COUNT(*) FROM document WHERE doc_type='tax-answer'; SELECT COUNT(*) FROM document WHERE doc_type='tax-answer' AND doc_id GLOB '8*'; SELECT COUNT(*) FROM document WHERE doc_type='tax-answer' AND issued_at IS NULL;"

2 つ目が 0 件でなければ、8xxx 帯の記事があります。その場合は T5 の文書 1（「8xxx 帯と 0xxx 帯には対応していません」）を直す前に止めて報告してください（対応するかを別の Issue にします）。3 つ目は basisDate が null になる記事の件数で、報告に入れるだけでよい。

## 検証

- npm run build・npm test・npm run lint・npx spec-ids check は私の Mac か CI で通す。結果を貼るので、落ちたら直す
- Cowork の VM（device_bash）で作業する場合: git を使う前に houki-hub フォルダーの削除許可を取る（.git の lock が残るため。接続し直すと許可が消える）。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す。node_modules は Mac と共有しているので npm install・npm rebuild はしない（better-sqlite3 が Linux 用に上書きされる）。VM から npm の registry と GitHub の SSH には届かない
- publish の前の「契約の確認」（計画書 5.2）は私が Mac で行う。対象は変えたツール（検索 6 ツール・取得 6 ツール・nta_inspect_pdf_meta・resolve_abbreviation、つまり 14 ツールすべて）の houki-hub scripts/reference-examples/houki-nta/ja/ の例。期待する差分を報告に一覧で書く

## 終わったら報告すること

- コミットの一覧（ハッシュと件名）
- 新しく足したテストと書き換えたテストの数、仕様 ID ごとの対応
- spec-ids check と pr-scope の結果、上の確認の結果
- 仕様に無い判断が要った点、食い違いの報告
- 契約の確認で出るはずの差分の一覧（ツールごと）
- PR 本文の草案（Closes #70 #71 #82 #108、仕様 PR #124 #126 への言及、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```

---

## 指示 G: houki-research-skill 0.17.0（egov 0.17.0 と nta 0.23.0 を publish した日）

```text
houki-egov-mcp 0.17.0 と houki-nta-mcp 0.23.0 を publish しました。同じ日に houki-research-skill を 0.17.0 として追随させてください。この会話の役は Skill の文書の追随です。MCP の仕様（各 MCP の specs/current/）は変えません。

## 場所と版

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub/skill/houki-research-skill（実体は skills フォルダー側。Cowork の device_bash では $HOME/mnt/houki-hub/skill/houki-research-skill）
- ブランチ: docs/20261003-egov017-nta023
- 版: 0.16.1 → 0.17.0（.claude-plugin/plugin.json と CHANGELOG.md）

## 最初に読むもの

1. CHANGELOG.md の 0.16.0・0.16.1（前回の追随の書き方）
2. scripts/mcp-refs.config.json、scripts/update-mcp-snapshots.mjs と scripts/check-mcp-refs.mjs の冒頭のコメント、.github/workflows/ci.yml
3. 正本: ../../mcp/houki-egov-mcp/specs/current/common_errors/spec.md と ../../mcp/houki-nta-mcp/specs/current/common_errors/spec.md（0.17.0 / 0.23.0 を取り込んだ後）、両 MCP の CHANGELOG.md の 0.17.0 / 0.23.0 の「互換性」の節
4. 両 MCP の specs/releases/v0.17.0/・v0.23.0/ の T4・T5 の proposal.md（何が null になったか、何を足したか）

## 手順

1. GitHub の v0.17.0 / v0.23.0 のタグと MCP Registry への publish は 2026-10-03 に確かめ済み。npm の版だけ私（Mac）に確かめてもらう（VM の npm は 403 になる）
   - npm view @shuji-bonji/houki-egov-mcp version → 0.17.0
   - npm view @shuji-bonji/houki-nta-mcp version → 0.23.0
2. scripts/mcp-refs.config.json の houki-egov を 0.17.0、houki-nta を 0.23.0 にする
3. 私の Mac で node scripts/update-mcp-snapshots.mjs を実行してもらい、mcp-snapshots/ の差分を確かめる。見込みは「errorCodes・ツール名・引数名・必須はどちらも変わらない」（T4・T5 は code と inputSchema を変えていない）。違ったら止めて報告する
4. 文書を直す（下の一覧）
5. node --test 'scripts/test/*.test.mjs'、node scripts/check-mcp-refs.mjs、node scripts/update-mcp-snapshots.mjs --check を通す（最後の 1 つは Mac で）
6. plugin.json の版と CHANGELOG.md の 0.17.0 を書く

## 直すもの

- skills/houki-research/docs/ERROR-CODES.md の「retryable の読み方」の節: INTERNAL_ERROR は両 MCP とも retryable: false（想定外の例外もページの解析の失敗も）になったので、「処理中の想定外の例外では retryable: true」の例を書き換える。UNKNOWN_TOOL も両 MCP で retryable: false
- skills/houki-research/docs/ERROR-HANDLING.md の「INTERNAL_ERROR / UNKNOWN_TOOL」の節: 再試行を勧める記述があれば外し、「再試行せず、再現手順を添えて報告する」に揃える（next_actions の retry_later は無くなった）
- skills/houki-research/SKILL.md の索引の印の節（210 行目付近）: 「index_status: "removed_from_index" と orphaned_at が付いていたら」を「index_status が "removed_from_index" なら」にする（houki-nta-mcp 0.23.0 から、索引にある文書でも index_status: null が付く）。docs/ARCHITECTURE.md と docs/CITATION.md の同じ語も見直す
- 値の有無の読み方: houki-egov-mcp の meta.at（渡さないときは null）、houki-nta-mcp の results[].issuedAt / basisDate（タックスアンサーの日付は basisDate で、発出日ではない）について、Skill の文（citation の時点の書き方、発出日で新しい文書を選ぶ手順など）がキーの有無を前提にしていれば値で読む文に直す。basisDate を発出日として引用しないことを docs/CITATION.md に 1 行足す
- get_law_revisions の「最新」が施行日の新しい順（未施行を含む）であること、いま効力のある版は current_revision_status が CurrentEnforced の要素であることを、改正履歴を引く手順に書いていなければ足す
- examples/ と workflows/ の応答の例で、0.17.0 / 0.23.0 で変わった形（null のキー、resolve_abbreviation の next_actions、nta_search_tax_answer の next_actions）を載せているものがあれば、両 MCP の仕様の本文に合わせる
- タックスアンサーの 8xxx 帯（2026-10-03 追記）: 作者の DB には 8xxx 帯のタックスアンサーが 16 件ある。nta_search_tax_answer はこれを返し、ヒットの先頭が 8xxx なら next_actions（SPEC-NTA-SEARCH-TAX-ANSWER-006）が nta_get_tax_answer を案内するが、nta_get_tax_answer は 8xxx を INVALID_ARGUMENT で断る（SPEC-NTA-GET-TAX-ANSWER-002。DB も引かない）。タックスアンサーを読む手順に「8xxx 帯の docId は nta_get_tax_answer で取れない。results[].sourceUrl を案内する」を 1 行足す。MCP 側の扱い（8xxx に対応するか、006 で 8xxx を案内しないか）は houki-nta-mcp の別の Issue で決めるので、Skill では今の動きだけを書く
- houki-nta-mcp 0.23.0 の CHANGELOG の「互換性」には、取得 3 ツールの json の document.taxonomy も DB に税目が無ければ null になると書かれている。税目で分岐する記述があれば値で読む文にする
- 段階 6 の houki-hub の呼び出し例（scripts/reference-examples/）とリファレンスの再生成は、この PR に入れない

## 守ること

- 各 MCP の仕様と CHANGELOG を正本にし、Skill 側で code やフィールドの意味を新しく決めない。正本と合わない記述を見つけたら直さずに報告する
- 文字列の連結（スクリプトを触る場合）は + を使わずテンプレートリテラル
- コミットを作るところまで。署名・push・PR・マージ・タグは私が行う
- Cowork の VM で git を使うなら、先に houki-hub と skills の両方のフォルダーの削除許可を取る。VM の git には user.name が無いので GIT_AUTHOR_NAME="shuji narumi" GIT_AUTHOR_EMAIL="71716610+shuji-bonji@users.noreply.github.com"（COMMITTER も同じ）を渡す

## 終わったら報告すること

- コミットのハッシュと件名
- mcp-snapshots/ の差分（code とツールの増減。見込みどおり無いか）
- check-mcp-refs.mjs の結果
- 正本と合わずに直さなかった記述
- PR 本文の草案（houki-egov-mcp 0.17.0・houki-nta-mcp 0.23.0 への追随であること、末尾に 🤖 Generated with [Claude Code](https://claude.com/claude-code)）
```
