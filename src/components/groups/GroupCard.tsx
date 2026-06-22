import Link from 'next/link';
import { formatExportDate } from '@/lib/dateFormat';
import { getGroupIconPath, hasGroupIcon } from '@/lib/groupIcon';
import { resolveGroupTitle } from '@/lib/groups';
import type { GroupSummary } from '@/types/telegram';
import styles from './GroupCard.module.css';

type GroupCardProps = {
  group: GroupSummary;
};

export function GroupCard({ group }: GroupCardProps) {
  const title = resolveGroupTitle(group);
  const showIcon = hasGroupIcon(group.slug);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        {showIcon ? (
          <img
            className={styles.icon}
            src={getGroupIconPath(group.slug)}
            alt=""
            width={48}
            height={48}
          />
        ) : null}
        <div className={styles.headerText}>
          <h2 className={styles.title}>
            <Link href={`/${group.slug}/`}>{title}</Link>
          </h2>
          <p className={styles.handle}>{group.chat}</p>
        </div>
      </div>

      <dl className={styles.stats}>
        <div>
          <dt>Сообщений</dt>
          <dd>{group.messageCount}</dd>
        </div>
        {group.isForum ? (
          <div>
            <dt>Тем</dt>
            <dd>{group.topicCount}</dd>
          </div>
        ) : null}
        <div>
          <dt>Обновлено</dt>
          <dd>{formatExportDate(group.exportedAt)}</dd>
        </div>
      </dl>

      <Link className={styles.link} href={`/${group.slug}/`}>
        Открыть архив
      </Link>
    </article>
  );
}
