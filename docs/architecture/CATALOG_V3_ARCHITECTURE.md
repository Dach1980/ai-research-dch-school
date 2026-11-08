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

A.3, A.6 and XAI A.1.2.1 have fragment-level mapping records. A.4/A.5 and the remaining partially reviewed sources are explicitly unresolved rather than assigned speculative target UIDs. The XAI legacy page remains review-only. The old XAI toy score lab is not relabelled as SHAP.

## Compatibility contract

- v1 split files remain readable by the existing v1→v2 adapter.
- v2 hierarchical catalog remains readable by the v2 adapter.
- v3 is read natively by the Python and browser adapters without collapsing UID into display code.
- v1/v2 production consumers remain on v2 until their required legacy presentation view and user-data migration are verified. The new native v3 reader is additive; it does not silently change the existing UI payload contract.
- A future consumer migration must resolve legacy IDs and URLs through the manifest/alias layer and use v3 UIDs internally.

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
2. Complete editorial reconciliation of A.4/A.5, confirm exact lesson outlines and source fragment selectors.
3. Inventory every catalog consumer and define compatibility view/API contracts.
4. Add user-data schema migration and idempotent backfill for progress, bookmarks, quiz attempts and planets.
5. Dual-read / shadow validation while v2 remains the public source.
6. Switch consumers individually only after parity tests, browser/mobile checks and CI.
7. Keep v1/v2 aliases and old URLs through a defined deprecation window; redirects only after inbound-link and analytics review.

## Acceptance criteria

- schema validation and relationship checks pass;
- every UID is unique and every parent/prerequisite/planet reference resolves;
- all manifest target UIDs exist and code/UID pairs agree;
- all legacy URLs exist and their status is preserved;
- many-to-many mappings are represented at fragment level;
- v1/v2 compatibility tests continue to pass;
- no production catalog, user progress, bookmarks, quiz attempts or published URL changes before the final cutover gate.
