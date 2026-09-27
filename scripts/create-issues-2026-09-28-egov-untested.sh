#!/usr/bin/env bash
#
# houki-egov-mcp の差分 20260928-untested-behaviors を書く途中で見つかった問題 7 件を
# houki-egov-mcp の Issue として起票し、既存の #54・#57・#63 に材料をコメントで足す。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-28-egov-untested.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-28-egov-untested.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-28-egov-untested/ の Markdown を使う。
# 本文の中の仮の番号 #ISSUE-NN は、先に作った Issue の番号に置き換えてから起票する。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-egov-mcp"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-28-egov-untested"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title
TABLE=$(cat <<'TSV'
01-connection-failure-code.md	e-Gov に接続できないとき SOURCE_UNAVAILABLE を返さず、SOURCE_API_ERROR（fetch failed）になる
02-verify-citations-duplicate-law-id.md	verify_citations で同じ未知の law_id が並ぶと、2 件目以降の search_law の keyword が law_name にならない
03-db-integrity.md	laws.law_revision_id に NULL が入り、版を読めない DB は例外で開けない
04-suppl-appendix-figure-location.md	附則の別表・様式にある図の location が附則全体になり、見出しが付かない
05-explain-law-type-prototype-keys.md	explain_law_type が toString・constructor で found: true を返し、info が無い
06-cli-status-locale.md	--status の件数の区切り文字が環境の言語設定で変わる
07-bulk-download-progress.md	取得の進捗が、終わった時点で 100% にならない（SPEC-EGOV-CLI-BULK-DOWNLOAD-006 と実装の食い違い）
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
