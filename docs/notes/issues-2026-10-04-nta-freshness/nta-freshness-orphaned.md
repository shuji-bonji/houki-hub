<!-- 投稿先: shuji-bonji/houki-nta-mcp。ラベル案: bug / spec。投稿は shuji が gh で行う -->

# 検索ツールの `freshness` が、国税庁の索引から消えた文書の古い取得日時で止まり、投入をやり直しても `fresh` に戻らない

## 起きていること

`nta_search_tax_answer` の `freshness` が、`--bulk-download-everything` をやり直した直後も `staleness: "stale"` のままになる。

2026-10-04 JST に houki-hub の呼び出し例を取り直したとき（houki-hub `docs/notes/2026-10-04-regression-check-egov-0.19.1-nta-0.24.0.md` の見つかったこと 7）、次のようになった。

| 項目 | 値 |
| --- | --- |
| `oldest_fetched_at` | `2026-09-07T21:06:49.516Z` |
| `newest_fetched_at` | `2026-10-04T03:51:17.445Z`（取り込み直した時刻） |
| `staleness` / `days_since_oldest` | `stale` / 26 |

ローカル DB を引くと、`fetched_at` が 2026-10-01 より前のタックスアンサーの行は 1 件だけだった。

```sql
SELECT doc_id, fetched_at, orphaned_at, source_url
FROM document WHERE doc_type = 'tax-answer' AND fetched_at < '2026-10-01';
-- 2882 | 2026-09-07T21:06:49.516Z | 2026-10-04T02:11:37.431Z | https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2882.htm
```

No.2882 は 2026-10-04 の投入で国税庁の索引から消えたことが確認され、`orphaned_at` が付いた。投入は索引から消えた文書の行を残し（SPEC-NTA-SEARCH-RULES-011）、取り直さないので、`fetched_at` は前回の取得日時のまま残る。`freshness` の範囲は「タックスアンサー全体」（SPEC-NTA-SEARCH-RULES-017）なので、この行の日時が `oldest_fetched_at` になる。

## 困ること

- 索引から消えた文書が 1 件でもあると、その種別の `freshness` は投入を何度やり直しても `fresh` に戻らない
- No.2882 の行は 2026-10-07 に 30 日を超え、`staleness` が `outdated` になる。`warning` は「最新化するには `--bulk-download-tax-answer` を実行してください」と案内するが、実行しても直らない（案内が誤りになる）
- 索引から文書が消えうる他の種別（質疑応答事例・改正通達・事務運営指針・文書回答事例）でも同じことが起きうる

## 決めること

1. `freshness` を計算する範囲から、`orphaned_at` の付いた行を外すか（案 A: 外す。索引にある文書だけで鮮度を判定する / 案 B: 外さず、`warning` の文で索引から消えた文書があることを書く / 案 C: 今のまま）
2. 案 A のとき、索引にある文書が 1 件も無い範囲（例: 絞った税目の文書がすべて索引から消えた）では `freshness` を付けないか（SPEC-NTA-SEARCH-RULES-017 の「範囲に文書が 1 件も無いときは付けない」に合わせる）
3. 検索結果の要素が索引から消えた文書のとき、その要素の `index_status`・`orphaned_at` で分かるので、`freshness` に別のフィールド（例: 範囲の中の索引から消えた件数）を足すか
4. 版（patch か minor か）。応答の値の計算が変わるが、フィールドは変えない

## 関係する仕様 ID

- SPEC-NTA-SEARCH-RULES-011（索引から消えた文書の印）
- SPEC-NTA-SEARCH-RULES-017（`freshness` の範囲と段階）
- 各検索ツールの spec.md の `freshness` の行（`nta_search_tax_answer` など）
