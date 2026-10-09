# houki-abbreviations: 承認の記録を front matter に移す変換の PR（Issue と PR 本文の草案）

作業日 2026-10-09（JST）。ブランチ `chore/20261009-approval-front-matter`（起点 main `50bd63b`）。

## Issue の草案

題: specs/ の承認の記録を spec-ids 0.3.0 の front matter に移す

本文:

spec-ids 0.3.0 で、承認の記録を差分の proposal.md と current の spec.md の先頭の front matter に 1 か所だけ書く形になりました（shuji-bonji/spec-ids#5）。このリポジトリの `specs/` は 0.2.0 までの形（本文の「- 承認日:」「- 機能 ID:」「- 実装の変更:」の行）のままなので、変換します。houki-egov-mcp#117・houki-nta-mcp#159 と同じ変換です。

- 設計: shuji-bonji/spec-ids#6（`docs/proposals/20261009-approval-front-matter.md`）
- 実装: shuji-bonji/spec-ids#7（0.3.0。`spec-ids migrate`・`history`・`readFrontMatter`）

やること（1 本の PR。途中のコミットで CI が通らなくてよく、最後のコミットで通ること）:

1. 前直し（古い形のまま）
   - F3: 差分 `20260927-untested-behaviors` の PR 番号を、current の 22 本の行で #28 から #27 に直す（#27 が仕様 PR、#28 は受入テストの PR）
   - F4: current の 23 本の初版を「2026-09-27（PR #10）」に戻し、「差分 `20260927-undecided-to-issues` は 2026-09-27（PR #26）」を足す（コミット 151d255 が初版の PR 番号を #26 に書き換えていた）
2. `devDependencies` の `@shuji-bonji/spec-ids` を `^0.3.0` に上げ、package-lock.json を更新する
3. `npx spec-ids migrate --write` で `specs/current/` 23 本と `specs/releases/` の proposal.md 6 本を変換する。変換の前後で、機能ごとの初版の承認と (差分 ID, 承認日, PR) の集合が一致することを確かめる
4. `.github/scripts/check-pr-scope.mjs` の承認の判定（`APPROVAL_RE`・`PR_NUMBER_RE`・`NO_IMPL_RE`）を、`readFrontMatter` で読む判定に替える
5. `AGENTS.md` の承認日と Publisher の手順を直す

版は上げず、publish もしません（実行時の振る舞いは変わらないため）。

---

## PR 本文の草案

題: chore: specs/ の承認の記録を spec-ids 0.3.0 の front matter に移す

Closes #<この PR 用の Issue の番号>
Refs shuji-bonji/spec-ids#5

spec-ids 0.3.0 の形（承認の記録を front matter に 1 か所だけ書く）に、`specs/` と `pr-scope` と `AGENTS.md` を合わせます。仕様の意図（ID の付いた見出しと本文）、テスト（pr-scope のテストを除く）、`src/` は変えていません。版は上げず、publish もしません。houki-egov-mcp#117・houki-nta-mcp#159 と同じ変換です。

### コミット

| コミット | 内容 |
|---|---|
| `docs(specs): 前直し F3 …` | current の 22 本の承認日の行で、差分 `20260927-untested-behaviors` の PR 番号を #28 から #27 に直す |
| `docs(specs): 前直し F4 …` | current の 23 本の初版を「2026-09-27（PR #10）」に戻し、「差分 `20260927-undecided-to-issues` は 2026-09-27（PR #26）」を足す |
| `chore: @shuji-bonji/spec-ids を ^0.3.0 に上げる` | package.json の devDependencies |
| `chore: specs/ の承認の記録を front matter に変換する` | `spec-ids migrate --write` の結果だけ（29 files） |
| `ci: pr-scope の承認の判定を front matter に替える` | check-pr-scope.mjs・テスト・ci.yml の pr-scope ジョブに `npm ci` |
| `docs: AGENTS.md の承認日と Publisher の手順を front matter の形に直す` | AGENTS.md |
| `chore: package-lock.json を spec-ids 0.3.0 に更新する` | Mac の `npm install -D @shuji-bonji/spec-ids@^0.3.0` |

### 前直し

spec-ids の設計（docs/proposals/20261009-approval-front-matter.md）の F3・F4（Q28・Q29）です。古い形のまま直してから変換しています。

- F3: proposal.md は PR #27、current の 22 本の行は PR #28 でした。GitHub の API で、#27 は `spec/20260927-untested-behaviors`（仕様 PR）、#28 は `test/20260927-untested-behaviors`（受入テストの PR）なので、#27 に合わせました
- F4: コミット 151d255 が、差分 `20260927-undecided-to-issues`（実装の変更: 不要）の承認を書くときに、23 本の初版の「PR #10」を「PR #26」に書き換えていました（`git show 151d255` で確かめた）。初版起こしは PR #10（`spec-init/initial-specs`、2026-09-27 02:52 JST にマージ）です

