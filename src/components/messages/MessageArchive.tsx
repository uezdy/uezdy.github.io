'use client';

import { useMemo, useState } from 'react';
import { GENERAL_TOPIC_ID, type TopicWithCount } from '@/lib/topicConstants';
import { buildSearchText } from '@/lib/search';
import { getMessagePlainText } from '@/lib/messageText';
import type { TelegramMessage } from '@/types/telegram';
import { MessageItem } from './MessageItem';
import { TopicsSidebar } from './TopicsSidebar';
import styles from './MessageArchive.module.css';

type MessageArchiveProps = {
  messages: TelegramMessage[];
  topics: TopicWithCount[];
  showTopics: boolean;
  chatHandle: string;
  isForum: boolean;
};

function resolveMessageTopicId(message: TelegramMessage): number {
  return message.topic_id ?? GENERAL_TOPIC_ID;
}

function hasDisplayText(message: TelegramMessage): boolean {
  return getMessagePlainText(message).trim().length > 0;
}

export function MessageArchive({
  messages,
  topics,
  showTopics,
  chatHandle,
  isForum,
}: MessageArchiveProps) {
  const [selectedTopicId, setSelectedTopicId] = useState(
    topics[0]?.id ?? GENERAL_TOPIC_ID
  );
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const replyPool = useMemo(() => {
    const pool = new Map<number, TelegramMessage>();

    for (const message of messages) {
      pool.set(message.id, message);
    }

    return pool;
  }, [messages]);

  const topicMessages = useMemo(() => {
    const scopedMessages = showTopics
      ? messages.filter(
          (message) => resolveMessageTopicId(message) === selectedTopicId
        )
      : messages;

    return scopedMessages.filter(hasDisplayText);
  }, [messages, selectedTopicId, showTopics]);

  const visibleMessages = useMemo(() => {
    if (!normalizedQuery) {
      return topicMessages;
    }

    return topicMessages.filter((message) =>
      buildSearchText(message).includes(normalizedQuery)
    );
  }, [normalizedQuery, topicMessages]);

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);

  return (
    <div className={showTopics ? styles.layoutWithTopics : styles.layoutPlain}>
      {showTopics ? (
        <TopicsSidebar
          topics={topics}
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
        />
      ) : null}

      <div className={styles.content}>
        <section className={styles.searchPanel}>
          <label className={styles.searchLabel} htmlFor="message-search">
            Поиск по сообщениям
          </label>
          <input
            id="message-search"
            className={styles.searchInput}
            type="search"
            placeholder="Текст, id или sender_id"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className={styles.searchCounter}>
            {normalizedQuery
              ? `Найдено: ${visibleMessages.length} из ${topicMessages.length}`
              : showTopics && selectedTopic
                ? `${selectedTopic.title}: ${topicMessages.length} сообщений`
                : `Всего сообщений: ${topicMessages.length}`}
          </p>
        </section>

        <section className={styles.list} aria-label="Сообщения">
          {visibleMessages.length === 0 ? (
            <div className={styles.emptyTopic}>
              <p>
                {normalizedQuery
                  ? 'По вашему запросу ничего не найдено.'
                  : 'В этой теме пока нет сообщений.'}
              </p>
            </div>
          ) : (
            visibleMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                replyMessage={
                  message.reply_to
                    ? (replyPool.get(message.reply_to) ?? null)
                    : null
                }
                chatHandle={chatHandle}
                topicId={showTopics ? selectedTopicId : null}
                isForum={isForum}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
