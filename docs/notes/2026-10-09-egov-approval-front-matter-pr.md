# houki-egov-mcp: 承認の記録を front matter に移す変換の PR（Issue と PR 本文の草案）

作業日 2026-10-09（JST）。ブランチ `chore/20261009-approval-front-matter`（起点 main `326006f`）。

## Issue の草案

題: specs/ の承認の記録を spec-ids 0.3.0 の front matter に移す

本文:

spec-ids 0.3.0 で、承認の記録を差分の proposal.md と current の spec.md の先頭の front matter に 1 か所だけ書く形になりました（shuji-bonji/spec-ids#5）。このリポジトリの `specs/` は 0.2.0 までの形（本文の「- 承認日:」「- 機能 ID:」「- 種類:」「- 実装の変更:」の行）のままなので、変換します。

- 設計: shuji-bonji/spec-ids#6（`docs/proposals/20261009-approval-front-matter.md`）
- 実装: shuji-bonji/spec-ids#7（0.3.0。`spec-ids migrate`・`history`・`readFrontMatter`）

やること（1 本の PR。途中のコミットで CI が通らなくてよく、最後のコミットで通ること）:

1. `devDependencies` の `@shuji-bonji/spec-ids` を `^0.3.0` に上げ、package-lock.json を更新する
2. `npx spec-ids migrate --write` で `specs/current/` 20 本と `specs/releases/` の proposal.md 16 本を変換する（設計の「確かめた値」では前直しは不要）。変換の前後で、機能ごとの初版の承認と (差分 ID, 承認日, PR) の集合が一致することを確かめる
3. `.github/scripts/check-pr-scope.mjs` の承認の判定（`APPROVAL_RE`・`PR_NUMBER_RE`・`NO_IMPL_RE`）を、`readFrontMatter` で読む判定に替える
4. `AGENTS.md` の承認日と Publisher の手順を直す

版は上げず、publish もしません（実行時の振る舞いは変わらないため）。

---

## PR 本文の草案

題: chore: specs/ の承認の記録を spec-ids 0.3.0 の front matter に移す

Closes #<Issue 番号>
Refs shuji-bonji/spec-ids#5

spec-ids 0.3.0 の形（承認の記録を front matter に 1 か所だけ書く）に、`specs/` と `pr-scope` と `AGENTS.md` を合わせます。仕様の意図（ID の付いた見出しと本文）、テスト、`src/` は変えていません。版は上げず、publish もしません。

### コミット

| コミット | 内容 |
|---|---|
| `chore: @shuji-bonji/spec-ids を ^0.3.0 に上げる` | package.json の devDependencies |
| `chore: specs/ の承認の記録を front matter に変換する` | `spec-ids migrate --write` の結果だけ（36 files） |
| `ci: pr-scope の承認の判定を front matter に替える` | check-pr-scope.mjs・テスト・ci.yml の pr-scope ジョブに `npm ci` |
| `docs: AGENTS.md の承認日と Publisher の手順を front matter の形に直す` | AGENTS.md |
| `chore: package-lock.json を spec-ids 0.3.0 に更新する` | Mac の `npm install -D @shuji-bonji/spec-ids@^0.3.0` |

### 変換の結果

- `spec-ids migrate`（書き換え前）: current 20 本、proposal.md は changes 0・releases 16、食い違い 0 件
- `migrate --write`: 36 files を書き換えた。消えた行は「- 機能 ID:」「- 種類:」「- 承認日:」「- 実装の変更:」だけで、足した行は front matter と「- 実装の変更の補足:」（12 本）だけ（`git diff -U0 specs/` で確かめた）
- `spec-ids check`:

```
current: 20 files, 559 IDs / changes: 0 files, 0 IDs
proposals: changes 0, releases 16
tests: 92 files, 559 IDs
OK: 仕様 ID とテストが一致しています
```

### 前後の一致

2 通りで比べました。

