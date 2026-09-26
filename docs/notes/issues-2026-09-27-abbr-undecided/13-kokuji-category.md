`SOURCE_MCP_HINTS` の `houki-egov` の説明は「法律・政令・省令・規則・告示」ですが、`CATEGORIES` には告示に当たる値がありません。告示を辞書に入れようとしたときに、`category` に何を入れるかが決まっていません。

### いまの状態

- `CATEGORIES` の 12 値: `constitution` / `law` / `cabinet-order` / `imperial-ordinance` / `ministerial-ordinance` / `rule` / `kihon-tsutatsu` / `kobetsu-tsutatsu` / `qa-jirei` / `tax-answer` / `hanrei` / `saiketsu`
- `LAW_TYPE_CODES` と `validateAllEntries` の `law_type` と `category` の対応表にも、告示は無い
- v0.6.0 の辞書に告示のエントリは無い

### 決めること

- `CATEGORIES` に告示の値（例: `kokuji`）を足すか。足すなら `law_type` との対応と、`law_id` の形（`isValidLawId`）
- 足さない場合、`houki-egov` の説明から「告示」を外すか

### 完了条件

- `CATEGORIES` と `SOURCE_MCP_HINTS` の説明が同じ範囲を書いている。値を足すなら `public_constants` の仕様と受入テストがある

出典: `specs/current/` の「未決」— public_constants 5（初版起こし、PR #10）
