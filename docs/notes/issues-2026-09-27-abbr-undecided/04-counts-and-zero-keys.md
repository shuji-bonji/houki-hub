辞書の件数をどこまで約束にするかと、`getAbbreviationStats` が件数 0 の種別・MCP をどう返すかが決まっていません。MCP サーバーが起動時のログに件数を出すときに影響します。

### いまの状態

- テストが固定しているのは「総数が 100 件を超える」「houki-egov 管轄が 100 件を超え、houki-nta 管轄より多い」だけです。v0.6.0 の総数 174 などの実数は固定していません
- `getAbbreviationStats()` の `byCategory` と `bySourceMcpHint` には、1 件以上ある値だけがキーとして入ります
  - `byCategory` のキーは 12 種別のうち 7 つで、`byCategory.hanrei` は `0` ではなく `undefined`
  - `bySourceMcpHint` のキーは 6 つのうち `houki-egov` と `houki-nta` の 2 つ
  - `byDomain` は今は 6 分野すべてに 1 件以上あるので 6 キーそろうが、0 件の分野ができればそのキーも無くなる
- `AbbreviationStats` のキーの型は `Record<string, number>` で、`Record<Domain, number>` などになっていません

### 決めること

- 版ごとの実数（総数・分野別など）を仕様に書いて固定するか、エントリを足すたびに変わる値として約束にしないか
- `getAbbreviationStats` で、件数 0 の種別・分野・MCP もキーに入れて `0` を返すか
- 入れる場合、型を `Record<Domain, number>` / `Record<Category, number>` / `Record<SourceMcpHint, number>` にするか

### 完了条件

- `getAbbreviationStats().byCategory.hanrei` の値が仕様に書かれ、受入テストがある

出典: `specs/current/` の「未決」— abbreviation_entries 7、get_abbreviation_stats 1・2（初版起こし、PR #10）
