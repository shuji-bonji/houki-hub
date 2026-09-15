### 背景

Discussion #24 の劣っている点 5 です。改正通達は本体が PDF のことが多く、いまは `nta_inspect_pdf_meta` がメタ情報と kind 分類と `pdf-reader-mcp` の呼び方を返すところまでです。新旧対照表の中身には入れません。

自分で改正を追うときにも、他者に使ってもらうときにも、同じところで止まります。

### いまの状態

- `nta_inspect_pdf_meta` が PDF の kind を分類し、`pdf-reader-mcp` への案内を返す
- 本文の取り出しは利用者側（別サーバー）に任せている

### 方針の選択肢

houki-nta-mcp が PDF を読むのか、`pdf-reader-mcp` に渡し続けるのかを先に決めます。

1. **渡し続ける（いまの形を強くする）** — `nta_inspect_pdf_meta` の `reader_hints` を、そのまま `pdf-reader-mcp` のツール呼び出しに使える形まで具体化する。houki 側は PDF の依存を持たない
2. **nta が読む** — 改正通達の新旧対照表のような、決まった形の PDF だけを本文として返す。依存が増える

family の責務分割（法令と通達を混ぜない、PDF は PDF family が持つ）からは 1 が素直です。2 を選ぶ場合は、その理由を `docs/DECISIONS.md` に書きます。

### やること（1 を選んだ場合）

- `nta_inspect_pdf_meta` の応答に、`pdf-reader-mcp` のどのツールをどの引数で呼ぶかを `next_actions` として入れる
- 改正通達の PDF の kind 別（新旧対照表 / 本文 / 別紙）に、推奨する読み方を分ける
- houki-research-skill の手順に、PDF に当たったときの分岐を書く

### 完了条件

- 改正通達の PDF に当たったとき、次に何を呼べばよいかが応答から分かる
- Skill の手順が、その分岐を含んでいる

出典: houki-hub#24 劣 5
