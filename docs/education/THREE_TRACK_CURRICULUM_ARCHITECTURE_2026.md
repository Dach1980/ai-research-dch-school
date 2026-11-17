# DCH SCHOOL — THREE-TRACK CURRICULUM ARCHITECTURE 2026

**Дата редакции:** 2026-11-17  
**Статус:** целевая архитектура, утверждённые проектные ограничения; миграция каталога и sequence ещё не выполнена  
**Версия:** 1.0-draft  
**Источник истины для целевой макроархитектуры:** этот документ  
**Текущие технические данные:** `data/catalog/catalog-v3.json` (3.2.0-draft), `data/curriculum-sequence-track-a.json`

---

## 1. Решение и область действия

Школа сохраняет три профессиональных направления и три планеты:

- **Track A — Understanding AI:** понимать поведение моделей, объяснять предсказания и научно проверять объяснения.
- **Track B — Inside AI:** исследовать внутренние вычисления нейросетей, представления, признаки и механизмы.
- **Track C — Building with AI:** проектировать, собирать, настраивать, интегрировать и эксплуатировать AI-системы.

**Foundation** — общая подготовка перед профессиональными маршрутами. Это не четвёртый трек и не четвёртая планета. Он визуально представлен как общий вход/подготовительный слой, доступный из всех трёх направлений.

Проектные ограничения:

1. На главной карте ровно три планеты и три профессиональных трека.
2. Foundation не получает отдельную планету.
3. Целевой диапазон профессионального маршрута — 40–45 обязательных уроков; это ориентир, а не квота.
4. 35–39 уроков допустимы, если они образуют законченную и качественную траекторию. Не добавлять уроки ради числа.
5. Не более 10 обязательных уроков в одной крупной теме.
6. Пять крупных тем на каждой планете.
7. Продвинутые лаборатории, специальные методы и исследовательские фронтиры — элективы, не блокирующие основной маршрут.
8. Отдельные уроки становятся видимыми только после входа в тему.
9. Опубликованные страницы, UID, URL, legacy aliases и progress mappings не переименовываются и не переназначаются без отдельного миграционного решения.
10. Архитектурное распределение UID в этом документе — целевое назначение; до миграции фактический каталог остаётся неизменным.

## 2. Принципиальное разграничение треков

| Направление | Главный вопрос | Объект исследования/работы | Что не является его основной задачей |
|---|---|---|---|
| Foundation | Какие знания нужны для дальнейшего обучения? | базовые понятия AI/ML, данные, математика, исследовательская грамотность | профессиональная специализация |
| A — Understanding AI | Почему модель ведёт себя именно так и насколько объяснение достоверно? | внешнее поведение модели, предсказания, атрибуции, контрфакты, качество объяснений | вскрытие внутренних circuit-механизмов |
| B — Inside AI | Какие внутренние вычисления и представления порождают поведение? | активации, residual stream, features, probes, circuits, SAE | обычная прикладная сборка продукта |
| C — Building with AI | Как построить надёжную AI-систему и заставить её работать в реальной среде? | код, данные, модели, LLM runtime, API, RAG, MCP, агенты, безопасность и эксплуатация | научное объяснение модели как главная цель |

Один урок имеет одну основную принадлежность. Общие знания связываются prerequisite-зависимостями и повторным использованием материалов, а не дублированием UID в нескольких треках. Практическое применение одного понятия в разных треках может быть отдельными уроками с разными UID и разными результатами обучения.

## 3. Foundation — общая подготовка

**Целевая длина основного маршрута: 20 уроков.** Дополнительные математические и исследовательские материалы остаются рекомендуемыми элективами. Foundation не должен превращаться в полный предварительный бакалавриат.

### Пять подготовительных блоков

1. **AI и ML: базовая картина** — что такое AI/ML, типы задач и базовая терминология.
2. **Данные и постановка задачи** — объекты, признаки, целевая переменная, train/validation/test, качество данных.
3. **Базовая модель и обучение** — модель, параметры, loss, переобучение.
4. **Базовая оценка качества** — метрики классификации и базовая проверка обобщения.
5. **Минимальный математический язык** — функция, вектор, вероятность, производная на интуитивном уровне.

### 20 уроков Foundation

Основной маршрут формируется из существующих UID:  
1.1.1, 1.1.3, 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.3.1, 1.3.2, 1.3.4, 1.4.1, 1.4.2, 1.4.3, 1.5.1, 1.5.2, 1.5.3, 1.5.6, 2.4.1, 2.5.1, 2.6.1, 2.7.1.

В текущей редакции в Foundation входят 20 обязательных записей. Остальные вводные уроки 1.x и математические углубления 2.4–2.7 не удаляются: они переводятся в рекомендуемые элективы или справочные материалы. Перед запуском Foundation следует провести проверку prerequisite-графа: нельзя требовать математический термин до его первого объяснения.

### Foundation electives

