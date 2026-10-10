import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyVerified, describeFindings, judge, needsDb, precheck, renderContractTable, summarizeContract, todayJstDate } from './check-examples-contract.mjs';
import {
  ANY,
  OMITTED,
  TRUNCATED,
  VOLATILE_RULES,
  compareMarkdownLines,
  comparePattern,
  formatPath,
  globMatch,
  looksLikeError,
  normalizeHome,
  parseCheckLines,
  parseContractExamples,
  parseJsoncPattern,
  pathMatches,
  statusOf,
  stripContractLines,
  valueAt,
  writeVerifiedLines,
} from './lib/example-contract.mjs';

const FENCE = '```';

const SAMPLE = `::: tip 引数名は \`law_name\` です
説明
:::

::: details 呼び出し例 — 「消費税法 57 条の 2」
- 実測: v0.20.0（2026-10-05）
- ローカル DB: 不要
- 照合: \`meta.title\` は見ない。\`score\` は ±0.05

**引数**

${FENCE}jsonc
{ "law_name": "消費税法", "article": "57の2" }
${FENCE}

**返る JSON（抜粋）**

${FENCE}jsonc
{ "format": "json", "meta": { "law_id": "363AC0000000108", "retrieved_at": "2026-10-04T20:19:52.055Z" } }
${FENCE}
:::

::: details 呼び出し例 — エラー
- 実測: v0.20.0（2026-10-05）

**引数**

${FENCE}jsonc
{ "law_name": "消費税法", "article": "3000" }
${FENCE}

**返る JSON**（\`isError: true\` 付き）

${FENCE}jsonc
{ "error": "条文が見つかりません", "code": "ARTICLE_NOT_FOUND" }
${FENCE}

**返る JSON**

${FENCE}jsonc
{ "second": true }
${FENCE}
:::

::: details 呼び出し例 — 一部だけ
- 実測: v0.25.1（2026-10-05）
- ローカル DB: あり（\`source: "db"\`）

**引数**

${FENCE}jsonc
{ "no": "1222" }
${FENCE}

**返る JSON の \`taxAnswer.sections\`（見出しの数）**

${FENCE}jsonc
[{ "heading": "概要" }]
${FENCE}
:::
`;

/* ---------------- 例の読み取り ---------------- */

test('parseContractExamples: details ごとに引数・返る JSON・前提の行・照合の行を読む', () => {
  const ex = parseContractExamples(SAMPLE);
  assert.equal(ex.length, 3);
  assert.equal(ex[0].heading, '呼び出し例 — 「消費税法 57 条の 2」');
  assert.equal(ex[0].measured, '0.20.0');
  assert.equal(ex[0].localDb, '不要');
  assert.deepEqual(ex[0].checkLines, ['`meta.title` は見ない。`score` は ±0.05']);
  assert.equal(ex[0].argsText, '{ "law_name": "消費税法", "article": "57の2" }');
  assert.match(ex[0].expectedText, /"format": "json"/);
  assert.equal(ex[0].excerpt, true);
  assert.equal(ex[0].expectIsError, false);
});

test('parseContractExamples: isError の見出し、2 つ目の返る JSON は読まずに注記する', () => {
  const ex = parseContractExamples(SAMPLE)[1];
  assert.equal(ex.localDb, null);
  assert.equal(ex.expectIsError, true);
  assert.match(ex.expectedText, /ARTICLE_NOT_FOUND/);
  assert.equal(ex.notes.length, 1);
  assert.match(ex.notes[0], /2 つ以上/);
});

test('parseContractExamples: 「返る JSON の `パス`」は応答のその位置と比べる', () => {
  const ex = parseContractExamples(SAMPLE)[2];
  assert.equal(ex.expectedPath, 'taxAnswer.sections');
});

/* ---------------- jsonc ---------------- */

test('parseJsoncPattern: コメント・末尾のカンマ・裸の … を読む', () => {
  const v = parseJsoncPattern(`{
    "a": 1, // 説明
    "b": [ { "x": 1 }, { "x": 2 } // …計 8 件
    ],
    "c": …,
    "d": { "e": "f" /* … */ },
  }`);
  assert.equal(v.a, 1);
  assert.equal(v.c, ANY);
  assert.equal(v.b.length, 2);
  assert.equal(v.b[TRUNCATED], true);
  assert.equal(v.d[OMITTED], true);
  assert.equal(v[OMITTED], true); // "a": 1, の後ろのコメント
});

