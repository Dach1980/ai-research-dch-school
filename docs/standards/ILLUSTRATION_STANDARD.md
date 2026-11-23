# Illustration and Diagram Standard

## Purpose
Illustrations must teach a concept and remain readable in both site themes and on mobile screens. They are a core instructional component, not decoration. Every figure requires an explicit teaching purpose, a suitable visual form, and individual pedagogical review against the adjacent lesson text.

## Required properties
- Choose the visual representation for the concept: do not default to generic cards or grids. Use tables, plots, matrices, annotated examples or flows when they express the relationship more precisely.
- Make the reading order, direction, and relationship between elements explicit. Every arrow, axis, value, symbol, colour and connection must have a clear meaning.
- Review each illustration individually: a technically valid or correctly sized SVG is not necessarily a clear teaching illustration.
- Verify actual computed foreground/background contrast for all text in both themes, including accent and secondary surfaces; every referenced CSS token must be defined in both themes.
- Every meaningful illustration has a title or caption explaining its teaching purpose.
- SVG text, labels, arrows, axes, legends and node outlines use theme-safe colors.
- A dark image on a dark surface must be placed on a contrasting canvas; a light image on a light surface must receive a contrasting frame or surface.
- Captions use theme tokens and maintain readable contrast.
- Do not encode meaning through color alone; add labels, shapes, line styles or symbols.
- Keep text large enough for mobile viewing; avoid dense text inside SVG when it can be placed in HTML.
- Text placed inside a diagram node must be paired explicitly: add `data-text-box="node-id"` to the SVG shape and `data-text-for="node-id"` to its `<text>` label.
- Center labels with `text-anchor="middle"` when the layout is centered. Split long labels into multiple `<tspan>` lines and leave visible padding. Never rely on SVG clipping to hide overflow.
- Every new lesson's SVG node labels must pass `tests/test_svg_text_fit.py`. If fonts or layout change, update the check rather than weakening it.
- Diagrams scale to container width and do not cause page-wide horizontal overflow.
- Informative figures include useful alternative text; complex diagrams also need a nearby textual explanation.
- Decorative artwork uses empty alt text and is not announced as meaningful content.
- Record source, licence and provenance.

## Review checklist
Light theme: foreground, background, caption and labels readable. Dark theme: same. Meaning is not color-only. Mobile labels remain legible and content is not clipped. Every node label has a matching annotation pair and passes the automated text-fit test. Screen-reader description communicates the diagram's point.


## Shared SVG renderer (required for new lessons)

New lessons must load `scripts/lesson-svg-renderer.js` from the canonical shell and create diagrams through `window.DCHLessonSVG.render(spec)`. The renderer accepts a typed specification with a stable `type`, `layout` (`flow` or `grid`), accessible `title` / `description`, a localized `caption`, and structured `nodes` (`id`, `title`, optional `detail`, optional semantic `tone`). Do not generate SVG markup by concatenating localized strings.

The shared renderer measures text with Canvas using the selected font, wraps whitespace-separated labels and long CJK runs, calculates node heights and the complete viewBox, and emits accessible SVG. It must preserve a minimum readable font size; if content cannot fit, expand the diagram or use a scrollable viewport rather than shrinking text or clipping it.

Every diagram must pass browser checks for:
- exact type and expected diagram count;
- every text bounding box inside its own node with visible padding;
- every visible element inside the viewBox;
- no text/node/arrow collisions;
- light/dark contrast and readable computed font size;
- RU / EN / 中文 at 375 / 768 / 1440 CSS px.

Do not weaken geometry assertions to make a failing diagram pass. Fix the shared layout or the diagram specification.

## Flow layout, accent contrast and semantic captions

Flow diagrams use a shared node height equal to the tallest node in the row; node text is vertically centered and every connector arrow shares the row centerline. Accent nodes must use the theme-aware `--lds-accent-ink` foreground token (white on the light-theme blue accent, dark ink on the light-blue dark-theme accent). Browser acceptance computes actual SVG foreground/background contrast and requires at least 4.5:1 for normal text. Captions must describe the actual diagram type: an individual PFI workflow must not claim to compare group permutation; a correlation/group diagram must explicitly describe the individual-versus-group comparison. Keep captions localized.
