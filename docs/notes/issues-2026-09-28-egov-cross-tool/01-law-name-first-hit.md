法令名を e-Gov の法令名検索で引くツールは、題名が完全一致する法令が無いと、検索結果の 1 件目の法令を使います。求めた法令と違う法令の条文・目次・改正履歴を返しても、違うことを応答で知らせません。利用者（LLM）は `meta.title` などを見比べないと気付けず、別の法令を根拠に引用するおそれがあります。

### いまの状態（v0.15.1）

略称辞書に `law_id` が無い `law_name` は、次の順で法令を決めます。

1. e-Gov の法令名検索（題名の部分一致、最大 5 件）を引く
2. 題名が `law_name`（略称辞書に正式名称があればその名前）と完全一致する法令があれば、それを使う
3. 無ければ、検索結果の 1 件目を使う。エラーにせず、候補の一覧も返さない

この決め方を使うツール:

| ツール | 返すもの | 知らせる手段 |
|---|---|---|
| `get_law` | 条文 | `meta.title` だけ |
| `get_toc` | 目次 | `meta.title` だけ |
| `get_law_range` | 範囲の条文 | `meta.title` だけ |
| `get_law_revisions` | 改正履歴 | `meta.title` だけ |
| `get_related_laws` | 施行令・施行規則などの候補 | `law.title` だけ |
| `get_article_references` | 条の参照先 | `meta.title` だけ |

例: `get_related_laws` に実在しない `所得税法施行` を渡すと、所得税法施行令か所得税法施行規則のどちらかとして扱われます。

`get_article_references` が本文中の法令番号から法令を引くときも、法令番号が完全一致する法令が無ければ検索結果の 1 件目を採ります。

`verify_citations` だけは別の決め方をしています。完全一致した 1 件だけを採り、完全一致が無く候補があれば `ambiguous`（候補付き）、候補も無ければ `LAW_NOT_FOUND` を返します。ただし、完全一致を探すのは部分一致の上位 50 件の中だけです。

### 決めること

- 完全一致しないときに、6 ツールが何を返すか
  - A: `verify_citations` と同じく、エラー（または候補の一覧）にして条文は返さない
  - B: 今のまま 1 件目を返し、完全一致でなかったことと候補を応答に付ける
- 法令番号の引き当て（`get_article_references`）も同じ規則にするか
- `verify_citations` の「上位 50 件の中だけで完全一致を探す」を、実在する法令名で `ambiguous` にならないように変えるか。部分一致が 50 件を超える法令名が実際にあるかを確かめる

### 完了条件

- 決めた規則が 6 ツール（と verify_citations）の `specs/current/<tool>/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_law 12、get_toc 9、get_law_range 9、get_law_revisions 4、get_related_laws 6、get_article_references 13・17、verify_citations 5（初版起こし、ブランチ `spec-init/egov-initial`）
