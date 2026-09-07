#!/usr/bin/env node
/**
 * generate-reference.mjs — MCP サーバー自身からツールリファレンスを生成する。
 *
 * 各 MCP サーバーを stdio で起動して MCP のハンドシェイクを行い、`tools/list` の応答を
 * VitePress のページ（site/docs/reference/mcp/<server>.md）に書き出す。
 * 引数の名前・型・必須・既定値・説明はすべて動いているサーバーから写すので、
 * サイトが実装と食い違うことがない。手書きの呼び出し例は
 * scripts/reference-examples/<server>/ja/<tool>.md にあれば末尾に付ける。
 *
 * pdf-agent-stack の scripts/generate-reference.mjs の移植（2026-09-08）。
 * 違い: サイトが日本語のみで、サーバーの description も日本語なので翻訳メモリは持たない。
 * description に Args: / Returns: の節を書く慣習も無いので、戻り値は呼び出し例の実測で示す。
 *
 * 使い方:
 *   node scripts/generate-reference.mjs             # REGISTRY の全サーバー
 *   node scripts/generate-reference.mjs houki-egov  # 1 つだけ
 *
 * 依存なし（生の JSON-RPC over stdio。MCP SDK は import しない）。
 * mcp/ は git 追跡外の作業コピーなので、CI や fresh clone では dist が無い。
 * その場合はスキップしてコミット済みのページをそのまま使う。
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site/docs');

/** サーバーの起動方法と出力先。 */
const REGISTRY = {
  'houki-egov': {
    npm: '@shuji-bonji/houki-egov-mcp',
    command: 'node',
    args: [join(ROOT, 'mcp/houki-egov-mcp/dist/index.js')],
    env: {},
    out: 'reference/mcp/houki-egov.md',
    guide: '/mcp/houki-egov',
    /** 引数表の下に添える、ページ固有の前置き（サーバーの description には書かれていない運用上の前提） */
    intro:
      '`search_fulltext` だけはローカル DB（`houki-egov-mcp --bulk-download-everything` で構築）を引きます。' +
      'DB が無いときは `search_law` の結果を `source: "api-fallback"` として返します。他のツールは e-Gov 法令 API v2 をその場で呼びます。',
  },
  'houki-nta': {
    npm: '@shuji-bonji/houki-nta-mcp',
    command: 'node',
    args: [join(ROOT, 'mcp/houki-nta-mcp/dist/index.js')],
    env: {},
    out: 'reference/mcp/houki-nta.md',
    guide: '/mcp/houki-nta',
    intro:
      '`nta_get_*` はローカル DB（`houki-nta-mcp --bulk-download-everything` で構築）を先に引き、無ければ国税庁サイトから直接取得します。' +
      '`nta_search_*` はローカル DB の FTS5 を使うので、DB が無いと結果が空になります。' +
      'すべての応答に `legal_status`（通達は国民を拘束しない旨）と、DB から返した場合は `freshness` が付きます。',
  },
};

const T = {
  title: (name) => `${name} — ツールリファレンス`,
  generated: (v, n, date) =>
    `**v${v}** の \`tools/list\` から自動生成しました（${n} ツール・${date}）。` +
    '手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。',
  roleNote: (guide) =>
    '**このページは自動生成のリファレンスです。** 全ツールの引数の名前・型・必須・既定値・説明を、' +
    '動いているサーバーの `tools/list` から写しています（正典はサーバー自身です）。' +
    `責務や使いどころの説明は[解説ページ](${guide})にあります。呼び出し例の応答 JSON は実測で、版を添えています。`,
  toc: 'ツール一覧',
  tool: 'ツール',
  summary: '概要',
  params: '引数',
  noParams: '引数はありません。',
  param: '引数',
  type: '型',
  required: '必須',
  default: '既定値',
  desc: '説明',
  yes: '必須',
  no: '任意',
  frontmatter: (name, v, n) => `${name} v${v} の全 ${n} ツールの引数・型・既定値（tools/list から自動生成）と実測の呼び出し例`,
};

/* ---------------- MCP ハンドシェイク（生の JSON-RPC over stdio） ---------------- */

function handshake(cfg) {
  return new Promise((resolveHS, rejectHS) => {
    const p = spawn(cfg.command, cfg.args, { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, ...cfg.env } });
    let stderrTail = '';
    p.stderr.on('data', (d) => {
      stderrTail = (stderrTail + d).slice(-2000);
    });
    const timer = setTimeout(() => {
      p.kill();
      rejectHS(new Error(`handshake timeout (20s)${stderrTail ? `\n--- server stderr (tail) ---\n${stderrTail}` : ''}`));
    }, 20_000);

    let buf = '';
    const pending = new Map();
    // JSON でない行（native module の警告など）は読み飛ばす
    p.stdout.on('data', (d) => {
      buf += d;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 1);
        if (!line.trim()) continue;
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          continue;
        }
        if (msg.id != null && pending.has(msg.id)) pending.get(msg.id)(msg);
      }
    });
    p.on('error', rejectHS);

    const send = (m) => p.stdin.write(`${JSON.stringify(m)}\n`);
    const rpc = (id, method, params) =>
      new Promise((res) => {
        pending.set(id, res);
        send({ jsonrpc: '2.0', id, method, params });
      });

    (async () => {
      const init = await rpc(1, 'initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'generate-reference', version: '0.0.1' },
      });
      send({ jsonrpc: '2.0', method: 'notifications/initialized' });
      const tools = await rpc(2, 'tools/list', {});
      clearTimeout(timer);
      p.kill();
      resolveHS({ serverInfo: init.result.serverInfo, tools: tools.result.tools });
    })().catch((e) => {
      clearTimeout(timer);
      p.kill();
      rejectHS(e);
    });
  });
}

