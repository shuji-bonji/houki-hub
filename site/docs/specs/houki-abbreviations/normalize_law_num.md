---
title: "normalizeLawNum — houki-abbreviations の仕様"
description: "houki-abbreviations の normalizeLawNum（法令番号の数字の書き方を算用数字に揃える）の仕様。目的・入力・処理の流れと、仕様 ID ごとの仕様項目（specs/current から自動生成）"
---

# normalizeLawNum の仕様

<!-- GENERATED FILE — 手で編集しない。本文は houki-abbreviations の specs/current/normalize_law_num/spec.md の写し。 -->

::: info
houki-abbreviations **v0.7.0** の `specs/current/normalize_law_num/spec.md` から自動生成しました（仕様 ID 16 件・2026-10-10）。手で編集しないでください。再生成は `node scripts/generate-reference.mjs specs` です。
:::

法令番号の数字の書き方を算用数字に揃える

使いどころ・引数・実測の呼び出し例は、[関数のページ](/reference/lib/houki-abbreviations/normalize_law_num)にあります。

最後に仕様が変わったのは v0.7.0 の「関数ごとの全角・ダッシュ類・大文字の扱いを揃える（T3 正規化）」（2026-09-30 承認）です。それまでの経緯は[承認の履歴](#承認の履歴)にあります。

## 利用者と得られる結果

この機能の利用者と、利用者が渡すもの・得られる結果を示します。

- このパッケージを import するコード（houki-hub family の MCP サーバーなど）。漢数字・算用数字・全角数字のどれで書かれた法令番号でも、照合に使う 1 つの文字列を受け取る。比べる 2 つの法令番号の両方にこの関数を通してから比べる
- このパッケージの中では `lookupByLawNum` が、入力と辞書の `law_num` の両方にこの関数を通してから比べる

## 入力

呼び出すときに渡す値です。

| 引数    | 必須 | 内容                                                                                              |
| ------- | ---- | ------------------------------------------------------------------------------------------------- |
| `input` | 必須 | 法令番号。例: `昭和二十五年法律第百三十七号` / `昭和25年法律第137号` / `昭和２５年法律第１３７号` |

## 戻り値

呼び出しが返す値です。

`string`。次の順に変換した文字列。

| 順  | 変換                                       | 変換前                                                                                                                                                                             | 変換後                                                                 |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | `normalizeJpText` と同じ変換               | 全角数字・全角英字・ダッシュ類（`－` `‐` `‑` `–` `—` `―` `−`）・`～`（U+FF5E）・`〜`（U+301C）・全角スペース                                                                       | `normalizeJpText` の表のとおり。ダッシュ類は `-`（U+002D）             |
| 2   | 空白を取り除く                             | すべての空白（半角スペース・タブ・改行など。前後も途中も）                                                                                                                         | なし                                                                   |
| 3   | 元年を 1 年にする                          | `元年`                                                                                                                                                                             | `1年`                                                                  |
| 4   | 年・番号の位置にある漢数字を算用数字にする | `〇一二三四五六七八九十百千` が続いた並びのうち、直後が `年` か `号`、直前が `第`、直前か直後が `-`（順 1 で揃えたダッシュ）のどれかに当たるもの。`kanjiToNumber` で読める並びだけ | その値の算用数字。読めない並びと、どの位置にも当たらない並びはそのまま |
| 5   | 算用数字の先頭の 0 を取る                  | 算用数字の並び（`0137`）                                                                                                                                                           | 先頭の 0 を除いた並び（`137`）。`0` だけのときは `0`。桁数の上限は無い |

表に無い文字（元号、`年` `法律` `第` `号`、省名、中黒 `・` など）は変えない。v0.6.1 まで順 6 にあった「ダッシュ類を半角ハイフンにする」は順 1 に含める。

## 扱わないこと

この機能が意図して扱わないことです。

- 元号の別表記（`S25` / `昭25`）を元号名にすること、`第` や `号` を補うこと、法令の種別名（`法律` / `政令`）を補うこと（呼び出し側で揃える）
- 万以上の単位を読むこと。`normalizeLawNum('第二万三千号')` は `'第二万3000号'` になり、`第23000号` とは一致しない（`kanjiToNumber` が万を読まないため。`二` は `万` に隣り合うので変えない）
- 元号を西暦にすること
- 法令番号として正しい形かを確かめること（どんな文字列でも変換して返す）
- 辞書から法令を引くこと（`lookupByLawNum`）

## 処理の流れ

図の中の番号は「できること」の仕様 ID の末尾 3 桁です。

```mermaid
flowchart TD
  A["input"] --> B{"空文字か"}
  B -- はい --> R0["空文字を返す（009）"]
  B -- いいえ --> C["全角数字・全角英字・ダッシュ類（- に揃える）などを半角にする（001, 005, 012, 013）"]
  C --> D["空白をすべて取り除く（002）"]
  D --> E["元年を 1年 にする（004）"]
  E --> F["年・号の直前、第の直後、- の隣にある漢数字の並びを算用数字にする。ほかの位置の漢数字は変えない（001, 006, 015）"]
  F --> G["算用数字の先頭の 0 を文字列の操作で取る。桁数によらず丸めない（003, 016）"]
  G --> R["返す。数字以外の語は変えない（007）。元号の別表記や 第・号 の省略は揃えない（008）"]
```

## 仕様項目

この機能の仕様項目を、仕様 ID ごとに並べています。見出しは仕様項目を 1 文で表したもので、条件・応答の細部・例は「詳細」を開くと読めます。仕様 ID はそれぞれ受入テストと対応していて、テストの無い ID があると各リポジトリの CI が止まります。

<a id="spec-abbr-normalize-law-num-001"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-001 漢数字・算用数字・全角数字の法令番号を同じ文字列にする

::: details 詳細
年と番号の数字を算用数字にそろえる。漢数字は位取り（`百三十七`）でも位ごと（`一三七`）でもよい。全角数字は半角にする。

例: 次の 4 つはどれも `'昭和25年法律第137号'` を返す。

- `normalizeLawNum('昭和二十五年法律第百三十七号')`
- `normalizeLawNum('昭和25年法律第137号')`
- `normalizeLawNum('昭和２５年法律第１３７号')`
- `normalizeLawNum('昭和二五年法律第一三七号')`
:::

<a id="spec-abbr-normalize-law-num-002"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-002 空白をすべて取り除く

::: details 詳細
前後だけでなく途中の空白も取り除く。

例: `normalizeLawNum('  昭和25年 法律 第137号 ')` は `'昭和25年法律第137号'`。
:::

<a id="spec-abbr-normalize-law-num-003"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-003 算用数字の先頭の 0 を取る

::: details 詳細
例: `normalizeLawNum('昭和25年法律第0137号')` は `'昭和25年法律第137号'`。
:::

<a id="spec-abbr-normalize-law-num-004"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-004 元年を 1 年にする

::: details 詳細
`元年` を `1年` にする。

例: `normalizeLawNum('令和元年法律第一号')` は `'令和1年法律第1号'`、`normalizeLawNum('平成元年法律第四十二号')` は `'平成1年法律第42号'`。
:::

<a id="spec-abbr-normalize-law-num-005"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-005 人事院規則の番号のダッシュを半角ハイフンにする

::: details 詳細
戻り値の表の順 1 でダッシュ類を `-` にする。人事院規則の番号（`一―一`）はこれで `1-1` になる。ダッシュの直前・直後の漢数字も算用数字にする。

例: `normalizeLawNum('昭和二十四年人事院規則一―一')` は `'昭和24年人事院規則1-1'`、`normalizeLawNum('昭和三十五年人事院規則九―三〇')` は `'昭和35年人事院規則9-30'`、`normalizeLawNum('昭和二十四年人事院規則二―〇')` は `'昭和24年人事院規則2-0'`。
:::

<a id="spec-abbr-normalize-law-num-006"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-006 番号の無い法令番号も年の数字を揃える

::: details 詳細
`第…号` の無い法令番号（憲法・勅令など）も、年の数字を算用数字にする。

例: `normalizeLawNum('昭和二十一年憲法')` は `'昭和21年憲法'`、`normalizeLawNum('明治十九年勅令')` は `'明治19年勅令'`。
:::

<a id="spec-abbr-normalize-law-num-007"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-007 数字以外の語は変えない

::: details 詳細
元号・法令の種別名・省名・中黒 `・` は変えない。共同省令の長い種別名もそのまま残る。

例: `normalizeLawNum('平成十五年内閣府・総務省・財務省・厚生労働省・農林水産省・経済産業省・国土交通省令第三号')` は `'平成15年内閣府・総務省・財務省・厚生労働省・農林水産省・経済産業省・国土交通省令第3号'`。
:::

<a id="spec-abbr-normalize-law-num-008"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-008 元号の別表記と「第」「号」の省略は揃えない

::: details 詳細
元号の別表記（`S25` / `昭25`）を元号名にすることと、`第` や `号` の有無をそろえることはしない。書き方が違えば、戻り値も違う文字列のまま。

例: `normalizeLawNum('S25年法律第137号')` は `'S25年法律第137号'`。`normalizeLawNum('昭和25年法律137号')` は `'昭和25年法律137号'` で、`normalizeLawNum('昭和25年法律第137号')` と一致しない。
:::

<a id="spec-abbr-normalize-law-num-009"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-009 空文字には空文字を返す

::: details 詳細
`input` が空文字のときは `''` を返す。
:::

<a id="spec-abbr-normalize-law-num-010"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-010 読めない漢数字の並びはそのまま残す

::: details 詳細
`kanjiToNumber` が `null` を返す漢数字の並びは、算用数字にせず元の文字のまま残す。同じ入力の中の読める並びは算用数字にする。

例: `normalizeLawNum('昭和十十年法律第一号')` は `'昭和十十年法律第1号'`。
:::

<a id="spec-abbr-normalize-law-num-011"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-011 空白で分かれた元年も 1 年にする

::: details 詳細
空白を取り除いてから `元年` を `1年` にするので、`元` と `年` のあいだや前後に空白があっても `1年` になる。

例: `normalizeLawNum('令和 元 年法律第一号')` は `'令和1年法律第1号'`。
:::

<a id="spec-abbr-normalize-law-num-012"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-012 U+2015 以外のダッシュ類も半角ハイフンにする

::: details 詳細
`‐`（U+2010）、`‑`（U+2011）、`–`（U+2013）、`—`（U+2014）、`−`（U+2212）も、`―`（U+2015）と同じく `-` にする。

例: `normalizeLawNum('昭和二十四年人事院規則一‐一')`、`normalizeLawNum('昭和二十四年人事院規則一‑一')`、`normalizeLawNum('昭和二十四年人事院規則一–一')`、`normalizeLawNum('昭和二十四年人事院規則一—一')`、`normalizeLawNum('昭和二十四年人事院規則一−一')` はどれも `'昭和24年人事院規則1-1'`。
:::

<a id="spec-abbr-normalize-law-num-013"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-013 罫線と長音は半角ハイフンにしない

::: details 詳細
罫線 `─`（U+2500）と長音 `ー`（U+30FC）はダッシュ類として扱わず、変えない。

例: `normalizeLawNum('昭和二十四年人事院規則一─一')` は `'昭和24年人事院規則一─一'`（漢数字は罫線の隣なので変えない。[SPEC-ABBR-NORMALIZE-LAW-NUM-015](#spec-abbr-normalize-law-num-015)）、`normalizeLawNum('昭和二十四年人事院規則一ー一')` は `'昭和24年人事院規則一ー一'`。
:::

<a id="spec-abbr-normalize-law-num-014"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-014 null と undefined には空文字を返す

::: details 詳細
`input` が `null` または `undefined` のときは `''` を返す。

例: `normalizeLawNum(null)` も `normalizeLawNum(undefined)` も `''`。
:::

<a id="spec-abbr-normalize-law-num-015"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-015 年・番号の位置に無い漢数字は変えない

::: details 詳細
漢数字の並びを算用数字にするのは、直後が `年` か `号`、直前が `第`、直前か直後がダッシュ（`-` に揃えた後）のどれかのときだけ。地名や語の一部にある漢数字は変えない。

例: `normalizeLawNum('千葉県条例第一号')` は `'千葉県条例第1号'`（v0.6.1 では `'1000葉県条例第1号'`）。`normalizeLawNum('三重県')` は `'三重県'`。`normalizeLawNum('平成十五年一般法律第三号')` は `'平成15年一般法律第3号'`（`一般` の `一` は変えない）。`normalizeLawNum('昭二五・一〇・二五')` は `'昭二五・一〇・二五'`（`年` `第` `号` ダッシュのどれにも隣り合わない）。
:::

<a id="spec-abbr-normalize-law-num-016"></a>

### SPEC-ABBR-NORMALIZE-LAW-NUM-016 桁数の大きい算用数字も丸めない

::: details 詳細
算用数字の先頭の 0 を取るときに、桁数によらず並びをそのまま残す。数値に変換して丸めることはしない。

例: `normalizeLawNum('昭和25年法律第12345678901234567890号')` は `'昭和25年法律第12345678901234567890号'`（v0.6.1 では `'昭和25年法律第12345678901234567000号'`）。`normalizeLawNum('昭和25年法律第00012345678901234567890号')` も同じ文字列。
:::

## 検討中のこと

仕様を書き起こしたときに見つかった項目のうち、扱いを Issue で検討しているものです。ここに挙げたことは、今後の版で変わることがあります。開くと、元の仕様書の記述をそのまま読めます。

::: details 仕様書の「未決」の節
初版起こしで見つけた、意図か不具合かを人が決める項目です。決まったら「できること」に ID を振るか、`specs/changes/` の差分にします。

意図か不具合かの判断が要る項目は houki-abbreviations の Issue に移し、ここには題と Issue の番号だけを残します。今の振る舞いのままでよくテストが無いだけの項目は、受入テストを書いてから「できること」に ID を振ります。

1. **数字でない語の中の漢数字も算用数字になる。** → [SPEC-ABBR-NORMALIZE-LAW-NUM-015](#spec-abbr-normalize-law-num-015)
2. **読めない漢数字の並びはそのまま残す。** → [SPEC-ABBR-NORMALIZE-LAW-NUM-010](#spec-abbr-normalize-law-num-010)
3. **`元年` は場所を問わず `1年` になる。** → [SPEC-ABBR-NORMALIZE-LAW-NUM-011](#spec-abbr-normalize-law-num-011)
4. **ダッシュ類のうちテストがあるのは `―`（U+2015）だけ。** → [SPEC-ABBR-NORMALIZE-LAW-NUM-012](#spec-abbr-normalize-law-num-012)、[SPEC-ABBR-NORMALIZE-LAW-NUM-013](#spec-abbr-normalize-law-num-013)
5. **桁数の大きい算用数字で値が変わる。** → [SPEC-ABBR-NORMALIZE-LAW-NUM-016](#spec-abbr-normalize-law-num-016)
6. **`null` / `undefined` を渡したとき。** → [SPEC-ABBR-NORMALIZE-LAW-NUM-014](#spec-abbr-normalize-law-num-014)
:::

## 承認の履歴

この機能の仕様が、いつ、どの変更で承認されたかを新しい順に並べています。各リポジトリの `npx spec-ids history normalize_law_num` と同じ内容です。変更の名前から、変更の理由と前後の振る舞いを書いた文書（GitHub）を開けます。

::: details 承認の履歴（4 件）
| 承認日 | 版 | 変更 | 仕様 PR |
|---|---|---|---|
| 2026-09-30 | v0.7.0 | [関数ごとの全角・ダッシュ類・大文字の扱いを揃える（T3 正規化）](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/releases/v0.7.0/20261001-normalize/proposal.md) | [#30](https://github.com/shuji-bonji/houki-abbreviations/pull/30) |
| 2026-09-27 | v0.6.1 | [テストが無いだけの振る舞いに仕様 ID を振る](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/releases/v0.6.1/20260927-untested-behaviors/proposal.md) | [#27](https://github.com/shuji-bonji/houki-abbreviations/pull/27) |
| 2026-09-27 | v0.6.1 | [「未決」のうち判断が要る 52 件を Issue に移す](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/releases/v0.6.1/20260927-undecided-to-issues/proposal.md) | [#26](https://github.com/shuji-bonji/houki-abbreviations/pull/26) |
| 2026-09-27 | — | 初版 | [#10](https://github.com/shuji-bonji/houki-abbreviations/pull/10) |
:::

## 関連ページ

このページの元になった文書と、あわせて読むページです。

- [houki-abbreviations の仕様の一覧](/specs/houki-abbreviations/)
- [houki-abbreviations の解説](/lib/houki-abbreviations)
- [normalizeLawNum の関数のページ（リファレンス）](/reference/lib/houki-abbreviations/normalize_law_num)
- [元の仕様書（GitHub、v0.7.0）](https://github.com/shuji-bonji/houki-abbreviations/blob/v0.7.0/specs/current/normalize_law_num/spec.md)