test('parseJsoncPattern: 配列の "…" と、"…": "…" のキーは省略の印', () => {
  const v = parseJsoncPattern('{ "p": ["…", "1 事業者免税点制度", "…"], "meta": { "id": 1, "…": "…" } }');
  assert.deepEqual([...v.p], ['1 事業者免税点制度']);
  assert.equal(v.p[TRUNCATED], true);
  assert.deepEqual(Object.keys(v.meta), ['id']);
  assert.equal(v.meta[OMITTED], true);
});

test('parseJsoncPattern: 文字列の中の // や … はコメント・省略として扱わない', () => {
  const v = parseJsoncPattern('{ "url": "https://example.jp/a", "s": "前…後", "e": "\\"引用\\"" }');
  assert.equal(v.url, 'https://example.jp/a');
  assert.equal(v.s, '前…後');
  assert.equal(v.e, '"引用"');
  assert.equal(v[OMITTED], undefined);
});

test('parseJsoncPattern: 読めないときは行番号付きの例外', () => {
  assert.throws(() => parseJsoncPattern('{\n  "a": \n}'), /2 行目付近|3 行目付近/);
});

/* ---------------- 文字列の … ---------------- */

test('globMatch: … を「省いた部分」として、断片が順に現れれば一致', () => {
  assert.equal(globMatch('前項の場合において、…', '前項の場合において、次の各号'), true);
  assert.equal(globMatch('…以上', '本文\n以上'), true);
  assert.equal(globMatch('A…C…E', 'ABCDE'), true);
  assert.equal(globMatch('A…E…C', 'ABCDE'), false);
  assert.equal(globMatch('前項…', '後項の'), false);
  assert.equal(globMatch('同じ', '同じ'), true);
  assert.equal(globMatch('同じ', '同じでない'), false);
  assert.equal(globMatch('…', ''), true);
});

test('globMatch: 「…」の前後の空白は省略の記号の一部（改行は含めない）', () => {
  assert.equal(globMatch('【参考】… 新旧対応表 …（PDF/399KB）', '【参考】令和８年…の構成及び新旧対応表（令和７年４月１日）（PDF/399KB）'), true);
  assert.equal(globMatch('2 … 別紙2 … 適用する。', '2 消費税法基本通達について、別紙2「…」のとおり…適用する。'), true);
  assert.equal(globMatch('A　…　B', 'AxB'), true);
  // 改行は省かない
  assert.equal(globMatch('A\n…\nB', 'AxB'), false);
  // 断片の中の空白は比べる
  assert.equal(globMatch('…A B…', 'xAByy'), false);
});

/* ---------------- パス ---------------- */

test('pathMatches: ** は任意の深さ、[] は配列の要素', () => {
  assert.equal(pathMatches('**.retrieved_at', ['meta', 'retrieved_at']), true);
  assert.equal(pathMatches('**.retrieved_at', ['retrieved_at']), true);
  assert.equal(pathMatches('freshness.db_path', ['freshness', 'db_path']), true);
  assert.equal(pathMatches('freshness.db_path', ['x', 'freshness', 'db_path']), false);
  assert.equal(pathMatches('**.saved[].path', ['saved', 0, 'path']), true);
  assert.equal(pathMatches('**.score', ['results', 1, 'score']), true);
  assert.equal(pathMatches('results', ['results']), true);
  assert.equal(pathMatches('results', ['results', 0]), false);
});

test('formatPath と valueAt', () => {
  assert.equal(formatPath(['results', 1, 'score']), 'results[1].score');
  assert.equal(formatPath([]), '（応答の全体）');
  assert.deepEqual(valueAt({ a: { b: [{ c: 1 }] } }, 'a.b[0].c'), 1);
  assert.equal(valueAt({ a: 1 }, 'a.b'), undefined);
});

/* ---------------- 比べ方の規則 ---------------- */

const cats = (findings) => findings.map((f) => `${f.category} ${f.path}`);

test('comparePattern: 書いてあるキーが無い・型が違うと形の違い', () => {
  const f = comparePattern({ a: 1, b: 'x', c: null }, { a: 1, c: 'now' });
  assert.deepEqual(cats(f), ['shape b', 'shape c']);
});

