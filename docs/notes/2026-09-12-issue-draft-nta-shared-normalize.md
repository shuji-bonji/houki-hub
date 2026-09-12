# issue 草案: 全角英字が半角にならず、検索結果が全角と半角で分断される

対象リポジトリ: houki-nta-mcp（2026-09-12 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
タイトル案: `normalizeJpText` を houki-abbreviations の共通実装に置き換える（全角英字が半角にならない）

---

## 症状

`nta_search_tax_answer` を全角と半角で叩くと、**重なりのない別々の結果**が返ります（v0.14.2、DB は 2026-09-07 取得）。

| クエリ | 件数 | ヒットした文書 |
| --- | --- | --- |
| `NISA` | 3 | 1535「NISA制度」／ 1464「譲渡した株式等の取得費」／ 1474「上場株式等に係る譲渡損失の損益通算及び繰越控除」 |
| `ＮＩＳＡ` | 1 | 3105「譲渡所得の対象となる資産と課税方法」 |
| `e-Tax` | 2 | 7453 ／ 7455 |
| `ｅ－Ｔａｘ` | 1 | 9201「振替納税のお勧め」 |

国税庁の HTML 自体が全角と半角の英字を混ぜて書いているため、利用者がどちらで打っても片方しか出てきません。

`ｅ－Ｔａｘ` で返った 9201 の snippet が症状をそのまま表しています。

```
 … フォンから「ｅ-Ｔａｘホームページ」 …
```

全角ハイフン `－` は半角 `-` に直っているのに、英字 `ｅ` `Ｔ` `ａ` `ｘ` は全角のまま残っています。

## 原因

`src/services/text-normalize.ts` の `normalizeJpText` が、**全角英字を半角化していません**。

```ts
// src/services/text-normalize.ts（現状）
export function normalizeJpText(s: string): string {
  return s
    .replace(/－/g, '-')
    .replace(/[～〜]/g, '~')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))  // 数字だけ
    .replace(/　/g, ' ');
}
```

同じ名前の関数が `@shuji-bonji/houki-abbreviations` にもあり、そちらは全角英字も半角にします。houki-abbreviations v0.3.0 で「`text-normalize` を共通パッケージに昇格」したときのものですが、**昇格元である houki-nta-mcp 側が置き換えられないまま残っています**。houki-egov-mcp は共通パッケージを使っています。

### 挙動の差

| | 共通パッケージ | houki-nta-mcp |
| --- | --- | --- |
| 全角数字 `０-９` | 半角化 | 半角化 |
| **全角英字 `Ａ-Ｚ` `ａ-ｚ`** | **半角化** | **しない** |
| 全角ハイフン `－` | 半角化 | 半角化 |
| 全角チルダ `～` `〜` | 半角化 | 半角化 |
| 全角スペース `　` | 半角化 | 半角化 |
| 前後の空白の除去 | する | しない |
| `normalizeSearchQuery` の小文字化 | する | しない |

税務でよく出てくる語がそのまま該当します。

| 入力 | 共通パッケージ | houki-nta-mcp |
| --- | --- | --- |
| `ＮＩＳＡ` | `NISA` | `ＮＩＳＡ` |
| `ｅ－Ｔａｘ` | `e-Tax` | `ｅ-Ｔａｘ` |
| `ｉＤｅＣｏ` | `iDeCo` | `ｉＤｅＣｏ` |
| `ＤＸ投資促進税制` | `DX投資促進税制` | `ＤＸ投資促進税制` |
| `ＣＦＣ税制` | `CFC税制` | `ＣＦＣ税制` |
| `Ｍ＆Ａ` | `M＆A` | `Ｍ＆Ａ` |
| `ＰＬ法` | `PL法` | `ＰＬ法` |

19 件の入力を 2 関数（`normalizeJpText` / `normalizeSearchQuery`）で突き合わせたところ、20 件が食い違いました。

これは「DB に入れるときと検索するときで同じ関数を通す」という Normalize-everywhere の考え方（`text-normalize.ts` のヘッダ JSDoc）が、英字についてだけ成り立っていない状態です。DB 側と検索側では同じ関数を通しているので内部では一貫していますが、**原文の表記ゆれがそのまま検索結果のゆれになります**。

## 提案

### 1. 共通パッケージの実装に置き換える

houki-nta-mcp は既に `@shuji-bonji/houki-abbreviations` に依存していて（`package.json` の `^0.4.1`）、`resolveAbbreviation` や `judgeStaleness` を import しています。`normalizeJpText` / `normalizeSearchQuery` は 0.3.0 からあるので、**依存の版を上げる必要はありません**。

`src/services/text-normalize.ts` で共通版を再 export すれば、`./text-normalize.js` から import している 13 ファイルは無改修で済みます。

