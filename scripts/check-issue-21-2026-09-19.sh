#!/usr/bin/env bash
#
# hub#21 の「機能 4（漢数字の条番号）」をチェックし、egov#17 が開いていれば閉じる。
#   使い方:  ./scripts/check-issue-21-2026-09-19.sh
#
# 本文はいまの Issue から取り、該当行だけ書き換えて戻す。
#
set -euo pipefail
OWNER="shuji-bonji"
command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }

tmp="$(mktemp)"
gh issue view 21 -R "${OWNER}/houki-hub" --json body -q .body > "${tmp}"

python3 - "${tmp}" <<'PY'
import io,sys
p=sys.argv[1]
s=io.open(p,encoding='utf-8').read()
a='- [ ] 漢数字の条番号・号番号を受け付ける（機能 4）— shuji-bonji/houki-egov-mcp#17'
b='- [x] 漢数字の条番号・号番号を受け付ける（機能 4）— shuji-bonji/houki-egov-mcp#17（v0.7.0、PR shuji-bonji/houki-egov-mcp#28。2026-09-19）'
if a in s:
    s=s.replace(a,b,1); print("1 行を書き換えました")
else:
    print(f"見つからない行: {a[:40]}…", file=sys.stderr)
io.open(p,'w',encoding='utf-8').write(s)
PY

gh issue edit 21 -R "${OWNER}/houki-hub" -F "${tmp}"
rm -f "${tmp}"
echo "更新 houki-hub#21"

state="$(gh issue view 17 -R "${OWNER}/houki-egov-mcp" --json state -q .state)"
if [ "${state}" = "OPEN" ]; then
  gh issue close 17 -R "${OWNER}/houki-egov-mcp" -c "v0.7.0 で対応しました（PR #28）。\`get_law\` の \`article\` / \`item\` に \"第三十条の二\" / \"八の二\" と全角数字を渡せます。\`search_fulltext\` のキーワード中の漢数字は本文のトークンのままで、boost に使うかは別に検討します。"
  echo "閉じた houki-egov-mcp#17"
else
  echo "houki-egov-mcp#17 はすでに ${state}"
fi
