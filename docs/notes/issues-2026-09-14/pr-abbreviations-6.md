## 何をしたか

法令番号の漢数字と算用数字を揃えてから照合するようにし、`isValidLawId` を e-Gov の実データに合わせました（Closes #6）。v0.6.0 として出します。

### 完了条件の確認

`lookupByLawNum('昭和二十五年法律第百三十七号')` と `lookupByLawNum('昭和25年法律第137号')` が同じ結果を返すことをテストで固定しました（`src/normalize.test.ts`、`src/lookup.test.ts`）。全角数字（`昭和２５年法律第１３７号`）と位ごとの漢数字（`昭和二五年法律第一三七号`）も同じ結果です。

### 追加した関数（`src/normalize.ts`）

- `normalizeLawNum(input)`: 法令番号を `昭和25年法律第137号` の形に揃えます。全角 → 半角、空白の除去、`元年` → `1年`、漢数字 → 算用数字、先頭の 0 の除去、ダッシュ類 → `-`。元号の別表記（`S25`）と `第` `号` の省略は揃えません（表記の揺れではなく別の書き方なので、呼び出し側で揃えます）
- `kanjiToNumber(input)`: 漢数字だけの文字列を数値にします。位取り（`百三十七`）と位ごと（`一三七`、`三〇`）の両方を読み、どちらとも読めない並び（`十十`、`二〇十`）は `null`。千の位まで

位ごとの書き方を受け付けるのは、e-Gov の実データに人事院規則の番号（`昭和二十四年人事院規則一四―五`、`九―三〇`）がこの書き方で 142 件あるためです。houki-egov-mcp v0.7.0 の `kanjiToNumber`（条番号用、位取りのみ）とは、位取りの結果は同じで、位ごとを受け付ける点だけが違います。

### 変えた挙動

- `lookupByLawNum` は入力と辞書の `law_num` の両方を `normalizeLawNum` に通してから比較します（Normalize-everywhere）。v0.5.x は漢数字の完全一致だけでした
- `isValidLawId` は、2026-09-20 に e-Gov 法令 API v2 `GET /api/2/laws` で取得した全 9,569 件の `law_id` に実在する形をすべて受け付けます（全件 15 文字）

| 形 | 件数 | 例 |
|---|---|---|
| `AC` / `CO` / `IO` / `DF` / `DT` + 10 桁 | 4,677 | `363AC0000000108`（消費税法） |
| `M` / `R` + 16 進 8 文字 + 3 桁 | 4,735 | `340M50000040011`（所得税法施行規則）、`415M60000F4A003`（共同省令） |
| `RJNJ` + 8 桁 | 142 | `324RJNJ01001000`（人事院規則一―一） |
| `RPMD` + 8 桁 | 14 | `351RPMD12230000`（内閣総理大臣決定） |
| `CONSTITUTION` | 1 | `321CONSTITUTION` |

- v0.5.x が受け付けていた `MO` / `RU` は実データに 1 件も無かったので外しました。`isValidLawId('505MO0000000020')` は `true` から `false` に変わります。辞書の 9 件（`AC` 8 件・`CONSTITUTION` 1 件）には影響しません
- `src/index.test.ts` の辞書全件チェックを `isValidLawId` に一本化しました（テスト側の緩い別パターン `[A-Z]{2}` を削除。計画 §1-3 の 2）

### 確認したこと

- `vitest`: 6 ファイル 170 件 pass、`eslint` / `tsc` は警告なし
- 手元で 9,569 件すべてについて、`isValidLawId` が `true`、`normalizeLawNum` の年と番号が API の `law_num_year` / `law_num_num` と一致することを確認しました（人事院規則 142 件は `1_1` → `1-1` の形で一致）。CI には含めていません

### 文書

- README: 正規化 API に `normalizeLawNum` / `kanjiToNumber` を追加、逆引き API の注記を更新、`isValidLawId` の表を実データの件数付きに差し替え
- CHANGELOG 0.6.0
- `docs/v0.5.1-v0.6.0-plan.md` に追記: v0.6.0 を本 Issue に入れ替え、`expandToFormalNames` は v0.7.0 以降へ

### この PR の後

- `npm version` は済み（0.5.2 → 0.6.0）。マージ後にタグ `v0.6.0` で publish
- houki-egov-mcp / houki-nta-mcp の依存 `^0.4.1` を `^0.6.0` に上げて publish し直す（両 MCP が呼ぶ `resolveAbbreviation` / `normalizeJpText` / `normalizeSearchQuery` / `listBySourceMcpHint` の動作は変わりません）
- houki-hub の `stack.json` と reference を再生成

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01FeticJk3Gm1KDoH31EYUDj
