附則の中の別表・様式にある図の置き場所（`location`）が、附則全体（`{ tag: "SupplProvision" }`）になり、見出し（例: 附則別表第一）が付きません。利用者は、どの別表の図かを `list_attachments` の応答から読み取れません。

### いまの状態（v0.15.1）

- e-Gov の XML は、附則の別表・様式を `SupplProvisionAppdxTable` / `SupplProvisionAppdxStyle` / `SupplProvisionAppdx` のタグで返す
- 図の置き場所を決める処理は、本則の `AppdxTable` / `AppdxStyle` / `AppdxFormat` / `AppdxFig` / `Appdx` しか知らない（`src` と `specs` のどこにも `SupplProvisionAppdx` の語が無い）
- 見出し `附則別表第一` を持つ `SupplProvisionAppdxTable` の中の図は、`{ tag: "SupplProvision", amend_law_num: "令和二年法律第一号" }` になる（差し替えた XML で確認）
- 実際の e-Gov の法令でこの形がどれだけあるかは、まだ確かめていない

`list_attachments` と `get_attachment`（ファイル名での照合の結果）の両方の `location` に関わります。

### 決めること

- 附則の別表・様式を本則と同じく置き場所として扱い、見出しを付けるか（`tag` の値をどうするか）

### 完了条件

- 決めた規則が list_attachments（と get_attachment）の `specs/current/` に書かれ、受入テストがある

出典: list_attachments 4 の一部（差分 `20260928-untested-behaviors` で約束にしなかった部分）
