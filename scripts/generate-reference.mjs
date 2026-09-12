#!/usr/bin/env node
/**
 * generate-reference.mjs — 実装そのものからリファレンスを生成する。
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
 * MCP サーバーは起動して `tools/list` を読む。ライブラリは起動できるものが無いので、
 * 公開ビルドの型定義（dist/index.d.ts）を読む。詳しくは下の LIB_REGISTRY の頭の注記。
 *
 * 使い方:
 *   node scripts/generate-reference.mjs                    # 全サーバー + 全ライブラリ
 *   node scripts/generate-reference.mjs houki-egov         # 1 つだけ
 *   node scripts/generate-reference.mjs houki-abbreviations
 *
 * 依存なし（生の JSON-RPC over stdio。MCP SDK は import しない）。
 * mcp/ は git 追跡外の作業コピーなので、CI や fresh clone では dist が無い。
 * その場合はスキップしてコミット済みのページをそのまま使う。
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

/* ========================= ライブラリ（.d.ts から生成） =========================
 *
 * MCP はサーバーを起動して tools/list を読むが、ライブラリは起動できるものが無い。
 * 代わりに公開ビルドの型定義（dist/index.d.ts）を TypeScript の API で読み、
 * export されている記号・シグネチャ・JSDoc をそのまま写す（正典は .d.ts）。
 *
 * 版は JSDoc の @since、節分けは @group から取る。どちらもコードの隣にあるので、
 * export を足したのにページに出ない／版が古い、という食い違いが起きない。
 * @group の無い export は「その他」に落として警告する。
 *
 * typescript は lib/<pkg>/node_modules から解決する（houki-hub 自身は依存を持たない）。
 * dist か typescript が無いときは mcp/ と同じくスキップし、コミット済みのページを使う。
 */

/** 生成対象のライブラリ。 */
const LIB_REGISTRY = {
  'houki-abbreviations': {
    npm: '@shuji-bonji/houki-abbreviations',
    dir: 'lib/houki-abbreviations',
    entry: 'dist/index.d.ts',
    out: 'reference/lib/houki-abbreviations.md',
    guide: '/lib/houki-abbreviations',
    /**
     * 節の並び順と、その節が何のためのものかの一文。`title` は JSDoc の @group と同じ文字列。
     * ここに無い @group は末尾に回して警告する。
     */
    groups: [
      {
        title: '辞書の解決',
        summary:
          '利用者や LLM が書く「消法」「個情法」のような略称を、e-Gov の API を引ける正式名称と `law_id` に直すための関数です。分野・種別・管轄 MCP でエントリを絞り込むものもここに置いています。',
      },
      {
        title: '表記の正規化',
        summary:
          '全角の数字・記号・空白を半角に揃えます。DB に取り込むときと検索するときに同じ関数を通すことで、片方だけ揃わずにヒットしなくなるのを防ぎます。',
      },
      {
        title: '検索とあいまい一致',
        summary:
          '辞書に無い言い方や打ち間違いで 0 件になったときに、近い候補を返すための関数です。部分一致で候補を並べるものと、編集距離で打ち間違いを拾うものがあります。',
      },
      {
        title: '逆引き',
        summary:
          '名前ではなく e-Gov の `law_id` や法令番号からエントリを引きます。検索結果に付いてきた ID を、人が読める名前に戻すときに使います。',
      },
      {
        title: '鮮度の判定',
        summary:
          '取得日時からの経過日数を `fresh` / `stale` / `outdated` に分類します。しきい値を family 全体で共有し、どの MCP でも同じ基準で古さを判定するためのものです。',
      },
      {
        title: '検証',
        summary:
          '`law_id` の形式や、エントリの重複・欠損を検査します。文章の中に法令名が含まれているかを調べる `extractLawNames` もここに入れています。',
      },
      {
        title: 'エントリの構造と取りうる値',
        summary: '辞書 1 件の形と、分野・種別・管轄 MCP が取りうる値です。上の関数の引数と戻り値は、すべてこれらで書かれています。',
      },
    ],
    intro:
      'houki-hub family の MCP サーバーが共有するために公開しているパッケージです。' +
      '**0.x の間は minor で破壊的変更が入ることがあります**。' +
      '安定した互換性が要るときは版を固定してください。',
  },
};

