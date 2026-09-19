## 何をしたか

citation を書き出す前に、法律・政令・省令の引用を houki-egov-mcp v0.11.0 の `verify_citations` でまとめて実在確認する手順を足しました（v0.10.0）。egov#18 の完了条件「houki-research-skill の citation 手順から呼べる」に対応します。

### `docs/CITATION.md`

- **「引用を書き出す前に確かめる (verify_citations)」** の節を、`## 階層ラベルと出典の対応表` の前に追加
- `label` に citation の行の文字列を入れておくと、`results[]` の各件と `## Sources` の各行が 1 対 1 で対応することを書きました
- 判定ごとの扱いの表:
  - `found` — そのまま書く（`law.title` を正式名称、`article.caption` を条見出し、`law.url` をリンクに）
  - `ARTICLE_NOT_FOUND` / `LAW_NOT_FOUND` / `INVALID_ARTICLE_NUM` — citation から外して引き直す
  - `OUT_OF_SCOPE` — houki-nta-mcp で引き直し、見出しも「行政解釈」「参考情報」に移す
  - `ambiguous`（候補が複数） — `candidates[]` から選び直す。**推測で 1 つを書かない**
  - `ambiguous`（項が複数ある条で号だけ） — 本文を読んで項を決め、`paragraph` を足して呼び直す
- `summary.all_found` が true のときだけ「引用はすべて実在を確認した」と書けること
- `verify_citations` は条文が実在するかだけを確かめていて、主張を支えるかは判定していないこと
- e-Gov に接続できず全体が `SOURCE_*` になったときは、引用を消さず「実在確認は未実施」と注記すること
- 通達・タックスアンサー・質疑応答事例・判例は対象外であること

### `SKILL.md`

- 鉄則 4（citation は階層を明示する）に、Sources を書き出す前の実在確認の 1 手を足しました
- 利用する MCP の表の houki-egov-mcp に `verify_citations`（v0.11.0 以上）
- 鉄則 5 のエラー表に、`verify_citations` の件ごとの `not_found` / `ambiguous` はツール全体のエラーではない行

### `README.md`

- 前提の版の欄に、鉄則 4 の実在確認は v0.11.0 以上であること（それより前はこの手を飛ばす）

## 出す順

houki-egov-mcp v0.11.0 を npm に publish してから、この PR → タグ `v0.10.0` → claude-plugins の順で出します。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01VfTGnvp9r4hHTVkTx6m2w6
