# Legacy A.3–A.6 content migration plan

Date: 2026-11-10  
Status: **content crosswalk prepared; lesson-page migration not yet applied**  
Scope: four legacy Track A lessons, 21 target lesson records, RU / EN / 中文.

## Important publication constraint

The target records in `data/catalog/catalog-v3.json` are currently `planned`, and the corresponding target lesson HTML pages are not present in the repository. The old source pages exist in RU / EN / 中文. Therefore this work records the verified editorial transfer map and acceptance gates; it does not falsely mark target pages as written or published. Legacy pages must remain available until every target lesson is authored, translated, tested and accepted.

## Source-to-target content map

| Legacy source | Source topics / fragments | Target lesson(s) |
|---|---|---|
| A.3 | dataset-and-features | 1.2.1 — Что такое данные в машинном обучении; 1.2.2 — Объекты, признаки и целевые переменные |
| A.3 | supervised-learning, unsupervised-learning, self-supervised-learning | 1.3.1 — Обучение с учителем — Supervised Learning; 1.3.2 — Обучение без учителя — Unsupervised Learning; 1.3.6 — Генеративные модели и другие современные подходы |
| A.3 | model-parameters, training-process, generalization | 1.4.1 — Понятие модели и параметров; 1.4.2 — Обучение модели и функция потерь; 1.4.4 — Обобщающая способность модели |
| A.3 | data-quality, data-leakage | 1.2.5 — Качество данных, пропуски и выбросы; 1.2.6 — Корреляция, зависимости и утечка данных |
| A.6 | underfitting, overfitting, bias-variance, learning-curves, regularization | 1.4.3 — Переобучение и недообучение |
| A.6 | generalization | 1.4.4 — Обобщающая способность модели |
| A.6 | cross-validation, split-protocol | 1.5.6 — Кросс-валидация и устойчивость результатов |
| A.6 | leakage, duplicates | 1.2.6 — Корреляция, зависимости и утечка данных |
| A.3 | underfitting-overfitting-introduction | 1.4.3 — Переобучение и недообучение |
| A.4 | model-definition, model-vs-training-algorithm, model-parameters, linear-model-example | 1.4.1 — Понятие модели и параметров |
| A.4 | training-process, inference, model-serialization, preprocessing-postprocessing | 1.4.2 — Обучение модели и функция потерь |
| A.4 | hyperparameters, learning-rate, epochs, batch-size, tree-depth, regularization-strength | 1.4.5 — Гиперпараметры и настройка модели |
| A.4 | linear-model-family, decision-tree-family, neural-network-family, three-model-comparison | 3.1.6 — Сравнение моделей и базовые алгоритмы |
| A.5 | train-validation-test, test-set-independence, random-time-group-split | 1.2.4 — Обучающие, проверочные и тестовые данные; 1.5.6 — Кросс-валидация и устойчивость результатов |
| A.5 | evaluation-purpose, baseline, evaluation-limitations, metric-selection | 1.5.1 — Зачем оценивать качество модели |
| A.5 | mae, mse, rmse, r-squared | 1.5.7 — Метрики регрессии: MAE, MSE, RMSE и R² |
| A.5 | true-positive, true-negative, false-positive, false-negative, confusion-matrix | 1.5.2 — Confusion Matrix |
| A.5 | accuracy, precision, recall, f1, decision-threshold, cost-of-errors | 1.5.3 — Accuracy, Precision, Recall и F1 |
| A.5 | roc-auc, precision-recall-auc | 1.5.4 — ROC-AUC и Precision-Recall AUC |
| A.5 | class-imbalance, misleading-accuracy, rare-event-baseline | 1.5.5 — Дисбаланс классов |
| A.5 | underfitting, overfitting, train-validation-gap | 1.4.3 — Переобучение и недообучение |
| A.5 | preprocessing-leakage, target-leakage, duplicate-leakage, temporal-leakage | 1.2.6 — Корреляция, зависимости и утечка данных |
| A.5 | cross-validation, variance-of-estimate, group-split, time-based-split | 1.5.6 — Кросс-валидация и устойчивость результатов |

## Consolidation rules

1. **A.3 — learning from data** is the primary source for dataset concepts, features/targets, learning paradigms, training flow, and the introductory generalization concepts.
2. **A.4 — machine-learning model** is the primary source for model vs algorithm, parameters, architecture families, training vs inference, serialization and preprocessing/postprocessing; hyperparameters go to 1.4.5.
3. **A.5 — model evaluation** is the primary source for evaluation purpose, baseline, regression/classification metrics, confusion matrix, threshold/cost of errors, ROC/PR, class imbalance and split protocol.
4. **A.6 — generalization and overfitting** is the primary source for underfitting/overfitting diagnosis, bias–variance, learning curves, regularization, cross-validation details and leakage/duplicate examples.
5. Shared topics are taught once at the deepest appropriate target lesson. Other target lessons may reference the concept but must not repeat the full explanation.
6. Preserve unique worked examples, diagrams, Python labs, no-code experiments, glossary definitions, question intent and answer explanations. Refactor only where needed to fit target learning outcomes.
7. Translate by meaning and instructional equivalence, not by shortening. RU / EN / 中文 must have matching outcomes, examples, exercises, code behavior, diagram count/geometry and assessment coverage.
8. Do not expose a target lesson in the public catalog, planet map or next-lesson navigation until all three language pages pass the Lesson Design System and content acceptance checks.

## Required target set (21 lessons)

