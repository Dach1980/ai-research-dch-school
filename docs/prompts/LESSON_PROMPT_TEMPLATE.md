# Canonical Lesson Creation Prompt Template

Version: 1.1  
Status: active  
Applies to: all tracks and all lesson localizations

Use this template as the shared baseline when creating or substantially revising a lesson. A lesson-specific prompt must supply the lesson's subject matter, learning objectives, mathematical or technical details, practice requirements, and any special visual requirements.

## 1. Authority and repository workflow

Before making changes:

1. Inspect the current `main` branch and its latest commit. Work directly on `main`; do not create a branch unless explicitly requested.
2. Read the current curriculum source, lesson catalog, knowledge-map implementation, and all applicable standards under `docs/standards/`.
3. Read the current canonical lesson UI contract: `docs/standards/CANONICAL_LESSON_UI_CONTRACT.md`. Treat the repository version as authoritative if it is newer than this prompt.
4. Inspect at least two recent accepted lessons from the same track and reuse established project conventions without copying their content.
5. Check the target lesson's canonical position, identifier/UID rules, neighboring lessons, existing files, and whether any localized page already exists.
6. Check current tests and CI workflows before changing code.

Do not guess identifiers, paths, catalog schema, or publication rules. If a required decision cannot be grounded in repository evidence, stop and report the precise blocker rather than inventing a value.

## 2. Curriculum integrity

- Preserve the approved curriculum hierarchy: **Track → Topic → Module → Lesson**.
- Preserve the canonical lesson numbering format `Topic.Module.Lesson`, scoped to its track (for example, `8.1.1`).
- Use the canonical curriculum file as the source of truth for titles, ordering, track membership, and lesson identity.
- Assign a UID only according to the repository's existing UID convention and after verifying uniqueness across the catalog and source files.
- Do not renumber, reorder, rename, or otherwise alter unrelated curriculum items.
- Do not change previously accepted or published lesson content unless the user explicitly authorizes that change.

## 3. Language parity

Create all required localizations: Russian (RU), English (EN), and Simplified Chinese (ZH), unless the repository's current curriculum explicitly specifies otherwise.

All localizations must be equivalent in:
- conceptual coverage and technical depth;
- section order and learning outcomes;
- equations, notation, assumptions, and caveats;
- examples and practical exercises;
- figures, captions, alt text, and explanatory callouts;
- sources and further reading;
- glossary coverage;
- quiz learning objectives and difficulty.

Translate naturally for the target language. Do not mechanically translate terminology when an established technical term is more accurate. Keep symbols, variable names, code, and mathematical meaning consistent across languages.

## 4. Instructional quality

The lesson must:
- explain the motivation and problem before introducing a method;
- define all important terms and notation before relying on them;
- build concepts step by step, from intuition to formal description and interpretation;
- distinguish assumptions, guarantees, limitations, and common misinterpretations;
- include worked examples with enough intermediate reasoning to be independently understandable;
- connect the method to related methods and explain when to choose each;
- end with a useful synthesis and a clear transition to the next lesson where applicable.

Avoid filler, repeated explanations, unsupported claims, unexplained jargon, and claims that a method proves more than it actually does.

## 5. Canonical page structure

Follow the exact current DOM/component order required by `CANONICAL_LESSON_UI_CONTRACT.md`. The current contract specifies:

1. `lesson-intro`
2. `lesson-outcomes`
3. `lesson-sections`
4. `lesson-practice`
5. `lesson-sources`
6. `lesson-navigation`
7. `lesson-glossary`
8. `lesson-quiz`
9. footer

Do not omit, reorder, or rename required structural regions. Match the contract's required internal markup, semantics, accessibility, and metadata. If the contract has been revised, follow the newer contract and report the change.

## 6. Practice and code

Every lesson-specific prompt must state the appropriate practice scope. Unless the subject makes executable practice genuinely inapplicable, provide a reproducible, end-to-end exercise that:

- states prerequisites and expected result;
- uses suitable, maintained libraries and explains their roles;
- supplies complete code rather than disconnected fragments;
- fixes random seeds where randomness is involved;
- explains data generation/loading, preprocessing, model or method execution, and interpretation;
- includes expected outputs or validation checks;
- discusses relevant failure modes and limitations;
- can be run by a learner following the instructions.

Do not fabricate execution results. If code is not executed in the available environment, state that it was reviewed but not run.

## 7. Figures and SVG quality

The lesson-specific prompt must define the number, purpose, and content of figures. Figures must teach distinct concepts rather than decorate the page.

For SVG figures:
- produce complete, self-contained SVG documents with a valid `viewBox`;
- keep every label, shape, arrow, and annotation inside the viewBox;
- use readable typography and sufficient contrast;
- avoid overlaps, clipping, cut-off labels, malformed paths, missing elements, and excessive detail;
- use responsive dimensions and preserve legibility at mobile widths;
- support both light and dark themes using the project's established design tokens or theme mechanism;
- provide meaningful localized captions and alt text;
- keep RU/EN/ZH figures conceptually and structurally equivalent.

Do not treat the mere existence of an SVG file as proof of visual completeness. Validate SVG structure and inspect rendered output at the required viewport sizes.



### Illustration-first quality gate — mandatory, high priority

Illustrations are a core teaching component, not decoration or a final formatting task. Give them the same level of methodological review as the lesson text and practical exercise. Do not postpone visual design until after the lesson has been written.

Before implementing a figure:
- Write its single teaching purpose and the exact learner question it should answer.
- Identify the concept, process, comparison, data, or decision the learner must understand after viewing it.
- Choose the representation that explains that idea most directly: a properly labelled plot, comparison matrix, data table, annotated model, causal/process flow, timeline, or other domain-appropriate form.
- Define the reading order and the relationship between every visual element. Use cards only when the content is genuinely a set of independent items; do not turn every diagram into a generic grid of boxes.
- Specify the input, transformation/relationship, output and conclusion. Label axes, units, categories, symbols, examples and hypothetical values.
- Map each visible claim and value to the adjacent lesson text, a shown calculation, an explicitly stated assumption, or a real practice output.

During implementation and review:
- Review every figure individually against the section immediately preceding it. The figure must clarify that section, not merely repeat its heading or decorate it.
- Check whether a learner unfamiliar with the topic can correctly explain what each shape, arrow, colour, value, axis and connection means. If not, redesign or add explicit explanation.
- Prefer concrete data and meaningful relationships over abstract boxes. Avoid ambiguous arrows, unexplained coordinates, ornamental connectors, arbitrary coefficients, unexplained parentheses, dense labels and pseudo-technical decoration.
- Make the visual hierarchy and reading direction unmistakable. Keep independent comparisons visually separate; show sequence or causality only with explicit, unambiguous relationships.
- Verify contrast for every text/background pair in both themes using computed styles, including accent and secondary surfaces. Never rely on an undefined CSS variable or an assumed browser fallback.
- Inspect the actual rendered SVGs in RU, EN and ZH at 375, 768 and 1440 px in light and dark themes. Check text fit, clipping, overlaps, arrows, viewBox bounds, readability and page overflow.
- Compare all locales side by side: same conceptual structure, examples, values, relationships and emphasis, not merely the same number of SVGs.
- If a figure fails any of these checks, revise its instructional design; do not accept a technically valid SVG as a successful illustration.

For each figure, record in the lesson-specific prompt or audit: **teaching purpose → visual form → text/data dependencies → expected learner interpretation → validation evidence**. A count of figures or a passing SVG syntax test is not evidence of pedagogical quality.

## 8. Responsive and visual validation

Validate all three localizations in both light and dark themes at:
- 375 px (mobile);
- 768 px (tablet);
- 1440 px (desktop).

At minimum, check:
- horizontal overflow and content clipping;
- formulas and long code lines;
- tables, callouts, navigation, and glossary;
- SVG/figure completeness, label wrapping, and overlap;
- contrast, typography, spacing, and computed styles;
- keyboard navigation, focus visibility, semantic structure, and accessible names.

