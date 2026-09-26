#!/usr/bin/env bash
#
# houki-nta-mcp #50 の初版起こしで見つかった「未決」のうち、判断が要るもの（B）を
# 種別ごとに houki-nta-mcp の Issue として起票する。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-26.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-26.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-26-nta-undecided/ の Markdown をそのまま使う。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-nta-mcp"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-26-nta-undecided"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title
TABLE=$(cat <<'TSV'
01-error-code.md	取得系ツールと resolve_abbreviation の「見つからない」ときのエラー code を揃える
02-not-found-retryable.md	存在しない番号を指定すると、再試行を案内するエラー（SOURCE_API_ERROR）になる
03-identifier-form.md	取得系ツールで識別子の形と全角の表記の扱いが揃っていない
04-taxonomy-check.md	検索系ツールで taxonomy の値を検査しない
05-limit-rounding.md	検索系ツールで limit の範囲外の値を黙って丸める
06-empty-keyword.md	空のキーワードをエラーにせず「該当なし」として返す
07-guidance-mismatch.md	hint・next_actions・説明文の案内が実際の動きと合わない
08-response-shape.md	同じ種類の応答でフィールドの有無や名前が揃っていない
09-qa-domain.md	nta_search_qa の domain 引数の扱い
10-stored-values.md	DB に入れる値と保存するファイル名の扱い（不具合の疑い）
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

printf '上記の 10 件を起票します。よろしいですか [y/N]: '
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