/* ---------------- Markdown ---------------- */

/** 地の文に出す文字列。裸の <tag> は VitePress (Vue) を壊すのでバッククォートで包む */
function proseSafe(s) {
  return s.replace(/(?<!`)<(\/?[A-Za-z][\w-]*)>(?!`)/g, '`<$1>`');
}
/** 表のセルに出す文字列 */
function cellSafe(s) {
  return proseSafe(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ');
}

/** JSON Schema の property を人が読む型に */
function typeOf(schema) {
  if (schema.enum) return schema.enum.map((v) => `\`${JSON.stringify(v)}\``).join(' \\| ');
  if (schema.type === 'array') return `${schema.items ? typeOf(schema.items) : 'any'}[]`;
  let t = Array.isArray(schema.type) ? schema.type.join(' \\| ') : (schema.type ?? 'any');
  const bounds = [];
  if (schema.minimum != null && schema.maximum != null) bounds.push(`${schema.minimum}–${schema.maximum}`);
  else if (schema.minimum != null) bounds.push(`≥ ${schema.minimum}`);
  else if (schema.maximum != null) bounds.push(`≤ ${schema.maximum}`);
  if (schema.minLength != null) bounds.push(`minLength ${schema.minLength}`);
  if (bounds.length) t += ` (${bounds.join(', ')})`;
  return t;
}

/** 入れ子の properties も 1 段の表に平らにする */
function paramRows(schema, prefix = '', requiredList = schema.required ?? []) {
  const rows = [];
  for (const [name, prop] of Object.entries(schema.properties ?? {})) {
    const path = prefix ? `${prefix}.${name}` : name;
    rows.push({
      name: path,
      type: typeOf(prop),
      required: requiredList.includes(name),
      def: prop.default !== undefined ? `\`${JSON.stringify(prop.default)}\`` : '',
      desc: prop.description ?? '',
    });
    if (prop.type === 'object' && prop.properties) rows.push(...paramRows(prop, path, prop.required ?? []));
    if (prop.type === 'array' && prop.items?.type === 'object' && prop.items.properties)
      rows.push(...paramRows(prop.items, `${path}[]`, prop.items.required ?? []));
  }
  return rows;
}

/** 手書きの呼び出し例。無ければ null。Markdown をそのまま末尾に付ける */
function loadToolExample(server, toolName) {
  const p = join(ROOT, 'scripts/reference-examples', server, 'ja', `${toolName}.md`);
  return existsSync(p) ? readFileSync(p, 'utf8').trim() : null;
}

function firstSentence(prose) {
  const para = prose.split(/\n\s*\n/)[0].replace(/\n/g, ' ');
  const m = para.match(/^(.+?(?:。|\.(?=\s|$)))/);
  return (m ? m[1] : para).trim();
}

function renderPage(server, cfg, info, tools) {
  // 日付は JST（サイトの読者と同じ時計で書く）
  const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
  const displayName = info.name.replace(/^@[^/]+\//, '');
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(T.title(displayName))}`);
  L.push(`description: ${JSON.stringify(T.frontmatter(displayName, info.version, tools.length))}`);
  L.push('---');
  L.push('');
  L.push(`# ${T.title(displayName)}`);
  L.push('');
  L.push('<!-- GENERATED FILE — 手で編集しない。引数はサーバーの tools/list、呼び出し例は scripts/reference-examples/ から。 -->');
  L.push('');
  L.push('::: info');
  L.push(T.generated(info.version, tools.length, date));
  L.push(':::');
  L.push('');
  L.push(T.roleNote(cfg.guide));
  L.push('');
  if (cfg.intro) {
    L.push(cfg.intro);
    L.push('');
  }
  L.push(`## ${T.toc}`);
  L.push('');
  L.push(`| ${T.tool} | ${T.summary} |`);
  L.push('|---|---|');
  for (const tool of tools) {
    L.push(`| [\`${tool.name}\`](#${tool.name.replace(/_/g, '-')}) | ${cellSafe(firstSentence(tool.description ?? ''))} |`);
  }
  L.push('');
  let withExample = 0;
  for (const tool of tools) {
    L.push(`## ${tool.name}`);
    L.push('');
    if (tool.title) L.push(`**${tool.title}**`);
    L.push(proseSafe(tool.description ?? ''));
    L.push('');
    L.push(`### ${T.params}`);
    L.push('');
    const rows = paramRows(tool.inputSchema ?? {});
    if (rows.length === 0) {
      L.push(T.noParams);
    } else {
      L.push(`| ${T.param} | ${T.type} | ${T.required} | ${T.default} | ${T.desc} |`);
      L.push('|---|---|---|---|---|');
      for (const r of rows) {
        L.push(`| \`${r.name}\` | ${r.type} | ${r.required ? `**${T.yes}**` : T.no} | ${r.def} | ${cellSafe(r.desc)} |`);
      }
    }
    L.push('');
    const example = loadToolExample(server, tool.name);
    if (example) {
      withExample += 1;
      L.push(example);
      L.push('');
    }
  }
  return { text: L.join('\n'), withExample };
}

/* ---------------- 手書きページの版と tool 数を同期 ----------------
 *
 * mcp/index.md の一覧表と、mcp/<server>.md の「npm: ... （0.0.0）」は手書きだが、
 * 版と tool 数はここで tools/list と同じ値に揃える。数字だけ動かし、文章は触らない。
 * 形が崩れて一致しなくなったときは黙って通さず警告する（古い版数が site に残る）。
 */
function syncVersions(server, cfg, info, toolCount) {
  const edits = [];
  const pagePath = join(SITE, `mcp/${server}.md`);
  if (existsSync(pagePath)) {
    const before = readFileSync(pagePath, 'utf8');
    // "- npm: [`@shuji-bonji/houki-egov-mcp`](https://...)（0.5.3）"
    const pattern = new RegExp(`(\`${cfg.npm.replace(/[/@]/g, '\\$&')}\`(?:\\]\\([^)]*\\))?（)[0-9][^）]*`);
    if (!pattern.test(before)) {
      console.warn(`  ⚠ mcp/${server}.md: 「[\`${cfg.npm}\`](...)（X.Y.Z）」の形が見つからない。版の同期を飛ばした`);
    }
    const after = before.replace(pattern, `$1${info.version}`);
    if (after !== before) {
      writeFileSync(pagePath, after);
      edits.push(`mcp/${server}.md`);
    }
  }
  const indexPath = join(SITE, 'mcp/index.md');
  if (existsSync(indexPath)) {
    const before = readFileSync(indexPath, 'utf8');
    // "| [houki-egov-mcp](/mcp/houki-egov) | 束ねる単位 | 取得元 | 0.5.3 | 公開済み |"
    const after = before.replace(
      new RegExp(`(^\\|\\s*\\[${server}-mcp\\]\\([^)]*\\)\\s*\\|[^|]*\\|[^|]*\\|\\s*)[0-9][^|\\s]*(\\s*\\|)`, 'm'),
      `$1${info.version}$2`,
    );
    if (after !== before) {
      writeFileSync(indexPath, after);
      edits.push('mcp/index.md');
    }
  }
  // 解説ページの「N ツール」も揃える
  const toolCountPath = join(SITE, 'index.md');
  if (existsSync(toolCountPath)) {
    const before = readFileSync(toolCountPath, 'utf8');
    const after = before.replace(
      new RegExp(`(title: ${server}-mcp[^\\n]*\\n\\s*details: [^\\n]*?)\\d+ ツール`),
      `$1${toolCount} ツール`,
    );
    if (after !== before) {
      writeFileSync(toolCountPath, after);
      edits.push('index.md');
    }
  }
  return edits;
}

/* ---------------- main ---------------- */

const targets = process.argv.slice(2);
const names = targets.length ? targets : Object.keys(REGISTRY);
for (const name of names) {
  const cfg = REGISTRY[name];
  if (!cfg) {
    console.error(`unknown server: ${name} (known: ${Object.keys(REGISTRY).join(', ')})`);
    process.exit(1);
  }
  // mcp/ は追跡外の作業コピー。CI と fresh clone には dist が無いのでスキップし、
  // コミット済みのページでビルドする。dist があるのに起動できないときは落とす
  // （再生成できたのに古いページを黙って出荷しないため）。
  if (!existsSync(cfg.args[0])) {
    console.warn(`⚠ skip ${name}: server dist not found (${cfg.args[0]}) — using committed pages`);
    continue;
  }
  const { serverInfo, tools } = await handshake(cfg);
  console.log(`${serverInfo.name} v${serverInfo.version} — ${tools.length} tools`);
  const outPath = join(SITE, cfg.out);
  mkdirSync(dirname(outPath), { recursive: true });
  const { text, withExample } = renderPage(name, cfg, serverInfo, tools);
  writeFileSync(outPath, text);
  console.log(`  wrote ${outPath.replace(`${ROOT}/`, '')}（呼び出し例 ${withExample}/${tools.length}）`);
  const missing = tools.filter((t) => !loadToolExample(name, t.name)).map((t) => t.name);
  if (missing.length) console.warn(`  ・呼び出し例なし: ${missing.join(', ')}`);
  for (const edited of syncVersions(name, cfg, serverInfo, tools.length)) console.log(`  synced version in ${edited}`);
}
