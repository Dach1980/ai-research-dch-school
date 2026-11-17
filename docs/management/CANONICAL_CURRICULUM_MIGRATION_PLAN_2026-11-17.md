# Canonical curriculum migration plan — 17 November 2026

**Status:** `read_only_audit_complete_migration_no_go`  
**Target:** canonical four-track curriculum, 167 lessons  
**Scope:** technical audit and migration plan only. This document does not authorize catalog, lesson, URL, UID, publication, access, or learner-progress changes.

## 1. Executive decision

The Crosswalk is structurally complete and can serve as the basis for a controlled migration. It is **not yet safe to apply**.

- All 167 current lesson records are represented exactly once in the Crosswalk.
- All 167 target lessons have a unique target code within their target track.
- The 30 already published lessons retain their existing UIDs and remain in Track A.
- The 127 planned exact-title matches are strong UID-reuse candidates.
- Ten planned title variants need content-identity review.
- Prerequisite references are structurally intact, but ten relationships need pedagogical review.
- The current staging catalog, frontend consumers, Supabase alias migration, and learner-state contracts are not yet aligned with the approved four-track target.

**Recommendation:** retain existing UIDs wherever lesson identity is unchanged; do not mint replacement UIDs merely because a lesson moves to another track or receives a new code. Do not execute the catalog cutover until the blockers in section 9 are resolved.

## 2. Sources inspected

- `data/catalog/curriculum-canonical-v1.json`
- `data/catalog/catalog-v3.json`
- `docs/management/CANONICAL_LESSON_MIGRATION_CROSSWALK_2026-11-17.csv`
- `docs/management/CANONICAL_LESSON_MIGRATION_CROSSWALK_AUDIT_2026-11-17.md`
- `data/catalog/schema-v3.json`
- `data/catalog/migration-manifest-v3.json`
- `scripts/catalog-compat.js`
- `scripts/lesson-catalog.js`
- `scripts/lesson-reader.js`
- `scripts/admin-management.js`
- Supabase migrations 001–008 and `supabase/ops/inspect_live_catalog_v3.sql`
- `docs/architecture/CATALOG_V3_CONSUMER_INVENTORY.md`
- `docs/architecture/SUPABASE_CATALOG_V3_CUTOVER_2026-11-08.md`

The Supabase consumer inventory and cutover notes are dated 8 November 2026; their claims were checked against the current source files where possible. The live Supabase database was not inspected.

## 3. Crosswalk integrity

| Check | Result |
|---|---:|
| Target lessons | 167 |
| Crosswalk rows | 167 |
| Current catalog lesson records | 167 |
| Current UIDs represented in Crosswalk | 167 / 167 |
| Duplicate current UIDs | 0 |
| Missing current records in Crosswalk | 0 |
| Duplicate target track + lesson codes | 0 |
| Target lessons with missing track/code/title | 0 |
| Target track distribution | A: 60; B: 49; C: 33; D: 25 |

The set of source UIDs in the Crosswalk exactly matches the set of lesson UIDs in `catalog-v3.json`. All source records currently have `track_uid = trk-a`; this is a current-state property, not the approved target ownership.

The canonical specification contains four tracks, 31 themes, 57 modules, and 167 lessons. The Crosswalk target distribution matches it exactly.

## 4. UID decisions

### 4.1 Published lessons — preserve 30 of 30

All 30 published records:
- have an exact Russian title match;
- have a known UID mapping in the canonical specification;
- remain in Track A;
- have RU, EN, and ZH URL values in the current catalog and Crosswalk.

**Decision:** preserve every published UID. Do not regenerate, rename, or transfer these lessons to another track. This includes the previously published Track A lessons from the old 1.1.1–1.5.8 sequence and the published XAI lesson whose old code is 4.2.1 and target code is 7.1.1.

### 4.2 Planned exact-title matches — preserve 127 candidate UIDs

The 157 exact-title matches consist of 30 published records and 127 planned records.

| Target track | Planned exact-title UID candidates |
|---|---:|
| A | 25 |
| B | 47 |
| C | 30 |
| D | 25 |
| **Total** | **127** |

**Decision:** retain the existing UID as the migration candidate for each of these 127 one-to-one exact-title matches. A change of track, theme, module, or display code is not by itself a reason to create a new UID. Before cutover, confirm that no lesson content has been split, merged, or substantively replaced since the source catalog was prepared.

