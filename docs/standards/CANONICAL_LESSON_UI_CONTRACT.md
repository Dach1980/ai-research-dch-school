# DCH School — Canonical Lesson Template & UI Contract

**Status:** mandatory engineering standard  
**Version:** 1.2  
**Adopted:** 2026-11-18  
**Scope:** all newly authored lesson pages in Tracks A–D, all locales (RU / EN / 中文). The current v3 lesson catalogue and automatic browser gate cover Track A; Tracks B–D must be registered in the v3 catalogue with localized routes before their pages can pass the same navigation acceptance.

## 1. Purpose and non-negotiable rule

A lesson is a content unit inside the existing DCH School product. It is not a separate website and must not implement its own site chrome, language selector, theme control, lesson navigation, footer, or page-level design system.

**New lessons reuse the canonical shell and shared UI scripts.** Lesson-specific code may render educational content only. Any proposed deviation to the shell, global navigation, locale behavior, theme behavior, typography, colors, or shared components requires explicit approval before implementation.

Do not copy and independently modify a previous lesson's UI. Start from `templates/lessons/canonical-lesson-shell.html.tmpl` and keep shared components delegated to their owners below.

## 2. Canonical references

- **Shared visual shell and global component styles:** `styles/main.css`, `styles/lesson-design-system.css`, `styles/lesson-standard.css`, `styles/lesson-reference-111.css`.
- **XAI lesson content pattern:** the corrected lesson 7.1.1 and 7.1.2 multilingual data, using the canonical terminology-card component below.
- **Shared locale control:** `scripts/language-switcher.js`.
- **Shared theme control:** `scripts/theme-system.js`.
- **Shared previous/next lesson navigation:** `scripts/lesson-layout.js`.
- **Lesson-specific 7.1.2 regression target:** RU / EN / 中文 pages registered under UID `les-a-0169`.

These references define existing behavior; this standard does not authorize a redesign of the school.

## 3. Component ownership

| UI element | Sole owner | Lesson page responsibility |
|---|---|---|
| Site header and primary menu | Shared canonical HTML shell | Keep the canonical header unchanged |
| RU / EN / 中文 selector | `language-switcher.js` | Load the script once; never render a local selector |
| Theme control | `theme-system.js` | Load the script once; never render a local theme toggle |
| Previous / next / map / track links | `lesson-layout.js` | Provide exactly one empty `nav.lesson-nav` placeholder |
| Footer | Shared canonical HTML shell | Keep canonical footer unchanged |
| Lesson title, outcomes, sections, quiz | Lesson content renderer | Render only inside the designated lesson content roots |
| Lesson-specific diagrams and interactions | Lesson renderer and scoped component CSS | Must not alter global shell or shared navigation |

A lesson renderer must never write into `nav.lesson-nav`. It must not create `.language-switcher`, `.locale-links`, or `.lesson-language-links` elements. It must not add a second header, footer, menu, or theme switcher.

## 4. Canonical page structure

Every locale page must contain the following page-level structure:

1. One `header.site-header` with brand, menu button and primary `nav.nav`.
2. No hard-coded locale selector in the page source; the shared locale script inserts one after the primary navigation.
3. One `main.container.lesson` (or another explicitly approved canonical main variant).
4. The nine lesson-content blocks in the exact order defined in §4.3.
5. One canonical `footer.footer` after the complete lesson content.
6. Shared scripts loaded once, in the order shown in the template.

The footer must not contain language links. The lesson body must not contain a second language selector.

## 4.3 Mandatory order of lesson-content blocks

**The following sequence is mandatory for every lesson in every track and every locale (RU / EN / 中文). It preserves the original DCH School lesson structure and is not a per-lesson preference. No block may be moved before or after another block, omitted, or merged into a neighboring block to work around the order.**

1. **Lesson title and description** — the lesson heading and introductory lead.
2. **Learning outcomes** — the outcomes section.
3. **Main educational sections** — the complete lesson explanation, concepts, diagrams and examples.
4. **Practical assignments** — all practical tasks, labs and applied exercises.
5. **Sources and literature** — references and further reading.
6. **Lesson navigation panel** — the single empty `nav.lesson-nav` placeholder, populated only by `scripts/lesson-layout.js`.
7. **Terminology dictionary** — the canonical `.lesson-glossary` card component defined in §4.1.
8. **Self-check** — the lesson quiz / knowledge-check component.
9. **Site footer** — the single canonical `footer.footer`, after the entire lesson content.

