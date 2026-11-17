# DCH SCHOOL — CANONICAL CURRICULUM CROSSWALK 2026

**Дата:** 2026-11-17  
**Статус:** draft for architecture approval; catalog migration not performed  
**Источник текущих UID:** catalog-v3.json SHA `0e9f634ea185c062bdf23017414825c28e6b05ec`  
**Источник исходного распределения:** THREE_TRACK_CURRICULUM_ARCHITECTURE_2026.md SHA `ff8ccb299a77288385d545f0a276c580adbb0e97`  
**Связанный proposal:** [DCH School Macro Architecture 2026 — Final Proposal](DCH_SCHOOL_MACRO_ARCHITECTURE_2026_FINAL_PROPOSAL.md)

## 1. Назначение и правила

Документ связывает исторические macro IDs 00–39, canonical Track C modules C0–C12, PY.1 и все существующие 167 Lesson UID с целевой моделью Foundation + Track A/B/C.

- Каждый из 167 Lesson UID имеет ровно один proposed primary owner.
- Macro ID может иметь split/many-to-many mapping; это не создаёт второй primary owner у урока.
- Mandatory/elective — proposed route classification, независимая от catalog status (`published/planned`) и `content_state`.
- `gap` означает отсутствие урока, который можно честно зачесть в требуемые outcomes; близкая тема не считается покрытием.
- Все старые UID, коды и RU/EN/ZH URL сохранены в CSV inventory как read-only references.
- Этот crosswalk не меняет catalog, sequence, governance, lesson pages или production.

## 2. Сводка 167 UID после предлагаемых решений

| Primary owner | UID records | Mandatory | Elective | Изменение относительно текущего распределения |
|---|---:|---:|---:|---|
| Foundation | 49 | 20 | 29 | без изменения |
| Track A | 84 | 44 | 40 | +8 из прежнего B и +1 из прежнего C |
| Track B | 0 | 0 | 0 | 8 прежних B bridge UID переданы в A electives; полноценный B syllabus отсутствует |
| Track C | 34 | 31 | 3 | 5.7.5 передан в A; остальные C ownership сохранены |
| **Всего** | **167** | **95** | **72** |  |

**Ключевой результат:** все 167 UID имеют одного primary owner. Track B остаётся curriculum gap, а не искусственно наполненным каталогом. Целевой объём Track C около 35 mandatory не подтверждён: текущие 31 mandatory UID относятся к prerequisites/bridge и не заменяют C0–C12.

## 3. Legacy macro crosswalk: DCH 00–39

В столбце Lesson UID перечислены записи, тематически связанные с macro ID. Для macro 27–39 отсутствие UID фиксируется как gap. Указание UID в строке macro не меняет его единственного primary owner в разделе 5 и CSV.

