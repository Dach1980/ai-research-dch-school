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
