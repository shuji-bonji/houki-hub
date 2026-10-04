#!/usr/bin/env node
/**
 * 呼び出し例の「実測した版」を、現行の公開版と突き合わせる（houki-hub#5 の③）。
 *
 * scripts/reference-examples/<server>/ja/<tool>.md の各例は
 *   ::: details 呼び出し例 — 「…」
 *   - 実測: v0.10.4（2026-09-08）
 * の形で始まる。この「実測: vX」を stack.json の published（npm の公開版）と比べ、
 * 古い版で測ったままの例を一覧にする。呼び出し例の JSON は人が呼んで取り直すしかないので、
 * ここでやるのは「どれを取り直すか」を機械で出すところまで。
 *
 *   node scripts/check-example-versions.mjs                       # 表で出す（stack.json の published と比較）
 *   node scripts/check-example-versions.mjs --json                # 機械可読
 *   node scripts/check-example-versions.mjs --all                 # 古くない例も含めて全件
 *   node scripts/check-example-versions.mjs --current houki-nta=0.21.3   # 現行版を引数で上書き（複数可）
 *   node scripts/check-example-versions.mjs --strict              # 古い例があれば exit 1（既定は 0）
 *   node scripts/check-example-versions.mjs --root /path/to/houki-hub
 *
 * 依存なし（Node 22+）。判定部分は export してあり、scripts/check-example-versions.test.mjs で検査する。
 */

import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/** reference-examples のディレクトリ名 → stack.json の repos[].name */
export const SERVER_TO_REPO = {
  'houki-egov': 'houki-egov-mcp',
  'houki-nta': 'houki-nta-mcp',
};

const DETAILS_RE = /^:::\s*details\s+(.*)$/;
const MEASURED_RE = /^-\s*実測:\s*v?(\d+\.\d+\.\d+)(?:（([^）]*)）|\(([^)]*)\))?/;

/**
 * 1 ファイルの本文から例を取り出す。
 * `::: details` の見出しごとに 1 例。見出しの直後（空行を挟んでもよい）の「- 実測: vX（日付）」を実測版とする。
 * 実測の行が無い例は measured: null で返す（見落としを隠さない）。
 * @returns {{ heading: string, line: number, measured: string|null, measuredAt: string|null }[]}
 */
export function parseExamples(text) {
  const lines = text.split(/\r?\n/);
  const examples = [];
  let current = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const details = line.match(DETAILS_RE);
    if (details) {
      current = { heading: details[1].trim(), line: i + 1, measured: null, measuredAt: null };
      examples.push(current);
      continue;
    }
    if (!current) continue;
    if (line.trim() === ':::') {
      current = null;
      continue;
    }
    if (current.measured === null) {
      const m = line.match(MEASURED_RE);
      if (m) {
        current.measured = m[1];
        current.measuredAt = m[2] ?? m[3] ?? null;
      }
    }
  }
  return examples;
}

/** "1.2.3" どうしの比較。a < b なら負、等しければ 0、a > b なら正 */
export function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/**
 * 例ごとの判定。
 *   stale   実測版 < 現行版（取り直しの候補）
 *   current 実測版 = 現行版
 *   ahead   実測版 > 現行版（stack.json が古いか、publish 前に測った）
 *   unknown 実測の行が無い、または現行版が分からない
 * @param {{ server: string, file: string, heading: string, line: number, measured: string|null }[]} examples
 * @param {Record<string, string|null>} currentByServer  { 'houki-nta': '0.21.3', ... }
 */
export function classifyExamples(examples, currentByServer) {
  return examples.map((ex) => {
    const current = currentByServer[ex.server] ?? null;
    let status = 'unknown';
    if (ex.measured && current) {
      const d = compareVersions(ex.measured, current);
      status = d < 0 ? 'stale' : d > 0 ? 'ahead' : 'current';
    }
    return { ...ex, current, status };
  });
}

/** stack.json から server ごとの公開版を引く。published が null（npm 未公開・未測定）なら null */
export function currentVersionsFromStack(stack) {
  const out = {};
  for (const [server, repo] of Object.entries(SERVER_TO_REPO)) {
    const entry = (stack.repos ?? []).find((r) => r.name === repo);
    out[server] = entry?.published ?? null;
  }
  return out;
}

/** `--current houki-nta=0.21.3` を { 'houki-nta': '0.21.3' } にする */
export function parseCurrentOverrides(values) {
  const out = {};
  for (const v of values) {
    const [server, version] = String(v).split('=');
    if (!server || !version) throw new Error(`--current の形は <server>=<version> です: ${v}`);
    out[server] = version.replace(/^v/, '');
  }
  return out;
}

