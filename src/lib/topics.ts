import { getGroupDataPath } from '@/lib/groups';
import { readJsonFile } from '@/lib/readJson';
import { GENERAL_TOPIC_ID, type TopicWithCount } from '@/lib/topicConstants';
import type { TelegramMessage, TelegramTopic } from '@/types/telegram';

export { GENERAL_TOPIC_ID, type TopicWithCount } from '@/lib/topicConstants';

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
  messages: TelegramMessage[]
): Map<number, number> {
  const counts = new Map<number, number>();

  for (const message of messages) {
    const topicId = message.topic_id ?? GENERAL_TOPIC_ID;
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
  const titles = new Map(
    exportedTopics.map((topic) => [topic.id, topic.title])
  );
  const counts = countMessagesByTopic(messages);
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
