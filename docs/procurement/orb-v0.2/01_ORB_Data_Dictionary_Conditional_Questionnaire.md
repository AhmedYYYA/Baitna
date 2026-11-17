# بيتنا | BAITNA — Owner Requirements Brief (ORB)
## قاموس البيانات والاستبيان الذكي المتفرع | Data Dictionary & Conditional Questionnaire

**الإصدار:** DTD 0.2 — 17 نوفمبر 2026  
**الحالة:** تصميم تفصيلي قيد المراجعة؛ **لم تُفعّل هذه الوظائف برمجياً**.  
**المرجعية المعتمدة:** ADR-001 (ملف متطلبات المالك المصدر الموحد لـ RFI/RFP/RFQ).

### 1. المبادئ
1. ينشأ ORB **لكل مشروع** من مشاريع المسكن؛ Home ID دائم لكن متطلبات مشروع البناء قد تختلف عن متطلبات صيانته. لا تنسخ المتطلبات الخاصة بمشروع على كل المشاريع تلقائياً.
2. تدخل بيانات المالك مرة واحدة، ويحفظ كل تعديل في إصدار جديد. التعديل بعد إصدار طلب طرح **لا يغير الوثيقة المصدرة**؛ يستوجب ملحقاً/إصداراً جديداً وإخطار جميع المتنافسين المتأثرين.
3. تقتصر الواجهة المبسطة على القرارات المعبرة عن احتياجات المالك؛ تفاصيل الأكواد ومراجعات الترخيص والنماذج القانونية يضبطها المختص. الحالة `required` تتغير حسب المرحلة ونوع الوثيقة.
4. البيانات القانونية مثل وثيقة الملكية والهوية التفصيلية لا تُطلب في GitHub Pages أو تُعرض للمنافسين ما لم تدعُ ضرورة موثقة إلى ذلك؛ تُكتفى في ORB غالباً بإشارة «متوفر/غير متوفر».
5. لا يُعد رمز Home ID دليلاً على ملكية العقار؛ ويتطلب إصدار وثائق حقيقية التحقق من الصفة والتفويض وآليات الخصوصية.

### 2. مستويات الإلزام
- `always`: يسأل عنه مبكراً (قد يظل قيمته `unknown` في المسودة إلا إذا كانت مدخلاً حاسماً).
- `when_available`/`if_known`: لا تحجب الاستكشاف المبكر، لكن تُبرز فجوة قبل إصدار RFQ نهائي.
- `pre_issue`: إلزام عند إرسال الوثيقة، بعد مراجعة البند على حالة المشروع.
- `rfp`/`rfq`: يطلب عند إنشاء هذه الأداة فقط.
- `professional_review`: بند من إعداد/تحقق مهني؛ لا يُترك للمالك لكتابة قاعدة تنظيمية.

### 3. جدول الحقول الشامل
**ملحوظة:** رموز القيود المدوّنة في `شرط الإظهار` هي قواعد منطقية للتصميم، لا نصوص قانونية. تصنيف `private` أو `restricted` يعني عدم إدراج الحقل تلقائياً في المخرجات الموجهة للمنافسين.

