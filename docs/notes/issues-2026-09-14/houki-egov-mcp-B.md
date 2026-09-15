### 背景

`japan-law-mcp` には `verify_citations` があります。houki には、LLM が組み立てた引用リストをまとめて検証する経路がありません。1 件ずつ `get_law` を呼べば同じことはできますが、エージェントが「全部実在した」と言い切る根拠を 1 回で取れません。

houki は `search_fulltext` と `get_law` をすでに持っているので、新しいデータ源は要りません。

### やること

- ツール `verify_citations` を追加する
- 入力: 引用の配列（法令名または lawId、条番号、任意で項・号）
- 出力: 各件について `found` / `not_found` / `ambiguous` と、見つかった場合の正式名称・法令番号・条見出し・URL
- 存在しない条は `ARTICLE_NOT_FOUND`、法令名が引けないものは `LAW_NOT_FOUND` を件ごとに返す（ツール全体は `isError` にしない）
- 略称は `houki-abbreviations` で正式名に直してから照合する

### 完了条件

- 実在する引用と存在しない引用を混ぜたリストで、件ごとに判定が返る
- houki-research-skill の citation 手順から呼べる
- `tools/list` の `inputSchema` に `additionalProperties: false` が入っている

出典: houki-hub#20 機能 3 / houki-hub#21