### 前直しと変換の結果

- 前直しの前の `spec-ids migrate`: 食い違い 2 件

```
specs/releases/v0.6.1/20260927-undecided-to-issues/proposal.md: targets が空になります（どの current の「- 承認日:」の行にもこの差分が無く、差分の specs/<dir>/ もありません）
specs/releases/v0.6.1/20260927-untested-behaviors/proposal.md: 承認の値が proposal.md（2026-09-27（PR #27））と current の行（2026-09-27（PR #28））で違います
```

- 前直しの後の `spec-ids migrate`: current 23 本、proposal.md は changes 0・releases 6、食い違い 0 件
- `migrate --write`: 29 files を書き換えました。消えた行は「- 承認日:」29・「- 機能 ID:」23・「- 実装の変更:」6 だけで、足した行は front matter と「- 実装の変更の補足:」（2 本）だけです（`git diff -U0 specs/` で確かめた）。`###` の見出しの変更は 0 件です。abbr の current には「- 種類:」が無いので、`kind` は書いていません
- `spec-ids check`:

```
current: 23 files, 259 IDs / changes: 0 files, 0 IDs
proposals: changes 0, releases 6
tests: 6 files, 259 IDs
OK: 仕様 ID とテストが一致しています
```

- `spec-ids history levenshtein` の例:

```
| 承認日 | 差分 | PR | 版 |
|---|---|---|---|
| 2026-09-27 | （初版） | #10 | - |
| 2026-09-27 | 20260927-undecided-to-issues | #26 | v0.6.1 |
| 2026-09-27 | 20260927-untested-behaviors | #27 | v0.6.1 |
| 2026-09-30 | 20261001-normalize | #30 | v0.7.0 |
```

### 前後の一致

houki-egov-mcp#117・houki-nta-mcp#159 と同じ 2 通りで比べました（A: `migrate --json` と `history --all --json`、B: 変換前のコミット `5095e5a` の本文を migrate を通さずに読んだ値と `history --all --json`）。スクリプトは houki-nta-mcp#159 の版をそのまま使いました。

```
$ node compare-approvals.mjs before.json after.json <houki-abbreviations> 5095e5a
A migrate --json と history --all --json: 一致 23 / 23 機能（行 92）、不一致 0
B 変換前の本文（git）と history --all --json: 一致 23 / 23 機能（行 92）、不一致 0
```

- 行 92 = 初版 23 + 差分 69
- B の読み取りが abbr の「- 承認日:」の行を読めるかを、変換の前に確かめました。前直しの後の 23 本の行（「2026-09-27（PR #10）。差分 `…` は …（PR #N）」の形）は、初版の正規表現ですべて読め、差分の記述 69 件もすべて拾えました。proposal.md の「2026-09-27 （PR #26）」（日付と括弧の間に空白）も `\s*` で読めます。そのため、スクリプトに足した書き方はありません
- after.json の 2 か所（levenshtein の初版の PR を #26 に、compute_days_since から差分 `20260927-undecided-to-issues` の行を消す）を壊して流すと、A・B とも 2 機能を不一致として出すことも確かめました

<details>
<summary>比べたスクリプト（compare-approvals.mjs。リポジトリには入れない）</summary>

```js
// 変換の前後で、機能ごとの承認の記録が同じかを比べる（リポジトリには入れない）。
// houki-egov-mcp の PR #117 のスクリプトに、houki-nta-mcp にある初版の書き方 2 つを足したもの。
// 使い方: node compare-approvals.mjs <before.json> <after.json> [<リポジトリ> <変換前のコミット>]
//   A: migrate --json（変換前に migrate が読んだ値）と history --all --json（変換後に history が出す値）を比べる
//   B: 変換前のコミットの本文の「- 承認日:」の行と releases の差分の specs/<dir>/ を、migrate を通さずに読み、
//      history --all --json と比べる（migrate の読み取りに誤りがあっても見逃さないための、もう 1 つの比べ方）
// 差分で作った機能（introduced_by）は、history が「新設」の 1 行だけを出すので、その差分を差分の集合に入れない。
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [beforePath, afterPath, repo, rev] = process.argv.slice(2);
const before = JSON.parse(readFileSync(beforePath, 'utf8'));
const after = JSON.parse(readFileSync(afterPath, 'utf8'));
const initialOf = (x) => (x.introduced_by ? `new ${x.introduced_by}` : `${x.approved} #${x.pr}`);

