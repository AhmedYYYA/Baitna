# Agent 3 — Design system handoff | BAITNA UI V2

**Source:** frozen baseline `59fcb23ebdff8170e8910b7ee5c55519a37506d0`.  
**Scope:** additive CSS design tokens/components. Existing structure and interactions are locked.

## Visual identity
A government/bank-appropriate editorial system: deep ink, calm teal, warm ivory, restrained satin gold, purposeful hierarchy, generous breathing room. Not a government brand nor an indication of endorsement.

### Tokens
| Semantic token | Light | Dark | Use |
|---|---|---|---|
| `--ui-bg` | `#f7f8f6` | `#101a21` | Canvas |
| `--ui-surface` | `#ffffff` | `#182b34` | Cards |
| `--ui-surface-alt` | `#f1f4f2` | `#203640` | Input/secondary |
| `--ui-text` | `#142e32` | `#f7f6f1` | Headings/text |
| `--ui-text-secondary` | `#4d6265` | `#c3d0cf` | Descriptions |
| `--ui-border` | `#d1dbd7` | `#4b656c` | Separators |
| `--ui-accent` | `#8a642a` | `#e9be7b` | Highlight |
| `--ui-primary` | `#164b51` | `#c9a568` | CTA |
| `--ui-focus` | `#ffbd62` | `#ffcb79` | Focus ring |

### Typography
- Both languages use **Dubai local-first**: `"Dubai","Dubai Regular","Dubai Medium","IBM Plex Sans Arabic","Segoe UI",sans-serif`. **No font files shipped**; absence on device triggers fallback.
- Headline `clamp(2rem,4vw,3.5rem)`, section `clamp(1.7rem,3.2vw,2.55rem)`, body `clamp(.94rem,1vw,1.05rem)`; Arabic 1.75–2.0 body line-height, English 1.55–1.7.
- Acronyms are LTR-isolated where possible and exposed with hover/focus explanatory hints in the unchanged modules.

### Geometry and motion
- Spacing steps: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px.
- Radius: 10 (controls), 14 (cards), 20 (feature containers).
- Elevation: low contrast drop shadows only when needed; avoid making government authority look "approved".
- Motion: ~160–220ms, transforms/opacity only, respect `prefers-reduced-motion`.
- Touch targets: aim for 44×44 CSS px on frequently used controls, and preserve original command behavior.

## Component rules / responsibilities
- **Primary CTA:** strongest visual weight only on intended existing primary link; no new action created.
- **Secondary CTA:** bordered, stable when focus; original href unchanged.
- **Step cards:** preserve exact six steps and RTL sequence; numbering remains visible.
- **Status chips:** differentiate demo/pending/approved without relying on color alone; original text/status untouched.
- **Role cards:** same six role titles and permissions; purely visual treatment.
- **Regulatory warning:** preserve textual caveats; gold/amber high contrast, never success-green.
- **Tables:** constrained overflow and keyboard-readable rows; never hide columns or mutate data.
- **Graph toolbar:** focus visibility, 44px controls, preserve graph's viewbox/drag behavior.
- **Pilot plan:** same Phase 0/1/2 values and KPI labels, improved spacing only.
- **Tooltip:** only pre-existing glossary anchor locations, native title + focus-visible cue; does not change link or route.

## Light & dark
- Landing retains dark hero + pale editorial sections.
- Owner workspaces retain dark default; operating-system light preference gets constrained light overrides only when contrast can be preserved.
- Color-mode changes must never alter visibility of role-restricted content.

## Handoff checklist
1. No element removed, reordered, or dynamically rebound.
2. No original HTML body bytes change; all new assets linked through a single allowlisted head block.
3. Test keyboard focus, mobile 320/390/768/1440px, Arabic + English.
4. Any WCAG/performance failure blocks the release.
