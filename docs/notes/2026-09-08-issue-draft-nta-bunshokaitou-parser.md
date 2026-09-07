# issue 草案: 文書回答事例の本文が「〔照会〕〔回答〕」の見出しだけになり、回答内容・回答年月日・別紙が取り込まれない

対象リポジトリ: houki-nta-mcp（v0.10.2 で確認、2026-09-08）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues

---

## 症状

`nta_get_bunshokaitou` / `nta_search_bunshokaitou` で、文書回答事例の本文がほとんど取れていない。

```jsonc
// nta_get_bunshokaitou { "docId": "shotoku/250416", "format": "json" } の応答（v0.10.2、DB 投入は 2026-05-03）
{
  "document": {
    "docId": "shotoku/250416",
    "title": "産科医療特別給付事業に基づき支払われる給付金の所得税法上の取扱いについて",
    "issuedAt": null,                       // ← ページには「回答年月日 令和７年４月７日」がある
    "fullText": "取引等に係る税務上の取扱い等に関する照会（同業者団体等用）\n〔照会〕\n〔回答〕",  // ← 見出しだけ
    "attachedPdfs": []
  }
}
```

その結果、次が起きている。

- `nta_search_bunshokaitou` は題名の語でしか当たらない。「適格請求書」「電子帳簿」で 0 件、「産科医療」（題名にある）では 2 件
- `issuedAt` が `null` なので、検索結果の並べ替えや鮮度の表示に回答年月日を使えない
- 回答内容（「貴見のとおりで差し支えありません」と付記 2 点）、関係する法令条項等、回答者が LLM に渡らない。文書回答事例の価値はこの部分にある

## 原因（2 つ）

国税庁の文書回答事例ページは、`src/services/bunshokaitou-parser.ts` の冒頭コメントが想定している「`<p>` の並び」ではなく、**表と別紙ページ**でできている。

### 原因 1: `table.kaito` の中身を読んでいない

`parseBunshoPage()` は本文を `$body.find('p, h2, h3')` で集めている（bunshokaitou-parser.ts の段落収集部分）。
実ページでは `<p>〔照会〕</p>` の直後に `<table class="table table-bordered kaito">` があり、照会者・照会の内容・関係する法令条項等・添付書類、そして `<p>〔回答〕</p>` の直後の表に回答年月日・回答者・回答内容が **`<th>` / `<td>` として**入っている。`p` だけを拾うので、見出し 2 行しか残らない。

`https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm` の該当部分（Shift_JIS、抜粋）:

```html
<p>〔照会〕</p>
<div class="table-responsive"><table class="table table-bordered kaito">
<tbody><tr>
<th class="tate" rowspan="2" scope="row">照会者</th>
<th scope="row">（フリガナ）<br>団体の名称</th>
<td>（コウセイロウドウショウ）<br>厚生労働省</td>
</tr>
…
<tr>
<th scope="row">　照会の趣旨（法令解釈・適用上の疑義の要約及び照会者の求める見解の内容）</th>
<td>　<a href="/law/bunshokaito/shotoku/250416/another.htm">別紙</a>のとおり</td>
</tr>
…
<tr>
<th colspan="2" scope="row">　関係する法令条項等</th>
<td>所得税法第９条第１項18号、所得税法施行令第30条</td>
</tr>
</tbody></table></div>
<p class="marginTop2em">〔回答〕</p>
<div class="table-responsive"><table class="table table-bordered kaito">
  … 回答年月日 / 令和７年４月７日 / 回答者 / 国税庁課税部審理室長 / 回答内容 / 標題のことについては、… …
```

### 原因 2: 「別紙」（`another.htm`）を辿っていない

照会の趣旨・事実関係・理由の 3 項目は、表の中では「別紙のとおり」とだけ書かれ、本文は同じディレクトリの `another.htm` にある。
`another.htm` は `<p>` と `<h2>/<h3>` 主体（250416 の例で 3,670 文字、p 15 個、h2/h3 10 個、表 2 個）で、現在の段落収集でそのまま読める構造だが、パーサーは `index.htm` しか見ていない。

### 影響範囲

`shotoku/081102`（回答 2008-11-06）と `shotoku/250416`（回答 2025-04-07）が同じ構造だったので、少なくとも「取引等に係る税務上の取扱い等に関する照会（同業者団体等用）」の様式で公開されている文書回答事例のすべてに当てはまると考えられる。
件数は DB で `fullText` の長さが 200 文字未満の `bunshokaitou` を数えれば分かる（未計測）。

## 直し方の案

1. **表の取り込み**: `parseBunshoPage()` の段落収集で `table.kaito` の各行を「`<th>` のテキスト: `<td>` のテキスト」の 1 行にして `fullText` に加える。`〔照会〕` / `〔回答〕` の見出しは今のまま残す
2. **`issuedAt` を「回答年月日」から取る**: 回答の表の `回答年月日` セル（「令和７年４月７日」）を和暦から ISO に変換する。既存の `extractIssuedAt()` が和暦を扱えるなら、その入力にこのセルを渡す
3. **別紙を辿る**: `index.htm` 内の同一ディレクトリの `another.htm`（複数リンクは同じ URL）を 1 回取得し、`【別紙】` の見出しを付けて `fullText` の末尾に連結する。取得は文書あたり 1 リクエスト増える。`another.htm` にも `.pdf` があれば `attachedPdfs` に足す
4. **再取り込みが走るようにする**: `content_hash` は `fullText` から計算しているので、パーサーを直せばハッシュが変わり `--bulk-download-bunshokaitou` で更新される。ただし国税庁が `304 Not Modified` を返す文書は再解析されないので、README に「v0.10.x 以前の DB は `--bulk-download-bunshokaitou --refresh`」と書く（v0.10.1 の算式画像プレースホルダと同じ扱い）
5. **テスト**: 上の 2 ページ（`shotoku/250416` の `index.htm` + `another.htm`、`shotoku/081102` の `index.htm`）を fixture にし、`fullText` に「回答内容」「関係する法令条項等」「別紙」の本文が含まれること、`issuedAt` が `2025-04-07` / `2008-11-06` になることを確認する

## 確認に使ったもの

- `curl` で取得した実 HTML（Shift_JIS）: `https://www.nta.go.jp/law/bunshokaito/shotoku/250416/index.htm`、同 `another.htm`、`https://www.nta.go.jp/law/bunshokaito/shotoku/081102/index.htm`
- `src/services/bunshokaitou-parser.ts` の `parseBunshoPage()`（段落収集が `p, h2, h3` のみ）
- houki-hub の生成リファレンス用に `nta_get_bunshokaitou` / `nta_search_bunshokaitou` を実測したときに発見（`scripts/reference-examples/houki-nta/ja/nta_get_bunshokaitou.md` に応答を記録）

## 関連

- 質疑応答事例（`nta_get_qa`）は `question` / `answer` / `relatedLaws` を取れているので、文書回答事例だけの問題
- 事務運営指針・改正通達は `<p>` 主体のページで、この問題は出ていない