test('comparePattern: 短い値（code など）の違いは形、長い文字列と数の違いはデータ側', () => {
  const long = 'あ'.repeat(50);
  const f = comparePattern({ code: 'NOT_FOUND', body: long, total: 65, flag: true }, { code: 'OTHER', body: `${long}い`, total: 66, flag: false });
  assert.deepEqual(cats(f), ['shape code', 'data body', 'data total', 'shape flag']);
  assert.equal(statusOf(f), 'shape');
  assert.equal(statusOf(f.filter((x) => x.category !== 'shape')), 'data');
  assert.equal(statusOf([]), 'match');
});

test('comparePattern: 例に無いキーは「増えた」で、例が キーを省いていれば数えない', () => {
  assert.deepEqual(cats(comparePattern({ a: 1 }, { a: 1, b: 2 })), ['extra （応答の全体）']);
  assert.deepEqual(cats(comparePattern(parseJsoncPattern('{ "a": 1 /* … */ }'), { a: 1, b: 2 })), []);
  assert.deepEqual(cats(comparePattern({ a: 1 }, { a: 1, b: 2 }, VOLATILE_RULES, { reportExtra: false })), []);
});

test('comparePattern: 切っていない配列は要素の数まで、短ければ形の違い', () => {
  assert.deepEqual(cats(comparePattern({ s: [1, 2, 3] }, { s: [1, 2] })), ['shape s']);
  assert.deepEqual(cats(comparePattern({ s: [1, 2] }, { s: [1, 2, 3] })), ['data s']);
});

test('comparePattern: 途中で切った配列は、例の要素が同じ順で現れればよい（間を飛ばしてよい）', () => {
  const exp = parseJsoncPattern('{ "a": [ { "num": "1044" }, { "num": "1046" } // …計 8 件\n ] }');
  const act = { a: [{ num: '1044' }, { num: '1045' }, { num: '1046', caption: 'x' }] };
  assert.deepEqual(cats(comparePattern(exp, act)), ['extra a[2]']);
  const wrongOrder = { a: [{ num: '1046' }, { num: '1044' }] };
  assert.ok(comparePattern(exp, wrongOrder).some((f) => f.category === 'shape'));
});

test('comparePattern: 毎回変わる値（retrieved_at・fetchedAt・db_path・score）', () => {
  const exp = {
    meta: { retrieved_at: '2026-10-04T20:19:52.055Z' },
    taxAnswer: { fetchedAt: '2026-10-05T05:45:26.899Z' },
    freshness: { db_path: '~/.cache/houki-nta-mcp/cache.db', days_since_oldest: 0 },
    results: [{ score: 0.2529 }],
  };
  const act = {
    meta: { retrieved_at: '2026-10-10T00:00:00.000Z' },
    taxAnswer: { fetchedAt: '2026-10-10T01:00:00.000Z' },
    freshness: { db_path: '/tmp/x/cache.db', days_since_oldest: 5 },
    results: [{ score: 0.26 }],
  };
  assert.deepEqual(cats(comparePattern(exp, act)), []);
  const bad = structuredClone(act);
  bad.taxAnswer.fetchedAt = '昨日';
  bad.results[0].score = 0.3;
  delete bad.meta.retrieved_at;
  assert.deepEqual(cats(comparePattern(exp, bad)), ['shape meta.retrieved_at', 'shape taxAnswer.fetchedAt', 'data results[0].score']);
});

test('comparePattern: results の 2 件目以降の値の違いはデータ側（順は 1 件目だけ固定）', () => {
  const exp = { results: [{ docId: '1131' }, { docId: '1128' }] };
  assert.deepEqual(cats(comparePattern(exp, { results: [{ docId: '1131' }, { docId: '1127' }] })), ['data results[1].docId']);
  assert.deepEqual(cats(comparePattern(exp, { results: [{ docId: '9999' }, { docId: '1128' }] })), ['shape results[0].docId']);
});

test('comparePattern: 国税庁の更新で変わる値（effectiveDate など）はデータ側', () => {
  const f = comparePattern({ taxAnswer: { effectiveDate: '令和7年4月1日現在法令等' } }, { taxAnswer: { effectiveDate: '令和8年4月1日現在法令等' } });
  assert.deepEqual(cats(f), ['data taxAnswer.effectiveDate']);
});

