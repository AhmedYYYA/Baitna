# BAITNA | بيتنا — Detailed Technical Design (DTD)
**Version:** 0.1 — 2026-11-17 · **Status:** Proposed engineering baseline / NOT deployed
**Branch:** `design/technical-architecture-2026-11-17` (isolated from public `main`)
**Supersedes:** no approved product scope; implements the 2026-11-17 product baseline and gap analysis.

## 1. Scope and invariant decisions

BAITNA is a **privately owned, homeowner-centred integrated home lifecycle platform**. It may later be adopted by government or integrated with a registry, FTA, financier or professional programme only through formal authorization.

1. `Home` is the enduring aggregate; `Project` is a bounded construction, renovation or maintenance programme. The same home may have many projects.
2. `home_ref` (Permanent Home ID) is randomly generated, immutable, globally unique and never reused or reassigned to a different home. A Home ID is **not evidence of legal title** and never serves as an authentication secret.
3. `Contract`, `SOW` and `IMS` are independent versioned aggregates. Contracts can be multiple per project, and each SOW refers to its governing contract and incorporation status. Exactly one **master IMS** per project, with many immutable schedule revisions.
4. `WBS` connects deliverables to SOW; `BOQ` connects quantities/costs to WBS; activities connect back to WBS and schedule version. An IMS baseline must not be silently overwritten by a forecast or a change request.
5. Data moves between lifecycle phases (design → construction → handover → operations → renovation → digital-record transfer) **without replacing Home ID**.
6. Digital-record management transfer is strictly an in-app permission/workflow event, **never a transfer of legal real-estate title**.
7. All evidence, certifications, invoices, VAT assessments and government links are non-operational until separately implemented, tested, and authorized. BAITNA does not approve engineering work, disburse bank funds or decide FTA tax eligibility.
8. Private citizen records must never be served from the public GitHub Pages landing page.

## 2. Target deployment topology

```text
          Public marketing site (existing GitHub Pages; NO private data)
                                  |
  Private web/mobile PWA (React + TypeScript, RTL/LTR, authenticated)
                                  |
                          HTTPS + API gateway
                                  |
           Node.js 26 LTS + TypeScript + REST/OpenAPI
        Auth/session | RBAC/ABAC | validation | audit | workflows
               |                 |                   |
     PostgreSQL 18       Private object storage   Background jobs
   transactional data   encrypted uploads/exports  schedules/alerts
               |                 |                   |
             monitoring / encrypted backups / restore drills
                                  |
            OPTIONAL government / FTA / bank adapters (future)
```

**Implementation choice:** modular monolith, not microservices, for cost-effective MVP. Suggested stack: Node.js 26 LTS, TypeScript, Fastify, PostgreSQL 18, React + Vite, S3-compatible object storage, OpenAPI 3.1, Docker Compose for local **simulated** development. Library versions/dependencies must be locked and vulnerability checked at implementation. Do not select an identity provider until due diligence; support OIDC/OAuth2 and server-enforced sessions, not a hard-coded password or client-side user switcher.

**Environment isolation:** `main` static demo remains; new `apps/api`, `apps/web`, `packages/domain`, `db`, `docs/architecture` live only on development branch initially. Local PostgreSQL, private object-store emulator, dummy identities and seeded synthetic homes. Staging/prod require UAE data governance, provider/residency selection, legal assessment and independent security review.

## 3. Logical bounded contexts

| Context | Primary aggregate | Responsibilities | Initial phase |
|---|---|---|---|
| Home Registry | Home | immutable public ref, home state, linked projects | BT-001 (P0) |
| Identity & Access | Account, HomeAccess, ProjectParty | auth binding; owner/project scopes; no cross-home access | BT-002/003 (P0) |
| File & Audit | Document, AuditEvent | classified objects, audit, signatures/hash provenance | BT-004 (P0) |
| Contract | Contract + revisions | terms, parties, financial controls, incorporation approvals | BT-005 (P1) |
| Scope | SOW + revisions, WBS, BOQ | deliverables, work packages, quantities, acceptance | BT-006/007 (P1) |
| Scheduling | IMS + versions, activities, dependencies | FS/SS/FF/SF, baseline vs forecast, critical path | BT-008/009 (P1) |
| Site Evidence | DailyReport, Evidence, Inspection | capture, geofence signals, review, verification | BT-011–013 (P1) |
| Finance & VAT | Claim, Invoice, VATCase | payable review and tax readiness/export, no banking/FTA decision | BT-015/016 (P1) |
| Home Passport | Asset, Warranty, MaintenanceEvent | handover → multi-decade operations | BT-017/018 (P2) |
| Transfer | HomeTransfer | new manager, verified consent, transfer manifest, audit | BT-019 (P2) |
| Partnerships | ProgrammeAccess | authorized, scoped integrations only | BT-020/021/024 (P2/3) |

**Never assume** a "read-only authority" can see all private properties. Access must be opt-in, agreement-scoped and authorized per project/programme.

## 4. Data rules and transaction boundaries

