houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査）に従います。T1 の規則は MCP の inputSchema について「範囲外の値は `INVALID_ARGUMENT` にし、丸めない」です。ライブラリの関数には inputSchema が無いので、規則の「丸めない」だけを写します。

### 決定の要点と、この Issue の「決めること」への答え

- **`NaN`（と `Infinity`）を既定値として扱うか、例外にするか** → 例外にします。T1 の「丸めない」を関数に写すと、`searchByName` / `findSimilar` / `suggestCorrection` の `limit` に `NaN` / `Infinity` を渡したときは既定値（50 / 5 / 5）に置き換えず `RangeError` を投げます。`searchByName('法', { limit: NaN })` が 167 件を返す動きと、`findSimilar` の 0 件は無くなります。例外の型（`RangeError` か `TypeError` か）は仕様 PR で確定します
- **`findSimilar` / `suggestCorrection` にも上限を設けるか。設けるなら値** → 設けます（T1 の「`maximum` を書く」に当たる）。値（`searchByName` の 500 と同じにするか、別の値にするか）は仕様 PR で決めます。上限を超えた値の扱いは、`NaN` と同じく例外です
- この Issue の前提「1 未満は 1 件」（各 spec.md の未決として今の動きのまま受入テストを足す）について → T1 の「丸めない」とは食い違います。1 未満を 1 件に丸めたままにするか、`NaN` と同じく例外にするかは、仕様 PR で決めて 3 関数で揃えます

### 対応する版と進め方

- houki-abbreviations **0.7.0**（段階 3）。#22・#18・#23 を仕様 PR 1 本（`spec/<日付>-input-guards`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #22` は実装 PR に書きます。T3 の仕様 PR（#21・#19・#24）のマージ後に `main` に載せ直してから `spec-ids next` を取り直します（計画書 5.3）

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 3」・5.3・7 章
