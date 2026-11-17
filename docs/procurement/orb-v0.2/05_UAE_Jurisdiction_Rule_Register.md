# BAITNA — UAE Jurisdiction Rule Registry (Design)
## مصفوفة الجهة المحلية والاشتراطات ذات المصادر

**تاريخ التحري:** 17 نوفمبر 2026. **الحالة:** سجل مصادر مرجعية **وليس مكتبة اشتراطات قانونية مكتملة**.  
تتحقق المنصة من **الإمارة → المدينة/منطقة الاختصاص → موقع الأرض → نوع الأعمال → الجهة المختصة → تاريخ سريان المصدر**. تختلف الجهات والإجراءات داخل الإمارة بحسب المواقع الخاصة/المناطق الحرة أو التطوير/الأراضي، لذلك لا يجوز حسم جهة الترخيص من الإمارة وحدها دائماً.

| الإمارة | جهة/مراجع تحققت منها في مصادر رسمية | موضع التخصيص في ORB/الوثيقة | حالة الجاهزية |
|---|---|---|---|
| دبي / Dubai | بلدية دبي: إجراءات تراخيص المباني، كود دبي للبناء؛ توجد جهات مختصة أخرى بحسب الموقع | مخططات، أنشطة، مراحل الترخيص، الاستشاري، اشتراطات المنطقة والكود | `REFERENCE_CONFIRMED` → استخراج البنود يحتاج مراجعة |
| أبوظبي / Abu Dhabi | دائرة البلديات والنقل DMT ودليل أحكام السكن الخاص؛ تعديلات منشورة في سبتمبر 2025 | ارتدادات/ملاحق/الطوابق بحسب نوع القسيمة والسلطة المحلية؛ لا إدراج لأرقام تلقائية | `REFERENCE_CONFIRMED` → مراجعة نسخة سارية |
| الشارقة / Sharjah | بلدية مدينة الشارقة: قائمة المستندات/الرخص الهندسية والخدمات | مخططات، بيانات الأرض، الاستشاري والمقاول، نوع الخدمة والصيانة/الإضافة | `REFERENCE_CONFIRMED` → تأكيد سلطة الموقع والاشتراط |
| عجمان / Ajman | دائرة البلدية والتخطيط: Building Permit Request | مخططات تنفيذية، عقود إشراف ومقاولة، الموافقات الخدمية حسب الحالة | `REFERENCE_CONFIRMED` → مراجعة الشروط الحالية |
| رأس الخيمة / RAK | بلدية رأس الخيمة: منصة سند، تصريح البناء الجديد، لائحة الاشتراطات المعمارية | الفلل الجديدة والملاحق وأنواع التصاريح، المخططات والمعايير | `REFERENCE_CONFIRMED` → لا نسخ نصوص تنظيمية بلا مراجعة |
| الفجيرة / Fujairah | بلدية الفجيرة: خدمة تصريح بناء جديد | المخططات والجهات الخدمية وعقد المقاولة والتراخيص حسب نوع الموقع | `REFERENCE_CONFIRMED` → راجع التطبيق الحالي |
| أم القيوين / UAQ | البوابة الرسمية الاتحادية تؤكد دور البلدية واختصاصات الترخيص المحلية؛ لم تتحقق في هذا البحث من صفحة أولية رسمية تفصيلية لطلبات البناء | اعتماد الجهة والوثائق والاشتراطات الخاصة بالنشاط/الموقع يدوياً | `PRIMARY_DETAIL_NOT_VERIFIED` — لا توليد بند محلي إلزامي آلي |

