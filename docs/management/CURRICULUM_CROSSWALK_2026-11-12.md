# DCH School — crosswalk 40 макромодулей и каталога

**Дата сверки:** 2026-11-12  
**Ветка:** `main`  
**Статус:** актуальная инвентаризационная матрица; mapping не означает автоматического утверждения содержания или production-публикации.

## 1. Каноническая архитектура

Единая иерархия школы: **Track → Theme → Module → Lesson**. Различаем три уровня:

1. **40 макропозиций программы** — сквозные номера 00–39.
2. **Детализированный каталог Track A** — 5 Theme UID, 27 Module UID и 55 Lesson UID.
3. **Track C C0–C12** и **PY.1** — отдельные траектории, не входящие в 40 макропозиций.

| Диапазон | Назначение | Статус |
|---|---|---|
| 00–10 | Общая фундаментальная база | Рабочая архитектура; нужны outcomes, практики, prerequisites и приёмка |
| 11–26 | Track A — Understanding AI | 16 макромодулей; архитектура утверждена 2026-11-05 |
| 27–39 | Track B — Inside AI | Рабочая архитектура; нужна дальнейшая детализация и утверждение |
| C0–C12 | Track C — Building with AI | Отдельная программа вне счётчика 40 |
| PY.1 | Python с нуля | Отдельная траектория вне счётчика 40 |

**Важно:** детализированная структура Track A из 5 Theme / 27 Module UID не отменяет архитектуру Track A из 16 макромодулей. Их связь — many-to-many. Нельзя автоматически переименовывать или перенумеровывать catalog UID ради совпадения с макро-ID.

## 2. Снимок каталога

| Показатель | Значение |
|---|---:|
| Theme UID | 5 |
| Module UID | 27 |
| Lesson UID | 55 |
| Published / published | 15 |
| Planned / outline_only | 40 |
| Review | 0 |
| Каталог | `migration_staging` |

Опубликованные записи имеют три локализованных URL RU / EN / 中文. Каталог остаётся в состоянии `migration_staging`; эта сверка не переводит его в production.

## 3. Crosswalk по всем 40 макропозициям

В колонке «Lesson UID» указаны только реальные UID, присутствующие в текущем каталоге. Пустая колонка означает отсутствие подтверждённой записи, а не отсутствие темы в программе.

