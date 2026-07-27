import Link from 'next/link';
import { formatExportDate } from '@/lib/dateFormat';
import {
  getGroupIconCardPath,
  getGroupIconCardSrcSet,
  hasGroupIcon,
} from '@/lib/groupIcon';
import { resolveGroupChatHandle, resolveGroupTitle } from '@/lib/groups';
import { formatCount } from '@/lib/numberFormat';
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
            src={getGroupIconCardPath(group.slug)}
            srcSet={getGroupIconCardSrcSet(group.slug)}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className={styles.headerText}>
          <h2 className={styles.title}>
            <Link href={`/${group.slug}/`}>{title}</Link>
          </h2>
          <p className={styles.handle}>{resolveGroupChatHandle(group)}</p>
        </div>
      </div>

      <dl className={styles.stats}>
        {group.memberCount != null ? (
          <div>
            <dt>Участников</dt>
            <dd>{formatCount(group.memberCount)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Сообщений</dt>
          <dd>{formatCount(group.messageCount)}</dd>
        </div>
        {group.isForum ? (
          <div>
            <dt>Тем</dt>
            <dd>{formatCount(group.topicCount)}</dd>
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
