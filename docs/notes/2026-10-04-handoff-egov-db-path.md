# 引き継ぎ: houki-egov-mcp の DB のパスと作り直しの案内を、README と houki-hub に誤解なく書く（2026-10-04 JST）

段階 5 の会話（egov 0.18.0・0.19.0 / nta 0.24.0 の publish の後）で、shuji の Mac の DB をまとめたときに分かったことです。バルク機能（XML 一括ダウンロード）の扱いを見直す会話に渡し、houki-egov-mcp の README・`--help`・`api-fallback` の案内と、houki-hub の site（`site/docs/guide/local-database.md` など）に書いてもらうための材料です。

## 確かめた事実

### 1. DB のパスの決まり方（`src/db/index.ts`、0.19.0）

1. 環境変数 `HOUKI_EGOV_DB_PATH` があれば、その値
2. 無ければ `${XDG_CACHE_HOME:-~/.cache}/houki-egov-mcp/laws.db`

- プラグイン（`.claude-plugin/plugin.json`）は `npx -y @shuji-bonji/houki-egov-mcp@latest` を起動するだけで、`env` を持たない。Claude Desktop のような GUI アプリはシェルの環境変数を受け継がないので、プラグインは `~/.cache/houki-egov-mcp/laws.db` を開く
- `claude_desktop_config.json` に手で書いたサーバー（shuji の環境の houki-egov-dev）は、`env` の `HOUKI_EGOV_DB_PATH` があればそのファイルを開く
- ターミナルの CLI は、そのシェルの環境変数で決まる。環境変数を付けずに実行すると、プラグインと同じ `laws.db` を作る・更新する

### 2. 起きたこと（2026-10-04）

- `~/.cache/houki-egov-mcp/` に `laws.db`（版 2、7.6 GB、9/19）と `laws.v3.db`（版 3、5.0 GB、10/4。`HOUKI_EGOV_DB_PATH` 付きの CLI で作った）の 2 つがあった
- プラグイン（0.19.0）は `laws.db`（版 2）を開くので、`search_fulltext` は本文を検索せずに `search_law` に切り替わっていた
- `PRAGMA wal_checkpoint(TRUNCATE)` の後に `laws.v3.db` を `laws.db` に名前を変えるだけで、取り込み直しをせずにまとめられた。その後、プラグインの `search_fulltext` は `source: "bulk"`、`staleness: "fresh"` を返した
- 名前を変えた後、`HOUKI_EGOV_DB_PATH` が `laws.v3.db`（もう無い）を指したままの houki-egov-dev は、`source: "api-fallback"` と `note`「bulk DL 未実行のため …」を返した（0.19.0 は DB を作らないので「DB が無い」扱い）

### 3. コマンドの書き方

- `houki-egov-mcp --status` は、グローバルにインストールしていないと `zsh: command not found` になる
- `npx houki-egov-mcp --status` は、npm に `houki-egov-mcp` という名前のパッケージが無いので 404（リポジトリのフォルダーの中でだけ動く）
- どこからでも動くのは `npx -y @shuji-bonji/houki-egov-mcp@latest --status`

### 4. 日々の更新と作り直し

- `--bulk-download-everything` は、版 3 の DB に対しては全件（約 290 MB）を取り直すだけで、作り直しはしない。日々の更新は `--sync`（2026-10-04 に実行して「差分なし」、518 ms）
- 0.18.x 以前の CLI や MCP サーバーが版 3 の DB を開くと、全テーブルを消す（0.18.x の動き）。手元のビルドを起動するサーバー（houki-egov-dev）で古いコミットを試すと、プラグインと共有している `laws.db` を消しうる

## 書いてほしいこと（案）

