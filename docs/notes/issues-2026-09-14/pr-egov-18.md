## 何をしたか

LLM が組み立てた引用のリストを、1 回の呼び出しでまとめて実在確認する `verify_citations` を足しました（Closes #18）。設計は houki-hub の `docs/notes/2026-09-20-design-egov-18-verify-citations.md` です。

引用を 1 件ずつ `get_law` で確かめることはこれまでもできましたが、(1) 何件中何件が実在したかを LLM が数え直す必要があり、(2) 存在しない条は `isError` の応答になるので調査が途中で止まり、(3) 実在確認だけが目的でも条文全文が返る、という 3 点が残っていました。

### 入力

```jsonc
{
  "citations": [
    { "law_name": "所法", "article": "9", "paragraph": 1, "item": 1, "label": "所法9①一" },
    { "law_id": "410AC0000000025", "article": "7" }
  ],
  "at": "2026-04-01"
}
```

- `law_name`（略称可）か `law_id` のどちらかが要ります。`article` は必須、`paragraph` / `item` は任意です
- `label` は判定に使わず、そのまま `results[]` に返します。citation の行と 1 対 1 で対応させるためです
- 1 回に 50 件まで（`inputSchema` の `maxItems`、`constants.ts` の `LIMITS.citationsMax`）
- `additionalProperties: false` は外側と `citations[]` の各件の両方に付けています

`law_name` と `law_id` のどちらかが必須であることは JSON Schema の `anyOf` では書かず、handler で確かめてツール全体を `INVALID_ARGUMENT` にしています。`anyOf` を入れると `FromSchema` が union を作り、v0.6.0 で避けた TS2589 に近づくためです。

### 出力

- 件ごとに `found` / `not_found` / `ambiguous`。`found` には `law`（`law_id` / 正式名称 / 法令番号 / 法令種別 / URL）、`article`（e-Gov 形式の条番号・表示ラベル・条見出し）、確かめた `paragraph` / `item` が付きます。条文本文は返しません
- `summary` に `total` / `found` / `not_found` / `ambiguous` と、全件が found のときだけ true の `all_found`
- `not_found` の `code` は `LAW_NOT_FOUND` / `ARTICLE_NOT_FOUND` / `INVALID_ARTICLE_NUM` / `OUT_OF_SCOPE`
- `ambiguous` は 2 種類です。法令名が e-Gov の法令名と完全一致せず部分一致の候補があるとき（`candidates[]` に最大 5 件、`code` は付けない）と、項が複数ある条で項を書かずに号だけを指定したとき（`code: "INVALID_ARGUMENT"`）
- 候補が 1 件しかなくても、完全一致でなければ `ambiguous` にしています。`get_law` の `resolveLawId` は完全一致が無ければ検索結果の先頭を採りますが、実在確認では「たぶんこれだろう」を `found` と書けないためです

### `code` を付けない件がある理由

`code` は family 共通のエラー語彙で言えるときだけ付けます。「法令名の候補が複数あった」に当たる語彙は family にありません。`AMBIGUOUS_LAW_NAME` のような code を足すと、ツール全体のエラーには一度も現れない値が語彙に入り、他の MCP も追随することになります。`status: "ambiguous"` と `candidates[]` で足りるので、語彙は増やしませんでした。

### 通信できなかったときは件ごとの判定を返さない

e-Gov がタイムアウト・接続不能・5xx を返したときは、それまでに判定できた件も捨てて、ツール全体を `SOURCE_*`（`retryable: true`）にします。`not_found` は「e-Gov に聞いたら無かった」の意味で、「聞けなかった」を同じ言葉で返すと LLM が引用を消してしまうためです。`400` と `404` だけは「e-Gov がその law_id を知らない」と読めるので、件ごとの `LAW_NOT_FOUND` にしています。

### 呼び出し回数

件の処理は `createLimit(HTTP_CONFIG.concurrency)`（既定 4）で並べます。同じ法令名・同じ `law_id` が複数の件に出てきても、呼び出しの中だけで持つ Map に解決中の Promise を入れて共有するので、e-Gov への問い合わせは 1 回です。

## 完了条件との対応