The order is a DOM-order requirement, not merely a visual/CSS order. CSS positioning, grid/flex `order`, absolute positioning, or JavaScript relocation must not be used to disguise an incorrect source/DOM order. The navigation panel must be after sources and before the dictionary. The dictionary must be after navigation and before self-check. The footer must follow self-check.

Each block must have a distinct, identifiable semantic root so static and browser tests can verify its position. A renderer may populate a designated root, but it must not move roots across the sequence or write into `nav.lesson-nav`. If a lesson has no practical assignment or sources, the corresponding section must still be represented by an explicit empty/appropriate state only if the curriculum owner has approved that absence; otherwise the lesson is incomplete and cannot be published. The dictionary and self-check remain required for complete lessons.

Canonical main-content skeleton:

```html
<main class="container lesson">
  <section class="lesson-intro">
    <p class="eyebrow">...</p>
    <h1 id="lesson-title">...</h1>
    <p class="lead" id="lesson-lead">...</p>
  </section>
  <section class="outcomes" id="lesson-outcomes"></section>
  <div id="lesson-sections"></div>
  <section id="lesson-practice"></section>
  <section id="lesson-sources"></section>
  <nav class="lesson-nav" id="lesson-navigation" aria-label="..."></nav>
  <section class="lesson-glossary" id="lesson-glossary"></section>
  <section id="lesson-quiz"></section>
</main>
<footer class="footer">...</footer>
```

The skeleton defines structural positions and ownership boundaries. Existing lesson content may use different internal markup, but each block must map unambiguously to one of these ordered roots. This rule does not authorize changes to lesson wording, visual design, colors, navigation labels or curriculum content.

## 4.1 Required terminology dictionary component

Every complete lesson must use the same terminology dictionary component when lesson-specific terms are defined. The component is part of lesson content, not page chrome.

- The Russian heading is exactly **«Словарь терминов»**.
- The English heading is exactly **“Key terms”**.
- The Chinese heading is exactly **“术语词典”**.
- Do not use alternative headings such as «Глоссарий», “Glossary”, “Short glossary”, «Краткий словарь» or «术语表».
- The required structure is one `.lesson-glossary` section containing one `h2`, one `.glossary-grid`, and one or more `.glossary-entry` cards.
- Each card contains a numbered `.term-index`, a `.term` and a concise definition in a paragraph. An optional `.term-en` may show the canonical English term.
- Use the existing styles in `styles/lesson-design-system.css`; do not recreate the card appearance with raw `ul`, `dl`, tables, inline styles or lesson-specific alternatives.
- Keep the same term order and meaning in RU / EN / 中文. Translations may differ linguistically but may not add or remove concepts.
- The dictionary heading and cards must remain legible in both themes and collapse to one column on narrow screens.

Canonical markup:

```html
<section class="lesson-glossary" aria-labelledby="lesson-glossary-title">
  <h2 id="lesson-glossary-title">Словарь терминов</h2>
  <div class="glossary-grid">
    <article class="glossary-entry">
      <span class="term-index">01</span>
      <strong class="term">XAI</strong>
      <span class="term-en">Explainable Artificial Intelligence</span>
      <p>Краткое и точное определение термина.</p>
    </article>
  </div>
</section>
```


## 4.4 Canonical learning-outcomes cards

The learning-outcomes block uses the shared automatic card presentation from `styles/lesson-design-system.css`. Lesson authors and renderers must provide a semantic `ul` or `ol` inside the canonical `.outcomes` / `#lesson-outcomes` root; they must not hand-code individual cards, icons, numbering, or responsive layout.

- The shared stylesheet automatically converts each list item visually into a numbered card while preserving the semantic list in the DOM.
- Desktop and tablet layouts use two columns; an unpaired final card spans both columns. Narrow screens (650 CSS px and below) use one column.
- Card surfaces, borders, text and numbering use the shared `--lds-*` theme tokens and must remain legible in light and dark themes.
- The same structure and item order must be preserved across RU / EN / 中文.
- New lessons created from the canonical shell inherit the component automatically because the shell already loads `lesson-design-system.css`.
- Browser acceptance must verify computed styles, responsive columns, numbering, theme contrast tokens and absence of horizontal overflow in every locale.


