#!/usr/bin/env bash
#
# houki-nta-mcp の CLI・DB の初版仕様（#75）の「未決」のうち、判断が要る 12 件を
# 7 件の Issue として houki-nta-mcp に起票する。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-30-nta-cli-db.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-30-nta-cli-db.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-30-nta-cli-db/ の Markdown を使う。
# 本文の中の仮の番号 #ISSUE-NN は、先に作った Issue の番号に置き換えてから起票する。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-nta-mcp"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-30-nta-cli-db"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title（題名は各ファイルの 1 行目と同じ）
TABLE=$(cat <<'TSV'
01-cli-argument-errors.md	CLI が知らないフラグ・不正な日数・未対応の通達名を知らせずに MCP サーバーを起動するか例外で終わり、`--version` の文が houki-egov-mcp と違う
02-db-version-and-clear.md	版が合わない DB を全テーブルを消して作り直し、全データを消す機能に CLI の入口が無く `HOUKI_NTA_REFRESH=1` の説明だけがある
03-docs-mismatch.md	CLI の使い方の `--refresh` の説明・環境変数の欄・`--refresh-stale` の「N 日以上」が実際の動きと合わない
04-refresh-with-apply.md	`--refresh-stale=<日数> --apply` は差分更新で、`--refresh` を組み合わせても全部取り直しにならない
05-filtered-bulk-orphan-marks.md	税目を絞った投入では、その税目の索引をすべて取れていても、索引から消えた文書の印（`orphaned_at`）を付け直さない
06-drift-check-targets.md	`--check-baseline-drift` は menu.htm の下にない 4 件を常に `ok` にし、`<ok>/9 OK` に数える
07-document-column-constraints.md	`document.doc_type` と `taxonomy` に列の制約が無く、想定した 5 種別以外の値も入る
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
  # 題名は本文の 1 行目と同じでなければならない
  first="$(head -n 1 "$BODY_DIR/$file")"
  [ "$first" = "$title" ] || { echo "題名が本文の 1 行目と違います: $file" >&2; exit 1; }
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
  # 1 行目は題名なので、本文は 2 行目から
  tail -n +2 "$BODY_DIR/$file" > "$TMP"
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
