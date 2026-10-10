/**
 * example-contract.mjs — 呼び出し例を「部分一致のパターン」として読み、実際の応答と比べる（houki-hub#44）。
 *
 * scripts/check-examples-contract.mjs（CLI）から使う。比べ方の規則はここに 1 か所だけ置き、family で共通にする。
 * 規則の説明と、どう決めたかは docs/notes/2026-10-10-design-hub5-regen-and-examples-check.md の 7 章。
 *
 * 判定（例ごと）:
 *   match       一致。例が述べている形と値が今も成り立つ
 *   data        データ側の差分。本文の文字列・件数・日付など、国税庁・e-Gov の更新で変わる値だけが違う
 *   shape       形の違い。キーが無い・型が違う・配列が短い・エラーかどうかが違う・短い値（code・source など）が違う
 *   unverified  未確認。この環境では流せない（DB が要る）か、呼び出しに失敗した、例が読めない
 *   skipped     照合しない。例に「- 照合: しない」か「- 版の照合: しない」の行がある
 *
 * 依存なし（Node 22+）。関数は check-examples-contract.test.mjs で検査する。
 */

/* ========================= 例の読み取り ========================= */

const DETAILS_RE = /^:::\s*details\s+(.*)$/;
const MEASURED_RE = /^-\s*実測:\s*v?(\d+\.\d+\.\d+)/;
const LOCAL_DB_RE = /^-\s*ローカル DB:\s*(.*)$/;
const VERSION_EXCLUDED_RE = /^-\s*版の照合:\s*しない(?:\s*[（(]([^）)]*)[）)])?/;
const CHECK_RE = /^-\s*照合:\s*(.*)$/;
const FENCE_RE = /^```(\w*)\s*$/;

/**
 * 1 ファイルの本文から、照合に使う例を取り出す。
 * - 引数: `**引数**` の後の最初のコードブロック
 * - 期待する応答: `**返る JSON` で始まる行の後の最初のコードブロック（jsonc）。行に `isError: true` があればエラーの応答を期待する
 * - `**\`markdown\` の中身` の後のコードブロック（text）は、応答の `markdown` の行として比べる
 * 1 つの例に「返る JSON」が 2 つ以上あるときは最初のものだけを使い、notes に残す。
 */
export function parseContractExamples(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let cur = null;
  let want = null; // 次のコードブロックを何として読むか: 'args' | 'json' | 'markdown'
  let fence = null; // { kind, lang, start, body: [] }
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (fence) {
      if (/^```\s*$/.test(line)) {
        const body = fence.body.join('\n');
        if (fence.kind === 'args' && cur.argsText == null) cur.argsText = body;
        else if (fence.kind === 'json') cur.expectedText = body;
        else if (fence.kind === 'json-extra') cur.notes.push(`「返る JSON」が 2 つ以上ある（${fence.start} 行目）。最初のものだけを比べた`); else if (fence.kind === 'markdown' && cur.markdownText == null) cur.markdownText = body;
        fence = null;
      } else {
        fence.body.push(line);
      }
      continue;
    }
    const d = line.match(DETAILS_RE);
    if (d) {
      cur = {
        heading: d[1].trim(),
        line: i + 1,
        measured: null,
        localDb: null,
        versionExcluded: false,
        versionExcludedReason: null,
        checkLines: [],
        argsText: null,
        expectedText: null,
        expectIsError: false,
        expectedPath: null,
        excerpt: false,
        markdownText: null,
        notes: [],
      };
      out.push(cur);
      want = null;
      continue;
    }
    if (!cur) continue;
    if (line.trim() === ':::') {
      cur = null;
      continue;
    }
    let m;
    if (cur.measured === null && (m = line.match(MEASURED_RE))) cur.measured = m[1];
    else if (cur.localDb === null && (m = line.match(LOCAL_DB_RE))) cur.localDb = m[1].trim();
    else if ((m = line.match(VERSION_EXCLUDED_RE))) {
      cur.versionExcluded = true;
      cur.versionExcludedReason = m[1] ?? null;
    } else if ((m = line.match(CHECK_RE))) cur.checkLines.push(m[1].trim());
    else if (/^\*\*引数\*\*/.test(line)) want = 'args';
    else if (/^\*\*返る JSON/.test(line)) {
      // 2 つ目以降の「返る JSON」は読まない（別の呼び出しの応答のことがある）
      want = cur.expectedText == null ? 'json' : 'json-extra';
      if (want === 'json') {
        if (/isError:\s*true/.test(line)) cur.expectIsError = true;
        // 「**返る JSON の `taxAnswer.sections`（…）**」は応答のその位置と比べる
        const sub = line.match(/^\*\*返る JSON の `([^`]+)`/);
        if (sub) cur.expectedPath = sub[1];
        if (/抜粋|省略|省い/.test(line)) cur.excerpt = true;
      }
    } else if (/^\*\*`markdown` の中身/.test(line)) want = 'markdown';
    else if ((m = line.match(FENCE_RE))) {
      fence = { kind: want, lang: m[1], start: i + 1, body: [] };
      want = null;
    }
  }
  return out;
}

