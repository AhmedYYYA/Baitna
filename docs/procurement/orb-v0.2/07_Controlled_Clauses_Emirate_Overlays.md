# BAITNA — Controlled Clause Library (DDL v0.2, design)
## مكتبة البنود القياسية وملحقات الإمارة

**النسخة:** 17 نوفمبر 2026؛ **الصلاحية:** تصميم قوالب، **ليس صياغة قانونية نافذة أو قاعدة محلية مكتملة**.  
**الحوكمة:** لا يصبح أي بند `APPROVED_FOR_ISSUE` حتى يوثّق المصدر ومدى انطباقه ويوافق المراجع الفني/القانوني المخول. البنود الآتية **مقترحات نصية أساسية** قابلة للمراجعة وليست توصية باستخدامها دون تدقيق.

## A. بنود مشتركة ذات هيكل ثابت — Standard Clause Modules

| Code | عنوان البند العربي / English | RFI | RFP | RFQ | تحرير المالك |
|---|---|:---:|:---:|:---:|---|
| STD-01 | التعريفات والصفة / Definitions & Roles | ✓ | ✓ | ✓ | معطل |
| STD-02 | الغرض والحدود / Purpose & Scope | ✓ | ✓ | ✓ | يمد البيانات فقط |
| STD-03 | طبيعة الدعوة وعدم إبرام عقد تلقائي / Solicitation Nature | ✓ | ✓ | ✓ | معطل |
| STD-04 | مواعيد الإغلاق وطرق التسليم / Deadlines & Submission | ✓ | ✓ | ✓ | يحدد التاريخ لا النص القانوني |
| STD-05 | استيضاحات وتعديلات / Clarifications & Addenda | ✓ | ✓ | ✓ | معطل |
| STD-06 | سرية وسلامة بيانات المتنافسين / Bid Confidentiality | ✓ | ✓ | ✓ | معطل |
| STD-07 | الإفصاح عن المصالح / Conflict of Interest | ✓ | ✓ | ✓ | معطل |
| STD-08 | تأهيل المتنافس / Qualification Evidence | ✓ | ✓ | ✓ | يحدد متطلبات الاختيار ضمن الحدود |
| STD-09 | الاستثناءات والبدائل / Deviations & Alternates | وصف | مفصل | مفصل | يختار السماح بالبدائل |
| STD-10 | منهجية تقييم موضوعية / Evaluation | استكشاف | فني وتجاري | امتثال ثم سعر/قيمة | يحدد أوزاناً قبل الإصدار |
| STD-11 | الضريبة وشمول الأسعار / Tax & Price Presentation | تقديري فقط | تفصيل | تفصيل إلزامي في نموذج السعر | معطل، فني/قانوني |
| STD-12 | الملاحق ومرجع الإصدار / Annex & Revision Control | ✓ | ✓ | ✓ | معطل |
| STD-13 | التراخيص والاشتراطات المحلية / Authority Requirements | تحذير عند الانطباق | ✓ | ✓ | معطل؛ RulePack |
| STD-14 | حماية البيانات وحدود التوزيع / Privacy & Redactions | ✓ | ✓ | ✓ | يحدد الإفصاح ضمن ضوابط |
| STD-15 | عدم التحيز وإثبات القرار / Fair Evaluation Record | ✓ | ✓ | ✓ | المراجعة/القرار حسب الدور |

**النص المحايد المقترح لـ STD-03 (AR):** «تُطرح هذه الوثيقة لغرض تلقي [معلومات/مقترحات/عروض أسعار] وفق نطاقها ومرفقاتها. ولا يُفهم من إصدارها أو استلام رد أو اختيار متقدم أن علاقة تعاقدية نافذة قد نشأت بمجرد ذلك؛ وتخضع أي علاقة تعاقدية لاحقة للاتفاق والإجراءات والصيغ المعتبرة قانوناً». **تُراجع هذه العبارة من محامٍ محلي وتعدل بحسب الاتفاق والوقائع قبل الإصدار.**

**STD-03 (EN – draft):** “This document is issued to solicit [information/proposals/quotations] solely for its stated purpose. Issuing the document, receiving a response, or selecting a respondent does not by itself constitute execution of a binding agreement. Any subsequent contractual relationship is subject to separately completed applicable legal and contractual formalities.” **Counsel review required.**

**النص المقترح لـ STD-14 (AR):** «تستخدم المعلومات التي يُفصح عنها لأغراض هذا الطلب، وتُعامل المستندات المصنفة بوصفها مقيدة حسب سياسة السرية المعلنة. ولا يحق للمتنافس الاطلاع على عرض منافس آخر أو بيانات المالك الشخصية إلا بترخيص مستقل وبالحد الأدنى اللازم». **يجب ضبط واجبات وحالات إفصاح القانون بصورة ملائمة.**

## B. Local Overlay — الملحقات المحلية (مبدأ الإدراج)

كل Overlay يحتاج `{emirate, competent_authority, trigger, source, source_date, rulepack_version, application_note, verifier, review_status}`. أدناه **مفاتيح وأسئلة تحقق** لا تقرر شروطاً ملزمة دون فحص.

