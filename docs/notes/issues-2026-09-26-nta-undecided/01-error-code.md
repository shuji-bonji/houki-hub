取得系ツールが「見つからない」ときに返すエラーの `code` が、ツールごとにばらばらで、README の記載とも合っていません。利用者（LLM を含む）が `code` だけでは状況を判別できないため、揃え方を決めます。

### いまの状態

| ツール | 状況 | 今の応答 |
|---|---|---|
| `nta_get_bunshokaitou` | DB に 1 件も無い / docId が無い | どちらも `DOC_NOT_FOUND`。`error` の文言・`available_doc_ids` の有無・`next_actions` でしか見分けられない。`nta_search_bunshokaitou` の 0 件応答とも同じ `code` |
| `nta_get_jimu_unei` | docId が無い | `TSUTATSU_NOT_FOUND`。README の「DB を先に引く」の表は `DOC_NOT_FOUND` と書いている |
| `nta_get_kaisei_tsutatsu` | docId が無い | `TSUTATSU_NOT_FOUND`。README の表は `DOC_NOT_FOUND` |
| `resolve_abbreviation` | 辞書に無い | エラーにせず `resolved: null` と `note` の通常応答。`nta_get_tsutatsu` は同じ状況で `ABBREVIATION_NOT_FOUND` を返し、`next_actions` に `nta_search_tsutatsu` を入れる |

v0.14.0 から `code` を変えない方針がある（`src/tools/handlers.ts` のコメント）ため、変えるなら互換の扱いも決める必要があります。

### 決めること

- 文書系 3 ツール（文書回答事例・事務運営指針・改正通達）の `code` を揃えるか、種別で分けたままにするか。分けたままなら README を実装に合わせる
- 「DB に 1 件も無い」と「その番号が無い」を `code` で分けるか
- `resolve_abbreviation` の「辞書に無い」を、辞書を引くだけのツールとして正常応答のままにするか、family のエラーの取り決め（houki-research-skill）に揃えるか

### 完了条件

- 上の 4 ツールの `code` の方針が決まり、README・`specs/current/` の該当 ID・実装が同じことを書いている

出典: `specs/current/` の「未決」— nta_get_bunshokaitou 6、nta_get_jimu_unei 1、nta_get_kaisei_tsutatsu 8、resolve_abbreviation 1（houki-nta-mcp #50 の初版起こし）
