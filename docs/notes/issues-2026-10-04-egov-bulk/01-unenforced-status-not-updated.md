施行日の当日に e-Gov が配り直す版を、ローカル DB の取り込みが `unchanged` として飛ばすため、施行日を過ぎても版の状態が `UnEnforced` のまま残ります。同じ法令の古い版も `CurrentEnforced` のまま残るので、`search_fulltext` は施行後も改正前の条文を返し続けます。

## e-Gov の一括ダウンロードの配り方（2026-10-04 JST に実測）

2026-09-01〜2026-10-02 の日次差分 zip（`file_section=3`）と全件 zip（`file_section=1`）を取得して、`all_law_list.csv` / `R<YYMMDD>.csv` の行と XML を比べました。

- 全件 zip には、法令ごとに現行の版 1 つと、公布済みでまだ施行されていない版のすべてが入っている（10,414 版のうち、未施行の欄が `○` の版が 1,410。施行済みで置き換わった前の版は入っていない）
- 改正が公布されると、その日の差分に施行日ごとの版が未施行の欄 `○` で入る
- **施行日の当日の差分に、同じ版（同じ `law_revision_id`）が、未施行の欄を空にしてもう一度入る。** `○` から空に変わった版は 48 件あり、48 件とも空で配られたのは施行日の当日の差分で、XML はバイト単位で前回と同じだった
- 施行日の前日の差分に、未施行の欄が空のまま入る版もある（59 件。09-30 の差分に施行日 10-01 の版が 34 件など）

例: `501M60000080006_20261001_507M60000080019` は 09-01 の差分に `○`、10-01 の差分に空で入っている。XML の SHA-256 は 2 回とも同じ。

## 何が起きるか（0.19.0 / main `f3b7fc1`）

`src/services/bulk/ingester.ts` は、同じ版の ID の `content_hash` が前回と同じとき、`unchanged` と数えて `continue` する（316〜320 行目）。`buildLawRow` と、現行の版を 1 つにそろえる処理（SPEC-EGOV-CLI-BULK-DOWNLOAD-016）より前なので、CSV の未施行の欄が変わっていても次のどれも起きない。

- 届いた版の `current_revision_status` を `UnEnforced` から `CurrentEnforced` に変える
- 同じ法令の施行日が前の現行の版を `PreviousEnforced` に下げる

空の DB に、09-02 → 09-17 → 10-01 の差分 zip を順に `ingestZip` で取り込むと（2026-10-04 JST、main `f3b7fc1` のクローンで確かめた）、医師法施行規則（`323M40000100047`）は次のようになる。

| 版の ID | 取り込み後の状態 | 正しい状態 |
| --- | --- | --- |
| `323M40000100047_20260814_508M60000100128` | `CurrentEnforced` | `PreviousEnforced` |
| `323M40000100047_20260917_508M60000100132` | `UnEnforced` | `PreviousEnforced` |
| `323M40000100047_20261001_508M60000100107` | `UnEnforced` | `CurrentEnforced` |
| `323M40000100047_20270401_508M60000100128` | `UnEnforced` | `UnEnforced` |

取り込みの件数は 09-02 が `upserted: 26`、09-17 が `upserted: 14`・`unchanged: 5`、10-01 が `upserted: 338`・`unchanged: 5`。`unchanged` の 5 件が、配り直された版。

`search_fulltext` は現行の版だけを返す（SPEC-EGOV-SEARCH-FULLTEXT-008）ので、2026-10-01 を過ぎても 2026-08-14 の版の条文を返す。

- `--sync` を続けても直らない（配り直しは施行日の当日の 1 回だけ）
- `--bulk-download-everything` をやり直しても直らない（全件 zip の XML も同じなので、やはり `unchanged`）。`INGEST_VERSION` を上げたときだけ直る
- 前日に未施行の欄が空で届いた版は、施行日の 1 日前から `CurrentEnforced` になり、新しい条文を 1 日早く返す

shuji の手元の DB（`~/.cache/houki-egov-mcp/laws.db`、2026-10-03 に全件から作り直し）は、施行日が 2026-10-04 以前の `UnEnforced` の版が 0 件で、まだ起きていない。次に起きるのは 2026-11-01（例: 消費税法の `363AC0000000108_20261101_507AC0000000013` が `UnEnforced` で入っている）。

## 決めること

1. 直し方
   - 案 A（勧める）: `content_hash` が同じでも、CSV の未施行の欄から決めた状態が DB の状態と違えば、`laws` の状態だけを書き換え、SPEC-EGOV-CLI-BULK-DOWNLOAD-016 の処理（古い現行の版を下げる）を通す。条の本文は入れ直さない。件数は `unchanged` のまま数えるか、別の数（例: `status_changed`）にするかも決める
   - 案 B: `content_hash` の入力に未施行の欄を混ぜる。変更は小さいが、施行日の当日の差分で数百件の条の本文を入れ直す
2. 施行日の前日に未施行の欄が空で届く版の扱い
   - 案 A（勧める）: e-Gov の CSV の未施行の欄に従う（1 日早く現行になる）。e-Gov 法令検索の表示と同じになる
   - 案 B: 施行日が取り込んだ日（日本時間）より後なら、空でも `UnEnforced` にする。この場合、施行日の当日に配り直しが無い版は `UnEnforced` のまま残るので、日付を見て切り替える処理も要る
3. すでに状態が残ってしまった DB の直し方。案 A なら、直した版で `--bulk-download-everything` を 1 回実行すれば、全件 zip の未施行の欄で状態が直る。CHANGELOG と README で案内するか、`--sync` のたびに「施行日が今日以前の `UnEnforced`」を数えて警告するか
4. 版。スキーマの版は上げない。2026-11-01 より前に patch（0.19.1）で出すか

仕様は `specs/current/cli_bulk_download/spec.md` の SPEC-EGOV-CLI-BULK-DOWNLOAD-014（中身が前回と同じ法令は書き換えない）・011・016 と、`cli_sync` の SPEC-EGOV-CLI-SYNC-006 を直す差分になる。

## 関係する場所

- `src/services/bulk/ingester.ts`（316〜320 行目の `unchanged` の判定、`demoteOlderRevisions` / `demoteIfNewerExists`）
- `specs/current/cli_bulk_download/spec.md`（011・014・016、「できないこと」の「前の版・廃止を e-Gov の履歴から正確に判定すること」）
- `specs/current/search_fulltext/spec.md`（SPEC-EGOV-SEARCH-FULLTEXT-008）
- houki-hub `site/docs/mcp/houki-egov.md` の「元データが変わったときに何が起きるか」
