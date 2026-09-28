# houki を業務の名前で見つけてもらうための修正（2026-09-29）

日本の法令系 MCP の比較記事で houki が紹介されない原因のうち、名前の付け方と README の書き方を直した記録です。取り込みの手順、GitHub の設定で直すもの、残りの作業をまとめています。

## 経緯

2026-09-28 JST の相談で、次のことが分かりました。

- 公式 MCP Registry と Glama への登録は、すでに済んでいる（`io.github.shuji-bonji/houki-nta-mcp` 0.21.1 が Registry に載っている。Glama の egov・nta のページも 200 を返す）
- 比較記事は「税法 MCP」「労務法 MCP」のように業務の名前で候補を選ぶ。houki の npm の説明と keywords には、「税法」「税務」「通達」のような業務の名前が無い
- houki-hub の README は、2 段落目で「結論・可否・金額は返さない」、その下で「対象はエンジニア」と書いていた。制限と対象外の読者が先に目に入る
- egov の README の「まず試す」は「9 ツールのうち 8 つ」のままで、今の 14 ツールと合っていない

## 変更したもの

| リポジトリ | ブランチ | コミット | 版 |
| --- | --- | --- | --- |
| houki-egov-mcp | `docs/20260929-discoverability` | `1f5af70` 説明・keywords・README / `5f5bd1b` package-lock.json の版 | 0.15.3 |
| houki-nta-mcp | `docs/20260929-discoverability` | `f3bfa81` 説明・keywords・README | 0.21.2 |
| houki-hub | main | README の冒頭とこのメモ | — |

いずれも実行されるコードは変えていません。MCP の 2 本は未署名・未 push で、コミットの番号は署名すると変わります。

### npm の説明と keywords

- egov の `description`: 日本語の文に「税法・労働法・会社法・民法など全分野の条文を LLM から引けます。」を足した（211 文字）
- nta の `description`: 日本語の文を「税務の下調べで、国税庁の通達と事例を LLM から引くための MCP サーバー。」で始めた（215 文字）
- 英語の 1 文と `server.json` の `description`（Registry の上限 100 文字）は変えていない。houki-hub#29 の「日本語 → 英語」の形も保った
- keywords に英語の `japanese-law` `tax-law` などと、日本語の `法令` `条文` `税法` `税務` `通達` `質疑応答事例` などを足した。plugin.json の keywords も同じ方向で足した

### README

- 3 つとも、冒頭を「できること」から書き始めた。返すもの・件数・相談の形の問いの例を先に置いた
- 相談の形の問いの例は、「会社員で、副業の所得が 20 万円以下なら確定申告はしなくてよいか」。2026-09-28 JST に実際に呼んだ結果（egov の `get_law` で所得税法第 121 条第 1 項、nta の `nta_search_tax_answer` でタックスアンサー 1900・1906）をもとに書いた
- houki-hub の README では、「しないこと」を「利用上の注意」の節に移した。削除はしていない
- houki-hub の README から「現時点の対象はシステム開発・運用・管理を行うエンジニア」の 1 文を外し、「税務・労務・会社の手続きなどを調べるときや、システムを作る前に仕様が法令のどこに触れるかを確かめるとき」と用途で書いた

### 件数の出典

nta の件数は、手元の `~/.cache/houki-nta-mcp/cache.db` を読み取り専用で数えた実数です（全種別の取り込みは 2026-09-07〜09-24 JST）。

| doc_type | 件数 |
| --- | ---: |
| 基本通達 4 種の項（消基通 551・所基通 1,182・法基通 1,293・相基通 430） | 3,456 |
| `kaisei` | 118 |
| `jimu-unei` | 32 |
| `bunshokaitou` | 487 |
| `tax-answer` | 746 |
| `qa-jirei` | 1,841 |

## 取り込みの手順

MCP の 2 本は、いつもの PR の手順で取り込みます。

1. 各ブランチで署名する: `git rebase --exec 'git commit --amend --no-edit -S' main`
2. ブランチを push し、下の本文で PR を作る
3. CI（lint・format・テスト・spec-gate・pr-scope）が通ったら、`git merge --ff-only` で main に入れて push する
4. タグ（egov `v0.15.3` / nta `v0.21.2`）を push し、publish.yml で npm に公開する。MCP Registry は `mcp-publisher publish` で更新する
5. houki-hub で `node scripts/generate-stack.mjs --readme` を回し、構成表の版を更新する（VM の `npm view` は 403 になるため手元で）

