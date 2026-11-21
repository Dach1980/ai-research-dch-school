# AI Research DCH School — public website

Публичная образовательная платформа школы. Сайт размещается на GitHub Pages; авторизация и защищённая выдача закрытых учебных материалов подключаются через Supabase.

## Structure

- `index.html` — главная страница
- `tracks/` — направления обучения
- `lessons/` — опубликованные лекции
- `auth/` — интерфейс регистрации, входа и callback подтверждения email
- `supabase/migrations/` — SQL-схема профилей и контроля доступа к урокам
- `scripts/supabase-config.js` — публичная конфигурация Supabase (URL + anon/publishable key)
- `admin/` — визуальный прототип будущей панели управления
- `styles/`, `scripts/`, `assets/` — стили, скрипты и графика

## GitHub Pages

В Settings → Pages выберите GitHub Actions. Workflow `.github/workflows/pages.yml` публикует корень репозитория.

## Supabase setup

Инструкция: [docs/setup/SUPABASE_SETUP.md](docs/setup/SUPABASE_SETUP.md).

Важно: frontend scaffold не означает, что email verification уже работает. Для запуска необходимо создать Supabase project, настроить URL и публичный ключ, применить SQL migration, включить обязательное подтверждение email и настроить SMTP.

## Security boundary

GitHub Pages и публичный GitHub repository не могут защищать статические файлы. Закрытые/платные lesson payloads должны быть вынесены из публичного репозитория и загружаться через Supabase RLS или trusted backend. Никогда не размещайте `service_role` key, пароли или private tokens в репозитории.

## Canonical publishing contract

- **The only canonical public host is `https://dchai.ru`.**
- **GitHub Pages is the only production publisher** for this repository. The `main` branch is published by `.github/workflows/pages.yml`.
- Lesson URLs in catalogs, navigation, canonical tags, announcements, and user-facing replies must use `https://dchai.ru`.
- `*.vercel.app` URLs are not production URLs for this school and must never be shared as lesson links. The Vercel project is not an alternate production origin.
- A successful build alone is not a successful release. The Pages workflow must pass the canonical-domain/locale checks and the live HTTP smoke test for the homepage plus RU/EN/ZH lesson routes before a release is considered verified.
- Do not change DNS or hosting-provider settings as part of routine lesson publication. Any hosting migration requires an explicit architecture decision and a separate migration/rollback plan.

