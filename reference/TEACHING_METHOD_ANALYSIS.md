# Teaching Methodology Reference: AI Interpretability School

**Status:** preliminary research note  
**Research date:** 2026-11-03  
**Reference course:** [AI Interpretability School](https://ai-interpretability.school/)  
**Telegram reference:** [Data Blog — @jdata_blog](https://t.me/s/jdata_blog)  
**Authors:** Sabrina Sadiekh and Elena Ericheva (course); the public Telegram channel is authored by Sabrina Sadiekh.

## 1. Purpose and scope

This note studies the reference school's publicly observable teaching approach. It separates:
- the **course architecture** visible on the school website;
- the **author's explanatory style** visible in public Telegram posts and linked tutorials;
- details that cannot yet be verified because full lesson content is not publicly accessible.

This is a methodological reference, not a template to copy. The goal is to identify transferable teaching practices for AI Research DCH School and adapt them to our own curriculum, audience, visual language, and learning outcomes.

## 2. What can be established from the public sources

The school connects two areas that are often taught separately:
- **Track A — XAI Practitioner:** applied explanation methods, model interpretation, explanation evaluation, attacks, and deeper dives into SHAP and counterfactuals.
- **Track B — Math of LLMs:** mathematical foundations, transformer internals, representations, circuits, causal interventions, sparse autoencoders, applications, and scientific rigor.

The introduction includes a machine-learning self-check. The public program describes practical work in several method modules and a Track A self-check with 40 tasks. The self-check is formative: it has no pass threshold, and answer explanations point learners back to the relevant lesson. The website states that the first four modules are free and that the course is available in English and Russian.

The numbering is shared across tracks and is not strictly sequential within each track. The current public page also includes advanced material on representation geometry and probes/lenses. For our own curriculum, the important lesson is to make prerequisites and navigation explicit when one global map contains multiple learning routes.

## 3. Observable teaching pattern in the author's Telegram writing

The public posts show a recurring explanatory sequence:

1. **Start with a concrete question, puzzle, or misconception.** The author often opens with a practical tension: why a familiar method is insufficient, what a new result actually means, or what problem a research paper solves.
2. **Establish context and motivation.** The reader learns where the problem comes from and why it matters before receiving the formal machinery.
3. **Introduce concepts in layers.** Definitions and intuitive explanations come before equations, metrics, architecture details, or research-level qualifications.
4. **Use examples and analogies, then return to technical precision.** Informal language lowers the entry barrier, but the explanation does not stop at analogy.
5. **Compare alternatives and expose limitations.** The author explains not only what a method does, but also where it fails, what assumptions it makes, and what changed in later work.
6. **End with practical implications and takeaways.** Posts often include a compact list of lessons, links to papers, libraries, notebooks, or follow-up material.

### Examples observed

- **PDP / ICE / ALE:** the post first gives the shared intuition of varying an input feature and observing the model output, then distinguishes the individual methods, explains why PDP can hide opposing individual effects, describes ALE's response to feature correlation, and connects the idea to modern ML/LLM pipelines.
- **SHAP:** the author starts from the limitations of the classical tabular formulation, then frames later extensions as answers to concrete questions; the post points to implementations and a technical article.
- **Research-paper analysis:** in a post about an AI-assisted mathematical result, the author reconstructs the experimental setup, explains parallel agents, negative controls, blind review, logging, and the question “where is the first unjustified step?” The value is in teaching research design, not merely retelling a headline.
- **Hypothesis evaluation:** the author pairs claims with follow-up studies, distinguishes a rejected mechanism from a still-useful method, and emphasizes that conclusions depend on experimental context and measurement choices.

## 4. The six requested teaching dimensions

### 4.1 How a lesson begins

**Publicly observable pattern:** begin with a question, an applied need, a surprising result, or a limitation of an existing approach. Then state why the reader should care.

**Transferable practice:** every DCH School lesson should open with:
- the practical or conceptual problem;
- a short motivating example;
- what the learner will be able to explain or do by the end;
- prerequisite concepts, if any.

Avoid opening with a dictionary-style block of definitions before the learner understands the problem.

### 4.2 How new concepts are explained

**Publicly observable pattern:** intuitive explanation → formal definition → technical detail → caveats and counterexamples → practical interpretation.

The author uses conversational language and analogies, but also introduces equations, metrics, paper references, and implementation details when the topic requires them.

**Transferable practice:** define each new term at first use; distinguish intuition from formal definition; give a small worked example; then explain assumptions and failure modes. Do not let an analogy substitute for the real definition.

### 4.3 Diagrams and visualizations

Public posts refer to plots, geometric visualizations, comparison tables, notebooks, and code-generated figures. In the tutorial about encoder-only, encoder-decoder, and decoder-only models, the author explicitly mentions a notebook and visual plots while outlining theory, token information, geometry metrics, practical implications, and known failure cases.

**Transferable practice:** every visual should answer a specific question. Prefer:
- a diagram of the mechanism before dense notation;
- side-by-side comparison plots for related methods;
- annotated figures that explain axes, units, and interpretation;
- reproducible notebooks for figures that depend on data or code.

**Evidence limitation:** public Telegram posts show that visuals and notebooks are used, but do not establish the exact visual sequence or production style inside every paid course lesson.

### 4.4 Practical experiments

**Publicly observable pattern:** practical work is tied to the concept being taught. The author points readers to runnable notebooks (including Colab and GitHub), libraries, implementation comparisons, and experiments. The school program explicitly describes practice in classical-method modules and hands-on GPT-2 / SAE Lens work in the mechanistic track.

**Transferable practice:** use a repeatable experiment cycle:
1. formulate a question or hypothesis;
2. identify the model, data, and baseline;
3. run a minimal experiment;
4. inspect a plot or metric;
5. test a limitation or counterexample;
6. state what the result does and does not prove.

A notebook should be more than code to execute: each cell should have a learning purpose and an interpretation prompt.

### 4.5 How lessons connect

**Publicly observable pattern:** the school curriculum creates a broad route from introductory concepts and classical interpretable models to explanation methods, deep-learning methods, LLM analysis, mechanistic interpretability, and advanced research topics. It also has two tracks with different emphases.

**Transferable practice:** make dependencies visible. Each lesson should state:
- what it builds on;
- what new capability it adds;
- where the idea will be reused;
- which later lesson it prepares for.

For a multi-track curriculum, provide both a recommended beginner route and a topic map. Shared numbering without an explicit dependency map can confuse newcomers.

### 4.6 Homework and knowledge checks

**Publicly observable pattern:** the website advertises practical tasks within method modules and a 40-task self-check across Track A. The self-check is designed for diagnosis rather than gatekeeping: there is no pass mark, and explanations direct learners to lessons for revision.

**Transferable practice:** combine:
- short retrieval questions after each concept;
- method-selection scenarios (“which method fits this situation and why?”);
- calculations or interpretation of plots;
- practical notebook tasks;
- cumulative self-checks with explanatory feedback and links back to the relevant material.

Do not rely only on multiple-choice recall. Ask learners to justify a method choice and identify when a conclusion is unsupported.

## 5. Strengths worth adapting

1. **Problem-first explanations** make abstract methods feel necessary rather than arbitrary.
2. **Intuition and rigor coexist:** conversational entry points lead into formal mathematics and research evidence.
3. **Limitations are taught explicitly:** learners see where methods mislead, not just how to run them.
4. **Research literacy is part of the teaching:** papers, experimental controls, metrics, reproducibility, and negative results are discussed.
5. **Practice is connected to concepts:** notebooks, libraries, and applied comparisons help bridge theory and use.
6. **Formative assessment supports recovery:** answer explanations guide learners back to the right lesson instead of merely assigning a score.
7. **The two-track structure unifies related domains** while allowing different depths and goals.

## 6. Risks and opportunities for our own adaptation

- **Prerequisite burden:** advanced mathematics and mechanistic interpretability can overwhelm beginners unless prerequisite paths and optional deep dives are explicit.
- **Track navigation:** a shared module numbering scheme needs a clear visual map, dependency labels, and “start here” guidance.
- **Research density:** paper-heavy explanations should be layered so that a beginner can grasp the central idea before reading every technical detail.
- **Notebook accessibility:** practical tasks should include setup instructions, expected outputs, troubleshooting, and a no-install or hosted alternative where feasible.
- **Assessment feedback:** every incorrect answer should explain the misconception and identify the lesson or concept to revisit.

## 7. Recommended lesson blueprint for AI Research DCH School

Use the following as a default structure, not a rigid rule:

1. **Why this matters** — a problem, question, or real-world use case.
2. **Learning outcomes** — 2–4 observable outcomes.
3. **Intuition first** — plain-language explanation and a small example.
4. **Key terms** — definitions at the point where they become necessary.
5. **Visual model** — diagram, annotated figure, or comparison.
6. **Formal explanation** — equations, architecture, assumptions, and terminology.
7. **Worked example** — step-by-step reasoning with intermediate results.
8. **Experiment** — reproducible code or guided investigation.
9. **Failure modes and limitations** — when the method does not work or the conclusion is unsafe.
10. **Knowledge check** — questions that test understanding and transfer.
11. **Summary and bridge** — key takeaways and connection to the next lesson.
12. **Further reading** — primary papers, documentation, libraries, and optional advanced material.

For shorter lessons, combine sections rather than forcing all twelve. For research-oriented lessons, expand experimental design, controls, reproducibility, and interpretation.

## 8. What remains unverified

The public website exposes the curriculum outline, not the complete contents of every lesson. Public Telegram posts expose the author's writing and research-explanation style, not the complete lesson scripts or all assessment items. Therefore, this note does **not** claim to have verified:
- the exact opening structure of every video or lesson;
- the precise ratio of text, video, diagrams, and exercises inside each module;
- the complete homework formats and grading logic for all modules;
- the detailed feedback shown after every exercise;
- the exact sequence of visuals in the paid lessons.

A deeper lesson-by-lesson audit requires access to the public/free lesson materials or user-provided lesson exports/screenshots. The current findings should be treated as a reliable first-pass methodology analysis, not a full teardown of the learning platform.

## 9. Sources

- AI Interpretability School — curriculum and track descriptions: https://ai-interpretability.school/
- Data Blog — public Telegram channel mirror: https://t.me/s/jdata_blog
- Sabrina Sadiekh webinar page, including links to her Stepik courses and stated teaching scope: https://welcome.stepik.org/aiagent
