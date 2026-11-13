# Lesson 1.3.3 — Editorial and publication report

**Date:** 2026-11-12  
**Track:** A — Understanding AI  
**Theme / module:** 1 / 3 — Types of machine learning  
**Lesson:** 1.3.3 — Reinforcement Learning  
**UID:** `les-a-0053`  
**Publication state:** `published` / `content_state=published`  
**Locales:** RU / EN / 中文

## 1. Scope and learning outcomes

The lesson explains reinforcement learning as sequential decision-making through interaction with an environment. It introduces agent, environment, state, action, reward, transition, episode, MDP, return, discount factor, policy, value function, Q-function, exploration and exploitation.

It compares value-based, policy-based, actor–critic, model-based, and deep RL families at an introductory level. It deliberately does not teach advanced Bellman derivations, convergence proofs, PPO/DQN implementation, partial-observability formalisms, or real-world control deployment; those belong in later study.

## 2. Instructional sequence

1. Difference between supervised, unsupervised, and reinforcement learning.
2. Agent–environment interaction loop.
3. MDP elements and a building-simulation example.
4. Reward, return, and discounting.
5. Policy, value, Q-function, exploration, and exploitation.
6. Overview of major RL algorithm families.
7. Safety-aware task formulation for a simulated building controller.
8. Executable tabular Q-learning example using Python standard library only.
9. Limitations, failure modes, and key takeaways.
10. Independent task, sources, glossary, and self-check.

## 3. Content boundaries and duplication control

- **1.3.1 Supervised Learning:** this lesson does not repeat labeled-example training, regression/classification detail, or train/validation/test workflows. It contrasts the learning signal only as needed.
- **1.3.2 Unsupervised Learning:** this lesson does not repeat clustering, PCA, DBSCAN, or anomaly-detection material. It uses the existing sequence to establish that RL is a third learning setting.
- **1.3.4 Classification and Regression:** the distinction is referenced only to compare learning settings; detailed task formulation remains for 1.3.4.
- **1.3.5 Clustering and Dimensionality Reduction:** no overlap in method or practice.
- **1.3.6 Generative Models:** generation and distribution modelling are outside this lesson; RL is about sequential action and feedback.

## 4. Practice and assessment

- Python example: a deterministic one-dimensional five-state environment.
- Algorithm: tabular Q-learning with epsilon-greedy action selection.
- Dependencies: Python standard library; Python 3.10+.
- Seed: 7.
- Expected greedy trajectory: `0 → 1 → 2 → 3 → 4`.
- Three original localized SVG diagrams.
- Ten glossary entries.
- Six self-check questions, including one multi-select item.
- Each answer has a localized rationale grounded in the lesson text.

The building-control example is explicitly restricted to simulation. The lesson warns that reward misspecification, unsafe exploration, simulation-to-reality mismatch, partial observability, and instability prevent treating RL as an automatic safe-control method.

## 5. Localization

All three pages have the same section sequence, three diagrams, code logic, five sources, ten glossary entries, and six assessment items. Titles, body text, diagram labels, table text, questions, options, explanations, navigation labels, and page language are localized.

Structural parity is covered by `tests/test_lesson_133_multilingual.py`. Automated parity does not replace native-speaker editorial review.

## 6. Sources

- Sutton and Barto, *Reinforcement Learning: An Introduction*, 2nd edition.
- OpenAI Spinning Up — RL key concepts and introduction.
- Gymnasium — Environment API.
- OpenAI Spinning Up — Vanilla Policy Gradient.

Links are embedded in all three lesson pages.

## 7. Publication and verification

- Canonical pages: `lessons/a-1-3-3.html`, `lessons/a-1-3-3-en.html`, `lessons/a-1-3-3-zh.html`.
- Catalog record: `les-a-0053`; status and content state are both published.
- The pages do not contain `noindex,nofollow`.
- The three 1.3.2 locale pages link to 1.3.3 as the next lesson.
- 1.3.4 is now published in RU / EN / 中文 and linked as the next lesson; 1.3.5 remains planned.
- The knowledge map, home knowledge map, and Track A catalogue read the v3 catalogue dynamically; the map script now has a localized 1.3.3 description.

### Limitations

Manual visual verification in a real browser at desktop/mobile sizes, switching light/dark themes, and keyboard/screen-reader review were not performed in this session. Do not interpret source-level tests or GitHub Pages deployment as proof of those manual checks. The publication state is set to published at the project owner's explicit direction.

On 2026-11-12, the owner explicitly directed that all existing website lessons be marked published. The catalog status for 1.3.1 and 1.3.2 was updated accordingly; the noindex directive was removed from 1.3.2 in all three locales. Manual browser QA remains outstanding.


## 8. CI and Pages result — 2026-11-12

- Catalog and lesson validation: [GitHub Actions run 43135444217](https://github.com/Dach1980/ai-research-dch-school/actions/runs/43135444217) — success.
- GitHub Pages build: [run 43135444339](https://github.com/Dach1980/ai-research-dch-school/actions/runs/43135444339) — success.
- Static website deployment: [run 43135444142](https://github.com/Dach1980/ai-research-dch-school/actions/runs/43135444142) — success.
- The automated lesson-specific test passed, including locale parity, page structure, code escaping, quiz structure, catalog status, and previous-lesson navigation.
- Manual visual review in a browser remains outstanding, as recorded above.


## 9. Post-publication correction and final checks — 2026-11-12

A final source review found that the learning-outcomes heading still contained an unresolved template value. It was corrected in RU / EN / 中文, and the lesson-specific test now rejects any remaining `undefined` placeholder.

A dedicated `styles/lesson-133.css` stylesheet was added for the three SVG figures. On screens up to 560 px, each diagram retains a 640 px canvas inside a horizontally scrollable figure so labels are not compressed. Tests check the responsive breakpoint, overflow behavior, and localized SVG `title` / `desc` elements.

Final checks:
- [Validate learning catalog run 43135828910](https://github.com/Dach1980/ai-research-dch-school/actions/runs/43135828910) — success.
- [GitHub Pages build run 43135829148](https://github.com/Dach1980/ai-research-dch-school/actions/runs/43135829148) — success.
- [Static website deployment run 43135830784](https://github.com/Dach1980/ai-research-dch-school/actions/runs/43135830784) — success.

Manual browser verification remains outstanding; no claim of desktop/mobile visual QA is made.


## Update 2026-11-12 — publication sequence

Lesson 1.3.4 (Classification and Regression) was created in RU / EN / 中文 and published as the next lesson. It expands task formulation, target semantics, binary/multiclass/multilabel classification, model scores versus decisions, and threshold selection. Detailed evaluation metrics remain in Module 1.5 to avoid curriculum duplication. The three 1.3.3 pages now link to the corresponding 1.3.4 locale.

The owner also directed publication of all existing website lessons. All 13 catalog entries with three localized canonical URLs now have `status=published` and `content_state=published`. This is a publication-state decision, not a claim that every page has received a new full editorial review or manual browser QA. See the updated Track A reconciliation report and Audit entries.
