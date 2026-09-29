# houki-abbreviations 0.7.0 で対応した Issue 13 件の close コメント下書き（2026-09-30）

`../2026-09-29-plan-spec-issues.md` の段階 3（houki-abbreviations 0.7.0）の成果物です。0.7.0 は 2026-09-30 JST に npm に公開しました（仕様 PR #30〜#33、実装 PR #34 `test/20261001-0.7.0`、main `a7a250a`）。対応した Issue 13 件（#13〜#25）を閉じるときに、各 Issue の「決めること」に 0.7.0 がどう答えたかをコメントします。コメントの本文がこのディレクトリの Markdown で、投稿と close は `scripts/close-issues-2026-09-30-abbr-0.7.0.sh`（gh CLI）で行います。

各本文は「1 文目（v0.7.0 で対応した旨）」「『決めること』への答え（決めた内容 → 仕様 ID → 利用側で変わること）」「出典（仕様 PR・実装 PR・`specs/releases/v0.7.0/<slug>/proposal.md`・CHANGELOG の「互換性」）」の 3 節です。事実は proposal.md・`specs/current/*/spec.md`・CHANGELOG・コミット `07780c0` `de48820` `3f23d5b` から取っています。

## 対応表（Issue → 差分 → 本文）

| Issue | 題 | 差分（`specs/releases/v0.7.0/`） | 仕様 PR | 本文 |
|---|---|---|---|---|
| #21 | 関数ごとに全角・ダッシュ類・大文字の扱いが揃っていない | `20261001-normalize` | #30 | `abbr-21.md` |
| #19 | `extractLawNames` が 2 つの法令名にまたがる一致を返し、全角の表記を吸収しない | `20261001-normalize` | #30 | `abbr-19.md` |
| #24 | 漢数字・大きな数・BMP 外の文字で入力が意図と違う値になる | `20261001-normalize` | #30 | `abbr-24.md` |
| #22 | `limit` に `NaN` を渡したときの扱いと上限が関数ごとに違う | `20261001-input-guards` | #31 | `abbr-22.md` |
| #18 | 壊れた取得時刻や `NaN` が鮮度判定で `fresh` / `outdated` になる | `20261001-input-guards` | #31 | `abbr-18.md` |
| #23 | `isValidLawId` が元号の桁と府省コードの範囲を確かめない | `20261001-input-guards` | #31 | `abbr-23.md` |
| #14 | 名前がエントリをまたいで重複したときの扱いと、`validateAllEntries` が見逃す値 | `20261001-dictionary-rules` | #32 | `abbr-14.md` |
| #15 | `aliases` に自分の `abbr`・`formal` と同じ値を持つエントリがあり、`extractLawNames` が同じ一致を 2 件返す | `20261001-dictionary-rules` | #32 | `abbr-15.md` |
| #25 | 告示を辞書に入れるときの `category` が `CATEGORIES` に無い | `20261001-dictionary-rules` | #32 | `abbr-25.md` |
| #16 | 辞書の件数と、件数 0 の種別・MCP を約束にするか（`getAbbreviationStats`） | `20261001-dictionary-rules` | #32 | `abbr-16.md` |
| #20 | `findSimilar`・`suggestCorrection` が短い `query` で意味の違う略称や入力そのものを候補に返す | `20261001-dictionary-rules` | #32 | `abbr-20.md` |
| #13 | 辞書のエントリと公開定数を実行時に書き換えられ、他の関数の結果が変わる | `20261001-freeze` | #33 | `abbr-13.md` |
| #17 | README・JSDoc・CONTRIBUTING の記述が v0.6.0 の実際の結果と合わない | （差分なし。文書と `ci.yml` の修正だけ） | — | `abbr-17.md` |

## 投稿の前に見る点

- `abbr-17.md` に「0.7.0 では直していないもの」として `docs/v0.4.0-roadmap.md` の例と `src/search.test.ts` の SPEC-ABBR-FIND-SIMILAR-002 のテストを書いてあります。閉じる前に直すなら、その段落を消してから投稿します
- proposal.md と CHANGELOG の日付は「2026-10-01」ですが、PR #30〜#34 のマージと npm の公開時刻は 2026-09-29 UTC（2026-09-30 JST）です。本文では npm の公開日（2026-09-30 JST）を使い、承認日は書いていません

## 投稿の手順

1. `DRY_RUN=1 ./scripts/close-issues-2026-09-30-abbr-0.7.0.sh` で対象と本文のファイルを確かめます
2. `./scripts/close-issues-2026-09-30-abbr-0.7.0.sh` で 13 件にコメントを投稿し、`--reason completed` で閉じます（確認あり）。投稿した Issue と URL は `closed.tsv` に残り、二重に投稿しません
3. 投稿の後、`../2026-09-29-plan-spec-issues.md` 7 章の表に段階 3 の「済（日付）」を書き足します
