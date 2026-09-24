# 仕様 ID の突合・採番を npm パッケージにする計画（houki-hub#26 の続き）

- 日付: 2026-09-22（JST）
- 状態: **完了（2026-09-24 JST）**。`@shuji-bonji/spec-ids` 0.1.0 を npm に publish（初回は手元で `npm publish`、以後は Trusted Publisher 経由）。houki-nta-mcp は PR #51 で `scripts/` を削除しパッケージに切り替え、main の CI（spec-gate）が通っている。次は #50 の 2 ツール目から（`docs/notes/2026-09-24-instructions-nta-issue50-specs.md`）
- 元の状態: 計画。着手は houki-nta-mcp の `spec/nta-get-tsutatsu` PR のマージ後
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

設定に出さないもの（2026-09-22 の PR #49 レビューで確定）:

- `ID_RE` / `HEADING_RE` / `TEST_NAME_RE`。形式を変えるときはパッケージの版を上げる。リポジトリごとに正規表現を変えると `parseId` と機能の照合が壊れる
- `specs/current` / `specs/changes` / `specs/releases` の置き場。機能はディレクトリ名から導くので、構造そのものが契約。glob で自由にすると `featureOfSpecPath` が成り立たない
- 基点ディレクトリ `ROOT` は `import.meta.url` から取らない。`npx` で配ると `node_modules` の中を指す。`specs/spec-ids.json` を上へ辿って見つけたディレクトリを基点にする

- `init` が作るもの: `specs/current` / `specs/changes` / `specs/releases`、`specs/spec-ids.json`、`.github/workflows/spec-gate.yml`（中身は `npx spec-ids check`）、`AGENTS.md` に貼る「仕様 ID」の段落 1 つ（既存の `AGENTS.md` があれば追記せず表示するだけ）
- `init` に入れないもの: 役割表（Steward / Auditor / Publisher）、承認フロー、`spec.md` / `proposal.md` の雛形、承認日や `REMOVED` の意味検査、`releases/` へのコピー。これらは各リポジトリの `AGENTS.md` と運用の側に残す
- CI からの呼び方は `devDependencies` に入れて `npm ci` 後に `npx spec-ids check`。`npm ci` の前に `npx -y @shuji-bonji/spec-ids@<major> check` でも動くが、版を固定するために major は必ず書く

## リポジトリごとに変わる前提（設定に出すもの）

| 前提 | houki-nta-mcp | 他で変わる例 |
|---|---|---|
| 領域と接頭辞 | `NTA` / `nta_` | pdf-reader-mcp、e-shiwake などリポジトリごとに 1 つ。接頭辞はツール名の付け方で変わる（無いリポジトリもある） |
| テストの場所と拡張子 | `src/`・`tests/` の `*.test.ts`（vitest） | Angular / Jasmine なら `*.spec.ts` |
| テスト名の取り方 | `describe(` / `it(` / `test(` の文字列リテラル | Jasmine も同じ。他言語は当面対象外 |

変わらないもの: `specs/` の 3 ディレクトリ、見出しの形、判定 4 つ、採番の考え方（機能ごとの通し番号。予約はしない。万一の重複はマージ時の重複検知で止める）、ID の形式を 1 箇所に置く方針。

## 手順

1. houki-nta-mcp の PR #49（`spec/nta-get-tsutatsu`）を `scripts/` のままマージする。nta とパッケージを同時に直すと形式の差分が両側に残るので、先にマージして形式を一度固定する
2. 新リポジトリを作り、3 本を CLI に組み替えて `init` を足す。README は利用者向けの文で書く
3. houki-nta-mcp の 2 周目（最初の差分）で `scripts/` の 3 本をパッケージに置き換える
4. 2 つ目のリポジトリ（houki-egov-mcp、または pdf 系・e-shiwake）に同じ 3 ファイルをコピーする直前が切り出しの境界。そこから `spec-ids init` で始める。最初の 1 機能は各リポジトリで 1 つだけ
5. Steward / Auditor / Publisher の指示文は、1 機能・1 差分の試験が通ってから Claude plugin として別に出す（手順書 §9）
