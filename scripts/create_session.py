"""One-time helper to generate a StringSession for local use and GitHub Actions."""

from telethon import TelegramClient
from telethon.sessions import StringSession


def main() -> None:
    api_id = int(input("API_ID (from https://my.telegram.org): "))
    api_hash = input("API_HASH: ").strip()

    with TelegramClient(StringSession(), api_id, api_hash) as client:
        print("\nSave this value as TELEGRAM_SESSION (GitHub Secret + local .env):\n")
        print(client.session.save())
        print("\nDo not commit or share this string.")


if __name__ == "__main__":
    main()
