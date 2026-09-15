#!/usr/bin/env bash
#
# Discussion #24 の割り付けと、egov#20 の方針決定を GitHub に反映する。
#
#   使い方:  DRY_RUN=1 ./scripts/update-issues-2026-09-14b.sh
#            ./scripts/update-issues-2026-09-14b.sh
#
# 1. houki-nta-mcp に 2 本起票（K / L）
# 2. houki-hub に Discussion #24 の親を 1 本起票（M）
# 3. egov#20 / hub#21 / hub#22 の本文を差し替え
# 4. hub#22 / hub#23 の題名の接頭辞を直す（← 不要ならこのブロックを消してください）
#
set -euo pipefail

OWNER="shuji-bonji"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-14"
MAP="$BODY_DIR/created-b.tsv"
DRY_RUN="${DRY_RUN:-0}"

# key <TAB> repo <TAB> title   （M は K / L の番号が要るので後から作る）
TABLE=$(cat <<'TSV'
K	houki-nta-mcp	初回の取り込みを数分で試せるようにする
L	houki-nta-mcp	改正通達の PDF の読み方を決める
TSV
)

if [ "$DRY_RUN" != "1" ]; then
  command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
fi

echo "新規起票:"
printf '%s\n' "$TABLE" | while IFS=$'\t' read -r key repo title; do
  printf '  [%s] %-26s %s\n' "$key" "$OWNER/$repo" "$title"
done
echo "  [M] $OWNER/houki-hub          houki-nta-mcp: 機能追加・改善 — Discussion #24 の割り付けと進捗"
echo
echo "本文の差し替え:"
echo "  $OWNER/houki-egov-mcp#20   施行令・施行規則の関連付け（hub#8 との層分けを決定した版）"
echo "  $OWNER/houki-hub#21        機能 2 と #8 の関係を「決定」に書き換え"
echo "  $OWNER/houki-hub#22        1 回の導入を (a) 手数 / (b) 時間 / (c) 名前と掲載 に分割"
echo
echo "題名の付け替え:"
echo "  $OWNER/houki-hub#22        接頭辞 houki-egov-mcp: を外す（対象は egov と nta の両方）"
echo "  $OWNER/houki-hub#23        接頭辞を houki-egov-mcp / houki-nta-mcp: に変える"
echo

if [ "$DRY_RUN" = "1" ]; then
  echo "(DRY_RUN=1 のため、ここで終了します)"
  exit 0
fi

if [ -s "$MAP" ]; then
  echo "警告: $MAP がすでにあります。続けると Issue が二重に作られます。" >&2
  echo
fi

printf '上記を実行します。よろしいですか [y/N]: '
read -r ans
case "$ans" in
  y|Y) ;;
  *) echo "中止しました。"; exit 1 ;;
esac

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

# --- 1. houki-nta-mcp に 2 本 ---
: > "$MAP"
while IFS=$'\t' read -r key repo title; do
  body="$BODY_DIR/${repo}-${key}.md"
  [ -f "$body" ] || { echo "本文が見つかりません: $body" >&2; exit 1; }
  url="$(gh issue create -R "$OWNER/$repo" -t "$title" -F "$body")"
  num="${url##*/}"
  printf '%s\t%s\t%s\t%s\n' "$key" "$repo" "$num" "$url" >> "$MAP"
  echo "  作成 [$key] $url"
done <<< "$TABLE"

# --- 2. houki-hub に Discussion #24 の親 ---
render "$BODY_DIR/parent-24.md" "$BODY_DIR/.rendered-24.md"
url="$(gh issue create -R "$OWNER/houki-hub" \
  -t "houki-nta-mcp: 機能追加・改善 — Discussion #24 の割り付けと進捗" \
  -F "$BODY_DIR/.rendered-24.md")"
echo "  作成 [M] $url"
printf 'M\thouki-hub\t%s\t%s\n' "${url##*/}" "$url" >> "$MAP"

# --- 3. 本文の差し替え ---
gh issue edit 20 -R "$OWNER/houki-egov-mcp" -F "$BODY_DIR/houki-egov-mcp-D-v2.md"
echo "  更新 houki-egov-mcp#20"

gh issue edit 21 -R "$OWNER/houki-hub" -F "$BODY_DIR/parent-21-v2.md"
echo "  更新 houki-hub#21"

render "$BODY_DIR/parent-22-v2.md" "$BODY_DIR/.rendered-22b.md"
gh issue edit 22 -R "$OWNER/houki-hub" -F "$BODY_DIR/.rendered-22b.md"
echo "  更新 houki-hub#22"

# --- 4. 題名の付け替え（残したい場合はこのブロックごと消してください） ---
gh issue edit 22 -R "$OWNER/houki-hub" \
  -t "発見性 — 1 種類の仕事を 1 回の導入で終わらせる"
echo "  改題 houki-hub#22"

gh issue edit 23 -R "$OWNER/houki-hub" \
  -t "houki-egov-mcp / houki-nta-mcp: better-sqlite3 と Node 22 以上の見直し（調査）"
echo "  改題 houki-hub#23"

echo
echo "完了しました。"
cat "$MAP"
