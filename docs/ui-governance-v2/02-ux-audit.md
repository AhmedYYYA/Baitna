# Agent 2 — Current-state UX audit (source-inspected)

**Evidence:** GitHub `main` @ `59fcb23ebdff8170e8910b7ee5c55519a37506d0`, six static pages, five business JS files and design CSS. Findings reflect a **source/structure inspection**, not measured user sessions or screenshots.

| Priority | Finding | Evidence | Safe presentation-layer remediation |
|---|---|---|---|
| P0 | Multiple paths labelled demo/platform/legacy cause navigation ambiguity. | Landing links to `demo/`, `demo/lifecycle.html`, `demo/orb.html`, `demo/authority.html`; all are currently distinct. | Visually elevate primary workspace CTA and group secondary module links; **keep all links and routes unchanged**. |
| P0 | Dense interaction surfaces and legal caveats risk visual dilution. | Owner wizard, lifecycle and regulatory source page all show sample-only disclaimers. | Add strong information hierarchy and warning styling; **never remove/reword warnings**. |
| P1 | Six-step loop is semantically correct but hard to parse quickly on small screens. | `index.html` `<ol class="loop">` with six `data-i18n` headings in proper order. | Strengthen numbering, vertical rhythm and stepped connectors with CSS only. |
| P1 | Abbreviations RFI, RFP, RFQ, ORB, SOW, BOQ and IMS are dense for non-specialists. | Landing module grid and ORB wizard; bilingual technical vocabulary. | Native hover/focus tooltips for mapped abbreviations; use Arabic terms and Latin acronyms in parentheses, keep content untouched. |
| P1 | Small tap areas and compact typography in legacy tables/nav may challenge mobile users. | Legacy `demo/index.html` and `demo/authority.html` and UI design CSS. | Increase interactive min-block-size, focus contrast, table overflow, card spacing. |
| P1 | Language presentation uses combined Arabic/Latin codes and inconsistent typographic emphasis. | `demo/lifecycle.html` technical acronym labels and page-local English toggle. | Isolate Latin acronym fragments in presentation and preserve original Arabic/English translation values. |
| P1 | Current graph interaction needs independent keyboard/AT verification. | `#graphViewport` focusable, JS keyboard handlers exist. | Visible focus and tooltip explanatory affordances; run browser keyboard tests without altering handlers. |
| P2 | Metadata varies across pages; no consistent canonical URLs or bilingual social metadata. | Static `head` elements for six pages; regulatory source page already intentionally `noindex`. | Add canonical and OG metadata without altering existing `robots` and `description`; keep same URL structure. |
| P2 | Performance unknown; CSS/JS bundles are nontrivial and may affect startup. | Current landing HTML ~63 kB plus CSS/JS; external Google Fonts. | Avoid runtime dependencies, keep added CSS lightweight, use lab Lighthouse for comparative evidence and note inability to infer field CWV. |

## Handoff to Agent 3 / Agent 0
Approved: additive CSS tokens and component polish, additive SEO head metadata, lightweight acronym affordance **only if it cannot mutate workflow data/DOM structure**, tests.  
Rejected: removing links, retitling disclaimers with changed meaning, reordering loop or phases, switching banking/consultant approval logic, speculative integrations.

## Early risk flags
- Existing demo authority portal includes a **visit-planning form**. Treat it as illustrative operational note-taking, not permission to alter regulator approval/decision authority.
- Financial/legal/government references appear throughout the source. **Exactly preserve content**, even where copy polishing would be attractive.
- Dubai font binaries are not in public repo; do not inject unlicensed assets.
