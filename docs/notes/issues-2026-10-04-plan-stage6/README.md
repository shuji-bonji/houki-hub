# 次の計画（段階 6 と計画の後の Issue）の段階 0 で投稿するコメント（2026-10-04 JST）

計画書: `docs/notes/2026-10-04-plan-stage6-and-followups.md`。投稿は `scripts/close-issues-2026-10-04-plan-stage6.sh`（`DRY_RUN=1` で確認だけ）。投稿した URL は `posted.tsv` に残ります。

| ファイル | Issue | 動き | 前提（計画書 8.2） |
| --- | --- | --- | --- |
| `egov-107.md` | houki-egov-mcp #107 | コメントだけ | — |
| `egov-105.md` | houki-egov-mcp #105 | コメントして閉じる | Q8 が案 A |
| `abbr-35.md` | houki-abbreviations #35 | 直近の `verify-law-ids` の実行が成功していれば、その URL を `{{RUN_URL}}` に入れてコメントして閉じる。成功していなければ何もしない | 先に Actions で `workflow_dispatch` を実行しておく（`gh workflow run verify-law-ids.yml -R shuji-bonji/houki-abbreviations`） |
| `nta-116.md` | houki-nta-mcp #116 | コメントだけ | Q6 が案 A |
| `hub-26.md` | houki-hub #26 | コメントして閉じる | Q9 が案 A |

決定が勧める案と違うときは、スクリプトの `TABLE` から該当の行を消してから実行してください。
