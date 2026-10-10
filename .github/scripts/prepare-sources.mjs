#!/usr/bin/env node
/**
 * リファレンスと仕様書ページを CI で作り直すための入力を、公開版から揃える（houki-hub#5 ②）。
 *
 * .github/workflows/reference-regen.yml から呼ばれる。手元で試すときも同じコマンドで動く。
 *
 *   node .github/scripts/prepare-sources.mjs --out <dir>          # 版を決めて clone し、<dir>/versions.json を書く
 *   node .github/scripts/prepare-sources.mjs --out <dir> --dry-run # 版を決めて表示するだけ（clone しない）
 *
 * することは 4 つ。
 *
 * 1. 版を決める。npm に公開しているもの（MCP 2 つと houki-abbreviations）は npm の `dist-tags.latest`、
 *    npm に無い Skill は GitHub の最新のタグ（semver の一番大きいもの）。
 *    npm の版と最新のタグが食い違うとき（タグを打ったが publish が失敗した、など）は npm の版で作り、食い違いを versions.json に残す
 * 2. 各リポジトリをその版のタグ（v<版>）で浅く clone する（`<dir>/<リポジトリ名>/`）。
 *    specs/ と Skill の workflows/ は npm のパッケージに入っていないため。MCP の src/ はライブラリの使用状況の走査に使う
 * 3. houki-abbreviations は、公開した tarball の dist/ を clone に重ねる（リファレンスは .d.ts から作るため。build はしない）
 * 4. typescript（.d.ts を読む）と @shuji-bonji/spec-ids（承認の履歴を読む）を `<dir>/node_modules` に入れる。
 *    版の範囲は houki-abbreviations の package.json の devDependencies に合わせる
 *
 * MCP は clone を build せず、`npx -y <npm>@<版>` で起動する（HOUKI_MCP_LAUNCH=npx）。
 * versions.json の `mcpVersions` をそのまま HOUKI_MCP_VERSIONS に渡せる形で出す。
 * GITHUB_ENV があれば、HOUKI_SOURCE_DIR・HOUKI_MCP_LAUNCH・HOUKI_MCP_VERSIONS を書き込む。
 *
 * 依存なし（Node 22+。git と npm のコマンドを使う）。版の決め方は export してあり、prepare-sources.test.mjs で検査する。
 */

import { spawnSync } from 'node:child_process';
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { compareVersions, isMainModule } from '../../scripts/check-example-versions.mjs';

const GITHUB = 'https://github.com/shuji-bonji';

/**
 * 作り直しに使うリポジトリ。server は scripts/lib/mcp-client.mjs の MCP_SERVERS のキー（MCP のときだけ）。
 * MCP が増えたら、ここと MCP_SERVERS と generate-reference.mjs の REGISTRY に足す。
 */
export const SOURCE_REPOS = [
  { repo: 'houki-egov-mcp', npm: '@shuji-bonji/houki-egov-mcp', server: 'houki-egov' },
  { repo: 'houki-nta-mcp', npm: '@shuji-bonji/houki-nta-mcp', server: 'houki-nta' },
  { repo: 'houki-abbreviations', npm: '@shuji-bonji/houki-abbreviations', overlayDist: true },
  { repo: 'houki-research-skill', npm: null },
];

