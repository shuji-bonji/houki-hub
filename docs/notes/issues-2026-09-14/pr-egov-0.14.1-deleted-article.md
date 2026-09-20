## 何をしたか

削除された条をまとめた範囲表記（e-Gov の `Article@Num` = `"534:535"`）の表示を直し、その条で打ち切られたときに `get_law_range` の続きが取れるようにしました。v0.14.0 を実データで使って見つけた不具合です。

民法第三編第二章を `from_article` で読み進めると、第534条の位置にこう出ていました。

```
## 第534:535条

削除
```

e-Gov は削除された条を**複数まとめて 1 つの `Article`** で持っています。

```jsonc
{ "tag": "Article", "attr": { "Num": "534:535" }, "children": [
  { "tag": "ArticleTitle", "children": ["第五百三十四条及び第五百三十五条"] },
  { "tag": "Paragraph", "attr": { "Num": "1" }, "children": [ /* 「削除」 */ ] }
]}
```

## 直した 2 点

**1. 表示** — `formatArticleLabel()` が `第534:535条` を作っていました。e-Gov の `ArticleTitle` と同じ言い方にしました。

| `Num` | 直前 | 直後 | e-Gov の `ArticleTitle` |
|---|---|---|---|
| `534:535` | `第534:535条` | `第534条及び第535条` | 第五百三十四条及び第五百三十五条 |
| `170:174` | `第170:174条` | `第170条から第174条まで` | 第百七十条から第百七十四条まで |

`get_toc` の目次、`get_law_range` の見出しと `range.first_article` / `last_article`、エラーメッセージのすべてに効きます（目次の表示は v0.5.x から壊れていました）。

**2. `get_law_range` の続き** — 打ち切り位置がこの条に当たると、`next_from_article` に `"534:535"` が返るのに `from_article` がそれを受け付けず（`INVALID_ARTICLE_NUM`）、続きが取れませんでした。`toEgovArticleNum()` が範囲表記をそのまま e-Gov 形式として返すようにしました（漢数字の `"五百三十四:五百三十五"` も読みます）。

## 実測（2026-09-20）

主要 8 法令に 28 件。全件で本文は「削除」、`ArticleTitle` は番号の差が 1 のとき「及び」、2 以上のとき「から…まで」で例外はありませんでした。差は `Num` から数えられるので、`ArticleTitle` を読まずにラベルを作れます。

| 法令 | 件数 | 例 |
|---|---|---|
| 商法 | 9 | `32:500`（469 条分）・`813:814` |
| 民法 | 8 | `534:535`・`170:174`・`38:84` |
| 刑法 | 3 | `73:76`・`90:91` |
| 法人税法 | 3 | `92:120`・`136:137` |
| 所得税法 | 2 | `96:101`・`234:236` |
| 労働基準法 | 2 | `29:31`・`43:55` |
| 会社法 | 1 | `930:932` |
| 消費税法 | 0 | — |

## 残している制限

`get_law` に `article: "534"` を渡してこの条を引くことはできません（`findArticle()` は `attr.Num` の完全一致で探すため）。`verify_citations` で削除条の引用が `not_found` になる点も含めて、houki-hub の `docs/notes/2026-09-20-issue-draft-egov-deleted-article-num.md` に Issue 草案を置きました。個別番号を範囲に照合する判定と、`verify_citations` の扱い（「実在するが削除済み」を `found` とするか）を決める必要があるので分けています。

## テスト

436 件（新規 4 件）。範囲表記のラベル 3 パターン・`toEgovArticleNum` の受け取りと例外、削除条で打ち切って `from_article` で続きを取る経路です。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01VtG4YjaPNXLTpyaWV3xrcE
