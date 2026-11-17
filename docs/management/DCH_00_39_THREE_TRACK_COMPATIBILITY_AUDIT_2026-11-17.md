# DCH 00–39 ↔ Three-Track Curriculum Compatibility Audit

**Дата:** 2026-11-17  
**Статус:** аудит выполнен; миграция не разрешена и не выполнялась  
**Проверяемая архитектура:** `docs/education/THREE_TRACK_CURRICULUM_ARCHITECTURE_2026.md`  
**Канонические источники сравнения:** `docs/management/DCH_CANONICAL_CURRICULUM_DECISION_2026-11-11.md`, `docs/management/TRACK_A_ARCHITECTURE_PROPOSAL.md`, `docs/management/CURRICULUM_40_MODULE_RECONSTRUCTION.md`, `docs/management/CURRICULUM_CROSSWALK_2026-11-12.md`, `docs/education/TRACK_C_PRIMARY_SOURCE_AUDIT_2026-11-11.md`.

---

## 1. Executive summary

**Вывод: новая трёхтрековая архитектура совместима с целевой навигационной моделью DCH, но пока не совместима с действующим макро-crosswalk 00–39 на уровне прямого переназначения идентификаторов и содержательных границ.** Перед миграцией нужен новый macro crosswalk и уточнение нескольких архитектурных решений.

Подтверждённая старая макромодель:

- 00–10 — общая фундаментальная база (11 позиций; состав и названия исторически рабочие);
- 11–26 — Track A / Understanding AI (16 модулей, архитектура 2026-11-05 утверждена);
- 27–39 — Track B / Inside AI (13 позиций, рабочая архитектура);
- Track C C0–C12 — отдельная программа вне счётчика 40;
- PY.1 — отдельная траектория Python вне счётчика 40.

Новая модель сохраняет три трека, но меняет смысл макрогрупп:

- Foundation становится общей подготовкой, а не четвёртой планетой;
- A получает 44 обязательных урока в пяти темах;
- B пока имеет 8 существующих elective UID и не имеет сформированного обязательного маршрута;
- C получает 31 существующий обязательный UID и 4 elective UID, но пока не закрывает все компетенции C0–C12.

Это не косметическая переклассификация. Она меняет принадлежность вводных материалов, статус переходной зоны 19–25, отношение к Python path и место прикладных визуальных методов.

**Рекомендация:** принять новую архитектуру как целевую редакцию на уровне школы, но не объявлять старые макро-ID 00–39 автоматически эквивалентными новым темам/модулям. Сначала утвердить mapping-таблицу с confidence/status, затем менять catalog и sequence.

## 2. Какие решения являются обязательными ограничениями

| Решение | Источник / дата | Статус для аудита |
|---|---|---|
| Три профессиональных трека A/B/C | DCH canonical decision и planetary map | сохраняется |
| Иерархия Track → Theme → Module → Lesson | DCH canonical decision 2026-11-11 | сохраняется |
| 00–10 Foundation; 11–26 Track A; 27–39 Track B | поздняя редакция решения 2026-11-02 | подтверждённая историческая макрогруппировка |
| Track A 11–26: 16 модулей | решение 2026-11-05 | утверждено; изменение границ требует нового decision record |
| 19–25 — переходная область A→B | решение 2026-11-11 | принято как принцип; не обязательный повторный маршрут |
| Track B 27–39 | рабочая программа MI/Safety | требует детальной спецификации |
| Track C C0–C12 | отдельная практическая программа | структура подтверждена как отдельная программа, lesson-level QA не завершён |
| PY.1 | отдельная траектория | не входит в 40; не является четвёртой планетой |
| Три планеты и визуальная идентичность A/B/C | planetary map visual system | сохраняется; конкретная вложенность тем/модулей/уроков может быть обновлена |

## 3. Сверка диапазонов 00–10

