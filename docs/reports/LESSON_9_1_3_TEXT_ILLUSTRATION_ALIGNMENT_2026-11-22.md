# Audit report — lesson 9.1.3 text/illustration semantic alignment

**Date:** 2026-11-22  
**Lesson:** Track A, 9.1.3 «Как работает LIME»  
**UID:** `les-a-0179`  
**Locales:** RU / EN / 中文  
**Status:** audit findings and preventive standard recorded; lesson remains `review`.

## Executive finding

The review identified a systemic quality risk: an illustration can be visually present and have a distinct SVG type while still failing to teach the concept in the adjacent text. The acceptance criteria therefore must validate semantic alignment, not merely SVG count, type names or locale parity.

The lesson already contains a connected hypothetical customer example across sections 2–8 and a separate practical exercise on Breast Cancer Wisconsin. The distinction is pedagogically valid only when every locale makes it explicit and no illustrative customer coefficients are presented as runtime outputs.

## Findings and required controls

| Area | Risk identified | Required control |
|---|---|---|
| Section 1 workflow | Grid connectors can create ambiguous paths between lower blocks | Numbered reading order; grid connectors disabled by default |
| Section 2 representations | A generic transformation diagram can obscure that x₀ and x′ are two representations of the same customer | Show the same feature values and their interpretable conditions; define x, x₀ and x′ |
| Section 3 perturbations | Abstract coordinates or labels such as “Feature 1 (schematic)” hide the tabular nature of the example | Show the original row and named synthetic variants; explain that the table is illustrative, not a literal sampler trace |
| Section 4 black-box calls | Inputs and returned predictions can be confused | Pair each input row with the class probability returned by f; explain class ordering and that f is not retrained |
| Section 5 proximity | “Near/far” labels can be mistaken for axis categories; kernel curves can look universal | Name axes mathematically; label the curve schematic; show distance/weight examples and the chosen kernel assumptions in text |
| Section 6 local fitting | Weights can be mistaken for customer features | Explicitly align interpretable rows z′ᵢ, outputs f(zᵢ), and weights wᵢ; state that wᵢ is a fitting weight |
| Section 7 feature selection | Coefficients are meaningless without task, selected class and sign interpretation | State the bank classification task, class 1 “reliable customer”, f(x₀)=0.78, selected features, coefficient signs and non-causal/non-percentage-point caveat before the figure |
| Section 8 worked example | Values can appear as disconnected facts or be mistaken for practical output | Trace one customer case through f(x₀), distances, weights, g(x₀), and coefficients; label all values hypothetical |
| Section 9 practical lab | Runtime API values can be confused with the hypothetical bank example | Explain exp.predict_proba, exp.local_pred, exp.score and exp.as_list; explicitly identify Breast Cancer Wisconsin as a different dataset |

## Mathematical and factual caution

The text's kernel-weight example must match the exact default implementation being described. The simplified expression and the square-root calculation should be checked against the selected LIME version/API before being treated as a package-default formula. If it is only a pedagogical example, it must be labelled as such and not conflated with the Python lab.

The coefficient values +0.18, −0.11 and +0.07 are hypothetical local-surrogate coefficients. They are not percentage-point changes, causal effects, or Breast Cancer Wisconsin outputs.

## Canonical template update

Added mandatory section 13, “Semantic alignment of lesson text and illustrations”, to `docs/standards/CANONICAL_LESSON_UI_CONTRACT.md`. It defines source-of-truth context, numerical/scenario consistency, diagram semantics, multilingual parity and static/browser acceptance gates for all tracks.

The shared SVG renderer now draws grid connectors only when `connectSequence === true`; the default is intentionally connector-free. This prevents implicit arrows from appearing between lower grid blocks in future lessons.

## Automated regression coverage

Extended `tests/test_lesson_913_lime.py` to check:
- section-specific semantic anchors across RU / EN / 中文;
- the task, class, features, coefficient values and interpretation in section 7;
- separation of the hypothetical customer scenario from the Breast Cancer Wisconsin lab;
- absence of placeholder feature labels;
- connector-free grid default.

## Remaining acceptance boundary

Static tests cannot prove that a diagram is immediately understandable to a learner. The rendered RU/EN/ZH pages still require browser review at 375 / 768 / 1440 px and in light/dark themes, followed by user visual acceptance. Lesson publication state must remain `review` until that gate is satisfied.