test('compareMarkdownLines: 例の行が順に現れればよく、取得日時の行は比べない', () => {
  const ex = '# 消費税法 第30条第2項\n\n前項の場合において、…\n取得日時: 2026-10-04T20:19:54.250Z';
  const act = '# 消費税法 第30条第2項\n（見出し）\n\n前項の場合において、次の\n取得日時: 2026-10-10T00:00:00Z';
  assert.deepEqual(compareMarkdownLines(ex, act), []);
  assert.equal(compareMarkdownLines('無い行', act)[0].category, 'data');
  assert.equal(compareMarkdownLines('x', null)[0].category, 'shape');
});

test('normalizeHome: 応答のホームのパスを ~ にする', () => {
  assert.deepEqual(normalizeHome({ p: '/Users/you/.cache/a', n: 1, l: ['/Users/you/b'] }, '/Users/you'), { p: '~/.cache/a', n: 1, l: ['~/b'] });
  assert.deepEqual(normalizeHome({ p: '/x' }, null), { p: '/x' });
  // 使い捨てのフォルダー → 既定の置き場所の書き方（ホームより先に置き換える）
  assert.deepEqual(normalizeHome('/tmp/c/houki-egov-files/a.jpg を保存', '/home/u', [['/tmp/c/houki-egov-files', '~/.cache/houki-egov-mcp/files']]), '~/.cache/houki-egov-mcp/files/a.jpg を保存');
});

test('looksLikeError: error と code を持つ例はエラーの応答を期待する', () => {
  assert.equal(looksLikeError({ error: 'x', code: 'Y' }), true);
  assert.equal(looksLikeError({ code: 'Y' }), false);
  assert.equal(looksLikeError([]), false);
  assert.equal(looksLikeError(null), false);
});

/* ---------------- 例ごとの例外 ---------------- */

test('parseCheckLines: しない・見ない・幅・1 件目だけ・データ、末尾の（理由）', () => {
  const r = parseCheckLines([
    '`meta.title`・`meta.url` は見ない。`score` は ±0.05',
    '`results` は 1 件目だけ（順が入れ替わる）。`body` はデータ',
    '何か読めない文',
  ]);
  assert.equal(r.skip, false);
  assert.deepEqual(
    r.rules.map((x) => `${x.path} ${x.kind}${x.tolerance ? ` ${x.tolerance}` : ''}`),
    ['meta.title ignore', 'meta.url ignore', 'score tolerance 0.05', 'results first-only', 'body data'],
  );
  assert.equal(r.rules[3].why, '順が入れ替わる');
  assert.deepEqual(r.unknown, ['何か読めない文']);
  assert.deepEqual(parseCheckLines(['しない（126 日たった DB を用意できない）']), {
    skip: true,
    skipReason: '126 日たった DB を用意できない',
    rules: [],
    unknown: [],
  });
});

test('comparePattern: 例ごとの規則が family 共通の規則より先に当たる', () => {
  const rules = [...parseCheckLines(['`results` は 1 件目だけ。`meta` は見ない']).rules, ...VOLATILE_RULES];
  const f = comparePattern({ results: [{ id: 1 }, { id: 2 }], meta: { a: 1 } }, { results: [{ id: 1 }], meta: 'x' }, rules);
  assert.deepEqual(cats(f), []);
});

/* ---------------- 判定 ---------------- */

const [EX_OK, EX_ERR, EX_SUB] = parseContractExamples(SAMPLE);

test('precheck: 照合しない・DB の要る例・前提の行が無い例', () => {
  assert.equal(precheck(EX_OK, { db: 'absent' }), null);
  assert.equal(precheck(EX_SUB, { db: 'absent' }).status, 'unverified');
  assert.equal(precheck(EX_SUB, { db: 'present' }), null);
  assert.equal(precheck(EX_ERR, { db: 'absent' }).status, 'unverified');
  assert.equal(precheck({ ...EX_OK, checkLines: ['しない（理由）'] }, { db: 'present' }).status, 'skipped');
  assert.equal(precheck({ ...EX_OK, versionExcluded: true }, { db: 'present' }).status, 'skipped');
  assert.equal(needsDb('あり（source: "db"）'), true);
  assert.equal(needsDb('不要。ただし DB に構造があればそこから返る'), false);
  assert.equal(needsDb(null), false);
});

