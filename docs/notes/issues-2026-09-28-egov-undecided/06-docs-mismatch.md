README・CLI の使い方・tool description の記述が、v0.15.1 の実際の動きと合いません。どちらに合わせるか（文書を直すか、動きを変えるか）を項目ごとに決める必要があります。

### いまの状態（v0.15.1）

| 場所 | 書いてあること | 実際 |
|---|---|---|
| README のエラー code の表 | `UNKNOWN_TOOL` の `retryable` は `false` | `retryable` が付かない。`error` は英語の `Unknown tool: <name>` で、ほかのエラーと違い日本語でない |
| README のエラー code の表 | `INTERNAL_ERROR` の `retryable` は `false` | `retryable: true` と `next_actions` に `retry_later` を付ける。`hint` は「バグの可能性があります。再現手順を添えて GitHub issue でご報告ください」で、再試行の案内と報告の依頼が並ぶ |
| README の「まず試す」 | 「9 ツールのうち 8 つはそのまま動きます」 | tools/list は 14 ツール。ローカル DB が要るのは `search_fulltext` の 1 つ |
| CLI の使い方の `DOCS:` 欄 | `docs/PHASE2-DESIGN.md`・`docs/PHASE2-SPIKE.md` | npm のパッケージには `dist/` しか入らず、npm から入れた利用者の手元に無い |
| CLI の使い方 | `--sync` と `--version` | `--bulk-download-incremental`（`--sync` と同じ）と `-v` も受け付けるが載っていない |
| `explain_law_type` の `see_also` | `docs/LAW-HIERARCHY.md` | リポジトリの中の相対パスで、MCP クライアントからは開けない |
| `get_toc` の `depth` の説明 | 「1=編まで、2=章まで、3=節まで」 | 最上位の階層から数える。章から始まる法令（消費税法など）では `depth: 1` が章まで、`depth: 2` が節まで |

### 決めること

- 項目ごとに、文書を直すか、動きを文書に合わせるか
  - `INTERNAL_ERROR` の `retryable` と `hint`（再試行を勧めるか、報告を求めるか）
  - `UNKNOWN_TOOL` の文面と `retryable`
  - `DOCS:` 欄と `see_also` を GitHub の URL にするか、外すか
  - `--bulk-download-incremental` と `-v` を使い方に載せるか（設計時の名前を残しただけか）
  - `depth` を「上から N 階層」と説明し直すか、編・章・節に固定した意味にするか

### 完了条件

- 動きを変えない項目は文書が直り、動きを変える項目は `specs/current/` に書かれて受入テストがある

出典: `specs/current/` の「未決」— common_errors 6・7・11、cli_entry 4・5、explain_law_type 7、get_toc 7（初版起こし）
