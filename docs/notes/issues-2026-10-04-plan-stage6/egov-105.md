## 確かめた結果（2026-10-04 JST）: 時点の題名は `revision_info.law_title` に入る

本文の「確かめること」の 1・2 を、e-Gov 法令 API v2 の `/laws` を直接引いて確かめました。

| 呼び出し | `revision_info.law_title` | `current_revision_info.law_title` |
| --- | --- | --- |
| `law_id=414AC0000000151&asof=2018-01-01` | 行政手続等における情報通信の技術の利用に関する法律（`amendment_enforcement_date` 2016-11-01） | 情報通信技術を活用した行政の推進等に関する法律 |
| `law_id=414AC0000000151`（`asof` 無し） | 情報通信技術を活用した行政の推進等に関する法律（2026-07-17） | 情報通信技術を活用した行政の推進等に関する法律 |
| `law_title=行政手続等における情報通信の技術の利用に関する法律&asof=2018-01-01` | 1 件目が `414AC0000000151` で、旧題名 | 新しい題名 |

`asof` を付けたときの時点の題名は `revision_info.law_title` に入るので、`src/services/law-service.ts` の `l.revision_info.law_title === searched`（SPEC-EGOV-COMMON-ERRORS-032）で照合できています。

houki-egov-mcp（plugin）の `get_toc` に `law_name: "行政手続等における情報通信の技術の利用に関する法律"`・`at: "2018-01-01"` を渡すと、`meta.law_id: "414AC0000000151"`、`meta.title` が旧題名で、目次（第1条〜第12条）が返りました。

3 つ目の点（完全一致の比較で空白・全角を揃えるか）は、SPEC-EGOV-COMMON-ERRORS-032 のとおり文字列の一致のままで、仕様とのずれではありません。揃える必要が出たら、別の Issue にします。

確かめたのは改題した法令 1 件です。ずれは見つからなかったので閉じます。

記録: houki-hub `docs/notes/2026-10-04-plan-stage6-and-followups.md` の 1.3 の 5
