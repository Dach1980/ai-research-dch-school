# Catalog v3 architecture and staged migration

**Date:** 8 November 2026  
**Status:** schema and staging catalog implemented; production switch prohibited.

## Identity model

The v3 catalog uses immutable technical UIDs for every entity:
- Track: `trk-*`
- Theme: `thm-*`
- Module: `mod-*`
- Lesson: `les-*`
- Resource: `res-*`
- Planet: `pln-*`

The human-facing lesson code (`1.2.1`) is a mutable display attribute. It is never used as a foreign key, progress key, bookmark key, translation key, or prerequisite identifier. A UID must not be regenerated when a title, code, locale, URL, or parent ordering changes.

The catalog hierarchy is Track → Theme → Module → Lesson. Theme and Module numbers are scoped to their parent. Track A is represented by the approved five themes and 27 modules. B and C retain their existing track identities; no new curriculum content is fabricated for them.

## Content and legacy migration

`migration-manifest-v3.json` separates legacy identity from target content:
- `legacy_entities` preserve old IDs, v2 aliases, publication state and RU/EN/ZH URLs;
- `content_mappings` map source content topics/fragments to one or more target lesson UIDs;
- one legacy lesson can map to many target lessons and one target lesson can receive content from multiple legacy lessons;
- mappings describe editorial topics, not assumed HTML DOM IDs. Exact source selectors must be verified during content extraction.

A.3, A.6 and XAI A.1.2.1 have fragment-level mapping records. A.4/A.5 are editorially reconciled against their drafts and published RU/EN/ZH pages. A.1/A.2 remain candidate mappings pending a final section-level review. The XAI legacy page remains review-only. The old XAI toy score lab is not relabelled as SHAP.

## Compatibility contract

- v1 split files remain readable by the existing v1→v2 adapter.
- v2 hierarchical catalog remains readable by the v2 adapter.
- v3 is read natively by the Python and browser adapters without collapsing UID into display code.
- Three static consumers (lesson listing, homepage knowledge map and Planet Map) now call loadLegacyProjection(). This projection keeps the v2 presentation contract and adds v3 target UID/code arrays. Other consumers remain on legacy contracts. Native v3 reading remains additive.
- A future consumer migration must resolve legacy IDs and URLs through the manifest/alias layer and use v3 UIDs internally.

## Legacy-preserving consumer projection

The browser and Python adapters expose a projection that combines the existing v2 presentation catalogue with v3 target mappings. It deliberately retains every legacy lesson ID, status, localized URL, prerequisite and planet association. It adds v3 target UIDs/codes as metadata arrays; a split legacy lesson is never coerced into one target UID. The first three static consumers use this projection. They still filter on legacy publication state, so planned v3 outlines cannot appear as published pages.

## Supabase alias layer

Migration 008 adds a staging UID registry, legacy alias table, source-fragment mapping groups and target rows. It registers the current v3 lesson UIDs, catalog-v2 IDs, static localized URLs and Supabase lesson_catalog slugs. Alias resolution is deliberately resolve-only: the resolver does not modify or inherit lesson entitlements. Existing lesson_catalog IDs, lesson_content foreign keys and lesson_entitlements remain unchanged. The SQL resolver is restricted to service_role; the browser/admin UI has not yet been switched to it.

## Data preservation gates

Before switching a consumer, inventory and test:
1. prerequisites and dependency ordering;
2. RU/EN/中文 content and localized routes;
3. progress and completion records;
4. bookmarks and saved lesson references;
5. quiz attempts and scores;
6. planet/map associations;
7. admin/editor records and external inbound links.

Progress must be migrated by an explicit, audited alias mapping. A split legacy lesson must not mark every target lesson complete automatically. The product decision for partial completion must be explicit (e.g. legacy completion retained as historical completion, with new lesson progress starting empty).

## Rollout

1. **Additive stage (current):** schema v3, staging catalog, manifest, native readers and validators. No public switch.
2. A.4/A.5 reconciliation is complete; A.1/A.2 still need final section-level review.
3. Static consumer inventory is complete; three consumers have moved to the projection. Migrate remaining consumers individually.
4. Inspect live Supabase schema and external state stores; implement idempotent progress/bookmark/quiz migration only where such state exists.
5. Integrate the service-role alias resolver into trusted admin/server operations without exposing privileged credentials.
6. Dual-read / shadow validation and consumer parity checks; then browser/mobile acceptance.
7. Keep v1/v2 aliases and old URLs through a defined deprecation window; redirects only after inbound-link and analytics review.

## Acceptance criteria

- schema validation and relationship checks pass;
- every UID is unique and every parent/prerequisite/planet reference resolves;
- all manifest target UIDs exist and code/UID pairs agree;
- all legacy URLs exist and their status is preserved;
- many-to-many mappings are represented at fragment level;
- v1/v2 compatibility tests continue to pass;
- no production catalog, user progress, bookmarks, quiz attempts or published URL changes before the final cutover gate.


The A.4/A.5 reconciliation and Supabase alias implementation are detailed in [A4_A5_EDITORIAL_RECONCILIATION_2026-11-08.md](../education/A4_A5_EDITORIAL_RECONCILIATION_2026-11-08.md).

The PostgreSQL 16 migration workflow passed from a clean database: [run 42453118981](https://github.com/Dach1980/ai-research-dch-school/actions/runs/42453118981).