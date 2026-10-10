---
title: "cli_entry — houki-egov-mcp の仕様"
description: "houki-egov-mcp の cli_entry（`houki-egov-mcp` コマンドの起動と引数の振り分け）の仕様。目的・入力・処理の流れと、仕様 ID ごとの仕様項目（specs/current から自動生成）"
---

# cli_entry の仕様

<!-- GENERATED FILE — 手で編集しない。本文は houki-egov-mcp の specs/current/cli_entry/spec.md の写し。 -->

::: info
houki-egov-mcp **v0.20.1** の `specs/current/cli_entry/spec.md` から自動生成しました（仕様 ID 12 件・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

`houki-egov-mcp` コマンドの起動と引数の振り分け

最後に仕様が変わったのは v0.20.0 の「ローカル DB の場所を、応答・起動時のログ・`--status` で確かめられるようにする（egov #108・#110、T6）」（2026-10-04 承認）です。それまでの経緯は[承認の履歴](#承認の履歴)にあります。

## 利用者と得られる結果

この機能の利用者と、利用者が渡すもの・得られる結果を示します。

- 利用者（ターミナルから `houki-egov-mcp` を実行する人）。フラグを付けずに実行して MCP サーバーを起動するか、フラグを付けて使い方・版を見る、またはローカル DB を作る・最新化する・状態を見る
- MCP クライアント（Claude Desktop などの設定で `houki-egov-mcp` を引数なしで起動し、標準入出力で MCP のやり取りをする）

## 入力

呼び出すときに渡す値です。

| フラグ                                   | 必須 | 内容                                        |
| ---------------------------------------- | ---- | ------------------------------------------- |
| （なし）                                 | 任意 | MCP サーバーとして起動する                  |
| `--help` / `-h`                          | 任意 | 使い方を出して終わる                        |
| `--version` / `-v`                       | 任意 | パッケージ名と版を出して終わる              |
| `--bulk-download-everything`             | 任意 | 全件の取り込み（cli_bulk_download）         |
| `--bulk-download-by-date YYYYMMDD`       | 任意 | 1 日分の差分の取り込み（cli_bulk_download） |
| `--sync` / `--bulk-download-incremental` | 任意 | 日次差分での最新化（cli_sync）              |
| `--status`                               | 任意 | 同期の状態と DB の件数の表示（cli_status）  |

