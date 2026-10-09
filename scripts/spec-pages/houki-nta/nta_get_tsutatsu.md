## 使いどころ

この節は、このツールをどんな場面で使うかを、仕様書の外から補うためのものです。

国税庁の基本通達（消費税法基本通達・所得税基本通達・法人税基本通達・相続税法基本通達）の条項を、番号を指定して 1 つ読むときに使います。番号が分からないときは、先に `nta_search_tsutatsu` でキーワードから探します。

通達は税務署の職員を拘束しますが、納税者と裁判所は拘束しません（[文書の種類と拘束力](/guide/document-types)）。そのため応答には、その通達が解釈している法律の名前と、houki-egov-mcp で法律の本文を読みに戻るための案内が付きます（[SPEC-NTA-GET-TSUTATSU-013](#spec-nta-get-tsutatsu-013)）。houki-research Skill の [tax-research](/specs/houki-research/tax-research) では、ステップ ④ でこのツールを呼び、そのあと法律の本文へ戻ります。
