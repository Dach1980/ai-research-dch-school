# DCH School Design System

## Goals
The interface must remain legible and coherent in light and dark modes. Theme changes apply to the entire interface: header, navigation, cards, lesson reader, tables, code, diagrams, captions, controls, footer and focus states.

## Theme modes
- Light
- Dark
- System

System is the default when no explicit preference exists. Explicit selection persists between visits. The resolved theme is exposed as html[data-theme="light"] or html[data-theme="dark"]; the selected preference is stored separately as light, dark or system.

## Design tokens
Use CSS custom properties instead of hard-coded colors for page background, elevated backgrounds, primary and secondary surfaces, primary and muted text, borders, links, interactive accents, status colors, code surfaces, syntax tokens, diagram surfaces, focus ring and selection.

Avoid page-specific fixed dark colors where a token is available. Inline SVG artwork must define theme-safe colors or use CSS variables/currentColor where appropriate.

## Contrast and illustrations
- Body text and captions remain readable in both themes.
- Never rely on color alone to communicate meaning.
- A dark illustration on a dark page receives a contrasting surface, border or light canvas; a light illustration on a light page receives an appropriate frame.
- SVG labels, arrows, axes, legends and nodes are checked independently.
- Captions use readable secondary-text tokens, not fixed dark gray.
- Tables and diagrams remain usable on small screens without page-wide overflow.

## Components
Shared components: site header, theme switcher, navigation, cards, callouts, lesson figures, tables, code blocks, quizzes, breadcrumbs and footer.

## Accessibility
Keyboard-operable controls with visible focus. Buttons have accessible names and state. Respect prefers-reduced-motion. Do not communicate selected theme or chart meaning by color alone. Maintain readable contrast and semantic headings/table captions.

## Acceptance
Review homepage, Track pages, lesson pages, learning map, account/admin pages and responsive layouts in both themes. Automated checks do not replace manual desktop/mobile review.
