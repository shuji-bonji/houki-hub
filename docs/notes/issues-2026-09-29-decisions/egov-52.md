houki-hub の 2026-09-29 の決定（テーマ T3 全角・半角・ダッシュ類の正規化）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **`resolve_abbreviation` で全角・半角の違いを吸収するか（辞書の `normalize: true` を使うか）。他のツールの略称の引き当ても揃えるか** → 吸収します。揃える場所は houki-abbreviations の関数に一本化し、houki-egov-mcp は入口で `normalize: true` を使います。`resolve_abbreviation` だけでなく、`law_name` を略称辞書で引き当てる全ツール（`get_law` / `get_toc` / `get_law_range` / `get_law_revisions` / `get_related_laws` / `get_article_references` / `list_attachments` / `get_attachment` / `get_law_file` / `verify_citations`）と `search_law` の `keyword` の展開も同じ指定にします。`abbr: "ＰＬ法"` は `PL法` と同じ結果になります。全角の吸収に加え、houki-abbreviations 0.7.0 で `normalizeJpText` がダッシュ類を `-` に揃えるので、その結果も入ります
- **通達の略称を渡されたとき、`resolve_abbreviation` と `search_law` を `get_law` と同じ `OUT_OF_SCOPE` にするか、今の応答に管轄外の印と案内を付けるか** → 決定では答えきれないので、仕様 PR で決めます
- **`resolve_abbreviation` の説明を、通達も返すことに合わせて直すか** → 上の決め方に従います（`OUT_OF_SCOPE` にするなら説明は変えず、今の応答に印を付けるなら説明を直します）。仕様 PR で決めます

### 対応する版と進め方

- 先に houki-abbreviations **0.7.0**（段階 3。#21・#19・#24 の T3 の仕様 PR `spec/<日付>-normalize`）を publish します。0.x の `^` は minor を跨がないので、houki-egov-mcp の `package.json` を `^0.7.0` に上げるまで MCP には入りません
- houki-egov-mcp **0.16.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。この Issue は T3 の仕様 PR 1 本（`spec/<日付>-t3-normalize`、`specs/changes/` だけ）→ 実装 PR（依存を `^0.7.0` に上げる変更を含める。テスト → `src/` → 版 → `specs/current/` への取り込み）の順です。`Closes #52` は実装 PR に書きます
- 依存を上げる実装 PR では、`freshness.test.ts`（houki-abbreviations #18 で判定が変わる）と `resolve_abbreviation` の受入テストを実行します（計画書 5.1）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T3 正規化」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・3 章・4 章「段階 1」「段階 3」「段階 4」・7 章