| Macro ID | Legacy title | Target owner | Target theme | Mapping status | Related Lesson UID |
|---:|---|---|---|---|---|
| 00 | Введение в исследование интерпретируемости | Foundation | F1 / A1 | partial_or_split | les-a-0147; les-a-0148 |
| 01 | Инструментарий исследователя | Foundation | C4 / Foundation | partial_or_split | les-a-0058; les-a-0059; les-a-0060; les-a-0061; les-a-0062 |
| 02 | Python для научных вычислений | Foundation + C | C4 | partial_or_split | les-a-0063; les-a-0064; les-a-0065; les-a-0066; les-a-0067; les-a-0068 |
| 03 | NumPy, pandas и визуализация данных | Foundation + C | C2 | partial_or_split | les-a-0069; les-a-0070; les-a-0071; les-a-0072; les-a-0073; les-a-0074 |
| 04 | Математика I: алгебра и функции | Foundation | F5 | partial_or_split | les-a-0075; les-a-0076; les-a-0077; les-a-0078 |
| 05 | Математика II: линейная алгебра | Foundation | F5 | partial_or_split | les-a-0079; les-a-0080; les-a-0081; les-a-0082; les-a-0083 |
| 06 | Математика III: анализ и оптимизация | Foundation | F5 | partial_or_split | les-a-0090; les-a-0091; les-a-0092; les-a-0093; les-a-0094 |
| 07 | Математика IV: вероятность и статистика | Foundation | F5 | partial_or_split | les-a-0084; les-a-0085; les-a-0086; les-a-0087; les-a-0088; les-a-0089 |
| 08 | Основы машинного обучения | Foundation + C | F1 / C2 | partial_or_split | les-a-0001; les-a-0051; les-a-0002; les-a-0052; les-a-0003; les-a-0004; les-a-0056; les-a-0050; les-a-0005; les-a-0006; les-a-0007; les-a-0008; les-a-0053; les-a-0054; les-a-0055; les-a-0009; les-a-0010; les-a-0011; les-a-0012; les-a-0013; les-a-0014; les-a-0043; les-a-0044; les-a-0045; les-a-0046; les-a-0047; les-a-0015; les-a-0048; les-a-0057; les-a-0100; les-a-0101; les-a-0102; les-a-0103; les-a-0104; les-a-0049 |
| 09 | Deep Learning и PyTorch | Foundation + C | C2 | partial_or_split | les-a-0105; les-a-0106; les-a-0107; les-a-0108; les-a-0109; les-a-0110; les-a-0111; les-a-0112 |
| 10 | Научный эксперимент и чтение статей | Foundation | Foundation / A5 | partial_or_split | les-a-0095; les-a-0096; les-a-0097; les-a-0098; les-a-0099 |
| 11 | Основы AI и машинного обучения | Track A | Foundation / A1 bridge | mapped_with_scope_change | les-a-0001; les-a-0051; les-a-0002; les-a-0052; les-a-0003; les-a-0004; les-a-0056; les-a-0050; les-a-0005; les-a-0006; les-a-0007; les-a-0008; les-a-0053; les-a-0054; les-a-0055; les-a-0009; les-a-0010; les-a-0011; les-a-0012; les-a-0013; les-a-0014; les-a-0043; les-a-0044; les-a-0045; les-a-0046; les-a-0047; les-a-0015; les-a-0048; les-a-0057 |
| 12 | Линейные интерпретируемые модели | Track A | A1 | mapped_with_scope_change | les-a-0016; les-a-0017; les-a-0113; les-a-0114; les-a-0147; les-a-0148; les-a-0149 |
| 13 | Нелинейные интерпретируемые модели | Track A | A1 | mapped_with_scope_change | les-a-0016; les-a-0017; les-a-0113; les-a-0114; les-a-0147; les-a-0148; les-a-0149 |
| 14 | Каузальность и причинная интерпретация | Track A | A4 | mapped_with_scope_change | les-a-0115; les-a-0116; les-a-0117; les-a-0118; les-a-0119 |
| 15 | Гетерогенные эффекты | Track A | A4 | mapped_with_scope_change | les-a-0120; les-a-0121; les-a-0122; les-a-0123; les-a-0124 |
| 16 | Глобальное и локальное поведение модели: PDP, ICE, ALE | Track A | A2 | mapped_with_scope_change | les-a-0024; les-a-0025; les-a-0026; les-a-0027; les-a-0028 |
| 17 | Классические методы объяснения моделей | Track A | A2 / A3 / A4 | mapped_with_scope_change | les-a-0018; les-a-0019; les-a-0020; les-a-0021; les-a-0022; les-a-0023; les-a-0029; les-a-0030; les-a-0031; les-a-0032; les-a-0033; les-a-0034; les-a-0035; les-a-0036; les-a-0037; les-a-0038; les-a-0039; les-a-0040; les-a-0041; les-a-0042; les-a-0150 |
| 18 | Взаимодействия признаков | Track A | A2 | mapped_with_scope_change | les-a-0027 |
| 19 | Анализ CNN-based моделей | Track A | A5; B boundary | split_or_elective_mapping | les-a-0125 |
| 20 | Градиентные эвристики объяснения | Track A | A5; B boundary | split_or_elective_mapping | les-a-0126; les-a-0127 |
| 21 | Объяснения на основе локализации и CAM | Track A | A5; B boundary | split_or_elective_mapping | les-a-0128; les-a-0129 |
| 22 | Concept-based методы | Track A | A5; B boundary | split_or_elective_mapping | les-a-0130; les-a-0131; les-a-0132 |
| 23 | Attention-based explainability | Track A | A5 / C2; B gap | split_or_elective_mapping | les-a-0133; les-a-0134 |
| 24 | Applied LLM analysis | Track A | A5; B boundary | split_or_elective_mapping | les-a-0135; les-a-0136; les-a-0137 |
| 25 | Объяснение поведения AI-агентов | Track A | C4; A gap | split_or_elective_mapping | les-a-0138; les-a-0139 |
| 26 | Оценка качества объяснений и научная проверка | Track A | A4 / A5 | split_or_elective_mapping | les-a-0140; les-a-0141; les-a-0142; les-a-0143; les-a-0144; les-a-0145; les-a-0146; les-a-0151; les-a-0152; les-a-0153; les-a-0154; les-a-0155; les-a-0156; les-a-0157; les-a-0158; les-a-0159; les-a-0160; les-a-0161; les-a-0162; les-a-0163; les-a-0164; les-a-0165; les-a-0166; les-a-0167 |
| 27 | Введение в Mechanistic Interpretability | Track B | B1 | curriculum_gap_no_B_lesson_uid | — |
| 28 | Внутреннее устройство и декомпозиция Transformer | Track B | B1 | curriculum_gap_no_B_lesson_uid | — |
| 29 | Probes, lenses и анализ представлений | Track B | B3 | curriculum_gap_no_B_lesson_uid | — |
| 30 | Причинные вмешательства в нейронные сети | Track B | B4 | curriculum_gap_no_B_lesson_uid | — |
| 31 | Circuit Discovery и алгоритмическая интерпретация | Track B | B4 | curriculum_gap_no_B_lesson_uid | — |
| 32 | Features, superposition и dictionary learning | Track B | B2 | curriculum_gap_no_B_lesson_uid | — |
| 33 | Sparse Autoencoders и современные архитектуры | Track B | B5 | curriculum_gap_no_B_lesson_uid | — |
| 34 | Activation Steering и редактирование знаний | Track B | B5 | curriculum_gap_no_B_lesson_uid | — |
| 35 | Interpretability for AI Safety | Track B | B5 | curriculum_gap_no_B_lesson_uid | — |
| 36 | Robustness, adversarial examples и атаки на объяснения | Track B | B5 | curriculum_gap_no_B_lesson_uid | — |
| 37 | Developmental Interpretability и динамика обучения | Track B | B5 | curriculum_gap_no_B_lesson_uid | — |
| 38 | Продвинутые методы и исследовательские фронтиры | Track B | B5 | curriculum_gap_no_B_lesson_uid | — |
| 39 | Итоговый исследовательский проект | Track B | B5 | curriculum_gap_no_B_lesson_uid | — |

