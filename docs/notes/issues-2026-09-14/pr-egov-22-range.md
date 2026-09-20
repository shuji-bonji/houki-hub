## 何をしたか

編・章・節・款・目のいずれか、または附則 1 本を範囲にして、その中の条を本文ごと返す `get_law_range` を足しました（Closes #22）。設計は houki-hub の `docs/notes/2026-09-20-design-egov-22-range.md` です。

これまで条文を取る道は `get_law`（1 条）と `get_toc`（目次だけ）の 2 つでした。民法の「契約」を読むには、目次を引いて条番号を数え、`get_law` を 198 回呼ぶしかありませんでした。

```
get_law_range(law_name="民法", part=3, chapter=2)
  → 第三編 債権 第二章 契約の 198 条のうち、上限（既定 30,000 文字）までの 186 条
    + range.next_from_article: "685"（続きの条）
```

## 範囲の指定は 3 通り

同時に指定できるのは 1 つだけです。2 通り以上を渡すと `INVALID_ARGUMENT` を返します。

| 指定 | 書き方 |
|---|---|
| 階層の番号 | `part=3, chapter=2`（`3` / `"3"` / `"三"` / `"第三編"` / 枝番号 `"2の2"` を受ける） |
| パス | `path="Part3/Chapter2"`（`get_toc` の `toc[].path` をそのまま渡せる） |
| 附則 | `suppl_index=12`（`get_toc` の `suppl_provisions[].index`。#24 で振った番号） |

`Chapter@Num` は編ごとに振り直されます。民法には `Chapter1` が 5 つ、`Section1` が 19、会社法には `Section1` が 22 あります。そのため `chapter` だけを渡して複数に当たったときは、**推測で 1 つを選ばず**候補のパスを返します。

```jsonc
{
  "error": "指定された範囲が 5 か所あります。上位の階層も指定してください",
  "code": "INVALID_ARGUMENT",
  "hint": "該当するパス: Part1/Chapter2, Part2/Chapter2, Part3/Chapter2, Part4/Chapter2, Part5/Chapter2（Chapter@Num は編ごとに振り直されます）",
  "next_actions": [
    { "action": "get_law_range", "reason": "第三編　債権 第二章　契約",
      "example": { "law_name": "民法", "path": "Part3/Chapter2" } }
  ]
}
```

`get_toc` の応答には、本則の構造ノードに `path` を足しました（条と附則の中のノードには付けません）。目次で見た範囲をそのまま渡せます。

## 上限は条の単位で打ち切る

2026-09-20 に e-Gov 法令API v2 の `law_full_text` で条本文のバイト数を測りました。

| 法令 | 最上位 | 章（中央値 / 最大） | 節（中央値 / 最大） |
|---|---|---|---|
| 民法 | 編 5（54〜193 KB） | 6.2 KB / 98.2 KB | 3.7 KB / 34.3 KB |
| 会社法 | 編 8（最大 702 KB） | 17.9 KB / 207.6 KB | 5.5 KB / 55.0 KB |
| 所得税法 | 編 6（最大 434 KB） | 10.8 KB / 229.1 KB | 10.4 KB / 167.3 KB |
| 消費税法 | 章 6（階層は章のみ） | 59.5 KB / 102.4 KB | — |
| 労働基準法 | 章 14 | 4.9 KB / 44.7 KB | — |

編は大きすぎ（会社法第二編 702 KB）、章でも足りないことがあり（民法第三編第一章 98 KB）、節を持たない法令もあります（消費税法・労働基準法）。そこで、範囲の指定とは別に返す量の上限を持たせました。

既定は `max_chars` **30,000 文字**（2,000〜120,000）。**条の途中では切りません**。1 条目だけは上限を超えても返します（応答が空になるのを避けるため）。打ち切ったときは `range.truncated` と続きの条番号を返し、`from_article` にその値を渡すと続きから返します。

```jsonc
{
  "path": "Part3/Chapter2",
  "titles": ["第三編　債権", "第二章　契約"],
  "tag": "Chapter",
  "article_count": 198,
  "returned_count": 186,
  "skipped_count": 0,
  "first_article": "第521条",
  "last_article": "第684条",
  "truncated": true,
  "body_chars": 29911,
  "max_chars": 30000,
  "next_from_article": "685",
  "note": "範囲の条 198 件のうち 186 件を返しました（第521条〜第684条）。本文 29,911 文字（上限 30,000 文字）。上限で打ち切りました。続きは from_article: \"685\" を付けて同じ範囲を呼び直してください。"
}
```

Issue の完了条件「返却範囲が応答に記載される」は、この `range` と、Markdown の出典の前に置く `note` の 1 行で満たしています。

## なぜ新しいツールにしたか

`get_law` は 1 条（項・号）を返すツールで、`article` を省くと目次を返す振る舞いも持っています。ここに範囲の引数を足すと、`article` との排他・`format: "toc"` との関係・上限で打ち切ったときの応答が 1 つのツールの説明に混ざります。範囲取得は応答の形（`range` / `articles` / 打ち切り）も違うので、11 本目のツールにしました。`get_law` の description には「章・節をまとめて取るときは `get_law_range`」を足しています。

`get_toc` に「本文も返す」引数を足す案は採りませんでした。`get_toc` は目次だけを返すから安い、という前提で使われているためです。

## 附則

`suppl_index` は #24 で振った番号（ローカル DB の条番号 `Suppl{index}_{条番号}`、`search_fulltext` が「附則(12) 1」と表示する番号）と同じです。新しい語彙は作っていません。条を立てず項だけで書かれた附則（消費税法に 9 本）は、条が 0 件なので範囲の本文をそのまま返し、その旨を `note` に書きます。

## 足したエラーコード

`RANGE_NOT_FOUND`（指定された編・章・節、または附則の番号が見つからない、`retryable: false`）。houki-research-skill の `docs/ERROR-CODES.md` にも追記が要ります（別 PR）。

## 実データで確かめたこと

| 呼び出し | 結果 |
|---|---|
| `{ law_name: "民法", part: 3, chapter: 2 }` | 186 / 198 条、29,911 文字、`next_from_article: "685"` |
| `{ …, part: 3, chapter: 1, from_article: "501" }` | 39 条、`skipped_count: 144` |
| `{ law_name: "会社法", part: 2, chapter: 1 }` | 81 条・29,339 文字が 1 回で収まる |
| `{ law_name: "会社法", path: "Part2/Chapter2/Section1" }` | 17 条・11,354 文字 |
| `{ law_name: "所得税法", chapter: "2の2" }` | `Part1/Chapter2_2` の 2 条（枝番号の章） |
| `{ law_name: "労基法", chapter: 6 }` | `Chapter6`（年少者）9 条。編を持たない法令 |
| `{ law_name: "消費税法", part: 1 }` | `RANGE_NOT_FOUND` |
| `{ law_name: "消費税法", suppl_index: 7 }` | 条 0 件の附則。項の本文をそのまま返す |

## テスト

432 件（新規 34 件）。範囲の解決とパス（`law-tree`）、範囲取得・打ち切り・附則（`law-service.range`）、編・章・節の番号の正規化（`article-num`）です。

なお `package-lock.json` の `version` は main の時点で 0.12.0 のままなので、この PR では触っていません。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01VtG4YjaPNXLTpyaWV3xrcE
