# 作業計画: houki-research-skill に、質疑応答事例から法律本文と通達へ戻る手順を足す

対象リポジトリ: houki-research-skill（2026-09-11 作成）
作業場所: `/Users/bonji/workspace/shuji-bonji/skills/houki-research-skill`（houki-hub の `skill/` はここへのシンボリックリンク）
起票: 不要（skill の変更は issue を立てずに進めてきた。立てる場合は下の「背景」と「変更」をそのまま本文にできる）
版の案: **v0.5.0**（手順を足し、前提 MCP の版を上げるため。v0.4.0 と同じ扱い）

---

## 背景

houki-nta-mcp v0.12.0（2026-09-11 publish、#22）で、`nta_get_qa` を `format: "json"` で呼ぶと次のフィールドが付くようになりました。

| フィールド | 中身 |
| --- | --- |
| `related_laws` | 【関係法令通達】の法令の参照。`law_name`・`article`・`paragraph`・`item`（別表なら `appendix`）・`raw` |
| `related_tsutatsu` | 同じ欄の通達の参照。`name`・`clause`・`raw` |
| `next_actions` | houki-egov-mcp の `get_law`（条・項・号まで入る）と `nta_get_tsutatsu` への案内。成功時にも付く |
| `qa.notice` / `qa.basisDate` | ページ下部の国税庁の注記と、その基準日（例: `2025-08-01`） |

houki-research-skill v0.4.0 は、通達（`nta_get_tsutatsu` / `nta_search_tsutatsu`）から法律本文へ戻る手順を持っていますが、**質疑応答事例（`nta_get_qa` / `nta_search_qa`）には触れていません**。SKILL.md の MCP の表に「QA」とあるだけで、手順・citation の例・アンチパターンのどこにも `nta_get_qa` が出てきません（2026-09-11 に `grep -rn "nta_get_qa\|質疑" skills/` で確認）。

質疑応答事例は通達よりさらに拘束力が弱い参考資料（`legal_status` の `binds_*` がすべて `false`）なので、根拠の条文へ戻る手順が通達以上に必要です。

## v0.12.0 の応答の実例（2026-09-11、plugin で取得）

`{ "topic": "shohi", "category": "02", "id": "19", "format": "json" }` の抜粋:

```jsonc
{
  "qa": {
    "title": "個人事業者が所有するゴルフ会員権の譲渡",
    "relatedLaws": ["消費税法第2条第1項第8号、消費税法基本通達5-1-1"],
    "notice": "令和7年8月1日現在の法令・通達等に基づいて作成しています。…",
    "basisDate": "2025-08-01"
  },
  "related_laws": [
    { "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8, "raw": "消費税法第2条第1項第8号" }
  ],
  "related_tsutatsu": [
    { "name": "消費税法基本通達", "clause": "5-1-1", "raw": "消費税法基本通達5-1-1" }
  ],
  "next_actions": [
    { "action": "delegate_to_mcp", "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8 } },
    { "action": "nta_get_tsutatsu", "example": { "name": "消費税法基本通達", "clause": "5-1-1" } }
  ]
}
```

`next_actions` が付かない参照（`related_laws` / `related_tsutatsu` には入る）:

| 参照 | 例 | skill での扱いの案 |
| --- | --- | --- |
| 租税条約 | gensen/06/04「日・ハンガリー租税条約第12条第2項(b)」 | e-Gov では引けない。`raw` を citation に書き、条約の本文は確認していないと明記 |
| 「旧」「改正前」の条文 | — | `get_law_revisions` で改正の時点を調べ、その前の日付を `get_law` の `at` に渡す。時点が決まらなければ `raw` だけ書く（`basisDate` は質疑応答事例の作成時点で、改正前の時点ではない） |
| 条番号の無い法令 | — | `get_toc` → `get_law` |
| 基本通達 4 種以外の通達 | sozoku/18/34「租税特別措置法関係通達70の6-6」 | `nta_get_tsutatsu` は扱わない。`raw` を citation に書く |

`nta_get_qa` は `format` の既定が `markdown` です。markdown では `related_laws` などは出ず、注記は「## 注記（国税庁）」の節になります。skill の例文では `format: "json"` を指定する必要があります。

## 変更するファイル

| ファイル | 変更 |
| --- | --- |
| `skills/houki-research/SKILL.md` | 鉄則 3 の「通達を先に引いたら、法律本文へ戻る (houki-nta-mcp v0.11.0 以上)」を、質疑応答事例も含む形に広げる。表に `nta_get_qa`（`related_laws` / `related_tsutatsu` / `next_actions`、v0.12.0 以上）の行を足す。通達と違い、条・項・号が `example` に入っているので、条番号を本文から補う手順は要らないことを書く |
| `skills/houki-research/workflows/tax-research.md` | シーケンス図に質疑応答事例から入る経路を足す（④ の前後どちらに置くかは決める）。上の実例と、`next_actions` が付かない参照の扱い。アンチパターンに「質疑応答事例の回答だけで答える」「`notice` を落とす」を足す |
| `skills/houki-research/docs/CITATION.md` | 「参考情報 (拘束力なし)」の例に質疑応答事例を足す。`basisDate`（「令和7年8月1日現在の法令・通達等に基づく」）と、個別の取引では異なる課税関係が生じうるという `notice` の趣旨を注に書く |
| `skills/houki-research/docs/ARCHITECTURE.md` | 応答契約の表に `related_laws` / `related_tsutatsu` / `notice` / `basisDate` を足し、`next_actions`（成功時）の行に `nta_get_qa` を加える |
| `README.md` の前提 MCP の表 | houki-nta-mcp を **v0.12.0 以上** に上げる（理由: 質疑応答事例の `related_laws` と `next_actions`。v0.11.0 以上なら通達の手順は動く、と併記） |
| `.github/workflows/release.yml` | リリースノートの前提 MCP の版と、50 行目のコメントの履歴を README とそろえる |
| `.claude-plugin/plugin.json` | `version` を 0.5.0 に |
| `CHANGELOG.md` | `[0.5.0] - YYYY-MM-DD`（JST の日付） |

## 決めること

1. 版を 0.5.0 にするか 0.4.1 にするか（v0.4.0 は同じ種類の変更を minor にした）
2. 鉄則 3 の見出しを「通達や質疑応答事例を先に引いたら、法律本文へ戻る」に変えるか、質疑応答事例用の小見出しを別に立てるか
3. タックスアンサーをどうするか。`nta_get_tax_answer` には構造化された根拠法令が無い（「根拠法令等」は `sections` の見出しの 1 つ）ので、今回は「本文の根拠法令等の節を読んで `get_law` を引く」と書くだけにする案

## 終わったあと

- houki-hub: `site/docs/skills/houki-research.md` と `site/docs/guide/roadmap.md` の説明、`docs/ROADMAP.md` の版と履歴を更新し、ユーザーが Mac で `node scripts/generate-stack.mjs --readme` を実行
- ユーザーが Claude Plugin で houki-research を更新（0.3.0 のとき更新漏れがあった）
