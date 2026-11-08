# Course hierarchy and identifiers

## Approved hierarchy

Track → Theme → Module → Lesson

| Entity | User-facing representation | Example |
|---|---|---|
| Track | Stable letter + title | Track A — Understanding AI |
| Theme | Track letter + theme number + shared title | Theme A.1 — Основы AI и машинного обучения |
| Module | Descriptive title; no extra numeric level | Что такое AI |
| Lesson | Theme code + sequential lesson number | A.1.1 … A.1.6 |

## Numbering rules

1. Track code is a stable letter (A, B, C).
2. Theme code is <Track>.<theme-number>, e.g. A.1.
3. Modules have names, not user-facing numeric codes.
4. Lesson display code is <Theme>.<lesson-number>, e.g. A.1.1.
5. Lesson numbering continues across modules inside the same theme.
6. A new theme resets its lesson sequence: the first lesson of Theme A.2 is A.2.1.
7. The module boundary does not reset lesson numbering.

## Stable technical identity

Display codes are labels, not database primary keys. Each entity must have a stable immutable technical identifier (opaque UUID or stable slug). Prerequisites, translations, progress, planets, bookmarks, admin records and API payloads must resolve through technical identifiers. Display codes may change without changing technical identity.

Recommended lesson record shape:
- uid: immutable technical identifier;
- code: display code such as A.1.7;
- theme_uid and module_uid: technical relationships;
- url_i18n: locale-specific paths;
- legacy_codes: historical display-code aliases;
- status: draft / review / published / unpublished.

Do not treat the current schema-v2 lesson id as a stable opaque ID: it currently contains a display-like code. Introduce a new schema version and compatibility layer before changing production identifiers.

## Current repository audit (2026-11-08)

- data/catalog/catalog-v2.json currently stores Theme A.1, modules A.1.1 and A.1.2, and lesson codes A.1.1.1–A.1.1.6 plus A.1.2.1.
- The approved hierarchy removes the module numeric code from user-facing navigation and shortens lesson display codes.
- Current schema-v2 JSON Schema requires a four-component lesson code and three-component module ID. It does not yet implement the approved model.
- The compatibility adapter maps legacy schema-v1 module identifiers into display-like module IDs. This is not a suitable permanent technical identity model.
- Legacy catalog and other consumers may still use historical lesson IDs. A direct find-and-replace risks prerequisites, progress, map cards, localized routes and external links.
- The current XAI lesson URL is lessons/xai/01-what-and-why.html; preserve it unless a redirect/alias is implemented and tested.

## Migration mapping to prepare

Theme A.1 title is approved as «Основы AI и машинного обучения». The first module title is «Что такое AI» (without a numeric module code); its six lessons become A.1.1–A.1.6. The next module is «Введение в Explainable AI (XAI)»; its first lesson becomes A.1.7 (not A.1.2.1). The first lesson of the next theme, A.2, will be A.2.1. This is a display-code mapping only; stable UIDs and all references must remain intact.

## Migration acceptance criteria

- Unique display codes within each track/theme.
- Lesson sequence continuous across modules in a theme.
- New theme starts at lesson number 1.
- No dangling module/theme/prerequisite/planet/translation references.
- Existing user progress and bookmarks still resolve.
- Old codes resolve as aliases during a compatibility period.
- Existing URLs remain live or have tested redirects.
- RU/EN/ZH labels and breadcrumbs show the same code.
- All catalog validators and consumers pass before production switch.
