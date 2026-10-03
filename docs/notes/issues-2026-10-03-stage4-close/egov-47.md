v0.16.0 で `at` の形の検査を入れました（npm 公開 2026-10-02 JST）。残りの 2 つと、`verify_citations` の未決 1 つは #87 に移して、この Issue は閉じます。

### 「決めること」への答え

- **`at` の形をサーバーで確かめて `INVALID_ARGUMENT` にするか** → 確かめます。`at` を持つ 8 ツールの inputSchema に `pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"` を書き、形が違えば引数の検査で `INVALID_ARGUMENT` にします。`2026-02-30` のような暦に無い日付も、各ツールの処理で同じ形の `INVALID_ARGUMENT` にします（SPEC-EGOV-COMMON-ERRORS-024 と各ツールの ID）。`get_law_file` が `save` なしで `asof=<その値>` 付きの URL を返す経路も、この検査で先に止まります
- **形は正しいが、その時点に法令がまだ無いときに何を返すか** → #87 に移します。e-Gov はこの場面で 400 か 404 を返し、law_id が決まった後の 400・404 を `SOURCE_API_ERROR` と `LAW_NOT_FOUND` のどちらに揃えるかは #87 の「決めること」1・3 と同じ判断です
- **`verify_citations` で `at` を法令名の検索にも使うか** → #87 に移します。0.16.0〜0.17.0 では振る舞いを変えていません（法令名の検索と略称辞書の引き当てには `at` を使いません）

### #87 に移すもの

- 上の 2 つ
- `specs/current/verify_citations/spec.md` の未決 2「e-Gov の 400 を『law_id が無い』と書くことがある」。この行の指す先を #47 から #87 に直します（仕様の記録の訂正の PR。振る舞いは変えません）

### 出典

- 仕様 PR [#84](https://github.com/shuji-bonji/houki-egov-mcp/pull/84)（T1）、[`specs/releases/v0.16.0/20261001-t1-argument-guards/proposal.md`](https://github.com/shuji-bonji/houki-egov-mcp/blob/main/specs/releases/v0.16.0/20261001-t1-argument-guards/proposal.md) の「#47（`at` の形）」
- [CHANGELOG 0.16.0](https://github.com/shuji-bonji/houki-egov-mcp/blob/main/CHANGELOG.md)「互換性」の T1
