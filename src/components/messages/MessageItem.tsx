import {
  formatMessageDate,
  formatMessageDateTimeShort,
} from '@/lib/dateFormat';
import { MessageText } from '@/lib/messageEntities';
import { formatSenderLabel, plainPreviewFromMessage } from '@/lib/messageText';
import {
  buildTelegramMessageEmbedUrl,
  buildTelegramMessageUrl,
} from '@/lib/telegramChat';
import { TelegramMessageOpenButton } from '@/components/messages/TelegramMessageOpenButton';
import { MessageReactions } from '@/components/messages/MessageReactions';
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
  const embedUrl = buildTelegramMessageEmbedUrl(chatHandle, message.id);

  return (
    <article className={styles.card} id={String(message.id)}>
      <div className={styles.bubble}>
        {replyMessage ? (
          <a href={`#${message.reply_to}`} className={styles.replyQuote}>
            <span className={styles.replyLabel}>Ответ</span>
            <span className={styles.replyAuthor}>
              {formatSenderLabel(
                replyMessage.sender_name,
                replyMessage.sender_id
              )}
            </span>
            <span className={styles.replyText}>
              {plainPreviewFromMessage(replyMessage)}
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
            {formatSenderLabel(message.sender_name, message.sender_id)}
          </span>
          <time
            dateTime={message.date ?? undefined}
            className={styles.metaTime}
            title={formatMessageDate(message.date)}
          >
            {formatMessageDateTimeShort(message.date)}
          </time>
          <TelegramMessageOpenButton
            telegramHref={telegramHref}
            embedUrl={embedUrl}
          />
        </header>

        <div className={styles.body}>
          <MessageText entities={message.entities} className={styles.text} />
        </div>

        <MessageReactions reactions={message.reactions ?? []} />
      </div>
    </article>
  );
}
