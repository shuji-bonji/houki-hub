---
title: "houki-abbreviations — API リファレンス"
description: "houki-abbreviations v0.5.1 の公開 API（関数 19 個・定数 6 個・インターフェース 11 個・型 6 個）のシグネチャ・追加された版・family での使用状況（dist/index.d.ts から自動生成）"
---

# houki-abbreviations — API リファレンス

<!-- GENERATED FILE — 手で編集しない。シグネチャと説明は dist/index.d.ts、使用状況は mcp/*/src の import から。 -->

::: info
**v0.5.1** の `dist/index.d.ts` から自動生成しました（関数 19 個・定数 6 個・インターフェース 11 個・型 6 個・2026-09-12）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

**このページは自動生成の API リファレンスです。** 公開されている記号の名前・シグネチャ・説明・例を、パッケージの型定義（`dist/index.d.ts`）から写しています（正典は型定義です）。辞書の中身や設計上の約束は[解説ページ](/lib/houki-abbreviations)にあります。

houki-hub family の MCP サーバーが共有するために公開しているパッケージです。**0.x の間は minor で破壊的変更が入ることがあります**。安定した互換性が要るときは版を固定してください。

公開しているのは関数 19 個・定数 6 個・インターフェース 11 個・型 6 個です。そのうち houki-egov-mcp と houki-nta-mcp が実際に import しているのは **16 個**で、残りは公開しているだけです（テストコードの import は数えていません）。各記号の説明と例は、一覧の下に用途ごとにまとめてあります。

## 読み込み方

```ts
import { resolveAbbreviation } from '@shuji-bonji/houki-abbreviations';
```

入口は `.` の 1 つだけで、深いパスは公開していません。ESM 専用です（`package.json` の `"type": "module"`）。CommonJS の `require` では読めません。Node.js は `>=20.0.0` が要ります。実行時の依存パッケージはありません。

## 関数

| 記号 | 追加された版 | family での使用 | 概要 |
|---|---|---|---|
| [`computeDaysSince`](#computedayssince) | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` | `fetched_at` (ISO 8601) と現在時刻から経過日数を計算する純関数。 |
| [`extractLawNames`](#extractlawnames) | v0.5.0 | 未使用 | 入力テキスト中の **法令名らしき文字列** を辞書マッチで抽出する。 |
| [`findSimilar`](#findsimilar) | v0.4.0 | 未使用 | あいまい一致 (Levenshtein 距離ベース)。 |
| [`getAbbreviationStats`](#getabbreviationstats) | v0.1.0 | 未使用 | 辞書全体の統計を返す。 |
| [`getAllNames`](#getallnames) | v0.5.0 | 未使用 | `abbr` / `formal` / `aliases` のいずれかから、そのエントリの **全別表記** を文字列配列で返す。 |
| [`isValidLawId`](#isvalidlawid) | v0.5.0 | 未使用 | e-Gov の `law_id` 形式が妥当かを判定する純粋関数。 |
| [`judgeStaleness`](#judgestaleness) | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` | 経過日数から staleness レベルを判定する純関数。 |
| [`levenshtein`](#levenshtein) | v0.4.0 | 未使用 | Levenshtein 距離 (動的計画法、O(m*n) 時間 / O(min(m,n)) 空間)。 |
| [`listByCategory`](#listbycategory) | v0.1.0 | 未使用 | 指定カテゴリのエントリ一覧を返す。 |
| [`listByDomain`](#listbydomain) | v0.1.0 | 未使用 | 指定ドメインのエントリ一覧を返す。 |
| [`listBySourceMcpHint`](#listbysourcemcphint) | v0.1.0 | 未使用 | 指定 MCP が管轄するエントリ一覧を返す。 |
| [`lookupByLawId`](#lookupbylawid) | v0.5.0 | 未使用 | e-Gov `law_id` から辞書エントリを引く。 |
| [`lookupByLawNum`](#lookupbylawnum) | v0.5.0 | 未使用 | 法令番号（漢数字表記）から辞書エントリを引く。 |
| [`normalizeJpText`](#normalizejptext) | v0.3.0 | `houki-egov-mcp`<br>`houki-nta-mcp` | 日本語テキストの全角ゆらぎを保守的に半角化する。 |
| [`normalizeSearchQuery`](#normalizesearchquery) | v0.3.0 | `houki-egov-mcp`<br>`houki-nta-mcp` | 検索クエリ向けの積極的な正規化。 |
| [`resolveAbbreviation`](#resolveabbreviation) | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` | 略称・通称・正式名称のいずれかから辞書エントリを引く。 |
| [`searchByName`](#searchbyname) | v0.4.0 | 未使用 | 名前で検索 (部分一致)。 |
| [`suggestCorrection`](#suggestcorrection) | v0.4.0 | 未使用 | 「もしかして」サジェスト。 |
| [`validateAllEntries`](#validateallentries) | v0.5.0 | 未使用 | 辞書全体の静的整合性をチェックする。 |

## 定数

| 記号 | 追加された版 | family での使用 | 概要 |
|---|---|---|---|
| [`abbreviationEntries`](#abbreviationentries) | v0.1.0 | 未使用 | 全分野を結合した辞書 |
| [`CATEGORIES`](#categories) | v0.1.0 | `houki-nta-mcp` | 法令カテゴリ — どの種類のテキスト（法律本体・通達・判例など）を指すか。 |
| [`DOMAINS`](#domains) | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` | ドメインタグ（実務分野での分類） |
| [`LAW_TYPE_CODES`](#law-type-codes) | v0.1.0 | `houki-egov-mcp` | e-Gov law_id の種別プレフィックス |
| [`SOURCE_MCP_HINTS`](#source-mcp-hints) | v0.1.0 | `houki-nta-mcp` | 参照すべき MCP のヒント。 |
| [`STALENESS_THRESHOLDS`](#staleness-thresholds) | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` | family 共通の閾値定数 (日数)。 |

## インターフェース

| 記号 | 追加された版 | family での使用 | 概要 |
|---|---|---|---|
| [`AbbreviationEntry`](#abbreviationentry) | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` | 略称辞書エントリ |
| [`AbbreviationStats`](#abbreviationstats) | v0.1.0 | 未使用 | `getAbbreviationStats` が返す辞書統計。 |
| [`ExtractOptions`](#extractoptions) | v0.5.0 | 未使用 | `extractLawNames` のオプション。 |
| [`FuzzyMatch`](#fuzzymatch) | v0.4.0 | 未使用 | `findSimilar` が返す 1 件。 |
| [`FuzzyOptions`](#fuzzyoptions) | v0.4.0 | 未使用 | findSimilar のオプション |
| [`LawNameMatch`](#lawnamematch) | v0.5.0 | 未使用 | テキスト中の法令名抽出結果。 |
| [`ResolveAbbreviationOptions`](#resolveabbreviationoptions) | v0.3.0 | 未使用 | `resolveAbbreviation` に渡せるオプション。 |
| [`SearchFilter`](#searchfilter) | v0.4.0 | 未使用 | filter 構造。 |
| [`SearchOptions`](#searchoptions) | v0.4.0 | 未使用 | searchByName のオプション |
| [`ValidationIssue`](#validationissue) | v0.5.0 | 未使用 | 静的整合性チェックの error / warning 共通型。 |
| [`ValidationReport`](#validationreport) | v0.5.0 | 未使用 | 辞書全体の検証レポート。 |

## 型

| 記号 | 追加された版 | family での使用 | 概要 |
|---|---|---|---|
| [`Category`](#category) | v0.1.0 | `houki-nta-mcp` | `CATEGORIES` の要素型。 |
| [`Domain`](#domain) | v0.1.0 | `houki-egov-mcp`<br>`houki-nta-mcp` | `DOMAINS` の要素型。 |
| [`LawTypeCode`](#lawtypecode) | v0.1.0 | `houki-egov-mcp` | `LAW_TYPE_CODES` のキー。 |
| [`SearchMode`](#searchmode) | v0.4.0 | 未使用 | 部分一致モード |
| [`SourceMcpHint`](#sourcemcphint) | v0.1.0 | `houki-nta-mcp` | `SOURCE_MCP_HINTS` の要素型。 |
| [`StalenessLevel`](#stalenesslevel) | v0.4.1 | `houki-egov-mcp`<br>`houki-nta-mcp` | staleness の判定レベル。 |

## 辞書の解決

利用者や LLM が書く「消法」「個情法」のような略称を、e-Gov の API を引ける正式名称と `law_id` に直すための関数です。分野・種別・管轄 MCP でエントリを絞り込むものもここに置いています。

### abbreviationEntries

*定数 ・ v0.1.0 で追加 ・ family では未使用*

```ts
const abbreviationEntries: readonly AbbreviationEntry[];
```

全分野を結合した辞書

### AbbreviationStats

*インターフェース ・ v0.1.0 で追加 ・ family では未使用*

```ts
interface AbbreviationStats {
    total: number;
    byDomain: Record<string, number>;
    byCategory: Record<string, number>;
    bySourceMcpHint: Record<string, number>;
}
```

`getAbbreviationStats` が返す辞書統計。起動時ログ・診断用。

### getAbbreviationStats

*関数 ・ v0.1.0 で追加 ・ family では未使用*

```ts
function getAbbreviationStats(): AbbreviationStats;
```

辞書全体の統計を返す。

**戻り値**: 全件数、ドメイン別件数、カテゴリ別件数、管轄 MCP 別件数

### listByCategory

*関数 ・ v0.1.0 で追加 ・ family では未使用*

```ts
function listByCategory(category: Category): AbbreviationEntry[];
```

指定カテゴリのエントリ一覧を返す。

::: details 例
```ts
listByCategory('cabinet-order')  // → 政令系エントリ全件
listByCategory('constitution')   // → 日本国憲法 1件
```
:::

### listByDomain

*関数 ・ v0.1.0 で追加 ・ family では未使用*

```ts
function listByDomain(domain: Domain): AbbreviationEntry[];
```

指定ドメインのエントリ一覧を返す。

::: details 例
```ts
listByDomain('tax')  // → 35 件の税法系エントリ
```
:::

### listBySourceMcpHint

*関数 ・ v0.1.0 で追加 ・ family では未使用*

```ts
function listBySourceMcpHint(hint: SourceMcpHint): AbbreviationEntry[];
```

指定 MCP が管轄するエントリ一覧を返す。

各 MCP が起動時に「自分の管轄エントリだけ」を抽出してインデックス化する
ことで、管轄外の問い合わせを早期に「正しい MCP に誘導するエラー」として
返せるようになる。

::: details 例
```ts
listBySourceMcpHint('houki-egov')  // → e-Gov 管轄 165 件
listBySourceMcpHint('houki-nta')   // → 国税庁管轄 9 件
```
:::

### resolveAbbreviation

*関数 ・ v0.1.0 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
function resolveAbbreviation(name: string, options?: ResolveAbbreviationOptions): AbbreviationEntry | null;
```

略称・通称・正式名称のいずれかから辞書エントリを引く。

- 前後の空白はトリム
- 完全一致のみ（部分一致はしない）
- 見つからなければ null
- `options.normalize` が `true` のとき、全角／半角の表記ゆらぎを吸収する

| 引数 | 説明 |
|---|---|
| `name` | 略称・通称・正式名称のいずれか |
| `options` | 照合オプション（省略可） |

**戻り値**: 該当エントリ、見つからなければ null

::: details 例
```ts
resolveAbbreviation('消法')                         // → 消費税法
resolveAbbreviation('消費税法')                     // → 消費税法
resolveAbbreviation('消費税')                       // → 消費税法（aliases）
resolveAbbreviation('  消法  ')                    // → 消費税法（前後空白OK）
resolveAbbreviation('存在しない')                   // → null

// 正規化モード（v0.3.0〜）
resolveAbbreviation('消　法', { normalize: true }); // → 消費税法（全角スペース吸収）
resolveAbbreviation('ＰＬ法', { normalize: true }); // → 製造物責任法（全角→半角）
resolveAbbreviation('ＰＬ法');                       // → null（normalize: false がデフォルト）
```
:::

### ResolveAbbreviationOptions

*インターフェース ・ v0.3.0 で追加 ・ family では未使用*

```ts
interface ResolveAbbreviationOptions {
    /**
     * 全角／半角の表記ゆらぎを吸収して照合するかどうか。
     *
     * - `false`（デフォルト）: 入力を `.trim()` のみ施して完全一致照合。
     *   v0.2.0 までと同じ挙動で、後方互換性が保たれる。
     * - `true`: 入力を `normalizeJpText` で正規化したうえで、
     *   同様に正規化されたインデックスから照合する。
     *   全角ハイフン／チルダ／数字／全角 ASCII 文字／全角スペースの
     *   揺れを吸収する。**大文字小文字は保持する**ため、`PL法` と `pl法` は
     *   別物として扱われる。
     *
     * @default false
     */
    normalize?: boolean;
}
```

`resolveAbbreviation` に渡せるオプション。

## 表記の正規化

全角の数字・記号・空白を半角に揃えます。DB に取り込むときと検索するときに同じ関数を通すことで、片方だけ揃わずにヒットしなくなるのを防ぎます。

### normalizeJpText

*関数 ・ v0.3.0 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
function normalizeJpText(input: string): string;
```

