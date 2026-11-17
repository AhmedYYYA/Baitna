# BAITNA — Delivery plan & test/acceptance specifications
**2026-11-17 | DTD 0.1 | Proposed gates. No live implementation.**

## 1. Execution order (the 24 approved backlog identifiers)

| Gate | Backlog | Required outcome | Primary gate |
|---|---|---|---|
| Foundation 0A | BT-001 Home Registry | one immutable permanent Home ID, many projects per Home | functional test |
| Foundation 0B | BT-002 real authentication / project membership | verified identity, scoped roles, explicit invitation/revocation | BOLA/IDOR test |
| Foundation 0C | BT-003 owner access / event audit | one current manager, durable ownership/access event history | policy/concurrency |
| Foundation 0D | BT-004 secure classified files | private object store, quarantine, hash, owner-private classification | upload authorization |
| Project 1A | BT-005 Contracts | multiple contracts & immutable approved revisions | version test |
| Project 1B | BT-006 SOW | independent SOW revisions with contract incorporation reference | amendment test |
| Project 1C | BT-007 WBS + BOQ | project-safe mapping, numeric quantities / amounts | FK/reconciliation |
| Schedule 1D | BT-008 IMS | one master IMS per active project, versioned DAG | dependency validation |
| Schedule 1E | BT-009 Forecast / CPM | baseline vs forecast, cyclic graph rejection, float analysis | reproducible test |
| Operations 1F | BT-010/011/012/013/014 | project parties, daily report, actual evidence, consultant check, owner dashboard | end-to-end chain |
| Finance 1G | BT-015/016 | payment claim & VAT readiness/export without banking/FTA claims | source trace and negative |
| Passport 2A | BT-017/018/019 | technical record, assets, warranties, maintenance, manager transfer | privacy transfer |
| Programme 2B | BT-020/021/022/023 | PM role, partner views, bilingual app, export/restore | access & resilience |
| Integration 3 | BT-024 | approved official integration adapters, optional | authority agreement |

## 2. Acceptance tests — Given / When / Then

### T-001 Permanent Home ID
Given a verified account, when one `POST /homes` succeeds, then the server persists `Home.id`, immutable `home_ref`, one current `owner_manager` grant and audit event in one transaction. A retry using same idempotency key returns the same home without duplicating it.

### T-002 Multi-project lifecycle
Given Home H, when projects P1 new-build and P2 maintenance are created in different years, then both reference exactly H, and H's public ref never changes.

### T-003 Identity mutation
Given Home H, when any client or service attempts to PATCH `id` or `home_ref`, then mutation is rejected at the database level even if API validation is bypassed.

### T-004 Cross-tenant read and write (negative)
Given owner A on H1 and owner B on H2, when A supplies H2's UUID or guesses a document key in any API route, then no H2 metadata/file is disclosed or modified. Repeat against contracts, WBS, IMS, evidence, tax and exports. Expected 404/403 based on non-enumeration policy.

### T-005 Privileged-only grants
Given a subcontractor on WBS work package X, when attempting to approve an inspection, update unrelated WBS Y, create new owner grant, view bank details or read another project, then reject with audit.

### T-006 Contract/SOW autonomy
Given approved Contract revision C1 and SOW revision S1, when scope is changed and S2 is approved, then C1 remains immutable; any required contractual amendment is a separate explicit contract revision/legal process.

### T-007 Cross-project FK integrity
Given project P1's contract or WBS, when another project's SOW, BOQ or IMS activity refers to it, then FK/service refuses even when user is allowed both projects.

### T-008 Single master IMS
Given active P1, when IMS is created, then at most one schedule row can exist for P1, with N immutable revisions and one current baseline pointer. If required business rule is active P1 must have IMS, enforce via service transaction.

### T-009 Graph semantics
Given scheduled tasks with FS/SS/FF/SF and positive/negative lags, when a legitimate dependency is added, then calculate planned dates under declared working calendar; when a cycle is introduced, then return 422 and persist nothing.

### T-010 Approved baseline integrity
Given an approved IMS v1, when a forecast date changes or new draft v2 is prepared, then v1 activities/dependencies and past audit stay unchanged; only explicit authorized baseline approval can select v2.

