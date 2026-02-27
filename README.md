# GitHub Repository Search

Приложение для поиска репозиториев GitHub с фильтрацией, пагинацией и просмотром деталей репозитория.

## Возможности

- Поиск репозиториев через GitHub API.
- Сортировка по количеству звезд.
- Фильтрация по языку.
- Пагинация результатов.
- История запросов.
- Страница деталей репозитория.
- 404 страница.
- Ленивые страницы и разделение бандла на чанки.
- Обработка ошибок API, уведомления и 1 retry для временных сбоев.
- Кэширование RTK Query на основе тегов.

## Стек

- `React 18`
- `TypeScript`
- `Vite`
- `Redux Toolkit + RTK Query`
- `React Router v6`
- `SCSS Modules`
- `ESLint + Stylelint`
- `Husky`

## Архитектура

Используется слоистая структура:

- `src/app` - провайдеры, store, роутер, глобальные стили.
- `src/pages` - страницы (`search`, `repository-details`, `not-found`).
- `src/widgets` - крупные композиции страниц.
- `src/features` - пользовательские сценарии (поиск, фильтры, история).
- `src/entities` - бизнес-сущности (карточки репозитория и детали).
- `src/shared` - инфраструктура, API, UI-kit, утилиты, конфиг.

Пути настроены через алиасы: `@`, `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`.

## API слой

API вынесен в `src/shared/api`:

- `config.ts` - базовый URL и общие константы.
- `endpoints.ts` - endpoint builders.
- `baseQuery.ts` - единый вход запросов (аналог интерцептора): заголовки, retry, обработка ошибок.
- `errorMapper.ts` + `errorHandlers.ts` - маппинг и обработчики ошибок.
- `tags.ts` - теги кэширования RTK Query.
- `githubApi.ts` - endpoint'ы RTK Query.

## Быстрый старт

### 1) Установка

```bash
npm ci
```

### 2) Переменные окружения

Создай `.env` на основе примера:

```bash
cp .env.example .env
```

По умолчанию:

```env
VITE_GITHUB_API_BASE_URL=https://api.github.com
```

### 3) Запуск в dev режиме

```bash
npm run dev
```

### 4) Production сборка

```bash
npm run build
```

### 5) Предпросмотр сборки

```bash
npm run preview
```

## Скрипты

- `npm run dev` - запуск dev-сервера.
- `npm run build` - type-check + production build.
- `npm run preview` - локальный preview build-версии.
- `npm run lint` - ESLint.
- `npm run lint:fix` - ESLint с автоисправлением.
- `npm run lint:styles` - Stylelint.
- `npm run lint:styles:fix` - Stylelint с автоисправлением.
- `npm run lint:all` - оба линтера.
- `npm run lint:fix:all` - автофикс обоих линтеров.
- `npm run hooks:check` - проверка настройки `core.hooksPath`.
- `npm run checks:full` - полный pipeline: hooks check -> lint fix -> lint -> build.

## Git hooks (Husky)

Перед `commit` и перед `push` запускается один и тот же pipeline:

1. `npm run hooks:check`
2. `npm run lint:fix:all`
3. `npm run lint:all`
4. `npm run build`

Если любой шаг падает, операция прерывается.

## Роуты

- `/` - страница поиска.
- `/repository/:owner/:name` - страница деталей репозитория.
- `*` - 404.

## Качество и стабильность

- Строгая типизация TypeScript.
- Централизованная обработка API ошибок.
- Retry для временных ошибок запросов.
- Теги кэширования RTK Query для списка и деталей.
- Ленивые страницы + разделение vendor чанков.
