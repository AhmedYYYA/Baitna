# BAITNA V3.1 — Continuation / Visual QA and Motion
**Date:** 18 November 2026  
**Baseline:** main `504da529b64531c4016c247c583749cd4653a4b7` — V3 radical redesign  
**Scope:** incremental motion-quality pass on top of V3, not a replacement of its core implementation.

## Starting-point finding
V3 was already published to main on 18 November 2026. Its six-page Chromium/axe report from [run #44280831407](https://github.com/AhmedYYYA/Baitna/actions/runs/44280831407) showed zero automated accessibility findings, no document scrollWidth overflow, and passing lab LCP/CLS. However, its mobile full-page screenshot of the landing page had an image width of 522 pixels despite a 390-pixel viewport. This deserved independent capture-level verification.

## Changes
- **V3.1 style layer** (`assets/baitna-v3-1.css`): responsive visual containment, optional 3D blueprint depth, reading-progress line, component motion, legible official/demo caveats, safe-area padding for the route switcher.
- **V3.1 motion engine** (`assets/baitna-v3-1-motion.js`): requestAnimationFrame-coalesced pointer tilt, IntersectionObserver reveal transitions, scroll reading progress and visual focus on story cards. No business state, forms, navigation, authorizations, storage, network access or project percentage values are touched.
- Added head links within the existing `BAITNA-V3` markers on all six pages. All previous HTML bytes can be recovered by removing just these new lines; original business scripts remain unchanged.
- Honors `prefers-reduced-motion` and `pointer:coarse` controls.

## Design language preserved
- Dual-language Dubai-first local font stack, with no unlicensed font files.
- Architecture-of-trust V3 visual direction: white porcelain, institutional navy, cobalt and subtle gold.
- Frozen loop: Item → Evidence → Decision → Payment → Invoice → Warranty.
- Lifecycle: RFI/RFP/RFQ → Contract/SOW/BOQ/IMS → Home Passport.
- Authority: consultant approves stages, owner approves payments; regulator dashboard remains read-only and sample-only.

## QA / release gates
1. Run governance regression against exact V3 baseline and earlier approval checks.
2. Run Chromium with 390-pixel viewport, check **captured full-page PNG width** in addition to `documentElement.scrollWidth` (to catch offscreen rendered geometry).
3. Confirm reduced-motion disables effects and no new console errors.
4. Confirm interactive desktop tilt works with mouse.
5. Existing axe tests and browser navigation checks still pass.

**Not equivalent to formal WCAG 2.2 AA certification or field Core Web Vitals.** Physical Safari/iPad and representative mobile network testing remain separate.
