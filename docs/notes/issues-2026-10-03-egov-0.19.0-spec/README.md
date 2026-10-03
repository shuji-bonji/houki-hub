# houki-egov-mcp: 0.19.0 の仕様 PR で見つけた、差分の外の問題（2026-10-03）

houki-egov-mcp の段階 5（0.19.0、DB と CLI）の仕様 PR（`20261003-db-cli`。ブランチ `spec/20261003-db-cli`、`8d4cff8`）を書く途中で、差分に入れなかった問題を 2 件見つけました。その Issue の下書きです。

| # | 本文 | 題名 |
|---|---|---|
| 01 | `01-suppl-paragraph-only-intro.md` | 段落だけの附則が search_fulltext で「附則(n) intro」と返り、仕様にも書かれていない |
| 02 | `02-env-number-validation.md` | HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS・HOUKI_EGOV_BULK_RETRY の値を検査せず、負の数をそのまま使う |

起票は `scripts/create-issues-2026-10-03-egov-0.19.0-spec.sh`（`DRY_RUN=1` で確かめてから実行）。作った番号は `created.tsv` に残ります。
