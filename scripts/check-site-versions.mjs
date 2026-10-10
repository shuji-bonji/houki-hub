#!/usr/bin/env node
/**
 * サイトの生成ページの版と、各リポジトリの公開版を比べる（houki-hub#5 ②「サイトと各リポジトリの版のずれの検出」）。
 *
 * 生成ページ（site/docs/reference/ と site/docs/specs/）は、冒頭の
 *   houki-nta-mcp **v0.27.0** の `tools/list` と … から自動生成しました（…）
 * の行に、生成したときの版を書いている。この版を、公開版（npm の latest、npm に無い Skill は最新のタグ）と比べる。
 * 版の決め方は .github/scripts/prepare-sources.mjs と同じ（resolveVersions）。
 *
 *   node scripts/check-site-versions.mjs                               # 公開版を npm と GitHub から読んで比べる
 *   node scripts/check-site-versions.mjs --versions <dir>/versions.json  # prepare-sources.mjs が書いた版を使う
 *   node scripts/check-site-versions.mjs --latest houki-nta-mcp=0.27.0   # 版を引数で渡す（複数可。読みに行かない）
 *   node scripts/check-site-versions.mjs --json                        # 機械可読
 *   node scripts/check-site-versions.mjs --strict                      # 一致しないリポジトリがあれば exit 1
 *
 * 分かるのは「ページの冒頭の版」と「公開版」の違いだけ。冒頭の版が同じでも、公開していない作業コピーから
 * 作ったページは中身が公開版と違うことがある（2026-10-10 に、egov と abbreviations の仕様書ページの
 * 「承認の履歴」で見つかった）。中身の違いは、CI で公開版から作り直したときの差分で分かる。
 *
 * 依存なし（Node 22+）。読み取りと判定は export してあり、check-site-versions.test.mjs で検査する。
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareVersions, isMainModule } from './check-example-versions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** 生成ページのフォルダー（site/docs からの相対）→ リポジトリ名 */
export const PAGE_DIRS = {
  'reference/mcp/houki-egov': 'houki-egov-mcp',
  'reference/mcp/houki-nta': 'houki-nta-mcp',
  'reference/lib/houki-abbreviations': 'houki-abbreviations',
  'specs/houki-egov': 'houki-egov-mcp',
  'specs/houki-nta': 'houki-nta-mcp',
  'specs/houki-abbreviations': 'houki-abbreviations',
  'specs/houki-research': 'houki-research-skill',
};

const GENERATED_LINE_RE = /\*\*v(\d+\.\d+\.\d+)\*\*[^\n]*から自動生成しました/;

/** ページの本文から、冒頭の「自動生成しました」の行の版を取り出す。無ければ null（人が書いたページなど） */
export function pageVersion(text) {
  return text.match(GENERATED_LINE_RE)?.[1] ?? null;
}

/** site/docs の生成ページを読み、{ repo, dir, file, version } を並べる */
export function collectPageVersions(siteDocs) {
  const out = [];
  for (const [dir, repo] of Object.entries(PAGE_DIRS)) {
    const abs = join(siteDocs, dir);
    if (!existsSync(abs)) continue;
    for (const name of readdirSync(abs).filter((f) => f.endsWith('.md')).sort()) {
      const version = pageVersion(readFileSync(join(abs, name), 'utf8'));
      if (version) out.push({ repo, dir, file: `${dir}/${name}`, version });
    }
  }
  return out;
}

/**
 * リポジトリごとにまとめて判定する。
 *   match   全ページの版 = 公開版
 *   behind  公開版より古い版のページがある（作り直しが要る）
 *   ahead   公開版より新しい版のページがある（publish 前に作ったか、公開版を読み違えた）
 *   unknown 公開版が分からない
 * @param {{ repo: string, file: string, version: string }[]} pages
 * @param {Record<string, string|null>} latestByRepo
 */
export function classifySite(pages, latestByRepo) {
  const repos = [...new Set([...Object.values(PAGE_DIRS)])];
  return repos.map((repo) => {
    const mine = pages.filter((p) => p.repo === repo);
    const latest = latestByRepo[repo] ?? null;
    const versions = [...new Set(mine.map((p) => p.version))].sort(compareVersions);
    let status = 'unknown';
    const behind = latest ? mine.filter((p) => compareVersions(p.version, latest) < 0) : [];
    const ahead = latest ? mine.filter((p) => compareVersions(p.version, latest) > 0) : [];
    if (latest) status = behind.length ? 'behind' : ahead.length ? 'ahead' : 'match';
    return { repo, latest, versions, pages: mine.length, behind: behind.map((p) => p.file), ahead: ahead.map((p) => p.file), status };
  });
}

const STATUS_JA = { match: '一致', behind: 'サイトが古い', ahead: 'サイトが新しい', unknown: '判定不能' };

export function renderSiteTable(rows) {
  const L = ['| リポジトリ | ページの版 | ページ数 | 公開版 | 判定 |', '| --- | --- | --- | --- | --- |'];
  for (const r of rows) {
    const vs = r.versions.length ? r.versions.map((v) => `v${v}`).join('・') : '（ページ無し）';
    const extra = r.status === 'behind' ? `（古いページ ${r.behind.length} 枚）` : r.status === 'ahead' ? `（新しいページ ${r.ahead.length} 枚）` : '';
    L.push(`| ${r.repo} | ${vs} | ${r.pages} | ${r.latest ? `v${r.latest}` : '（不明）'} | ${STATUS_JA[r.status]}${extra} |`);
  }
  return L.join('\n');
}

/** `houki-nta-mcp=0.27.0` の並びを { repo: version } に */
export function parseLatestArgs(values) {
  const out = {};
  for (const v of values) {
    const [repo, version] = String(v).split('=');
    if (!repo || !version) throw new Error(`--latest の形は <リポジトリ>=<版> です: ${v}`);
    out[repo] = version.replace(/^v/, '');
  }
  return out;
}

async function main(argv) {
  const args = argv.slice(2);
  const flag = (name) => args.includes(`--${name}`);
  const values = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));
  const root = resolve(values('root')[0] ?? join(HERE, '..'));

  let latest = parseLatestArgs(values('latest'));
  if (!Object.keys(latest).length) {
    let repos;
    const file = values('versions')[0];
    if (file) {
      repos = JSON.parse(readFileSync(file, 'utf8')).repos;
    } else {
      const { resolveVersions } = await import('../.github/scripts/prepare-sources.mjs');
      repos = await resolveVersions();
    }
    latest = Object.fromEntries(repos.map((r) => [r.repo, r.version]));
  }

  const siteDocs = join(root, 'site/docs');
  const rows = classifySite(collectPageVersions(siteDocs), latest);
  if (flag('json')) {
    console.log(JSON.stringify({ latest, repos: rows }, null, 2));
  } else {
    console.log('# サイトの生成ページの版と公開版\n');
    console.log(renderSiteTable(rows));
    for (const r of rows.filter((x) => x.behind.length || x.ahead.length)) {
      console.log(`\n${r.repo}: ${[...r.behind, ...r.ahead].map((f) => f).join(', ')}`);
    }
  }
  if (flag('strict') && rows.some((r) => r.status !== 'match')) process.exit(1);
}

if (isMainModule(process.argv[1], import.meta.url)) {
  main(process.argv).catch((e) => {
    console.error(e.message);
    process.exit(2);
  });
}