/**
 * 例の本文から `- 照合:` の行を落とす（`- 版の照合:`・`- ローカル DB:` は残す）。
 * generate-reference.mjs がツールのページに例を写すときに使う（Q37'、2026-10-10）。
 */
export function stripContractLines(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => !CHECK_RE.test(line))
    .join('\n');
}

/* ========================= jsonc をパターンとして読む ========================= */

/** どんな値でもよい（例の `…` / `...` の値） */
export const ANY = Object.freeze({ toString: () => '…' });
/** 配列: 途中で切ってある（要素が先頭から同じ順で並べばよい） */
export const TRUNCATED = Symbol('truncated');
/** オブジェクト: キーを省いてある（例に無いキーを「増えた」と数えない） */
export const OMITTED = Symbol('omitted');

const ELLIPSIS = /^(?:…+|\.\.\.)$/;

/**
 * 呼び出し例の jsonc を読む。JSON に加えて次を受け付ける。
 * - `// …` と `/* … *\/` のコメント。配列の中にあれば、その配列を「途中で切ってある」とする。
 *   オブジェクトの中にあれば「キーを省いてある」とする（`// retrieved_at は省略`、`"score": 0.25 /* … *\/`）
 * - 値・要素の位置に裸の `…` / `...`（どんな値でもよい。配列の要素なら、その配列を途中で切ってあるとする）
 * - 配列の要素の `"…"`（「…」だけの文字列）。その配列を途中で切ってあるとする
 * - 末尾のカンマ
 * 文字列の中の `…` は、ここではそのまま残す（比べるときに「省略」として読む）。
 */
export function parseJsoncPattern(text) {
  let i = 0;
  const s = text;
  const fail = (msg) => {
    const before = s.slice(0, i);
    const line = before.split('\n').length;
    throw new Error(`jsonc を読めない（${line} 行目付近）: ${msg}`);
  };
  /** 空白とコメントを飛ばす。コメントがあれば true */
  const skip = () => {
    let sawComment = false;
    for (;;) {
      while (i < s.length && /\s/.test(s[i])) i += 1;
      if (s.startsWith('//', i)) {
        const e = s.indexOf('\n', i);
        i = e < 0 ? s.length : e + 1;
        sawComment = true;
      } else if (s.startsWith('/*', i)) {
        const e = s.indexOf('*/', i + 2);
        if (e < 0) fail('コメントが閉じていない');
        i = e + 2;
        sawComment = true;
      } else return sawComment;
    }
  };
  const readString = () => {
    let j = i + 1;
    let raw = '';
    while (j < s.length && s[j] !== '"') {
      if (s[j] === '\\') {
        raw += s.slice(j, j + 2);
        j += 2;
      } else {
        raw += s[j];
        j += 1;
      }
    }
    if (j >= s.length) fail('文字列が閉じていない');
    i = j + 1;
    return JSON.parse(`"${raw.replace(/\n/g, '\\n')}"`);
  };
  const readValue = () => {
    skip();
    const c = s[i];
    if (c === '{') return readObject();
    if (c === '[') return readArray();
    if (c === '"') return readString();
    const m = s.slice(i).match(/^(?:-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|…+|\.\.\.)/);
    if (!m) fail(`値を読めない: ${JSON.stringify(s.slice(i, i + 20))}`);
    i += m[0].length;
    if (ELLIPSIS.test(m[0])) return ANY;
    return JSON.parse(m[0]);
  };
  const readObject = () => {
    i += 1;
    const obj = {};
    for (;;) {
      if (skip()) obj[OMITTED] = true;
      if (s[i] === '}') {
        i += 1;
        return obj;
      }
      if (ELLIPSIS.test(s.slice(i).match(/^(?:…+|\.\.\.)/)?.[0] ?? '')) {
        // { … } や { "a": 1, … }: キーを省いてある
        i += s.slice(i).match(/^(?:…+|\.\.\.)/)[0].length;
        obj[OMITTED] = true;
      } else {
        if (s[i] !== '"') fail('キーが無い');
        const key = readString();
        if (skip()) obj[OMITTED] = true;
        if (s[i] !== ':') fail(`「:」が無い（キー ${key}）`);
        i += 1;
        const value = readValue();
        // "…": "…" はキーを省いた印（get_attachment の meta）
        if (ELLIPSIS.test(key)) obj[OMITTED] = true;
        else obj[key] = value;
      }
      if (skip()) obj[OMITTED] = true;
      if (s[i] === ',') i += 1;
      else if (s[i] !== '}') fail('「,」か「}」が無い');
    }
  };
  const readArray = () => {
    i += 1;
    const arr = [];
    for (;;) {
      if (skip()) arr[TRUNCATED] = true;
      if (s[i] === ']') {
        i += 1;
        return arr;
      }
      const v = readValue();
      // 裸の … と、"…" だけの文字列の要素は「ここの要素を省いた」印（nta_get_tax_answer の paragraphs: ["…", "1 事業者免税点制度", "…"]）
      if (v === ANY || (typeof v === 'string' && ELLIPSIS.test(v))) arr[TRUNCATED] = true;
      else arr.push(v);
      if (skip()) arr[TRUNCATED] = true;
      if (s[i] === ',') i += 1;
      else if (s[i] !== ']') fail('「,」か「]」が無い');
    }
  };
  const v = readValue();
  skip();
  if (i < s.length) fail('値の後ろに余計な文字がある');
  return v;
}

