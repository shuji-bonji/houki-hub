import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildIssueBody,
  currentByServerFromLatest,
  decideAction,
  detectDrift,
  fetchLatest,
  fingerprintFromBody,
  fingerprintOf,
  githubClient,
} from './stack-drift-issue.mjs';

const STACK = {
  repos: [
    { name: 'houki-egov-mcp', npm: '@shuji-bonji/houki-egov-mcp', status: 'released', published: '0.15.4' },
    { name: 'houki-nta-mcp', npm: '@shuji-bonji/houki-nta-mcp', status: 'released', published: '0.21.2' },
    { name: 'houki-abbreviations', npm: '@shuji-bonji/houki-abbreviations', status: 'released', published: '0.6.1' },
    { name: 'houki-research-skill', npm: null, status: 'released', published: null },
    { name: 'houki-mhlw-mcp', npm: '@shuji-bonji/houki-mhlw-mcp', status: 'planned', published: null },
  ],
};

test('detectDrift: released かつ npm ありだけを見て、published と latest が違えば drift', () => {
  const r = detectDrift(STACK, {
    '@shuji-bonji/houki-egov-mcp': '0.15.4',
    '@shuji-bonji/houki-nta-mcp': '0.21.3',
    '@shuji-bonji/houki-abbreviations': '0.6.1',
  });
  assert.equal(r.checked, 3);
  assert.deepEqual(r.unmeasured, []);
  assert.deepEqual(r.drift, [
    { name: 'houki-nta-mcp', npm: '@shuji-bonji/houki-nta-mcp', stackVersion: '0.21.2', npmVersion: '0.21.3' },
  ]);
});

test('detectDrift: latest が null のものは unmeasured。drift には数えない', () => {
  const r = detectDrift(STACK, { '@shuji-bonji/houki-egov-mcp': '0.15.4', '@shuji-bonji/houki-abbreviations': '0.6.1' });
  assert.equal(r.checked, 2);
  assert.deepEqual(r.drift, []);
  assert.deepEqual(r.unmeasured, [{ name: 'houki-nta-mcp', npm: '@shuji-bonji/houki-nta-mcp' }]);
});

test('currentByServerFromLatest: npm の最新版を優先し、無ければ stack.json の published', () => {
  assert.deepEqual(currentByServerFromLatest(STACK, { '@shuji-bonji/houki-nta-mcp': '0.21.3' }), {
    'houki-egov': '0.15.4',
    'houki-nta': '0.21.3',
  });
});

test('fingerprintOf / fingerprintFromBody: 本文の印から前回のずれを読み戻せる', () => {
  const drift = [{ name: 'houki-nta-mcp', stackVersion: '0.21.2', npmVersion: '0.21.3' }];
  const fp = fingerprintOf(drift);
  assert.equal(fp, 'houki-nta-mcp@0.21.2->0.21.3');
  assert.equal(fingerprintOf([]), 'none');
  const body = buildIssueBody({ drift, staleRows: [], currentByServer: {}, checkedAt: '2026-10-01 07:17 JST' });
  assert.equal(fingerprintFromBody(body), fp);
  assert.equal(fingerprintFromBody('印の無い本文'), null);
});

test('decideAction: create / update / close / none', () => {
  const drift = [{ name: 'houki-nta-mcp', stackVersion: '0.21.2', npmVersion: '0.21.3' }];
  const sameBody = buildIssueBody({ drift, staleRows: [], currentByServer: {}, checkedAt: 'x' });

  assert.equal(decideAction({ drift, unmeasured: [], openIssue: null }).action, 'create');
  const same = decideAction({ drift, unmeasured: [], openIssue: { number: 9, body: sameBody } });
  assert.equal(same.action, 'update');
  assert.equal(same.changed, false);
  const changed = decideAction({
    drift: [{ name: 'houki-nta-mcp', stackVersion: '0.21.2', npmVersion: '0.22.0' }],
    unmeasured: [],
    openIssue: { number: 9, body: sameBody },
  });
  assert.equal(changed.action, 'update');
  assert.equal(changed.changed, true);
  assert.equal(decideAction({ drift: [], unmeasured: [], openIssue: { number: 9, body: sameBody } }).action, 'close');
  assert.equal(decideAction({ drift: [], unmeasured: [], openIssue: null }).action, 'none');
  // 判定不能のときは、ずれがあっても open の Issue があっても触らない
  assert.equal(decideAction({ drift, unmeasured: [{ name: 'houki-egov-mcp' }], openIssue: null }).action, 'none');
  assert.equal(decideAction({ drift: [], unmeasured: [{ name: 'houki-egov-mcp' }], openIssue: { number: 9, body: sameBody } }).action, 'none');
});

