## 何をしたか

> 2026-09-19 追記: この内容は PR #30（`ffd6100`）で一度マージされましたが、その後 main の履歴を fixup で整理した際に main から外れ、0.9.0 / 0.9.1 はコードの変更なしの版として publish されました。同じ内容を今の main（0.9.1）の上に載せ直し、版を **0.10.0** にしています（`src/` に衝突なし。版の記述だけを直した）。

施行令・施行規則の関連付けと、条文本文からの参照抽出のツールを 2 つ足しました（Closes #20）。設計は houki-hub の `docs/notes/2026-09-19-design-egov-20-references.md` です。houki-hub#8（法令グラフ）と対象が重なりますが、MCP は法令名の規則と本文の正規表現から決定論的に引ける参照だけを返します（houki-hub `docs/ROADMAP.md` の 2026-09-14 決定）。

### `get_related_laws`

- 法令名の末尾に「施行令」「施行規則」を付けた候補（施行令・施行規則を渡したときは親の法律と兄弟）を e-Gov `/laws?law_title=` に問い合わせ、`revision_info.law_title` が完全一致した 1 件だけを `related[]` に入れます（`law_id` / `law_num` / `law_type` / `abbr` / `url`）
- 無かった候補は `not_found[]` に残します。「…の施行に関する省令」など別の名前の下位法令は対象外で、`note` にそう書きます
- 略称辞書の `lookupByLawId` / `lookupByLawNum` は使いませんでした。辞書の施行令・施行規則 13 件（所令・所規・法令・消令 …）はすべて `law_id: null` なので、逆引きしても law_id は取れません。`resolveAbbreviation`（0.4.1 にある関数）で `abbr` を付けるだけにし、依存の範囲は `^0.4.1` のままです

### `get_article_references`

- 条（または項）の `Sentence` の文字列から、① 「法令名（法令番号）第N条…」を法令番号で解決（`/laws?law_num=`）、② 「前項」「同法第N条」は `relative` で解決しない、③ 既知の名前（辞書の正式名称・同じ本文で解決済みの名前・施行令の中の「法」）+ 条項号、④ 法令名の無い条項号は `internal`、⑤ 「政令で定める」「財務省令で定める」は `delegations[]`、の順に取り出します
- 知らない名前（末尾が法・令・規則・条例）は候補名の完全一致で解決を試み、無ければ `resolved: false` のまま返します（上限 20 名）
- 条も項も無い「第N号」には、その文が属する項の番号を付けます（`get_law` は項が複数ある条で `paragraph` を求めるため）
- 委任先は法令単位で、条は特定しません。施行令の本文の「政令で定める」は自身なので `target_law.self: true`
- `coverage.note` を常に付け、正規表現で取れた範囲だけであること、網羅性を保証しないことを書きます
- 解決できた参照ごとに `get_law` の引数を、委任ごとに `search_fulltext` のキーワードを `next_actions` に入れます。`example` は `mcp` / `tool` を含みません。テストで `getLawTool.inputSchema` / `searchFulltextTool.inputSchema` の検証を通ることを確かめています

## 完了条件との対応

| Issue の完了条件 | 確認 |
|---|---|
| 所得税法から施行令・施行規則が引ける（実在確認を通ったものだけ） | 実測: `340CO0000000096`（所令）と `340M50000040011`（所規）。`not_found` は空。民法では `related` が空で `not_found` に 2 候補（テスト） |
| ある条の本文が引用している他法令の条が、法令名と条番号の形で返る | 実測（所得税法 57 条の 2 第 2 項）: 雇用保険法 第10条第5項第1号（`349AC0000000116`）、母子及び父子並びに寡婦福祉法 第31条第1号、職業能力開発促進法 第30条の3（法令番号なし。候補名の完全一致で解決）、雇用保険法 第60条の2第1項 |
| 抽出できた範囲であることが応答に書かれており、網羅性を主張していない | `note` / `coverage.note` を常に付ける（テストで文字列を確認） |
| `tools/list` の `inputSchema` に `additionalProperties: false` が入っている | 2 ツールとも `as const satisfies ToolSpec` で付け、`server.test.ts` の全ツール走査と `handlers.test.ts` の未知の引数の拒否で確認 |

## テスト

- `src/services/reference-extractor.test.ts`（14 件）: 所得税法 57 条の 2 の実文を fixture に、①〜⑤ と出現順、施行令の「法第N条」、「旧所得税法」の扱い
- `src/services/law-relations.test.ts`（5 件）: 候補生成と親名の逆引き
- `src/services/law-service.references.test.ts`（11 件）: e-Gov クライアントを差し替えて 2 ツールの応答、`next_actions[].example` が inputSchema を通ること、同じ法令番号・候補名を 1 回しか問い合わせないこと、エラー経路
- `src/tools/handlers.test.ts` に 3 件

VM では別ディレクトリに `npm ci` して vitest 348 件・`biome check`・TypeScript 5.9.3 の `tsc --noEmit`（テストを含む）を通しました。Mac で `npm test && npm run build && npm run check` をお願いします。

## 取り込み後

1. タグ `v0.10.0` で publish
2. `mcp-publisher login github && mcp-publisher publish`（`server.json` と `.claude-plugin/plugin.json` は 0.10.0 に更新済み）
3. claude-plugins の `houki-egov-mcp` を 0.10.0 に
4. houki-hub: `docs/ROADMAP.md` の「次の一手 4」の該当行に取り消し線、ツールリファレンス（`site/docs/reference/mcp/houki-egov.md`）の再生成、`stack.json` の更新
5. houki-research-skill: `workflows/feasibility-check.md` の「委任先」のステップを `get_related_laws` / `get_article_references` で書き直せます（別 PR）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_013EH5f8naaUs9HKBbEqsaTh
