SPEC-NTA-GET-TAX-ANSWER-018 の例の 1 つの箇条書きが、前提を書き落としています。仕様の文の直し（specs/changes）だけで、実装は変えません。

## 何が食い違うか

`specs/current/nta_get_tax_answer/spec.md` の SPEC-NTA-GET-TAX-ANSWER-018 の「例（壊れた表の DB）」の最後の箇条書き:

> 同じ DB でもう一度呼ぶと、同じく索引を条件なしで取り、同じ 2 行の `warn` を出す

018 は「記事の URL を国税庁の索引で決めるとき（SPEC-NTA-GET-TAX-ANSWER-016）」の規則である。1 回目の呼び出しで記事 6101 は `document` に書き戻されるので、同じ番号で 2 回目を呼ぶと、DB の経路（016 の前の段）で記事を返し、索引を引かない。2 回目は 018 の前提に入らないので、例のとおりにはならない。018 と 016 の本文どうしは食い違っていない。

0.25.0 の受入テスト（`src/tools/spec-20261004-db-location.test.ts`）では、2 回目の前に `document` の 6101 の行を消して確かめた（実装 PR の会話で shuji が決定）。

## 直し方（案）

最後の箇条書きを次のようにする。

> 同じ DB で、記事がまだ DB に無い番号でもう一度呼ぶと（または 1 回目に書き戻された記事の行を消してから呼ぶと）、同じく索引を条件なしで取り、同じ 2 行の `warn` を出す。同じ番号でもう一度呼ぶと、1 回目に書き戻した記事を DB から返し、索引は引かない（SPEC-NTA-GET-TAX-ANSWER-016）

- 仕様 PR（`spec/<yyyymmdd>-tax-answer-018-example`）で `specs/changes/` に MODIFIED として出す。実装の変更は不要なので、proposal.md を「- 実装の変更: 不要」にして、同じ PR で `specs/current/` も直せる
- テスト名に書いた理由（「記事の行を消してから呼ぶ」）はそのままでよい

## 関連

- houki-nta-mcp #137
- 差分 `specs/releases/v0.25.0/20261004-db-location/`