| Макро-ID | Группа | Название макромодуля | Theme UID | Catalog Module UID | Lesson UID (код) | Уверенность / статус mapping |
|---:|---|---|---|---|---|---|
| 00 | Foundation | Введение в исследование интерпретируемости | нет | нет | — | low / not_yet_mapped |
| 01 | Foundation | Инструментарий исследователя | кандидат thm-a-02 | mod-a-02-01 | — | low / candidate_only |
| 02 | Foundation | Python для научных вычислений | кандидат thm-a-02 | mod-a-02-02 | — | low / candidate_only |
| 03 | Foundation | NumPy, pandas и визуализация данных | кандидат thm-a-02 | mod-a-02-03 | — | low / candidate_only |
| 04 | Foundation | Математика I: алгебра и функции | кандидат thm-a-02 | mod-a-02-04 | — | low / candidate_only |
| 05 | Foundation | Математика II: линейная алгебра | кандидат thm-a-02 | mod-a-02-05 | — | low / candidate_only |
| 06 | Foundation | Математика III: анализ и оптимизация | кандидат thm-a-02 | mod-a-02-06 | — | low / candidate_only |
| 07 | Foundation | Математика IV: вероятность и статистика | кандидат thm-a-02 | mod-a-02-07 | — | low / candidate_only |
| 08 | Foundation | Основы машинного обучения | кандидат thm-a-03 | mod-a-03-01 | les-a-0049 (3.1.6) | low / candidate_only |
| 09 | Foundation | Deep Learning и PyTorch | кандидат thm-a-03 | mod-a-03-02 | — | low / candidate_only |
| 10 | Foundation | Научный эксперимент и чтение статей | кандидат thm-a-02 | mod-a-02-08 | — | low / candidate_only |
| 11 | Track A | Основы AI и машинного обучения | thm-a-01 | mod-a-01-01; mod-a-01-02; mod-a-01-03; mod-a-01-04; mod-a-01-05 | les-a-0001 (1.1.1)<br>les-a-0002 (1.1.3)<br>les-a-0003 (1.2.1)<br>les-a-0004 (1.2.2)<br>les-a-0005 (1.2.5)<br>les-a-0006 (1.2.6)<br>les-a-0007 (1.3.1)<br>les-a-0008 (1.3.2)<br>les-a-0053 (1.3.3)<br>les-a-0054 (1.3.4)<br>les-a-0055 (1.3.5)<br>les-a-0009 (1.3.6)<br>les-a-0010 (1.4.1)<br>les-a-0011 (1.4.2)<br>les-a-0012 (1.4.3)<br>les-a-0013 (1.4.4)<br>les-a-0014 (1.4.5)<br>les-a-0015 (1.5.6)<br>les-a-0043 (1.5.1)<br>les-a-0044 (1.5.2)<br>les-a-0045 (1.5.3)<br>les-a-0046 (1.5.4)<br>les-a-0047 (1.5.5)<br>les-a-0048 (1.5.7)<br>les-a-0050 (1.2.4)<br>les-a-0051 (1.1.2)<br>les-a-0052 (1.1.4) | medium / mapped |
| 12 | Track A | Линейные интерпретируемые модели | thm-a-04 | mod-a-04-01 | les-a-0016 (4.1.3) | medium / partial |
| 13 | Track A | Нелинейные интерпретируемые модели | thm-a-04 | mod-a-04-01 | les-a-0017 (4.1.4) | medium / partial |
| 14 | Track A | Каузальность и причинная интерпретация | thm-a-04 | mod-a-04-04 | — | low / planned_only |
| 15 | Track A | Гетерогенные эффекты | нет | нет | — | low / missing_catalog_mapping |
| 16 | Track A | Глобальное и локальное поведение модели: PDP, ICE, ALE | thm-a-04 | mod-a-04-03 | les-a-0024 (4.3.1)<br>les-a-0025 (4.3.2)<br>les-a-0026 (4.3.3)<br>les-a-0028 (4.3.5) | low / planned_only |
| 17 | Track A | Классические методы объяснения моделей | thm-a-04 | mod-a-04-02; mod-a-04-05; mod-a-04-06; mod-a-04-07; mod-a-05-03; mod-a-05-04 | les-a-0018 (4.2.1)<br>les-a-0019 (4.2.2)<br>les-a-0020 (4.2.3)<br>les-a-0021 (4.2.4)<br>les-a-0022 (4.2.5)<br>les-a-0023 (4.2.6)<br>les-a-0029 (4.5.1)<br>les-a-0030 (4.5.2)<br>les-a-0031 (4.5.3)<br>les-a-0032 (4.5.4)<br>les-a-0033 (4.5.5)<br>les-a-0034 (4.6.1)<br>les-a-0035 (4.6.2)<br>les-a-0036 (4.6.3)<br>les-a-0037 (4.6.4)<br>les-a-0038 (4.6.5)<br>les-a-0039 (4.6.6)<br>les-a-0040 (4.7.2)<br>les-a-0041 (4.7.3)<br>les-a-0042 (4.7.4) | low / planned_only |
| 18 | Track A | Взаимодействия признаков | thm-a-04 | mod-a-04-03 | les-a-0027 (4.3.4) | low / planned_only |
| 19 | Track A → B bridge | Анализ CNN-based моделей | кандидат thm-a-05 | нет | — | low / missing_catalog_mapping |
| 20 | Track A → B bridge | Градиентные эвристики объяснения | кандидат thm-a-05 | нет | — | low / missing_catalog_mapping |
| 21 | Track A → B bridge | Объяснения на основе локализации и CAM | кандидат thm-a-05 | нет | — | low / missing_catalog_mapping |
| 22 | Track A → B bridge | Concept-based методы | кандидат thm-a-05 | нет | — | low / missing_catalog_mapping |
| 23 | Track A → B bridge | Attention-based explainability | кандидат thm-a-05 | нет | — | low / missing_catalog_mapping |
| 24 | Track A → B bridge | Applied LLM analysis | нет | нет | — | low / missing_catalog_mapping |
| 25 | Track A → B bridge | Объяснение поведения AI-агентов | нет | нет | — | low / missing_catalog_mapping |
| 26 | Track A | Оценка качества объяснений и научная проверка | thm-a-05 | mod-a-05-01; mod-a-05-02; mod-a-05-05 | — | low / planned_only |
| 27 | Track B | Введение в Mechanistic Interpretability | нет | нет | — | low / not_in_catalog |
| 28 | Track B | Внутреннее устройство и декомпозиция Transformer | нет | нет | — | low / not_in_catalog |
| 29 | Track B | Probes, lenses и анализ представлений | нет | нет | — | low / not_in_catalog |
| 30 | Track B | Причинные вмешательства в нейронные сети | нет | нет | — | low / not_in_catalog |
| 31 | Track B | Circuit Discovery и алгоритмическая интерпретация | нет | нет | — | low / not_in_catalog |
| 32 | Track B | Features, superposition и dictionary learning | нет | нет | — | low / not_in_catalog |
| 33 | Track B | Sparse Autoencoders и современные архитектуры | нет | нет | — | low / not_in_catalog |
| 34 | Track B | Activation Steering и редактирование знаний | нет | нет | — | low / not_in_catalog |
| 35 | Track B | Interpretability for AI Safety | нет | нет | — | low / not_in_catalog |
| 36 | Track B | Robustness, adversarial examples и атаки на объяснения | нет | нет | — | low / not_in_catalog |
| 37 | Track B | Developmental Interpretability и динамика обучения | нет | нет | — | low / not_in_catalog |
| 38 | Track B | Продвинутые методы и исследовательские фронтиры | нет | нет | — | low / not_in_catalog |
| 39 | Capstone | Итоговый исследовательский проект | нет | нет | — | low / not_in_catalog |