## 4.2 Metadata policy — closed by default

Lesson pages must not invent or infer metadata.

- Estimated duration, reading time, difficulty level, audience, format, badges and similar metadata are **not displayed** unless the school owner explicitly approves the field and its value.
- Do not add a duration field to lesson data or render a duration label from optional data.
- Learning outcomes are educational content and remain in the designated outcomes component; they are not a place for informal level/format labels.
- The canonical shell does not contain a duration or level/format badge.
- If a metadata field is approved in the future, it must first be added to this contract, the shared template/data schema and static/browser acceptance tests. A lesson author cannot introduce it locally.

## 5. Locale contract

- Supported locale keys are exactly `ru`, `en`, `zh`; the Chinese document language tag may be `zh-CN`.
- All three pages share one UID and matching lesson identity.
- The locale selector is visible only in the site header.
- Switching locale must preserve the same lesson UID and canonical lesson route; only the locale suffix changes.
- Missing translation pages are a release blocker. Never silently redirect a lesson locale switch to the home page.
- The locale selector's active state must match `document.documentElement.lang` and the current URL.

## 6. Lesson navigation contract

- The lesson page contains one empty `nav.lesson-nav`.
- Only `scripts/lesson-layout.js` may populate it.
- Navigation order is based on canonical lesson codes and the v3 catalog.
- Only records with `status: published` and `content_state: published` are valid previous/next destinations.
- A review/draft lesson preview may show the nearest previous published lesson and a disabled “next lesson soon” state. It must not create its own links.
- A next lesson that is not published is never a clickable destination.
- The navigation must include the shared links to the knowledge map, Track A programme and all lessons.

## 7. Theme, typography and color contract

Use the existing design tokens from `styles/lesson-design-system.css`:

- Main text and headings: `--lds-ink`.
- Secondary text: `--lds-muted`.
- Surface: `--lds-surface`.
- Borders: `--lds-line`.
- Accent: `--lds-accent`.
- Positive / negative states: `--lds-good` / `--lds-bad`.

Do not hard-code text colors in lesson-specific CSS. In particular, never apply a fixed pale blue to all `h2` elements. Heading colors must respond to `data-theme="light"` and dark theme tokens.

Intentional colored components (e.g. a dark outcomes card, diagram palette, syntax highlighting) may use component-scoped colors only when contrast is maintained in both themes. SVG text should use theme-aware CSS variables or accessible fallback colors.

## 8. CSS and JavaScript boundaries

- Shared CSS is loaded in the canonical order from the template.
- A lesson may add one or more narrowly scoped content stylesheets only when the content requires them and they do not restyle global elements.
- No lesson-specific rule may target global `header`, `footer`, `.nav`, `.language-switcher`, `.theme-switcher`, `.lesson-nav`, `body`, or global heading selectors.
- Lesson renderer scripts may populate only their declared content roots.
- Do not duplicate shared scripts or add alternate implementations of shared behavior.
- Avoid inline event handlers and global CSS overrides.

## 9. Required acceptance checks

A lesson cannot be marked `published` until all checks pass:

### Static checks
- The canonical shell template contains the nine semantic roots in the exact mandatory order.
- Every UID-backed Track A lesson at or beyond the canonical boundary that is marked both `status: published` and `content_state: published` has exactly one root for each block, in the required source/DOM order, in RU / EN / 中文. Missing routes, missing roots, duplicate roots or reordered roots fail CI.
- Exactly one canonical header, main, footer and lesson navigation placeholder.
- Exactly one load of each required shared script.
- No local language selector, footer language links, or renderer-owned navigation.
- RU / EN / 中文 pages, URLs, UID and catalog fields agree.
- CSS references and script paths exist.
- Each complete lesson's RU / EN / 中文 dictionary uses the exact canonical card structure, title and matching term count/order.
- No unapproved duration, reading-time, difficulty, audience or format metadata is present.
- JavaScript syntax and lesson content tests pass.

