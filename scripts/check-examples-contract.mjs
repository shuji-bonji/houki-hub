#!/usr/bin/env node
/**
 * 呼び出し例を同じ引数で流し、例と同じ応答が返るかを機械で確かめる（契約の確認のスクリプト。houki-hub#44）。
 *
 * scripts/reference-examples/<server>/ja/<tool>.md の各例（`::: details 呼び出し例 — …`）について、
 * `**引数**` の JSON でツールを呼び、`**返る JSON` の jsonc を部分一致のパターンとして応答と比べる。
 * 比べ方の規則は scripts/lib/example-contract.mjs、MCP の起動は scripts/lib/mcp-client.mjs
 * （generate-reference.mjs と同じ仕組み）。
 *
 * 置き場所と回す場所: shuji の Mac で回す。DB の要る例（「- ローカル DB: あり」）は手元のローカル DB を引くため、CI では回さない。
 * DB の無い環境では `--db absent` を付けると、DB の要る例を「未確認」にして残りを流す。このときローカル DB と保存先は
 * 使い捨てのフォルダーに向ける（HOUKI_EGOV_DB_PATH などを渡す）。`--db present`（既定）は手元の DB をそのまま引くので、
 * DB に無い文書を国税庁サイトから取った応答は手元の DB に書き戻される（scripts/reference-examples/README.md の「ローカル DB の状態で応答が変わるツール」）。
 *
 *   node scripts/check-examples-contract.mjs                          # 全例（公開版を npx で起動。版は stack.json の published）
 *   node scripts/check-examples-contract.mjs --server houki-egov       # 1 つのサーバーだけ
 *   node scripts/check-examples-contract.mjs --tool get_law --tool resolve_abbreviation
 *   node scripts/check-examples-contract.mjs --db absent              # DB の要る例を流さない（VM・CI）
 *   node scripts/check-examples-contract.mjs --version houki-nta=0.27.1  # 版を上書き（公開した直後など）
 *   node scripts/check-examples-contract.mjs --launch local           # mcp/<repo>/dist を起動（公開前のビルドを試す）
 *   node scripts/check-examples-contract.mjs --json                   # 機械可読
 *   node scripts/check-examples-contract.mjs --strict                 # 形の違いがあれば exit 1
 *   node scripts/check-examples-contract.mjs --write-verified         # 「一致」の例に「- 確かめた版: vX（日付）」を書く
 *
 * 起動の仕方は環境変数 HOUKI_MCP_LAUNCH があればそれに従い、無ければ npx（このスクリプトの既定）。
 * 結果は表（Markdown）か JSON で標準出力に出す。docs/notes/<日付>-contract-check-….md に貼る想定。
 *
 * --write-verified（Q14 の案 B）: 「一致」の例だけ、例のファイルの「- 実測:」の次の行に「- 確かめた版: vX（YYYY-MM-DD）」を書く
 * （既にあれば置き換える。版が同じなら変えない。実測と同じ版なら書かない）。版は起動したサーバーの serverInfo.version。
 * 公開版を確かめた記録なので、npx で起動したときだけ書く（--launch local では書かない）。
 * 「データ側の差分」の例は、例の値を書き直すかを人が決めるので書かない。
 *
 * 依存なし（Node 22+）。
 */

import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { currentVersionsFromStack, isMainModule } from './check-example-versions.mjs';
import {
  STATUS_JA,
  VOLATILE_RULES,
  compareMarkdownLines,
  comparePattern,
  looksLikeError,
  normalizeHome,
  parseCheckLines,
  parseContractExamples,
  parseJsoncPattern,
  statusOf,
  valueAt,
  writeVerifiedLines,
} from './lib/example-contract.mjs';
import { isolatedDbEnv, isolatedPathAliases, launchConfig, MCP_SERVERS, McpStdioClient, parseVersionList } from './lib/mcp-client.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** 例の「- ローカル DB:」の行から、DB が要るかを決める（「あり」で始まれば要る）。行が無い例は、DB の無い環境では流さない（precheck） */
export function needsDb(localDb) {
  return typeof localDb === 'string' && /^あり/.test(localDb);
}

/** reference-examples/ を読んで、照合する例を server / tool / file 付きで並べる */
export function collectContractExamples(root, { servers = null, tools = null } = {}) {
  const base = join(root, 'scripts', 'reference-examples');
  const out = [];
  if (!existsSync(base)) return out;
  for (const server of readdirSync(base).sort()) {
    if (!(server in MCP_SERVERS)) continue;
    if (servers && !servers.includes(server)) continue;
    const dir = join(base, server, 'ja');
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
      const tool = basename(name, '.md');
      if (tools && !tools.includes(tool)) continue;
      const file = `scripts/reference-examples/${server}/ja/${name}`;
      for (const ex of parseContractExamples(readFileSync(join(dir, name), 'utf8'))) out.push({ server, tool, file, ...ex });
    }
  }
  return out;
}

