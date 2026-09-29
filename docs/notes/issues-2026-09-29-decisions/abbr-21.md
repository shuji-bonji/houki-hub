houki-hub の 2026-09-29 の決定（テーマ T3 全角・半角・ダッシュ類の正規化）に従います。規則は「揃える場所を houki-abbreviations の関数に一本化し、houki-egov-mcp と houki-nta-mcp は入口で `normalize: true` を使う」です。

### 決定の要点と、この Issue の「決めること」への答え

- **名前を受け取る関数（`getAllNames`・`extractLawNames`）に `normalize` の指定を足すか、既定を揃えるか** → `normalize` の指定を足します。`getAllNames(name, { normalize })`、`extractLawNames(text, { normalize })` にします。既定値（`resolveAbbreviation` と同じ `false` にするか、`searchByName` / `findSimilar` と同じ `true` にするか）は仕様 PR で決めます。MCP 側は `normalize: true` を渡すので、どちらでも MCP の結果は同じです
- **`lookupByLawId` で全角を半角にしてから比べるか** → `lookupByLawId(law_id, { normalize })` の指定を足し、`normalize: true` で全角を半角にしてから比べます。`lookupByLawId('３６３AC0000000108', { normalize: true })` は `消費税法` になります
- **`normalizeJpText` でもダッシュ類を `-` に揃えるか** → 揃えます。`‐` `‑` `–` `—` `―` `−` `－` を `-` にし、`normalizeLawNum` と同じ範囲にします。`normalizeJpText('１８３―２')` は `'183-2'` になります。`normalizeSearchQuery` と、`normalize: true` の `resolveAbbreviation` / `searchByName` / `findSimilar` もこの関数を通るので、同じ結果になります
- **`normalizeSearchQuery` の小文字化を ASCII だけにするか、ドキュメントを直すか** → 決定では答えきれないので、仕様 PR で決めます（T5 の規則を当てると、動きを変えずに JSDoc を「Unicode の小文字化」に直す側です）

### 対応する版と進め方

- houki-abbreviations **0.7.0**（段階 3。13 件すべてを 1 回の publish に含める）。#21・#19・#24 を T3 の仕様 PR 1 本（`spec/<日付>-normalize`、`specs/changes/` だけ。`normalize_jp_text` / `normalize_law_num` / `extract_law_names` / `get_all_names` / `lookup_by_law_id` の「入力」の節を揃える）にまとめ、段階 3 の最初に進めます。実装 PR（テスト → `src/` → 版 → `specs/current/` への取り込み）は #22・#18・#23 とまとめて 1 本にしてよいです。`Closes #21` は実装 PR に書きます
- 0.x の `^` は minor を跨がないので、publish の後に houki-egov-mcp・houki-nta-mcp の依存を `^0.7.0` に上げる PR（段階 4 の最初の実装 PR）で MCP に入ります。0.7.0 の CHANGELOG に「MCP から見て変わる結果」（`normalize: true` の結果が変わる範囲）を書きます

### 出典

- houki-hub [`docs/DECISIONS.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/DECISIONS.md) の「決定済み」2026-09-29「T3 正規化」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) 2.1・3 章・4 章「段階 1」「段階 3」・5.1・7 章
