## 何をしたか

「実装する前に、その仕様が法令のどこに触れるかを条文で確かめる」問いのための workflow を足し、workflow を問いの形で選ぶ表を SKILL.md に置きました。既存の手順（tax-research・鉄則・citation）は変えていません。

### `workflows/feasibility-check.md`（新規）

仕様の各要素が、どの法令のどの条に触れ、その条は何を求めているかを、条文・委任先（施行令・施行規則）・施行日まで揃えて返す 7 ステップです。

| ステップ | 内容 | 要点 |
|---|---|---|
| ① 業法判定 | 自己の事務なので進める | 「適法か」には答えない |
| ② 語の置き換え | 仕様の語 → 法令の語 | **探した語と探せなかった語を回答に残す**（LLM の推測なので見せる） |
| ③ 法令を探す | `search_law` / `search_fulltext` | `api-fallback` なら「法令名の一致で探した」と明示 |
| ④ 条文を取る | `get_toc` → `get_law` | 条の単位で。法令を丸ごと取らない |
| ⑤ 委任先へ下りる | `search_law` に `law_type: "CabinetOrder"` / `"MinisterialOrdinance"` | 要件の実体（保存期間・記載事項）は施行規則にある。egov#20 までの手順 |
| ⑥ 施行日 | `get_law_revisions` | `current_revision_status: "UnEnforced"` を見る。実装の稼働は数か月先 |
| ⑦ 制約の一覧 | 仕様の要素 × 条文 × 要件 × 委任先 × 通達（`legal_status`）× 施行日 × 未確認 | 「適法です」「問題ありません」は返さない |

houki-nta-mcp の基本通達 4 種に電子帳簿保存法の取扱通達が無いことを書き、無いときは「対象外」と答えて国税庁の URL を案内するようにしました。

### SKILL.md

- 「典型ワークフロー」に **問いの形 → workflow** の表。利用者が名乗る立場（エンジニア / 納税者本人 / MCP を組む開発者）ではなく、問いの形で選びます。同じ人の問いが途中で別の行に移ったら行を変えます
- `description` と「いつこの skill を使うか」に、「この仕様は法令のどこに触れるか」「この機能の法令上の要件は」を足しました（発火のため）

### そのほか

- `workflows/README.md` / `examples/README.md` / `README.md` の一覧
- `.claude-plugin/plugin.json`: 0.7.0 → 0.8.0、`description` の先頭を家族で決めた仕事の 1 行に
- CHANGELOG

## 背景

houki-hub#22 の (c) で入口の 1 行を決めたあと、利用者ごとの違いを MCP ではなく Skill の workflow に置く方針にしました（houki-hub の `docs/notes/2026-09-19-job-name-and-listing.md` §8）。その最初の実装です。

## 取り込み後

タグ `v0.8.0` を push → `release.yml` が `.plugin` を作成 → claude-plugins の `marketplace.json` を 0.8.0 に。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01GNRnL5TVWf5Chs91BpQS8w