日本語テキストの全角ゆらぎを保守的に半角化する。

数値表記・ASCII 文字・特定記号（ハイフン、チルダ、スペース）の全角／半角
表記揺れを吸収するための関数。**大文字小文字は保持する**ため、
「ＰＬ法」→「PL法」のように元の casing は変わらない。

漢字・ひらがな・カタカナ・中黒（・）・各種句読点は変更しない。

入力が空文字や `null`/`undefined` 相当（`!input`）の場合は空文字を返す。

| 引数 | 説明 |
|---|---|
| `input` | 正規化対象の文字列 |

**戻り値**: 半角化された文字列（前後の空白は trim 済み）

::: details 例
```ts
normalizeJpText('１８３－２');     // '183-2'
normalizeJpText('183～193共-1');  // '183~193共-1'（チルダのみ半角化）
normalizeJpText('ＰＬ法');         // 'PL法'（大文字保持）
normalizeJpText('  消法  ');      // '消法'（trim）
normalizeJpText('消　法');         // '消 法'（全角スペース → 半角）
```
:::

### normalizeSearchQuery

*関数 ・ v0.3.0 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
function normalizeSearchQuery(input: string): string;
```

検索クエリ向けの積極的な正規化。

`normalizeJpText` の処理に加えて以下を行う:
- ASCII 大文字 → 小文字（case folding）
- 連続する空白文字 → 単一の半角スペース

houki-nta-mcp の FTS5 検索のように、ユーザー入力の表記ゆれを最大限
吸収したいケース向け。実際の DB 検索では、本関数の出力に対して
さらに FTS5 用のエスケープ（`"`、`^` など）を別途行うこと。

