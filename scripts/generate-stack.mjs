#!/usr/bin/env node
/**
 * stack.json を実測から生成し、CI では npm と突き合わせる。
 * pdf-agent-stack の scripts/generate-stack.mjs と同じ設計（2026-09-07 に移植）。
 *
 * **正典は npm**（公開されている版）。ローカルの git tag / package.json は
 * 「手元が公開版より進んでいないか」を見るための参考値でしかない。
 * CI にはローカルの clone が無いので、**照合は npm だけで完結する**ように分けてある。
 *
 *   node scripts/generate-stack.mjs            # 生成（手元）
 *   node scripts/generate-stack.mjs --check    # 照合のみ（CI）。ずれていれば exit 1
 *   node scripts/generate-stack.mjs --readme   # README.md の表を差し替え
 *   node scripts/generate-stack.mjs --root /path/to/houki-hub
 *
 * 依存なし（Node 20+）。
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

/** 束ねディレクトリ（scripts/ の 1 つ上）。CI では clone が無くても動く */
const ROOT = resolve(value('root', join(HERE, '..')));
const STACK_FILE = join(ROOT, 'stack.json');
const README_FILE = join(ROOT, 'README.md');

/**
 * 構成の台帳 —— **ここだけが手で書く場所**。
 *
 * 3 軸で分類する:
 *   layer   役割     source / dictionary / procedure / orchestration / hub
 *             source        一次資料（法令・通達・判例）を取りに行く MCP。組織軸（egov / nta / mhlw）か
 *                           コンテンツ種軸（saiketsu / court / metadata）で束ねる
 *             dictionary    family 全体が import する共有ライブラリ（略称辞書・正規化・鮮度判定）
 *             procedure     LLM が読む手順（Skill）。error contract / citation / 業法独占規定の正典
 *             orchestration 複数の MCP と Skill を束ねて 1 つのエージェントにする（plugin / app）
 *             hub           本リポジトリ（構成表とサイト）
 *   form    配布形態 mcp-server / library / skill / plugin / app / site
 *             **「誰が起動するか」が form を決める**:
 *             mcp-server = LLM が呼ぶ / library = 開発者のコードが import する
 *             skill = LLM が読む / app = 人・シェル・CI が起動する
 *   status  進み具合 released / planned / concept
 *             released = npm か GitHub に公開済み。npm 照合の対象
 *             planned  = 着手順が決まっている。ディレクトリも npm も無いので照合しない
 *             concept  = 構想だけ。名前と束ねる単位を予約している段階
 */
