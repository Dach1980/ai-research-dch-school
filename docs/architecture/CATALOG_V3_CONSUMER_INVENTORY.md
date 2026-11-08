# Catalog v3 consumer inventory and migration gates

**Date:** 8 November 2026  
**Status:** three static consumers migrated to the legacy-preserving v3 projection; Supabase admin/editor and lesson-reader remain on legacy contracts.

## Static site consumers

| Consumer | Current contract | v3 action | Cutover status |
|---|---|---|---|
| `scripts/lesson-catalog.js` | `DCHCatalogCompat.loadLegacyProjection()`; keeps legacy IDs/status/URLs and adds v3 target UID metadata | Projection is active; published-only filter remains unchanged | Migrated with parity tests |
| `scripts/home-knowledge-map.js` | `loadLegacyProjection()` with the same v2 presentation fields plus v3 target metadata | Existing published-only filter and links preserved | Migrated |
| `scripts/planet-map-catalog.js` | `loadLegacyProjection()`; legacy planet IDs/lesson_id remain unchanged | Planet positions, accents and lesson links preserved; v3 metadata is additive | Migrated |
| `tracks/understanding-ai*.html`, `lessons/index*.html`, `learning-map/*`, homepage RU/EN/ZH | Load compatibility script before catalogue consumers | Keep v2 loading until parity tests pass; then migrate as a coordinated UI release | Not switched |
| `scripts/catalog-compat.js` | Browser v1→v2 and v2 normalizers | Native v3 read, relationship validation, and v2-preserving projection added; v1/v2 paths retained | Active |
| `scripts/catalog_compat.py` | Python v1 split catalog and v2 file loader | Native v3 reader, UID relationship validation, and Python legacy projection added | Active |
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

Migration 008 implements the additive UID registry, alias table, fragment mapping group/target tables, and a service-role-only alias resolver. It seeds 50 v3 lesson UIDs and 342 alias rows from the manifest. All aliases are resolve-only; no entitlement is inherited. The migration does not update any row in lesson_catalog, lesson_content, or lesson_entitlements. PostgreSQL 16 migration CI passed from a clean database.

## Remaining consumer and data gates before cutover

1. Migrate the Supabase admin/editor workflow to read and write v3 UIDs while preserving its current legacy slug rows and audit history.
2. Connect the service-role alias resolver to a trusted server-side operation; do not expose service_role credentials to the browser.
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

The three migrated static consumers use a legacy-preserving projection: their existing IDs, statuses, URLs, localized titles, prerequisites and planet associations are retained, while target UID arrays are added. Other consumers remain on legacy contracts until individually migrated. v3 still does not replace the existing Supabase lesson payloads or entitlement model.
