::: warning ローカル DB が必要です
`houki-nta-mcp --bulk-download-all` で基本通達 4 種を取り込んでいないと、結果は空になります。応答の `freshness.staleness` が `outdated` のときは、同じコマンドで取り直してください。
:::

::: details 呼び出し例 — 「軽減税率に関係する通達の節は」
- 実測: v0.11.0（2026-09-11）
- ローカル DB: あり（`--bulk-download-everything` から 3 日で `staleness: "fresh"`）

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
      "score": 0.4413,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00", "abbreviation expanded: 軽減税率 → 消費税法"]
    },
    {
      "tsutatsu": "消費税法基本通達",
      "abbr": "消基通",
      "clauseNumber": "5-9-5",
      "title": "自動販売機による譲渡",
      "snippet": " … のであるから、<b>軽減税率</b>の適用対象とな … ",
      "sourceUrl": "https://www.nta.go.jp/law/tsutatsu/kihon/shohi/05/09.htm",
      "score": 0.4383,
      "scoreReasons": ["doc_type=tsutatsu weight 1.00", "abbreviation expanded: 軽減税率 → 消費税法"]
    }
  ],
  "freshness": {
    "oldest_fetched_at": "2026-09-07T20:39:32.057Z",
    "newest_fetched_at": "2026-09-07T20:49:00.912Z",
    "staleness": "fresh",
    "days_since_oldest": 3
  },
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": true,
    "note": "通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）"
  },
  "base_laws_by_tsutatsu": {
    "消費税法基本通達": ["消費税法", "消費税法施行令", "消費税法施行規則"]
  },
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "通達は国民・裁判所を拘束しない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法" }
    }
  ]
}
```

`hits[].clauseNumber` と `hits[].abbr` をそのまま `nta_get_tsutatsu` の `clause` / `name` に渡すと本文が取れます。

`base_laws_by_tsutatsu` は、結果に現れた通達ごとの、解釈の対象になる法律・政令・省令の対応表です（v0.11.0 から）。対応は通達単位の事実なので、hit ごとではなく応答に 1 回だけ置いています。`hits[].tsutatsu` をキーにして引いてください。`next_actions` は通達ごとに 1 件で、houki-egov-mcp の `get_law` に渡す法律名が入っています。

`scoreReasons` の `abbreviation expanded: 軽減税率 → 消費税法` は、「軽減税率」が略称辞書で消費税法の通称として登録されているため、「消費税法」でも検索したことを示します。本文に「軽減税率」を含まない条項が混ざることがあり、[houki-nta-mcp#21](https://github.com/shuji-bonji/houki-nta-mcp/issues/21) で扱っています。
:::

::: details 呼び出し例 — DB が古いとき（`staleness: "outdated"`）
- 実測: v0.10.2（2026-09-07）。同じ呼び出しを、最後の取り込みから 126 日たった DB に対して行ったときの応答です

引数は上の例と同じです。違うのは `freshness` だけで、`hits` の中身は変わりません。

```jsonc
{
  "keyword": "軽減税率",
  "count": 2,
  "hits": [ /* 上の例と同じ */ ],
  "freshness": {
    "oldest_fetched_at": "2026-05-04T00:34:38.918Z",
    "newest_fetched_at": "2026-09-07T11:53:51.084Z",
    "staleness": "outdated",
    "days_since_oldest": 126,
    "warning": "一部ドキュメントが 126 日前のデータです。最新化するには `--bulk-download-all` を実行してください"
  }
  // legal_status は同じ
}
```

`staleness` が `fresh` 以外のときは、返ってきた本文が国税庁サイトの現在の内容と違う可能性があります。回答にその旨を書き、`warning` にあるコマンドの実行を利用者に案内してください。`days_since_oldest` は範囲内で最も古い文書の経過日数なので、一部だけが古い場合もこの値になります。
:::
