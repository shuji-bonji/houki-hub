::: tip 引数名は `no` です
`id` ではありません。記事の URL は国税庁の索引で番号から決めます（v0.24.0 から。それまでは番号の先頭の桁で税目のフォルダーを決めていました）。8xxx（災害）の記事も取れます。索引に無い番号は、記事を取りに行かずに `DOC_NOT_FOUND` を返します。
:::

::: details 呼び出し例 — 「No.6101 消費税の基本的なしくみ」
- 実測: v0.25.1（2026-10-05）
- 確かめた版: v0.27.0（2026-10-10）
- ローカル DB: 不要。ただし DB に構造があればそこから返る（この例は `--bulk-download-tax-answer --refresh` で入れ直した DB から返した `source: "db"`）

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
    "effectiveDate": "令和8年4月1日現在法令等",
    "basisDate": "2026-04-01",
    "taxCategory": "消費税",
    "sections": [
      { "heading": "概要", "paragraphs": ["消費税は、特定の物品やサービスに課税する個別消費税（酒税・たばこ税等）とは異なり、消費一般に広く公平に課税する間接税です。…", "…"], "level": 2 },
      { "heading": "消費税の負担者", "paragraphs": ["消費税は、事業者に負担を求めるものではありません。…"], "level": 3 },
      { "heading": "課税のしくみ", "paragraphs": ["…", "令和5年10月1日から開始した「適格請求書等保存方式（インボイス制度）」では、…", "…"], "level": 3 },
      { "heading": "申告・納付", "paragraphs": ["…"], "level": 3 },
      { "heading": "納税事務の負担軽減措置等", "paragraphs": ["…", "1 事業者免税点制度", "…", "3 2割特例・3割特例（経過措置）", "…"], "level": 3 },
      { "heading": "根拠法令等", "paragraphs": ["消費税法など"], "level": 2 },
      { "heading": "関連リンク", "paragraphs": ["…"], "level": 2 }
    ],
    "sourceUrl": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6101.htm",
    "fetchedAt": "2026-10-05T05:45:26.899Z"
  },
  "source": "db",
  "index_status": null,
  "orphaned_at": null,
  "notice": null,
  "legal_status": {
    "binds_citizens": false,
    "binds_courts": false,
    "binds_tax_office": false,
    "note": "タックスアンサー・質疑応答事例は国税庁の参考解説資料。法的拘束力はなく、実務判断は通達・法令本文に基づく必要がある"
  }
}
```

`sections` はページの見出し（h2）と小見出し（h3）ごとの節で、ページの順に 1 つの配列に並びます。`level` は見出しの段で、h2 の節が `2`、h3 の節が `3` です（v0.25.1 から）。h3 の節がどの見出しの下にあるかは、その前にある最も近い `level: 2` の節で分かります。この例では「消費税の負担者」から「納税事務の負担軽減措置等」までの 4 つが「概要」の下の小見出しです。`format` を省いた markdown の応答では、h2 の節を `## `、h3 の節を `### ` で書きます。

v0.25.0 までは小見出しの文字列が落ち、その段落が上の見出しの節に続けて入っていました。この記事では `sections` が「概要」（26 段落）・「根拠法令等」・「関連リンク」の 3 つでした（[houki-nta-mcp#147](https://github.com/shuji-bonji/houki-nta-mcp/issues/147)）。v0.25.0 以前に取り込んだ DB の行は、`--bulk-download-tax-answer --refresh` で入れ直すまで以前の分け方のまま返り、`level` はすべて `2` になります。

`effectiveDate` は国税庁がページに書いている「何年何月何日現在の法令等に基づくか」で、取得日ではありません。同じ日付を `YYYY-MM-DD` にしたものが `basisDate` です。`index_status`・`orphaned_at`・`notice` は国税庁の索引から記事が消えたときに値が入り、この例では `null` です。「根拠法令等」の節に法令名が入るので、そこから houki-egov-mcp の `get_law` につなげられます。

`source` はローカル DB（`"db"`）と国税庁サイト（`"live"`）のどちらから返したかです（v0.16.0 から）。DB に無い記事は国税庁サイトから取り（`"live"`、`fetchedAt` は取得した時刻）、その結果を DB に書き戻すので、同じ番号の 2 回目からは `"db"` になり `fetchedAt` は 1 回目の値のまま変わりません。この例の `fetchedAt` は `--bulk-download-tax-answer` で取り込んだ日時です。**`"db"` の `fetchedAt` は呼び出した時刻ではなく、DB に取り込んだ日時です。** 引用するときはその値をそのまま書きます。

v0.15.0 までは DB を引かずに毎回国税庁サイトから取得していたため、`fetchedAt` は常に呼び出し時刻でした（[houki-nta-mcp #29](https://github.com/shuji-bonji/houki-nta-mcp/issues/29)）。
:::

::: details 呼び出し例 — 「No.1222 耐震改修工事をした場合（住宅耐震改修特別控除）」（見出しの直後に小見出しが続く記事）
- 実測: v0.25.1（2026-10-05）
- 確かめた版: v0.27.0（2026-10-10）
- ローカル DB: 不要（この例は `--bulk-download-tax-answer --refresh` で入れ直した DB から返した `source: "db"`）

**引数**

```jsonc
{ "no": "1222", "format": "json" }
```

**返る JSON の `taxAnswer.sections`（見出しと `level` と段落の数）**

```jsonc
[
  { "heading": "概要", "level": 2 /* 段落 4 */ },
  { "heading": "対象者または対象物", "paragraphs": [], "level": 2 },
  { "heading": "対象者", "level": 3 /* 段落 1 */ },
  { "heading": "控除の適用を受けるための要件", "level": 3 /* 段落 2 */ },
  { "heading": "計算方法・計算式", "paragraphs": [], "level": 2 },
  { "heading": "住宅耐震改修特別控除の控除額の計算方法", "level": 3 /* 段落 26 */ },
  { "heading": "手続き", "paragraphs": [], "level": 2 },
  { "heading": "申告等の方法", "level": 3 /* 段落 2 */ },
  { "heading": "申告先等", "level": 3 /* 段落 1 */ },
  { "heading": "提出書類等", "level": 2 /* 段落 4 */ },
  { "heading": "根拠法令等", "level": 2 /* 段落 1 */ },
  { "heading": "関連リンク", "level": 2 /* 段落 8 */ }
]
```

**`format` を省いた markdown の応答（見出しの行の部分）**

```markdown
## 対象者または対象物

### 対象者

マイホームについて住宅耐震改修を行った方

### 控除の適用を受けるための要件

…

## 計算方法・計算式

### 住宅耐震改修特別控除の控除額の計算方法

…

## 手続き

### 申告等の方法

…

### 申告先等

所轄税務署
```

見出し（h2）の直後に段落が無く、すぐ小見出し（h3）が続くときは、その見出しの節を `paragraphs: []` で返します。「手続き」のような見出しの文字列を残すためで、markdown では `## 手続き` の行だけになります。段落が空になるのはこの場合だけです。

`申告先等` が何についての話かは、その前にある最も近い `level: 2` の節（「手続き」）で分かります。v0.25.0 では、この記事の `sections` は 7 つで、小見出しの文字列はどこにも入らず、「手続き」の節に「申告等の方法」と「申告先等」の段落が続けて入っていました。
:::
