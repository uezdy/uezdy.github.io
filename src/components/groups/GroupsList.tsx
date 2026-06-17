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

  return (
    <section className={styles.list} aria-label="Список групп">
      {groups.map((group) => (
        <GroupCard key={group.slug} group={group} />
      ))}
    </section>
  );
}