- история и альтернативные парадигмы AI;
- reinforcement learning, clustering и generative models;
- дополнительные метрики, calibration и class imbalance;
- углублённая линейная алгебра, вероятность, статистика, анализ и оптимизация.

## 4. Track A — Understanding AI

**Целевой обязательный маршрут: 44 урока.** Это укладывается в диапазон 40–45 и не требует искусственного расширения.

### Пять крупных тем

| Тема | Содержание | Обязательных |
|---|---|---:|
| A1. Интерпретируемость и прозрачные модели | понятие интерпретируемости, прозрачные модели, компромиссы | 5 |
| A2. Основы XAI и поведение модели | таксономия, feature importance, PDP/ICE/ALE | 9 |
| A3. Локальные и аддитивные объяснения | LIME и базовый SHAP | 10 |
| A4. Правила и экспериментальная проверка | Anchors, counterfactuals, вводные вмешательства, базовые критерии качества | 10 |
| A5. Научная оценка и итоговый проект | воспроизводимость, human utility, экспериментальный дизайн, capstone | 10 |
| **Итого** |  | **44** |

### Состав обязательного маршрута

- A1: 4.1.1–4.1.5 — 5.
- A2: 4.2.1–4.2.6 (6) и 4.3.1–4.3.3 (3) — 9.
- A3: 4.5.1–4.5.5 (5) и 4.6.1–4.6.5 (5) — 10.
- A4: 4.7.1–4.7.4 (4), 5.1.1–5.1.2 (2), 5.9.1–5.9.4 (4) — 10.
- A5: 5.9.5–5.9.7 (3) и 5.5.1–5.5.7 (7) — 10.

Каждая из пяти тем содержит не более 10 обязательных уроков. Для сохранения целостности учебных модулей при миграции часть существующих модулей потребуется логически разделить на тематические подмодули; исходные UID уроков при этом сохраняются.



### Предлагаемая модульная раскладка по пяти темам

- **A1:** один основной модуль — интерпретируемые модели (4.1).
- **A2:** два модуля — таксономия XAI (4.2) и поведение модели (обязательная часть 4.3).
- **A3:** два модуля — LIME (4.5) и базовый SHAP (обязательная часть 4.6).
- **A4:** два модуля — rules/counterfactuals (4.7) и экспериментальная проверка (обязательные части 5.1 и 5.9).
- **A5:** два модуля — научная оценка (оставшаяся обязательная часть 5.9) и capstone (5.5).

Это тематическая группировка, а не утверждение новых module UID. Конкретные UID модулей и технические связи фиксируются на этапе миграции после проверки ограничений текущей схемы каталога.

### Элективы Track A

- 4.1.6–4.1.7: расширенные интерпретируемые модели (KNN/SVM/prototypes, GAM/EBM).
- 4.3.4: углублённый анализ взаимодействий признаков.
- 4.4.1–4.4.5: причинное мышление.
- 4.8.1–4.8.5: гетерогенные причинные эффекты.
- 5.1.1–5.1.5: экспериментальные вмешательства во входы и проверка объяснений.
- 5.2.1–5.2.5: атаки на объяснения и red-team.
- 5.3 и 5.4: deep-dive лаборатории SHAP и counterfactuals; optional, non-blocking.
- 5.6: визуальные методы XAI; электив для специалистов по vision.
- 5.7.1–5.7.3: concept-based методы; электив.
- 5.7.4–5.7.5: attention-based методы; обзорный электив с явным предупреждением, что attention map не является автоматически faithful explanation.
- 5.8.1–5.8.3: black-box анализ LLM; электив.
- 5.8.4–5.8.5 относятся к Track C (наблюдаемость поведения агента и инструменты), а не к Track A.

В Track A причинность и heterogenous effects сохраняются как элективные исследовательские специализации. Они не должны перегружать основной маршрут XAI Practitioner. 4.3.5, 4.6.6 и 5.1.3–5.1.5 также остаются элективами.

## 5. Track B — Inside AI

**Целевой основной маршрут: 35–40 уроков;** первая версия может стартовать с 35. Углублённые лаборатории и современные исследовательские темы — electives. Здесь нельзя механически переносить внешние методы XAI из Track A.

### Пять крупных тем

| Тема | Содержание | Целевой объём |
|---|---|---:|
| B1. Внутреннее устройство нейросетей | MLP, Transformer, residual stream, attention, MLP blocks, tensor shapes | 7–8 |
| B2. Представления и признаки | activations, representations, superposition, feature hypotheses | 7–8 |
| B3. Probes и lenses | linear probes, control tasks, logit lens, tuned lens, decoding limits | 6–7 |
| B4. Circuits и причинные вмешательства | ablation, activation/path patching, causal tracing, circuit discovery | 7–8 |
| B5. Sparse features и механистическая интерпретация | dictionary learning, SAE, feature validation, causal tests, limitations | 7–9 |

**Обязательный минимум первой версии:** 35 уроков (7 на тему). Не добавлять материал, пока не определены проверяемые learning outcomes и практические артефакты.

### Элективные лаборатории B

