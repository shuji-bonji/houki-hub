#!/usr/bin/env bash
#
# 次の計画（docs/notes/2026-10-04-plan-stage6-and-followups.md）の段階 0 の Issue の開け閉め。
#   - houki-egov-mcp #107: 10 月中に施行日を迎える版が 21 あることを追記する（閉じない）
#   - houki-egov-mcp #105: 確かめた結果をコメントして閉じる（Q8）
#   - houki-abbreviations #35: 直近の verify-law-ids が成功していれば、その URL を入れてコメントして閉じる（Q7）
#   - houki-nta-mcp #116: 計画の外にする理由をコメントする（閉じない。Q6）
#   - houki-hub #26: コメントして閉じる（Q9）
# 本文は docs/notes/issues-2026-10-04-plan-stage6/ の Markdown。
#
#   使い方:  DRY_RUN=1 ./scripts/close-issues-2026-10-04-plan-stage6.sh   # 何をするかだけ表示
#            ./scripts/close-issues-2026-10-04-plan-stage6.sh             # 実行（確認あり）
#
# 投稿したコメントの URL は docs/notes/issues-2026-10-04-plan-stage6/posted.tsv に残す。
# 同じ Issue に二重に投稿しないよう、posted.tsv にある Issue は飛ばす。
# abbr #35 は、先に gh workflow run verify-law-ids.yml -R shuji-bonji/houki-abbreviations を実行し、
# 成功を確かめてから流す。直近の実行が success でなければ #35 は飛ばす。
#
set -euo pipefail

OWNER="shuji-bonji"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-10-04-plan-stage6"
MAP="$BODY_DIR/posted.tsv"
DRY_RUN="${DRY_RUN:-0}"

# repo <TAB> number <TAB> file <TAB> action（close = コメントして閉じる / comment = コメントだけ）
TABLE=$(cat <<'TSV'
houki-egov-mcp	107	egov-107.md	comment
houki-egov-mcp	105	egov-105.md	close
houki-abbreviations	35	abbr-35.md	close
houki-nta-mcp	116	nta-116.md	comment
houki-hub	26	hub-26.md	close
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
  printf '  %-20s #%-4s %-12s %s\n' "$repo" "$number" "$file" "$action"
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
    echo "  済み ${key}（posted.tsv にあるので飛ばします）"
    continue
  fi
  body="$BODY_DIR/$file"
  if [ "$repo" = "houki-abbreviations" ] && [ "$number" = "35" ]; then
    run="$(gh run list -R "$OWNER/$repo" -w verify-law-ids --limit 1 --json conclusion,url -q '.[0] | "\(.conclusion)\t\(.url)"')"
    conclusion="${run%%	*}"
    run_url="${run#*	}"
    if [ "$conclusion" != "success" ]; then
      echo "  飛ばした ${key}（直近の verify-law-ids は ${conclusion:-未実行}。成功してから流し直してください）"
      continue
    fi
    tmp="$(mktemp)"
    sed "s|{{RUN_URL}}|${run_url}|" "$body" > "$tmp"
    body="$tmp"
  fi
  url="$(gh issue comment "$number" -R "$OWNER/$repo" --body-file "$body")"
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
