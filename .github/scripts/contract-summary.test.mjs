import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { loadContractResult, renderHeadline, renderSection } from './contract-summary.mjs';

const RESULT = {
  launched: { 'houki-nta': { label: 'npx -y @shuji-bonji/houki-nta-mcp@0.27.0', mode: 'npx', version: '0.27.0' } },
  db: 'absent',
  summary: { total: 3, match: 1, data: 1, shape: 1, unverified: 0, skipped: 0 },
  examples: [
    { server: 'houki-nta', tool: 'nta_get_tax_answer', heading: '呼び出し例 — No.6101', measured: '0.25.1', status: 'shape', findings: [{ path: 'taxAnswer.sections', category: 'shape', detail: '要素が足りない: 例 7 件 → 3 件' }] },
    { server: 'houki-nta', tool: 'nta_get_qa', heading: '呼び出し例 — 02/19', measured: '0.25.0', status: 'data', findings: [{ path: 'source', category: 'data', detail: '"db" → "live"' }] },
    { server: 'houki-nta', tool: 'resolve_abbreviation', heading: '呼び出し例 — 消基通', measured: '0.25.0', status: 'match', findings: [] },
  ],
};

test('renderHeadline: 形の違いがあれば警告の囲みに件数、無ければ 1 行', () => {
  const warn = renderHeadline(RESULT);
  assert.match(warn, /^> \[!WARNING\]/);
  assert.match(warn, /「形の違い」が \*\*1 件\*\*/);
  const ok = renderHeadline({ ...RESULT, summary: { ...RESULT.summary, shape: 0 } });
  assert.match(ok, /^呼び出し例の照合（DB の要らない例）: 形の違い \*\*0 件\*\*/);
  assert.match(renderHeadline(null), /流せませんでした/);
});

test('renderSection: 形の違いとデータ側の差分の例を先に表にし、全件を折りたたむ', () => {
  const md = renderSection(RESULT);
  assert.match(md, /^## 呼び出し例の照合/);
  assert.match(md, /- 起動: houki-nta v0\.27\.0（npx -y @shuji-bonji\/houki-nta-mcp@0\.27\.0）/);
  const [notable, all] = md.split('<details>');
  assert.match(notable, /No\.6101/);
  assert.match(notable, /02\/19/);
  assert.doesNotMatch(notable, /消基通/);
  assert.match(all, /<summary>全件（3 例）<\/summary>/);
  assert.match(all, /消基通/);
  assert.match(renderSection(null), /結果がありません/);
});

test('loadContractResult: 無い・壊れた・形の違う JSON は null', () => {
  const dir = mkdtempSync(join(tmpdir(), 'contract-summary-'));
  try {
    const good = join(dir, 'good.json');
    writeFileSync(good, JSON.stringify(RESULT));
    assert.equal(loadContractResult(good).summary.total, 3);
    const broken = join(dir, 'broken.json');
    writeFileSync(broken, '{');
    assert.equal(loadContractResult(broken), null);
    const other = join(dir, 'other.json');
    writeFileSync(other, '{"a":1}');
    assert.equal(loadContractResult(other), null);
    assert.equal(loadContractResult(join(dir, 'missing.json')), null);
    assert.equal(loadContractResult(undefined), null);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
