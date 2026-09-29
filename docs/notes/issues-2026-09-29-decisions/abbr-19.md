houki-hub の 2026-09-29 の決定（テーマ T3 全角・半角・ダッシュ類の正規化）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **ほかの一致にまたがる一致を除くか** → 決定では答えきれないので、仕様 PR で決めます（`消費税法法人税法` の `法法` の扱い）
- **探す前に `normalizeJpText` を通すか（通すなら、返す `position` と `length` を元の文字列の位置で返すか）** → 通します。`extractLawNames(text, { normalize: true })` の指定を足し（#21）、`normalizeJpText` を通してから探します。`ＰＬ法` は `製造物責任法` の一致を返します。`position` / `length` は元の文字列の位置で返します（正規化で文字数が変わっても、呼び出し側が元の文字列を切り出せるようにする）

### 対応する版と進め方

- houki-abbreviations **0.7.0**（段階 3）。#21・#19・#24 を T3 の仕様 PR 1 本（`spec/<日付>-normalize`、`specs/changes/` だけ）にまとめ、実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）に進みます。`Closes #19` は実装 PR に書きます。上の 2 つの入力（`消費税法法人税法`、`ＰＬ法`）の結果を仕様に書き、受入テストにします

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T3 正規化」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・4 章「段階 1」「段階 3」・7 章
