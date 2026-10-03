## 追記: 10 月中に施行日を迎える版が 21 ある（2026-10-04 JST）

本文の「次に起きるのは 2026-11-01」は当たっていませんでした。shuji の手元の DB（`~/.cache/houki-egov-mcp/laws.db`、0.19.0 で 2026-10-03 に全件から作り直したもの）で次を実行すると 21 でした。

```sh
sqlite3 ~/.cache/houki-egov-mcp/laws.db "SELECT count(*) FROM laws WHERE current_revision_status='UnEnforced' AND amendment_enforcement_date BETWEEN '2026-10-04' AND '2026-10-31';"
```

0.19.1 の publish より前に施行日が来た版は、0.19.0 の `--sync` では状態が変わりません。そこで、決めること 3 の勧める案を次に改めます（houki-hub `docs/notes/2026-10-04-plan-stage6-and-followups.md` の Q3）。

1. 案 A の判定（`content_hash` が同じでも、CSV の未施行の欄から決めた状態と DB の状態を比べる）は全件の zip の取り込みにも効くので、0.19.1 に上げた後の `--bulk-download-everything` 1 回で状態が直る。条の本文は入れ直さない。CHANGELOG と README で案内する
2. `--sync` と `--status` で、施行日が今日（日本時間）以前なのに `UnEnforced` の版を数え、1 件以上なら `[WARN]` で `--bulk-download-everything` を案内する（終了コードは変えない）

施行日ごとの内訳は次のとおりで、最初は 2026-10-05 です。

| 施行日 | 版の数 |
| --- | --- |
| 2026-10-05 | 5 |
| 2026-10-16 | 7 |
| 2026-10-23 | 1 |
| 2026-10-24 | 5 |
| 2026-10-30 | 2 |
| 2026-10-31 | 1 |

0.19.1 の publish の目標は 2026-10-15（10-16 の前日）にします。間に合えば、0.19.1 の後から直す版は 10-05 の 5 版だけです。