- [x] 1.2.1 — Что такое данные в машинном обучении (`les-a-0003`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [x] 1.2.2 — Объекты, признаки и целевые переменные (`les-a-0004`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [x] 1.2.5 — Качество данных, пропуски и выбросы (`les-a-0005`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [x] 1.2.6 — Корреляция, зависимости и утечка данных (`les-a-0006`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.3.1 — Обучение с учителем — Supervised Learning (`les-a-0007`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.3.2 — Обучение без учителя — Unsupervised Learning (`les-a-0008`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.3.6 — Генеративные модели и другие современные подходы (`les-a-0009`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.4.1 — Понятие модели и параметров (`les-a-0010`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.4.2 — Обучение модели и функция потерь (`les-a-0011`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.4.3 — Переобучение и недообучение (`les-a-0012`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.4.4 — Обобщающая способность модели (`les-a-0013`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.4.5 — Гиперпараметры и настройка модели (`les-a-0014`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.5.6 — Кросс-валидация и устойчивость результатов (`les-a-0015`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.5.1 — Зачем оценивать качество модели (`les-a-0043`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.5.2 — Confusion Matrix (`les-a-0044`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.5.3 — Accuracy, Precision, Recall и F1 (`les-a-0045`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.5.4 — ROC-AUC и Precision-Recall AUC (`les-a-0046`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.5.5 — Дисбаланс классов (`les-a-0047`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 1.5.7 — Метрики регрессии: MAE, MSE, RMSE и R² (`les-a-0048`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [ ] 3.1.6 — Сравнение моделей и базовые алгоритмы (`les-a-0049`): RU / EN / 中文, page, glossary, self-check, sources and navigation.
- [x] 1.2.4 — Обучающие, проверочные и тестовые данные (`les-a-0050`): RU / EN / 中文, page, glossary, self-check, sources and navigation.

## Migration acceptance gates

- [ ] Every source heading, diagram, example, lab, glossary concept and assessment item is assigned to a target lesson or explicitly marked redundant with a reason.
- [ ] No unique source learning objective or exercise is lost.
- [ ] Duplicate explanations are consolidated and cross-linked.
- [ ] 21 target lesson records have canonical full-number URLs and all three localized URLs.
- [ ] 63 localized lesson pages (21 × 3) exist and follow Lesson Design System.
- [ ] Catalog status remains non-public until the corresponding pages are complete.
- [ ] Internal links, prerequisites, lesson order, planet map and next-lesson links validate.
- [ ] Automated catalog, HTML integrity, locale parity and design-system tests pass.
- [ ] Editorial review and deployed desktop/mobile browser acceptance are recorded.
- [ ] Only after acceptance, legacy A.3–A.6 URLs become redirects to a migration index or the appropriate replacement lesson collection; never redirect a many-to-many source to one arbitrary target.

## Source inventory

Legacy source pages (each currently exists in RU / EN / 中文):
- `lessons/a-3-how-machines-learn-from-data{,-en,-zh}.html`
- `lessons/a-4-what-is-machine-learning-model{,-en,-zh}.html`
- `lessons/a-5-how-to-evaluate-a-model{,-en,-zh}.html`
- `lessons/a-6-generalization-and-overfitting{,-en,-zh}.html`

The source pages remain canonical migration evidence until acceptance is complete.


## First authoring batch — 2026-11-10

Created the first five target lessons in all three locales (15 canonical pages):
- 1.2.1 — data concepts, observations, dataset forms, provenance and sampling bias;
- 1.2.2 — entities, observation units, feature matrix X, target y, regression/classification and prediction-time availability;
- 1.2.4 — train/validation/test roles, random/stratified/group/time splits and preprocessing leakage;
- 1.2.5 — quality dimensions, missingness, imputation, outliers and quality-control practice;
- 1.2.6 — Pearson/Spearman interpretation, confounding, nonlinear relationships and leakage types.

All pages include localized learning outcomes, lesson sections, a practical task, references, a five-term glossary, three interactive checks, the standard post-source navigation panel and the DCH footer. The catalog v3 records now carry canonical RU/EN/ZH URLs, localized titles, outcomes and prerequisite links. Their status is deliberately `review` (not `published`). The production UI reads catalog v3 and filters by `published`, so these pages are not yet shown in public lesson lists or the planet map. The legacy A.3–A.6 pages remain untouched.

Automated catalog validation, the dedicated lesson tests, locale-structure checks, multilingual lesson validation, and GitHub Pages build/deployment passed on commit ce58b919a94e177cc6e846194f520515f49fd5d8. Manual desktop/mobile browser acceptance, keyboard and light/dark theme checks, and native-speaker editorial review remain open before publication.


## Template integration update — 2026-11-11

The 15 pages created for lessons 1.2.1, 1.2.2, 1.2.4, 1.2.5 and 1.2.6 have now been refactored to the exact outer page structure of canonical lesson 1.1.1. Shared styles are centralized in `styles/lesson-reference-111.css`; the pages no longer carry inline `<style>` blocks for the shell. Header, hero, planet banner, article width, sources, bottom navigation, glossary, self-check and footer now follow the reference. Repeated practice panels were removed where the same task was already described in the lecture section.

These pages remain `review` in catalog v3. No publication status was changed as part of this design integration.


## Template and shell integration update — 2026-11-11

A reusable starter has been added at `templates/lesson-page-template.html`, with the authoring guide at `docs/education/LESSON_AUTHORING_TEMPLATE.md`. The template links the shared styles and defines all structural slots. Both resources are linked from the admin Design System panel.

The same shell is now applied to all 27 existing Track A pages across RU / EN / 中文 (lessons 1.1.1–1.1.4 and the first five 1.2 lessons). The 1.1.2–1.1.4 content-specific CSS is centralized in `styles/lesson-content-components.css`; the shell itself remains in `styles/lesson-reference-111.css`. Source lecture text, glossary terms, practice checks and assessments are preserved.
