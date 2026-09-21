# issue 草案: 改正通達の「別紙 N」が新旧対照表本体なのに `attachment` になる

対象リポジトリ: houki-nta-mcp（2026-09-21 JST 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
タイトル案: 改正通達の別紙は新旧対照表本体のことが多い — kind の補正か layout_note の追記

---

## 観察

`nta_inspect_pdf_meta { docType: "kaisei", docId: "0025004-026" }`（v0.19.0、2026-09-21）の `attachedPdfs`:

| title | kind | 中身（実際に読んだ結果） |
|---|---|---|
| 【参考】令和８年11月１日から適用される「消費税法基本通達（第８章）」の構成及び新旧対応表（令和７年４月１日） | comparison | 第 8 章の通達番号の対応表（章の構成の新旧）。タグ無し。`extract_tables` は 0 件、`read_text` に `split_columns: 2` で左右に分かれる |
| 別紙1 | attachment | **本文の新旧対照表**（1-7-2 登録番号の構成、5-6-6 輸入外航機等）。タグ付き。`extract_tables` が見出し行「改正後 \| 改正前」の表をそのまま返す |
| 別紙2 | attachment | 令和 8 年 11 月 1 日から適用される分の新旧対照表 |

`kind` はタイトルの語（新旧対照表 / 対応表 / 別紙 …）で決めているので、タイトルが「別紙1」だけの PDF は `attachment` になる。Skill の手順（`kind: "comparison"` で絞る）に従うと、参考の対応表だけを読んで本文の新旧対照表を見ない。

通達本文には「別紙1…令和7年4月1日から適用」「別紙2…令和8年11月1日から適用」とあり、改正通達（kaisei）では「別紙のとおり改める」の別紙が新旧対照表本体であることが多い。

## 案

どちらか、または両方。

1. **kind の補正**: `docType: "kaisei"` で、タイトルが「別紙 N」だけ（他の語を含まない）の PDF は `comparison` にする。`fillMissingKinds` の後、応答時の補正でよい（DB の再投入は不要）。参考資料の対応表と区別が要るなら、`comparison` のまま `layout_note` に「章の構成の対応表のこともある」と書く
2. **layout_note の追記**: `attachment` の `layout_note` に「改正通達（kaisei）の別紙は、新旧対照表本体のことが多い。改正点を探すときは comparison だけでなく別紙も読む」を足す。`nta_inspect_pdf_meta` の `kind: "comparison"` で 0 件のときの `note` にも同じことを書く

1 の方が Skill の手順を変えずに済む。

## ついでに直すもの（layout_note の記号）

`comparison` の `layout_note` は「改正前の側に「（同左）」、両側に「（省略）」「（新設）」「（削除）」の欄がある」と書いているが、実物は 2 通りあった。

- 別紙 1（本文の新旧対照表）: 「（同左）」「（省略）」の丸括弧
- 参考の対応表: 「【新設】」「【削除】」「【一部改正】」の墨付き括弧

両方を書く。「【一部改正】」は例に無かったので足す。

## 受け入れ条件

- 0025004-026 で `kind: "comparison"` を指定したとき、別紙 1・別紙 2 が返る（案 1）か、返らない理由と別紙を読むべきことが `note` / `layout_note` から分かる（案 2）
- `layout_note` に丸括弧と墨付き括弧の両方の記号が書いてある
- houki-research-skill の鉄則 3「新旧対照表から改正点を取り出す」の記号の説明も揃える（skill 側の追随）

出典: houki-hub `docs/notes/2026-09-21-regression-check.md` の「見つかったこと」2・3
