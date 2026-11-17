# BAITNA | بيتنا — حزمة التصميم التفصيلي لنماذج مرحلة ما قبل التعاقد
**الإصدار:** ORB / Procurement DTD 0.2 — 17 نوفمبر 2026  
**المجال:** Approved product path → detailed specification, **NOT software implementation**.  
**مرجعية الاعتماد:**  `ADR-001 Owner Requirements + Governed Standard Templates` [17-11-2026].

## ما هو المنجز؟
- قاموس ORB من **77 حقلاً** عربي/إنجليزي مع أنواع البيانات، شروط الظهور، صلاحيات تعديل المالك والمختص، الحساسية، والوثائق التي تستفيد من كل حقل.
- استبيان مالك مبسط من 6 خطوات وأسئلة شرطية تتعلق بالمسبح والمصعد والملاحق والسرداب والمنزل الذكي وغيرها.
- مسودات ثلاثة نماذج قياسية مكتملة الأقسام: **RFI / RFP / RFQ**، تشمل متن الخطاب والاستجابة والمرفقات ومعايير المراجعة، مع تمييز RFQ التقديري/المحدد.
- سجل مراجع للإمارات السبع، مع مصدر رسمي، **ودون اختراع نصوص محلية أو وصف المستند بأنه معتمد قانونياً**.
- سير عمل للتوليد والمراجعة والإصدار والاستيضاحات والتقييم والملاحق والترحيل إلى عقد/SOW/IMS، مع **18 اختبار قبول**.
- ملف JSON هيكلي لـ ORB يوضح ما يلتقطه النظام ويحفظه في خدمة خاصة لاحقاً.

## الترتيب المقصود
**Permanent Home ID → Project → ORB snapshot → (RFI and/or RFP and/or RFQ) → secure bidder submissions → evaluation → selection → separately approved Contract + SOW + BOQ + IMS → execution → home passport.**

## الملفات
1. `01_ORB_Data_Dictionary_Conditional_Questionnaire.md`: Owner UX + field catalogue.
2. `02_RFI_Standard_Template_AR_EN.md`: نموذج جمع المعلومات.
3. `03_RFP_Standard_Template_AR_EN.md`: نموذج المقترح الفني والتجاري والمفاضلة.
4. `04_RFQ_Standard_Template_AR_EN.md`: نموذج التسعير التقديري أو المحدد وقائمة الكميات.
5. `05_UAE_Jurisdiction_Rule_Register.md`: تصنيف مصدر الجهة المحلية ومدى التحقق.
6. `06_Document_Engine_Workflow_Traceability_Acceptance.md`: آلية إنشاء الوثيقة والتتبع والاختبارات.
7. `orb_data_contract_draft.json`: شكل بيانات ORB الأولي مع تعليق توثيقي بواسطة مفاتيح `_note`.
8. `07_Controlled_Clauses_Emirate_Overlays.md`: Standard clause IDs and jurisdictional conditional annexes.
9. `08_Illustrative_ORB_to_Tender_Examples.md`: Three synthetic walkthroughs illustrating applicability and issue gates.
10. `orb_field_catalogue.csv`: قاموس حقول قابل للمراجعة في نظام بيانات/جداول، وهو وصف للحقول لا بيانات مالك.

## حدود قانونية/تقنية حاسمة
- **القوالب هي Drafts للمراجعة القانونية والفنية وليست عقوداً أو نماذج مُجازة من بلدية أو جهة حكومية.**
- **مصادر التنظيم المحلية مؤشرات بحث**؛ لا تصبح شرطاً إلزامياً في أداة توليد حتى تؤكد سلطة الاختصاص ونسخة المتطلب وتاريخ نفاذه ومراجعة المختص.
- **لا برنامج توليد وثائق أو استبيان ORB تشغيلـي قد أضيف إلى التطبيق في هذه المرحلة.**
- الواجهة العامة على GitHub Pages لا يجوز استخدامها لاستقبال بيانات أرض/ملكية/هوية أو عروض شركات حقيقية.
- التصنيف الصحيح لتقدير سعر مبكر يختلف عن عرض سعر محدد قابل للمقارنة؛ ولا يصح الخلط بينهما.

## القرارات المطلوبة عند بدء البرمجة
- Provider للهوية والأدوار والخوادم الخاصة، مع آلية نسخ للمستندات وحماية المتنافسين.
- اعتماد مراجعة قانونية/هندسية للقوالب وقواعد الإدراج لكل إمارة.
- تحديد ما يعتمده المالك مباشرة وما لا يجتاز المراجعة إلا بمختص مفوّض.
- تحديد سياسات الحد الأدنى من البيانات ومتى تُتاح صورة الأرض أو المخططات للمنافس.

### مراجع الإجراء
- الإمارات: https://u.ae/en/information-and-services/justice-safety-and-the-law/building-safety
- Dubai Municipality: https://www.dm.gov.ae/municipality-business/building-permit-steps/
- Abu Dhabi DMT: https://www.dmt.gov.ae/en/Media-Centre/News/Department-of-Municipalities-and-Transport-Announces-Amendments-to-Private-Villas-Regulations
- Ajman Municipality: https://www.am.gov.ae/en/services/building-permit-request/
- RAK Municipality: https://sanad.mun.rak.ae/docs/en/services-card-english-temp-49
- Fujairah Municipality: https://portal.fujmun.gov.ae/OnlineEservices/En/Eservice/ServicePages/service_information.aspx?serviceid=81

**هذه حزمة تصميم تفصيلي قبل البرمجة.**