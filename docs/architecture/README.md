# BAITNA | بيتنا — Architecture delivery index

**Scope:** Detailed Technical Design 0.1 · 17 November 2026  
**Target:** initial backlog BT-001–BT-009 (Permanent Home ID, users/access, independent Contract/SOW, WBS/BOQ, one master IMS) with later-phase architecture for evidence, finance/VAT, digital home passport, maintenance and digital-record transfer.

## Deliverables on this isolated branch

1. [Technical architecture](./technical-design.md) — deployment choices, modular monolith, lifecycle workflow, non-goals, quality gates.
2. [Domain model & security](./data-model.md) — ERD, data scope, authority matrix, revision controls, transfer/privacy rules.
3. [OpenAPI interface contract](./openapi.yaml) — proposed REST interface; **not a working server**.
4. [PostgreSQL migration 0001](../../db/migrations/0001_core.sql) — proposed relational foundation; **not run against a server**. RLS is switched on with NO application policies (default-deny).
5. [Acceptance specifications](./acceptance.md) — BT-001–024 delivery sequence, positive/negative cases, release gates.

6. [Pre-contract procurement and sourcing](./procurement-sourcing.md) — RFI / RFP / RFQ, bilingual Arabic-English terminology, tender workflow, bid evaluation, traceability into Contract/SOW/IMS. **Approved product scope; not coded.**

## Key architectural decisions

- Pre-contract RFI/RFP/RFQ belong to a separate Sourcing module preceding contractual approval. They are optional procurement instruments, not a mandatory fixed sequence.
- The Home ID is an immutable, non-sequential identifier attached to the *home*, not the account.
- One home has many construction / renovation / maintenance projects, so its technical passport survives handover and manager transfer.
- A project may have many contracts/SOWs; its **one master IMS** has many immutable revisions and a current-approved-baseline pointer.
- Forecast/delay simulations are not baseline amendments, nor do SOW changes automatically amend a contract.
- Existing GitHub Pages remains a public **static demonstration only**. Keep real records behind authenticated private API.
- BAITNA is privately owned and not yet a bank, statutory engineering certifier, tax authority or property-registry integration.
- In-app digital-record handover shares permitted technical data; it does not transfer legal real-estate title or former owner-private data.

## Status & what is not built

| Artifact | Status |
|---|---|
| Technical design | Authored, open for engineering review |
| Initial relational DDL | Authored, **not executed or integration-tested** |
| REST API contract | Authored, **not implemented** |
| Production authentication / RLS grants | **Not implemented**, mandatory security gate |
| Frontend app / backend server | **Not implemented** |
| Local database instance | **Not provisioned** |
| File upload, photo geofence, bank, VAT and registry | **Not implemented/integrated** |
| Public `main` branch | **Untouched** |

## Immediate next coding slice once design is reviewed

Build a private local development environment (Node.js 26 LTS + PostgreSQL 18), add migration runner and an OIDC/mock-dev identity adapter explicitly marked development-only, then implement `POST /homes`, `GET /homes`, `POST /homes/{homeId}/projects` with role-scoped queries and transactional audit/idempotency; write cross-home denial tests **before** exposing other endpoints. Next implement Contract/SOW and IMS schedule versioning after RLS and permissions pass.

Do **not** merge this design branch or publish a private-data application until these gates and owner review pass.

**Source baseline:** ChatGPT Library `/BAITNA/BAITNA_Approved_Baseline_2026-11-17.md` and `/BAITNA/BAITNA_Gap_Analysis_Architecture_MVP_2026-11-17.md`.
