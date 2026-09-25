# houki-nta-mcp#50 残り 12 ツールの PR 本文（初版起こし）

- 日付: 2026-09-26（JST）
- 使い方: ツールごとの PR を開くときは、そのツールの節をそのまま PR 本文に貼る。まとめブランチ `spec-init/issue-50-remaining` で 1 本の PR にするときは、末尾の「まとめ PR の本文」を貼り、各ツールの節はレビューの手引きとして読む


---

# nta_get_tax_answer（ブランチ `spec-init/nta-get-tax-answer`）

### 何をしたか

`nta_get_tax_answer` の仕様の正本 `specs/current/nta_get_tax_answer/spec.md` の初版を起こしました（Issue #50「specs/ を構築」の一環）。v0.21.0 の実装とテストを読み、「できること」に SPEC-NTA-GET-TAX-ANSWER-001〜008 の 8 件の ID を振りました。

既存テスト 7 件（`src/tools/handlers.test.ts` 5 件、`src/tools/get-db-first.test.ts` 2 件）の名前の先頭に ID を足します。期待値と本文は変えません。1 つのテストが 2 つの振る舞いを確かめているものが 2 件あり（`format=json …` に 003 と 008、`1 回取得すると …` に 004 と 006）、そこには ID を 2 つ付けます。

注意: `Markdown（既定）で本文・出典・legal_status を含む` という名前は `nta_get_tsutatsu` のテストにも（`SPEC-NTA-GET-TSUTATSU-011` 付きで）あります。ID を足すのは `describe('getTaxAnswer — 6101 (消費税) を取得')` の中の、まだ ID の付いていないほうです。

`itIntegration('getTaxAnswer: 実 nta.go.jp から 6101 …')` には、`nta_get_qa` の初版と同じく ID を付けていません。

### 未決（9 件）

意図か不具合かを判断してほしい点です。

1. 存在しない番号で国税庁サイトが 404 を返したとき `SOURCE_API_ERROR`（`retryable: true`）になる。番号の誤りと取得の失敗を分けるか（`DOC_NOT_FOUND` にするか）。
2. `no` の全角の数字（`"６１０１"`）を `INVALID_ARGUMENT` にしている。`nta_get_tsutatsu` の `clause` のように半角に揃えるか。
3. `no` の桁数を確かめない（`"61010"`・`"6"` も通る）。4 桁に限るか。
4. 未対応の番号帯のエラー文に「houki-nta-mcp v0.2.x では未対応」「Phase 2 で対応予定」と古い版が書かれている。文言を直すか、`8xxx` 帯を対応する意図があるか。
5. ページの解析に失敗したときの `INTERNAL_ERROR` はテストが無い（受入テストを書いてから ID を振る）。
6. 索引から消えた記事の印（`index_status` / `orphaned_at` / `notice`、markdown の「索引の状態」の行）はテストが無い（受入テストを書いてから ID を振る）。
7. v0.16.0 より前に入れた構造の無い行を国税庁サイトから取り直す動きはテストが無い（受入テストを書いてから ID を振る）。
8. `--bulk-download-tax-answer` で入れた行を DB から返す経路は、テストが書き戻し経路しか確かめていない。bulk download の行で確かめる受入テストを足すか。
9. `taxAnswer.no` を引数ではなくページの見出しから読む。見出しが `No.xxxx` の形でないと空文字になり、その番号で DB に入る。意図か不具合か。

### `specs/changes/` の候補

- 未決 1（404 を `DOC_NOT_FOUND` に分ける）と未決 2（全角の数字を半角に揃える）は、意図として認めるなら実装の変更を伴うので `specs/changes/` の差分になります。
- 未決 4 のエラー文の古い版の表記は、文言を直すだけなら実装 PR（`fix/`）で足ります。

Refs #50


---

# nta_get_bunshokaitou（ブランチ `spec-init/nta-get-bunshokaitou`）

## spec-init/nta_get_bunshokaitou: 仕様の初版と仕様 ID の付与

### 何をしたか

- `specs/current/nta_get_bunshokaitou/spec.md` の初版を起こしました（v0.21.0 の実装から）。「できること」の仕様 ID は 3 つ（SPEC-NTA-GET-BUNSHOKAITOU-001〜003）です。
- 既存テスト 4 件（すべて `src/tools/get-doc-not-found.test.ts` の、3 ツールを `for` で回す `it`）の名前の先頭に ID を足します。期待値と本文は変えていません。同じ `it` に他のツールの ID が並ぶのは、その担当者の PR で足されます。
- `src/tools/handlers.test.ts` はツール登録の一覧でこのツール名を挙げるだけで、応答のテストではないため ID を付けていません。

### 未決（6 件）— 人に判断してほしい点