注意: この関数は「`PL法`」と「`pl法`」を同一視するため、
`resolveAbbreviation({ normalize: true })` の内部処理では使用していない
（`PL法` のような大文字混じりエントリを正しく解決するため、
width-only の `normalizeJpText` のみを使用）。

| 引数 | 説明 |
|---|---|
| `input` | 検索クエリ |

**戻り値**: 正規化された検索クエリ

::: details 例
```ts
normalizeSearchQuery('ＰＬ法');         // 'pl法'
normalizeSearchQuery(' 消    法 ');    // '消 法'（連続空白を単一化）
normalizeSearchQuery('１８３－２');     // '183-2'
```
:::

## 検索とあいまい一致

辞書に無い言い方や打ち間違いで 0 件になったときに、近い候補を返すための関数です。部分一致で候補を並べるものと、編集距離で打ち間違いを拾うものがあります。

### findSimilar

*関数 ・ v0.4.0 で追加 ・ family では未使用*

```ts
function findSimilar(query: string, options?: _FuzzyOptions): _FuzzyMatch[];
```

あいまい一致 (Levenshtein 距離ベース)。「うろ覚え」入力で類似エントリを
探すときに使う。

::: details 例
```ts
import { findSimilar } from '@shuji-bonji/houki-abbreviations';

findSimilar('労働基準法施行例');
// → [{ entry: 労基法施行令, matchedKey: '労働基準法施行令', distance: 1 }]
```
:::

