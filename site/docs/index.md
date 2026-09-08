---
layout: home
description: 日本の法令・通達・行政解釈を、出典付きで LLM から引くための MCP サーバー・ライブラリ・Skill 群

hero:
  name: houki-hub
  text: 法規を正確に引く AI エージェントの土台
  tagline: 法律・政令・省令は e-Gov 法令 API から全分野を、通達・Q&A は現時点では国税庁分を。略称を解決し、鮮度と法的な位置づけを添えて返す MCP サーバー群と、それらを横断する Skill
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
    details: e-Gov 法令 API v2 から法律・政令・省令の本文・目次・改正履歴を取得します。ローカルに取り込めば条文本文の全文検索もできます。7 ツール。
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

::: warning 位置づけ
このサイトと各ツールが返す内容は、法令・通達の**参照と一般的な解釈の出発点**です。
個別の事案に法令を当てはめて結論を出すこと（他人のために業として行うと弁護士法 72 条・税理士法 52 条・社労士法 27 条の対象になります）は想定していません。
:::
