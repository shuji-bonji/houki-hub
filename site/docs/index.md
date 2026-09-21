---
layout: home
description: 日本の法令・通達・行政解釈を LLM から引くための MCP サーバー・ライブラリ・Skill 群。「法律で決まっている」と「通達でそうなっている」を混ぜずに、出典と鮮度を添えて返す

hero:
  name: houki-hub
  text: LLM が日本の法令・通達を、出典と鮮度を添えて条文の単位で引く
  tagline: 法律・政令・省令は e-Gov 法令 API から全分野を、通達・Q&A は国税庁分を。「法律で決まっている」と「通達でそうなっている」を混ぜずに、出典と鮮度を添えて返す MCP サーバー群と、それらを横断する Skill
  actions:
    - theme: brand
      text: はじめる
      link: /guide/getting-started
    - theme: alt
      text: houki-hub とは
      link: /guide/overview
    - theme: alt
      text: 現状と予定（対応範囲）
      link: /guide/roadmap

features:
  - title: houki-egov-mcp（法令）
    details: e-Gov 法令 API v2 から法律・政令・省令の本文・目次・改正履歴を取得します。ローカルに取り込めば条文本文の全文検索もできます。11 ツール。
    link: /mcp/houki-egov
  - title: houki-nta-mcp（国税庁）
    details: 法令解釈通達・質疑応答事例・タックスアンサー・文書回答事例・事務運営指針・改正通達を検索・取得します。応答には legal_status を付け、通達が国民を拘束しないことを明示します。14 ツール。
    link: /mcp/houki-nta
  - title: houki-abbreviations（共有辞書）
    details: 「消基通」「法人税法」などの略称を正式名称と法令 ID に解決する辞書（174 エントリ・6 分野）。全角ゆらぎの正規化と鮮度判定も提供します。
    link: /lib/houki-abbreviations
  - title: houki-research Skill（手順）
    details: 複数の MCP をどの順に呼び、出典をどう書き、業法の独占業務にどこで注意するかを定めた Skill。family 共通のエラー契約の正典でもあります。
    link: /skills/houki-research
---

## いま扱える範囲

| 資料の種類                          | 対応範囲（2026-09-07 時点）                                                                           | 担当           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------- |
| 法律・政令・省令・規則              | **全分野**（e-Gov 法令 API v2 に載っているもの）                                                      | houki-egov-mcp |
| 通達・Q&A・行政解釈                 | **国税庁のみ**（基本通達 4 種・改正通達・事務運営指針・文書回答事例・タックスアンサー・質疑応答事例） | houki-nta-mcp  |
| 厚生労働省の通達・通知              | 未対応（houki-mhlw-mcp を予定）                                                                       | —              |
| 法令メタデータ（公布→施行の時系列） | 未対応（houki-metadata-mcp を予定）                                                                   | —              |
| 裁決・判例                          | 未対応（構想段階）                                                                                    | —              |

通達・Q&A が国税庁だけなのは、最初に税務から着手したためです。他省庁の通達は同じ型の MCP サーバーを 1 つずつ足していきます。
→ [現状と予定](/guide/roadmap)

## クイックスタート

```jsonc
// Claude Desktop / Claude Code の設定に追加
{
  "mcpServers": {
    "houki-egov": {
      "command": "npx",
      "args": ["-y", "@shuji-bonji/houki-egov-mcp@latest"],
    },
  },
}
```

まずは houki-egov-mcp だけで条文を引いてみて、税務の通達が必要になったら houki-nta-mcp を足してください。
→ [導入手順](/guide/getting-started)

## 3 つの場面

同じ MCP と Skill を、問いの形に応じて使います。どの場面でも、返るのは条文・通達・出典・鮮度で、個別の事案への結論は返しません。

| 問いの形 | 例 | 主に使うもの |
| --- | --- | --- |
| **この仕様は法令のどこに触れるか** | 「領収書を PDF で保存する機能を作る。電子帳簿保存法の要件は」 | houki-egov-mcp の `search_fulltext` → `get_law`。houki-research が施行規則まで辿る |
| この取扱いの根拠と、今も有効か | 「インボイスの端数処理は、法律か通達か。その通達は今も生きているか」 | houki-nta-mcp の `nta_search_tsutatsu` → `next_actions` で houki-egov-mcp の `get_law` へ。`legal_status` と `index_status` |
| この改正はいつから、何が変わるか | 「消費税法第 30 条は次にいつ変わるか」 | houki-egov-mcp の `get_law_revisions` |

::: warning 位置づけ
このサイトと各ツールが返す内容は、法令・通達の**参照と一般的な解釈の出発点**です。
個別の事案に法令を当てはめて結論を出すこと（他人のために業として行うと弁護士法 72 条・税理士法 52 条・社労士法 27 条の対象になります）は想定していません。
:::
