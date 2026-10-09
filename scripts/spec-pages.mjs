/**
 * spec-pages.mjs — 各リポジトリの仕様書から、サイトの仕様書ページ（houki-hub#27）を生成する。
 *
 * 入力:
 *   - houki-egov-mcp・houki-nta-mcp・houki-abbreviations の `specs/current/<dir>/spec.md`
 *   - 同じリポジトリの `specs/releases/<tag>/<id>/proposal.md` と `specs/changes/<id>/proposal.md`
 *     （承認の履歴。spec-ids 0.3.0 の `history()` で集める）
 *   - houki-research-skill の `skills/houki-research/SKILL.md` と `workflows/*.md`
 *     （Skill には specs/ を置かない。#27 のコメント 2026-09-27）
 *   - 人が書く節（任意）: `scripts/spec-pages/<site>/<dir>.md`。Y3（2026-10-10）から仕様書ページには出さず、
 *     リファレンスのツールのページ（generate-reference.mjs）に差し込む
 *
 * 出力（site/docs/ の下）:
 *   - specs/<site>/<dir>.md        機能ごと（Skill は workflow ごと）に 1 ページ
 *   - specs/<site>/index.md        リポジトリごとの一覧
 *   - .vitepress/specs-sidebar.json  config.ts が読む sidebar
 *
 * 本文の扱い:
 *   - 仕様書の文は言い換えずに写す。生成側が足すのは、節の見出しの付け替え・節の目的の一文・
 *     折りたたみ・承認の履歴の表・関連ページの一覧だけ
 *   - 写すときに変えるのは、Vue を壊す `<名前>`（コードの外）を `&lt;` にすること、
 *     仕様 ID を生成したページへのリンクにすること、相対リンクを GitHub の URL（ページを生成した
 *     workflow へのリンクはそのページ）にすること、Mermaid の書き方の誤りのうち、図に出る文字を
 *     変えずに直せるもの（mermaidSafe）を直すことだけ
 *
 * 読む場所:
 *   - 既定は houki-hub の作業コピー（mcp/・lib/・skill/。git 追跡外）
 *   - 環境変数 HOUKI_SPECS_SOURCE=<dir> があれば <dir>/<リポジトリ名>/ を読む
 *     （CI で公開版のタグを浅く clone して置く想定。npm のパッケージは dist だけなので specs/ が無い）
 *   - どちらも無いリポジトリは飛ばし、コミット済みのページをそのまま使う
 *
 * 試作（2026-10-09、Y1）は SPEC_REGISTRY の `only` で 4 機能に絞った。Y2（2026-10-09）で `only` を外し、全部の機能のページを作る。
 * 試作や一部だけの公開に戻すときは、`only: ['<dir>', ...]` を足す（一覧には全部の機能が載り、ページのある機能だけがリンクになる）。
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { todayJst, writeGenerated } from './lib/generated-page.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site/docs');
const GITHUB = 'https://github.com/shuji-bonji';
const REGEN = '再生成は `node scripts/generate-reference.mjs specs` です。';

/**
 * 生成するリポジトリ。キーはサイトの URL の名前（/mcp/・/reference/ と同じ短い名前）。
 * - type: 'specs'（specs/current から）/ 'skill'（SKILL.md と workflows/ から）
 * - defaultKind: front matter に kind が無い機能の種類
 * - only: 試作でページを作る機能（無ければ全部）
 */
export const SPEC_REGISTRY = {
  'houki-egov': {
    type: 'specs',
    repo: 'houki-egov-mcp',
    dir: 'mcp/houki-egov-mcp',
    defaultKind: 'tool',
    guide: '/mcp/houki-egov',
    reference: '/reference/mcp/houki-egov/',
  },
  'houki-nta': {
    type: 'specs',
    repo: 'houki-nta-mcp',
    dir: 'mcp/houki-nta-mcp',
    defaultKind: 'tool',
    guide: '/mcp/houki-nta',
    reference: '/reference/mcp/houki-nta/',
  },
  'houki-abbreviations': {
    type: 'specs',
    repo: 'houki-abbreviations',
    dir: 'lib/houki-abbreviations',
    defaultKind: 'function',
    guide: '/lib/houki-abbreviations',
    reference: '/reference/lib/houki-abbreviations/',
  },
  'houki-research': {
    type: 'skill',
    repo: 'houki-research-skill',
    dir: 'skill/houki-research-skill',
    skillDir: 'skills/houki-research',
    guide: '/skills/houki-research',
  },
};
export const SPEC_TARGETS = Object.keys(SPEC_REGISTRY);

/** 機能の種類。並び順と、一覧・sidebar の節の名前と目的の一文 */
const KINDS = [
  { kind: 'tool', label: 'ツール', lead: 'MCP クライアント（Claude などの LLM）から呼ぶツールです。' },
  { kind: 'function', label: '関数', lead: 'パッケージを import して呼ぶ関数です。' },
  { kind: 'const', label: '値', lead: 'パッケージが公開している値です。' },
  { kind: 'common', label: '共通の規則', lead: '複数のツールに共通する規則（エラー応答の形や検索語の扱いなど）です。' },
  { kind: 'db', label: 'ローカル DB', lead: 'ローカル DB の置き場所・版・中身についての約束です。' },
  { kind: 'cli', label: 'コマンドライン', lead: 'コマンドラインから実行する機能（DB への投入や状態の確認など）です。' },
];
const kindOf = (k) => KINDS.find((x) => x.kind === k) ?? { kind: k, label: k, lead: '' };

/**
 * spec.md の節（##）を、ページのどの見出しで、どの順に、どの目的の一文で出すか。
 * lead が null の節は、仕様書の本文が自分で目的の文を持っているので足さない。
 */
