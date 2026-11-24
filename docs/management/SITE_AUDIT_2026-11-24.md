# Независимый аудит AI Research DCH School (read-only)

Автор: Claude (Anthropic) · Дата: 2026-11-24 · Репозиторий: `Dach1980/ai-research-dch-school` · HEAD: `3b35ce56b15981836393b86bd37c12fb55e7e105`
Задание: `docs/prompts/site-audit/CLAUDE_CODE_SITE_AUDIT.md`

> Аудит выполнен частично: не было браузера, Lighthouse, axe и статуса CI. Всё непроверенное помечено. В репозиторий и на production ничего не записывалось, исправления не вносились.

## 1. Executive summary

P0 (утечки секретов, потеря контента, подтверждённо сломанная публикация) не обнаружено. Основные проблемы: SEO-контракт, паритет локалей, рассинхронизация тестов с каталогом, «хвосты» миграций.

1. Canonical на `dach1980.github.io` у 12 страниц уроков (6 опубликованных: 1.1.1 и 1.1.2 × RU/EN/ZH). CI проверяет canonical только на 6 других файлах.
2. Нет `robots.txt` и `sitemap.xml`; `hreflang` отсутствует на всех 295 просканированных страницах.
3. EN/ZH-главные расходятся с RU: 3 трека против 4, нет новостей и «О школе», первый пункт навигации — текст заголовка. Track D только на RU и вне каталога v3.
4. Два теста из `validate-catalog.yml` зашиты на 49 опубликованных уроков, в каталоге 51. Локально падают.
5. Ссылка «Открыть планету» на главной ведёт на legacy-страницу с меткой «Составной материал · уроки 1.2.1, 1.2.2, …» в заголовке (подтверждено на live).
6. Деплой не гейтится `validate-catalog.yml`; `migrate-track-a-canonical-urls.yml` имеет `contents: write` и пушит в `main`.
7. Каталог знаний и индекс уроков рендерятся только JS, без `<noscript>`.
8. `supabase-js` грузится с `esm.sh@2` без пина на каждой странице.

Что работает хорошо: RLS и права на уровне колонок, серверная проверка ролей в Edge Functions, отсутствие секретов, 51 урок × 3 локали с файлами на месте, целостная цепочка prev/next (152 из 152), хороший контраст тёмной темы (мин. 6,06:1).

## 2. Scope & evidence

| Параметр | Значение |
|---|---|
| Ветка | `main` (default) |
| HEAD | `3b35ce56…` (2026-11-24 12:16 +1000) |
| Метод | Клон `--depth 50` в песочницу, статический анализ, запуск тестов |
| Live | GET: `/`, `/lessons/a-3-how-machines-learn-from-data.html`, `/tracks/mathematical-research-foundations.html` |

Ограничения: нет браузера (нет responsive-проверки, Lighthouse, axe, CWV, keyboard-прогона); статус GitHub Actions получить не удалось (rate limit API); `robots.txt` и `sitemap.xml` на live не запрашивались — их отсутствие выведено из репозитория.

## 3. Architecture map

- Статический сайт на GitHub Pages (`path: .` — весь корень репо, CNAME `dchai.ru`).
- Страницы: `index{,-en,-zh}.html`, `tracks/` (A, B, C × 3 локали; D только RU), `lessons/` (266 файлов: 169 реальных, 96 redirect-заглушек), `learning-map/`, `news/` (RU), `about/`, `auth/`, `account/`, `admin/`, `feedback/`, `legal/privacy.html`.
- Общий слой: `styles/main.css` (+ `@import` theme/palette/code-blocks и Google Fonts), `lesson-design-system.css`, ~24 `lesson-NNN.css`, 8 `xai-*.css`; `scripts/main.js`, `language-switcher.js`, `theme-system.js`, `account-ui.js`, 15 `xai-*-lesson.js`.
- Данные: `data/catalog/catalog-v3.json` (3 трека, 40 модулей, 182 урока: 51 published, 131 planned) + legacy v1/v2/canonical-v1.
- Внешнее: Supabase (auth, RLS, 2 Edge Functions), esm.sh, Google Fonts.
- Публикация: `pages.yml` (validate → validate-supabase-migrations → deploy → live smoke на 9 URL). Отдельно, без блокировки деплоя: `validate-catalog.yml`, `lesson-svg-audit.yml`, `supabase-migration-ci.yml`, `migrate-track-a-canonical-urls.yml`.

