#!/usr/bin/env bash
#
# houki-egov-mcp の初版仕様の「未決」のうち、判断が要る残り 17 件を
# houki-egov-mcp の Issue として起票する（ツールをまたぐ 5 件 #45〜#49 は起票済み）。
#
#   使い方:  DRY_RUN=1 ./scripts/create-issues-2026-09-28-egov.sh   # 何をするかだけ表示
#            ./scripts/create-issues-2026-09-28-egov.sh             # 実行（確認あり）
#
# 本文は docs/notes/issues-2026-09-28-egov-undecided/ の Markdown を使う。
# 本文の中の仮の番号 #ISSUE-NN は、先に作った Issue の番号に置き換えてから起票する。
#
set -euo pipefail

OWNER="shuji-bonji"
REPO="houki-egov-mcp"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_DIR="$ROOT/docs/notes/issues-2026-09-28-egov-undecided"
MAP="$BODY_DIR/created.tsv"
DRY_RUN="${DRY_RUN:-0}"

# file <TAB> title
TABLE=$(cat <<'TSV'
01-suppl-articles.md	条番号で条を探すとき本則と附則を区別せず、附則の条を本則の条として返す
02-abbreviation-matching.md	略称の全角・半角を吸収せず、通達の略称への応答がツールごとに違う
03-empty-string-args.md	必須の文字列の引数に空文字を渡したときの code がツールごとに違う
04-numeric-and-format-args.md	limit・latest・depth の上限・整数を約束しておらず、get_law が範囲表記の article を黙って受け付ける
05-search-law-response.md	search_law の domain が絞り込まず、total_count が総数でなく、0 件のときに次の手を返さない
06-docs-mismatch.md	README・CLI の使い方・tool description の記述が v0.15.1 の動きと合わない
07-error-detail-shape.md	引数の検査の INVALID_ARGUMENT の detail が読み取りにくく、返さない code が語彙に残っている
08-daily-sync-dates.md	日次差分の last_sync_date の決め方と差分の無い日の扱いで、取り込んでいない日を最新と扱う
09-ingest-content.md	段落だけの本則を取り込まず、作れない公布日に 0001-01-01 を入れる
10-db-lifecycle.md	新しい版の DB を古い版で開くと消え、MCP サーバーと --status が DB を作る
11-cli-args-and-status.md	CLI が引数の打ち間違いを知らせず、--status の件数と警告の日数が表示と合わない
12-explain-law-type-kinds.md	explain_law_type が「通知」と一部の法令種別コードで期待どおりの解説を返さない
13-name-based-inference.md	名前の形から関係法令・委任先を推定し、実在しない法令や違う法令を指す
14-response-fields.md	目次の meta の at、補った項番号、続きの呼び出し例の max_chars が付かない
15-revisions-semantics.md	get_law_revisions の状態の値が説明と違い、latest の「最新」の順が決まっていない
16-file-names.md	添付・本文ファイルの保存で、同名の添付を黙って選び、法令履歴 ID の欄に法令 ID が入る
17-fulltext-expansion.md	search_fulltext の通称の展開が本文にも効き、2 文字の語の例が常に民法を添える
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