const REGISTRY = [
  // ── 公開済み ────────────────────────────────────────────────
  { name: 'houki-egov-mcp',       dir: 'mcp/houki-egov-mcp',       npm: '@shuji-bonji/houki-egov-mcp',       layer: 'source',        form: 'mcp-server', status: 'released', public: true,
    note: 'e-Gov 法令 API v2。法律・政令・省令の本文・目次・改正履歴 + ローカル SQLite FTS5 全文検索。7 tools' },
  { name: 'houki-nta-mcp',        dir: 'mcp/houki-nta-mcp',        npm: '@shuji-bonji/houki-nta-mcp',        layer: 'source',        form: 'mcp-server', status: 'released', public: true,
    note: '国税庁。法令解釈通達・質疑応答事例・タックスアンサー・文書回答・事務運営指針・改正通達。14 tools。family の参照実装' },
  { name: 'houki-abbreviations',  dir: 'lib/houki-abbreviations',  npm: '@shuji-bonji/houki-abbreviations',  layer: 'dictionary',    form: 'library',    status: 'released', public: true,
    note: '略称辞書 174 エントリ（6 分野）+ 全角ゆらぎ正規化 + 鮮度判定 + 逆引き + 検証ヘルパ。全 MCP が依存 (^0.4.1 指定のため MCP に入るのは 0.4.1。0.5 系で足した逆引き・検証は MCP 未使用)' },
  { name: 'houki-research-skill', dir: 'skill/houki-research-skill', npm: null,                              layer: 'procedure',     form: 'skill',      status: 'released', public: true,
    note: 'family 横断の手順。error contract / citation / 業法独占規定（弁護士法 72 条・税理士法 52 条・社労士法 27 条）の正典。workflow は tax-research のみ' },
  { name: 'houki-hub',            dir: '.',                        npm: null,                                layer: 'hub',           form: 'site',       status: 'released', public: true,
    note: '本リポジトリ。site/ に VitePress（GitHub Pages。公開は準備中）' },

  // ── 予定・構想（ディレクトリも npm も無い。照合はしない）──────────
  { name: 'houki-metadata-mcp',   dir: 'mcp/houki-metadata-mcp',   npm: '@shuji-bonji/houki-metadata-mcp',   layer: 'source',        form: 'mcp-server', status: 'planned', public: false,
    note: '法令メタデータの時系列横串（公布→施行ラグ、改正予定）。J-SOX 型「施行前フォロー期」が主用途。mhlw より先に着手する判断 (2026-05)' },
  { name: 'houki-mhlw-mcp',       dir: 'mcp/houki-mhlw-mcp',       npm: '@shuji-bonji/houki-mhlw-mcp',       layer: 'source',        form: 'mcp-server', status: 'planned', public: false,
    note: '厚生労働省。労働基準・社会保険系の通達・通知・指針' },
  { name: 'houki-saiketsu-mcp',   dir: 'mcp/houki-saiketsu-mcp',   npm: '@shuji-bonji/houki-saiketsu-mcp',   layer: 'source',        form: 'mcp-server', status: 'concept', public: false,
    note: '裁決全般（行政不服審査）。初版は国税不服審判所 (kfs.go.jp) のみ。名前は広く、初版スコープは README で明示する流儀' },
  { name: 'houki-court-mcp',      dir: 'mcp/houki-court-mcp',      npm: '@shuji-bonji/houki-court-mcp',      layer: 'source',        form: 'mcp-server', status: 'concept', public: false,
    note: '判例全般。初版は民事判決オープンデータ API のみ' },
  { name: 'houki-specialist-plugin', dir: 'agent/houki-specialist-plugin', npm: null,                         layer: 'orchestration', form: 'plugin',     status: 'concept', public: false,
    note: 'pdf-specialist-plugin と同型。MCP 群 + houki-research を 1 つのサブエージェントに束ねる。識別子付き法規エージェント (L2) の入れ物' },
];

/** 外部にあり、この束ねの配下に置かないもの（参照だけ残す） */
const EXTERNAL = [
  { name: 'pdf-reader-mcp',  layer: 'source',       form: 'mcp-server',  public: true, note: 'houki-nta-mcp の PDF 経路（nta_inspect_pdf_meta の reader_hints）が前提にする。PDF Agent Stack の一員なので束ねの外' },
  { name: 'claude-plugins',  layer: 'distribution', form: 'marketplace', public: true, note: 'houki-egov-mcp / houki-nta-mcp / houki-research の plugin 配布先。法規専用ではないので束ねの外' },
  { name: 'laws-api-mirror', layer: 'source',       form: 'data',        public: true, note: '構想: 検索 tier はミラー、引用時だけ e-Gov に照合する verify-on-cite の相手先' },
];

const sh = (cmd, cmdArgs, opts = {}) => {
  try {
    return execFileSync(cmd, cmdArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 60_000, ...opts }).trim();
  } catch {
    return null;
  }
};

/** npm の公開版。**これが正典** */
const npmVersion = (pkg) => (pkg ? sh('npm', ['view', pkg, 'version']) : null);

/** ローカルの版。clone が無ければ null（CI ではこれが全部 null になる） */
function localState(entry) {
  const dir = join(ROOT, entry.dir);
  if (!existsSync(dir)) return { present: false, version: null, tag: null, dirty: null };

  // package.json（MCP / ライブラリ / アプリ）→ 無ければ plugin.json（Skill / plugin）
  let version = null;
  for (const file of ['package.json', 'plugin.json', '.claude-plugin/plugin.json']) {
    const p = join(dir, file);
    if (!existsSync(p)) continue;
    try {
      version = JSON.parse(readFileSync(p, 'utf8')).version ?? null;
      if (version) break;
    } catch {
      /* 壊れていれば次を試す */
    }
  }

  const tag = sh('git', ['-C', dir, 'describe', '--tags', '--abbrev=0']);
  const status = sh('git', ['-C', dir, 'status', '--porcelain']);
  const unpushed = sh('git', ['-C', dir, 'log', '--oneline', '@{u}..HEAD']);
  return {
    present: true,
    version,
    tag,
    dirty: status === null ? null : status.length > 0,
    unpushedCommits: unpushed === null ? null : (unpushed ? unpushed.split('\n').length : 0),
  };
}

