# 段階 1（横断の決定）の Issue へのコメント下書き（2026-09-29）

`../2026-09-29-plan-spec-issues.md` の段階 1 の成果物です。2026-09-29 JST に shuji が採用した T1〜T5 の規則を `../../DECISIONS.md` の「決定済み」に写し、種類 B（横断の判断）の Issue 28 件に、その規則が各 Issue の「決めること」にどう答えるかをコメントします。コメントの本文がこのディレクトリの Markdown で、投稿は `scripts/comment-issues-2026-09-29-decisions.sh`（gh CLI）で行います。

## コメントの対象（種類 B、28 件）

| リポジトリ | テーマ | Issue | 本文 |
|---|---|---|---|
| houki-egov-mcp | T1 | #47・#48・#53・#54・#57 | `egov-47.md` `egov-48.md` `egov-53.md` `egov-54.md` `egov-57.md` |
| houki-egov-mcp | T2 | #46・#49・#69 | `egov-46.md` `egov-49.md` `egov-69.md` |
| houki-egov-mcp | T3 | #52 | `egov-52.md` |
| houki-egov-mcp | T4 | #64・#65・#66 | `egov-64.md` `egov-65.md` `egov-66.md` |
| houki-egov-mcp | T5 | #56 | `egov-56.md` |
| houki-nta-mcp | T1 | #66（形の検査）・#67・#68・#69・#79 | `nta-66.md` `nta-67.md` `nta-68.md` `nta-69.md` `nta-79.md` |
| houki-nta-mcp | T2 | #64・#65 | `nta-64.md` `nta-65.md` |
| houki-nta-mcp | T3 | #66（全角の部分） | `nta-66.md`（T1 と同じ本文） |
| houki-nta-mcp | T4 | #71・#82 | `nta-71.md` `nta-82.md` |
| houki-nta-mcp | T5 | #70 | `nta-70.md` |
| houki-abbreviations | T3 | #21・#19・#24 | `abbr-21.md` `abbr-19.md` `abbr-24.md` |
| houki-abbreviations | T1 | #22 | `abbr-22.md` |
| houki-abbreviations | T5 | #17 | `abbr-17.md` |

各本文は「決定の要点と、この Issue の『決めること』への答え」「対応する版と進め方」「出典」の 3 節です。決定では答えきれない箇条書きは「仕様 PR で決めます」と書いています。

## 「決めない」候補（計画書 5.4。shuji の確認待ち）

計画書 5.4 の「今の動きを意図として仕様に書けば閉じられるもの」に当たると考える Issue です。動きを変えない決定は「実装の変更: 不要」の仕様 PR だけで済み、劣化の危険がありません。どれも種類 C（単独の判断）で、コメントはまだ書いていません。shuji が「今の動きを意図とする」と決めたものから、段階 3・5 の仕様 PR に「実装の変更: 不要」で入れます。

| Issue | 今の動きを意図とするときに仕様に書くこと | 理由 | 注意 |
|---|---|---|---|
| houki-abbreviations #16 | 辞書の実数（総数 174 など）は約束にしない。`getAbbreviationStats()` の `byCategory` / `byDomain` / `bySourceMcpHint` には 1 件以上ある値だけがキーとして入り、0 件の種別は `undefined`（例: `byCategory.hanrei`） | 計画書 5.4 の例。実数を固定するとエントリを足すたびに仕様が変わる。0 件のキーを `0` にする案は T4（`null` を入れる）と考え方が近いが、ライブラリの返り値の型を `Record<Category, number>` に変える変更になる | 0 件を `0` で返す側に倒すなら、#17 の README の件数の行と合わせて仕様 PR に入れる |
| houki-nta-mcp #67 | `nta_search_bunshokaitou` / `nta_search_jimu_unei` / `nta_search_kaisei_tsutatsu` の `taxonomy` は列挙で検査せず、DB に無い値のときは `available_taxonomies` で正しい値を返す | 計画書 5.4 の例。税目フォルダは国税庁サイトの構成で増えるので、列挙にすると増えるたびに inputSchema を変えることになる。T1 の規則（数値・日付・必須の文字列）の対象外 | 3 ツールの説明文に「DB に無い値のときは `available_taxonomies` で正しい値を返す」を足す（T5）。`nta-67.md` のコメントにこの候補を書いてある |
| houki-egov-mcp #62 | `explain_law_type` の `通知` は `通達` の別名ではなく独立の種別（`info.name: "通知"`） | 計画書 5.4 の例。`通達` の別名の `通知` を消すだけで矛盾が無くなる | 法令種別コード（`Rule` / `ImperialOrdinance` / `Constitution`）を解説に結び付ける部分は動きを変えるので、この候補には含めない。#62 は「通知」の行だけ「実装の変更: 不要」、コードの行は段階 5（egov 0.18.0）の仕様 PR |
| houki-abbreviations #13 | エントリ・`aliases`・公開定数は `Object.freeze` しない。「返り値は辞書のエントリそのもので、書き換えてはいけない」を仕様と README に書く | Issue の 3 つ目の選択肢がそのまま「決めない」。凍結すると利用側が書き換えていたときに `TypeError` になり、計画書 5.1 の grep（egov・nta の `src/`）が要る | 計画書の段階 3 の表 4 行目は凍結する前提（`spec/<日付>-freeze`）で書いてあるので、凍結しないならその行を消す |
| houki-abbreviations #20 | `findSimilar` / `suggestCorrection` は近い名前を返す関数で、訂正の候補とは限らない。query の最短文字数と長さ補正は設けない | Issue の 3 つ目の選択肢がそのまま「決めない」。ロードマップの設計上の課題 2（Levenshtein 単独か長さ補正か）は結論が出ていない | #24 の `levenshtein` をコードポイント単位にする決め方と合わせて見る |
| houki-abbreviations #23 | `isValidLawId` は元号の桁と府省コードの範囲を確かめない（形だけを見る）。`M` の次の 1 文字の注記を「1〜6」から実際の検査に合わせて直す | Issue の「注記を直す」の選択肢。狭めると e-Gov 全件を受け付けることを CI で確かめ続ける必要が出る | 憲法の形（`321CONSTITUTION`）だけ狭めるかは別に決める |
| houki-nta-mcp #72 | `nta_search_qa` の `domain` は残し、`tax` 以外のときの DB の有無の確認は今のまま | 引数を外すと inputSchema が変わり（計画書 5.1 の「フィールドを消す変更」と同じ考え方）、houki-research-skill の例の修正が要る。egov #55 の `domain`（外す案）とは、`nta_search_qa` には `topic` が別にある点が違う | egov #55 で `domain` を外すなら、family で `domain` の扱いが 2 通りになる。同じ仕様 PR で egov と揃えて決めるほうがよい |

候補にしなかった種類 C の Issue（egov #45・#51・#63・#55・#67・#72・#58・#59・#60・#61・#71、nta #72 以外の #80・#81、abbr #18・#14・#15・#25）は、どれも今の動きをそのまま意図にすると「誤った法令・条文を根拠にする」「黙って丸める」「壊れた値が `fresh` になる」のいずれかが残るので、動きを変える側です。

## 投稿の手順

1. `DRY_RUN=1 ./scripts/comment-issues-2026-09-29-decisions.sh` で対象と本文のファイルを確かめます
2. `./scripts/comment-issues-2026-09-29-decisions.sh` で 28 件を投稿します（確認あり）。投稿した Issue と URL は `commented.tsv` に残ります
3. 投稿の後、`../2026-09-29-plan-spec-issues.md` 7 章の表に段階 1 の「済（日付）」を書き足します