- A: `migrate --json`（変換の前に migrate が読んだ値）と `history --all --json`（変換の後に history が出す値）
- B: 変換の前のコミット（`git show <rev>:<path>`）の本文の「- 承認日:」の行と、releases の差分の `specs/<dir>/` を、migrate を通さずに読んだ値と `history --all --json`。A は migrate の読み取りを両側で使うので、migrate の読み違いを見逃さないために足した

```
$ node compare-approvals.mjs before.json after.json <houki-egov-mcp> <変換の前のコミット>
A migrate --json と history --all --json: 一致 20 / 20 機能（行 160）、不一致 0
B 変換前の本文（git）と history --all --json: 一致 20 / 20 機能（行 160）、不一致 0
```

行 160 = 初版 20 + 差分 140。after.json の 2 か所を壊して流すと、A・B とも 2 機能を不一致として出すことも確かめました。

<details>
<summary>比べたスクリプト（compare-approvals.mjs。リポジトリには入れない）</summary>

```js
// 変換の前後で、機能ごとの承認の記録が同じかを比べる（リポジトリには入れない）。
// 使い方: node compare-approvals.mjs <before.json> <after.json> [<リポジトリ> <変換前のコミット>]
//   A: migrate --json（変換前に migrate が読んだ値）と history --all --json（変換後に history が出す値）を比べる
//   B: 変換前のコミットの本文の「- 承認日:」の行と releases の差分の specs/<dir>/ を、migrate を通さずに読み、
//      history --all --json と比べる（migrate の読み取りに誤りがあっても見逃さないための、もう 1 つの比べ方）
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [beforePath, afterPath, repo, rev] = process.argv.slice(2);
const before = JSON.parse(readFileSync(beforePath, 'utf8'));
const after = JSON.parse(readFileSync(afterPath, 'utf8'));
const initialOf = (x) => (x.introduced_by ? `new ${x.introduced_by}` : `${x.approved} #${x.pr}`);

/** 機能 → { initial, changes: Set<"差分 ID|承認日|#PR"> } */
function fromBefore() {
  const m = new Map();
  for (const [dir, f] of Object.entries(before.features)) m.set(dir, { initial: initialOf(f), changes: new Set() });
  for (const [id, c] of Object.entries(before.changes)) {
    for (const dir of c.targets) m.get(dir)?.changes.add(`${id}|${c.approved}|#${c.pr}`);
  }
  return m;
}

function fromAfter() {
  const m = new Map();
  for (const h of after) {
    const e = { initial: null, changes: new Set() };
    for (const r of h.rows) {
      if (r.kind === 'initial') e.initial = `${r.approved} #${r.pr}`;
      else if (r.kind === 'introduced') e.initial = `new ${r.change}`;
      else e.changes.add(`${r.change}|${r.approved}|#${r.pr}`);
    }
    m.set(h.dir, e);
  }
  return m;
}

/** 変換前のコミットを git から直接読む（migrate を通さない） */
function fromOldText() {
  const git = (...a) => execFileSync('git', ['-C', repo, '--no-optional-locks', ...a], { encoding: 'utf8' });
  const files = git('ls-tree', '-r', '--name-only', rev, 'specs/').split('\n').filter(Boolean);
  const m = new Map();
  const INIT_RE = /^(\d{4}-\d{2}-\d{2})\s*（(?:初版。)?PR #(\d+)(?: のマージ)?）/;
  const DIFF_RE = /差分 `([^`]+)` は (\d{4}-\d{2}-\d{2})（PR #(\d+)(?: のマージ)?）/g;
  const approvalOf = new Map(); // 差分 ID → "承認日|#PR"（proposal.md の行）
  for (const f of files.filter((p) => /^specs\/releases\/[^/]+\/[^/]+\/proposal\.md$/.test(p))) {
    const a = git('show', `${rev}:${f}`).match(/^- 承認日:\s*(\d{4}-\d{2}-\d{2})\s*（PR #(\d+)）/m);
    approvalOf.set(f.split('/')[3], a ? `${a[1]}|#${a[2]}` : null);
  }
  for (const f of files.filter((p) => /^specs\/current\/[^/]+\/spec\.md$/.test(p))) {
    const dir = f.split('/')[2];
    const line = git('show', `${rev}:${f}`).match(/^- 承認日:\s*(.*)$/m)[1];
    const i = line.match(INIT_RE);
    const e = { initial: i ? `${i[1]} #${i[2]}` : `読めない: ${line.slice(0, 40)}`, changes: new Set() };
    for (const x of line.matchAll(DIFF_RE)) e.changes.add(`${x[1]}|${x[2]}|#${x[3]}`);
    m.set(dir, e);
  }
  // releases の差分の specs/<dir>/ にある機能（current の行に無くても足す）
  for (const f of files.filter((p) => /^specs\/releases\/[^/]+\/[^/]+\/specs\/[^/]+\//.test(p))) {
    const [, , , id, , dir] = f.split('/');
    const ap = approvalOf.get(id);
    if (ap && m.has(dir)) m.get(dir).changes.add(`${id}|${ap}`);
  }
  return m;
}

