spec-ids 自身の仕様を `specs/` に置き、spec-gate で検査するようにしました。本文の「やること」が済んだので、これで閉じます。

| PR | 内容 |
| --- | --- |
| #13 | `specs/spec-ids.json`（`domain: SPECIDS`、`dirPrefix: ""`）と空の `specs/`、`.github/workflows/spec-gate.yml`、`AGENTS.md`。テストの中の検査の見本（`it('SPEC-…')` をソースにそのまま書いていた 19 行）を、`test/helpers.mjs` の `itLine` で実行時に組み立てる形にした（期待値と件数は同じ） |
| #14 | 初版起こし。8 つの機能（cli: check・next・init・history・pr-scope、common: format・config・frontmatter）、仕様 ID 92 件。107 件のテストのうち 106 件の名前に ID を足した（期待値は変えていない）。承認 2026-10-11 |

決めること 1〜5 は次のとおりにしました。

1. 切り方: サブコマンドごとと、共通の約束（format・config・frontmatter）の 8 つ
2. `migrate`: 0.4.0 で外れたので入れない
3. `domain: SPECIDS`、`dirPrefix: ""`
4. spec-gate の `check` と `pr-scope` は、workflow の `env.SPEC_IDS_VERSION`（今は 0.4.0）に書いた publish 済みの版で動かす。npm の latest は使わない。このリポジトリの中で `npx -y @shuji-bonji/spec-ids@<版>` を実行すると、ルートの `package.json` と同じ名前のため `spec-ids: not found` で止まるので、リポジトリの外に `npm install --prefix` で入れて呼ぶ
5. `pr-scope` も spec-ids 自身に入れる（4 と同じ版）

残っていること（別の Issue にします）:

- 各 spec.md の「## 未決」。意図か不具合かを決める項目と、テストが無いため仕様 ID を振らなかった項目がある。承認のときに一部を決めた（format の 1・2 は意図。README の「コメントや `expect(...)` の中の ID は数えません」を今の振る舞いに合わせて直すことが残る）
- テストを足して ID を振る PR（初版起こしの PR ではテストの中身を足せないため）