### FuzzyMatch

*インターフェース ・ v0.4.0 で追加 ・ family では未使用*

```ts
interface FuzzyMatch {
    /** マッチしたエントリ */
    entry: AbbreviationEntry;
    /** マッチしたキー (abbr / formal / aliases のいずれか、元の生文字列) */
    matchedKey: string;
    /** 編集距離 (小さいほど近い) */
    distance: number;
}
```

`findSimilar` が返す 1 件。マッチしたエントリと、どのキーに何文字差で
一致したかを持つ。

### FuzzyOptions

*インターフェース ・ v0.4.0 で追加 ・ family では未使用*

```ts
interface FuzzyOptions {
    /** 最大編集距離 (デフォルト 2) */
    maxDistance?: number;
    /** 結果の最大件数 (デフォルト 5) */
    limit?: number;
    /** スコア順 (距離昇順) にソート。default true */
    sortByScore?: boolean;
    /** filter は SearchOptions と同じ */
    filter?: SearchFilter;
    /** 全角/半角の表記ゆらぎを吸収 (デフォルト true) */
    normalize?: boolean;
}
```

findSimilar のオプション

### levenshtein

*関数 ・ v0.4.0 で追加 ・ family では未使用*

```ts
function levenshtein(a: string, b: string): number;
```

Levenshtein 距離 (動的計画法、O(m*n) 時間 / O(min(m,n)) 空間)。
文字単位の挿入 / 削除 / 置換コストはすべて 1。

自前実装にした理由は外部依存を増やさないため (本パッケージは
軽量データライブラリの方針なので、`fast-levenshtein` 等は引き込まない)。

### searchByName

*関数 ・ v0.4.0 で追加 ・ family では未使用*

```ts
function searchByName(query: string, options?: _SearchOptions): AbbreviationEntry[];
```

名前で検索 (部分一致)。`abbr` / `formal` / `aliases` のどれかにマッチする
エントリを返す。

