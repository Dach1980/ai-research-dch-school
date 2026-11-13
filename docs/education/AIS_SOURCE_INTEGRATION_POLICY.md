# Использование материалов AI Interpretability School при разработке DCH School

**Статус:** рабочая методика разработки; 8 ноября 2026 года.

## 1. Исходный ориентир

Основной внешний учебный референс для Track A и Track B — публичная программа AI Interpretability School (AIS): https://ai-interpretability.school/.

На странице программы указаны авторы Sabrina Sadiekh и Elena Ericheva, два направления — Track A (XAI Practitioner) и Track B (Math of LLMs), а также последовательность тематических блоков от введения и линейных моделей до оценки объяснений и механистической интерпретируемости.

AIS используется как **исследовательский и педагогический ориентир**, а не как готовая программа DCH. Нумерация и названия модулей AIS не переносятся в идентификаторы DCH.

## 2. Принципы переработки

1. Изучать структуру, prerequisites, последовательность понятий, типы примеров и лабораторных работ.
2. Формировать собственные learning outcomes, объяснения, схемы, примеры, задания и эталонные ответы.
3. Не копировать длинные фрагменты текста, иллюстрации, задания, исходный код или структуру страниц.
4. Для каждого существенного научного утверждения находить и цитировать первоисточник: статью, документацию метода, учебник или официальный технический материал. Сайт AIS — источник учебной композиции, но не единственное доказательство научного утверждения.
5. Отдельно фиксировать: наблюдение об источнике, интерпретацию команды DCH и авторское решение DCH.
6. Разделять обязательное ядро, математическое углубление и исследовательскую практику.
7. Не объявлять урок опубликованным до проверки содержания, ссылок, практики, ответов и эквивалентности RU/EN/中文.

## 3. Предварительный crosswalk Track A

| Референс AIS | Содержание источника | Рабочая область DCH | Решение |
|---|---|---|---|
| 00 Introduction | Введение, устройство курса, prerequisites, self-check по ML | Theme A.1 / Module A.1.1 | Существующие шесть вводных уроков — база; нужен отдельный аудит полноты и контрольной диагностики |
| 01 XAI motivation, introduction, terminology | Зачем нужна объяснимость, терминология, классификация методов | Theme A.1 / Module A.1.2 | Существующая мультиязычная глава зарегистрирована как A.1.2.1 со статусом review |
| 02 Linear interpretable models | Linear/logistic regression, regularization, GLM/GAM/EBM | Следующая тематическая область Track A | Декомпозиция на модули и уроки после проверки prerequisites |
| 03 Causality and linear models | Причинные графы, propensity score, IV, DML, quasi-experiments | Причинная интерпретация | Сопоставить с принятой архитектурой DCH; не сливать causal identification и heterogeneous effects |
| 04 Nonlinear interpretable models | Деревья, леса, boosting importances, prototype networks | Нелинейные интерпретируемые модели | Отдельная тема после линейных основ |
| 05 Heterogeneous effects | Meta-learners, causal forest, honest splitting | Гетерогенные эффекты | Сохранить отдельно от причинной идентификации |
| 06 Explanation methods pt. 1 | CPO, ICE, PDP, ALE | Глобальное и локальное поведение модели | Проверить терминологию, предпосылки и влияние корреляции |
| 07 Classical methods | Permutation Importance, SHAP, SAGE, LIME, Anchors, counterfactuals | Классические post-hoc методы | Использовать существующий 24-урочный breakdown как proposal, не как утверждённый syllabus |
| 08 Feature interactions | Взаимодействия признаков | Feature interactions | Сопоставить с прозрачными моделями и post-hoc методами |
| 09–14 | CNN, gradients, CAM, axiomatic methods, concepts, attention | Deep learning XAI | Не объединять методы с разными объектами объяснения без явного обоснования |
| 15–16 | Applied LLM analysis, agent behavior | Анализ LLM и поведения инструментальных систем | Разделять black-box поведение и внутреннюю механистическую интерпретацию |
| 17 | Evaluation of explanations | Качество объяснений и научная проверка | Сохранить как самостоятельный завершающий блок |
| 21–24 | Perturbation, attacks, deep dives into SHAP and counterfactuals | Углубления и исследовательские лаборатории | Привязывать к соответствующим темам; не создавать дублирующие обзорные темы |

Этот crosswalk — рабочая карта соответствия, а не утверждение, что один внешний модуль должен стать одним модулем DCH. Окончательные Theme/Module IDs назначаются после содержательного согласования.

