# issue 草案: 事務運営指針の `legal_status.note` が、取得ツールと検索・PDF の一覧で違う文になっている

対象リポジトリ: houki-nta-mcp（2026-10-03 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues/131
タイトル案: 事務運営指針の `legal_status.note` を、`nta_search_jimu_unei` と `nta_inspect_pdf_meta` でも `nta_get_jimu_unei` と同じ文にする
ラベル: enhancement（`spec` ラベルはリポジトリに無い）
見つけた経緯: egov 0.17.0 / nta 0.23.0 の契約の確認（`docs/notes/2026-10-03-regression-check-egov-0.17.0-nta-0.23.0.md` の「見つかったこと」3）

---

## 起きていること

0.23.0 で、`nta_get_jimu_unei` の json の `legal_status.note` を、markdown の注と同じく事務運営指針を名指しする文に変えました（#70 の T5、`specs/releases/v0.23.0/20261003-t5-docs-mismatch/proposal.md` の「実装 PR で直す文書」3）。このとき変えたのは `nta_get_jimu_unei` だけで、同じ事務運営指針を返す次の 2 つのツールは前の文のままです。

| ツール | 応答の `legal_status.note` | 実装 |
| --- | --- | --- |
| `nta_get_jimu_unei`（json） | `通達・事務運営指針は行政内部文書であり、納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）` | `JIMU_UNEI_LEGAL_STATUS` |
| `nta_get_jimu_unei`（markdown の末尾の注） | `*通達・事務運営指針は行政内部文書であり、納税者・裁判所への直接的拘束力なし（最高裁 昭和43.12.24）*` | `handlers.ts` の文字列 |
| `nta_search_jimu_unei`（ヒットあり・0 件の両方） | `通達は行政内部文書。納税者・裁判所には直接的拘束力なし。ただし税務署員は職務として守る義務あり（最高裁 昭和43.12.24）` | `TSUTATSU_LEGAL_STATUS` |
| `nta_inspect_pdf_meta`（`docType: "jimu-unei"`） | 同上 | `LEGAL_STATUS_BY_DOCTYPE['jimu-unei']` が `TSUTATSU_LEGAL_STATUS` |

`binds_citizens` / `binds_courts` / `binds_tax_office` の値は 4 か所とも同じ（`false` / `false` / `true`）で、違うのは `note` の文だけです。

## 確かめた値（2026-10-03 JST、plugin の houki-nta-mcp 0.23.0）

- `nta_get_jimu_unei { docId: "shozei/090401", format: "json" }` → `legal_status.note` は `通達・事務運営指針は行政内部文書であり、…`
- `nta_search_jimu_unei { keyword: "書面添付", limit: 2 }` → 2 件（`hojin/090401-2`・`shozei/090401`）を返し、`legal_status.note` は `通達は行政内部文書。…`

`nta_inspect_pdf_meta` は実装（`src/constants.ts` の `LEGAL_STATUS_BY_DOCTYPE`）から判断しました。呼び出しでは確かめていません。

## 仕様との関係

今の動きは仕様どおりで、実装の誤りではありません。

- SPEC-NTA-SEARCH-JIMU-UNEI-002・003: `legal_status` は「`binds_tax_office: true` と、通達は行政内部文書である旨の注」
- SPEC-NTA-INSPECT-PDF-META-016: `kaisei` / `jimu-unei` の行は同じ注（「通達は行政内部文書で…」）

T5 で `nta_get_jimu_unei` の json を「文書だけを直す行」として変えたため、同じ事務運営指針について、取得と検索で文が分かれました。

## 影響

- 検索してから取得する流れ（SKILL の手順どおり）で、同じ文書の位置付けの注が 2 通り返る。拘束力の値は同じなので判断は変わらないが、LLM が注をそのまま引用すると、事務運営指針を「通達」と書くことがある
- 回帰確認と仕様の表で、事務運営指針の `note` の文を 2 通り覚えておく必要がある

## 方針の案

`nta_search_jimu_unei`（ヒットあり・0 件）と `nta_inspect_pdf_meta` の `docType: "jimu-unei"` を、`nta_get_jimu_unei` と同じ `JIMU_UNEI_LEGAL_STATUS` にする。

- 実装: `handlers.ts` の `nta_search_jimu_unei` の 2 か所の `legal_status: TSUTATSU_LEGAL_STATUS` を `JIMU_UNEI_LEGAL_STATUS` に、`constants.ts` の `LEGAL_STATUS_BY_DOCTYPE['jimu-unei']` を `JIMU_UNEI_LEGAL_STATUS` にする
- 仕様: 応答の値が変わるので、T5 の決め方（DECISIONS.md）では「動きを変える行」になる。仕様の差分で SPEC-NTA-SEARCH-JIMU-UNEI-002（003 は 002 を参照）と SPEC-NTA-INSPECT-PDF-META-016 の表を MODIFIED にする

## 決めること

1. **上の案で揃えるか。** 揃えない場合は、`nta_get_jimu_unei` の json を `通達は行政内部文書。…` に戻すことになる（0.23.0 の変更を戻すので勧めない）
2. **markdown の注の文も揃えるか。** `nta_get_jimu_unei` の markdown の注は「への直接的拘束力なし」で終わり、json の「には直接的拘束力なし。ただし税務署員は…」と言い回しが違う。今回は json の `note` を揃えるだけにするか、markdown の注も json と同じ文にするか
3. **どの段階で入れるか。** 段階 5 の版に含めるか、単独の patch にするか（応答の文字列だけの変更で、フィールドは増えない）

## 変わる仕様 ID（見込み）

- SPEC-NTA-SEARCH-JIMU-UNEI-002（`legal_status` の行）
- SPEC-NTA-INSPECT-PDF-META-016（`jimu-unei` の行を `kaisei` から分ける）
- 2 を揃える場合は SPEC-NTA-GET-JIMU-UNEI-006（markdown の注）

## 関連

- houki-nta-mcp #70（T5。`nta_get_jimu_unei` の json の `note` を変えた行）
- houki-nta-mcp #1（docType 別の `legal_status`。`LEGAL_STATUS_BY_DOCTYPE` を入れた Issue）
- reference-examples の `nta_search_jimu_unei`「書面添付制度の事務運営指針」の例（段階 6 で取り直すときに `note` の文が変わる）