::: details 例
```ts
import { searchByName } from '@shuji-bonji/houki-abbreviations';

searchByName('労働');
// → 労基法, 労契法, 労安衛法, ...

searchByName('税法', { mode: 'contains' });
// → 法人税法, 消費税法, 所得税法, ...

searchByName('労働', { filter: { domain: 'labor' }, limit: 10 });
```
:::

### SearchFilter

*インターフェース ・ v0.4.0 で追加 ・ family では未使用*

```ts
interface SearchFilter {
    domain?: Domain | Domain[];
    category?: Category | Category[];
    source_mcp_hint?: SourceMcpHint | SourceMcpHint[];
}
```

filter 構造。各キーは単一値・配列のどちらでも OK

### SearchMode

*型 ・ v0.4.0 で追加 ・ family では未使用*

```ts
type SearchMode = 'prefix' | 'contains' | 'suffix';
```

部分一致モード

### SearchOptions

*インターフェース ・ v0.4.0 で追加 ・ family では未使用*

```ts
interface SearchOptions {
    /** 検索モード (デフォルト 'contains') */
    mode?: SearchMode;
    /** 全角/半角の表記ゆらぎを吸収 (デフォルト true) */
    normalize?: boolean;
    /** 結果の最大件数 (デフォルト 50、上限 500) */
    limit?: number;
    /** 結果を絞り込むフィルター (各キーは単一値 or 配列) */
    filter?: SearchFilter;
}
```

searchByName のオプション

### suggestCorrection

*関数 ・ v0.4.0 で追加 ・ family では未使用*

```ts
function suggestCorrection(query: string, limit?: number): string[];
```

「もしかして」サジェスト。`findSimilar` の薄いラッパで、上位 N 件の
`formal` だけを文字列配列で返す。LLM プロンプトでそのまま使える形。

::: details 例
```ts
suggestCorrection('労働基準法施行例');
// → ['労働基準法施行令']
```
:::

## 逆引き

名前ではなく e-Gov の `law_id` や法令番号からエントリを引きます。検索結果に付いてきた ID を、人が読める名前に戻すときに使います。

### getAllNames

*関数 ・ v0.5.0 で追加 ・ family では未使用*

```ts
function getAllNames(name: string): string[];
```

`abbr` / `formal` / `aliases` のいずれかから、そのエントリの
**全別表記** を文字列配列で返す。

順序は `[abbr, formal, ...aliases]`、重複は除去済み。

::: details 例
```ts
import { getAllNames } from '@shuji-bonji/houki-abbreviations';

getAllNames('消法');
// → ['消法', '消費税法', '消費税', 'インボイス', 'インボイス制度', ...]

getAllNames('存在しない');
// → []
```
:::

### lookupByLawId

*関数 ・ v0.5.0 で追加 ・ family では未使用*

```ts
function lookupByLawId(law_id: string): AbbreviationEntry | null;
```

e-Gov `law_id` から辞書エントリを引く。完全一致のみ。

::: details 例
```ts
import { lookupByLawId } from '@shuji-bonji/houki-abbreviations';

lookupByLawId('363AC0000000108')?.formal;  // '消費税法'
lookupByLawId('321CONSTITUTION')?.formal;  // '日本国憲法'
lookupByLawId('999XX0000000000');          // null
```
:::

### lookupByLawNum

*関数 ・ v0.5.0 で追加 ・ family では未使用*

```ts
function lookupByLawNum(law_num: string): AbbreviationEntry | null;
```

法令番号（漢数字表記）から辞書エントリを引く。完全一致のみ。

漢数字↔算用数字の正規化は v0.5.0 ではサポートしない。呼び出し側で
表記を揃える責務。

::: details 例
```ts
import { lookupByLawNum } from '@shuji-bonji/houki-abbreviations';

lookupByLawNum('昭和六十三年法律第百八号')?.formal;  // '消費税法'
lookupByLawNum('昭和63年法律第108号');                 // null（v0.5.0 では正規化なし）
```
:::

## 鮮度の判定

取得日時からの経過日数を `fresh` / `stale` / `outdated` に分類します。しきい値を family 全体で共有し、どの MCP でも同じ基準で古さを判定するためのものです。

### computeDaysSince

*関数 ・ v0.4.1 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
function computeDaysSince(fetchedAt: string, nowMs?: number): number;
```

`fetched_at` (ISO 8601) と現在時刻から経過日数を計算する純関数。

- 小数なし、日数の `floor`
- 未来時刻 (now < fetched) は 0 に丸める
- パース不能な ISO 文字列は 0 を返す (呼び出し側で扱いを決める)

| 引数 | 説明 |
|---|---|
| `fetchedAt` | ISO 8601 形式の取得時刻 (例: "2026-04-01T00:00:00Z") |
| `nowMs` | Date.now() 相当 (テスト時に固定値を渡せる) |

### judgeStaleness

*関数 ・ v0.4.1 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
function judgeStaleness(daysSince: number): StalenessLevel;
```