/* ========================= 文字列の「…」 ========================= */

/**
 * 例の文字列の `…` を「ここは省いた」として読み、実際の文字列と比べる。
 * `…` で区切った断片が、先頭（`…` で始まらなければ前方一致）から順に現れ、
 * 最後の断片が末尾（`…` で終わらなければ後方一致）に来れば一致とする。
 * 「…」を含まない文字列は完全一致。
 */
export function globMatch(pattern, actual) {
  if (typeof pattern !== 'string' || typeof actual !== 'string') return false;
  if (!pattern.includes('…')) return pattern === actual;
  const parts = pattern.split(/…+/);
  let pos = 0;
  for (let k = 0; k < parts.length; k += 1) {
    const part = parts[k];
    if (k === 0) {
      if (!actual.startsWith(part)) return false;
      pos = part.length;
      continue;
    }
    if (k === parts.length - 1) {
      if (part === '') return true;
      return actual.length - part.length >= pos && actual.endsWith(part);
    }
    const at = actual.indexOf(part, pos);
    if (at < 0) return false;
    pos = at + part.length;
  }
  return true;
}

/* ========================= 毎回変わる値（family で共通） ========================= */

/**
 * 毎回変わる値のパスの一覧（houki-hub#44 の「比べ方の規則」の 2 つ目の表）。
 * path: `**` は任意の深さ、`[]` は配列の全要素、`*` は任意のキー。
 * kind:
 *   present    値があることだけ（呼び出しのたびに変わる）
 *   datetime   日時の形（YYYY-MM-DDTHH:MM…）であること（取り込みのたびに変わる）
 *   home-path  `~` か `/` で始まる文字列であること（環境で変わる）
 *   tolerance  数値が ±tolerance に入ること（本文の長さで少し動く）
 *   data       違っても形の違いにせず、データ側の差分にする（国税庁・e-Gov の更新で変わる）
 *   rest-data  配列の 2 件目以降の値の違いをデータ側の差分にする（順は 1 件目だけ固定）
 */
