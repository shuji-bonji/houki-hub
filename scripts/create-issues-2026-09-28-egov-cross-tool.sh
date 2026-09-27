#!/usr/bin/env bash
#
# houki-egov-mcp の初版仕様の「未決」のうち、複数のツールにまたがる判断 5 件を
# houki-egov-mcp の Issue として起票する。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-28-egov-cross-tool.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-28-egov-cross-tool.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-28-egov-cross-tool/ の Markdown をそのまま使う。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-egov-mcp"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-28-egov-cross-tool"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title
TABLE=$(cat <<'TSV'
01-law-name-first-hit.md	法令名が完全一致しないとき、検索結果の 1 件目の法令を知らせずに使う
02-law-search-failure-not-found.md	法令名の検索が e-Gov の障害で失敗しても LAW_NOT_FOUND を返し、存在しない法令と見分けられない
03-at-format.md	時点の引数 at の形を確かめず、形の誤りや成立前の日付の結果がツールごとに違う
04-paragraph-value.md	paragraph に 0・負の数・小数を渡すと ARTICLE_NOT_FOUND になり、item の扱いと揃っていない
05-file-size-limit-code.md	50 MB を超えるファイルの保存を INVALID_ARGUMENT で断り、全部取得してから判定する
TSV
)

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "起票先: $OWNER/$REPO"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r file title; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  printf '  %-36s %s\n' "$file" "$title"
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

printf '上記の 5 件を起票します。よろしいですか [y/N]: '
read -r ans
case "$ans" in
  y|Y) ;;
  *) echo "中止しました。"; exit 1 ;;
esac

: > "$MAP"
while IFS=$'\t' read -r file title; do
  url="$(gh issue create -R "$OWNER/$REPO" -t "$title" -F "$BODY_DIR/$file")"
  printf '%s\t%s\t%s\n' "$file" "${url##*/}" "$url" >> "$MAP"
  echo "  作成 $url"
done <<< "$TABLE"

echo
echo "完了しました。作成した Issue:"
cat "$MAP"