経過日数から staleness レベルを判定する純関数。

通常は `computeDaysSince` の戻り値をそのまま渡す。`STALENESS_THRESHOLDS`
（`fresh_days` / `stale_days`）に従って `'fresh' | 'stale' | 'outdated'`
を返す。

| 引数 | 説明 |
|---|---|
| `daysSince` | 経過日数 (整数想定、負値は 0 に丸める呼び出し側責務) |

**戻り値**: `'fresh'` | `'stale'` | `'outdated'`

::: details 例
```ts
judgeStaleness(0);   // 'fresh'
judgeStaleness(7);   // 'stale'  (境界: fresh_days はちょうどで stale)
judgeStaleness(29);  // 'stale'
judgeStaleness(30);  // 'outdated' (境界: stale_days はちょうどで outdated)
```
:::

### STALENESS_THRESHOLDS

*定数 ・ v0.4.1 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
const STALENESS_THRESHOLDS: {
    /** fresh と判定する境界 (この日数 **未満** なら fresh) */
    readonly fresh_days: 7;
    /** stale と判定する境界 (この日数 **未満** なら stale、それ以上は outdated) */
    readonly stale_days: 30;
};
```

family 共通の閾値定数 (日数)。

各 MCP は同じ感覚で staleness を判定するため本定数を参照する。
個別の MCP で異なる閾値が必要な場合は `judgeStaleness` をラップして
MCP 固有の閾値を使う関数を作ってよい (本定数を上書きしない)。

### StalenessLevel

*型 ・ v0.4.1 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
type StalenessLevel = 'fresh' | 'stale' | 'outdated';
```

staleness の判定レベル。

各 MCP のレスポンス整形（`FreshnessRange` / `FreshnessSingle` 等）の
フィールドとして共通的に使われる想定。文字列 union の値は family 全体で
不変として扱う（壊すと既存の MCP すべてに破壊変更が伝播する）。

- `'fresh'`: 直近に取得済み（既定: < 7 日）。利用可、警告不要
- `'stale'`: やや古い（既定: 7〜29 日）。利用可だが bulk DL を warning として返す
- `'outdated'`: 古い（既定: ≧ 30 日）。利用前に再取得を促す

## 検証

`law_id` の形式や、エントリの重複・欠損を検査します。文章の中に法令名が含まれているかを調べる `extractLawNames` もここに入れています。

### extractLawNames

*関数 ・ v0.5.0 で追加 ・ family では未使用*

```ts
function extractLawNames(text: string, options?: _ExtractOptions): _LawNameMatch[];
```

入力テキスト中の **法令名らしき文字列** を辞書マッチで抽出する。

::: details 例
```ts
import { extractLawNames } from '@shuji-bonji/houki-abbreviations';

extractLawNames('消費税法と法人税法の改正について。インボイス制度も対象。');
// → [
//   { entry: <消法>, matchedKey: '消費税法', position: 0, length: 4 },
//   { entry: <法法>, matchedKey: '法人税法', position: 5, length: 4 },
//   { entry: <消法>, matchedKey: 'インボイス制度', position: 17, length: 7 },
// ]
```
:::

### ExtractOptions

*インターフェース ・ v0.5.0 で追加 ・ family では未使用*

::: details シグネチャ（長いので畳んでいます）
```ts
interface ExtractOptions {
    /**
     * 最小マッチ長（これより短いキーは無視）。
     *
     * デフォルト 2。「民」「税」のような 1 文字略称はノイズが多いので
     * デフォルトでは抽出対象外。1 文字も含めたい場合は `minLength: 1` を指定。
     *
     * @default 2
     */
    minLength?: number;
    /**
     * 同一エントリへのマッチを 1 件に絞るか。
     *
     * @default false
     */
    dedupe?: boolean;
    /**
     * 部分包含時に長い方を優先するか。
     *
     * 例: テキスト「民法等の一部を改正する法律」内に `民法` と
     * `民法等の一部を改正する法律` の両方がマッチする場合、`true` なら
     * 長い方（後者）だけを返す。
     *
     * @default true
     */
    preferLonger?: boolean;
}
```
:::

`extractLawNames` のオプション。

### isValidLawId

*関数 ・ v0.5.0 で追加 ・ family では未使用*

```ts
function isValidLawId(law_id: string): boolean;
```

e-Gov の `law_id` 形式が妥当かを判定する純粋関数。

