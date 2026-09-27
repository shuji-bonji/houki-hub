添付ファイルと法令本文ファイルの保存で、ファイル名の決め方に曖昧な点があります。名前の重なりで別のファイルを返したり、法令履歴 ID の欄に法令 ID が入ったりします。

### いまの状態（v0.15.1）

- **同じファイル名の添付（`get_attachment`）:** SPEC-EGOV-GET-ATTACHMENT-002 のファイル名だけでの照合は、同じファイル名が別のディレクトリの `src` に複数あっても、一覧で先にあるものを黙って返す
- **Content-Disposition が無いとき（`get_law_file`）:** `<law_id>.<file_type>` の名前で保存する。`saved.file_name` は `null` だが、`saved.law_revision_id` にはこの名前の拡張子より前、つまり法令 ID（例: `129AC0000000089`）が入り、保存先のディレクトリも法令 ID の名前になる。inputSchema と応答の型の説明は `law_revision_id` を法令履歴 ID としている。テストも無い
- **`filename` と `filename*` の両方があるとき（`get_law_file`）:** ヘッダーの先に書かれたほうを使う。RFC 6266 は `filename*` を優先するよう勧めている。e-Gov は `filename` だけを返す（2026-09-20 の実測）。テストも無い

### 決めること

- ファイル名だけで複数の添付に当たるときに、エラー（候補の `src` 付き）にするか
- Content-Disposition が無いときに `saved.law_revision_id` を `null` にするか
- `filename*` を優先するか

### 完了条件

- 決めた規則が get_attachment・get_law_file の `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_attachment 3、get_law_file 1・11（初版起こし）
