3 文字未満の略称（例: `消法`）を `keyword` に渡すと、正式名（`消費税法`）を含む文書だけを探し、略称そのものを含む文書は返しません。一方で `search_notes` には「部分一致 (LIKE) で検索しました」と書かれ、実際の探し方と合いません。SPEC-NTA-SEARCH-RULES-009 は「元の語と正式名のどちらかを含むものを探す」と書いており、本文とも食い違います。

### いまの状態（v0.21.0、手元で呼んだ結果）

質疑応答事例 2 件（A: 本文に「消費税法」、B: 本文に「消法」だけ）の DB で `nta_search_qa` に `{ keyword: "消法" }` を渡すと:

- `results` は A だけ。`scoreReasons` に `abbreviation expanded: 消法 → 消費税法`
- B（本文に「消法」を含む）は返らない
- `search_notes` は `"消法" は 3 文字未満のため FTS5 (trigram) では検索できません。代わりに本文とタイトルの部分一致 (LIKE) で検索しました。…`

略称が 3 文字未満だと全文検索の索引に乗らないため、正式名だけで全文検索する実装になっています（`buildFtsQueryWithAbbreviation`）。`search_notes` の文は `keyword` の長さだけで決まるので、この場合も部分一致の文が入ります。`nta_search_tsutatsu` など検索系 6 ツールで同じです。

### 決めること

- 3 文字未満の略称でも、元の語を部分一致で探して正式名の全文検索と合わせるか（SPEC-NTA-SEARCH-RULES-009 の本文どおりにする）、正式名だけで探すことを意図とするか
- 意図とするなら、`search_notes` の文を実際の探し方に合わせ、SPEC-NTA-SEARCH-RULES-009 に例外として書く

### 完了条件

- 3 文字未満の略称の探し方と `search_notes` の文が決まり、`specs/current/search_rules/spec.md` に書かれている

出典: `specs/current/search_rules/spec.md` の「未決」9、`specs/current/nta_search_tsutatsu/spec.md` の「未決」5 のうち「略称が 3 文字未満のときは正式名だけで探す」の部分（差分 `20260927-search-keyword-rules` では ID を振らずにこの Issue に移した）
