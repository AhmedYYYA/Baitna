# Agent 8 — Performance & SEO Report

**Reference run:** https://github.com/AhmedYYYA/Baitna/actions/runs/44250455358
**Method:** comparative GitHub Actions Chromium laboratory simulation at 390×844, local static servers, same runner and viewport for before/after; PerformanceObserver LCP/CLS. **No field Core Web Vitals or simulated mobile network/CPU throttling** in this run.

| Page | LCP before → after (ms) | CLS before → after |
|---|---|---|
| Landing | 208 → **152** | 0.0676 → **0.0364** |
| Lifecycle workspace | 112 → **112** | 0.2677 → **0.0499** |
| Owner Requirements Brief | 132 → **108** | 0.0850 → **0.0482** |
| Regulatory reference | 44 → **44** | 0.0000 → **0.0000** |
| Classic construction demo | 112 → **116** | 0.0077 → **0.0073** |
| Regulator view | 120 → **124** | 0.1759 → **0.0032** |

The lab LCP/CLS on this run satisfy the numerical limits (LCP ≤ 2500ms, CLS ≤ 0.1). **These fast local-server times are NOT evidence of a sub-2.5s LCP on a mid-range mobile device.** No field INP, CrUX data, or real 3G/4G simulation is available. Multiple runs are needed to estimate variance.

### SEO, metadata and performance work
- Canonical URLs are added for the six existing routes, excluding tracking query parameters. Old URLs and query parameters remain usable.
- Open Graph and Twitter summary metadata, Arabic default/English toggle via an inert attribute updater; `og:locale:alternate` declares English.
- Landing `WebSite` JSON-LD identifies an independent site, with `inLanguage` for Arabic and English; no official endorsement asserted.
- The regulatory reference page's existing `noindex,nofollow` is kept.
- New CSS is static and scoped; scripts are small, deferred, and view-only. No remote font assets or production JS dependencies added.

### Outstanding and blocked
- Genuine bilingual search indexing normally needs distinct crawlable locale URLs or correct hreflang; frozen routes disallow that redesign without explicit approval.
- No new Open Graph image added (an original, licensed social asset is required).
- Field Core Web Vitals "good" status, INP and mid-range mobile LCP remain unverified.

**Agent 8:** lab LCP/CLS PASS; actual field/Core Web Vitals acceptance **PENDING**.