/**
 * 1 例を判定する（呼び出しの前の段）。流せない例はここで判定を返し、流せる例は null。
 * @returns {{ status: string, reason: string }|null}
 */
export function precheck(ex, { db }) {
  const checks = parseCheckLines(ex.checkLines);
  if (checks.skip) return { status: 'skipped', reason: `例の「- 照合: しない」${checks.skipReason ? `（${checks.skipReason}）` : ''}` };
  if (ex.versionExcluded) return { status: 'skipped', reason: `例の「- 版の照合: しない」${ex.versionExcludedReason ? `（${ex.versionExcludedReason}）` : ''}` };
  if (db === 'absent' && needsDb(ex.localDb)) return { status: 'unverified', reason: 'DB が要る例（--db absent）' };
  if (db === 'absent' && ex.localDb == null) return { status: 'unverified', reason: '「- ローカル DB:」の行が無く、DB が要るか分からない（--db absent）' };
  if (ex.argsText == null) return { status: 'unverified', reason: '「**引数**」のコードブロックが無い' };
  if (ex.expectedText == null && ex.markdownText == null) return { status: 'unverified', reason: '「**返る JSON」も「`markdown` の中身」も無い' };
  return null;
}

/**
 * 応答を例と比べて判定する（呼び出しの後の段）。
 * @param {object} ex parseContractExamples の 1 例
 * @param {{ isError: boolean, json: any, text: string|null }} res McpStdioClient#callTool の戻り値
 */
export function judge(ex, res, { db = 'present', home = null, aliases = [] } = {}) {
  const checks = parseCheckLines(ex.checkLines);
  // 例ごとの規則 → 環境の規則 → family 共通の規則の順に当てる
  const envRules = db === 'absent' ? ENV_RULES_NO_DB : [];
  const rules = [...checks.rules, ...envRules, ...VOLATILE_RULES];
  const findings = [];
  const notes = [...ex.notes];
  if (checks.unknown.length) notes.push(`読めない「- 照合:」の文: ${checks.unknown.join(' / ')}`);
  let pattern = null;
  if (ex.expectedText != null) {
    try {
      pattern = parseJsoncPattern(ex.expectedText);
    } catch (e) {
      return { status: 'unverified', reason: e.message, findings: [], notes };
    }
  }
  // エラーを期待するのは、見出しに isError: true とあるか、例が family 共通のエラーの形（error と code）のとき
  const expectIsError = ex.expectIsError || (!ex.expectedPath && looksLikeError(pattern));
  if (expectIsError !== res.isError) {
    findings.push({ path: '（isError）', category: 'shape', detail: `例は ${expectIsError ? 'エラー' : '成功'}、応答は ${res.isError ? 'エラー' : '成功'}` });
  }
  const json = normalizeHome(res.json, home, aliases);
  if (pattern !== null) {
    if (json == null) {
      findings.push({ path: '（応答の全体）', category: 'shape', detail: `応答が JSON でない: ${String(res.text ?? '').slice(0, 60)}` });
    } else if (ex.expectedPath) {
      const at = valueAt(json, ex.expectedPath);
      if (at === undefined) findings.push({ path: ex.expectedPath, category: 'shape', detail: 'キーが無い' });
      else findings.push(...comparePattern(pattern, at, rules, { reportExtra: !ex.excerpt }).map((f) => ({ ...f, path: `${ex.expectedPath}${f.path.startsWith('（') ? '' : f.path.startsWith('[') ? f.path : `.${f.path}`}` })));
    } else {
      findings.push(...comparePattern(pattern, json, rules, { reportExtra: !ex.excerpt }));
    }
  }
  if (ex.markdownText != null) {
    const md = typeof json?.markdown === 'string' ? json.markdown : normalizeHome(res.text, home, aliases);
    findings.push(...compareMarkdownLines(ex.markdownText, md));
  }
  return { status: statusOf(findings), reason: null, findings, notes };
}

/**
 * DB の無い環境（--db absent）で足す規則。「- ローカル DB: 不要。ただし DB に構造があればそこから返る」の例は、
 * DB の無い環境では国税庁サイトから取るので source が "live" になる。違いをデータ側の差分として数える。
 */
export const ENV_RULES_NO_DB = [{ path: 'source', kind: 'data', why: 'DB の無い環境では国税庁サイトから取る' }];

