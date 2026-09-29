# houki-hub#5 の①③: 版のずれを Issue にし、古い版で測ったままの呼び出し例を一覧にする

- 日付: 2026-10-01（JST）
- 対象: houki-hub の `.github/workflows/stack-check.yml`、`.github/scripts/stack-drift-issue.mjs`、`scripts/check-example-versions.mjs`
- 出典: houki-hub#5「houki-hub に関わるプロジェクトの変更把握の仕組みを作る」の①と③。位置づけは `docs/notes/2026-09-29-plan-spec-issues.md` 4 章「段階 5b」
- 状態: ブランチ `feat/5-change-detection`。main に入れた後、`workflow_dispatch` で 1 回回して Issue が立つことを確かめる

これまでの `stack-check.yml` は週 1（月曜 06:00 JST）で `node scripts/generate-stack.mjs --check` を回し、ずれがあれば CI が赤くなるだけだった。houki-hub を見に行かない限り気づかない（#5 の本文）。段階 4〜5 で MCP の publish が 8 回ある予定なので、publish の翌日には「hub の版表が古い」と Issue で分かる形にした。

## 1. 作ったもの

| ファイル | 役割 |
| --- | --- |
| `.github/workflows/stack-check.yml` | 毎日 07:17 JST（`cron: '17 22 * * *'`）と `workflow_dispatch`、main への push（`stack.json`・`README.md`・`scripts/generate-stack.mjs`・`scripts/check-example-versions.mjs`・`scripts/reference-examples/**`・`.github/scripts/**`・本ファイル）で回る。`permissions` に `issues: write`。先にテストを回し、次に `stack-drift-issue.mjs` を回す |
| `.github/scripts/stack-drift-issue.mjs` | `stack.json` の `published` と npm の `dist-tags.latest` を比べ、Issue を作る・更新する・閉じる。npm は `npm view` ではなく registry（`https://registry.npmjs.org/<pkg>`）を `fetch` で読む。GitHub は REST を `fetch` で呼ぶ（`GITHUB_TOKEN` と `GITHUB_REPOSITORY`）。`--dry-run` で GitHub に書かずに本文を出せる |
| `.github/scripts/stack-drift-issue.test.mjs` | 判定（`detectDrift`・`decideAction`）と本文（`buildIssueBody`）の検査。`node --test '.github/scripts/*.test.mjs'` |
| `scripts/check-example-versions.mjs` | ③。`scripts/reference-examples/<server>/ja/*.md` の各例の「- 実測: vX（日付）」を読み、`stack.json` の `published`（または `--current <server>=<version>`）と比べる |
| `scripts/check-example-versions.test.mjs` | 実測の行の読み取り（`parseExamples`）と判定（`classifyExamples`）の検査。`node --test 'scripts/*.test.mjs'` |

`scripts/generate-stack.mjs --check` は残してある（手元で `npm view` と照合するとき用）。workflow からは呼ばなくなった。

## 2. Issue が立つ条件と、二重に立てない仕組み

`stack-drift-issue.mjs` は毎回、次の順で決める（`decideAction`）。

| npm の応答 | ずれ | open の Issue | すること | 終了コード |
| --- | --- | --- | --- | --- |
| 1 件でも届かなかった | — | — | 何もしない（判定不能を「一致」にも「ずれ」にも数えない） | 2 |
| 全部届いた | あり | 無い | Issue を立てる（題名 `stack.json の版が npm と違う`、ラベル `stack-drift`。ラベルが無ければ作る） | 1 |
| 全部届いた | あり | ある | 本文を差し替える。ずれの中身が前回と違うときだけコメントを付ける | 1 |
| 全部届いた | なし | ある | 「一致したので閉じる」とコメントして閉じる | 0 |
| 全部届いた | なし | 無い | 何もしない | 0 |

「open の Issue」は、ラベル `stack-drift` の open の Issue のうち、題名が `stack.json の版が npm と違う` に一致するもの（PR は除く。複数あれば番号の小さいもの）。同じ題名の Issue を毎日作らないのはこの検索による。

「ずれの中身が前回と違う」は、本文の末尾に埋めた印 `<!-- stack-drift: houki-nta-mcp@0.21.2->0.21.3 -->` と今回のずれを比べて決める。同じずれのままなら本文（検出日時と呼び出し例の一覧）だけ差し替え、コメントは付けない。毎日同じコメントが積もらないようにするため。

ずれがあるときの終了コードは、これまでと同じ 1（CI は赤のまま）。通知の本体は Issue で、赤い CI は補助。

## 3. Issue の本文の形

