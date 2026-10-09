#!/usr/bin/env node
/**
 * generate-reference.mjs — 実装そのものからリファレンスを生成する。
 *
 * 各 MCP サーバーを stdio で起動して MCP のハンドシェイクを行い、`tools/list` の応答を
 * VitePress のページに書き出す。引数の名前・型・必須・既定値・説明はすべて動いているサーバーから写すので、
 * サイトが実装と食い違うことがない。手書きの呼び出し例は
 * scripts/reference-examples/<server>/ja/<tool>.md にあればツールのページに付ける。
 *
 * ページはツール（関数）ごとに 1 枚（houki-hub#48、Y3、2026-10-10）:
 *   - site/docs/reference/mcp/<server>/<tool>.md   ツールのページ（tools/list・呼び出し例・spec.md の節）
 *   - site/docs/reference/mcp/<server>/index.md     ツールの一覧と共通の前置き
 *   - site/docs/reference/lib/<pkg>/<dir>.md        関数・値のページ（.d.ts・spec.md の節）。dir は仕様書の dir と同じ
 *   - site/docs/reference/lib/<pkg>/types.md        型とインターフェース
 *   - site/docs/reference/lib/<pkg>/index.md        記号の一覧と共通の前置き
 *   - site/docs/.vitepress/reference-sidebar.json   config.ts が読む sidebar
 *   - site/docs/.vitepress/reference-anchors.json   1 ページだったころの錨（#get-law など）→ 新しいページ。theme が読む
 * spec.md の「アクター」「できないこと」「処理の流れ」「できること」の見出しは、spec-pages.mjs と同じ読み込みと変換で写す。
 * 人が書く「使いどころ」は scripts/spec-pages/<site>/<dir>.md から差し込む（仕様書ページには出さない）。
 *
 * pdf-agent-stack の scripts/generate-reference.mjs の移植（2026-09-08）。
 * 違い: サイトが日本語のみで、サーバーの description も日本語なので翻訳メモリは持たない。
 * description に Args: / Returns: の節を書く慣習も無いので、戻り値は呼び出し例の実測で示す。
 *
 * MCP サーバーは起動して `tools/list` を読む。ライブラリは起動できるものが無いので、
 * 公開ビルドの型定義（dist/index.d.ts）を読む。詳しくは下の LIB_REGISTRY の頭の注記。
 *
 * 仕様書ページ（houki-hub#27。各リポジトリの specs/ と Skill の workflows/ から）も同じコマンドで作る。
 * 中身は scripts/spec-pages.mjs、ページの書き込みの規則は scripts/lib/generated-page.mjs で共有する。
 *
 * 使い方:
 *   node scripts/generate-reference.mjs                    # 全サーバー + 全ライブラリ + 仕様書ページ
 *   node scripts/generate-reference.mjs houki-egov         # 1 つだけ
 *   node scripts/generate-reference.mjs houki-abbreviations
 *   node scripts/generate-reference.mjs specs              # 仕様書ページだけ（サーバーを起動しない）
 *   node scripts/generate-reference.mjs specs:houki-nta    # 1 つのリポジトリの仕様書ページだけ
 *
 * 依存なし（生の JSON-RPC over stdio。MCP SDK は import しない）。
 * mcp/ は git 追跡外の作業コピーなので、CI や fresh clone では dist が無い。
 * その場合はスキップしてコミット済みのページをそのまま使う。
 *
 * ページ冒頭の日付は「内容が最後に変わった日」。生成した日ではない。
 * 内容（日付以外）が既存ファイルと同じなら書き込まず、日付も動かさない（2026-09-19）。
 * それまでは `site/` で `npm run build` するたびに全ページの日付が今日になり、
 * 1 つの MCP の版を上げただけで他のページにも差分が出ていた。
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { todayJst, writeGenerated } from './lib/generated-page.mjs';
import { SPEC_TARGETS, details, generateSpecPages, specPageIndex, specSourceFor } from './spec-pages.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site/docs');

/** サーバーの起動方法と出力先。 */
const REGISTRY = {
  'houki-egov': {
    npm: '@shuji-bonji/houki-egov-mcp',
    command: 'node',
    args: [join(ROOT, 'mcp/houki-egov-mcp/dist/index.js')],
    env: {},
    out: 'reference/mcp/houki-egov',
    base: '/reference/mcp/houki-egov/',
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
    out: 'reference/mcp/houki-nta',
    base: '/reference/mcp/houki-nta/',
    guide: '/mcp/houki-nta',
    intro:
      '`nta_get_*` はローカル DB（`houki-nta-mcp --bulk-download-everything` で構築）を先に引き、無ければ国税庁サイトから直接取得します。' +
      '`nta_search_*` はローカル DB の FTS5 を使うので、DB が無いと結果が空になります。' +
      'すべての応答に `legal_status`（通達は国民を拘束しない旨）と、DB から返した場合は `freshness` が付きます。',
  },
};

const REGEN = '再生成は `node scripts/generate-reference.mjs` です。';