### Интерпретация macro mapping

- **00:** разделён на общий AI Research orientation (Foundation gap/partial) и XAI entry bridge (A1); не весь macro 00 становится Foundation.
- **01–03:** базовые research tooling/Python/data skills могут быть общими prerequisites, но конкретные existing UIDs закреплены за инженерными темами C; не дублировать UID в Foundation.
- **04–07:** Foundation mathematical literacy; текущие уроки 2.4–2.7 — elective, кроме 4 выбранных стартовых математических уроков в Foundation mandatory list.
- **08–09:** концептуальная AI/ML literacy — Foundation; практические модели и DL prerequisites — C2.
- **10:** базовая research literacy — Foundation competency; более полные experimental methods 2.8.* остаются A5 elective.
- **11:** общая AI/ML вводная часть переходит в Foundation; A сохраняет короткий XAI entry bridge.
- **14:** причинность не удаляется из ядра полностью: 4.4.1–4.4.2 proposed mandatory; 4.4.3–4.4.5 electives.
- **15 и 18:** heterogeneous effects и feature interactions — electives.
- **19–21:** visual XAI UIDs имеют primary owner A electives, не B.
- **22:** TCAV/concept attribution — A elective; mechanistic feature discovery остаётся B gap.
- **23:** attention implementation — C; attention-map interpretation — A; causal attention circuits — B gap.
- **25:** agent tool traces/observability — C; explainability of agent behaviour — A gap/elective proposal.
- **26:** explanation evaluation распределена по A4/A5; intervention testing, attacks и capstone не подменяют метрики качества.
- **27–39:** пять B themes — целевые кластеры; обязательных B lesson UID пока нет.

## 4. Track C canonical modules C0–C12

| Module | Canonical title | New theme | Status | Coverage and gap assessment |
|---|---|---|---|---|
| C0 | Local AI | C1 | gap | Нет UID, подтверждающего отдельные outcomes по local/cloud boundary, privacy, provenance и licensing. |
| C1 | Hardware | C1 | gap | Нет отдельного hardware/VRAM budgeting lesson UID. |
| C2 | Model formats | C2 | partial_prerequisite | 2.3.* и 3.1.* / 3.2.* дают data/ML/DL prerequisites, но не закрывают GGUF, quantization, tokenizer, model cards и provenance. |
| C3 | LM Studio | C2 | gap | Нет lesson UID по LM Studio lifecycle, local server, model load/unload и configuration. |
| C4 | Generation | C3 | gap | Нет lesson UID по generation settings, prompt templates, structured output и controlled generation. |
| C5 | API | C3 | gap | Нет lesson UID по REST API, streaming, retries, timeouts и SDK integration. |
| C6 | Python | C4 | partial_to_exact | 2.2.1–2.2.6 являются базовым Python mapping; advanced packaging, async, tests and secrets требуют отдельной проверки. |
| C7 | MCP basics | C4 | gap | Нет lesson UID по MCP host/client/server, protocol lifecycle и capability negotiation. |
| C8 | MCP servers | C4 | gap | Нет lesson UID по server implementation, permissions, validation and isolation. |
| C9 | MCP Web Search | C4 | gap | Нет lesson UID по search/extract/citation workflow и untrusted web content. |
| C10 | RAG | C5 | gap | Нет lesson UID по ingestion, chunking, retrieval, reranking, ACL и evaluation. |
| C11 | Diagnostics/security | C5 | partial_prerequisite | 2.1.5 воспроизводимость и 5.8.5 agent errors — только prerequisites/adjacent content, не security/observability syllabus. |
| C12 | Capstone | C5 | gap | Нет отдельного C capstone UID и reproducibility/security acceptance rubric. |

C0–C12 группируются в пять тем: C1 Local AI/hardware; C2 model formats/local inference; C3 generation/API; C4 Python/MCP; C5 RAG/operations/capstone. Существующие UID 2.x/3.x являются prerequisites и bridge lessons, а не заменой полноценного C0–C12 syllabus.

## 5. Полный реестр Lesson UID

CSV-файл `CANONICAL_LESSON_OWNER_CROSSWALK_2026.csv` содержит те же 167 строк с полями: UID, legacy code, RU title, primary owner, target theme/module, mandatory/elective, catalog status/content state, macro refs, relationship, migration action, current catalog links and RU/EN/ZH URLs.

