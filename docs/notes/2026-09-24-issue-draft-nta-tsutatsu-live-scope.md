# Issue 草案: nta_get_tsutatsu の国税庁サイトからの取得は、消費税法基本通達でしか成功しない

- 起票先: shuji-bonji/houki-nta-mcp（起票済み: #54）
- 日付: 2026-09-24（JST）
- 経緯: houki-nta-mcp#53（`specs/changes/20260924-tsutatsu-clause-forms/`）を起こす途中で見つけた。proposal.md の末尾「この差分に含めないが、確かめる中で見つけたこと」の Issue 化

---

## タイトル

nta_get_tsutatsu の国税庁サイトからの取得は、消費税法基本通達でしか成功しない（SPEC-NTA-GET-TSUTATSU-006 と実装の食い違い）

## 本文

### 何が起きているか

`nta_get_tsutatsu` は、通達が DB に無いとき、次の 4 通達は国税庁サイトから取得して返すことになっています。

- 仕様: `specs/current/nta_get_tsutatsu/spec.md` の SPEC-NTA-GET-TSUTATSU-006「DB に無い基本通達 4 種は国税庁サイトから取る」
- ツールの説明文: 「DB 投入済（`--bulk-download-all`）の場合は DB から、未投入の場合はライブ fetch」
- エラー `TSUTATSU_NOT_FOUND` の `supported_for_live`: 消費税法基本通達・所得税基本通達・法人税基本通達・相続税法基本通達

実際に国税庁サイトから取得できるのは、消費税法基本通達だけです。他の 3 通達は、DB に入っている番号をそのまま渡しても失敗します。

### 再現

v0.20.2（main `c738a1b`）の `getTsutatsu` を、空の DB（`dbPath: ':memory:'`）と実際の国税庁サイトで呼んだ結果です（2026-09-24 JST）。番号はどれも、DB が入っている環境では取得できることを確かめたものです。

| 通達 | `clause` | 結果 |
|---|---|---|
| 消費税法基本通達 | `5-1-9` | 取得できる（`source: "live"`、`shohi/05/01.htm`） |
| 法人税基本通達 | `1-1-1` | `SOURCE_API_ERROR`。`hojin/01/01.htm` を取りに行き、国税庁サイトが 404 ページへ転送する（`retryable: true`） |
| 法人税基本通達 | `1-3の2-1` | `INVALID_ARGUMENT`（clause の形式が不正） |
| 所得税基本通達 | `34-1` / `2-4の2` | `INVALID_ARGUMENT`（clause の形式が不正） |
| 相続税法基本通達 | `3-1` / `1の3・1の4共-1` | `INVALID_ARGUMENT`（clause の形式が不正） |

### 原因

国税庁サイトから取る経路は、次の 2 つを前提にしています。この前提が成り立つのは消費税法基本通達だけです。

1. **番号は「章-節-条」の 3 つに分かれる。** 所得税基本通達・相続税法基本通達の番号は「条-項」（`34-1`、`23~35共-6`、`1の3・1の4共-1`）なので、形式の検査（SPEC-NTA-GET-TSUTATSU-008）で `INVALID_ARGUMENT` になる。法人税基本通達の `1-3の2-1` のように節に枝番号が付く番号も通らない
2. **ページの URL は `{章}/{節}.htm`。** 法人税基本通達のページは `01/01_01.htm` や `01/01_03_02.htm` の形なので、組み立てた `01/01.htm` は存在しない

`docs/DESIGN.md` の「Phase 1d 調査結果: 通達ごとの URL/clause 体系の差異」の表には、所得税基本通達・法人税基本通達・相続税法基本通達は「直接組立 ❌」と書かれています。この調査結果が、ライブ取得の対象の一覧（`supported_for_live`）と仕様 006 に反映されていません。

### 誰に影響するか

`--bulk-download` を実行していない利用者です。Claude Desktop などで入れた直後の状態では、所得税基本通達・法人税基本通達・相続税法基本通達の条項を取ろうとすると、次のように失敗します。

- 法人税基本通達: `SOURCE_API_ERROR`（`retryable: true`、`next_actions` は時間をおいて再試行する案内）が返る。再試行しても成功しないので、LLM が再試行を繰り返すおそれがある
- 所得税基本通達・相続税法基本通達: `INVALID_ARGUMENT` が返る。`hint` は「他通達体系（条-項）の場合は `--bulk-download` で DB 投入してください」なので、対処はできる

DB を入れている環境では、この経路は通りません。

### 決めること

どの通達を国税庁サイトから取る対象にするかを決め、仕様・`supported_for_live`・ツールの説明文を揃えます。

| 案 | 内容 | 変えるもの |
|---|---|---|
| A. 対象を実装に合わせる | 国税庁サイトから取るのは消費税法基本通達だけにする。他の 3 通達は DB に無ければ `TSUTATSU_NOT_FOUND`（bulk download の案内）を返す | 仕様 006 と 007、`supported_for_live`、ツールの説明文。法人税基本通達の `SOURCE_API_ERROR` も無くなる |
| B. 実装を広げる | 法人税基本通達の URL の形（`{章}/{章}_{節}.htm` など）に対応する。所得税基本通達・相続税法基本通達は番号から URL を決められないので、目次ページから番号とページの対応を取る | 実装（URL の組み立て、目次の取得）と仕様 006・008。受入テストを通達ごとに足す |
| C. 国税庁サイトから取るのをやめる | DB に無ければ、どの通達も bulk download を案内する | 仕様 006・008〜010 を外す（`specs/changes/` の `REMOVED`）。書き戻しの仕組みも見直す |

案 A なら小さな変更で、今の利用者に対する誤った案内（再試行を促す `SOURCE_API_ERROR`）を無くせます。案 B は `docs/DESIGN.md` の Phase 2 の方針（目次を事前に取得して番号と URL の対応表を作る）と重なるので、bulk download の仕組みを使い回せるかの確認が要ります。

### 進め方

1. 案を決める（この Issue）
2. Spec Steward が `specs/changes/<日付>-tsutatsu-live-scope/` に差分草案を出す
3. 承認後、Coder が実装とテストを変える

### 関連

- 仕様: `specs/current/nta_get_tsutatsu/spec.md`（SPEC-NTA-GET-TSUTATSU-006〜010、未決 1）
- 差分: `specs/changes/20260924-tsutatsu-clause-forms/proposal.md`（#53）
- 調査: `docs/DESIGN.md`「Phase 1d 調査結果」、`docs/DATA-SOURCES.md`
