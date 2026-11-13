# Illustration and Diagram Standard

## Purpose
Illustrations must teach a concept and remain readable in both site themes and on mobile screens.

## Required properties
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
