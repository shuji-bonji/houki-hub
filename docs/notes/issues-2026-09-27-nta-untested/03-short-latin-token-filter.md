英字の 2 文字の語（例: `DX`）と 3 文字以上の語を空白で区切って渡すと、本文にその英字がある文書でも 0 件になります。また `search_notes` には小文字にした語（`"dx"`）が表示されます。

### いまの状態（v0.21.0、手元で呼んだ結果）

本文に「DX 投資促進税制」を含む文書回答事例がある DB で、`nta_search_bunshokaitou` に `{ keyword: "DX 投資促進税制" }` を渡すと:

- `results: []` と「該当なし」の `hint`
- `search_notes` は `"dx" は 3 文字未満のため FTS5 (trigram) の索引に乗りません。3 文字以上の語で全文検索したうえで、本文に "dx" を含むものに絞り込みました`

キーワードは英字を小文字に寄せる（SPEC-NTA-SEARCH-RULES-008）一方、DB の本文は大文字のまま入り（SPEC-NTA-SEARCH-RULES-007）、2 文字の語で絞り込む処理（SPEC-NTA-SEARCH-RULES-004）は大文字と小文字を区別して比べるためです。2 文字の語だけのときの部分一致と全文検索は大文字と小文字を区別しないので、`"DX"` だけなら当たります。検索系 6 ツールで同じです。

### 決めること

- SPEC-NTA-SEARCH-RULES-004 の絞り込みで大文字と小文字を区別しないようにするか（不具合として直すか）
- `search_notes` に表示する語を、利用者が渡した表記にするか、小文字に寄せた表記のままにするか

### 完了条件

- 英字の 2 文字の語が混ざるときの振る舞いと `search_notes` の表記が決まり、`specs/current/search_rules/spec.md` に書かれている

出典: `specs/current/search_rules/spec.md` の「未決」8、差分 `20260927-search-keyword-rules`（手元での確認）
