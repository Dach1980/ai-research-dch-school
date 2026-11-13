# Foundation implementation status — 2026-11-08

## Completed

### Stage 1 — repository and curriculum audit
- Inspected the active hierarchical catalog, JSON Schema v2, legacy v1 catalog, Python/JavaScript compatibility adapter, Track A page, XAI reader page, shared CSS and catalog validation workflow.
- Confirmed the current v2 display model is not the approved model: lessons use four-part codes (A.1.1.1 / A.1.2.1), modules use three-part codes, and the schema enforces those patterns.
- Confirmed that the first six AI foundation lessons currently sit in module A.1.1 and the XAI introduction sits in module A.1.2.
- Confirmed the Track A page still displays old four-part lesson ranges.
- Recorded the required migration and safety conditions in COURSE_HIERARCHY.md.

### Stage 2 — migration analysis
- Defined the target mapping: first module title becomes «Что такое AI»; its six lessons become A.1.1–A.1.6. The next module within Theme A.1 continues at A.1.7. Theme A.2 starts again at A.2.1.
- Defined the need for immutable technical UIDs separate from display codes.
- **Production catalog switch is intentionally not performed in this change set.** Current schema v2 and compatibility adapter use display-like codes as IDs, while v1, prerequisites, planet references, progress and other consumers still depend on historical identifiers. A direct mutation would risk breaking published routes and learning records. The safe next implementation is a parallel schema/catalog v3 with explicit uid/code fields, a complete crosswalk and compatibility tests; switch only after all consumers are migrated.

### Stage 3 — design-system foundation
- Added shared theme tokens and light-theme overrides in styles/theme-system.css.
- Added persistent Light / Dark / System preference handling in scripts/theme-system.js.
- The script adds a theme control to site headers and binds the existing lesson-reader theme button.
- Added the theme system to the homepage, Track pages, lesson catalogue, learning map, news index and all lesson pages currently listed in catalog-v2.
- Added theme-aware overrides for common cards, figures, diagrams, captions and tables.
- Manual browser review is still required; CSS cannot guarantee every inline SVG and page-specific style has been corrected.

### Stage 4 — code presentation foundation
- Added styles/code-blocks.css with semantic token colors, line-number gutter, copy control and responsive overflow.
- Added scripts/code-blocks.js with a dependency-free Python syntax highlighter for explicitly labelled Python blocks.
- Added localized copy-button labels for RU / EN / 中文.
- The highlighter only processes code explicitly marked as Python (language-python / data-language="python"). Formula blocks and unlabelled snippets are not guessed or rewritten.
- Added the requirement that long programs be divided into explanatory teaching blocks in CODE_TEACHING_STANDARD.md.

## Files created

- docs/roadmap/DCH_SCHOOL_FOUNDATION_ROADMAP.md
- docs/architecture/COURSE_HIERARCHY.md
- docs/design/DESIGN_SYSTEM.md
- docs/standards/CODE_PRESENTATION_STANDARD.md
- docs/standards/CODE_TEACHING_STANDARD.md
- docs/standards/ILLUSTRATION_STANDARD.md
- docs/standards/LESSON_QUALITY_GATE.md
- styles/theme-system.css
- scripts/theme-system.js
- styles/code-blocks.css
- scripts/code-blocks.js
- tests/test_dch_presentation_standards.py

## Validation

The catalog workflow now includes the new presentation-standard test and Node syntax checks for the theme and code scripts. CI result must be checked after the latest main commit. Manual desktop/mobile, contrast and screen-reader acceptance has not been performed and must not be inferred from CI.

## Remaining work before claiming stages 1–4 fully closed

1. Implement schema/catalog v3 with immutable UIDs and display codes; migrate every consumer and add compatibility tests.
2. Run the full GitHub Actions workflow and resolve any failures.
3. Perform manual visual QA for home, Track A, lesson reader and representative RU/EN/ZH lesson pages in Light / Dark / System.
4. Audit inline SVG and page-specific fixed colors, especially diagrams and captions.
5. Add labelled Python code blocks to lesson content and verify copy fidelity and syntax rendering in a browser.
