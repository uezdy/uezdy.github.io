import { MessageItem } from '@/components/messages/MessageItem';
import type { TelegramMessage } from '@/types/telegram';
import styles from './MessageList.module.css';

type MessageListProps = {
  messages: TelegramMessage[];
  replyPool: TelegramMessage[];
  chatHandle: string;
  topicId: number | null;
  isForum: boolean;
};

function buildReplyPool(
  messages: TelegramMessage[]
): Map<number, TelegramMessage> {
  return new Map(messages.map((message) => [message.id, message]));
}

export function MessageList({
  messages,
  replyPool,
  chatHandle,
  topicId,
  isForum,
}: MessageListProps) {
  const replies = buildReplyPool(replyPool);

  if (messages.length === 0) {
    return (
      <div className={styles.empty}>
        <p>На этой странице нет сообщений.</p>
      </div>
    );
  }

  return (
    <section className={styles.list} aria-label="Сообщения">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          replyMessage={
            message.reply_to ? (replies.get(message.reply_to) ?? null) : null
          }
          chatHandle={chatHandle}
          topicId={topicId}
          isForum={isForum}
        />
      ))}
    </section>
  );
}
