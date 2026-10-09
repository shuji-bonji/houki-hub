import re,sys,os
# 見本（2026-10-09）を作った使い捨てのスクリプト。生成済みの仕様書ページとリファレンスから組み立てる。
# 使い方: python3 sample-build.py <出力先.md>（houki-hub のどこからでも）
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../site/docs')
spec=open(f'{D}/specs/houki-egov/get_law.md').read()
ref=open(f'{D}/reference/mcp/houki-egov.md').read()
def sections(md,level=2):
    out={};cur=None;fence=False
    for l in md.split('\n'):
        if re.match(r'\s*(```|~~~)',l): fence=not fence
        if not fence and l.startswith('#'*level+' ') and not l.startswith('#'*(level+1)):
            cur=l[level+1:].strip(); out[cur]=[]; continue
        if cur is not None: out[cur].append(l)
    return {k:'\n'.join(v).strip() for k,v in out.items()}
S=sections(spec)
S={k:(v.split('\n\n',1)[1] if k in ('使う人と受け取るもの','できないこと') else v) for k,v in S.items()}
SPEC='/specs/houki-egov/get_law'
fix=lambda t: t.replace('](#spec-',f']({SPEC}#spec-')
# reference section of get_law
m=re.search(r'^## get_law\n(.*?)(?=^## )',ref,re.S|re.M); R=m.group(1)
desc=R.strip().split('\n\n')[0]
args=re.search(r'### 引数\n(.*?)(?=^::: details)',R,re.S|re.M).group(1).strip()
examples=R[R.index('::: details'):].strip()
ver=re.search(r'\*\*v([\d.]+)\*\*',ref).group(1)
# promises index
ids=re.findall(r'^### (SPEC-[A-Z0-9-]+-\d{3}) (.+)$',spec,re.M)
L=[]
L+=['---','title: "get_law — houki-egov-mcp のツール"',
    'description: "houki-egov-mcp の get_law が何をするか（処理の流れ・引数・呼び出し例・できないこと）。見本（2026-10-09）"','---','',
    '# get_law','',
    '::: info 見本',
    f'houki-hub#27 の続き（ツールごとのページ、案 B）の見本です。引数は v{ver} の `tools/list`、呼び出し例は実測、「使う人と受け取るもの」「処理の流れ」「できないこと」は `specs/current/get_law/spec.md` の写しです。「使いどころ」だけを人が書きます。',
    ':::','',desc,'',
    '::: tip 使いどころ',
    '（人が書く節の見本）法令名と条番号が分かっていて、その条の本文を引用したいときに使います。条番号が分からないときは、先に `search_fulltext` で本文から探します。章や節をまとめて読むときは `get_law_range` を使います。',
    ':::','',
    '## 使う人と受け取るもの','','このツールを誰が呼び、何を渡して何を受け取るかを示します。','',fix(S['使う人と受け取るもの']),'',
    '## 処理の流れ','',fix(S['処理の流れ']),'',
    '## 引数','','呼び出すときに渡す値です。動いているサーバーの `tools/list` から写しています。','',args,'',
    '## 呼び出し例','','実際に呼び出したときの引数と応答です。版と日付は実測したときのものです。','',examples,'',
    '## できないこと','','このツールが引き受けないことです。','',fix(S['できないこと']),'',
    '## 約束の一覧','',f'このツールが守る約束 {len(ids)} 件の見出しです。約束は受入テストと 1 対 1 で対応していて、条件と例は[仕様書ページ]({SPEC})で読めます。','',
    f'::: details 約束の見出し（{len(ids)} 件）','','| 仕様 ID | 約束 |','|---|---|']
esc=lambda s: s.replace("|","\\|")
for i,h in ids: L.append(f'| [{i[-3:]}]({SPEC}#{i.lower()}) | {esc(h)} |')
L+=[':::','','## 関連ページ','','- [houki-egov-mcp の解説](/mcp/houki-egov)',f'- [get_law の仕様書ページ]({SPEC})','- [houki-egov-mcp のツール一覧](/reference/mcp/houki-egov)','']
open(sys.argv[1],'w').write('\n'.join(L))
print(len(L))
