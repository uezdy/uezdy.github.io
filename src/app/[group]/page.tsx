import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArchiveHeader } from '@/components/messages/ArchiveHeader';
import { GroupTopicsList } from '@/components/messages/GroupTopicsList';
import { getGroupArchiveContext } from '@/lib/groupArchive';
import { groupIconMetadata } from '@/lib/groupIcon';
import { getGroups } from '@/lib/groups';
import { groupMessagesPagePath } from '@/lib/groupRoutes';
import { getDisplayableMessages } from '@/lib/messageFilters';
import { getTotalPages } from '@/lib/pagination';
import styles from './page.module.css';

type GroupPageProps = {
  params: Promise<{ group: string }>;
};

export function generateStaticParams() {
  return getGroups().map((group) => ({ group: group.slug }));
}

export async function generateMetadata({
  params,
}: GroupPageProps): Promise<Metadata> {
  const { group: slug } = await params;
  const context = getGroupArchiveContext(slug);

  if (!context) {
    return { title: 'Группа не найдена' };
  }

  return {
    title: `${context.title} — Telegram Archive`,
    description: `Архив сообщений группы ${context.group.chat}`,
    ...groupIconMetadata(slug),
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { group: slug } = await params;
  const context = getGroupArchiveContext(slug);

  if (!context) {
    notFound();
  }

  const displayableCount = getDisplayableMessages(
    context.messages,
    undefined,
    context.slug
  ).length;
  const totalPages = getTotalPages(displayableCount);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.backLink} href="/">
          ← Все группы
        </Link>

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
      </div>
    </main>
  );
}
