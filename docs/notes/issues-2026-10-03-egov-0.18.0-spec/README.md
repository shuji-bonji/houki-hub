# houki-egov-mcp: 0.18.0 の仕様 PR で見つけた、差分の外の不具合（2026-10-03）

houki-egov-mcp の段階 5（0.18.0）の仕様 PR（`20261003-law-resolution`・`20261003-search-explain-attachment`。main `f265339`・`80ce271`）を書く途中で、どちらの差分にも入れなかった不具合を 2 件見つけました。その Issue の下書きです。

| # | 本文 | 題名 |
|---|---|---|
| 01（#97） | `01-law-type-imperial-order.md` | search_law・search_fulltext の law_type の ImperialOrdinance を e-Gov が受け付けず、勅令で絞り込めない |
| 02（#98） | `02-article-references-next-actions-without-article.md` | get_article_references で条番号の付かない他法令の参照に、呼んだ条の番号で get_law を案内する |

起票は `scripts/create-issues-2026-10-03-egov-0.18.0-spec.sh`。作った番号は `created.tsv` に残ります。2026-10-03 JST に houki-egov-mcp #97・#98 として起票しました。
