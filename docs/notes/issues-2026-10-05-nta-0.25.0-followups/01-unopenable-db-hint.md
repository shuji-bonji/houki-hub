読むだけのツールは、ローカル DB を開けないときに `INTERNAL_ERROR` を返します。`hint` に DB のパスも直し方も入らないので、利用者はどのファイルが原因かを応答から知ることができません。

## 何が起きるか（0.25.0）

DB のパスが次のどれかのとき、`nta_search_*`（6 つ）・`nta_get_kaisei_tsutatsu`・`nta_get_jimu_unei`・`nta_get_bunshokaitou`・`nta_inspect_pdf_meta` は SPEC-NTA-COMMON-ERRORS-006 の `INTERNAL_ERROR` を返す。

- SQLite でないファイル
- フォルダー
- パスの途中が普通のファイル
- 権限が無い

このときの `hint` は「バグの可能性があります…」で、DB のパスは `detail.cause` の SQLite の文（例: `file is not a database`）にしか出ない。

0.25.0（#138）で、DB のファイルが無い・版の記録が無い・版が合わないときの `hint` には、開こうとした DB のパスと直し方が入るようになった（SPEC-NTA-DB-SCHEMA-029、021 の注 2）。開けないときだけがこの規則の外に残っている。差分 `20261004-db-location` では、`code` の決め直しが要るため変えなかった（proposal.md の「人が判断すること」13）。

CLI は、同じ状態で `[ERROR] DB を開けません: <エラーの文>` を出して終了コード 1 で終わる（SPEC-NTA-DB-SCHEMA-021、SPEC-NTA-CLI-STATUS-007）。`--status` で確かめれば原因は分かるが、MCP の応答からは `--status` に辿り着けない。

houki-egov-mcp は、開けない DB では `search_law` に切り替え、`note` に `ローカル DB (<パス>) を開けなかったため` とパスを入れる（SPEC-EGOV-SEARCH-FULLTEXT-027・044）。

## 決めること

1. `code` をどれにするか
   - 案 A: `DOC_NOT_FOUND`（基本通達は `TSUTATSU_NOT_FOUND`）に寄せる。「DB に 1 件も無い」ときの応答（SPEC-NTA-DB-SCHEMA-021 の注 1）と同じ形にし、`hint` を DB の状態の文にする。0.25.0 の SPEC-NTA-DB-SCHEMA-029 の表に 1 行足すだけで済む
   - 案 B: `INTERNAL_ERROR` のまま、`hint` だけを DB の状態の文にする。`code` は変わらないが、「不具合の報告を求める」という `INTERNAL_ERROR` の意味（SPEC-NTA-COMMON-ERRORS-006）と合わない
   - 案 C: 新しい `code`（例: `LOCAL_DB_UNAVAILABLE`）を足す。family の code の一覧（houki-research-skill の `docs/ERROR-CODES.md`）と houki-egov-mcp にも影響する
2. `hint` の文。例: ``ローカル DB（<パス>）を開けません（<SQLite の文>）。ファイルが SQLite の DB か、`npx -y @shuji-bonji/houki-nta-mcp@latest --status` で確かめてください``
3. `retryable` の値（ファイルを直すまで結果は変わらないので `false` が自然）
4. `next_actions` に `cli_bulk_download` を入れるか（ファイルを消さないと投入も失敗するので、入れない方が自然）
5. 書き戻すツール（`nta_get_tsutatsu`・`nta_get_qa`・`nta_get_tax_answer`）の扱いも同じ Issue で決めるか

## 関連

- houki-nta-mcp #138（DB の場所の見え方。0.25.0）
- 差分 `specs/releases/v0.25.0/20261004-db-location/proposal.md` の「人が判断すること」13
- houki-hub `docs/DECISIONS.md` 2026-10-04 の T6