const T = {
  title: (name) => `${name} — ツールリファレンス`,
  generated: (v, n, date) => `**v${v}** の \`tools/list\` から自動生成しました（${n} ツール・${date}）。手で編集しないでください。${REGEN}`,
  roleNote: (guide) =>
    '**このページは自動生成のリファレンスの入り口です。** ツールごとに 1 ページあり、何をするか・引数・実測の呼び出し例・できないことを、' +
    '動いているサーバーの `tools/list` と、各リポジトリの仕様書（`specs/current/`）から写しています。' +
    `サーバー全体の説明と導入は[解説ページ](${guide})にあります。`,
  toc: 'ツール一覧',
  tocLead: '一言はサーバーの `tools/list` の説明の最初の 1 文です。ツールの名前から、ツールごとのページを開けます。',
  frontmatter: (name, v, n) => `${name} v${v} の全 ${n} ツールの一覧（tools/list から自動生成）`,
  /* ツールのページ */
  toolTitle: (tool, server) => `${tool} — ${server} のツール`,
  toolFrontmatter: (tool, server, first) => `${server} の ${tool}：${first}（引数・実測の呼び出し例・できないこと・処理の流れ。自動生成）`,
  toolGenerated: (server, v, spec, ids, date) =>
    `${server} **v${v}** の \`tools/list\`${spec ? ` と \`specs/current/${spec}/spec.md\`` : ''} から自動生成しました（${
      spec ? `仕様 ID ${ids} 件` : '仕様書なし'
    }・${date}）。手で編集しないでください。${REGEN}`,
  params: '引数',
  paramsLead: '呼び出すときに渡す値です。動いているサーバーの `tools/list` から写しています。',
  noParams: '引数はありません。',
  param: '引数',
  type: '型',
  required: '必須',
  default: '既定値',
  desc: '説明',
  yes: '必須',
  no: '任意',
  examples: '呼び出し例',
  examplesLead: '実際に呼び出したときの引数と応答です。版と日付は実測したときのものです。',
  noExamples: 'このツールの呼び出し例はまだありません。',
};

/**
 * spec.md から写す節（ツールのページと関数のページで共通）。
 * - src: spec.md の ## 見出し、title: ページの見出し、lead: 生成側が足す節の目的の一文
 * - folded: 畳むときの details の題（Q28' の A。spec.md の処理の流れの図は大きいので畳む）
 */
const SPEC_COPY = {
  actor: { src: 'アクター', title: '使う人と受け取るもの', lead: (k) => `この${k}を誰が呼び、何を渡して何を受け取るかを示します。` },
  cannot: { src: 'できないこと', title: 'できないこと', lead: (k) => `この${k}が引き受けないことです。` },
  flow: {
    src: '処理の流れ',
    title: '処理の流れ',
    lead: () => '仕様書の「処理の流れ」の節を、図も含めてそのまま写しています。図が大きいので畳んでいます。',
    folded: '処理の流れの図（仕様書の写し）',
  },
};

/** 仕様書の節をページに出す。節が無ければ何も足さない */
function pushSpecSection(L, spec, f, def, kindLabel) {
  const text = spec?.sectionOf(f, def.src);
  if (!text) return;
  L.push(`## ${def.title}`, '');
  L.push(def.lead(kindLabel), '');
  L.push(def.folded ? details(def.folded, text) : text, '');
}

/** 約束の見出しの一覧（畳む。各行は仕様書ページの ID へ） */
function pushPromises(L, spec, f, kindLabel) {
  const items = spec?.promises(f) ?? [];
  if (!items.length) return;
  const page = spec.specPage(f);
  L.push('## 約束の一覧', '');
  L.push(
    `この${kindLabel}が守る約束 ${items.length} 件の見出しです。約束は受入テストと 1 対 1 で対応していて、条件と例は${
      page ? `[仕様書ページ](${page})` : '仕様書'
    }で読めます。`,
    ''
  );
  const table = ['| 仕様 ID | 約束 |', '|---|---|'];
  for (const it of items) {
    const short = it.id.slice(-3);
    table.push(`| ${it.url ? `[${short}](${it.url})` : short} | ${it.heading.replace(/\|/g, '\\|')} |`);
  }
  L.push(details(`約束の見出し（${items.length} 件）`, table.join('\n')), '');
}

