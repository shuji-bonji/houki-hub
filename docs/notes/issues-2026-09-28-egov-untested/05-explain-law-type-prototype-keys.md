`explain_law_type` に `name: "toString"` や `"constructor"` を渡すと、`found: true` を返します。応答の JSON には `info` がありません。

### いまの状態（v0.15.1）

- 収録している種別の表を、オブジェクトのキーで引いている。そのため `toString`・`constructor`・`hasOwnProperty` など `Object.prototype` のプロパティの名前が「見つかった」扱いになる
- 応答は `found: true` だが、`info` は JSON にならない関数なので消え、利用者は種別の解説を受け取れない

### 決めること

- 不具合として直すか（`Object.hasOwn` や `Map` で引く）。直すなら `found: false` と候補の一覧を返す

### 完了条件

- `name: "toString"` / `"constructor"` で `found: false` になることが `specs/current/explain_law_type/spec.md` に書かれ、受入テストがある

出典: 差分 `20260928-untested-behaviors` の Steward の報告（explain_law_type の未決の外）