/** `git ls-remote --tags --refs` の出力から、semver の形のタグのうち一番大きいもの（v 付きのまま）。無ければ null */
export function latestSemverTag(lsRemoteOutput) {
  const tags = String(lsRemoteOutput)
    .split('\n')
    .map((l) => l.trim().split(/\s+/)[1]?.replace(/^refs\/tags\//, ''))
    .filter((t) => t && /^v\d+\.\d+\.\d+$/.test(t));
  if (!tags.length) return null;
  return tags.sort((a, b) => compareVersions(a.slice(1), b.slice(1))).at(-1);
}

/**
 * 1 つのリポジトリの版を決める。
 * @param {{ repo: string, npm: string|null }} entry
 * @param {{ npmLatest: string|null, latestTag: string|null }} seen
 * @returns {{ repo: string, version: string|null, tag: string|null, npmLatest: string|null, latestTag: string|null, note: string|null }}
 */
export function decideVersion(entry, { npmLatest, latestTag }) {
  const tagVersion = latestTag ? latestTag.replace(/^v/, '') : null;
  if (!entry.npm) {
    return { repo: entry.repo, version: tagVersion, tag: latestTag, npmLatest: null, latestTag, note: latestTag ? null : 'タグが見つからない' };
  }
  if (!npmLatest) {
    return { repo: entry.repo, version: null, tag: null, npmLatest, latestTag, note: 'npm の最新版を読めなかった' };
  }
  let note = null;
  if (tagVersion && tagVersion !== npmLatest) {
    note =
      compareVersions(tagVersion, npmLatest) > 0
        ? `最新のタグ ${latestTag} が npm（${npmLatest}）より新しい。publish が終わっていない可能性がある。npm の版で作る`
        : `npm（${npmLatest}）が最新のタグ ${latestTag} より新しい。タグを確かめる`;
  }
  return { repo: entry.repo, version: npmLatest, tag: `v${npmLatest}`, npmLatest, latestTag, note };
}

/** `^0.2.0` `^0.3.0` のような範囲のうち、下限が一番新しいもの。どれも読めなければ null */
export function newestRange(ranges) {
  const valid = ranges.filter((r) => typeof r === 'string' && /\d+\.\d+\.\d+/.test(r));
  if (!valid.length) return null;
  const low = (r) => r.match(/\d+\.\d+\.\d+/)[0];
  return valid.sort((a, b) => compareVersions(low(a), low(b))).at(-1);
}

/** server=版 の一覧（HOUKI_MCP_VERSIONS の形） */
export function mcpVersionsOf(decided) {
  return SOURCE_REPOS.filter((e) => e.server)
    .map((e) => {
      const d = decided.find((x) => x.repo === e.repo);
      return d?.version ? `${e.server}=${d.version}` : null;
    })
    .filter(Boolean)
    .join(',');
}

// ── 外への問い合わせ ─────────────────────────────────────────

async function fetchNpmLatest(pkg) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, {
      headers: { accept: 'application/vnd.npm.install-v1+json' },
    });
    if (!res.ok) return null;
    return (await res.json())?.['dist-tags']?.latest ?? null;
  } catch {
    return null;
  }
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} が失敗しました（${r.status}）\n${r.stderr ?? ''}`);
  return r.stdout;
}

/** SOURCE_REPOS の全部の版を決める（npm と GitHub のタグを読む）。check-site-versions.mjs も使う */
export async function resolveVersions() {
  return Promise.all(
    SOURCE_REPOS.map(async (entry) => {
      const npmLatest = entry.npm ? await fetchNpmLatest(entry.npm) : null;
      const lsRemote = run('git', ['ls-remote', '--tags', '--refs', `${GITHUB}/${entry.repo}`]);
      return decideVersion(entry, { npmLatest, latestTag: latestSemverTag(lsRemote) });
    }),
  );
}

// ── CLI ──────────────────────────────────────────────────────

async function main(argv) {
  const args = argv.slice(2);
  const value = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const dryRun = args.includes('--dry-run');
  const out = resolve(value('out') ?? join(tmpdir(), 'houki-sources'));

  const decided = await resolveVersions();
  for (const d of decided) console.log(`${d.repo}: ${d.version ? `v${d.version}` : '（決められない）'}${d.note ? `  ※ ${d.note}` : ''}`);
  const mcpVersions = mcpVersionsOf(decided);
  const result = { preparedAt: new Date().toISOString(), sourceDir: out, mcpVersions, repos: decided };
  if (dryRun) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  mkdirSync(out, { recursive: true });
  for (const d of decided) {
    if (!d.version) continue;
    const dest = join(out, d.repo);
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    run('git', ['clone', '--quiet', '--depth', '1', '--branch', d.tag, `${GITHUB}/${d.repo}`, dest]);
    const entry = SOURCE_REPOS.find((e) => e.repo === d.repo);
    if (entry.overlayDist) {
      const tmp = mkdtempSync(join(tmpdir(), 'houki-pack-'));
      const file = run('npm', ['pack', `${entry.npm}@${d.version}`, '--silent', '--pack-destination', tmp]).trim().split('\n').at(-1);
      run('tar', ['xzf', join(tmp, file), '-C', tmp]);
      cpSync(join(tmp, 'package/dist'), join(dest, 'dist'), { recursive: true });
      rmSync(tmp, { recursive: true, force: true });
      console.log(`  ${d.repo}: npm の ${d.version} の dist/ を重ねた`);
    }
  }

  // typescript は houki-abbreviations（.d.ts を読む対象）の devDependencies の範囲に合わせる。
  // spec-ids は clone したリポジトリの中で一番新しい範囲にする（承認の履歴を読む history() は 0.3.0 から）
  const devOf = (repo) => {
    const p = join(out, repo, 'package.json');
    return existsSync(p) ? (JSON.parse(readFileSync(p, 'utf8')).devDependencies ?? {}) : {};
  };
  const tools = [
    `typescript@${devOf('houki-abbreviations').typescript ?? '^5'}`,
    `@shuji-bonji/spec-ids@${newestRange(decided.map((d) => devOf(d.repo)['@shuji-bonji/spec-ids'])) ?? '^0.3.0'}`,
  ];
  if (!existsSync(join(out, 'package.json'))) writeFileSync(join(out, 'package.json'), '{ "private": true }\n');
  run('npm', ['install', '--no-save', '--no-package-lock', '--no-audit', '--no-fund', '--prefix', out, ...tools], { stdio: 'inherit' });
  console.log(`  ${out}/node_modules に ${tools.join(' ')} を入れた`);

  writeFileSync(join(out, 'versions.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(`wrote ${join(out, 'versions.json')}`);
  if (process.env.GITHUB_ENV) {
    appendFileSync(process.env.GITHUB_ENV, `HOUKI_SOURCE_DIR=${out}\nHOUKI_MCP_LAUNCH=npx\nHOUKI_MCP_VERSIONS=${mcpVersions}\n`);
  }
}

if (isMainModule(process.argv[1], import.meta.url)) {
  main(process.argv).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
