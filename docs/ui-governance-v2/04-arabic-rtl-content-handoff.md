# Agent 4 — Arabic, RTL and Content Handoff

**Status:** Source-preserving UI implementation complete; physical device verification pending.

- The original AR/EN `data-i18n`, `data-ui-ar/en`, text nodes and translation dictionaries are **unchanged byte for byte**. This avoids any unapproved semantic shift.
- Added a passive, presentation-only glossary to four existing landing links: **ملف متطلبات المالك (ORB)**, **طلب معلومات (RFI) / طلب تقديم عروض (RFP) / طلب عروض أسعار (RFQ)**, **بيان الأعمال (SOW) / جدول الكميات (BOQ)**, and **الجدول الزمني الرئيسي المتكامل (IMS)**. Hover/focus hints change with `html.lang`; original link labels, hrefs and handlers do not change.
- Added CSS logical positioning, `inset-inline-start`, RTL direction isolation for code, and dedicated `html[lang=en]` headline rhythm.
- Dubai is the first typeface in the stack for Arabic **and** English. No Dubai font binaries distributed; local absence falls back to IBM Plex Sans Arabic / system fonts.
- Social share metadata includes Arabic defaults and passive English title/description updates upon the existing language toggle. Canonical URLs remain static without tracking parameters.
- Translation parity is constrained by the frozen source: this task **does not rewrite existing mixed-script text**, which would require explicit copy approval or the same-meaning exception review.

## Controls
**No changes to frozen items 1–9.** Tooltips never alter `data-ui-*`, link destinations, role text, or any original document body source. An independent source-diff test applies.

## Remaining
Visual and screen-reader confirmation for punctuation, numeral shaping, abbreviations and mobile RTL remains necessary on real devices.