### T-011 Concurrent approval
Given two authorized reviewers acting on the same ETag/row version, when both attempt baseline approval concurrently, then exactly one version wins; the stale request returns conflict, not an overwritten decision.

### T-012 Evidence honesty
Given a form that says "photo attached", then server must have accepted actual private object bytes, linked SHA-256 and context; UI cannot mark sample photo data as verified. Geolocation must be represented as *signal* with accuracy/age and reviewer outcome.

### T-013 Consultant vs owner vs bank
Given completed work evidence, only authorized engineering professional in assigned role may record inspection verification; owner may give instruction after review; BAITNA never claims the bank has disbursed without a distinct verified source and authorized bank integration.

### T-014 VAT readiness
Given invoiced work and payment proofs, readiness validates mandatory fields and flags potential eligibility only as preliminary, produces a user-exportable pack; excludes invented FTA entitlement/refund.

### T-015 Digital-record transfer
Given home H and current manager A, when B accepts a verified transfer and the privacy manifest is approved, then `home_ref` stays same, B gains manager role, A loses management, technical record remains, private tax/bank/identity data do not become visible to B. Failure/replay rolls back, transfer history persists.

### T-016 Multi-decade recovery
Given a ten-year sample record after changing schema and backing it up, when restoring in a separate environment, then home ID, archive attachments, approval history and future maintenance reminders remain consistent. Operational retention follows law/purpose rather than infinite blanket personal-data retention.

## 3. Detailed security tests to automate

- Every endpoint: missing token, expired token, wrong issuer/audience, revoked project grant, modified Home ID, mismatched project/contract/SOW/WBS/IMS, privacy classification, function-level separation.
- Documents: ZIP bombs, executable masquerading as photo, oversized content, MIME mismatch, malware quarantine, expired signed URLs, orphaned storage keys, metadata-only record spoof, concurrent uploads and duplicate retry.
- Concurrency: duplicate Home creation, simultaneous approvals, simultaneous transfer attempts, project archive during pending upload and lost network on submit.
- Audit: actor association, event correlation ID, no edits/deletes, log retrieval restricted, nonrepudiation caveats, independent backup and recovery.
- UI: Arabic RTL/English LTR, mobile 375 px, accessibility, weak connection, time zone handling, mixed Gregorian dates, correct AED decimal arithmetic.

## 4. Local-only MVP definition

**Build first:** `apps/api` (Node/TypeScript with real auth adapter, REST endpoints), `apps/web` (React/TypeScript), `db` (PostgreSQL schema, grants, RLS migration and seed), private object store, event/audit, test runner, Docker Compose. Keep `index.html`/GitHub Pages demo untouched and public.

**Local synthetic test scenario:** one home, one manager, one delegate, two projects (build & maintenance), two contracts, two SOWs, WBS/BOQ, 17-activity IMS with a deliberate 39-day delay, zero real citizen/permit/banking/FTA data, no external integrations.

**Release boundary:** local MVP may have a mock identity provider and mock document references **only if visibly labelled**. It must not be made publicly available for real users or data until security isolation, identity, policies and privacy requirements pass.

## 5. Test commands to add during implementation

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration          # real isolated Postgres + API
pnpm test:security             # tenant boundaries and upload rules
pnpm test:e2e                 # browser Arabic/English flows
pnpm db:migrate
pnpm db:seed:synthetic
pnpm db:restore:verify
```

These commands are **target acceptance contracts** and do not exist in the current static website. Do not report them as passed before tool execution.

## 6. Stop/go conditions before code and before release

| Checkpoint | STOP if | GO when |
|---|---|---|
| After DTD | cross-Home FKs, permissions, transfer privacy or revision states unresolved | schema/API/authority reviewed and consistent |
| Database runtime | migrations fail or RLS missing | migrations run; app-role policies enforce deny by default; negative tests pass |
| Client app | files visible publicly or user roles are client-trust-only | private API and scoped media tested |
| IMS | no cycle validation; approved baselines mutable | graph, forecast and approval atomicity tested |
| Transfer | legacy owner-private info leaks or new owner not verified | consent, proof, data manifest and atomic role handoff pass |
| Launch | inferred government endorsement, bank settlement, FTA approval | separate verified integrations and required legal/security approvals |

**Current result:** technical design artifacts ONLY; neither migrations nor APIs are deployed or integration-tested. Publish to main only after user's explicit approval.
