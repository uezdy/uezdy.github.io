import type { GroupSummary } from '@/types/telegram';
import { GroupCard } from './GroupCard';
import styles from './GroupsList.module.css';

type GroupsListProps = {
  groups: GroupSummary[];
};

export function GroupsList({ groups }: GroupsListProps) {
  if (groups.length === 0) {
    return (
      <section className={styles.empty}>
        <h2>Группы не настроены</h2>
        <p>
          Добавьте группы в <code>data/groups.json</code> и запустите экспорт
          Telegram.
        </p>
      </section>
    );
  }

  const sortedGroups = [...groups].sort((a, b) => {
    if (Boolean(a.skipExport) !== Boolean(b.skipExport)) {
      return a.skipExport ? -1 : 1;
    }

    return b.messageCount - a.messageCount;
  });

  return (
    <section className={styles.list} aria-label="Список групп">
      {sortedGroups.map((group) => (
        <GroupCard key={group.slug} group={group} />
      ))}
    </section>
  );
}