外部 API は叩かないので「e-Gov 上で実際に存在するか」は確認しない
（それは CI スクリプト `scripts/verify-law-ids.mjs` の責務）。

##### 認識する種別

現時点で本パッケージの辞書に実エントリが存在する種別のみ厳格に判定する:

- 標準: `AC` / `CO` / `IO` / `MO` / `RU`（15 文字）
- 憲法: `CONSTITUTION`（15 文字）

e-Gov の bulk data には他の種別コード（例: `DF` 系、`M\d{2}` 形式の省令系
など）も存在することが確認されているが、**正確な仕様未確定** のため
v0.5.0 では未対応。新種別の law_id を持つエントリを辞書に追加する場合は、
本パッケージ側でパターンを拡張するまで `validateAllEntries` が
`invalid_law_id` error を返すので注意。

将来 v0.6.x で e-Gov 全種別の正確な仕様確認後に対応予定。

| 引数 | 説明 |
|---|---|
| `law_id` | 判定対象の文字列 |

**戻り値**: 形式が妥当なら `true`、そうでなければ `false`

::: details 例
```ts
isValidLawId('363AC0000000108');  // true（消費税法）
isValidLawId('321CONSTITUTION');  // true（日本国憲法）
isValidLawId('AAA');              // false
isValidLawId('');                 // false
isValidLawId(' 363AC0000000108'); // false（前後空白は呼び出し側で trim）

// 未対応の種別（v0.5.0 では false が返る）
isValidLawId('105DF0000000337');  // false（DF 種別は未対応）
```
:::

### LawNameMatch

*インターフェース ・ v0.5.0 で追加 ・ family では未使用*

```ts
interface LawNameMatch {
    /** マッチした辞書エントリ */
    entry: AbbreviationEntry;
    /** マッチした文字列（abbr / formal / aliases のいずれかの値） */
    matchedKey: string;
    /** text 内での開始位置（0-based） */
    position: number;
    /** マッチした長さ */
    length: number;
}
```

テキスト中の法令名抽出結果。

### validateAllEntries

*関数 ・ v0.5.0 で追加 ・ family では未使用*

```ts
function validateAllEntries(): _ValidationReport;
```

辞書全体の静的整合性をチェックする。CI 用途を想定。

::: details 例
```ts
import { validateAllEntries } from '@shuji-bonji/houki-abbreviations';

const report = validateAllEntries();
if (!report.valid) {
  console.error(report.errors);
  process.exit(1);
}
report.warnings.forEach((w) => console.warn(w.message));
```
:::

### ValidationIssue

*インターフェース ・ v0.5.0 で追加 ・ family では未使用*

```ts
interface ValidationIssue {
    /** 機械可読なコード（family 共通の error contract と同じ語彙を使う） */
    code: string;
    /** 人間可読な説明 */
    message: string;
    /** 該当エントリ（特定できる場合のみ） */
    entry?: AbbreviationEntry;
}
```

静的整合性チェックの error / warning 共通型。

### ValidationReport

*インターフェース ・ v0.5.0 で追加 ・ family では未使用*

```ts
interface ValidationReport {
    /** `errors.length === 0` のとき `true` */
    valid: boolean;
    /** 重大な不整合（CI を fail させる） */
    errors: ValidationIssue[];
    /** 軽微な不整合（CI は fail させないがログに出す） */
    warnings: ValidationIssue[];
}
```

辞書全体の検証レポート。

## エントリの構造と取りうる値

辞書 1 件の形と、分野・種別・管轄 MCP が取りうる値です。上の関数の引数と戻り値は、すべてこれらで書かれています。

### AbbreviationEntry

*インターフェース ・ v0.1.0 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

::: details シグネチャ（長いので畳んでいます）
```ts
interface AbbreviationEntry {
    /** 略称・通称。例: "消法", "民" */
    abbr: string;
    /** 正式名称。例: "消費税法", "民法" */
    formal: string;
    /** e-Gov law_id。verified 済みのもののみ格納。未確認・該当なしは null */
    law_id: string | null;
    /** 法令番号。例: "昭和六十三年法律第百八号" */
    law_num?: string;
    /**
     * e-Gov の法令種別コード。法令系のみ持つ。
     *
     * @deprecated 将来は category の方が表現力が高いため、こちらに集約予定。
     *             v0.1.x では後方互換として残す。
     */
    law_type?: LawTypeCode;
    /** 分野タグ（実務分野での分類） */
    domain: Domain;
    /**
     * 法令カテゴリ。どの種類のテキストか（法律本体・通達・判例 等）。
     *
     * v0.1.0 では「法律 / 政令 / 省令 / 規則 / 憲法」のみ実エントリあり。
     * 'kihon-tsutatsu' 以降は houki-nta-mcp 開発時に追加される。
     */
    category: Category;
    /**
     * 参照すべき MCP のヒント。
     *
     * このエントリを LLM が引いたとき、どの MCP に対してさらに本文取得を
     * 依頼すべきかを示す。各 MCP は自分の hint と一致しないエントリに対して
     * 「管轄外」と判定し、正しい MCP に誘導する。
     */
    source_mcp_hint: SourceMcpHint;
    /** 同義の別表記。略称・通称・英語名など */
    aliases?: string[];
    /** 備考（例: "通称: 電子帳簿保存法"） */
    note?: string;
}
```
:::

