`get_law_revisions` の応答の値と並びが、説明と合わないか、決まっていません。`latest` で「最新」を求めると、まだ施行されていない改正が先頭に来ます。

### いまの状態（v0.15.1）

- **状態の値:** tool description は「状態（現行/旧法/未施行）」と書くが、`revisions[].current_revision_status` は e-Gov の値をそのまま返し、`CurrentEnforced` / `PreviousEnforced` / `UnEnforced` などの英語の値になる（2026-09-28 に `消法` で確認）
- **`latest` の順:** ツールは並べ替えず、e-Gov が返した順の先頭から `latest` 件を返す。2026-09-28 に `消法`・`latest: 3` で確かめると施行日の新しい順で、まだ施行されていない改正（`UnEnforced`、施行日 2030-06-19 など）が先頭に来た
- **値の無いフィールド:** `amendment_enforcement_comment` などは、e-Gov の値が無ければ `null` になることも、フィールドが付かないこともある（e-Gov の応答のまま）

`latest` の 0 以下・小数の扱いは #ISSUE-04 で扱います。

### 決めること

- description を e-Gov の値に合わせるか、日本語の説明を別のフィールドで付けるか
- 「最新」の順を、施行日の新しい順（未施行を含む）とするか、施行済みだけ・公布日の順とするか、e-Gov の順に頼るか。ツールで並べ替えるか
- 値の無いフィールドを `null` に揃えるか、付けないことに揃えるか

### 完了条件

- 決めた規則が `specs/current/get_law_revisions/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— get_law_revisions 1・2・6（初版起こし）
