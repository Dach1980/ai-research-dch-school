# Иерархическая нумерация DCH School

Статус: принято для каталога v2.1. Дата: 2026-11-08.

## Структура

Track A
└── Theme A.1 — Основы искусственного интеллекта и объяснимости
    ├── Module A.1.1 — Основы AI и машинного обучения
    │   └── Lessons A.1.1.1–A.1.1.6 (legacy A.1–A.6)
    └── Module A.1.2 — Введение в Explainable AI (XAI)
        └── Lesson A.1.2.1 (review; existing multilingual XAI introduction)

## Правила

- Track — направление с постоянным техническим кодом A/B/C. Порядок отображения треков не влияет на коды дочерних сущностей.
- Theme — тема внутри трека: A.1.
- Module — учебный модуль внутри темы: A.1.1.
- Lesson — урок внутри модуля: A.1.1.1.
- Коды — устойчивые идентификаторы, а не позиции в отсортированном списке. Новая тема получает следующий свободный код внутри трека; модуль — внутри темы; урок — внутри модуля.
- Перемещение содержания между родителями требует явной миграции и crosswalk; автоматическая перенумерация запрещена.
- Технические ID не выводятся из URL. Старые ID сохраняются в legacy_id, опубликованные URL не меняются.
- Если когда-либо меняется код самого трека, это отдельная миграция; простая перестановка карточек не меняет код.

## Crosswalk текущих материалов

| Уровень | Новый код | Legacy ID |
|---|---|---|
| Track | A | track-a |
| Theme | A.1 | theme-a1-foundations |
| Module | A.1.1 | module-11 |
| Module | A.1.2 | new XAI foundations module |
| Lessons | A.1.1.1–A.1.1.6 | A.1–A.6 |
| Lesson | A.1.2.1 | existing XAI introduction; status review |

Production catalogue, Track A lesson list and Knowledge Map now read catalog v2 through the compatibility adapter. The v1 split JSON files remain in the repository as a legacy source and fallback for older consumers; their URLs are unchanged. Lesson A.1.2.1 is in review and is not shown as a published planet.
