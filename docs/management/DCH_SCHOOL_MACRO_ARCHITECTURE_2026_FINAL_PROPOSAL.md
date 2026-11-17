# DCH SCHOOL — FINAL MACRO CURRICULUM ARCHITECTURE 2026
## Решения по совместимости DCH 00–39 и новой модели Foundation + Track A/B/C

**Дата:** 2026-11-17  
**Статус:** итоговая архитектурная редакция для утверждения; каталогная миграция не выполнялась  
**Основание:** пользователь согласовал проектные ограничения трёхтрековой модели и поручил подготовить окончательную редакцию макроархитектуры после аудита совместимости.

Связанные документы:
- [Three-Track Curriculum Architecture 2026](../education/THREE_TRACK_CURRICULUM_ARCHITECTURE_2026.md)
- [DCH 00–39 Compatibility Audit](DCH_00_39_THREE_TRACK_COMPATIBILITY_AUDIT_2026-11-17.md)
- [Canonical Curriculum Decision](DCH_CANONICAL_CURRICULUM_DECISION_2026-11-11.md)
- [Track A Master Curriculum](../education/TRACK_A_MASTER_CURRICULUM.md)
- [Track C Primary Source Audit](../education/TRACK_C_PRIMARY_SOURCE_AUDIT_2026-11-11.md)

---

## 1. Итоговая архитектурная модель

Школа состоит из **общей Foundation-подготовки и трёх профессиональных треков**. Foundation не является четвёртым треком или планетой.

| Область | Назначение | Целевой объём |
|---|---|---:|
| Foundation | Общая грамотность AI, данные, математика, исследовательские основы | 20 обязательных уроков на стартовой версии |
| Track A — Understanding AI | Интерпретируемость, объяснение и оценка поведения AI | 44 обязательных урока |
| Track B — Inside AI | Mechanistic Interpretability и исследование внутренних вычислений | ориентир 35–40 обязательных уроков |
| Track C — Building with AI | Создание, настройка, интеграция и эксплуатация AI-систем | ориентир около 35 обязательных уроков после C0–C12 mapping |

Общие ограничения:
- три планеты A/B/C остаются неизменными;
- у каждой планеты ровно пять крупных тематических областей;
- не более 10 обязательных уроков в одной теме;
- electives и углублённые лаборатории не блокируют основной маршрут;
- не нужно искусственно заполнять целевой объём;
- Foundation допускает входную диагностику и зачёт уже освоенных компетенций;
- уроки отображаются только после входа в тему/модуль;
- каждый Lesson UID имеет один primary owner;
- опубликованные URL, legacy aliases и progress keys сохраняются.

**Важное правило подсчёта:** целевой объём — архитектурный ориентир, а не квота. В частности, текущие 31 mandatory UID, назначенные Track C в draft-раскладке, нельзя автоматически считать 31 завершённым уроком программы C0–C12: сначала нужно проверить соответствие их learning outcomes инженерным модулям C.

## 2. Каноническая роль исторических диапазонов

Сохраняем старые макро-ID как стабильные исторические ссылки и слой crosswalk. Они не должны механически совпадать с новыми Theme UID или Module UID.

| Исторический диапазон | Новая роль |
|---|---|
| 00–10 | Foundation и общие prerequisites; некоторые компетенции реализуются в профессиональных треках |
| 11–26 | Содержательное ядро Track A; границы уточняются настоящей редакцией |
| 27–39 | Содержательное ядро Track B; требуется новая lesson-level программа |
| C0–C12 | Канонические предметные модули Track C, сгруппированные в пять новых тем |
| PY.1 | Отдельный optional Python readiness path; не входит в 40 и не является планетой |

Старая макронумерация 00–39 сохраняется в документации и mapping registry. Настоящая редакция supersedes прежние содержательные назначения там, где это прямо указано. Исторические идентификаторы не удаляются и не перенумеровываются.

---

## 3. Foundation — общая подготовка

### 3.1. Назначение

Foundation отвечает на вопрос «что нужно знать, чтобы начать профессиональное обучение AI». Он не должен содержать полный курс Python, полный курс ML или продвинутую исследовательскую методологию.

Целевой стартовый маршрут — 20 уроков из уже существующих записей. Четыре компетентностные области:

