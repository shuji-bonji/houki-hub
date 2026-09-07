::: details 呼び出し例 — 「電帳法 は houki-nta-mcp で引けるか」
- 実測: v0.10.2（2026-09-08）
- ローカル DB: 不要

**引数**

```jsonc
{ "abbr": "電帳法" }
```

**返る JSON**

```jsonc
{
  "abbr": "電帳法",
  "resolved": {
    "abbr": "電帳法",
    "formal": "電子計算機を使用して作成する国税関係帳簿書類の保存方法等の特例に関する法律",
    "law_id": null,
    "law_type": "Act",
    "domain": "tax",
    "category": "law",
    "source_mcp_hint": "houki-egov",
    "aliases": ["電子帳簿保存法", "電子帳簿保存", "電帳", "電子帳簿等保存制度"],
    "note": "通称: 電子帳簿保存法 (電帳法)"
  },
  "in_scope": false,
  "hint": "このエントリは houki-egov の管轄です。houki-egov-mcp で取得してください。"
}
```

`in_scope: false` は、この略称が houki-nta-mcp の管轄外（法律なので houki-egov-mcp）であることを示します。houki-egov-mcp 側の同名ツールとの違いはこの `in_scope` と `hint` で、辞書は同じ houki-abbreviations です。「消基通」「所基通」のような通達の略称なら `in_scope: true` になります。
:::
