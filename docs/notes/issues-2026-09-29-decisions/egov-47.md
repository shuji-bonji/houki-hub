houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **`at` の形をサーバーで確かめて `INVALID_ARGUMENT` にするか** → します。`at` を持つ全ツール（`get_law` / `get_article_references` / `list_attachments` / `get_attachment` / `get_law_file` / `verify_citations` と、`at` を持つ他のツール）の inputSchema に `pattern`（`YYYY-MM-DD`）を書き、`common_errors` の引数検査で一律に `INVALID_ARGUMENT` にします。`detail.issues` は `[{ path: "at", message: "<日本語>" }]` の形で、`detail.tool` にツール名を付けます（#57）。`get_law_file` が `save` なしで `asof=<その値>` 付きの URL を返す経路も、この検査で先に止まります。形は `pattern` に合うが実在しない日付（`2026-02-30` など）を `INVALID_ARGUMENT` にするかは、仕様 PR で決めます
- **形は正しいが、その時点に法令がまだ無いときに何を返すか** → 決定では答えきれないので、仕様 PR で決めます。T2 の規則（`LAW_NOT_FOUND` は検索が成功して 0 件のときだけ、`SOURCE_*` は通信の失敗だけ）に反しない code か `reason` にします
- **`verify_citations` で `at` を法令名の検索にも使うか** → 決定では答えきれないので、仕様 PR で決めます

### 対応する版と進め方

- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。#47・#48・#53・#54・#57 を T1 の仕様 PR 1 本（`spec/<日付>-t1-argument-guards`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #47` は実装 PR に書きます
- inputSchema を厳しくする前に、houki-hub `scripts/reference-examples/` と houki-research-skill の `examples/` `workflows/` `SKILL.md` の呼び出し例が新しい `pattern` で通ることを確かめます（計画書 5.1）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・5.1・7 章