| UID | Legacy code | Title | Primary owner | Theme / target module | Route | Current status | Macro refs | Migration note |
|---|---|---|---|---|---|---|---|---|
| les-a-0001 | 1.1.1 | Что такое искусственный интеллект | Foundation | F1 / AI/ML literacy | mandatory | published; published | 08,11 | retain_owner |
| les-a-0051 | 1.1.2 | История развития искусственного интеллекта | Foundation | F1 / AI/ML literacy | elective | published; published | 08,11 | retain_owner |
| les-a-0002 | 1.1.3 | AI, Machine Learning и Deep Learning | Foundation | F1 / AI/ML literacy | mandatory | published; published | 08,11 | retain_owner |
| les-a-0052 | 1.1.4 | Символический AI и машинное обучение | Foundation | F1 / AI/ML literacy | elective | published; published | 08,11 | retain_owner |
| les-a-0003 | 1.2.1 | Что такое данные в машинном обучении | Foundation | F2 / Data and task framing | mandatory | published; published | 08,11 | retain_owner |
| les-a-0004 | 1.2.2 | Объекты, признаки и целевые переменные | Foundation | F2 / Data and task framing | mandatory | published; published | 08,11 | retain_owner |
| les-a-0056 | 1.2.3 | Типы данных и представление признаков | Foundation | F2 / Data and task framing | mandatory | published; published | 08,11 | retain_owner |
| les-a-0050 | 1.2.4 | Обучающие, проверочные и тестовые данные | Foundation | F2 / Data and task framing | mandatory | published; published | 08,11 | retain_owner |
| les-a-0005 | 1.2.5 | Качество данных, пропуски и выбросы | Foundation | F2 / Data and task framing | elective | published; published | 08,11 | retain_owner |
| les-a-0006 | 1.2.6 | Корреляция, зависимости и утечка данных | Foundation | F2 / Data and task framing | elective | published; published | 08,11 | retain_owner |
| les-a-0007 | 1.3.1 | Обучение с учителем — Supervised Learning | Foundation | F1 / AI/ML literacy | mandatory | published; published | 08,11 | retain_owner |
| les-a-0008 | 1.3.2 | Обучение без учителя — Unsupervised Learning | Foundation | F1 / AI/ML literacy | mandatory | published; published | 08,11 | retain_owner |
| les-a-0053 | 1.3.3 | Обучение с подкреплением — Reinforcement Learning | Foundation | F1 / AI/ML literacy | elective | published; published | 08,11 | retain_owner |
| les-a-0054 | 1.3.4 | Классификация и регрессия | Foundation | F1 / AI/ML literacy | mandatory | published; published | 08,11 | retain_owner |
| les-a-0055 | 1.3.5 | Кластеризация и снижение размерности | Foundation | F1 / AI/ML literacy | elective | published; published | 08,11 | retain_owner |
| les-a-0009 | 1.3.6 | Генеративные модели и другие современные подходы | Foundation | F1 / AI/ML literacy | elective | published; published | 08,11 | retain_owner |
| les-a-0010 | 1.4.1 | Понятие модели и параметров | Foundation | F3 / Model and training | mandatory | published; published | 08,11 | retain_owner |
| les-a-0011 | 1.4.2 | Обучение модели и функция потерь | Foundation | F3 / Model and training | mandatory | published; published | 08,11 | retain_owner |
| les-a-0012 | 1.4.3 | Переобучение и недообучение | Foundation | F3 / Model and training | mandatory | published; published | 08,11 | retain_owner |
| les-a-0013 | 1.4.4 | Обобщающая способность модели | Foundation | F3 / Model and training | elective | published; published | 08,11 | retain_owner |
| les-a-0014 | 1.4.5 | Гиперпараметры и настройка модели | Foundation | F3 / Model and training | elective | published; published | 08,11 | retain_owner |
| les-a-0043 | 1.5.1 | Зачем оценивать качество модели | Foundation | F4 / Model evaluation | mandatory | published; published | 08,11 | retain_owner |
| les-a-0044 | 1.5.2 | Матрица ошибок классификации | Foundation | F4 / Model evaluation | mandatory | published; published | 08,11 | retain_owner |
| les-a-0045 | 1.5.3 | Accuracy, Precision, Recall и F1 | Foundation | F4 / Model evaluation | mandatory | published; published | 08,11 | retain_owner |
| les-a-0046 | 1.5.4 | ROC-AUC и Precision-Recall AUC | Foundation | F4 / Model evaluation | elective | published; published | 08,11 | retain_owner |
| les-a-0047 | 1.5.5 | Дисбаланс классов | Foundation | F4 / Model evaluation | elective | published; published | 08,11 | retain_owner |
| les-a-0015 | 1.5.6 | Кросс-валидация и устойчивость результатов | Foundation | F4 / Model evaluation | mandatory | published; published | 08,11 | retain_owner |
| les-a-0048 | 1.5.7 | Метрики регрессии: MAE, MSE, RMSE и R² | Foundation | F4 / Model evaluation | elective | published; published | 08,11 | retain_owner |
| les-a-0057 | 1.5.8 | Калибровка вероятностей и качество вероятностных прогнозов | Foundation | F4 / Model evaluation | elective | published; published | 08,11 | retain_owner |
| les-a-0058 | 2.1.1 | Инструменты исследователя AI | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 01 | retain_owner |
| les-a-0059 | 2.1.2 | Python, виртуальные окружения и пакеты | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 01 | retain_owner |
| les-a-0060 | 2.1.3 | Jupyter Notebook и интерактивные эксперименты | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 01 | retain_owner |
| les-a-0061 | 2.1.4 | Организация исследовательского проекта | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 01 | retain_owner |
| les-a-0062 | 2.1.5 | Воспроизводимость экспериментов | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 01 | retain_owner |
| les-a-0063 | 2.2.1 | Переменные, типы данных и операторы | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 02 | retain_owner |
| les-a-0064 | 2.2.2 | Условия и циклы | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 02 | retain_owner |
| les-a-0065 | 2.2.3 | Функции и области видимости | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 02 | retain_owner |
| les-a-0066 | 2.2.4 | Списки, словари и множества | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 02 | retain_owner |
| les-a-0067 | 2.2.5 | Классы и объектно-ориентированное программирование | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 02 | retain_owner |
| les-a-0068 | 2.2.6 | Работа с библиотеками и исключениями | Track C | C4 / Python and integration tooling | mandatory | planned; outline_only | 02 | retain_owner |
| les-a-0069 | 2.3.1 | Массивы NumPy | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 03 | retain_owner |
| les-a-0070 | 2.3.2 | Векторизация и операции над массивами | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 03 | retain_owner |
| les-a-0071 | 2.3.3 | Таблицы pandas | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 03 | retain_owner |
| les-a-0072 | 2.3.4 | Очистка и преобразование данных | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 03 | retain_owner |
| les-a-0073 | 2.3.5 | Визуализация данных | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 03 | retain_owner |
| les-a-0074 | 2.3.6 | Исследовательский анализ данных (EDA) | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 03 | retain_owner |
| les-a-0075 | 2.4.1 | Переменные, выражения и функции | Foundation | F5 / Mathematical literacy | mandatory | planned; outline_only | 04 | retain_owner |
| les-a-0076 | 2.4.2 | Линейные и нелинейные функции | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 04 | retain_owner |
| les-a-0077 | 2.4.3 | Экспоненты и логарифмы | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 04 | retain_owner |
| les-a-0078 | 2.4.4 | Графики и преобразования функций | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 04 | retain_owner |
| les-a-0079 | 2.5.1 | Векторы и векторные пространства | Foundation | F5 / Mathematical literacy | mandatory | planned; outline_only | 05 | retain_owner |
| les-a-0080 | 2.5.2 | Матрицы и матричные операции | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 05 | retain_owner |
| les-a-0081 | 2.5.3 | Скалярное произведение | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 05 | retain_owner |
| les-a-0082 | 2.5.4 | Линейные преобразования | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 05 | retain_owner |
| les-a-0083 | 2.5.5 | Собственные значения и собственные векторы | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 05 | retain_owner |
| les-a-0084 | 2.6.1 | Основы теории вероятностей | Foundation | F5 / Mathematical literacy | mandatory | planned; outline_only | 07 | retain_owner |
| les-a-0085 | 2.6.2 | Случайные величины и распределения | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 07 | retain_owner |
| les-a-0086 | 2.6.3 | Математическое ожидание и дисперсия | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 07 | retain_owner |
| les-a-0087 | 2.6.4 | Условная вероятность и теорема Байеса | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 07 | retain_owner |
| les-a-0088 | 2.6.5 | Статистические оценки и доверительные интервалы | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 07 | retain_owner |
| les-a-0089 | 2.6.6 | Статистическая значимость и проверка гипотез | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 07 | retain_owner |
| les-a-0090 | 2.7.1 | Пределы и производные | Foundation | F5 / Mathematical literacy | mandatory | planned; outline_only | 06 | retain_owner |
| les-a-0091 | 2.7.2 | Частные производные | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 06 | retain_owner |
| les-a-0092 | 2.7.3 | Градиент и направление изменения функции | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 06 | retain_owner |
| les-a-0093 | 2.7.4 | Градиентный спуск | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 06 | retain_owner |
| les-a-0094 | 2.7.5 | Оптимизация функции потерь | Foundation | F5 / Mathematical literacy | elective | planned; outline_only | 06 | retain_owner |
| les-a-0095 | 2.8.1 | Научный вопрос и исследовательская гипотеза | Track A | A5 / Research methods bridge | elective | planned; outline_only | 10 | retain_owner |
| les-a-0096 | 2.8.2 | Планирование эксперимента | Track A | A5 / Research methods bridge | elective | planned; outline_only | 10 | retain_owner |
| les-a-0097 | 2.8.3 | Контрольные группы и базовые модели | Track A | A5 / Research methods bridge | elective | planned; outline_only | 10 | retain_owner |
| les-a-0098 | 2.8.4 | Повторяемость и статистическая устойчивость | Track A | A5 / Research methods bridge | elective | planned; outline_only | 10 | retain_owner |
| les-a-0099 | 2.8.5 | Интерпретация и представление результатов | Track A | A5 / Research methods bridge | elective | planned; outline_only | 10 | retain_owner |
| les-a-0100 | 3.1.1 | Линейная регрессия | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 08 | retain_owner |
| les-a-0101 | 3.1.2 | Логистическая регрессия | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 08 | retain_owner |
| les-a-0102 | 3.1.3 | Деревья решений | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 08 | retain_owner |
| les-a-0103 | 3.1.4 | Метод ближайших соседей и метод опорных векторов | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 08 | retain_owner |
| les-a-0104 | 3.1.5 | Ансамбли: случайный лес и градиентный бустинг | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 08 | retain_owner |
| les-a-0049 | 3.1.6 | Сравнение моделей и базовые алгоритмы | Track C | C2 / Models and local inference prerequisites | mandatory | planned; outline_only | 08 | retain_owner |
| les-a-0105 | 3.2.1 | Искусственный нейрон | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0106 | 3.2.2 | Перцептрон и многослойная нейронная сеть | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0107 | 3.2.3 | Функции активации | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0108 | 3.2.4 | Прямое распространение сигнала | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0109 | 3.2.5 | Функция потерь и обратное распространение ошибки | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0110 | 3.2.6 | Обучение нейронной сети в PyTorch | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0111 | 3.2.7 | Регуляризация и стабилизация обучения | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0112 | 3.2.8 | Основы архитектуры Transformer и механизм внимания | Track C | C2 / Deep learning and model foundations | mandatory | planned; outline_only | 09 | retain_owner |
| les-a-0016 | 4.1.3 | Линейные модели как объяснимые модели | Track A | A1 / Interpretability and transparent models | mandatory | planned; outline_only | 12,13 | retain_owner |
| les-a-0017 | 4.1.4 | Интерпретация деревьев решений | Track A | A1 / Interpretability and transparent models | mandatory | planned; outline_only | 12,13 | retain_owner |
| les-a-0113 | 4.1.6 | Нелинейные модели с интерпретируемой структурой | Track A | A1 / Interpretability and transparent models | elective | planned; outline_only | 12,13 | retain_owner |
| les-a-0114 | 4.1.7 | GAM и EBM: интерпретируемые модели с нелинейными зависимостями | Track A | A1 / Interpretability and transparent models | elective | planned; outline_only | 12,13 | retain_owner |
| les-a-0018 | 4.2.1 | Что такое XAI и зачем нужно объяснять модели? | Track A | A2 / XAI taxonomy and feature importance | mandatory | published; published | 17 | retain_owner |
| les-a-0019 | 4.2.2 | Локальные и глобальные объяснения | Track A | A2 / XAI taxonomy and feature importance | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0020 | 4.2.3 | Intrinsic и Post-hoc методы | Track A | A2 / XAI taxonomy and feature importance | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0021 | 4.2.4 | Feature Importance | Track A | A2 / XAI taxonomy and feature importance | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0022 | 4.2.5 | Permutation Feature Importance | Track A | A2 / XAI taxonomy and feature importance | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0023 | 4.2.6 | Faithfulness и ограничения объяснений | Track A | A2 / XAI taxonomy and feature importance | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0024 | 4.3.1 | Partial Dependence Plot | Track A | A2 / PDP, ICE and ALE | mandatory | planned; outline_only | 16 | retain_owner |
| les-a-0025 | 4.3.2 | Individual Conditional Expectation | Track A | A2 / PDP, ICE and ALE | mandatory | planned; outline_only | 16 | retain_owner |
| les-a-0026 | 4.3.3 | Accumulated Local Effects | Track A | A2 / PDP, ICE and ALE | mandatory | planned; outline_only | 16 | retain_owner |
| les-a-0027 | 4.3.4 | Взаимодействия признаков | Track A | A2 / PDP, ICE and ALE | elective | planned; outline_only | 16,18 | retain_owner |
| les-a-0028 | 4.3.5 | Сравнение PDP, ICE и ALE | Track A | A2 / PDP, ICE and ALE | elective | planned; outline_only | 16 | mandatory_elective_reclassification |
| les-a-0115 | 4.4.1 | Корреляция и причинность | Track A | A4 / Causal reasoning | mandatory | planned; outline_only | 14 | mandatory_elective_reclassification |
| les-a-0116 | 4.4.2 | Причинные графы | Track A | A4 / Causal reasoning | mandatory | planned; outline_only | 14 | mandatory_elective_reclassification |
| les-a-0117 | 4.4.3 | Confounding и скрытые переменные | Track A | A4 / Causal reasoning | elective | planned; outline_only | 14 | retain_owner |
| les-a-0118 | 4.4.4 | Интервенции и контрфактическое мышление | Track A | A4 / Causal reasoning | elective | planned; outline_only | 14 | retain_owner |
| les-a-0119 | 4.4.5 | Причинные объяснения и ограничения XAI | Track A | A4 / Causal reasoning | elective | planned; outline_only | 14 | retain_owner |
| les-a-0029 | 4.5.1 | Идея локального объяснения | Track A | A3 / LIME and local surrogates | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0030 | 4.5.2 | Local Surrogate Models | Track A | A3 / LIME and local surrogates | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0031 | 4.5.3 | Как работает LIME | Track A | A3 / LIME and local surrogates | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0032 | 4.5.4 | Выбор окрестности и интерпретация результатов | Track A | A3 / LIME and local surrogates | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0033 | 4.5.5 | Ограничения и устойчивость LIME | Track A | A3 / LIME and local surrogates | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0034 | 4.6.1 | Теория игр и Shapley Values | Track A | A3 / SHAP | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0035 | 4.6.2 | Как работает SHAP | Track A | A3 / SHAP | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0036 | 4.6.3 | Локальные объяснения SHAP | Track A | A3 / SHAP | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0037 | 4.6.4 | Глобальная важность признаков | Track A | A3 / SHAP | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0038 | 4.6.5 | Summary Plot, Dependence Plot и Waterfall Plot | Track A | A3 / SHAP | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0039 | 4.6.6 | Ограничения и предположения SHAP | Track A | A3 / SHAP | elective | planned; outline_only | 17 | mandatory_elective_reclassification |
| les-a-0040 | 4.7.2 | Anchors | Track A | A4 / Rules and counterfactuals | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0041 | 4.7.3 | Контрфактические объяснения | Track A | A4 / Rules and counterfactuals | mandatory | planned; outline_only | 17 | retain_owner |
| les-a-0042 | 4.7.4 | Реализуемость и правдоподобие контрфактов | Track A | A4 / Rules and counterfactuals | elective | planned; outline_only | 17 | mandatory_elective_reclassification |
| les-a-0120 | 4.8.1 | Что такое неоднородность причинного эффекта | Track A | A4 / Heterogeneous effects specialization | elective | planned; outline_only | 15 | retain_owner |
| les-a-0121 | 4.8.2 | ATE и CATE: средний и условный причинный эффект | Track A | A4 / Heterogeneous effects specialization | elective | planned; outline_only | 15 | retain_owner |
| les-a-0122 | 4.8.3 | Групповые и индивидуальные различия эффектов | Track A | A4 / Heterogeneous effects specialization | elective | planned; outline_only | 15 | retain_owner |
| les-a-0123 | 4.8.4 | Meta-learners и методы оценки гетерогенных эффектов | Track A | A4 / Heterogeneous effects specialization | elective | planned; outline_only | 15 | retain_owner |
| les-a-0124 | 4.8.5 | Проверка устойчивости, переобучения и ложных подгрупп | Track A | A4 / Heterogeneous effects specialization | elective | planned; outline_only | 15 | retain_owner |
| les-a-0125 | 5.6.1 | CNN как объект исследования: слои, feature maps и receptive fields | Track A | A5 / Visual XAI specialization | elective | planned; outline_only | 19 | owner_transfer_to_A |
| les-a-0126 | 5.6.2 | Градиентные карты чувствительности и saliency maps | Track A | A5 / Visual XAI specialization | elective | planned; outline_only | 20 | owner_transfer_to_A |
| les-a-0127 | 5.6.3 | Integrated Gradients и SmoothGrad | Track A | A5 / Visual XAI specialization | elective | planned; outline_only | 20 | owner_transfer_to_A |
| les-a-0128 | 5.6.4 | CAM и Grad-CAM | Track A | A5 / Visual XAI specialization | elective | planned; outline_only | 21 | owner_transfer_to_A |
| les-a-0129 | 5.6.5 | Проверка качества визуальных карт объяснения | Track A | A5 / Visual XAI specialization | elective | planned; outline_only | 21 | owner_transfer_to_A |
| les-a-0130 | 5.7.1 | Понятие концепта в нейросети | Track A | A5 / Concept and attention explainability | elective | planned; outline_only | 22 | owner_transfer_to_A |
| les-a-0131 | 5.7.2 | Concept Activation Vectors и TCAV | Track A | A5 / Concept and attention explainability | elective | planned; outline_only | 22 | owner_transfer_to_A |
| les-a-0132 | 5.7.3 | Наборы концептов, coverage и ограничения разметки | Track A | A5 / Concept and attention explainability | elective | planned; outline_only | 22 | owner_transfer_to_A |
| les-a-0133 | 5.7.4 | Attention-механизм в Transformer | Track C | C2 / Transformer and attention implementation | elective | planned; outline_only | 23 | retain_owner_bridge |
| les-a-0134 | 5.7.5 | Attention maps и ограничения их интерпретации | Track A | A5 / Concept and attention explainability | elective | planned; outline_only | 23 | owner_transfer_to_A |
| les-a-0135 | 5.8.1 | Экспериментальный анализ поведения LLM | Track A | A5 / LLM behavior analysis | elective | planned; outline_only | 24 | retain_owner |
| les-a-0136 | 5.8.2 | Влияние промпта, контекста и параметров генерации | Track A | A5 / LLM behavior analysis | elective | planned; outline_only | 24 | retain_owner |
| les-a-0137 | 5.8.3 | Сравнение ответов и диагностические эксперименты | Track A | A5 / LLM behavior analysis | elective | planned; outline_only | 24 | retain_owner |
| les-a-0138 | 5.8.4 | Анализ траекторий действий AI-агента | Track C | C4 / Agent tool traces and observability | elective | planned; outline_only | 25 | retain_owner_bridge |
| les-a-0139 | 5.8.5 | Анализ вызовов инструментов, состояния и ошибок агента | Track C | C4 / Agent tool traces and observability | elective | planned; outline_only | 25 | retain_owner_bridge |
| les-a-0140 | 5.9.1 | Fidelity и Faithfulness | Track A | A4 / Explanation quality and scientific validation | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0141 | 5.9.2 | Stability и Robustness | Track A | A4 / Explanation quality and scientific validation | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0142 | 5.9.3 | Sanity Checks | Track A | A4 / Explanation quality and scientific validation | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0143 | 5.9.4 | Uncertainty и Sensitivity | Track A | A4 / Explanation quality and scientific validation | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0144 | 5.9.5 | Reproducibility | Track A | A5 / Explanation quality and scientific validation | mandatory | planned; outline_only | 26 | mandatory_elective_reclassification |
| les-a-0145 | 5.9.6 | Human Utility | Track A | A5 / Explanation quality and scientific validation | mandatory | planned; outline_only | 26 | mandatory_elective_reclassification |
| les-a-0146 | 5.9.7 | Экспериментальный дизайн и научная отчётность | Track A | A5 / Explanation quality and scientific validation | mandatory | planned; outline_only | 26 | mandatory_elective_reclassification |
| les-a-0147 | 4.1.1 | Что такое интерпретируемость модели | Track A | A1 / Interpretability and transparent models | mandatory | planned; outline_only | 00,12,13 | retain_owner |
| les-a-0148 | 4.1.2 | Интерпретируемость и объяснимость | Track A | A1 / Interpretability and transparent models | mandatory | planned; outline_only | 00,12,13 | retain_owner |
| les-a-0149 | 4.1.5 | Компромисс между точностью и интерпретируемостью | Track A | A1 / Interpretability and transparent models | mandatory | planned; outline_only | 12,13 | retain_owner |
| les-a-0150 | 4.7.1 | Правила принятия решений и rule-based explanations | Track A | A4 / Rules and counterfactuals | elective | planned; outline_only | 17 | mandatory_elective_reclassification |
| les-a-0151 | 5.1.1 | От объяснения к экспериментальной проверке | Track A | A4 / Experimental verification | mandatory | planned; outline_only | 26 | mandatory_elective_reclassification |
| les-a-0152 | 5.1.2 | Вмешательства в признаки и входные данные | Track A | A4 / Experimental verification | mandatory | planned; outline_only | 26 | mandatory_elective_reclassification |
| les-a-0153 | 5.1.3 | Измерение реакции модели на вмешательство | Track A | A4 / Experimental verification | elective | planned; outline_only | 26 | retain_owner |
| les-a-0154 | 5.1.4 | Контроль эксперимента и альтернативные объяснения | Track A | A4 / Experimental verification | elective | planned; outline_only | 26 | retain_owner |
| les-a-0155 | 5.1.5 | Протокол проверки объяснения через вмешательство | Track A | A4 / Experimental verification | elective | planned; outline_only | 26 | retain_owner |
| les-a-0156 | 5.2.1 | Модель угроз для систем объяснения | Track A | A4 / Explanation attacks and red team | elective | planned; outline_only | 26 | retain_owner |
| les-a-0157 | 5.2.2 | Adversarial perturbations и искажение атрибуций | Track A | A4 / Explanation attacks and red team | elective | planned; outline_only | 26 | retain_owner |
| les-a-0158 | 5.2.3 | Манипуляция правдоподобием объяснений | Track A | A4 / Explanation attacks and red team | elective | planned; outline_only | 26 | retain_owner |
| les-a-0159 | 5.2.4 | Экспериментальная проверка устойчивости к атакам | Track A | A4 / Explanation attacks and red team | elective | planned; outline_only | 26 | retain_owner |
| les-a-0160 | 5.2.5 | Защита, ограничения и red-team отчёт | Track A | A4 / Explanation attacks and red team | elective | planned; outline_only | 26 | retain_owner |
| les-a-0161 | 5.5.1 | Карта компетенций и самооценка исследователя | Track A | A5 / Capstone | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0162 | 5.5.2 | Выбор модели, системы и исследовательского сценария | Track A | A5 / Capstone | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0163 | 5.5.3 | Исследовательский вопрос и проверяемые гипотезы | Track A | A5 / Capstone | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0164 | 5.5.4 | Дизайн эксперимента и выбор методов объяснения | Track A | A5 / Capstone | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0165 | 5.5.5 | Проведение исследования и анализ объяснений | Track A | A5 / Capstone | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0166 | 5.5.6 | Проверка качества и границ выводов | Track A | A5 / Capstone | mandatory | planned; outline_only | 26 | retain_owner |
| les-a-0167 | 5.5.7 | Воспроизводимый отчёт и защита результатов | Track A | A5 / Capstone | mandatory | planned; outline_only | 26 | retain_owner |