export const VOLATILE_RULES = [
  { path: '**.retrieved_at', kind: 'present', why: '呼び出しのたびに変わる' },
  { path: '**.fetchedAt', kind: 'datetime', why: '取り込みのたびに変わる' },
  { path: 'freshness.oldest_fetched_at', kind: 'datetime', why: '取り込みのたびに変わる' },
  { path: 'freshness.newest_fetched_at', kind: 'datetime', why: '取り込みのたびに変わる' },
  { path: 'freshness.days_since_oldest', kind: 'present', why: '取り込みのたびに変わる' },
  { path: 'freshness.last_sync_date', kind: 'present', why: '取り込みのたびに変わる' },
  { path: 'freshness.days_since_sync', kind: 'present', why: '取り込みのたびに変わる' },
  { path: 'freshness.last_full_dl_at', kind: 'present', why: '取り込みのたびに変わる' },
  { path: '**.db_path', kind: 'home-path', why: '環境で変わる' },
  { path: '**.saved.path', kind: 'home-path', why: '環境で変わる' },
  { path: '**.saved[].path', kind: 'home-path', why: '環境で変わる' },
  { path: '**.file_path', kind: 'home-path', why: '環境で変わる' },
  { path: '**.score', kind: 'tolerance', tolerance: 0.01, why: '本文の長さで少し動く' },
  { path: '**.effectiveDate', kind: 'data', why: '国税庁のページの更新で変わる' },
  { path: '**.basisDate', kind: 'data', why: '国税庁のページの更新で変わる' },
  { path: '**.bytes', kind: 'data', why: '国税庁・e-Gov のファイルの更新で変わる' },
  { path: '**.updated', kind: 'data', why: 'e-Gov のファイルの更新で変わる' },
  { path: 'results', kind: 'rest-data', why: '2 件目以降は score がほぼ同じで、取り込み直すと順が入れ替わる' },
  { path: 'hits', kind: 'rest-data', why: '2 件目以降は score がほぼ同じで、取り込み直すと順が入れ替わる' },
];

/** パス（['freshness', 'db_path'] や ['results', 0, 'score']）がパターンに合うか */
export function pathMatches(pattern, path) {
  const pat = pattern
    .replace(/\[\]/g, '.[]')
    .split('.')
    .filter((x) => x !== '');
  const segs = path.map((p) => (typeof p === 'number' ? '[]' : p));
  const rec = (pi, si) => {
    if (pi === pat.length) return si === segs.length;
    const p = pat[pi];
    if (p === '**') {
      for (let k = si; k <= segs.length; k += 1) if (rec(pi + 1, k)) return true;
      return false;
    }
    if (si >= segs.length) return false;
    if (p === '*' ? segs[si] !== '[]' : p === segs[si]) return rec(pi + 1, si + 1);
    return false;
  };
  return rec(0, 0);
}

/** 表示用のパス（results[1].score） */
export function formatPath(path) {
  let out = '';
  for (const p of path) out += typeof p === 'number' ? `[${p}]` : out ? `.${p}` : p;
  return out || '（応答の全体）';
}

/* ========================= 例ごとの例外（「- 照合:」の行） ========================= */

/**
 * 「- 照合:」の行を読む。書ける形（文は「。」で区切って複数並べてよい）:
 *   しない（理由）                  この例は照合しない
 *   `<パス>` は見ない               値も有無も比べない
 *   `<パス>` は ±0.01               数値の幅
 *   `<パス>` は 1 件目だけ          配列の 1 件目だけ比べる（2 件目以降は比べない）
 *   `<パス>` はデータ               違ってもデータ側の差分にする
 * パスはバッククォートで囲む。`a`・`b` のように複数並べてよい。文の末尾の（…）は理由として読む。読めない文は unknown に入れて報告する。
 * @returns {{ skip: boolean, skipReason: string|null, rules: object[], unknown: string[] }}
 */