- Persistent primary keys: UUIDs; exposed `home_ref` is a distinct random, non-sequential, opaque public label. Retain a signed identity mapping through archives and exports.
- Time: UTC `timestamptz` stored; local UAE timezone rendered at UI. Quantities: `numeric(18,4)`; money: `numeric(18,2)` and explicit `AED` currency; no floating-point for invoices.
- Every write validates `actor`, `home_id`, `project_id`, role, revision, workflow state and optimistic-lock `If-Match` or row version. Cross-property references must fail.
- Approval is event-based and role-gated; approved contract/SOW/schedule revisions are append-only. A change request may propose effects; changing SOW never automatically amends a contract.
- IMS has a **single current baseline pointer** on the schedule; approval creates an immutable revision and updates the pointer only through a transaction with the specified approvers. Forecast is a separate derived run.
- All file uploads use quarantine/validation, size/type caps, stored SHA-256, private object keys, optional location/device signals, consultant verification, and signed expiring access. GPS alone does not prove authenticity.
- Audit every significant business transition with actor, object, timestamp, prior/new state and immutable event log; maintain correction history. Elevated DB administrators are outside this trust boundary: production needs separate retention/WORM controls.
- Owner transfer: confirm both parties; verify entitlement using evidence/manual workflow now, official integration only if later authorized; selectively share home-technical records, redact owner-private bank/tax/identity material, preserve previous ownership/access events.
- Retention and archival: plan exportable open formats, annual integrity checks, backup/restore exercises and key rotation. "30–50 years" is a planning horizon, not an unconditional personal-data retention period.

## 5. Workflows and acceptance gates

**A. Home bootstrap (BT-001/002):** authenticated user creates Home → transaction generates immutable `home_ref` and owner_manager grant → event recorded → user creates project(s). Duplicate idempotency key must not create a second home.

**B. Contract → SOW → WBS/BOQ → IMS:** draft contract revision → review/approval → separate SOW revision incorporated by reference → WBS/BOQ mapping → construct IMS revision with resource-appropriate FS/SS/FF/SF dependencies → reject cycles and negative date ranges → approved baseline. Cross-project linkage = 403/404/422 as appropriate, never leaked.

**C. Daily site assurance (future):** contractor logs activity and captured media → integrity/location signals assigned a confidence label, never "verified" automatically → consultant checks and accepts/rejects → homeowner receives progress and relevant financial decisions.

**D. Handover / lifetime:** completed work creates technical passport entries and assets; equipment warranty and maintenance schedule follow the persistent Home ID, even after new renovation projects.

**E. Digital management transfer (future):** authenticated manager requests → new manager accepts → proof and privacy manifest reviewed → atomic grants/revocations + transfer event → same Home ID. Legacy financial/identity records stay restricted by default.

## 6. API and security controls

- Contract-first HTTP API: `docs/architecture/openapi.yaml`; errors are standard `{code,message,requestId}`, with localized message at UI.
- Auth: external OIDC-compliant provider; server validates token issuer/audience/expiry/signature. API checks object-level ownership and project membership on **every request**.
- Defense in depth: DB application role with least privilege, RLS after security policy migration, object-storage IAM per scope, signed short-lived URLs; deny on missing actor/project permission.
- No client-supplied `owner_id` can authorize creation/transfer. No unvalidated cross-home `contract_id`, `sow_id`, `wbs_id`, `project_id` or media reference.
- Security validation uses OWASP API Security Top 10, especially broken object-level authorization. Plan tests for IDOR, upload handling, replay/idempotency, concurrency, expired links and transferred ownership.
- Sensitive production data only in private deployment; client UI may cache non-sensitive state but never contain system secrets.

## 7. Architecture quality gates

1. **Design gate:** SQL migration review, ERD, API validation, RBAC matrix and phase mapping agree.
2. **MVP foundation gate:** isolated PostgreSQL boots, migrations run, rollback/restore tested; every home has one immutable Home ID, multiple projects, owner privileges, and denial of cross-home access.
3. **Scheduling gate:** add two contracts/SOWs/WBS branches, one IMS, approve baseline; deterministic CPM and dependency-cycle rejection; forecast never changes approved baseline.
4. **Evidence gate:** secure stored media upload, explicit review, tamper rejection and geofence limitations shown; no simulated uploaded content labeled live.
5. **Operations gate:** passport survives owner transfer; selective data visibility and immutable Home ID verified.
6. **Release gate:** security and legal reviews, accessibility/localization, performance, backups, secrets, incident response and authority disclaimers; explicit approval before modifying `main`.

## 8. Explicit non-goals of this DTD delivery

- No live backend, database service, integration, government approval, bank release, tax return, UAV/video surveillance, automatic engineer certification or actual ownership/title transfer was deployed.
- SQL is a **proposed first migration**, not a validated production schema; no runtime/tenant test yet.
- API spec is a **target contract**, not an accessible server.
- Existing static application and GitHub Pages site remain unchanged.

## 9. Further documentation

- `docs/architecture/data-model.md` — ERD, roles, transfer/data classification, event handling
- `docs/architecture/openapi.yaml` — proposed API
- `db/migrations/0001_core.sql` — initial PostgreSQL schema (no permissive application RLS policies yet)
- `docs/architecture/acceptance.md` — test matrix, backlog and release constraints

## 10. Authoritative references

- Approved internal baseline: `/BAITNA/BAITNA_Approved_Baseline_2026-11-17.md` in ChatGPT Library
- Prior audit: `/BAITNA/BAITNA_Gap_Analysis_Architecture_MVP_2026-11-17.md`
- PostgreSQL row security: https://www.postgresql.org/docs/18/ddl-rowsecurity.html
- OWASP API1 BOLA: https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/
- OpenAPI 3.1.2: https://spec.openapis.org/oas/v3.1.2.html
- Node.js LTS: https://nodejs.org/en/about/previous-releases
