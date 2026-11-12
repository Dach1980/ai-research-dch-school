# Editorial review — lesson 1.3.5

**Lesson:** 1.3.5 — Clustering and Dimensionality Reduction  
**Track:** A — Understanding AI · Theme 1 · Module 3  
**UID:** `les-a-0055` (preserved)  
**Editorial state:** `published` / `published`  
**Locales:** RU / EN / 中文  
**Date:** 2026-11-12

## Curriculum boundary

Lesson 1.3.2 already introduces unsupervised learning, clustering, K-means, hierarchical clustering, DBSCAN, silhouette at an introductory level, PCA, anomaly detection, and a first Python K-means exercise.

Lesson 1.3.5 therefore does not repeat the introductory definitions as its learning goal. It develops the practical decisions that follow that introduction:

- choose an algorithm according to geometry, density, scale, and the question being asked;
- inspect feature units, scaling, distance metrics, and parameter sensitivity;
- use elbow and silhouette as diagnostics, not ground truth;
- compare partitions and test stability with resampling and Adjusted Rand Index;
- interpret PCA through explained variance and distinguish modelling transformations from visual embeddings;
- treat t-SNE / UMAP plots as exploratory views rather than quantitative maps of global distance.

Lesson 1.3.6 remains focused on generative models and modern learning approaches. Detailed linear algebra belongs to Theme 2; supervised model metrics remain in Module 1.5.

## Lesson structure and content

The lesson contains:
1. Learning outcomes and an explicit bridge from 1.3.2.
2. Geometry and assumptions behind algorithm choice.
3. Feature preparation, standardisation, and distance.
4. K-means, hierarchical clustering, and DBSCAN tuning.
5. Elbow method and silhouette interpretation.
6. Stability and ARI.
7. PCA, explained variance, and the difference between reduction and visualisation.
8. A continuous building-operation example.
9. A runnable Python lab using Python 3.10+, NumPy, and scikit-learn.
10. An independent comparison task, limitations, and summary.
11. Five references, ten glossary entries, and eight self-check questions with explanations.

Thirteen key concepts use the shared Definition component at first introduction. Three original SVG diagrams are localised in each language. They have been redrawn as: (1) three separately labelled cluster geometries with filled density regions and explicit noise points; (2) a five-stage validation flow with separated node labels and a return loop; (3) a before/after PCA projection with principal-component axes and projection guides. Explanatory paragraphs are placed in captions below the SVG rather than squeezed into the diagram canvas. Each SVG includes `title`, `desc`, and a localised caption. Diagram overflow is contained within the figure on narrow screens.

All 13 first-use definitions in RU / EN / 中文 use separate `.definition-term` and `.definition-text` spans. The term uses the accent colour and the explanation uses the neutral reading colour, with light/dark tokens in the shared design system. Chinese punctuation is localised.

## Python lab

The code creates deterministic synthetic three-dimensional observations, standardises features, compares two K-means initialisations, runs DBSCAN, calculates silhouette and ARI, and projects observations onto two PCA components.

The exact code was executed in the available Python environment with NumPy and scikit-learn. Observed output:
- K-means clusters: 3
- K-means silhouette: 0.741
- K-means stability (ARI): 1.0
- DBSCAN clusters: 3
- DBSCAN noise share: 0.039
- PCA explained variance: [0.534, 0.405]
- Total retained variance: 0.938

These values describe this synthetic example only; they are not target values for student datasets.

## Quality and publication gates

Automated source-level checks are defined in `tests/test_lesson_135_multilingual.py` and added to `.github/workflows/validate-catalog.yml`. The test checks locale pages, canonical structure, SVG count and accessibility labels, definitions, glossary, sources, quiz keys and explanations, Python syntax, navigation, catalogue UID/state, and mobile stylesheet rules.

The catalogue keeps UID `les-a-0055`, with `status=published` and `content_state=published`. All three pages use `index,follow`. The previous lesson link points to 1.3.4. No forward link to planned 1.3.6 is created.

## Outstanding checks

- GitHub Actions and GitHub Pages deployment for the final visual-repair commit must be confirmed.
- Manual browser QA remains outstanding for desktop/mobile, light/dark themes, keyboard navigation, and screen-reader behaviour.
- Professional native-speaker review of EN and Chinese translations remains outstanding.

Do not change the lesson to `published` or remove `noindex` until the publication gates are accepted.