/** 機能 → { initial, changes: Set<"差分 ID|承認日|#PR"> } */
function fromBefore() {
  const m = new Map();
  for (const [dir, f] of Object.entries(before.features)) {
    m.set(dir, { initial: initialOf(f), born: f.introduced_by ?? null, changes: new Set() });
  }
  for (const [id, c] of Object.entries(before.changes)) {
    for (const dir of c.targets) {
      const e = m.get(dir);
      if (e && e.born !== id) e.changes.add(`${id}|${c.approved}|#${c.pr}`);
    }
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
  const BOTH_RE = /^(\d{4}-\d{2}-\d{2})（初版と差分 `([^`]+)`。PR #(\d+)）/; // 初版と差分が同じ PR
  const BORN_RE = /^(\d{4}-\d{2}-\d{2})（PR #(\d+)。差分 `([^`]+)`）/; // 差分で作った機能
  const DIFF_RE = /差分 `([^`]+)` は (\d{4}-\d{2}-\d{2})（PR #(\d+)(?: のマージ)?）/g;
  const approvalOf = new Map(); // 差分 ID → "承認日|#PR"（proposal.md の行）
  for (const f of files.filter((p) => /^specs\/releases\/[^/]+\/[^/]+\/proposal\.md$/.test(p))) {
    const a = git('show', `${rev}:${f}`).match(/^- 承認日:\s*(\d{4}-\d{2}-\d{2})\s*（PR #(\d+)）/m);
    approvalOf.set(f.split('/')[3], a ? `${a[1]}|#${a[2]}` : null);
  }
  for (const f of files.filter((p) => /^specs\/current\/[^/]+\/spec\.md$/.test(p))) {
    const dir = f.split('/')[2];
    const line = git('show', `${rev}:${f}`).match(/^- 承認日:\s*(.*)$/m)[1];
    const e = { initial: null, born: null, changes: new Set() };
    const b = line.match(BOTH_RE);
    const n = line.match(BORN_RE);
    const i = line.match(INIT_RE);
    if (b) {
      e.initial = `${b[1]} #${b[3]}`;
      e.changes.add(`${b[2]}|${b[1]}|#${b[3]}`);
    } else if (n) {
      e.initial = `new ${n[3]}`;
      e.born = n[3];
    } else if (i) {
      e.initial = `${i[1]} #${i[2]}`;
    } else {
      e.initial = `読めない: ${line.slice(0, 40)}`;
    }
    for (const x of line.matchAll(DIFF_RE)) e.changes.add(`${x[1]}|${x[2]}|#${x[3]}`);
    m.set(dir, e);
  }
  // releases の差分の specs/<dir>/ にある機能（current の行に無くても足す）
  for (const f of files.filter((p) => /^specs\/releases\/[^/]+\/[^/]+\/specs\/[^/]+\//.test(p))) {
    const [, , , id, , dir] = f.split('/');
    const ap = approvalOf.get(id);
    if (ap && m.has(dir) && m.get(dir).born !== id) m.get(dir).changes.add(`${id}|${ap}`);
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

- houki-egov-mcp の `baaacc3` と同じ変更です。読み取りは `@shuji-bonji/spec-ids` の `readFrontMatter` を import しています。そのため ci.yml の pr-scope ジョブに `npm ci`（と `cache: npm`）を足しました
- テストは 16 件 → 20 件（egov と同じ 4 件: 古い形の proposal.md / spec.md を止める、本文の「- 実装の変更: 不要」だけでは current を書けない、`introduced_by` を通す、判定関数）。fixture の `spec_id` は `ABBR` にし、`kind` は書いていません。spec-ids 0.3.0 を解決させて 20 件 pass
- このブランチ自体を新しい pr-scope に通した結果: `branch: chore/20261009-approval-front-matter（impl）、変更 34 ファイル` / `OK`
- houki-nta-mcp で足した `specs/changes/` の変換の例外（Q23'）は入れていません。abbr は変換の時点で `specs/changes/` が空で、当たらないためです

3 つのコピーの違い（そろえるのは pr-scope を spec-ids に取り込むとき＝Q20）:

| 違い | abbr | egov | nta |
|---|---|---|---|
| `onlyIdsAdded`（テスト名に ID を足すだけか） | 「ID を除くと同じ行」だけを見る。すでに ID の付いたテスト名に別の ID を足す変更は止める | 足した後に前の ID がすべて残り、数が増えていれば通す（差し替えは止める） | egov と同じ |
| `.gitkeep` の除外 | あり | あり | なし |
| 取り込み済み差分の `specs/changes/` の残りを消すこと | 許す（`releasedIds`） | 許す | 許さない |
| 変換の例外（Q23'） | なし | なし | あり |
| テストの件数 | 20 | 22 | 24 |

### 設計の「確かめていない点」

- 1（PR のブランチの check-pr-scope.mjs が動くか）: ci.yml の pr-scope ジョブは `actions/checkout@v4` を `ref` 指定なしで使うので、pull_request では PR のマージコミットが checkout され、PR のブランチの版が動きます
- 3（GitHub の表示）: この PR の Files changed で確かめてください
- 4（lint などの検査）: `lint`（eslint）と `format:check`（prettier）の npm scripts は `src` だけを渡すので、specs/ の Markdown・AGENTS.md・.github/scripts は対象外です。AGENTS.md の表の列幅は prettier でそろえました

🤖 Generated with [Claude Code](https://claude.com/claude-code)
