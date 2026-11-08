# Course hierarchy and identifiers

**Статус:** утверждённая модель Track A, 2026-11-08.

## 1. Иерархия

`Track → Theme → Module → Lesson`

| Entity | User-facing representation | Example |
|---|---|---|
| Track | Stable letter + title | Track A — Understanding AI |
| Theme | Number within Track + title | Theme 1 — Основы искусственного интеллекта и машинного обучения |
| Module | Number within Theme + descriptive title | Module 1 — Что такое AI |
| Lesson | Theme.Module.Lesson | 1.1.1 |

## 2. Правила нумерации

1. Track code is a stable letter (A, B, C).
2. Theme number is scoped to the Track.
3. Module number is scoped to its Theme.
4. Lesson code is `<theme>.<module>.<lesson>`, e.g. `1.2.1`.
5. Lesson numbering restarts at 1 inside each module.
6. Module numbering restarts at 1 inside each theme.
7. Display codes are labels, not technical primary keys.
8. Track A's approved curriculum is documented in [TRACK_A_CURRICULUM.md](../education/TRACK_A_CURRICULUM.md).

## 3. Stable technical identity

Each Track, Theme, Module and Lesson must have a stable immutable technical identifier (opaque UID or stable slug). Prerequisites, translations, progress, planets, bookmarks, admin records, API payloads and localized routes must resolve through technical identifiers rather than display codes.

Recommended lesson record:
- `uid`: immutable technical identifier;
- `code`: display code such as `1.2.1`;
- `track_uid`, `theme_uid`, `module_uid`: technical relationships;
- `url_i18n`: locale-specific paths;
- `legacy_codes`: historical display-code aliases;
- `status`: draft / review / published / unpublished.

Do not treat current schema-v2 IDs as stable opaque IDs where they contain display-like codes. Introduce schema v3 and a compatibility layer before changing production identifiers.

## 4. Legacy catalog audit and migration caution

The existing schema-v2 catalog stores display-like IDs and a four-component lesson code. It is a legacy implementation and does not yet match the approved Track → Theme → Module → Lesson model.

The former lesson code `A.1.2.1` is a **legacy identifier**, not an approved new code. Its new location must be determined by content crosswalk against the approved Track A curriculum. Do not assume it becomes `1.1.7` or any other code without curriculum review.

A direct find-and-replace risks prerequisites, translations, progress, planet cards, localized routes, bookmarks, administrative records and external links. Preserve existing URLs unless redirects/aliases are implemented and tested.

## 5. Migration acceptance criteria

- Unique display codes within their intended Track.
- Module and lesson numbering follows the approved scope.
- No dangling Track / Theme / Module / Lesson / prerequisite / planet / translation references.
- Existing user progress and bookmarks still resolve.
- Legacy codes resolve through aliases during a compatibility period.
- Existing URLs remain live or have tested redirects.
- RU / EN / ZH labels and breadcrumbs show consistent hierarchy and codes.
- All catalog validators, consumer tests and CI pass before production switch.