- induction heads, IOI, ACDC/EAP;
- SAE training, feature splitting/merging, dead latents;
- activation steering и editing;
- developmental interpretability;
- mechanistic interpretability for safety;
- advanced multimodal internals.

### Текущие UID, передаваемые в B

- 5.6.1–5.6.5 — CNN/feature maps/visual saliency как переходная лаборатория для исследователей внутренних представлений; основная принадлежность B elective. В Track A может быть отдельный прикладной XAI-урок в будущем, но не тот же UID.
- 5.7.1–5.7.3 — concept-based методы и TCAV — B elective, с границей: концептуальные атрибуции не тождественны mechanistic circuits.

Эти восемь записей не делают Track B готовым: для B потребуется отдельная программа новых уроков и UID. Не считать их достаточным содержанием профессионального маршрута.

## 6. Track C — Building with AI

**Текущий обязательный набор: 31 урок; целевой первый маршрут: около 35.** До целевого объёма не хватает четырёх обязательных уроков, но добавлять их следует только после содержательной QA и определения практических результатов.

### Пять крупных тем

| Тема | Содержание | Целевой объём |
|---|---|---:|
| C1. Инструменты и разработка | Python, окружения, notebooks, проектная структура, тестирование | 7 |
| C2. Данные и классический ML | NumPy/pandas, EDA, подготовка данных, базовые ML-модели | 7 |
| C3. Deep Learning и локальный inference | PyTorch, обучение, Transformer concepts, runtime, форматы моделей | 7 |
| C4. LLM-приложения и интеграции | API, structured outputs, tool calling, MCP, RAG, agents | 7 |
| C5. Надёжность и эксплуатация | evaluation, security, observability, latency, versioning, deployment | 7 |
| **Итого целевой первый маршрут** |  | **35** |

### Текущие UID для Track C

- 2.1.1–2.1.5: исследовательская среда, окружения, notebooks, структура проекта, воспроизводимость.
- 2.2.1–2.2.6: Python.
- 2.3.1–2.3.6: NumPy, pandas, визуализация и EDA.
- 3.1.1–3.1.6: классические ML-модели и сравнение.
- 3.2.1–3.2.8: нейросети, PyTorch и концептуальное введение в Transformer.
- 5.7.4–5.7.5: attention/Transformer interpretation — elective C support, если урок рассматривает применение и ограничения attention, а не внутренние circuits.
- 5.8.4–5.8.5: трассировка поведения AI-агента, вызовы инструментов, состояние и ошибки.

Первые 31 UID (2.1–2.3 и 3.1–3.2) составляют текущую обязательную инженерную основу. Четыре урока 5.7.4–5.7.5 и 5.8.4–5.8.5 — дополнительные elective/bridge. Поэтому до целевого первого маршрута в 35 обязательных уроков Track C пока не хватает четырёх качественно спроектированных обязательных уроков; добавлять их следует только после определения learning outcomes и практических заданий.

### Недостающие темы, которые нужно спроектировать отдельными уроками

- локальный inference и модельные форматы/квантизация;
- системная интеграция через API и streaming;
- structured outputs и валидация;
- MCP lifecycle, tools/resources/prompts, authorization и trust boundaries;
- RAG ingestion, retrieval evaluation, citations, ACL и защита от poisoning;
- агентные циклы, state, tool orchestration, policy enforcement;
- тестирование, observability, security, deployment и эксплуатационные метрики.

Новые уроки и UID для этих тем в рамках настоящего документа не создаются.

## 7. Распределение всех 167 существующих Lesson UID

Таблица фиксирует **одно целевое основное назначение каждого UID**. Статус `published/planned` ниже — текущий статус записи в каталоге, а не новый статус публикации. Перемещение UID между треками — план миграции, ещё не выполненный.

