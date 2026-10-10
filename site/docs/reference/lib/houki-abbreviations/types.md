---
title: "型とインターフェース — houki-abbreviations"
description: "houki-abbreviations v0.7.1 が公開している型とインターフェース（インターフェース 13 個・型 6 個）のシグネチャと説明（dist/index.d.ts から自動生成）"
---

# 型とインターフェース

<!-- GENERATED FILE — 手で編集しない。シグネチャと説明は dist/index.d.ts、使用状況は mcp/*/src の import から。 -->

::: info
**v0.7.1** の `dist/index.d.ts` から自動生成しました（インターフェース 13 個・型 6 個・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。
:::

関数の引数と戻り値、辞書のエントリの形に使われている型です。型には仕様書が無いので、型定義（`dist/index.d.ts`）の宣言と説明だけを写しています。

## 辞書の解決

### AbbreviationStats

*インターフェース ・ v0.1.0 で追加 ・ family では未使用*

```ts
interface AbbreviationStats {
    total: number;
    byDomain: Record<Domain, number>;
    byCategory: Record<Category, number>;
    bySourceMcpHint: Record<SourceMcpHint, number>;
}
```

`getAbbreviationStats` が返す辞書統計。起動時ログ・診断用。

`byDomain` / `byCategory` / `bySourceMcpHint` のキーは、それぞれ `DOMAINS` /
`CATEGORIES` / `SOURCE_MCP_HINTS` の全値を定数の順で持ち、辞書に無い値は `0`
（v0.7.0 から。v0.6.1 までは 1 件以上ある値だけがキーで、型は `Record<string, number>`）。

**関係する型**: [`Category`](/reference/lib/houki-abbreviations/types#category)・[`Domain`](/reference/lib/houki-abbreviations/types#domain)・[`SourceMcpHint`](/reference/lib/houki-abbreviations/types#sourcemcphint)

**この型を使う関数・値**: [`getAbbreviationStats`](/reference/lib/houki-abbreviations/get_abbreviation_stats)

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
     *   ダッシュ類／チルダ／数字／全角 ASCII 文字／全角スペースの
     *   揺れを吸収する。**大文字小文字は保持する**ため、`PL法` と `pl法` は
     *   別物として扱われる。全角スペースは半角スペースになるだけで取り除かれない
     *   （前後の空白は取り除く）。
     *
     * @default false
     */
    normalize?: boolean;
}
```

`resolveAbbreviation` に渡せるオプション。

**この型を使う関数・値**: [`resolveAbbreviation`](/reference/lib/houki-abbreviations/resolve_abbreviation)

## 検索とあいまい一致

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

**関係する型**: [`AbbreviationEntry`](/reference/lib/houki-abbreviations/types#abbreviationentry)

### FuzzyOptions

*インターフェース ・ v0.4.0 で追加 ・ family では未使用*

```ts
interface FuzzyOptions {
    /** 最大編集距離 (デフォルト 2) */
    maxDistance?: number;
    /**
     * 結果の最大件数。1 以上 500 以下の整数。省くと 5。
     *
     * 規則は `searchByName` の `limit` と同じ。それ以外の値は `RangeError`、
     * 数でない値は `TypeError` を投げ、丸めない（v0.7.0 から）。
     */
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

**関係する型**: [`SearchFilter`](/reference/lib/houki-abbreviations/types#searchfilter)・[`SearchOptions`](/reference/lib/houki-abbreviations/types#searchoptions)

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

**関係する型**: [`Category`](/reference/lib/houki-abbreviations/types#category)・[`Domain`](/reference/lib/houki-abbreviations/types#domain)・[`SourceMcpHint`](/reference/lib/houki-abbreviations/types#sourcemcphint)

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
    /**
     * 結果の最大件数。1 以上 500 以下の整数。省くと 50。
     *
     * それ以外の値（1 未満、小数、500 超、`NaN`、`Infinity`）は `RangeError`、
     * 数でない値は `TypeError` を投げ、丸めない（v0.7.0 から）。
     */
    limit?: number;
    /** 結果を絞り込むフィルター (各キーは単一値 or 配列) */
    filter?: SearchFilter;
}
```

searchByName のオプション

**関係する型**: [`SearchFilter`](/reference/lib/houki-abbreviations/types#searchfilter)・[`SearchMode`](/reference/lib/houki-abbreviations/types#searchmode)

## 逆引き

### GetAllNamesOptions

*インターフェース ・ v0.7.0 で追加 ・ family では未使用*

```ts
interface GetAllNamesOptions {
    /**
     * `true` なら、`name` と辞書の名前の両方を `normalizeJpText` に通してから比べる
     * （全角英数字・ダッシュ類・全角チルダ・全角スペースを半角にする）。返す名前は
     * 辞書に書かれた表記のまま。`resolveAbbreviation` の `options.normalize` と同じ意味で、
     * 既定も同じ `false`。MCP サーバーは入口で `true` を渡す。
     *
     * @default false
     */
    normalize?: boolean;
}
```

`getAllNames` に渡せるオプション。

**この型を使う関数・値**: [`getAllNames`](/reference/lib/houki-abbreviations/get_all_names)

### LookupByLawIdOptions

*インターフェース ・ v0.7.0 で追加 ・ family では未使用*

```ts
interface LookupByLawIdOptions {
    /**
     * `true` なら、`law_id` を `normalizeJpText` に通してから比べる（全角英数字を半角にする）。
     * 英字の小文字は大文字にしない（`isValidLawId` と同じく、小文字の `law_id` は一致しない）。
     * 辞書の `law_id` は半角の大文字なので、辞書の側は変換しない。既定 `false`。
     *
     * @default false
     */
    normalize?: boolean;
}
```

`lookupByLawId` に渡せるオプション。

**この型を使う関数・値**: [`lookupByLawId`](/reference/lib/houki-abbreviations/lookup_by_law_id)

## 鮮度の判定

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

**この型を使う関数・値**: [`judgeStaleness`](/reference/lib/houki-abbreviations/judge_staleness)

## 検証

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
     * 範囲が重なるときに長い方を優先するか。
     *
     * `true` なら、ほかの、より長い一致と 1 文字でも範囲が重なる短い一致を返さない。
     * 例: テキスト「民法等の一部を改正する法律」内に `民法` と
     * `民法等の一部を改正する法律` の両方がマッチする場合、長い方（後者）だけを返す。
     * 「消費税法法人税法」の `法法` のように、2 つの長い一致の端にまたがる短い一致も
     * 返さない（v0.7.0 から。v0.6.1 までは、すっぽり含まれる一致だけを除いていた）。
     * 長さが同じ一致どうしは、重なっていても両方返す。
     *
     * @default true
     */
    preferLonger?: boolean;
    /**
     * 全角／半角の表記ゆらぎを吸収して探すか。
     *
     * `true` なら、`text` と辞書のキーの両方を `normalizeJpText` と同じ規則で半角にしてから
     * 探す（全角英数字・ダッシュ類・全角チルダ・全角スペース）。`matchedKey` は辞書の表記の
     * まま、`position` と `length` は元の `text` の位置と長さで返す。
     * `resolveAbbreviation` の `options.normalize` と同じ意味で、既定も同じ `false`。
     * MCP サーバーは入口で `true` を渡す。
     *
     * @since 0.7.0
     * @default false
     */
    normalize?: boolean;
}
```
:::

`extractLawNames` のオプション。

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

**関係する型**: [`AbbreviationEntry`](/reference/lib/houki-abbreviations/types#abbreviationentry)

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

**関係する型**: [`AbbreviationEntry`](/reference/lib/houki-abbreviations/types#abbreviationentry)

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

**関係する型**: [`ValidationIssue`](/reference/lib/houki-abbreviations/types#validationissue)

## エントリの構造と取りうる値

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
     * 実エントリがあるのは法令系（'constitution' 〜 'rule'）と、'kihon-tsutatsu'（8 件）・
     * 'kobetsu-tsutatsu'（1 件）。'kokuji' / 'qa-jirei' / 'tax-answer' / 'hanrei' / 'saiketsu' は
     * 辞書にまだエントリが無い種類として先に定義している。
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
    /**
     * 同義の別表記。略称・通称・英語名など。
     *
     * 自分の `abbr` / `formal` と同じ値は入れない（`validateAllEntries` の
     * `alias_equals_own_name` エラー）。ほかのエントリの名前とも重ならない（`duplicate_name`）。
     */
    aliases?: string[];
    /** 備考（例: "通称: 電子帳簿保存法"） */
    note?: string;
}
```
:::

略称辞書エントリ

1 件 = 1 つの法令／通達／判例 等のメタ情報。
複数の略称・通称・正式名称から逆引きするための共通テーブル。

##### 凍結されている

`abbreviationEntries` の各エントリと `aliases` の配列は凍結されている（v0.7.0 から）。
名前・ID・一覧・検索で返すエントリは辞書の要素そのもの（同じオブジェクト）なので、
フィールドへの代入は strict mode では `TypeError` になる。書き換えたいときは
`structuredClone(entry)` や `{ ...entry }` で自分のコピーを作る。

##### freshness は持たない

本エントリは **静的なメタ情報のみ** を保持する。「いつ取得したか」という
運用状態（`fetched_at` 等）は各 MCP のローカル DB / キャッシュ側で管理し、
判定は `freshness` モジュール（`judgeStaleness` / `computeDaysSince`）で
行う。詳細は [`src/freshness.ts`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/src/freshness.ts) のヘッダ JSDoc を参照。

**関係する型**: [`Category`](/reference/lib/houki-abbreviations/types#category)・[`Domain`](/reference/lib/houki-abbreviations/types#domain)・[`LawTypeCode`](/reference/lib/houki-abbreviations/types#lawtypecode)・[`SourceMcpHint`](/reference/lib/houki-abbreviations/types#sourcemcphint)

**この型を使う関数・値**: [`abbreviationEntries`](/reference/lib/houki-abbreviations/abbreviation_entries)・[`listByCategory`](/reference/lib/houki-abbreviations/list_by_category)・[`listByDomain`](/reference/lib/houki-abbreviations/list_by_domain)・[`listBySourceMcpHint`](/reference/lib/houki-abbreviations/list_by_source_mcp_hint)・[`lookupByLawId`](/reference/lib/houki-abbreviations/lookup_by_law_id)・[`lookupByLawNum`](/reference/lib/houki-abbreviations/lookup_by_law_num)・[`resolveAbbreviation`](/reference/lib/houki-abbreviations/resolve_abbreviation)・[`searchByName`](/reference/lib/houki-abbreviations/search_by_name)

### Category

*型 ・ v0.1.0 で追加 ・ houki-nta-mcp が使用*

```ts
type Category = (typeof CATEGORIES)[number];
```

`CATEGORIES` の要素型。

**この型を使う関数・値**: [`listByCategory`](/reference/lib/houki-abbreviations/list_by_category)

### Domain

*型 ・ v0.1.0 で追加 ・ houki-egov-mcp / houki-nta-mcp が使用*

```ts
type Domain = (typeof DOMAINS)[number];
```

`DOMAINS` の要素型。

**この型を使う関数・値**: [`listByDomain`](/reference/lib/houki-abbreviations/list_by_domain)

### LawTypeCode

*型 ・ v0.1.0 で追加 ・ houki-egov-mcp が使用*

```ts
type LawTypeCode = keyof typeof LAW_TYPE_CODES;
```

`LAW_TYPE_CODES` のキー。法令種別の名前を表す。

### SourceMcpHint

*型 ・ v0.1.0 で追加 ・ houki-nta-mcp が使用*

```ts
type SourceMcpHint = (typeof SOURCE_MCP_HINTS)[number];
```

`SOURCE_MCP_HINTS` の要素型。

**この型を使う関数・値**: [`listBySourceMcpHint`](/reference/lib/houki-abbreviations/list_by_source_mcp_hint)

## 関連ページ

- [houki-abbreviations の API の一覧](/reference/lib/houki-abbreviations/)
- [houki-abbreviations の解説](/lib/houki-abbreviations)
