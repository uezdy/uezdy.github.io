# uezdy.github.io

Экспорт сообщений Telegram-группы в JSON и публикация полной истории на
GitHub Pages через Next.js (SSG).

## Локальный запуск

### Что понадобится

- Python 3.10+ ([python.org](https://www.python.org/downloads/))
- Аккаунт Telegram, **уже состоящий** в нужной группе
- Доступ к [my.telegram.org](https://my.telegram.org)

### Шаг 1. Открыть проект в терминале

```powershell
cd C:\Users\Lenovo\WebstormProjects\uezdy.github.io
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

Скопируйте шаблон:

```powershell
copy .env.example .env
```

На macOS/Linux:

```bash
cp .env.example .env
```

Откройте `.env` и заполните:

```env
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=ваш_api_hash
TELEGRAM_SESSION=длинная_строка_из_create_session
TELEGRAM_CHAT=@username_группы
OUTPUT_PATH=data/messages.json
STATE_PATH=data/export_state.json
```

**Как указать группу в `TELEGRAM_CHAT`:**

| Вариант | Пример |
|---------|--------|
| Публичная группа | `@my_group` |
| Числовой id | `-1001234567890` |
| Ссылка | `https://t.me/my_group` |

Для приватной группы без `@username` удобнее числовой id. Его можно узнать через бота вроде `@userinfobot` или из ссылки вида `t.me/c/1234567890/1` → id будет `-1001234567890`.

### Шаг 6. Запустить экспорт истории

Убедитесь, что venv активирован (в начале строки терминала должно быть `(.venv)`):

```powershell
python scripts/export_telegram.py
```

Скрипт автоматически читает `.env` из корня репозитория. Переменные из окружения (например, в CI) имеют приоритет над `.env`.

При успехе увидите что-то вроде:

```text
Exported 1523 new message(s); total 1523 -> data\messages.json
```

### Шаг 7. Проверить результат

- `data/messages.json` — все сообщения группы в JSON
- `data/export_state.json` — служебное состояние (последний id, дата экспорта)

Первый запуск скачивает **всю историю**. Повторный — только **новые** сообщения.

### Шпаргалка (после первой настройки)

```powershell
cd C:\Users\Lenovo\WebstormProjects\uezdy.github.io
.venv\Scripts\activate
python scripts/export_telegram.py
```

### Частые проблемы

**`Missing required environment variable`**
→ не заполнен `.env` или он не в корне репозитория.

**`Could not find the input entity for`**
→ неверный `TELEGRAM_CHAT` или ваш аккаунт не в этой группе.

**`python` не найден**
→ используйте `py` или добавьте Python в PATH при установке.

**Долго качается**
→ для больших групп это нормально при первом экспорте.

**Session перестал работать**
→ заново запустите `python scripts/create_session.py` и обновите `TELEGRAM_SESSION` в `.env`.

## GitHub Actions

Добавьте secrets в **Settings → Secrets and variables → Actions**:

| Secret | Описание |
|--------|----------|
| `TELEGRAM_API_ID` | API ID |
| `TELEGRAM_API_HASH` | API Hash |
| `TELEGRAM_SESSION` | String session из `create_session.py` |
| `TELEGRAM_CHAT` | Группа/чат для экспорта |

Workflow `.github/workflows/export-telegram.yml`:

- запускается после каждого push в ветку `new-approach`;
- запускается по расписанию (каждый понедельник в 03:00 UTC);
- можно запустить вручную через **Actions → Export Telegram messages → Run workflow**;
- коммитит обновлённый JSON, если появились новые сообщения.

## Веб-интерфейс (Next.js + SSG)

Архив рендерится статически (SSG) и публикуется на GitHub Pages.

### Локальный запуск сайта

```powershell
cd C:\Users\Lenovo\WebstormProjects\uezdy.github.io
npm install
npm run dev
```

Откройте `http://localhost:4002`.

### Локальная production-сборка

```powershell
npm run build
```

Во время сборки запускается prebuild-скрипт:

- копирует `data/messages.json` → `public/messages.json`;
- копирует `data/export_state.json` → `public/export_state.json`;
- Next.js генерирует статические страницы в `out/`.

### Деплой на GitHub Pages

Workflow `.github/workflows/deploy-pages.yml`:

- запускается после push в `new-approach`;
- собирает статический Next.js сайт;
- публикует содержимое `out/` в GitHub Pages.

Чтобы публикация работала, в репозитории включите:

1. **Settings → Pages**
2. **Source: GitHub Actions**

## Формат JSON

Каждое сообщение:

```json
{
  "id": 123,
  "date": "2026-06-16T12:00:00+00:00",
  "sender_id": 456789,
  "text": "текст сообщения",
  "reply_to": null,
  "has_media": false,
  "media_type": null
}
```

## Безопасность

- Не коммитьте `.env` и session string.
- `TELEGRAM_SESSION` даёт доступ к аккаунту — храните только в secrets.
- При утечке отзовите сессию в Telegram: **Settings → Devices**.
