> **Статус: superseded 2026-11-11.** Этот первоначальный crosswalk был составлен по конфликтующей реконструкции 40 модулей из `ai-interpretability-course/docs/CURRICULUM_SPECIFICATION.md` и не должен использоваться как каноническая структура DCH. Каноническое решение — [DCH_CANONICAL_CURRICULUM_DECISION_2026-11-11.md](../management/DCH_CANONICAL_CURRICULUM_DECISION_2026-11-11.md). Фактические связи Theme/Module/Lesson UID — [data/curriculum-governance-2026-11-11.json](../../data/curriculum-governance-2026-11-11.json). Исторические заметки и AIS topic references ниже сохранены для traceability, но оценки покрытия не утверждены.

---

# Матрица соответствия AI Interpretability School → AI Research DCH School

**Дата:** 2026-11-11  
**Публичный сайт AIS:** https://ai-interpretability.school/  
**Репозиторий референсных материалов и спецификации DCH:** https://github.com/Dach1980/ai-interpretability-course  
**Первичный документ программы DCH:** [docs/CURRICULUM_SPECIFICATION.md](https://github.com/Dach1980/ai-interpretability-course/blob/main/docs/CURRICULUM_SPECIFICATION.md)

## 1. Важное уточнение источников

В репозитории `ai-interpretability-course` обнаружен полный документ `docs/CURRICULUM_SPECIFICATION.md`, в котором описана утверждённая 40-модульная программа DCH (модули 0–39), их содержание, prerequisites, результаты и практические задания. Следовательно, прежняя запись RM-02 о том, что первичный список 40 модулей не найден, устарела и должна быть исправлена.

Сайт AIS — отдельный внешний референс. Его программа не является программой DCH. Сопоставление выполняется по содержанию, prerequisites и учебным результатам, а не по совпадению номеров.

## 2. Что обнаружено на актуальном сайте AIS

На дату проверки публичная главная страница AIS описывает два направления:
- **Track A — XAI Practitioner:** интерпретируемые модели, причинность, heterogeneous effects, PDP/ICE/ALE, permutation importance, SHAP, LIME, Anchors, counterfactuals, feature interactions, CNN explanations, gradient methods, CAM, axiomatic and concept-based methods, attention, applied LLM analysis, agent behaviour, evaluation, perturbation, attacks, advanced SHAP/counterfactuals и self-check.
- **Track B — Math of LLMs:** введение в mechanistic interpretability, математические prerequisites, Transformer internals, features/circuits, representation geometry, probes/lenses, causal interventions, sparse autoencoders, safety, scientific rigor и developmental interpretability.

В текущем текстовом каталоге есть межтрековые/переходные темы: concept-based methods (13), internal representations (18), а также блоки 19–20; они размещены на странице рядом с разделом Track B. Поэтому мы не трактуем визуальную группировку и номера как неизменную таксономию и связываем темы с DCH только по содержанию.

**Ограничение аудита:** изучена публичная страница-каталог. Это не означает, что каждый полный урок, закрытый материал, notebook и лабораторная работа AIS были доступны и проверены. Такие позиции помечаются как «не проверено по полному материалу», а не как освоенные источники.

## 3. Результат crosswalk

В матрице сопоставлены все 40 модулей DCH с тематическими блоками AIS. Использованы три оценки:
- **Сильное** — содержательное ядро явно покрывается темами AIS.
- **Частичное** — есть пересечение, но DCH имеет собственную более широкую область, prerequisite или практику; либо каталог AIS не раскрывает достаточно подробностей.
- **Нет прямого аналога** — это фундаментальная/инфраструктурная часть DCH, не представленная на AIS как самостоятельный тематический модуль.

Это не рейтинг качества и не оценка полноты готовых уроков. Матрица — curriculum-level mapping, не lesson-level QA.

| DCH ID | Модуль DCH | AIS topic refs | Покрытие | Вывод / действие |
|---:|---|---|---|---|
| 0 | Введение в исследование интерпретируемости | AIS 00, 01 | Частичное | AIS 00/01 дают вводный контекст; DCH глубже разделяет исследовательские вопросы, уровни объяснений и MI. |
| 1 | Инструментарий исследователя | AIS 00 | Нет прямого аналога | Это инфраструктурный prerequisite DCH; AIS описывает требуемые навыки, но не заменяет отдельный модуль. |
| 2 | Python для научных вычислений | AIS 00 | Частичное | Нужно согласовать глубину Python с отдельной траекторией PY.1 и не дублировать её. |
| 3 | NumPy, pandas и визуализация данных | AIS 00 | Частичное | AIS использует эти инструменты как базу; DCH даёт самостоятельный фундамент. |
| 4 | Математика I: алгебра и функции | AIS 00, 27 | Частичное | AIS 27 существенно глубже и включает темы из нескольких DCH математических модулей. |
| 5 | Математика II: линейная алгебра | AIS 27, 28, 35, 36 | Сильное | Сверить полноту SVD, проекций, базисов и геометрии; AIS 35/36 — применение, не замена фундаменту. |
| 6 | Математика III: анализ и оптимизация | AIS 27, 28, 30, 34, 35 | Сильное | DCH явно вводит вычислительный аппарат; обеспечить мост к Jacobian-based методам и причинным вмешательствам. |
| 7 | Математика IV: вероятность и статистика | AIS 27, 03, 05 | Сильное | Сопоставить статистические prerequisites для causal ML, evaluation и неопределённости. |
| 8 | Основы машинного обучения | AIS 00, 02, 04, 06, 07 | Сильное | DCH должен явно обеспечить leakage, validation, calibration, metrics и baseline перед XAI. |
| 9 | Deep Learning и PyTorch | AIS 09–12, 26–28 | Сильное | Проверить практические prerequisites PyTorch до CNN/XAI и mechanistic interpretability. |
| 10 | Научный эксперимент и чтение статей | AIS 00, 17, 25, 32 | Частичное | DCH задаёт общий научный метод; связать его с отдельными протоколами faithfulness, sanity checks и replication. |
| 11 | Интерпретируемые модели машинного обучения | AIS 02, 04 | Сильное | Покрытие близкое; проверить границы intrinsic interpretability vs post-hoc. |
| 12 | Таксономия XAI и важность признаков | AIS 01, 07, 21 | Сильное | Уточнить conditional/marginal importance, correlated features и различие attribution/importance. |
| 13 | PDP, ICE, ALE и взаимодействия признаков | AIS 06, 08 | Сильное | Прямое содержательное соответствие; усилить объяснение extrapolation и correlated features. |
| 14 | Основы причинного мышления | AIS 03 | Сильное | Прямое соответствие; DCH отдельно удерживает causal identification от post-hoc feature attribution. |
| 15 | LIME и локальные суррогатные модели | AIS 07 | Сильное | DCH выделяет LIME в самостоятельный модуль, что повышает глубину по сравнению с обзорной подачей AIS. |
| 16 | SHAP и семейство Shapley-based методов | AIS 07, 23 | Сильное | AIS 23 — advanced deep dive; сопоставить вычислительную сложность, background и dependence. |
| 17 | Anchors, правила и контрфактические объяснения | AIS 07, 24 | Сильное | Нужно явно разделить model counterfactual и causal intervention; включить feasibility/reachability. |
| 18 | Продвинутые методы Causal ML | AIS 03, 05, 24 | Сильное | AIS 05 соответствует heterogeneous effects; DCH расширяет causal identification и sensitivity. |
| 19 | Оценка качества и надёжности XAI | AIS 17, 21, 22, 25, 32 | Сильное | Объединить метрики и научный протокол; attacks оставить отдельным advanced блоком, не смешивать с базовой оценкой. |
| 20 | Архитектура CNN и внутренние представления | AIS 09 | Сильное | DCH сначала учит архитектуру, затем объяснения; сохранить разделение. |
| 21 | Визуальная интерпретируемость CNN | AIS 09, 10, 11, 21 | Сильное | AIS разбивает на несколько блоков; DCH объединяет по визуальному объекту, но практики должны покрыть все методы. |
| 22 | Градиентные и propagation-based методы | AIS 10, 12 | Сильное | Проверить axioms, baseline, saturation, conservation и implementation invariance. |
| 23 | Concept-based explanations | AIS 13 | Сильное | Прямое соответствие; дополнить completeness, leakage и качеством concept datasets. |
| 24 | Embeddings и представления в NLP | AIS 15, 18, 35, 36 | Частичное | AIS разделяет applied LLM analysis, internal representations, geometry и probes; DCH должен удержать границу decoding vs causality. |
| 25 | Архитектура Transformer и математические основы | AIS 14, 26, 28 | Сильное | Покрыть forward pass и QK/OV как мост к MI; attention weights не объявлять объяснением. |
| 26 | Explainable AI для Transformer и LLM | AIS 14–17, 21, 26 | Частичное | Явно добавить агентные tool-use traces и prompt sensitivity; развести внешние XAI и mechanistic methods. |
| 27 | Введение в Mechanistic Interpretability | AIS 26 | Сильное | Прямое соответствие; добавить model organisms, проверяемые гипотезы и limits. |
| 28 | Внутреннее устройство и декомпозиция Transformer | AIS 28 | Сильное | Прямое соответствие; отделять полезные эвристические модели от универсальных законов. |
| 29 | Probes, lenses и анализ представлений | AIS 18, 29, 35, 36 | Сильное | Обеспечить selectivity/control tasks и разграничить декодируемость и причинное использование. |
| 30 | Причинные вмешательства в нейронные сети | AIS 34 | Сильное | Прямое соответствие; требуется протоколы corrupted/clean, controls и caveats причинных утверждений. |
| 31 | Circuit Discovery и алгоритмическая интерпретация | AIS 29 | Сильное | Сверить circuit completeness, faithfulness, redundancy и воспроизводимость case studies. |
| 32 | Features, superposition и dictionary learning | AIS 29, 30 | Сильное | DCH включает теоретический фундамент SAE; оценивать feature splitting/merging и dead latents. |
| 33 | Sparse Autoencoders и современные архитектуры | AIS 30 | Сильное | Прямое соответствие; сравнивать архитектуры на одинаковых активациях и проверять causal validity. |
| 34 | Activation Steering и редактирование знаний | AIS 31, 34 | Частичное | Нужно явно оценивать side effects, causal efficacy, robustness; не смешивать steering и knowledge editing. |
| 35 | Interpretability for AI Safety | AIS 31, 32 | Сильное | Сопоставить threat models и ограниченность интерпретируемости как safety guarantee. |
| 36 | Robustness, adversarial examples и атаки на объяснения | AIS 17, 22, 32 | Сильное | Прямое соответствие; сохранить отдельный red-team блок и проверять атаки на объяснения. |
| 37 | Developmental Interpretability и динамика обучения | AIS 33 | Сильное | Прямое соответствие; нужна практика сравнения checkpoint-ов. |
| 38 | Продвинутые методы и исследовательские фронтиры | AIS 18, 29, 35, 36 | Частичное | Публичный каталог AIS не даёт полного покрытия всех DCH frontier тем; для них нужны первичные статьи. |
| 39 | Итоговый исследовательский проект | AIS 25; Track B project/capstone elements | Частичное | AIS 25 — тест Track A, не эквивалент исследовательского проекта DCH; DCH capstone самостоятельный. |

## 4. Сводные выводы

- Модули DCH 0–10 — фундамент и научно-вычислительная база. AIS в основном рассматривает их как входные требования; самостоятельные модули DCH здесь оправданы.
- Модули DCH 11–19 имеют сильное тематическое соответствие классическому XAI и causal ML AIS. Разделение DCH на причинное мышление, advanced Causal ML, LIME, SHAP, counterfactuals и оценку качества даёт более явную последовательность prerequisites.
- Модули DCH 20–26 образуют переход от CNN/XAI к NLP и Transformer. Нужно особенно внимательно сохранить разницу между внешними attribution/attention объяснениями и внутренней mechanistic interpretability.
- Модули DCH 27–34 в целом соответствуют ядру AIS Math of LLMs: MI, Transformer decomposition, probes/lenses, causal interventions, circuits, features, SAEs и steering.
- Модули DCH 35–38 покрывают safety, robustness, developmental interpretability и frontier research. Не все темы можно проверить по одному каталогу AIS; нужны первичные публикации.
- Модуль 39 — самостоятельный исследовательский capstone DCH. Self-check AIS Track A не заменяет его.

## 5. Ключевые пробелы и решения, которые нужно принять

1. **Переход 26 → 27:** требуется диагностический вход в MI. Track B не должен требовать повторного прохождения всей Track A, если prerequisites подтверждены.
2. **Agent behaviour:** DCH 26 должен явно включить анализ tool-use traces, последовательности действий и объяснение выбора инструмента.
3. **Evaluation:** DCH 19 и 36 должны покрывать faithfulness, stability, robustness, sanity checks, ROAR/ROAD и explanation attacks; атаки не должны подменять базовую оценку.
4. **Causal separation:** DCH 14/18 должны оставаться отдельными от feature attribution; DCH 30 — отдельный уровень причинных вмешательств внутри нейросети.
5. **Representation/probing:** DCH 24/29 должны различать геометрическое/статистическое декодирование информации и доказательство причинного использования.
6. **SAE quality:** DCH 32/33 должны оценивать не только reconstruction loss и sparsity, но и feature quality, stability, splitting/merging, causal validation и downstream effects.
7. **Safety:** DCH 35 должен явно описывать threat models и пределы interpretability как гарантии безопасности.
8. **Frontier topics:** J-Lens/J++, Jacobian filtering, multimodal interpretability и model diffing в DCH 38 следует преподавать через первичные статьи и воспроизводимые case studies; не заявлять, что их полнота подтверждена страницей AIS.
9. **Track C:** не сопоставлять с AIS Track A/B как с основным источником. Для Building with AI нужен отдельный реестр первичных источников по runtimes, inference, RAG, MCP, security и evaluation.

## 6. Prerequisites и структура DCH

Полный список prerequisites по DCH сохранён в первичной спецификации. Матрица показывает прямые входы для каждого модуля. Важные сквозные цепочки:
- Математика 4–7 → ML 8 → DL/PyTorch 9 → XAI 11–19.
- CNN 20 → visual explanations 21–22.
- NLP representations 24 → Transformer 25 → LLM XAI 26.
- Transformer 25 + XAI 24–26 + math foundations → MI 27–34.
- Research methods 10 и evaluation 19 проходят сквозь все исследовательские модули.
- Capstone 39 допускает специализацию при подтверждении соответствующих prerequisites.

**Принцип:** нумерация не означает жёсткую блокировку доступа. Используется диагностический вход и подтверждение prerequisite-компетенций, как предусмотрено спецификацией.

## 7. Что уже сделано и что остаётся

### Сделано в рамках этого аудита
- Проверена актуальная публичная главная страница AIS.
- Зафиксированы темы Track A и Track B, включая переходные и дополнительные блоки.
- Найдена и проверена первичная спецификация DCH с полными модулями 0–39.
- Построена матрица соответствия всех 40 модулей DCH с темами AIS.
- Для каждой строки зафиксированы prerequisites, overlap и следующее методическое действие.
- Обновлён статус: полный curriculum-level crosswalk создан; это не означает утверждения каждого учебного материала.

### Осталось
- Проверить полный текст доступных уроков AIS, а не только публичный каталог, для тем, где нужна глубокая проверка.
- Сопоставить конкретные DCH lesson UID и существующие страницы с каждой строкой модулей 0–39.
- Проверить все lesson outcomes, labs, datasets, assessment и научные источники.
- Утвердить предлагаемые уточнения модулей 26, 35, 36 и 38.
- Составить отдельный Track C source map.
- Согласовать и исправить противоречия между старым RM-02 и текущей спецификацией DCH.

## 8. Первичные документы и ссылки

- AIS public website: https://ai-interpretability.school/
- AIS/research repository: https://github.com/Dach1980/ai-interpretability-course
- DCH curriculum specification: https://github.com/Dach1980/ai-interpretability-course/blob/main/docs/CURRICULUM_SPECIFICATION.md
- DCH Track C specification: https://github.com/Dach1980/ai-interpretability-course/blob/main/docs/TRACK_C_LLM_ENGINEERING.md
- DCH source integration policy: https://github.com/Dach1980/ai-research-dch-school/blob/main/docs/education/AIS_SOURCE_INTEGRATION_POLICY.md
- DCH RM-02: https://github.com/Dach1980/ai-research-dch-school/blob/main/docs/management/RM-02_CURRICULUM_AUDIT.md


## 9. Критическое противоречие внутри документов DCH — требует решения до публикации итоговой программы

Найдено расхождение между двумя документами, которые сейчас претендуют на роль рабочей архитектуры Track A:

- `docs/CURRICULUM_SPECIFICATION.md` из `ai-interpretability-course`: модули 11–19 посвящены interpretable ML, XAI, causal ML и evaluation; 20–26 — CNN, visual/gradient/concept methods, NLP, Transformer и LLM XAI.
- `docs/management/TRACK_A_ARCHITECTURE_PROPOSAL.md` в основном DCH repo: модуль 11 начинается с основ AI/ML; 12 — линейные модели; 13 — нелинейные модели; 14 — causality; 15 — heterogeneous effects; далее иная последовательность вплоть до 26.

Эти две последовательности нельзя одновременно считать каноническими. Crosswalk построен по полному документу `CURRICULUM_SPECIFICATION.md`, поскольку он содержит 40 полных модулей с outcomes и prerequisites. Однако его статус как единственного действующего источника должен быть явно подтверждён. До решения владельца программы crosswalk помечен **предварительным**, а DCH-03 остаётся в работе.

Также в самом `CURRICULUM_SPECIFICATION.md` обнаружены две редакции раздела 1.1 с несовпадающими формулировками границ Track B. Их следует объединить после выбора единой схемы.
