#!/usr/bin/env bash
#
# nta#35 の完了を親 Issue（hub#22 の (b)、hub#25）のチェックボックスに反映する。
#   使い方:  ./scripts/check-issues-2026-09-18.sh
#
# 本文はいまの Issue から取り、該当行だけ [ ] → [x] にして書き戻す。
#
set -euo pipefail
OWNER="shuji-bonji"
command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }

tick() {
  # $1 = issue 番号, $2 = 行に含まれる目印
  num="$1"; mark="$2"
  tmp="$(mktemp)"
  gh issue view "$num" -R "$OWNER/houki-hub" --json body -q .body > "$tmp"
  if ! grep -qF -- "$mark" "$tmp"; then
    echo "houki-hub#$num に「$mark」を含む行がありません。何もしません。" >&2
    rm -f "$tmp"; return 0
  fi
  python3 - "$tmp" "$mark" <<'PY'
import io,sys
p,mark=sys.argv[1],sys.argv[2]
s=io.open(p,encoding='utf-8').read()
out=[]
for line in s.split('\n'):
    if mark in line and line.lstrip().startswith('- [ ]'):
        line=line.replace('- [ ]','- [x]',1)
    out.append(line)
io.open(p,'w',encoding='utf-8').write('\n'.join(out))
PY
  gh issue edit "$num" -R "$OWNER/houki-hub" -F "$tmp"
  rm -f "$tmp"
  echo "  更新 houki-hub#$num（$mark）"
}

tick 22 "houki-nta-mcp#35"
tick 25 "houki-nta-mcp#35"
echo "完了しました。"
