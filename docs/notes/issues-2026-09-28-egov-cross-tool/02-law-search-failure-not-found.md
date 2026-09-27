法令名から法令を決めるための e-Gov の法令名検索が、通信の失敗・タイムアウト・5xx・429 で終わっても、ツールは `LAW_NOT_FOUND`（法令が見つからない）を返します。`retryable` も付きません。呼び出し側は「名前の書き間違い」と「e-Gov の一時的な障害」を見分けられず、実在する法令を「無い」と受け取ります。

### いまの状態（v0.15.1）

略称辞書に `law_id` が無い `law_name` は、e-Gov の法令名検索で法令を決めます。この検索が例外で終わると、失敗をログに書くだけで「法令が見つからなかった」と同じ扱いになります。

| ツール | 法令名検索が失敗したとき | 法令が決まった後の本文などの取得が失敗したとき |
|---|---|---|
| `get_law` | `LAW_NOT_FOUND` | `SOURCE_*` |
| `get_toc` / `get_law_range` / `get_law_revisions` | `LAW_NOT_FOUND` | `SOURCE_*` |
| `get_related_laws` / `get_article_references` | `LAW_NOT_FOUND` | `SOURCE_*` |
| `list_attachments` / `get_attachment` / `get_law_file` | `LAW_NOT_FOUND` | `SOURCE_*` |
| `verify_citations` | ツール全体を `SOURCE_*` のエラーにする | 同左 |

`verify_citations` は逆に、description・JSDoc・README が書く「タイムアウト・接続不能・5xx」より広く、429（`SOURCE_RATE_LIMITED`）、法令名の検索が返した 4xx（`SOURCE_API_ERROR`）、e-Gov と関係の無い処理中の例外（`SOURCE_API_ERROR`、`retryable: true`）でもツール全体をエラーにし、それまでに判定できた件も返しません。

### 決めること

- 法令名検索の失敗を、どのツールでも `SOURCE_*`（`retryable` 付き）にするか。`LAW_NOT_FOUND` は「検索が成功して 0 件だった」ときに限るか
- `verify_citations` で、e-Gov と関係の無い例外を `SOURCE_*` と別の code（`INTERNAL_ERROR` など）にするか。説明の「タイムアウト・接続不能・5xx」を実際に合わせるか
- `verify_citations` で、1 件の失敗のときにそれまでに判定できた件を返すか

### 完了条件

- 決めた規則が各ツールの `specs/current/<tool>/spec.md` と common_errors に書かれ、e-Gov の失敗を差し替えた受入テストがある

出典: `specs/current/` の「未決」— get_law 13、get_law_revisions 5、get_related_laws 5、get_article_references 12、list_attachments 1、get_attachment 4、get_law_file 3、verify_citations 3（初版起こし、ブランチ `spec-init/egov-initial`）。get_toc・get_law_range は同じ経路を通るが、未決には挙がっていない
