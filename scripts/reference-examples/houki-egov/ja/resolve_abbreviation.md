::: details 呼び出し例 — 「消基通 は何の略で、どのサーバーが担当か」
- 実測: v0.5.3（2026-09-08）
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
    "aliases": ["消費税法基本通達"],
    "note": "国税庁長官が発する消費税法の解釈通達。実務の主要参照"
  }
}
```

`source_mcp_hint` が `"houki-nta"` なので、この略称の本文は houki-egov-mcp ではなく houki-nta-mcp（`nta_get_tsutatsu`）で取ります。通達は e-Gov に載っていないため `law_id` は `null` です。法律の略称（「消法」「個情法」）なら `law_id` に e-Gov の ID が入り、`source_mcp_hint` は `"houki-egov"` になります。
:::