| UID | Код | Целевой владелец | Маршрут | Текущий статус | Название |
|---|---|---|---|---|---|
| les-a-0001 | 1.1.1 | Foundation | mandatory | published | Что такое искусственный интеллект |
| les-a-0051 | 1.1.2 | Foundation | elective | published | История развития искусственного интеллекта |
| les-a-0002 | 1.1.3 | Foundation | mandatory | published | AI, Machine Learning и Deep Learning |
| les-a-0052 | 1.1.4 | Foundation | elective | published | Символический AI и машинное обучение |
| les-a-0003 | 1.2.1 | Foundation | mandatory | published | Что такое данные в машинном обучении |
| les-a-0004 | 1.2.2 | Foundation | mandatory | published | Объекты, признаки и целевые переменные |
| les-a-0056 | 1.2.3 | Foundation | mandatory | published | Типы данных и представление признаков |
| les-a-0050 | 1.2.4 | Foundation | mandatory | published | Обучающие, проверочные и тестовые данные |
| les-a-0005 | 1.2.5 | Foundation | elective | published | Качество данных, пропуски и выбросы |
| les-a-0006 | 1.2.6 | Foundation | elective | published | Корреляция, зависимости и утечка данных |
| les-a-0007 | 1.3.1 | Foundation | mandatory | published | Обучение с учителем — Supervised Learning |
| les-a-0008 | 1.3.2 | Foundation | mandatory | published | Обучение без учителя — Unsupervised Learning |
| les-a-0053 | 1.3.3 | Foundation | elective | published | Обучение с подкреплением — Reinforcement Learning |
| les-a-0054 | 1.3.4 | Foundation | mandatory | published | Классификация и регрессия |
| les-a-0055 | 1.3.5 | Foundation | elective | published | Кластеризация и снижение размерности |
| les-a-0009 | 1.3.6 | Foundation | elective | published | Генеративные модели и другие современные подходы |
| les-a-0010 | 1.4.1 | Foundation | mandatory | published | Понятие модели и параметров |
| les-a-0011 | 1.4.2 | Foundation | mandatory | published | Обучение модели и функция потерь |
| les-a-0012 | 1.4.3 | Foundation | mandatory | published | Переобучение и недообучение |
| les-a-0013 | 1.4.4 | Foundation | elective | published | Обобщающая способность модели |
| les-a-0014 | 1.4.5 | Foundation | elective | published | Гиперпараметры и настройка модели |
| les-a-0043 | 1.5.1 | Foundation | mandatory | published | Зачем оценивать качество модели |
| les-a-0044 | 1.5.2 | Foundation | mandatory | published | Матрица ошибок классификации |
| les-a-0045 | 1.5.3 | Foundation | mandatory | published | Accuracy, Precision, Recall и F1 |
| les-a-0046 | 1.5.4 | Foundation | elective | published | ROC-AUC и Precision-Recall AUC |
| les-a-0047 | 1.5.5 | Foundation | elective | published | Дисбаланс классов |
| les-a-0015 | 1.5.6 | Foundation | mandatory | published | Кросс-валидация и устойчивость результатов |
| les-a-0048 | 1.5.7 | Foundation | elective | published | Метрики регрессии: MAE, MSE, RMSE и R² |
| les-a-0057 | 1.5.8 | Foundation | elective | published | Калибровка вероятностей и качество вероятностных прогнозов |
| les-a-0058 | 2.1.1 | Track C | mandatory | planned | Инструменты исследователя AI |
| les-a-0059 | 2.1.2 | Track C | mandatory | planned | Python, виртуальные окружения и пакеты |
| les-a-0060 | 2.1.3 | Track C | mandatory | planned | Jupyter Notebook и интерактивные эксперименты |
| les-a-0061 | 2.1.4 | Track C | mandatory | planned | Организация исследовательского проекта |
| les-a-0062 | 2.1.5 | Track C | mandatory | planned | Воспроизводимость экспериментов |
| les-a-0063 | 2.2.1 | Track C | mandatory | planned | Переменные, типы данных и операторы |
| les-a-0064 | 2.2.2 | Track C | mandatory | planned | Условия и циклы |
| les-a-0065 | 2.2.3 | Track C | mandatory | planned | Функции и области видимости |
| les-a-0066 | 2.2.4 | Track C | mandatory | planned | Списки, словари и множества |
| les-a-0067 | 2.2.5 | Track C | mandatory | planned | Классы и объектно-ориентированное программирование |
| les-a-0068 | 2.2.6 | Track C | mandatory | planned | Работа с библиотеками и исключениями |
| les-a-0069 | 2.3.1 | Track C | mandatory | planned | Массивы NumPy |
| les-a-0070 | 2.3.2 | Track C | mandatory | planned | Векторизация и операции над массивами |
| les-a-0071 | 2.3.3 | Track C | mandatory | planned | Таблицы pandas |
| les-a-0072 | 2.3.4 | Track C | mandatory | planned | Очистка и преобразование данных |
| les-a-0073 | 2.3.5 | Track C | mandatory | planned | Визуализация данных |
| les-a-0074 | 2.3.6 | Track C | mandatory | planned | Исследовательский анализ данных (EDA) |
| les-a-0075 | 2.4.1 | Foundation | mandatory | planned | Переменные, выражения и функции |
| les-a-0076 | 2.4.2 | Foundation | elective | planned | Линейные и нелинейные функции |
| les-a-0077 | 2.4.3 | Foundation | elective | planned | Экспоненты и логарифмы |
| les-a-0078 | 2.4.4 | Foundation | elective | planned | Графики и преобразования функций |
| les-a-0079 | 2.5.1 | Foundation | mandatory | planned | Векторы и векторные пространства |
| les-a-0080 | 2.5.2 | Foundation | elective | planned | Матрицы и матричные операции |
| les-a-0081 | 2.5.3 | Foundation | elective | planned | Скалярное произведение |
| les-a-0082 | 2.5.4 | Foundation | elective | planned | Линейные преобразования |
| les-a-0083 | 2.5.5 | Foundation | elective | planned | Собственные значения и собственные векторы |
| les-a-0084 | 2.6.1 | Foundation | mandatory | planned | Основы теории вероятностей |
| les-a-0085 | 2.6.2 | Foundation | elective | planned | Случайные величины и распределения |
| les-a-0086 | 2.6.3 | Foundation | elective | planned | Математическое ожидание и дисперсия |
| les-a-0087 | 2.6.4 | Foundation | elective | planned | Условная вероятность и теорема Байеса |
| les-a-0088 | 2.6.5 | Foundation | elective | planned | Статистические оценки и доверительные интервалы |
| les-a-0089 | 2.6.6 | Foundation | elective | planned | Статистическая значимость и проверка гипотез |
| les-a-0090 | 2.7.1 | Foundation | mandatory | planned | Пределы и производные |
| les-a-0091 | 2.7.2 | Foundation | elective | planned | Частные производные |
| les-a-0092 | 2.7.3 | Foundation | elective | planned | Градиент и направление изменения функции |
| les-a-0093 | 2.7.4 | Foundation | elective | planned | Градиентный спуск |
| les-a-0094 | 2.7.5 | Foundation | elective | planned | Оптимизация функции потерь |
| les-a-0095 | 2.8.1 | Track A | elective | planned | Научный вопрос и исследовательская гипотеза |
| les-a-0096 | 2.8.2 | Track A | elective | planned | Планирование эксперимента |
| les-a-0097 | 2.8.3 | Track A | elective | planned | Контрольные группы и базовые модели |
| les-a-0098 | 2.8.4 | Track A | elective | planned | Повторяемость и статистическая устойчивость |
| les-a-0099 | 2.8.5 | Track A | elective | planned | Интерпретация и представление результатов |
| les-a-0100 | 3.1.1 | Track C | mandatory | planned | Линейная регрессия |
| les-a-0101 | 3.1.2 | Track C | mandatory | planned | Логистическая регрессия |
| les-a-0102 | 3.1.3 | Track C | mandatory | planned | Деревья решений |
| les-a-0103 | 3.1.4 | Track C | mandatory | planned | Метод ближайших соседей и метод опорных векторов |
| les-a-0104 | 3.1.5 | Track C | mandatory | planned | Ансамбли: случайный лес и градиентный бустинг |
| les-a-0049 | 3.1.6 | Track C | mandatory | planned | Сравнение моделей и базовые алгоритмы |
| les-a-0105 | 3.2.1 | Track C | mandatory | planned | Искусственный нейрон |
| les-a-0106 | 3.2.2 | Track C | mandatory | planned | Перцептрон и многослойная нейронная сеть |
| les-a-0107 | 3.2.3 | Track C | mandatory | planned | Функции активации |
| les-a-0108 | 3.2.4 | Track C | mandatory | planned | Прямое распространение сигнала |
| les-a-0109 | 3.2.5 | Track C | mandatory | planned | Функция потерь и обратное распространение ошибки |
| les-a-0110 | 3.2.6 | Track C | mandatory | planned | Обучение нейронной сети в PyTorch |
| les-a-0111 | 3.2.7 | Track C | mandatory | planned | Регуляризация и стабилизация обучения |
| les-a-0112 | 3.2.8 | Track C | mandatory | planned | Основы архитектуры Transformer и механизм внимания |
| les-a-0016 | 4.1.3 | Track A | mandatory | planned | Линейные модели как объяснимые модели |
| les-a-0017 | 4.1.4 | Track A | mandatory | planned | Интерпретация деревьев решений |
| les-a-0113 | 4.1.6 | Track A | elective | planned | Нелинейные модели с интерпретируемой структурой |
| les-a-0114 | 4.1.7 | Track A | elective | planned | GAM и EBM: интерпретируемые модели с нелинейными зависимостями |
| les-a-0018 | 4.2.1 | Track A | mandatory | published | Что такое XAI и зачем нужно объяснять модели? |
| les-a-0019 | 4.2.2 | Track A | mandatory | planned | Локальные и глобальные объяснения |
| les-a-0020 | 4.2.3 | Track A | mandatory | planned | Intrinsic и Post-hoc методы |
| les-a-0021 | 4.2.4 | Track A | mandatory | planned | Feature Importance |
| les-a-0022 | 4.2.5 | Track A | mandatory | planned | Permutation Feature Importance |
| les-a-0023 | 4.2.6 | Track A | mandatory | planned | Faithfulness и ограничения объяснений |
| les-a-0024 | 4.3.1 | Track A | mandatory | planned | Partial Dependence Plot |
| les-a-0025 | 4.3.2 | Track A | mandatory | planned | Individual Conditional Expectation |
| les-a-0026 | 4.3.3 | Track A | mandatory | planned | Accumulated Local Effects |
| les-a-0027 | 4.3.4 | Track A | elective | planned | Взаимодействия признаков |
| les-a-0028 | 4.3.5 | Track A | mandatory | planned | Сравнение PDP, ICE и ALE |
| les-a-0115 | 4.4.1 | Track A | elective | planned | Корреляция и причинность |
| les-a-0116 | 4.4.2 | Track A | elective | planned | Причинные графы |
| les-a-0117 | 4.4.3 | Track A | elective | planned | Confounding и скрытые переменные |
| les-a-0118 | 4.4.4 | Track A | elective | planned | Интервенции и контрфактическое мышление |
| les-a-0119 | 4.4.5 | Track A | elective | planned | Причинные объяснения и ограничения XAI |
| les-a-0029 | 4.5.1 | Track A | mandatory | planned | Идея локального объяснения |
| les-a-0030 | 4.5.2 | Track A | mandatory | planned | Local Surrogate Models |
| les-a-0031 | 4.5.3 | Track A | mandatory | planned | Как работает LIME |
| les-a-0032 | 4.5.4 | Track A | mandatory | planned | Выбор окрестности и интерпретация результатов |
| les-a-0033 | 4.5.5 | Track A | mandatory | planned | Ограничения и устойчивость LIME |
| les-a-0034 | 4.6.1 | Track A | mandatory | planned | Теория игр и Shapley Values |
| les-a-0035 | 4.6.2 | Track A | mandatory | planned | Как работает SHAP |
| les-a-0036 | 4.6.3 | Track A | mandatory | planned | Локальные объяснения SHAP |
| les-a-0037 | 4.6.4 | Track A | mandatory | planned | Глобальная важность признаков |
| les-a-0038 | 4.6.5 | Track A | mandatory | planned | Summary Plot, Dependence Plot и Waterfall Plot |
| les-a-0039 | 4.6.6 | Track A | mandatory | planned | Ограничения и предположения SHAP |
| les-a-0040 | 4.7.2 | Track A | mandatory | planned | Anchors |
| les-a-0041 | 4.7.3 | Track A | mandatory | planned | Контрфактические объяснения |
| les-a-0042 | 4.7.4 | Track A | mandatory | planned | Реализуемость и правдоподобие контрфактов |
| les-a-0120 | 4.8.1 | Track A | elective | planned | Что такое неоднородность причинного эффекта |
| les-a-0121 | 4.8.2 | Track A | elective | planned | ATE и CATE: средний и условный причинный эффект |
| les-a-0122 | 4.8.3 | Track A | elective | planned | Групповые и индивидуальные различия эффектов |
| les-a-0123 | 4.8.4 | Track A | elective | planned | Meta-learners и методы оценки гетерогенных эффектов |
| les-a-0124 | 4.8.5 | Track A | elective | planned | Проверка устойчивости, переобучения и ложных подгрупп |
| les-a-0125 | 5.6.1 | Track B | elective | planned | CNN как объект исследования: слои, feature maps и receptive fields |
| les-a-0126 | 5.6.2 | Track B | elective | planned | Градиентные карты чувствительности и saliency maps |
| les-a-0127 | 5.6.3 | Track B | elective | planned | Integrated Gradients и SmoothGrad |
| les-a-0128 | 5.6.4 | Track B | elective | planned | CAM и Grad-CAM |
| les-a-0129 | 5.6.5 | Track B | elective | planned | Проверка качества визуальных карт объяснения |
| les-a-0130 | 5.7.1 | Track B | elective | planned | Понятие концепта в нейросети |
| les-a-0131 | 5.7.2 | Track B | elective | planned | Concept Activation Vectors и TCAV |
| les-a-0132 | 5.7.3 | Track B | elective | planned | Наборы концептов, coverage и ограничения разметки |
| les-a-0133 | 5.7.4 | Track C | elective | planned | Attention-механизм в Transformer |
| les-a-0134 | 5.7.5 | Track C | elective | planned | Attention maps и ограничения их интерпретации |
| les-a-0135 | 5.8.1 | Track A | elective | planned | Экспериментальный анализ поведения LLM |
| les-a-0136 | 5.8.2 | Track A | elective | planned | Влияние промпта, контекста и параметров генерации |
| les-a-0137 | 5.8.3 | Track A | elective | planned | Сравнение ответов и диагностические эксперименты |
| les-a-0138 | 5.8.4 | Track C | elective | planned | Анализ траекторий действий AI-агента |
| les-a-0139 | 5.8.5 | Track C | elective | planned | Анализ вызовов инструментов, состояния и ошибок агента |
| les-a-0140 | 5.9.1 | Track A | mandatory | planned | Fidelity и Faithfulness |
| les-a-0141 | 5.9.2 | Track A | mandatory | planned | Stability и Robustness |
| les-a-0142 | 5.9.3 | Track A | mandatory | planned | Sanity Checks |
| les-a-0143 | 5.9.4 | Track A | mandatory | planned | Uncertainty и Sensitivity |
| les-a-0144 | 5.9.5 | Track A | mandatory | planned | Reproducibility |
| les-a-0145 | 5.9.6 | Track A | mandatory | planned | Human Utility |
| les-a-0146 | 5.9.7 | Track A | mandatory | planned | Экспериментальный дизайн и научная отчётность |
| les-a-0147 | 4.1.1 | Track A | mandatory | planned | Что такое интерпретируемость модели |
| les-a-0148 | 4.1.2 | Track A | mandatory | planned | Интерпретируемость и объяснимость |
| les-a-0149 | 4.1.5 | Track A | mandatory | planned | Компромисс между точностью и интерпретируемостью |
| les-a-0150 | 4.7.1 | Track A | mandatory | planned | Правила принятия решений и rule-based explanations |
| les-a-0151 | 5.1.1 | Track A | elective | planned | От объяснения к экспериментальной проверке |
| les-a-0152 | 5.1.2 | Track A | elective | planned | Вмешательства в признаки и входные данные |
| les-a-0153 | 5.1.3 | Track A | elective | planned | Измерение реакции модели на вмешательство |
| les-a-0154 | 5.1.4 | Track A | elective | planned | Контроль эксперимента и альтернативные объяснения |
| les-a-0155 | 5.1.5 | Track A | elective | planned | Протокол проверки объяснения через вмешательство |
| les-a-0156 | 5.2.1 | Track A | elective | planned | Модель угроз для систем объяснения |
| les-a-0157 | 5.2.2 | Track A | elective | planned | Adversarial perturbations и искажение атрибуций |
| les-a-0158 | 5.2.3 | Track A | elective | planned | Манипуляция правдоподобием объяснений |
| les-a-0159 | 5.2.4 | Track A | elective | planned | Экспериментальная проверка устойчивости к атакам |
| les-a-0160 | 5.2.5 | Track A | elective | planned | Защита, ограничения и red-team отчёт |
| les-a-0161 | 5.5.1 | Track A | mandatory | planned | Карта компетенций и самооценка исследователя |
| les-a-0162 | 5.5.2 | Track A | mandatory | planned | Выбор модели, системы и исследовательского сценария |
| les-a-0163 | 5.5.3 | Track A | mandatory | planned | Исследовательский вопрос и проверяемые гипотезы |
| les-a-0164 | 5.5.4 | Track A | mandatory | planned | Дизайн эксперимента и выбор методов объяснения |
| les-a-0165 | 5.5.5 | Track A | mandatory | planned | Проведение исследования и анализ объяснений |
| les-a-0166 | 5.5.6 | Track A | mandatory | planned | Проверка качества и границ выводов |
| les-a-0167 | 5.5.7 | Track A | mandatory | planned | Воспроизводимый отчёт и защита результатов |

