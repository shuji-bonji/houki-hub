import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { classifySite, collectPageVersions, PAGE_DIRS, pageVersion, parseLatestArgs, renderSiteTable } from './check-site-versions.mjs';

const TOOL_PAGE = `---
title: "get_law — houki-egov-mcp のツール"
---

::: info
houki-egov-mcp **v0.20.0** の \`tools/list\` と \`specs/current/get_law/spec.md\` から自動生成しました（仕様 ID 30 件・2026-10-10）。手で編集しないでください。
:::
`;

test('pageVersion: 冒頭の「自動生成しました」の行の版を読む。無ければ null', () => {
  assert.equal(pageVersion(TOOL_PAGE), '0.20.0');
  assert.equal(pageVersion('**v0.7.0** の `dist/index.d.ts` から自動生成しました（関数 21 個・2026-10-10）。'), '0.7.0');
  assert.equal(pageVersion('# 人が書いたページ\n\n**v1.0.0** は太字なだけ'), null);
});

test('collectPageVersions: PAGE_DIRS のフォルダーの生成ページだけを読む', () => {
  const dir = mkdtempSync(join(tmpdir(), 'site-versions-'));
  try {
    mkdirSync(join(dir, 'reference/mcp/houki-egov'), { recursive: true });
    mkdirSync(join(dir, 'specs/houki-research'), { recursive: true });
    writeFileSync(join(dir, 'reference/mcp/houki-egov/get_law.md'), TOOL_PAGE);
    writeFileSync(join(dir, 'reference/mcp/houki-egov/notes.md'), '# 生成でないページ');
    writeFileSync(join(dir, 'specs/houki-research/index.md'), 'houki-research Skill **v0.20.0** の `SKILL.md` から自動生成しました（workflow 2 件・2026-10-10）。');
    const pages = collectPageVersions(dir);
    assert.deepEqual(
      pages.map((p) => `${p.repo} ${p.file} ${p.version}`),
      ['houki-egov-mcp reference/mcp/houki-egov/get_law.md 0.20.0', 'houki-research-skill specs/houki-research/index.md 0.20.0'],
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('classifySite: 一致・サイトが古い・サイトが新しい・判定不能', () => {
  const pages = [
    { repo: 'houki-egov-mcp', file: 'a', version: '0.20.0' },
    { repo: 'houki-nta-mcp', file: 'b', version: '0.27.0' },
    { repo: 'houki-nta-mcp', file: 'c', version: '0.26.0' },
    { repo: 'houki-abbreviations', file: 'd', version: '0.8.0' },
  ];
  const rows = classifySite(pages, { 'houki-egov-mcp': '0.20.0', 'houki-nta-mcp': '0.27.0', 'houki-abbreviations': '0.7.0' });
  const by = Object.fromEntries(rows.map((r) => [r.repo, r]));
  assert.equal(by['houki-egov-mcp'].status, 'match');
  assert.equal(by['houki-nta-mcp'].status, 'behind');
  assert.deepEqual(by['houki-nta-mcp'].behind, ['c']);
  assert.deepEqual(by['houki-nta-mcp'].versions, ['0.26.0', '0.27.0']);
  assert.equal(by['houki-abbreviations'].status, 'ahead');
  assert.equal(by['houki-research-skill'].status, 'unknown');
  assert.equal(rows.length, new Set(Object.values(PAGE_DIRS)).size);
  const table = renderSiteTable(rows);
  assert.match(table, /\| houki-nta-mcp \| v0\.26\.0・v0\.27\.0 \| 2 \| v0\.27\.0 \| サイトが古い（古いページ 1 枚） \|/);
  assert.match(table, /\| houki-research-skill \| （ページ無し） \| 0 \| （不明） \| 判定不能 \|/);
});

test('parseLatestArgs', () => {
  assert.deepEqual(parseLatestArgs(['houki-nta-mcp=v0.27.0', 'houki-egov-mcp=0.20.0']), { 'houki-nta-mcp': '0.27.0', 'houki-egov-mcp': '0.20.0' });
  assert.throws(() => parseLatestArgs(['houki-nta-mcp']), /--latest の形/);
});