function compare(label, x, y) {
  let ok = 0;
  let rows = 0;
  const ng = [];
  for (const dir of [...new Set([...x.keys(), ...y.keys()])].sort()) {
    const a = x.get(dir);
    const b = y.get(dir);
    const onlyA = a ? [...a.changes].filter((c) => !b?.changes.has(c)) : [];
    const onlyB = b ? [...b.changes].filter((c) => !a?.changes.has(c)) : [];
    if (a && b && a.initial === b.initial && onlyA.length === 0 && onlyB.length === 0) {
      ok += 1;
      rows += 1 + b.changes.size;
    } else {
      ng.push(`  ${dir}: 初版 ${a?.initial ?? '-'} / ${b?.initial ?? '-'}、前にだけ [${onlyA}]、後にだけ [${onlyB}]`);
    }
  }
  console.log(`${label}: 一致 ${ok} / ${x.size} 機能（行 ${rows}）、不一致 ${ng.length}`);
  for (const l of ng) console.log(l);
  return ng.length === 0;
}

const afterMap = fromAfter();
let good = compare('A migrate --json と history --all --json', fromBefore(), afterMap);
if (repo && rev) good = compare('B 変換前の本文（git）と history --all --json', fromOldText(), afterMap) && good;
process.exit(good ? 0 : 1);
```

</details>

### pr-scope の変更

| 判定 | 変える前 | 変えた後 |
|---|---|---|
| 仕様 PR の proposal.md の承認 | `APPROVAL_RE` と `PR_NUMBER_RE` | front matter の `approved` と `pr` が空でない |
| 仕様 PR が current を書いてよいか | `NO_IMPL_RE` | front matter の `implementation` が `none` |
| 変わった current の spec.md の承認 | `APPROVAL_RE` | front matter に `approved` と `pr`、または `introduced_by` がある |

- 読み取りは `@shuji-bonji/spec-ids` の `readFrontMatter` を import しています。そのため ci.yml の pr-scope ジョブに `npm ci` を足しました（今までは `npm ci` をしていなかった）
- テストは 18 件 → 22 件（古い形の proposal.md / spec.md を止める、本文の「- 実装の変更: 不要」だけでは current を書けない、`introduced_by` を通す、判定関数）。`node --test .github/scripts/check-pr-scope.test.mjs` は spec-ids 0.3.0 を解決させて 22 件 pass
- このブランチ自体を新しい pr-scope に通した結果: `branch: chore/20261009-approval-front-matter（impl）、変更 37 ファイル` / `OK`

### 設計の「確かめていない点」

- 1（PR のブランチの check-pr-scope.mjs が動くか）: ci.yml の pr-scope ジョブは `actions/checkout@v4` を `ref` 指定なしで使うので、pull_request では PR のマージコミットが checkout され、PR のブランチの版が動きます
- 3（GitHub の表示）: この PR の Files changed で確かめてください
- 4（Biome などの検査）: `biome.json` の `files.includes` は `src/**`・`*.ts`・`*.json` で、`lint`・`format:check` の npm scripts も `src` だけを渡すので、specs/ の Markdown と .github/scripts は Biome の対象外です。markdownlint の設定はありません

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01JzX53DUKXeekDcSj65LweL