1. `docId` の形を確かめない（空文字列や `税目/番号` でない値もそのまま DB を引く）のは意図か、検査を足すか。
2. markdown（既定）の応答の形にテストが無い。受入テストを書いてから ID を振る。
3. json の応答の形（`document` / `legal_status` / `source: "db"`）にテストが無い。受入テストを書いてから ID を振る。
4. 索引から消えた文書の印（`index_status` / `orphaned_at` / `notice`、markdown の「索引の状態」の行）にテストが無い。受入テストを書いてから ID を振る。
5. `available_doc_ids` の並びと件数（新しい順・最大 30 件）を 003 に含めるか、別の ID にするか。
6. 「DB に 1 件も無い」と「docId が無い」の両方が同じ `DOC_NOT_FOUND` で、検索ツールの 0 件も同じ `code` である。状況ごとに `code` を分けるか、v0.14.0 からの互換を優先して今のままにするか。

### `specs/changes/` の候補

- なし（実装を直したい点は見つかりませんでした。未決 1 と 6 は意図の判断が先です）。

Refs #50


---

# nta_get_jimu_unei（ブランチ `spec-init/nta-get-jimu-unei`）

## spec-init/nta_get_jimu_unei: `nta_get_jimu_unei` の仕様の初版起こし

### 何をしたか

- `specs/current/nta_get_jimu_unei/spec.md` の初版を起こしました（v0.21.0 の実装から）。「できること」の仕様 ID は `SPEC-NTA-GET-JIMU-UNEI-001` 〜 `004` の 4 つです。
- 既存テストの名前の先頭に仕様 ID を足しました（期待値と本文は変えていません）。対象は `src/tools/get-doc-not-found.test.ts` の 4 つの `it`（`for` ループで 3 ツールを回しているので、このツールの分の ID を足しました）と、`src/tools/index-status-response.test.ts` の `describe` 1 つの計 5 か所です。
- `src/tools/handlers.test.ts` はツールの登録一覧にこのツールの名前があるだけで、応答のテストではないため ID を付けていません。

### 未決（7 件）

意図か不具合かを判断してほしい点です。

1. エラー `code` が `TSUTATSU_NOT_FOUND` です。同じ取得系の `nta_get_bunshokaitou` は `DOC_NOT_FOUND` で、README の「DB を先に引く」の表もこのツールを `DOC_NOT_FOUND` と書いています。`code` を揃えるか、README を実装に合わせるかの判断をお願いします（spec は今の実装どおり `TSUTATSU_NOT_FOUND` で書いています）。
2. json の応答の形（`document` / `legal_status` / `source: "db"`）にこのツールの応答としてのテストがありません（ID は受入テストを書いてから）。
3. markdown の応答の形（種別・発出日・税目・docId・出典・取得の行、宛先・発出者、本文、末尾の注）にテストがありません（ID は受入テストを書いてから）。
4. 添付 PDF の一覧（markdown の `## 添付 PDF` の節、json の `document.attachedPdfs`）にこのツールの応答としてのテストがありません（ID は受入テストを書いてから）。
5. `docId` を省いたときの `INVALID_ARGUMENT` にこのツールでのテストがありません（ID は受入テストを書いてから）。
6. json の `legal_status.note` が「通達は行政内部文書。…」で事務運営指針を名指ししません。markdown の末尾の注は「通達・事務運営指針は…」です。揃えるかの判断をお願いします。
7. markdown に「取得元」の行がありません（`nta_get_qa` にはあります）。DB だけを引くツールなので不要とみなすか、揃えるかの判断をお願いします。

### `specs/changes/` の候補

- 未決 1 を「不具合」と判断する場合: エラー `code` を `DOC_NOT_FOUND` に揃える差分（`nta_get_kaisei_tsutatsu` も同じ `TSUTATSU_NOT_FOUND` を返しているので、一緒に扱うのがよいと思います）
- 未決 6 を「揃える」と判断する場合: json の `legal_status.note` の文言を事務運営指針にも合う形にする差分

Refs #50


---

# nta_get_kaisei_tsutatsu（ブランチ `spec-init/nta-get-kaisei-tsutatsu`）

## spec-init: nta_get_kaisei_tsutatsu の仕様の初版

`specs/current/nta_get_kaisei_tsutatsu/spec.md` の初版を起こしました。v0.21.0 の実装（`src/tools/handlers.ts` の `handleNtaGetKaiseiTsutatsu` と `explainDocIdNotFound`、`src/tools/definitions.ts`）と、このツールを呼ぶ既存テストから、今の振る舞いを書いています。

「できること」の仕様 ID は 3 つ（`SPEC-NTA-GET-KAISEI-TSUTATSU-001`〜`003`）です。ID は `src/tools/get-doc-not-found.test.ts` の 4 つの `it` に付けます（この 4 つは `for` ループで 3 ツールを回しているテストなので、`nta_get_jimu_unei` / `nta_get_bunshokaitou` の ID は各担当が同じ行に足します）。テストの期待値と本文は変えていません。