| Старый macro ID | Историческое назначение | Результат сверки с новой моделью | Рекомендация |
|---:|---|---|---|
| 00 | Введение в исследование интерпретируемости | Не является универсальной базовой компетенцией всех треков; ближе к вводной точке Track A | Не переносить целиком в Foundation. Разделить общий вводный контекст AI Research и A-specific XAI orientation; оставить mapping unresolved до согласования outcomes |
| 01 | Инструментарий исследователя | Часть инструментов общая, часть относится к разработке и исследовательской среде | Shared Foundation competency + практическая реализация в C1; не создавать дублирующие уроки |
| 02 | Python для научных вычислений | Новая архитектура относит программирование к C1; PY.1 остаётся отдельной подготовительной траекторией | Основной Python engineering — C1. PY.1 — optional entry/preparatory path. Не помещать полный Python курс в Foundation |
| 03 | NumPy, pandas и визуализация | По новой архитектуре это инженерная обработка данных | Основной owner C2; базовая data literacy — Foundation prerequisite |
| 04 | Алгебра и функции | Общая математическая подготовка | Foundation |
| 05 | Линейная алгебра | Общая база, особенно важна для B | Foundation prerequisite; B может иметь диагностический bridge, но не дублировать весь курс |
| 06 | Анализ и оптимизация | Общая математическая база, для B — существенная | Foundation / B prerequisite bridge; конкретный уровень определить outcomes |
| 07 | Вероятность и статистика | Общая база для A/B/C, особенно оценки и причинного анализа | Foundation |
| 08 | Основы ML | Старая crosswalk содержит только candidate mapping на 3.1.6; новая модель перемещает 3.1.* в C, а часть базовых ML-понятий должна быть общей | Не закреплять macro 08 за одним только C. Разделить conceptual literacy (Foundation/A entry) и implementation/comparison (C2). UID les-a-0049 не считать обязательным уроком A или готовой Foundation страницей без отдельной QA |
| 09 | Deep Learning и PyTorch | Новая модель относит PyTorch и практическое обучение к C3; понимание внутренних блоков нужно B | C3 — implementation; B1 — внутреннее устройство. Shared prerequisites только через competency outcomes, не один UID в двух треках |
| 10 | Научный эксперимент и чтение статей | Часть методологии общая, но исследование объяснений — ключевой результат A; mechanistic experiments — B | Foundation — минимальная исследовательская грамотность; A5 и B4/B5 — специализированные исследовательские протоколы |

### Вывод по Foundation

Новая Foundation из 20 обязательных уроков концептуально возможна, но текущая UID-раскладка в архитектурном документе не доказывает полное покрытие 00–10:

- в Foundation нет полноценного Python курса — это согласуется с переносом практического Python в C и отдельной PY.1;
- в Foundation есть только по одному выбранному уроку из ряда математических областей, поэтому необходимо определить минимальный уровень компетенций, а не считать весь macro 04–07 покрытым;
- macro 00 и часть macro 10 не должны автоматически превращаться в универсальные уроки для всех треков;
- macro 08 и 09 требуют разделения концептуального знания и реализации;
- Foundation должен быть competency-based: входная диагностика может освобождать подготовленного учащегося от уже освоенных уроков.

**Критическая поправка:** не фиксировать «20 UID = полное покрытие 00–10». Это целевой размер Foundation, а не доказательство эквивалентности 11 старым макромодулям.

## 4. Сверка Track A: макромодули 11–26

Новая Track A сохраняет основную специализацию Understanding AI/XAI, но меняет обязательность и размещение ряда тем. По решению 2026-11-05 макроархитектура 11–26 включает вводный ML, интерпретируемые модели, причинность, PDP/ICE/ALE, классические объяснения, interactions, CNN/gradients/CAM/concepts/attention, LLM/agents и quality evaluation.