| Issue の完了条件 | 確認 |
|---|---|
| 実在する引用と存在しない引用を混ぜたリストで、件ごとに判定が返る | 実測（12 件混在）: `{ total: 12, found: 6, not_found: 4, ambiguous: 2, all_found: false }`。テストでも 10 件混在で件ごとに確認 |
| 存在しない条は `ARTICLE_NOT_FOUND`、法令名が引けないものは `LAW_NOT_FOUND` を件ごとに返す（ツール全体は `isError` にしない） | 実測・テストとも、混在リストで `isError` にならないことを確認 |
| 略称は `houki-abbreviations` で正式名に直してから照合する | 「所法」→ 所得税法（`resolved_by: "abbreviation"`）、「電子帳簿保存法」→ 辞書に `law_id` が無いので e-Gov の完全一致（`resolved_by: "exact_title"`、`410AC0000000025`） |
| houki-research-skill の citation 手順から呼べる | skill v0.10.0（ブランチ `feat/verify-citations`）で `docs/CITATION.md` に「引用を書き出す前に確かめる」と判定ごとの扱いの表を追加。egov v0.11.0 の publish 後に出します |
| `tools/list` の `inputSchema` に `additionalProperties: false` が入っている | `as const satisfies ToolSpec` で外側と各件の両方に付け、`server.test.ts` の全ツール走査とテストの検証で確認 |

## 実測（2026-09-20 JST）

| 入力 | 結果 |
|---|---|
| 所法 第9条第1項第1号 | `found` / `resolved_by: "abbreviation"` / 条見出し「（非課税所得）」 |
| 電子帳簿保存法 第7条 | `found` / `resolved_by: "exact_title"` / `410AC0000000025` / 条見出し「（電子取引の取引情報に係る電磁的記録の保存）」 |
| `law_id: "340AC0000000033"` 第五十七条の二 | `found` / `resolved_by: "law_id"` |
| 所得税法 第9999条 | `not_found` / `ARTICLE_NOT_FOUND` |
| 所得税法 第57条の2第99項 | `not_found` / `ARTICLE_NOT_FOUND`（「項は 5 個」）。条は実在するので `article` は残る |
| 所得税法 第57条の2第1号（項なし） | `ambiguous` / `INVALID_ARGUMENT` |
| 所得税法施行 第1条 | `ambiguous` / 候補 2 件（所得税法施行令・所得税法施行規則） |
| 架空法 第1条 | `not_found` / `LAW_NOT_FOUND` |
| 消基通 1-7-2 | `not_found` / `OUT_OF_SCOPE` / `next_actions` が `houki-nta` を指す |

## テスト

- `src/services/law-service.verify.test.ts`（9 件、新規）: e-Gov クライアントを差し替えて、10 件混在リストの件ごとの判定、`summary` と `all_found`、同じ法令名を 1 回しか問い合わせないこと、引数の形の誤り、条番号の書き方の誤り、通信できなかったときに全体がエラーになること、`inputSchema` の `additionalProperties: false`
- `src/tools/handlers.test.ts`: `toolHandlers` の一覧に `verify_citations` を追加

VM では別ディレクトリに `npm ci` して vitest 360 件・`biome check`・TypeScript 7.0.2 の `tsc --noEmit` を通しました（`better-sqlite3` は `node:sqlite` の薄いラッパーに差し替え）。Mac で `npm test && npm run build && npm run check` をお願いします。

## 取り込み後

1. タグ `v0.11.0` で publish
2. `mcp-publisher login github && mcp-publisher publish`（`server.json` と `.claude-plugin/plugin.json` は 0.11.0 に更新済み）
3. claude-plugins の `houki-egov-mcp` を 0.11.0 に
4. houki-hub: ツールリファレンス（`site/docs/reference/mcp/houki-egov.md`）の再生成と `verify_citations` の呼び出し例、`stack.json` の更新
5. houki-research-skill v0.10.0（ブランチ `feat/verify-citations`）を PR → タグ → claude-plugins の順で出す
6. hub#21（Discussion #20 の機能 9 項目の親 Issue）の機能 3 のチェックを付ける

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01VfTGnvp9r4hHTVkTx6m2w6