| Field ID | العربية / English | النوع | شرط الإظهار | تعديل المالك | مراجعة المختص | الحساسية | الاستخدام |
|---|---|---|---|---|---|---|---|
| `orb_id` | معرّف ملف المتطلبات / ORB ID | `uuid` | `system` | لا | لا | `internal` | ALL |
| `orb_revision` | إصدار المتطلبات / ORB revision | `integer` | `system` | لا | لا | `internal` | ALL |
| `home_id` | معرّف المسكن الدائم / Permanent Home ID | `uuid` | `system` | لا | لا | `internal` | ALL |
| `project_id` | معرّف المشروع / Project ID | `uuid` | `system` | لا | لا | `internal` | ALL |
| `owner_display_name` | اسم المالك الظاهر / Owner display name | `text` | `always` | نعم | قراءة | `private` | ALL |
| `owner_contact_method` | وسيلة التواصل / Preferred contact method | `enum` | `always` | نعم | قراءة مأذونة | `private` | ALL |
| `preferred_language` | لغة الوثيقة / Document language | `enum` | `always` | نعم | نعم | `normal` | ALL |
| `owner_role_verified` | صفة وحق إصدار الطلب / Authority to issue | `boolean` | `pre_issue` | لا | إقرار والتحقق | `restricted` | ALL |
| `emirate` | الإمارة / Emirate | `enum` | `always` | نعم | نعم | `normal` | ALL |
| `municipality_area` | المدينة أو المنطقة البلدية / Municipal area | `text` | `always` | نعم | نعم | `normal` | ALL |
| `competent_authority` | الجهة المختصة بالترخيص / Competent permitting authority | `authority_id` | `pre_issue` | عرض | تحقق/اعتماد | `restricted` | ALL |
| `plot_number` | رقم القسيمة/الأرض / Plot reference | `text` | `when_available` | نعم | تحقق | `restricted` | RFP,RFQ |
| `plot_area_sqm` | مساحة الأرض م² / Plot area m2 | `decimal` | `if_plot_known` | نعم | تحقق | `restricted` | RFP,RFQ |
| `site_location` | الموقع العام للمشروع / Project general location | `text` | `always` | نعم | نعم | `normal` | ALL |
| `tenure_document_available` | توفر مستند يثبت حق التصرف / Entitlement evidence available | `boolean` | `pre_issue` | نعم | تحقق في بيئة آمنة | `restricted` | RFP,RFQ |
| `approval_stage` | حالة الموافقات / Permit status | `enum` | `always` | نعم | تحقق | `restricted` | ALL |
| `project_type` | نوع المشروع / Project type | `enum` | `always` | نعم | نعم | `normal` | ALL |
| `procurement_target` | فئة المتنافسين / Sourcing target | `enum` | `always` | نعم | نعم | `normal` | ALL |
| `deliverable_goal` | النتيجة المطلوبة / Expected outcome | `text` | `always` | نعم | تحرير منضبط | `normal` | ALL |
| `project_maturity` | نضج النطاق / Scope maturity | `enum` | `always` | نعم | تحقق | `normal` | ALL |
| `design_docs_available` | توفر المخططات / Available design documents | `multi_enum` | `always` | نعم | تحقق | `restricted` | RFP,RFQ |
| `new_vs_existing` | حالة المسكن / Site condition | `enum` | `always` | نعم | نعم | `normal` | ALL |
| `target_start_date` | تاريخ البدء المستهدف / Target start date | `date` | `if_known` | نعم | نعم | `normal` | RFP,RFQ |
| `target_completion_date` | تاريخ التسليم المستهدف / Target handover date | `date` | `if_known` | نعم | نعم | `normal` | RFP,RFQ |
| `occupancy_constraints` | القيود أثناء السكن / Occupancy constraints | `multi_enum` | `existing_occupied` | نعم | تفصيل فني | `restricted` | RFP,RFQ |
| `gross_floor_area_sqm` | إجمالي المساحة التقريبية م² / Indicative GFA m2 | `decimal` | `new_build|extension|renovation` | نعم | تحقق هندسي | `normal` | RFI,RFP,RFQ |
| `floors` | الطوابق المرغوبة / Desired floors | `integer` | `new_build|extension` | نعم | تحقق تنظيمي | `normal` | RFP,RFQ |
| `bedrooms` | عدد غرف النوم / Bedrooms | `integer` | `residential_design` | نعم | توضيح | `normal` | RFP |
| `bathrooms` | عدد دورات المياه / Bathrooms | `integer` | `residential_design` | نعم | توضيح | `normal` | RFP |
| `majlis_requested` | مجلس مستقل / Separate majlis | `boolean` | `residential_design` | نعم | تفاصيل | `normal` | RFP,RFQ |
| `majlis_area_sqm` | مساحة المجلس م² / Majlis area m2 | `decimal` | `majlis_requested` | نعم | تحقق | `normal` | RFP,RFQ |
| `service_annex_requested` | ملحق خدمات / Service annex | `boolean` | `residential_design` | نعم | تحقق | `normal` | RFP,RFQ |
| `basement_requested` | سرداب / Basement | `boolean` | `residential_design` | نعم | تحقق | `normal` | RFP,RFQ |
| `pool_requested` | مسبح / Swimming pool | `boolean` | `residential_design` | نعم | تحقق | `normal` | RFP,RFQ |
| `pool_type` | نوع المسبح / Pool type | `enum` | `pool_requested` | نعم | نعم | `normal` | RFP,RFQ |
| `lift_requested` | مصعد / Lift | `boolean` | `residential_design` | نعم | تفصيل فني | `normal` | RFP,RFQ |
| `lift_served_levels` | المستويات المخدومة / Lift served levels | `integer` | `lift_requested` | نعم | تحقق | `normal` | RFP,RFQ |
| `smart_home_requested` | نظام منزل ذكي / Smart home system | `boolean` | `residential_design` | نعم | تفصيل فني | `normal` | RFP,RFQ |
| `smart_home_scope` | نطاق المنزل الذكي / Smart home scope | `multi_enum` | `smart_home_requested` | نعم | نعم | `normal` | RFP,RFQ |
| `solar_requested` | الطاقة الشمسية / Solar PV | `boolean` | `residential_design` | نعم | تفصيل فني | `normal` | RFP,RFQ |
| `ev_charger_requested` | شاحن مركبة كهربائية / EV charger | `boolean` | `residential_design` | نعم | تفصيل فني | `normal` | RFP,RFQ |
| `accessibility_requested` | تهيئة وصول شامل / Accessibility needs | `boolean` | `always` | نعم | تحقق فني | `restricted` | RFP,RFQ |
| `finish_tier` | مستوى التشطيبات / Finish tier | `enum` | `construction_related` | نعم | نعم | `normal` | RFP,RFQ |
| `materials_preferences` | تفضيلات المواد / Preferred materials | `text` | `if_known` | نعم | تحقق فني | `normal` | RFP,RFQ |
| `design_style` | الطراز المعماري / Architectural style | `enum` | `design_related` | نعم | نعم | `normal` | RFP |
| `energy_goals` | أهداف كفاءة الطاقة / Energy goals | `multi_enum` | `construction_related` | نعم | تحقق | `normal` | RFP,RFQ |
| `quality_standards` | المعايير المرجعية / Quality standards | `reference_list` | `professional_review` | عرض | تحرير موثق | `restricted` | RFP,RFQ |
| `budget_band_aed` | نطاق الميزانية المستهدفة / Indicative budget range AED | `range` | `always` | نعم | تعليق فني | `private` | RFI,RFP,RFQ |
| `budget_visibility` | إظهار الميزانية للمتنافس / Budget disclosure mode | `enum` | `always` | نعم | نعم | `private` | ALL |
| `quotation_basis` | أساس التسعير / Quotation basis | `enum` | `rfq` | نعم | تحقق وإقرار | `normal` | RFQ |
| `pricing_method` | طريقة التسعير / Pricing method | `enum` | `rfp|rfq` | نعم | تحقق | `normal` | RFP,RFQ |
| `currency` | العملة / Currency | `enum` | `always` | لا | مراجعة | `normal` | ALL |
| `tax_display_rule` | قاعدة بيان الضريبة / VAT quotation presentation | `enum` | `rfp|rfq` | عرض | تحقق قانوني | `normal` | RFP,RFQ |
| `contingency_preference` | احتياطي المخاطر / Contingency budget preference | `percent` | `if_budget` | نعم | توصية | `private` | RFP |
| `payment_preference` | تفضيل دفعات الإنجاز / Payment preference | `enum` | `construction_related` | نعم | تحقق | `private` | RFP |
| `warranty_preference` | تفضيلات الضمان / Warranty preferences | `text` | `construction_related` | نعم | تحقق قانوني | `normal` | RFP,RFQ |
| `weight_quality` | وزن الجودة / Quality weight | `integer` | `rfp` | نعم | اعتماد مبرر | `restricted` | RFP |
| `weight_price` | وزن السعر / Price weight | `integer` | `rfp` | نعم | اعتماد مبرر | `restricted` | RFP |
| `weight_schedule` | وزن الزمن / Schedule weight | `integer` | `rfp` | نعم | اعتماد مبرر | `restricted` | RFP |
| `weight_experience` | وزن الخبرة / Experience weight | `integer` | `rfp` | نعم | اعتماد مبرر | `restricted` | RFP |
| `prequalification` | متطلبات التأهيل / Prequalification requirements | `multi_enum` | `always` | نعم | مراجعة | `normal` | ALL |
| `evaluation_mode` | منهجية المفاضلة / Evaluation approach | `enum` | `always` | نعم | تدقيق قبل الإصدار | `normal` | RFP,RFQ |
| `solicitation_type` | نوع وثيقة الطلب / Instrument | `enum` | `generation` | نعم | نعم | `normal` | ALL |
| `bid_deadline` | آخر موعد لاستلام الردود / Bid response deadline | `datetime` | `pre_issue` | نعم | تأكيد | `normal` | ALL |
| `clarification_deadline` | آخر موعد للاستفسارات / Clarification cut-off | `datetime` | `pre_issue` | نعم | تأكيد | `normal` | ALL |
| `bid_validity_days` | مدة صلاحية العرض المطلوبة / Requested offer validity days | `integer` | `rfp|rfq` | نعم | مراجعة | `normal` | RFP,RFQ |
| `site_visit_requirement` | زيارة موقع اختيارية/إلزامية / Site visit rule | `enum` | `construction_related` | نعم | مراجعة | `normal` | ALL |
| `submission_channels` | قنوات تقديم العرض / Submission channels | `enum` | `pre_issue` | عرض | تعريف من النظام | `normal` | ALL |
| `confidentiality_level` | تصنيف سرية العروض / Bid confidentiality | `enum` | `always` | لا | مسؤول نظام | `restricted` | ALL |
| `owner_special_notes` | ملاحظات المالك / Owner special requirements | `text` | `always` | نعم | تصنيف البنود | `private` | ALL |
| `allowed_alternatives` | السماح بعروض بديلة / Alternative offers allowed | `boolean` | `rfp|rfq` | نعم | نعم | `normal` | RFP,RFQ |
| `attachments_reference` | فهرس المستندات المرفقة / Attachment manifest | `reference_list` | `pre_issue` | نعم | تأكيد | `restricted` | ALL |
| `rulepack_version` | إصدار مكتبة الاشتراطات / Rulepack version | `text` | `system` | لا | اعتماد | `internal` | ALL |
| `template_version` | إصدار القالب القياسي / Template version | `text` | `system` | لا | اعتماد | `internal` | ALL |
| `legal_review_status` | حالة المراجعة القانونية / Legal review status | `enum` | `pre_issue` | لا | مراجع قانوني | `restricted` | ALL |
| `technical_review_status` | حالة المراجعة الفنية / Technical review status | `enum` | `pre_issue` | لا | مراجع فني | `restricted` | ALL |
| `issue_authorization` | تفويض إصدار الطلب / Issue authorization | `boolean` | `pre_issue` | لا | جهة مخولة | `restricted` | ALL |

