# BAITNA — ORB Form and Draft Generation Preview
**Date:** 17 November 2026  
**Implementation:** Browser-only proof of concept / ORB-GEN v0.1  
**Reference:** Approved BAITNA ORB procurement DTD 0.2, 77-field catalog

## What is implemented
- Arabic-first, switchable Arabic/English homeowner wizard with 5 sections, per-project ORB storage, and progressive conditional prompts for majlis, swimming pool, lift, smart home, occupancy and pricing types.
- 77-field approved data catalogue (metadata for professional/restricted fields included; personally identifying or restricted fields not requested in public form).
- Draft generation for **Request for Information (RFI)**, **Request for Proposal (RFP)**, **Request for Quotation (RFQ)**. Different sections, response schedules and pricing/evaluation language. `RFQ` distinguishes indicative vs defined-scope quotations.
- Separate saved document snapshots with template reference, ORB revision, project and home reference; editing owner brief does not overwrite past drafts.
- Source links for each UAE emirate presented as research references only; applicability and competent authority are not inferred automatically.
- Budget is hidden from bidder drafts by default; optional owner notes require explicit opt-in.
- Local, browser-only storage. No backend, authorization, secure upload, real supplier notifications, official issuance, legal contract, verified regulatory rule-pack, signature or FTA/bank integration.
- Text download and native browser print/save-as-PDF for locally generated sample drafts.
- Home/project selection reads the existing static lifecycle demo's synthetic project list when present; otherwise displays a synthetic standalone example.

## How to access after GitHub Pages publishes
`https://ahmedyyya.github.io/Baitna/demo/orb.html`

## Language quality rule
- Arabic mode: formal Arabic labels and body text; English abbreviations only in parentheses, e.g. **طلب معلومات (RFI)**, **طلب تقديم عروض (RFP)**, **طلب عروض أسعار (RFQ)** and **ملف متطلبات المالك (ORB)**. No unparenthesized English full-word navigation labels.
- English mode: English labels and document text, no automatic literal Arabic/English blending of interface strings.
- Owner-entered free text is preserved exactly as written; text fields can contain foreign words supplied by the owner.

## Testing
- Node.js syntax checks and simulated DOM/business-rule tests in `tests/orb.test.cjs`: **15 passing tests** (with catalog completeness, dynamic fields, RFI/RFP/RFQ selection, versions, budget privacy, legal review caveat, language switching).
- Chromium attempted; blocked on local/file URLs by environment `ERR_BLOCKED_BY_ADMINISTRATOR` — **no claim of browser E2E or visual approval**.
- This is NOT a production secure application. Private owner data must NOT be entered. The existing private Node.js local MVP, database and production security roadmap are separate.

## Next engineering gates
1. Genuine authenticated project-scoped ORB backend + PostgreSQL migration and least-privilege RLS.
2. Secure storage and audit of ORB and immutable issued tender versions; legal and technical signoff with verified jurisdiction-specific sources.
3. Server-side template engine with professional editor and governed clause library.
4. Controlled bidder invitations/submissions, technical-commercial evaluation, addenda and separately authorized Contract/SOW/IMS issuance.
5. Browser E2E, accessibility, security and privacy testing prior to use with real UAE records.

**Never present generated drafts as legally approved forms or actual external solicitations.**