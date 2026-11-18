# Agent 5 — Interaction and Layout Handoff

**Scope:** one additive file: `assets/baitna-ui-v2.css` plus an isolated native title/hover/focus glossary helper. No routes, workflow scripts, data or roles were modified.

## Layout changes
- **Homepage:** stronger editorial heading and CTA hierarchy, retaining existing links and text.
- **Precontract/execution/post-handover:** same three stages, original order, improved cards and navigable modules.
- **Six-step contract cycle:** same six `<li>` children and content; CSS changes 6 small tiles to a scannable 3/2/1-column layout at desktop/tablet/mobile, with clearer badges and contrast.
- **Role definitions:** all six role cards kept in place and without visibility restrictions; 3/2/1 columns, stronger titles and scannability.
- **Explorer:** original `#graphViewport` and JS keyboard/pointer controls unchanged; focus indicator and minimum 44×44 control sizes added.
- **Pilot:** Phase 0, 1 and 2, their durations, plot proportions and all five metrics unchanged; only card padding, borders, and gap improved.
- **Applications:** workspace, ORB forms, source navigator, historical demo and authority portal receive focus, spacing and responsive refinements without changing states, samples or actions.

## Responsive design
1100 / 760 / 440 px breakpoints. Source DOM order and accessibility reading order stay identical. CSS logical properties are used for directional positioning; reduced motion is honored.

## Risks
Legacy component CSS contains fixed and inline styles. The additive layer does not fully replace them, minimizing regression risk but requiring browser visual checks across 320, 390, 768 and 1440 px. No automatic accessibility claim.
