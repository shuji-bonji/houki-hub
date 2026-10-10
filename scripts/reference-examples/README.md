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
- 版を上げても取り直せない例（例: 最後の取り込みから 126 日たった DB に対する応答）は、「- 実測:」の次の行に `- 版の照合: しない（理由）` を書く。`node scripts/check-example-versions.mjs` はその例の版を比べず、「照合しない」として理由と一緒に表に出す。`--strict` の失敗には数えない

## 照合のスクリプトが読む行

`node scripts/check-examples-contract.mjs`（houki-hub#44）は、例の `**引数**` でツールを呼び、`**返る JSON` のコードブロックを部分一致のパターンとして応答と比べます。比べ方の規則は `scripts/lib/example-contract.mjs` の冒頭と、`docs/notes/2026-10-10-design-hub5-regen-and-examples-check.md` の 5 章にあります。例の書き方のうち、照合に効くのは次の行です。

- `- ローカル DB: あり…` の例は、DB の無い環境（`--db absent`）では流さず「未確認」にします。`不要` で始まる例は流します。行が無い例は、DB の無い環境では流しません
- `- 照合:` の行に、その例だけの例外を書きます。パスはバッククォートで囲み、文は「。」で区切ります。末尾の（…）は理由です

  | 書き方 | 意味 |
  | --- | --- |
  | `- 照合: しない（理由）` | この例は照合しない |
  | `` - 照合: `meta.title` は見ない `` | そのパスは値も有無も比べない |
  | `` - 照合: `results[].score` は ±0.05 `` | 数値の幅 |
  | `` - 照合: `results` は 1 件目だけ（理由） `` | 配列の 1 件目だけ比べる |
  | `` - 照合: `taxAnswer.sections` はデータ `` | 違っても「データ側の差分」にする |

- `- 版の照合: しない` の例は、照合のスクリプトでも「照合しない」にします
- 配列の途中を省くときは、`// …計 8 件` のコメントか、`"…"` だけの要素を置きます。オブジェクトのキーを省くときは `/* … */` か `"…": "…"` を置きます。文字列の一部を省くときは `…` を使います

## 実測の取り方

呼び出し例の JSON は、MCP サーバーを stdio で起動して実際に叩いて取ります。Claude のプラグイン経由で叩いても同じサーバーの同じツールなので、どちらで取っても実測です。ターミナルだけで完結させるなら次の形が短く済みます。

```sh
cat > /tmp/nta-call.sh <<'SH'
nta_call() {
  {
    printf '%s\n' \
      '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"probe","version":"0"}}}' \
      '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
      "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/call\",\"params\":{\"name\":\"$1\",\"arguments\":$2}}"
    sleep 30
  } | npx -y @shuji-bonji/houki-nta-mcp@0.17.0 2>/dev/null \
    | jq -r 'select(.id==2) | .result.content[0].text'
}
SH
source /tmp/nta-call.sh

nta_call nta_get_tax_answer '{"no":"6101","format":"json"}' > /tmp/ta-6101.json
jq '{source, fetchedAt: .taxAnswer.fetchedAt}' /tmp/ta-6101.json
```

MCP は `initialize` → `notifications/initialized` → `tools/call` の順に送ります。最初の 2 つを飛ばすと `tools/call` は通りません。応答の本体は `result.content[0].text` に **JSON 文字列として** 入るので、`jq -r` で取り出してからもう一度 JSON として扱います。

houki-egov-mcp も同じ形です。パッケージ名と版を差し替えて、ツール名と引数を渡します。

### つまずくところ

- **`sleep` は npx の起動待ちも含みます。** `sleep` は npx と並行に走るので、パッケージのダウンロードとサーバー起動に指定した秒数以上かかると、サーバーが読む前に標準入力が閉じて何も返りません（空のファイルができます）。初回は 30 秒を見ておくか、先に `npx -y @shuji-bonji/houki-nta-mcp@0.17.0 --help >/dev/null` でキャッシュを温めます
- **版を `@0.17.0` のように固定します。** 例に「実測: v0.x.y」と書くので、`@latest` だと後から食い違います
- **`2>/dev/null` を外すと原因が見えます。** 空振りしたときはこれを外して再実行します

### ローカル DB の状態で応答が変わるツール

`nta_get_tsutatsu` / `nta_get_qa` / `nta_get_tax_answer` は、DB に構造があれば DB から返し（`source: "db"`）、無ければ国税庁サイトから取得して書き戻します（`source: "live"`）。`fetchedAt` の意味も変わります（`"db"` は取り込んだ日時）。

どちらの応答を例に載せるかを決めてから叩きます。両方を見るには 2 回叩きます。1 回目が `"live"`、2 回目が `"db"` で `fetchedAt` は 1 回目の値のまま、が期待どおりの結果です。**この実測は手元の `cache.db` に書き込みます**（`structured_json` が埋まり `fetched_at` が更新されます）。触りたくなければ `HOUKI_NTA_DB_PATH` に写しを指定します。

### 取り終えたら

例のファイルを直してから、生成を回します。

```sh
node scripts/generate-reference.mjs
```
