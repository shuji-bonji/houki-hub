#!/usr/bin/env bash
#
# 段階 4（egov 0.16.0・0.17.0 / nta 0.22.0・0.23.0）の後片付け。
#   - houki-egov-mcp #47 にコメントして閉じる（残りの 3 つは #87 に移す）
#   - houki-egov-mcp #87 に、#47 から移した 3 つを追記する（閉じない）
#   - houki-nta-mcp #71・#82・#108 にコメントして閉じる（0.23.0 で対応。実装 PR の Closes で閉じなかった）
# 本文は docs/notes/issues-2026-10-03-stage4-close/ の Markdown。
#
#   使い方:  DRY_RUN=1 ./scripts/close-issues-2026-10-03-stage4.sh   # 何をするかだけ表示
#            ./scripts/close-issues-2026-10-03-stage4.sh             # 実行（確認あり）
#
# 投稿したコメントの URL は docs/notes/issues-2026-10-03-stage4-close/posted.tsv に残す。
# 同じ Issue に二重に投稿しないよう、posted.tsv にある Issue は飛ばす。
#
set -euo pipefail

OWNER="shuji-bonji"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-10-03-stage4-close"
MAP="$BODY_DIR/posted.tsv"
DRY_RUN="${DRY_RUN:-0}"

# repo <TAB> number <TAB> file <TAB> action（close = コメントして閉じる / comment = コメントだけ）
TABLE=$(cat <<'TSV'
houki-egov-mcp	87	egov-87.md	comment
houki-egov-mcp	47	egov-47.md	close
houki-nta-mcp	71	nta-71.md	close
houki-nta-mcp	82	nta-82.md	close
houki-nta-mcp	108	nta-108.md	close
TSV
)
COUNT=$(printf '%s\n' "$TABLE" | wc -l | tr -d ' ')

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "対象の Issue: ${COUNT} 件"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r repo number file action; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  printf '  %-16s #%-4s %-12s %s\n' "$repo" "$number" "$file" "$action"
done
echo

if [ "$DRY_RUN" = "1" ]; then
  echo "(DRY_RUN=1 のため、ここで終了します)"
  exit 0
fi

printf '上記の %s 件にコメントを投稿し、action が close の Issue は --reason completed で閉じます。よろしいですか [y/N]: ' "$COUNT"
read -r ans
case "$ans" in
  y|Y) ;;
  *) echo "中止しました。"; exit 1 ;;
esac

touch "$MAP"
while IFS=$'\t' read -r repo number file action; do
  key="${repo}#${number}"
  if grep -q "^${key}	" "$MAP"; then
    if [ "$action" = "close" ]; then
      state="$(gh issue view "$number" -R "$OWNER/$repo" --json state -q .state)"
      if [ "$state" = "OPEN" ]; then
        gh issue close "$number" -R "$OWNER/$repo" --reason completed >/dev/null
        echo "  閉じた ${key}（コメントは posted.tsv にあるので投稿しません）"
        continue
      fi
    fi
    echo "  済み ${key}（posted.tsv にあるので飛ばします）"
    continue
  fi
  url="$(gh issue comment "$number" -R "$OWNER/$repo" --body-file "$BODY_DIR/$file")"
  printf '%s\t%s\n' "$key" "$url" >> "$MAP"
  if [ "$action" = "close" ]; then
    gh issue close "$number" -R "$OWNER/$repo" --reason completed >/dev/null
    echo "  投稿して閉じた ${key} $url"
  else
    echo "  投稿した ${key} $url"
  fi
done <<< "$TABLE"

echo
echo "完了しました。投稿したコメント:"
cat "$MAP"