/** 一覧の節の並び順。呼べるものを先に、それを説明する型を後に置く。 */
const KINDS = ['function', 'const', 'interface', 'type'];

const LIB_T = {
  title: (name) => `${name} — API リファレンス`,
  frontmatter: (name, v, counts) =>
    `${name} v${v} の公開 API（${counts}）のシグネチャ・追加された版・family での使用状況（dist/index.d.ts から自動生成）`,
  generated: (v, counts, date) =>
    `**v${v}** の \`dist/index.d.ts\` から自動生成しました（${counts}・${date}）。` +
    '手で編集しないでください。再生成は `node scripts/generate-reference.mjs` です。',
  roleNote: (guide) =>
    '**このページは自動生成の API リファレンスです。** 公開されている記号の名前・シグネチャ・説明・例を、' +
    'パッケージの型定義（`dist/index.d.ts`）から写しています（正典は型定義です）。' +
    `辞書の中身や設計上の約束は[解説ページ](${guide})にあります。`,
  kind: {
    function: '関数',
    interface: 'インターフェース',
    type: '型',
    const: '定数',
  },
};

/** lib/<pkg>/node_modules から typescript を読む。無ければ null。 */
async function loadTypeScript(libDir) {
  try {
    const req = createRequire(join(libDir, 'package.json'));
    return (await import(pathToFileURL(req.resolve('typescript')).href)).default;
  } catch {
    return null;
  }
}

/** src 配下の .ts を再帰的に集める（テストは除く）。 */
function walkTs(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walkTs(p));
    else if (e.name.endsWith('.ts') && !e.name.endsWith('.test.ts') && !e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

/**
 * どの MCP がどの記号を import しているかを mcp/<server>/src から数える。
 *
 * 「公開しているが family では使っていない」を手で書かずに出すための走査。
 * mcp/ が無いとき（fresh clone）は null を返し、列ごと落とす。
 */
function scanFamilyUsage(npmName) {
  const mcpRoot = join(ROOT, 'mcp');
  if (!existsSync(mcpRoot)) return null;
  const usage = new Map();
  const servers = [];
  const escaped = npmName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const e of readdirSync(mcpRoot, { withFileTypes: true })) {
    const src = join(mcpRoot, e.name, 'src');
    if (!e.isDirectory() || !existsSync(src)) continue;
    servers.push(e.name);
    for (const file of walkTs(src)) {
      const text = readFileSync(file, 'utf8');
      // 名前付きの import / 再 export だけを数える。`[^{}]` にしているのは、
      // `[\s\S]*?` だと直前の別の import 文から次の `}` までを 1 件として
      // 飲み込んでしまうため（houki-egov-mcp の ingester.ts で踏んだ）。
      const re = new RegExp(`(?:import|export)\\s+(?:type\\s+)?\\{([^{}]*)\\}\\s*from\\s*['"]${escaped}['"]`, 'g');
      let hits = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        hits += 1;
        for (const raw of m[1].split(',')) {
          const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
          if (!name) continue;
          if (!usage.has(name)) usage.set(name, new Set());
          usage.get(name).add(e.name);
        }
      }
      // 名前付き以外の読み込み方（`import * as`、副作用 import）は数えられない。
      // 黙って「未使用」にすると事実と食い違うので知らせる。
      if (hits === 0 && text.includes(`'${npmName}'`)) {
        console.warn(`  ⚠ ${file.replace(`${ROOT}/`, '')}: ${npmName} を名前付き import 以外で読んでいる（使用状況に数えていない）`);
      }
    }
  }
  return servers.length ? { usage, servers } : null;
}

/** JSDoc のタグ本文を 1 本の文字列に。 */
function tagText(ts, tag) {
  return ts.displayPartsToString(tag.text ?? []).trim();
}

