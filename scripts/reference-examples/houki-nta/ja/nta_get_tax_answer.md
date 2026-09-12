::: tip 引数名は `no` です
`id` ではありません。番号の先頭の桁で税目（1xxx=所得税、6xxx=消費税 など）を判定します。
:::

::: details 呼び出し例 — 「No.6101 消費税の基本的なしくみ」
- 実測: v0.17.0（2026-09-13）
- ローカル DB: 不要。ただし DB に構造があればそこから返る（この例は 2 回目の呼び出しで `source: "db"`）

**引数**

```jsonc
{ "no": "6101", "format": "json" }
```

**返る JSON（抜粋）**

```jsonc
{
  "taxAnswer": {
    "no": "6101",
    "title": "消費税の基本的なしくみ",
    "sections": [
      { "heading": "概要", "paragraphs": ["消費税は、特定の物品やサービスに課税する個別消費税（酒税・たばこ税等）とは異なり、消費一般に広く公平に課税する間接税です。…", "…"] },
      { "heading": "消費税の負担者", "paragraphs": ["…"] },
      { "heading": "課税のしくみ", "paragraphs": ["…", "令和５年10月１日から開始した「適格請求書等保存方式（インボイス制度）」では、…"] },
      { "heading": "申告・納付", "paragraphs": ["…"] },
      { "heading": "納税事務の負担軽減措置等", "paragraphs": ["1 事業者免税点制度", "…", "3 ２割特例（経過措置）", "…"] },
      { "heading": "根拠法令等", "paragraphs": ["消費税法など"] },
      { "heading": "関連リンク", "paragraphs": ["…"] }
    ],
    "effectiveDate": "令和7年4月1日現在法令等",
    "taxCategory": "消費税",
    "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6101.htm",
    "fetchedAt": "2026-09-12T20:05:55.721Z"
  },
  "source": "db",
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`effectiveDate` は国税庁がページに書いている「何年何月何日現在の法令等に基づくか」で、取得日ではありません。`sections[].heading` が「根拠法令等」の節に法令名が入るので、そこから houki-egov-mcp の `get_law` につなげられます。

`source` はローカル DB（`"db"`）と国税庁サイト（`"live"`）のどちらから返したかです（v0.16.0 から）。上と同じ呼び出しの 1 回目は `"live"` で、`fetchedAt` は取得した時刻（`2026-09-12T20:05:55.721Z`）でした。その結果が DB に書き戻されるので、2 回目は `"db"` になり `fetchedAt` は 1 回目の値のまま変わりません。**`"db"` の `fetchedAt` は呼び出した時刻ではなく、DB に取り込んだ日時です。** 引用するときはその値をそのまま書きます。

v0.15.0 までは DB を引かずに毎回国税庁サイトから取得していたため、`fetchedAt` は常に呼び出し時刻でした（[houki-nta-mcp #29](https://github.com/shuji-bonji/houki-nta-mcp/issues/29)）。
:::
