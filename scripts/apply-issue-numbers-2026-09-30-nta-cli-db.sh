#!/usr/bin/env bash
#
# houki-nta-mcp の spec/20260930-cli-db-undecided-to-issues にある仮の Issue 番号
# （#ISSUE-01〜#ISSUE-07）を、create-issues-2026-09-30-nta-cli-db.sh が残した created.tsv の
# 実際の番号に置き換える。コミットはしない（差分を確かめてから amend する）。
#
#   使い方:  ./scripts/apply-issue-numbers-2026-09-30-nta-cli-db.sh [houki-nta-mcp のパス]
#            既定のパスは mcp/houki-nta-mcp
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MAP="$ROOT/docs/notes/issues-2026-09-30-nta-cli-db/created.tsv"
TARGET="${1:-$ROOT/mcp/houki-nta-mcp}"
BRANCH="spec/20260930-cli-db-undecided-to-issues"
EXPECTED=7

[ -s "$MAP" ] || { echo "created.tsv がありません。先に create-issues-2026-09-30-nta-cli-db.sh を実行してください。" >&2; exit 1; }
[ "$(wc -l < "$MAP" | tr -d ' ')" = "$EXPECTED" ] || { echo "created.tsv が ${EXPECTED} 行ではありません。" >&2; exit 1; }
current="$(git -C "$TARGET" rev-parse --abbrev-ref HEAD)"
[ "$current" = "$BRANCH" ] || { echo "$TARGET が $BRANCH ではありません（今は ${current}）。" >&2; exit 1; }

files=$(git -C "$TARGET" grep -l '#ISSUE-[0-9][0-9]' -- specs || true)
[ -n "$files" ] || { echo "仮の番号が見つかりません（置き換え済みの可能性があります）。" >&2; exit 1; }

while IFS=$'\t' read -r file number _url; do
  key="${file%%-*}"
  for f in $files; do
    # 置換の後ろに数字が続かないように、#ISSUE-NN の後ろを数字以外に限る
    perl -0pi -e "s/#ISSUE-${key}(?![0-9])/#${number}/g" "$TARGET/$f"
  done
  echo "  #ISSUE-${key} → #${number}"
done < "$MAP"

left=$(git -C "$TARGET" grep -c '#ISSUE-' -- specs || true)
[ -z "$left" ] || { echo "置き換わらなかった仮の番号があります:" >&2; echo "$left" >&2; exit 1; }
echo
echo "置き換えました。確かめてから、次を実行してください:"
echo "  git -C \"$TARGET\" diff --stat"
echo "  git -C \"$TARGET\" commit -a --amend --no-edit"
