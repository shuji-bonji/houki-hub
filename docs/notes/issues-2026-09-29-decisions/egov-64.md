houki-hub の 2026-09-29 の決定（テーマ T4 応答の形）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **目次の `meta` にも `at` を付けるか** → 付けます。`meta` には `at` と `retrieved_at` を常に付けます。`get_law` の目次（`format: "toc"`、または `article` 省略）の `meta` にも `at` を付け、`at` を省いたときは `null` を入れます（値が無いフィールドは `null` を入れ、フィールドを消さない）。既存の「`at` を省いたときは付かない」（`get_toc` などの spec.md）も同じ規則に揃えるので、該当する仕様 ID は MODIFIED になります
- **項を補ったときに `data.paragraph_num` を返すか** → 返します。`item` だけを指定し項が 1 つの条の号を返したとき（SPEC-EGOV-GET-LAW-011）も `data.paragraph_num` を付け、値は補った項番号 `1` にします。応答の形が場面で変わらないようにするのが T4 の規則です
- **続きの呼び出し例に、渡された `max_chars` を入れるか** → 入れます。`get_law_range` の打ち切り時（SPEC-EGOV-GET-LAW-RANGE-008）の `range.next_actions[0].example` に、呼び出し側が渡した `max_chars` をそのまま写します。例のとおりに呼び直したときの条件が変わらないようにします

### 対応する版と進め方

- houki-egov-mcp **0.17.0**（段階 4。T4 + T5）。#64・#65・#66 を T4 の仕様 PR 1 本（`spec/<日付>-t4-response-shape`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #64` は実装 PR に書きます。0.16.0（T1 + T2 + T3）の後です
- フィールドを足すか `null` にするだけで、消す変更は入れません。houki-hub `scripts/reference-examples/` と houki-research-skill の例は `null` を前提にした文に直します（計画書 5.1）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T4 応答の形」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 4」・5.1・7 章
