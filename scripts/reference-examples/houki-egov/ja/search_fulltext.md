::: warning ローカル DB が必要です
`houki-egov-mcp --bulk-download-everything` で DB を作っていないと、応答の `source` が `"api-fallback"` になり、`search_law`（法令名のタイトル一致）の結果が `fallback` に入って返ります。そのときは本文検索は行われていません。`note` と `next_actions` に構築コマンドが入っています。
:::

::: details 呼び出し例 — 「民法で不法行為に関係する条は」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: あり（`freshness.last_sync_date` が 2026-09-07 の DB）

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
      "rank": -15.18,
      "score": 0.703,
      "score_reasons": ["fts rank -15.18 → base 0.603", "article_caption_match"],
      "url": "https://laws.e-gov.go.jp/law/129AC0000000089"
    },
    { "article_num": "724の2", "caption": "（人の生命又は身体を害する不法行為による損害賠償請求権の消滅時効）", "score": 0.687 /* … */ },
    { "article_num": "719", "caption": "（共同不法行為者の責任）", "score": 0.679 /* … */ }
  ],
  "freshness": {
    "last_sync_date": "2026-09-07",
    "last_full_dl_at": "2026-09-07T04:53:21.112Z",
    "staleness": "fresh",
    "days_since_sync": 0
  },
  "filters": {
    "law_type": null,
    "domain": { "requested": null, "applied": false, "note": "domain 絞り込みは v0.5.0 では未実効です (…)" }
  },
  "law_scope": [{ "token": "民法", "law_title": "民法", "law_id": "129AC0000000089" }]
}
```

- `law_scope` は、キーワードの中で法令名として認識した語です。ここに入った法令の条だけを検索しています
- `chapter_path` に編・章が入るので、`get_toc` を呼ばなくても位置が分かります
- 「民法 第709条」のように法令名と条番号だけを渡すと、検索せずにその条を直接返します
- `freshness.staleness` が `fresh` 以外なら、`--bulk-download-everything` の再実行を検討してください
:::