1. **AI и ML literacy:** базовые понятия AI, ML, данные, модели, обучение и оценка.
2. **Data literacy:** типы данных, признаки, разбиение выборок, базовое качество данных.
3. **Mathematical literacy:** функции, векторы, вероятность и производная на интуитивном уровне.
4. **Research literacy:** базовая воспроизводимость, чтение результатов и корректное отношение к неопределённости.

### 3.2. Решение по макро-ID 00–10

| Macro ID | Каноническая роль | Правило размещения |
|---:|---|---|
| 00 | Ввод в AI Research и исследовательские вопросы | Не считать целиком Foundation. XAI-specific orientation остаётся входом Track A |
| 01 | Инструменты исследователя | Общая компетенция Foundation; практическая инженерная реализация углубляется в C |
| 02 | Python для научных вычислений | Инженерная программа C; PY.1 — optional подготовка. Foundation не дублирует полный Python |
| 03 | NumPy, pandas и визуализация | Практическое владение — C; базовое понимание данных — Foundation |
| 04 | Алгебра и функции | Foundation |
| 05 | Линейная алгебра | Foundation core; для B предусмотрен диагностический уровень/bridge |
| 06 | Анализ и оптимизация | Интуитивный минимум — Foundation; продвинутый уровень — B/C по prerequisites |
| 07 | Вероятность и статистика | Foundation; причинная статистика и исследовательские методы углубляются в A/B |
| 08 | Основы ML | Концептуальная грамотность — Foundation; реализация и сравнение моделей — C |
| 09 | Deep Learning и PyTorch | Практическое обучение моделей — C; внутреннее устройство и механизмы — B |
| 10 | Научный эксперимент и чтение статей | Базовая грамотность — Foundation; XAI evaluation — A; mechanistic experiments — B |

### 3.3. Foundation — важные ограничения

- 20 уроков — стартовый обязательный набор, а не утверждение, что весь старый диапазон 00–10 полностью покрыт.
- Математические electives остаются доступны без блокирования профессионального маршрута, если входная диагностика подтверждает достаточный уровень.
- Macro 00 должен получить отдельный mapping: общая исследовательская ориентация и XAI-specific orientation — разные learning outcomes.
- Foundation sequence должен иметь диагностические точки и возможность зачёта компетенций.
- Полный Python beginner course остаётся в PY.1, не включается в обязательный Foundation.

---

## 4. Track A — Understanding AI

**Назначение:** понимать внешнее поведение AI-моделей, строить объяснения, проверять их качество и корректно формулировать выводы. Track A не превращается в курс mechanistic interpretability.

### 4.1. Пять тематических областей и обязательный маршрут

| Тема | Содержание | Обязательных |
|---|---|---:|
| A1. Интерпретируемость и прозрачные модели | понятие интерпретируемости, объяснимости, прозрачные модели и компромиссы | 5 |
| A2. Основы XAI и поведение модели | таксономия, локальные/глобальные объяснения, feature importance, PDP/ICE/ALE | 9 |
| A3. Локальные и аддитивные объяснения | LIME и базовый SHAP | 10 |
| A4. Правила, причинное мышление и экспериментальная проверка | Anchors/counterfactuals, минимальная причинная грамотность, вмешательства и базовая оценка | 10 |
| A5. Научная оценка и итоговое исследование | критерии качества, воспроизводимость, human utility, capstone | 10 |
| **Итого** |  | **44** |

### 4.2. Точный состав 44 обязательных уроков

- **A1 — 5:** 4.1.1–4.1.5.
- **A2 — 9:** 4.2.1–4.2.6 и 4.3.1–4.3.3.
- **A3 — 10:** 4.5.1–4.5.5 и 4.6.1–4.6.5.
- **A4 — 10:** 4.4.1–4.4.2 (2), 4.7.2–4.7.3 (2), 5.1.1–5.1.2 (2), 5.9.1–5.9.4 (4).
- **A5 — 10:** 5.9.5–5.9.7 (3) и 5.5.1–5.5.7 (7).

Состав выше — архитектурное решение о mandatory/elective, а не выполненное изменение catalog records. Для 4.4.1–4.4.2 и других перечисленных уроков нужно будет изменить флаг обязательности в каталоге только на этапе отдельной миграции.