/** 人が書く節（使いどころ。任意）を差し込む */
function pushOverlay(L, spec, f, site) {
  const text = f ? spec?.overlay(f) : null;
  if (!text) return;
  const headings = [...text.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  const stray = headings.filter((h) => !OVERLAY_SECTIONS.includes(h));
  if (stray.length) console.warn(`  ⚠ scripts/spec-pages/${site}/${f.dir}.md: 決まっていない節 ${stray.join(', ')}（そのまま出した）`);
  L.push(`<!-- ここから人が書いた節: scripts/spec-pages/${site}/${f.dir}.md -->`, '');
  L.push(text, '');
  L.push('<!-- ここまで人が書いた節 -->', '');
}
/** 人が書く節のファイルに置ける ## 見出し（site/README.md の「書き方」）。「呼び出しの流れ」は人向けの小さな図の置き場所 */
const OVERLAY_SECTIONS = ['使いどころ', '呼び出しの流れ'];

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

/**
 * 説明の最初の 1 文（一覧の「一言」）。括弧の中の「。」では切らない（2026-10-10、Y3）。
 * それまでは「法令に付いている添付ファイル（別表・様式・別記の図。」のように括弧の途中で切れていた。
 */
function firstSentence(prose) {
  const para = prose.split(/\n\s*\n/)[0].replace(/\n/g, ' ');
  let depth = 0;
  for (let i = 0; i < para.length; i += 1) {
    const c = para[i];
    if (c === '（' || c === '(') depth += 1;
    else if ((c === '）' || c === ')') && depth > 0) depth -= 1;
    else if (depth === 0 && (c === '。' || (c === '.' && (i + 1 === para.length || /\s/.test(para[i + 1]))))) {
      return para.slice(0, i + 1).trim();
    }
  }
  return para.trim();
}

/** 呼び出し例のファイルを、最初の `::: details` の前（引数の注意など）と、例の本体に分ける */
function splitExample(text) {
  const i = text.search(/^:::\s*details\b/m);
  if (i < 0) return { before: text.trim(), body: '' };
  return { before: text.slice(0, i).trim(), body: text.slice(i).trim() };
}

/** ツールのページの名前（URL の最後）。仕様書の dir と同じ（MCP はツール名そのもの） */
const toolPageDir = (spec, name) => spec?.features.get(name)?.dir ?? name;

function renderIndexPage(server, cfg, info, tools, spec, specLinks) {
  const date = todayJst();
  const displayName = info.name.replace(/^@[^/]+\//, '');
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(T.title(displayName))}`);
  L.push(`description: ${JSON.stringify(T.frontmatter(displayName, info.version, tools.length))}`);
  L.push('---');
  L.push('');
  L.push(`# ${T.title(displayName)}`);
  L.push('');
  L.push('<!-- GENERATED FILE — 手で編集しない。一覧はサーバーの tools/list から。 -->');
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
  L.push(T.tocLead);
  L.push('');
  L.push('| ツールのページ | 一言 | 仕様書ページ |');
  L.push('|---|---|---|');
  for (const tool of tools) {
    const f = spec?.features.get(tool.name);
    const specPage = f ? spec.specPage(f) : specLinks.get(tool.name);
    const ids = f ? spec.promises(f).length : null;
    const specCell = specPage ? `[仕様${ids != null ? `（約束 ${ids} 件）` : ''}](${specPage})` : '—';
    L.push(
      `| [\`${tool.name}\`](${cfg.base}${toolPageDir(spec, tool.name)}) | ${cellSafe(firstSentence(tool.description ?? ''))} | ${specCell} |`
    );
  }
  L.push('');
  return L.join('\n');
}

function renderToolPage(server, cfg, info, tool, spec, specLinks) {
  const date = todayJst();
  const displayName = info.name.replace(/^@[^/]+\//, '');
  const f = spec?.features.get(tool.name) ?? null;
  const ids = f ? spec.promises(f).length : 0;
  const specPage = f ? spec.specPage(f) : (specLinks.get(tool.name) ?? null);
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(T.toolTitle(tool.name, displayName))}`);
  L.push(`description: ${JSON.stringify(T.toolFrontmatter(tool.name, displayName, firstSentence(tool.description ?? '')))}`);
  L.push('---');
  L.push('');
  L.push(`# ${tool.name}`);
  L.push('');
  L.push(
    `<!-- GENERATED FILE — 手で編集しない。説明と引数はサーバーの tools/list、呼び出し例は scripts/reference-examples/${server}/ja/${tool.name}.md${
      f ? `、使う人と受け取るもの・できないこと・処理の流れ・約束の一覧は specs/current/${f.dir}/spec.md、使いどころは scripts/spec-pages/${server}/${f.dir}.md` : ''
    } から。 -->`
  );
  L.push('');
  L.push('::: info');
  L.push(T.toolGenerated(displayName, info.version, f?.dir, ids, date));
  L.push(':::');
  L.push('');
  if (tool.title) L.push(`**${tool.title}**`);
  L.push(proseSafe(tool.description ?? ''));
  L.push('');
  pushOverlay(L, spec, f, server);
  if (f) pushSpecSection(L, spec, f, SPEC_COPY.actor, 'ツール');

  L.push(`## ${T.params}`);
  L.push('');
  L.push(T.paramsLead);
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
  const { before, body } = example ? splitExample(example) : { before: '', body: '' };
  if (before) L.push(before, '');

  L.push(`## ${T.examples}`);
  L.push('');
  if (body) {
    L.push(T.examplesLead, '');
    L.push(body, '');
  } else {
    L.push(T.noExamples, '');
  }

  if (f) {
    pushSpecSection(L, spec, f, SPEC_COPY.cannot, 'ツール');
    pushSpecSection(L, spec, f, SPEC_COPY.flow, 'ツール');
    pushPromises(L, spec, f, 'ツール');
  }

  L.push('## 関連ページ', '');
  L.push('このページの元になった文書と、あわせて読むページです。', '');
  L.push(`- [${displayName} の解説](${cfg.guide})`);
  L.push(`- [${displayName} のツール一覧](${cfg.base})`);
  if (specPage) L.push(`- [${tool.name} の仕様書ページ](${specPage})`);
  if (f) L.push(`- [元の仕様書（GitHub、v${spec.version}）](${spec.specUrl(f)})`);
  L.push('');
  return { text: L.join('\n'), withExample: Boolean(body), withSpec: Boolean(f) };
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
    out: 'reference/lib/houki-abbreviations',
    base: '/reference/lib/houki-abbreviations/',
    guide: '/lib/houki-abbreviations',
    /** 仕様書ページ（spec-pages.mjs の SPEC_REGISTRY）の名前 */
    specSite: 'houki-abbreviations',
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
    `${name} v${v} の公開 API（${counts}）の一覧・追加された版・family での使用状況（dist/index.d.ts から自動生成）`,
  generated: (v, counts, date) => `**v${v}** の \`dist/index.d.ts\` から自動生成しました（${counts}・${date}）。手で編集しないでください。${REGEN}`,
  roleNote: (guide) =>
    '**このページは自動生成の API リファレンスの入り口です。** 関数と値は 1 つずつページがあり、シグネチャ・説明・例を' +
    'パッケージの型定義（`dist/index.d.ts`）から、使う人と受け取るもの・できないこと・処理の流れを各機能の仕様書（`specs/current/`）から写しています。' +
    `辞書の中身や設計上の約束は[解説ページ](${guide})にあります。`,
  /* 記号のページ */
  pageTitle: (name, pkg, kind) => `${name} — ${pkg} の${kind}`,
  pageFrontmatter: (name, pkg, kind, first) => `${pkg} の${kind} ${name}：${first}（シグネチャ・例・できないこと・処理の流れ。自動生成）`,
  pageGenerated: (pkg, v, spec, ids, date) =>
    `${pkg} **v${v}** の \`dist/index.d.ts\`${spec ? ` と \`specs/current/${spec}/spec.md\`` : ''} から自動生成しました（${
      spec ? `仕様 ID ${ids} 件` : '仕様書なし'
    }・${date}）。手で編集しないでください。${REGEN}`,
  signature: 'シグネチャ',
  signatureLead: 'import して呼ぶときの形です。パッケージの型定義（`dist/index.d.ts`）から写しています。',
  values: '値',
  valuesLead: 'このページで説明する値です。シグネチャと説明は、パッケージの型定義（`dist/index.d.ts`）から写しています。',
  examples: '例',
  examplesLead: '型定義の JSDoc に書かれている例です。',
  relatedTypes: '関係する型',
  /* 型のページ */
  typesDir: 'types',
  typesTitle: (pkg) => `型とインターフェース — ${pkg}`,
  typesFrontmatter: (pkg, v, counts) => `${pkg} v${v} が公開している型とインターフェース（${counts}）のシグネチャと説明（dist/index.d.ts から自動生成）`,
  typesLead:
    '関数の引数と戻り値、辞書のエントリの形に使われている型です。型には仕様書が無いので、型定義（`dist/index.d.ts`）の宣言と説明だけを写しています。',
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
/** 仕様書の無い記号のページの名前（仕様書の dir と同じ書き方: resolveAbbreviation → resolve_abbreviation） */
const snakeOf = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
/** ページを持つ記号（関数と値）。型とインターフェースは types のページにまとめる */
const hasOwnPage = (item) => item.kind === 'function' || item.kind === 'const';

/** 記号の種類・追加された版・family での使用のバッジ（斜体の 1 行） */
function badgesOf(item, ctx) {
  const servers = ctx.usedBy(item.name);
  const badges = [LIB_T.kind[item.kind]];
  if (item.since) badges.push(`v${item.since} で追加`);
  if (servers !== null) badges.push(servers.length ? `${servers.join(' / ')} が使用` : 'family では未使用');
  return `*${badges.join(' ・ ')}*`;
}

/** シグネチャ（長ければ畳む） */
function pushSignature(L, item) {
  const long = item.text.split('\n').length > 24;
  if (long) L.push('::: details シグネチャ（長いので畳んでいます）');
  L.push('```ts', item.text, '```');
  if (long) L.push(':::');
  L.push('');
}

/** 引数・戻り値・関係する型・その型を使う記号 */
function pushSymbolDetails(L, item, ctx) {
  if (item.params.length) {
    L.push('| 引数 | 説明 |', '|---|---|');
    for (const p of item.params) L.push(`| \`${p.name}\` | ${cellSafe(p.desc)} |`);
    L.push('');
  }
  if (item.returns) L.push(`**戻り値**: ${proseSafe(item.returns)}`, '');
  const related = ctx.typeLink(item);
  if (related.length) L.push(`**${LIB_T.relatedTypes}**: ${related.join('・')}`, '');
  const users = ctx.typeUsers(item);
  if (users.length) L.push(`**この型を使う関数・値**: ${users.join('・')}`, '');
}