The 127 values remain candidates until explicitly accepted into the target catalog; the canonical JSON currently records only the 30 known published UIDs.

### 4.3 Ten title variants — manual identity review

All ten variants are planned and currently `outline_only`. Nine have no learning outcomes recorded in the source catalog; the Rule-based lesson has two outcomes. Titles suggest mostly abbreviations or shorter labels, but titles alone do not prove content identity.

| Current title | Target title | Existing UID | Target |
|---|---|---|---|
| GAM и EBM: интерпретируемые модели с нелинейными зависимостями | GAM и EBM | les-a-0114 | A 6.2.3 |
| Partial Dependence Plot | PDP — Partial Dependence Plot | les-a-0024 | A 8.1.1 |
| Individual Conditional Expectation | ICE — Individual Conditional Expectation | les-a-0025 | A 8.1.2 |
| Accumulated Local Effects | ALE — Accumulated Local Effects | les-a-0026 | A 8.1.3 |
| Правила принятия решений и rule-based explanations | Rule-based explanations | les-a-0150 | A 11.1.1 |
| ATE и CATE: средний и условный причинный эффект | ATE и CATE | les-a-0121 | B 5.2.2 |
| Meta-learners и методы оценки гетерогенных эффектов | Meta-learners | les-a-0123 | B 5.2.4 |
| Классы и объектно-ориентированное программирование | Классы и ООП | les-a-0067 | C 2.2.2 |
| Исследовательский анализ данных (EDA) | EDA — Exploratory Data Analysis | les-a-0074 | C 3.2.3 |
| Метод ближайших соседей и метод опорных векторов | Метод ближайших соседей и SVM | les-a-0103 | C 4.2.1 |

**Provisional decision:** do not create new UIDs for these ten now. Keep the existing UID as a candidate and approve reuse only after checking lesson outline/content, learning outcomes, exercises, and assessment. If a comparison establishes a split, merge, or replacement rather than a rename, record that as a separate identity decision and mint a new UID only for the genuinely new lesson.

### 4.4 Overall UID recommendation

No target lesson currently lacks a one-to-one source row, and no current UID is duplicated. The evidence does not justify creating new UIDs at this stage.

- Preserve: 30 published UIDs.
- Recommend preservation after identity confirmation: 127 exact-title planned UIDs.
- Hold for manual identity review: 10 title-variant UIDs.
- New UIDs required now: **0 established**.

## 5. Publication, access, localization, and routes

Current source state:
- 30 `published` / `published`;
- 137 `planned` / `outline_only`;
- all 167 records currently have `access = open`.

The target Crosswalk maps all 30 published lessons to Track A. No planned lesson should become published merely because it is included in the canonical curriculum. No access level should be inferred or broadened.

All 30 published records have RU/EN/ZH URL values (90 URL values total). The old published routes must remain valid and unchanged during the migration. The new lesson code is a curriculum display identifier, not a replacement URL.

- 28 of 30 published lessons receive a different target lesson code.
- 2 of 30 retain the same code.
- Existing localized URLs must be preserved independently of target track/theme/module/code.
- Blank URLs for planned lessons do not prove that a page does not exist.
- HTTP reachability was not tested; this was deliberately deferred and is not treated as a blocker for this read-only design stage.

Do not create redirects, rename files, or remove legacy routes as part of the catalog migration.

## 6. Prerequisite integrity

The current catalog contains 145 prerequisite edges.

Structural checks:
- missing prerequisite UIDs: 0;
- self-dependencies: 0;
- dependency cycles detected: 0.

However, the target ownership/numbering exposes relationships requiring review:

### 6.1 Seven cross-track dependencies

1. A 8.1.1 PDP — Partial Dependence Plot → prerequisite B 5.2.5 Проверка устойчивости, переобучения и ложных подгрупп.
2. B 5.1.1 Корреляция и причинность → prerequisite A 6.2.3 GAM и EBM.
3. B 8.1.1 Fidelity и Faithfulness → prerequisite C 6.1.2 Анализ вызовов инструментов, состояния и ошибок агента.
4. C 1.1.1 Инструменты исследователя AI → prerequisite A 5.2.4 Калибровка вероятностей и качество вероятностных прогнозов.
5. C 4.1.1 Линейная регрессия → prerequisite D 5.2.2 Интерпретация и представление результатов.
6. C 6.1.1 Анализ траекторий действий AI-агента → prerequisite B 3.1.3 Сравнение ответов и диагностические эксперименты.
7. D 1.1.1 Переменные, выражения и функции → prerequisite C 3.2.3 EDA — Exploratory Data Analysis.

