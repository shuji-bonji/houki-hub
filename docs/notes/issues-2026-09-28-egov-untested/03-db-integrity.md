ローカル DB のスキーマに、壊れた行や壊れた版の記録を防ぐ約束が欠けています。

### いまの状態（v0.15.1）

- **`laws.law_revision_id` に NULL が入る:** 主キー（`TEXT PRIMARY KEY`）だが `NOT NULL` が無いので、`law_revision_id` が NULL の行を入れられる。SQLite の `TEXT PRIMARY KEY` は NULL を許すため。`remain_in_force` の既定値 0 とほかの 10 列の `NOT NULL` は期待どおり
- **版を読めない DB を開けない:** `schema_meta.schema_version` が数字でない（`'abc'`・空文字）DB を開くと、作り直しに進まず `UNIQUE constraint failed: schema_meta.key` の例外で開けない。版を読めないときに「値が無い」として行を INSERT しようとし、既存の行と衝突する

### 決めること

- `law_revision_id` に `NOT NULL` を付けるか（スキーマの版を上げて作り直すか）
- 版を読めない DB を、古い版と同じく作り直すか、触らずにエラーにするか（#60 の「新しい版の DB」と揃える）

### 完了条件

- 決めた規則が `specs/current/db_schema/spec.md` に書かれ、受入テストがある

出典: db_schema 未決 7（ID を振らず残した）と、差分 `20260928-untested-behaviors` の Steward の報告
