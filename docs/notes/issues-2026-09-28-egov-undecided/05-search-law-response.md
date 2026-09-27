`search_law` の `domain` は説明どおりに絞り込まず、`total_count` は名前と違う値を返し、0 件のときは次に何をすればよいかを返しません。利用者（LLM）は、絞り込んだつもりの結果や、総数と読める件数をそのまま使うおそれがあります。

### いまの状態（v0.15.1）

- **`domain`:** inputSchema の説明は「分野タグで絞り込み（略称辞書ベース）」だが、e-Gov の検索にも結果の選別にも使わず、応答の `query` にも入れない。`keyword: "労働基準", domain: "tax", law_type: "Act"` で `労働基準法`（労働分野）が返る
- **`search_fulltext` の `domain`:** 説明は「v0.5.0 では受け付けるが絞り込みは行わない」、応答の `filters.domain.note` は「v0.5.0 では未実効」と書く。今の版は v0.15.1
- **`total_count`:** `results` の件数と同じで、`limit` で切る前の一致件数ではない
- **0 件のとき:** `total_count: 0`・`results: []` だけを返し、`hint` や `next_actions`（`search_fulltext` や `resolve_abbreviation` を試す案内など）を付けない

### 決めること

- `domain` を実装するか、`search_fulltext` のように「受け付けるが絞り込まない」と応答で知らせるか、引数から外すか。`search_fulltext` の説明の版番号もあわせて直す
- `total_count` を一致した総数にするか、名前・説明を直すか
- 0 件のときに `hint` と `next_actions` を付けるか

### 完了条件

- 決めた規則が search_law・search_fulltext の `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— search_law 1・3・10、search_fulltext 2（初版起こし）