| Macro ID | Утверждённое макроназначение | Новая целевая раскладка | Совместимость / решение |
|---:|---|---|---|
| 11 | Основы AI и ML; A.1–A.5 + вводный XAI-вопрос | Основные вводные материалы 1.x перемещены в Foundation | **Частичное изменение границы.** Нужен A-entry bridge: кратко связать Foundation с вопросом «зачем объяснять модель». Не дублировать Foundation уроки |
| 12 | Линейные интерпретируемые модели | A1, в том числе 4.1.3 | Совместимо |
| 13 | Нелинейные интерпретируемые модели | Базовая часть 4.1.4 в A1; KNN/SVM/prototypes и GAM/EBM electives | Совместимо при чётком разделении обязательного ядра и advanced electives |
| 14 | Каузальность и причинная интерпретация | 4.4.1–4.4.5 — elective A | Содержательная тема сохранена, но **понижена с макроядра в elective**. Это существенное изменение прежнего решения; требует явного approval |
| 15 | Гетерогенные эффекты | 4.8.1–4.8.5 — elective A | Содержательная тема сохранена, но **понижена с макроядра в elective**. Требует явного approval |
| 16 | PDP, ICE, ALE и поведение модели | 4.3.1–4.3.3 mandatory A2; 4.3.5 elective | Совместимо, если comparative lesson не является prerequisite для понимания базовых графиков |
| 17 | Классические методы XAI | LIME и базовый SHAP в A3; Anchors/counterfactuals в A4 | Совместимо; нужно явно включить обязательные границы методов и не переносить весь macro 17 в один catalog module |
| 18 | Взаимодействия признаков | 4.3.4 elective A | Содержательно сохранено, но переведено из макроархитектуры в elective. Требует решения о том, что именно считается обязательным минимумом A |
| 19 | CNN-based models | 5.6.1–5.6.5 сейчас отнесены к B electives | **Сильное несоответствие.** CNN explanation methods сами по себе не являются mechanistic interpretability. Рекомендация: оставить 5.6 как A elective/vision XAI bridge; B может иметь отдельный internal-CNN elective с другим UID только при необходимости |
| 20 | Gradient explanation heuristics | 5.6.2–5.6.3 отнесены к B electives | **Сильное несоответствие.** Saliency/Integrated Gradients — внешние attribution methods, а не автоматически исследование внутренних механизмов. Перенести primary ownership в A elective |
| 21 | Localization and CAM | 5.6.4 CAM/Grad-CAM отнесены к B electives | **Сильное несоответствие.** CAM/Grad-CAM относятся к visual explanation family. Primary owner — A elective |
| 22 | Concept-based methods | 5.7.1–5.7.3 отнесены к B electives | **Пограничная зона.** TCAV/concept attribution может быть A; внутреннее обнаружение и причинная валидация features — B. Нужны разные learning outcomes; не смешивать под одним уроком |
| 23 | Attention-based explainability | 5.7.4–5.7.5 отнесены к C electives | **Слабое соответствие.** Анализ attention как объяснения относится к A elective; реализация attention/Transformer — C; внутренние attention circuits — B. Нужны разные предметные уроки, один UID не должен обслуживать все три задачи |
| 24 | Applied LLM analysis | 5.8.1–5.8.3 — A electives | Совместимо |
| 25 | Объяснение поведения AI-агентов | 5.8.4–5.8.5 — C electives | **Частично.** Наблюдаемость, tool traces и диагностика — C; объяснение/оценка поведения агента — A. Рекомендуется разделить operational tracing (C) и behavioural explanation/evaluation (A), сохранив текущие UID в C только для operational части |
| 26 | Оценка качества объяснений и научная проверка | 5.9.1–5.9.7 и capstone 5.5.1–5.5.7 — mandatory A | Совместимо по назначению, но новая архитектура дробит единый макромодуль 26 на две крупные темы A4/A5. Это допустимое many-to-many mapping; сохранить все критерии quality evaluation |

### Ключевой конфликт Track A

Новая модель задаёт 44 обязательных урока, но в прежней утверждённой макроархитектуре 14, 15 и 18 были самостоятельными модулями, а 19–25 — часть переходного ядра A→B. В новой модели:
- 14 и 15 становятся electives;
- 18 становится elective;
- 19–21 переводятся в B electives;
- 22 переводится в B elective;
- 23 — в C elective;
- 25 — в C elective.

Это не просто уточнение количества уроков. Это изменение обязательного содержания и primary ownership макромодулей 14, 15, 18–25. Оно должно быть внесено в новый decision record с явной ссылкой на пользовательское решение от 2026-11-17. До этого нельзя считать старый Track A macro sequence и новый A sequence эквивалентными.

## 5. Сверка Track B: макромодули 27–39

Старая рабочая программа Track B охватывает:

27 Introduction to Mechanistic Interpretability; 28 Transformer internals; 29 probes/lenses; 30 causal interventions; 31 circuit discovery; 32 features/superposition/dictionary learning; 33 SAEs; 34 activation steering/knowledge editing; 35 AI Safety; 36 robustness/adversarial attacks; 37 developmental interpretability; 38 advanced research frontiers; 39 capstone.

Новая архитектура B из пяти тем логически совместима с этим набором направлений:

- B1 — внутреннее устройство нейросетей;
- B2 — представления и признаки;
- B3 — probes и lenses;
- B4 — circuits и causal interventions;
- B5 — sparse features/SAE и механистическая интерпретация.

Но это **совместимость на уровне тематических кластеров, а не mapping 13 макромодулей в готовые уроки**.

Текущие 8 UID (5.6.1–5.6.5 и 5.7.1–5.7.3) не закрывают обязательное ядро B:
- CNN saliency/CAM — в основном внешние методы объяснения;
- TCAV/concept coverage — bridge/feature interpretation, но не полный circuit/SAE curriculum;
- отсутствуют реальные lesson UID по Transformer internals, probes/lenses, activation/path patching, circuit discovery, superposition, SAE training/validation, steering, safety и developmental interpretability.

