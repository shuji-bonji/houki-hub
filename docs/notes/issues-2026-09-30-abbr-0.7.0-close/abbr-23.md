v0.7.0 で対応しました（npm 公開 2026-09-30 JST）。`isValidLawId` を e-Gov 公式仕様（「法令種別と法令ID」）の 6 つの形に狭め、e-Gov 全件を受け付けることを月次の workflow で確かめ続けます。

### 「決めること」への答え

- **元号の桁（1〜5）を確かめるか** → 確かめます（SPEC-ABBR-IS-VALID-LAW-ID-013）。`000AC0000000000` `999AC9999999999` は `false` です。年の 2 桁の値は確かめません
- **憲法の形を `321CONSTITUTION` だけにするか** → します（004 の MODIFIED）。`363CONSTITUTION` は `false` です
- **`M` の次の 1 文字を注記どおり 1〜6 に狭めるか、注記を直すか** → 狭めます（002 の MODIFIED、014）。`340M00000040011` `340MF0000040011` は `false` です。`R` の機関番号も公式仕様どおり 10 進 8 桁にし（015）、`DH`（太政官布達）を足しました（001 の MODIFIED）。公式仕様の例にある小文字 `501M60000f00006` は、e-Gov の全件に小文字が無いので `false` のままです（010）
- **狭める場合、e-Gov 全件を受け付けることを CI で確かめ続けるか** → 確かめ続けます。`scripts/verify-law-ids.mjs` を、辞書の 9 件の `law_id` を存在・`law_title`・`law_num` で突き合わせることに加えて、e-Gov 法令 API v2 `GET /api/2/laws` の全件に `isValidLawId` を通し `false` があれば exit 1 にする形にしました（雛形が呼んでいた `/lawdata/{id}` は v2 に無く 404 だったので置き換え）。`.github/workflows/verify-law-ids.yml`（毎月 1 日 03:17 UTC と `workflow_dispatch`。PR では走らせない）で回します。2026-10-01 の実行で全 9,570 件が `true` でした

利用側で変わること: v0.6.1 で `true` だった上の形が `false` になります。辞書の 9 件と e-Gov の全件は `true` のままです。

### 出典

- 仕様 PR [#31](https://github.com/shuji-bonji/houki-abbreviations/pull/31)、実装 PR [#34](https://github.com/shuji-bonji/houki-abbreviations/pull/34)（`test/20261001-0.7.0`。`3f23d5b` が `verify-law-ids.mjs` と workflow）
- [`specs/releases/v0.7.0/20261001-input-guards/proposal.md`](https://github.com/shuji-bonji/houki-abbreviations/blob/main/specs/releases/v0.7.0/20261001-input-guards/proposal.md)（「#23」「人が判断すること」7・8）
- [CHANGELOG 0.7.0「互換性」](https://github.com/shuji-bonji/houki-abbreviations/blob/main/CHANGELOG.md)「`isValidLawId` が狭くなる」、「Added」
- houki-hub [`docs/notes/2026-09-29-plan-spec-issues.md`](https://github.com/shuji-bonji/houki-hub/blob/main/docs/notes/2026-09-29-plan-spec-issues.md) の判断の表「houki-abbreviations #23（`isValidLawId`）」（案 A、2026-09-30）
