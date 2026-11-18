# Agent 0 — Release and Rollback Plan

**Release branch:** `ui/multiagent-governance-lock-2026-11-18`  
**Draft PR:** https://github.com/AhmedYYYA/Baitna/pull/9  
**Frozen baseline commit:** `59fcb23ebdff8170e8910b7ee5c55519a37506d0`  
**Rollback branch:** `rollback/ui-multiagent-baseline-2026-11-18` (points to baseline).  
**Production `main`:** intentionally unchanged until approval of all release gates.

## Pre-release
1. Confirm Agent 9 9/9 source lock PASS and passing CI on current head.
2. Obtain independent WCAG 2.2 AA signoff on Chrome, Safari, Android/iPad and screen-reader/keyboard, in both Arabic and English.
3. Obtain field or representative mid-range mobile performance and INP data, not just local lab LCP/CLS.
4. Verify complete link/anchor matrix, FTA/municipal disclaimers, regulator read-only authority, and a 30-second comprehension exercise.
5. Clear Dubai webfont distribution rights before hosting any font binaries (none in current PR).
6. Create an **actual signed or annotated Git tag** for baseline using an authorized local Git client; the connected GitHub integration cannot create tags directly:
   ```sh
   git fetch origin main
   git tag -a baitna-ui-v2-preupgrade-2026-11-18 59fcb23ebdff8170e8910b7ee5c55519a37506d0 -m "Frozen BAITNA UI baseline"
   git push origin baitna-ui-v2-preupgrade-2026-11-18
   ```
7. Only then approve and merge the reviewed PR and wait for GitHub Pages successful build.

## Rollback once a later approved release has shipped
- Prefer `git revert <merge-commit-sha>` in a reviewed PR, not `git reset --hard` or destructive forced pushes to `main`.
- Verify script checksum/baseline, public 6 routes, role matrix, and manual accessibility checks after revert.
- The rollback branch remains an independent immutable reference to previous content. Preserve CI screenshots and evidence artifact IDs.

## Current release status
**HOLD.** The protected baseline remains live and no public workflow is changed.
