import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  classifyExamples,
  compareVersions,
  currentVersionsFromStack,
  isMainModule,
  parseCurrentOverrides,
  parseExamples,
  renderTable,
  shortHeading,
  summarize,
} from './check-example-versions.mjs';

const SAMPLE = `::: tip 引数名は \`law_name\` です
説明
:::

::: details 呼び出し例 — 「消費税法 57 条の 2 第 1 項の本文を JSON で」
- 実測: v0.5.3（2026-09-08）
- ローカル DB: 不要

\`\`\`jsonc
{ "law_name": "消費税法" }
\`\`\`
:::

::: details 呼び出し例 — DB が古いとき（\`staleness: "outdated"\`）

- 実測: v0.10.2（2026-09-07）。同じ呼び出しを、最後の取り込みから 126 日たった DB に対して行ったときの応答です
:::

::: details 呼び出し例 — 実測の行が無い例
- ローカル DB: あり
実測では民法の docx が 182 KB でした。
:::
`;

test('parseExamples: ::: details ごとに 1 例、直後の「実測: vX（日付）」を拾う', () => {
  const ex = parseExamples(SAMPLE);
  assert.equal(ex.length, 3);
  assert.deepEqual(ex[0], {
    heading: '呼び出し例 — 「消費税法 57 条の 2 第 1 項の本文を JSON で」',
    line: 5,
    measured: '0.5.3',
    measuredAt: '2026-09-08',
  });
  // 空行を挟んでも、日付の後ろに文が続いても拾う
  assert.equal(ex[1].measured, '0.10.2');
  assert.equal(ex[1].measuredAt, '2026-09-07');
  // 本文中の「実測では…」は実測の行ではない。行が無い例は null
  assert.equal(ex[2].measured, null);
  assert.equal(ex[2].measuredAt, null);
});

test('parseExamples: ::: tip など details 以外のブロックは例に数えない', () => {
  assert.equal(parseExamples('::: tip 注意\n- 実測: v1.0.0（2026-01-01）\n:::\n').length, 0);
});

test('compareVersions: 数値で比べる（0.9.0 < 0.10.0）', () => {
  assert.ok(compareVersions('0.9.0', '0.10.0') < 0);
  assert.ok(compareVersions('0.21.3', '0.21.2') > 0);
  assert.equal(compareVersions('0.15.4', '0.15.4'), 0);
});

test('classifyExamples: stale / current / ahead / unknown', () => {
  const rows = classifyExamples(
    [
      { server: 'houki-nta', measured: '0.10.4' },
      { server: 'houki-nta', measured: '0.21.2' },
      { server: 'houki-nta', measured: '0.21.3' },
      { server: 'houki-nta', measured: null },
      { server: 'houki-mhlw', measured: '0.1.0' },
    ],
    { 'houki-nta': '0.21.2' },
  );
  assert.deepEqual(rows.map((r) => r.status), ['stale', 'current', 'ahead', 'unknown', 'unknown']);
  assert.equal(rows[0].current, '0.21.2');
  assert.equal(rows[4].current, null);
  assert.deepEqual(summarize(rows), { total: 5, stale: 1, current: 1, ahead: 1, unknown: 2 });
});

test('currentVersionsFromStack: published を server 名で引く。未公開は null', () => {
  const stack = {
    repos: [
      { name: 'houki-egov-mcp', published: '0.15.4' },
      { name: 'houki-nta-mcp', published: null },
    ],
  };
  assert.deepEqual(currentVersionsFromStack(stack), { 'houki-egov': '0.15.4', 'houki-nta': null });
});

test('parseCurrentOverrides: <server>=<version>、先頭の v は落とす', () => {
  assert.deepEqual(parseCurrentOverrides(['houki-nta=v0.21.3', 'houki-egov=0.15.4']), {
    'houki-nta': '0.21.3',
    'houki-egov': '0.15.4',
  });
  assert.throws(() => parseCurrentOverrides(['houki-nta']));
});

test('renderTable: 見出しの「呼び出し例 — 」を落とし、ファイルは reference-examples からの相対', () => {
  assert.equal(shortHeading('呼び出し例 — 「テレワーク」'), '「テレワーク」');
  const table = renderTable([
    {
      server: 'houki-nta',
      file: 'scripts/reference-examples/houki-nta/ja/nta_search_qa.md',
      heading: '呼び出し例 — 「テレワーク」',
      measured: '0.10.4',
      current: '0.21.2',
      status: 'stale',
    },
  ]);
  const lines = table.split('\n');
  assert.equal(lines.length, 3);
  assert.equal(lines[2], '| houki-nta | `houki-nta/ja/nta_search_qa.md` | 「テレワーク」 | v0.10.4 | v0.21.2 | 古い |');
});

test('isMainModule: シンボリックリンクを通して起動しても、実体が同じなら true', () => {
  const self = fileURLToPath(new URL('./check-example-versions.mjs', import.meta.url));
  const url = pathToFileURL(self).href;
  const dir = mkdtempSync(join(tmpdir(), 'check-example-versions-'));
  try {
    const link = join(dir, 'linked.mjs');
    symlinkSync(self, link);
    // macOS の /tmp と同じ形: argv[1] はリンクのパス、import.meta.url は実体のパス
    assert.equal(isMainModule(link, url), true);
    assert.equal(isMainModule(self, url), true);
    // 別のファイル・無いファイル・argv[1] が無いときは false
    assert.equal(isMainModule(fileURLToPath(import.meta.url), url), false);
    assert.equal(isMainModule(join(dir, 'missing.mjs'), url), false);
    assert.equal(isMainModule(undefined, url), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