/** 記号 1 つ分（見出し・バッジ・シグネチャ・説明・引数・戻り値・例）。型のページと、値が複数あるページで使う */
function pushSymbol(L, item, ctx) {
  L.push(`### ${item.name}`, '', badgesOf(item, ctx), '');
  if (item.deprecated) L.push('::: warning 非推奨', proseSafe(item.deprecated), ':::', '');
  pushSignature(L, item);
  if (item.doc) L.push(proseSafe(docToMarkdown(item.doc, item.srcPath, ctx.repoUrl)), '');
  pushSymbolDetails(L, item, ctx);
  for (const example of item.examples) L.push('::: details 例', example, ':::', '');
}

/** 記号の一覧と共通の前置き（/reference/lib/<pkg>/） */
function renderLibIndex(cfg, pkg, items, family, ctx) {
  const date = todayJst();
  const displayName = pkg.name.replace(/^@[^/]+\//, '');
  const countOf = (kind) => items.filter((i) => i.kind === kind).length;
  const counts = KINDS.map((k) => `${LIB_T.kind[k]} ${countOf(k)} 個`).join('・');
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(LIB_T.title(displayName))}`);
  L.push(`description: ${JSON.stringify(LIB_T.frontmatter(displayName, pkg.version, counts))}`);
  L.push('---');
  L.push('');
  L.push(`# ${LIB_T.title(displayName)}`);
  L.push('');
  L.push('<!-- GENERATED FILE — 手で編集しない。一覧は dist/index.d.ts、使用状況は mcp/*/src の import から。 -->');
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
    const used = items.filter((i) => (ctx.usedBy(i.name) ?? []).length > 0);
    L.push(
      `公開しているのは${counts}です。` +
        `そのうち ${family.servers.join(' と ')} が実際に import しているのは **${used.length} 個**で、` +
        '残りは公開しているだけです（テストコードの import は数えていません）。' +
        '一覧は下に用途ごとにまとめてあり、記号の名前から、その記号のページ（型とインターフェースは型のページの見出し）を開けます。',
    );
    L.push('');
  }

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

  /* 一覧は @group（用途）ごと。節の目的の一文は LIB_REGISTRY の groups から */
  for (const { group, summary, members } of groupItems(cfg, items)) {
    L.push(`## ${group}`);
    L.push('');
    if (summary) L.push(proseSafe(summary), '');
    L.push('| 記号 | 種類 | 一言 | 仕様書ページ | 追加された版 | family での使用 |');
    L.push('|---|---|---|---|---|---|');
    const sorted = [...members].sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || a.name.localeCompare(b.name));
    for (const item of sorted) {
      const servers = ctx.usedBy(item.name);
      const use = servers === null ? '—' : servers.length ? servers.map((s) => `\`${s}\``).join('<br>') : '未使用';
      const spec = ctx.specPageOf(item);
      L.push(
        `| [\`${item.name}\`](${ctx.urlOf(item)}) | ${LIB_T.kind[item.kind]} | ${cellSafe(firstSentence(item.doc || ''))} | ${
          spec ? `[仕様](${spec})` : '—'
        } | ${item.since ? `v${item.since}` : '—'} | ${use} |`,
      );
    }
    L.push('');
  }
  return { text: L.join('\n'), counts };
}

