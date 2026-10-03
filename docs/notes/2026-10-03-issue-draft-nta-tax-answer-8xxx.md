# issue 草案: タックスアンサーの 8xxx 帯（災害関係）を取れず、番号の先頭の桁で決める税目フォルダが国税庁の索引と 129 件食い違う

対象リポジトリ: houki-nta-mcp（2026-10-03 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues/128
タイトル案: タックスアンサーの 8xxx 帯（災害関係）に対応し、記事の URL を番号の先頭の桁ではなく国税庁の索引から決める
ラベル案: bug, spec
方針: 8xxx 帯に対応する（2026-10-03 に shuji が決定）

---

## 起きていること

`nta_get_tax_answer` は、記事番号の先頭の桁から国税庁サイトの税目フォルダを決めています（SPEC-NTA-GET-TAX-ANSWER-003、`src/constants.ts` の `TAX_ANSWER_FOLDER_MAP`）。この決め方には次の 2 つの問題があります。

1. **8xxx 帯を取れません。** 先頭の桁 `8` が表に無いので、`INVALID_ARGUMENT`（「未対応」）を返し、ローカル DB も国税庁サイトも引きません（SPEC-NTA-GET-TAX-ANSWER-002）。しかし国税庁のタックスアンサーには 8xxx 帯の記事が 16 件あり（「災害を受けたら」の `saigai` フォルダ）、`--bulk-download-tax-answer` はこれを DB に入れています。そのため、`nta_search_tax_answer` が 8xxx の記事を返し、先頭のヒットが 8xxx なら `next_actions`（SPEC-NTA-SEARCH-TAX-ANSWER-006、0.23.0）が `nta_get_tax_answer` を案内しますが、その呼び出しは `INVALID_ARGUMENT` で失敗します。
2. **8xxx 以外にも、先頭の桁と税目フォルダが合わない記事が 113 件あります。** DB にある記事は DB から返すので（SPEC-NTA-GET-TAX-ANSWER-004）、bulk download 済みの環境では表に出ません。DB に無い記事を国税庁サイトから取る経路（SPEC-NTA-GET-TAX-ANSWER-005）では、誤ったフォルダの URL を引いて 404 ページに転送され、`DOC_NOT_FOUND` になります（SPEC-NTA-GET-TAX-ANSWER-013）。同じ経路で DB に書き戻す行の `taxonomy` も、表の値（誤ったフォルダ名）になります（SPEC-NTA-GET-TAX-ANSWER-006）。

## 確かめた値（2026-10-03 JST）

国税庁の索引 `https://www.nta.go.jp/taxes/shiraberu/taxanswer/code/` から記事の URL を集めると 755 件で、そのうち 129 件は、番号の先頭の桁から決めたフォルダと索引のフォルダが違います。

| 先頭の桁 | 索引のフォルダ | 件数 | 例 | 先頭の桁で決めるフォルダ |
| --- | --- | --- | --- | --- |
| 2 | `shotoku` | 37 | 2010・2011・2012・2020・2022 | `gensen` |
| 3 | `shotoku` | 1 | 3382 | `joto` |
| 3 | `hojin` | 1 | 3429 | `joto` |
| 4 | `hyoka` | 29 | 4603・4604・4605・4606・4607 | `sozoku` |
| 4 | `zoyo` | 29 | 4402・4405・4408・4410・4411 | `sozoku` |
| 7 | `hotei` | 14 | 7400・7401・7411・7421・7431 | `inshi` |
| 7 | `fufuku` | 2 | 7200・7210 | `inshi` |
| 8 | `saigai` | 16 | 8001〜8017（8010 は無い） | （表に無い） |

誤ったフォルダの URL は 404 ページへの転送になり、索引のフォルダの URL は 200 を返すことを確かめました。

| URL | 応答 |
| --- | --- |
| `/taxanswer/gensen/2010.htm` | 302 → `/error/404.htm` |
| `/taxanswer/shotoku/2010.htm` | 200 |
| `/taxanswer/sozoku/4402.htm` | 302 → `/error/404.htm` |
| `/taxanswer/inshi/7400.htm` | 302 → `/error/404.htm` |
| `/taxanswer/hotei/7400.htm` | 200 |
| `/taxanswer/joto/3429.htm` | 302 → `/error/404.htm` |
| `/taxanswer/hojin/3429.htm` | 200 |
| `/taxanswer/osirase/8001.htm` | 302 → `/error/404.htm` |
| `/taxanswer/saigai/8001.htm` | 200（題名「No.8001 災害等による期限の延長」、法令時点「令和8年4月1日現在法令等」） |

