import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isolatedDbEnv, isolatedPathAliases, launchConfig, McpStdioClient, parseVersionList, sourceDirFromEnv } from './lib/mcp-client.mjs';

test('parseVersionList', () => {
  assert.deepEqual(parseVersionList('houki-egov=0.20.0, houki-nta=v0.27.0'), { 'houki-egov': '0.20.0', 'houki-nta': '0.27.0' });
  assert.deepEqual(parseVersionList(''), {});
  assert.deepEqual(parseVersionList(undefined), {});
  assert.throws(() => parseVersionList('houki-egov'), /<server>=<版>/);
});

test('launchConfig: 既定は作業コピーの dist（無ければ available: false）', () => {
  const c = launchConfig('houki-nta', {}, { root: '/nonexistent' });
  assert.equal(c.mode, 'local');
  assert.equal(c.command, 'node');
  assert.deepEqual(c.args, ['/nonexistent/mcp/houki-nta-mcp/dist/index.js']);
  assert.equal(c.available, false);
});

test('launchConfig: npx は版を HOUKI_MCP_VERSIONS から、無ければ latest', () => {
  const env = { HOUKI_MCP_LAUNCH: 'npx', HOUKI_MCP_VERSIONS: 'houki-nta=0.27.0' };
  assert.deepEqual(launchConfig('houki-nta', env).args, ['-y', '@shuji-bonji/houki-nta-mcp@0.27.0']);
  assert.deepEqual(launchConfig('houki-egov', env).args, ['-y', '@shuji-bonji/houki-egov-mcp@latest']);
  assert.equal(launchConfig('houki-egov', env).available, true);
});

test('launchConfig: checkout は HOUKI_SOURCE_DIR（元の名前 HOUKI_SPECS_SOURCE）の clone の dist', () => {
  const c = launchConfig('houki-egov', { HOUKI_MCP_LAUNCH: 'checkout', HOUKI_SPECS_SOURCE: '/src' });
  assert.deepEqual(c.args, ['/src/houki-egov-mcp/dist/index.js']);
  assert.throws(() => launchConfig('houki-egov', { HOUKI_MCP_LAUNCH: 'checkout' }), /HOUKI_SOURCE_DIR/);
  assert.equal(sourceDirFromEnv({ HOUKI_SOURCE_DIR: '/a', HOUKI_SPECS_SOURCE: '/b' }), '/a');
  assert.equal(sourceDirFromEnv({}), null);
});

test('launchConfig: 知らない server・知らない起動の仕方は例外', () => {
  assert.throws(() => launchConfig('houki-xxx', {}), /unknown MCP server/);
  assert.throws(() => launchConfig('houki-nta', { HOUKI_MCP_LAUNCH: 'docker' }), /HOUKI_MCP_LAUNCH/);
});

test('isolatedDbEnv: DB と保存先を渡したフォルダーに向ける', () => {
  assert.deepEqual(isolatedDbEnv('houki-nta', '/tmp/x'), { HOUKI_NTA_DB_PATH: '/tmp/x/houki-nta.db', HOUKI_NTA_FILES_DIR: '/tmp/x/houki-nta-files' });
  assert.deepEqual(isolatedPathAliases('houki-nta', '/tmp/x'), [
    ['/tmp/x/houki-nta-files', '~/.cache/houki-nta-mcp/files'],
    ['/tmp/x/houki-nta.db', '~/.cache/houki-nta-mcp/cache.db'],
  ]);
});

/** MCP のふりをする小さなサーバー（node -e）。initialize・tools/list・tools/call に答える */
const FAKE_SERVER = `
process.stdout.write('not json line\\n');
let buf = '';
process.stdin.on('data', (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf('\\n')) >= 0) {
    const m = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1);
    const reply = (result) => process.stdout.write(\`\${JSON.stringify({ jsonrpc: '2.0', id: m.id, result })}\\n\`);
    if (m.method === 'initialize') reply({ serverInfo: { name: 'fake', version: '1.2.3' } });
    else if (m.method === 'tools/list') reply({ tools: [{ name: 'echo' }] });
    else if (m.method === 'tools/call' && m.params.name === 'echo') reply({ content: [{ type: 'text', text: JSON.stringify(m.params.arguments) }] });
    else if (m.method === 'tools/call') reply({ isError: true, content: [{ type: 'text', text: 'plain error' }] });
  }
});`;

test('McpStdioClient: initialize → tools/list → tools/call（JSON の本体と、JSON でない本体）', async () => {
  const client = await McpStdioClient.start({ command: process.execPath, args: ['-e', FAKE_SERVER], env: {} }, { timeoutMs: 5000 });
  try {
    assert.deepEqual(client.serverInfo, { name: 'fake', version: '1.2.3' });
    assert.deepEqual(await client.listTools(), [{ name: 'echo' }]);
    const ok = await client.callTool('echo', { a: 1 });
    assert.equal(ok.isError, false);
    assert.deepEqual(ok.json, { a: 1 });
    const ng = await client.callTool('nope', {});
    assert.equal(ng.isError, true);
    assert.equal(ng.json, null);
    assert.equal(ng.text, 'plain error');
  } finally {
    client.close();
  }
});

test('McpStdioClient: 答えないサーバーは timeout の例外', async () => {
  await assert.rejects(
    McpStdioClient.start({ command: process.execPath, args: ['-e', 'setInterval(() => {}, 1000)'], env: {} }, { timeoutMs: 300 }),
    /initialize timeout/,
  );
});
