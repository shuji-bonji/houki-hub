## 何をしたか

README の冒頭に「まず試す（ローカル DB なし）」を置きました。コードは変えていません。

7 ツールのうち 6 つは登録するだけで動き、ローカル DB が要るのは `search_fulltext` だけです（`src/tools/handlers.ts` で `openDb` を呼ぶのは `handleSearchFulltext` のみ）。これまでは「CLI（ローカル DB の構築）」の約 290 MB の取り込みが、動かすための前提のように読めました。

- 冒頭に `claude_desktop_config.json` の例と、DB あり / なしで各ツールがどう動くかの対応表
- 「Claude Desktop で使う」の重複する設定例を、冒頭への参照に置き換え
- 「CLI（ローカル DB の構築）」の先頭に、いつ要るかを 1 段落
- CHANGELOG の Unreleased に記録

## 関連

houki-hub#22（発見性 — 1 種類の仕事を 1 回の導入で終わらせる）の (b) 導入の時間の egov 側。nta 側は houki-nta-mcp#35 の `--quickstart` で対応済み（v0.18.0）。

版は上げていません。次の publish に同乗させる想定です（README だけの変更なので、npm の README が更新されるのは次の publish 時）。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01GNRnL5TVWf5Chs91BpQS8w
