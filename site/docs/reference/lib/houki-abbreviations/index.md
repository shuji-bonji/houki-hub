---
title: "houki-abbreviations — API リファレンス"
description: "houki-abbreviations v0.7.1 の公開 API（関数 21 個・定数 6 個・インターフェース 13 個・型 6 個）の一覧・追加された版・family での使用状況（dist/index.d.ts から自動生成）"
---

# houki-abbreviations — API リファレンス

<!-- GENERATED FILE — 手で編集しない。一覧は dist/index.d.ts、使用状況は mcp/*/src の import から。 -->

::: info
**v0.7.1** の `dist/index.d.ts` から自動生成しました（関数 21 個・定数 6 個・インターフェース 13 個・型 6 個・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

**このページは自動生成の API リファレンスの入り口です。** 関数と値は 1 つずつページがあり、シグネチャ・説明・例をパッケージの型定義（`dist/index.d.ts`）から、利用者と得られる結果・扱わないこと・処理の流れを各機能の仕様書（`specs/current/`）から写しています。辞書の中身や設計の方針は[解説ページ](/lib/houki-abbreviations)にあります。

houki-hub family の MCP サーバーが共有するために公開しているパッケージです。**0.x の間は minor で破壊的変更が入ることがあります**。安定した互換性が要るときは版を固定してください。

公開しているのは関数 21 個・定数 6 個・インターフェース 13 個・型 6 個です。そのうち houki-egov-mcp と houki-nta-mcp が実際に import しているのは **17 個**で、残りは公開しているだけです（テストコードの import は数えていません）。一覧は下に用途ごとにまとめてあり、記号の名前から、その記号のページ（型とインターフェースは型のページの見出し）を開けます。

## 読み込み方

```ts
import { resolveAbbreviation } from '@shuji-bonji/houki-abbreviations';
```

入口は `.` の 1 つだけで、深いパスは公開していません。ESM 専用です（`package.json` の `"type": "module"`）。CommonJS の `require` では読めません。Node.js は `>=20.0.0` が要ります。実行時の依存パッケージはありません。

## 辞書の解決

利用者や LLM が書く「消法」「個情法」のような略称を、e-Gov の API を引ける正式名称と `law_id` に直すための関数です。分野・種別・管轄 MCP でエントリを絞り込むものもここに置いています。

| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |
|---|---|---|---|---|---|
| [`getAbbreviationStats`](/reference/lib/houki-abbreviations/get_abbreviation_stats) | 関数 | 辞書全体の統計を返す。 | [仕様](/specs/houki-abbreviations/get_abbreviation_stats) | v0.1.0 | 未使用 |
| [`listByCategory`](/reference/lib/houki-abbreviations/list_by_category) | 関数 | 指定カテゴリのエントリ一覧を返す。 | [仕様](/specs/houki-abbreviations/list_by_category) | v0.1.0 | 未使用 |
| [`listByDomain`](/reference/lib/houki-abbreviations/list_by_domain) | 関数 | 指定ドメインのエントリ一覧を返す。 | [仕様](/specs/houki-abbreviations/list_by_domain) | v0.1.0 | 未使用 |
| [`listBySourceMcpHint`](/reference/lib/houki-abbreviations/list_by_source_mcp_hint) | 関数 | 指定 MCP が管轄するエントリ一覧を返す。 | [仕様](/specs/houki-abbreviations/list_by_source_mcp_hint) | v0.1.0 | `houki-egov-mcp` |
| [`resolveAbbreviation`](/reference/lib/houki-abbreviations/resolve_abbreviation) | 関数 | 略称・通称・正式名称のいずれかから辞書エントリを引く。 | [仕様](/specs/houki-abbreviations/resolve_abbreviation) | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`abbreviationEntries`](/reference/lib/houki-abbreviations/abbreviation_entries) | 定数 | 全分野を結合した辞書 | [仕様](/specs/houki-abbreviations/abbreviation_entries) | v0.1.0 | 未使用 |
| [`AbbreviationStats`](/reference/lib/houki-abbreviations/types#abbreviationstats) | インターフェース | `getAbbreviationStats` が返す辞書統計。 | — | v0.1.0 | 未使用 |
| [`ResolveAbbreviationOptions`](/reference/lib/houki-abbreviations/types#resolveabbreviationoptions) | インターフェース | `resolveAbbreviation` に渡せるオプション。 | — | v0.3.0 | 未使用 |

## 表記の正規化

全角の数字・記号・空白を半角に揃えます。DB に取り込むときと検索するときに同じ関数を通すことで、片方だけ揃わずにヒットしなくなるのを防ぎます。

| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |
|---|---|---|---|---|---|
| [`kanjiToNumber`](/reference/lib/houki-abbreviations/kanji_to_number) | 関数 | 漢数字を数値にする。 | [仕様](/specs/houki-abbreviations/kanji_to_number) | v0.6.0 | 未使用 |
| [`normalizeJpText`](/reference/lib/houki-abbreviations/normalize_jp_text) | 関数 | 日本語テキストの全角ゆらぎを保守的に半角化する。 | [仕様](/specs/houki-abbreviations/normalize_jp_text) | v0.3.0 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`normalizeLawNum`](/reference/lib/houki-abbreviations/normalize_law_num) | 関数 | 法令番号の表記を、照合に使える 1 つの形に揃える。 | [仕様](/specs/houki-abbreviations/normalize_law_num) | v0.6.0 | 未使用 |
| [`normalizeSearchQuery`](/reference/lib/houki-abbreviations/normalize_search_query) | 関数 | 検索クエリ向けの積極的な正規化。 | [仕様](/specs/houki-abbreviations/normalize_search_query) | v0.3.0 | `houki-egov-mcp`<br>`houki-nta-mcp` |

## 検索とあいまい一致

辞書に無い言い方や打ち間違いで 0 件になったときに、近い候補を返すための関数です。部分一致で候補を並べるものと、編集距離で打ち間違いを拾うものがあります。

| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |
|---|---|---|---|---|---|
| [`findSimilar`](/reference/lib/houki-abbreviations/find_similar) | 関数 | あいまい一致 (Levenshtein 距離ベース)。 | [仕様](/specs/houki-abbreviations/find_similar) | v0.4.0 | 未使用 |
| [`levenshtein`](/reference/lib/houki-abbreviations/levenshtein) | 関数 | Levenshtein 距離 (動的計画法、O(m*n) 時間 / O(min(m,n)) 空間)。 | [仕様](/specs/houki-abbreviations/levenshtein) | v0.4.0 | 未使用 |
| [`searchByName`](/reference/lib/houki-abbreviations/search_by_name) | 関数 | 名前で検索 (部分一致)。 | [仕様](/specs/houki-abbreviations/search_by_name) | v0.4.0 | 未使用 |
| [`suggestCorrection`](/reference/lib/houki-abbreviations/suggest_correction) | 関数 | 「もしかして」サジェスト。 | [仕様](/specs/houki-abbreviations/suggest_correction) | v0.4.0 | 未使用 |
| [`FuzzyMatch`](/reference/lib/houki-abbreviations/types#fuzzymatch) | インターフェース | `findSimilar` が返す 1 件。 | — | v0.4.0 | 未使用 |
| [`FuzzyOptions`](/reference/lib/houki-abbreviations/types#fuzzyoptions) | インターフェース | findSimilar のオプション | — | v0.4.0 | 未使用 |
| [`SearchFilter`](/reference/lib/houki-abbreviations/types#searchfilter) | インターフェース | filter 構造。 | — | v0.4.0 | 未使用 |
| [`SearchOptions`](/reference/lib/houki-abbreviations/types#searchoptions) | インターフェース | searchByName のオプション | — | v0.4.0 | 未使用 |
| [`SearchMode`](/reference/lib/houki-abbreviations/types#searchmode) | 型 | 部分一致モード | — | v0.4.0 | 未使用 |

## 逆引き

名前ではなく e-Gov の `law_id` や法令番号からエントリを引きます。検索結果に付いてきた ID を、人が読める名前に戻すときに使います。

| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |
|---|---|---|---|---|---|
| [`getAllNames`](/reference/lib/houki-abbreviations/get_all_names) | 関数 | `abbr` / `formal` / `aliases` のいずれかから、そのエントリの **全別表記** を文字列配列で返す。 | [仕様](/specs/houki-abbreviations/get_all_names) | v0.5.0 | 未使用 |
| [`lookupByLawId`](/reference/lib/houki-abbreviations/lookup_by_law_id) | 関数 | e-Gov `law_id` から辞書エントリを引く。 | [仕様](/specs/houki-abbreviations/lookup_by_law_id) | v0.5.0 | 未使用 |
| [`lookupByLawNum`](/reference/lib/houki-abbreviations/lookup_by_law_num) | 関数 | 法令番号から辞書エントリを引く。 | [仕様](/specs/houki-abbreviations/lookup_by_law_num) | v0.5.0 | 未使用 |
| [`GetAllNamesOptions`](/reference/lib/houki-abbreviations/types#getallnamesoptions) | インターフェース | `getAllNames` に渡せるオプション。 | — | v0.7.0 | 未使用 |
| [`LookupByLawIdOptions`](/reference/lib/houki-abbreviations/types#lookupbylawidoptions) | インターフェース | `lookupByLawId` に渡せるオプション。 | — | v0.7.0 | 未使用 |

## 鮮度の判定

取得日時からの経過日数を `fresh` / `stale` / `outdated` に分類します。しきい値を family 全体で共有し、どの MCP でも同じ基準で古さを判定するためのものです。

| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |
|---|---|---|---|---|---|
| [`computeDaysSince`](/reference/lib/houki-abbreviations/compute_days_since) | 関数 | `fetched_at` (ISO 8601) と現在時刻から経過日数を計算する純関数。 | [仕様](/specs/houki-abbreviations/compute_days_since) | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`judgeStaleness`](/reference/lib/houki-abbreviations/judge_staleness) | 関数 | 経過日数から staleness レベルを判定する純関数。 | [仕様](/specs/houki-abbreviations/judge_staleness) | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`STALENESS_THRESHOLDS`](/reference/lib/houki-abbreviations/public_constants#staleness-thresholds) | 定数 | family 共通の閾値定数 (日数)。 | [仕様](/specs/houki-abbreviations/public_constants) | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`StalenessLevel`](/reference/lib/houki-abbreviations/types#stalenesslevel) | 型 | staleness の判定レベル。 | — | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` |

## 検証

`law_id` の形式や、エントリの重複・欠損を検査します。文章の中に法令名が含まれているかを調べる `extractLawNames` もここに入れています。

| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |
|---|---|---|---|---|---|
| [`extractLawNames`](/reference/lib/houki-abbreviations/extract_law_names) | 関数 | 入力テキスト中の **法令名らしき文字列** を辞書マッチで抽出する。 | [仕様](/specs/houki-abbreviations/extract_law_names) | v0.5.0 | 未使用 |
| [`isValidLawId`](/reference/lib/houki-abbreviations/is_valid_law_id) | 関数 | e-Gov の `law_id` 形式が妥当かを判定する純粋関数。 | [仕様](/specs/houki-abbreviations/is_valid_law_id) | v0.5.0 | 未使用 |
| [`validateAllEntries`](/reference/lib/houki-abbreviations/validate_all_entries) | 関数 | 辞書全体の静的整合性をチェックする。 | [仕様](/specs/houki-abbreviations/validate_all_entries) | v0.5.0 | 未使用 |
| [`ExtractOptions`](/reference/lib/houki-abbreviations/types#extractoptions) | インターフェース | `extractLawNames` のオプション。 | — | v0.5.0 | 未使用 |
| [`LawNameMatch`](/reference/lib/houki-abbreviations/types#lawnamematch) | インターフェース | テキスト中の法令名抽出結果。 | — | v0.5.0 | 未使用 |
| [`ValidationIssue`](/reference/lib/houki-abbreviations/types#validationissue) | インターフェース | 静的整合性チェックの error / warning 共通型。 | — | v0.5.0 | 未使用 |
| [`ValidationReport`](/reference/lib/houki-abbreviations/types#validationreport) | インターフェース | 辞書全体の検証レポート。 | — | v0.5.0 | 未使用 |

## エントリの構造と取りうる値

辞書 1 件の形と、分野・種別・管轄 MCP が取りうる値です。上の関数の引数と戻り値は、すべてこれらで書かれています。

| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |
|---|---|---|---|---|---|
| [`CATEGORIES`](/reference/lib/houki-abbreviations/public_constants#categories) | 定数 | 法令カテゴリ — どの種類のテキスト（法律本体・通達・判例など）を指すか。 | [仕様](/specs/houki-abbreviations/public_constants) | v0.1.0 | `houki-nta-mcp` |
| [`DOMAINS`](/reference/lib/houki-abbreviations/public_constants#domains) | 定数 | ドメインタグ（実務分野での分類） | [仕様](/specs/houki-abbreviations/public_constants) | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`LAW_TYPE_CODES`](/reference/lib/houki-abbreviations/public_constants#law-type-codes) | 定数 | e-Gov law_id の種別プレフィックス | [仕様](/specs/houki-abbreviations/public_constants) | v0.1.0 | `houki-egov-mcp` |
| [`SOURCE_MCP_HINTS`](/reference/lib/houki-abbreviations/public_constants#source-mcp-hints) | 定数 | 参照すべき MCP のヒント。 | [仕様](/specs/houki-abbreviations/public_constants) | v0.1.0 | `houki-nta-mcp` |
| [`AbbreviationEntry`](/reference/lib/houki-abbreviations/types#abbreviationentry) | インターフェース | 略称辞書エントリ | — | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`Category`](/reference/lib/houki-abbreviations/types#category) | 型 | `CATEGORIES` の要素型。 | — | v0.1.0 | `houki-nta-mcp` |
| [`Domain`](/reference/lib/houki-abbreviations/types#domain) | 型 | `DOMAINS` の要素型。 | — | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` |
| [`LawTypeCode`](/reference/lib/houki-abbreviations/types#lawtypecode) | 型 | `LAW_TYPE_CODES` のキー。 | — | v0.1.0 | `houki-egov-mcp` |
| [`SourceMcpHint`](/reference/lib/houki-abbreviations/types#sourcemcphint) | 型 | `SOURCE_MCP_HINTS` の要素型。 | — | v0.1.0 | `houki-nta-mcp` |
