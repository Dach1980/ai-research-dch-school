# Lesson Prompt Library

Version: 1.0  
Status: active  
Last updated: 2026-11-21

This directory is the canonical home for prompts used to create and revise lessons in AI Research DCH School.

## How to use

1. Read [LESSON_PROMPT_TEMPLATE.md](./LESSON_PROMPT_TEMPLATE.md) first. It defines requirements shared by every lesson prompt.
2. Open the lesson-specific prompt linked in the registry below.
3. Ask the assistant to execute that exact repository prompt, for example:

   `Создай урок по промпту docs/prompts/lessons/track-a/8.1.1-partial-dependence-plots.md. Сначала проверь актуальное состояние main и стандарты проекта.`

4. The assistant must inspect the current repository before editing. The prompt is an instruction specification, not permission to bypass review, CI, or publication approval.

## Statuses

- `draft` — prepared but not yet explicitly approved as the canonical execution prompt.
- `approved` — approved for use.
- `deprecated` — superseded; retained for history and traceability.

Each prompt should declare its own version and status near the top. A lesson's content status is independent of its prompt status: using an approved prompt does not automatically approve or publish the resulting lesson.

## Prompt registry

| Track | Lesson | Prompt | Version | Status |
|---|---|---|---:|---|
| A | 8.1.1 — PDP — Partial Dependence Plot | [8.1.1-partial-dependence-plots.md](./lessons/track-a/8.1.1-partial-dependence-plots.md) | 1.0 | draft |
| A | 9.1.2 — Local Surrogate Models | [9.1.2-local-surrogate-models.md](./lessons/track-a/9.1.2-local-surrogate-models.md) | 1.0 | approved; lesson created as review |
| A | 9.2.2 — Ограничения и устойчивость LIME | [9.2.2-lime-limitations-and-stability.md](./lessons/track-a/9.2.2-lime-limitations-and-stability.md) | 1.0 | draft — future lesson; do not execute before 9.1.2, 9.1.3 and 9.2.1 |

## Governance

- The canonical lesson UI and content standards in `docs/standards/` take precedence over this library.
- The shared template is the minimum baseline. A lesson-specific prompt may add requirements, but must not weaken the template or canonical standards.
- When a standard changes, update the template and review affected lesson prompts.
- Keep prompts focused on lesson creation/revision. Do not copy lesson content into this directory.
- Do not mark a lesson `published` merely because its implementation and tests pass. Publication requires explicit user acceptance.
- Record prompt changes in Git history. Update the version and registry when a prompt materially changes.

## Scope of the initial library

The initial entry is the prepared prompt for Track A lesson 8.1.1. Historical prompts for already completed lessons have not been reconstructed or backfilled. They may be added later when a reliable source version is available.
