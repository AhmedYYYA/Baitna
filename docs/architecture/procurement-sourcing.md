# BAITNA | بيتنا — Pre-Contract Procurement & Sourcing
**Scope extension proposed and accepted by product owner: 17 November 2026 — bilingual Arabic/English nomenclature**
**Status: design requirement; NOT YET implemented in the running local MVP.**

## 1. Official bilingual terminology

| Abbreviation | English | Arabic | Primary decision |
| --- | --- | --- | --- |
| RFI | **Request for Information** | **طلب معلومات** | Discover available suppliers, consultants, methods, technology, capability, experience and preliminary market data. |
| RFP | **Request for Proposal** | **طلب تقديم عروض** / **طلب عروض فنية وتجارية** | Seek comparable technical and commercial proposals against requirements, evaluation criteria and possible alternatives. |
| RFQ | **Request for Quotation** | **طلب عرض سعر** / **طلب عروض أسعار** | Obtain specific itemized pricing for an adequately defined scope, BOQ, materials or services. |

These are **three distinct procurement instruments**, not the three core delivery-control instruments:
- **Pre-contract sourcing:** RFI / RFP / RFQ / bid comparison / supplier selection.
- **Contract & project delivery:** Contract / SOW / IMS integrated with WBS & BOQ.
- **Beyond delivery:** evidence, inspection, finance, VAT readiness, handover, home passport, assets, maintenance and later in-app management transfer.

**No mandatory universal RFI → RFP → RFQ order.** The homeowner/consultant may issue an RFI first, then an RFP *or* RFQ, or combine RFP technical appraisal with itemized RFQ/commercial schedules. The procurement policy, cost thresholds, scope certainty and the contract path determine actual steps.

For construction, RFI also sometimes means a **site technical Request for Information** used to clarify drawings or specifications *after award*. Keep a separate type `TECHNICAL_CLARIFICATION_RFI` from sourcing `PROCUREMENT_RFI` to avoid mixing workflows.

## 2. Proposed user journey (not yet coded)

```text
Permanent Home ID + New Build Project
  └─ Initial requirements / concept / preliminary BOQ / budget
       └─ Optional Procurement RFI → market knowledge & shortlist
             ├─ RFP → technical methodology, capability, alternatives, indicative programme/pricing
             ├─ RFQ → line-item commercial quotations to defined quantities/specifications
             └─ RFP with financial annex / RFP followed by RFQ as needed
                         ↓
             Controlled Q&A / bid closing / evaluation
                         ↓
             recommendation → negotiated selection → owner approval
                         ↓
             Contract (independent signed and versioned instrument)
             SOW (versioned, technically defined, contract incorporation by reference)
             WBS / BOQ → single master IMS approved baseline
                         ↓
              Daily progress → handover → digital home passport
```

**SOW nuance:** a *draft* scope/specification may be attached to an RFP/RFQ as the tender brief; the **contractual SOW** is only the agreed and appropriately incorporated version. Similarly, bidders may supply preliminary schedules but these do not automatically become the approved IMS baseline.

## 3. Functional module: Sourcing & Tenders | الاستعلام والطرح والتقييم

### Proposed records
- `ProcurementPackage` / **حزمة الطرح:** owner, `home_id`, `project_id`, package reference, title, stage, estimated budget, geographical location, requirements version.
- `Solicitation` / **وثيقة الطلب:** type `RFI | RFP | RFQ`, independent number, status, version, due date, language, terms/disclaimer, invitation and addendum.
- `Bidder` / **المتقدم أو الجهة المدعوة:** vendor/consultant firm, basic qualification/registration evidence and contacts; never label a company government-approved without verification.
- `Invitation` / **دعوة:** supplier recipient, issued date, response window, confidentiality and invitation status.
- `Clarification` / **استيضاح:** question/answer, source, publish-to-all handling for fair competition where applicable.
- `Submission` / **العرض الوارد:** bidder, documents, technical response, BOQ quotations, scope exceptions, validity, timestamp, revision/history.
- `Evaluation` / **التقييم:** published criteria, weighted scoring where configured, eligibility checks, commercial normalization, conflicts of interest and documented recommendation.
- `SourcingDecision` / **قرار الاختيار:** selected or rejected offer, approving party, reason, date and audit trail.
- `AwardLink` / **الربط التعاقدي:** traceability to contract, SOW and approved schedule/bid annexes *without presuming that sourcing forms a contract*.

