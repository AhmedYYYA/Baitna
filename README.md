# Baitna | بيتنا

**بيتنا** منصة عربية تحوّل عقد بناء المسكن إلى بنود يتابعها المالك والمقاول والاستشاري معًا. ويرتبط كل بند بدليله الميداني ودفعته وفاتورته وضمانه، من الترخيص حتى ما بعد تسليم المفتاح.

**Baitna** is an Arabic-first platform that turns a home-building contract into items that the owner, contractor and consultant follow together. Each item carries its site evidence, payment, invoice and warranty, from the permit until long after handover.

> نموذج أولي ببيانات توضيحية. بيتنا مبادرة مستقلة، ولا يعني ذكر أي جهة أو توجه حكومي أنه يعتمد المنصة.
>
> Prototype with sample data. Baitna is an independent initiative; mentioning any authority or government direction does not imply endorsement.

## محتوى الموقع | What's in the site

| المسار / Path | الوصف / Description |
| --- | --- |
| `index.html` | الصفحة التعريفية بالعربية والإنجليزية / Landing page, Arabic and English |
| `demo/index.html` | العرض التفاعلي لتطبيق المالك والمقاول / Interactive app demo for owner and contractor |
| `demo/authority.html` | بوابة الجهة الرقابية (للاطلاع فقط) / Read-only regulator portal |
| `assets/favicon.svg` | شعار الموقع / Site icon |

شاشات العرض التفاعلي: الرئيسية للمالك، وطلب الدفعة، وسجل البند وأدلته، وحزمة إثبات الإنجاز، وبيان نطاق العمل، والبرنامج الزمني مع محاكاة التأخير، والتقرير اليومي الآلي.

Demo screens: owner home, payment request, item record and evidence, evidence pack, statement of work, schedule with delay simulation, and the automatic daily report.

## النشر على GitHub Pages | Publishing on GitHub Pages

1. **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` / `(root)`، ثم **Save**

يظهر رابط الموقع في الصفحة نفسها بعد دقيقة أو دقيقتين.

The site link appears on the same page after a minute or two.

## التقنية | Technology

صفحات HTML مستقلة دون أي أدوات بناء أو مكتبات خارجية، عدا خطوط Google (IBM Plex Sans Arabic وReem Kufi).

Plain, self-contained HTML pages with no build step or external libraries, apart from Google Fonts (IBM Plex Sans Arabic and Reem Kufi).


## Design and interaction update (October 2026)

The landing page, app demo and regulator portal share a unified green, ivory and warm-bronze visual system.

- `assets/experience.css` — responsive premium landing styles, glass surfaces and accessible motion.
- `assets/experience.js` — connected six-stage SVG lifecycle graph (drag, zoom buttons, keyboard navigation and touch pinch), building illustration zoom, smooth section reveal, low-cost ambient canvas, and mobile navigation.
- `assets/dashboard-polish.css` — coordinated visual refinements for the existing app demo and authority portal.

The production site remains static GitHub Pages HTML/CSS/JavaScript with no new external JavaScript dependencies. The original demo logic, navigation targets, English/Arabic content and illustrative-data disclaimer are retained. Motion is reduced when `prefers-reduced-motion` is enabled.

To inspect recent deployments, open the GitHub Actions tab and check the **pages build and deployment** run on `main`.