### Browser checks (Playwright / Chromium)
Run every new catalog-backed Track A lesson (UID sequence beginning at `les-a-0169`) in each locale at 375, 768 and 1440 CSS pixels, in light and dark themes. The Playwright suite discovers these lessons from `catalog-v3.json`; adding a new Track A lesson automatically adds it to browser acceptance.
- exactly one language selector, located inside the site header;
- exactly one theme control, located inside the site header;
- no locale selector in main content or footer;
- exactly one lesson navigation block, populated by the shared script;
- locale links open the same lesson in the selected language;
- previous/next links match catalog publication state;
- no broken local resources or uncaught page errors;
- no page-level horizontal overflow;
- heading foreground uses theme-aware tokens and remains readable;
- dictionary renders as styled cards, with two columns on desktop and one on mobile, in both themes;
- no duration or unapproved metadata badge is rendered;
- lesson content, tables, code, formulas and SVGs remain within their intended containers.

### Publication gate
- `status` and `content_state` must both be `published` only after static and browser acceptance passes.
- `review` remains the correct state while visual or browser acceptance is outstanding.
- CI failure blocks GitHub Pages deployment.
- A passing content-only test is not a substitute for browser acceptance.

## 10. Required workflow for every new lesson

1. Copy the canonical shell template; do not invent page chrome.
2. Add the lesson content renderer and scoped content CSS only.
3. Register one UID and three locale URLs in the catalog with `status: review`.
4. Run static, content, localization and JavaScript tests.
5. Run browser acceptance in all three locales, both themes and all required widths.
6. Fix all failures in the shared component owner where appropriate; do not add one-off workarounds to a lesson.
7. Only after successful acceptance, set both catalog publication fields to `published`.
8. Verify deployed pages and navigation after Pages deployment.

## 11. Change control

Changes to this contract, canonical shell, shared component ownership, or global design tokens require an explicit user decision. A lesson authoring task does not imply permission to redesign or refactor shared UI.

**Default: preserve the existing school interface. Change lesson content, not the product shell.**


## 12. Shared component enforcement (2026-11-20)

- New lesson renderers must use `scripts/lesson-glossary.js` and `window.DCHLessonComponents.renderGlossary(root, localizedTerms, localizedHeading)`. The renderer owns `.glossary-grid → .glossary-entry → .term-index / .term / p`; lesson renderers must not emit `dl/dt/dd` or hand-build glossary cards.
- Outcomes renderers provide only a semantic list. Shared design-system styles own card surface, foreground, numbering and responsive layout. Lesson CSS must not apply a contrasting parent foreground to nested cards.
- All new lesson SVG diagrams must use `scripts/lesson-svg-renderer.js` (`window.DCHLessonSVG.render`) through typed specs; do not hand-build SVG strings or dispatch by substring markers. The shared renderer measures localized text, wraps long labels (including CJK), derives node heights and `viewBox`, and preserves intrinsic font size.
- SVG illustrations must not be clipped with `overflow:hidden`. Dense diagrams may use an accessible horizontal scroll viewport on narrow screens. Browser acceptance checks each text bounding box against its own node, checks diagram identity/count and `viewBox`, and confirms all diagram content is reachable at 375 / 768 / 1440 px.
- The canonical shell loads the shared SVG renderer before lesson data/render scripts; every new lesson inherits it without adding a local script include.
- Contrast is measured between each visible text node and its actual rendered surface, including nested cards. Parent-container contrast alone is insufficient.
- Every substantive audit is stored under `docs/reports/`, indexed in `data/audit-roadmap.json`, and rendered in the admin Audit & Roadmap tab. CI, Pages deployment, production verification and user visual acceptance are separate evidence states.
- These rules are mandatory for new lesson pages across all tracks.


## 13. Semantic alignment of lesson text and illustrations (2026-11-22)

**Purpose:** prevent diagrams from introducing unexplained examples, values, symbols, labels or claims, and prevent the lesson text and its illustrations from describing different processes. This rule applies to every track and every locale (RU / EN / 中文).

### 13.1 Source-of-truth and local context

