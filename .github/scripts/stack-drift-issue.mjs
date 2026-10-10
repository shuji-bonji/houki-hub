#!/usr/bin/env node
/**
 * stack.json の公開版と npm の最新版を突き合わせ、ずれを houki-hub 自身の Issue にする（houki-hub#5 の①）。
 * 同じ Issue の別の節に、現行版で確かめていない呼び出し例の一覧（#5 の③、scripts/check-example-versions.mjs）も載せる。
 * 2 つは直し方が違う。stack.json のずれは generate-stack.mjs で、確かめていない例は check-examples-contract.mjs で直す。
 *
 * .github/workflows/stack-check.yml から毎日呼ばれる。GitHub への書き込みは GITHUB_TOKEN（issues: write）で足りる。
 *
 *   node .github/scripts/stack-drift-issue.mjs             # 照合 → Issue を作る / 更新する / 閉じる
 *   node .github/scripts/stack-drift-issue.mjs --dry-run   # GitHub には書かず、判定と本文を標準出力に出す
 *   node .github/scripts/stack-drift-issue.mjs --root /path/to/houki-hub
 *
 * 終了コード: 0 = 一致、1 = ずれあり（Issue に書いた）、2 = 判定不能（npm に届かなかった。Issue には触らない）
 *
 * 環境変数: GITHUB_TOKEN, GITHUB_REPOSITORY（owner/repo）。--dry-run のときは無くてよい。
 * 依存なし（Node 22+。fetch を使う）。判定と本文の組み立ては export してあり、stack-drift-issue.test.mjs で検査する。
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyExamples,
  collectExamples,
  isMainModule,
  renderTable,
  SERVER_TO_REPO,
  summarize,
  summaryLine,
} from '../../scripts/check-example-versions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

export const ISSUE_TITLE = 'stack.json の版が npm と違う';
export const ISSUE_LABEL = 'stack-drift';
const MARKER_RE = /<!--\s*stack-drift:\s*(\S+?)\s*-->/;

// ── npm ──────────────────────────────────────────────────────

/** registry の dist-tags.latest。届かなければ null（「ずれ」と「測れなかった」を混ぜない） */
export async function fetchLatest(pkg, fetchImpl = fetch) {
  try {
    const res = await fetchImpl(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, {
      headers: { accept: 'application/vnd.npm.install-v1+json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.['dist-tags']?.latest ?? null;
  } catch {
    return null;
  }
}

// ── 判定 ─────────────────────────────────────────────────────

/**
 * stack.json の released かつ npm ありの項目を、npm の最新版と比べる。
 * @param {{ repos: any[] }} stack
 * @param {Record<string, string|null>} latestByPkg  { '@shuji-bonji/houki-nta-mcp': '0.21.3', ... }。null は測れなかった
 */
export function detectDrift(stack, latestByPkg) {
  const drift = [];
  const unmeasured = [];
  let checked = 0;
  for (const r of stack.repos ?? []) {
    if (!r.npm || r.status !== 'released') continue;
    const latest = latestByPkg[r.npm] ?? null;
    if (latest === null) {
      unmeasured.push({ name: r.name, npm: r.npm });
      continue;
    }
    checked += 1;
    if (latest !== r.published) drift.push({ name: r.name, npm: r.npm, stackVersion: r.published, npmVersion: latest });
  }
  return { checked, drift, unmeasured };
}

/** npm の最新版を server 名（houki-egov / houki-nta）で引けるようにする。③の「現行版」に使う */
export function currentByServerFromLatest(stack, latestByPkg) {
  const out = {};
  for (const [server, repoName] of Object.entries(SERVER_TO_REPO)) {
    const r = (stack.repos ?? []).find((x) => x.name === repoName);
    out[server] = (r?.npm && latestByPkg[r.npm]) || r?.published || null;
  }
  return out;
}

/** ずれの中身を 1 行にしたもの。本文の末尾に埋めて、前回と同じずれかどうかを見る */
export function fingerprintOf(drift) {
  return drift.map((d) => `${d.name}@${d.stackVersion}->${d.npmVersion}`).sort().join(',') || 'none';
}

export function fingerprintFromBody(body) {
  return body?.match(MARKER_RE)?.[1] ?? null;
}

/**
 * 何をするかを決める。GitHub は触らない。
 *   create  ずれがあり、open の Issue が無い
 *   update  ずれがあり、open の Issue がある（本文を差し替え、ずれの中身が変わっていればコメント）
 *   close   ずれが無く、open の Issue がある
 *   none    ずれが無く Issue も無い / 判定不能（npm に届かなかったので、Issue には触らない）
 */
export function decideAction({ drift, unmeasured, openIssue }) {
  if (unmeasured.length > 0) return { action: 'none', reason: `判定不能 ${unmeasured.length} 件（${unmeasured.map((u) => u.name).join(', ')}）` };
  if (drift.length > 0) {
    if (!openIssue) return { action: 'create', reason: `ずれ ${drift.length} 件` };
    const changed = fingerprintFromBody(openIssue.body) !== fingerprintOf(drift);
    return { action: 'update', reason: changed ? 'ずれの中身が変わった' : 'ずれは前回と同じ', changed };
  }
  if (openIssue) return { action: 'close', reason: 'ずれが解消した' };
  return { action: 'none', reason: 'ずれなし' };
}

// ── 本文 ─────────────────────────────────────────────────────

export function nowJst(date = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute} JST`;
}

/**
 * Issue の本文。2 つの節に分ける（houki-hub#44 のやること 4）。
 *   「stack.json のずれ」: ずれの表と直し方（generate-stack.mjs）
 *   「確かめていない呼び出し例」: 実測・確かめた版が現行版より前の例と、直し方（check-examples-contract.mjs --write-verified）
 * 末尾に fingerprint の印。
 * @param {{ drift: any[], staleRows: any[], currentByServer: Record<string,string|null>, checkedAt?: string, runUrl?: string|null }} p
 */
export function buildIssueBody({ drift, staleRows, currentByServer, checkedAt = nowJst(), runUrl = null }) {
  const L = [];
  L.push('`stack.json` の `published`（公開版）と npm の最新版（`dist-tags.latest`）が違います。');
  L.push(`\`.github/workflows/stack-check.yml\` が ${checkedAt} に検出しました${runUrl ? `（[実行ログ](${runUrl})）` : ''}。`);
  L.push('');
  L.push('## stack.json のずれ');
  L.push('');
  L.push('| リポジトリ | npm パッケージ | stack.json | npm |');
  L.push('| --- | --- | --- | --- |');
  for (const d of drift) L.push(`| ${d.name} | \`${d.npm}\` | ${d.stackVersion ?? '—'} | ${d.npmVersion} |`);
  L.push('');
  L.push('### 直し方');
  L.push('');
  L.push('`stack.json` と README の版表は `npm view` の実測から生成するので、手元（Mac）で回して commit します。CI には `mcp/` などの clone が無いので、CI では生成しません。');
  L.push('');
  L.push('```sh');
  L.push('node scripts/generate-stack.mjs --readme');
  L.push(`git add stack.json README.md && git commit -m "chore: stack.json を npm の版に揃える（${drift.map((d) => `${d.name.replace(/^houki-/, '').replace(/-mcp$/, '')} ${d.npmVersion}`).join(' / ')}）"`);
  L.push('```');
  L.push('');
  L.push('main に push すると `stack-check.yml` が再検査し、ずれが無ければこの Issue を閉じます。');
  L.push('');
  L.push('## 確かめていない呼び出し例');
  L.push('');
  const sum = summarize(staleRows);
  const cur = Object.entries(currentByServer).map(([s, v]) => `${s} ${v ? `v${v}` : '（不明）'}`).join(' / ');
  L.push(`\`node scripts/check-example-versions.mjs\` の結果です（現行版は npm の最新版: ${cur}）。「前の版で実測」は、例の「実測」と「確かめた版」の新しいほうが現行版より前という意味で、版番号を比べただけです。応答が変わったかどうかは表しません。`);
  L.push('');
  const stale = staleRows.filter((r) => r.status !== 'current');
  L.push(summaryLine(sum));
  L.push('');
  if (stale.length) {
    L.push('<details>');
    L.push(`<summary>一覧（${stale.length} 件）</summary>`);
    L.push('');
    L.push(renderTable(stale));
    L.push('');
    L.push('</details>');
    L.push('');
    L.push('### 直し方');
    L.push('');
    L.push('`stack.json` を直した後に、手元（Mac。DB の要る例は手元のローカル DB を引くため）で照合のスクリプトを流します。「一致」の例には `- 確かめた版:` の行が書かれます。「形の違い」と「データ側の差分」の例は、例を取り直すか Issue にするかを人が決めます（`scripts/reference-examples/README.md` の「公開の後に流す」）。');
    L.push('');
    L.push('```sh');
    L.push('node scripts/check-examples-contract.mjs --write-verified > /tmp/contract.md; head -8 /tmp/contract.md');
    L.push('```');
  } else {
    L.push('現行版で確かめていない例はありません。');
  }
  L.push('');
  L.push(`<!-- stack-drift: ${fingerprintOf(drift)} -->`);
  return L.join('\n');
}

// ── GitHub ───────────────────────────────────────────────────

/** GitHub REST の薄い包み。Issue の一覧・作成・更新・コメント・close とラベルの確保だけ */
export function githubClient({ token, repository, fetchImpl = fetch, apiBase = 'https://api.github.com' }) {
  const call = async (method, path, body) => {
    const res = await fetchImpl(`${apiBase}/repos/${repository}${path}`, {
      method,
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'x-github-api-version': '2022-11-28',
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 404 && method === 'GET') return null;
    if (!res.ok) throw new Error(`GitHub API ${method} ${path} → ${res.status} ${await res.text()}`);
    return res.status === 204 ? null : res.json();
  };
  return {
    /** 題名が一致する open の Issue（PR は除く）。同じ題名が複数あれば番号の小さいもの */
    async findOpenIssue(title, label) {
      const list = (await call('GET', `/issues?state=open&labels=${encodeURIComponent(label)}&per_page=100`)) ?? [];
      return list.filter((i) => !i.pull_request && i.title === title).sort((a, b) => a.number - b.number)[0] ?? null;
    },
    async ensureLabel(name, color, description) {
      if (await call('GET', `/labels/${encodeURIComponent(name)}`)) return;
      await call('POST', '/labels', { name, color, description });
    },
    createIssue: (title, body, labels) => call('POST', '/issues', { title, body, labels }),
    updateIssue: (number, body) => call('PATCH', `/issues/${number}`, { body }),
    closeIssue: (number) => call('PATCH', `/issues/${number}`, { state: 'closed', state_reason: 'completed' }),
    comment: (number, body) => call('POST', `/issues/${number}/comments`, { body }),
  };
}

// ── main ─────────────────────────────────────────────────────

async function main(argv) {
  const args = argv.slice(2);
  const flag = (name) => args.includes(`--${name}`);
  const value = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const root = resolve(value('root') ?? join(HERE, '..', '..'));
  const dryRun = flag('dry-run');

  const stackFile = join(root, 'stack.json');
  if (!existsSync(stackFile)) {
    console.error(`stack.json がありません: ${stackFile}`);
    return 2;
  }
  const stack = JSON.parse(readFileSync(stackFile, 'utf8'));

  // 1. npm の最新版
  const pkgs = (stack.repos ?? []).filter((r) => r.npm && r.status === 'released').map((r) => r.npm);
  const latestByPkg = Object.fromEntries(await Promise.all(pkgs.map(async (p) => [p, await fetchLatest(p)])));
  const { checked, drift, unmeasured } = detectDrift(stack, latestByPkg);

  console.log(`# stack.json 照合（npm ${checked} 件）`);
  for (const d of drift) console.log(`  ⚠ ${d.name}: stack.json ${d.stackVersion} ≠ npm ${d.npmVersion}`);
  for (const u of unmeasured) console.log(`  ・${u.name}: npm registry が応答しなかった`);

  // 2. 現行版で確かめていない呼び出し例（現行版は npm の最新版）
  const currentByServer = currentByServerFromLatest(stack, latestByPkg);
  const staleRows = classifyExamples(collectExamples(root), currentByServer);
  const sum = summarize(staleRows);
  console.log(`# 呼び出し例 ${sum.total} 件のうち 前の版で実測 ${sum.stale} 件`);

  // 3. Issue
  const runUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null;
  const checkedAt = nowJst();
  const body = buildIssueBody({ drift, staleRows, currentByServer, checkedAt, runUrl });

  if (dryRun) {
    const decided = decideAction({ drift, unmeasured, openIssue: null });
    console.log(`# --dry-run: GitHub には書きません（open の Issue が無いものとして判定: ${decided.action} — ${decided.reason}）\n`);
    console.log(body);
  } else {
    const token = process.env.GITHUB_TOKEN;
    const repository = process.env.GITHUB_REPOSITORY;
    if (!token || !repository) {
      console.error('GITHUB_TOKEN と GITHUB_REPOSITORY が要ります（手元で試すなら --dry-run）');
      return 2;
    }
    const gh = githubClient({ token, repository });
    const openIssue = await gh.findOpenIssue(ISSUE_TITLE, ISSUE_LABEL);
    const decided = decideAction({ drift, unmeasured, openIssue });
    console.log(`# Issue: ${decided.action} — ${decided.reason}${openIssue ? `（#${openIssue.number}）` : ''}`);
    if (decided.action === 'create') {
      await gh.ensureLabel(ISSUE_LABEL, 'd93f0b', 'stack.json の版が npm と違う（stack-check.yml が自動で立てる）');
      const issue = await gh.createIssue(ISSUE_TITLE, body, [ISSUE_LABEL]);
      console.log(`  立てた: #${issue.number} ${issue.html_url}`);
    } else if (decided.action === 'update') {
      await gh.updateIssue(openIssue.number, body);
      if (decided.changed) {
        await gh.comment(openIssue.number, `${checkedAt} の再検査でずれの中身が変わりました。本文を差し替えています。\n\n${drift.map((d) => `- ${d.name}: stack.json ${d.stackVersion} ≠ npm ${d.npmVersion}`).join('\n')}`);
      }
      console.log(`  更新した: #${openIssue.number}${decided.changed ? '（コメントあり）' : '（本文のみ）'}`);
    } else if (decided.action === 'close') {
      await gh.comment(openIssue.number, `${checkedAt} の再検査で \`stack.json\` と npm が一致したので閉じます。`);
      await gh.closeIssue(openIssue.number);
      console.log(`  閉じた: #${openIssue.number}`);
    }
  }

  if (unmeasured.length) {
    console.log(`\n  判定不能 ${unmeasured.length} 件 — 指標を信用しない`);
    return 2;
  }
  if (drift.length) {
    console.log(`\n  ずれ ${drift.length} 件 — \`node scripts/generate-stack.mjs --readme\` で更新すること`);
    return 1;
  }
  console.log('\n  すべて一致');
  return 0;
}

if (isMainModule(process.argv[1], import.meta.url)) {
  main(process.argv).then((code) => process.exit(code), (err) => { console.error(err); process.exit(2); });
}
