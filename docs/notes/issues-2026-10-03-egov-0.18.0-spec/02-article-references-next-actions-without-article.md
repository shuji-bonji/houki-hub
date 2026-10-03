`get_article_references` で、本文の参照が条番号の付かない他法令（「法令名（法令番号）」だけ）のとき、`next_actions` の `get_law` の `article` に、呼び出しで指定した条の番号が入ります。参照先の法令の、関係の無い条を読む案内になります。

## 何が起きるか

`get_article_references { law_name: "所得税法施行規則", article: "3" }`（2026-10-03 10:14 JST、houki-egov-dev。main の手元のビルド）:

- `references` に、条番号の無い external が入る

```json
{
  "kind": "external",
  "raw": "日本国との平和条約に基づき日本の国籍を離脱した者等の出入国管理に関する特例法（平成三年法律第七十一号）",
  "law_name": "日本国との平和条約に基づき日本の国籍を離脱した者等の出入国管理に関する特例法",
  "law_num": "平成三年法律第七十一号",
  "law_id": "403AC0000000071",
  "resolved": true
}
```

- `next_actions` に、その法令の第3条を読む案内が入る

```json
{
  "action": "get_law",
  "reason": "引用先の条を読めます",
  "example": {
    "law_name": "日本国との平和条約に基づき日本の国籍を離脱した者等の出入国管理に関する特例法",
    "article": "3"
  }
}
```

第3条は、所得税法施行規則 第3条を呼んだときの番号で、特例法の本文はこの条を指していません。

## 原因

`src/services/law-service.ts` の `buildReferenceNextActions()` は、参照に条が無いとき、参照の種類によらず `article` に呼び出しの条（`ref.article ?? fromEgovArticleNum(articleNum)`）を入れます。この規則は SPEC-EGOV-GET-ARTICLE-REFERENCES-015 の「条を持たない internal は、指定した条」（「第三号」のように条を書かない同一法令内の参照のため）のもので、external に当てはめる理由がありません。

SPEC-EGOV-GET-ARTICLE-REFERENCES-015 の文は「`article`: 参照の条。条を持たない internal は、指定した条」で、条を持たない external のときを書いていません。仕様には書かれておらず、実装だけがこう動いています。

## 決めること

条を持たない external の参照から、`next_actions` に何を入れるか。

- 案 A（勧める）: `get_law` を作らず、`{ action: "get_toc", reason: "引用先の法令の目次を見られます", example: { law_name: <参照先の法令名> } }` を入れる
- 案 B: `article` を付けない `get_law` を入れる（`get_law` は `article` を省くと目次を返すので、結果は A と同じだが、`action` の名前と返るものが合わない）
- 案 C: 何も入れない

どれにしても、SPEC-EGOV-GET-ARTICLE-REFERENCES-015 の「`article`」の行に、条を持たない external の扱いを書き足す（MODIFIED）。

## 時期

段階 5 の 0.18.0（`get_article_references` は #51・#63 で仕様を変える版）に入れる候補です。

## 出典

houki-egov-mcp `specs/changes/20261003-search-explain-attachment/proposal.md`（0.18.0 の仕様 PR）の「この差分の外で見つけたこと」2
