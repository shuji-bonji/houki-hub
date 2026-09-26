取得系ツールは、識別子の引数が「空でない文字列」かどうかしか確かめず、形の誤りや全角の表記をそのまま受け付けたり拒否したりします。ツールによって扱いが違い、同じ入力でも結果が読みにくくなっています。

### いまの状態

| ツール | 引数 | 今の動き |
|---|---|---|
| `nta_get_bunshokaitou` | `docId` | 空文字列や `税目/番号` の形でない値もそのまま DB を引き、`DOC_NOT_FOUND` になる |
| `nta_get_kaisei_tsutatsu` | `docId` | 新形式・旧形式のどちらでもない値もそのまま DB を引く |
| `nta_get_qa` | `category` / `id` | 数字であることを確かめず、`"abc"` や `/` を含む値もそのまま URL に入る（ホストは `www.nta.go.jp` に固定） |
| `nta_get_tax_answer` | `no` | 全角の `"６１０１"` は INVALID_ARGUMENT（SPEC-NTA-GET-TAX-ANSWER-001）。`"61010"` や `"6"` は通って取りに行く。`"06101"` は番号帯のエラーになる |
| `resolve_abbreviation` | `abbr` | `ＰＬ法` や全角スペース入りの `消　法` は辞書に無い扱い（辞書側には表記ゆれを吸収して引く手段がある） |

`nta_get_tsutatsu` の `clause` は、全角の数字・ハイフンを半角に揃えてから読みます（SPEC-NTA-GET-TSUTATSU-004 / 008）。

### 決めること

- 識別子ごとに形の検査を足すか（足すなら `INVALID_ARGUMENT` と、正しい形を示す `hint`）
- 全角の数字・記号を半角に揃えてから読む扱いを、取得系と `resolve_abbreviation` で揃えるか
- `nta_get_tax_answer` の番号を 4 桁に限るか

### 完了条件

- 5 ツールの識別子の扱いが決まり、`specs/current/` の入力の表と実装が同じことを書いている

出典: `specs/current/` の「未決」— nta_get_bunshokaitou 1、nta_get_kaisei_tsutatsu 6、nta_get_qa 2、nta_get_tax_answer 2・3、resolve_abbreviation 2