### 人に判断してほしい点（未決 8 件）

意図か不具合か、または受入テストを書いてから ID を振るかを決めてください。

1. markdown（既定）の応答の形。テストが無いので ID を振っていません
2. json の応答の形（`document` / `legal_status` / `source: "db"`）。テストが無いので ID を振っていません
3. 索引から消えた改正通達の印（`index_status` / `orphaned_at` / `notice`、Issue #30）。`nta_get_jimu_unei` にはテストがありますが、このツールにはありません
4. 「別紙 N」だけの PDF を `comparison` にする動き（Issue #44）。判定のテストは `src/services/pdf-meta.test.ts` にありますが、このツールの応答としてのテストがありません
5. `kind` の無い古い行の添付 PDF に、このツールは `kind` を補いません（`nta_inspect_pdf_meta` は補います）。意図か不具合か
6. `docId` の形（新形式・旧形式・空文字列）を確かめません。形の検査を足すか
7. `docId` が無いときの `INVALID_ARGUMENT`。テストが無いので ID を振っていません
8. エラー `code` が `TSUTATSU_NOT_FOUND` で、README の取得ツールの表（`DOC_NOT_FOUND`）と合っていません。`code` を種別で分けたままにするか、文書系 3 ツールで揃えるか（揃えるなら `specs/changes/` の差分になります）

### `specs/changes/` の候補

- 未決 5（`kind` の無い行の添付 PDF に `kind` を補う。`nta_inspect_pdf_meta` と揃える）
- 未決 8（`TSUTATSU_NOT_FOUND` と `DOC_NOT_FOUND` のどちらかに揃える）

いずれも人が「直す」と決めてからです。この PR では実装を変えません。README の表の `DOC_NOT_FOUND` は実装と食い違っているので、`code` を変えないと決めた場合は README の側を直す docs PR が要ります。

Refs #50


---

# nta_search_tsutatsu（ブランチ `spec-init/nta-search-tsutatsu`）

## spec-init: nta_search_tsutatsu の仕様の初版

### 何をしたか

- `specs/current/nta_search_tsutatsu/spec.md` の初版を起こしました（v0.21.0 の実装とテストから）。「できること」の仕様 ID は `SPEC-NTA-SEARCH-TSUTATSU-001` 〜 `009` の 9 件です。
- 既存テスト 11 件（`src/tools/handlers.test.ts` 9 件、`src/server.test.ts` 2 件）の名前の先頭に対応する ID を足しました。期待値と本文は変えていません。1 つのテストが 2 つの振る舞いを確かめているものには ID を 2 つ付けています（`renames.json` の要素数は 14）。
- `src/server.test.ts` の 2 件は MCP クライアントから `nta_search_tsutatsu` を呼んで inputSchema の検証（`INVALID_ARGUMENT`）を確かめているので、このツールの応答のテストとして ID を付けました。1 件目（`inputSchema に合わない引数は …`）は `resolve_abbreviation` も同じ `it` で確かめているため、`resolve_abbreviation` の担当者が同じ行に ID を足すことがあります。
- `handlers.test.ts` の `handleNtaSearchTsutatsu が searchTsutatsu に委譲されている` は応答が定義されていることしか確かめていないため、ID を付けていません。

### 未決（11 件）— 人が判断する項目

意図か不具合か、または受入テストを書いて ID を振るかを判断してください。

1. `limit` の範囲外の値（0 以下・50 超）を 1〜50 に丸めてエラーにしない動きを意図として認めるか（テストなし）
2. `score` / `scoreReasons` と並び順（関連度の降順、条項番号一致の加点）を仕様に入れるか（応答のテストなし）
3. `freshness`（4 通達をまとめて判定、`fresh` / `stale` / `outdated`）を仕様に入れるか（応答のテストなし）
4. `legal_status` がヒットしたときだけ付くことを仕様に入れるか（応答のテストなし）
5. 略称そのもの（`消基通`・`消法`）の展開が常に行われ `search_notes` に書かれないことを仕様に入れるか（応答のテストなし）
6. 1 文字の語を外して `search_notes` に書くことを仕様に入れるか（応答のテストなし）
7. 全角を半角に揃えてから探すことを仕様に入れるか（応答のテストなし）
8. `TSUTATSU_NOT_FOUND` の `hint` / `next_actions` が `--bulk-download` を案内し、ツールの説明文と `freshness.warning` が `--bulk-download-all` を案内している食い違いを、どちらに揃えるか
9. `keyword` が空のときの `INVALID_ARGUMENT` に `hint` / `next_actions` / `detail` が付かない（inputSchema 違反のときは付く）ことを揃えるか
10. 0 件のときに `count` が付かず、文書系の検索（`hits` / `results`、`message` / `hint`）と応答の形が違うことを意図として認めるか
11. 空白で区切った複数の語を AND で探すことを仕様に入れるか（応答のテストなし）

