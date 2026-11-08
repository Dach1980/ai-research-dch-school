# Catalog v3 consumer inventory and migration gates

**Date:** 8 November 2026  
**Status:** inventory based on current repository; no production consumer switched to v3.

## Static site consumers

| Consumer | Current contract | v3 action | Cutover status |
|---|---|---|---|
| `scripts/lesson-catalog.js` | `DCHCatalogCompat.load({schemaVersion:2})`; reads display-like IDs, module IDs, status, localized titles and URLs | Add a v3 presentation projection that resolves UID → legacy alias/URL and keeps unpublished outline-only lessons hidden | Not switched |
| `scripts/home-knowledge-map.js` | v2 lesson IDs, status, track_id, title_i18n, url_i18n | Same projection; must not expose planned lessons | Not switched |
| `scripts/planet-map-catalog.js` | v2 planet.lesson_id and legacy IDs used for positions/labels | Preserve planet identity/position and resolve lesson UID through manifest | Not switched |
| `tracks/understanding-ai*.html`, `lessons/index*.html`, `learning-map/*`, homepage RU/EN/ZH | Load compatibility script before catalogue consumers | Keep v2 loading until parity tests pass; then migrate as a coordinated UI release | Not switched |
| `scripts/catalog-compat.js` | Browser v1→v2 and v2 normalizers | Native v3 read/relationship validation added; v1/v2 paths retained | Additive support |
| `scripts/catalog_compat.py` | Python v1 split catalog and v2 file loader | Native v3 reader and UID relationship validation added | Additive support |
| `scripts/lesson-reader.js` and lesson HTML | Existing page slugs and lesson content payloads | Retain old URLs; add alias resolution only after reader contract audit | Not switched |

## Supabase-backed consumers and identifiers

The checked-in migrations define:
- `public.lesson_catalog.id` as a text primary key;
- `public.lesson_content.lesson_id` as a text primary key / FK to `lesson_catalog(id)`;
- `public.lesson_entitlements.lesson_id` as a text FK to `lesson_catalog(id)`;
- admin UI reads, creates, updates and publishes `lesson_catalog` rows using those text IDs;
- lesson payload reads and writes use the same `lesson_id`.

These IDs currently use content slugs such as `a-1-what-is-artificial-intelligence`, not the JSON v2 display IDs. They are another legacy namespace and must receive explicit manifest aliases. Do not change these primary/foreign keys in place.

The migrations inspected define profiles, lesson metadata/content, entitlements, admin roles and audit records. No dedicated progress, bookmark, or quiz-attempt tables were found in the checked-in migrations. Before cutover, inspect the live Supabase schema and any external persistence/analytics integrations; do not infer that learner state is absent merely because it is not represented in these migrations.

Migration 008 now implements the additive UID registry, alias table, fragment mapping group/target tables, and a service-role-only alias resolver. It seeds 50 v3 lesson UIDs and 342 alias rows from the manifest. All aliases are resolve-only; no entitlement is inherited. The migration does not update any row in lesson_catalog, lesson_content, or lesson_entitlements.

## Required additive data model before cutover

1. Add a legacy alias relation keyed by `source_system + legacy_id`, pointing to a v3 UID. A URL is also an alias, but must not be assumed unique across locales.
2. Add fragment mapping records with source page/fragment/topic, target lesson UID, mapping type, editorial confidence and migration revision.
3. Preserve existing entitlement IDs or provide an explicit alias resolution path; entitlement grants must not silently broaden to every child lesson after a legacy lesson is split.
4. If progress/bookmark/quiz persistence is introduced or found in the live system, migrate each record with an idempotent script and an auditable source→target decision. A legacy completion must not automatically mark every child lesson complete.
5. Preserve localized URL routes and titles independently of UID. Redirects are a separate later decision.

## Evidence and current boundary

Repository files inspected include:
- `scripts/lesson-catalog.js`
- `scripts/home-knowledge-map.js`
- `scripts/planet-map-catalog.js`
- `scripts/catalog-compat.js`
- `scripts/catalog_compat.py`
- `scripts/admin-management.js`
- `supabase/migrations/001_learning_access.sql` through `007_publish_a6_generalization.sql`

The v3 reader is additive. The production pages and Supabase admin interface continue to use their current contracts. This is intentional: v3 currently contains the new Track A outline and fragment mappings, not a complete replacement projection of every published page and persisted access record.
