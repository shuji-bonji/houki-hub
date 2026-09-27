検索ツールの `snippet`（本文の抜粋）で、4 文字以上の語が抜粋の終わりにかかると、語の途中で `<b>` を閉じて抜粋が切れます。利用者（LLM）は、合った語が何だったのかを抜粋から読み取れません。

### いまの状態（v0.21.0）

`nta_search_bunshokaitou` に `keyword: "源泉徴収"` を渡し、本文が `相続財産から支払う報酬に対する源泉徴収の要否について回答する` の文書に当たったときの `results[0].snippet` は次のとおりです。

```text
相続財産から支払う報酬に対する<b>源泉徴</b> … 
```

SPEC-NTA-SEARCH-RULES-015（差分 `20260927-search-hit-responses`）は「合った語を `<b>` で囲む」（例: `<b>源泉徴収</b>の事務について …`）と書いているので、仕様と合いません。この差分の受入テスト `src/tools/spec-20260927-search-hit-responses.test.ts`（ブランチ `test/20260927-search-hit-responses`）のうち、`nta_search_bunshokaitou` の 1 件が RED になっています。

`nta_search_tsutatsu` の `hits[].snippet`（SPEC-NTA-SEARCH-TSUTATSU-004 の「一致した語を `<b>…</b>` で囲んだ前後の抜粋」）も、同じ作り方なので同じように切れます。

### 原因

`src/services/db-search.ts` は、抜粋を FTS5 の `snippet()` で作っています。

- 条項: `snippet(clause_fts, 2, '<b>', '</b>', ' … ', 16)`
- 文書: `snippet(document_fts, 3, '<b>', '</b>', ' … ', 16)`

最後の `16` は、抜粋に入れるトークンの数です。trigram のトークンは 1 文字ずつずらした 3 文字の組なので、`源泉徴収` の句は `源泉徴`・`泉徴収` の 2 トークンになります。上の本文では `源泉徴` が 16 番目（0 から数えて 15）、`泉徴収` が 17 番目のトークンで、抜粋に入るのは `源泉徴` までです。

同じ本文で SQLite の関数を呼んだ結果です。

| 呼び方 | 結果 |
|---|---|
| `snippet(…, 16)` | `…対する<b>源泉徴</b> … ` |
| `snippet(…, 32)` | `…対する<b>源泉徴収</b>の要否について回答する` |
| `highlight(…)` | `…対する<b>源泉徴収</b>の要否について回答する` |

4 文字以上の語（トークンが 2 つ以上）なら、句が抜粋の端にかかるたびに起きます。トークン数を増やすと起きにくくなるだけで、なくなりません。

### 直し方の案

`highlight()` で本文全体に `<b>` を付け、抜粋の切り出しは JS で行います。

- SQL は `highlight(document_fts, 3, '<b>', '</b>')`（条項は `highlight(clause_fts, 2, …)`）に変える。どこが合ったかは FTS5 が決めたまま使うので、略称の展開（OR）や複数の語の AND を JS で判定し直さない
- JS で、最初の `<b>…</b>` の前後 16 文字を切り出す。`<b>` と `</b>` の途中では切らず、切った側に ` … ` を付ける
- 2 文字の語を LIKE で探したときの `makeLikeSnippet` も、本文に `<b>` を付けてから同じ関数で切り出す。全文検索と LIKE で抜粋の形が揃い、search_rules の「前後を切った側には `…` を付ける」にもそのまま合う

抜粋の長さは、トークン 16 個分からの前後 16 文字ずつに変わります。015 と TSUTATSU-004 は長さを約束していないので、仕様の変更は要りません。

### 受入テスト

| テスト | 仕様 ID | 確かめること |
|---|---|---|
| 文書系 5 ツール | SPEC-NTA-SEARCH-RULES-015 | 4 文字以上の語が本文の 16 文字目より後ろにある文書で、`snippet` に語全体が `<b>…</b>` で入る |
| 条項の検索 | SPEC-NTA-SEARCH-TSUTATSU-004 | `nta_search_tsutatsu` の `hits[].snippet` で同じこと |
| 前後を切った印 | SPEC-NTA-SEARCH-RULES-015 | 長い本文で語が中ほどにあるとき、前後の両方に ` … ` が付き、`<b>` と `</b>` が対になる |

### 進め方

1. `fix/<この Issue の番号>-snippet-cut` を main から切り、受入テストのコミット（RED）→ 修正のコミット（GREEN）の順に積む。版は上げない
2. マージの後、`test/20260927-search-hit-responses` を main に rebase すると RED のテストが GREEN になる。その後に `chore: v0.21.1` と Publisher の取り込み（7 差分）を続ける

### 完了条件

- 上の受入テストが GREEN で、`test/20260927-search-hit-responses` の受入テストもすべて GREEN

関連: 差分 `20260927-search-hit-responses`（PR #85）、houki-nta-mcp #18（2 文字の語の LIKE と `makeLikeSnippet`）
