`document.doc_type` と `taxonomy` に列の制約が無く、想定した 5 種別以外の値も入る
`document` テーブルの `doc_type` は `kaisei` / `jimu-unei` / `bunshokaitou` / `tax-answer` / `qa-jirei` の 5 つを想定していますが、列に制約が無くどの値でも入ります。値の範囲を仕様にするか（DB の制約にするか）を決めます。

### いまの状態（v0.21.3）

- `SCHEMA_SQL` の `document` は `doc_type TEXT NOT NULL`、`taxonomy TEXT` で、`CHECK` 制約は無い。`UNIQUE(doc_type, doc_id)` と索引 `idx_document_lookup` / `idx_document_taxonomy` だけがある
- 書き込むのは 5 つの bulk downloader と、取得系ツールの書き戻し（SPEC-NTA-DB-SCHEMA-016）で、どれも上の 5 つの値を使う。`taxonomy` は税目フォルダー（例: `shohi` / `sisan/sozoku`）で、文書回答事例は国税局の別表記を本庁の表記に直してから入れる（`bunshoMainTaxonomy`）
- `doc_type` の値の範囲は `specs/current/db_schema/spec.md` に「想定」としてだけ書いてあり、仕様 ID は無い

### 決めること

- `doc_type` の 5 つの値を仕様にするか（`CHECK` 制約にするなら `SCHEMA_VERSION` を上げる移行が要る。移行は houki-egov-mcp #60 に当たる #ISSUE-02 と同じ版にまとめる）
- `taxonomy` の値の範囲（種別ごとの税目フォルダーの一覧）を仕様にするか、自由な文字列のままにするか

### 完了条件

- 決めた規則が `specs/current/db_schema/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— db_schema 6（#75 の初版起こし）