### 4. فحوص التحقق من صحة البيانات (أمثلة)
| Rule ID | تحقق | معالجة التعارض |
|---|---|---|
| ORB-V01 | Emirates Code من سبع قيم مسموحة | يمنع إصدار RulePack بلا تحديد الإمارة |
| ORB-V02 | project_id مرتبط بـ home_id نفسه | رفض الاستعلام المتقاطع والرفع غير المصرّح به |
| ORB-V03 | completion_date بعد start_date | تحذير أو تصحيح بناءً على المدخلات |
| ORB-V04 | مجموع أوزان RFP = 100% عند استخدام المفاضلة الوزنية | يمنع نشر جدول مفاضلة غير متسق |
| ORB-V05 | max_budget ≥ min_budget عند الإظهار | تصحيح الميزانية أو إخفاؤها وفق الخيار |
| ORB-V06 | RFQ نهائي يتطلب نطاقاً محدداً + وحدة كمية + معيار قبول + استثناءات | تحويل الطلب إلى Budgetary RFQ أو RFP بدل ادعاء سعر ثابت |
| ORB-V07 | تاريخ الاستيضاحات يسبق تاريخ الإغلاق | تمنع الوثيقة غير الصالحة |
| ORB-V08 | المطالبات القانونية والتنظيمية تحتاج مصدر + نسخة + اختصـاص + مراجعة | حظر الادعاء بـ «مطابقة قانونية» |
| ORB-V09 | استخدام مسبح/مصعد/سرداب قد يغير مخاطر الترخيص | يوجّه مراجعة فنية؛ **لا** يخترع حد ارتداد أو ارتفاع |
| ORB-V10 | تناقض المالك مع بند mandatory | منع الإصدار حتى قرار بشري؛ تعديل خيار المالك وليس البند الملزم |