**Контрольные условия:** в таблице должны присутствовать все 167 уникальных UID; один UID — ровно один primary owner. Электронные копии или повторное использование объясняющих фрагментов не должны создавать вторую запись с тем же UID.

## 8. Карта планет и модель навигации

### Уровень 1 — главная карта

- Центральный DCH identity / логотип.
- Ровно три планеты: Understanding AI, Inside AI, Building with AI.
- Foundation — общая стартовая зона/портал, расположенный вне планетной системы как общий подготовительный слой; визуально не изображать четвёртой планетой.
- На главной не показывать отдельные уроки и не выводить 167 точек.

### Уровень 2 — карта выбранного трека

Внутри каждой планеты пользователь видит ровно пять крупных тематических областей/орбит. Названия тем и короткое описание должны быть читаемыми и доступными без наведения. Орбиты не должны кодировать отдельные уроки.

### Уровень 3 — страница темы

После выбора тематической области открывается страница темы с:
- описанием результата обучения;
- списком модулей;
- обязательными и элективными модулями;
- prerequisites;
- прогрессом;
- оценкой ожидаемого времени;
- переходом к урокам.

### Уровень 4 — модуль и уроки

Уроки отображаются только после входа в тему/модуль. Обязательные уроки формируют линейный маршрут; electives доступны отдельно и не блокируют завершение трека. На мобильных устройствах карта переходит в компактный список/карточки. Сохраняются responsive layout и `prefers-reduced-motion`.

