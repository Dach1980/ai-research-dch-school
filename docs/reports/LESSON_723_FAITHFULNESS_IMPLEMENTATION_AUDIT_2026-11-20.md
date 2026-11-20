# Lesson 7.2.3 implementation audit — 2026-11-20

## Scope
Implemented Track A lesson 7.2.3, “Faithfulness and Limitations of Explanations”, in RU / EN / ZH. Work follows the canonical lesson shell and UI contract v1.2.

## Identity and publication gate
- UID: \`les-a-0173\` (next unused lesson UID after \`les-a-0172\`).
- Catalog code: \`7.2.3\`, Track A / Theme 7 / Module 7.2.
- Localized routes: \`a-7-2-3-les-a-0173.html\`, \`-en.html\`, \`-zh.html\`.
- Prerequisite: \`les-a-0172\`.
- Catalog state: \`status=review\`, \`content_state=localized\`.
- Publication is intentionally blocked pending browser acceptance and user review.

## Content
Seven aligned sections cover plausibility vs faithfulness, definitions, perturbation tests, PFI limitations, error sources, a nine-step evaluation protocol, and critical takeaways. Each locale contains five outcomes, a complete Python lab, five verified references, twelve glossary entries, and twelve assessment questions with explanations for correct and incorrect options.

## Practice
The Python lab trains a binary classifier, calculates permutation importance, runs feature deletion and insertion curves, and includes a shuffled-label model sanity check. The script fixes random seeds and explicitly documents that perturbations are not causal interventions.

## Illustrations and shared components
Three localized diagrams are rendered through \`DCHLessonSVG.render\`; no lesson-specific SVG strings are authored. Glossary cards are rendered through \`DCHLessonComponents.renderGlossary\`. The canonical DOM order and shared navigation are preserved.

## CI repair
The existing 7.2.1 browser test expected disabled next navigation after 7.2.2 had been published. The assertion now checks the published 7.2.2 localized route, preserving the navigation gate for unpublished 7.2.3.

## Acceptance evidence
Static tests and GitHub Actions results are pending after commit. Browser rendering, light/dark themes, 375 / 768 / 1440 px, and production deployment must be verified before publication. This report does not mark the lesson as accepted or published.