test('buildIssueBody: ずれの表、直し方のコマンド、古い例の一覧、印', () => {
  const body = buildIssueBody({
    drift: [{ name: 'houki-nta-mcp', npm: '@shuji-bonji/houki-nta-mcp', stackVersion: '0.21.2', npmVersion: '0.21.3' }],
    staleRows: [
      { server: 'houki-nta', file: 'scripts/reference-examples/houki-nta/ja/nta_search_qa.md', heading: '呼び出し例 — 「テレワーク」', measured: '0.10.4', current: '0.21.3', status: 'stale' },
      { server: 'houki-egov', file: 'scripts/reference-examples/houki-egov/ja/get_law.md', heading: '呼び出し例 — 「消費税法」', measured: '0.15.4', current: '0.15.4', status: 'current' },
    ],
    currentByServer: { 'houki-egov': '0.15.4', 'houki-nta': '0.21.3' },
    checkedAt: '2026-10-01 07:17 JST',
    runUrl: 'https://github.com/shuji-bonji/houki-hub/actions/runs/1',
  });
  assert.match(body, /\| houki-nta-mcp \| `@shuji-bonji\/houki-nta-mcp` \| 0\.21\.2 \| 0\.21\.3 \|/);
  assert.match(body, /node scripts\/generate-stack\.mjs --readme/);
  assert.match(body, /chore: stack\.json を npm の版に揃える（nta 0\.21\.3）/);
  assert.match(body, /\[実行ログ\]\(https:\/\/github\.com\/shuji-bonji\/houki-hub\/actions\/runs\/1\)/);
  assert.match(body, /例 2 件のうち 古い 1 \/ 現行 1/);
  assert.match(body, /<summary>一覧（1 件）<\/summary>/);
  assert.match(body, /\| houki-nta \| `houki-nta\/ja\/nta_search_qa\.md` \| 「テレワーク」 \| v0\.10\.4 \| v0\.21\.3 \| 古い \|/);
  assert.doesNotMatch(body, /get_law\.md/); // 現行の例は載せない
  assert.ok(body.trimEnd().endsWith('<!-- stack-drift: houki-nta-mcp@0.21.2->0.21.3 -->'));
});

test('fetchLatest: dist-tags.latest を返し、失敗は null', async () => {
  const ok = async () => ({ ok: true, json: async () => ({ 'dist-tags': { latest: '0.21.3' } }) });
  assert.equal(await fetchLatest('@shuji-bonji/houki-nta-mcp', ok), '0.21.3');
  const notFound = async () => ({ ok: false, status: 404 });
  assert.equal(await fetchLatest('@shuji-bonji/none', notFound), null);
  const down = async () => { throw new Error('ECONNRESET'); };
  assert.equal(await fetchLatest('@shuji-bonji/houki-nta-mcp', down), null);
});

test('githubClient.findOpenIssue: 題名が一致する open の Issue だけ。PR は除く', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init.method });
    return {
      ok: true,
      status: 200,
      json: async () => [
        { number: 3, title: 'stack.json の版が npm と違う', pull_request: {} },
        { number: 5, title: '別の題名' },
        { number: 8, title: 'stack.json の版が npm と違う', body: 'b' },
        { number: 7, title: 'stack.json の版が npm と違う', body: 'a' },
      ],
    };
  };
  const gh = githubClient({ token: 't', repository: 'shuji-bonji/houki-hub', fetchImpl });
  const found = await gh.findOpenIssue('stack.json の版が npm と違う', 'stack-drift');
  assert.equal(found.number, 7);
  assert.equal(calls[0].url, 'https://api.github.com/repos/shuji-bonji/houki-hub/issues?state=open&labels=stack-drift&per_page=100');
  assert.equal(calls[0].method, 'GET');
});