/** @group ごとに分ける。並びは LIB_REGISTRY の groups の順、無い @group は末尾 */
function groupItems(cfg, items) {
  const groups = new Map();
  for (const item of items) {
    const g = item.group || 'その他';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(item);
  }
  const configured = cfg.groups ?? [];
  const titles = configured.map((g) => g.title);
  const ordered = [...titles.filter((t) => groups.has(t)), ...[...groups.keys()].filter((t) => !titles.includes(t))];
  return ordered.map((group) => ({ group, summary: configured.find((g) => g.title === group)?.summary, members: groups.get(group) }));
}

/** 関数・値のページ。1 つの仕様書に複数の値があるとき（公開定数）は 1 ページにまとめる */
function renderLibSymbolPage(cfg, pkg, page, ctx) {
  const date = todayJst();
  const displayName = pkg.name.replace(/^@[^/]+\//, '');
  const { spec, f, members } = page;
  const single = members.length === 1 ? members[0] : null;
  const kindLabel = single?.kind === 'function' ? '関数' : '値';
  const name = single ? single.name : (f?.name ?? page.dir);
  const first = single ? firstSentence(single.doc || '') : (f?.summary ?? '');
  const ids = f ? spec.promises(f).length : 0;
  const specPage = f ? spec.specPage(f) : (single ? (ctx.specLinks.get(single.name) ?? null) : null);
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(LIB_T.pageTitle(name, displayName, kindLabel))}`);
  L.push(`description: ${JSON.stringify(LIB_T.pageFrontmatter(name, displayName, kindLabel, first))}`);
  L.push('---');
  L.push('');
  L.push(`# ${name}`);
  L.push('');
  L.push(
    `<!-- GENERATED FILE — 手で編集しない。シグネチャと説明は dist/index.d.ts、使用状況は mcp/*/src の import${
      f ? `、使う人と受け取るもの・できないこと・処理の流れ・約束の一覧は specs/current/${f.dir}/spec.md、使いどころは scripts/spec-pages/${cfg.specSite}/${f.dir}.md` : ''
    } から。 -->`,
  );
  L.push('');
  L.push('::: info');
  L.push(LIB_T.pageGenerated(displayName, pkg.version, f?.dir, ids, date));
  L.push(':::');
  L.push('');
  if (single) {
    pushSymbolHead(L, single, ctx);
  } else if (f?.summary) {
    L.push(proseSafe(f.summary), '');
  }
  pushOverlay(L, spec, f, cfg.specSite);
  if (f) pushSpecSection(L, spec, f, SPEC_COPY.actor, kindLabel);
  if (single) {
    pushSymbolBody(L, single, ctx);
  } else {
    L.push(`## ${LIB_T.values}`, '', LIB_T.valuesLead, '');
    for (const item of members) pushSymbol(L, item, ctx);
  }
  if (f) {
    pushSpecSection(L, spec, f, SPEC_COPY.cannot, kindLabel);
    pushSpecSection(L, spec, f, SPEC_COPY.flow, kindLabel);
    pushPromises(L, spec, f, kindLabel);
  }
  L.push('## 関連ページ', '');
  L.push('このページの元になった文書と、あわせて読むページです。', '');
  L.push(`- [${displayName} の解説](${cfg.guide})`);
  L.push(`- [${displayName} の API の一覧](${cfg.base})`);
  if (specPage) L.push(`- [${name} の仕様書ページ](${specPage})`);
  if (f) L.push(`- [元の仕様書（GitHub、v${spec.version}）](${spec.specUrl(f)})`);
  L.push('');
  return L.join('\n');
}