### 5. رحلة الاستبيان (Owner UX: 6 شاشات قصيرة)
**خطوة 1 — المسكن والمشروع**: الإمارة، المنطقة، نوع المشروع، الجهة المستهدفة، وضع الأرض والمسكن.  
**خطوة 2 — ماذا تريد؟**: اختيار بناء/تصميم/إشراف/صيانة، المساحات المرجعية والطوابق، مستوى النضج.  
**خطوة 3 — ماذا يهمك؟**: الميزانية، مستوى التشطيبات، جودة/سعر/زمن/ضمان، تفضيل السعر الشامل/بالوحدات.  
**خطوة 4 — إضافات اختيارية**: مجلس، ملحق، مسبح، مصعد، سرداب، منزل ذكي، طاقة شمسية، شاحن كهربائي؛ تُعرض أسئلة تابعة لكل اختيار فقط.  
**خطوة 5 — ما الذي تريد من السوق؟**: RFI أو RFP أو RFQ، المتنافسون، مستوى الإفصاح، موعد الإغلاق والمعايير.  
**خطوة 6 — مراجعة الملخص**: ما أدخله المالك، بيانات ناقصة، قواعد محلية قيد التحقق، البنود القانونية القياسية، ملخص الإفصاح للمنافس، وإحالة للمختص قبل الإصدار.

