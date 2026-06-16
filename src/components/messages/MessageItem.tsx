import type { TelegramMessage } from '@/types/telegram';
import { formatMessageDate } from '@/lib/dateFormat';
import styles from './MessageItem.module.css';

type MessageItemProps = {
  message: TelegramMessage;
};

function buildSearchText(message: TelegramMessage): string {
  return [message.text, String(message.sender_id ?? ''), String(message.id)]
    .join(' ')
    .toLowerCase();
}

export function MessageItem({ message }: MessageItemProps) {
  const hasText = message.text.trim().length > 0;

  return (
    <article
      className={styles.item}
      data-search={buildSearchText(message)}
      id={`message-${message.id}`}
    >
      <header className={styles.header}>
        <time className={styles.date} dateTime={message.date ?? undefined}>
          {formatMessageDate(message.date)}
        </time>
        <span className={styles.meta}>
          #{message.id}
          {message.sender_id ? ` · ${message.sender_id}` : ''}
        </span>
      </header>

      {hasText ? (
        <p className={styles.text}>{message.text}</p>
      ) : (
        <p className={styles.placeholder}>
          {message.has_media ? 'Медиа-сообщение' : 'Пустое сообщение'}
        </p>
      )}

      <footer className={styles.footer}>
        {message.reply_to ? (
          <a className={styles.replyLink} href={`#message-${message.reply_to}`}>
            Ответ на #{message.reply_to}
          </a>
        ) : null}
        {message.has_media ? (
          <span className={styles.mediaBadge}>
            {message.media_type ?? 'media'}
          </span>
        ) : null}
      </footer>
    </article>
  );
}
