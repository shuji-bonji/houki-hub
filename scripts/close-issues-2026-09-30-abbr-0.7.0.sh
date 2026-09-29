#!/usr/bin/env bash
#
# 段階 3（houki-abbreviations 0.7.0）で対応した Issue 13 件（#13〜#25）に、
# 「決めること」への答えをコメントしてから閉じる（--reason completed）。
# 本文は docs/notes/issues-2026-09-30-abbr-0.7.0-close/ の Markdown（abbr-NN.md）。
#
#   使い方:  DRY_RUN=1 ./scripts/close-issues-2026-09-30-abbr-0.7.0.sh   # 何をするかだけ表示
#            ./scripts/close-issues-2026-09-30-abbr-0.7.0.sh             # 実行（確認あり）
#
# 投稿したコメントの URL は docs/notes/issues-2026-09-30-abbr-0.7.0-close/closed.tsv に残す。
# 同じ Issue に二重に投稿しないよう、closed.tsv にある Issue は飛ばす。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-abbreviations"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-30-abbr-0.7.0-close"
MAP="$BODY_DIR/closed.tsv"
DRY_RUN="${DRY_RUN:-0}"

# number <TAB> file
TABLE=$(cat <<'TSV'
13	abbr-13.md
14	abbr-14.md
15	abbr-15.md
16	abbr-16.md
17	abbr-17.md
18	abbr-18.md
19	abbr-19.md
20	abbr-20.md
21	abbr-21.md
22	abbr-22.md
23	abbr-23.md
24	abbr-24.md
25	abbr-25.md
TSV
)
COUNT=$(printf '%s\n' "$TABLE" | wc -l | tr -d ' ')

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "コメントして閉じる Issue: ${OWNER}/${REPO} の ${COUNT} 件"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r number file; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  printf '  #%-4s %s\n' "$number" "$file"
done
echo

if [ "$DRY_RUN" = "1" ]; then
  echo "(DRY_RUN=1 のため、ここで終了します)"
  exit 0
fi

printf '上記の %s 件にコメントを投稿し、--reason completed で閉じます。よろしいですか [y/N]: ' "$COUNT"
read -r ans
case "$ans" in
  y|Y) ;;
  *) echo "中止しました。"; exit 1 ;;
esac

touch "$MAP"
while IFS=$'\t' read -r number file; do
  if grep -q "^${number}	" "$MAP"; then
    # コメントは済み。前回 close の前に止まっていたときのために、開いていれば閉じる
    state="$(gh issue view "$number" -R "$OWNER/$REPO" --json state -q .state)"
    if [ "$state" = "OPEN" ]; then
      gh issue close "$number" -R "$OWNER/$REPO" --reason completed >/dev/null
      echo "  閉じた #${number}（コメントは closed.tsv にあるので投稿しません）"
    else
      echo "  済み #${number}（closed.tsv にあるので飛ばします）"
    fi
    continue
  fi
  url="$(gh issue comment "$number" -R "$OWNER/$REPO" --body-file "$BODY_DIR/$file")"
  printf '%s\t%s\n' "$number" "$url" >> "$MAP"
  gh issue close "$number" -R "$OWNER/$REPO" --reason completed >/dev/null
  echo "  投稿して閉じた #${number} $url"
done <<< "$TABLE"

echo
echo "完了しました。投稿したコメント:"
cat "$MAP"
