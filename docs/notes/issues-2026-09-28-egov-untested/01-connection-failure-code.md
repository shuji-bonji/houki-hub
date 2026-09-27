e-Gov に接続できないとき（名前解決の失敗・接続の拒否）に返すはずの `SOURCE_UNAVAILABLE` が、実際には返りません。README とエラー code の語彙は `SOURCE_UNAVAILABLE` を「e-Gov に届かない」ときの code としていますが、利用者（LLM）は代わりに `SOURCE_API_ERROR`（e-Gov がエラーを返した）を受け取り、ネットワークの問題と e-Gov 側の問題を見分けられません。

### いまの状態（v0.15.1）

- Node 22 の `fetch` は、名前解決の失敗や接続の拒否を、message が `fetch failed` の `TypeError` で投げる。`ENOTFOUND`・`ECONNREFUSED` などの原因は `err.cause` にだけ入る
- エラーを code に変える処理（`src/services/law-service.ts` の 133 行目付近）は `err.message` の中に `ECONNREFUSED`・`ENOTFOUND`・`EAI_AGAIN`・`getaddrinfo` があるかだけを見る
- そのため実際の失敗は、取り直した後に `SOURCE_API_ERROR`（`retryable: true`、`detail.cause: "fetch failed"`）になる。存在しないホストと閉じたポートに node 22.23.2 で fetch して確かめた
- `SOURCE_UNAVAILABLE` が返るのは、message に `getaddrinfo ENOTFOUND` などをそのまま含む例外を投げたとき（テストのモック）だけ

この変換は e-Gov を呼ぶすべてのツール（search_law・get_law・get_toc・get_law_range・get_law_revisions・get_related_laws・get_article_references・verify_citations・list_attachments・get_attachment・get_law_file）で共通です。

### 決めること

- `err.cause.code`（`ENOTFOUND`・`ECONNREFUSED`・`EAI_AGAIN` など）も見て `SOURCE_UNAVAILABLE` にするか
- 接続できないときも取り直すか（今は取り直してから返す）

### 完了条件

- 決めた規則が common_errors（または各ツール）の `specs/current/` に書かれ、`TypeError('fetch failed', { cause })` の形の失敗を差し替えた受入テストがある

出典: 差分 `20260928-untested-behaviors`（`specs/releases/v0.15.2/`）の proposal.md「約束にしなかったこと」。search_law 8、get_law 8、get_law_revisions 10、get_related_laws 3、get_article_references 3、list_attachments 8、get_attachment 10、get_law_file 9 の該当部分