## 9. Модель prerequisite и завершения

- Foundation является общим prerequisite для всех треков, но допускает диагностическое подтверждение уже имеющихся компетенций.
- A не требует прохождения полного инженерного курса Track C.
- B требует достаточного уровня Python, линейной алгебры, вероятности и основ Deep Learning; недостающие знания закрываются Foundation + B bridge lessons.
- C требует Python и базовой математики, но не требует XAI или mechanistic interpretability.
- Электive lessons не входят в blocking prerequisite chain.
- Capstone в каждом треке должен проверять собственные компетенции трека: A — исследование качества объяснений; B — воспроизводимый анализ внутреннего механизма; C — работоспособная AI-система с тестами и эксплуатационной документацией.
- Прогресс отслеживается по UID и не теряется при смене тематической/трековой принадлежности.

## 10. Миграционный план каталога и sequence

### Этап 0 — фиксация и защита идентичности

1. Сохранить текущие версии и SHA каталога/sequence.
2. Сделать резервную копию/снимок текущего mapping.
3. Составить неизменяемый реестр всех published UID, RU/EN/中文 URL, legacy aliases и progress keys.
4. Зафиксировать, что production release запрещён до завершения QA.

### Этап 1 — новая структура каталога

1. Создать Foundation entity (не track и не planet).
2. Создать пять Theme для каждого из A/B/C.
3. Перераспределить существующие module records по целевым темам; не менять UID модулей без отдельной таблицы alias/migration.
4. Сопоставить все 167 Lesson UID с одной основной темой и модулем.
5. Разделить обязательные и elective записи отдельным полем/enum, не подменяя текущий `status` (published/planned).
6. Новые уроки B/C сначала описывать как curriculum gaps; UID создавать только после утверждения поурочного состава.
7. Сохранить прежние URL и published content. Если меняется публичный путь — добавить redirect/alias, не удалять старый адрес.

