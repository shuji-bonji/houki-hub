#!/usr/bin/env bash
#
# houki-egov-mcp の一括ダウンロードの取り込みと DB の案内の見直しで見つかった 2 件を
# houki-egov-mcp の Issue として起票する。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-10-04-egov-bulk.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-10-04-egov-bulk.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-10-04-egov-bulk/ の Markdown を使う。
# 本文の中の仮の番号 #ISSUE-NN は、先に作った Issue の番号に置き換えてから起票する。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-egov-mcp"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-10-04-egov-bulk"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title
TABLE=$(cat <<'TSV'
01-unenforced-status-not-updated.md	施行日の当日に配り直される版を unchanged として飛ばし、施行後も未施行のまま・旧版が現行のまま残る
02-fallback-note-db-path.md	search_fulltext の api-fallback の note と案内のコマンドが、DB が無い・別のファイルを開いているを区別せず、そのままでは動かないことがある
TSV
)
COUNT=$(printf '%s\n' "$TABLE" | wc -l | tr -d ' ')

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "起票先: ${OWNER}/${REPO}（${COUNT} 件）"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r file title; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  printf '  %-32s %s\n' "$file" "$title"
done
echo

if [ "$DRY_RUN" = "1" ]; then
  echo "(DRY_RUN=1 のため、ここで終了します)"
  exit 0
fi

if [ -s "$MAP" ]; then
  echo "警告: $MAP がすでにあります。続けると Issue が二重に作られます。" >&2
  echo
fi

printf '上記の %s 件を起票します。よろしいですか [y/N]: ' "$COUNT"
read -r ans
case "$ans" in
  y|Y) ;;
  *) echo "中止しました。"; exit 1 ;;
esac

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT
: > "$MAP"
while IFS=$'\t' read -r file title; do
  cp "$BODY_DIR/$file" "$TMP"
  # 先に作った Issue への仮の番号を置き換える
  while IFS=$'\t' read -r done_file number _url; do
    key="${done_file%%-*}"
    perl -0pi -e "s/#ISSUE-${key}(?![0-9])/#${number}/g" "$TMP"
  done < "$MAP"
  if grep -q '#ISSUE-[0-9][0-9]' "$TMP"; then
    echo "本文に未作成の Issue への仮の番号があります: $file" >&2
    exit 1
  fi
  url="$(gh issue create -R "$OWNER/$REPO" -t "$title" -F "$TMP")"
  printf '%s\t%s\t%s\n' "$file" "${url##*/}" "$url" >> "$MAP"
  echo "  作成 $url"
done <<< "$TABLE"

echo
echo "完了しました。作成した Issue:"
cat "$MAP"

COMMENTS="$BODY_DIR/comments.tsv"
if [ -s "$COMMENTS" ]; then
  echo
  echo "既存の Issue にコメントを足します:"
  while IFS=$'\t' read -r number body; do
    gh issue comment "$number" -R "$OWNER/$REPO" -b "$body" >/dev/null
    echo "  コメント #${number}"
  done < "$COMMENTS"
fi
