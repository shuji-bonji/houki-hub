---
title: "listByCategory — houki-abbreviations の関数"
description: "houki-abbreviations の関数 listByCategory：指定カテゴリのエントリ一覧を返す。（シグネチャ・例・扱わないこと・処理の流れ。自動生成）"
---

# listByCategory

<!-- GENERATED FILE — 手で編集しない。シグネチャと説明は dist/index.d.ts、使用状況は mcp/*/src の import、利用者と得られる結果・扱わないこと・処理の流れ・仕様項目の一覧は specs/current/list_by_category/spec.md、使いどころは scripts/spec-pages/houki-abbreviations/list_by_category.md から。 -->

::: info
houki-abbreviations **v0.7.0** の `dist/index.d.ts` と `specs/current/list_by_category/spec.md` から自動生成しました（仕様 ID 7 件・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

*関数 ・ v0.1.0 で追加 ・ family では未使用*

指定カテゴリのエントリ一覧を返す。

## 利用者と得られる結果

この関数の利用者と、利用者が渡すもの・得られる結果を示します。

- houki-hub family の MCP サーバーと、このパッケージを import する利用者のコード。種別（法律・政令・通達など）を渡して、その種別の辞書のエントリの一覧を受け取る

## シグネチャ

import して呼ぶときの形です。パッケージの型定義（`dist/index.d.ts`）から写しています。

```ts
function listByCategory(category: Category): AbbreviationEntry[];
```

**関係する型**: [`AbbreviationEntry`](/reference/lib/houki-abbreviations/types#abbreviationentry)・[`Category`](/reference/lib/houki-abbreviations/types#category)

## 例

型定義の JSDoc に書かれている例です。

::: details 例
```ts
listByCategory('cabinet-order')  // → 政令系エントリ全件
listByCategory('constitution')   // → 日本国憲法 1件
```
:::

## 扱わないこと

この関数が意図して扱わないことです。

- 複数の種別をまとめて絞り込むこと（`searchByName` の `filter.category` は配列を受け付ける）
- 分野で絞り込むこと（`listByDomain`）
- 本文を持つ MCP で絞り込むこと（`listBySourceMcpHint`）
- 件数だけを返すこと（`getAbbreviationStats` の `byCategory`）

## 処理の流れ

仕様書の「処理の流れ」の節を、図も含めてそのまま写しています。図が大きいので畳んでいます。

::: details 処理の流れの図（仕様書の写し）
図の中の番号は「できること」の仕様 ID の末尾 3 桁です。

```mermaid
flowchart TD
  A["呼び出し（category）"] --> B["辞書の全エントリから category が等しいものだけを選ぶ（001）"]
  B --> C{"1 件以上あるか"}
  C -- はい --> D["選んだエントリの配列を返す（001・002）"]
  C -- いいえ --> E["空配列を返す。例外は投げない（003）"]
```
:::

## 仕様項目の一覧

この関数の仕様項目 7 件の見出しです。仕様項目は受入テストと 1 対 1 で対応していて、条件と例は[仕様書ページ](/specs/houki-abbreviations/list_by_category)で読めます。

::: details 仕様項目の見出し（7 件）
| 仕様 ID | 仕様項目 |
|---|---|
| [001](/specs/houki-abbreviations/list_by_category#spec-abbr-list-by-category-001) | 指定した種別のエントリだけを返す |
| [002](/specs/houki-abbreviations/list_by_category#spec-abbr-list-by-category-002) | constitution には日本国憲法の 1 件を返す |
| [003](/specs/houki-abbreviations/list_by_category#spec-abbr-list-by-category-003) | エントリの無い種別には空配列を返す |
| [004](/specs/houki-abbreviations/list_by_category#spec-abbr-list-by-category-004) | 辞書の並びのまま返す |
| [005](/specs/houki-abbreviations/list_by_category#spec-abbr-list-by-category-005) | 呼ぶたびに新しい配列を返す |
| [006](/specs/houki-abbreviations/list_by_category#spec-abbr-list-by-category-006) | CATEGORIES に無い値には空配列を返す |
| [007](/specs/houki-abbreviations/list_by_category#spec-abbr-list-by-category-007) | ministerial-ordinance・rule・kobetsu-tsutatsu にもその種別のエントリを返す |
:::

## 関連ページ

このページの元になった文書と、あわせて読むページです。

- [houki-abbreviations の解説](/lib/houki-abbreviations)
- [houki-abbreviations の API の一覧](/reference/lib/houki-abbreviations/)
- [listByCategory の仕様書ページ](/specs/houki-abbreviations/list_by_category)
- [元の仕様書（GitHub、v0.7.0）](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/current/list_by_category/spec.md)