test('judge: 一致・例ごとの規則（見ない）・エラーかどうか', () => {
  const ok = judge(EX_OK, { isError: false, json: { format: 'json', meta: { law_id: '363AC0000000108', retrieved_at: '2026-10-10T00:00:00Z', title: 'x' } } });
  assert.equal(ok.status, 'match');
  const err = judge(EX_ERR, { isError: false, json: { error: '条文が見つかりません', code: 'ARTICLE_NOT_FOUND' } });
  assert.equal(err.status, 'shape');
  assert.equal(err.findings[0].path, '（isError）');
  // 見出しに isError が無くても、例が error と code を持てばエラーを期待する
  const inferred = judge({ ...EX_ERR, expectIsError: false }, { isError: true, json: { error: '条文が見つかりません', code: 'ARTICLE_NOT_FOUND' } });
  assert.equal(inferred.status, 'match');
});

test('judge: 「返る JSON の `パス`」は応答のその位置と比べ、パスを付けて報告する', () => {
  const r = judge(EX_SUB, { isError: false, json: { taxAnswer: { sections: [{ heading: '概要' }, { heading: '手続き' }] } } });
  assert.equal(r.status, 'data');
  assert.equal(r.findings[0].path, 'taxAnswer.sections');
  const missing = judge(EX_SUB, { isError: false, json: { taxAnswer: {} } });
  assert.equal(missing.status, 'shape');
});

test('judge: DB の無い環境では source の違いをデータ側にし、ホームのパスを ~ にして比べる', () => {
  const ex = { ...EX_OK, checkLines: [], expectedText: '{ "source": "db", "note": "~/.cache/a.jpg を保存しました" }', excerpt: false };
  const res = { isError: false, json: { source: 'live', note: '/home/u/.cache/a.jpg を保存しました' } };
  assert.equal(judge(ex, res, { db: 'absent', home: '/home/u' }).status, 'data');
  assert.equal(judge(ex, res, { db: 'present', home: '/home/u' }).status, 'shape');
});

test('judge: 応答が JSON でない・例の jsonc が読めない', () => {
  assert.equal(judge(EX_OK, { isError: false, json: null, text: 'plain' }).status, 'shape');
  assert.equal(judge({ ...EX_OK, expectedText: '{ "a": }' }, { isError: false, json: {} }).status, 'unverified');
});

test('表と集計', () => {
  const rows = [
    { server: 'houki-egov', tool: 'get_law', heading: '呼び出し例 — 「A|B」', measured: '0.20.0', status: 'match', findings: [] },
    { server: 'houki-nta', tool: 'nta_get_qa', heading: '呼び出し例 — X', measured: null, status: 'unverified', reason: 'DB が要る例（--db absent）', findings: [] },
    {
      server: 'houki-nta',
      tool: 'nta_get_tax_answer',
      heading: 'Y',
      measured: '0.25.1',
      status: 'shape',
      findings: [
        { path: 'a', category: 'shape', detail: 'キーが無い' },
        { path: 'b', category: 'data', detail: '1 → 2' },
        { path: 'c', category: 'extra', detail: '例に無いキー: d' },
      ],
    },
  ];
  const table = renderContractTable(rows);
  assert.match(table, /\| houki-egov \| get_law \| 「A\\\|B」 \| v0\.20\.0 \| 一致 \|  \|/);
  assert.match(table, /\| （無し） \| 未確認 \| DB が要る例/);
  assert.equal(describeFindings(rows[2]), '形: `a` キーが無い / データ: `b` 1 → 2 / 増えた: `c` 例に無いキー: d');
  assert.deepEqual(summarizeContract(rows), { total: 3, match: 1, data: 0, shape: 1, unverified: 1, skipped: 0 });
});

test('stripContractLines: 「- 照合:」の行だけを落とし、「- 版の照合:」「- ローカル DB:」は残す（Q37\')', () => {
  const text = ['::: details 呼び出し例 — 「x」', '- 実測: v0.27.0（2026-10-10）', '- ローカル DB: あり', '- 照合: `results` は 1 件目だけ（理由）', '- 版の照合: しない（理由）', '', '**引数**', ':::'].join('\n');
  assert.equal(
    stripContractLines(text),
    ['::: details 呼び出し例 — 「x」', '- 実測: v0.27.0（2026-10-10）', '- ローカル DB: あり', '- 版の照合: しない（理由）', '', '**引数**', ':::'].join('\n'),
  );
});