### 4.3. Решения по макромодулям 11–26

| Macro ID | Окончательная роль | Решение |
|---:|---|---|
| 11 | Вводная грамотность AI/ML | Общие AI/ML основы находятся в Foundation; Track A сохраняет короткий XAI entry bridge, не дублирующий Foundation |
| 12 | Линейные интерпретируемые модели | A1 mandatory |
| 13 | Нелинейные интерпретируемые модели | Базовые деревья/интерпретируемые модели — A1; GAM/EBM, prototypes и расширенные варианты — elective |
| 14 | Причинность и причинная интерпретация | Не исключать из ядра полностью: 4.4.1–4.4.2 обязательны; 4.4.3–4.4.5 elective |
| 15 | Гетерогенные эффекты | Elective specialization; ATE/CATE и meta-learners не обязательны для общего XAI Practitioner route |
| 16 | PDP, ICE, ALE и поведение модели | Основы 4.3.1–4.3.3 обязательны; сравнение и interactions — electives |
| 17 | Классические методы XAI | LIME и базовый SHAP обязательны; расширения SHAP, Anchors и counterfactuals распределены по A3/A4 и elective layer |
| 18 | Взаимодействия признаков | Elective. Базовый маршрут должен научить читать PDP/ICE/ALE, но не обязан включать отдельный advanced interaction module |
| 19 | CNN-based models | Visual XAI elective Track A; не относить к B только из-за нейросетевой природы модели |
| 20 | Gradient explanation heuristics | Saliency, Integrated Gradients и SmoothGrad — Track A electives |
| 21 | Localization and CAM | CAM/Grad-CAM — Track A electives |
| 22 | Concept-based methods | TCAV и concept attribution — Track A electives. Mechanistic feature discovery — отдельное содержание B, без повторного использования тех же UID |
| 23 | Attention-based explainability | Attention maps как внешнее объяснение — A elective; реализация attention — C; causal attention circuits — B |
| 24 | Applied LLM analysis | Black-box поведение LLM и диагностические эксперименты — A elective |
| 25 | Объяснение поведения AI-агентов | Операционная трассировка и tool-use observability — C elective; оценка объяснимости поведения агента — отдельный A elective после разработки outcomes |
| 26 | Оценка качества объяснений и научная проверка | Mandatory A5/A4; критерии качества и итоговый исследовательский проект обязательны |

### 4.4. Почему причинность частично обязательна

Полностью исключать причинность из обязательного XAI маршрута методологически неверно: учащийся должен отличать корреляционное объяснение от причинного вывода и понимать confounding хотя бы на концептуальном уровне.

При этом полноценные causal graphs, interventions, meta-learners и heterogeneous effects перегрузили бы общий маршрут. Поэтому обязательный минимум — два вводных урока:
- 4.4.1 «Корреляция и причинность»;
- 4.4.2 «Причинные графы».

Остальные уроки 4.4.3–4.4.5 и весь блок 4.8 остаются elective specialization. Чтобы сохранить предел 10 уроков в A4, 4.7.1 и 4.7.4 переводятся в electives; Anchors и базовые counterfactual concepts остаются обязательными.

### 4.5. Elective layer Track A

К элективам относятся:
- 4.3.4–4.3.5 — interactions и сравнительный углублённый анализ PDP/ICE/ALE;
- 4.4.3–4.4.5 — продвинутая причинность;
- 4.6.6 — ограничения и предположения SHAP;
- 4.7.1 и 4.7.4 — rule-based explanations и углублённая реализуемость контрфактов;
- 4.8.1–4.8.5 — heterogeneous effects;
- 5.1.3–5.1.5 — расширенный протокол intervention testing;
- весь 5.2 — attacks on explanations / red-team;
- 5.3 и 5.4 — advanced SHAP и counterfactual labs;
- 5.6.1–5.6.5 — CNN, saliency, Integrated Gradients, CAM/Grad-CAM и визуальная валидация;
- 5.7.1–5.7.3 — concept attribution/TCAV;
- 5.7.5 — attention maps и ограничения их интерпретации;
- 5.8.1–5.8.3 — black-box LLM analysis;
- будущая отдельная A specialization по объяснимости поведения AI-агентов.

