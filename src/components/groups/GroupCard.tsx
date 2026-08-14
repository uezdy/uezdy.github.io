import Link from 'next/link';
import { formatExportDate } from '@/lib/dateFormat';
import {
  getGroupIconCardPath,
  getGroupIconCardSrcSet,
  hasGroupIcon,
} from '@/lib/groupIcon';
import {
  groupArchiveHref,
  resolveGroupChatHandle,
  resolveGroupTitle,
} from '@/lib/groups';
import { formatCount } from '@/lib/numberFormat';
import type { GroupSummary } from '@/types/telegram';
import styles from './GroupCard.module.css';

type GroupCardProps = {
  group: GroupSummary;
};

export function GroupCard({ group }: GroupCardProps) {
  const title = resolveGroupTitle(group);
  const showIcon = hasGroupIcon(group.slug);
  const href = groupArchiveHref(group);
  const titleLink = group.skipExport ? (
    <a href={href}>{title}</a>
  ) : (
    <Link href={href}>{title}</Link>
  );
  const archiveLink = group.skipExport ? (
    <a className={styles.link} href={href}>
      Открыть архив
    </a>
  ) : (
    <Link className={styles.link} href={href}>
      Открыть архив
    </Link>
  );

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
          <h2 className={styles.title}>{titleLink}</h2>
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
        {group.isForum && !group.skipExport ? (
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

      {archiveLink}
    </article>
  );
}
