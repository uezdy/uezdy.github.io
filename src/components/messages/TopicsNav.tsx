import Link from 'next/link';
import { topicMessagesPagePath } from '@/lib/groupRoutes';
import type { TopicWithCount } from '@/lib/topicConstants';
import styles from './TopicsNav.module.css';

type TopicsNavProps = {
  groupSlug: string;
  topics: TopicWithCount[];
  activeTopicId: number;
};

export function TopicsNav({
  groupSlug,
  topics,
  activeTopicId,
}: TopicsNavProps) {
  return (
    <aside className={styles.sidebar} aria-label="Темы группы">
      <h2 className={styles.title}>Темы</h2>
      <ul className={styles.list}>
        {topics.map((topic) => {
          const isActive = topic.id === activeTopicId;

          return (
            <li key={topic.id}>
              <Link
                className={`${styles.topicLink} ${isActive ? styles.topicLinkActive : ''}`}
                href={topicMessagesPagePath(groupSlug, topic.id, 1)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.topicTitle}>{topic.title}</span>
                <span className={styles.topicCount}>{topic.message_count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
