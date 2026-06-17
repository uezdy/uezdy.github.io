import { MessageList } from '@/components/messages/MessageList';
import { MessagesPageLayout } from '@/components/messages/MessagesPageLayout';
import { PaginationNav } from '@/components/messages/PaginationNav';
import { TopicsNav } from '@/components/messages/TopicsNav';
import type { GroupArchiveContext } from '@/lib/groupArchive';
import { getDisplayableMessages } from '@/lib/messageFilters';
import { getTotalPages, slicePage } from '@/lib/pagination';
import styles from './MessagesArchiveView.module.css';

type MessagesArchiveViewProps = {
  context: GroupArchiveContext;
  page: number;
  topicId?: number;
  buildPageHref: (page: number) => string;
};

function resolveTopicTitle(
  context: GroupArchiveContext,
  topicId: number | undefined
): string | null {
  if (topicId === undefined) {
    return null;
  }

  return context.topics.find((topic) => topic.id === topicId)?.title ?? null;
}

export function MessagesArchiveView({
  context,
  page,
  topicId,
  buildPageHref,
}: MessagesArchiveViewProps) {
  const displayable = getDisplayableMessages(context.messages, topicId);
  const totalPages = getTotalPages(displayable.length);
  const pageMessages = slicePage(displayable, page);
  const topicTitle = resolveTopicTitle(context, topicId);
  const chatHandle = context.exportState?.chat ?? context.group.chat;
  const isForum = context.exportState?.is_forum ?? false;

  return (
    <MessagesPageLayout
      sidebar={
        context.showTopics && topicId !== undefined ? (
          <TopicsNav
            groupSlug={context.slug}
            topics={context.topics}
            activeTopicId={topicId}
          />
        ) : null
      }
    >
      <section className={styles.summary}>
        <p className={styles.summaryText}>
          {topicTitle ? (
            <>
              <span className={styles.summaryLabel}>Тема:</span> {topicTitle}
              {' · '}
            </>
          ) : null}
          {totalPages > 0 ? (
            <>
              Страница {page} из {totalPages}
              {' · '}
            </>
          ) : null}
          {displayable.length} сообщений
        </p>
      </section>

      <MessageList
        messages={pageMessages}
        replyPool={displayable}
        chatHandle={chatHandle}
        topicId={topicId ?? null}
        isForum={isForum}
      />

      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        buildPageHref={buildPageHref}
      />
    </MessagesPageLayout>
  );
}
