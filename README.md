# uezdy.github.io project

Экспорт сообщений Telegram-группы @uezdy в JSON и публикация полной истории на
GitHub Pages через Next.js (SSG).

Данные группы хранятся в `data/groups/uezdy/`.

## Структура данных

| Путь | Описание |
| ---- | -------- |
| `data/groups.json` | Конфигурация группы (`slug` + `chat`) |
| `data/groups/uezdy/messages.json` | Все сообщения группы |
| `data/groups/uezdy/topics.json` | Темы форума |
| `data/groups/uezdy/export_state.json` | Служебное состояние экспорта |
| `data/sitemap-state.json` | Состояние sitemap между сборками |

При `npm run build` prebuild-скрипты копируют `data/` → `public/` и
обновляют sitemap state.

## Локальный запуск

### Что понадобится

- Python 3.10+ ([python.org](https://www.python.org/downloads/))
- Node.js 22 ([nodejs.org](https://nodejs.org/))
- Аккаунт Telegram, **состоящий** в группе @uezdy
- Доступ к [my.telegram.org](https://my.telegram.org)

### Шаг 1. Открыть проект в терминале

```powershell
cd C:\Users\ssa\WebstormProjects\uezdy.github.io
```

На macOS/Linux укажите свой путь к клону репозитория.

### Шаг 2. Создать виртуальное окружение и установить зависимости

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Если `python` не находится, попробуйте `py`:

```powershell
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

На macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Шаг 3. Получить API-ключи Telegram

1. Зайдите на [https://my.telegram.org](https://my.telegram.org) под своим номером.
2. Откройте **API development tools**.
3. Создайте приложение (название любое).
4. Сохраните:
   - **api_id** (число)
   - **api_hash** (строка)

### Шаг 4. Создать session string (один раз)

```powershell
python scripts/create_session.py
```

Скрипт спросит `API_ID` и `API_HASH`, затем попросит:

1. Ввести номер телефона (с кодом страны, например `+79991234567`)
2. Ввести код из Telegram
3. При необходимости — пароль 2FA

В конце появится длинная строка — это `TELEGRAM_SESSION`. Скопируйте её целиком.

### Шаг 5. Создать файл `.env`

Создайте `.env` в корне репозитория:

```env
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=ваш_api_hash
TELEGRAM_SESSION=длинная_строка_из_create_session
```

Переменные из окружения (например, в CI) имеют приоритет над `.env`.

### Шаг 6. Конфигурация группы

Группа @uezdy уже указана в `data/groups.json`:

```json
{
  "groups": [
    { "slug": "uezdy", "chat": "@uezdy" }
  ]
}
```

- **slug** — имя для URL сайта (`/`, `/uezdy/`, `/uezdy/topic/107/messages/1/`)
- **chat** — идентификатор группы в Telegram

Если `data/groups.json` отсутствует, можно экспортировать через переменную окружения `TELEGRAM_CHAT=@uezdy` в `.env`.

### Шаг 7. Запустить экспорт истории

Убедитесь, что venv активирован (в начале строки терминала должно быть `(.venv)`):

```powershell
python scripts/export_telegram.py
```

При успехе скрипт сохранит JSON в `data/groups/uezdy/`.

### Шаг 8. Проверить результат

Появятся файлы:

- `data/groups/uezdy/messages.json` — все сообщения
- `data/groups/uezdy/topics.json` — темы форума
- `data/groups/uezdy/export_state.json` — последний id, дата экспорта, счётчики
- `data/groups/uezdy/icon.jpg` — аватар группы (favicon на страницах архива)

Первый запуск скачивает **всю историю**. Повторный — только **новые** сообщения.

### Шпаргалка (после первой настройки)

```powershell
cd C:\Users\ssa\WebstormProjects\uezdy.github.io
.venv\Scripts\activate
python scripts/export_telegram.py
npm run dev
```

### Частые проблемы

**`Missing required environment variable`**
→ не заполнен `.env` или он не в корне репозитория.

**`No groups configured. Add data/groups.json or set TELEGRAM_CHAT.`**
→ не настроена группа для экспорта.

**`Could not find the input entity for`**
→ неверный `chat` в `groups.json` или ваш аккаунт не в этой группе.

**`python` не найден**
→ используйте `py` или добавьте Python в PATH при установке.

**Долго качается**
→ для больших групп это нормально при первом экспорте.

**Session перестал работать**
→ заново запустите `python scripts/create_session.py` и обновите `TELEGRAM_SESSION` в `.env`.

## GitHub Actions

Единственный workflow: `.github/workflows/deploy-pages.yml` (**Deploy GitHub Pages**).

Он выполняет полный цикл:

1. Восстанавливает архив Telegram из artifact предыдущего успешного запуска
2. Экспортирует новые сообщения (`python scripts/export_telegram.py`)
3. Сохраняет обновлённый архив как artifact
4. Собирает статический Next.js сайт (`npm run build`)
5. Публикует `out/` на GitHub Pages

### Secrets

Добавьте в **Settings → Secrets and variables → Actions**:

| Secret              | Описание                              |
| ------------------- | ------------------------------------- |
| `TELEGRAM_API_ID`   | API ID                                |
| `TELEGRAM_API_HASH` | API Hash                              |
| `TELEGRAM_SESSION`  | String session из `create_session.py` |

Список групп берётся из `data/groups.json` в репозитории (группа @uezdy) — отдельный secret для чата не нужен.

### Когда запускается

- **По расписанию** — каждый понедельник в 03:00 UTC
- **Вручную** — **Actions → Deploy GitHub Pages → Run workflow**

### Ручной запуск

Кнопка **Run workflow** появляется только если файл workflow есть в **ветке по умолчанию** (default branch) репозитория.

Сейчас разработка ведётся в ветке `new-approach`. Чтобы запускать workflow из UI GitHub, нужно либо:

- смержить `new-approach` в `main` (или другую default branch), либо
- временно сменить default branch на `new-approach` в **Settings → General**.

После появления workflow в default branch можно выбрать ветку `new-approach` в выпадающем списке **Run workflow**.

### GitHub Pages

Чтобы публикация работала, в репозитории включите:

1. **Settings → Pages**
2. **Source: GitHub Actions**

Если на сайте пусто — перезапустите **Deploy GitHub Pages** вручную.

## Веб-интерфейс (Next.js + SSG)

Архив рендерится статически (SSG) и публикуется на [https://uezdy.github.io](https://uezdy.github.io).

### Маршруты

| URL | Страница |
| --- | -------- |
| `/` | Обзор группы и список тем |
| `/uezdy/` | То же, что и `/` |
| `/uezdy/messages/<page>/` | Сообщения группы (без топиков) |
| `/uezdy/topic/<topicId>/messages/<page>/` | Сообщения внутри темы форума |

### Локальный запуск сайта

```powershell
npm install
npm run dev
```

Откройте `http://localhost:4002`.

Перед dev/build убедитесь, что данные экспортированы в `data/groups/` (или скопированы в `public/groups/`).

### Локальная production-сборка

```powershell
npm run build
```

Во время сборки запускается `prebuild`:

- копирует `data/groups.json` → `public/groups.json`
- копирует `data/groups/<slug>/` → `public/groups/<slug>/`
- обновляет `data/sitemap-state.json` и `public/sitemap-state.json`
- Next.js генерирует статические страницы в `out/`

## Формат JSON

Каждое сообщение в `messages.json`:

```json
{
  "id": 123,
  "date": "2026-06-16T12:00:00+00:00",
  "sender_id": 456789,
  "sender_name": "Имя отправителя",
  "text": "текст сообщения",
  "entities": [
    { "type": "plain", "text": "текст сообщения" }
  ],
  "reply_to": null,
  "topic_id": 1,
  "has_media": false,
  "media_type": null
}
```

Темы форума в `topics.json`:

```json
{
  "id": 107,
  "title": "Библиотека/Ссылки"
}
```

## Безопасность

- Не коммитьте `.env` и session string.
- `TELEGRAM_SESSION` даёт доступ к аккаунту — храните только в secrets.
- При утечке отзовите сессию в Telegram: **Settings → Devices**.