**Рекомендация:** считать B curriculum gap. Не присваивать восемь текущих elective UID автоматически обязательным урокам B. В новой программе B нужны собственные learning outcomes, лаборатории и новые UID после утверждения содержания. Macro 39 capstone требует отдельного проектного задания и assessment rubric.

## 6. Сверка Track C: C0–C12

Первичный аудит C0–C12 подтверждает 13 модулей:
- C0 Local AI;
- C1 Hardware;
- C2 Model formats;
- C3 LM Studio;
- C4 Generation;
- C5 API;
- C6 Python;
- C7 MCP basics;
- C8 MCP servers;
- C9 MCP Web Search;
- C10 RAG;
- C11 Diagnostics/security;
- C12 Capstone.

Новая пяти-темная карта C (engineering tools; data/ML; deep learning/local inference; LLM applications/integrations; reliability/operations) может вместить все 13 модулей без изменения их предметного назначения. Это наиболее естественная совместимость новой модели с прежней отдельной программой C.

Однако текущие 35 UID, отнесённые в новом документе к C, не означают 35 полноценных C lessons:
- 2.1.* — исследовательская среда/reproducibility;
- 2.2.* — Python;
- 2.3.* — NumPy/pandas/EDA;
- 3.1.* — классический ML;
- 3.2.* — Deep Learning/PyTorch/Transformer basics;
- 5.7.4–5.7.5 и 5.8.4–5.8.5 — elective bridges.

Эти материалы закрывают только часть компетенций C0–C12. В частности, по UID пока нет подтверждённого полного покрытия LM Studio lifecycle, model formats/quantization, generation settings, API/streaming, MCP, Web Search, RAG, security/observability и capstone.

**Вывод:** сохранять C0–C12 как исходный syllabus и перегруппировать его в пять тем C. Текущие 2.x/3.x UID — foundation/bridge для C, но не считать их заменой уроков C0–C12. В C5–C12 остаются существенные lesson-level gaps.

## 7. PY.1 и общая подготовка

PY.1 исторически отдельная траектория Python с нуля, не входящая в 40 модулей и не являющаяся четвёртой планетой.

Новая модель может сохранить PY.1 как подготовительный ресурс перед C1/C6 и как optional route для учащихся без Python. При этом:
- Foundation не должен превращаться в дублирующий полный Python course;
- C6 должен задавать входные требования и диагностический тест;
- PY.1 закрывает prerequisite gaps, но не становится обязательной частью каждого трека;
- для Track B Python competency проверяется диагностически и дополняется B-specific scientific Python/experiment practice, если это нужно.

## 8. Карта планет и навигация

Новая навигационная модель (главная: три планеты; Foundation как общий portal; внутри трека пять крупных тем; уроки доступны после входа в тему) совместима с требованием сохранить три планеты.

Она **намеренно изменяет** более ранний визуальный proposal 2026-11-11, где темы описывались как крупные планеты/сектора, модули как спутники, уроки как малые планеты/точки маршрута. В новой модели:
- три планеты остаются только тремя профессиональными треками;
- пять тематических областей отображаются на карте трека;
- модули и уроки не выводятся на главную карту;
- уроки открываются на странице темы/модуля;
- Foundation — общий portal, а не дополнительная планета.

Это изменение дизайна нужно отразить в design system и frontend, но не является конфликтом с макро-ID 00–39.

## 9. Сводная матрица совместимости

| Область | Совместимость | Основная проблема | Решение до миграции |
|---|---|---|---|
| Три трека A/B/C | высокая | нет | сохранить |
| Foundation вместо отдельной планеты | высокая | 00–10 пока не имеют полного confirmed content mapping | создать competency-based Foundation crosswalk |
| Track A 11–26 | частичная | macro 14/15/18–25 изменяют mandatory/elective/owner | отдельное решение об изменении macro scope |
| Track B 27–39 | частичная | пять тем подходят, но обязательный syllabus и UID отсутствуют | разработать B syllabus и gap register |
| Track C C0–C12 | высокая на уровне структуры | текущие UID не покрывают программу | сохранить C0–C12 и сделать lesson-level crosswalk |
| PY.1 | высокая при разделении ролей | риск дублирования Python между PY.1, Foundation и C6 | оставить optional prerequisite route |
| Planetary navigation | высокая | старый visual proposal показывает уроки прямо на карте | заменить визуальную иерархию на approved four-level navigation |
| UID/URL/progress | условная | старые 1.x–5.x codes и UID привязаны к Track A catalog | сохранить UID/URL; мигрировать ownership через alias/redirect/progress audit |

## 10. Обязательные решения, которые нужно зафиксировать до catalog migration

