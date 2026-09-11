# issue 草案: get_law の item で枝番号の号（第8号の2）を指定できるようにする

対象リポジトリ: houki-egov-mcp（2026-09-11 作成）
提出先: https://github.com/shuji-bonji/houki-egov-mcp/issues
タイトル案: get_law の item で枝番号の号（「8の2」）を指定できるようにする

---

## 背景

houki-egov-mcp#16（v0.5.4）で、項をまとめて取ったときの枝番号の号の表示（`4_2 の二国外事業者…` → `四の二 国外事業者　…`）を直しました。一方で、枝番号の号だけを指定して取る方法はまだありません。

## 現状（v0.5.4）

- `get_law` の inputSchema で `item` は `type: "number"` です（`src/tools/definitions.ts`）
- `findItem()`（`src/services/law-tree.ts`）は `c.attr?.Num === String(itemNum)` で探すので、e-Gov の `Num="8_2"` の号には届きません
- そのため、消費税法 第2条第1項第8号の2（特定資産の譲渡等）を取るには、項全体（`paragraph: 1`）を取って本文から探すしかありません
- 質疑応答事例や通達の【関係法令通達】には「第2条第1項第8号の2」のような枝番号の号がよく出ます。houki-nta-mcp の `next_actions` から案内するときも、号まで絞れません

## 提案

1. `item` の inputSchema を `number` と `string` の両方を受け付ける形にする（例: `8`、`"8"`、`"8の2"`、`"第8号の2"`）
2. 条番号と同じ正規化（`toEgovArticleNum()` と同じ考え方で「第」「号」を取り、「の」を `_` にする）を号にも通し、`findItem()` は e-Gov の `Num` 形式（`"8_2"`）で比較する
3. 見出しは `第2条第1項第8号の2` にする（`formatArticleLabel()` と同じ組み立てを号にも用意する）
4. 号が見つからないときのメッセージも同じ表示にする

## 決めること

- inputSchema を `oneOf: [number, string]` にするか、`string` だけにして number は受け付け続けるか（v0.5.3 で入れた tools/call の引数検証との兼ね合い）
- 引数の型を広げるので、版は minor（v0.6.0）にするか
- 漢数字（`"八の二"`）を受け付けるか（条番号は現在も漢数字に未対応）

## 確認すること

- 既存の `item: 8`（number）の呼び出しが同じ結果を返すこと
- houki-nta-mcp の `next_actions` が `item` を number で出している箇所を、枝番号のときに文字列で出すよう追随するか（別 issue）
- houki-research-skill の例文・houki-hub のツールリファレンスの `get_law` の引数説明

## 関連

- houki-egov-mcp#16（枝番号の条の見出しと、号・イロハの区切り）
- houki-nta-mcp#22（質疑応答事例から `get_law` へ案内する `next_actions`）
