# 仕様 ID の突合・採番を npm パッケージにする計画（houki-hub#26 の続き）

- 日付: 2026-09-22（JST）
- 状態: 計画。着手は houki-nta-mcp の `spec/nta-get-tsutatsu` PR のマージ後
- 出典: ai-design-advisor Discussion #21、houki-hub `docs/DECISIONS.md` 2026-09-21 / 2026-09-22 の行

## 目的

`specs/` の型（仕様の正本・差分・版）と、仕様 ID とテストを突き合わせる「止め」を、houki family の外（pdf 系、e-shiwake）でも同じ版で使えるようにする。`scripts/` をコピーして回すと版がずれるので、配る単位を npm パッケージにする。

## 元になるもの

houki-nta-mcp `spec/nta-get-tsutatsu` ブランチの 3 本。

| ファイル | 役割 |
|---|---|
| `scripts/spec-id-format.mjs` | ID の形式（`SPEC-<領域>-<機能>-<3 桁>`。機能は `specs/current/<dir>` のディレクトリ名から接頭辞を除いて導く）、見出し `### SPEC-…` の形、テスト名の取り方、`specs/` とテストの走査 |
| `scripts/check-spec-ids.mjs` | 見出しの重複、仕様にあってテストに無い ID、テストにあって仕様に無い ID、見出しの ID の機能がディレクトリ名と不一致、のどれかがあれば exit 1 |
| `scripts/next-spec-id.mjs` | `spec.md` のパスかディレクトリ名を受け、その機能の見出しの最大番号 +1 を表示（`--count`） |

## パッケージの形（案）

- 名前: 未定（`@shuji-bonji/spec-ids` を仮置き）。依存ゼロ、Node 22 以上
- CLI: `spec-ids check` / `spec-ids next [--count N]` / `spec-ids init --domain XXX`
- 設定: 各リポジトリの `specs/spec-ids.json`

```json
{
  "domain": "NTA",
  "dirPrefix": "nta_",
  "tests": ["src/**/*.test.ts", "tests/**/*.test.ts"]
}
```

`dirPrefix` は、`specs/current/<dir>` のディレクトリ名から機能を導くときに除く接頭辞（無ければ空）。

- `init` が作るもの: `specs/current` / `specs/changes` / `specs/releases`、`specs/spec-ids.json`、`AGENTS.md` の「仕様の正本」「仕様 ID」「役割」の節（既存の `AGENTS.md` があれば追記せず差分を表示する）、`spec.md` / `proposal.md` の雛形
- 再利用ワークフロー `spec-gate.yml` を同じリポジトリに置き、各リポジトリの `ci.yml` から `uses:` で呼べるようにする（`npx spec-ids check` 1 行でも可）

## リポジトリごとに変わる前提（設定に出すもの）

| 前提 | houki-nta-mcp | 他で変わる例 |
|---|---|---|
| 領域と接頭辞 | `NTA` / `nta_` | pdf-reader-mcp、e-shiwake などリポジトリごとに 1 つ。接頭辞はツール名の付け方で変わる（無いリポジトリもある） |
| テストの場所と拡張子 | `src/`・`tests/` の `*.test.ts`（vitest） | Angular / Jasmine なら `*.spec.ts` |
| テスト名の取り方 | `describe(` / `it(` / `test(` の文字列リテラル | Jasmine も同じ。他言語は当面対象外 |

変わらないもの: `specs/` の 3 ディレクトリ、見出しの形、判定 4 つ、採番の考え方（機能ごとの通し番号。予約はしない。万一の重複はマージ時の重複検知で止める）、ID の形式を 1 箇所に置く方針。

## 手順

1. houki-nta-mcp の PR（`spec/nta-get-tsutatsu`）を `scripts/` のままマージする
2. 新リポジトリを作り、3 本を CLI に組み替えて `init` を足す。README は利用者向けの文で書く
3. houki-nta-mcp の 2 周目（最初の差分）で `scripts/` の 3 本をパッケージに置き換える
4. pdf 系・e-shiwake は `spec-ids init` から始める。最初の 1 機能は各リポジトリで 1 つだけ
5. Steward / Auditor / Publisher の指示文は、1 機能・1 差分の試験が通ってから Claude plugin として別に出す（手順書 §9）
