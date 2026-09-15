# Discussion #20 の指摘を作業単位に割り付ける（2026-09-14 JST）

[Discussion #20](https://github.com/shuji-bonji/houki-hub/discussions/20) の「劣っている点」14 項目は、houki-hub の Issue #21（機能 1〜9）と #22（配布と制約 1〜5）にそのまま転記されています。転記のままでは実装先も完了条件も決まらないため、次のとおり割り付けます。

本ファイルは割り付けの記録です。起票に使う本文は `issues-2026-09-14/` に 1 件 1 ファイルで置いてあり、`scripts/create-issues-2026-09-14.sh` がそれを読んで起票します。

```
# 何をするかだけ見る
DRY_RUN=1 ./scripts/create-issues-2026-09-14.sh

# 実行（確認あり）
./scripts/create-issues-2026-09-14.sh
```

新規 Issue を 10 本作り、その番号を差し込んだ本文で houki-hub#21 / #22 を書き換えます。作成結果は `issues-2026-09-14/created.tsv` に残ります。

## 割り付け一覧

| Discussion | 内容 | 実装先 | 種別 |
|---|---|---|---|
| 機能 1 | 添付ファイル・法令ファイル形式 | egov#19 | 新規 Issue C |
| 機能 2 | 条文の参照を辿る | egov#20（hub#8 と設計を合わせる） | 新規 Issue D |
| 機能 3 | 引用の実在確認 | egov#18 | 新規 Issue B |
| 機能 4 | 漢数字の条番号 | egov#17 | 新規 Issue A |
| 機能 5 | 差分同期 | egov#21（Phase 2-8） | 新規 Issue E |
| 機能 6 | 章・節単位の分割取得 | egov#22 | 新規 Issue F |
| 機能 7 | 2 文字語の本文索引 | egov#23 | 新規 Issue G |
| 機能 8 | 附則の目次配置 | egov#24 | 新規 Issue H |
| 機能 9 | 裁決・判例・厚労通達 | — | ROADMAP 「新 MCP」で回答済み。Issue にしない |
| 配布 1 | better-sqlite3 | hub#23（egov / nta 共通） | 調査 |
| 配布 2 | Node.js 22 以上 | hub#23 | 同じ Issue |
| 配布 3 | ライセンス文言 | DECISIONS.md | Issue にしない |
| 配布 4 | 公式 MCP 後の位置 | DECISIONS.md | Issue にしない |
| 配布 5 | 発見性 | hub#22 | #22 本体の作業に置き換えた |

あわせて houki-abbreviations に 1 本（abbr#6）。機能 4 と対になりますが、対象が違います（条番号 / 法令番号）。

## 実測による訂正

起票前に houki-egov-mcp v0.6.0 のソースを確認したところ、Discussion の記述と実態が食い違う箇所がありました。Issue 本文は実態に合わせています。

| Discussion の記述 | 実測 |
|---|---|
| 機能 5「DB 更新は全件再取り込みだけです」 | `src/cli/index.ts` に `--bulk-download-by-date <YYYYMMDD>` があり、`downloadIncrementalZip`（`file_section=3`）で単日差分を取得して ingest しています。コメントは「デバッグ用」。欠けているのは、`sync_state` を見て未取得日を自動で回す入口です |
| 機能 4「漢数字は `INVALID_ARTICLE_NUM`」 | そのとおりです。`src/utils/article-num.ts` で漢数字を検出して明示的に throw しています。`第30条` → `30`、`30の2` → `30_2` の正規化は動いています |
| 機能 8「附則を平坦に並べる」 | `src/services/law-search.ts` に `isSupplementaryArticle` と `Suppl{idx}_{Num}` の表示（`附則(3) 1`）があります。欠けているのは `get_toc` の階層配置です |

---

# houki-hub #21（書き換え後の本文）

タイトル案: **機能追加・改善 — Discussion #20 の割り付けと進捗**

Discussion #20 の「劣っている点 › 機能」9 項目を、実装先ごとの Issue に割り付けます。本 Issue は進捗を束ねるためのもので、ここでは実装しません。

## houki-egov-mcp

- [ ] 漢数字の条番号・号番号を受け付ける（機能 4）→ egov#TBD
- [ ] 引用の実在確認ツール（機能 3）→ egov#TBD
- [ ] 添付ファイルと法令ファイル形式を出す（機能 1）→ egov#TBD
- [ ] 施行令・施行規則の関連付け（機能 2）→ egov#TBD
- [ ] 差分同期の運用経路（機能 5 / Phase 2-8）→ egov#TBD
- [ ] 章・節単位の分割取得（機能 6）→ egov#TBD
- [ ] 2 文字語の本文検索（機能 7）→ egov#TBD
- [ ] `get_toc` の附則の配置（機能 8）→ egov#TBD

## houki-abbreviations

- [ ] `lookupByLawNum` の漢数字↔算用数字正規化 → abbreviations#TBD

## Issue にしない項目

**機能 9（裁決・判例・厚労通達が別リポジトリ）** は欠落ではなく、責務を分けた設計の結果です。回答は `docs/ROADMAP.md` の新 MCP（houki-metadata / houki-mhlw / houki-saiketsu / houki-court）です。この Issue で追跡すると閉じられないため、含めません。

## 注意

機能 2（参照を辿る）は #8（GraphRAG・KAG による法令グラフ）と対象が重なります。実装前に、どちらの層で参照関係を持つかを決めてください。

出典: #20

---

# houki-hub #22（書き換え後の本文）

タイトル案: **発見性 — 1 種類の仕事を 1 回の導入で終わらせる**

Discussion #20 の「劣っている点 › 配布と制約」5 項目のうち、作業になるのは発見性だけでした。残りは調査 Issue か DECISIONS.md に移します。

いまの #22-5 は「パッケージ名が長い、キーワードが弱い、Star が少ない」と書いていますが、これは症状です。原因は次の 2 つだと整理しました。

1. 1 つの仕事を終えるのに、plugin を 3 つ入れる必要がある
2. その仕事に名前が付いていないため、誰に向けた何なのかが伝わらない

## やること

- [ ] `shuji-bonji/claude-plugins` の `marketplace.json` で、`houki-research` に `"dependencies": ["houki-egov-mcp", "houki-nta-mcp"]` を宣言する（`pdf-publish` が `pdf-writer-mcp` で同じ形を取っています）
- [ ] 仕事の名前を 1 つ決める
- [ ] README の 1 行目、npm の `description`、`marketplace.json` の `description` を、決めた名前に揃える
- [ ] その名前で houki-hub site のトップとガイドを書く
- [ ] MCP ディレクトリ（mcp.so / PulseMCP / Smithery / awesome-mcp-servers）に出す

## 仕事の名前について

`tax-law-mcp` と同じ「税務の裏取り」は名乗れません。README / DISCLAIMER が業としての利用を想定外としており、税理士法 52 条を明記しているためです（配布 3）。同じ土俵に乗ると、裁決 1,950 件を持たないまま看板も使えない形になります。

houki だけが答えられる問いを名前にします。

> 見つけた通達・質疑応答事例が今も生きているかを、根拠条文まで遡って確かめる

根拠となる実装:

| 機能 | 版 | 答える問い |
|---|---|---|
| `orphaned_at` / `index_status` | nta v0.17.0 | いま国税庁の索引に残っているか |
| `legal_status` | nta | 国民を拘束するのか、行政内部の指示なのか |
| `next_actions`（通達→法律本文） | nta v0.11.0 / v0.12.0 | 根拠条文はどれか |
| `freshness` / `source` | egov / nta v0.16.0 | 何日時点のデータか |

`tax-law-mcp` は最終更新が 2026-03 で、通達と法令を同じツールに載せています。

## 測り方

npm の週次ダウンロードは導入者数を表しません（MCP は起動のたびに `npx -y` で落ちます）。plugin の導入数と、記事から site への流入で見ます。

## 移すもの

- 配布 1（better-sqlite3）/ 配布 2（Node.js 22 以上）→ 調査 Issue #TBD へ
- 配布 3（ライセンス文言）/ 配布 4（公式 MCP 後の位置）→ `docs/DECISIONS.md` へ。コードの作業ではありません

出典: #20

---

# houki-egov-mcp 起票文

## Issue A — 漢数字の条番号・号番号を受け付ける

### いまの状態

`src/utils/article-num.ts` は、漢数字を見つけると明示的に例外を投げます。

```ts
// 漢数字が残っていたらエラー（v0.1.0 では未対応）
if (/[一二三四五六七八九十百千]/.test(s)) {
  throw new Error(`漢数字の条番号には未対応です（v0.1.0）。アラビア数字でご指定ください: ${input}`);
}
```

`第30条` → `30`、`30の2` → `30_2`、`第8号の2` → `8_2` の正規化はすでに動いています。漢数字だけが通りません。

### なぜ直すか

条文を漢数字で書く資料（判決文、通達、書籍）から引き写した番号がそのまま失敗します。他の e-Gov 系 MCP は表記揺れを吸収しており、入力側で先に負けています。

### やること

- 漢数字→算用数字の変換関数を追加する（`一`〜`千` の位取り。`三十` → `30`、`百二十三` → `123`）
- `toEgovArticleNum` と `toEgovItemNum` の throw を、変換を試みてから判定する形に変える
- 変換できない文字列は従来どおり `INVALID_ARTICLE_NUM` を返す
- `src/utils/article-num.test.ts` に追加する

### 完了条件

- `第三十条` / `第三十条の二` / `三十` / `八の二` が、算用数字と同じ結果になる
- `get_law` に漢数字で指定して本文が返る
- 既存のテストが通る

出典: houki-hub#20 機能 4 / houki-hub#21

## Issue B — 引用の実在確認ツールを追加する

### 背景

`japan-law-mcp` には `verify_citations` があります。houki には、LLM が組み立てた引用リストをまとめて検証する経路がありません。1 件ずつ `get_law` を呼べば同じことはできますが、エージェントが「全部実在した」と言い切る根拠を 1 回で取れません。

houki は `search_fulltext` と `get_law` をすでに持っているので、新しいデータ源は要りません。

### やること

- ツール `verify_citations` を追加する
- 入力: 引用の配列（法令名または lawId、条番号、任意で項・号）
- 出力: 各件について `found` / `not_found` / `ambiguous` と、見つかった場合の正式名称・法令番号・条見出し・URL
- 存在しない条は `ARTICLE_NOT_FOUND`、法令名が引けないものは `LAW_NOT_FOUND` を件ごとに返す（ツール全体は `isError` にしない）
- 略称は `houki-abbreviations` で正式名に直してから照合する

### 完了条件

- 実在する引用と存在しない引用を混ぜたリストで、件ごとに判定が返る
- houki-research-skill の citation 手順から呼べる
- `tools/list` の `inputSchema` に `additionalProperties: false` が入っている

出典: houki-hub#20 機能 3 / houki-hub#21

## Issue C — 添付ファイルと法令ファイル形式を出す

### 背景

e-Gov 法令 API v2 の `GET /attachment` と、法令ファイルの形式指定（xml / html / rtf / docx）を出していません。`kannkyo/e-gov-law-mcp` は出しています。図表付きの改正や別紙が必要な作業では、houki だけでは足りません。

### やること

- 添付ファイルの一覧と取得を出す
- 法令本文を xml / html / rtf / docx で取れる経路を用意する
- 出力はバイナリになるため、MCP の応答で何を返すか（保存先パスか、base64 か、URL のみか）を先に決める
- 決めた内容を `docs/DESIGN.md` に書く

### 完了条件

- 添付のある法令で、添付の一覧と実体が取れる
- 形式指定が効く
- 既存 7 ツールのエラー契約と揃っている

出典: houki-hub#20 機能 1 / houki-hub#21

## Issue D — 施行令・施行規則の関連付け

### 背景

`kuro6061/e-gov-mcp` の `follow_law_chain` / `explain_law_article` / `find_related_laws` に相当する処理がありません。「この条が指す施行令はどれか」をサーバーが解決しないため、LLM が次の `search_law` を自分で組み立てています。

### 先に決めること

houki-hub#8（GraphRAG・KAG による法令グラフ）と対象が重なります。

- 参照関係を MCP のツールとして持つのか、グラフ側に持つのか
- 条文中の参照表現（「〜に規定する」「〜で定める」）をどこで解析するのか
- `houki-abbreviations` の逆引き（`lookupByLawId` / `lookupByLawNum`）をどう使うのか

これを決めてから実装に入ります。

### やること（暫定）

- 法令名から施行令・施行規則を引く（名称規則ベース）
- 条文中の他法令への参照を抽出する
- 成功時の `next_actions` に、辿り先の `get_law` 呼び出しを入れる

出典: houki-hub#20 機能 2 / houki-hub#21 / houki-hub#8

## Issue E — 差分同期の運用経路（Phase 2-8）

### いまの状態

Discussion #20 は「DB 更新は全件再取り込みだけ」と書いていますが、実測では部品が揃っています。

- `src/services/bulk/zip-fetcher.ts` に `downloadIncrementalZip`（`file_section=3`）
- `src/config.ts` に `EGOV_BULK.incrementalDownloadUrl(yyyymmdd)`
- `src/cli/index.ts` に `--bulk-download-by-date <YYYYMMDD>`（コメントは「デバッグ用」）
- `ingestZip({ source: 'incremental' })`
- `sync_state` テーブル（`--status` が読んでいる）

欠けているのは、**前回同期日から今日までの未取得日を自動で回す入口**です。

### やること

- `--sync` を追加する。`sync_state` の最終同期日から今日までを日付順に取得して ingest する
- 取得できない日（差分 zip が無い日）を飛ばす
- 途中で失敗したら、成功した日までを `sync_state` に記録して終える
- 何日ぶんをどれだけの時間で取り込んだかを表示する
- 最終同期から一定日数（既定 90 日）以上空いている場合は、全件取り込みを促して終える
- `--help` と README に追記する

### 完了条件

- 全件取り込み済みの DB に対して `--sync` を実行すると、差分だけが入る
- 2 回続けて実行したとき、2 回目は取り込む日が無いことを表示して正常終了する
- `--status` の `freshness` が更新される

出典: houki-hub#20 機能 5 / houki-hub#21 / ROADMAP Phase 2-8

## Issue F — 章・節単位の分割取得

### 背景

民法・会社法・消費税法は `get_law` の応答が長く、コンテキストに載せにくい状態です。いまは `get_toc` で目次を見てから条を個別に取る運用で凌いでいます。

### やること

- `get_law` に章・節を指定する引数を足すか、別ツールにするかを決める
- 編（Part）・章（Chapter）・節（Section）の階層は `src/services/law-tree.ts` にあるので、そこから範囲を切る
- 応答に、切り出した範囲（どの章のどこからどこまでか）を明示する

### 完了条件

- 民法の特定の章だけが返る
- 返した範囲が応答に書かれている

出典: houki-hub#20 機能 6 / houki-hub#21

## Issue G — 2 文字語の本文検索

### いまの状態

`src/db/schema.ts` の `articles_fts` / `laws_fts` は `tokenize = 'trigram'` です。trigram は 3 文字以上の語しか索引に載らないため、「相殺」「時効」「善意」のような 2 文字の法律用語が本文検索に当たりません。

### 検討する選択肢

- 2 文字語だけ `LIKE` で補う（索引を使わないので遅い。件数上限が要る）
- bigram トークナイザを足す（SQLite の組み込みには無いため、外部トークナイザか事前分割が必要）
- 2 文字語の入力を検出し、法令名検索へ寄せることを応答で明示する（いまの暗黙の挙動を、明示に変えるだけ）

まず 3 つ目（挙動を明示する）だけでも、利用者の混乱は減ります。

### 完了条件

- 2 文字語で `search_fulltext` を呼んだとき、結果が本文由来か法令名由来かが応答から分かる

出典: houki-hub#20 機能 7 / houki-hub#21

## Issue H — `get_toc` の附則の配置

### いまの状態

`src/services/law-search.ts` に附則の判定と表示があります。

- `isSupplementaryArticle(articleNum)` — `Suppl` で始まるか
- 表示: `Suppl3_1` → `附則(3) 1`、`Suppl137_51_2` → `附則(137) 51の2`

不足しているのは `get_toc` の階層配置です。附則の条が編・章の外に平坦に並びます。附則は改正法ごとに積み重なるため、本則と同じ木に混ぜると読み手が現行の条と区別できません。

### やること

- `get_toc` の応答で、本則と附則を別の枝にする
- 附則は改正法ごと（`Suppl{idx}` の idx ごと）にまとめる
- どの改正法の附則かが分かるよう、可能なら改正法令名か法令番号を添える

### 完了条件

- 附則を持つ法令の `get_toc` で、本則と附則が分かれて返る
- 附則が改正法ごとにまとまっている

出典: houki-hub#20 機能 8 / houki-hub#21

---

# houki-abbreviations 起票文

## Issue J — `lookupByLawNum` の漢数字↔算用数字正規化

### 背景

法令番号は `昭和二十五年法律第百三十七号` のように漢数字で書かれます。利用者や他の資料は `昭和25年法律第137号` と書くことがあります。いま `lookupByLawNum` は表記が一致しないと引けません。

houki-egov-mcp 側の「条番号」の漢数字対応（egov#TBD）とは対象が違います。あちらは `第三十条`、こちらは `昭和二十五年法律第百三十七号` です。層を分けたまま、両方で正規化します。

### やること

- 法令番号の漢数字↔算用数字を正規化してから照合する
- `isValidLawId` の DF 系・M 省令系のパターンを足す（ROADMAP 4 に既出）
- テストを追加する

### 完了条件

- `昭和二十五年法律第百三十七号` と `昭和25年法律第137号` が同じ結果を返す

出典: houki-hub#20 機能 4 / houki-hub#21 / ROADMAP 4

---

# houki-hub 起票文

## Issue I — better-sqlite3 と Node 22 以上の見直し（調査）

### 背景

Discussion #20 の配布 1・2 です。

- `better-sqlite3`（egov は `^12.9.0`）はネイティブモジュールで、環境によってビルドが落ちます
- `engines` は egov / nta とも `>=22.0.0` です。古いランタイムの Claude Desktop 環境では動きません

どちらも意図した選択だと Discussion 本文にも書いていますが、導入摩擦としては実在します。

### 調べること

- Node の標準 `node:sqlite` で、いま使っている機能（FTS5、トリガ、WAL、プリペアドステートメント）が満たせるか
- 満たせる場合、安定版として使える Node の最小版はいくつか。`>=22.0.0` を上げる必要があるか
- 上げる場合、Claude Desktop の同梱ランタイムで動くか
- 移行しない場合の代替（ビルド失敗時に読み取り専用へ落とす、など）

egov と nta の両方が対象です。結論は `docs/DECISIONS.md` に書きます。

### 完了条件

- 移行する / しない / 条件付きで移行する のいずれかを、根拠付きで決める

出典: houki-hub#20 配布 1・2 / houki-hub#22

## DECISIONS.md に移す項目

Issue にせず、`docs/DECISIONS.md` に書きます。

- **ライセンス文言（配布 3）** — MIT だが、README / DISCLAIMER は業としての法律事務・税務への利用を想定外としている。参照ツールとしての利用範囲をどう書き分けるか
- **公式 MCP が出たあとの位置（配布 4）** — デジタル庁の公式 MCP が一般提供されたとき、何を委譲し、何を残すか。残るのは「切り出し・FTS・略称・通達との切り分け・エラー契約」だと Discussion は整理している

---

# 起票後の記録（2026-09-14）

`scripts/create-issues-2026-09-14.sh` を実行し、10 本を起票して hub#21 / hub#22 を書き換えた。対応は `issues-2026-09-14/created.tsv` にある。

| key | Issue | 題名 |
|---|---|---|
| A | egov#17 | 漢数字の条番号・号番号を受け付ける |
| B | egov#18 | 引用の実在確認ツールを追加する |
| C | egov#19 | 添付ファイルと法令ファイル形式を出す |
| D | egov#20 | 施行令・施行規則の関連付け |
| E | egov#21 | 差分同期の運用経路（Phase 2-8） |
| F | egov#22 | 章・節単位の分割取得 |
| G | egov#23 | 2 文字語の本文検索 |
| H | egov#24 | get_toc の附則の配置 |
| I | hub#23 | better-sqlite3 と Node 22 以上の見直し（調査） |
| J | abbr#6 | lookupByLawNum の漢数字↔算用数字正規化 |

番号は 3 リポジトリで独立に振られ、重なっている（`egov#21` と `hub#21` は別物）。文中では `egov#` / `hub#` / `abbr#` を必ず付ける。

## 題名の接頭辞について

hub#21 / hub#22 / hub#23 の題名の先頭に `houki-egov-mcp: ` を付けた。hub は束ねのリポジトリなので、題名だけで対象が分かるのは良い。ただし 3 本のうち対象が egov に閉じるのは hub#21 だけで、残り 2 本は複数リポジトリにまたがる。

| Issue | 実際の対象 | 接頭辞 |
|---|---|---|
| hub#21 | egov 8 本 + abbreviations 1 本 | `houki-egov-mcp:` でおおむね合う |
| hub#22 | claude-plugins の `marketplace.json`、egov と nta の npm `description`、houki-hub site、MCP ディレクトリ | egov に閉じない |
| hub#23 | egov と nta の両方の依存 | egov に閉じない |

## Issue をどのリポジトリに置くか

今回の判断基準は「**そのコードを直す人がいるリポジトリに置く**」。複数リポジトリのコードを触るものだけ hub に置く。この基準では hub#22 と hub#23 は hub が正しい置き場所になる。
