v0.23.0 で対応しました（npm 公開 2026-10-03 JST）。値の無いフィールドは `null` を入れてキーを消さない、という T4 の規則で、各項目を次のとおりにしました。

### 「決めること」への答え

- **`nta_search_tsutatsu` の 0 件の `count`** → 0 件でも `count: 0` を付けます。あわせて `freshness` と `legal_status` も付けます（文書系 5 ツールの 0 件と同じ。SPEC-NTA-SEARCH-TSUTATSU-005・010）。`base_laws_by_tsutatsu` と `next_actions` は `hits` から作るので、0 件では付けません
- **`nta_get_tsutatsu` の `available_clauses` の件数** → 国税庁サイトの経路も最大 50 件にし、DB の経路と揃えました（SPEC-NTA-GET-TSUTATSU-010）
- **`nta_get_jimu_unei` の markdown の「取得元」の行** → 付けます。DB だけを引く改正通達・文書回答事例にも同じ `- **取得元**: ローカル DB（bulk download で取り込んだもの）` の行を付けました（各 005・006）
- **`nta_inspect_pdf_meta` の `save: true` で 0 件** → `saved: []` を返します（SPEC-NTA-INSPECT-PDF-META-010）。`save` を渡さないときは今までどおり `saved` を付けません
- **`nta_inspect_pdf_meta` の `index_status` / `orphaned_at` / `notice`** → 付けます。索引にある文書では 3 つとも `null` です（SPEC-NTA-INSPECT-PDF-META-002）。検索・取得ツールの索引の印も、索引にある文書で `null` を置く形に揃えました（SPEC-NTA-SEARCH-RULES-011、各取得ツールの ID）
- **`hits` / `results`、`message` / `hint` の名前を揃えるか** → 付け替えません。今の名前を意図として仕様に書きました（SPEC-NTA-SEARCH-RULES-020）。付け替えるとフィールドを消すことになるためです
- **`meta`（`at` と `retrieved_at`）を足すか** → 足しません。houki-nta-mcp のツールは時点の引数を持たず、取得の時点は検索の `freshness` と取得の `fetchedAt` で返しているためです
- **2026-10-02 の追記（取得ツールの `freshness` と SPEC-NTA-COMMON-ERRORS-017）** → 取得ツールには `freshness` を付けません。017 の本文から「取得 6 ツール」を外しました（実装は 0.22.0 のまま）

### 出典

- 仕様 PR [#125](https://github.com/shuji-bonji/houki-nta-mcp/pull/125)（T4）、実装 PR [#127](https://github.com/shuji-bonji/houki-nta-mcp/pull/127)
- [`specs/releases/v0.23.0/20261003-t4-response-shape/proposal.md`](https://github.com/shuji-bonji/houki-nta-mcp/blob/main/specs/releases/v0.23.0/20261003-t4-response-shape/proposal.md)（「Issue の『決めること』への答え」#71、「人が判断すること」）
- [CHANGELOG 0.23.0](https://github.com/shuji-bonji/houki-nta-mcp/blob/main/CHANGELOG.md)「互換性」の T4
