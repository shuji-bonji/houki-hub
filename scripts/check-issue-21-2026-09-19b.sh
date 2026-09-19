#!/usr/bin/env bash
#
# hub#21 の「機能 5（差分同期）」をチェックし、egov#21 が開いていれば閉じる。
#   使い方:  ./scripts/check-issue-21-2026-09-19b.sh
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
a='- [ ] 差分同期の運用経路（機能 5 / Phase 2-8）— shuji-bonji/houki-egov-mcp#21'
b='- [x] 差分同期の運用経路（機能 5 / Phase 2-8）— shuji-bonji/houki-egov-mcp#21（`--sync`、v0.8.0、PR shuji-bonji/houki-egov-mcp#29。2026-09-19）'
if a in s:
    s=s.replace(a,b,1); print("1 行を書き換えました")
else:
    print(f"見つからない行: {a[:40]}…", file=sys.stderr)
io.open(p,'w',encoding='utf-8').write(s)
PY

gh issue edit 21 -R "${OWNER}/houki-hub" -F "${tmp}"
rm -f "${tmp}"
echo "更新 houki-hub#21"

state="$(gh issue view 21 -R "${OWNER}/houki-egov-mcp" --json state -q .state)"
if [ "${state}" = "OPEN" ]; then
  gh issue close 21 -R "${OWNER}/houki-egov-mcp" -c "v0.8.0 で対応しました（PR #29）。\`--sync\` で最終同期日から今日までの日次差分を取り込みます。差分が無い日は飛ばし、途中で失敗しても成功した日までを記録します。"
  echo "閉じた houki-egov-mcp#21"
else
  echo "houki-egov-mcp#21 はすでに ${state}"
fi
