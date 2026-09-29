houki-hub の 2026-09-29 の決定（テーマ T2「見つからない」と「取得元の失敗」の code）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **文書系 3 ツール（`nta_get_bunshokaitou` / `nta_get_jimu_unei` / `nta_get_kaisei_tsutatsu`）の `code` を揃えるか** → 揃えます。3 ツールとも `DOC_NOT_FOUND` にし、`nta_get_jimu_unei` と `nta_get_kaisei_tsutatsu` の `TSUTATSU_NOT_FOUND` を置き換えます。README の「DB を先に引く」の表のとおりになります。`specs/current/common_errors/spec.md` の code の表で、`TSUTATSU_NOT_FOUND` の説明から「改正通達・事務運営指針を含む」を外します
- **「DB に 1 件も無い」と「その番号が無い」を `code` で分けるか** → 分けません。T2 の規則では `*_NOT_FOUND` は「検索が成功して 0 件」のときで、どちらも DB を引いて 0 件なので同じ `DOC_NOT_FOUND` です。見分けは今のとおり `error` の文言・`available_doc_ids`・`next_actions` で付けます（v0.14.1 の形のまま）
- **`resolve_abbreviation` の「辞書に無い」を正常応答のままにするか、family のエラーの取り決めに揃えるか** → 決定では答えきれないので、仕様 PR で決めます。参考: houki-egov-mcp の `resolve_abbreviation` も辞書に無い名前で `resolved: null` を返し、houki-egov-mcp#57 で `ABBREVIATION_NOT_FOUND` を語彙から外すかを扱っています。egov と nta で同じ形にします
- code を変えない方針（`src/tools/handlers.ts` の `explainDocIdNotFound()` の JSDoc「v0.14.0 から変えない」）について → v0.14.1（patch）での判断で、family の方針ではありません。minor で変えてよく、変えるときは JSDoc の文も書き換えます（2026-09-29 の決定）

### 対応する版と進め方

- houki-nta-mcp **0.22.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#64・#65 を T2 の仕様 PR 1 本（`spec/<日付>-t2-error-codes`、`specs/changes/` だけ）にまとめ、`specs/current/common_errors/spec.md` の code の表を先に直してから、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #64` は実装 PR に書きます
- code を置き換えるので、T2 の互換の扱いに従います: CHANGELOG に「互換性」の節で `TSUTATSU_NOT_FOUND` → `DOC_NOT_FOUND`（`nta_get_jimu_unei` / `nta_get_kaisei_tsutatsu`）を書き、同じ日に houki-research-skill の `docs/ERROR-CODES.md` を直し、旧 code を並行して返す期間は設けません

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T2 code」「T2 の互換の扱い」「houki-nta-mcp #64・#65 の code は置き換える」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 1 章の前提・2.1・4 章「段階 1」「段階 4」・7 章・8 章