## 4. CI & production health

Production: `https://dchai.ru/` отдаёт 200 и совпадает с `index.html` из репозитория. Следов `vercel.app` в публичных HTML нет.

CI: статус runs **не проверен**. Локальное воспроизведение:

| Проверка | Результат |
|---|---|
| `lesson_quality_gate.py` | PASS (только 14 канонических файлов) |
| `validate-catalog.py` | PASS (на legacy-каталоге, 8 уроков) |
| `validate-multilingual-lessons.py`, `validate-a6.py` | PASS |
| Python-тесты | 53 из 62 файлов проходят |
| Node-тесты | 2 из 2 |
| Browser-тесты | не запускались |

Падают: `test_knowledge_map.py:18` и `test_locale_grid_theme_parity.py:103` (ожидают 49, в каталоге 51; оба в `validate-catalog.yml`); `test_lesson_1011_shapley.py` (ждёт `review`, в каталоге `published`); `test_lesson_123/124/142_multilingual.py` и `test_glossary_layout_contract.py` (читают legacy-slug'и, ставшие заглушками); `test_supabase_alias_resolver.py` («NO TESTS RAN»). Последние шесть вне CI.

## 5. Findings

| ID | Категория | Severity | Conf. | Суть |
|---|---|---|---|---|
| AUD-001 | SEO/Arch | High | High | Canonical на `dach1980.github.io` у 12 страниц |
| AUD-002 | QA | High | High | Тесты в CI зашиты на 49 уроков, в каталоге 51 |
| AUD-003 | UX/i18n | High | High | EN/ZH-главные расходятся с RU; Track D только RU, вне каталога |
| AUD-004 | SEO | High | High (репо) / Med (live) | Нет sitemap.xml, robots.txt, hreflang |
| AUD-005 | SEO | Medium | High | Пробелы canonical/OG/description |
| AUD-006 | UX/SEO | Medium | High | Composite-страницы индексируются, светят служебную метку |
| AUD-007 | CI | Medium | High | Деплой не гейтится validate-catalog; `cancel-in-progress` на деплое; узкий smoke |
| AUD-008 | Security/Ops | Medium | High | Workflow с `contents: write` пушит в `main` |
| AUD-009 | QA | Medium | High | 6 тест-файлов вне CI, часть падает |
| AUD-010 | Security/SEO | Medium | High | Pages публикует весь корень; drafts-дубль; Terms-ссылка на `.md` |
| AUD-011 | Security/Privacy/Perf | Medium | High | `esm.sh@2` без пина на каждой странице; Google Fonts `@import` |
| AUD-012 | UX/A11y/SEO | Medium | High | Каталог и индекс уроков только через JS |
| AUD-013 | Admin | Medium | Medium | CORS-дефолт Edge Functions `dach1980.github.io` |
| AUD-014 | Architecture | Medium | High | Четыре поколения каталога; validate-catalog.py проверяет legacy |
| AUD-015 | UX/i18n | Low | High | Account-навигация захардкожена на русском |
| AUD-016 | A11y | Medium | Medium | Skip-link не найден; часть токенов светлой темы ниже 4,5:1 |
| AUD-017 | Perf | Low | Low | Гипотеза: `@import`-цепочка, per-lesson CSS/JS |
| AUD-018 | Admin | Low | High | Клиентский gate косметический, двойная загрузка скрипта |
| AUD-019 | Privacy | Low | Medium | Audit-триггер хранит строки `profiles` целиком |
| AUD-020 | Legal | Low | Medium | Privacy — черновик, нигде не слинкован |
| AUD-021 | SEO | Low | High | 96 заглушек с JS-only редиректом |
| AUD-022 | Arch | Low | High | `language-switcher.js`: жёсткие whitelist'ы и legacy-путь |

### Подробности

**AUD-001.** Где: `lessons/a-1-1-1{,-en,-zh}.html`, `a-1-1-2{,-en,-zh}.html` (опубликованы по каталогу) + 6 legacy-алиасов (`a-1-what-is-artificial-intelligence*`, `1-1-2-history-of-ai*`). Доказательство: `<link rel="canonical" href="https://dach1980.github.io/ai-research-dch-school/lessons/…">`. Влияние: противоречивый сигнал о каноническом хосте, нарушение контракта. Рекомендация: canonical → `https://dchai.ru/lessons/<file>`, расширить CI-проверку на все `url_i18n`. Риск: Low. Проверка: canonical каждой опубликованной страницы = `https://dchai.ru/` + путь.

**AUD-002.** `tests/test_knowledge_map.py:18`, `tests/test_locale_grid_theme_parity.py:103`: `AssertionError: 51 != 49`. validate-catalog красный на коммитах с урочным контентом; в истории повторяющийся паттерн «Align … test with accepted catalog state». Рекомендация: считать ожидаемое число из каталога. Риск: Low.

**AUD-003.** RU `index.html`: 4 трека, новости, «О школе». `index-en.html` и `index-zh.html`: 3 трека, без новостей и «О школе»; первый пункт навигации — заголовок секции. `tracks/mathematical-research-foundations.html` только на RU (live: 25 уроков, все «готовится»); в `catalog-v3.json` 3 трека; в regex `isTrack` переключателя языка Track D отсутствует. Нарушает пункт 8 контракта. Требует решения владельца. Риск: Medium (каталог, переключатель языка). Проверка: одинаковое число карточек и пунктов навигации в RU/EN/ZH.

**AUD-004.** Нет `robots.txt`, `sitemap.xml`, `404.html`; `hreflang` отсутствует на всех 295 страницах. Рекомендация: sitemap из `catalog-v3.json` (published, `dchai.ru`), `robots.txt`, взаимные hreflang с `x-default`. Риск: Low для новых файлов, Medium для массовой правки `<head>`.

**AUD-005.** Из 169 реальных страниц уроков: без description 25, без OG 32, без canonical 17 (включая composite-страницы и опубликованный `a-7-1-2-les-a-0169-zh.html`). Главные RU/EN/ZH без canonical и OG.

**AUD-006.** 12 файлов `a-3/a-4/a-5/a-6-…` × 3 локали, в каталоге v3 отсутствуют. Live: `<title>` содержит «Составной материал · уроки 1.2.1, 1.2.2, 1.2.5, …»; нет `noindex` и canonical. На главной карточка «1.2.1 — AI, Machine Learning и Deep Learning» имеет ссылку «Открыть планету» на `a-3-…`. Рекомендация: исправить `href` (S); судьбу composite-страниц решает владелец (учебный контент).

**AUD-007.** `pages.yml` не включает `test_knowledge_map`, `test_locale_grid_theme_parity` и ряд шагов `validate-catalog.yml`; деплой от него не зависит. `cancel-in-progress: true` на деплое. Smoke: главная + уроки 9.1.2, 9.1.3, 9.2.1; не покрывает 10.1.1 и не проверяет canonical/hreflang.

**AUD-008.** `.github/workflows/migrate-track-a-canonical-urls.yml`: `permissions: contents: write`, триггер `push` с paths-фильтром без фильтра веток, `git add -A`, `git push origin main`. Автокоммит в `main` без ревью; вероятно, неактуальная разовая миграция.

**AUD-009.** Вне CI: `test_glossary_layout_contract`, `test_lesson_1011_shapley`, `test_lesson_123/124/142_multilingual`, `test_supabase_alias_resolver`. Починить и подключить либо архивировать.

**AUD-010.** `upload-pages-artifact path: .` + `.nojekyll`: публикуются `docs/` (142 файла, 2,6 МБ), `supabase/` (включая `ops/`), `tests/`, `drafts/`, `preview/`, `archive/`. `drafts/lessons/a-6-1-2-{ru,en,zh}.html` — дубль опубликованного 6.1.2 без `noindex`/canonical. `auth/index.html` ссылается на `../docs/legal/TERMS_DRAFT.md` и `PRIVACY_POLICY_DRAFT.md` (чекбокс скрыт при `registrationEnabled: false`). Live-доступность этих путей не проверялась. Требует архитектурного решения.

**AUD-011.** `account-ui.js` подключён на всех страницах и делает `import("https://esm.sh/@supabase/supabase-js@2")` для каждого посетителя; то же в `auth.js`, `auth-callback.js`, `account.js`, `admin-auth.js`, обеих Edge Functions. `main.css` строка 4: `@import` Google Fonts. Влияние: дрейф версии, зависимость от esm.sh, сторонние запросы (см. `docs/legal/RUSSIA_DATA_LOCALIZATION_REVIEW_2026-11-13.md`), блокирующая цепочка запросов. Рекомендация: пин версии, загрузка только на auth/account/admin, шрифты через preload или self-host. Риск: Medium.

**AUD-012.** Главная: «Загружаем каталог знаний…»; `lessons/index.html` — 0 статических ссылок на уроки; `<noscript>` нет на главной, индексе и карте. Рекомендация: статический список опубликованных уроков из каталога как базовый слой.

**AUD-013.** `supabase/functions/*/index.ts`: `ADMIN_ALLOWED_ORIGIN ?? "https://dach1980.github.io"`. Если переменная не задана на `https://dchai.ru`, admin на production не вызовет функции. Значение окружения мне недоступно.

**AUD-014.** `validate-catalog.py` проверяет legacy (8 уроков, 1 модуль), `catalog-v3.json` имеет статус `migration_staging`, версия `3.2.23-lesson-10-1-1-published`.

**Low.** AUD-015: «Личный кабинет», «Войти», «Пользователь» на всех локалях. AUD-016: skip-link не найден (regex, уверенность средняя); `--teal` на `--panel2` 4,24:1, `--token-comment` 4,15–4,43:1 на bg/panel2/code (4,76 на белом) — ниже 4,5:1, если используются для обычного текста; плюсы: `:focus-visible`, `prefers-reduced-motion` в 6 CSS, ARIA-tabs в admin. AUD-017: страница урока 147–206 КБ HTML+CSS+JS без шрифтов/картинок (не измерено в браузере); `lesson-reference-111.css` подключается к несвязанным урокам. AUD-018: admin-разметка, `admin-roadmap.js`, `data/audit-roadmap.json` публичны; роадмап-скрипт загружается дважды. AUD-019: триггер аудита на `profiles` хранит before/after строки. AUD-020: `legal/privacy.html` — черновик, не слинкован с главной и account; Terms только `.md`. AUD-021: 96 заглушек редиректят через `location.replace`, с `noindex` и canonical. AUD-022: regex `/^(.*?\/ai-research-dch-school\/)/` и закрытый список типов страниц в `language-switcher.js`.

## 6. UX/UI review

Выводы по коду и трём live-страницам, не по визуальному осмотру.

- Главная (RU): понятное позиционирование и иерархия; слабые места — JS-зависимая карта знаний, неверная ссылка «Открыть планету», нет явного «с чего начать».
- Навигация: цепочки prev/next между опубликованными уроками целостны; состояние чтения хранится в `localStorage` с try/catch. Кнопку «продолжить» в статическом коде не нашёл.
- Уроки: структура единообразна (результаты → объяснение → SVG → эксперименты → глоссарий → самопроверка). Рендер формул, CJK, SVG, overflow не оценены.
- Admin: подключены RLS, роли owner/editor, аудит; прототип — Roadmap и AIS-reference (статический JSON).
- Мобильная и tablet-версии, light/dark, CJK: не проверены.

## 7. Accessibility / Performance / SEO / Security

- Подтверждено: `lang` на всех страницах, `alt` у всех `<img>`, `h1` и `main` на реальных уроках, focus-visible, reduced-motion. Секретов в репо нет (только publishable-ключ; `service_role` лишь в комментариях и SQL-грантах); RLS включён на всех таблицах; `next` проверяется на same-origin; admin-вывод экранируется; Edge Functions проверяют JWT, подтверждённый email и роль на сервере.
- Не проверено: keyboard-обход, zoom/reflow, SVG-доступность, axe, LCP/INP/CLS, RLS на живом Supabase, значение `ADMIN_ALLOWED_ORIGIN`, live-выдача `drafts/` и `docs/`.
- XSS: 15 `xai-*-lesson.js` используют `innerHTML` без функции экранирования; URL-параметров, попадающих в разметку, не найдено, данные из статических `lessons/data/*.js` (уверенность средняя).

## 8. Prioritized roadmap

| Приоритет | Задача | Польза | Объём | Риск | Зависимости |
|---|---|---|---|---|---|
| P1 | AUD-001 canonical + расширить CI-проверку | Единый хост | S | Low | — |
| P1 | AUD-002 тесты считают published из каталога | Зелёный validate-catalog | S | Low | — |
| P1 | AUD-004 sitemap/robots (+ hreflang) | Индексация 3 локалей | S / M | Low / Medium | AUD-003 |
| P1 | AUD-003 паритет RU/EN/ZH + Track D | Контракт локалей | M–L | Medium | Вопрос 1 |
| P2 | AUD-006 ссылка в новостной карточке; решение по composite | Доверие к навигации | S / ? | Low / High | Вопрос 2 |
| P2 | AUD-007 гейт деплоя, расширенный smoke | Надёжность релиза | M | Medium | AUD-002 |
| P2 | AUD-011 пин supabase-js, шрифты | Надёжность, приватность, скорость | M | Medium | Вопрос 4 |
| P2 | AUD-012 статический слой списка уроков, `<noscript>` | Навигация без JS | M | Medium | Генерация из каталога |
| P2 | AUD-013 `ADMIN_ALLOWED_ORIGIN` и дефолт | Работоспособность admin | S | Low | Вопрос 3 |
| P2 | AUD-008 убрать write-workflow | Безопасность репо | S | Low | Разрешение владельца |
| P2 | AUD-010 allowlist артефакта Pages / noindex drafts | Гигиена публикации | M | Medium | Архитектурное решение |
| P2 | AUD-005, 009, 014 | Сопровождаемость | M | Low | — |
| P3 | AUD-015, 016, 017, 018–022 | Полировка, a11y, perf | S–M | Low | Браузерные измерения |

## 9. Architecture risks

- Массовая правка `<head>` в 169 страницах — только скриптом из каталога, не вручную.
- Добавление Track D затрагивает UID, каталог и переключатель языка одновременно.
- Сужение артефакта Pages может сломать пути `data/`, `lessons/data/` и legacy-ссылки.
- Пин или удаление `esm.sh` затрагивает вход, подтверждение email и admin.
- Объединение workflow удлинит деплой и требует плана.
- Composite-страницы и 96 заглушек несут историю URL (пункты 6–7 контракта).

## 10. What should not be changed

- RLS-модель и права на уровне колонок (миграции `001`, `004`, `006`), функции `is_school_admin` / `is_school_owner`.
- Серверные проверки Edge Functions и аудит действий.
- Раздел «Security boundary» в README, использование только publishable-ключа.
- Каталог v3: UID, slugs, URL, prerequisites, статусы.
- Контракт `dchai.ru` + GitHub Pages + live smoke.
- Same-origin проверка `next`, try/catch вокруг `localStorage`, экранирование в admin-скриптах.
- Заглушки редиректов со старых URL.

## 11. Recommended first implementation batch (предложение, не разрешение)

1. Исправить canonical у 6 опубликованных и 6 legacy-страниц и у `a-7-1-2-les-a-0169-zh`; расширить CI-проверку на все `url_i18n`. Приёмка: canonical = `https://dchai.ru/<путь>`, тест падает при подмене хоста.
2. Убрать константу 49 из двух тестов. Приёмка: validate-catalog зелёный, новый урок не требует правки тестов.
3. Добавить `robots.txt` и `sitemap.xml` из каталога v3. Приёмка: оба отдаются 200, URL соответствуют каталогу.
4. Исправить ссылку «Открыть планету» на главной (RU). Приёмка: ведёт на урок 1.2.1.
5. Ограничить или убрать `migrate-track-a-canonical-urls.yml` (после разрешения). Приёмка: ни один workflow не пушит в `main` без ревью.

## 12. Questions for owner

1. Track D — официальный четвёртый трек (нужны EN/ZH и запись в каталоге v3) или RU-главная должна говорить про три трека?
2. Composite-страницы A.3–A.6: оставить публичными и индексируемыми или сделать `noindex` / редирект на канонические уроки?
3. Какое значение `ADMIN_ALLOWED_ORIGIN` задано в Supabase; работает ли admin на `dchai.ru`?
4. Допустимы ли внешние запросы посетителей к `esm.sh` и Google Fonts в рамках юридического контура?
5. Пришлите статус последних runs для HEAD (или токен для чтения Actions).

## 13. Explicit audit conclusion

Проект готов к целевым UX/UI-улучшениям после закрытия четырёх P1: AUD-001, AUD-002, AUD-003, AUD-004. Подтверждённых P0 нет, но CI-статус не проверен; если `pages.yml` окажется красным, это станет P0. До закрытия AUD-002 не начинать работы, затрагивающие `lessons/*.html` и `data/catalog/**`. Крупный редизайн не обоснован: визуальная система не проверена в браузере.

### Таблица покрытия

| Область | Проверено | Результат | Доказательство / ограничение |
|---|---|---|---|
| Инвентаризация и архитектура | Да | Карта построена | Исходники и workflow |
| README и docs стандартов | Частично | README и список docs | Большинство `docs/` не вычитывал |
| Каталог v3 | Да | 51/182, целостен | Скрипт по JSON, 0 битых prerequisite |
| UX и IA | Частично | По коду и 3 live-страницам | Без браузера |
| Визуальная система и UI | Нет | — | Нет браузера |
| Responsive 375/768/1024/1440 | Нет | — | Нет браузера |
| Тёмная и светлая темы | Частично | Контраст токенов посчитан | Визуально не осмотрены |
| Accessibility | Частично | Статический разбор | Нет axe и keyboard-прогона |
| Performance | Частично | Размеры файлов | Нет Lighthouse и CWV |
| SEO | Да (репо) | AUD-001, 004, 005, 006 | Live robots/sitemap не запрашивались |
| Security и privacy | Да (код, SQL) | Секретов нет | Нет доступа к живому Supabase |
| Admin | Да (код) | Серверная защита есть | Не логинился |
| CI | Частично | Тесты воспроизведены локально | Статус runs не получен |
| Production smoke | Частично | 3 URL, 200 OK | EN/ZH live не запрашивались |
| Локали RU/EN/ZH | Да (код) | AUD-003, 015 | Визуально не проверены |