### 6. الأسئلة المتفرعة (Conditional Branching)
| Trigger | سؤال/ملحق إضافي | الاعتماد على المختص |
|---|---|---|
| `project_type = new_build` | موقع القسيمة والتصاميم والملاحق والمساحة والطوابق | اختبار صلاحية المخططات/الترخيص |
| `project_type = maintenance` | حالة المبنى، المجال، استمرارية الخدمات، الضمانات | متطلبات تصريح الصيانة إن كانت تنطبق |
| `new_vs_existing = existing_occupied` | حدود الدخول والضجيج والسلامة وحماية السكان | خطط السلامة والتخطيط |
| `pool_requested = true` | داخلي/خارجي، الحجم التقريبي، السلامة، المعالجة، الصيانة | مراجعة الجهة والأنظمة ذات الصلة |
| `lift_requested = true` | عدد المستويات، الأبعاد/الحمولات المرجعية، خطة الصيانة | مصمم مرخص ومتطلبات السلامة |
| `basement_requested = true` | توافر فحص التربة، عزل المياه، مخاطر الحفر | مهندس إنشائي/جيوتقني |
| `smart_home_requested = true` | الأنظمة المرغوبة، الربط، أمن البيانات، الضمان | أمن أنظمة المنزل والتكامل |
| `solar_requested = true` | سعة تقريبية، مظلات، نمط الربط | الجهة الخدمية المختصة |
| `project_maturity = idea|concept` | عدم ادعاء BOQ نهائي؛ توجيه إلى RFI/RFP أو RFQ تقديري | تخمين التكلفة مصرح بأنه تقديري |
| `project_maturity = itemized_boq` | الوحدات والكميات والإصدارات ومرجعية المواصفات | يمكن طلب RFQ مفصل |
| `procurement_target = supervision_consultant` | الخبرة والكادر المهني ومسؤوليات الفحص وعدم تضارب المصالح | اعتماد شروط المهنية |

### 7. التحكم في الإصدارات والصلاحيات
- نمط السجل: `DRAFT → OWNER_CONFIRMED → PROFESSIONAL_REVIEW → APPROVED_FOR_GENERATION`؛ أي تغيير جوهري بعد الإقرار يُنشئ مراجعة جديدة.
- المالك يعدل تفضيلات المسكن والميزانية والتواريخ وتقييم العروض؛ الاستشاري يعدل الوصف الفني فقط تحت تفويض وسجل تدقيق؛ القانوني يعدل **مكتبة القوالب** وليس مدخلات كل مالك بحرية.
- عند طلب الإصدار:  `ORB_ID + revision + classification + template_version + jurisdiction_rulepack_version + issue_date + signoff`. دون ذلك تظل الوثيقة **مسودة غير صالحة للإرسال**.
- ليس الاعتماد داخل المنصة بديلاً عن التوقيع العقدي أو موافقة جهة الترخيص.

### 8. واجهة المختص (Professional Mode)
لوحة تناظر الاستبيان نفسه وتضيف: مرجعية المخططات، المواصفات الموحدة، أعمال BOQ، RFP evaluation rubric، الجهة المختصة، مصدر كل قاعدة، تاريخ سريان النص، المراجعات، التعارضات وقوائم الإجراءات. أي عنصر ملزم بلا مصدر يُوسم `UNVERIFIED` ويُوقف المخرجات النهائية.

### 9. سياسة الخصوصية والإفصاح
- `public_to_bidders`: وصف المشروع على مستوى مناسب ومواصفات قابلة للتنفيذ دون هوية شخصية أو أرقام وثائق حساسة.
- `restricted_owner_team`: أرقام الأرض والميزانية المخفية والمستندات وملاحظات المالك الخاصة؛ لا تنتقل إلى المنافسين.
- `bidder_sealed`: عرض كل مورد لا يطلع عليه أي منافس آخر، مع صلاحيات تقييم مقيدة زمنياً.
- النسخة على GitHub Pages عامة **ولا يجوز إدخال بيانات أشخاص حقيقية فيها**.

### 10. مخرجات الاستبيان
1. `ORB structured snapshot` غير قابل للتبديل بعد إصدار الوثيقة. 2. ملخص بيانات مالك واضح. 3. قائمة مدخلات ناقصة. 4. قائمة احتياجات مراجعة محلية. 5. توصية RFI/RFP/RFQ تفسيرية قابلة للتجاوز بتبرير. 6. سجل إفصاح يحدد بدقة ما يدخل في الوثيقة وما يبقى محجوباً.