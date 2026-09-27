# houki-hub#27 への追記（Skill のページの作り方）

houki-hub#27「houki-hub シリーズの仕様書の提供」に貼るコメントの下書き（2026-09-28）。`---` から下をそのまま貼る。

---

## Skill のページは spec.md ではなく SKILL.md と workflows/ から作る

MCP（houki-egov-mcp・houki-nta-mcp）と houki-abbreviations のページは、各リポジトリの `specs/current/<dir>/spec.md` から生成する方針のままです。Skill（houki-research-skill）だけは次のように扱います。

### Skill に specs/ を置かない理由

- Skill には実行されるコードが無く、SKILL.md の文章そのものが仕様であり実装でもある
- spec-ids の照合相手になるテストが無い（Skill の振る舞いは LLM が決めるので、vitest のように毎回同じ結果にならない）
- spec.md を置いても SKILL.md の書き写しになり、2 つがずれるおそれが増えるだけ

振る舞いの約束（個別の事案に結論を返さない、引用の書式など）を守りたくなったら、そのときに eval を用意し、eval のケース名に `SPEC-SKILL-…` の ID を振るかを改めて決めます。

### ページの単位と材料

#27 の「ツール（関数）ごとに 1 ページ」は、Skill では「問いの形（workflow）ごとに 1 ページ」に読み替えます。Skill にはツールが無く、利用者から見た単位が workflow だからです。

| ページ | 材料 | 「目的・使い方・処理の流れ」との対応 |
| --- | --- | --- |
| Skill の概要（1 ページ） | `SKILL.md` の frontmatter の `description`、「この skill が担う 4 つの責務」「鉄則」 | 目的と、どの workflow を選ぶか |
| workflow ごと（今は `feasibility-check`・`tax-research` の 2 ページ） | `workflows/<name>.md` | 「このワークフローを使う場面」= 目的、「フロー全体像」の Mermaid = 処理の流れ、「各ステップの詳細」= 使い方、「アンチパターン」 |

workflows/ の各ファイルは `workflows/README.md` の「共通の構成」（使う場面・フロー全体像・各ステップ・アンチパターン）に揃っているので、節の見出しで切り出せます。ユースケースのページ（#6）とは、workflow のページを相互リンクします。

生成スクリプトは MCP と同じ 1 本のままにし、入力の種類に「Skill の workflow」を足します（spec.md の「- 種類: ツール / 共通 / CLI / DB」の代わりに、`workflows/*.md` であることで判定）。

### Skill の文書の正しさの担保

Skill の文書に書いた呼び出し例とエラーの code は、houki-research-skill の CI で MCP の実物と突き合わせます（houki-research-skill v0.15.0）。

- ツール名・引数名: 呼び出し例のツール名と引数名が、各 MCP の `tools/list` の応答の `inputSchema` にあるか
- エラーの code: 各 MCP の `specs/current/common_errors/spec.md`（pdf-reader-mcp は型 `LawErrorCode`）と、Skill の `docs/ERROR-CODES.md` の一覧が一致するか

あわせて、エラーの code の正本を Skill の `docs/ERROR-CODES.md` から各 MCP の `common_errors` の spec.md に移しました。`ERROR-CODES.md` は各 MCP の code をまとめた一覧です。#27 のページでエラーの code を説明するときは、MCP の `common_errors` のページを正本として参照します。
