# Agent 0 — Orchestrator | Governance-first UI upgrade

**Baseline / release comparison:** `59fcb23ebdff8170e8910b7ee5c55519a37506d0` on `main` (18 November 2026).  
**Upgrade branch:** `ui/multiagent-governance-lock-2026-11-18`.  
**Rollback reference:** `rollback/ui-multiagent-baseline-2026-11-18` (points to the frozen commit).  
**Authorization:** User's BAITNA Multi-Agent UI Upgrade master prompt. **Only presentation-layer changes allowed.**

## Sequenced ownership and handoffs
1. Agent 1 captures inventory from the actual Git tree → governance lock test.
2. Agent 2 inspects presentation usability issues → P0/P1/P2 prioritized scope.
3. Agent 0 limits scope to additive design CSS, additive metadata, and progressive-enhancement acronym tooltips.
4. Agent 3 sets accessible visual tokens/components → Agent 4 checks RTL and language parity → Agent 5 checks layout and workflow visibility.
5. Agents 6 and 8 inspect accessibility and performance; metrics unavailable are explicitly BLOCKED, never fabricated.
6. Agent 7 commits assets and a **single allowlisted HTML head insertion per page**; original markup and every business/authorization script remain byte-exact.
7. Agent 9 runs frozen-content diff test against the captured SHA and verifies code/CI checks. **No publication before PASS** on the governance gate; accessibility/performance unmet conditions keep this a DRAFT.

## Deliberate constraints
- No changes to six-step loop, 3-stage lifecycle, six role definitions, regulatory read-only semantics, human approvals, pilot, samples, any original script, or existing identifiers/links.
- No real financial, tax, legal or AI capability assertions. All previous disclaimers stay verbatim.
- Do not deliver false performance numbers; Lighthouse lab results cannot prove live field Web Vitals.
- Dubai font remains **local-first** only; public webfont embedding rights must be cleared separately, no font binary in public repository.
- Current public GitHub Pages remains demo-only and not suitable for actual owner/contractor data.

## Release decisions
**Governance gate:** byte-exact base vs candidate HTML after removing one specially marked head-only insertion; byte-exact external JS and sample data.  
**Browser/accessibility gate:** automated Chrome tests where supported, plus unresolved manual Safari/iPad/keyboard checks.  
**Release:** keep as draft PR if any requested acceptance threshold cannot be verified or fails.

## Change ledger contract
Record `path | type | reason | responsible agent | governance impact` in `10-change-ledger.md`; every entry must have governance impact `none`. Any functional change is rejected.
