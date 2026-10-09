---
title: "houki-abbreviations の仕様"
description: "houki-abbreviations の全 23 機能の仕様の一覧（specs/current から自動生成）"
---

# houki-abbreviations の仕様

<!-- GENERATED FILE — 手で編集しない。houki-abbreviations の specs/current/ から生成。 -->

::: info
houki-abbreviations **v0.7.0** の `specs/current/` から自動生成しました（23 機能・仕様 ID 259 件・2026-10-09）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

houki-abbreviations が何をするかを、機能ごとに 1 ページで説明します。全体の使い方は[解説](/lib/houki-abbreviations)に、引数の一覧は[リファレンス](/reference/lib/houki-abbreviations)にあります。

試作のため、ページがあるのは 1 機能だけです。ほかの機能は一覧にだけ載せています。

## 関数

パッケージを import して呼ぶ関数です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `computeDaysSince` | 取得時刻から今までの経過日数を返す | 10 |
| `extractLawNames` | テキストの中から辞書にある法令名・略称・別名を位置付きで抜き出す | 19 |
| `findSimilar` | 編集距離が近い名前を持つエントリを探す | 22 |
| `getAbbreviationStats` | 辞書の件数を分野別・種別別・MCP 別に数えて返す | 6 |
| `getAllNames` | 略称・正式名称・別名のどれかから、そのエントリの名前をすべて返す | 10 |
| `isValidLawId` | 文字列が e-Gov の law_id の形をしているかを判定する | 15 |
| `judgeStaleness` | 経過日数から鮮度の段階を返す | 6 |
| `kanjiToNumber` | 漢数字だけの文字列を数値にする | 9 |
| `levenshtein` | 2 つの文字列の編集距離を返す | 5 |
| `listByCategory` | 指定した種別のエントリをすべて返す | 7 |
| `listByDomain` | 指定した分野のエントリをすべて返す | 5 |
| `listBySourceMcpHint` | 指定した MCP が本文を持つエントリをすべて返す | 5 |
| `lookupByLawId` | e-Gov の法令 ID から辞書のエントリを 1 件引く | 7 |
| `lookupByLawNum` | 法令番号から辞書のエントリを 1 件引く | 9 |
| `normalizeJpText` | 全角の数字・英字・一部の記号を半角に揃える | 13 |
| `normalizeLawNum` | 法令番号の数字の書き方を算用数字に揃える | 16 |
| `normalizeSearchQuery` | 検索語を半角・小文字・単一の空白に揃える | 8 |
| [`resolveAbbreviation`](/specs/houki-abbreviations/resolve_abbreviation) | 略称・正式名称・別名から辞書のエントリを 1 件引く | 13 |
| `searchByName` | 辞書のエントリを名前の部分一致で探す | 20 |
| `suggestCorrection` | 誤った名前に近いエントリの正式名称を並べて返す | 9 |
| `validateAllEntries` | 同梱の辞書全件の整合性を検査し、エラーと警告の一覧を返す | 17 |

## 値

パッケージが公開している値です。

| 機能 | 内容 | 仕様 ID |
|---|---|---|
| `abbreviationEntries` | 全分野の略称辞書のエントリを 1 つの配列で渡す | 19 |
| `公開定数` | CATEGORIES / DOMAINS / LAW_TYPE_CODES / SOURCE_MCP_HINTS / STALENESS_THRESHOLDS | 9 |