const SPEC_SECTIONS = [
  { src: 'アクター', title: '使う人と受け取るもの', lead: 'この機能を誰が呼び、何を渡して何を受け取るかを示します。' },
  { src: '入力', title: '入力', lead: '呼び出すときに渡す値です。' },
  { src: '戻り値', title: '戻り値', lead: '呼び出しが返す値です。' },
  { src: '値', title: '値', lead: 'このパッケージが公開している値と、その中身です。' },
  { src: '対象', title: '対象', lead: 'この共通の規則が当てはまる範囲です。' },
  { src: 'できないこと', title: 'できないこと', lead: 'この機能が引き受けないことです。' },
  { src: '処理の流れ', title: '処理の流れ', lead: null },
  {
    src: 'できること',
    title: '仕様 ID ごとの約束',
    lead:
      'この機能が守る約束を、仕様 ID ごとに並べています。見出しは約束を 1 文で表したもので、条件・応答の細部・例は「詳細」を開くと読めます。' +
      '仕様 ID はそれぞれ受入テストと対応していて、テストの無い ID があると各リポジトリの CI が止まります。',
    ids: true,
  },
  {
    src: '未決',
    title: 'まだ決めていないこと',
    lead: '仕様を書き起こしたときに見つかった項目のうち、扱いを決めている途中のものです。開くと、元の仕様書の記述をそのまま読めます。',
    collapsed: '仕様書の「未決」の節',
  },
];

/** workflow の節（##）の目的の一文。ここに無い節は見出しをそのまま出し、目的の文を足さない */
const WORKFLOW_SECTIONS = {
  このワークフローを使う場面: 'この手順を選ぶ問いと、選ばない問いです。',
  フロー全体像: 'Skill を読み込んだ LLM が、どの MCP のどのツールをどの順に呼ぶかを示します。',
  各ステップの詳細: '各ステップで呼ぶツールと引数、応答の読み方です。見出しを開くと、呼び出し例を読めます。',
  例: '実際のやり取りの例です。',
  アンチパターン: 'この手順でしてはいけない呼び方と、その理由です。',
};

/* ---------------- 読み込み ---------------- */

function sourceDir(cfg) {
  const base = process.env.HOUKI_SPECS_SOURCE;
  return base ? join(resolve(base), cfg.repo) : join(ROOT, cfg.dir);
}

function versionOf(cfg, src) {
  const p = cfg.type === 'skill' ? join(src, '.claude-plugin/plugin.json') : join(src, 'package.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')).version : null;
}

/** spec-ids の Node API。利用側のリポジトリの node_modules、無ければ site/ の node_modules から読む */
async function loadSpecIds(src) {
  for (const base of [src, join(ROOT, 'site')]) {
    const p = join(base, 'node_modules/@shuji-bonji/spec-ids/src/index.mjs');
    if (existsSync(p)) return import(pathToFileURL(p).href);
  }
  return null;
}