### `specs/changes/` の候補

- 未決 8（bulk download の案内フラグの統一）と未決 9（`keyword` が空のときのエラーの形の統一）は、実装を直す判断になれば `specs/changes/` の差分にします。今の PR では起こしていません。

Refs #50


---

# nta_search_kaisei_tsutatsu（ブランチ `spec-init/nta-search-kaisei-tsutatsu`）

## spec-init: nta_search_kaisei_tsutatsu の仕様の初版

### 何をしたか

- `specs/current/nta_search_kaisei_tsutatsu/spec.md` の初版を起こしました。v0.21.0 の実装（handler・inputSchema・検索と 0 件の理由分け・索引の状態）を読み、「できること」に 4 件の仕様 ID（`SPEC-NTA-SEARCH-KAISEI-TSUTATSU-001` 〜 `004`）を振りました。
- 既存テスト 4 件（すべて `src/tools/doc-search-zero-hit.test.ts`）の `it(` の名前の先頭に、対応する ID を足します。期待値と本文は変えません。001 は 5 つの検索ツールを 1 つの `it` で回しているテストなので、他のツールの ID は各担当者が同じ行に足します。
- ID を振ったのは、このツールを呼ぶテストがある振る舞い（0 件のときの 4 つの応答）だけです。ヒットしたときの応答など、テストの無い振る舞いは「未決」に書きました。

### 未決（9 件）

人に判断してほしい点です。意図なら「できること」へ（テストを書いてから ID を振る）、不具合なら `specs/changes/` の差分にします。

1. `taxonomy` の値を検査しない（説明の 4 値以外も受け付ける）。列挙で検査するか、今のままか。
2. `keyword` が空文字・空白だけのとき、`INVALID_ARGUMENT` にせず「「」に合う文書はありません」の 0 件応答になる。意図か不具合か。
3. `limit` が 1 未満・50 超のとき黙って丸める。inputSchema で検査するか、今のままか。
4. ヒットしたときの応答（`results` の各フィールド・`score` の降順・`freshness`・`legal_status`）はテストが無い。受入テストを書いてから ID を振ります。
5. 2 文字の語の部分一致補完と 1 文字の語の除外、その `search_notes`。テストが無い。
6. 略称・通称の展開（通称は 0 件のときだけ）と `search_notes`。テストが無い。
7. 索引から消えた文書の印（`index_status` / `orphaned_at` / `search_notes` の 1 行）。テストが無い。
8. inputSchema に合わない引数のときの `INVALID_ARGUMENT`。このツールの引数でのテストが無い。
9. `taxonomy` の範囲に文書が無いときの `hint` が句点で終わる（追加投入の案内が無い種別のため）。意図として認めるか、整えるか。

### `specs/changes/` の候補

- 未決 2（空の `keyword` を `INVALID_ARGUMENT` にする）と未決 3（`limit` の範囲を inputSchema に書く）は、人が不具合と判断すれば差分の候補です。今回は起こしていません。

### 確認したこと

- `src/tools/handlers.test.ts` の「全ツールが登録されている」は登録の一覧の確認で、このツールの振る舞いの確認ではないため ID を付けていません。
- `src/tools/get-doc-not-found.test.ts` に `nta_search_kaisei_tsutatsu` の名前が出ますが、`nta_get_kaisei_tsutatsu` の `next_actions` の案内先としてであり、このツールは呼んでいないため ID を付けていません。

Refs #50


---

# nta_search_jimu_unei（ブランチ `spec-init/nta-search-jimu-unei`）

### 何をしたか

- `specs/current/nta_search_jimu_unei/spec.md` の初版を起こしました（Issue #50「specs/ を構築」の一環。v0.21.0 の実装とテストから起こしています）。
- 「できること」の仕様 ID は 4 つ（SPEC-NTA-SEARCH-JIMU-UNEI-001〜004）です。
- 既存テスト 3 件（`src/tools/doc-search-zero-hit.test.ts` の 2 件、`src/tools/index-status-response.test.ts` の 1 件）の名前の先頭に ID を足しました。期待値と本文は変えていません。`index-status-response.test.ts` の 1 件は 003（ヒットしたときの `results`）と 004（索引から消えた文書の印）の 2 つの振る舞いを確かめているので、ID を 2 つ付けています。`doc-search-zero-hit.test.ts` の `${tool}: code=DOC_NOT_FOUND …` は 5 ツールを 1 つの `it` で回しているため、他のツールの ID は各担当者が同じ行に足します。

### 人に判断してほしい点（未決 10 件）

意図か不具合かを決めてほしいもの:

- 未決 5: `limit` の上限を検査せず 1〜50 に丸めている（`limit: 1000` でもエラーにならない）。意図として認めるか、`INVALID_ARGUMENT` にするか。
- 未決 6: `keyword: ""` や 1 文字だけの `keyword` が「該当なし」の `hint` になる。探す語が無いことと、合う文書が無いことを分けるか。
- 未決 7: `taxonomy` に enum が無く、どんな文字列も受け付ける（`nta_search_qa` の `topic` は enum）。揃えるか。
- 未決 10: 003 の `results` の要素のフィールド（`title` / `snippet` / `score` など）は、現在のテストが `docId` しか確かめていない。003 に ID を振ったままでよいか、項目ごとの受入テストを足すか。

受入テストを書いてから ID を振るもの（今は「未決」に置いています）:

- 未決 1: `taxonomy` の範囲に文書が無いときの `available_taxonomies` 付きの応答
- 未決 2: `hasPdf` の条件に合う文書が無いときの応答
- 未決 3: 2 文字・1 文字の語の扱いと `search_notes`
- 未決 4: 略称・通称の展開と `search_notes`
- 未決 8: inputSchema に合わない引数の `INVALID_ARGUMENT`
- 未決 9: `freshness` の `staleness` と `warning`

### `specs/changes/` の候補

- なし（未決 5〜7 を不具合と判断した場合は、その時点で差分を起こします）

Refs #50


---

# nta_search_bunshokaitou（ブランチ `spec-init/nta-search-bunshokaitou`）

## spec-init: nta_search_bunshokaitou の仕様の初版

### 何をしたか

- `specs/current/nta_search_bunshokaitou/spec.md` の初版を起こしました（v0.21.0 の実装とテストから）。
- 「できること」に仕様 ID を 4 つ（`SPEC-NTA-SEARCH-BUNSHOKAITOU-001`〜`004`）振りました。
- 既存テスト 7 件（すべて `src/tools/doc-search-zero-hit.test.ts`）の名前の先頭に ID を足します（要素は 8。「0 件のときの件数は別表記も含めて数える」には 003 と 004 の 2 つを付けます）。テストの期待値と本文は変えません。`${tool}: code=DOC_NOT_FOUND、…` の for ループのテストには、このツールの分の ID だけを足します（他のツールの ID は各担当が同じ行に足します）。

`src/tools/handlers.test.ts` の「全ツールが登録されている」と、`src/tools/get-doc-not-found.test.ts`（`nta_get_bunshokaitou` の `next_actions` にこのツール名が出るだけ）には ID を付けていません。

### 未決（8 件）

意図か不具合かを判断してほしい点です。

1. ヒットしたときの応答の形（`results` の各要素のフィールド、`freshness`、`legal_status`）はテストが件数と `taxonomy` しか見ていません。受入テストを書いてから ID を振ります。
2. `hasPdf` の条件に合う文書が無いときの `hint` は、このツールの応答としてのテストがありません。
3. 0 件のときの `freshness` は、このツールの応答としてのテストがありません。
4. 短い語（2 文字・1 文字）と通称（略称辞書の alias）の扱いは、このツールの応答としてのテストがありません。
5. 索引から消えた文書の印（`index_status` / `orphaned_at` / `search_notes` の行）は、このツールの応答としてのテストがありません。
6. `limit` が 1〜50 の外のとき、黙って丸めて検索します。意図として認めるか、`INVALID_ARGUMENT` にするかを決めてください。
7. `keyword: ""` は検証を通り、必ず 0 件の「該当なし」になります。`INVALID_ARGUMENT` にするかを決めてください。
8. `taxonomy` の値は検査せず、索引に無い値でも 0 件の応答（`available_taxonomies` 付き）を返します。今の動きで足りるかを決めてください。

### `specs/changes/` の候補

- なし（未決 6・7 を `INVALID_ARGUMENT` にすると決めた場合は、その時点で差分を起こします）。

Refs #50


---

# nta_search_tax_answer（ブランチ `spec-init/nta-search-tax-answer`）

### 何をしたか

- `specs/current/nta_search_tax_answer/spec.md` の初版を起こしました（v0.21.0 の実装とテストから）。
- 「できること」の仕様 ID は 2 つです（`SPEC-NTA-SEARCH-TAX-ANSWER-001`〜`002`）。
- 既存テスト 4 件の名前の先頭に ID を足しました（`src/tools/handlers.test.ts` 1 件、`src/tools/doc-search-zero-hit.test.ts` 3 件）。テストの期待値と本文は変えていません。

ID を振ったのは、このツールを通して応答を確かめる既存テストがある振る舞いだけです。