These links are technically resolvable but several look pedagogically counterintuitive. Review each as a deliberate cross-track prerequisite, optional recommendation, or obsolete dependency. Do not silently drop them.

### 6.2 Three same-track prerequisites that point to a later target code

1. B 1.1.1 CNN как объект исследования: слои, feature maps и receptive fields → prerequisite B 6.1.1 Взаимодействия признаков.
2. B 4.1.1 Модель угроз для систем объяснения → prerequisite B 6.2.5 Протокол проверки объяснения через вмешательство.
3. B 6.2.1 От объяснения к экспериментальной проверке → prerequisite B 9.1.3 Экспериментальный дизайн и научная отчётность.

The dependency graph is acyclic, but these three links conflict with the apparent teaching order. Confirm whether the prerequisite is correct, whether the target lesson placement is wrong, or whether the dependency should be a non-blocking recommendation.

## 7. Frontend and catalog compatibility

The checked-in `catalog-v3.json` is marked `migration_staging`, version `3.2.0-draft`. It currently declares only three tracks (A/B/C); all 167 lessons are assigned to `trk-a`. Track A is titled “Understanding AI”, not the approved “XAI Practitioner”, and Track D is absent.

The current `scripts/lesson-catalog.js` reads `catalog-v3.json` directly. Its track-ID fallback map contains A/B/C only and defaults unknown track IDs to Track A. This must be corrected before introducing Track D; otherwise a Track D page without an explicit UID can display Track A content.

`scripts/catalog-compat.js` validates v3 UID relationships and provides a legacy-preserving projection. Keep compatibility for existing v1/v2 identifiers and routes while consumers are migrated. Do not assume every consumer has already switched to the same contract: inspect and test each page/script independently.

Required frontend work in a later implementation stage:
- add Track D and the approved Track A title;
- update track/theme/module ownership and target codes;
- explicitly map Track D page identifiers;
- retain legacy IDs, published-only filtering, localized links, and existing reader behavior;
- run catalog schema validation and browser regression tests for all track pages and all three locales.

## 8. Supabase and learner-state compatibility

### 8.1 Supabase identifiers

The checked-in migrations 001–007 define:
- `lesson_catalog.id` as a text primary key;
- `lesson_content.lesson_id` as a text primary/foreign key;
- `lesson_entitlements.lesson_id` as a text foreign key.

The admin code continues to read/write these legacy slug IDs. Do not replace these keys with curriculum UIDs in place. Preserve payloads, entitlement rows, audit history, and access semantics. An alias must resolve identity only; it must not grant access or copy entitlements to every child of a split lesson.

No dedicated progress, bookmark, or quiz-attempt tables were found in the checked-in migrations. This does **not** prove that no such data exists in the live project. The live Supabase schema and external persistence integrations remain unverified.

### 8.2 Migration 008 is not a ready-to-apply migration

The checked-in `008_catalog_v3_alias_registry.sql` seeds 50 lesson UIDs from an earlier v3 staging model. The approved canonical target now contains 167 lessons across four tracks. The old migration and its manifest therefore do not represent the current approved target and must not be applied unchanged.

Before any Supabase cutover:
1. inspect the live migration history and schema using the read-only inspection script;
2. reconcile the current canonical UID list and all legacy namespaces;
3. regenerate/review the registry and alias data for the 167-lesson target;
4. preserve existing slug primary/foreign keys and entitlements;
5. validate RLS, resolver permissions, and access behavior.

The live Supabase database was not inspected in this audit. Migration 008 deployment status is not asserted as verified.

### 8.3 Browser-local reader progress

`scripts/lesson-reader.js` stores reader state under `dch-reader:` + `lesson.id`. The stored object includes read-page IDs, scroll positions, and quiz answers. The generic reader route loads a lesson data object with its own legacy lesson ID.