### مكتبة المصادر الأساسية (حقيقية ويمكن تتبعها)
- **DUB-01** Dubai Municipality: https://www.dm.gov.ae/municipality-business/building-permit-steps/ (إجراءات الترخيص، المراجعة والفحص والشهادات).
- **DUB-02** Dubai Building Code: https://www.dm.gov.ae/municipality-business/planning-and-construction/dubai-building-code-2/ .
- **ADB-01** DMT — private villa building regulations amendments (10 Sep 2025): https://www.dmt.gov.ae/en/Media-Centre/News/Department-of-Municipalities-and-Transport-Announces-Amendments-to-Private-Villas-Regulations .
- **ADB-02** DMT — technical guide private housing seminar (29 Mar 2023): https://www.dmt.gov.ae/ar-AE/adm/Media-Centre/News/29Mar2023 .
- **SHJ-01** Sharjah Municipality — required documents for engineering drawings / permits: https://portal.shjmun.gov.ae/en/eservices/Attachements/Required_Documents.pdf ; **ملف PDF مرجعي: يُراجع من المصدر الأصلي بواسطة مختص قبل استنباط أي حكم**.
- **SHJ-02** Sharjah Municipality — municipal service directory: https://shjmun.gov.ae/servicedirectory/details/683d3a96ff3e1753c064e6fe .
- **AJM-01** Ajman Municipality — Building Permit Request: https://www.am.gov.ae/en/services/building-permit-request/ .
- **RAK-01** RAK Municipality Sanad — New Building Permit: https://sanad.mun.rak.ae/docs/en/services-card-english-temp-49 .
- **RAK-02** RAK Municipality — architectural requirements regulations: https://sanad.mun.rak.ae/docs/en/building-regulation-arch .
- **FUJ-01** Fujairah Municipality — new building permit: https://portal.fujmun.gov.ae/OnlineEservices/En/Eservice/ServicePages/service_information.aspx?serviceid=81 .
- **UAQ-01** UAE Government — official overview of local municipal competence: https://u.ae/en/information-and-services/justice-safety-and-the-law/building-safety . **ليست صفحة تفصيلية لتصريح في أم القيوين.**

### محرك القواعد — بنية السجل الإلزامية
```yaml
rule_id: REG-<EMIRATE>-<DOMAIN>-NNN
jurisdiction: emirate + municipal_area + competent_authority_id
project_kinds: [new_build, extension, renovation, maintenance]
trigger_expression: "predicate evaluated on versioned ORB fields"
requirement_type: information | document | technical_review | conditional_permit | mandatory_clause
legal_effect: binding | guidance | service_checklist | unverified
source_url: https://official.example/...
source_title: "official source title"
publication_date: null
valid_from: null
valid_to: null
retrieved_on: 2026-11-17
verified_by: null
verified_at: null
technical_reviewer: null
legal_reviewer: null
review_status: research | source_confirmed | verified_applicability | approved_for_issue | obsolete
rulepack_version: 0.1-draft
```

### معالجة حالة لا يوجد لها مصدر
1. ضع القاعدة `UNVERIFIED`، لا تنسبها لجهة حكومية.
2. اعرض للمالك «يتطلب تأكيد المتطلبات لدى الجهة المختصة»، وأحِلها للمراجع المهني.
3. لا تدخل أرقام ارتدادات/مساحات/رسوم/غرامات أو شروطاً تعاقدية بشكل تلقائي دون تحقق من أحدث مصدر ونطاقه.
4. بعد التحقق من نسخة القانون والتصريح والجهة، تُعتمد قاعدة **محددة** مرتبطة بتاريخ سريانها ويُحفظ أثر مراجعتها.
5. تحديث RulePack لا يعيد صياغة وثائق أُصدرت سابقاً؛ يفتح استعراض أثر/ملحق للمستندات الجارية.

### ملاحظة امتثال
لا تُنسب هذه الدراسة إلى سلطة محلية أو اعتماد حكومي. الصفحات الرسمية أعلاه تثبت وجود إجراءات ومتطلبات متغيرة؛ **لا تثبت موافقة مسبقة على نصوص RFI/RFP/RFQ المقترحة**. يجب أن يتحقق مهندس/محام مختص من كل بند ملزم قبل إصدار مستند حقيقي.