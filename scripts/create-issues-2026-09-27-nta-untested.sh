#!/usr/bin/env bash
#
# houki-nta-mcp の「未決」のうちテストが無いだけのもの（A）の差分草案を書いたときに見つかった、
# 判断が要る 4 件を houki-nta-mcp の Issue として起票する。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-27-nta-untested.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-27-nta-untested.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-27-nta-untested/ の Markdown をそのまま使う。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-nta-mcp"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-27-nta-untested"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title
TABLE=$(cat <<'TSV'
01-multiple-argument-violations.md	引数に inputSchema の違反が 2 つ以上あると、detail.issues が 1 件にまとまり違反を取りこぼす
02-short-abbreviation-search.md	3 文字未満の略称（消法など）で略称そのものを含む文書が返らず、search_notes の説明とも合わない
03-short-latin-token-filter.md	英字の 2 文字の語と 3 文字以上の語を混ぜると、本文にその語があっても 0 件になる
04-search-hit-issued-at.md	検索のヒットの要素に issuedAt が付くかどうかが種別によって違う
TSV
)

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "起票先: $OWNER/$REPO"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r file title; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  printf '  %-28s %s\n' "$file" "$title"
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

printf '上記の 4 件を起票します。よろしいですか [y/N]: '
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
