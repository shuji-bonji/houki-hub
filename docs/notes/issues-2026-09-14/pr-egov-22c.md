## 何をしたか

README の 1 行目と npm の `description` を、houki-hub family で決めた仕事の 1 行に揃え、公式 MCP Registry に載せるための `mcpName` と `server.json` を足しました。コードは変えていません。

- README 1 行目: **実装する前に、その仕様が法令のどこに触れるかを条文で確かめる**。通達・Q&A は houki-nta-mcp が担当し、「法律で決まっている」と「通達でそうなっている」を混ぜないことも冒頭に
- `package.json` の `description`: 英語を先にし、同じ 1 行の日本語を続ける（npm の検索は英語の語で当たることが多いため）
- `package.json` に `"mcpName": "io.github.shuji-bonji/houki-egov-mcp"`（Registry が npm パッケージの所有確認に使う印）
- `server.json`（`mcp-publisher init` が生成する形。npm パッケージには含めない）
- `.claude-plugin/plugin.json` の `description` も同じ 1 行に
- 0.6.0 → 0.6.1。CHANGELOG に 0.6.1 の項を立て、先に main に入った README の「まず試す」（#25）もここに含める

## 取り込み後

1. タグ `v0.6.1` で publish
2. `mcp-publisher login github` → `mcp-publisher publish`（リポジトリのルートで。`server.json` を読む）
3. claude-plugins の `docs/houki-job-name` を push（marketplace-version-check が GitHub 上の `plugin.json` と突き合わせるため、この順）

## 関連

houki-hub#22 の (c) 名前と掲載。決定の経緯は houki-hub の `docs/notes/2026-09-19-job-name-and-listing.md`。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01GNRnL5TVWf5Chs91BpQS8w
