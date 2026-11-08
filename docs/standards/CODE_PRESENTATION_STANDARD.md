# Code Presentation Standard

## Purpose
Code blocks are teaching components, not decorative text containers. Syntax must be visually structured and usable on desktop and mobile.

## Required features
- Explicit language metadata, e.g. language-python.
- Monospaced font with comfortable line height.
- Syntax highlighting for keywords, operators, strings, numbers, comments, functions/methods, classes/types and identifiers.
- Line numbers for multi-line examples.
- Copy action with accessible label and feedback.
- Horizontal scrolling inside the code container, never across the whole page.
- Theme-aware code surface and token palette.
- Keyboard focus and reduced-motion support.
- Preserve exact source text when copying; line numbers and controls must not enter copied content.

## Python token palette
- Keywords: violet.
- Functions and methods: blue.
- Classes and types: amber.
- Strings: green.
- Numbers and constants: orange.
- Operators and punctuation: cyan or neutral accent.
- Comments: muted green-gray.
- Identifiers: primary code text.

The palette must be contrast-checked in both themes. Color is supplementary; syntax remains readable without color.

## Authoring requirements
- Mark code language explicitly.
- Do not place a long program in one uninterrupted block when it contains multiple conceptual stages.
- Split code at meaningful boundaries: imports, data creation, preprocessing, model definition, training, prediction, metrics, validation and interpretation.
- Keep code runnable and preserve execution order.
- Distinguish executable code from pseudocode, shell commands and output.
- Expected output is separate from source code.

## Quality checks
Copy result equals source text exactly. Tokenizer does not alter executable text. Code remains readable at 320px viewport width. No horizontal page overflow. Tokens meet contrast requirements in Light and Dark. Unlabelled code is reported for editorial review; mathematical formulas are not automatically treated as Python.