export function parseCheckLines(checkLines) {
  const out = { skip: false, skipReason: null, rules: [], unknown: [] };
  for (const raw of checkLines) {
    for (const clause of raw.split('。').map((c) => c.trim()).filter(Boolean)) {
      const skip = clause.match(/^しない(?:\s*[（(]([^）)]*)[）)])?$/);
      if (skip) {
        out.skip = true;
        out.skipReason = skip[1] ?? null;
        continue;
      }
      // 末尾の（…）は理由として読む
      const reason = clause.match(/[（(]([^）)]*)[）)]$/)?.[1] ?? null;
      const body = reason ? clause.replace(/[（(][^）)]*[）)]$/, '') : clause;
      const paths = [...body.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      const verb = body.replace(/`[^`]+`/g, '').replace(/[・、\s]/g, '');
      let rule = null;
      let m;
      if (paths.length && verb === 'は見ない') rule = { kind: 'ignore' };
      else if (paths.length && (m = verb.match(/^は±(\d+(?:\.\d+)?)$/))) rule = { kind: 'tolerance', tolerance: Number(m[1]) };
      else if (paths.length && /^は1件目だけ$/.test(verb)) rule = { kind: 'first-only' };
      else if (paths.length && verb === 'はデータ') rule = { kind: 'data' };
      if (!rule) {
        out.unknown.push(clause);
        continue;
      }
      for (const path of paths) out.rules.push({ path, ...rule, why: reason ?? '例の「- 照合:」の行' });
    }
  }
  return out;
}

/* ========================= 比べる ========================= */

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
/** これより長い文字列（または改行を含む文字列）の違いは、本文の違いとしてデータ側の差分にする */
export const LONG_STRING = 40;

const show = (v) => {
  if (v === ANY) return '…';
  const t = JSON.stringify(v);
  return t && t.length > 60 ? `${t.slice(0, 57)}…` : t;
};

/**
 * 例のパターンと実際の応答を比べ、違いを並べる。
 * @param {any} expected parseJsoncPattern の戻り値
 * @param {any} actual 応答の JSON
 * @param {object[]} rules VOLATILE_RULES と例ごとの規則（例ごとの規則が先に当たる）
 * @returns {{ path: string, category: 'shape'|'data'|'extra', detail: string }[]}
 */
export function comparePattern(expected, actual, rules = VOLATILE_RULES, { reportExtra = true } = {}) {
  const findings = [];
  const add = (path, category, detail) => findings.push({ path: formatPath(path), category, detail });
  const ruleFor = (path) => rules.find((r) => pathMatches(r.path, path)) ?? null;

  const walk = (exp, act, path, asData) => {
    const rule = ruleFor(path);
    if (rule) {
      if (rule.kind === 'ignore') return;
      if (rule.kind === 'present') {
        if (act === undefined) add(path, 'shape', 'キーが無い');
        return;
      }
      if (rule.kind === 'datetime') {
        if (act === undefined) add(path, 'shape', 'キーが無い');
        else if (exp !== null && !(typeof act === 'string' && DATETIME_RE.test(act))) add(path, 'shape', `日時の形でない: ${show(act)}`);
        return;
      }
      if (rule.kind === 'home-path') {
        if (act === undefined) add(path, 'shape', 'キーが無い');
        else if (exp !== null && !(typeof act === 'string' && /^[~/]/.test(act))) add(path, 'shape', `パスの形でない: ${show(act)}`);
        return;
      }
      if (rule.kind === 'tolerance' && typeof exp === 'number' && typeof act === 'number') {
        if (Math.abs(exp - act) > rule.tolerance + 1e-12) add(path, 'data', `${exp} → ${act}（幅 ±${rule.tolerance} の外）`);
        return;
      }
      if (rule.kind === 'data') asData = true;
    }
    if (exp === ANY) return;
    if (act === undefined) {
      add(path, 'shape', 'キーが無い');
      return;
    }
    const te = typeOf(exp);
    const ta = typeOf(act);
    if (te !== ta) {
      add(path, asData ? 'data' : 'shape', `型が違う: ${te} → ${ta}（${show(act)}）`);
      return;
    }
    if (te === 'object') {
      for (const key of Object.keys(exp)) walk(exp[key], act[key], [...path, key], asData);
      if (reportExtra && !exp[OMITTED]) {
        const extra = Object.keys(act).filter((k) => !(k in exp));
        if (extra.length) add(path, 'extra', `例に無いキー: ${extra.join(', ')}`);
      }
      return;
    }
    if (te === 'array') {
      const firstOnly = rule?.kind === 'first-only';
      const restData = rule?.kind === 'rest-data';
      const n = firstOnly ? Math.min(1, exp.length) : exp.length;
      if (act.length < n) {
        add(path, asData ? 'data' : 'shape', `要素が足りない: 例 ${exp.length} 件 → ${act.length} 件`);
      } else if (!firstOnly && !exp[TRUNCATED] && act.length !== exp.length) {
        add(path, 'data', `要素の数が違う: 例 ${exp.length} 件 → ${act.length} 件`);
      }
      if (exp[TRUNCATED] && !firstOnly) {
        // 途中で切った配列: 例の要素が、応答の中に同じ順で現れればよい（間を飛ばしてよい。get_law_range の 1044 → 1046）
        let pos = 0;
        for (let k = 0; k < exp.length; k += 1) {
          let hit = -1;
          for (let j = pos; j < act.length; j += 1) {
            const sub = comparePattern(exp[k], act[j], rules, { reportExtra: false });
            if (!sub.some((f) => f.category !== 'extra')) {
              hit = j;
              break;
            }
          }
          if (hit >= 0) {
            walk(exp[k], act[hit], [...path, hit], asData || (restData && k > 0));
            pos = hit + 1;
          } else if (pos < act.length) {
            // 一致する要素が無い: 位置の合う要素と比べて、違いを出す
            walk(exp[k], act[pos], [...path, pos], asData || (restData && k > 0));
            pos += 1;
          } else {
            add([...path, k], asData ? 'data' : 'shape', '例の要素に当たる要素が応答に無い');
          }
        }
        return;
      }
      for (let k = 0; k < Math.min(n, act.length); k += 1) walk(exp[k], act[k], [...path, k], asData || (restData && k > 0));
      return;
    }
    if (te === 'string') {
      if (globMatch(exp, act)) return;
      const long = exp.includes('…') || exp.length > LONG_STRING || act.length > LONG_STRING || /\n/.test(exp) || /\n/.test(act);
      add(path, asData || long ? 'data' : 'shape', `${show(exp)} → ${show(act)}`);
      return;
    }
    if (te === 'number') {
      if (exp !== act) add(path, 'data', `${exp} → ${act}`);
      return;
    }
    if (exp !== act) add(path, asData ? 'data' : 'shape', `${show(exp)} → ${show(act)}`);
  };
  walk(expected, actual, [], false);
  return findings;
}

/**
 * `markdown` の中身の例（text）を、応答の markdown と行ごとに比べる。
 * 例の各行（空行は除く）が、応答の行に先頭から順に現れればよい。`…` を含む行は globMatch で比べる。
 * 「取得日時:」の行は呼び出しのたびに変わるので比べない。
 */
export function compareMarkdownLines(exampleText, actualText) {
  const findings = [];
  if (typeof actualText !== 'string') return [{ path: 'markdown', category: 'shape', detail: '応答に markdown の文字列が無い' }];
  const want = exampleText.split('\n').filter((l) => l.trim() !== '' && !/^取得日時:/.test(l));
  const have = actualText.split('\n');
  let pos = 0;
  for (const w of want) {
    let found = -1;
    for (let k = pos; k < have.length; k += 1) {
      if (w.includes('…') ? globMatch(w, have[k]) : w === have[k]) {
        found = k;
        break;
      }
    }
    if (found < 0) findings.push({ path: 'markdown', category: 'data', detail: `例の行が見つからない: ${show(w)}` });
    else pos = found + 1;
  }
  return findings;
}

/**
 * 応答の文字列に入っている利用者のホームのパスを `~` に置き換える（例はホームを `~` で書く。環境で変わる値）。
 * 例: "/Users/bonji/.cache/houki-egov-mcp/files/…" → "~/.cache/houki-egov-mcp/files/…"
 * aliases（[元, 置き換え] の並び）はホームより先に置き換える。--db absent で DB と保存先を使い捨てのフォルダーに
 * 向けたとき、その場所を既定の置き場所の書き方に戻すために使う。
 */
export function normalizeHome(value, home, aliases = []) {
  const pairs = [...aliases, ...(home ? [[home, '~']] : [])].filter(([from]) => from);
  if (!pairs.length) return value;
  const fix = (v) => {
    if (typeof v === 'string') return pairs.reduce((acc, [from, to]) => acc.split(from).join(to), v);
    if (Array.isArray(v)) return v.map(fix);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)]));
    return v;
  };
  return fix(value);
}

/** 応答の中の `a.b[0].c` の位置の値。無ければ undefined */
export function valueAt(value, path) {
  let cur = value;
  for (const seg of path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)) {
    if (cur == null) return undefined;
    cur = cur[/^\d+$/.test(seg) && Array.isArray(cur) ? Number(seg) : seg];
  }
  return cur;
}

/** 例の期待する応答がエラーの形か（family 共通のエラー契約: `error` と `code` を持つ） */
export function looksLikeError(pattern) {
  return Boolean(pattern) && typeof pattern === 'object' && !Array.isArray(pattern) && 'error' in pattern && 'code' in pattern;
}

/** 違いの一覧から判定を決める（形の違いがあれば shape、データ側だけなら data、無ければ match） */
export function statusOf(findings) {
  if (findings.some((f) => f.category === 'shape')) return 'shape';
  if (findings.some((f) => f.category === 'data')) return 'data';
  return 'match';
}

export const STATUS_JA = { match: '一致', data: 'データ側の差分', shape: '形の違い', unverified: '未確認', skipped: '照合しない' };
