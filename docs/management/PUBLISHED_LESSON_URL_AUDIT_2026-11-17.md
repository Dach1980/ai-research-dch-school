# Audit of 30 Published Lessons and 90 Language URLs

**Date:** 2026-11-17  
**Repository:** [Dach1980/ai-research-dch-school](https://github.com/Dach1980/ai-research-dch-school)  
**Scope:** Read-only audit. No catalog entries, lesson pages, URLs, UIDs, publication states, or learner progress were modified.

## Executive result

- Published lessons in `data/catalog/catalog-v3.json`: **30**
- Expected language URLs: **90** (RU, EN, ZH per lesson)
- URLs populated in catalog: **90/90**
- Corresponding HTML files confirmed in GitHub repository: **90/90**
- Public HTTP availability: **not verified (90 URLs)**

## What was checked

1. Read the current `data/catalog/catalog-v3.json` and selected records with `status = published`.
2. Extracted each lesson UID, current lesson code, Russian title, and RU/EN/ZH paths.
3. Requested every one of the 90 corresponding paths through the GitHub repository file API. All 90 files were returned successfully.
4. Attempted to inspect the public GitHub Pages URLs. The available page-opening tool returned an internal accessibility error for the tested URLs. The alternative batch fetch path required user approval, which was not granted. Therefore no HTTP status is asserted.

## Important distinction

| Check | Result | Meaning |
|---|---:|---|
| URL field in catalog | 90/90 | All expected paths are recorded |
| HTML file in GitHub | 90/90 | All matching files exist on the repository's default branch |
| Public HTTP response | Not verified | This audit cannot certify that all Pages URLs currently return HTTP 200 |

A repository file being present does not prove that GitHub Pages has deployed it successfully or that the public URL returns HTTP 200. Do not mark public URL availability as passed based on this report.

## Migration safety recommendation

- Preserve the existing public lesson URLs for all 30 published lessons, including EN and ZH variants.
- Do not rename or move the 90 HTML files as part of curriculum renumbering.
- Do not change published lesson UIDs or catalog URL values until the migration plan includes explicit redirects/compatibility handling and a separate HTTP smoke test.
- Keep the canonical curriculum and migration Crosswalk as staging documents; this audit does not authorize catalog migration.

## Detailed results

See [`PUBLISHED_LESSON_URL_AUDIT_2026-11-17.csv`](PUBLISHED_LESSON_URL_AUDIT_2026-11-17.csv) for all 90 records, including UID, language, catalog path, GitHub file confirmation, public URL, and HTTP verification state.

## Final status

**repository_files_verified_http_unverified**

The repository-side file-presence check passed for all 90 language pages. Public HTTP availability remains an open verification item. No production files were changed.
