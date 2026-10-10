本文の提案 ①〜③ が入り、③ の「確かめていない呼び出し例」の検出は #44 の照合と組み合わせて動くようになりました。④ は取らないと決めたので、これで閉じます。

| 提案 | 入れたもの | PR |
| --- | --- | --- |
| ① ずれを Issue にする | `stack-check.yml` を毎日（07:17 JST）にし、`stack.json` と npm の版がずれたら houki-hub に Issue を立てる（同じ Issue を更新する）。Issue は「stack.json のずれ」と「確かめていない呼び出し例」の節に分けた | #39、#54 |
| ② リファレンスを CI で作り直して PR を出す | `reference-regen.yml`（毎日 07:37 JST と手動）。npm の latest（Skill は最新のタグ）を公開版として、各リポジトリをそのタグで clone し、MCP は `npx -y @shuji-bonji/<pkg>@<版>` で起動して、ツールのページ・ライブラリのリファレンス・仕様書ページを作り直す。差分があれば `bot/reference-regen` の PR を 1 つ開く（または更新する）。作り直す前に、生成ページの冒頭の版と公開版を比べる | #51、#54 |
| ③ 呼び出し例の実測の版を機械が見る | `check-example-versions.mjs`。#44 の照合で一致した例には「- 確かめた版: vX（日付）」が入り、実測と確かめた版の新しいほうを公開版と比べる | #39、#54 |
| ④ 上流から `repository_dispatch` で知らせる | 取らない。送信側にリポジトリを跨ぐトークンが要り、① と ② が毎日回れば遅れは最大 1 日のため | — |

確かめたこと（2026-10-10 JST）:

- `reference-regen.yml` を `open_pr: false` と `open_pr: true` で 1 回ずつ回し、どちらも成功した。最初の PR は #57（MCP のツールのページ 28 枚に「確かめた版」の行、ライブラリのページの版の 1 行。仕様書ページは変わらず、承認の履歴も残った）
- better-sqlite3 を使う houki-nta-mcp も、GitHub の runner の上で npx から `tools/list` まで動いた
- 作り直す前のサイトの版は、4 リポジトリとも公開版と一致した

設計の記録は `docs/notes/2026-10-01-hub5-change-detection.md`（①③）と `docs/notes/2026-10-10-design-hub5-regen-and-examples-check.md`（②と #44）です。