Use the project's existing browser-test stack. Add or update automated tests so regressions are caught in CI. Do not claim a visual check passed unless the relevant browser/rendered-page check actually ran and passed.

## 9. Sources and terminology

- Use authoritative primary sources where possible: original papers, official documentation, standards, and foundational publications.
- Verify titles, authors, dates, URLs, and the relevance of each source.
- Cite claims close to where they are discussed, following project conventions.
- Do not invent references or use a citation as support for a claim it does not establish.
- Include a localized glossary with accurate definitions and consistent terminology.

## 10. Assessment

Create a meaningful self-check quiz aligned with the lesson outcomes. Questions should test understanding, interpretation, and application rather than only recall. Distractors must be plausible but unambiguously incorrect under the stated assumptions. Verify that answers and explanations are correct in all localizations.

The lesson-specific prompt must set concrete minimum counts for sections, glossary entries, quiz questions, and figures when appropriate.

## 11. Catalog, navigation, and tests

- Register the lesson in the correct canonical catalog structures without changing unrelated entries.
- Ensure localized URLs, track/topic/module references, UID, status, and content-state fields follow the existing schema.
- Update knowledge-map data only as required by the new lesson and preserve its canonical position.
- Add focused tests for content structure, localization parity, catalog registration, navigation, SVG completeness, and responsive behavior.
- Run relevant focused tests first, then the full applicable test suite and CI checks.
- Inspect the final diff for accidental edits, generated noise, broken links, and unrelated changes.

## 12. Status, acceptance, and reporting

- New or materially revised lessons must remain in `review` (and the corresponding non-published content state) until the user explicitly accepts them.
- Never set `published` based only on passing tests, a successful deployment, or an assistant's assessment.
- Do not change the status of unrelated lessons.
- Commit changes to `main` with a clear, scoped message.
- Report: commit SHA; files changed; lesson UID and localized URLs; tests executed and exact results; CI run links/status; known limitations; and the next required user decision.
- If deployment is asynchronous, distinguish a successful workflow start from a completed successful deployment.

## 13. Final acceptance checklist

- [ ] Canonical curriculum identity and UID verified.
- [ ] RU/EN/ZH content parity verified.
- [ ] Canonical page structure and DOM order verified.
- [ ] Technical correctness and sources reviewed.
- [ ] Practice is complete and reproducible.
- [ ] Every figure has a documented teaching purpose and appropriate visual form.
- [ ] Every figure has been individually checked against its preceding lesson text for semantic and numerical consistency.
- [ ] Every figure is pedagogically clear: reading order, axes, arrows, symbols, values and conclusions are unambiguous.
- [ ] Every figure has been visually inspected in all locales, both themes and all required viewport sizes; computed contrast and text fit are verified.
- [ ] 375/768/1440 px checks passed in light and dark themes.
- [ ] Accessibility and responsive overflow checks passed.
- [ ] Catalog, navigation, and knowledge map updated correctly.
- [ ] Focused tests and full relevant tests passed.
- [ ] CI completed successfully.
- [ ] Lesson remains in review pending explicit user acceptance.


## Professional pedagogy and source-audit workflow (2026-11-26)
Apply docs/standards/PROFESSIONAL_LESSON_PEDAGOGY_V1.md within the existing canonical regions. Before every new lesson, check docs/management/AIS_FIVE_MODULES_ACTION_PLAN_2026-11-26.md, exact relevant source pages (when available), and data/ais-reference-checklist.json. Preserve unresolved gaps; record what was inspected and what is unverified. Include method passport, original micro-check, three learning depths and measurable practical evaluation as appropriate. Existing pages migrate incrementally, not all at once. Keep parallel improvement changes isolated and tested; the owner authorized parallel improvements on 26.11.2026. Each working chat must conclude with a checklist, evidence, blockers and next action; update the admin data, not merely chat history. Do not use TinyFish.