- 001: DB にタックスアンサーが 1 件も無いときは `DOC_NOT_FOUND`（`hint` に DB のパスと `--bulk-download-tax-answer`、`next_actions` に投入コマンド）
- 002: タックスアンサーはあるがキーワードに合わないときは `results: []` と件数入りの `hint`、`freshness`

### 未決（8 件）

意図か不具合かを判断してほしい点です。判断が付いたものは、受入テストを書いてから ID を振るか、`specs/changes/` の差分にします。

1. キーワードに合う文書があるときの応答（`results` の要素の形、`score` 順）。テストが無いので ID を振っていません。
2. `hasPdf` で絞ったときの応答と、条件に合う文書が無いときの `hint`。テストが無いので ID を振っていません。
3. 2 文字以下の語の扱いと `search_notes`。テストが無いので ID を振っていません。
4. 略称・通称の展開（通称は 0 件のときだけ広げる）。テストが無いので ID を振っていません。
5. 索引から消えた文書の印（`index_status: "removed_from_index"`・`orphaned_at`・`search_notes` の注記）。テストが無いので ID を振っていません。
6. `limit` の範囲外の値（1 未満・50 超）を黙って 1〜50 に丸めることを、意図として認めるか `INVALID_ARGUMENT` にするか。
7. `keyword` が空・空白だけ・1 文字だけのときに、探していないのに「該当なし」の `hint` を返すことを、意図として認めるか `INVALID_ARGUMENT` にするか。
8. 結果から `nta_get_tax_answer` へ進む `next_actions` が無いことを、意図として認めるか。

### `specs/changes/` の候補

- なし（上の未決 6〜8 は、人の判断で不具合とされたときに差分にします）。

### 補足

- `src/tools/doc-search-zero-hit.test.ts` のテスト「nta_search_qa: 他の種別だけが入っている DB（qa のみ）でタックスアンサーを検索すると DOC_NOT_FOUND」は、名前は `nta_search_qa:` で始まりますが呼んでいるのは `nta_search_tax_answer` なので、`SPEC-NTA-SEARCH-TAX-ANSWER-001` を付けました。名前の本文は初版起こしでは変えません。
- `doc-search-zero-hit.test.ts` の `for` ループのテスト（`${tool}: code=DOC_NOT_FOUND、…`）には、他の検索ツールの担当者が同じ行に自分の ID を足します。

Refs #50


---

# nta_search_qa（ブランチ `spec-init/nta-search-qa`）

### 概要

`nta_search_qa`（質疑応答事例のキーワード検索）の仕様の正本 `specs/current/nta_search_qa/spec.md` の初版を起こしました。v0.21.0 の実装（`src/tools/handlers.ts` の `handleNtaSearchQa`、`src/tools/definitions.ts`）と既存テストから書き出しています。

- 「できること」の仕様 ID: 7 件（`SPEC-NTA-SEARCH-QA-001` 〜 `007`）
- ID を付けたテスト: 8 件（`src/tools/handlers.test.ts` 1 件、`src/tools/doc-search-zero-hit.test.ts` 7 件。うち「topic で絞り込める」の 1 件には 004 と 007 の 2 つを付けています。`for` ループで 5 ツールを回す `${tool}: code=DOC_NOT_FOUND…` には `nta_search_qa` の分の 001 を付けています）
- テストの期待値と本文は変えていません。テスト名の先頭に ID と半角スペースを足しただけです。

### 未決（10 件）

意図か不具合かを判断してほしい点です。

1. ヒットしたときの応答のフィールド（`results` の要素・`freshness`・`legal_status`）はテストが件数しか見ていません。ID を振るには受入テストが要ります。
2. `limit` を 1〜50 に丸める動きにテストがありません。
3. 2 文字・1 文字の語の扱いと `search_notes` は、検索側のテストはあるがこのツールの応答としてのテストがありません。
4. 通称の展開（例: `インボイス` → 正式名）と `search_notes` にこのツールの応答としてのテストがありません。
5. 索引から消えた事例の印（`index_status` / `orphaned_at` と `search_notes` の注記）にこのツールの応答としてのテストがありません。
6. `freshness.warning`（取り込みから 1 か月以上）にテストがありません。
7. `keyword` が空・空白・記号だけでも `INVALID_ARGUMENT` にせず「該当なし」を返します。意図か不具合か。
8. `domain` が `tax` 以外のときは DB を開かないため、DB が空でも `DOC_NOT_FOUND` になりません。意図として認めるか。
9. `domain` は `tax` 以外がすべて 0 件になるので、引数として残すか `topic` に一本化するか。
10. `doc-search-zero-hit.test.ts` の「nta_search_qa: 他の種別だけが入っている DB（qa のみ）でタックスアンサーを検索すると DOC_NOT_FOUND」は名前に `nta_search_qa` とあるが `nta_search_tax_answer` を呼んでいます。この PR では ID を付けず、名前も変えていません。直すかどうかを判断してください。

