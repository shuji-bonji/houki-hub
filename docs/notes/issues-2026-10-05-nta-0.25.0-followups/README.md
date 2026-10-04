# houki-nta-mcp 0.25.0 の後に起票する Issue

houki-nta-mcp 0.25.0（#138・#137、仕様 PR #142）の実装 PR で見つかった、差分 `20261004-db-location` の外の 3 件です。

| ファイル | 題 | 出典 |
| --- | --- | --- |
| `01-unopenable-db-hint.md` | 開けないローカル DB で、読むだけのツールの hint に DB のパスと直し方が入らない | proposal.md の「人が判断すること」13 |
| `02-bulk-tax-answer-index-save-failure.md` | --bulk-download-tax-answer がタックスアンサーの索引を保存できないときの終わり方が決まっていない | proposal.md の「人が判断すること」17 |
| `03-get-tax-answer-018-example.md` | SPEC-NTA-GET-TAX-ANSWER-018 の例の「同じ DB でもう一度呼ぶと」が前提を書き落としている | 実装 PR で止めて聞いたこと |

起票は `scripts/create-issues-2026-10-05-nta-0.25.0-followups.sh`（`DRY_RUN=1` で確かめてから）。作った番号は `created.tsv` に残ります。
