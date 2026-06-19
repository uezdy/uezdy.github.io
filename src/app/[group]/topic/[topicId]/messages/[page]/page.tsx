import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArchiveHeader } from '@/components/messages/ArchiveHeader';
import { MessagesArchiveView } from '@/components/messages/MessagesArchiveView';
import {
  getGroupArchiveContext,
  getTopicMessagePageParamsForExport,
} from '@/lib/groupArchive';
import { groupOverviewPath, topicMessagesPagePath } from '@/lib/groupRoutes';
import { getDisplayableMessages } from '@/lib/messageFilters';
import { getTotalPages, parsePageParam } from '@/lib/pagination';
import { absoluteUrl } from '@/lib/siteUrl';
import styles from '../../../../page.module.css';

type TopicMessagesPageProps = {
  params: Promise<{ group: string; topicId: string; page: string }>;
};

export function generateStaticParams() {
  return getTopicMessagePageParamsForExport();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: TopicMessagesPageProps): Promise<Metadata> {
  const { group: slug, topicId: topicIdParam, page: pageParam } = await params;
  const context = getGroupArchiveContext(slug);
  const topicId = Number.parseInt(topicIdParam, 10);
  const page = parsePageParam(pageParam);

  if (!context?.showTopics || !Number.isFinite(topicId) || !page) {
    return { title: 'Страница не найдена' };
  }

  const topic = context.topics.find((item) => item.id === topicId);

  if (!topic) {
    return { title: 'Страница не найдена' };
  }

  const displayable = getDisplayableMessages(context.messages, topicId);
  const totalPages = getTotalPages(displayable.length);

  if (page > totalPages) {
    return { title: 'Страница не найдена' };
  }

  const pageSuffix = totalPages > 1 ? ` — стр. ${page}` : '';

  return {
    title: `${topic.title}${pageSuffix} — ${context.title}`,
    description: `Архив темы «${topic.title}» в группе ${context.group.chat}, страница ${page}`,
    alternates: {
      canonical: absoluteUrl(topicMessagesPagePath(slug, topicId, page)),
    },
  };
}

export default async function TopicMessagesPage({
  params,
}: TopicMessagesPageProps) {
  const { group: slug, topicId: topicIdParam, page: pageParam } = await params;
  const context = getGroupArchiveContext(slug);
  const topicId = Number.parseInt(topicIdParam, 10);
  const page = parsePageParam(pageParam);

  if (!context?.showTopics || !Number.isFinite(topicId) || !page) {
    notFound();
  }

  const topic = context.topics.find((item) => item.id === topicId);

  if (!topic) {
    notFound();
  }

  const displayable = getDisplayableMessages(context.messages, topicId);
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
          topicId={topicId}
          buildPageHref={(nextPage) =>
            topicMessagesPagePath(slug, topicId, nextPage)
          }
        />
      </div>
    </main>
  );
}
