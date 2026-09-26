#!/usr/bin/env bash
#
# houki-abbreviations PR #10 の初版起こしで見つかった「未決」のうち、判断が要るものを
# 判断ごとに houki-abbreviations の Issue として起票する。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-27-abbr.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-27-abbr.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-27-abbr-undecided/ の Markdown をそのまま使う。
# 起票後は scripts/apply-issue-numbers-2026-09-27-abbr.sh で spec.md の仮の番号を置き換える。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-abbreviations"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-27-abbr-undecided"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title
TABLE=$(cat <<'TSV'
01-mutable-entries.md	辞書のエントリと公開定数を実行時に書き換えられ、他の関数の結果が変わる
02-cross-entry-duplicates.md	名前がエントリをまたいで重複したときの扱いと、validateAllEntries が見逃す値
03-self-duplicate-aliases.md	aliases に自分の abbr・formal と同じ値を持つエントリがあり、extractLawNames が同じ一致を 2 件返す
04-counts-and-zero-keys.md	辞書の件数と、件数 0 の種別・MCP を約束にするか（getAbbreviationStats）
05-docs-mismatch.md	README・JSDoc・CONTRIBUTING の記述が v0.6.0 の実際の結果と合わない
06-broken-fetched-at.md	壊れた取得時刻や NaN が鮮度判定で fresh / outdated になる
07-extract-spanning-and-width.md	extractLawNames が 2 つの法令名にまたがる一致を返し、全角の表記を吸収しない
08-fuzzy-short-query.md	findSimilar・suggestCorrection が短い query で意味の違う略称や入力そのものを候補に返す
09-normalization-differs.md	関数ごとに全角・ダッシュ類・大文字の扱いが揃っていない
10-limit-nan.md	limit に NaN を渡したときの扱いと上限が関数ごとに違う
11-law-id-strictness.md	isValidLawId が元号の桁と府省コードの範囲を確かめない
12-numerals-and-characters.md	漢数字・大きな数・BMP 外の文字で入力が意図と違う値になる
13-kokuji-category.md	告示を辞書に入れるときの category が CATEGORIES に無い
TSV
)

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "起票先: $OWNER/$REPO"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r file title; do
  [ -f "$BODY_DIR/$file" ] || { echo "本文が見つかりません: $BODY_DIR/$file" >&2; exit 1; }
  printf '  %-34s %s\n' "$file" "$title"
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

printf '上記の 13 件を起票します。よろしいですか [y/N]: '
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