```ts
// src/services/text-normalize.ts（提案）
export { normalizeJpText, normalizeSearchQuery } from '@shuji-bonji/houki-abbreviations';

/** 条番号用。共通の正規化に加えて空白を全部落とす。nta 固有なのでここに残す。 */
export function normalizeClauseNumber(s: string): string {
  return normalizeJpText(s).replace(/\s+/g, '');
}
```

`normalizeClauseNumber`（`1の3・1の4共－1` のような条番号から空白を全部落とす）は houki-nta-mcp 固有の関心事なので、ここに残します。

### 2. `normalizeSearchQuery` の小文字化について

共通版は ASCII を小文字にします。DB 側は `normalizeJpText`（小文字化なし）で入るため一見ずれますが、FTS5 の定義は

```sql
CREATE VIRTUAL TABLE clause_fts USING fts5(..., tokenize='trigram');
```

で `case_sensitive` を指定していないため、既定で ASCII の大文字小文字は同一視されます。houki-egov-mcp が同じ組み合わせ（投入は `normalizeJpText`、検索は `normalizeSearchQuery`）で動いているので、実績もあります。

## 移行（既存 DB の扱い）

正規化の結果が変わるので、既存 DB のまま検索側だけ差し替えると、DB に入っている `ＮＩＳＡ` と正規化後のクエリ `nisa` が食い違い、**今より悪くなります**。既存 DB をどう揃えるかを決める必要があります。

### 再ダウンロードは要りません

`document.full_text` も `clause.full_text` も **normalize 済みのテキスト**を持っていて、生の HTML は保存していません。一見すると取り直しが要るように見えますが、**現状の正規化を通した文字列に新しい正規化を通すと、生の原文に新しい正規化を通したのと同じ結果になります**。

現状の変換（数字・ハイフン・チルダ・全角スペース）は新しい変換の部分集合で、互いに干渉しないためです。

```
new(old(x)) === new(x)
```

ランダム生成した 20 万件（漢字・かな・全角英数・全角記号・改行・タブを混ぜたもの）と、`ｅ－Ｔａｘ` `ＮＩＳＡ口座` `第１０条の２` `1の3・1の4共－1` `Ｍ＆Ａの税務` `ＤＸ投資促進税制` で確かめ、反例はありませんでした。

つまり **DB の中の文字列を作り直すだけで済み、国税庁サイトへの再アクセスは不要**です。100 分の再取得は要りません。

### 案

| 案 | 中身 | 所要 | 備考 |
| --- | --- | --- | --- |
| **A（推奨）** | 一度きりの再正規化を migration として実行する。`clause` の `clause_number` / `title` / `full_text` / `paragraphs_json`、`section` の `title`、`document` の `title` / `full_text` を新しい正規化で UPDATE し、`content_hash` を計算し直す | ネットワーク不要。DB 内の UPDATE のみ | FTS5 はトリガーで同期しているので、base テーブルを UPDATE すれば索引も更新される |
| B | `schema_meta` に `normalize_version` を持ち、古ければ検索時に `search_notes` で「まだ揃っていない」と知らせる | 利用者が何かするまで不完全なまま | A ができるなら不要 |
| C | `SCHEMA_VERSION` を 4 → 5 に上げて `dropAndRecreate` を走らせる | 再取得 100 分 | 断りなくデータが消える。採らない |

A を推します。`SCHEMA_VERSION` を 5 に上げ、`migrateV4ToV5()` で再正規化する形なら、既存の移行の仕組み（`migrateV3ToV4` と同じ並び）に収まります。

`content_hash` は改正検知に使われているので、再正規化後の文字列で計算し直します。放っておくと次の差分チェックで全件が「変わった」と判定され、無駄な再ダウンロードが走ります。

## 完了判定

- `ＮＩＳＡ` と `NISA`、`ｅ－Ｔａｘ` と `e-Tax` が同じ結果を返す（再正規化後）
- `text-normalize.ts` に `normalizeJpText` の独自実装が残っていない
- `normalizeClauseNumber` の既存テストが通る（`1－4－13の2` → `1-4-13の2` など）
- 全角英字を含む入力のテストを追加する（`ＮＩＳＡ` → `NISA`）
- 既存 DB（v4）を開くと再正規化が走り、再ダウンロードなしで上の 2 つが揃う
- 再正規化後に `--refresh-stale` を実行しても、全件が「変わった」と判定されない（`content_hash` を計算し直せているか）

## 関連

- houki-abbreviations v0.3.0（`text-normalize` の共通パッケージへの昇格）
- houki-abbreviations の API リファレンス: https://shuji-bonji.github.io/houki-hub/reference/lib/houki-abbreviations
- houki-egov-mcp `src/services/bulk/ingester.ts` / `src/services/law-search.ts`（共通パッケージを使っている側）