### PR 本文（houki-egov-mcp）

```markdown
## 概要

業務の名前（税法・労働法など）で MCP を探す人に見つかるよう、npm の説明と keywords、README の冒頭を直します。実行されるコードは変えません（0.15.3）。

## 変更

- package.json の description に「税法・労働法・会社法・民法など全分野の条文を LLM から引けます。」を足す（211 文字）
- keywords・plugin.json の keywords に japanese-law・tax-law・labor-law と日本語の 法令・条文・税法 などを足す
- README の冒頭に「できること」と、所得税法第 121 条第 1 項を使った相談の形の問いの例を置く
- 「まず試す」の「9 ツールのうち 8 つ」を「14 ツールのうち 13」に直す
- package-lock.json の先頭 2 か所が 0.14.0 のままだったので 0.15.3 に揃える

経緯は houki-hub の docs/notes/2026-09-29-discoverability.md にあります。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01KQJii2YPgrRZhRXKwThNaH
```

### PR 本文（houki-nta-mcp）

```markdown
## 概要

業務の名前（税法・税務・通達など）で MCP を探す人に見つかるよう、npm の説明と keywords、README の冒頭を直します。実行されるコードは変えません（0.21.2）。

## 変更

- package.json の description を「税務の下調べで、国税庁の通達と事例を LLM から引くための MCP サーバー。」で始める（215 文字）
- keywords・plugin.json の keywords に japanese-law・tax-law と日本語の 国税庁・税法・税務・通達・質疑応答事例 などを足す
- README の冒頭に「できること」（6 種類の文書の件数と legal_status の表）、相談の形の問いの例（タックスアンサー 1900・1906 と所得税法第 121 条第 1 項）、「まず試す」（設定と --quickstart）を置く

件数は 2026-09-07〜09-24 JST に全種別を取り込んだ手元の DB の実数です。経緯は houki-hub の docs/notes/2026-09-29-discoverability.md にあります。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01KQJii2YPgrRZhRXKwThNaH
```

## GitHub の設定で直すもの

GitHub の About（description・topics）はコードではないため、手元の `gh` で直します。topics は英小文字・数字・ハイフンだけで、日本語は使えません。egov の `leagal` は `legal` の打ち間違いです。

```sh
gh repo edit shuji-bonji/houki-egov-mcp \
  --remove-topic leagal \
  --add-topic legal,statute,tax-law,labor-law,legal-research,e-gov \
  --description "日本の法令（憲法・法律・政令・省令・規則）を e-Gov 法令API v2 から、条・項・号の単位で、法令番号と URL を添えて返す MCP サーバー。税法・労働法・会社法・民法など全分野の条文を LLM から引けます。 Japanese statutes from e-Gov Law API v2 — laws and ordinances per article, with law number and URL."

gh repo edit shuji-bonji/houki-nta-mcp \
  --add-topic tax-law,japanese-tax,qa-jirei,tax-answer,legal-research,accounting \
  --description "税務の下調べで、国税庁の通達と事例を LLM から引くための MCP サーバー。基本通達・改正通達・事務運営指針・文書回答事例・タックスアンサー・質疑応答事例を全文検索し、legal_status と根拠条文への案内と鮮度を添えて返します。 Japan NTA tax notices (tsutatsu) and Q&A, marked with legal_status and linked back to the law."

gh repo edit shuji-bonji/houki-hub \
  --add-topic mcp-server,japan,tax-law,e-gov,nta,claude-skills

gh repo edit shuji-bonji/houki-research-skill \
  --add-topic tax-law,houki
```

## 残りの作業

2026-09-28 JST の相談で挙げた改善の段階のうち、この修正で扱っていないものです。

- 士業・バックオフィス向けの記事を 1 本書き、X で告知する
- 比較記事の書き手に、掲載の検討材料（リポジトリ・収録範囲・1 行の導入）を送る
- npm の週間ダウンロード数を起点として記録する（2026-09-21〜09-27: egov 780、nta 1,647。GitHub のスター: egov 2、nta 2、hub 0、skill 0）
- houki-hub のサイト（`site/`）の hero を、同じ方針で書き直す（`site/` は取り込み方を都度確認する）
