# 段階 6 のコントロールの会話の引き継ぎ（2026-10-10 JST）

段階 6 の計画（`2026-10-04-plan-stage6-and-followups.md`）を進めるコントロールの会話を、新しい会話に移すための文書です。状態の正本は計画書で、この文書は新しい会話の最初に渡す文と、移した時点の残りだけを書きます。

## 移した時点の状態

- houki-hub の main（ローカル）: この文書を入れたコミット。origin の main は `2d3d92e`（Y4、PR #50）。`022d332` 以降の docs/ のコミットは shuji が push する
- 各リポジトリの版: houki-egov-mcp 0.20.0、houki-nta-mcp 0.27.0、houki-research-skill 0.20.0、spec-ids 0.3.0

## 残り（計画書の「Y4 の後」の表と Q32' と同じ）

| 作業 | 状態 |
| --- | --- |
| houki-hub#48・#27 を閉じる | shuji が投稿して閉じる。文は `issues-2026-10-10-hub27-close/` |
| 指示 Y5（scope-by-audience の (1)・(2)、houki-nta.md の `--tsutatsu`） | 指示を作成済み。作業の会話に渡す |
| scope-by-audience の (3) 業法の線の言い回し（「当てはめ」の行、図の A3） | shuji の回答待ち。決まったら Y5 の PR に足すか、別の小さな PR にする |
| 指示 Z1（hub#5 ② と呼び出し例の照合のスクリプト #44 の設計と試作） | 指示を作成済み。報告を受けたら Z2（有効化と全部の例）の指示を書く |
| houki-nta-mcp の spec.md の Mermaid 3 か所 | nta の次の仕様 PR で直す |
| spec-ids#9（`spec-ids pr-scope`）・#8（spec-ids 自身の `specs/`） | 段階 4 の後 |

## 新しい会話の最初に渡す文

```text
houki-hub の「段階 6 と、前の計画の後に立った Issue の対応計画」を進めるコントロールの会話です。前の会話から引き継ぎます。この会話では実装と仕様の差分は書きません。計画書を読んで次の作業を決め、作業の会話に渡す指示書を書き、報告を受けて計画書を更新します。

## 場所

- リポジトリ: /Users/bonji/workspace/shuji-bonji/houki-hub（Cowork の device_bash では $HOME/mnt/houki-hub）
- 関係するリポジトリ: houki-egov-mcp・houki-nta-mcp・houki-abbreviations（mcps/ の下）、houki-research-skill（skills/ の下）、spec-ids（/Users/bonji/workspace/shuji-bonji/spec-ids）

## 最初に読むもの（この順）

1. docs/notes/2026-10-10-control-handover.md（この文書。移した時点の残り）
2. docs/notes/2026-10-04-plan-stage6-and-followups.md（計画書の正本）の 8 章と 9 章。特に「Y4 の後」の表と Q29'〜Q32'
3. docs/notes/2026-10-04-stage6-instructions.md の冒頭の表と、指示 Y5・Z1

## 最初にすること

- git ls-remote で origin の main と、ローカルの main の差を確かめ、push されていない docs/ のコミットがあれば私に伝える
- 残りの表から次の作業を挙げ、勧める順を書く

## 守ること

- 計画書の docs/ は main 直接でよい。site/ と .github/ は私に確認する。MCP・Skill は PR
- コミットまで。署名・push・PR・タグは私が行う
- device_bash で git を使う前に、houki-hub（と skills）の削除の許可を取る。VM の git は .git にロックファイル（HEAD.lock・next-index-*.lock・maintenance.lock・tmp_obj_*）を残すことがあるので、許可を取ってから消して進める
- GitHub の Issue・PR は、クラウド側の gh が 403 になるときは device_bash から curl で引く
- 人が判断することは、案を並べて勧める案を 1 つ書く
- 回答は日本語。比喩を使わず、何が起きるかを書く。日時は JST
```
