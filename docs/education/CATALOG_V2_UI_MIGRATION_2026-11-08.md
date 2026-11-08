# Миграция каталога и карты знаний на иерархию v2

**Дата:** 8 ноября 2026 года  
**Ветка:** `main`  
**Статус:** implementation complete; awaiting final CI and Pages deployment verification.

## 1. Целевая модель

Единая иерархия каталога: **Track → Theme → Module → Lesson**.

Для текущего Track A:
- Track A — Understanding AI;
- Theme A.1 — Основы искусственного интеллекта и объяснимости;
- Module A.1.1 — Основы AI и машинного обучения;
- Lessons A.1.1.1–A.1.1.6 — прежние A.1–A.6;
- Module A.1.2 — Введение в Explainable AI (XAI);
- Lesson A.1.2.1 — существующая мультиязычная вводная глава, статус review.

## 2. Что переключено

- Track A lesson catalogue загружает `catalog-v2.json` через `DCHCatalogCompat` и группирует опубликованные уроки по Theme и Module.
- Knowledge Map загружает тот же v2 source, отображает иерархические IDs, использует новые prerequisites и фильтрует планеты Track A.
- Главная страница показывает новые lesson IDs A.1.1.1–A.1.1.6.
- Опубликованные URL RU/EN/中文 не менялись.
- Старые split-файлы `lessons.json`, `modules.json`, `planets.json` сохранены для legacy consumers; они больше не являются источником данных для production Track A catalogue и Knowledge Map.
- Compatibility adapter сохраняет преобразование старых ID в новые и поле `legacy_id`.

## 3. Публикационный статус нового XAI материала

`A.1.2.1` зарегистрирован как `review`, не включён в planets и не появляется среди опубликованных уроков. Он основан на существующей главе `lessons/xai/01-what-and-why.html` с восемью частями и языками RU/EN/中文. Перед публикацией необходим отдельный научный, нормативный, педагогический и мультиязычный аудит.

## 4. Регрессионные проверки

Добавлены/обновлены проверки:
- browser adapter: v1 crosswalk, v2 hierarchy, загрузка `catalog-v2.json`, prerequisites и review lesson;
- UI migration: script loading order, v2 data source, grouping by theme/module, homepage hierarchical IDs;
- existing site integrity tests now expect v2 map adapter.

Полный результат GitHub Actions и Pages deployment фиксируется после завершения текущих запусков.

## 5. Сохранённая совместимость

- Все существующие lesson URLs оставлены без изменений.
- Legacy IDs A.1–A.6 сохранены в `legacy_id`.
- Legacy v1 catalog files остаются в репозитории.
- Перемещение контента между Theme/Module требует явного crosswalk и миграции; автоматическая перенумерация запрещена.

## 6. Следующий учебный шаг

Проверить A.1.2.1 по документу `docs/education/track-a/xai-foundations/A1_2_1_REVIEW.md`, завершить авторскую редакцию RU, затем синхронно вычитать EN/中文. После прохождения quality gates перевести урок в published и добавить его на карту. Далее последовательно декомпозировать и создавать следующие темы Track A, используя AIS как исследовательский ориентир, но не копируя материалы.