/** 記号が 1 つのページの先頭: バッジと説明（MCP の tools/list の description にあたる、JSDoc の本文） */
function pushSymbolHead(L, item, ctx) {
  L.push(badgesOf(item, ctx), '');
  if (item.deprecated) L.push('::: warning 非推奨', proseSafe(item.deprecated), ':::', '');
  if (item.doc) L.push(proseSafe(docToMarkdown(item.doc, item.srcPath, ctx.repoUrl)), '');
}

/** 記号が 1 つのページの本体: シグネチャ・引数・戻り値・関係する型・例 */
function pushSymbolBody(L, item, ctx) {
  L.push(`## ${LIB_T.signature}`, '', LIB_T.signatureLead, '');
  pushSignature(L, item);
  pushSymbolDetails(L, item, ctx);
  if (item.examples.length) {
    L.push(`## ${LIB_T.examples}`, '', LIB_T.examplesLead, '');
    for (const example of item.examples) L.push('::: details 例', example, ':::', '');
  }
}

/** 型とインターフェースのページ（/reference/lib/<pkg>/types） */
function renderLibTypesPage(cfg, pkg, items, ctx) {
  const date = todayJst();
  const displayName = pkg.name.replace(/^@[^/]+\//, '');
  const types = items.filter((i) => !hasOwnPage(i));
  const counts = ['interface', 'type'].map((k) => `${LIB_T.kind[k]} ${types.filter((i) => i.kind === k).length} 個`).join('・');
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(LIB_T.typesTitle(displayName))}`);
  L.push(`description: ${JSON.stringify(LIB_T.typesFrontmatter(displayName, pkg.version, counts))}`);
  L.push('---');
  L.push('');
  L.push('# 型とインターフェース');
  L.push('');
  L.push('<!-- GENERATED FILE — 手で編集しない。シグネチャと説明は dist/index.d.ts、使用状況は mcp/*/src の import から。 -->');
  L.push('');
  L.push('::: info');
  L.push(LIB_T.generated(pkg.version, counts, date));
  L.push(':::');
  L.push('');
  L.push(LIB_T.typesLead, '');
  for (const { group, members } of groupItems(cfg, types)) {
    L.push(`## ${group}`, '');
    for (const item of members) pushSymbol(L, item, ctx);
  }
  L.push('## 関連ページ', '');
  L.push(`- [${displayName} の API の一覧](${cfg.base})`);
  L.push(`- [${displayName} の解説](${cfg.guide})`);
  L.push('');
  return { text: L.join('\n'), count: types.length };
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

  const spec = await specSourceFor(cfg.specSite);
  if (!spec) console.warn(`  ⚠ ${cfg.specSite} の仕様書が読めない。関数のページに仕様書の節を出さない`);
  const specLinks = specPageIndex(cfg.specSite);

  // 記号 → ページ。関数と値は仕様書の dir（無ければ snake_case の名前）、型とインターフェースは types
  const pages = new Map();
  for (const item of items.filter(hasOwnPage)) {
    const f = spec?.features.get(item.name) ?? null;
    const dir = f?.dir ?? snakeOf(item.name);
    if (!f) console.warn(`  ・仕様書の無い記号: ${item.name}（${dir} のページに仕様書の節を出さない）`);
    if (!pages.has(dir)) pages.set(dir, { dir, f, spec, members: [] });
    pages.get(dir).members.push(item);
  }
  const pageOfItem = new Map();
  for (const page of pages.values()) for (const m of page.members) pageOfItem.set(m.name, page);
  const urlOf = (item) => {
    const page = pageOfItem.get(item.name);
    if (!page) return `${cfg.base}${LIB_T.typesDir}${anchorOf(item.name)}`;
    return page.members.length > 1 ? `${cfg.base}${page.dir}${anchorOf(item.name)}` : `${cfg.base}${page.dir}`;
  };
  const typeItems = items.filter((i) => !hasOwnPage(i));
  const mentions = (item, name) => new RegExp(`\\b${name}\\b`).test(item.text);
  const repoUrl = (pkg.repository?.url ?? '').replace(/^git\+/, '').replace(/\.git$/, '');
  const ctx = {
    repoUrl,
    specLinks,
    usedBy: (n) => (family ? [...(family.usage.get(n) ?? [])].sort() : null),
    urlOf,
    specPageOf: (item) => {
      const page = pageOfItem.get(item.name);
      if (page?.f) return spec.specPage(page.f);
      return hasOwnPage(item) ? (specLinks.get(item.name) ?? null) : null;
    },
    // シグネチャに出てくる型とインターフェース → 型のページの見出し
    typeLink: (item) => typeItems.filter((t) => t.name !== item.name && mentions(item, t.name)).map((t) => `[\`${t.name}\`](${urlOf(t)})`),
    // 型のページ: その型をシグネチャに使う関数・値
    typeUsers: (item) =>
      hasOwnPage(item) ? [] : items.filter((u) => hasOwnPage(u) && mentions(u, item.name)).map((u) => `[\`${u.name}\`](${urlOf(u)})`),
  };

  const outDir = join(SITE, cfg.out);
  mkdirSync(outDir, { recursive: true });
  const report = (rel, w) =>
    console.log(w.written ? `  wrote site/docs/${rel}` : `  unchanged site/docs/${rel}（日付 ${w.date} のまま）`);
  const { text, counts } = renderLibIndex(cfg, pkg, items, family, ctx);
  report(`${cfg.out}/index.md`, writeGenerated(join(outDir, 'index.md'), text));
  const types = renderLibTypesPage(cfg, pkg, items, ctx);
  report(`${cfg.out}/${LIB_T.typesDir}.md`, writeGenerated(join(outDir, `${LIB_T.typesDir}.md`), types.text));
  let withSpec = 0;
  for (const page of pages.values()) {
    if (page.f) withSpec += 1;
    report(`${cfg.out}/${page.dir}.md`, writeGenerated(join(outDir, `${page.dir}.md`), renderLibSymbolPage(cfg, pkg, page, ctx)));
  }
  console.log(`  ${counts}。関数・値のページ ${pages.size} 枚（仕様書の節あり ${withSpec}）・型のページ 1 枚（${types.count} 個）`);
  removeStalePages(outDir, ['index', LIB_T.typesDir, ...pages.keys()]);

  // sidebar と、1 ページだったころの錨
  const sorted = [...pages.values()].sort((a, b) => a.dir.localeCompare(b.dir));
  const sideItem = (page) => ({ text: page.members.length === 1 ? page.members[0].name : (page.f?.name ?? page.dir), link: `${cfg.base}${page.dir}` });
  const fnPages = sorted.filter((p) => p.members.some((m) => m.kind === 'function'));
  const valuePages = sorted.filter((p) => !fnPages.includes(p));
  updateReferenceJson(SIDEBAR_JSON, displayNameOf(pkg.name), {
    text: displayNameOf(pkg.name),
    collapsed: true,
    items: [
      { text: '一覧', link: cfg.base },
      { text: '関数', collapsed: true, items: fnPages.map(sideItem) },
      { text: '値', collapsed: true, items: valuePages.map(sideItem) },
      { text: '型とインターフェース', link: `${cfg.base}${LIB_T.typesDir}` },
    ],
  });
  const anchors = {};
  for (const item of items) anchors[anchorOf(item.name).slice(1)] = urlOf(item);
  updateReferenceJson(ANCHORS_JSON, cfg.base, anchors);

  for (const edited of syncLibVersion(name, cfg, pkg)) console.log(`  synced version in ${edited}`);
}

