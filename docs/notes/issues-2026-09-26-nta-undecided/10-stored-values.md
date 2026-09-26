DB に入れる値や保存するファイルの扱いで、不具合の疑いがある箇所があります。応答が一見正しく見えるため気付きにくく、後から DB を直す手間も生じます。

### いまの状態

| ツール | 動き |
|---|---|
| `nta_get_tax_answer` | `taxAnswer.no` を引数ではなくページの見出しから読む。見出しが `No.xxxx` の形でないと `no` が空文字になり、DB にもその空の番号で入る |
| `nta_get_kaisei_tsutatsu` | v0.6.0 までに入れた行の添付 PDF は `kind` を持たない。`nta_inspect_pdf_meta` は題名から `kind` を補うが、このツールは補わない（json では `kind` が無いまま、markdown では「その他」） |
| `nta_inspect_pdf_meta` | 保存ファイル名を URL の最後のパス要素だけで決める。同じ文書の中で最後の要素が同じ別の URL（別のディレクトリの `01.pdf` など）があると、2 つ目を取得せずに 1 つ目のファイルを `cached: true` で返す |

### 決めること

- 各項目が意図か不具合か
- 不具合なら、既存の DB の行（空の `no`、`kind` の無い PDF）を直す手順が要るか

### 完了条件

- 各項目の扱いが決まり、不具合なら修正と受入テストがある

出典: `specs/current/` の「未決」— nta_get_tax_answer 9、nta_get_kaisei_tsutatsu 5、nta_inspect_pdf_meta 6