1. **Macro 11:** подтверждается ли перенос основного вводного AI/ML блока в Foundation с коротким A-specific entry bridge?
2. **Macro 14 и 15:** остаются ли причинность и heterogeneous effects элективами A или часть их содержания должна быть обязательной? Это наиболее значимое изменение ранее утверждённой архитектуры Track A.
3. **Macro 18:** feature interactions полностью elective или базовая компетенция входит в A2?
4. **Macro 19–21:** вернуть CNN/gradient/CAM visual explanation lessons в A electives вместо B?
5. **Macro 22:** разделить TCAV/concept attribution (A elective) и mechanistic feature discovery (B core/elective)?
6. **Macro 23:** разделить attention explainability (A), Transformer implementation (C) и attention circuits (B)?
7. **Macro 25:** разделить agent trace observability (C) и explanation/evaluation of agent behaviour (A)?
8. **Macro 26:** принять разбиение quality evaluation и capstone между A4/A5?
9. **Track B:** подтвердить 35-урочный целевой объём как ориентир, не создавать искусственные уроки; определить обязательный набор по пяти темам.
10. **Track C:** подтвердить C0–C12 как canonical module layer, сгруппированную в пять новых themes; уточнить, какие из 31 существующих UID — prerequisite/bridge, а какие можно зачесть в C modules.
11. **Foundation:** утвердить 20 уроков как стартовый маршрут только после competency/outcome review; не заявлять, что они полностью покрывают все 00–10.
12. **PY.1:** подтвердить роль optional Python readiness path перед C/B.

## 11. Рекомендуемый порядок последующих работ

### Phase 1 — architecture decision (до миграции)
- Внести отдельный decision record от 2026-11-17, который supersedes прежнюю макрогруппировку только в тех местах, где пользователь явно утвердил новое распределение.
- Утвердить пункты 1–12 выше.
- Сохранить старые 00–39 IDs как historical macro identifiers; не удалять их и не перенумеровывать.

### Phase 2 — canonical crosswalk
Создать новую таблицу со столбцами:
`legacy_macro_id`, `legacy_macro_title`, `new_track_or_foundation`, `new_theme_id`, `new_module_uid`, `lesson_uid`, `relationship` (exact/partial/split/bridge/elective/gap), `confidence`, `decision_ref`.

Правило: один macro ID может связываться с несколькими темами/модулями, и наоборот; но каждый Lesson UID имеет один primary owner.

### Phase 3 — curriculum gaps
- B: спроектировать mandatory learning outcomes и labs для 27–39.
- C: построить C0–C12 → пяти themes mapping и gap list.
- Foundation: провести входную competency review и решить, какие 20 уроков действительно нужны всем трём трекам.
- A: подтвердить обязательность причинности, heterogeneity, feature interactions и переходной зоны 19–25.

### Phase 4 — catalog/sequence design
- проверить schema и все consumers;
- не переназначать published UID без сохранения history/aliases;
- завести отдельные sequence: Foundation, A, B, C;
- electives сделать non-blocking;
- добавить prerequisite diagnostic routes;
- сохранить legacy lesson codes/URLs и прогресс.

### Phase 5 — implementation QA
- 40/40 legacy macro IDs имеют явный mapping status, даже если `unresolved` или `gap`;
- каждый из 167 UID имеет один primary owner;
- 5 themes на каждом треке;
- не более 10 mandatory lessons на theme;
- Foundation 20 как target, A 44 mandatory, B target 35 (пока gap), C 31 existing mandatory + 4 elective bridges (не считать готовым C syllabus);
- no duplicate UID, no missing prerequisites, no blocking elective dependencies;
- all published URL/progress mappings preserved;
- production release остаётся запрещённым до отдельного approval.

## 12. Техническая граница этого аудита

В рамках аудита:
- прочитаны актуальные документы реконструкции 40 модулей, canonical decision, Track A architecture, crosswalk, RM-02 audit, Track C source audit, planetary visual system и новый three-track architecture;
- проверена логика распределения всех 167 Lesson UID в новом документе;
- не изменялись catalog JSON, sequence JSON, governance JSON, старые crosswalk, lesson pages, frontend или production settings;
- не создавались новые UID и не менялись URL.

Аудит не является подтверждением готовности содержимого уроков и не заменяет отдельную проверку первичных материалов каждого курса.

---

**Итоговый статус:** `compatibility_review_complete_with_decisions_required`. Новая архитектура пригодна как целевая модель школы, но catalog migration заблокирована до фиксации решений раздела 10 и выпуска нового macro crosswalk.