### `specs/changes/` の候補

- `keyword` が空のときに `INVALID_ARGUMENT` を返す（未決 7）
- `domain` を廃止するか、`tax` 以外を `INVALID_ARGUMENT` にする（未決 9）

Refs #50


---

# resolve_abbreviation（ブランチ `spec-init/resolve-abbreviation`）

### 何をしたか

- `specs/current/resolve_abbreviation/spec.md` の初版を起こしました（`spec-init/resolve_abbreviation`）。v0.21.0 の実装とテストから、今の動きをそのまま仕様の文にしています。
- 「できること」は 5 件（`SPEC-NTA-RESOLVE-ABBREVIATION-001`〜`005`）です。
- 既存テスト 7 件の名前の先頭に ID を足しました（`src/tools/handlers.test.ts` の 5 件、`src/server.test.ts` の 2 件。`describe` には付けず `it` に付けています）。テストの期待値と本文は変えていません。`src/server.test.ts` の「inputSchema に合わない引数は INVALID_ARGUMENT …」は `nta_search_tsutatsu` も同じ `it` で確かめているので、そのツールの ID は担当者が同じ行に足してください。

### 未決（6 件）— 人に判断してほしい点

1. 辞書に無い名前を `resolved: null` の通常応答にしている（`nta_get_tsutatsu` は `ABBREVIATION_NOT_FOUND` のエラー）。意図か、family の error contract に揃えるか。
2. 全角・半角の表記ゆれを吸収しない（`ＰＬ法` は該当なし）。意図か。
3. 空文字・空白だけの `abbr` が `INVALID_ARGUMENT` にならず `resolved: null` になる。意図か。
4. `hint` の MCP 名が `<source_mcp_hint>-mcp` の組み立てなので、まだ無い MCP（`houki-court-mcp` など）も案内する。また `OUT_OF_SCOPE` のような `next_actions` が無い。意図か。
5. tools/list の説明文の例 `電帳法` が管轄外のエントリ（法律）になっている。例を `電帳法取通` に変えるか。
6. 別名（辞書の `aliases`）からの解決はテストが無いので ID を振っていない。受入テストを足すか。

### `specs/changes/` の候補

- 未決 1（辞書に無い名前をエラーにする）と未決 4（`next_actions` を付ける、案内先の MCP 名を実在するものに限る）は、認めるなら実装の変更を伴うので `specs/changes/` の差分になります。
- 未決 5 は説明文だけの変更なので、実装 PR で直せます。

Refs #50


---

# nta_inspect_pdf_meta（ブランチ `spec-init/nta-inspect-pdf-meta`）

### 何をしたか

- `specs/current/nta_inspect_pdf_meta/spec.md` の初版を起こしました（v0.21.0 の実装とテストから）。「できること」は SPEC-NTA-INSPECT-PDF-META-001〜013 の 13 件です。
- 既存テスト 7 件（`src/tools/handlers.test.ts` の describe「nta_inspect_pdf_meta — Phase 4-2 (v0.7.1) / Phase 4 self-feedback (v0.7.2)」の `it` 全件）の名前の先頭に ID を足しました。1 つの `it` が複数の振る舞いを確かめているものには ID を複数付けています（ID の付与は延べ 18 件）。期待値と本文は変えていません。
- 他のテストファイル（`get-doc-not-found.test.ts` / `doc-search-zero-hit.test.ts` / `index-status-response.test.ts` / `src/services/*.test.ts`）にはこのツールを呼ぶテストが無いため、変更していません。

### 未決（8 件）

意図か不具合かを判断してほしい点です（spec.md の「未決」の番号に対応します）。

1. 索引から消えた文書の印（`index_status` / `orphaned_at` / `notice`）を `nta_get_*` と同じように付けるか、一覧だけの応答なので付けないままにするか
2. `legal_status` の docType 別の出し分けはテストが無いので ID を振っていません。受入テストを足すか
3. `unknown` の PDF を保存したときの `pdf-reader-mcp:summarize` 案内はテストが無いので ID を振っていません。受入テストを足すか
4. 保存に失敗する条件のうち HTTP 404 以外（PDF でない / 50MB 超 / 30 秒のタイムアウト / 例外）はテストが無いので ID を振っていません。受入テストを足すか
5. `save: true` で絞った結果が 0 件のとき `saved` フィールドごと無くなること（`saved: []` にしない）は意図か
6. 保存ファイル名を URL の最後のパス要素だけで決めるため、同じ文書の中で同名の別 URL があると 2 つ目を取得しないこと（`cached: true` で 1 つ目を返す）は意図か
7. DB の添付 PDF の記録が JSON として読めないときに `attachedPdfs: []` で返すことはテストが無いので ID を振っていません
8. `docType` / `kind` の enum 違反や未知の引数での `INVALID_ARGUMENT` はこのツールとしてのテストが無いので ID を振っていません

