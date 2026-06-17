import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArchiveHeader } from '@/components/messages/ArchiveHeader';
import { MessagesArchiveView } from '@/components/messages/MessagesArchiveView';
import {
  getGroupArchiveContext,
  getGroupMessagePageParamsForExport,
} from '@/lib/groupArchive';
import {
  groupMessagesPagePath,
  groupOverviewPath,
} from '@/lib/groupRoutes';
import { getDisplayableMessages } from '@/lib/messageFilters';
import { getTotalPages, parsePageParam } from '@/lib/pagination';
import { absoluteUrl } from '@/lib/siteUrl';
import styles from '../../page.module.css';

type GroupMessagesPageProps = {
  params: Promise<{ group: string; page: string }>;
};

export function generateStaticParams() {
  return getGroupMessagePageParamsForExport();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: GroupMessagesPageProps): Promise<Metadata> {
  const { group: slug, page: pageParam } = await params;
  const context = getGroupArchiveContext(slug);
  const page = parsePageParam(pageParam);

  if (!context || !page || context.showTopics) {
    return { title: 'Страница не найдена' };
  }

  const displayable = getDisplayableMessages(context.messages);
  const totalPages = getTotalPages(displayable.length);

  if (page > totalPages) {
    return { title: 'Страница не найдена' };
  }

  const pageSuffix = totalPages > 1 ? ` — стр. ${page}` : '';

  return {
    title: `${context.title}${pageSuffix} — Telegram Archive`,
    description: `Архив сообщений группы ${context.group.chat}, страница ${page}`,
    alternates: {
      canonical: absoluteUrl(groupMessagesPagePath(slug, page)),
    },
  };
}

export default async function GroupMessagesPage({
  params,
}: GroupMessagesPageProps) {
  const { group: slug, page: pageParam } = await params;
  const context = getGroupArchiveContext(slug);
  const page = parsePageParam(pageParam);

  if (!context || !page || context.showTopics) {
    notFound();
  }

  const displayable = getDisplayableMessages(context.messages);
  const totalPages = getTotalPages(displayable.length);

  if (page > totalPages) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.backLink} href={groupOverviewPath(slug)}>
          ← {context.title}
        </Link>

        <ArchiveHeader
          title={context.title}
          exportState={context.exportState}
          messageCount={displayable.length}
        />

        <MessagesArchiveView
          context={context}
          page={page}
          buildPageHref={(nextPage) => groupMessagesPagePath(slug, nextPage)}
        />
      </div>
    </main>
  );
}
