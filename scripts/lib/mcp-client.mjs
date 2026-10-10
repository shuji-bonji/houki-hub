/**
 * mcp-client.mjs — MCP サーバーの起動方法と、stdio の JSON-RPC クライアント。
 *
 * generate-reference.mjs（tools/list からリファレンスを作る）と check-examples-contract.mjs
 * （呼び出し例を同じ引数で流して照合する、houki-hub#44）が同じ起動の仕組みを使うために分けた
 * （houki-hub#5 ②、2026-10-10）。
 *
 * 起動の仕方は環境変数 HOUKI_MCP_LAUNCH で切り替える。
 *
 * | 値 | 起動するもの | 使う場面 |
 * | --- | --- | --- |
 * | `local`（既定） | `mcp/<repo>/dist/index.js`（houki-hub の作業コピー。git 追跡外） | shuji の Mac。公開前のビルドを試す |
 * | `checkout` | `$HOUKI_SOURCE_DIR/<repo>/dist/index.js` | CI で各リポジトリを clone して build したとき |
 * | `npx` | `npx -y <npm>@<版>` | CI と、公開版で照合するとき。版は下の HOUKI_MCP_VERSIONS |
 *
 * 版（npx のとき）: HOUKI_MCP_VERSIONS="houki-egov=0.20.0,houki-nta=0.27.0" のように server ごとに渡す。
 * 渡さなかった server は `latest`。
 *
 * 依存なし（生の JSON-RPC over stdio。MCP SDK は import しない）。
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** MCP サーバーの一覧。キーは reference-examples と site の URL で使う短い名前 */
export const MCP_SERVERS = {
  'houki-egov': {
    npm: '@shuji-bonji/houki-egov-mcp',
    repo: 'houki-egov-mcp',
    dbEnv: 'HOUKI_EGOV_DB_PATH',
    filesEnv: 'HOUKI_EGOV_FILES_DIR',
    /** 既定の置き場所（例はこの形で書く） */
    defaultDb: '~/.cache/houki-egov-mcp/laws.db',
    defaultFiles: '~/.cache/houki-egov-mcp/files',
  },
  'houki-nta': {
    npm: '@shuji-bonji/houki-nta-mcp',
    repo: 'houki-nta-mcp',
    dbEnv: 'HOUKI_NTA_DB_PATH',
    filesEnv: 'HOUKI_NTA_FILES_DIR',
    defaultDb: '~/.cache/houki-nta-mcp/cache.db',
    defaultFiles: '~/.cache/houki-nta-mcp/files',
  },
};

/**
 * ローカル DB と保存先を、使い捨てのフォルダーに向ける環境変数（check-examples-contract.mjs の --db absent）。
 * 国税庁サイトから取った応答は DB に書き戻されるので、手元の DB に触らず、前の実行の書き戻しにも左右されないようにする。
 */
export function isolatedDbEnv(server, dir) {
  const s = MCP_SERVERS[server];
  return { [s.dbEnv]: join(dir, `${server}.db`), [s.filesEnv]: join(dir, `${server}-files`) };
}

/** isolatedDbEnv で向けた置き場所 → 既定の置き場所（例の書き方）。応答の文字列を比べる前に置き換える */
export function isolatedPathAliases(server, dir) {
  const s = MCP_SERVERS[server];
  return [
    [join(dir, `${server}-files`), s.defaultFiles],
    [join(dir, `${server}.db`), s.defaultDb],
  ];
}

export const LAUNCH_MODES = ['local', 'checkout', 'npx'];