/** reference-examples/ を読んで、例を server / file 付きで平らに並べる */
export function collectExamples(root) {
  const base = join(root, 'scripts', 'reference-examples');
  const out = [];
  if (!existsSync(base)) return out;
  for (const server of readdirSync(base).sort()) {
    const dir = join(base, server, 'ja');
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
      const file = `scripts/reference-examples/${server}/ja/${name}`;
      for (const ex of parseExamples(readFileSync(join(dir, name), 'utf8'))) {
        out.push({ server, file, tool: basename(name, '.md'), ...ex });
      }
    }
  }
  return out;
}

const STATUS_JA = { stale: '古い', current: '現行', ahead: '現行より新しい', unknown: '判定不能' };

/** 表に載せる見出し。先頭の「呼び出し例 — 」は列名と重なるので落とす */
export function shortHeading(heading) {
  return heading.replace(/^呼び出し例\s*[—–-]\s*/, '').replace(/\|/g, '\\|');
}

/** Markdown の表。rows は classifyExamples の戻り値。ファイルは scripts/reference-examples/ からの相対 */
export function renderTable(rows) {
  const L = ['| サーバー | ファイル | 例の見出し | 実測版 | 現行版 | 判定 |', '| --- | --- | --- | --- | --- | --- |'];
  for (const r of rows) {
    const file = r.file.replace(/^scripts\/reference-examples\//, '');
    L.push(
      `| ${r.server} | \`${file}\` | ${shortHeading(r.heading)} | ${r.measured ? `v${r.measured}` : '（無し）'} | ${r.current ? `v${r.current}` : '（不明）'} | ${STATUS_JA[r.status]} |`,
    );
  }
  return L.join('\n');
}

/** 集計の 1 行（Issue 本文や標準出力の見出しに使う） */
export function summarize(rows) {
  const count = (s) => rows.filter((r) => r.status === s).length;
  return { total: rows.length, stale: count('stale'), current: count('current'), ahead: count('ahead'), unknown: count('unknown') };
}

// ── CLI ──────────────────────────────────────────────────────
function main(argv) {
  const args = argv.slice(2);
  const flag = (name) => args.includes(`--${name}`);
  const values = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));
  const root = resolve(values('root')[0] ?? join(HERE, '..'));
  const stackFile = join(root, 'stack.json');

  let current = {};
  if (existsSync(stackFile)) current = currentVersionsFromStack(JSON.parse(readFileSync(stackFile, 'utf8')));
  Object.assign(current, parseCurrentOverrides(values('current')));

  const rows = classifyExamples(collectExamples(root), current);
  const shown = flag('all') ? rows : rows.filter((r) => r.status !== 'current');
  const sum = summarize(rows);

  if (flag('json')) {
    console.log(JSON.stringify({ current, summary: sum, examples: shown }, null, 2));
  } else {
    const cur = Object.entries(current).map(([s, v]) => `${s} ${v ? `v${v}` : '（不明）'}`).join(' / ');
    console.log(`# 呼び出し例の実測版の照合（現行: ${cur}）\n`);
    console.log(`例 ${sum.total} 件のうち 古い ${sum.stale} / 現行 ${sum.current} / 現行より新しい ${sum.ahead} / 判定不能 ${sum.unknown}\n`);
    if (shown.length) console.log(renderTable(shown));
    else console.log('古い版で測ったままの例はありません。');
  }
  if (flag('strict') && sum.stale > 0) process.exit(1);
  process.exit(0);
}

/**
 * このファイルが node で直接起動されたか。argv1 は process.argv[1]、moduleUrl は import.meta.url。
 * 両方を realpathSync で実体のパスに揃えてから比べる。macOS の /tmp（/private/tmp へのシンボリックリンク）のように
 * シンボリックリンクを通して起動すると、argv1 はリンクのパス、import.meta.url は実体のパスになり、
 * 文字列のまま比べると一致せず、何も出さずに終了コード 0 で終わってしまうため。
 * パスが読めないとき（存在しない・権限が無い）は false。
 */
export function isMainModule(argv1, moduleUrl) {
  if (!argv1) return false;
  try {
    return realpathSync(argv1) === realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return false;
  }
}

if (isMainModule(process.argv[1], import.meta.url)) {
  main(process.argv);
}
