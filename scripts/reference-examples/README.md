# ツールリファレンスの呼び出し例

`scripts/generate-reference.mjs` が生成するリファレンス（`site/docs/reference/mcp/*.md`）の各ツールの末尾に付ける、手書きの呼び出し例です。
生成されたページは手で編集しません。直すのはここのファイルです。

## 置き場所

```
scripts/reference-examples/<server>/ja/<tool>.md
```

- `<server>`: `houki-egov` / `houki-nta`
- `<tool>`: ツール名（`search_law`、`nta_get_tsutatsu` など）

ファイルが無いツールには何も付きません。生成時に「呼び出し例なし」として名前が出ます。

## 書き方

Markdown をそのまま貼るので、VitePress のコンテナが使えます。実測の JSON は `::: details` に入れて閉じた状態にし、
運用上の注意は `::: warning` / `::: tip` を上に置きます。

````markdown
::: details 呼び出し例 — 「消費税法第 57 条の 2 の本文」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要

**引数**

```jsonc
{ "law_name": "消費税法", "article": "57の2" }
```

**返る JSON（抜粋）**

```jsonc
{ ... }
```
:::
````

## 守ること

- 応答は実際に呼んで取ったものだけを載せ、**版と日付を添える**。推測で書かない
- 長い本文は `…` で省略してよいが、フィールド名と構造は省略しない
- 引数名は `tools/list` の `inputSchema` と一致させる（生成時に表と並ぶので、ずれるとすぐ分かる）
- 法令本文・通達本文の引用は、出典 URL のフィールドを残す