## 4. Правила интерпретации

- **Каноническая архитектура:** Track A 11–26.
- **Рабочая реконструкция:** 00–10 и 27–39; названия и prerequisites не считать окончательно утверждёнными.
- **mapped / partial:** связь с реальными Theme/Module/Lesson UID существует, но требует содержательной QA.
- **candidate_only:** catalog Module UID — возможное соответствие общей базе, но не окончательное назначение.
- **planned_only:** каталогный блок существует, но уроки ещё не опубликованы.
- **missing_catalog_mapping / not_in_catalog:** не создавать фиктивные UID.
- **Lesson code ≠ UID:** публичный номер и технический UID — разные идентификаторы; сохранять canonical URL и alias policy.

## 5. Ключевые результаты и пробелы

1. Макромодуль **11 «Основы AI и машинного обучения»** связан с пятью деталями Theme 1: `mod-a-01-01` … `mod-a-01-05`.
2. Макромодули **12 и 13** используют общий контейнерный UID `mod-a-04-01`, но разделены по урокам `les-a-0016` (4.1.3) и `les-a-0017` (4.1.4).
3. Макромодули **16 и 18** используют общий UID `mod-a-04-03`; урок 4.3.4 отнесён к взаимодействиям признаков (18), а PDP/ICE/ALE — к (16).
4. Макромодуль **17** связан с таксономией XAI, LIME, SHAP, Anchors и counterfactual. Catalog modules 5.3/5.4 трактуются как углублённые лаборатории, а не самостоятельные макромодули.
5. Для макромодулей **19–25** пока нет отдельных catalog Module UID для CNN, gradients, CAM, concepts, attention, applied LLM и agent behaviour.
6. Макромодуль **26** связан с блоками оценки, advanced attacks и capstone. Уроковые UID ещё не созданы.
7. Общая база 00–10 имеет кандидаты среди catalog Theme 2/3, но связи имеют низкую уверенность.
8. Track B 27–39 пока не имеет catalog UID; его архитектура остаётся рабочей.

## 6. Следующий урок Track A

После опубликованного 1.3.6 следующий урок по детализированной последовательности Theme 1:

- **Код:** 1.4.1
- **Название:** Понятие модели и параметров
- **Lesson UID:** `les-a-0010`
- **Theme UID:** `thm-a-01`
- **Module UID:** `mod-a-01-04`
- **Каталожный статус:** `planned / outline_only`
- **URL:** не назначен до готовности RU / EN / 中文.

Содержательная граница: объяснить модель как отображение входов в выходы, отличие модели от алгоритма обучения, параметры и предсказание. Не дублировать 1.4.2 (обучение и loss), 1.4.3 (переобучение) и 1.5 (оценка качества).

## 7. Источники истины

- `docs/management/DCH_CANONICAL_CURRICULUM_DECISION_2026-11-11.md`
- `docs/management/TRACK_A_ARCHITECTURE_PROPOSAL.md`
- `docs/management/CURRICULUM_40_MODULE_RECONSTRUCTION.md`
- `docs/education/TRACK_A_CURRICULUM.md`
- `data/curriculum-governance-2026-11-11.json`
- `data/catalog/catalog-v3.json`
