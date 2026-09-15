#!/usr/bin/env bash
#
# houki-hub#22 の (a) 導入の手数 を実装済みに更新する。
#   使い方:  ./scripts/update-issue-22-2026-09-14c.sh
#
set -euo pipefail
OWNER="shuji-bonji"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY="$ROOT/docs/notes/issues-2026-09-14/parent-22-v3.md"

command -v gh >/dev/null 2>&1 || { echo "gh が見つかりません。" >&2; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "gh auth login を実行してください。" >&2; exit 1; }
[ -f "$BODY" ] || { echo "本文が見つかりません: $BODY" >&2; exit 1; }

gh issue edit 22 -R "$OWNER/houki-hub" -F "$BODY"
echo "更新 houki-hub#22"
