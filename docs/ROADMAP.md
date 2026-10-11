# ROADMAP — 法規シリーズで、いま開いている項目

最終更新: 2026-10-12（JST）。

このファイルは「次に何をするか」の順序だけを持ちます。

- 各部品の版は `stack.json`（`npm view` の実測。`stack-check.yml` が毎日照合）と、サイトの[現状と予定](https://shuji-bonji.github.io/houki-hub/guide/roadmap)にあります。ここには書きません
- 済んだことの経緯は各リポジトリの CHANGELOG と `docs/notes/`（日付付き）にあります。ここには書きません
- 決めたことは `docs/DECISIONS.md` にあります
- 2026-09-21 までの旧 ROADMAP（版の表・Discussion #20 / #24 の割り付け・履歴）は `docs/notes/2026-10-12-roadmap-archive-until-2026-09-21.md` に移しました

> Issue 番号は 3 つのリポジトリで独立に振られています。`egov#` = houki-egov-mcp、`nta#` = houki-nta-mcp、`abbr#` = houki-abbreviations、`hub#` = houki-hub

## 次（着手順。時期は未定）

サイトの「予定している部品」の timeline と同じ順序です。順序を変えるときは両方を直します。

1. **houki-nta-mcp v1.0.0 の判定**
   - ローカル DB を現行データで作り直し（`--bulk-download-everything`）、全 14 ツールを最終確認する
   - nta#3（synonym 展開）を v1.0 に含めるかを決める。含めるなら houki-abbreviations の `expandToFormalNames`（下記 4）が先
   - 完了後 1 か月の soft 期間を置いてから v1.0.0。計画書は nta の `docs/PHASE6.md`
2. **houki-metadata-mcp の着手**（3 つ目の MCP）
   - 主用途は「公布されたがまだ施行されていない期間」の追跡（J-SOX 型）。公布日・施行日・改正予定を横断して引く
   - 3 つ目の MCP なので、houki-abbreviations のルーティング（`source_mcp_hint`）の再評価の契機になる
   - houki-mhlw / houki-saiketsu / houki-court の着手順は、metadata-mcp の後に決める
3. **houki-research の workflow 追加: `revision-tracking.md`**（上記 2 と対。MCP の完成を待たずに書ける）
   - examples の追加: 相続税改正
4. **houki-abbreviations: synonym 展開 `expandToFormalNames`**（nta#3 と連動。版は決めない）
   - `verify-law-ids.mjs` の月次 GitHub Actions 化（雛形のみの状態）
   - `isValidLawId` の DF 系・M 省令系パターン
   - 任意: toolchain を Biome / TS 7 に揃える（MCP 2 つは Biome、abbr は ESLint + Prettier）
5. **検査の移植**（hub。README の「検査」の表で「未移植」になっているもの）
   - `skill-contract-probe.mjs`: houki-research が分岐に使うフィールド（`isError` / `code` / `legal_status` / `freshness`）が公開版の応答にあるか
   - `version-mentions.mjs`: 文中の版が未来の版になっていないか
6. **better-sqlite3 と Node 22 以上の見直し（調査）**（hub#23）
   - 標準の `node:sqlite` で FTS5・トリガ・WAL・プリペアドステートメントが満たせるか
   - 満たせる場合、`engines` の `>=22.0.0` を上げる必要があるか。上げると Claude Desktop の同梱 Node で動かなくなるか
   - 移行しない場合の代替（ビルド失敗時に読み取り専用へ落とす、など）。結論は `docs/DECISIONS.md` へ

## 本筋外（優先度は上記の後）

`docs/notes/2026-08-25-scope-and-professional-use.md` に記録済み。相談メモ、士業ルーティング、e-shiwake 組み込み時の有償化、士業向け profile。
本筋（国民が法規を知り活用する）の妨げにならない範囲で、必要になったときに再開する。
