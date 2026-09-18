#!/usr/bin/env bash
#
# hub#22 の (b) egov 側と (c) の進捗をチェックボックスに反映する。
#   使い方:  ./scripts/check-issue-22-2026-09-19.sh
#
# 本文はいまの Issue から取り、該当行だけ書き換えて戻す。
#
set -euo pipefail
OWNER="shuji-bonji"
command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }

tmp="$(mktemp)"
gh issue view 22 -R "${OWNER}/houki-hub" --json body -q .body > "${tmp}"

python3 - "${tmp}" <<'PY'
import io,sys
p=sys.argv[1]
s=io.open(p,encoding='utf-8').read()
reps = [
 ('- [ ] egov 側も同じ構造（290 MB / `source: "api-fallback"`）なので、試用の経路を README の先頭に書く',
  '- [x] egov 側も同じ構造（290 MB / `source: "api-fallback"`）なので、試用の経路を README の先頭に書く — shuji-bonji/houki-egov-mcp#25（0.6.1）'),
 ('- [ ] 仕事の名前を 1 つ決める',
  '- [x] 仕事の名前を 1 つ決める — **実装する前に、その仕様が法令のどこに触れるかを条文で確かめる**（違いの 1 行は「『法律で決まっている』と『通達でそうなっている』を混ぜずに返す」。経緯は `docs/notes/2026-09-19-job-name-and-listing.md`）'),
 ('- [ ] README の 1 行目、npm の `description`、`marketplace.json` の `description` を、決めた名前に揃える',
  '- [x] README の 1 行目、npm の `description`、`marketplace.json` の `description` を、決めた名前に揃える — egov 0.6.1（shuji-bonji/houki-egov-mcp#26）/ nta 0.18.1（shuji-bonji/houki-nta-mcp#38）/ claude-plugins'),
 ('- [ ] その名前で houki-hub site のトップとガイドを書く',
  '- [x] その名前で houki-hub site のトップとガイドを書く — hero / overview / 「3 つの場面」'),
 ('- [ ] MCP ディレクトリ（mcp.so / PulseMCP / Smithery / awesome-mcp-servers）に出す',
  '- [x] 公式 MCP Registry に登録 — `io.github.shuji-bonji/houki-egov-mcp` 0.6.1 / `houki-nta-mcp` 0.18.1（2026-09-19。Registry 上で日本の法令 MCP は初）\n- [ ] MCP ディレクトリ（awesome-mcp-servers / Glama / PulseMCP / mcp.so）に出す'),
]
n=0
for a,b in reps:
    if a in s:
        s=s.replace(a,b,1); n+=1
    else:
        print(f"見つからない行: {a[:40]}…", file=sys.stderr)
io.open(p,'w',encoding='utf-8').write(s)
print(f"{n} 行を書き換えました")
PY

gh issue edit 22 -R "${OWNER}/houki-hub" -F "${tmp}"
rm -f "${tmp}"
echo "更新 houki-hub#22"
