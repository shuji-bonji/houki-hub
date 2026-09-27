# houki-research-skill PR 本文（ci/20260928-mcp-refs、0.15.0）

---

## 概要

Skill の文書に書いたツールの呼び出し例とエラーの `code` が MCP の実物と食い違っていないかを、CI で確かめるようにしました。あわせて、エラーの `code` の正本を各 MCP の仕様に移し、`docs/ERROR-CODES.md` をそのまとめの一覧にしました（houki-hub#27 の検討から）。

## 変更

- `scripts/check-mcp-refs.mjs`: 2 つの検査
  - ツール名・引数名: 呼び出し例（JSON の `tool` / `args`、`next_actions` の `action` / `example`、本文の `ツール名 { 引数 }`、バッククォートのツール名）を各 MCP の `tools/list` の `inputSchema` と突き合わせる
  - エラーの code: houki-egov-mcp・houki-nta-mcp の `specs/current/common_errors/spec.md`、pdf-reader-mcp の型 `LawErrorCode` と、`docs/ERROR-CODES.md` の表・文書の本文の code を突き合わせる
- `scripts/update-mcp-snapshots.mjs` と `mcp-snapshots/`: 基準（egov v0.15.2 / nta v0.21.1 / pdf-reader v0.15.5）。`--check` でコミット済みと実物を比べる
- `.github/workflows/ci.yml`（push・PR）、`mcp-drift.yml`（毎週月曜 09:13 JST、npm の最新版）
- `docs/ERROR-CODES.md`: 正典 → 一覧。発生元を正本に合わせた（`LAW_NOT_FOUND` は egov のみ、`ARTICLE_NOT_FOUND` は nta も、`FILE_TOO_LARGE` を追加 など）。`retryable` の列と、確かめていない応答の例を外した
- `docs/ERROR-HANDLING.md`: `search_tsutatsu` → `nta_search_tsutatsu`（検査で見つかった誤り）
- 版 0.15.0

## 確認

- `node --test 'scripts/test/*.test.mjs'`: 19 件 pass
- `node scripts/check-mcp-refs.mjs`: 文書 13 件・呼び出し例 89 か所・ツール名 192 か所・code 114 か所で問題なし
- わざと引数名・印・code を壊した写しで、6 件すべてを検出することを確認

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01SzemFEkPPHRhMjajF62WTT
