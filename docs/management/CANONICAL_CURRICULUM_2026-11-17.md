# Canonical curriculum — 17 November 2026

**Status:** approved target curriculum  
**Machine-readable source:** [`data/catalog/curriculum-canonical-v1.json`](../../data/catalog/curriculum-canonical-v1.json)

## Approved scope

| Track | Name | Lessons | Themes | Modules |
|---|---|---:|---:|---:|
| A | XAI Practitioner | 60 | 11 | 21 |
| B | Inside AI | 49 | 9 | 15 |
| C | Building with AI | 33 | 6 | 11 |
| D | Mathematical & Research Foundations | 25 | 5 | 10 |
| **Total** | **4 tracks** | **167** | **31** | **57** |

## Canonical hierarchy and numbering

All tracks use the same hierarchy:

**Track → Theme → Module → Lesson**

Lesson numbers use `Theme.Module.Lesson`, for example `1.1.1`. Numbering starts at `1.1.1` independently in each track. Duplicate lesson numbers across different tracks are expected and valid. The term **Module** replaces the former term **Subtopic**.

Track D is an independent, parallel track. It is not a prerequisite-only foundation stage.

## Source-of-truth rule

The JSON file linked above is the canonical, machine-readable definition of the approved target curriculum. Site pages, navigation, knowledge maps, and future catalog generation should consume this source rather than maintain separate manually edited lesson lists.

The JSON records the complete Russian lesson titles and target hierarchy. English and Chinese translations, final page routes, and publication metadata must be populated only after validation; null values are intentionally left null rather than guessed.

## Legacy identity and migration safeguards

For Track A, the 30 previously agreed old-number → new-number → UID mappings are recorded. Their old numbers and UIDs are retained as migration references, not as proof that all language variants or URLs currently resolve.

For Tracks B, C, and D, legacy mappings are marked `not_verified`. This means **not yet established**, not unpublished and not absent. No old number, UID, publication status, or URL is inferred.

Before changing the existing production catalog or pages, prepare and validate a complete crosswalk containing:

- old number → new number → title → UID;
- previous and target track/theme/module ownership;
- RU, EN, and ZH URLs and HTTP validation results;
- publication/content status and explicit migration action;
- duplicate, missing, and conflicting identity checks.

Preserve existing published URLs, stable lesson UIDs, and learner progress. Do not delete or overwrite the current catalog as part of adopting this specification.

## Validation performed when this specification was generated

- Track counts: 60 / 49 / 33 / 25.
- Total lessons: 167.
- Themes: 31.
- Modules: 57.
- Every lesson number is generated from its position within its track/theme/module.
- Track A known legacy mapping references: 30.
- Track B/C/D legacy mappings: unverified; no publication claim is made.

## Change control

Any change to this approved curriculum should update this JSON and this document together, with a dated commit and refreshed count validation. Existing site migration is a separate step and must not be conflated with approval of the curriculum itself.
