# Миграция каталога и карты знаний на иерархию v2

**Дата:** 8 ноября 2026 года  
**Ветка:** `main`  
**Статус:** implementation complete; catalog CI passed and GitHub Pages build/deployment succeeded for commit `216fde8445b8869250e9cbeab5c43308488f05c9`.

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

- Каталоги Track A и Lessons во всех версиях RU / EN / 中文 загружают `catalog-v2.json` через `DCHCatalogCompat` и группируют опубликованные уроки по Theme и Module.
- Knowledge Map RU использует интерактивную карту из v2; EN / 中文 и главные страницы всех языков используют динамический список планет из того же каталога.
- Заголовки Theme и Module локализованы через `title_i18n`; интерфейс каталога выводит соответствующие переводы.
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

Проверка `Validate learning catalog` run `42440726307` завершилась со статусом `success`: прошли legacy validator, Python/JS compatibility tests, UI migration tests, Node syntax checks, JSON Schema v2, relationship validation и multilingual lesson checks. GitHub Pages build/deployment run `42440726024` для того же commit завершился со статусом `success`.

## 5. Сохранённая совместимость

- Все существующие lesson URLs оставлены без изменений.
- Legacy IDs A.1–A.6 сохранены в `legacy_id`.
- Legacy v1 catalog files остаются в репозитории.
- Перемещение контента между Theme/Module требует явного crosswalk и миграции; автоматическая перенумерация запрещена.

## 6. Следующий учебный шаг

Проверить A.1.2.1 по документу `docs/education/track-a/xai-foundations/A1_2_1_REVIEW.md`, завершить авторскую редакцию RU, затем синхронно вычитать EN/中文. После прохождения quality gates перевести урок в published и добавить его на карту. Далее последовательно декомпозировать и создавать следующие темы Track A, используя AIS как исследовательский ориентир, но не копируя материалы.
