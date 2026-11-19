# Аудит качества урока 7.2.2 и системная профилактика дефектов

**Дата:** 2026-11-20  
**Базовый commit:** `b23d7a7ad23799f007295cf7d5e131d1beac5cd6`  
**Статус:** рефакторинг начат; CI и production-приёмка ожидаются.

## Выявленные причины

1. Старое правило `styles/xai-canonical-lesson.css` задавало светлый цвет всем `li` outcomes. После перехода на светлые карточки текст остался светлым на светлом фоне.
2. `scripts/xai-permutation-importance-lesson.js` генерировал `dl/dt/dd`, хотя Canonical Lesson UI Contract §4.1 требует карточный DOM `.glossary-grid / .glossary-entry / .term-index`.
3. `.pfi-figure` скрывал содержимое через `overflow:hidden`; проверка наличия SVG и ARIA не доказывала отсутствие обрезки.
4. `data/audit-roadmap.json` содержал `audit_log`, а `scripts/admin-roadmap.js` — renderer журнала, но `admin/index.html` не подключал этот скрипт.

## Системные изменения

- Создан единый `scripts/lesson-glossary.js`; 7.2.2 использует его в RU/EN/中文.
- Outcomes возвращены на общие `--lds-*` токены; контраст текста карточек должен соответствовать WCAG AA.
- SVG viewport больше не скрывает часть схемы; на узких экранах включена горизонтальная прокрутка.
- Подключён существующий `scripts/admin-roadmap.js` в административной странице.
- Canonical Lesson UI Contract и Lesson Authoring Template дополнены требованиями повторного использования компонентов и обязательной записи аудитов.
- Browser acceptance расширяется проверками фактического контраста карточек, DOM глоссария и границ SVG.

## Критерии завершения

- [ ] CI и Playwright browser acceptance проходят.
- [ ] RU/EN/中文 проходят в light/dark на 375/768/1440 px.
- [ ] GitHub Pages deployment успешен.
- [ ] Production проверен отдельно от локального CI.
- [ ] Запись AUD-114 видна в админке.
- [ ] Получена пользовательская визуальная приёмка.

Урок 7.2.2 сохраняет статус `review`. На момент записи отчёта CI, production и пользовательская приёмка нового коммита не подтверждены.
