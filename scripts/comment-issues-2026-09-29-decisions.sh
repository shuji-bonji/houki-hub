#!/usr/bin/env bash
#
# 段階 1（横断の決定）の結果を、種類 B（横断の判断）の Issue 28 件にコメントする。
# 本文は docs/notes/issues-2026-09-29-decisions/ の Markdown（リポジトリ名-番号.md）。
#
#   使い方:  DRY_RUN=1 ./scripts/comment-issues-2026-09-29-decisions.sh   # 何をするかだけ表示
#            ./scripts/comment-issues-2026-09-29-decisions.sh             # 実行（確認あり）
#
# 投稿した Issue の URL は docs/notes/issues-2026-09-29-decisions/commented.tsv に残す。
# 同じ Issue に二重に投稿しないよう、commented.tsv にある Issue は飛ばす。
#
set -euo pipefail

OWNER="shuji-bonji"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-29-decisions"
MAP="$BODY_DIR/commented.tsv"
DRY_RUN="${DRY_RUN:-0}"

# repo <TAB> number <TAB> file
TABLE=$(cat <<'TSV'
houki-egov-mcp	46	egov-46.md
houki-egov-mcp	47	egov-47.md
houki-egov-mcp	48	egov-48.md
houki-egov-mcp	49	egov-49.md
houki-egov-mcp	52	egov-52.md
houki-egov-mcp	53	egov-53.md
houki-egov-mcp	54	egov-54.md
houki-egov-mcp	56	egov-56.md
houki-egov-mcp	57	egov-57.md
houki-egov-mcp	64	egov-64.md
houki-egov-mcp	65	egov-65.md
houki-egov-mcp	66	egov-66.md
houki-egov-mcp	69	egov-69.md
houki-nta-mcp	64	nta-64.md
houki-nta-mcp	65	nta-65.md
houki-nta-mcp	66	nta-66.md
houki-nta-mcp	67	nta-67.md
houki-nta-mcp	68	nta-68.md
houki-nta-mcp	69	nta-69.md
houki-nta-mcp	70	nta-70.md
houki-nta-mcp	71	nta-71.md
houki-nta-mcp	79	nta-79.md
houki-nta-mcp	82	nta-82.md
houki-abbreviations	17	abbr-17.md
houki-abbreviations	19	abbr-19.md
houki-abbreviations	21	abbr-21.md
houki-abbreviations	22	abbr-22.md
houki-abbreviations	24	abbr-24.md
TSV
)
COUNT=$(printf '%s\n' "$TABLE" | wc -l | tr -d ' ')

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "コメント先: ${COUNT} 件"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r repo number file; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  printf '  %-22s #%-4s %s\n' "$repo" "$number" "$file"
done
echo

if [ "$DRY_RUN" = "1" ]; then
  echo "(DRY_RUN=1 のため、ここで終了します)"
  exit 0
fi

printf '上記の %s 件にコメントを投稿します。よろしいですか [y/N]: ' "$COUNT"
read -r ans
case "$ans" in
  y|Y) ;;
  *) echo "中止しました。"; exit 1 ;;
esac

touch "$MAP"
while IFS=$'\t' read -r repo number file; do
  if grep -q "^${repo}	${number}	" "$MAP"; then
    echo "  済み ${repo}#${number}（commented.tsv にあるので飛ばします）"
    continue
  fi
  url="$(gh issue comment "$number" -R "$OWNER/$repo" --body-file "$BODY_DIR/$file")"
  printf '%s\t%s\t%s\n' "$repo" "$number" "$url" >> "$MAP"
  echo "  投稿 ${repo}#${number} $url"
done <<< "$TABLE"

echo
echo "完了しました。投稿したコメント:"
cat "$MAP"
