`explain_law_type` が、一部の種別名と法令種別コードで期待どおりの解説を返しません。`get_law` などの応答にある `law_type` をそのまま渡しても、解説が返らない種別があります。

### いまの状態（v0.15.1）

- **`通知`:** 収録している種別は 9 種のほかに `通知` があり（計 10 種）、`通達` の別名にも `通知` がある。名前の一致を別名より先に確かめるので、`name: "通知"` は `info.name: "通知"` を返し、`通達` の別名の `通知` は使われない
- **法令種別コード:** コードで引けるのは `Act`・`CabinetOrder`・`MinisterialOrdinance` だけ。`search_law` の `law_type` が受け付ける `Rule`・`ImperialOrdinance` と、e-Gov が返す `Constitution` は `found: false`。`規則` にはコードが結び付いていない

### 決めること

- `通知` を独立の種別にするか、`通達` の別名にするか
- `Rule`・`ImperialOrdinance`・`Constitution`（と e-Gov が返す他のコード）を解説に結び付けるか

### 完了条件

- 決めた規則が `specs/current/explain_law_type/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— explain_law_type 1・2（初版起こし）
