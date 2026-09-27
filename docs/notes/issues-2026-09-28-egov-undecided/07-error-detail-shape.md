引数の検査で返す `INVALID_ARGUMENT` の `detail` の形と、エラー code の語彙が、houki-nta-mcp や family の約束と揃っていません。呼び出し側（LLM や houki-research-skill）が、どの引数が悪かったかを機械的に読み取りにくくなっています。

### いまの状態（v0.15.1）

- **`tool` が付かない:** houki-nta-mcp は inputSchema の検査の `INVALID_ARGUMENT` に呼んだツールの名前を `tool` で付けるが、houki-egov-mcp は付けない
- **必須の引数が無いときの `path`:** `detail.issues[0].path` が空文字で、どの引数が無いかは `message`（`must have required property 'name'`）の中にしか無い
- **`message` の言語:** 型・enum の違反の `message` は英語（`must be string`、`must be equal to one of the allowed values`）で、inputSchema に無い引数の `message`（`inputSchema に無い引数です`）だけが日本語
- **inputSchema に無い引数が 2 つ以上:** `path` にすべての名前が `, ` 区切りで入り（例: `typo, foo`）、問題 1 件ごとに分けない
- **返さない code:** `ABBREVIATION_NOT_FOUND`（`resolve_abbreviation` は辞書に無い名前でも `resolved: null` を返す）と、v0.2.x までの `EGOV_API_ERROR`・`EGOV_TIMEOUT`・`EGOV_RATE_LIMITED` が code の語彙に残っているが、v0.15.1 ではどのツールも返さない

houki-nta-mcp でも、違反が 2 つ以上あると `detail.issues` が 1 件にまとまる問題を shuji-bonji/houki-nta-mcp#79 で扱っています。

### 決めること

- `tool` を付けて houki-nta-mcp と揃えるか
- `path` に引数名を入れ、違反 1 件ごとに `detail.issues` の要素を分けるか
- `message` を日本語に揃えるか
- 返さない code を語彙から外すか。外すなら houki-research-skill の error contract も直すか

### 完了条件

- 決めた規則が `specs/current/common_errors/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— common_errors 3・4・5・10（初版起こし）