フラグは 1 回の実行で 1 つだけ受け付ける。`--bulk-download-by-date` だけが値（日付）を 1 つ取る。それ以外の引数は [SPEC-EGOV-CLI-ENTRY-004](#spec-egov-cli-entry-004)・008・009 のエラーにする。

| 環境変数                            | 使う処理                                                            | 既定 | 受け付ける値 |
| ----------------------------------- | ------------------------------------------------------------------- | ---- | ------------ |
| `HOUKI_EGOV_BULK_RETRY`             | 一括ダウンロードの zip の取得（cli_bulk_download・cli_sync）        | 3    | 1 以上の整数 |
| `HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS` | `--sync` の上限の日数、`--status` と `search_fulltext` の警告の日数 | 90   | 1 以上の整数 |
| `HOUKI_EGOV_CONCURRENCY`            | e-Gov 法令 API への同時リクエスト数の上限（MCP サーバーのツール）   | 4    | 1 以上の整数 |

## 扱わないこと

この機能が意図して扱わないことです。

- フラグを組み合わせること（`--sync --status` は余分な引数のエラー。[SPEC-EGOV-CLI-ENTRY-009](#spec-egov-cli-entry-009)）
- MCP サーバーを標準入出力以外（HTTP など）で起動すること
- 設定ファイルを読むこと（設定は環境変数だけ）

## 処理の流れ

起動してから、MCP サーバーとして待ち受けるか、フラグの処理をして終わるかを決める順を示します。図の中の番号は「できること」の仕様 ID の末尾 3 桁です。

```mermaid
flowchart TD
  A["houki-egov-mcp を実行"] --> B{"引数があるか"}
  B -- ない --> S0["不正な数値の環境変数は警告を出して既定値を使う（011）"] --> S["MCP サーバーとして標準入出力で待ち受ける（001）"] --> S1["起動時のログに DB の場所と、DB の場所の設定を出す（012）"]
  B -- ある --> C{"最初の引数"}
  C -- "--help / -h / --version / -v / --bulk-download-everything / --bulk-download-by-date / --sync / --bulk-download-incremental / --status" --> X{"そのフラグが受け取る数より後に引数があるか"}
  X -- ある --> Y["余分な引数のエラーと使い方を出し exit 2（009）"]
  X -- "ない・--help / -h" --> H["使い方を標準出力に出し exit 0（002）"]
  X -- "ない・--version / -v" --> V["パッケージ名と版を標準出力に出し exit 0（003）"]
  X -- "ない・それ以外のフラグ" --> Z{"数値の環境変数が 1 以上の整数か（010）"}
  Z -- いいえ --> Z1["エラーを出し exit 2（010）"]
  Z -- はい --> O["それぞれの処理をして終わる（cli_bulk_download / cli_sync / cli_status）"]
  C -- "それ以外の - で始まる引数" --> U["未知のフラグのエラーと使い方を出し exit 2（004）"]
  C -- "- で始まらない引数" --> P["未知の引数のエラーと使い方を出し exit 2（008）"]
```

## 仕様項目

この機能の仕様項目を、仕様 ID ごとに並べています。見出しは仕様項目を 1 文で表したもので、条件・応答の細部・例は「詳細」を開くと読めます。仕様 ID はそれぞれ受入テストと対応していて、テストの無い ID があると各リポジトリの CI が止まります。

<a id="spec-egov-cli-entry-001"></a>

### SPEC-EGOV-CLI-ENTRY-001 引数なしで実行すると MCP サーバーとして起動する

::: details 詳細
引数を付けずに実行したときは、フラグの処理（使い方・版・取り込み・状態の表示）を何もせず、MCP サーバーとして標準入出力で待ち受ける。
:::

<a id="spec-egov-cli-entry-002"></a>

### SPEC-EGOV-CLI-ENTRY-002 `--help` と `-h` は使い方を出して exit 0

::: details 詳細
最初の引数が `--help` または `-h` のときは、使い方を標準出力に出し、MCP サーバーを起動せずに終了コード 0 で終わる。使い方には、各フラグ（`--bulk-download-everything` / `--sync` / `--bulk-download-by-date YYYYMMDD` / `--status` / `--version` / `--help`）と環境変数 `HOUKI_EGOV_DB_PATH` / `HOUKI_EGOV_BULK_RETRY` / `HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS` / `HOUKI_EGOV_CONCURRENCY` の説明が並ぶ。数値の 3 つには「1 以上の整数」と既定値を書く。`--help` は環境変数の値を検査しない（[SPEC-EGOV-CLI-ENTRY-010](#spec-egov-cli-entry-010)）。

例: 使い方に `HOUKI_EGOV_CONCURRENCY` の行がある（v0.18.x の使い方には無かった。#102）。
:::

<a id="spec-egov-cli-entry-003"></a>

### SPEC-EGOV-CLI-ENTRY-003 `--version` はパッケージ名と版を出して exit 0

::: details 詳細
最初の引数が `--version` のときは、`<パッケージ名> v<版>`（例: `@shuji-bonji/houki-egov-mcp v0.15.1`）の 1 行を標準出力に出し、MCP サーバーを起動せずに終了コード 0 で終わる。
:::

<a id="spec-egov-cli-entry-004"></a>

### SPEC-EGOV-CLI-ENTRY-004 未知のフラグはエラーにして exit 2

::: details 詳細
最初の引数が `-` で始まり、上の入力の表のどれでもないときは、標準エラー出力に `ERROR: 未知のフラグ: <フラグ>` を出し、続けて使い方を標準出力に出して、MCP サーバーを起動せずに終了コード 2 で終わる。打ち間違えたフラグのまま MCP サーバーが起動して待ち続けることはない。
:::

<a id="spec-egov-cli-entry-005"></a>

### SPEC-EGOV-CLI-ENTRY-005 `-v` も `--version` と同じ 1 行を出して exit 0

::: details 詳細
最初の引数が `-v` のときも、[SPEC-EGOV-CLI-ENTRY-003](#spec-egov-cli-entry-003) と同じ `<パッケージ名> v<版>` の 1 行を標準出力に出し、MCP サーバーを起動せずに終了コード 0 で終わる。

例: v0.15.1 で `houki-egov-mcp -v` を実行すると、標準出力は `@shuji-bonji/houki-egov-mcp v0.15.1` の 1 行だけで、終了コードは 0。
:::

<a id="spec-egov-cli-entry-006"></a>

### SPEC-EGOV-CLI-ENTRY-006 MCP サーバーは SIGINT / SIGTERM を受けると接続を閉じる

::: details 詳細
引数なしで MCP サーバーとして起動すると、標準エラー出力に `[server] <パッケージ名> v<版> started` を出して待ち受ける。その後 SIGINT または SIGTERM を受けると、標準入出力の接続を閉じる。シグナルを受けるたびに接続を閉じる処理を 1 回行う。

例: v0.15.1 を引数なしで起動すると標準エラー出力に `[server] @shuji-bonji/houki-egov-mcp v0.15.1 started` が出る。SIGINT を送ると接続を閉じる処理が 1 回、続けて SIGTERM を送るともう 1 回行われる。
:::

<a id="spec-egov-cli-entry-007"></a>

### SPEC-EGOV-CLI-ENTRY-007 MCP サーバーの起動中に想定外の例外が起きたら exit 1

::: details 詳細
MCP サーバーとして起動する途中で想定外の例外が起きたときは、標準エラー出力に `[server] fatal error` を出し、終了コード 1 で終わる。例外の文そのものは出さない（環境変数 `DEBUG` が `1` または `true` のときだけ、続けてスタックトレースを出す）。

例: 標準入出力の接続を作るところで `Error('boom')` が起きると、標準エラー出力は `[server] fatal error` の 1 行で、終了コードは 1。
:::

<a id="spec-egov-cli-entry-008"></a>

### SPEC-EGOV-CLI-ENTRY-008 `-` で始まらない最初の引数はエラーにして exit 2

::: details 詳細
最初の引数が `-` で始まらない（例: `status`・`sync`）ときは、標準エラー出力に `ERROR: 未知の引数: <引数>` を出し、続けて使い方を標準出力に出して、MCP サーバーを起動せずに終了コード 2 で終わる（[SPEC-EGOV-CLI-ENTRY-004](#spec-egov-cli-entry-004) の未知のフラグと同じ形）。

例: `houki-egov-mcp status` は `ERROR: 未知の引数: status` と使い方を出して終了コード 2（v0.18.x ではエラーを出さずに MCP サーバーとして起動し、入力を待ち続けた。#61）。
:::

<a id="spec-egov-cli-entry-009"></a>

### SPEC-EGOV-CLI-ENTRY-009 フラグの後の余分な引数はエラーにして exit 2

::: details 詳細
最初の引数が入力の表のフラグで、そのフラグが受け取る数より後に引数があるときは、そのフラグの処理を何もせず（DB を開かず、e-Gov にも接続せず）、標準エラー出力に `ERROR: 余分な引数: <最初の余分な引数>` を出し、続けて使い方を標準出力に出して、終了コード 2 で終わる。フラグが受け取る数は、`--bulk-download-by-date` が 1 つ（日付）、ほかのフラグは 0。`--bulk-download-by-date` の日付が無い・形が違うときは、余分な引数より先に [SPEC-EGOV-CLI-BULK-DOWNLOAD-001](/specs/houki-egov/cli_bulk_download#spec-egov-cli-bulk-download-001) のエラー（終了コード 2）にする。

例:

| 実行 | 標準エラー出力 | 終了コード |
| --- | --- | --- |
| `houki-egov-mcp --status extra` | `ERROR: 余分な引数: extra` | 2 |
| `houki-egov-mcp --help --version` | `ERROR: 余分な引数: --version` | 2 |
| `houki-egov-mcp --sync --status` | `ERROR: 余分な引数: --status` | 2 |
| `houki-egov-mcp --bulk-download-by-date 20260917 extra` | `ERROR: 余分な引数: extra` | 2 |
| `houki-egov-mcp --bulk-download-by-date 2026-09-17 extra` | `ERROR: --bulk-download-by-date は YYYYMMDD 形式の日付を必要とします (例: 20260507)` | 2 |

v0.18.x では 2 番目以降の引数を見なかったので、上の 4 行目までは最初のフラグの処理をして終わっていた（`--sync --status` は差分の同期をした。#61）。
:::

<a id="spec-egov-cli-entry-010"></a>

### SPEC-EGOV-CLI-ENTRY-010 CLI は数値の環境変数が 1 以上の整数でなければ、何もせずに exit 2

::: details 詳細
最初の引数が `--bulk-download-everything`・`--bulk-download-by-date`・`--sync`・`--bulk-download-incremental`・`--status` のときは、引数の検査（[SPEC-EGOV-CLI-ENTRY-009](#spec-egov-cli-entry-009)、[SPEC-EGOV-CLI-BULK-DOWNLOAD-001](/specs/houki-egov/cli_bulk_download#spec-egov-cli-bulk-download-001)）の後、DB を開く前・e-Gov に接続する前に、`HOUKI_EGOV_BULK_RETRY`・`HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS`・`HOUKI_EGOV_CONCURRENCY` の値を確かめる。どのコマンドでも 3 つとも確かめる（そのコマンドが使わない変数も）。

- 無い・空文字: 既定値を使う
- `1` 以上の整数を 10 進の数字だけで書いたもの（`^[1-9][0-9]*$`）: その値を使う
- それ以外（`0`・負の数・小数・`abc`・`90days`・前後の空白を含むもの）: 標準エラー出力に `ERROR: <変数名> は 1 以上の整数で指定してください: <値>` を出し、終了コード 2 で終わる。値が不正な変数が複数あるときは、上の順で最初の 1 つだけを出す

`--help`・`-h`・`--version`・`-v` は値を確かめない。

例: `HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS=-5 houki-egov-mcp --sync` は `ERROR: HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS は 1 以上の整数で指定してください: -5` を出して終了コード 2 で、DB を開かず e-Gov にも接続しない（v0.18.x では上限 `-5` で計算し、毎回「日次差分の公開範囲 (-5 日) を超えている」で終了コード 1）。`HOUKI_EGOV_BULK_RETRY=0` は v0.18.x では既定の 3 として動いたが、0.19.0 では同じエラーで終了コード 2。`HOUKI_EGOV_BULK_RETRY=1.5 houki-egov-mcp --status` も終了コード 2（`--status` は取得しないが、3 つとも確かめる）。`HOUKI_EGOV_BULK_RETRY=abc houki-egov-mcp --help` は使い方を出して終了コード 0。
:::

<a id="spec-egov-cli-entry-011"></a>

### SPEC-EGOV-CLI-ENTRY-011 MCP サーバーは不正な数値の環境変数に既定値を使い、警告を出して起動する

::: details 詳細
引数なしで MCP サーバーとして起動するときは、[SPEC-EGOV-CLI-ENTRY-010](#spec-egov-cli-entry-010) と同じ 3 つの環境変数を確かめる。1 以上の整数でない値（空文字と無いときは除く）は、その変数の既定値（`HOUKI_EGOV_BULK_RETRY` は 3、`HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS` は 90、`HOUKI_EGOV_CONCURRENCY` は 4）に置き換え、変数ごとに標準エラー出力へ `[server] 警告: <変数名> は 1 以上の整数で指定してください: <値>（既定値 <既定値> を使います）` を 1 行出して、起動を続ける（`[server] … started` の行より前）。終了しない。

例: `HOUKI_EGOV_CONCURRENCY=-1` で起動すると、`[server] 警告: HOUKI_EGOV_CONCURRENCY は 1 以上の整数で指定してください: -1（既定値 4 を使います）` を出して起動し、e-Gov への同時リクエスト数の上限は 4（v0.18.x では `createLimit: concurrency must be >= 1, got -1` の例外で、ツールを呼ぶ前に起動に失敗した。コードを読んで分かったことで、実行して確かめていない）。`HOUKI_EGOV_INCREMENTAL_LIMIT_DAYS=abc` で起動すると警告を出して 90 を使い、`search_fulltext` の `freshness.warning` は `最終同期から 90 日を超えていれば`（[SPEC-EGOV-SEARCH-FULLTEXT-023](/specs/houki-egov/search_fulltext#spec-egov-search-fulltext-023)）。
:::

<a id="spec-egov-cli-entry-012"></a>

### SPEC-EGOV-CLI-ENTRY-012 MCP サーバーは起動時のログに、DB の絶対パスと DB の場所の設定を出す

::: details 詳細
引数なしで MCP サーバーとして起動すると、`[server] <パッケージ名> v<版> started` の行（[SPEC-EGOV-CLI-ENTRY-006](#spec-egov-cli-entry-006)）の次に、標準エラー出力へ次の 1 行を出す。

```
[server] DB: <DB の絶対パス>（DB の場所の設定: <設定の名前>）
```

`<DB の絶対パス>` と `<設定の名前>` は [SPEC-EGOV-DB-SCHEMA-028](/specs/houki-egov/db_schema#spec-egov-db-schema-028) のとおり（ホームディレクトリを `~` に置き換えない）。この行のために DB を開かず、ファイルがあるかも確かめない（`search_fulltext` は呼び出しごとに DB を開くので、起動した後に CLI で作った DB も使える。起動時の有無を出すと古い情報になる）。MCP の応答（tools/list とツールの応答）は変わらない。

例: 環境変数を付けずに、ホームディレクトリが `/Users/bonji` の環境で起動すると、標準エラー出力は `[server] @shuji-bonji/houki-egov-mcp v0.20.0 started` の次に `[server] DB: /Users/bonji/.cache/houki-egov-mcp/laws.db（DB の場所の設定: 既定）`。`HOUKI_EGOV_DB_PATH=/Users/bonji/.cache/houki-egov-mcp/laws.v3.db` を付けて起動すると `[server] DB: /Users/bonji/.cache/houki-egov-mcp/laws.v3.db（DB の場所の設定: HOUKI_EGOV_DB_PATH）`（v0.19.x では `… started` の 1 行だけで、どのファイルを開くかはログから分からなかった。houki-egov-mcp #108 の追記）。
:::

## 検討中のこと

仕様を書き起こしたときに見つかった項目のうち、扱いを Issue で検討しているものです。ここに挙げたことは、今後の版で変わることがあります。開くと、元の仕様書の記述をそのまま読めます。

::: details 仕様書の「未決」の節
初版起こしで見つけた、意図か不具合かを人が決める項目です。決まったら「できること」に ID を振るか、`specs/changes/` の差分にします。

意図か不具合かの判断が要る項目は houki-egov-mcp の Issue に移し、ここには題と Issue の番号だけを残します。今の振る舞いのままでよくテストが無いだけの項目は、受入テストを書いてから「できること」に ID を振ります。

1. **`-v` も `--version` と同じ。** → [SPEC-EGOV-CLI-ENTRY-005](#spec-egov-cli-entry-005)
3. **MCP サーバーの終わり方。** → [SPEC-EGOV-CLI-ENTRY-006](#spec-egov-cli-entry-006)・[SPEC-EGOV-CLI-ENTRY-007](#spec-egov-cli-entry-007)
:::

## 承認の履歴

この機能の仕様が、いつ、どの変更で承認されたかを新しい順に並べています。各リポジトリの `npx spec-ids history cli_entry` と同じ内容です。変更の名前から、変更の理由と前後の振る舞いを書いた文書（GitHub）を開けます。

::: details 承認の履歴（7 件）
| 承認日 | 版 | 変更 | 仕様 PR |
|---|---|---|---|
| 2026-10-04 | v0.20.0 | [ローカル DB の場所を、応答・起動時のログ・`--status` で確かめられるようにする（egov #108・#110、T6）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.20.0/20261004-db-location/proposal.md) | [#114](https://github.com/shuji-bonji/houki-egov-mcp/pull/114) |
| 2026-10-03 | v0.19.0 | [段落だけの附則の表示と、数値の環境変数の検査（段階 5 DB と CLI の追加分）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.19.0/20261003-db-cli-followup/proposal.md) | [#103](https://github.com/shuji-bonji/houki-egov-mcp/pull/103) |
| 2026-10-03 | v0.19.0 | [ローカル DB の版の扱い・作る入口・取り込みと同期の記録・CLI の引数（段階 5 DB と CLI）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.19.0/20261003-db-cli/proposal.md) | [#100](https://github.com/shuji-bonji/houki-egov-mcp/pull/100) |
| 2026-10-03 | v0.17.0 | [README・使い方・tool description と実際の動きの食い違いを、行ごとに直す（T5 文書と実装の食い違い）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.17.0/20261003-t5-docs-mismatch/proposal.md) | [#92](https://github.com/shuji-bonji/houki-egov-mcp/pull/92) |
| 2026-09-28 | v0.15.2 | [テストが無いだけの振る舞いに仕様 ID を振る](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.15.2/20260928-untested-behaviors/proposal.md) | [#76](https://github.com/shuji-bonji/houki-egov-mcp/pull/76) |
| 2026-09-28 | v0.15.2 | [「未決」のうち判断が要る 85 件を Issue に移す](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/releases/v0.15.2/20260928-undecided-to-issues/proposal.md) | [#68](https://github.com/shuji-bonji/houki-egov-mcp/pull/68) |
| 2026-09-28 | — | 初版 | [#50](https://github.com/shuji-bonji/houki-egov-mcp/pull/50) |
:::

## 関連ページ

このページの元になった文書と、あわせて読むページです。

- [houki-egov-mcp の仕様の一覧](/specs/houki-egov/)
- [houki-egov-mcp の解説](/mcp/houki-egov)
- [元の仕様書（GitHub、v0.20.1）](https://github.com/shuji-bonji/houki-egov-mcp/blob/v0.20.1/specs/current/cli_entry/spec.md)
