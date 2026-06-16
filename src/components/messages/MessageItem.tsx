import {
  formatMessageDateTooltip,
  formatMessageTimeShort,
} from '@/lib/dateFormat';
import { formatSenderLabel, plainPreview } from '@/lib/messageText';
import { buildTelegramMessageUrl } from '@/lib/telegramChat';
import type { TelegramMessage } from '@/types/telegram';
import styles from './MessageItem.module.css';

type MessageItemProps = {
  message: TelegramMessage;
  replyMessage?: TelegramMessage | null;
  chatHandle: string;
  topicId: number | null;
  isForum: boolean;
};

export function MessageItem({
  message,
  replyMessage,
  chatHandle,
  topicId,
  isForum,
}: MessageItemProps) {
  const telegramHref = buildTelegramMessageUrl(
    chatHandle,
    message.id,
    topicId,
    isForum
  );

  return (
    <article className={styles.card} id={String(message.id)}>
      <div className={styles.bubble}>
        {replyMessage ? (
          <a href={`#${message.reply_to}`} className={styles.replyQuote}>
            <span className={styles.replyLabel}>Ответ</span>
            <span className={styles.replyAuthor}>
              {formatSenderLabel(replyMessage.sender_id)}
            </span>
            <span className={styles.replyText}>
              {plainPreview(replyMessage.text)}
            </span>
          </a>
        ) : null}

        <header className={styles.meta}>
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.metaId}
            title="Открыть в Telegram"
          >
            #{message.id}
          </a>
          <span className={styles.metaAuthor}>
            {formatSenderLabel(message.sender_id)}
          </span>
          <time
            dateTime={message.date ?? undefined}
            className={styles.metaTime}
            title={formatMessageDateTooltip(message.date)}
          >
            {formatMessageTimeShort(message.date)}
          </time>
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.metaOpen}
            title="Оригинал в Telegram"
            aria-label="Открыть оригинал в Telegram"
          >
            <svg
              className={styles.metaOpenIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M9.78 15.28 9.55 19.1c.39 0 .56-.17.77-.38l1.86-1.78 3.86 2.83c.71.39 1.22.18 1.4-.65l2.53-11.86h.01c.23-1.07-.39-1.49-1.1-1.23L3.16 10.3c-1.04.41-1.02.99-.18 1.25l4.64 1.45L18.2 7.5c.56-.37 1.07-.17.65.2"
              />
            </svg>
          </a>
        </header>

        <div className={styles.body}>
          <p className={styles.text}>{message.text}</p>
        </div>
      </div>
    </article>
  );
}