| Rule Candidate | إمارة / مصدر رسمي | Trigger في ORB | نص إدراج مقترح في المسودة (مشروط وغير قانوني بعد) | Approval Gate |
|---|---|---|---|---|
| DUB-BP-01 | دبي — DM Building Permit Steps / DBC | دبي + بناء جديد/توسعة ضمن اختصاص DM | «يتولى المختص التحقق من رخصة البناء/المخططات والكود المعمول به قبل التنفيذ، وتحديد ما يلزم من مستندات المشروع» | تحديد جهة الترخيص، نوع الأرض، نسخة DBC ومصدر الاشتراط |
| ADB-PV-01 | أبوظبي — DMT Private Villa Guidance / 2025 change | أبوظبي + سكن خاص + أعمال تتعلق بالتصميم/الملاحق | «تراجع الأحكام الفنية للسكن الخاص والإضافات والملاحق تبعاً لقسيمة الموقع ونوع العمل والإصدارات السارية» | مهندس مرخص يحدد التواريخ والانطباق؛ لا أرقام ثابتة |
| SHJ-BP-01 | الشارقة — Municipality service directory | مدينة/منطقة مختصة + رخصة/إضافة/صيانة | «يوثق الاستشاري قائمة المخططات والمرفقات المطلوبة للمعاملة المحددة، دون فرض وثائق غير ذات صلة» | تصنيف الخدمة والجهة والتحقق من القائمة الأصلية |
| AJM-BP-01 | عجمان — Municipality Building Permit Request | بناء جديد/إضافة + سلطة عجمان | «يراعي استشاري المشروع متطلبات المخططات والعقود والإجراءات الخدمية اللازمة لرخصة البناء بحسب الحالة» | تطابق مع نوع الخدمة والمستندات السارية |
| RAK-BP-01 | رأس الخيمة — RAK Sanad & Architectural Regulations | بناء في نطاق البلدية / تصريح جديد | «يُراجع المختص متطلبات تصريح البناء والاشتراطات المعمارية المطبقة على نوع المبنى والموقع» | التحقق من اللائحة السارية وملفات الخدمة |
| FUJ-BP-01 | الفجيرة — Fujairah Municipality new building permit | أعمال رخصة بناء في نطاق بلدية الفجيرة | «تُحدد الوثائق والموافقات الهندسية والخدمية المطلوبة عند التقديم لطلب الترخيص بحسب موقع وطبيعة المشروع» | التأكد من الحالة والمرفقات، ولا فرض عقد موقع قبل مرحلة التعاقد |
| UAQ-UNV-01 | أم القيوين — تفصيل رسمي محلي غير متحقق في هذه الدراسة | أي مشروع أم القيوين | **لا يُدرج نص محلي ملزم آلياً.** يفتح طلب تحقق للجهة المختصة | تحقيق المصدر الرسمي وتحديد الاختصاص قبل إصدار ملحق |

### نصوص شرطية / Examples of correct clause usage
**مثال عند طرح أعمال بناء في الفجيرة:** ينص النموذج على أن المتقدم «يبيّن قدرته على تجهيز الوثائق والموافقات المطلوبة عند مرحلة الترخيص وفق الجهة المختصة»، *وليس* «يلزم إرفاق عقد مقاولة موقع مع RFP الآن»؛ قد تستلزم خدمة الترخيص وجود عقد موقع **لاحقاً بعد الترسية**.

**مثال عند رغبة مالك أبوظبي بمجلس أو مسبح:** تتضمن قائمة فحوص فنية «يراجع الاختصاص التنظيمي والاشتراطات المطبقة على الملحق/المرفق وفق بيانات القسيمة»، ولا تُدرج حدود ارتدادات أو ارتفاعات ثابتة بلا تحقق.

### مصادر رسمية تربط لكل Overlay
- DUB-BP-01: https://www.dm.gov.ae/municipality-business/building-permit-steps/ ؛ https://www.dm.gov.ae/municipality-business/planning-and-construction/dubai-building-code-2/
- ADB-PV-01: https://www.dmt.gov.ae/en/Media-Centre/News/Department-of-Municipalities-and-Transport-Announces-Amendments-to-Private-Villas-Regulations
- SHJ-BP-01: https://shjmun.gov.ae/servicedirectory/details/683d3a96ff3e1753c064e6fe
- AJM-BP-01: https://www.am.gov.ae/en/services/building-permit-request/
- RAK-BP-01: https://sanad.mun.rak.ae/docs/en/services-card-english-temp-49
- FUJ-BP-01: https://portal.fujmun.gov.ae/OnlineEservices/En/Eservice/ServicePages/service_information.aspx?serviceid=81
- UAQ-UNV-01: https://u.ae/en/information-and-services/justice-safety-and-the-law/building-safety (general jurisdiction guidance only)

## C. Rule application and governance
1. **Match** site emirate and municipal/special jurisdiction + service + project phase.
2. **Verify** official source and text applicable on the contemplated issue date.
3. **Classify** obligatory vs procedural guidance vs optional preferred specification.
4. **Generate** a neutral annex with verified obligations, do not rewrite or paraphrase law as binding text without counsel approval.
5. **Flag** missing, contradictory or superseded sources as `BLOCK_ISSUE` (for mandatory clause) or `REFER_FOR_REVIEW`.
6. **Freeze** the RulePack version in the document; a new legal change triggers impact assessment/addendum, not silent rewriting.

## D. Legal review checklist
- [ ] Correct property and competent permitting authority (including special development areas).
- [ ] Correct type of procurement vs actual regulatory permit step.
- [ ] Current legislation and mandatory technical code version identified.
- [ ] No claim of blanket compliance with all emirates or guaranteed permits.
- [ ] Appropriate privacy, liabilities, commercial conditions and dispute-management drafting checked by qualified local counsel.
- [ ] Owner-specific choices do not override binding rules or exceed authorization.
- [ ] Final Arabic-English conflict/precedence language reviewed if bilingual documents are used.