#!/usr/bin/env bash
#
# houki-nta-mcp の spec/20260927-* ブランチ（テストが無いだけの未決の差分草案）にある仮の Issue 番号
# （#ISSUE-01〜#ISSUE-04）を、create-issues-2026-09-27-nta-untested.sh が残した created.tsv の
# 実際の番号に置き換え、各ブランチの 1 つだけのコミットに amend する。署名はしない（push の前に署名する）。
#
#   使い方:  ./scripts/apply-issue-numbers-2026-09-27-nta-untested.sh [houki-nta-mcp のパス]
#            既定のパスは mcp/houki-nta-mcp
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MAP="$ROOT/docs/notes/issues-2026-09-27-nta-untested/created.tsv"
TARGET="${1:-$ROOT/mcp/houki-nta-mcp}"
BRANCHES="spec/20260927-argument-and-parse-errors spec/20260927-search-keyword-rules spec/20260927-search-hit-responses"

[ -s "$MAP" ] || { echo "created.tsv がありません。先に create-issues-2026-09-27-nta-untested.sh を実行してください。" >&2; exit 1; }
[ "$(wc -l < "$MAP" | tr -d ' ')" = "4" ] || { echo "created.tsv が 4 行ではありません。" >&2; exit 1; }
[ -z "$(git -C "$TARGET" status --porcelain)" ] || { echo "$TARGET に未コミットの変更があります。" >&2; exit 1; }
start="$(git -C "$TARGET" rev-parse --abbrev-ref HEAD)"

for b in $BRANCHES; do
  git -C "$TARGET" checkout -q "$b"
  files=$(git -C "$TARGET" grep -l '#ISSUE-[0-9][0-9]' -- specs || true)
  if [ -z "$files" ]; then echo "$b: 仮の番号がありません（置き換え済みの可能性があります）"; continue; fi
  while IFS=$'\t' read -r file number _url; do
    key="${file%%-*}"
    for f in $files; do
      perl -0pi -e "s/#ISSUE-${key}(?![0-9])/#${number}/g" "$TARGET/$f"
    done
  done < "$MAP"
  left=$(git -C "$TARGET" grep -c '#ISSUE-' -- specs || true)
  [ -z "$left" ] || { echo "$b: 置き換わらなかった仮の番号があります:" >&2; echo "$left" >&2; exit 1; }
  git -C "$TARGET" commit -q -a --amend --no-edit
  echo "$b: 置き換えて amend しました"
  git -C "$TARGET" show --stat --oneline HEAD | head -3
done
git -C "$TARGET" checkout -q "$start"
