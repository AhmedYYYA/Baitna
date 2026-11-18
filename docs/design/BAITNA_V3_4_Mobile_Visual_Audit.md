# BAITNA V3.4 | Mobile visual remediation and visual-scale audit

**Source evidence:** 18 November 2026 iPhone screenshot of the clipped interactive workflow explorer (English labels, heavy navy graph, oversized control panel, and competing floating motion button).

**Decision:** Remove the public live SVG graph from display. It is a redundant diagram: the following existing \`#how\` section already explains the exact same six governance-locked stages with full descriptions and the correct human approval roles. Keep original HTML, six-step process and business scripts byte-for-byte intact. Remove its now-irrelevant desktop/mobile navigation entry visually. The existing anchor remains in source for regression tests. No approval/state logic is hidden or changed in the application.

**Brand rules:** Respect approved BAITNA architectural mark and tagline: \`ويبقى للبيت أثر.\` / \`A Home That Endures.\` Main canvas \`#F6F2EA\`, cards \`#FFFCF7\`, deep brown \`#2B1E15\`, bronze \`#B68A57\`; bronze is not a body text color, use \`#764B29\` or deeper for readability.

**Typography:** UI body 16px, functional small text 13-14px minimum, information cards 15-16px, card headings 18-23px, page headings 28-48px. Unified IBM Plex Sans Arabic with suitable Latin fallback; retain Georgia in approved BAITNA Latin wordmark. Preserve Arabic RTL and English LTR.

**Surfaces inspected:** public landing, interactive workspace, owner requirements brief, local building reference screen, classic mobile application demo, authority read-only portal. Nav, header, hero, feature cards, timeline, form inputs, selector labels, warnings, statuses, invoice/payment dashboards, and footer.

**Quality gates:** Existing V3.1 smoke, governance lock, Chromium/axe tests; new computed-style audit covering 390/768/1440 widths in Arabic/English, typography checks, text-to-background contrast, navigation, horizontal overflow, screenshots of key viewports. No change to system approvals, source documentation, payment or warranty data.