This is a separate identity namespace from catalog UID and display code. Preserve the original key and lesson ID. Any future migration must be versioned and idempotent:
- one-to-one identity: copy state only after explicit mapping and retain the old key;
- one-to-many mapping: do not mark every child lesson complete automatically;
- ambiguous mapping: leave the old state intact and accessible;
- never equate a changed display code with a changed lesson identity.

Do not assume this reader state is the progress store for every published static lesson page; inspect each actual reader consumer before migration.

## 9. Go / No-Go gates

| Gate | Status | Required before catalog cutover |
|---|---|---|
| 167-row Crosswalk integrity | PASS | No further structural repair identified |
| 30 published UID mappings | PASS | Preserve all 30 |
| 127 planned exact-title UID candidates | CONDITIONAL | Confirm identity/content continuity |
| 10 title variants | REVIEW REQUIRED | Approve each rename/identity mapping |
| Publication/access/localized URL preservation | PASS AT REPOSITORY LEVEL | Preserve old values and routes; HTTP test deferred |
| Prerequisite graph | REVIEW REQUIRED | Resolve 7 cross-track and 3 backward-code relationships |
| Four-track catalog hierarchy | NOT READY | Add Track D and correct target ownership |
| Frontend Track D support | NOT READY | Update fallback mapping and consumers |
| Supabase live schema | NOT VERIFIED | Run read-only live inspection |
| Supabase migration 008 | NOT READY | Rebuild against current 167-lesson target |
| Browser-local progress | POLICY REQUIRED | Approve identity and one-to-many behavior |
| Rollback/acceptance tests | NOT READY | Prepare and run before production cutover |

**Decision: NO-GO for applying a catalog migration now. GO for the next preparation step: resolve the ten title variants and ten prerequisite exceptions, then produce a versioned migration manifest and test plan.**

## 10. Safe implementation sequence

1. **Freeze and snapshot.** Record the exact source catalog, canonical JSON, Crosswalk, current routes, and current Supabase migration history. No production mutation.
2. **Approve lesson identity.** Confirm the 127 exact-title candidates and adjudicate all ten title variants. Keep all existing UIDs unless content identity has genuinely changed.
3. **Approve prerequisites.** Review the seven cross-track and three backward-code edges. Re-run graph validation after decisions; require zero missing references and zero cycles.
4. **Build the target staging catalog.** Add four tracks, 31 themes, 57 modules, and 167 lessons. Populate the approved UIDs and target hierarchy. Preserve current status, content state, access, and prerequisites exactly where approved.
5. **Build the legacy identity manifest.** Map old catalog UIDs, legacy lesson codes, static localized URLs, reader lesson IDs, and Supabase slug IDs to canonical UIDs. Keep URL identity separate from display numbering. Represent one-to-many mappings explicitly.
6. **Define learner-state policy.** Inspect actual reader consumers and the live Supabase schema. Design idempotent migration rules, preserving original localStorage keys and never auto-completing all children of a split lesson.
7. **Rebuild the Supabase registry additively.** Generate the registry and aliases from the approved 167-lesson manifest. Keep existing slug PK/FK values and entitlement semantics. Validate the resolver and RLS before any use.
8. **Migrate frontend consumers individually.** Add Track D support and a compatibility layer. Preserve published links, localized routes, legacy identifiers, and published-only behavior.
9. **Run acceptance tests.** Validate schema, UID uniqueness, hierarchy, prerequisites, all 90 existing localized URL mappings, page routing, all locales, progress preservation, entitlements, and admin/editor workflows. HTTP reachability may be tested separately; no route is retired on the strength of an unverified URL.
10. **Cut over only after explicit approval.** Deploy the catalog and consumer changes as a controlled release. Keep the prior catalog and legacy aliases available for rollback. Do not delete old routes, keys, or identifiers during the initial cutover.

## 11. Non-actions in this audit

- `catalog-v3.json` was not modified.
- Canonical curriculum JSON was not modified.
- Crosswalk CSV was not modified.
- Published lesson HTML, localized URLs, and redirects were not modified.
- No UID, publication status, access rule, prerequisite, or learner-progress value was changed.
- No Supabase migration was applied and no live learner data was read.
- No HTTP smoke test was run.

**Audit outcome:** `read_only_audit_complete_migration_no_go`.
