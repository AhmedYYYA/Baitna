// Catalog generated from approved 77-field ORB DTD v0.2; internal metadata, not regulatory decisions.
window.BAITNA_ORB_CATALOG = [
  {
    "group": "CORE",
    "id": "orb_id",
    "ar": "معرّف ملف المتطلبات",
    "en": "ORB ID",
    "type": "uuid",
    "condition": "system",
    "validation": "غير قابل للتعديل",
    "ownerEditable": false,
    "sensitivity": "internal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "CORE",
    "id": "orb_revision",
    "ar": "إصدار المتطلبات",
    "en": "ORB revision",
    "type": "integer",
    "condition": "system",
    "validation": "يبدأ من 1 ويزداد عند الاعتماد",
    "ownerEditable": false,
    "sensitivity": "internal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "CORE",
    "id": "home_id",
    "ar": "معرّف المسكن الدائم",
    "en": "Permanent Home ID",
    "type": "uuid",
    "condition": "system",
    "validation": "يرتبط بمسكن واحد ثابت",
    "ownerEditable": false,
    "sensitivity": "internal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "CORE",
    "id": "project_id",
    "ar": "معرّف المشروع",
    "en": "Project ID",
    "type": "uuid",
    "condition": "system",
    "validation": "يخص Home ID نفسه",
    "ownerEditable": false,
    "sensitivity": "internal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "CORE",
    "id": "owner_display_name",
    "ar": "اسم المالك الظاهر",
    "en": "Owner display name",
    "type": "text",
    "condition": "always",
    "validation": "1–120 حرف؛ اسم العرض فقط وليس إثبات ملكية",
    "ownerEditable": true,
    "sensitivity": "private",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "CORE",
    "id": "owner_contact_method",
    "ar": "وسيلة التواصل",
    "en": "Preferred contact method",
    "type": "enum",
    "condition": "always",
    "validation": "in_app|phone|email; no public disclosure",
    "ownerEditable": true,
    "sensitivity": "private",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "CORE",
    "id": "preferred_language",
    "ar": "لغة الوثيقة",
    "en": "Document language",
    "type": "enum",
    "condition": "always",
    "validation": "ar|en|bilingual؛ الأسماء النظامية لا تُترجم آلياً",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "CORE",
    "id": "owner_role_verified",
    "ar": "صفة وحق إصدار الطلب",
    "en": "Authority to issue",
    "type": "boolean",
    "condition": "pre_issue",
    "validation": "توثيق التفويض فقط في خدمة خاصة؛ محاكاة في التصميم",
    "ownerEditable": false,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "emirate",
    "ar": "الإمارة",
    "en": "Emirate",
    "type": "enum",
    "condition": "always",
    "validation": "AD|DU|SH|AJ|RA|FU|UQ",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "municipality_area",
    "ar": "المدينة أو المنطقة البلدية",
    "en": "Municipal area",
    "type": "text",
    "condition": "always",
    "validation": "قيمة من دليل مناطق معتمد؛ لا تخمين الجهة المختصة",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "competent_authority",
    "ar": "الجهة المختصة بالترخيص",
    "en": "Competent permitting authority",
    "type": "authority_id",
    "condition": "pre_issue",
    "validation": "يؤكدها مختص وفق الموقع والنوع",
    "ownerEditable": false,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "plot_number",
    "ar": "رقم القسيمة/الأرض",
    "en": "Plot reference",
    "type": "text",
    "condition": "when_available",
    "validation": "لا يُنشر على منصة عامة؛ حقل خاص مشروط",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "plot_area_sqm",
    "ar": "مساحة الأرض م²",
    "en": "Plot area m2",
    "type": "decimal",
    "condition": "if_plot_known",
    "validation": ">0 و<100000؛ المرجع وثيقة الأرض عند توفرها",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "site_location",
    "ar": "الموقع العام للمشروع",
    "en": "Project general location",
    "type": "text",
    "condition": "always",
    "validation": "المنطقة العامة؛ الإحداثيات الدقيقة اختيارية ومقيدة",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "tenure_document_available",
    "ar": "توفر مستند يثبت حق التصرف",
    "en": "Entitlement evidence available",
    "type": "boolean",
    "condition": "pre_issue",
    "validation": "وجود المستند دون رفعه في العرض العام",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "LOCATION",
    "id": "approval_stage",
    "ar": "حالة الموافقات",
    "en": "Permit status",
    "type": "enum",
    "condition": "always",
    "validation": "unknown|not_started|in_progress|approved|revision_required",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "project_type",
    "ar": "نوع المشروع",
    "en": "Project type",
    "type": "enum",
    "condition": "always",
    "validation": "new_build|extension|renovation|maintenance|design_only|consultancy_only|supply_only",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "procurement_target",
    "ar": "فئة المتنافسين",
    "en": "Sourcing target",
    "type": "enum",
    "condition": "always",
    "validation": "designer|supervision_consultant|main_contractor|subcontractor|supplier|pm",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "deliverable_goal",
    "ar": "النتيجة المطلوبة",
    "en": "Expected outcome",
    "type": "text",
    "condition": "always",
    "validation": "وصف مفهوم لا يتجاوز 1500 حرف",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "project_maturity",
    "ar": "نضج النطاق",
    "en": "Scope maturity",
    "type": "enum",
    "condition": "always",
    "validation": "idea|concept|schematic|detailed_design|approved_drawings|itemized_boq",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "design_docs_available",
    "ar": "توفر المخططات",
    "en": "Available design documents",
    "type": "multi_enum",
    "condition": "always",
    "validation": "none|concept|architectural|structural|mep|approved_as_built|other",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "new_vs_existing",
    "ar": "حالة المسكن",
    "en": "Site condition",
    "type": "enum",
    "condition": "always",
    "validation": "vacant_plot|existing_occupied|existing_vacant",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "target_start_date",
    "ar": "تاريخ البدء المستهدف",
    "en": "Target start date",
    "type": "date",
    "condition": "if_known",
    "validation": "لا يسبق اليوم في إصدار جديد إلا إذا شرح الاستثناء",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "target_completion_date",
    "ar": "تاريخ التسليم المستهدف",
    "en": "Target handover date",
    "type": "date",
    "condition": "if_known",
    "validation": "بعد target_start_date عند توفره",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "PROJECT",
    "id": "occupancy_constraints",
    "ar": "القيود أثناء السكن",
    "en": "Occupancy constraints",
    "type": "multi_enum",
    "condition": "existing_occupied",
    "validation": "noise|hours|safe_access|children|elderly|pets|utilities",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "gross_floor_area_sqm",
    "ar": "إجمالي المساحة التقريبية م²",
    "en": "Indicative GFA m2",
    "type": "decimal",
    "condition": "new_build|extension|renovation",
    "validation": ">0؛ توضيح أنها تقديرية وغير معتمدة",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "floors",
    "ar": "الطوابق المرغوبة",
    "en": "Desired floors",
    "type": "integer",
    "condition": "new_build|extension",
    "validation": "1–10 كحد إدخال تقني فقط لا كحد تنظيمي",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "bedrooms",
    "ar": "عدد غرف النوم",
    "en": "Bedrooms",
    "type": "integer",
    "condition": "residential_design",
    "validation": "0–30 كحد واجهة لا حد قانوني",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "BUILDING",
    "id": "bathrooms",
    "ar": "عدد دورات المياه",
    "en": "Bathrooms",
    "type": "integer",
    "condition": "residential_design",
    "validation": "0–40 كحد واجهة",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "BUILDING",
    "id": "majlis_requested",
    "ar": "مجلس مستقل",
    "en": "Separate majlis",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "يُظهر حزمة أسئلة منفصلة",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "majlis_area_sqm",
    "ar": "مساحة المجلس م²",
    "en": "Majlis area m2",
    "type": "decimal",
    "condition": "majlis_requested",
    "validation": ">0؛ مراجعة المساحة وموقع الملحق",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "service_annex_requested",
    "ar": "ملحق خدمات",
    "en": "Service annex",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "يتطلب مراجعة اشتراطات الملاحق",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "basement_requested",
    "ar": "سرداب",
    "en": "Basement",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "يُظهر أسئلة التربة والمياه الجوفية والإنشاء",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "pool_requested",
    "ar": "مسبح",
    "en": "Swimming pool",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "يُظهر هندسة وسلامة وصيانة وخدمات",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "pool_type",
    "ar": "نوع المسبح",
    "en": "Pool type",
    "type": "enum",
    "condition": "pool_requested",
    "validation": "indoor|outdoor|other",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "lift_requested",
    "ar": "مصعد",
    "en": "Lift",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "يُظهر الوصول والسلامة والأحمال والصيانة",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "lift_served_levels",
    "ar": "المستويات المخدومة",
    "en": "Lift served levels",
    "type": "integer",
    "condition": "lift_requested",
    "validation": ">=2؛ لا يمثل شرطاً تنظيمياً",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "smart_home_requested",
    "ar": "نظام منزل ذكي",
    "en": "Smart home system",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "يُظهر الخصوصية والتكامل والتحديثات",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "smart_home_scope",
    "ar": "نطاق المنزل الذكي",
    "en": "Smart home scope",
    "type": "multi_enum",
    "condition": "smart_home_requested",
    "validation": "lighting|hvac|access|security|energy|other",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "solar_requested",
    "ar": "الطاقة الشمسية",
    "en": "Solar PV",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "يتطلب مراجعة متطلبات الربط المحلية",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "ev_charger_requested",
    "ar": "شاحن مركبة كهربائية",
    "en": "EV charger",
    "type": "boolean",
    "condition": "residential_design",
    "validation": "مراجعة الأحمال والاعتمادات",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "BUILDING",
    "id": "accessibility_requested",
    "ar": "تهيئة وصول شامل",
    "en": "Accessibility needs",
    "type": "boolean",
    "condition": "always",
    "validation": "لا تجمع تفاصيل طبية؛ تُحوّل إلى متطلبات تصميمية وظيفية",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "QUALITY",
    "id": "finish_tier",
    "ar": "مستوى التشطيبات",
    "en": "Finish tier",
    "type": "enum",
    "condition": "construction_related",
    "validation": "essential|standard|premium|bespoke|owner_defined",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "QUALITY",
    "id": "materials_preferences",
    "ar": "تفضيلات المواد",
    "en": "Preferred materials",
    "type": "text",
    "condition": "if_known",
    "validation": "تفضيلات لا تُعرض كمتطلبات إلزامية قانوناً",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "QUALITY",
    "id": "design_style",
    "ar": "الطراز المعماري",
    "en": "Architectural style",
    "type": "enum",
    "condition": "design_related",
    "validation": "contemporary|heritage|modern|other",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "QUALITY",
    "id": "energy_goals",
    "ar": "أهداف كفاءة الطاقة",
    "en": "Energy goals",
    "type": "multi_enum",
    "condition": "construction_related",
    "validation": "thermal|water|solar|smart_meter|other",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "QUALITY",
    "id": "quality_standards",
    "ar": "المعايير المرجعية",
    "en": "Quality standards",
    "type": "reference_list",
    "condition": "professional_review",
    "validation": "لا يختارها المالك كمعايير ملزمة؛ يدرجها المختص",
    "ownerEditable": false,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "budget_band_aed",
    "ar": "نطاق الميزانية المستهدفة",
    "en": "Indicative budget range AED",
    "type": "range",
    "condition": "always",
    "validation": "min>=0؛ max>=min أو undisclosed",
    "ownerEditable": true,
    "sensitivity": "private",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "budget_visibility",
    "ar": "إظهار الميزانية للمتنافس",
    "en": "Budget disclosure mode",
    "type": "enum",
    "condition": "always",
    "validation": "hidden|range|ceiling",
    "ownerEditable": true,
    "sensitivity": "private",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "quotation_basis",
    "ar": "أساس التسعير",
    "en": "Quotation basis",
    "type": "enum",
    "condition": "rfq",
    "validation": "budgetary|firm_based_on_defined_scope",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFQ"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "pricing_method",
    "ar": "طريقة التسعير",
    "en": "Pricing method",
    "type": "enum",
    "condition": "rfp|rfq",
    "validation": "lump_sum|unit_rates|time_and_material|mixed",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "currency",
    "ar": "العملة",
    "en": "Currency",
    "type": "enum",
    "condition": "always",
    "validation": "AED مبدئياً",
    "ownerEditable": false,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "tax_display_rule",
    "ar": "قاعدة بيان الضريبة",
    "en": "VAT quotation presentation",
    "type": "enum",
    "condition": "rfp|rfq",
    "validation": "exclusive_and_separate|inclusive_with_breakdown؛ يراجعها المختص",
    "ownerEditable": false,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "contingency_preference",
    "ar": "احتياطي المخاطر",
    "en": "Contingency budget preference",
    "type": "percent",
    "condition": "if_budget",
    "validation": "0–30% مؤشر تخطيطي، لا إلزام قانوني",
    "ownerEditable": true,
    "sensitivity": "private",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "payment_preference",
    "ar": "تفضيل دفعات الإنجاز",
    "en": "Payment preference",
    "type": "enum",
    "condition": "construction_related",
    "validation": "milestone|monthly_certified|deliverable|proposal_requested",
    "ownerEditable": true,
    "sensitivity": "private",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "COMMERCIAL",
    "id": "warranty_preference",
    "ar": "تفضيلات الضمان",
    "en": "Warranty preferences",
    "type": "text",
    "condition": "construction_related",
    "validation": "اختيار شخصي لا يحل محل واجبات قانونية",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "EVALUATION",
    "id": "weight_quality",
    "ar": "وزن الجودة",
    "en": "Quality weight",
    "type": "integer",
    "condition": "rfp",
    "validation": "0–100 ويجمع مع بقية الأوزان =100",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "EVALUATION",
    "id": "weight_price",
    "ar": "وزن السعر",
    "en": "Price weight",
    "type": "integer",
    "condition": "rfp",
    "validation": "0–100 ويجمع مع بقية الأوزان =100",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "EVALUATION",
    "id": "weight_schedule",
    "ar": "وزن الزمن",
    "en": "Schedule weight",
    "type": "integer",
    "condition": "rfp",
    "validation": "0–100 ويجمع مع بقية الأوزان =100",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "EVALUATION",
    "id": "weight_experience",
    "ar": "وزن الخبرة",
    "en": "Experience weight",
    "type": "integer",
    "condition": "rfp",
    "validation": "0–100 ويجمع مع بقية الأوزان =100",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFP"
    ]
  },
  {
    "group": "EVALUATION",
    "id": "prequalification",
    "ar": "متطلبات التأهيل",
    "en": "Prequalification requirements",
    "type": "multi_enum",
    "condition": "always",
    "validation": "license|references|insurance|staff|capacity|safety",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "EVALUATION",
    "id": "evaluation_mode",
    "ar": "منهجية المفاضلة",
    "en": "Evaluation approach",
    "type": "enum",
    "condition": "always",
    "validation": "best_value|technical_then_price|lowest_compliant",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "solicitation_type",
    "ar": "نوع وثيقة الطلب",
    "en": "Instrument",
    "type": "enum",
    "condition": "generation",
    "validation": "RFI|RFP|RFQ — ليس ترتيباً إلزامياً",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "bid_deadline",
    "ar": "آخر موعد لاستلام الردود",
    "en": "Bid response deadline",
    "type": "datetime",
    "condition": "pre_issue",
    "validation": "بعد تاريخ الإصدار؛ UTC داخلياً",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "clarification_deadline",
    "ar": "آخر موعد للاستفسارات",
    "en": "Clarification cut-off",
    "type": "datetime",
    "condition": "pre_issue",
    "validation": "قبل bid_deadline",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "bid_validity_days",
    "ar": "مدة صلاحية العرض المطلوبة",
    "en": "Requested offer validity days",
    "type": "integer",
    "condition": "rfp|rfq",
    "validation": ">0؛ لا يلزم قانوناً عدد موحد",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "site_visit_requirement",
    "ar": "زيارة موقع اختيارية/إلزامية",
    "en": "Site visit rule",
    "type": "enum",
    "condition": "construction_related",
    "validation": "not_needed|optional|mandatory_subject_to_access",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "submission_channels",
    "ar": "قنوات تقديم العرض",
    "en": "Submission channels",
    "type": "enum",
    "condition": "pre_issue",
    "validation": "secure_portal؛ البريد الخارجي فقط بعد تفعيل شروطه",
    "ownerEditable": false,
    "sensitivity": "normal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "confidentiality_level",
    "ar": "تصنيف سرية العروض",
    "en": "Bid confidentiality",
    "type": "enum",
    "condition": "always",
    "validation": "restricted_bidder_per_bid",
    "ownerEditable": false,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "owner_special_notes",
    "ar": "ملاحظات المالك",
    "en": "Owner special requirements",
    "type": "text",
    "condition": "always",
    "validation": "حتى 3000 حرف مع كشف التعارضات",
    "ownerEditable": true,
    "sensitivity": "private",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "TENDER",
    "id": "allowed_alternatives",
    "ar": "السماح بعروض بديلة",
    "en": "Alternative offers allowed",
    "type": "boolean",
    "condition": "rfp|rfq",
    "validation": "عند السماح تحدد طريقة عرض البدائل",
    "ownerEditable": true,
    "sensitivity": "normal",
    "usedBy": [
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "DOCS",
    "id": "attachments_reference",
    "ar": "فهرس المستندات المرفقة",
    "en": "Attachment manifest",
    "type": "reference_list",
    "condition": "pre_issue",
    "validation": "manifest فقط؛ التخزين الآمن لاحقاً",
    "ownerEditable": true,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "DOCS",
    "id": "rulepack_version",
    "ar": "إصدار مكتبة الاشتراطات",
    "en": "Rulepack version",
    "type": "text",
    "condition": "system",
    "validation": "يعتمد على الإمارة/الجهة/المشروع وتاريخ التحقق",
    "ownerEditable": false,
    "sensitivity": "internal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "DOCS",
    "id": "template_version",
    "ar": "إصدار القالب القياسي",
    "en": "Template version",
    "type": "text",
    "condition": "system",
    "validation": "يُثبت عند إصدار الوثيقة",
    "ownerEditable": false,
    "sensitivity": "internal",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "DOCS",
    "id": "legal_review_status",
    "ar": "حالة المراجعة القانونية",
    "en": "Legal review status",
    "type": "enum",
    "condition": "pre_issue",
    "validation": "pending|approved|rejected",
    "ownerEditable": false,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "DOCS",
    "id": "technical_review_status",
    "ar": "حالة المراجعة الفنية",
    "en": "Technical review status",
    "type": "enum",
    "condition": "pre_issue",
    "validation": "pending|approved|rejected",
    "ownerEditable": false,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  },
  {
    "group": "DOCS",
    "id": "issue_authorization",
    "ar": "تفويض إصدار الطلب",
    "en": "Issue authorization",
    "type": "boolean",
    "condition": "pre_issue",
    "validation": "موافقة المستخدم المخول ضمن صلاحيات خادمية",
    "ownerEditable": false,
    "sensitivity": "restricted",
    "usedBy": [
      "RFI",
      "RFP",
      "RFQ"
    ]
  }
];