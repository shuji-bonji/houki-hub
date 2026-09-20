# workflows/revision-tracking.md — 「この改正はいつから、何が変わるか」の手順書

提出先: [houki-research-skill](https://github.com/shuji-bonji/houki-research-skill) の Issue

## いまの状態

`SKILL.md` の「問いの形 → workflow」の表は 4 行あり、この行だけ手順書がありません。

| 問いの形 | workflow |
| --- | --- |
| この仕様は法令のどこに触れるか | `workflows/feasibility-check.md`（v0.8.0） |
| この取扱いの根拠と、今も有効か | `workflows/tax-research.md` |
| 私の場合はどうなるか（個別の事案） | 鉄則 1 の応答型（別 Issue） |
| **この改正はいつから、何が変わるか** | **`workflows/revision-tracking.md`（予定）。当面は `get_law_revisions` と tax-research の ⑤〜⑦ で代用** |

## なぜ手順書が要るか

改正の問いには日付が 3 つあり、どれを答えるかで実務が変わります。

- **公布日** — 官報に載った日
- **施行日** — 効力が生じる日。条ごとに違うことがある
- **経過措置の適用日** — 附則が定める、旧法が残る範囲

v0.8.1 の実測（電子帳簿保存法）では、2027-01-01 施行の未施行改正があり、7 条の本文は改正の前後で同一でした。「改正がある」と「その条が変わる」は別のことなので、条単位で新旧を突き合わせないと答えを間違えます。

## 手順の骨子（案）

1. 法令名を確定する（`resolve_abbreviation` → `search_law`）
2. `get_law_revisions` で改正の一覧を取り、公布日・施行日・未施行かどうかを並べる
3. 対象の条を `at` 指定で 2 回引く（`get_law`）。改正前と改正後の本文を突き合わせ、変わっていなければそう書く
4. 税務なら `nta_search_kaisei_tsutatsu` で改正通達を引き、新旧対照表の PDF があれば `pdf-reader-mcp` で該当部分を読む
5. 附則（`Suppl`）を `get_law` で引き、経過措置の適用範囲を確かめる
6. citation を `docs/CITATION.md` の手順で書き、施行日を必ず添える

## 完了条件

- `workflows/revision-tracking.md` がある
- 実データで 1 例を通し、`examples/` に結果を置く（電帳法の 2027-01-01 施行か、インボイスの経過措置あたり）
- `SKILL.md` の表から「予定」が消える

## 業法の線

線に近づきません。改正の時系列は事実で、当てはめを含みません。
