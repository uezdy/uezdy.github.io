import type { TopicWithCount } from '@/lib/topicConstants';
import styles from './TopicsSidebar.module.css';

type TopicsSidebarProps = {
  topics: TopicWithCount[];
  selectedTopicId: number;
  onSelectTopic: (topicId: number) => void;
};

export function TopicsSidebar({
  topics,
  selectedTopicId,
  onSelectTopic,
}: TopicsSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Темы группы">
      <h2 className={styles.title}>Темы</h2>
      <ul className={styles.list}>
        {topics.map((topic) => {
          const isActive = topic.id === selectedTopicId;

          return (
            <li key={topic.id}>
              <button
                type="button"
                className={`${styles.topicButton} ${isActive ? styles.topicButtonActive : ''}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => onSelectTopic(topic.id)}
              >
                <span className={styles.topicTitle}>{topic.title}</span>
                <span className={styles.topicCount}>{topic.message_count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