/** front matter（--- で挟んだ行）と本文に分ける。値は文字列のまま */
function splitFrontMatter(text) {
  if (!text.startsWith('---\n')) return { fm: {}, body: text };
  const end = text.indexOf('\n---\n', 4);
  if (end < 0) return { fm: {}, body: text };
  const fm = {};
  for (const line of text.slice(4, end).split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return { fm, body: text.slice(end + 5) };
}

/** 指定の深さ（## なら 2）の見出しで分ける。コードブロックの中の見出しは見出しとして扱わない */
export function splitSections(body, level) {
  const mark = `${'#'.repeat(level)} `;
  const pre = [];
  const sections = [];
  let fence = null;
  for (const line of body.split('\n')) {
    const f = line.match(/^\s*(`{3,}|~{3,})/);
    if (f) {
      if (!fence) fence = f[1];
      else if (line.trim().startsWith(fence)) fence = null;
    }
    if (!fence && line.startsWith(mark)) {
      sections.push({ heading: line.slice(mark.length).trim(), lines: [] });
      continue;
    }
    (sections.length ? sections[sections.length - 1].lines : pre).push(line);
  }
  return { pre: pre.join('\n'), sections: sections.map((s) => ({ heading: s.heading, text: s.lines.join('\n').trim() })) };
}

/* ---------------- 写すときの変換（意味を変えないものだけ） ---------------- */

const SPEC_ID = /\bSPEC-[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-\d{3}\b/g;
const anchorOfId = (id) => id.toLowerCase();

/**
 * コードの外の文字列に対する変換。
 * - `<名前>` の `<` を `&lt;` にする（Vue が要素として読んで壊れる）。`{{` も同じ理由で崩す
 * - 仕様 ID をリンクにする（ctx.linkId が URL を返すときだけ）
 * - 相対リンクを GitHub の URL にする（ctx.rewriteLink があるときだけ）
 */
function transformPlain(s, ctx) {
  let out = s.replace(/<(?=[A-Za-z/])/g, '&lt;').replace(/\{\{/g, '&#123;&#123;');
  if (ctx.rewriteLink) out = out.replace(/\]\(([^)\s]+)\)/g, (m, url) => `](${ctx.rewriteLink(url)})`);
  if (ctx.linkId) {
    out = out.replace(SPEC_ID, (id, offset, whole) => {
      // 既にリンクの文字列の中にあるものは触らない
      if (whole[offset - 1] === '[') return id;
      const url = ctx.linkId(id);
      return url ? `[${id}](${url})` : id;
    });
  }
  return out;
}

/** 行内コード（` の連なり）の外だけを変換する */
export function transformLine(line, ctx) {
  let out = '';
  let i = 0;
  while (i < line.length) {
    const tick = line.indexOf('`', i);
    if (tick < 0) {
      out += transformPlain(line.slice(i), ctx);
      break;
    }
    out += transformPlain(line.slice(i, tick), ctx);
    const run = line.slice(tick).match(/^`+/)[0];
    const close = line.indexOf(run, tick + run.length);
    if (close < 0) {
      out += line.slice(tick);
      break;
    }
    out += line.slice(tick, close + run.length);
    i = close + run.length;
  }
  return out;
}

/** Markdown の塊を変換する。コードブロックの中はそのまま */
export function transformMarkdown(md, ctx) {
  let fence = null;
  let mermaid = false;
  return md
    .split('\n')
    .map((line) => {
      const f = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
      if (f) {
        if (!fence) {
          fence = f[1];
          mermaid = f[2].trim() === 'mermaid';
          if (mermaid) subgraphSeq = 0;
        } else if (line.trim().startsWith(fence)) {
          fence = null;
          mermaid = false;
        }
        return line;
      }
      if (mermaid) return mermaidSafe(line);
      return fence ? line : transformLine(line, ctx);
    })
    .join('\n');
}

/**
 * Mermaid の図の 1 行の書き方の誤りを、図に出る文字を変えずに直す（2026-10-09、Y2）。
 * `sg<n>` の番号は図ごとに 1 から振る（2026-10-10、Y3）。同じ図を仕様書ページとツールのページの両方に写すので、
 * 通し番号だと、どちらを先に生成したかで番号が変わり、生成し直すたびに差分が出るため。
 * 仕様書の図のうち、mermaid 11 で描けずにエラーの図になるものがあったため。元の spec.md も直す（報告済み）。
 * - `subgraph` の名前に空白・記号があるとき（`subgraph --check-baseline-drift`・`subgraph 投入の 1 節・1 文書`）は、
 *   `subgraph sg<n>["名前"]` にする。表示される名前は同じ
 * - `"…"` のラベルの中の `\"` は Mermaid では使えない（`\` が残り、`"` でラベルが閉じる）ので、`#quot;` にする。表示は `"`
 */
let subgraphSeq = 0;
function mermaidSafe(line) {
  let out = line.replace(/\\"/g, '#quot;');
  const m = out.match(/^(\s*)subgraph\s+(.+?)\s*$/);
  if (m && !/^[\p{L}\p{N}_]+$/u.test(m[2]) && !/^[\p{L}\p{N}_]+\s*\[.*\]$/u.test(m[2])) {
    subgraphSeq += 1;
    out = `${m[1]}subgraph sg${subgraphSeq}["${m[2].replace(/"/g, '#quot;')}"]`;
  }
  return out;
}

/** VitePress のコンテナ（::: details）の中に入れる。本文に ::: があると閉じてしまうので、外側のコロンを増やす */
export function details(title, body) {
  const colons = /^:::/m.test(body) ? '::::' : ':::';
  return `${colons} details ${title}\n${body}\n${colons}`;
}

/* ---------------- 仕様書（specs/current）の読み込み ---------------- */

function readSpecFeature(src, dir, cfg) {
  const path = join(src, 'specs/current', dir, 'spec.md');
  const { fm, body } = splitFrontMatter(readFileSync(path, 'utf8'));
  const h1 = body.match(/^# (?:機能: )?(.+)$/m)?.[1] ?? dir;
  const paren = h1.indexOf('（');
  const name = paren > 0 ? h1.slice(0, paren).trim() : h1;
  const summary = paren > 0 ? h1.slice(paren + 1, h1.lastIndexOf('）')) : '';
  const { sections } = splitSections(body.slice(body.indexOf('\n', body.indexOf('# ')) + 1), 2);
  const has = (t) => sections.some((s) => s.heading === t);
  const kind = fm.kind || (has('値') && !has('入力') ? 'const' : cfg.defaultKind);
  const promises = sections.find((s) => s.heading === 'できること');
  const ids = promises ? splitSections(promises.text, 3).sections.map((s) => s.heading.match(SPEC_ID)?.[0]).filter(Boolean) : [];
  return { dir, path, fm, h1, name, summary, kind, sections, ids };
}

/* ---------------- ページの組み立て（specs） ---------------- */

function sortFeatures(features) {
  const order = (k) => {
    const i = KINDS.findIndex((x) => x.kind === k);
    return i < 0 ? KINDS.length : i;
  };
  return [...features].sort((a, b) => order(a.kind) - order(b.kind) || a.dir.localeCompare(b.dir));
}

/** 機能の名前がコードの識別子か（`公開定数` のような日本語の名前は、コードの書式にしない） */
const isIdent = (name) => /^[A-Za-z_$][\w$.]*$/.test(name);
const nameCode = (name) => (isIdent(name) ? `\`${name}\`` : name);
/** 「<名前> の仕様」。日本語の名前には空白を入れない */
const specTitle = (name) => (isIdent(name) ? `${name} の仕様` : `${name}の仕様`);

/**
 * 同じ機能のリファレンスのページ（ツール・関数・値ごとのページ。Y3、2026-10-10）。
 * ページの名前は仕様書の dir と同じにしている（generate-reference.mjs の toolPageDir）。
 */
function referenceLink(cfg, f) {
  if (!cfg.reference) return null;
  if (['tool', 'function', 'const'].includes(f.kind)) return `${cfg.reference}${f.dir}`;
  return null;
}

function historyRows(specIds, src, dir) {
  if (!specIds) return null;
  const root = src;
  const config = specIds.loadConfig(root);
  return specIds.history(root, config, dir).rows;
}

function proposalTitle(src, row) {
  const p =
    row.version === 'changes'
      ? join(src, 'specs/changes', row.change, 'proposal.md')
      : join(src, 'specs/releases', row.version, row.change, 'proposal.md');
  if (!existsSync(p)) return row.change;
  const t = splitFrontMatter(readFileSync(p, 'utf8')).body.match(/^# (?:変更: )?(.+)$/m)?.[1];
  return t ?? row.change;
}

function renderSpecPage(ctx, cfg, f) {
  const { src, version, tag, site } = ctx;
  const L = [];
  const specUrl = `${GITHUB}/${cfg.repo}/blob/${tag}/specs/current/${f.dir}/spec.md`;
  const tctx = { linkId: (id) => ctx.linkId(id, site, f.dir) };
  L.push('---');
  // 同じ名前の機能が複数のリポジトリにある（common_errors・resolve_abbreviation など）ので、題にリポジトリを入れる
  L.push(`title: ${JSON.stringify(`${f.name} — ${cfg.repo} の仕様`)}`);
  L.push(
    `description: ${JSON.stringify(`${cfg.repo} の${isIdent(f.name) ? ' ' : ''}${f.h1}の仕様。目的・入力・処理の流れと、仕様 ID ごとの約束（specs/current から自動生成）`)}`
  );
  L.push('---');
  L.push('');
  L.push(`# ${specTitle(f.name)}`);
  L.push('');
  L.push(`<!-- GENERATED FILE — 手で編集しない。本文は ${cfg.repo} の specs/current/${f.dir}/spec.md の写し。 -->`);
  L.push('');
  L.push('::: info');
  L.push(
    `${cfg.repo} **v${version}** の \`specs/current/${f.dir}/spec.md\` から自動生成しました（仕様 ID ${f.ids.length} 件・${todayJst()}）。手で編集しないでください。${REGEN}`
  );
  L.push(':::');
  L.push('');
  // 先頭は、spec.md の h1 の一言・ツールのページへのリンク・最後に仕様が変わった変更の 1 文（Y3、2026-10-10）。
  // 人が書く節（使いどころ）は、ツールのページにだけ出す（scripts/spec-pages/<site>/<dir>.md）
  if (f.summary) {
    L.push(transformLine(f.summary, {}));
    L.push('');
  }
  const ref = referenceLink(cfg, f);
  if (ref) {
    L.push(`使いどころ・引数・実測の呼び出し例は、[${kindOf(f.kind).label}のページ](${ref})にあります。`);
    L.push('');
  }

  const rows = historyRows(ctx.specIds, src, f.dir);
  const changes = rows?.filter((r) => r.kind === 'change' && r.version !== 'changes') ?? [];
  if (changes.length) {
    const last = changes[changes.length - 1];
    L.push(
      `最後に仕様が変わったのは ${last.version} の「${transformLine(proposalTitle(src, last), {})}」（${last.approved} 承認）です。` +
        'それまでの経緯は[承認の履歴](#承認の履歴)にあります。'
    );
    L.push('');
  }

  const used = new Set();
  for (const def of SPEC_SECTIONS) {
    const sec = f.sections.find((s) => s.heading === def.src);
    if (!sec) continue;
    used.add(def.src);
    L.push(`## ${def.title}`);
    L.push('');
    if (def.lead) {
      L.push(def.lead);
      L.push('');
    }
    if (def.ids) {
      for (const item of splitSections(sec.text, 3).sections) {
        const id = item.heading.match(SPEC_ID)?.[0];
        if (id) L.push(`<a id="${anchorOfId(id)}"></a>`, '');
        L.push(`### ${transformLine(item.heading, {})}`);
        L.push('');
        L.push(details('詳細', transformMarkdown(item.text, tctx)));
        L.push('');
      }
    } else if (def.collapsed) {
      L.push(details(def.collapsed, transformMarkdown(sec.text, tctx)));
      L.push('');
    } else {
      L.push(transformMarkdown(sec.text, tctx));
      L.push('');
    }
  }
  const stray = f.sections.filter((s) => !used.has(s.heading));
  if (stray.length) console.warn(`  ⚠ ${site}/${f.dir}: 対応の無い節 ${stray.map((s) => s.heading).join(', ')}（見出しのまま出した）`);
  for (const s of stray) {
    L.push(`## ${transformLine(s.heading, {})}`, '', transformMarkdown(s.text, tctx), '');
  }

  if (rows?.length) {
    L.push('## 承認の履歴');
    L.push('');
    L.push(
      'この機能の仕様が、いつ、どの変更で承認されたかを新しい順に並べています。' +
        `各リポジトリの \`npx spec-ids history ${f.dir}\` と同じ内容です。変更の名前から、変更の理由と前後の振る舞いを書いた文書（GitHub）を開けます。`
    );
    L.push('');
    const table = ['| 承認日 | 版 | 変更 | 仕様 PR |', '|---|---|---|---|'];
    for (const r of [...rows].reverse()) {
      const pr = `[#${r.pr}](${GITHUB}/${cfg.repo}/pull/${r.pr})`;
      if (r.kind === 'initial') {
        table.push(`| ${r.approved} | — | 初版 | ${pr} |`);
        continue;
      }
      const ver = r.version === 'changes' ? '次の版（未公開）' : r.version;
      const path =
        r.version === 'changes'
          ? `blob/main/specs/changes/${r.change}/proposal.md`
          : `blob/${tag}/specs/releases/${r.version}/${r.change}/proposal.md`;
      const title = transformLine(proposalTitle(src, r), {}).replace(/\|/g, '\\|');
      const label = r.kind === 'introduced' ? `${title}（この機能を新設）` : title;
      table.push(`| ${r.approved} | ${ver} | [${label}](${GITHUB}/${cfg.repo}/${path}) | ${pr} |`);
    }
    L.push(details(`承認の履歴（${rows.length} 件）`, table.join('\n')));
    L.push('');
  }

  L.push('## 関連ページ');
  L.push('');
  L.push('このページの元になった文書と、あわせて読むページです。');
  L.push('');
  L.push(`- [${cfg.repo} の仕様の一覧](/specs/${site}/)`);
  L.push(`- [${cfg.repo} の解説](${cfg.guide})`);
  if (ref) L.push(`- [${f.name} の${kindOf(f.kind).label}のページ（リファレンス）](${ref})`);
  L.push(`- [元の仕様書（GitHub、v${version}）](${specUrl})`);
  L.push('');
  return L.join('\n');
}

function renderSpecIndex(ctx, cfg, features, pages) {
  const { version, site } = ctx;
  const idCount = features.reduce((n, f) => n + f.ids.length, 0);
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(`${cfg.repo} の仕様`)}`);
  L.push(`description: ${JSON.stringify(`${cfg.repo} の全 ${features.length} 機能の仕様の一覧（specs/current から自動生成）`)}`);
  L.push('---');
  L.push('');
  L.push(`# ${cfg.repo} の仕様`);
  L.push('');
  L.push(`<!-- GENERATED FILE — 手で編集しない。${cfg.repo} の specs/current/ から生成。 -->`);
  L.push('');
  L.push('::: info');
  L.push(
    `${cfg.repo} **v${version}** の \`specs/current/\` から自動生成しました（${features.length} 機能・仕様 ID ${idCount} 件・${todayJst()}）。手で編集しないでください。${REGEN}`
  );
  L.push(':::');
  L.push('');
  L.push(
    `${cfg.repo} が何をするかを、機能ごとに 1 ページで説明します。全体の使い方は[解説](${cfg.guide})に、引数の一覧は[リファレンス](${cfg.reference})にあります。`
  );
  if (cfg.only) {
    L.push('');
    L.push(`試作のため、ページがあるのは ${pages.size} 機能だけです。ほかの機能は一覧にだけ載せています。`);
  }
  L.push('');
  for (const k of KINDS) {
    const list = features.filter((f) => f.kind === k.kind);
    if (!list.length) continue;
    L.push(`## ${k.label}`);
    L.push('');
    L.push(k.lead);
    L.push('');
    L.push('| 機能 | 内容 | 仕様 ID |');
    L.push('|---|---|---|');
    for (const f of list) {
      const name = pages.has(f.dir) ? `[${nameCode(f.name)}](/specs/${site}/${f.dir})` : nameCode(f.name);
      L.push(`| ${name} | ${transformLine(f.summary, {}).replace(/\|/g, '\\|')} | ${f.ids.length} |`);
    }
    L.push('');
  }
  return L.join('\n');
}

/* ---------------- Skill（SKILL.md と workflows/） ---------------- */

function readWorkflow(src, cfg, file) {
  const path = join(src, cfg.skillDir, 'workflows', file);
  const text = readFileSync(path, 'utf8');
  const h1 = text.match(/^# (.+)$/m)?.[1] ?? file;
  const title = h1.replace(/^Workflow\s*[—-]\s*/, '');
  const afterH1 = text.slice(text.indexOf('\n', text.indexOf(`# ${h1}`)) + 1);
  const { pre, sections } = splitSections(afterH1, 2);
  const steps = sections.find((s) => s.heading === '各ステップの詳細');
  const stepCount = steps ? splitSections(steps.text, 3).sections.length : 0;
  return { dir: file.replace(/\.md$/, ''), file, title, lead: pre.trim(), sections, stepCount, text };
}

/** Skill のファイルの相対リンクを、タグの GitHub の URL にする */
function skillLinkRewriter(cfg, tag, fromDir, site, pages) {
  return (url) => {
    if (/^[a-z]+:/i.test(url) || url.startsWith('#') || url.startsWith('/')) return url;
    const [path, hash] = url.split('#');
    const parts = `${fromDir}/${path}`.split('/');
    const out = [];
    for (const p of parts) {
      if (p === '..') out.pop();
      else if (p && p !== '.') out.push(p);
    }
    // ページを生成した workflow は、GitHub ではなくそのページへ（見出しの id が違うので # は付けない）
    const wf = out.join('/').match(new RegExp(`^${cfg.skillDir}/workflows/([^/]+)\\.md$`));
    if (wf && pages?.has(wf[1])) return `/specs/${site}/${wf[1]}`;
    const kind = path.endsWith('/') || !/\.[a-z]+$/i.test(path) ? 'tree' : 'blob';
    return `${GITHUB}/${cfg.repo}/${kind}/${tag}/${out.join('/')}${hash ? `#${hash}` : ''}`;
  };
}

/** workflow に出てくる family のツールを、出てくる順に集める */
function toolsInWorkflow(text, toolIndex) {
  const found = [];
  const re = /`([a-z][a-z0-9_]+)`|"tool":\s*"([a-z][a-z0-9_]+)"/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[1] ?? m[2];
    if (toolIndex.has(name) && !found.includes(name)) found.push(name);
  }
  return found;
}

function renderWorkflowPage(ctx, cfg, w) {
  const { version, tag, site } = ctx;
  const fromDir = `${cfg.skillDir}/workflows`;
  const tctx = { rewriteLink: skillLinkRewriter(cfg, tag, fromDir, site, ctx.pages) };
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(`${w.dir} — ${w.title}`)}`);
  L.push(`description: ${JSON.stringify(`houki-research Skill の workflow「${w.title}」の目的・処理の流れ・各ステップ（workflows/${w.file} から自動生成）`)}`);
  L.push('---');
  L.push('');
  L.push(`# ${w.dir}：${w.title}`);
  L.push('');
  L.push(`<!-- GENERATED FILE — 手で編集しない。本文は ${cfg.repo} の ${fromDir}/${w.file} の写し。 -->`);
  L.push('');
  L.push('::: info');
  L.push(
    `houki-research Skill **v${version}** の \`${fromDir}/${w.file}\` から自動生成しました（ステップ ${w.stepCount} 件・${todayJst()}）。手で編集しないでください。${REGEN}`
  );
  L.push(':::');
  L.push('');
  L.push(
    `このページは、houki-research Skill の workflow（問いの形ごとの手順）「${w.title}」の説明です。` +
      'Skill を読み込んだ LLM は、この順で MCP のツールを呼びます。「関連ページ」の前までは、workflow の本文を言い換えずに写しています。'
  );
  L.push('');
  if (w.lead) {
    L.push(transformMarkdown(w.lead, tctx));
    L.push('');
  }
  for (const s of w.sections) {
    L.push(`## ${transformLine(s.heading, {})}`);
    L.push('');
    const lead = WORKFLOW_SECTIONS[s.heading];
    if (lead) L.push(lead, '');
    if (s.heading === '各ステップの詳細') {
      const { pre, sections: steps } = splitSections(s.text, 3);
      if (pre.trim()) L.push(transformMarkdown(pre.trim(), tctx), '');
      for (const st of steps) {
        L.push(`### ${transformLine(st.heading, {})}`, '');
        L.push(details('詳細', transformMarkdown(st.text, tctx)), '');
      }
      // ステップの後に、使うツールと仕様のページを足す（生成側が足す節）
      const tools = toolsInWorkflow(w.text, ctx.toolIndex);
      if (tools.length) {
        L.push('## この手順で使うツール', '');
        L.push('上のステップに出てくる houki-hub family のツールと、そのツールのページ・仕様のページです。houki-hub の外のツール（pdf-reader-mcp など）は載せていません。', '');
        L.push('| ツール | MCP サーバー | ツールのページ | 仕様 |', '|---|---|---|---|');
        for (const t of tools) {
          for (const owner of ctx.toolIndex.get(t)) {
            const page = ctx.pageOf(owner.site, t);
            const spec = page ? `[${t} の仕様](${page})` : '—';
            L.push(`| \`${t}\` | ${owner.repo} | [${t}](${owner.reference}${t}) | ${spec} |`);
          }
        }
        L.push('');
      }
      continue;
    }
    L.push(transformMarkdown(s.text, tctx), '');
  }
  L.push('## 関連ページ', '');
  L.push('このページの元になった文書と、あわせて読むページです。', '');
  L.push(`- [houki-research Skill の仕様の一覧](/specs/${site}/)`);
  L.push(`- [houki-research Skill の解説](${cfg.guide})`);
  L.push(`- [元の workflow（GitHub、v${version}）](${GITHUB}/${cfg.repo}/blob/${tag}/${fromDir}/${w.file})`);
  L.push('');
  return L.join('\n');
}

/** Skill の一覧。SKILL.md の description・責務・鉄則と、workflow の一覧（#27 のコメント 2026-09-27 の表） */
function renderSkillIndex(ctx, cfg, workflows, pages) {
  const { src, version, tag, site } = ctx;
  const skillPath = join(src, cfg.skillDir, 'SKILL.md');
  const { fm, body } = splitFrontMatter(readFileSync(skillPath, 'utf8'));
  const tctx = { rewriteLink: skillLinkRewriter(cfg, tag, cfg.skillDir, site, pages) };
  const { sections } = splitSections(body, 2);
  const pick = (h) => sections.find((s) => s.heading.startsWith(h));
  const L = [];
  L.push('---');
  L.push(`title: ${JSON.stringify('houki-research Skill の仕様')}`);
  L.push(`description: ${JSON.stringify('houki-research Skill の目的・責務・鉄則と、問いの形ごとの workflow の一覧（SKILL.md と workflows/ から自動生成）')}`);
  L.push('---');
  L.push('');
  L.push('# houki-research Skill の仕様');
  L.push('');
  L.push(`<!-- GENERATED FILE — 手で編集しない。${cfg.repo} の ${cfg.skillDir}/SKILL.md と workflows/ から生成。 -->`);
  L.push('');
  L.push('::: info');
  L.push(
    `houki-research Skill **v${version}** の \`${cfg.skillDir}/SKILL.md\` と \`workflows/\` から自動生成しました（workflow ${workflows.length} 件・${todayJst()}）。手で編集しないでください。${REGEN}`
  );
  L.push(':::');
  L.push('');
  L.push(
    'Skill には実行するコードが無く、SKILL.md の文章そのものが仕様です。そのため MCP のような仕様 ID と承認の履歴は無く、' +
      'このページと workflow のページは SKILL.md と workflows/ の本文を言い換えずに写しています。'
  );
  if (cfg.only) {
    L.push('');
    L.push(`試作のため、ページがあるのは ${pages.size} 件の workflow だけです。`);
  }
  L.push('');
  L.push('## 目的', '');
  L.push('Skill を読み込んだ LLM が、いつこの Skill を使うかの説明です（SKILL.md の `description`）。', '');
  L.push(transformMarkdown(fm.description ?? '', tctx), '');
  const duties = pick('この skill が担う');
  if (duties) {
    L.push(`## ${transformLine(duties.heading, {})}`, '');
    L.push('この Skill が LLM に指示する内容の分担です。', '');
    L.push(transformMarkdown(duties.text, tctx), '');
  }
  L.push('## workflow の一覧', '');
  L.push('問いの形ごとの手順です。問いに合う workflow を選ぶと、呼ぶツールとその順序が決まります。', '');
  L.push('| workflow | 内容 | ステップ |', '|---|---|---|');
  for (const w of workflows) {
    const name = pages.has(w.dir) ? `[${w.dir}](/specs/${site}/${w.dir})` : w.dir;
    L.push(`| ${name} | ${transformLine(w.title, {})} | ${w.stepCount} |`);
  }
  L.push('');
  const rules = pick('鉄則');
  if (rules) {
    L.push(`## ${transformLine(rules.heading, {})}`, '');
    L.push('どの workflow でも守る順序と約束です。見出しを開くと、SKILL.md の本文を読めます。', '');
    const { pre, sections: items } = splitSections(rules.text, 3);
    if (pre.trim()) L.push(transformMarkdown(pre.trim(), tctx), '');
    for (const it of items) {
      L.push(`### ${transformLine(it.heading, {})}`, '');
      L.push(details('詳細', transformMarkdown(it.text, tctx)), '');
    }
  }
  L.push('## 関連ページ', '');
  L.push(`- [houki-research Skill の解説](${cfg.guide})`);
  L.push(`- [元の SKILL.md（GitHub、v${version}）](${GITHUB}/${cfg.repo}/blob/${tag}/${cfg.skillDir}/SKILL.md)`);
  L.push('');
  return L.join('\n');
}

/* ---------------- リファレンスからのリンク ---------------- */

/**
 * 生成済みの仕様書ページから、名前（ツール名・関数名・定数名）→ ページの URL の表を作る。
 * generate-reference.mjs が、リファレンスの各ツール・各記号から同じ機能の仕様書ページへリンクを張るために使う（2026-10-09、Y2）。
 * 元の specs/ ではなく site/docs/specs/ の生成済みのページを読むので、作業コピーが無い CI でも同じ表になる。
 * - ページの題（front matter の title の「<名前> — 」）の名前 → そのページ
 * - 本文の `### \`NAME\`` の見出し（公開定数のページの各定数）→ そのページの見出し
 */
export function specPageIndex(site) {
  const map = new Map();
  const dir = join(SITE, 'specs', site);
  if (!existsSync(dir)) return map;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'index.md')) {
    const text = readFileSync(join(dir, file), 'utf8');
    const base = `/specs/${site}/${file.replace(/\.md$/, '')}`;
    const title = text.match(/^title: "(.+?) — /m)?.[1];
    if (title) map.set(title, base);
    for (const m of text.matchAll(/^### `([A-Za-z_$][\w$]*)`\s*$/gm)) {
      if (!map.has(m[1])) map.set(m[1], `${base}#${m[1].toLowerCase().replace(/_/g, '-')}`);
    }
  }
  return map;
}

/* ---------------- main ---------------- */

function write(rel, text) {
  const out = join(SITE, rel);
  mkdirSync(dirname(out), { recursive: true });
  const w = writeGenerated(out, text);
  console.log(w.written ? `  wrote site/docs/${rel}` : `  unchanged site/docs/${rel}（日付 ${w.date} のまま）`);
}

/**
 * 読めるリポジトリの仕様書を全部読む（仕様 ID の行き先と、ツールの持ち主を全リポジトリで引けるようにする）。
 * 仕様書ページと、リファレンスのツールのページ（generate-reference.mjs、Y3）の両方が使うので、1 回だけ読む。
 */
let sourcesPromise = null;
export function loadSpecSources() {
  sourcesPromise ??= readSpecSources();
  return sourcesPromise;
}

async function readSpecSources() {
  const loaded = [];
  for (const site of SPEC_TARGETS) {
    const cfg = SPEC_REGISTRY[site];
    const src = sourceDir(cfg);
    const version = versionOf(cfg, src);
    if (!version) {
      console.warn(`⚠ skip specs:${site}: ${src} が無い — コミット済みのページを使う`);
      continue;
    }
    const ctx = { site, src, version, tag: `v${version}` };
    if (cfg.type === 'specs') {
      const dirs = readdirSync(join(src, 'specs/current'), { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(join(src, 'specs/current', d.name, 'spec.md')))
        .map((d) => d.name);
      ctx.features = sortFeatures(dirs.map((d) => readSpecFeature(src, d, cfg)));
      ctx.specIds = await loadSpecIds(src);
      if (!ctx.specIds) console.warn(`  ⚠ specs:${site}: spec-ids が見つからない。承認の履歴を出さない`);
      ctx.pages = new Set(ctx.features.map((f) => f.dir).filter((d) => !cfg.only || cfg.only.includes(d)));
    } else {
      const files = readdirSync(join(src, cfg.skillDir, 'workflows')).filter((f) => f.endsWith('.md') && f !== 'README.md');
      ctx.workflows = files.map((f) => readWorkflow(src, cfg, f));
      ctx.pages = new Set(ctx.workflows.map((w) => w.dir).filter((d) => !cfg.only || cfg.only.includes(d)));
    }
    loaded.push({ cfg, ctx });
  }

  // 仕様 ID → ページ、ツール名 → 持ち主
  const idPage = new Map();
  const toolIndex = new Map();
  for (const { cfg, ctx } of loaded) {
    for (const f of ctx.features ?? []) {
      for (const id of f.ids) idPage.set(id, { site: ctx.site, dir: f.dir, hasPage: ctx.pages.has(f.dir) });
      if (f.kind === 'tool') {
        if (!toolIndex.has(f.name)) toolIndex.set(f.name, []);
        toolIndex.get(f.name).push({ site: ctx.site, repo: cfg.repo, reference: cfg.reference });
      }
    }
  }
  const linkId = (id, site, dir) => {
    const p = idPage.get(id);
    if (!p || !p.hasPage) return null;
    return p.site === site && p.dir === dir ? `#${anchorOfId(id)}` : `/specs/${p.site}/${p.dir}#${anchorOfId(id)}`;
  };
  /** 仕様書ページの外（ツールのページ）から仕様 ID を指すリンク。同じ機能の ID も仕様書ページへ向ける */
  const linkIdFromOutside = (id) => {
    const p = idPage.get(id);
    return p?.hasPage ? `/specs/${p.site}/${p.dir}#${anchorOfId(id)}` : null;
  };
  const pageOf = (site, dir) => {
    const e = loaded.find((x) => x.ctx.site === site);
    return e?.ctx.pages.has(dir) ? `/specs/${site}/${dir}` : null;
  };
  return { loaded, linkId, linkIdFromOutside, toolIndex, pageOf };
}

/**
 * リファレンスのツールのページに写す、仕様書の節（Y3、2026-10-10）。
 *
 * 仕様書ページと同じ読み込み（readSpecFeature）と変換（transformMarkdown）を使い、生成済みの仕様書ページからは写さない
 * （仕様書ページが足した節の目的の一文が、ツールのページの一文と重なるため）。仕様 ID のリンクは仕様書ページの ID へ向ける。
 *
 * 返すもの（読めないリポジトリ・仕様書の無い名前は null）:
 *   - features: 名前（ツール名・関数名）→ 機能。公開定数のように 1 つの仕様書に複数の名前があるときは、
 *     「値」の節の `### \`NAME\`` の見出しの名前も同じ機能に向ける
 *   - sectionOf(f, src): spec.md の ## 節を、変換して返す（無ければ null）
 *   - promises(f): 仕様 ID ごとの約束の見出し [{ id, heading, url }]
 *   - overlay(f): 人が書く節（scripts/spec-pages/<site>/<dir>.md）。無ければ null。
 *     ページの中の仕様 ID の錨（`](#spec-…)`）は、仕様書ページの ID へ向け直す
 */
export async function specSourceFor(site) {
  const { loaded, linkIdFromOutside } = await loadSpecSources();
  const entry = loaded.find((x) => x.ctx.site === site);
  if (!entry || entry.cfg.type !== 'specs') return null;
  const { cfg, ctx } = entry;
  const tctx = { linkId: (id) => linkIdFromOutside(id) };
  const features = new Map();
  for (const f of ctx.features) {
    if (!features.has(f.name)) features.set(f.name, f);
    const values = f.sections.find((x) => x.heading === '値');
    if (values) {
      for (const sub of splitSections(values.text, 3).sections) {
        const m = sub.heading.match(/^`([A-Za-z_$][\w$]*)`$/);
        if (m && !features.has(m[1])) features.set(m[1], f);
      }
    }
  }
  return {
    repo: cfg.repo,
    version: ctx.version,
    tag: ctx.tag,
    features,
    specPage: (f) => (ctx.pages.has(f.dir) ? `/specs/${site}/${f.dir}` : null),
    specUrl: (f) => `${GITHUB}/${cfg.repo}/blob/${ctx.tag}/specs/current/${f.dir}/spec.md`,
    sectionOf: (f, heading) => {
      const sec = f.sections.find((x) => x.heading === heading);
      return sec ? transformMarkdown(sec.text, tctx) : null;
    },
    promises: (f) => {
      const sec = f.sections.find((x) => x.heading === 'できること');
      if (!sec) return [];
      return splitSections(sec.text, 3)
        .sections.map((item) => {
          const id = item.heading.match(SPEC_ID)?.[0];
          if (!id) return null;
          return { id, heading: transformLine(item.heading.replace(id, '').trim(), {}), url: linkIdFromOutside(id) };
        })
        .filter(Boolean);
    },
    overlay: (f) => {
      const p = join(ROOT, 'scripts/spec-pages', site, `${f.dir}.md`);
      if (!existsSync(p)) return null;
      const page = ctx.pages.has(f.dir) ? `/specs/${site}/${f.dir}` : null;
      const text = readFileSync(p, 'utf8').trim();
      return page ? text.replace(/\]\(#(spec-[a-z0-9-]+)\)/g, `](${page}#$1)`) : text;
    },
  };
}

export async function generateSpecPages(names = SPEC_TARGETS) {
  const { loaded, linkId, toolIndex, pageOf } = await loadSpecSources();

  // 2. ページを書く
  for (const { cfg, ctx } of loaded) {
    if (!names.includes(ctx.site)) continue;
    Object.assign(ctx, { linkId, toolIndex, pageOf });
    console.log(`${cfg.repo} v${ctx.version} — 仕様書ページ ${ctx.pages.size} 枚`);
    if (cfg.type === 'specs') {
      for (const f of ctx.features.filter((x) => ctx.pages.has(x.dir))) write(`specs/${ctx.site}/${f.dir}.md`, renderSpecPage(ctx, cfg, f));
      write(`specs/${ctx.site}/index.md`, renderSpecIndex(ctx, cfg, ctx.features, ctx.pages));
    } else {
      for (const w of ctx.workflows.filter((x) => ctx.pages.has(x.dir))) write(`specs/${ctx.site}/${w.dir}.md`, renderWorkflowPage(ctx, cfg, w));
      write(`specs/${ctx.site}/index.md`, renderSkillIndex(ctx, cfg, ctx.workflows, ctx.pages));
    }
  }

  // 3. sidebar（読めたリポジトリの分だけ。読めなかったリポジトリがあるときは書き換えない）
  if (loaded.length === SPEC_TARGETS.length) writeSidebar(loaded);
  else console.warn('  ⚠ 読めないリポジトリがあるので specs-sidebar.json を書き換えない');
}

function writeSidebar(loaded) {
  const groups = [{ text: '仕様書', items: [{ text: '仕様書の読み方', link: '/specs/' }] }];
  for (const { cfg, ctx } of loaded) {
    const items = [{ text: '一覧', link: `/specs/${ctx.site}/` }];
    if (cfg.type === 'specs') {
      for (const k of KINDS) {
        const list = ctx.features.filter((f) => f.kind === k.kind && ctx.pages.has(f.dir));
        if (list.length) items.push({ text: k.label, collapsed: true, items: list.map((f) => ({ text: f.name, link: `/specs/${ctx.site}/${f.dir}` })) });
      }
    } else {
      const list = ctx.workflows.filter((w) => ctx.pages.has(w.dir));
      if (list.length) items.push({ text: 'workflow', items: list.map((w) => ({ text: w.dir, link: `/specs/${ctx.site}/${w.dir}` })) });
    }
    groups.push({ text: cfg.type === 'skill' ? 'houki-research Skill' : cfg.repo, collapsed: true, items });
  }
  const out = join(SITE, '.vitepress/specs-sidebar.json');
  const text = `${JSON.stringify({ '/specs/': groups }, null, 2)}\n`;
  if (existsSync(out) && readFileSync(out, 'utf8') === text) {
    console.log('  unchanged site/docs/.vitepress/specs-sidebar.json');
    return;
  }
  writeFileSync(out, text);
  console.log('  wrote site/docs/.vitepress/specs-sidebar.json');
}