---

## 5. Track B — Inside AI

**Назначение:** исследовать внутренние вычисления нейросетей, представления, признаки, цепочки вычислений и причинные механизмы. Это не общий курс нейросетей и не каталог внешних методов XAI.

### 5.1. Пять тематических областей

| Тема | Основное содержание | Legacy macro IDs |
|---|---|---|
| B1. Архитектура и внутреннее устройство нейросетей | нейронные сети, Transformer blocks, residual stream, attention/MLP internals | 27–28 |
| B2. Представления, признаки и superposition | features, superposition, dictionary learning, feature geometry | 32 |
| B3. Probes и lenses | probing, tuned lenses, logit lens и ограничения методов | 29 |
| B4. Причинные вмешательства и circuits | activation/path patching, ablation, circuit discovery, causal validation | 30–31 |
| B5. SAE, steering, safety и исследовательские фронтиры | sparse autoencoders, steering, robustness, safety, developmental interpretability, capstone | 33–39 |

### 5.2. Объём и состояние

- Целевой ориентир — 35–40 обязательных уроков.
- Пять тем, не более 10 mandatory lessons на тему.
- Не создавать уроки ради достижения числа 35.
- В текущем каталоге нет готового обязательного lesson-level ядра B.
- Существовавшие 5.6.1–5.6.5 и 5.7.1–5.7.3 не должны считаться готовыми уроками B: они относятся к визуальным и concept-based методам объяснения и переходят в A electives.
- Новые B Lesson UID создаются только после утверждения learning outcomes, лабораторных заданий, критериев оценки и prerequisite graph.

### 5.3. Обязательные границы Track B

- B изучает внутренние механизмы и причинные вычислительные пути, а не только визуализацию активаций.
- TCAV/concept attribution не эквивалентны circuit discovery.
- Attention weights сами по себе не доказывают механизм.
- Activation steering и knowledge editing должны преподаваться с анализом причинности, побочных эффектов и ограничений.
- Safety/robustness входят в B только там, где исследуются внутренние механизмы и поведение модели, а не как общий курс кибербезопасности.

---

## 6. Track C — Building with AI

**Назначение:** проектировать, собирать, настраивать, интегрировать и эксплуатировать AI-системы, включая локальные модели, API, MCP и RAG.

### 6.1. Каноническая группировка C0–C12 по пяти темам

C0–C12 сохраняются как канонические предметные модули Track C. Они группируются в пять новых тематических областей; сами C-ID не перенумеровываются.

| Тема | Модули Track C | Результат |
|---|---|---|
| C1. Local AI и вычислительная среда | C0 Local AI; C1 Hardware | выбрать локальную конфигурацию с учётом задачи, VRAM, приватности и лицензий |
| C2. Модели и локальный inference | C2 Model formats; C3 LM Studio | понимать форматы/квантизацию, загружать и конфигурировать локальные модели |
| C3. Генерация и программный доступ | C4 Generation; C5 API | управлять генерацией, использовать API, streaming и интеграцию |
| C4. Python и инструменты интеграции | C6 Python; C7 MCP basics; C8 MCP servers; C9 MCP Web Search | строить инструментальные интеграции и безопасные MCP workflows |
| C5. RAG, эксплуатация и итоговый проект | C10 RAG; C11 Diagnostics/security; C12 Capstone | создавать retrieval workflows, диагностировать риски и выпускать воспроизводимую систему |

### 6.2. Существующие UID и gap status

Существующие UID 2.1–2.3 и 3.1–3.2 — полезная инженерная подготовка и prerequisites для Track C:
- исследовательская среда и воспроизводимость;
- Python;
- NumPy/pandas и EDA;
- классический ML;
- Deep Learning и PyTorch.

Но они **не заменяют** lesson-level syllabus C0–C12. До зачёта каждого такого UID в C-модуль нужно сопоставить его learning outcomes с конкретным outcome C0–C12. Один UID нельзя зачесть дважды.

Существенные gaps, требующие lesson-level design:
- local model selection, model provenance и licensing;
- hardware/VRAM budgeting;
- model formats, quantization и lifecycle LM Studio;
- generation settings, API/streaming;
- MCP client/server design, tool permissions и error handling;
- Web Search integration;
- RAG pipeline, retrieval evaluation и citation quality;
- diagnostics, security, observability;
- C12 capstone и независимое воспроизведение.