作者の DB にも 8xxx 帯のタックスアンサーが 16 件入っていました（houki-nta-mcp 0.23.0 の実装の確認）。

## 影響

- LLM が `nta_search_tax_answer` の `next_actions` のとおりに呼ぶと、8xxx の記事で `INVALID_ARGUMENT` になる（0.23.0 から）
- bulk download をしていない環境で、表の 113 件（と 8xxx の 16 件）を番号で取れない。エラーは `DOC_NOT_FOUND` で、記事が無いように見える
- 国税庁サイトから取った記事を書き戻した行の `taxonomy` が誤る。`--tax-answer-taxonomy` の値の一覧（`TAX_ANSWER_FOLDER_MAP` の値）にも `saigai`・`hyoka`・`zoyo`・`hotei`・`fufuku` が無く、これらのフォルダで絞って投入できない
- tools/list の `nta_get_tax_answer` の `no` の説明と、未対応の番号帯のエラー文（「v0.2.x では未対応」「Phase 2 で対応予定」）が実際と合わない。後者は #70 の T5 の文書 1 として直す予定だったが、8xxx 帯の扱いが決まるまで保留している（0.23.0 の `docs:` コミット）

## 方針（決まっていること）

- 8xxx 帯に対応する。`nta_get_tax_answer` は 8xxx の番号を `INVALID_ARGUMENT` にせず、DB を引き、無ければ国税庁サイトの `saigai` フォルダから取る
- SPEC-NTA-SEARCH-TAX-ANSWER-006 の `next_actions` は今のまま（8xxx も案内する）でよくなる

## 決めること

1. **記事の URL の決め方。** 次のどれにするか
   - A: ローカル DB にその番号の行があれば、その行の `source_url` を使う。無ければ、国税庁の索引（`/taxanswer/code/`）を取ってその番号の URL を探し、索引は DB（`tsutatsu_toc` と同じように）に保存して使い回す。索引に無い番号は `DOC_NOT_FOUND`
   - B: `TAX_ANSWER_FOLDER_MAP` を「先頭の桁」から「番号の範囲」の表に変え、上の 129 件を表に書く（`8` → `saigai`、`2010〜2099` → `shotoku` など）。国税庁が記事を足すと表が古くなる
   - C: B の表で取りに行き、404 ページへの転送なら索引で探し直す（A と B の組み合わせ）
   - 勧める案は A（国税庁の索引が正本で、SPEC-NTA-GET-TSUTATSU-014 の目次の使い回しと同じ考え方）。1 回の呼び出しで取るページが 2 つ（索引と記事）になることがある
2. **先頭の桁による `INVALID_ARGUMENT`（SPEC-NTA-GET-TAX-ANSWER-002）を残すか。** A にするなら、索引に無い番号は `DOC_NOT_FOUND` で足り、`0xxx` も含めて先頭の桁で断る必要が無くなる（002 を REMOVED にし、4 桁の検査 012 だけを残す案）
3. **`taxonomy` の値。** 書き戻す行の `taxonomy` を索引のフォルダ名（`saigai`・`hyoka`・`zoyo`・`hotei`・`fufuku` を含む）にするか。`--tax-answer-taxonomy` の値の一覧をどこから作るか
4. **既存の DB の行。** 国税庁サイトから取って書き戻した行で `taxonomy` が誤っているものを直すか（DB のスキーマの版を上げて直すか、次の bulk download で上書きされるのを待つか）

## 変わる仕様 ID（見込み）

- SPEC-NTA-GET-TAX-ANSWER-002（未対応の番号帯）・003（税目フォルダの決め方）・005・006（書き戻しの `taxonomy`）と、`specs/current/nta_get_tax_answer/spec.md` の番号帯の表と「処理の流れ」の図
- `cli_bulk_download` の `--tax-answer-taxonomy` の値の一覧
- 未対応の番号帯のエラー文と tools/list の `no` の説明（#70 の T5 の文書 1）

## 関連

- houki-nta-mcp #70（T5。未対応の番号帯のエラー文の行を、この Issue が決まるまで保留している）
- SPEC-NTA-SEARCH-TAX-ANSWER-006（0.23.0。検索のヒットから `nta_get_tax_answer` を案内する）
- houki-research-skill: 0.17.0 の追随（houki-hub `docs/notes/2026-10-03-stage4b-impl-instructions.md` の指示 G）で、8xxx の記事は `nta_get_tax_answer` で取れず `sourceUrl` を案内する、と今の動きを書く。この Issue を直した版で、その記述を外す
- 出典: houki-hub `docs/notes/2026-09-29-plan-spec-issues.md` の「段階 4 の進捗」、houki-nta-mcp 0.23.0 の `docs:` コミット（`0a9e13b`）
