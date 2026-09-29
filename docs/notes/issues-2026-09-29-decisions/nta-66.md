houki-hub の 2026-09-29 の決定（テーマ T1 引数の検査と T3 全角・半角・ダッシュ類の正規化）に従います。

### 決定の要点と、この Issue の「決めること」への答え

- **識別子ごとに形の検査を足すか（足すなら `INVALID_ARGUMENT` と、正しい形を示す `hint`）** → 足します（T1）。`nta_get_bunshokaitou` / `nta_get_kaisei_tsutatsu` の `docId`、`nta_get_qa` の `category` / `id`、`nta_get_tax_answer` の `no` の形を確かめ、合わないときは `INVALID_ARGUMENT`（`detail.issues[].path` に引数名、`detail.tool` にツール名、`message` は日本語、`hint` に正しい形）にします。それぞれの `pattern`（`税目/番号` の形、新形式・旧形式、数字だけ、番号の桁数）は仕様 PR で決めます
- **全角の数字・記号を半角に揃えてから読む扱いを、取得系と `resolve_abbreviation` で揃えるか** → 揃えます（T3）。揃える場所は houki-abbreviations に一本化し、`resolve_abbreviation` は `normalize: true` で引き（`ＰＬ法`、全角スペース入りの `消　法` を吸収する範囲は houki-abbreviations 0.7.0 の #21・#17 で決まる）、取得系の識別子は `normalizeJpText` を通してから形を確かめます。`nta_get_tsutatsu` の `clause`（SPEC-NTA-GET-TSUTATSU-004 / 008）と同じ扱いになります。注意: inputSchema の `pattern` は正規化の前に走るので、全角を受け付けるなら形の検査は inputSchema ではなく各ツールの処理（正規化の後）に置くか、`pattern` を全角も通る形にする必要があります。どちらにするかは仕様 PR で決めます。`nta_get_tax_answer` の全角 `"６１０１"` を `INVALID_ARGUMENT` とする SPEC-NTA-GET-TAX-ANSWER-001 は、T3 に揃えると MODIFIED になります
- **`nta_get_tax_answer` の番号を 4 桁に限るか** → 決定では答えきれないので、仕様 PR で決めます

### 対応する版と進め方

- 先に houki-abbreviations **0.7.0**（段階 3。T3 の仕様 PR `spec/<日付>-normalize`）を publish し、houki-nta-mcp の依存を `^0.7.0` に上げます（0.x の `^` は minor を跨がない）
- houki-nta-mcp **0.22.0**（段階 4。T1 + T2 + T3 + 依存 `^0.7.0`）。形の検査は T1 の仕様 PR（`spec/<日付>-t1-argument-guards`、#66・#67・#68・#69・#79）、全角の扱いは T3 の仕様 PR（`spec/<日付>-t3-normalize`）に分け、どちらも `specs/changes/` だけの仕様 PR → 実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）の順です。`Closes #66` は実装 PR に書きます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T1 引数の検査」「T3 正規化」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・3 章・4 章「段階 1」「段階 3」「段階 4」・7 章
