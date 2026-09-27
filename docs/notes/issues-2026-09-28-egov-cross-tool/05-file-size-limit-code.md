`get_attachment` と `get_law_file` で `save` を指定し、取得したファイルが 50 MB を超えると、保存せずにエラー `INVALID_ARGUMENT` を返します。`INVALID_ARGUMENT` は呼び出し側の引数の誤りを表す code ですが、この場面の引数は正しく、ファイルの大きさはサーバーが取得してみるまで分かりません。

### いまの状態（v0.15.1）

- 上限は 50 MB（設定 `FILES_CONFIG.maxBytes`）
- 上限を超えると `INVALID_ARGUMENT` を返す。`error` は「ファイルが大きすぎます: <大きさ>（上限 50.0 MB）」、`hint` は「保存せず url をそのまま使ってください」、`detail.url` に取得先の URL
- 大きさを確かめるのは、ファイルを全部取得した後。上限を超えるファイルも最後まで取得してから捨てる
- この経路のテストは無い

### 決めること

- この場面の code を何にするか（`INVALID_ARGUMENT` のままか、`FILE_TOO_LARGE` のような別の code か）。別の code にするなら、family 共通のエラー語彙（houki-research-skill）にも足すか
- 取得の前（Content-Length）か取得の途中で打ち切るか
- 上限の 50 MB を利用者が変えられるようにするか

### 完了条件

- 決めた規則が get_attachment・get_law_file の `specs/current/<tool>/spec.md` に書かれ、大きなファイルを差し替えた受入テストがある

出典: `specs/current/` の「未決」— get_attachment 1、get_law_file 2（初版起こし、ブランチ `spec-init/egov-initial`）
