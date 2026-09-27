`verify_citations` で、同じ（e-Gov が知らない）`law_id` の件が 1 回の呼び出しに並ぶと、2 件目以降の `next_actions` が 1 件目の判定を使い回します。`law_name` を書いた件でも、`search_law` の `keyword` が `law_id` になります。

### いまの状態（v0.15.1）

SPEC-EGOV-VERIFY-CITATIONS-027 は「e-Gov が知らない `law_id` の件の `example` は `{ keyword: <law_name> }`、`law_name` が無ければ `{ keyword: <law_id> }`」と書いています。1 件だけで渡すとこのとおりになります。

```json
{ "citations": [
  { "law_id": "999AC0000000999", "article": "1" },
  { "law_name": "所得税法", "law_id": "999AC0000000999", "article": "1" }
] }
```

- 1 件目: `next_actions` は `[{ action: "search_law", example: { keyword: "999AC0000000999" } }]`（期待どおり）
- 2 件目: 期待は `keyword: "所得税法"`、実際は `keyword: "999AC0000000999"`

SPEC-EGOV-VERIFY-CITATIONS-033（同じ `law_id` の本文は 1 回だけ取る）のために `law_id` ごとにまとめた判定が、件ごとの `law_name` を見ずに使われているとみられます。

受入テストは書いてあります（ブランチ `test/20260928-untested-behaviors` では RED のため外しました。本文は下）。

```ts
it('SPEC-EGOV-VERIFY-CITATIONS-027 同じ未知の law_id が law_name の有無で並んでも、keyword は件ごとに決まる', async () => {
  const res = await ok({
    citations: [
      { law_id: '999AC0000000999', article: '1' },
      { law_name: '所得税法', law_id: '999AC0000000999', article: '1' },
    ],
  });
  const [withoutName, withName] = res.results;
  expect(withoutName.next_actions).toEqual([
    { action: 'search_law', reason: expect.any(String), example: { keyword: '999AC0000000999' } },
  ]);
  expect(withName.next_actions).toEqual([
    { action: 'search_law', reason: expect.any(String), example: { keyword: '所得税法' } },
  ]);
});
```

### 決めること

- 不具合として直すか（仕様 027 は変えず、実装を直す）

### 完了条件

- 上のテストを `src/spec-tests/untested-20260928/verify_citations.test.ts` に戻して GREEN になる

出典: 差分 `20260928-untested-behaviors` の Test Designer の報告