/** dist/index.d.ts が export している記号を集める。 */
function collectExports(ts, entry) {
  const program = ts.createProgram([entry], {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    skipLibCheck: true,
    noEmit: true,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry);
  if (!source) throw new Error(`entry not found in program: ${entry}`);
  const moduleSymbol = checker.getSymbolAtLocation(source);
  if (!moduleSymbol) throw new Error(`not a module: ${entry}`);

  const items = [];
  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const decl = target.declarations?.[0];
    if (!decl) continue;

    let node = decl;
    let kind = null;
    if (ts.isFunctionDeclaration(decl)) kind = 'function';
    else if (ts.isInterfaceDeclaration(decl)) kind = 'interface';
    else if (ts.isTypeAliasDeclaration(decl)) kind = 'type';
    else if (ts.isVariableDeclaration(decl)) {
      kind = 'const';
      node = decl.parent.parent;
    }
    if (!kind) continue;

    const tags = target.getJsDocTags(checker);
    const tagsNamed = (name) => tags.filter((t) => t.name === name).map((t) => tagText(ts, t));
    items.push({
      name: symbol.getName(),
      kind,
      // dist/<name>.d.ts → src/<name>.ts（JSDoc の相対リンクの起点）
      srcPath: `src/${node.getSourceFile().fileName.replace(/^.*\//, '').replace(/\.d\.ts$/, '.ts')}`,
      text: node
        .getText(node.getSourceFile())
        .replace(/^export\s+declare\s+/, '')
        .replace(/^export\s+/, '')
        .trim(),
      doc: ts.displayPartsToString(target.getDocumentationComment(checker)).trim(),
      since: tagsNamed('since')[0] ?? '',
      group: tagsNamed('group')[0] ?? '',
      deprecated: tagsNamed('deprecated')[0] ?? null,
      params: tags
        .filter((t) => t.name === 'param')
        .map((t) => {
          const body = tagText(ts, t);
          const i = body.search(/[\s—]/);
          return i < 0 ? { name: body, desc: '' } : { name: body.slice(0, i), desc: body.slice(i).trim() };
        }),
      returns: tagsNamed('returns')[0] ?? tagsNamed('return')[0] ?? '',
      examples: tagsNamed('example'),
    });
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * JSDoc の本文をページに載せられる Markdown に直す。
 *
 * - 本文中の見出し（`## ...`）はそのままだと記号の見出し（`###`）より上に立ち、
 *   節の構造と右の目次を壊すので 3 段下げる。
 * - 本文中の相対リンク（`./freshness.ts` など）はソースからの相対で書かれていて、
 *   サイトでは行き先が無い。VitePress の dead link 検査に落ちるので GitHub に向け直す。
 */
function docToMarkdown(text, srcPath, repoUrl) {
  const demoted = text.replace(/^(#{1,6})\s+/gm, (_, h) => `${'#'.repeat(Math.min(h.length + 3, 6))} `);
  if (!repoUrl) return demoted;
  const base = srcPath.replace(/\/[^/]*$/, '');
  return demoted.replace(/\]\((\.{1,2}\/[^)\s]+)\)/g, (whole, target) => {
    const parts = `${base}/${target}`.split('/');
    const stack = [];
    for (const part of parts) {
      if (part === '.' || part === '') continue;
      if (part === '..') stack.pop();
      else stack.push(part);
    }
    return `](${repoUrl}/blob/main/${stack.join('/')})`;
  });
}

/** VitePress の見出しアンカー。MCP 側と同じ規則（小文字化 + `_` → `-`）。 */
const anchorOf = (name) => `#${name.toLowerCase().replace(/_/g, '-')}`;

function renderLibPage(cfg, pkg, items, family) {
  const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
  const displayName = pkg.name.replace(/^@[^/]+\//, '');
  const countOf = (kind) => items.filter((i) => i.kind === kind).length;
  const counts = KINDS.map((k) => `${LIB_T.kind[k]} ${countOf(k)} 個`).join('・');
  const usedBy = (name) => (family ? [...(family.usage.get(name) ?? [])].sort() : null);
  const repoUrl = (pkg.repository?.url ?? '').replace(/^git\+/, '').replace(/\.git$/, '');

  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(LIB_T.title(displayName))}`);
  L.push(`description: ${JSON.stringify(LIB_T.frontmatter(displayName, pkg.version, counts))}`);
  L.push('---');
  L.push('');
  L.push(`# ${LIB_T.title(displayName)}`);
  L.push('');
  L.push('<!-- GENERATED FILE — 手で編集しない。シグネチャと説明は dist/index.d.ts、使用状況は mcp/*/src の import から。 -->');
  L.push('');
  L.push('::: info');
  L.push(LIB_T.generated(pkg.version, counts, date));
  L.push(':::');
  L.push('');
  L.push(LIB_T.roleNote(cfg.guide));
  L.push('');
  if (cfg.intro) {
    L.push(cfg.intro);
    L.push('');
  }

  if (family) {
    const used = items.filter((i) => (usedBy(i.name) ?? []).length > 0);
    L.push(
      `公開しているのは${counts}です。` +
        `そのうち ${family.servers.join(' と ')} が実際に import しているのは **${used.length} 個**で、` +
        '残りは公開しているだけです（テストコードの import は数えていません）。' +
        '各記号の説明と例は、一覧の下に用途ごとにまとめてあります。',
    );
    L.push('');
  }

  /* import */
  L.push('## 読み込み方');
  L.push('');
  L.push('```ts');
  L.push(`import { resolveAbbreviation } from '${pkg.name}';`);
  L.push('```');
  L.push('');
  const entryPoints = Object.keys(pkg.exports ?? { '.': {} });
  L.push(
    `入口は \`${entryPoints.join('` / `')}\` の ${entryPoints.length} つだけで、深いパスは公開していません。` +
      `ESM 専用です（\`package.json\` の \`"type": "${pkg.type}"\`）。` +
      `CommonJS の \`require\` では読めません。Node.js は \`${pkg.engines?.node ?? '不明'}\` が要ります。` +
      (Object.keys(pkg.dependencies ?? {}).length === 0 ? '実行時の依存パッケージはありません。' : ''),
  );
  L.push('');

  /* 一覧は種類ごとに分ける。1 つの長い表より、探しているものの種類で先に絞れる方が早い。 */
  for (const kind of KINDS) {
    const members = items.filter((i) => i.kind === kind);
    if (!members.length) continue;
    L.push(`## ${LIB_T.kind[kind]}`);
    L.push('');
    L.push('| 記号 | 追加された版 | family での使用 | 概要 |');
    L.push('|---|---|---|---|');
    for (const item of members) {
      const servers = usedBy(item.name);
      const use = servers === null ? '—' : servers.length ? servers.map((s) => `\`${s}\``).join('<br>') : '未使用';
      L.push(
        `| [\`${item.name}\`](${anchorOf(item.name)}) | ${item.since ? `v${item.since}` : '—'} | ${use} | ${cellSafe(firstSentence(item.doc || ''))} |`,
      );
    }
    L.push('');
  }

  /* 本体（@group ごと） */
  const groups = new Map();
  for (const item of items) {
    const g = item.group || 'その他';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(item);
  }
  const configured = cfg.groups ?? [];
  const titles = configured.map((g) => g.title);
  const ordered = [
    ...titles.filter((t) => groups.has(t)),
    ...[...groups.keys()].filter((t) => !titles.includes(t)),
  ];
  for (const group of ordered) {
    const members = groups.get(group);
    L.push(`## ${group}`);
    L.push('');
    const summary = configured.find((g) => g.title === group)?.summary;
    if (summary) {
      L.push(proseSafe(summary));
      L.push('');
    }
    for (const item of members) {
      L.push(`### ${item.name}`);
      L.push('');
      const servers = usedBy(item.name);
      const badges = [LIB_T.kind[item.kind]];
      if (item.since) badges.push(`v${item.since} で追加`);
      if (servers !== null) badges.push(servers.length ? `${servers.join(' / ')} が使用` : 'family では未使用');
      L.push(`*${badges.join(' ・ ')}*`);
      L.push('');
      if (item.deprecated) {
        L.push('::: warning 非推奨');
        L.push(proseSafe(item.deprecated));
        L.push(':::');
        L.push('');
      }
      const lines = item.text.split('\n');
      const long = lines.length > 24;
      if (long) L.push('::: details シグネチャ（長いので畳んでいます）');
      L.push('```ts');
      L.push(item.text);
      L.push('```');
      if (long) L.push(':::');
      L.push('');
      if (item.doc) {
        L.push(proseSafe(docToMarkdown(item.doc, item.srcPath, repoUrl)));
        L.push('');
      }
      if (item.params.length) {
        L.push('| 引数 | 説明 |');
        L.push('|---|---|');
        for (const p of item.params) L.push(`| \`${p.name}\` | ${cellSafe(p.desc)} |`);
        L.push('');
      }
      if (item.returns) {
        L.push(`**戻り値**: ${proseSafe(item.returns)}`);
        L.push('');
      }
      for (const example of item.examples) {
        L.push('::: details 例');
        L.push(example);
        L.push(':::');
        L.push('');
      }
    }
  }
  return { text: L.join('\n'), counts };
}

async function generateLib(name) {
  const cfg = LIB_REGISTRY[name];
  const libDir = join(ROOT, cfg.dir);
  const entry = join(libDir, cfg.entry);
  // lib/ は追跡外の作業コピー。CI と fresh clone には dist が無いのでスキップし、
  // コミット済みのページでビルドする。
  if (!existsSync(entry)) {
    console.warn(`⚠ skip ${name}: type definitions not found (${cfg.entry}) — using committed pages`);
    return;
  }
  const ts = await loadTypeScript(libDir);
  if (!ts) {
    console.warn(`⚠ skip ${name}: typescript not resolvable from ${cfg.dir} — using committed pages`);
    return;
  }
  const pkg = JSON.parse(readFileSync(join(libDir, 'package.json'), 'utf8'));
  const items = collectExports(ts, entry);
  const family = scanFamilyUsage(pkg.name);
  console.log(`${pkg.name} v${pkg.version} — ${items.length} exports`);

  const knownGroups = new Set((cfg.groups ?? []).map((g) => g.title));
  const strayGroups = [...new Set(items.map((i) => i.group).filter((g) => g && !knownGroups.has(g)))];
  if (strayGroups.length) console.warn(`  ⚠ LIB_REGISTRY の groups に無い @group: ${strayGroups.join(', ')}（末尾に回した）`);
  const ungrouped = items.filter((i) => !i.group).map((i) => i.name);
  if (ungrouped.length) console.warn(`  ⚠ @group の無い export: ${ungrouped.join(', ')}（「その他」に入れた）`);
  const noSince = items.filter((i) => !i.since).map((i) => i.name);
  if (noSince.length) console.warn(`  ⚠ @since の無い export: ${noSince.join(', ')}`);
  if (!family) console.warn('  ⚠ mcp/ が無いので「family での使用」列は「—」で出した');

  const outPath = join(SITE, cfg.out);
  mkdirSync(dirname(outPath), { recursive: true });
  const { text, counts } = renderLibPage(cfg, pkg, items, family);
  writeFileSync(outPath, text);
  console.log(`  wrote ${outPath.replace(`${ROOT}/`, '')}（${counts}）`);

  // 解説ページの版が古くなっていたら知らせる（文章は触らない。npm の最新版とは限らないため）
  const guidePath = join(SITE, 'lib', `${name}.md`);
  if (existsSync(guidePath)) {
    const m = readFileSync(guidePath, 'utf8').match(/最新\s*([0-9][0-9.]*)/);
    if (m && m[1] !== pkg.version) {
      console.warn(`  ⚠ lib/${name}.md は「最新 ${m[1]}」だが手元は ${pkg.version}。手で直す`);
    }
  }
}

/* ---------------- main ---------------- */

const targets = process.argv.slice(2);
const known = [...Object.keys(REGISTRY), ...Object.keys(LIB_REGISTRY)];
const names = targets.length ? targets : known;
for (const unknown of names.filter((n) => !known.includes(n))) {
  console.error(`unknown target: ${unknown} (known: ${known.join(', ')})`);
  process.exit(1);
}
for (const name of names.filter((n) => n in LIB_REGISTRY)) {
  await generateLib(name);
}
for (const name of names.filter((n) => n in REGISTRY)) {
  const cfg = REGISTRY[name];
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