### Roles
- Homeowner / **مالك المسكن:** authorizes issuing/closing a request and award decision according to delegation.
- Project manager or consultant / **مدير المشروع أو الاستشاري:** prepares tender packages, assesses technical responses, recommends candidates within assigned scope.
- Bidder / **المقاول أو الاستشاري المتقدم:** sees only invitations and its own submission/clarifications.
- Audit viewer / **مراجع مخوّل:** reads scoped evaluation and decision history; confidentiality always applies.

### Status model
`draft → approved_for_issue → issued → clarifications_open → closed → under_evaluation → awarded|cancelled`
Individual bidder submissions have their own statuses, including `draft → submitted → withdrawn|superseded`.
Award is a sourcing decision, **not** execution of a legal property conveyance or automatically a signed construction contract.

### Information controls
- Home ID immutable; tender linked to that home and one project, even if several tender packages exist.
- Approved tender documents and bidders' sealed submissions are versioned, time-stamped and auditable; no undeclared change after issue.
- Competing bids and prices are accessible only to the owner and explicitly authorized reviewers, not rival suppliers.
- The evaluator must distinguish technical responsiveness, compliance, fee/price, schedule and risk rather than treating lowest price as always best.
- Evaluation history, clarifications, exceptions and award decision must be traceable to the selected contract and SOW.
- No claimed government-approved bidder register, mandatory municipal process or government procurement partnership without separate legal authorization.

## 4. Integration with Contract / SOW / IMS

**Relationships:**
`Home → Project → ProcurementPackage → 0..n Solicitations → Bidder Submissions → Evaluation → SourcingDecision → 0..n Contracts → 0..n SOWs → WBS/BOQ → 1 master IMS → N versions`.

**No auto-contract creation:** selecting an offer may prefill drafts, but requires an explicit contractual authorization and, where applicable, signature. Tender pricing becomes an input and is not deemed an approved payment obligation.

**No auto-SOW or IMS approval:** an RFP specification or bidder schedule may prefill *drafts*. Authorized roles must separately review the definitive SOW and schedule baseline.

## 5. Delivery scope and test targets

These additions extend the previous BT-001–BT-024 planning backlog:
- `BT-025` — ProcurementPackage, Solicitation type and document/version model; link to Home/Project.
- `BT-026` — invitation, suppliers, clarification messages and confidential bidder submissions.
- `BT-027` — configurable evaluation criteria, comparative matrix, technical/commercial review and reasoned recommendation.
- `BT-028` — approved sourcing decision → editable drafts of Contract/SOW/IMS with end-to-end traceability and no implicit approval.

**Recommended sequencing:** design linkages now; implement minimum RFI/RFP/RFQ issuance/evaluation alongside the next Contract/SOW module expansion, after secure identity and access controls. Keep existing local SQLite demonstrator and public GitHub Pages unmodified until tested.

## 6. References (terminology and process — not UAE legal advice)
- CIPS procurement glossary: https://1prd-dxp.cips.org/intelligence-hub/glossary-of-terms
- CIPS procurement process: https://1prd-dxp.cips.org/intelligence-hub/procurement/procurement-process
- FAR pre-solicitation exchanges and RFI/RFP distinctions: https://www.acquisition.gov/far/subpart-15.2

**Last statement:** approved product scope only, not functional software, official policy, registration status or legal advice.
