# Agent 0 — Change Ledger (governance impact = none)

| File(s) | Change | Reason | Owner | Governance impact |
|---|---|---|---|---|
| `assets/baitna-ui-v2.css` | New design tokens and scoped presentation CSS | Hierarchy, readability, responsive and contrast/focus | Agent 3 + Agent 5 | none |
| `assets/baitna-glossary-v2.js` | Native AR/EN glossary hints on existing landing links | Jargon comprehension | Agent 4 | none |
| `assets/baitna-metadata-v2.js` | Updates new social metadata values when existing language changes | AR/EN metadata parity | Agent 8 | none |
| `index.html` | Head-only additive CSS/SEO/tooltip block | Theme and discoverability without DOM body mutation | Agent 7 | none |
| `demo/index.html` | Head-only additive CSS/SEO block | Consistent preserved classic demo | Agent 7 | none |
| `demo/authority.html` | Head-only additive CSS/SEO block | Consistent preserved regulator view | Agent 7 | none |
| `demo/lifecycle.html` | Head-only additive CSS/SEO block | Consistent full lifecycle app | Agent 7 | none |
| `demo/orb.html` | Head-only additive CSS/SEO block | Consistent guided owner brief | Agent 7 | none |
| `demo/compliance.html` | Head-only additive CSS/SEO block | Consistent source navigator, noindex unchanged | Agent 7 | none |
| `tests/ui-governance-lock.test.cjs` | Automated exact-baseline checks | Reject frozen changes | Agent 9 | none |
| `tests/ui-browser-audit.mjs` | Chromium/axe screenshots and lab comparisons | Accessibility and performance evidence | Agent 6 + Agent 8 | none |
| `.github/workflows/ui-governance-audit.yml` | Two CI jobs | Gate and publish audit artifacts, not site | Agent 0 | none |
| `docs/ui-governance-v2/*` | Inventory, audits, handoff reports and release criteria | Transparent rationale and audit trail | Agents 0–9 | none |

## Decision log
- **Rejected:** refactoring any existing application JavaScript or changing original sample data.
- **Rejected:** rearranging original role, pilot, lifecycle, and six-step DOM elements.
- **Rejected:** auto-approval, new public claims, real-data collection, or silent permissions changes.
- **Protected:** all original HTML outside an explicitly tagged HEAD block, all old JS and CSS, routes, IDs, `data-*` and hrefs.
- **Release status:** draft PR / gate pending; no main deployment.