- The lesson text immediately before an illustration is the primary teaching context for that illustration. A diagram may summarize or reorganize information already introduced; it must not introduce a new domain scenario, entity, class label, feature, number, formula, acronym or symbol without defining it in the adjacent text or in an explicit diagram legend.
- Every diagram must answer three questions without guesswork: **what is the input, what operation or relationship is shown, and what is the output or conclusion?**
- Each diagram must have a documented semantic purpose and a stable diagram type. Its type must match the section's learning objective; a generic fallback diagram must never be substituted for a missing or unknown type.
- Use concrete examples, tables, formulas or properly labelled plots when they communicate the concept more directly than decorative boxes. Avoid placeholder labels such as "Feature 1 (schematic)" when the lesson discusses identifiable features.
- A diagram caption must explain whether values are real measured results, calculated examples, or hypothetical teaching values. Never let hypothetical values look like outputs from the practical lab.
- Every abbreviation and mathematical symbol shown in a diagram (for example x₀, x′, zᵢ, f, g, dᵢ, wᵢ, πₓ₀) must be defined in the adjacent text or a diagram legend before or at first use. The same symbol must keep the same meaning throughout the lesson.

### 13.2 Numerical and scenario consistency

- A worked example must use one coherent scenario from its introduction through its conclusion. Entity names, feature names, class labels, units, values, and signs must remain consistent in the text, tables, formulas, plots, captions and quiz.
- Every number displayed in a diagram must be traceable to one of: (a) a calculation shown in the text, (b) a declared illustrative assumption, or (c) an explicitly identified runtime output. Unexplained constants and unlabeled illustrative values are prohibited.
- If the lesson contains a hypothetical explanatory example and a separate practical dataset, the text must explicitly distinguish them. The diagram and caption must not imply that hypothetical coefficients or predictions were generated by the practical dataset.
- For classification explanations, state which class is being explained and what a positive/negative coefficient means for the local surrogate output. Do not describe a coefficient as a percentage-point change or causal effect unless the model and method actually support that interpretation.
- Tables must expose meaningful column headings. Do not pack several independent features into one opaque cell separated by punctuation when a proper multi-column table is feasible.

### 13.3 Diagram layout and visual semantics

- The default grid layout must not draw automatic connectors between rows or lower blocks. Reading order is established by numbering, explicit stage labels and the grid's row/column order. Connectors are opt-in and permitted only when their route is short, unambiguous and does not cross or touch unrelated blocks.
- Do not use long curved or diagonal arrows to communicate a simple sequence. If direction is essential, use a simple left-to-right flow within one row or an explicitly numbered sequence. A flow across rows must not rely on ambiguous connector routing.
- A plot must have meaningful, named axes with units or mathematical definitions where applicable. Explanatory prose such as "near = higher weight" belongs in a legend or caption, not as floating labels that resemble axis/category labels.
- Do not draw points in an abstract coordinate plane unless the axes represent meaningful variables. If the lesson concerns tabular perturbations, show tabular examples or clearly explain that a scatter plot is a conceptual projection.
- A diagram's title, accessible SVG description, visible labels and caption must agree with the adjacent text and with one another.

### 13.4 Multilingual parity

- RU / EN / 中文 must use the same example entities, feature set, class being explained, numeric values, formulas, diagram sequence and semantic relationships.
- Translation may change wording and number formatting, but may not change or omit the underlying claims, values, assumptions, caveats or outputs.
- Every locale must define symbols and label hypothetical/runtime values with equivalent meaning.

### 13.5 Required automated tests

For each complete lesson, static tests must verify, as applicable:

1. One explicit semantic diagram type per section that contains an illustration; no unknown-type fallback and no accidental repeated generic diagram.
2. Every diagram's key entities, symbols, feature labels, class labels and numeric values are introduced in the preceding section text or in an explicit legend/caption.
3. Worked-example values are consistent across all sections that reuse the example.
4. The practical dataset and runtime outputs are clearly distinguished from hypothetical teaching examples.
5. All locales have the same diagram-type sequence and equivalent example/value anchors.
6. No placeholder labels, unexplained parenthetical "(schematic)" labels, or opaque multi-feature table cells remain.
7. Grid diagrams do not receive automatic connectors by default; connector use is explicitly enabled and covered by a focused renderer test.
8. Plot axes, captions and descriptions are present and semantically meaningful.

Static tests are necessary but not sufficient: browser acceptance must still inspect the rendered diagrams, reading order, clipping, text fit, theme contrast and responsive reachability. A passing static test does not prove that a diagram is pedagogically clear; user visual acceptance remains a separate gate.