### `specs/changes/` の候補

- 未決 1（索引から消えた文書の印を付ける）と未決 6（保存ファイル名の衝突を避ける）は、実装を直す判断になれば差分にします。今回は起こしていません。

Refs #50


---

# まとめ PR の本文（ブランチ `spec-init/issue-50-remaining`）

## 何をしたか

Issue #50「specs/ を構築」の残り 12 ツールについて、仕様の正本 `specs/current/<tool>/spec.md` の初版を起こしました。v0.21.0 の実装（`src/tools/handlers.ts`・`src/tools/definitions.ts` と、応答の形を決めている `src/services/`）と既存テストから書き出しています。役は Spec Steward で、実装とテストの期待値は変えていません。

- 対象: `nta_get_tax_answer` / `nta_get_bunshokaitou` / `nta_get_jimu_unei` / `nta_get_kaisei_tsutatsu` / `nta_search_tsutatsu` / `nta_search_kaisei_tsutatsu` / `nta_search_jimu_unei` / `nta_search_bunshokaitou` / `nta_search_tax_answer` / `nta_search_qa` / `resolve_abbreviation` / `nta_inspect_pdf_meta`
- 「できること」の仕様 ID: 66 件（ツールごとに 001 から）
- テスト名に足した ID: 91 か所（`src/tools/handlers.test.ts`、`src/tools/doc-search-zero-hit.test.ts`、`src/tools/get-doc-not-found.test.ts`、`src/tools/get-db-first.test.ts`、`src/tools/index-status-response.test.ts`、`src/server.test.ts`）。名前の先頭に ID と半角スペースを足すだけで、期待値と本文は変えていません
- コミットはツールごとに 2 つ（`spec: <tool> の初版草案` / `test: <tool> のテスト名に仕様 ID`）の 24 個
- 確かめたこと: `npx spec-ids check` が exit 0（current 14 ファイル 90 ID = テスト 90 ID）。ID を 1 つ壊すと両方向の不一致を報告する。`check-pr-scope.mjs` は承認日の空欄以外を報告しない。`vitest --run src/tools src/server.test.ts` は 152 件 pass（3 件 skip）。`biome check` は変更したテストファイルで指摘なし

## 未決（合計 100 件）

ツールごとの件数と、人が判断する項目は、houki-hub の `docs/notes/2026-09-26-nta-issue50-pr-bodies.md` の各ツールの節にあります。ツールをまたいで同じ判断になるものを先に挙げます。

1. **取得系のエラー `code` の名前。** `nta_get_jimu_unei` と `nta_get_kaisei_tsutatsu` は `TSUTATSU_NOT_FOUND`、`nta_get_bunshokaitou` は `DOC_NOT_FOUND`。README の表は 3 つとも `DOC_NOT_FOUND` と書いている。spec.md は実装どおりに書いた。揃えるなら `specs/changes/` の差分になる
2. **文書系の検索 5 ツールの、まだ ID の無い振る舞い。** ヒットしたときの `results` の要素のフィールド・`score` の並び・`freshness`・`legal_status`・短い語の補完・通称の展開・索引から消えた文書の印は、検索側（`src/services/db-search.test.ts`）のテストはあるがツールの応答としてのテストが無く、5 ツールとも未決に置いた。受入テストを 5 ツール分まとめて書くか
3. **`limit` の範囲外の値を黙って丸める**（1 未満 → 1、50 超 → 50）と、**空の `keyword` を `INVALID_ARGUMENT` にしない**（0 件の「該当なし」になる）は、検索 6 ツールに共通。意図として認めるか、`INVALID_ARGUMENT` にするか
4. **`for` ループで複数のツールを回すテスト**（`doc-search-zero-hit.test.ts` の `${tool}: code=DOC_NOT_FOUND…`、`get-doc-not-found.test.ts` の 4 つの `it`）は、1 つの名前に対象ツール全部の ID（最大 5 つ）を付けた。テストを分けるかどうかは初版起こしの範囲外なので、このままにするか、別の実装 PR で分けるかを決める
5. **`src/server.test.ts` の「inputSchema に合わない引数は INVALID_ARGUMENT + isError: true」** は `resolve_abbreviation` と `nta_search_tsutatsu` の両方を 1 つの `it` で確かめているので、両方の ID（`SPEC-NTA-RESOLVE-ABBREVIATION-005`・`SPEC-NTA-SEARCH-TSUTATSU-001`）を付けた。ツール横断の error contract に各ツールの ID を付ける扱いでよいか

## `specs/changes/` の候補

各ツールの節の「`specs/changes/` の候補」を参照。件数の多いものは、上の 1（`code` の統一）と 3（`limit` と空の `keyword`）。

Refs #50