const WRITE_SAMPLE = [
  '::: details 呼び出し例 — A',            // 1
  '- 実測: v0.25.0（2026-10-05）',          // 2
  '- ローカル DB: 不要',                    // 3
  ':::',                                    // 4
  '',                                       // 5
  '::: details 呼び出し例 — B',            // 6
  '- 実測: v0.24.0（2026-10-04）',          // 7
  '- 確かめた版: v0.25.0（2026-10-05）',    // 8
  ':::',                                    // 9
  '',                                       // 10
  '::: details 呼び出し例 — C',            // 11
  '- 実測: v0.27.0（2026-10-10）',          // 12
  ':::',                                    // 13
  '',                                       // 14
  '::: details 呼び出し例 — D',            // 15
  '- 確かめた版: v0.27.0（2026-10-09）',    // 16
  ':::',                                    // 17
  '::: details 呼び出し例 — E（実測の行が無い）', // 18
  ':::',                                    // 19
].join('\n');

test('writeVerifiedLines: 実測の次に足す・置き換える・同じ版は変えない・実測と同じ版は書かない', () => {
  const entries = [1, 6, 11, 15, 18].map((line) => ({ line, version: '0.27.0', date: '2026-10-10' }));
  const { text, results } = writeVerifiedLines(WRITE_SAMPLE, entries);
  assert.deepEqual(results.map((r) => r.action), ['inserted', 'replaced', 'same-as-measured', 'unchanged', 'no-measured']);
  const lines = text.split('\n');
  assert.equal(lines[2], '- 確かめた版: v0.27.0（2026-10-10）'); // A: 実測の次の行
  assert.equal(lines[3], '- ローカル DB: 不要');
  assert.equal(lines[8], '- 確かめた版: v0.27.0（2026-10-10）'); // B: 置き換え（行は 1 つずれる）
  assert.ok(text.includes('- 確かめた版: v0.27.0（2026-10-09）')); // D: 最初に確かめた日を残す
  assert.equal(lines.length, WRITE_SAMPLE.split('\n').length + 1);
  // 書いた後も例として読める（見出しの行の並びは変わらない）
  assert.equal(parseContractExamples(text).length, 5);
  // entries に無い例は触らない
  assert.equal(writeVerifiedLines(WRITE_SAMPLE, []).text, WRITE_SAMPLE);
});

test('applyVerified: 一致の例だけ、npx で起動したサーバーの版で書く', () => {
  const files = { '/r/a.md': WRITE_SAMPLE };
  const written = {};
  const rows = [
    { server: 'houki-nta', file: 'a.md', line: 1, heading: '呼び出し例 — A', status: 'match' },
    { server: 'houki-nta', file: 'a.md', line: 6, heading: '呼び出し例 — B', status: 'data' },
    { server: 'houki-egov', file: 'b.md', line: 1, heading: '呼び出し例 — X', status: 'match' },
  ];
  const out = applyVerified('/r', rows, { 'houki-nta': { mode: 'npx', version: '0.27.0' }, 'houki-egov': { mode: 'local', version: '0.20.1' } }, '2026-10-10', {
    read: (f) => files[f],
    write: (f, t) => {
      written[f] = t;
    },
  });
  assert.deepEqual(out.map((o) => [o.file, o.line, o.action]), [['b.md', 1, 'not-published'], ['a.md', 1, 'inserted']]);
  assert.ok(written['/r/a.md'].includes('- 実測: v0.25.0（2026-10-05）\n- 確かめた版: v0.27.0（2026-10-10）'));
  // データ側の差分の例（B）は書かない
  assert.ok(written['/r/a.md'].includes('- 確かめた版: v0.25.0（2026-10-05）'));
});

test('todayJstDate: JST の日付', () => {
  assert.equal(todayJstDate(new Date('2026-10-10T15:30:00Z')), '2026-10-11');
});

test('comparePattern: rank は ±0.01（例は小数 2 桁に丸めて書く）', () => {
  assert.deepEqual(comparePattern({ hits: [{ rank: -15.07 }] }, { hits: [{ rank: -15.070028182166215 }] }), []);
  const far = comparePattern({ hits: [{ rank: -15.07 }] }, { hits: [{ rank: -14.5 }] });
  assert.equal(far[0].category, 'data');
});