const displayNameOf = (npmName) => npmName.replace(/^@[^/]+\//, '');

/* ---------------- sidebar と、1 ページだったころの錨（JSON） ----------------
 *
 * reference-sidebar.json は config.ts が、reference-anchors.json は theme（.vitepress/theme/index.ts）が読む。
 * 1 回の実行で全部のサーバーとライブラリを生成するとは限らない（dist の無いものは飛ばす）ので、
 * 生成したものの分だけを書き換え、残りはコミット済みの中身を残す。
 */
const SIDEBAR_JSON = join(SITE, '.vitepress/reference-sidebar.json');
const ANCHORS_JSON = join(SITE, '.vitepress/reference-anchors.json');
/** sidebar の並び（MCP サーバー → ライブラリ） */
const SIDEBAR_ORDER = () => [...Object.values(REGISTRY).map((c) => displayNameOf(c.npm)), ...Object.values(LIB_REGISTRY).map((c) => displayNameOf(c.npm))];

function updateReferenceJson(file, key, value) {
  const before = existsSync(file) ? readFileSync(file, 'utf8') : null;
  let data;
  if (file === SIDEBAR_JSON) {
    const groups = before ? JSON.parse(before)['/reference/'] : [];
    const order = SIDEBAR_ORDER();
    const next = groups.filter((g) => g.text !== key).concat(value);
    next.sort((a, b) => order.indexOf(a.text) - order.indexOf(b.text));
    data = { '/reference/': next };
  } else {
    const all = before ? JSON.parse(before) : {};
    all[key] = value;
    data = Object.fromEntries(Object.entries(all).sort(([a], [b]) => a.localeCompare(b)));
  }
  const text = `${JSON.stringify(data, null, 2)}\n`;
  const rel = file.replace(`${ROOT}/`, '');
  if (before === text) return;
  writeFileSync(file, text);
  console.log(`  wrote ${rel}`);
}

/** 生成したページの置き場所に残っている、今回は作らなかった生成ページ（ツールが消えたときなど）を消す */
function removeStalePages(dir, keep) {
  for (const file of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    if (keep.includes(file.replace(/\.md$/, ''))) continue;
    const p = join(dir, file);
    if (!readFileSync(p, 'utf8').includes('<!-- GENERATED FILE')) continue;
    unlinkSync(p);
    console.log(`  removed ${p.replace(`${ROOT}/`, '')}（今の版に無い）`);
  }
}

/* ---------------- 解説ページの「最新 X.Y.Z」を npm の実測値に揃える ----------------
 *
 * 解説ページの「最新 X.Y.Z」は npm に出ている版を指すので、手元の package.json
 * では代わりにならない（publish 前なら手元の方が進んでいる）。npm の実測値は
 * generate-stack.mjs が `npm view` で取って stack.json の published に入れている
 * ので、そこから写す。stack.json 自体が古いときは数字だけ動かすと嘘になるので、
 * 手元の版と食い違っていたら知らせる。
 */
function syncLibVersion(name, cfg, pkg) {
  const guidePath = join(SITE, 'lib', `${name}.md`);
  if (!existsSync(guidePath)) return [];

  const stackPath = join(ROOT, 'stack.json');
  if (!existsSync(stackPath)) {
    console.warn(`  ⚠ stack.json が無いので lib/${name}.md の「最新 X.Y.Z」を揃えられない`);
    return [];
  }
  const published = JSON.parse(readFileSync(stackPath, 'utf8')).repos?.find((r) => r.npm === cfg.npm)?.published;
  if (!published) {
    console.warn(`  ⚠ stack.json に ${cfg.npm} の npm 版が無い（node scripts/generate-stack.mjs を Mac で回す）`);
    return [];
  }
  if (published !== pkg.version) {
    console.warn(`  ⚠ npm は ${published}、手元は ${pkg.version}（publish 前か、stack.json が古い）`);
  }

  const before = readFileSync(guidePath, 'utf8');
  // "（最新 0.5.1。houki-egov-mcp 0.6.0 と …）"
  const pattern = /(（最新\s*)[0-9][0-9.]*/;
  if (!pattern.test(before)) {
    console.warn(`  ⚠ lib/${name}.md に「（最新 X.Y.Z」の形が見つからない。版の同期を飛ばした`);
    return [];
  }
  const after = before.replace(pattern, `$1${published}`);
  if (after === before) return [];
  writeFileSync(guidePath, after);
  return [`lib/${name}.md`];
}

/* ---------------- main ---------------- */

const targets = process.argv.slice(2);
const specTargets = SPEC_TARGETS.map((n) => `specs:${n}`);
const known = [...Object.keys(REGISTRY), ...Object.keys(LIB_REGISTRY), 'specs', ...specTargets];
const names = targets.length ? targets : [...Object.keys(REGISTRY), ...Object.keys(LIB_REGISTRY), 'specs'];
for (const unknown of names.filter((n) => !known.includes(n))) {
  console.error(`unknown target: ${unknown} (known: ${known.join(', ')})`);
  process.exit(1);
}
// 仕様書ページ（houki-hub#27）。サーバーを起動しないので、MCP のハンドシェイクより先に回す。
// 仕様書の無い名前のリンクは生成済みの仕様書ページから引く（specPageIndex）ので、リファレンスよりも先に回す
const specNames = names.includes('specs') ? SPEC_TARGETS : names.filter((n) => n.startsWith('specs:')).map((n) => n.slice(6));
if (specNames.length) await generateSpecPages(specNames);
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
  const spec = await specSourceFor(name);
  if (!spec) console.warn(`  ⚠ ${name} の仕様書が読めない。ツールのページに仕様書の節を出さない`);
  const specLinks = specPageIndex(name);
  const outDir = join(SITE, cfg.out);
  mkdirSync(outDir, { recursive: true });
  const indexW = writeGenerated(join(outDir, 'index.md'), renderIndexPage(name, cfg, serverInfo, tools, spec, specLinks));
  console.log(indexW.written ? `  wrote site/docs/${cfg.out}/index.md` : `  unchanged site/docs/${cfg.out}/index.md（日付 ${indexW.date} のまま）`);
  let withExample = 0;
  let withSpec = 0;
  let written = 0;
  for (const tool of tools) {
    const page = renderToolPage(name, cfg, serverInfo, tool, spec, specLinks);
    if (page.withExample) withExample += 1;
    if (page.withSpec) withSpec += 1;
    if (writeGenerated(join(outDir, `${toolPageDir(spec, tool.name)}.md`), page.text).written) written += 1;
  }
  console.log(`  ツールのページ ${tools.length} 枚（書き換え ${written}・呼び出し例あり ${withExample}・仕様書の節あり ${withSpec}）`);
  removeStalePages(outDir, ['index', ...tools.map((t) => toolPageDir(spec, t.name))]);
  const missing = tools.filter((t) => !loadToolExample(name, t.name)).map((t) => t.name);
  if (missing.length) console.warn(`  ・呼び出し例なし: ${missing.join(', ')}`);
  const noSpec = tools.filter((t) => !spec?.features.get(t.name)).map((t) => t.name);
  if (noSpec.length) console.warn(`  ・仕様書の無いツール: ${noSpec.join(', ')}`);

  const displayName = displayNameOf(serverInfo.name);
  updateReferenceJson(SIDEBAR_JSON, displayName, {
    text: displayName,
    collapsed: true,
    items: [{ text: 'ツール一覧', link: cfg.base }, ...tools.map((t) => ({ text: t.name, link: `${cfg.base}${toolPageDir(spec, t.name)}` }))],
  });
  updateReferenceJson(
    ANCHORS_JSON,
    cfg.base,
    Object.fromEntries(tools.map((t) => [t.name.replace(/_/g, '-'), `${cfg.base}${toolPageDir(spec, t.name)}`])),
  );
  for (const edited of syncVersions(name, cfg, serverInfo, tools.length)) console.log(`  synced version in ${edited}`);
}
