# Canonical lesson migration Crosswalk — 17 November 2026

**Status:** migration analysis artifact; not an execution authorization  
**Target source:** [canonical curriculum JSON](../../data/catalog/curriculum-canonical-v1.json)  
**Current source catalog:** [catalog-v3.json](../../data/catalog/catalog-v3.json)  
**Previous mapping input:** [CANONICAL_LESSON_OWNER_CROSSWALK_2026.csv](./CANONICAL_LESSON_OWNER_CROSSWALK_2026.csv)

## Purpose and safety boundary

This Crosswalk maps the 167 current catalog lesson records to the approved 167-lesson, four-track curriculum. It is a new, versioned migration artifact. It does **not** modify or replace `catalog-v3.json`, lesson pages, URLs, UID values, publication states, prerequisites, learner progress, or frontend behavior.

The current catalog has 167 unique lesson UIDs, and every one is currently assigned to `trk-a`. The approved target curriculum distributes lessons across A/B/C/D. The ownership reassignment is therefore a proposed migration, not a current-state fact.

## Source snapshot and validation

| Check | Result |
|---|---:|
| Current catalog lesson records | 167 |
| Unique current catalog UIDs | 167 |
| Target lessons | 167 |
| Target rows represented | 167 |
| Current records missing from Crosswalk | 0 |
| Current records on `trk-a` | 167 |
| Existing RU URLs in catalog | 30 |
| Existing EN URLs in catalog | 30 |
| Existing ZH URLs in catalog | 30 |

### Target distribution

| Track | Lessons |
|---|---:|
| A — XAI Practitioner | 60 |
| B — Inside AI | 49 |
| C — Building with AI | 33 |
| D — Mathematical & Research Foundations | 25 |

### Current publication state

| Current catalog status | Records |
|---|---:|
| published | 30 |
| planned | 137 |

The 30 records marked published have RU/EN/ZH URL values in the current catalog. Their URLs are copied as source values, but HTTP reachability was **not checked** in this Crosswalk.

## Mapping method

1. Each target lesson is matched to a current catalog record by exact Russian title where possible.
2. For ten title differences, a likely semantic counterpart is recorded as a **manual-review candidate**. These are not approved identity matches.
3. The current catalog UID is recorded as `source_catalog_uid`. `proposed_uid_reuse` is a proposal only.
4. The 30 previously agreed published Track A mappings retain their known target UID in `target_uid_known_in_canonical`.
5. The remaining target UID values stay blank in the canonical curriculum; the Crosswalk does not silently promote unapproved UID candidates into canonical identity.
6. Old URLs are copied from the current catalog and explicitly marked `not_checked` for HTTP validation.

## Mapping results

| Mapping type | Records | Treatment |
|---|---:|---|
| Exact Russian title match | 157 | High-confidence candidate; UID reuse still requires migration review |
| Title-variant candidate | 10 | Human content/learning-outcome review required |
| **Total** | **167** | **All target lessons have a row** |

### Ten title-variant candidates requiring manual review

| Current catalog title | Target title | Current UID |
| Классы и объектно-ориентированное программирование | Классы и ООП | les-a-0067 |
| Исследовательский анализ данных (EDA) | EDA — Exploratory Data Analysis | les-a-0074 |
| Метод ближайших соседей и метод опорных векторов | Метод ближайших соседей и SVM | les-a-0103 |
| GAM и EBM: интерпретируемые модели с нелинейными зависимостями | GAM и EBM | les-a-0114 |
| Partial Dependence Plot | PDP — Partial Dependence Plot | les-a-0024 |
| Individual Conditional Expectation | ICE — Individual Conditional Expectation | les-a-0025 |
| Accumulated Local Effects | ALE — Accumulated Local Effects | les-a-0026 |
| ATE и CATE: средний и условный причинный эффект | ATE и CATE | les-a-0121 |
| Meta-learners и методы оценки гетерогенных эффектов | Meta-learners | les-a-0123 |
| Правила принятия решений и rule-based explanations | Rule-based explanations | les-a-0150 |

These are deliberately not marked as exact matches. Confirm lesson content, learning outcomes, assessment, and whether the target lesson is a rename, split, merge, or replacement before reusing the UID.

## UID and URL safeguards

- `source_catalog_uid` is the actual UID read from the current catalog.
- `target_uid_known_in_canonical` is populated only for the 30 already agreed published Track A mappings.
- `proposed_uid_reuse` is a candidate, not an approved identity assignment.
- Never create a new UID merely because a target title changed.
- Never delete or regenerate a published UID.
- Preserve published RU/EN/ZH routes and learner progress; use aliases/redirects only after route and progress impact analysis.
- Blank URL fields mean the current catalog has no URL recorded; they do not prove that no lesson page exists.
- `url_http_validation=not_checked` means reachability remains unverified.

## Important ownership correction

The current catalog records all 167 lessons under `trk-a`. This is not the target ownership model. The Crosswalk's `target_track_code`, `target_theme_number`, `target_module_number`, and `target_lesson_number` fields represent the approved future structure. The `previous_crosswalk_*` columns preserve older ownership metadata only as historical source information; that metadata must not override the approved target curriculum.

## Migration blockers before catalog changes

1. Review the ten title-variant candidates and approve/reject each mapping.
2. Review UID reuse for the 127 planned exact-title matches; the current catalog UID is a candidate, not a user-approved canonical identity.
3. Confirm the 30 published lesson URLs with HTTP checks in RU/EN/ZH and inspect any language-specific content.
4. Audit prerequisites for cross-track moves; do not leave references pointing to invalid or circular dependencies.
5. Check progress/bookmark/assessment records and define compatibility aliases for old lesson codes and URLs.
6. Decide URL strategy for new Track B/C/D ownership without changing existing published paths.
7. Only after these checks, prepare a separate catalog migration diff and run schema, route, localization, and progress regression tests.

## Explicit non-actions

- No write was made to `data/catalog/catalog-v3.json`.
- No lesson page or published URL was changed.
- No UID, status, prerequisite, or progress value was changed.
- No assumption was made that a record without a URL is unpublished or nonexistent.

## Result

`crosswalk_prepared_with_manual_review_required`

The new Crosswalk provides a one-row-per-target-lesson migration map for all 167 lessons, separates source facts from target assignments, and makes unresolved identity decisions explicit. It is ready for review; it is not yet a safe-to-apply catalog migration.
