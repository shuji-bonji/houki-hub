`--refresh-stale=<日数> --apply` は差分更新で、`--refresh` を組み合わせても全部取り直しにならない
`--refresh-stale=<日数> --apply` は、古い節を含む通達を取り直しますが、条件付き取得を使う差分更新なので、304 が返る節は `fetched_at` が更新されるだけで内容は入れ直されません。`--refresh` を同時に付けても `--apply` の経路には渡らないので、利用者が「古い節を強制的に取り直す」つもりで `--refresh-stale=90 --apply --refresh` と打っても、304 の節はそのままです。

### いまの状態（v0.21.3）

- `runRefreshStale` は `findStaleSections` で列挙した節を含む通達の正式名を重複を除いて並べ、通達ごとに `bulkDownloadTsutatsu` を呼ぶ。このとき `args.refresh` を渡さないので、DB に `last_modified` / `etag` があれば `If-Modified-Since` / `If-None-Match` を付けて取得する（cli_refresh 1 の差分更新）
- 304 が返った節は `fetched_at` だけが更新される。次の `--refresh-stale=<日数>` では列挙されなくなる（「最新であることを確かめ直す」目的には合う）
- 取り直した通達ごとの結果（`formalName`・`status`・`detail`）を JSON で標準出力に出す
- テストが無い

### 決めること

- `--refresh-stale=<日数> --apply --refresh` で、対象の通達を `--refresh` と同じく消して取り直す（差分更新を使わない）ようにするか
- 今のまま（`--apply` は常に差分更新）を仕様にし、使い方に「`--refresh` は効かない」と書くか

### 完了条件

- 決めた規則が `specs/current/cli_refresh/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— cli_refresh 3（#75 の初版起こし）
