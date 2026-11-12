# Editorial and technical review — lesson 1.3.2

**Lesson:** Unsupervised Learning  
**Track:** A — Understanding AI  
**Locales:** RU / EN / 中文  
**Date:** 2026-11-11  
**Status:** review; not published

## Scope

The lesson introduces learning without predefined target labels; clustering (K-means, hierarchical clustering, DBSCAN); cluster evaluation without ground-truth labels; dimensionality reduction (PCA, with t-SNE and UMAP caveats); anomaly detection; and an end-to-end building-operations example.

It distinguishes algorithmic clusters from natural categories, anomaly scores from confirmed faults, and low-dimensional visualisation from proof of structure in the original feature space.

## Pedagogical assets

Each locale includes three captioned SVG diagrams: supervised vs. unsupervised inputs; an illustrative three-cluster scatter plot; and dimensionality reduction. Each locale includes a practical design task, a runnable Python/scikit-learn K-means example, 10 glossary entries, and six interactive self-check questions including one multi-select item.

## Localization

RU / EN / 中文 share the same instructional sequence, figures, code example, five sources, glossary count, and assessment structure. Explanations and feedback are localized; code identifiers and internationally used algorithm names remain stable.

## Sources

- scikit-learn, Unsupervised learning: https://scikit-learn.org/stable/unsupervised_learning.html
- scikit-learn, Clustering: https://scikit-learn.org/stable/modules/clustering.html
- scikit-learn, Unsupervised dimensionality reduction: https://scikit-learn.org/stable/modules/unsupervised_reduction.html
- Google for Developers, Introduction to clustering: https://developers.google.com/machine-learning/clustering
- Google for Developers, Machine Learning Crash Course: https://developers.google.com/machine-learning/crash-course/

## Technical status

Three canonical locale files are created with locale-specific canonical URLs and lang attributes. They reuse the shared lesson shell styles and scripts. Catalog record les-a-0008 is set to status=review and content_state=localized, with three locale paths and measurable learning outcomes.

Not yet accepted for publication: CI, deployment, live URL checks, desktop/mobile browser review, dark/light theme review, keyboard/screen-reader review, and execution of the Python example remain outstanding. Do not change the lesson to published until the quality gate is satisfied.


## Follow-up review — 2026-11-12

The second illustration was revised in all three locales. It now distinguishes a compact cluster, an elongated cluster, and an irregular cluster with uneven density, plus isolated noise observations. The SVG uses theme-aware surface and text colours in the light theme while retaining the dark palette. On narrow screens the clustering diagram remains readable in a horizontally scrollable figure rather than being compressed into illegible labels.

The duplicated runtime labels were corrected in RU, EN, and 中文. A dedicated regression test now checks the localized diagram labels, distinct geometric primitives, noise markers, environment-label uniqueness, light-theme CSS, mobile breakpoint, SVG accessibility, and locale parity in figure/glossary/assessment counts.

Browser verification remains a separate acceptance item: no browser automation provider was used for this change. CI and Pages deployment results must be checked after commit; live desktop/mobile screenshots and manual theme switching are not claimed here.


## Verification result — 2026-11-12

- GitHub Actions validation run **43129629551**: passed, including the dedicated lesson regression test step.
- GitHub Pages build/deployment run **43129628987**: passed.
- The dedicated test covers the three distinct cluster structures and noise markers, all three localized environment labels, the light-theme SVG palette, mobile horizontal-scroll breakpoint, accessible SVG descriptions, and equal figure/glossary/assessment counts.
- Manual visual browser verification of the live pages in desktop/mobile and both themes remains outstanding. TinyFish was not used, as requested; no other interactive browser tool was available in this session.


## Navigation update — 2026-11-12

After lesson 1.3.3 was prepared and published, the lower navigation in RU / EN / 中文 was updated to include an explicit next-lesson link to 1.3.3. The 1.3.2 lesson itself remains in review state; its publication status was not changed by this navigation update.
