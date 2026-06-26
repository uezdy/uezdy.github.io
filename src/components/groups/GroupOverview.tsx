import Link from 'next/link';
import { ArchiveHeader } from '@/components/messages/ArchiveHeader';
import { GroupTopicsList } from '@/components/messages/GroupTopicsList';
import type { GroupArchiveContext } from '@/lib/groupArchive';
import { groupMessagesPagePath } from '@/lib/groupRoutes';
import { getDisplayableMessages } from '@/lib/messageFilters';
import { getTotalPages } from '@/lib/pagination';
import styles from './GroupOverview.module.css';

type GroupOverviewProps = {
  context: GroupArchiveContext;
};

export function GroupOverview({ context }: GroupOverviewProps) {
  const displayableCount = getDisplayableMessages(
    context.messages,
    undefined,
    context.slug
  ).length;
  const totalPages = getTotalPages(displayableCount);

  return (
    <>
      <ArchiveHeader
        title={context.title}
        exportState={context.exportState}
        messageCount={displayableCount}
      />

      {displayableCount === 0 ? (
        <section className={styles.empty}>
          <h2>Архив пока пуст</h2>
          <p>
            Запустите экспорт Telegram и пересоберите сайт, чтобы появились
            сообщения.
          </p>
        </section>
      ) : context.showTopics ? (
        <GroupTopicsList groupSlug={context.slug} topics={context.topics} />
      ) : (
        <section className={styles.entry}>
          <h2 className={styles.entryTitle}>Сообщения</h2>
          <p className={styles.entryMeta}>
            {displayableCount} сообщений
            {totalPages > 1 ? ` · ${totalPages} стр.` : ''}
          </p>
          <Link
            className={styles.entryLink}
            href={groupMessagesPagePath(context.slug, 1)}
          >
            Открыть архив
          </Link>
        </section>
      )}
    </>
  );
}