1. **README の「ローカル DB」の節**: DB のパスの決まり方（上の 1）と、プラグイン・手で書いたサーバー・CLI がそれぞれどのファイルを開くかの表。「環境変数を付けずに CLI を実行すると、プラグインが使う `laws.db` が作られる・更新される」を明記
2. **CLI の例の書き方**: README と `--help` の例を `npx -y @shuji-bonji/houki-egov-mcp@latest <フラグ>` にする（グローバルにインストールしたときは `houki-egov-mcp <フラグ>` でもよい、と添える）
3. **`search_fulltext` の `api-fallback` の `note` と `next_actions`**: 今の `note`「bulk DL 未実行のため …」と `example.command: "houki-egov-mcp --bulk-download-everything"` は、(a) DB が無い、(b) `HOUKI_EGOV_DB_PATH` が指すファイルが無い、(c) 版が合わない、を区別できず、コマンドもそのままでは動かないことがある。開こうとした DB のパスを `note` に入れるか、場面ごとに文を分けるかを検討する（応答の文を変えるので、仕様 PR が要る）
4. **作り直しと日々の更新の使い分け**: `--sync`（日々）、`--bulk-download-everything`（初回・差分で追える日数を超えたとき・DB の版が変わったとき）
5. **開発者向け（CONTRIBUTING.md）**: DB の版を上げる開発や古いコミットを試すときは、`HOUKI_EGOV_DB_PATH` を別のファイル（例: `laws.dev.db`）に向け、公開版と DB を共有しない
6. **DB の版をまたぐときの移し方**: 別のファイルで作った新しい版の DB は、`PRAGMA wal_checkpoint(TRUNCATE)` の後に `laws.db` へ名前を変えれば取り込み直さずに使える（MCP サーバーを止めてから）
7. **houki-hub**: `site/docs/guide/local-database.md` に 1・2・4 を利用者向けに。houki-nta-mcp も `HOUKI_NTA_DB_PATH` で同じ構造なので、両方を 1 つの表で並べるとよい（nta 0.24.0 の「0.23.x 以前で開かない」注意も同じ節に）

## 関連

- houki-egov-mcp 0.19.0 の CHANGELOG の冒頭の注意（DB の版 3、作り直し、0.18.x で開かない）
- 差分 `specs/releases/v0.19.0/20261003-db-cli/`（SPEC-EGOV-DB-SCHEMA-025: DB を作るのは `--bulk-download-everything` だけ）

## 対応の状態（2026-10-04 JST、バルク機能の見直しの会話）

| 書いてほしいこと | 対応 | 場所 |
| --- | --- | --- |
| 1. README の「ローカル DB」の節 | 起動のしかたごとに開く DB の表、`env -u` の外し方 | houki-egov-mcp ブランチ `docs/20261004-db-path`（`ebaf022`） |
| 2. CLI の例の書き方 | README の例を `npx -y @shuji-bonji/houki-egov-mcp@latest <フラグ>` に。`--help` に npx の形と、変数を付けない CLI が plugin と同じ `laws.db` を扱うことを足した（テストは 787 件 pass） | 同上 |
| 3. `api-fallback` の `note` と `next_actions` | 応答の文は変えず、README に「`note` の先頭ごとの原因と確かめ方」を足した。文を変える案は Issue の下書き 02 | `docs/notes/issues-2026-10-04-egov-bulk/02-fallback-note-db-path.md` |
| 4. 作り直しと日々の更新の使い分け | README「日々の更新と作り直し」、hub の表 | egov ブランチ・hub ブランチ |
| 5. 開発者向け | CONTRIBUTING.md「ローカル DB を使う開発」（`laws.dev.db`） | egov ブランチ |
| 6. 版をまたぐときの移し方 | README「別のファイルで作った DB を `laws.db` に移す」 | egov ブランチ |
| 7. houki-hub | `site/docs/guide/local-database.md` を書き直し（egov・nta を 1 つの表に、nta 0.24.0 の注意も）。`mcp/houki-egov.md` の古い記述（ツールの数、v0.5.1）を直し、サイトのコマンドを `@latest` にそろえた | houki-hub ブランチ `docs/20261004-local-db-path`（`eab3d7c`） |

バルク機能の見直しで、別の不具合を見つけた: e-Gov は施行日の当日に同じ版を未施行の欄を空にして配り直す（XML は同じ）が、取り込みは `content_hash` が同じなので `unchanged` として飛ばし、状態が `UnEnforced` のまま、旧版が `CurrentEnforced` のまま残る。Issue の下書き 01。2026-11-01 に施行される版で表に出る。

2026-10-04 JST に houki-egov-mcp #107（施行日の当日の配り直し）・#108（`api-fallback` の `note` と案内のコマンド）として起票した。

## 起票した Issue（2026-10-04）

- houki-egov-mcp #108 への追記（応答と起動時のログに DB のパス）、#110（DB の場所を確かめるコマンドと `--status` の警告）、#111（DB のファイル名に版を入れるか）
- houki-nta-mcp #138（上の 3 件の nta 版）
- 本文と投稿の記録: `docs/notes/issues-2026-10-04-db-path/`、`scripts/post-issues-2026-10-04-db-path.sh`
