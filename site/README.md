# houki-hub site

法規シリーズ（houki-hub family）のドキュメントサイト。VitePress で作り、GitHub Pages に公開する予定です。
構成は [pdf-agent-stack/site](https://github.com/shuji-bonji/pdf-agent-stack/tree/main/site) と揃えています。

公開先: <https://shuji-bonji.github.io/houki-hub/>（`main` への push で `.github/workflows/deploy.yml` が走ります）

## 開発

```bash
npm install
npm run dev      # http://localhost:5173/houki-hub/
npm run build    # docs/.vitepress/dist に出力
npm run preview
```

## ページ構成（2026-09-07 時点）

```
docs/
├── index.md                 トップ（layout: home）
├── guide/
│   ├── overview.md          houki-hub とは
│   ├── architecture.md      全体構成と責務
│   ├── getting-started.md   導入手順
│   └── roadmap.md           現状と予定（../docs/ROADMAP.md の要約）
├── mcp/
│   ├── index.md             MCP サーバー一覧
│   ├── houki-egov.md
│   └── houki-nta.md
├── lib/
│   └── houki-abbreviations.md
└── skills/
    └── houki-research.md
```

`docs/reference/` は `scripts/generate-reference.mjs` が生成します（`npm run build` の先頭で走ります）。ツール（関数）ごとに 1 ページで、MCP は `docs/reference/mcp/<server>/<tool>.md`、ライブラリは `docs/reference/lib/houki-abbreviations/<仕様書の dir>.md` です。各サーバーとライブラリの `index.md` はツールの一覧と共通の前置きです。
引数は MCP サーバーを起動して `tools/list` から、ライブラリのシグネチャは `dist/index.d.ts` から、「利用者と得られる結果」「扱わないこと」「処理の流れ」「仕様項目の一覧」は各リポジトリの `specs/current/<dir>/spec.md` から写します（spec.md の `## アクター`・`## できないこと`・`## できること` の節を、サイトではこの名前で出します。対応表は `scripts/spec-pages.mjs` の `SPEC_SECTIONS` と `scripts/generate-reference.mjs` の `SPEC_COPY`）。
`mcp/` の clone が無い環境（CI）では生成を飛ばし、コミット済みのページを使います。呼び出し例は `scripts/reference-examples/<server>/ja/<tool>.md` に手で書き、生成時にツールのページの「呼び出し例」の節に入ります（最初の `::: details` より前に書いた注意は「引数」の節の末尾に入ります）。

## 書き方

公開文書なので「〜します」「〜です」で書き、利用者が何を受け取るかを文で示します。
内部の関数名・変数名は載せず、ツール名・フィールド名・エラーコードのように実行すれば目に見える名前で書きます。
ツールのページの「使いどころ」は、`scripts/spec-pages/<site>/<dir>.md` に `## 使いどころ` の節として人が書きます（仕様書ページには出しません）。人向けの小さな図（Mermaid、ノード 10 個ほどまで）は、同じファイルの `## 使いどころ` の後に `## 呼び出しの流れ` の節を作って置きます。この 2 つ以外の見出しを書くと、生成のときに警告が出ます。

### コンテナと図の使い分け

人が書くページ（`guide/`・`mcp/`・`lib/`・`skills/` と `index.md`）では、カスタムコンテナの種類ごとに意味を 1 つに決めています（2026-10-09 に決定。houki-hub#48 の「コンテナと図の使い分け」）。種類を混ぜて使うと、どの枠も目立たなくなるためです。

| コンテナ | 意味 | 例 |
| --- | --- | --- |
| `tip` | 使いどころ・近道 | 番号が分からないときは先に `nta_search_tsutatsu` |
| `info` | 前提・版の条件 | v0.19.0 以上、ローカル DB が要る |
| `warning` | 間違えやすいこと・業法の線 | 通達は納税者を拘束しない。結論は返さない |
| `danger` | 取り消せない操作 | 0.18.x 以前で新しい DB を開くと全テーブルが消える |
| `details` | 長い例・経緯・spec.md の図 | 呼び出し例の応答 JSON |

- コンテナには `::: warning 個別の事案への当てはめ` のように、中身を表す題を付けます（題が無いと英語の既定の題が出ます）
- 業法の線（`warning`）に入れる文は、今ある文を動かすだけにし、言い回しを変えるときは shuji が確認します
- 人向けの図（Mermaid）はノード 10 個ほどまでにし、1 ページに足すのは 1〜2 個までにします。幅 390px の画面でも読めるよう、横に長い図は `flowchart TB` で縦に並べます
- spec.md の処理の流れの図は大きいので、ツールのページでは `::: details` に畳みます（生成スクリプトが行います）
