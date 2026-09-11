# issue 草案: ツールの引数の型を inputSchema から導き、ハンドラーの受け口を unknown にする

> **2026-09-12 追記**: issue は立てずに実装した（ユーザー指示）。houki-egov-mcp v0.6.0（`0085555`）と houki-nta-mcp v0.14.0（`04ac0bf`）。決めたこと: json-schema-to-ts を使う、`additionalProperties: false` を付ける、`nta_search_tsutatsu` の `type` / `domain` は削除。経緯は [引き継ぎメモ](2026-09-11-handoff-followups.md) の「2026-09-12 残りの一括対応」

対象リポジトリ: houki-nta-mcp（2026-09-12 作成。houki-egov-mcp も同じ構成なので、形が決まったら移す）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
タイトル案: ツールの引数の型を inputSchema から導き、toolHandlers の引数を any から unknown にする

---

## 背景

MCP の `tools/call` は、ツール名を文字列で、引数を JSON で受け取ります。コードの外から来る値なので、受け口の型は `unknown` にし、検証してから型を付けるのが本来の形です。ところが `src/tools/handlers.ts` のツール一覧は、引数を `any` で受けています。

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toolHandlers: Record<string, (args: any) => Promise<unknown>> = {
  nta_search_qa: handleNtaSearchQa,
  // …
};
```

`npm run check` では、biome の `lint/suspicious/noExplicitAny` の warning がここに出ています（v0.13.0 で `logger.ts` の 2 件を直したので、残りはこの 1 件です）。

### 型を `unknown` に書き換えるだけでは通らない

`tsconfig.json` は `strict: true` なので `strictFunctionTypes` が有効で、関数の引数は反変で比べられます。`(args: SearchQaArgs) => …` は `(args: unknown) => …` に代入できません。`any` はこのチェックを外すために使われています。

### 同じ引数の形が 3 か所に別々に書かれている

| 場所 | 役割 |
| --- | --- |
| `src/tools/definitions.ts` の `inputSchema` | `tools/list` に出す JSON Schema |
| `src/server.ts` の `validateArgs()` | 上の JSON Schema から SDK の `fromJsonSchema` で作った検証 |
| `src/types/index.ts` の `SearchQaArgs` など | ハンドラーの引数の型（手書き） |

検証を通った値が `SearchQaArgs` の形であることを、コンパイラーは確かめていません。実際に次のずれがあります。

- `nta_search_tsutatsu` の inputSchema と `SearchTsutatsuArgs` には `type` と `domain` があるが、`searchTsutatsu()` はどちらも使っていない（指定しても絞り込まれない）
- v0.12.0 までの `nta_search_qa` の `domain` は、型の上では正しかったが、比べる相手（`taxonomy`）の値と合っていなかった（#23 で修正）

## 提案

inputSchema を `as const` で書き、[json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) の `FromSchema` で引数の型を導きます。検証は今の `fromJsonSchema` のままにします。ツールの定義・検証・ハンドラーを 1 つの関数でつなぎ、型を当てる箇所をその中の 1 か所にします。

```ts
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

type ArgsOf<S extends JSONSchema> = FromSchema<S, { keepDefaultedPropertiesOptional: true }>;
export type ToolHandler = (args: unknown) => Promise<unknown>;

export function defineTool<const S extends JSONSchema>(
  definition: { name: string; description: string; inputSchema: S },
  handler: (args: ArgsOf<S>) => Promise<unknown>
) {
  // SDK の fromJsonSchema は型引数を取る: fromJsonSchema<T>(schema): StandardSchemaWithJSON<T, T>
  const validator = fromJsonSchema<ArgsOf<S>>(definition.inputSchema as JsonSchemaType);
  const handle: ToolHandler = async (raw) => {
    const result = await validator['~standard'].validate(raw ?? {});
    if (result.issues?.length) return invalidArgument(definition.name, result.issues);
    return handler(result.value);
  };
  return { definition, handle };
}
```

- `toolHandlers` は `Record<string, ToolHandler>` になり、`any` が無くなる
- `server.ts` の `validateArgs()` は `defineTool()` の中に移る
- `src/types/index.ts` の手書きの引数の型は、`ArgsOf<typeof searchQaInput>` に置き換える

## 小さく試した結果（2026-09-12）

TypeScript 5.9.3 と json-schema-to-ts 3.1.1（GitHub のソース）で、`nta_search_qa` の inputSchema を写したもので確かめました。プロジェクトの TypeScript 7（ネイティブ版）では未確認です。

| 確かめたこと | 結果 |
| --- | --- |
| `enum: [...QA_TOPICS]`（`constants.ts` の `as const` 配列を展開）を `as const` の中に書く | `topic` は `'shotoku' \| 'gensen' \| … \| 'hotei'` の union になる |
| `default: 10` を持つ `limit` | オプションを付けないと **必須**（`limit: number`）になる。`{ keepDefaultedPropertiesOptional: true }` で `limit?: number` |
| `additionalProperties` を書かない（今の inputSchema） | 型に `[x: string]: unknown` が付き、`args.keywrod` のような綴り間違いがエラーにならない |
| `additionalProperties: false` を足す | 綴り間違いがエラーになる。ただし `tools/list` の inputSchema が変わり、未知の引数を送ると `INVALID_ARGUMENT` になる |
| 導いた型と手書きの `SearchQaArgs` | 互いに代入できる（置き換えても今の呼び出しは壊れない見込み） |
| `as const` の schema を SDK の `Tool['inputSchema']` に代入 | **型エラー**。`readonly` の配列（`required` / `enum`）を、`Tool` 側の書き換え可能な配列に代入できない。`tools/list` に渡すところで変換が要る |
| SDK の `fromJsonSchema` | `fromJsonSchema<T = unknown>(schema, validator?): StandardSchemaWithJSON<T, T>`。型引数で出力の型を指定できる |

## 決めること

1. **`additionalProperties: false` を足すか**
   - 足す: 綴り間違いがコンパイル時に見つかり、未知の引数は実行時に `INVALID_ARGUMENT` になる。`tools/list` の出力が変わるので minor（houki-hub のツールリファレンスの再生成が要る）
   - 足さない: `tools/list` は変わらない。型は `[x: string]: unknown` 付きになり、綴り間違いは見つからない。内部の変更だけなので patch
2. **`src/types/index.ts` の手書きの引数の型を消すか**（`ArgsOf<…>` に置き換える／しばらく両方置いて互いに代入できるかをテストで確かめる）
3. **`nta_search_tsutatsu` の `type` / `domain` をどうするか**（inputSchema から消す／実装する）。この issue で消すと、`tools/list` が変わる
4. **`Tool['inputSchema']` への変換をどこに置くか**（`tools/list` の応答を作るところで 1 回だけ変換する案）

## 確認すること

- TypeScript 7（`npm run build`）で型が導けること、型チェックの時間が大きく増えないこと
- `fromJsonSchema` の既定の検証が `default` を埋めるか（埋めないなら `keepDefaultedPropertiesOptional: true` のままでよい）
- 14 ツールすべてで、導いた型と今の手書きの型が互いに代入できること
- `server.test.ts` の `INVALID_ARGUMENT` のテストが、検証を `defineTool()` に移した後も通ること
- `tools/list` の出力が変わらないこと（決めること 1・3 で変える場合を除く）

## 関連

- houki-nta-mcp#23（v0.13.0。`logger.ts` の `any` をこの版で直した）
- houki-egov-mcp の `src/tools/handlers.ts` も同じ `Record<string, (args: any) => Promise<unknown>>`
- 形が決まったら、shuji-mcp-patterns skill の該当パターンも更新する