/**
 * 一致の判定。**「ずれ」と「まだ測っていない」を混ぜない**。
 * 測れなかったものを一致扱いにすると、指標が空振りする。
 */
function consistencyOf(entry, npmVer, local) {
  if (entry.status !== 'released') return { status: 'not_started', detail: `${entry.status}（未着手のため照合対象外）` };
  if (!entry.npm) return { status: 'not_published', detail: 'npm 未公開のため照合対象外' };
  if (npmVer === null) return { status: 'not_measured', detail: 'npm view が応答しなかった' };
  if (!local.present) return { status: 'npm_only', detail: `npm ${npmVer}（ローカル未確認）` };
  if (local.version === null) return { status: 'not_measured', detail: 'ローカルの version を読めなかった' };
  if (local.version === npmVer) return { status: 'match', detail: `${npmVer}` };
  return { status: 'drift', detail: `npm ${npmVer} ≠ local ${local.version}` };
}

function build() {
  const repos = REGISTRY.map((entry) => {
    const npmVer = entry.status === 'released' ? npmVersion(entry.npm) : null;
    const local = entry.status === 'released' ? localState(entry) : { present: false };
    return {
      name: entry.name,
      dir: entry.dir,
      npm: entry.npm,
      layer: entry.layer,
      form: entry.form,
      status: entry.status,
      public: entry.public,
      ...(entry.note ? { note: entry.note } : {}),
      published: npmVer,
      local: local.present ? { version: local.version, tag: local.tag, dirty: local.dirty, unpushedCommits: local.unpushedCommits } : null,
      consistency: consistencyOf(entry, npmVer, local),
    };
  });

  return {
    $comment: [
      'houki-hub（法規シリーズ）の構成表。**手で書くのは scripts/generate-stack.mjs の REGISTRY だけ**。',
      '版は実測（npm view / ローカルの package.json・git tag）で、推測は書かない。',
      '正典は npm（published）。local は「手元が公開版より進んでいないか」の参考値。',
      'layer = 役割 / form = 配布形態（誰が起動するか）/ status = released・planned・concept。',
      'planned / concept は名前と束ねる単位を予約しているだけで、ディレクトリも npm も無い。',
    ],
    generatedAt: new Date().toISOString(),
    generatedBy: 'scripts/generate-stack.mjs',
    npmScope: '@shuji-bonji',
    repos,
    external: EXTERNAL,
  };
}

const LABEL = {
  match: '一致', drift: '⚠ ずれ', not_measured: '未測定', npm_only: 'npm のみ', not_published: '未公開', not_started: '未着手',
};

function printSummary(stack) {
  const w = (s, n) => String(s ?? '—').padEnd(n, ' ');
  console.log(`# stack.json（${stack.generatedAt}）\n`);
  console.log(`  ${w('リポジトリ', 26)} ${w('layer', 14)} ${w('form', 12)} ${w('status', 9)} ${w('npm', 9)} ${w('local', 9)} 照合`);
  for (const r of stack.repos) {
    console.log(
      `  ${w(r.name, 26)} ${w(r.layer, 14)} ${w(r.form, 12)} ${w(r.status, 9)} ${w(r.published, 9)} ${w(r.local?.version, 9)} ${LABEL[r.consistency.status]}`,
    );
  }
  const drift = stack.repos.filter((r) => r.consistency.status === 'drift');
  const unmeasured = stack.repos.filter((r) => r.consistency.status === 'not_measured');
  const dirty = stack.repos.filter((r) => r.local?.dirty);
  const unpushed = stack.repos.filter((r) => r.local?.unpushedCommits > 0);
  console.log();
  if (drift.length) for (const r of drift) console.log(`  ⚠ ${r.name}: ${r.consistency.detail}`);
  if (unmeasured.length) console.log(`  ・未測定 ${unmeasured.length} 件（指標に数えない）`);
  if (dirty.length) console.log(`  ・未コミットの変更: ${dirty.map((r) => r.name).join(', ')}`);
  if (unpushed.length) console.log(`  ・未 push: ${unpushed.map((r) => `${r.name}(${r.local.unpushedCommits})`).join(', ')}`);
}

