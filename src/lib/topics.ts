import { getGroupDataPath } from '@/lib/groups';
import { readJsonFile } from '@/lib/readJson';
import { GENERAL_TOPIC_ID, type TopicWithCount } from '@/lib/topicConstants';
import type { TelegramMessage, TelegramTopic } from '@/types/telegram';

export { GENERAL_TOPIC_ID, type TopicWithCount } from '@/lib/topicConstants';

const knownTopicIdsCache = new Map<string, Set<number>>();

export function getKnownTopicIds(groupSlug: string): Set<number> {
  const cached = knownTopicIdsCache.get(groupSlug);

  if (cached) {
    return cached;
  }

  const exportedTopics = readJsonFile<TelegramTopic[]>(
    getGroupDataPath(groupSlug, 'topics.json'),
    []
  );
  const knownTopicIds = new Set<number>([
    GENERAL_TOPIC_ID,
    ...exportedTopics.map((topic) => topic.id),
  ]);
  knownTopicIdsCache.set(groupSlug, knownTopicIds);

  return knownTopicIds;
}

export function normalizeTopicId(
  topicId: number,
  knownTopicIds: ReadonlySet<number>
): number {
  return knownTopicIds.has(topicId) ? topicId : GENERAL_TOPIC_ID;
}

function resolveStoredTopicId(
  topicId: number | null,
  knownTopicIds: ReadonlySet<number>
): number {
  return normalizeTopicId(topicId ?? GENERAL_TOPIC_ID, knownTopicIds);
}

function createTopicResolver(
  messages: TelegramMessage[],
  knownTopicIds: ReadonlySet<number>
): (message: TelegramMessage) => number {
  const messagesById = new Map(messages.map((message) => [message.id, message]));
  const memo = new Map<number, number>();

  function resolveById(messageId: number): number {
    const cached = memo.get(messageId);

    if (cached !== undefined) {
      return cached;
    }

    const message = messagesById.get(messageId);

    if (!message) {
      memo.set(messageId, GENERAL_TOPIC_ID);
      return GENERAL_TOPIC_ID;
    }

    const stored = resolveStoredTopicId(message.topic_id, knownTopicIds);

    if (stored !== GENERAL_TOPIC_ID) {
      memo.set(messageId, stored);
      return stored;
    }

    const replyTo = message.reply_to;

    if (
      replyTo !== null &&
      knownTopicIds.has(replyTo) &&
      replyTo !== GENERAL_TOPIC_ID
    ) {
      memo.set(messageId, replyTo);
      return replyTo;
    }

    if (replyTo !== null && messagesById.has(replyTo)) {
      const parentTopic = resolveById(replyTo);

      if (parentTopic !== GENERAL_TOPIC_ID) {
        memo.set(messageId, parentTopic);
        return parentTopic;
      }
    }

    memo.set(messageId, stored);
    return stored;
  }

  return (message) => resolveById(message.id);
}

const topicResolverCache = new Map<
  string,
  (message: TelegramMessage) => number
>();

function getTopicResolver(
  groupSlug: string,
  messages: TelegramMessage[]
): (message: TelegramMessage) => number {
  const cached = topicResolverCache.get(groupSlug);

  if (cached) {
    return cached;
  }

  const resolver = createTopicResolver(messages, getKnownTopicIds(groupSlug));
  topicResolverCache.set(groupSlug, resolver);

  return resolver;
}

export function resolveMessageTopicId(
  message: TelegramMessage,
  groupSlug: string,
  messages: TelegramMessage[]
): number {
  return getTopicResolver(groupSlug, messages)(message);
}

function resolveTopicTitle(
  topicId: number,
  titles: Map<number, string>
): string {
  if (titles.has(topicId)) {
    return titles.get(topicId)!;
  }

  if (topicId === GENERAL_TOPIC_ID) {
    return 'Общее';
  }

  return `Тема #${topicId}`;
}

function countMessagesByTopic(
  messages: TelegramMessage[],
  groupSlug: string
): Map<number, number> {
  const resolver = getTopicResolver(groupSlug, messages);
  const counts = new Map<number, number>();

  for (const message of messages) {
    const topicId = resolver(message);
    counts.set(topicId, (counts.get(topicId) ?? 0) + 1);
  }

  return counts;
}

export function getTopics(
  groupSlug: string,
  messages: TelegramMessage[]
): TopicWithCount[] {
  const exportedTopics = readJsonFile<TelegramTopic[]>(
    getGroupDataPath(groupSlug, 'topics.json'),
    []
  );
  const knownTopicIds = getKnownTopicIds(groupSlug);
  const titles = new Map(
    exportedTopics.map((topic) => [topic.id, topic.title])
  );
  const counts = countMessagesByTopic(messages, groupSlug);
  const topicIds = new Set<number>([
    ...counts.keys(),
    ...exportedTopics.map((topic) => topic.id),
  ]);

  if (topicIds.size === 0) {
    return [];
  }

  return [...topicIds]
    .sort((left, right) => {
      if (left === GENERAL_TOPIC_ID) {
        return -1;
      }

      if (right === GENERAL_TOPIC_ID) {
        return 1;
      }

      return resolveTopicTitle(left, titles).localeCompare(
        resolveTopicTitle(right, titles),
        'ru'
      );
    })
    .map((topicId) => ({
      id: topicId,
      title: resolveTopicTitle(topicId, titles),
      message_count: counts.get(topicId) ?? 0,
    }))
    .filter((topic) => topic.message_count > 0);
}

export function hasForumTopics(messages: TelegramMessage[]): boolean {
  return messages.some((message) => message.topic_id !== null);
}
