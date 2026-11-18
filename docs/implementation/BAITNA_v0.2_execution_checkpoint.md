# بيتنا | BAITNA — Procurement MVP v0.2 execution checkpoint

**Date:** 18 November 2026  
**Implementation:** LOCAL EXECUTED AND TESTED; not deployed to public GitHub Pages.  
**Source delivery:** Full, runnable source is delivered to the owner as `BAITNA_Local_Procurement_MVP_v0.2.zip` through the current ChatGPT conversation. **The GitHub branch currently contains this handoff note, not the full new backend source**. Do not confuse this status with a completed repository source push.

## Verified in the runnable local archive

- New isolated Node.js development API with SQLite storage and real persistence.
- 77-field ORB catalog (61 homeowner-editable fields); independently saved immutable ORB revisions.
- Separate Arabic/English RFI, RFP and RFQ generated drafts; Arabic titles use parenthesized abbreviations.
- Template version and SHA-256 source hash, pinned ORB source revision and snapshot immutability.
- Owner/private field redaction, opt-in owner notes, budget hidden by default, and quotation-maturity checks.
- Explicit owner/consultant/legal reviewer separation and append-only decisions.
- Local development bearer sessions with strong distinct credentials, session expiration and simple login rate limiting.
- Forbidden cross-project access; old X-Demo-User endpoints unavailable in v0.2 service.
- All seven UAE jurisdiction entries remain `UNVERIFIED` and external tender issuance always returns a denial.
- PostgreSQL migration with RLS is **designed but not run**; no actual OIDC or production-grade authentication.

## Tested

`npm test` executed with Node.js 22.16 built-in SQLite: **34 passed / 0 failed**. Tests include real localhost HTTP writes and local SQLite persistence across restart.

Browser visual/E2E acceptance did not complete in the execution environment. No claim of legal, government, banking or external procurement integrations.

## How to run the delivered archive

Extract the archive on a local computer and consult `app/README_v0.2.md`. Configure separate long passphrases under `BAITNA_DEV_CREDENTIALS`, run `npm run procurement` from `app` and open `http://127.0.0.1:4200/procurement`.

## Restricted production gates

1. Run and verify PostgreSQL 0001 + 0002 migrations and negative RLS tests.
2. Configure a trusted identity provider and replace all development credentials.
3. Provide encrypted private document storage, audit/retention, and security review.
4. Verify jurisdiction-specific statutory and technical requirements with competent professionals.
5. Pass browser/mobile accessibility and end-to-end tests.
6. Only then consider restricted pilot invitations and controlled external issuance.

**Public main site:** remains the prior browser-only ORB demo, intentionally unchanged.