Целевой размер около 35 обязательных уроков остаётся ориентиром. Нельзя утверждать, что текущие 31 обязательные записи уже закрывают маршрут C. Сначала нужен C0–C12 lesson crosswalk, затем точный пересчёт обязательных уроков. Четыре недостающих урока не добавлять автоматически.

### 6.3. Перемещение bridge lessons

- 5.7.4 «Attention-механизм в Transformer» — C elective/bridge, если содержание посвящено реализации и использованию attention.
- 5.8.4 «Анализ траекторий действий AI-агента» — C elective.
- 5.8.5 «Анализ вызовов инструментов, состояния и ошибок агента» — C elective.
- 5.7.5 «Attention maps и ограничения их интерпретации» — A elective.

Наблюдаемость агента и объяснение поведения агента — разные учебные результаты. Один UID не должен закрывать обе задачи.

---

## 7. PY.1 — отдельная подготовительная траектория

PY.1 сохраняется как optional Python readiness path:
- не является четвёртой планетой;
- не входит в счётчик 40 макропозиций;
- не входит автоматически в обязательный Foundation;
- помогает учащимся без Python подготовиться к C6 и инженерным лабораториям;
- для B дополняется требованиями к научным вычислениям, но не подменяет B-specific методы;
- прохождение PY.1 не обязательно для тех, кто подтверждает Python-компетенции диагностикой.

---

## 8. Решения по 12 вопросам аудита

| № | Вопрос | Итоговая рекомендация |
|---:|---|---|
| 1 | Macro 11 и Foundation | Разделить: общая AI/ML literacy в Foundation, XAI-specific bridge в A |
| 2 | Причинность и heterogeneous effects | 4.4.1–4.4.2 mandatory A; 4.4.3–4.4.5 и 4.8 целиком elective |
| 3 | Feature interactions (macro 18) | Elective A; обязательный минимум PDP/ICE/ALE сохраняется |
| 4 | CNN/gradient/CAM (19–21) | Перенести primary ownership в A electives; не относить к B автоматически |
| 5 | Concept methods (22) | TCAV/concept attribution — A elective; mechanistic feature discovery — B, с отдельными outcomes и UID |
| 6 | Attention (23) | Attention implementation — C; attention maps — A elective; attention circuits — B |
| 7 | Agent behaviour (25) | Tool traces/observability — C; объяснение поведения — A elective отдельным содержанием |
| 8 | Quality evaluation (26) | Сохранить mandatory A; разделить между A4/A5, не теряя критерии и capstone |
| 9 | Track B | Цель 35–40, пять тем; текущие восемь bridge UID не считать B core; разработать полноценный syllabus |
| 10 | Track C | Сохранить C0–C12 как канонические модули и сгруппировать в пять тем; сделать lesson-level mapping до подсчёта |
| 11 | Foundation | 20 обязательных как стартовая версия, competency-based; не заявлять полное покрытие 00–10 без outcome audit |
| 12 | PY.1 | Сохранить как optional readiness path, вне Foundation и счётчика 40 |

---

## 9. Навигационная модель

### Главная карта
- центральная DCH identity;
- ровно три планеты A/B/C;
- Foundation как общий портал/стартовая зона, не четвёртая планета;
- без отдельных уроков и без массива из 167 точек.

### Карта трека
- пять тематических областей;
- понятные названия и краткие outcomes;
- орбиты обозначают темы, а не модули или уроки.

### Страница темы
- модули, обязательность, electives;
- prerequisites, ожидаемое время и прогресс;
- переход к содержимому модуля.

### Страница модуля
- уроки и лаборатории;
- mandatory lessons формируют основной маршрут;
- electives не блокируют завершение темы/трека.

Сохраняются RU/EN/中文, responsive layout, доступность с клавиатуры и prefers-reduced-motion.

---

## 10. Миграционные правила

