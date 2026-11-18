# BAITNA | بيتنا — Radical Experience Design V3

**Design direction:** Architecture of Trust · Editorial / Digital Service  
**Date:** 18 November 2026  
**Release strategy:** Separate review branch; protected six-step workflow, life-cycle stages, roles and approvals.

## Executive decision

This is a complete reversal of the old dark-card visual approach—not merely changing colors.

The product experience now uses **white / porcelain architectural canvases, cobalt-blue precision, navy institutional surfaces, generous typography, glass blueprint presentation and distinctive workflow storytelling**. All six active pages share one interface vocabulary.

## Design principles

1. **A home is the product, not a dashboard.** Opening screen features a dramatic dwelling blueprint, high-contrast type and a clear primary action.
2. **Three stages, one identity.** Pre-contract RFI/RFP/RFQ, execution Contract/SOW/BOQ/IMS and post-handover passport remain in their original order but receive a new cinematic cobalt stage.
3. **The six-step loop is non-negotiable.** Item → Evidence → Decision → Payment → Invoice → Warranty are displayed as large numbered checkpoints, retaining DOM and decision authority.
4. **One coherent suite.** The owner workspace resembles a modern digital financial product; ORB is a horizontal step studio; official rules are a civic evidence navigator; classic and regulator demos have polished distinct roles.
5. **Bank/government clarity without endorsement.** Notices and regulator read-only status remain unchanged; the UI makes no new claims of accreditation or live services.
6. **Arabic-first, English-complete.** Dubai local-first fallback stack for both scripts. Arabic labels are preserved and English technical abbreviations remain in parentheses when relevant.
7. **Reduce friction.** One floating, accessible view switcher navigates to the six existing route destinations, not a new business feature.

## Tokens

| Semantic role | Value |
|---|---|
| Deep ink | `#071d2f` |
| Digital cobalt | `#1247cc` |
| Dark cobalt | `#092c9b` |
| Paper white | `#ffffff` |
| Porcelain | `#f7f9fc` |
| Blue tint | `#dfeaff` |
| Muted text | `#586a7c` |
| Soft border | `#dce4ed` |
| Quiet gold | `#b88647` |

**Typeface:** `Dubai` preferred for Arabic and English; no font binaries hosted or redistributed (browser falls back if Dubai is not installed). This limitation also applies on iPad.

**Shape:** 12–28 px corner radius; 14–40px internal spacing, spacious headers, clear focus rings.  
**Motion:** limited hover lift and color transitions; respects `prefers-reduced-motion`.

## Full route matrix

| Route | Visual transformation |
|---|---|
| `/` | White editorial hero, living home blueprint, bold dark-blue text, cinematic cobalt lifecycle, six large workflow milestones, new roles, product narrative, AI/pilot presentation |
| `demo/lifecycle.html` | Full light workspace / dark navy primary navigation, four clear KPI tiles, large form cards, status pills and schedules |
| `demo/orb.html` | Five-step horizontal progress studio; white form, cobalt context band and review panels |
| `demo/compliance.html` | Official-source navigator with highly visible caveat, smart selection layout, document reference cards |
| `demo/index.html` | Redesigned classic device mockup with white cards, blue action system and distinct presenter view |
| `demo/authority.html` | Institutional analyst workbench with dark top bar and light metrics, search, risk indicators and unchanged read-only identity |

New shared assets: `assets/baitna-v3.css` and `assets/baitna-v3-nav.js` (no new third-party runtime dependency).

## Governance rules and test evidence

- Original six page bodies are unchanged; only a block in the existing UI-v2 head insertion loads new v3 design assets. Removing the single `BAITNA-V3` block exactly restores the published SHA `cac4e09adead3fbd0fd9416536c8b82886fb16b1`.
- Original business JS and sample datasets are byte-exact; `tests/ui-v3-redesign.test.cjs` enforces that.
- Existing CI also runs original Governance Lock, ORB, Frontend, Chromium/axe, navigation and lab LCP/CLS checks.
- P0 regression means **no merge**. Privacy/security/compliance readiness is not established by visual design.
- View switcher adds only normal `<a>` links to existing pages. No API, storage, data edit, approval, state change or new business route.
- Rollback branch `rollback/baitna-v3-pre-redesign-2026-11-18` references the published baseline.

## Release readiness checklist

- [ ] All automated tests green on final PR commit
- [ ] Six routes have no horizontal overflow at mobile viewport
- [ ] No automated WCAG violations
- [ ] Visual review of Arabic mobile and desktop screenshots
- [ ] English toggle preserves labels and layout
- [ ] Existing regulator/consultant/owner decision flows remain unchanged
- [ ] GitHub Pages deployment green after merge

### Limitations
Automated axe tests alone are not formal WCAG 2.2 AA certification. Physical iPad/Safari testing, field Core Web Vitals and independent legal/banking/government acceptance are separate future gates. This redesign is still a public synthetic-data prototype.
