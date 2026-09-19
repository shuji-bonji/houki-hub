## 何をしたか

`get_law` の `article` と `item` で漢数字の条番号・号番号を受け付けるようにしました（Closes #17）。判決文・通達・書籍から引き写した「第三十条の二」をそのまま渡せます。

- `src/utils/article-num.ts` に `kanjiToNumber()` を足し、`toEgovArticleNum()` と `toEgovItemNum()` が "の" の区切りごとに算用数字へ直してから既存の判定に入る
- 受け付けるのは位取り形式（"三十" "百二十三" "千五十" "一千"）。「三〇」のように位ごとに並べる形式と、位取りとして読めない並び（"三三" "十十"）は `INVALID_ARTICLE_NUM`
- 全角数字（"３０" "第３０条の２"）も半角に直す。0.6.1 までは `findArticle` に届いて `ARTICLE_NOT_FOUND` になっていた
- `INVALID_ARTICLE_NUM` の `message` / `hint` を、受け付ける形式の例に変えた。「漢数字には未対応です」の文言は無くなった
- `tools/list` の `article` / `item` の説明に、漢数字と全角数字を受け付けることを足した
- テスト: `src/utils/article-num.test.ts` の「漢数字は throw する」を受け付ける側に置き換え、全角・読めない並び・`kanjiToNumber` 単体を追加
- 0.6.1 → 0.7.0（受け付ける入力が広がるため minor）。`package.json` / `package-lock.json` / `.claude-plugin/plugin.json` / `server.json` / CHANGELOG / README

## この版では変えていないこと

- `search_fulltext` のキーワード中の「第三十条」は、これまでどおり本文のトークンとして MATCH に乗る（`extractArticleNumFromQuery()` は算用数字だけを boost に使う）。条文本文は他の条を漢数字で参照するため、ここを boost に回すと本文検索の意味が変わる。CHANGELOG の Planned に残した
- `formatArticleLabel()` / `formatItemLabel()` の出力は算用数字のまま

## 取り込み後

1. タグ `v0.7.0` で publish
2. `mcp-publisher login github` → `mcp-publisher publish`（`server.json` は 0.7.0 に更新済み）
3. claude-plugins の `houki-egov-mcp` を 0.7.0 に（marketplace-version-check が GitHub 上の `plugin.json` と突き合わせるため、この順）
4. houki-hub の stack / README / site / ROADMAP を追随し、hub#21 の「機能 4」にチェック

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01GNRnL5TVWf5Chs91BpQS8w
