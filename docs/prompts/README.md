# Lesson Prompt Library

Version: 1.0  
Status: active  
Last updated: 2026-11-23

This directory is the canonical home for prompts used to create and revise lessons in AI Research DCH School.

## How to use

1. Read [LESSON_PROMPT_TEMPLATE.md](./LESSON_PROMPT_TEMPLATE.md) first. It defines requirements shared by every lesson prompt.
2. Open the lesson-specific prompt linked in the registry below.
3. Ask the assistant to execute that exact repository prompt, for example:

   `Создай урок по промпту docs/prompts/lessons/track-a/9.2.2-lime-limitations-and-stability.md. Сначала проверь актуальное состояние main и стандарты проекта.`

4. The assistant must inspect the current repository before editing. The prompt is an instruction specification, not permission to bypass review, CI, or publication approval.

## Statuses

- `draft` — prepared but not yet explicitly approved as the canonical execution prompt.
- `approved` — approved for use.
- `deprecated` — superseded; retained for history and traceability.

Each prompt should declare its own version and status near the top. A lesson's content status is independent of its prompt status: using an approved prompt does not automatically approve or publish the resulting lesson.

## Site audit prompts

These prompts are separate from lesson-authoring prompts. They must preserve the site's architecture and educational content.

| Scope | Prompt | Version | Status |
|---|---|---:|---|
| Whole website — independent UX/UI, architecture, accessibility, performance, SEO, security and admin audit | [Claude Code read-only site audit](./site-audit/CLAUDE_CODE_SITE_AUDIT.md) | 1.0 | approved for read-only audit; no implementation permission |

The Claude Code site-audit prompt is strictly read-only. Its output is an audit report and prioritized recommendations only. Any implementation requires a separate explicit owner approval.

## Prompt registry

| Track | Lesson | Prompt | Version | Status |
|---|---|---|---:|---|
| A | 8.1.1 — PDP — Partial Dependence Plot | [8.1.1-partial-dependence-plots.md](./lessons/track-a/8.1.1-partial-dependence-plots.md) | 1.0 | draft |
| A | 9.1.2 — Local Surrogate Models | [9.1.2-local-surrogate-models.md](./lessons/track-a/9.1.2-local-surrogate-models.md) | 1.0 | approved; lesson accepted and published |
| A | 9.1.3 — Как работает LIME | [9.1.3-how-lime-works.md](./lessons/track-a/9.1.3-how-lime-works.md) | 1.0 | approved; lesson accepted and published |
| A | 9.2.1 — Выбор окрестности и интерпретация результатов | [9.2.1-lime-neighborhood-selection-and-interpretation.md](./lessons/track-a/9.2.1-lime-neighborhood-selection-and-interpretation.md) | 1.0 | lesson accepted and published 2026-11-22; prompt retained as historical draft |
| A | 9.2.2 — Ограничения и устойчивость LIME | [9.2.2-lime-limitations-and-stability.md](./lessons/track-a/9.2.2-lime-limitations-and-stability.md) | 1.1 | lesson accepted and published 2026-11-23; prompt retained as historical draft |
| A | 10.1.1 — Теория игр и Shapley Values | [10.1.1-shapley-values-game-theory.md](./lessons/track-a/10.1.1-shapley-values-game-theory.md) | 1.0 | draft — prepared 2026-11-23; awaiting execution approval |
| A | 10.1.2 — Как работает SHAP | [10.1.2-how-shap-works.md](./lessons/track-a/10.1.2-how-shap-works.md) | 1.0 | draft — prepared 2026-11-24; awaiting execution approval |

## Governance

- The canonical lesson UI and content standards in `docs/standards/` take precedence over this library.
- The shared template is the minimum baseline. A lesson-specific prompt may add requirements, but must not weaken the template or canonical standards.
- When a standard changes, update the template and review affected lesson prompts.
- Keep prompts focused on lesson creation/revision. Do not copy lesson content into this directory.
- Do not mark a lesson `published` merely because its implementation and tests pass. Publication requires explicit user acceptance.
- Record prompt changes in Git history. Update the version and registry when a prompt materially changes.

## Scope

The prompt library contains lesson-specific execution specifications for selected lessons. Historical prompts for completed lessons are not reconstructed unless a reliable source version is available. Prompt status and lesson publication status are tracked independently.