### Этап 2 — sequence по каждому маршруту

1. Создать общий Foundation sequence.
2. Создать отдельные sequence для Track A, B и C.
3. Каждый sequence содержит только свои обязательные уроки и необходимые gates.
4. Electives вынести в отдельный non-blocking слой/список, не включать в blocking prerequisites.
5. Shared prerequisites ссылать на Foundation UID, не дублировать lesson steps.
6. Проверить отсутствие циклов, missing prerequisites, дублирующихся UID и недостижимых уроков.
7. Сохранить исторический Track A sequence как миграционный источник до прохождения сверки.

### Этап 3 — crosswalk и governance

1. Обновить macro crosswalk DCH 00–39 → Foundation/A/B/C.
2. Указать статус соответствия: exact / partial / elective / gap / retired-candidate.
3. Добавить decision record с датой, причиной и ссылкой на эту архитектуру.
4. Не удалять старые макро-ID и не переназначать их без таблицы соответствия.
5. Отдельно зафиксировать, что архитектура Track A от 16 ноября заменяется на уровне макроорганизации, но его содержательные уроки сохраняются как mandatory/elective по настоящему документу.

### Этап 4 — интерфейс карты

1. Главная карта: три планеты + Foundation entry.
2. Страница трека: пять тематических областей.
3. Страница темы: модули и уроки.
4. Обновить RU/EN/中文 синхронно.
5. Проверить клавиатурную навигацию, контраст, mobile layout, reduced motion и отсутствие перегруженной карты.

