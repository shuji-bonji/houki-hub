# 法規シリーズ 組み合わせ試用レポート（2026-10-12）

houki-egov-mcp・houki-nta-mcp・pdf-reader-mcp・houki-research-skill を、Skill の手順書に書いてあるとおりの順番で呼び、応答が文書と一致するかを確かめた記録です。実行は 2026-10-12 01:51〜01:55 JST（2026-10-11T16:51〜16:55Z）、Claude Desktop に登録した MCP を Cowork のセッションから呼びました。

対象と前提:

| 対象 | 版・状態 |
|---|---|
| houki-research-skill | e222bdc（2026-10-09）。`scripts/mcp-refs.config.json` の基準は egov 0.20.0 / nta 0.27.0 / pdf-reader 0.15.5 |
| houki-egov-mcp | dev 版（`houki-egov-dev`）と plugin 版（marketplace 経由）の 2 系統。実行中の版は応答に出ないため未確認。DB は `~/.cache/houki-egov-mcp/laws.db`（`last_sync_date: 2026-10-05`、`staleness: fresh`） |
| houki-nta-mcp | dev 版（DB `cache.dev.db`）と plugin 版（DB `cache.db`）。実行中の版は未確認。DB は 2026-10-04〜05 取得（`staleness: stale`、7 日） |
| pdf-reader-mcp | ローカル登録（`pdf-reader-mcp-local`）。版は未確認 |

版が未確認なのは、houki-egov-mcp・houki-nta-mcp のリポジトリがこのセッションの接続フォルダーに無く、`--status` を実行できなかったためです。応答の形（`freshness.db_path`、`filters.domain.note` に「0.18.0 で外しました」、`LAW_NOT_FOUND` の候補付き）から、egov は 0.20.0 以上と推定できます。

## 結果の要約

| 区分 | 件数 |
|---|---|
| 通った（応答が手順書・例のとおり） | 34 呼び出しのうち 32 |
| 通らなかった（応答が得られない・誤った内容） | 0 |
| 文書と違った・確認が要る | 2 呼び出し（#32・#34）。文書側の記述の古さを含め Issue 候補 5 件 |

dev 版と plugin 版は、同じ引数に対して `db_path` 以外が同一でした（7 ツールで比較）。

## 軸 1: 縦串（egov → nta → PDF）

`examples/electronic-bookkeeping.md` の 12 呼び出しと、追記の 0.10.1 経路（`get_related_laws` → `get_article_references` → `next_actions[].example` をそのまま `get_law` へ）を通しました。

```mermaid
flowchart LR
  A["resolve_abbreviation<br>電帳法"] --> B["search_fulltext<br>電子取引 電磁的記録 保存"]
  B --> C["get_law 電帳法 7 条"]
  C --> D["get_related_laws → 施行令・施行規則"]
  C --> E["get_article_references 7 条<br>delegations: 財務省令"]
  E -->|next_actions の example| F["search_fulltext<br>…施行規則 法第七条"]
  F --> G["get_article_references<br>施行規則 4 条 1 項"]
  G -->|next_actions[4].example| H["get_law 施行規則 2 条 6 項 5 号"]
  C --> I["get_law_revisions latest 4"]
  I --> J["get_law 7 条 at 2027-01-01"]
  B --> K["nta_search_tax_answer 電子取引"]
  K -->|next_actions| L["nta_get_tax_answer 5930 json"]
  C --> M["verify_citations 5 件"]
```

