# issue 草案: 通達の応答に、解釈の対象になる法律と houki-egov-mcp への next_actions を付ける

対象リポジトリ: houki-nta-mcp（v0.10.4 で確認、2026-09-10）
提出先: https://github.com/shuji-bonji/houki-nta-mcp/issues
起票済み: https://github.com/shuji-bonji/houki-nta-mcp/issues/20 （2026-09-10）
タイトル案: 通達の応答に元の法律（base_laws）と houki-egov-mcp の get_law への next_actions を付ける

---

## 現状

通達を引いた後に、その通達が解釈している法律の条文を読みに行く手順を、houki-nta-mcp の応答が示していません。

- `nta_search_tsutatsu` / `nta_get_tsutatsu` の成功時の応答に、元の法律を指す項目がありません。
- `next_actions` を返すのはエラー時だけです（`bulkDownload` / `retryLater` / `searchTsutatsu`）。houki-egov-mcp へ誘導する `NEXT_ACTIONS.delegateTo()` はありますが、使われるのは houki-egov 管轄の略称を渡されたとき（`src/tools/handlers.ts` の `resolved.source_mcp_hint` の分岐）だけです。
- 質疑応答事例とタックスアンサーは、本文の【関係法令通達】欄を `relatedLaws: string[]` として返しています（`src/services/qa-parser.ts`）。ただし中身は国税庁ページの文字列そのままで、houki-egov-mcp の `get_law` に渡せる法令名・条番号には分かれていません。

そのため「通達 → 元の法律」のたどり方は LLM の推測に任されています。通達は国民・裁判所を拘束しない（`legal_status` のとおり）ので、元の法律の条文まで戻れることが、利用者にとって重要です。

## 提案

### 1. 基本通達 4 種に `base_laws` を付ける

`TSUTATSU_URL_ROOTS` の 4 通達と、解釈の対象になる法律の対応は固定です。

| 通達 | base_laws（houki-egov-mcp の `get_law` に渡す `law_name`） |
|---|---|
| 消費税法基本通達 | 消費税法、消費税法施行令、消費税法施行規則 |
| 所得税基本通達 | 所得税法、所得税法施行令、所得税法施行規則 |
| 法人税基本通達 | 法人税法、法人税法施行令、法人税法施行規則 |
| 相続税法基本通達 | 相続税法、相続税法施行令、相続税法施行規則 |

`src/constants.ts` に対応表を置き、`nta_get_tsutatsu` と `nta_search_tsutatsu` の応答に `base_laws` を載せます。

### 2. 成功時の応答にも houki-egov-mcp への `next_actions` を付ける

```jsonc
// nta_get_tsutatsu の応答に追加するイメージ
{
  "base_laws": ["消費税法", "消費税法施行令", "消費税法施行規則"],
  "next_actions": [
    {
      "action": "delegate_to_mcp",
      "reason": "通達は国民・裁判所を拘束しない。根拠は法律本文で確認する",
      "example": { "mcp": "houki-egov", "tool": "get_law", "law_name": "消費税法" }
    }
  ]
}
```

条番号までは付けません。通達の項と法律の条の対応は一律ではなく、推測で条番号を出すと誤った引用につながるためです。

### 3.（任意・後回し）`relatedLaws` の構造化

質疑応答事例の【関係法令通達】欄（例:「消費税法第30条」）を、法令名と条番号に分けて返します。houki-abbreviations の略称解決で法令名を正式名に揃えれば、houki-egov-mcp の `get_law` にそのまま渡せます。表記ゆれが大きいので、1・2 とは別に扱います。

## 確認すること

- 上の例は既存の `NextAction` 型（`action` / `reason` / `example`、`src/errors.ts`）と `NEXT_ACTIONS.delegateTo()` の `action: 'delegate_to_mcp'` に合わせている。この型はいまエラー応答用なので、成功時の応答でも使ってよいかを、family の error contract（houki-research-skill が正典）と合わせて判断する。
- houki-egov-mcp 側の法令名解決で、4 法律と施行令・施行規則がすべて引けることを確かめる。

## 関連

- shuji-bonji/houki-hub#10（サイトに「文書の種類と拘束力」ページを追加し、houki-nta のページに基本通達と法律の対応表を載せる）
