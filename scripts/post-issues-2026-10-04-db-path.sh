#!/usr/bin/env bash
#
# DB のパスの見え方（A）・DB の場所を確かめるコマンド（B）・DB のファイル名の版（E）を起票する。
#   - houki-egov-mcp #108 に A を追記する（コメント）
#   - houki-egov-mcp に B と E の Issue を 1 件ずつ立てる
#   - houki-nta-mcp に A・B・E をまとめた Issue を 1 件立てる
#   - 起票の後（2026-10-04）、egov #108・#110・#111 と nta #138 に、互いの番号の表（links.md）をコメントする
# 本文は docs/notes/issues-2026-10-04-db-path/ の Markdown。
#
#   使い方:  DRY_RUN=1 ./scripts/post-issues-2026-10-04-db-path.sh   # 何をするかだけ表示
#            ./scripts/post-issues-2026-10-04-db-path.sh             # 実行（確認あり）
#
# 投稿した URL は docs/notes/issues-2026-10-04-db-path/posted.tsv に残し、同じ行は二度投稿しない。
#
set -euo pipefail

OWNER="shuji-bonji"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-10-04-db-path"
MAP="$BODY_DIR/posted.tsv"
DRY_RUN="${DRY_RUN:-0}"

# key <TAB> repo <TAB> 番号（comment のとき）か - <TAB> file <TAB> action <TAB> タイトル（create のとき）
TABLE=$(cat <<'TSV'
egov-108	houki-egov-mcp	108	egov-108-comment.md	comment	-
egov-where	houki-egov-mcp	-	egov-new-db-where.md	create	開いている DB の場所と、同じフォルダーに残っている別の版の DB を確かめる手段が --status の 1 行しかない
egov-file-version	houki-egov-mcp	-	egov-new-db-file-version.md	create	次に DB の版を上げるとき、既定のファイル名に版を入れて、版の違う houki-egov-mcp が同じ DB を開かないようにするか
nta-db-path	houki-nta-mcp	-	nta-new-db-path.md	create	開いている DB のパスが応答に出ず、残っている別の DB にも気付けない（houki-egov-mcp #108 などと同じ方針で決める）
link-egov-108	houki-egov-mcp	108	links.md	comment	-
link-egov-110	houki-egov-mcp	110	links.md	comment	-
link-egov-111	houki-egov-mcp	111	links.md	comment	-
link-nta-138	houki-nta-mcp	138	links.md	comment	-
TSV
)

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "対象: $(printf '%s\n' "$TABLE" | wc -l | tr -d ' ') 件（posted.tsv にあるものは飛ばす）"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r key repo number file action title; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  if [ "$action" = "comment" ]; then
    printf '  %-18s %-15s #%-5s コメント  %s\n' "$key" "$repo" "$number" "$file"
  else
    printf '  %-18s %-15s 新規    %s\n      タイトル: %s\n' "$key" "$repo" "$file" "$title"
  fi
done
echo

if [ "$DRY_RUN" = "1" ]; then
  echo "(DRY_RUN=1 のため、ここで終了します)"
  exit 0
fi

printf 'posted.tsv に無いものを投稿します（新規の Issue はラベル enhancement）。よろしいですか [y/N]: '
read -r ans
case "$ans" in y|Y) ;; *) echo "中止しました。"; exit 1 ;; esac

touch "$MAP"
while IFS=$'\t' read -r key repo number file action title; do
  if grep -q "^${key}	" "$MAP"; then
    echo "投稿済みのため飛ばします: $key"
    continue
  fi
  if [ "$action" = "comment" ]; then
    url=$(gh issue comment "$number" -R "$OWNER/$repo" --body-file "$BODY_DIR/$file")
  else
    url=$(gh issue create -R "$OWNER/$repo" --title "$title" --label enhancement --body-file "$BODY_DIR/$file")
  fi
  printf '%s\t%s\n' "$key" "$url" >> "$MAP"
  echo "投稿しました: $key → $url"
done <<< "$TABLE"

echo
echo "記録: $MAP"