### Этап 5 — QA и выпуск

- 167/167 UID сопоставлены ровно один раз.
- 30 published records имеют прежние canonical URLs и progress mappings.
- Все prerequisites существуют, граф ацикличен.
- На каждом треке ровно пять тем.
- Ни одна тема не содержит более 10 обязательных уроков.
- Основные маршруты: Foundation 20; A 44; B target 35; C target 35.
- Electives не блокируют маршруты.
- Catalog остаётся `migration_staging` до ручной проверки всех страниц и sequence.
- Production release выполняется только после отдельного подтверждения.

## 11. Важные замечания и нерешённые вопросы

1. **Текущая модель каталога не поддерживает Foundation как самостоятельную сущность явно.** Перед миграцией нужно проверить JSON schema и runtime readers: не пытаться притвориться, что Foundation — четвёртый track.
2. **Текущие 32 module UID исторически привязаны к Track A.** Нельзя просто поменять track UID без проверки ссылок в frontend, progress, analytics и старых страницах.
3. **B пока не имеет достаточного количества lesson UID.** Восемь записей 5.6/5.7 — только элективные bridge materials; обязательный маршрут B потребует новой детальной программы.
4. **C имеет около 31 инженерно-фундаментального UID, но ещё не покрывает полностью интеграции, RAG, MCP, agents, security и deployment.** 35 — целевой первый объём после QA, а не подтверждённая готовность.
5. **Macro 00–39 и прежняя модель 40 modules** требуют отдельного согласования с тремя треками. Их нельзя механически трактовать как 40 модулей одного трека. Нужен новый crosswalk.
6. **Публичные коды уроков 1.x–5.x пока отражают старую структуру.** На первом этапе их сохранять как legacy/display codes; не менять код вместе с UID в одной миграции.
7. Текущие published lesson records по прежней структуре — 30; не все 167 записей являются готовыми страницами. Planned/outline_only не должны отображаться как опубликованные уроки.

## 12. Исходный снимок, использованный для этой редакции

- `data/catalog/catalog-v3.json`: version `3.2.0-draft`, status `migration_staging`, 3 tracks, 5 current themes, 32 modules, 167 lessons (30 published, 137 planned).
- `data/curriculum-sequence-track-a.json`: 169 steps; legacy Track A sequence, not yet split into Foundation/A/B/C.
- Existing published UID and URL identity is preserved by policy; this document does not change the catalog, sequence, lesson pages, or production website.

---

**Статус исполнения:** создана архитектурная спецификация. Синхронизация каталога, sequence, crosswalk, governance и интерфейса не выполнена и требует отдельного разрешения после проверки настоящего документа.
