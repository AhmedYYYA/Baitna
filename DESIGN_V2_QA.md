# BAITNA — Immersive Design v2

## Branch
`design/immersive-motion-v2` — safe preview branch; `main` is unchanged.

## Architecture
No framework, build system, external JS dependency, or altered domain logic. Existing paths remain:
- `/` — Arabic/English public landing website
- `/demo/` — owner / contractor interactive app prototype
- `/demo/authority.html` — regulator portfolio and read-only project inspection

Each page includes `assets/immersive.css` and `assets/immersive.js` after its legacy page styles and controls. Removing those references returns the original presentation.

## Included changes
- Nocturnal architectural color treatment, champagne-gold accents and premium typography.
- Fluid responsive panels, hover states, progress and milestone transitions.
- Bilingual interactive SVG workflow network with six contract-to-handover stages, selection, zoom, reset and desktop drag.
- Subtle building-preview depth interaction on capable desktop pointers.
- Responsive demo presentation shell with progress orbit, refined app surfaces and screen transitions.
- Regulatory risk donut derived from existing sample table values; selecting a risk category invokes the existing filter control.
- Native JS progressive enhancement; no new third-party dependencies.
- Accessibility: visible focus, opt-out motion toggle, automatic reduced-motion preference and semantic interactive controls.

## Design constraints
- The existing Arabic-first content, role journeys, forms, Gantt simulation, approval/reset behavior, and disclaimer are not rewritten.
- Contract validation and regulator scores remain demonstrative; new visuals must not imply official validation or regulator endorsement.
- All model data and screen workflows remain illustrative, consistent with the current repository README.

## Static verification completed
- Three HTML files link to the two assets.
- Original HTML content unchanged except two asset references per page.
- New JavaScript parses without syntax errors.
- CSS brace pairs are balanced.
- Latest branch Git tree includes all five changed/new files.

## Manual browser QA still required before merge
1. At 1440px and iPhone portrait width, check each page, Arabic direction and English toggle.
2. On landing, navigate all CTAs, all section anchors and every embedded demo scene.
3. Exercise workflow graph node keyboard selection, zoom in/out/reset, drag, and normal page scrolling.
4. In demo, open every screen; approve, query, attach evidence, adjust claim, submit, reset and use delay simulation.
5. In authority, filter risk categories via both chips and chart; search, select a row, open/close visit scheduling dialog.
6. With system reduced-motion enabled and with motion toggle paused, confirm no hidden content and clear focus states.
7. Check Safari/iOS touch behavior and Android Chrome, including slow phones and browser zoom at 200%.
8. Verify no console exceptions, dead-end navigation, misaligned text or controls clipped by the responsive layout.

## Merge policy
Do not merge until reviewed and browser-tested. The public GitHub Pages deployment continues to serve `main`.
