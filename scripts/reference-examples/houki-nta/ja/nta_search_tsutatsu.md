::: warning ローカル DB が必要です
`houki-nta-mcp --bulk-download-all` で基本通達 4 種を取り込んでいないと、結果は空になります。応答の `freshness.staleness` が `outdated` のときは、同じコマンドで取り直してください。
:::

::: details 呼び出し例 — 「軽減税率に関係する通達の節は」
- 実測: v0.10.2（2026-09-08）
- ローカル DB: あり（一部が 126 日前のデータで `staleness: "outdated"`。その警告もそのまま載せています）

**引数**

```jsonc
{ "keyword": "軽減税率", "limit": 2 }
```

**返る JSON**

```jsonc
{
  "keyword": "軽減税率",
  "count": 2,
  "hits": [
    {
      "tsutatsu": "消費税法基本通達",
      "abbr": "消基通",
      "clauseNumber": "5-9-10",
      "title": "持ち帰りのための飲食料品の譲渡か否かの判定",
      "snippet": " … の譲渡に該当し<b>軽減税率</b>の適用対象とな … ",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/05/09.htm",
      "score": 0.441,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00", "abbreviation expanded: 軽減税率 → 消費税法"]
    },
    {
      "tsutatsu": "消費税法基本通達",
      "abbr": "消基通",
      "clauseNumber": "5-9-5",
      "title": "自動販売機による譲渡",
      "snippet": " … のであるから、<b>軽減税率</b>の適用対象とな … ",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/05/09.htm",
      "score": 0.438,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00", "abbreviation expanded: 軽減税率 → 消費税法"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-05-04T00:34:38.918Z",
    "newest_fetched_at": "2026-09-07T11:53:51.084Z",
    "staleness": "outdated",
    "days_since_oldest": 126,
    "warning": "一部ドキュメントが 126 日前のデータです。最新化するには `--bulk-download-all` を実行してください"
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  }
}
```

`hits[].clauseNumber` と `hits[].abbr` をそのまま `nta_get_tsutatsu` の `clause` / `name` に渡すと本文が取れます。
:::