/** 違いの列。形の違い → データ側の差分 → 増えたキーの順に、各 3 件まで */
export function describeFindings(r) {
  if (r.reason) return r.reason;
  const parts = [];
  for (const [cat, label] of [
    ['shape', '形'],
    ['data', 'データ'],
    ['extra', '増えた'],
  ]) {
    const list = (r.findings ?? []).filter((f) => f.category === cat);
    if (!list.length) continue;
    const shown = list.slice(0, 3).map((f) => `\`${f.path}\` ${f.detail}`);
    parts.push(`${label}: ${shown.join('; ')}${list.length > 3 ? ` ほか ${list.length - 3} 件` : ''}`);
  }
  return parts.join(' / ').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function renderContractTable(rows) {
  const L = ['| サーバー | ツール | 例の見出し | 例の実測版 | 判定 | 違いの中身 |', '| --- | --- | --- | --- | --- | --- |'];
  for (const r of rows) {
    const heading = r.heading.replace(/^呼び出し例\s*[—–-]\s*/, '').replace(/\|/g, '\\|');
    L.push(`| ${r.server} | ${r.tool} | ${heading} | ${r.measured ? `v${r.measured}` : '（無し）'} | ${STATUS_JA[r.status]} | ${describeFindings(r)} |`);
  }
  return L.join('\n');
}

export function summarizeContract(rows) {
  const count = (s) => rows.filter((r) => r.status === s).length;
  return { total: rows.length, match: count('match'), data: count('data'), shape: count('shape'), unverified: count('unverified'), skipped: count('skipped') };
}

/** 今日の日付（JST、YYYY-MM-DD） */
export function todayJstDate(date = new Date()) {
  return date.toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' }).slice(0, 10);
}

/**
 * 「一致」の例に確かめた版を書く。launched は server ごとの { mode, version }。
 * npx で起動していないサーバーの例は書かない（公開版を確かめた記録にするため）。
 * @returns {{ file: string, line: number, heading: string, action: string }[]}
 */
export function applyVerified(root, rows, launched, date, { read = (f) => readFileSync(f, 'utf8'), write = (f, t) => writeFileSync(f, t) } = {}) {
  const out = [];
  const byFile = new Map();
  for (const r of rows) {
    if (r.status !== 'match') continue;
    const l = launched[r.server];
    if (!l?.version) continue;
    if (l.mode !== 'npx') {
      out.push({ file: r.file, line: r.line, heading: r.heading, action: 'not-published' });
      continue;
    }
    if (!byFile.has(r.file)) byFile.set(r.file, []);
    byFile.get(r.file).push({ line: r.line, version: l.version, date, heading: r.heading });
  }
  for (const [file, entries] of byFile) {
    const path = join(root, file);
    const before = read(path);
    const { text, results } = writeVerifiedLines(before, entries);
    if (text !== before) write(path, text);
    for (const res of results) out.push({ file, line: res.line, heading: entries.find((e) => e.line === res.line)?.heading ?? '', action: res.action });
  }
  return out;
}

const VERIFIED_ACTION_JA = {
  inserted: '足した',
  replaced: '置き換えた',
  unchanged: '同じ版の行があるので変えない',
  'same-as-measured': '実測と同じ版なので書かない',
  'no-measured': '「- 実測:」の行が無いので書かない',
  'not-published': 'npx で起動していないので書かない',
};

export function contractSummaryLine(s) {
  return `例 ${s.total} 件のうち 一致 ${s.match} / データ側の差分 ${s.data} / 形の違い ${s.shape} / 未確認 ${s.unverified} / 照合しない ${s.skipped}`;
}

// ── CLI ──────────────────────────────────────────────────────

async function main(argv) {
  const args = argv.slice(2);
  const flag = (name) => args.includes(`--${name}`);
  const values = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));
  const root = resolve(values('root')[0] ?? join(HERE, '..'));
  const db = values('db')[0] ?? 'present';
  if (!['present', 'absent'].includes(db)) throw new Error('--db は present か absent です');

  // 起動の仕方と版。--launch > HOUKI_MCP_LAUNCH > npx。版は --version > HOUKI_MCP_VERSIONS > stack.json の published
  const env = { ...process.env };
  env.HOUKI_MCP_LAUNCH = values('launch')[0] ?? env.HOUKI_MCP_LAUNCH ?? 'npx';
  const stackFile = join(root, 'stack.json');
  const published = existsSync(stackFile) ? currentVersionsFromStack(JSON.parse(readFileSync(stackFile, 'utf8'))) : {};
  const versions = {
    ...Object.fromEntries(Object.entries(published).filter(([, v]) => v)),
    ...parseVersionList(env.HOUKI_MCP_VERSIONS),
    ...parseVersionList(values('version').join(',')),
  };
  env.HOUKI_MCP_VERSIONS = Object.entries(versions)
    .map(([s, v]) => `${s}=${v}`)
    .join(',');

  const servers = values('server').length ? values('server') : null;
  const tools = values('tool').length ? values('tool') : null;
  const examples = collectContractExamples(root, { servers, tools });

  const rows = [];
  const launched = {};
  for (const server of [...new Set(examples.map((e) => e.server))]) {
    const mine = examples.filter((e) => e.server === server);
    const runnable = [];
    for (const ex of mine) {
      const pre = precheck(ex, { db });
      if (pre) rows.push({ ...ex, ...pre, findings: [], notes: ex.notes });
      else runnable.push(ex);
    }
    if (!runnable.length) continue;
    const launch = launchConfig(server, env, { root });
    // DB の無い環境として流すときは、DB と保存先を使い捨てのフォルダーに向ける（手元の DB に書き戻さない）
    let aliases = [];
    if (db === 'absent') {
      const dir = mkdtempSync(join(tmpdir(), `houki-contract-${server}-`));
      launch.env = { ...launch.env, ...isolatedDbEnv(server, dir) };
      aliases = isolatedPathAliases(server, dir);
    }
    if (!launch.available) {
      for (const ex of runnable) rows.push({ ...ex, status: 'unverified', reason: `起動するものが無い（${launch.entry}）`, findings: [], notes: [] });
      continue;
    }
    let client;
    try {
      client = await McpStdioClient.start(launch, { timeoutMs: launch.mode === 'npx' ? 180_000 : 60_000, clientName: 'check-examples-contract' });
    } catch (e) {
      for (const ex of runnable) rows.push({ ...ex, status: 'unverified', reason: `起動に失敗: ${e.message.split('\n')[0]}`, findings: [], notes: [] });
      continue;
    }
    launched[server] = { label: launch.label, mode: launch.mode, version: client.serverInfo?.version ?? null };
    client.timeoutMs = 120_000;
    for (const ex of runnable) {
      let callArgs;
      try {
        callArgs = parseJsoncPattern(ex.argsText);
      } catch (e) {
        rows.push({ ...ex, status: 'unverified', reason: `引数を読めない: ${e.message}`, findings: [], notes: [] });
        continue;
      }
      try {
        const res = await client.callTool(ex.tool, callArgs);
        if (res.rpcError) {
          rows.push({ ...ex, status: 'unverified', reason: `JSON-RPC のエラー: ${JSON.stringify(res.rpcError).slice(0, 80)}`, findings: [], notes: [] });
          continue;
        }
        rows.push({ ...ex, ...judge(ex, res, { db, home: homedir(), aliases }) });
      } catch (e) {
        rows.push({ ...ex, status: 'unverified', reason: `呼び出しに失敗: ${e.message.split('\n')[0]}`, findings: [], notes: [] });
      }
    }
    client.close();
  }

  // 例の並び（ファイル・行の順）に戻す
  rows.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
  const sum = summarizeContract(rows);
  const verifiedWrites = flag('write-verified') ? applyVerified(root, rows, launched, todayJstDate()) : null;
  if (flag('json')) {
    const slim = rows.map(({ argsText, expectedText, markdownText, checkLines, ...r }) => r);
    console.log(JSON.stringify({ launched, db, summary: sum, examples: slim, ...(verifiedWrites ? { verifiedWrites } : {}) }, null, 2));
  } else {
    const at = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' }).slice(0, 16);
    const who = Object.entries(launched)
      .map(([s, l]) => `${s} v${l.version}（${l.label}）`)
      .join(' / ');
    console.log(`# 呼び出し例の照合（${at} JST）\n`);
    console.log(`- 起動: ${who || '（起動していない）'}`);
    console.log(`- ローカル DB: ${db === 'absent' ? '無い環境として流した（DB の要る例は未確認）' : '手元の DB を引いた'}\n`);
    console.log(`${contractSummaryLine(sum)}\n`);
    console.log(renderContractTable(rows));
    const noted = rows.filter((r) => r.notes?.length);
    if (noted.length) {
      console.log('\n## 注記\n');
      for (const r of noted) console.log(`- \`${r.file}\` ${r.line} 行目: ${r.notes.join(' / ')}`);
    }
    if (verifiedWrites) {
      console.log('\n## 確かめた版の書き戻し（--write-verified）\n');
      const changed = verifiedWrites.filter((w) => w.action === 'inserted' || w.action === 'replaced').length;
      console.log(`「一致」の例 ${verifiedWrites.length} 件のうち、行を書いた例 ${changed} 件。\n`);
      for (const w of verifiedWrites) console.log(`- \`${w.file}\` ${w.line} 行目（${w.heading.replace(/^呼び出し例\s*[—–-]\s*/, '')}）: ${VERIFIED_ACTION_JA[w.action] ?? w.action}`);
    }
  }
  if (flag('strict') && sum.shape > 0) process.exit(1);
}

if (isMainModule(process.argv[1], import.meta.url)) {
  main(process.argv).catch((e) => {
    console.error(e.message);
    process.exit(2);
  });
}