## 6. PY.1

PY.1 остаётся отдельной optional Python readiness path: вне Foundation, вне счётчика 40 macro IDs, без собственной планеты. Она закрывает prerequisite gap перед C6 и, при необходимости, перед B-specific scientific Python. Existing Lesson UID не переназначаются в PY.1; завершение PY.1 не обязательно при подтверждённой диагностикой компетенции.

## 7. Перечень gap и решений до миграции

1. Foundation: подтвердить outcomes 20 mandatory уроков; проверить, что пять математических/AI literacy blocks покрыты без prerequisites cycles.
2. Macro 00/10: разработать отдельные competency outcomes для общей research literacy; не считать A-specific content универсальным Foundation.
3. Track A: подтвердить proposed mandatory/elective split (особенно 4.4.1–.2 mandatory; 4.7.1/.4 elective).
4. Track B: разработать пять тем и полноценный lesson-level syllabus с labs/assessments; текущих B-owned UID после разделения нет.
5. Track C: разработать уроки для C0–C5 и C7–C12; C6 имеет частичное покрытие Python UID 2.2.*.
6. Agent explainability: определить отдельные outcomes A для объяснения поведения агента; не считать C observability эквивалентом.
7. Macro 36: не зачесть A explanation attacks (5.2.*) автоматически как B robustness/adversarial curriculum.
8. Проверить 30 published URLs, все progress keys, aliases, prerequisites and frontend readers до изменения ownership.

## 8. Проверки целостности

- Catalog source: 167 lessons; 167 unique UIDs.
- Existing architecture inventory: 167 rows; 167 unique UIDs; zero missing and zero extra.
- Proposed crosswalk inventory: 167 rows; one primary owner per UID.
- Proposed counts: Foundation 49 (20/29); A 84 (44/40); B 0; C 34 (31/3).
- No new Lesson UID created.
- No catalog/sequence/governance/frontend/lesson/URL changes performed.

## 9. Approval and migration boundary

Этот документ конкретизирует proposed ownership и crosswalk, но не является автоматическим утверждением всех переносов. До отдельного approval не менять catalog JSON, sequence JSON, governance JSON, published pages, aliases, progress mappings или production. Следующий технический этап после утверждения — schema/consumer audit и миграционный план с rollback, а не немедленная запись новых owner values в catalog.

**Status:** `canonical_crosswalk_draft_complete_pending_architecture_approval`.