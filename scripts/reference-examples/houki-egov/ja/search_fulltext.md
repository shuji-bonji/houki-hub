::: warning ローカル DB が必要です
`npx -y @shuji-bonji/houki-egov-mcp@latest --bulk-download-everything` で DB を作っていないと、応答の `source` が `"api-fallback"` になり、`search_law`（法令名のタイトル一致）の結果が `fallback` に入って返ります。そのときは本文検索は行われていません。`note` の先頭に開こうとした DB のパスが入り、`note` と `next_actions` に DB を作るコマンドが入っています（v0.20.0 から。DB を開けないときは `next_actions` が `search_law` の 1 件だけになります）。
:::

::: details 呼び出し例 — 「民法で不法行為に関係する条は」
- 実測: v0.20.0（2026-10-05）
- ローカル DB: あり（`freshness.last_sync_date` が 2026-10-04 の DB）

**引数**

```jsonc
{ "keyword": "民法 不法行為", "limit": 3 }
```

**返る JSON**

```jsonc
{
  "keyword": "民法 不法行為",
  "source": "bulk",
  "count": 3,
  "hits": [
    {
      "match_type": "article",
      "law_id": "129AC0000000089",
      "law_revision_id": "129AC0000000089_20260624_508AC0000000045",
      "law_title": "民法",
      "law_num": "明治二十九年法律第八十九号",
      "law_type": "Act",
      "article_num": "724",
      "caption": "（不法行為による損害賠償請求権の消滅時効）",
      "chapter_path": "第三編　債権 第五章　不法行為",
      "snippet": "<b>不法行為</b>による損害賠償の請求権は、次 … ",
      "rank": -15.07,
      "score": 0.701,
      "score_reasons": ["fts rank -15.07 → base 0.601", "article_caption_match"],
      "url": "https://laws.e-gov.go.jp/law/129AC0000000089"
    },
    { "article_num": "724の2", "caption": "（人の生命又は身体を害する不法行為による損害賠償請求権の消滅時効）", "score": 0.685 /* … */ },
    { "article_num": "719", "caption": "（共同不法行為者の責任）", "score": 0.677 /* … */ }
  ],
  "freshness": {
    "last_sync_date": "2026-10-04",
    "last_full_dl_at": "2026-10-03T19:19:36.391Z",
    "staleness": "fresh",
    "days_since_sync": 0,
    "db_path": "~/.cache/houki-egov-mcp/laws.db"
  },
  "filters": {
    "law_type": null,
    "domain": { "requested": null, "applied": false, "note": "分野での絞り込みはしていません（domain の引数は 0.18.0 で外しました）" }
  },
  "law_scope": [{ "token": "民法", "law_title": "民法", "law_id": "129AC0000000089" }]
}
```

- `law_scope` は、キーワードの中で法令名として認識した語です。ここに入った法令の条だけを検索しています
- `chapter_path` に編・章が入るので、`get_toc` を呼ばなくても位置が分かります
- 「民法 第709条」のように法令名と条番号だけを渡すと、検索せずにその条を直接返します
- `filters.domain` は 0.18.0 で `domain` の引数を外した後も応答に残っていて、`requested` は常に `null` です。`domain` を渡すと `INVALID_ARGUMENT`（`path: "domain"`）になります
- この例は法令名と語をそのまま検索したので `expanded_keywords` がありません。略称（「労基法」など）は正式名称にも広げて検索し、通称（「インボイス」など）は元の語で条が 1 件も当たらなかったときだけ正式名称で探し直します（v0.18.0 から）。広げたときは、何に広げたかが `expanded_keywords` に入ります
- `freshness.db_path` は引いた DB のパスで、ホームディレクトリの部分は `~` に置き換えてあります（v0.20.0 から）。ターミナルで `--sync` などを実行した DB と、MCP サーバーが開いた DB が同じかを確かめるときに使います。DB を引かなかったとき（`source: "api-fallback"`）は、`freshness` の 5 つのキーがすべて `null` です
- `freshness.staleness` が `fresh` 以外なら、`npx -y @shuji-bonji/houki-egov-mcp@latest --bulk-download-everything` の再実行を検討してください
:::
