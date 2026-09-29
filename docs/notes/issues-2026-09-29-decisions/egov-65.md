houki-hub の 2026-09-29 の決定（テーマ T4 応答の形。description の行は T5 の規則も当てます）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **description を e-Gov の値に合わせるか、日本語の説明を別のフィールドで付けるか** → T5 の規則（動きを変える必要が無い行は文書を直す）を当てると、tool description の「状態（現行/旧法/未施行）」を実際の値（`CurrentEnforced` / `PreviousEnforced` / `UnEnforced`）に合わせる側です。日本語の説明を別のフィールドで足すかは、決定では答えきれないので仕様 PR で決めます（足す場合は T4 の規則で常に付けます）
- **「最新」の順を、施行日の新しい順（未施行を含む）とするか、施行済みだけ・公布日の順とするか、e-Gov の順に頼るか。ツールで並べ替えるか** → 決定では答えきれないので、仕様 PR で決めます
- **値の無いフィールドを `null` に揃えるか、付けないことに揃えるか** → `null` に揃えます。`revisions[].amendment_enforcement_comment` など、e-Gov の値が無いフィールドは `null` を入れ、フィールドを消しません

### 対応する版と進め方

- houki-egov-mcp **0.17.0**（段階 4。T4 + T5）。#64・#65・#66 を T4 の仕様 PR 1 本（`spec/<日付>-t4-response-shape`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #65` は実装 PR に書きます。`latest` の 0 以下・小数は #54（0.16.0、T1）で先に `INVALID_ARGUMENT` になります
- description だけを直す行は仕様 PR に入れず、実装 PR で直します（T5）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T4 応答の形」「T5 文書と実装の食い違い」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・7 章
