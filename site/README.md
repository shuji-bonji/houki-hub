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

`docs/reference/mcp/*.md` は `scripts/generate-reference.mjs` が MCP サーバーを起動して `tools/list` から生成します（`npm run build` の先頭で走ります）。
`mcp/` の clone が無い環境（CI）では生成を飛ばし、コミット済みのページを使います。呼び出し例は `scripts/reference-examples/<server>/ja/<tool>.md` に手で書き、生成時に各ツールの末尾へ付きます。

## 書き方

公開文書なので「〜します」「〜です」で書き、利用者が何を受け取るかを文で示します。
内部の関数名・変数名は載せず、ツール名・フィールド名・エラーコードのように実行すれば目に見える名前で書きます。