```
`stack.json` の `published`（公開版）と npm の最新版（`dist-tags.latest`）が違います。
`.github/workflows/stack-check.yml` が 2026-10-01 07:17 JST に検出しました（[実行ログ](…)）。

## ずれ
| リポジトリ | npm パッケージ | stack.json | npm |
| houki-nta-mcp | `@shuji-bonji/houki-nta-mcp` | 0.21.2 | 0.21.3 |

## 直し方
（node scripts/generate-stack.mjs --readme を Mac で回して commit、push で再検査して閉じる）

## 古い版で測ったままの呼び出し例
（`check-example-versions.mjs` の結果。現行版は npm の最新版。<details> に表）

<!-- stack-drift: houki-nta-mcp@0.21.2->0.21.3 -->
```

呼び出し例の一覧で使う「現行版」は `stack.json` ではなく npm の最新版。`stack.json` が古いときに Issue が立つので、`stack.json` の版で比べると取り直す範囲が狭く出る。

## 4. ③ の使い方

```sh
node scripts/check-example-versions.mjs                            # 古い版で測ったままの例を表で
node scripts/check-example-versions.mjs --json                     # 機械可読（current / summary / examples[]）
node scripts/check-example-versions.mjs --all                      # 現行の例も含めて全件
node scripts/check-example-versions.mjs --current houki-nta=0.21.3 # 現行版を上書き（stack.json を更新する前に見るとき）
node scripts/check-example-versions.mjs --strict                   # 古い例があれば exit 1（既定は 0。一覧を出すのが目的）
```

読み取りの決まり:

- 例は `::: details 呼び出し例 — …` の行で始まり、`:::` で終わる。`::: tip` などは例に数えない
- 実測版は、見出しの後（空行を挟んでもよい）の最初の `- 実測: vX.Y.Z（日付）` の行。日付の後ろに文が続いてもよい（`nta_search_tsutatsu.md` の「DB が古いとき」の例）
- 実測の行が無い例は「判定不能」として出す。見落としを隠さない
- 判定は 4 つ。古い（実測版 < 現行版）、現行、現行より新しい（`stack.json` が古いか、publish 前に測った）、判定不能
- `reference-examples/` のディレクトリ名と `stack.json` の `repos[].name` の対応は `SERVER_TO_REPO`（`houki-egov` → `houki-egov-mcp`、`houki-nta` → `houki-nta-mcp`）。MCP が増えたらここに足す

2026-10-01 時点の結果: 例 47 件のうち古い 47 件（現行 egov 0.15.4 / nta 0.21.3）。egov の例は v0.5.3〜v0.15.0、nta の例は v0.10.2〜v0.21.0 で測っている。段階 6 の「呼び出し例の再実測」では、この一覧から振る舞いが変わったツールの例を選ぶ。

## 5. ②と④を対象外にした理由

#5 の本文のとおり。

- ②（CI でリファレンスを再生成して PR を出す）は、`generate-reference.mjs` の `REGISTRY` が `mcp/<repo>/dist/index.js` を直接起動しているのを `npx -y @shuji-bonji/houki-nta-mcp@latest` に切り替えられるようにするところから始まり、houki-nta-mcp の better-sqlite3 が `tools/list` だけで動くかの確認が要る。`docs/notes/2026-09-29-plan-spec-issues.md` の段階 5b でも計画の外にしている
- ④（MCP 側の `publish.yml` から `repository_dispatch` で知らせる）は、送信側にリポジトリを跨ぐ PAT が要り、MCP が増えるたびに全リポジトリへ同じ step を足すことになる。①で毎日回れば遅れは最大 1 日なので、まずは①③で足りる

## 6. 読んでいて見つかったこと

- `generate-stack.mjs` の `npmVersion` は `npm view` に頼る（`npm` の設定と registry の応答に左右され、Cowork の VM では 403 になったことがある）。`stack-drift-issue.mjs` は registry を `fetch` で直接読むので `npm` CLI に依らない。`generate-stack.mjs` 側も同じ方法に寄せる余地がある
- `generate-stack.mjs --check` は照合を直列に `npm view` するので、パッケージが増えると時間が伸びる。`stack-drift-issue.mjs` は `Promise.all` で並列に読む
- `stack.json` の `houki-abbreviations` の `local.tag` が `v0.6.0` のまま `version` が `0.6.1`（タグを打っていない）。`consistency` は npm と `package.json` だけで判定するので `match` になっている
- 旧 `stack-check.yml` の `push` の対象に `scripts/reference-examples/**` が無かったので、例を直しても再検査されなかった。今回足した
