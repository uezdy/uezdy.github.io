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
  knownTopicIds: ReadonlySet<number>
): Map<number, number> {
  const counts = new Map<number, number>();

  for (const message of messages) {
    const topicId = normalizeTopicId(
      message.topic_id ?? GENERAL_TOPIC_ID,
      knownTopicIds
    );
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
  const counts = countMessagesByTopic(messages, knownTopicIds);
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