/** `houki-egov=0.20.0,houki-nta=0.27.0` を { 'houki-egov': '0.20.0', ... } にする。空なら {} */
export function parseVersionList(text) {
  const out = {};
  for (const part of String(text ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const [server, version] = part.split('=').map((s) => s?.trim());
    if (!server || !version) throw new Error(`版の指定は <server>=<版> の形です: ${part}`);
    out[server] = version.replace(/^v/, '');
  }
  return out;
}

/** HOUKI_SOURCE_DIR（新しい名前）か HOUKI_SPECS_SOURCE（spec-pages.mjs の元の名前）。どちらも無ければ null */
export function sourceDirFromEnv(env = process.env) {
  const base = env.HOUKI_SOURCE_DIR || env.HOUKI_SPECS_SOURCE;
  return base ? resolve(base) : null;
}

/**
 * server の起動方法を決める。
 * @returns {{ server: string, mode: string, command: string, args: string[], env: Record<string,string>,
 *            version: string|null, entry: string|null, available: boolean, label: string }}
 *   available: false は「起動するものが無い」（local・checkout で dist が無い）。呼び出し側がスキップを決める
 */
export function launchConfig(server, env = process.env, { root = ROOT } = {}) {
  const s = MCP_SERVERS[server];
  if (!s) throw new Error(`unknown MCP server: ${server}（known: ${Object.keys(MCP_SERVERS).join(', ')}）`);
  const mode = env.HOUKI_MCP_LAUNCH || 'local';
  if (!LAUNCH_MODES.includes(mode)) throw new Error(`HOUKI_MCP_LAUNCH は ${LAUNCH_MODES.join(' / ')} のどれかです: ${mode}`);
  if (mode === 'npx') {
    const version = parseVersionList(env.HOUKI_MCP_VERSIONS)[server] ?? 'latest';
    const spec = `${s.npm}@${version}`;
    return { server, mode, command: 'npx', args: ['-y', spec], env: {}, version, entry: null, available: true, label: `npx -y ${spec}` };
  }
  let entry;
  if (mode === 'checkout') {
    const base = sourceDirFromEnv(env);
    if (!base) throw new Error('HOUKI_MCP_LAUNCH=checkout のときは HOUKI_SOURCE_DIR に clone の置き場所を渡してください');
    entry = join(base, s.repo, 'dist/index.js');
  } else {
    entry = join(root, 'mcp', s.repo, 'dist/index.js');
  }
  return { server, mode, command: 'node', args: [entry], env: {}, version: null, entry, available: existsSync(entry), label: `node ${entry}` };
}

/**
 * stdio の MCP クライアント。initialize → notifications/initialized を済ませてから使う。
 *
 *   const c = await McpStdioClient.start(cfg, { timeoutMs: 120_000 });
 *   const tools = await c.listTools();
 *   const res = await c.callTool('get_law', { law_name: '消費税法', article: '1' });
 *   c.close();
 *
 * 標準出力の JSON でない行（native module の警告など）は読み飛ばす。標準エラーは末尾 2000 文字だけ持つ（失敗の理由に添える）。
 */
export class McpStdioClient {
  constructor(proc, timeoutMs) {
    this.proc = proc;
    this.timeoutMs = timeoutMs;
    this.nextId = 1;
    this.pending = new Map();
    this.stderrTail = '';
    this.serverInfo = null;
    this.exited = null;
    let buf = '';
    proc.stdout.on('data', (d) => {
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
        if (msg.id != null && this.pending.has(msg.id)) {
          const { resolve: ok, timer } = this.pending.get(msg.id);
          clearTimeout(timer);
          this.pending.delete(msg.id);
          ok(msg);
        }
      }
    });
    proc.stderr.on('data', (d) => {
      this.stderrTail = (this.stderrTail + d).slice(-2000);
    });
    proc.on('exit', (code, signal) => {
      this.exited = { code, signal };
      for (const [, { reject: ng, timer }] of this.pending) {
        clearTimeout(timer);
        ng(this.#error(`server exited (code ${code}, signal ${signal})`));
      }
      this.pending.clear();
    });
  }

  /** 起動して initialize まで済ませる。timeoutMs は 1 回の要求ごとの待ち時間（npx の初回はダウンロードを含む） */
  static async start(cfg, { timeoutMs = 20_000, clientName = 'houki-hub' } = {}) {
    const proc = spawn(cfg.command, cfg.args, { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, ...cfg.env } });
    const client = new McpStdioClient(proc, timeoutMs);
    await new Promise((ok, ng) => {
      proc.once('spawn', ok);
      proc.once('error', ng);
    });
    try {
      const init = await client.request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: clientName, version: '0.0.1' },
      });
      if (init.error) throw client.#error(`initialize failed: ${JSON.stringify(init.error)}`);
      client.serverInfo = init.result.serverInfo;
      client.notify('notifications/initialized');
      return client;
    } catch (e) {
      // 起動に失敗したサーバーを残さない
      client.close();
      throw e;
    }
  }

  #error(message) {
    return new Error(`${message}${this.stderrTail ? `\n--- server stderr (tail) ---\n${this.stderrTail}` : ''}`);
  }

  notify(method, params) {
    this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, ...(params ? { params } : {}) })}\n`);
  }

  request(method, params) {
    if (this.exited) return Promise.reject(this.#error('server already exited'));
    const id = this.nextId++;
    return new Promise((ok, ng) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        ng(this.#error(`${method} timeout (${Math.round(this.timeoutMs / 1000)}s)`));
      }, this.timeoutMs);
      this.pending.set(id, { resolve: ok, reject: ng, timer });
      this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    });
  }

  async listTools() {
    const res = await this.request('tools/list', {});
    if (res.error) throw this.#error(`tools/list failed: ${JSON.stringify(res.error)}`);
    return res.result.tools;
  }

  /**
   * ツールを呼ぶ。応答の本体（content[0].text）を JSON として読めれば json に、読めなければ text に入れて返す。
   * @returns {Promise<{ isError: boolean, json: any, text: string|null, raw: any }>}
   */
  async callTool(name, args) {
    const res = await this.request('tools/call', { name, arguments: args ?? {} });
    if (res.error) return { isError: true, json: null, text: null, raw: res, rpcError: res.error };
    const text = res.result?.content?.find((c) => c.type === 'text')?.text ?? null;
    let json = null;
    if (text != null) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }
    return { isError: Boolean(res.result?.isError), json, text, raw: res.result };
  }

  close() {
    if (!this.exited) this.proc.kill();
  }
}
