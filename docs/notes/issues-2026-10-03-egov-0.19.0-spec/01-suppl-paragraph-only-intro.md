附則が条（`Article`）を持たず段落（`Paragraph`）だけのとき、ローカル DB に入る行の条番号が `Suppl<附則の順番>_intro` になり、`search_fulltext` の `hits[].article_num` が `附則(<n>) intro` という形で返ります。`intro` は e-Gov の法令にも houki-egov-mcp の仕様にも無い語で、利用者（LLM）にはどの附則の何を指すのか分かりません。この行の扱いは仕様（`specs/current/`）のどこにも書かれていません。

## 何が起きるか（main の手元のビルド、ローカル DB は `last_sync_date: "2026-09-19"`）

`search_fulltext { keyword: "獣医師法施行規則 昭和二十八年九月一日から施行する", limit: 3 }`（2026-10-03 12:57 JST、houki-egov-dev）:

```json
{
  "law_title": "獣医師法施行規則",
  "article_num": "附則(2) intro",
  "caption": "附　則",
  "chapter_path": "附　則",
  "snippet": "この省令は、<b>昭和二十八年九月一日から</b> … "
}
```

e-Gov 法令 API v2 の `/law_data/324M50010000093?response_format=xml`（同日）では、獣医師法施行規則の 2 番目の附則（`AmendLawNum="昭和二八年八月三一日農林省令第五一号"`）は `<Paragraph Num="1">` の段落 1 つだけで、`Article` がありません。この法令の附則は 34 あり、最初の 8 つのうち 1〜6 番目と 8 番目が段落だけです。

同じ法令でも、附則に条がある場合（7 番目、`<Article Num="1">`）は `附則(7) 1`・`caption: null` と返り、形がそろいません。

## 原因

- `src/services/bulk/xml-parser.ts`: 附則の直下に `Paragraph` があり、その附則に条が 1 つも無いとき、段落の文をつないで `article_num: "Suppl<i>_intro"`・`caption`・`chapter_path` は附則の見出し（`附　則`）の 1 行を作る
- `src/services/law-search.ts` の `formatArticleNumForDisplay()`: `Suppl(\d+)_(.+)` の後ろを `fromEgovArticleNum()`（`_` を `の` にするだけ）に渡すので、`intro` がそのまま残る

仕様では、SPEC-EGOV-CLI-BULK-DOWNLOAD-012 は「附則の条は `Suppl<附則の順番>_<条番号>`」だけを書き、SPEC-EGOV-SEARCH-FULLTEXT-004 は「附則: `附則(<n>) <条番号>`」だけを書いていて、段落だけの附則の行に触れていません。

## 決めること

1. `search_fulltext` の `article_num` の表示
   - 案 A（勧める）: `附則(<n>)`（条番号を付けない）。0.19.0 の仕様 PR（`specs/changes/20261003-db-cli/`）で、段落だけの本則を `本則` と表示すると決めた形とそろう
   - 案 B: 今の `附則(<n>) intro` を仕様に書く
2. DB に入れる条番号（`Suppl<n>_intro`）を変えるか。0.19.0 は DB のスキーマの版を上げて全件を取り込み直すので、変えるなら同じ版に入れると利用者の取り込み直しは 1 回で済む
3. `caption` に附則の見出し（`附　則`）を入れるか、条のある附則と同じく `null` にするか（`chapter_path` には今も附則の見出しが入る）

どれにしても、SPEC-EGOV-CLI-BULK-DOWNLOAD-012 と SPEC-EGOV-SEARCH-FULLTEXT-004 に段落だけの附則の行を書き足す（MODIFIED）。

## 時期

段階 5 の 0.19.0（DB と CLI）に入れる候補です。0.19.0 の仕様 PR は段落だけの本則の行（SPEC-EGOV-CLI-BULK-DOWNLOAD-027、表示 `本則`）を足すので、同じ PR に入れれば本則と附則の扱いを一度に決められます。

## 出典

houki-egov-mcp `specs/changes/20261003-db-cli/proposal.md`（0.19.0 の仕様 PR、ブランチ `spec/20261003-db-cli`）の「この差分の外で見つけたこと」1
