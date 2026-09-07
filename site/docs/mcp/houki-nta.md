---
title: houki-nta-mcp
description: 国税庁サイトの基本通達・改正通達・事務運営指針・文書回答事例・タックスアンサー・質疑応答事例を取得・全文検索する MCP サーバー
---

# houki-nta-mcp

国税庁（NTA）公式サイトの **基本通達・改正通達・事務運営指針・文書回答事例・タックスアンサー・質疑応答事例** を
ローカル SQLite に取り込み、FTS5 で全文検索する MCP サーバーです。
法律本文（法・政令・省令）は [houki-egov-mcp](/mcp/houki-egov) が担当します。

- npm: [`@shuji-bonji/houki-nta-mcp`](https://www.npmjs.com/package/@shuji-bonji/houki-nta-mcp)（0.10.2）
- リポジトリ: [shuji-bonji/houki-nta-mcp](https://github.com/shuji-bonji/houki-nta-mcp)
- 動作環境: Node.js 22 以上

## 扱うコンテンツ

| コンテンツ | 内容 | `legal_status` |
| --- | --- | --- |
| 基本通達 4 種 | 消費税法基本通達・所得税基本通達・法人税基本通達・相続税法基本通達 | 税務職員を拘束する行政内部の解釈指針。国民・裁判所は拘束しない |
| 改正通達 | 各年の改正通達と添付 PDF（新旧対照表など） | 同上 |
| 事務運営指針 | 税務執行の運営方針 | 同上 |
| 文書回答事例 | 事前照会に対する国税局の回答 | 照会者以外は拘束しない参考情報 |
| タックスアンサー | 一般向けの税務 Q&A | 参考情報 |
| 質疑応答事例 | 国税庁が公表する解釈事例 | 参考情報 |

すべての応答に `legal_status` が付きます。通達に書いてあることを「法律で決まっている」と言い換えないためです。

## ツール

| ツール | 用途 |
| --- | --- |
| `nta_get_tsutatsu` / `nta_search_tsutatsu` | 基本通達の本文取得と全文検索 |
| `nta_get_kaisei_tsutatsu` / `nta_search_kaisei_tsutatsu` | 改正通達の取得と検索。添付 PDF は種別（新旧対照表・別紙・Q&A など）に分類して表で返します |
| `nta_get_jimu_unei` / `nta_search_jimu_unei` | 事務運営指針の取得と検索 |
| `nta_get_bunshokaitou` / `nta_search_bunshokaitou` | 文書回答事例の取得と検索 |
| `nta_get_tax_answer` / `nta_search_tax_answer` | タックスアンサーの取得と検索 |
| `nta_get_qa` / `nta_search_qa` | 質疑応答事例の取得と検索 |
| `nta_inspect_pdf_meta` | 文書に添付された PDF のメタ情報と、pdf-reader-mcp での読み方の例だけを返します |
| `resolve_abbreviation` | 略称の解決を診断します |

検索ツールは `hasPdf` で PDF 付きの文書だけに絞れ、応答に `freshness`（取り込みからの経過）が付きます。

## ローカル DB の作り方

```sh
npx -y @shuji-bonji/houki-nta-mcp --bulk-download-everything
```

DB は `~/.cache/houki-nta-mcp/cache.db` にできます。DB がないときも、各ツールは国税庁サイトから直接取得して応答します（1 件あたり 1 秒弱）。
2 回目以降は国税庁サイトが `304 Not Modified` を返す節を飛ばすので短時間で終わります。
節の本文を解析し直したいとき（v0.10.0 以前の DB に算式画像のプレースホルダを入れる場合など）は `--refresh` を付けます。

## 国税庁サイトの変更への備え

国税庁サイトは URL の世代が変わることがあります（`sozoku` → `sozoku2`、`hyoka` → `hyoka_new` など）。
`--health-check` で取得先が生きているかを確かめ、`--check-baseline-drift` で `menu.htm` を正典に世代移行を事前に検知します。
存在しないページが 404 ではなく `/error/404.htm` に着地する場合も、本文として取り込まずに失敗として扱います。

## PDF Agent Stack との組み合わせ

改正通達の新旧対照表は PDF で提供されます。`nta_inspect_pdf_meta` は、その PDF を
[pdf-reader-mcp](https://shuji-bonji.github.io/pdf-agent-stack/ja/mcp/pdf-reader) の `extract_tables` で表構造を保ったまま読むための呼び出し例を返します。

利用範囲と通達の法的な位置づけは[免責事項と利用範囲](/guide/disclaimer)と、リポジトリの [DISCLAIMER.md](https://github.com/shuji-bonji/houki-nta-mcp/blob/main/DISCLAIMER.md) を参照してください。

houki-nta-mcp は family の中で最も長く開発しており、他の MCP サーバーの参照実装になっています
（正規化を取り込み時と検索時の両方で通す、`freshness` と `legal_status` を必ず付ける、取得先の変更を検知する、など）。
