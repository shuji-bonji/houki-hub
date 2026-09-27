略称を扱うツールが、全角・半角の違いを吸収せず、通達の略称（houki-nta-mcp の管轄）を渡されたときの応答もツールごとに違います。

### いまの状態（v0.15.1）

| ツール | 入力 | 結果 |
|---|---|---|
| `resolve_abbreviation` | `abbr: "ＰＬ法"`（全角英字） | `resolved: null`。辞書にあるのは半角の `PL法`。houki-abbreviations は全角英数字を半角にして照合する指定（`normalize: true`）を持つが、このツールは使っていない |
| `resolve_abbreviation` | `abbr: "消基通"` | `resolved.formal: "消費税法基本通達"`・`law_id: null`・`category: "kihon-tsutatsu"`・`source_mcp_hint: "houki-nta"`。管轄外であることは `source_mcp_hint` でしか分からない。tool の説明は「正式な法令名と law_id を解決する」で、通達を返すことを書いていない |
| `search_law` | `keyword: "消基通"` | 正式名称 `消費税法基本通達` で e-Gov を検索し、`total_count: 0`・`results: []`。管轄外であることも、houki-nta-mcp で取れることも知らせない |
| `get_law` など | `law_name: "消基通"` | `OUT_OF_SCOPE`（`next_actions` で houki-nta-mcp を案内） |

### 決めること

- `resolve_abbreviation` で全角・半角の違いを吸収するか（辞書の `normalize: true` を使うか）。使うなら、法令名を受け取る他のツールの略称の引き当ても揃えるか
- 通達の略称を渡されたとき、`resolve_abbreviation` と `search_law` を `get_law` と同じ `OUT_OF_SCOPE` にするか、今の応答に管轄外の印と案内を付けるか
- `resolve_abbreviation` の説明を、通達も返すことに合わせて直すか

### 完了条件

- 決めた規則が resolve_abbreviation・search_law の `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— resolve_abbreviation 3・5、search_law 9（初版起こし）
