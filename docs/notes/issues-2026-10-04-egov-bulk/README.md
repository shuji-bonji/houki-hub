# houki-egov-mcp: 一括ダウンロードの取り込みと DB の案内の見直し（2026-10-04）

バルク機能（XML 一括ダウンロード）の扱いを見直す会話（2026-10-04 JST）で見つけた 2 件の Issue の下書きです。材料は `docs/notes/2026-10-04-handoff-egov-db-path.md` と、同日の e-Gov の一括ダウンロードの実測です。

| # | 本文 | 題名 |
|---|---|---|
| 01（#107） | `01-unenforced-status-not-updated.md` | 施行日の当日に配り直される版を unchanged として飛ばし、施行後も未施行のまま・旧版が現行のまま残る |
| 02（#108） | `02-fallback-note-db-path.md` | search_fulltext の api-fallback の note と案内のコマンドが、DB が無い・別のファイルを開いているを区別せず、そのままでは動かないことがある |

起票は `scripts/create-issues-2026-10-04-egov-bulk.sh`（`DRY_RUN=1` で確認だけ）。作った番号は `created.tsv` に残ります。2026-10-04 JST に houki-egov-mcp #107・#108 として起票しました。

01 は 2026-11-01 に施行される版（消費税法など）で表に出るので、先に直すことを勧めます。