略称辞書エントリ

1 件 = 1 つの法令／通達／判例 等のメタ情報。
複数の略称・通称・正式名称から逆引きするための共通テーブル。

##### freshness は持たない

本エントリは **静的なメタ情報のみ** を保持する。「いつ取得したか」という
運用状態（`fetched_at` 等）は各 MCP のローカル DB / キャッシュ側で管理し、
判定は `freshness` モジュール（`judgeStaleness` / `computeDaysSince`）で
行う。詳細は [`src/freshness.ts`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/src/freshness.ts) のヘッダ JSDoc を参照。

### CATEGORIES

*定数 ・ v0.1.0 で追加 ・ houki-nta-mcp が使用*

```ts
const CATEGORIES: readonly ["constitution", "law", "cabinet-order", "imperial-ordinance", "ministerial-ordinance", "rule", "kihon-tsutatsu", "kobetsu-tsutatsu", "qa-jirei", "tax-answer", "hanrei", "saiketsu"];
```

法令カテゴリ — どの種類のテキスト（法律本体・通達・判例など）を指すか。

- 'constitution' / 'law' / 'cabinet-order' / 'imperial-ordinance' /
  'ministerial-ordinance' / 'rule' は e-Gov 配下（houki-egov-mcp）。
- 'kihon-tsutatsu' / 'kobetsu-tsutatsu' / 'qa-jirei' / 'tax-answer' は
  各省庁公式サイト配下（houki-nta-mcp 等）。
- 'hanrei' / 'saiketsu' は判例・裁決系。

### Category

*型 ・ v0.1.0 で追加 ・ houki-nta-mcp が使用*

```ts
type Category = (typeof CATEGORIES)[number];
```

`CATEGORIES` の要素型。

### Domain

*型 ・ v0.1.0 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
type Domain = (typeof DOMAINS)[number];
```

`DOMAINS` の要素型。

### DOMAINS

*定数 ・ v0.1.0 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
const DOMAINS: readonly ["tax", "labor", "accounting", "commercial", "civil", "administrative"];
```

ドメインタグ（実務分野での分類）

### LAW_TYPE_CODES

*定数 ・ v0.1.0 で追加 ・ houki-egov-mcp が使用*

```ts
const LAW_TYPE_CODES: {
    readonly Act: "AC";
    readonly CabinetOrder: "CO";
    readonly ImperialOrdinance: "IO";
    readonly MinisterialOrdinance: "MO";
    readonly Rule: "RU";
};
```

e-Gov law_id の種別プレフィックス

### LawTypeCode

*型 ・ v0.1.0 で追加 ・ houki-egov-mcp が使用*

```ts
type LawTypeCode = keyof typeof LAW_TYPE_CODES;
```

`LAW_TYPE_CODES` のキー。法令種別の名前を表す。

### SOURCE_MCP_HINTS

*定数 ・ v0.1.0 で追加 ・ houki-nta-mcp が使用*

```ts
const SOURCE_MCP_HINTS: readonly ["houki-egov", "houki-nta", "houki-mhlw", "houki-jaish", "houki-court", "houki-saiketsu"];
```

参照すべき MCP のヒント。

houki ファミリーの各 MCP が、自分の管轄外エントリを LLM に「正しい MCP に
誘導する」ために使う。

- 'houki-egov': e-Gov 法令API (法律・政令・省令・規則・告示)
- 'houki-nta': 国税庁通達・Q&A・タックスアンサー
- 'houki-mhlw': 厚労省通達・通知
- 'houki-jaish': 労災（労働安全衛生総合研究所）
- 'houki-court': 判例（裁判所サイト）
- 'houki-saiketsu': 国税不服審判所裁決

### SourceMcpHint

*型 ・ v0.1.0 で追加 ・ houki-nta-mcp が使用*

```ts
type SourceMcpHint = (typeof SOURCE_MCP_HINTS)[number];
```

`SOURCE_MCP_HINTS` の要素型。
