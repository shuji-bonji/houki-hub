## 何をしたか

2 文字の法律用語（「相殺」「時効」「善意」）を渡されたときに何をして結果を出したかを `short_tokens` で明示し、全法令の条本文を走査する `scan_body` を足しました（Closes #23）。設計は houki-hub の `docs/notes/2026-09-20-design-egov-23-short-tokens.md` です。

これまで `search_fulltext` に「相殺」だけを渡すと、「相殺関税に関する政令」という法令名ヒットが 1 件返るだけでした。条本文の索引 `articles_fts` は trigram なので 3 文字以上の語しか載らず、2 文字語では `MATCH` 式が空になって条の本文がまったく引かれません。しかも本文が引かれなかったことが応答のどこにも書いていませんでした。

## 応答に足したもの

クエリに 2 文字語が含まれるときだけ `short_tokens` が付きます。

```jsonc
{
  "keyword": "相殺",
  "short_tokens": {
    "tokens": ["相殺"],
    "fts_min_token_length": 3,
    "body_search": "not_searched",
    "truncated": false,
    "hits_by_match_type": { "article": 0, "law_meta": 1 },
    "note": "「相殺」は 3 文字未満です。条本文の索引 articles_fts は trigram のため 3 文字以上の語しか載せません。条の本文は引いていません。…",
    "next_actions": [
      { "action": "search_fulltext", "reason": "法令名を添えると、その法令の条本文を引けます（索引が使えるので速い）", "example": { "keyword": "民法 相殺" } },
      { "action": "search_fulltext", "reason": "法令名が分からないときは全法令の条本文を走査できます（5〜20 秒かかります）", "example": { "keyword": "相殺", "scan_body": true } }
    ]
  }
}
```

`body_search` は、実際に走った経路の名前をそのまま値にしています。

| クエリ | `body_search` | 何をするか |
|---|---|---|
| `適格請求書 保存` | `fts_then_filter` | 3 文字以上の語で索引を引き、その条の本文に 2 文字語が含まれるかで絞る |
| `労基法 協定` | `like_in_law_scope` | 法令名で対象法令を絞り、その範囲の条の本文を引く |
| `相殺` | `not_searched` | 条の本文は引かず、法令名・略称・番号の照合だけを返す（既定） |
| `相殺` + `scan_body: true` | `like_all_articles` | 索引を使わず、全法令の条の本文を端から照合する |

Issue の完了条件「結果が本文由来か法令名由来かが応答から分かる」は、`hits_by_match_type` の 2 つの数で答えます。

## 既定で走査しない理由

実データ（条 1,434,710 件・法令 10,810 件・本文 587,926,852 バイト）で測りました。

| 測り方 | 最悪値（該当ゼロで全表を走り切る） |
|---|---|
| `LIKE` + JOIN | 21.99 秒 |
| `instr` + JOIN | 21.99 秒 |
| `GLOB` + JOIN | 22.20 秒 |
| `instr`、JOIN 無し | 21.79 秒 |

打ち切りが効く語は 4〜5 秒で安定します（`LIKE` で「相殺」5.49 秒・「善意」4.08 秒）。`body` は投入時に正規化済みなので `LIKE` の大文字小文字の同一視は不要で、`instr` や `GLOB` も測りましたが、3 つとも 22 秒で並びました。JOIN を外しても同じです。費やしているのは 588 MB を読んで照合する分そのもので、書き方では縮みません。

索引から 2 文字語に届く道も確かめました。`MATCH '"相殺"'`・`MATCH '相殺*'`（前方一致）・`MATCH '"相殺" *'` はいずれも 0 件です。クエリ側も同じ trigram で分割されるため、2 文字では分割結果が空になります。

Issue の選択肢 2（bigram トークナイザ）は、1 文字ごとに区切り文字を挟んだ列をもう 1 本持てば trigram で代用できますが、本文 588 MB が 1.18 GB になりその上に索引がもう 1 本載るので採りませんでした。

## 走査の書き方

`searchArticleLikeGlobal` には `ORDER BY` を付けていません。並べ替えると SQLite は必ず全表を読みますが、付けなければ `LIMIT`（150 件）に達した時点で走査を止められます。「相殺」が 5.4 秒で済むのはこの打ち切りが効いているからです。

そのかわり並び順は関連度順ではなく DB 内の順になります。`note` にその旨を書き、上限に達したときは `truncated: true` を立てます。

3 文字以上の語を含むクエリでは索引を引くので、`scan_body` は効きません。

## ついでに直したこと

LIKE 経路の `snippet` を、本文の先頭 80 文字から「一致位置の手前 20 文字からの 80 文字」に変えました。既存の `searchArticleLikeInScope`（「労基法 協定」の経路）も同じ式に寄せたので、そちらでも一致した箇所が snippet に入ります。

## テスト

370 件（新規 10 件）。新しいテストを変更前のコードで走らせて落ちることも確かめています。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_011KqTVhXLyjNAsmZ8H6jzNs