| # | ツール | 引数 | 結果 | 例との一致 |
|---|---|---|---|---|
| 1 | `resolve_abbreviation` | `電帳法` | `formal` が正式名、`source_mcp_hint: houki-egov`、`in_scope: true` | 一致 |
| 2 | `search_fulltext` | `電子取引 電磁的記録 保存`, limit 8 | `source: bulk`、8 件（電帳法 7 条・施行規則 4 条・関税法 2 条・関税法施行規則 4 条）。`short_tokens` に「保存」が 3 文字未満の旨 | 一致（例と同じ 8 件） |
| 3 | `get_law` | 電帳法 7 条, json | 本文が例と同一 | 一致 |
| 4 | `get_related_laws` | 電帳法 | 施行令 `503CO0000000128`・施行規則 `410M50000040043`、`not_found` 空 | 一致 |
| 5 | `get_article_references` | 電帳法 7 条 | `references` 空、`delegations` に「財務省令で定める」→ 施行規則。`next_actions` に `search_fulltext` の例 | 一致 |
| 6 | `search_fulltext` | #5 の `next_actions[0].example` をそのまま | 施行規則 4 条と附則(9) の 2 件。`law_scope` に法令名 | 通過 |
| 7 | `get_article_references` | 施行規則 4 条 1 項 | `external` 2 件、`internal` 3 件（「第六項第五号」が `article: "2"`、`article_from` 付き）、`relative` 5 件、`next_actions` 5 件 | 一致 |
| 8 | `get_law` | #7 の `next_actions[4].example` をそのまま | 施行規則 2 条 6 項 5 号（検索機能の要件）の本文 | 一致 |
| 9 | `get_law_revisions` | 電帳法, latest 4 | 先頭が `UnEnforced`（2027-01-01）、2 行目が `CurrentEnforced` | 一致 |
| 10 | `get_law` | 電帳法 7 条, at 2027-01-01 | 本文は現行と同一、`時点: 2027-01-01` | 一致 |
| 11 | `nta_search_tax_answer` | 電子取引, limit 5 | 5930 の 1 件、`binds_tax_office: false`、`next_actions` に `nta_get_tax_answer { no: "5930" }` | 一致 |
| 12 | `nta_search_qa` | 電子取引, limit 5 | 0 件、`hint` に「DB の質疑応答事例 1,841 件に…」 | 一致 |
| 13 | `nta_get_tax_answer` | 5930, json | `source: db`、「根拠法令等」に `法法126、150の2、法規26の3、54、59、66、67` | 例は `source: live`（初回）。今回は DB にあるため `db`。文書の説明どおり |
| 14 | `verify_citations` | 例の 4 引用 + 存在しない 99 条 | 4 件 `found`、99 条は `not_found` + `ARTICLE_NOT_FOUND` + `get_toc` の案内。ツール全体はエラーにならない | 一致 |

## 軸 2: 逆順（nta → egov）と PDF

`examples/invoice-registration.md` と `workflows/tax-research.md` ④〜⑦。

| # | ツール | 引数 | 結果 | 一致 |
|---|---|---|---|---|
| 15 | `nta_get_tsutatsu` | 消基通 1-7-2, json | 本文、`base_laws` 3 件、`next_actions[0].example` が `{ mcp, tool, law_name: "消費税法" }` | 一致 |
| 16 | `get_law` | 消費税法 57の2 第 4 項（通達本文の「法第57条の2第4項」から） | 本文 | 一致 |
| 17 | `nta_get_qa` | shohi/02/19, json | `related_laws` / `related_tsutatsu` / `next_actions` 2 件が手順書の抜粋と同一 | 一致 |
| 18 | `get_law` | #17 の example から `mcp` / `tool` を除いた残り | 消費税法 2 条 1 項 8 号 | 一致 |
| 19 | `nta_get_tsutatsu` | #17 の `next_actions[1].example` をそのまま | 5-1-1 の本文 | 一致 |
| 20 | `nta_search_kaisei_tsutatsu` | インボイス, shohi, hasPdf true, limit 5 | 先頭が `0025004-026`（2025-04-01）。`search_notes` に「"インボイス" を含む文書は見つかりませんでした。…"消費税法" を含む文書に広げて検索しました」 | 一致（通称の展開は #21 の方針どおり） |
| 21 | `nta_inspect_pdf_meta` | kaisei / 0025004-026 / comparison / save true | 別紙1・別紙2・【参考】の 3 件、すべて `kind: comparison`、`read_strategy: tables`。`saved[]` に絶対パス（`cached: true`）。`next_actions[0]` が `pdf-reader-mcp:extract_tables { file_path }` | 一致 |
| 22 | `extract_tables`（pdf-reader-mcp） | #21 の `next_actions[0].example` + pages 1 | `Tagged: Yes`、表 1 件、見出し行「改正後 \| 改正前」、第16項（改正後）/ 第15項（改正前） | 一致 |

