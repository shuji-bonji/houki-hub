# issue 草案: 質疑応答事例の【関係法令通達】を、法令名・条番号と通達番号に分けて返す

対象リポジトリ: houki-nta-mcp（2026-09-11 作成）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
起票済み: https://github.com/shuji-bonji/houki-nta-mcp/issues/22 （2026-09-11）
タイトル案: 質疑応答事例の関係法令通達（relatedLaws）を、法令名・条番号と通達番号に分けて返す

---

## 背景

houki-nta-mcp#20 の提案 3 を切り出した issue です。#20 の提案 1・2（基本通達の応答に `base_laws` と houki-egov-mcp の `get_law` への `next_actions` を付ける）は v0.11.0 で実装しました。

質疑応答事例は通達よりさらに拘束力の弱い参考資料です（`legal_status` の `binds_*` がすべて `false`）。そのため、根拠になる法律の条文へ戻れることが通達以上に重要です。質疑応答事例のページには【関係法令通達】欄があり、根拠の条文が書かれています。ところが、応答ではこの欄を文字列のまま返しているため、houki-egov-mcp の `get_law` にそのまま渡せません。

## 現状（v0.11.0、2026-09-11 に確認）

`nta_get_qa` に `{ "topic": "shohi", "category": "02", "id": "19", "format": "json" }` を渡すと、`qa.relatedLaws` は次のとおりです。

```json
"relatedLaws": [
  "消費税法第2条第1項第8号、消費税法基本通達5-1-1",
  "注記\n\n令和7年8月1日現在の法令・通達等に基づいて作成しています。\n\nこの質疑事例は、照会に係る事実関係を前提とした一般的な回答であり、…ご注意ください。"
]
```

ここから分かることは 3 つです。

1. **法令と通達が 1 つの文字列に入っています。** 「消費税法第2条第1項第8号」（法律の条・項・号）と「消費税法基本通達5-1-1」（通達の番号）が「、」でつながっています。
2. **【関係法令通達】欄ではない「注記」が混ざっています。** 2 つ目の要素は、ページ下部の注記（作成時点と、一般的な回答である旨の断り書き）です。`src/services/qa-parser.ts` の `extractSectionParagraphs($, $body, '【関係法令通達】')` が、欄の終わりを判定できていないためと考えられます。この注記には「令和7年8月1日現在の法令・通達等に基づいて作成」という作成時点が入っているので、捨てずに別の項目として返す価値があります。
3. **タックスアンサーには `relatedLaws` がありません。** `nta_get_tax_answer` の応答では、「根拠法令等」は `sections` の見出しの 1 つで、中身も「消費税法など」程度の粗さです（6101 で確認）。この issue の対象は質疑応答事例に絞ります。

## 提案

### 1. 【関係法令通達】欄の終わりを正しく判定する

注記を `relatedLaws` から外します。注記の中の作成時点（「令和7年8月1日現在」）は、別の項目（例: `basisDate`）として返します。タックスアンサーの `effectiveDate`（「令和7年4月1日現在法令等」）と同じ扱いです。

### 2. 法令と通達に分けた構造を追加する

`relatedLaws`（文字列の配列）は後方互換のため残し、構造化した項目を足します。

```jsonc
{
  "related_laws": [
    { "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8, "raw": "消費税法第2条第1項第8号" }
  ],
  "related_tsutatsu": [
    { "name": "消費税法基本通達", "clause": "5-1-1", "raw": "消費税法基本通達5-1-1" }
  ],
  "next_actions": [
    { "action": "delegate_to_mcp", "reason": "…", "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法", "article": "2", "paragraph": 1, "item": 8 } },
    { "action": "nta_get_tsutatsu", "reason": "…", "example": { "name": "消費税法基本通達", "clause": "5-1-1" } }
  ]
}
```

- `law_name` / `name` は houki-abbreviations で正式名に揃えます（「措置法」「措法」などの略記に備えるため）。
- `article` などの形は houki-egov-mcp の `get_law` の引数（`article` は文字列、`paragraph` / `item` は数値）に合わせ、そのまま渡せるようにします。
- 読み取れなかった部分は推測で埋めず、`raw` だけを残します。#20 で条番号を推測しない方針にしたのと同じ理由です。

## 確認すること

- 9 税目の質疑応答事例から標本を取り、【関係法令通達】欄の書き方の種類を数える。想定している揺れは次のとおりです。
  - 全角・半角の数字とハイフン（「５－１－１」と「5-1-1」）
  - 「第2条第1項第8号」と「2条1項8号」
  - 「同法」「同条」のような前の項目への参照
  - 租税特別措置法や施行令・施行規則の略記
  - 複数の条をまとめた書き方（「第30条、第31条」「第30条～第32条」）
- 分解できた割合を測り、`raw` だけで返す件数を README に書く。
- 応答の形が増えるので minor リリースにする。`nta_search_qa` の結果（hit ごと）にも付けるかは、#20 で検索に `base_laws_by_tsutatsu` を 1 回だけ置いた判断と合わせて決める。

## 関連

- houki-nta-mcp#20（基本通達の `base_laws` と `next_actions`。v0.11.0 で実装、この issue に提案 3 を切り出して close）
- houki-nta-mcp#21（通称の OR 展開ノイズ）

---

## #20 を閉じるときのコメント案

> 提案 1・2 を v0.11.0 で実装しました。
>
> - `nta_get_tsutatsu`: `base_laws`（法律・施行令・施行規則の配列）と、houki-egov-mcp の `get_law` を案内する `next_actions`
> - `nta_search_tsutatsu`: 検索結果に現れた通達ごとの対応表 `base_laws_by_tsutatsu`（hit ごとではなく応答に 1 回）と、通達ごとに 1 件の `next_actions`
>
> 条番号は付けていません。成功時の `next_actions` は、houki-egov-mcp の `search_fulltext`（`api-fallback`）の前例に合わせました。houki-research-skill にも、通達を引いたら `next_actions` に従って法律本文へ戻る手順を v0.4.0 で足しました（前提を houki-nta-mcp v0.11.0 以上に変更）。
>
> 提案 3（質疑応答事例の `relatedLaws` の構造化）は #22 に切り出しました。試用中に、`relatedLaws` にページ下部の注記が混ざっていることも見つかったので、あわせてそちらで扱います。