## 4. Предварительный crosswalk Track B

Внешний AIS Track B называется *Math of LLMs*. Он даёт основу по математике трансформеров и mechanistic interpretability. В DCH это соответствует Track B (Inside AI), но темы необходимо декомпозировать под собственные prerequisites и лабораторные работы:

| Референс AIS | Содержание | Рабочая область DCH Track B |
|---|---|---|
| 26 | Введение в mechanistic interpretability, curve detectors, induction heads, IOI, обзор методов | Вводная тема B.1 |
| 27 | Математические prerequisites: линейная алгебра, SVD, градиенты, вероятность, энтропия, KL, Fisher, оптимизация | Математическая база B.2 |
| 28 | Transformer internals: attention, QK/OV, LayerNorm, FFN, residual stream, MLP key-value memory, GPT-2 small | Архитектура трансформеров B.3 |
| 29 | Features, superposition, circuits, induction heads, IOI, ACDC/EAP, circuit faithfulness | Features and circuits B.4 |
| 30 | Sparse autoencoders, dictionary learning, transcoders, crosscoders, SAE evaluation | Sparse representations B.5 |
| 31 | Safety through directions in activations, refusal direction, lie detectors, unlearning, alignment audit | Safety and interventions B.6 |
| 32 | Faithfulness, necessity/sufficiency, CoT faithfulness, probing pitfalls | Scientific evaluation B.7 |
| 33 | Developmental interpretability, singular learning theory, phase transitions, grokking | Training dynamics B.8 |
| 34 | Causal interventions, activation/path patching, causal tracing, ROME, steering, VLA | Causal interventions B.9 |
| 35 | Representation geometry, manifolds, CKA, linearity and nonlinear features | Representation geometry B.10 |
| 36 | Probes, amnesic probing, Logit Lens, Tuned Lens, J-lens, Patchscopes, stitching | Reading representations B.11 |

Номера и порядок блоков на странице AIS не всегда идут по возрастанию. DCH использует тематическое соответствие, а не копирует порядок или нумерацию. Точные Theme/Module/Lesson IDs Track B будут закреплены после ревизии утверждённой архитектуры DCH.

## 5. Track C

У DCH Track C (Building with AI) нет прямого аналога среди двух направлений AIS. Для него будет сформирован отдельный source map по первичным источникам: официальной документации LLM runtimes и API, RAG и retrieval, базам данных, безопасности, MCP, evaluation и reproducible engineering. Материалы AIS могут использоваться как дополнительный референс только там, где есть содержательное пересечение.

## 6. Последовательность производства одного урока

1. **Инвентаризация источника:** определить соответствующий блок AIS, дополнительные первоисточники и ограничения лицензирования.
2. **Педагогическая декомпозиция:** сформулировать один центральный вопрос, prerequisites и измеримые outcomes.
3. **Авторский RU draft:** дать интуицию, строгие определения, примеры, ограничения, схему, практику и вопросы.
4. **Научная проверка:** проверить формулы, обозначения, выводы и утверждения по первоисточникам.
5. **Практика:** зафиксировать среду, данные, baseline, шаги, ожидаемые результаты и контрольные эксперименты.
6. **Проверка знаний:** подготовить задания разного уровня и объяснённые эталонные ответы.
7. **Локализация:** создать EN и ZH той же глубины, не сокращая практику и ответы.
8. **Quality gate:** оценка по стандарту DCH; только после прохождения — published и planet.

## 7. Первый элемент следующей производственной последовательности

**A.1.2.1 — «Что такое XAI и зачем нужно объяснять модели?»**

- Основа: существующая мультиязычная глава `lessons/xai/01-what-and-why.html` и данные `lessons/data/xai-01-what-and-why.js`.
- Восемь страниц: мотивация; XAI и Mechanistic Interpretability; области применения; регулирование и ответственность; термины и уровни прозрачности; таксономия методов; примеры и паспорт XAI; итоги и самопроверка.
- Текущий статус каталога: `review`; урок не отображается среди опубликованных планет.
- Следующая работа: постраничный аудит RU/EN/中文, сверка с AIS Module 01, проверка юридических и нормативных утверждений, научных источников, вопросов и ответов; затем исправление RU и синхронная вычитка локализаций.

## 8. Внешний источник

- AI Interpretability School: https://ai-interpretability.school/
- Внешние материалы используются для анализа программы. Публичные материалы DCH должны быть самостоятельной авторской работой с корректными ссылками и без переноса чужих текстов/графики.