#22 の補足: 1 ページ目の表は 1 行 2 列で返り、1 セルの中に 1-7-2 と 5-6-6 の 2 項目が続けて入ります。PDF 側のタグ構造によるもので、読み手が項目の切れ目を見つける必要があります。

## 軸 3: Skill の手順書の残り

| # | ツール | 引数 | 結果 |
|---|---|---|---|
| 23 | `get_toc` | 民法, depth 2, suppl none | 編と章まで。`toc[].path` が `Part3/Chapter2` の形。`suppl.note` に「附則 67 本（条 201 件）は返していません」 |
| 24 | `get_law_range` | 民法, path `Part3/Chapter2`, max_chars 2000 | 521〜531 条の 13 件、`truncated: true`、`next_from_article: "532"`、`next_actions` に続きの引数 |
| 25 | `list_attachments` | 戸籍法施行規則 | 42 件（jpg 7・pdf 35）、`location` に別表・様式の見出しと関係条文、`next_actions` に `get_attachment` と `pdf-reader-mcp:read_url` |
| 26 | `nta_search_tsutatsu` | 棚卸資産, limit 2 | 所基通 70-2・39-3、`base_laws_by_tsutatsu` と `next_actions` 1 件 |

## 軸 4: エラー経路

`docs/ERROR-CODES.md` と `docs/NOTES.md` の記述と突き合わせました。

| # | 操作 | 期待（文書） | 実際 | 一致 |
|---|---|---|---|---|
| 27 | `search_fulltext { keyword: "消基通" }` | `OUT_OF_SCOPE`（egov 0.18.0 以上） | `OUT_OF_SCOPE`、`hint` に nta への切り替え、`next_actions[0].example: { mcp: "houki-nta" }` | 一致 |
| 28 | `get_law { law_name: "電子帳簿保存法施行規則", article: "4" }` | 候補付き `LAW_NOT_FOUND`（0.18.0 以上） | `LAW_NOT_FOUND`、`hint` に部分一致 1 件、`next_actions` に正式名での `get_law` と `search_law`、`retryable: false` | 一致 |
| 29 | `get_law { …, at: "2016-04-01" }` | `INVALID_ARGUMENT`、`path: "at"`、`hint` に e-Gov の文 | そのとおり。`detail.cause: "400044"` | 一致 |
| 30 | `get_law` に `mcp` / `tool` を付けて呼ぶ | `INVALID_ARGUMENT`（`mcp, tool: inputSchema に無い引数です`） | そのとおり。`detail.issues` に 2 件 | 一致 |
| 31 | `nta_search_qa { limit: 0 }` | `INVALID_ARGUMENT`（範囲の外は丸めない） | `INVALID_ARGUMENT`、`issues[0].path: "limit"` | 一致 |
| 32 | `nta_get_tsutatsu { name: "消基通", clause: "99-9-9" }` | `ARTICLE_NOT_FOUND` | `ARTICLE_NOT_FOUND`、`available_clauses` 50 件 | code は一致。`hint` の文が README と合わない（候補 1） |
| 33 | `nta_get_tax_answer { no: "9999" }` | `DOC_NOT_FOUND`、`nta_search_tax_answer` を案内 | そのとおり。`retryable: false` | 一致 |
| 34 | `nta_search_tsutatsu` で 0 件 | — | `count: 0`、`hits: []`、`message` のみ。`hint` / `next_actions` 無し | 文書に記述が無い（候補 2） |

## 軸 5: dev 版と plugin 版の比較

同じ引数で両方を呼び、応答を見比べました。

| ツール | 引数 | 差 |
|---|---|---|
| egov `search_law` | 電帳法 | 無し |
| egov `resolve_abbreviation` | 電帳法 | 無し |
| egov `search_fulltext` | …施行規則 法第七条 | 無し（`freshness` の値まで同一） |
| egov `get_law` | 電帳法 7 条 at 2016-04-01 | 無し（同じ `INVALID_ARGUMENT`） |
| egov `get_article_references` | 施行規則 4 条 1 項 | 無し |
| nta `nta_get_tsutatsu` | 消基通 99-9-9 | 無し（同じ `ARTICLE_NOT_FOUND`） |
| nta `nta_get_qa` | shohi/02/19 json | 無し |
| nta `nta_search_qa` | 電子取引 | `freshness.db_path` だけ（`cache.dev.db` と `cache.db`） |
| nta `nta_search_tsutatsu` | 電子帳簿 | `db_path` だけ |