const STATUS_JA = { released: '公開済み', planned: '予定', concept: '構想' };

/** README.md のマーカー間を差し替える（無ければ何もしない） */
function renderReadmeTable(stack) {
  const row = (r) => {
    const ver = r.published ?? r.local?.version ?? '—';
    const npm = r.npm && r.status === 'released' ? `\`${r.npm}\`` : '—';
    const link = r.status === 'released' ? `[${r.name}](https://github.com/shuji-bonji/${r.name})` : r.name;
    return `| ${link} | ${r.layer} | ${r.form} | ${STATUS_JA[r.status]} | ${ver} | ${npm} |`;
  };
  const released = stack.repos.filter((r) => r.layer !== 'hub' && r.status === 'released').map(row);
  const upcoming = stack.repos.filter((r) => r.status !== 'released').map(row);
  return [
    '<!-- stack:begin — scripts/generate-stack.mjs が生成。手で編集しない -->',
    '',
    `> 版は実測（${stack.generatedAt.slice(0, 10)} 時点の \`npm view\`）。`,
    '',
    '| リポジトリ | 役割 | 配布形態 | 状態 | 版 | npm |',
    '| --- | --- | --- | --- | --- | --- |',
    ...released,
    ...upcoming,
    '',
    '<!-- stack:end -->',
  ].join('\n');
}

function updateReadme(stack) {
  if (!existsSync(README_FILE)) {
    console.log(`\n  README.md が無いので表だけ出力します:\n`);
    console.log(renderReadmeTable(stack));
    return;
  }
  const src = readFileSync(README_FILE, 'utf8');
  const begin = src.indexOf('<!-- stack:begin');
  const end = src.indexOf('<!-- stack:end -->');
  if (begin < 0 || end < 0) {
    console.log('\n  README.md に <!-- stack:begin --> / <!-- stack:end --> が無いので差し替えません。');
    console.log('  以下を貼り付けてください:\n');
    console.log(renderReadmeTable(stack));
    return;
  }
  const next = src.slice(0, begin) + renderReadmeTable(stack) + src.slice(end + '<!-- stack:end -->'.length);
  writeFileSync(README_FILE, next);
  console.log(`\n  README.md の表を更新しました`);
}

// ── 照合モード（CI）──────────────────────────────────────────
// **ローカルの clone を前提にしない。** npm だけで判定する。
if (flag('check')) {
  if (!existsSync(STACK_FILE)) {
    console.error(`stack.json がありません: ${STACK_FILE}`);
    process.exit(2);
  }
  const stack = JSON.parse(readFileSync(STACK_FILE, 'utf8'));
  const problems = [];
  let checked = 0;
  for (const r of stack.repos) {
    if (!r.npm || r.status !== 'released') continue;
    const now = npmVersion(r.npm);
    if (now === null) {
      problems.push({ kind: 'not_measured', name: r.name, detail: 'npm view が応答しなかった' });
      continue;
    }
    checked += 1;
    if (now !== r.published) {
      problems.push({ kind: 'drift', name: r.name, detail: `stack.json ${r.published} ≠ npm ${now}` });
    }
  }
  const drift = problems.filter((p) => p.kind === 'drift');
  const unmeasured = problems.filter((p) => p.kind === 'not_measured');
  console.log(`# stack.json 照合（npm ${checked} 件）`);
  for (const p of problems) console.log(`  ${p.kind === 'drift' ? '⚠' : '・'} ${p.name}: ${p.detail}`);
  if (unmeasured.length) {
    // **測れなかったものを緑にしない。** 判定不能は判定不能として返す
    console.log(`\n  判定不能 ${unmeasured.length} 件 — 指標を信用しない`);
    process.exit(2);
  }
  if (drift.length) {
    console.log(`\n  ずれ ${drift.length} 件 — \`node scripts/generate-stack.mjs --readme\` で更新すること`);
    process.exit(1);
  }
  console.log('\n  すべて一致');
  process.exit(0);
}

// ── 生成モード（手元）────────────────────────────────────────
const stack = build();
writeFileSync(STACK_FILE, `${JSON.stringify(stack, null, 2)}\n`);
printSummary(stack);
console.log(`\n  書き出し: ${STACK_FILE}`);
if (flag('readme')) updateReadme(stack);
