import Link from 'next/link';
import { topicMessagesPagePath } from '@/lib/groupRoutes';
import { getTotalPages } from '@/lib/pagination';
import type { TopicWithCount } from '@/lib/topicConstants';
import styles from './GroupTopicsList.module.css';

type GroupTopicsListProps = {
  groupSlug: string;
  topics: TopicWithCount[];
};

export function GroupTopicsList({ groupSlug, topics }: GroupTopicsListProps) {
  return (
    <section className={styles.section} aria-label="Темы архива">
      <h2 className={styles.heading}>Темы</h2>
      <ul className={styles.list}>
        {topics.map((topic) => {
          const totalPages = getTotalPages(topic.message_count);

          return (
            <li key={topic.id}>
              <article className={styles.card}>
                <h3 className={styles.title}>
                  <Link href={topicMessagesPagePath(groupSlug, topic.id, 1)}>
                    {topic.title}
                  </Link>
                </h3>
                <p className={styles.meta}>
                  {topic.message_count} сообщений
                  {totalPages > 1 ? ` · ${totalPages} стр.` : ''}
                </p>
                <Link
                  className={styles.link}
                  href={topicMessagesPagePath(groupSlug, topic.id, 1)}
                >
                  Открыть тему
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
