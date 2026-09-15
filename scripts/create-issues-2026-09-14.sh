#!/usr/bin/env bash
#
# Discussion #20 の 14 項目を、実装リポジトリの Issue に起票する。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-14.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-14.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-14/ の Markdown をそのまま使う。
# 新規 Issue を作ってから、その番号を差し込んだ本文で houki-hub#21 / #22 を書き換える。
#
set -euo pipefail

OWNER="shuji-bonji"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-14"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# key <TAB> repo <TAB> title
TABLE=$(cat <<'TSV'
A	houki-egov-mcp	漢数字の条番号・号番号を受け付ける
B	houki-egov-mcp	引用の実在確認ツールを追加する
C	houki-egov-mcp	添付ファイルと法令ファイル形式を出す
D	houki-egov-mcp	施行令・施行規則の関連付け
E	houki-egov-mcp	差分同期の運用経路（Phase 2-8）
F	houki-egov-mcp	章・節単位の分割取得
G	houki-egov-mcp	2 文字語の本文検索
H	houki-egov-mcp	get_toc の附則の配置
I	houki-hub	better-sqlite3 と Node 22 以上の見直し（調査）
J	houki-abbreviations	lookupByLawNum の漢数字↔算用数字正規化
TSV
)

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "起票先と題名:"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r key repo title; do
  printf '  [%s] %-22s %s\n' "$key" "$OWNER/$repo" "$title"
done
echo
echo "書き換え:"
echo "  $OWNER/houki-hub#21  →  機能追加・改善 — Discussion #20 の割り付けと進捗"
echo "  $OWNER/houki-hub#22  →  発見性 — 1 種類の仕事を 1 回の導入で終わらせる"
echo

if [ "$DRY_RUN" = "1" ]; then
  echo "(DRY_RUN=1 のため、ここで終了します)"
  exit 0
fi

if [ -s "$MAP" ]; then
  echo "警告: $MAP がすでにあります。続けると Issue が二重に作られます。" >&2
  echo "      作成済みなら、このファイルを消さずに中止してください。" >&2
  echo
fi

printf '上記を実行します。よろしいですか [y/N]: '
read -r ans
case "$ans" in
  y|Y) ;;
  *) echo "中止しました。"; exit 1 ;;
esac

: > "$MAP"
while IFS=$'\t' read -r key repo title; do
  body="$BODY_DIR/${repo}-${key}.md"
  if [ ! -f "$body" ]; then
    echo "本文が見つかりません: $body" >&2
    exit 1
  fi
  url="$(gh issue create -R "$OWNER/$repo" -t "$title" -F "$body")"
  num="${url##*/}"
  printf '%s\t%s\t%s\t%s\n' "$key" "$repo" "$num" "$url" >> "$MAP"
  echo "  作成 [$key] $url"
done <<< "$TABLE"

echo
echo "親 Issue の本文に番号を差し込みます。"

render() {
  src="$1"; dst="$2"
  content="$(cat "$src")"
  while IFS=$'\t' read -r key repo num url; do
    if [ "$repo" = "houki-hub" ]; then
      ref="#$num"
    else
      ref="$OWNER/$repo#$num"
    fi
    content="${content//\{\{$key\}\}/$ref}"
  done < "$MAP"
  printf '%s\n' "$content" > "$dst"
  if grep -q '{{' "$dst"; then
    echo "警告: $dst に置換されていない箇所が残っています。" >&2
  fi
}

render "$BODY_DIR/parent-21.md" "$BODY_DIR/.rendered-21.md"
render "$BODY_DIR/parent-22.md" "$BODY_DIR/.rendered-22.md"

gh issue edit 21 -R "$OWNER/houki-hub" \
  -t "機能追加・改善 — Discussion #20 の割り付けと進捗" \
  -F "$BODY_DIR/.rendered-21.md"
echo "  更新 houki-hub#21"

gh issue edit 22 -R "$OWNER/houki-hub" \
  -t "発見性 — 1 種類の仕事を 1 回の導入で終わらせる" \
  -F "$BODY_DIR/.rendered-22.md"
echo "  更新 houki-hub#22"

echo
echo "完了しました。作成した Issue:"
cat "$MAP"
