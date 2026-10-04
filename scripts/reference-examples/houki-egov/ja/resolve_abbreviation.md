::: details 呼び出し例 — 「消基通 は何の略で、どのサーバーが担当か」
- 実測: v0.19.1（2026-10-04）
- ローカル DB: 不要（辞書は houki-abbreviations に内蔵）

**引数**

```jsonc
{ "abbr": "消基通" }
```

**返る JSON**

```jsonc
{
  "abbr": "消基通",
  "resolved": {
    "abbr": "消基通",
    "formal": "消費税法基本通達",
    "law_id": null,
    "domain": "tax",
    "category": "kihon-tsutatsu",
    "source_mcp_hint": "houki-nta",
    "note": "国税庁長官が発する消費税法の解釈通達。実務の主要参照"
  },
  "in_scope": false,
  "hint": "このエントリは houki-nta の管轄です。houki-nta-mcp で取得してください。"
}
```

`in_scope: false` と `hint`、`source_mcp_hint: "houki-nta"` のとおり、この略称の本文は houki-egov-mcp ではなく houki-nta-mcp（`nta_get_tsutatsu`）で取ります（`in_scope` と `hint` は v0.16.0 から）。`resolved.aliases` は、通称があるエントリにだけ付きます（houki-abbreviations 0.7.0 から、`formal` と同じ値は入れていません）。通達は e-Gov に載っていないため `law_id` は `null` です。法律の略称（「消法」「個情法」）なら `law_id` に e-Gov の ID が入り、`source_mcp_hint` は `"houki-egov"` になります。
:::