2 系統の DB は取得時刻（`fetchedAt`）まで同じでした。plugin 版と dev 版が同じ版か、同じ DB を複製したものと見られます。

## Issue 候補

### 候補 1: `nta_get_tsutatsu` の `ARTICLE_NOT_FOUND` の `hint` が README の案内と合わない（houki-nta-mcp）

再現: `nta_get_tsutatsu { "name": "消基通", "clause": "99-9-9" }`

応答の `hint`:

> 別の clause 番号を試すか、`--bulk-download` で再取得してください（最新の改正反映用）

食い違い:

- フラグ名が `--bulk-download` で、ツールの説明文と README が書く `--bulk-download-all` と違う
- Skill の README（「ローカル DB」の節）は「案内のコマンドは `npx -y @shuji-bonji/<パッケージ>@latest <フラグ>` の形です（houki-nta-mcp v0.25.0 以上）」と書いているが、この `hint` はフラグだけ
- `retryable` と `next_actions` が付かない。`DOC_NOT_FOUND`（#33）には両方付く

`available_clauses` は 50 件で切れているが、切れていることを示す項目が無い。

### 候補 2: `nta_search_tsutatsu` の 0 件の応答の形が、文書系 5 ツールと違う（houki-nta-mcp・houki-research-skill）

再現: `nta_search_tsutatsu { "keyword": "存在しない語句ゼロ件" }`

- 応答は `count` / `hits` / `message` で、文書系 5 ツール（`results` / `hint`）と項目名が違う
- 0 件のとき `hint` と `next_actions` が無い。`nta_search_qa` の 0 件は「DB の質疑応答事例 1,841 件に…」の `hint` が付く（#23 の方針）
- Skill の `docs/ERROR-HANDLING.md` と `SKILL.md` に、基本通達の検索が 0 件のときの振る舞いが書かれていない

基本通達の検索を #23 の対象から外したのが意図どおりなら、Skill 側に「`nta_search_tsutatsu` の 0 件は `message` を読む」と書くだけで済みます。

### 候補 3: `docs/ERROR-CODES.md` の「正本に載っているが返さない code」の節の版が古い（houki-research-skill）

> 表の版（houki-egov-mcp v0.19.0・houki-nta-mcp v0.24.0）では、該当する code はありません。

`scripts/mcp-refs.config.json` の基準は egov 0.20.0 / nta 0.27.0 です。`check-mcp-refs.mjs` は code の有無を見るので、この文の版の数字は検査に掛かりません。

### 候補 4: `nta_get_tax_answer` の `DOC_NOT_FOUND` に `url` と `tool` が最上位に重複して入る（houki-nta-mcp）

再現: `nta_get_tax_answer { "no": "9999" }`

応答に `detail.url` と最上位の `url` が同じ値で入り、`tool` も最上位にあります。egov の `INVALID_ARGUMENT` も最上位に `tool` を置いているので、`tool` は family の形かもしれません。`url` の重複は `common_errors/spec.md` のどちらに合わせるかを決める対象です。

### 候補 5: `get_toc` の `truncated: true` が、depth で打ち切ったのか大きさで打ち切ったのかを区別しない（houki-egov-mcp）

再現: `get_toc { "law_name": "民法", "depth": 2, "suppl": "none" }`

`node_count: 44`、`truncated: true` が返ります。depth を指定したので階層を打ち切ったのは分かりますが、`get_law_range` の `truncated`（文字数の上限）と同じ名前なので、読み手が理由を取り違えます。

## 今回確かめていないこと

- 実行中の MCP の版（各リポジトリの接続か `--status` の実行が要る）
- `nta_search_bunshokaitou` / `nta_search_jimu_unei` と、それらの `nta_get_*`
- `get_attachment` の `save: true`、`FILE_TOO_LARGE`
- `SOURCE_*`（取得元との通信の失敗）。再現できる手段が無い
- `examples/error-recovery-patterns.md` の各パターン
- Skill を Claude に読み込ませた状態での鉄則 1（業法判定）の振る舞い。今回はツールだけを呼んだ
