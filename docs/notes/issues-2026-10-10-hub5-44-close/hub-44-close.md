本文の「やること」1〜5 が入ったので、これで閉じます。

| やること | 入れたもの | PR |
| --- | --- | --- |
| 1. スクリプト | `scripts/check-examples-contract.mjs`。MCP の起動は `scripts/lib/mcp-client.mjs` を `generate-reference.mjs` と共有する（`--launch npx` / `local`）。結果は一致・データ側の差分・形の違い・未確認・照合しないに分け、表（Markdown）と `--json` で出す | #51 |
| 2. 比べ方の規則 | `scripts/lib/example-contract.mjs`。本文の表のほか、「…」で区切った断片の一致、途中で切った配列、毎回変わる値のパスの一覧（`retrieved_at`・`fetchedAt`・`freshness.*`・`db_path`・`score` と `rank` の ±0.01 など）。例ごとの例外は `- 照合:` の行で書く | #51、#54 |
| 3. 例を揃える | 全 48 例に `- ローカル DB:` の行をそろえた。`- 照合:` の行はツールのページに出さない | #54 |
| 4. 確かめた版の書き戻し | `--write-verified` で一致した例に「- 確かめた版: vX（日付）」を書く。`check-example-versions.mjs` は実測と確かめた版の新しいほうを公開版と比べ、表示は「前の版で実測」。`stack-check.yml` の Issue は「確かめていない呼び出し例」を別の節にした | #54 |
| 5. 公開の手順に組み込む | 各 MCP の publish の後（patch を含む）に流す手順を `docs/notes/2026-10-10-procedure-contract-check-after-publish.md` に書いた。DB の要らない例は `reference-regen.yml` でも毎日 `--db absent` で流し、PR の本文に件数を出す | #54 |

決めること 1〜3 は、1 は (a) と (b) の両方（DB の要る例は Mac、DB の要らない例は CI でも流す）、2 は (a)（一覧に出すだけ。例の値は人が直す）、3 は (a)（例が書いている行だけを、同じ順で現れるかで比べる）にしました。

確かめたこと（2026-10-10 JST）:

- Mac で全 48 例（houki-egov-mcp 0.20.1・houki-nta-mcp 0.27.0、手元の DB）を流し、1 回目は一致 43・データ側の差分 4・形の違い 0。差分はどれも例の書き方によるもので、規則と例 1 件を直した 2 回目は一致 47・照合しない 1（記録 `docs/notes/2026-10-10-contract-check-egov-0.20.1-nta-0.27.0.md`）
- houki-nta-mcp 0.25.0（#147 の劣化がある版）で `nta_get_tax_answer` の 2 例を流すと、2 例とも「形の違い」として拾えた
- CI（`reference-regen.yml`）での DB の要らない例は、一致 26・データ側の差分 2・形の違い 0・未確認 19・照合しない 1（PR #57 の本文）
