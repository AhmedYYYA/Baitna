# BAITNA | بيتنا — Local MVP Foundation v0.1

> **Working local software, not a production service.** This isolated proof of concept runs a Node.js HTTP API, a persistent on-disk SQLite database, a browser-based Arabic RTL interface and automated tests. All initial users and home records are synthetic. No real government, bank, UAE PASS, FTA, property registry or production identity integration exists.

## Requirements

- Node.js **22.16+** on a computer (macOS, Windows or Linux). Node's built-in `node:sqlite` is experimental in v22; the start/test scripts enable it explicitly. No npm packages, Docker, network access or cloud services are needed.
- A browser on the same computer. The API binds to `127.0.0.1` only for development safety.
- **An iPad cannot directly run this Node process inside the normal ChatGPT iOS app.** Use a Mac/PC to run it; a later private dev hosting solution would be necessary for iPad access.

## Start

```bash
cd app
npm start
```

Open **http://127.0.0.1:4100/app**. The database is created as `app/data/baitna-dev.sqlite` and persists between restarts. Do not put citizen data in this dev database.

Run the automated backend+API tests:

```bash
cd app
npm test
```

Change the port if needed: `PORT=4200 npm start` (Unix shell). For an isolated data store, set `BAITNA_DB_PATH=/path/to/test.sqlite`. Listen address is hard-coded to loopback; this is intentional.

## What actually works

- Server-generated random **Permanent Home ID** (`BT-H-<128-bit hex>`), immutable at DB level, Home creation idempotency and transaction-logged owner-manager assignment.
- Several construction, renovation and maintenance projects under the *same* Home ID.
- Development-only demo identities. **Permissions checked by server on every implemented resource route**, not by hiding a UI button. Different owners cannot read each other's homes.
- Multiple Contracts and independent SOWs, with approved revisions protected by SQL triggers. A SOW must belong to a Contract in the same project.
- WBS/BOQ mapped to a project, with basic server validation.
- Exactly one master IMS per project; draft revisions clone the approved baseline, maintain FS/SS/FF/SF predecessor links, detect cycles and compute day-calendar CPM and critical activities; explicit manager approval changes baseline while preserving old revisions.
- Arabic responsive local frontend with editable Home/Project/Contract/SOW/WBS/BOQ/IMS, Gantt, demo-actor selector, and read-only audit trail.
- Persistent SQLite file and tests on ephemeral isolated files.

## Security statement

**DO NOT DEPLOY TO THE INTERNET OR USE REAL DATA.** The `X-Demo-User` header is a deliberately insecure local test-user switcher and *not authentication*. The server is loopback-only and refuses `NODE_ENV=production`. SQLite is a temporary zero-dependency local adapter: it does not provide the approved PostgreSQL RLS model. Do not assume production identity isolation from these tests. Need real OIDC/JWT identity, tenant-scoped PostgreSQL grants/RLS, transactional migrations, secure private file storage, secrets management, malware scanning, security reviews, proper backup and independent authorization test before public release.

The model currently uses calendar days. It does **not** take holidays, working calendars, crew availability, weather or contract claims entitlement into account. CPM is an initial calculation, not a legal delay adjudication.

No operational photo collection, geofencing, daily reporting, document upload, financial settlement, VAT eligibility decision, warranty scheduler, home-passport export or record ownership transfer is present. These remain in the approved backlog.

## Directory structure

```text
app/
  package.json             scripts; no external dependencies
  schema.sql               SQLite local-only schema and immutability triggers
  db.js                    persistent model and RBAC-checked domain workflows
  schedule.js              deterministic FS/SS/FF/SF dependency analysis, CPM
  server.js                localhost API + static UI
  public/index.html        Arabic app shell
  public/app.js            browser/API state and interaction
  public/app.css           responsive app appearance
  tests/mvp.test.js        Node API/invariant tests
```

## Architecture relationship

- Product baseline: `BAITNA_Approved_Baseline_2026-11-17.md` in user Library.
- Detailed architecture: `docs/architecture/` in the **same GitHub branch**.
- Target PostgreSQL migration: `db/migrations/0001_core.sql` (a design artifact, **not run**, and has default-deny RLS without application policies).
- Node+SQLite MVP is a **local adapter**, not a retraction of the approved PostgreSQL target. A proper PostgreSQL adapter and real authorization are mandatory before any non-demo usage.

## Manual example

1. Open the app: `owner-a` starts with a synthetic Abu Dhabi home, approved Contract/SOW and six-task IMS.
2. Open **سجل المساكن**, create a second project on the same Home ID.
3. In **العقود وSOW**, add a Contract, a linked SOW and a WBS node.
4. In **IMS والأنشطة**, create the master IMS, a draft revision, activities and dependencies; approve the baseline.
5. Switch user to `owner-b` to see that no Home/project is shared.
6. Switch to `contractor-a` to see the project summary but not owner-only mutations.

## Acceptance tests

`npm test` exercises Home ID immutability, idempotency, tenant isolation, multi-project linkage, independent Contract/SOW revisions, project-scoped WBS/BOQ, baseline immutability, graph cycle rejection, CPM link types, append-only audit and local origin checks. These tests execute real server routes with a real temporary SQLite database; **they are not production PostgreSQL integration tests**.