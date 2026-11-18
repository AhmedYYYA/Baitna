# Agent 6 — Accessibility Report | BAITNA UI V2

**Automated audit:** GitHub Actions `44250455358`, baseline vs candidate, six routes, Chromium headless mobile viewport 390×844, reduced motion enabled, light OS preference, Arabic default. Tool: `@axe-core/playwright` with `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` tags.

| Route | Before: axe violation groups | After: axe violation groups | After: overflow |
|---|---:|---:|---|
| `/` | 2 | **0** | none in `documentElement` |
| `demo/lifecycle.html` | 0 | **0** | none |
| `demo/orb.html` | 2 | **0** | none |
| `demo/compliance.html` | 0 | **0** | none |
| `demo/index.html` | 1 | **0** | none |
| `demo/authority.html` | 1 | **0** | none |
| **Total** | **6** | **0** | — |

### Remedies, strictly presentational
- Existing visible labels are mapped to `aria-label` for dynamically generated Owner Requirements Brief fields; labels and business code remain unchanged.
- SVG explorer container is treated as a control group rather than one atomic decorative image. Original keyboard/pointer node handlers are unchanged.
- Decorative regulator-risk donut segments are hidden from AT because adjacent legend buttons represent the interactive filters. Risk calculations and filter actions are untouched.
- Dark/light contrast overrides resolve all reported automated contrast issues; focus-visible rings and target sizes improve navigability.
- Mobile ORB stepper is scrollable within its container; the graph paint region is constrained rather than removed.

### What this PASS does *not* prove
Automated **axe 0 violations is not a WCAG 2.2 AA certification**. Still required: screen-reader reading order, announcement accuracy, keyboard end-to-end forms and diagrams, zoom/reflow at 200–400%, color contrast under user themes, physical Safari/iPad testing, and assistive-technology checks of the legacy view.

**Agent 6 status:** automated audit PASS; full WCAG 2.2 AA signoff **PENDING**. Do not ship under the strict acceptance contract.