1. Не изменять текущий каталог и sequence до отдельного этапа реализации.
2. Сохранить все существующие Lesson UID, published URLs, aliases и progress mappings.
3. Сохранить 00–39 и C0–C12 как legacy/canonical macro references; новые Theme/Module UID не должны имитировать эти ID.
4. У каждого Lesson UID один primary owner.
5. Crosswalk допускает связи macro → несколько themes/modules и наоборот; фиксирует exact/partial/bridge/elective/gap.
6. Mandatory/elective — отдельная ось от publication status. Не смешивать mandatory с published/planned.
7. Не создавать B/C lesson UID, пока не утверждены outcomes и lesson briefs.
8. Foundation и A/B/C получают отдельные sequence; shared prerequisites связываются зависимостями, а не копированием UID.
9. Electives не включаются в blocking prerequisite graph.
10. Перед изменением module ownership проверить все frontend readers, analytics, progress, aliases и локализации.
11. Production release остаётся запрещённым до отдельного подтверждения.

---

## 11. Приоритетный план реализации

### Phase 1 — architecture approval
- Утвердить настоящую макроархитектурную редакцию.
- Зафиксировать её отдельным governance decision, с явной ссылкой на решение пользователя.
- Пометить прежние назначения 11–26 как superseded только в изменённых частях; исторические записи сохранить.

### Phase 2 — canonical crosswalk
- Создать полный реестр 00–39 + C0–C12 + PY.1.
- Для каждого macro ID указать новый owner, theme, module, relationship, confidence и status.
- Для каждого существующего Lesson UID указать один primary owner.
- Отдельно отметить gaps и unresolved mapping.

### Phase 3 — curriculum specification
- Foundation: проверить 20 уроков и prerequisites.
- A: применить mandatory/elective split, описанный в разделе 4.
- B: разработать 35–40 уроков с learning outcomes, labs и assessments.
- C: пройти C0–C12 mapping и определить точное число mandatory lessons без искусственного дополнения.

### Phase 4 — catalog and sequence migration
- Проверить schema и все потребители catalog data.
- Создать Foundation/A/B/C sequences.
- Перенести ownership и тематическую группировку без потери UID/progress.
- Прогнать проверки уникальности, prerequisites, локализаций и published URLs.

### Phase 5 — UI and acceptance
- Реализовать модель трёх планет и Foundation portal.
- Пять тематических областей внутри каждой планеты.
- Уроки только внутри темы/модуля.
- Проверить мобильный вид, reduced motion, доступность и три языка.
- Оставить каталог в migration_staging до отдельного acceptance.

---

## 12. Критерии приёмки новой макроархитектуры

- [ ] Foundation определён как общий competency-based prerequisite, не четвёртая планета.
- [ ] Три профессиональных трека A/B/C сохранены.
- [ ] В каждом треке ровно пять тематических областей.
- [ ] Не более 10 mandatory lessons в теме.
- [ ] Track A содержит 44 mandatory lessons по новой раскладке.
- [ ] Причинное мышление имеет обязательный минимальный уровень; advanced causal/heterogeneity остаются electives.
- [ ] Track B имеет утверждённый syllabus и target 35–40; до этого его готовность не декларируется.
- [ ] Track C сохраняет C0–C12 и получает точный lesson-level mapping; текущие 31 UID не объявляются полным покрытием без QA.
- [ ] PY.1 остаётся optional path.
- [ ] Каждый Lesson UID имеет один primary owner.
- [ ] Старые IDs, URL, aliases и progress сохраняются.
- [ ] Catalog/sequence migration и production release выполняются только после отдельного разрешения.

---

## 13. Статус и границы документа

Эта редакция сводит 12 вопросов аудита в единый целевой архитектурный вариант. Она является **готовой рекомендацией для утверждения**, но сама по себе не считается пользовательским подтверждением каждого содержательного переноса.

В рамках подготовки:
- создана архитектурная редакция;
- предложено конкретное решение по всем 12 вопросам;
- согласованы границы Foundation, A, B, C и PY.1;
- уточнён обязательный состав Track A;
- выявлено, что Track B и Track C требуют дальнейшей lesson-level разработки.

Не выполнялись:
- изменение catalog JSON;
- изменение sequence JSON;
- изменение governance JSON;
- создание новых Lesson UID;
- изменение опубликованных страниц, URL или frontend;
- production release.

**Итоговый статус:** final_macro_architecture_proposal_ready_for_approval.
