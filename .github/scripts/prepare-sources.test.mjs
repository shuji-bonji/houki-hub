import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decideVersion, latestSemverTag, mcpVersionsOf, newestRange, SOURCE_REPOS } from './prepare-sources.mjs';

const LS_REMOTE = `6cda66f9886fe62dc809bc655d1d93d573a82446\trefs/tags/v0.9.3
783da0f2ac9b5004822ede0464ce8891f26bd9cc\trefs/tags/v0.27.0
9816baa9a345f5b3a0e05906227dd4f363894862\trefs/tags/v0.10.0
1111111111111111111111111111111111111111\trefs/tags/v0.28.0-rc.1
2222222222222222222222222222222222222222\trefs/tags/nightly`;

test('latestSemverTag: semver の形のタグのうち一番大きいもの（文字列の順ではない）', () => {
  assert.equal(latestSemverTag(LS_REMOTE), 'v0.27.0');
  assert.equal(latestSemverTag(''), null);
});

test('decideVersion: npm の版で作る。タグと食い違えば注記する', () => {
  const nta = SOURCE_REPOS.find((e) => e.repo === 'houki-nta-mcp');
  assert.deepEqual(decideVersion(nta, { npmLatest: '0.27.0', latestTag: 'v0.27.0' }), {
    repo: 'houki-nta-mcp',
    version: '0.27.0',
    tag: 'v0.27.0',
    npmLatest: '0.27.0',
    latestTag: 'v0.27.0',
    note: null,
  });
  const ahead = decideVersion(nta, { npmLatest: '0.27.0', latestTag: 'v0.27.1' });
  assert.equal(ahead.version, '0.27.0');
  assert.match(ahead.note, /publish が終わっていない/);
  assert.match(decideVersion(nta, { npmLatest: '0.28.0', latestTag: 'v0.27.0' }).note, /タグを確かめる/);
  assert.equal(decideVersion(nta, { npmLatest: null, latestTag: 'v0.27.0' }).version, null);
});

test('decideVersion: npm に無い Skill は最新のタグ', () => {
  const skill = SOURCE_REPOS.find((e) => e.repo === 'houki-research-skill');
  const d = decideVersion(skill, { npmLatest: null, latestTag: 'v0.20.0' });
  assert.equal(d.version, '0.20.0');
  assert.equal(d.tag, 'v0.20.0');
  assert.equal(decideVersion(skill, { npmLatest: null, latestTag: null }).version, null);
});

test('mcpVersionsOf: HOUKI_MCP_VERSIONS の形にする（MCP だけ）', () => {
  const decided = [
    { repo: 'houki-egov-mcp', version: '0.20.0' },
    { repo: 'houki-nta-mcp', version: '0.27.0' },
    { repo: 'houki-abbreviations', version: '0.7.0' },
  ];
  assert.equal(mcpVersionsOf(decided), 'houki-egov=0.20.0,houki-nta=0.27.0');
  assert.equal(mcpVersionsOf([{ repo: 'houki-egov-mcp', version: null }]), '');
});

test('newestRange: 下限が一番新しい範囲', () => {
  assert.equal(newestRange(['^0.2.0', '^0.3.0', undefined, '^0.2.0']), '^0.3.0');
  assert.equal(newestRange([undefined]), null);
});
