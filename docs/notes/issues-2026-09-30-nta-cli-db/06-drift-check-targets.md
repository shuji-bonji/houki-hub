`--check-baseline-drift` は menu.htm の下にない 4 件を常に `ok` にし、`<ok>/9 OK` に数える
`--check-baseline-drift` は `--health-check` の代表ページ（`CANARY_TARGETS`、9 件）を `/law/tsutatsu/menu.htm` と突き合わせますが、目次の下にあるのは 5 件（基本通達 4 種と改正通達の索引）だけです。残り 4 件は判定の対象外なのに常に `ok` になり、まとめの `[drift-check] <ok>/9 OK` に数えられます。利用者が「9 件とも確かめた」と読める表示です。

### いまの状態（v0.21.3）

- `detectBaselineDrift` は `CANARY_TARGETS` の 9 件それぞれを `classifyDrift` で判定する。目次に対応する項目が無い 4 件（`--health-check` の 6 大コンテンツのうち通達以外）は SPEC-NTA-CLI-HEALTH-CHECK-001 の規則で `ok` になる
- 標準エラー出力の 1 件ごとの `✓` と、`[drift-check] <ok>/9 OK, drift=<n>` の `<ok>` は対象外の 4 件を含む。標準出力の JSON の `entries` にも 9 件が並ぶ
- テストは判定（SPEC-NTA-CLI-HEALTH-CHECK-001〜003）にあり、対象外の扱いを区別していない

### 決めること

- 対象外の 4 件を `status` の値（例: `not-applicable`）で分け、まとめの分母を 5 にするか
- `--check-baseline-drift` の対象を目次の下にある 5 件に限る（`CANARY_TARGETS` から絞る）か
- 今のまま（9 件を並べ、対象外は `ok`）を仕様にし、使い方に書くか

### 完了条件

- 決めた規則が `specs/current/cli_health_check/spec.md` に書かれ、受入テストがある

出典: `specs/current/` の「未決」— cli_health_check 4（#75 の初版起こし）
