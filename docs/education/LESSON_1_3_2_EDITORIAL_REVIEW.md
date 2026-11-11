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
