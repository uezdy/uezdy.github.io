import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArchiveHeader } from '@/components/messages/ArchiveHeader';
import { MessageArchive } from '@/components/messages/MessageArchive';
import { getGroup, getGroups, resolveGroupTitle } from '@/lib/groups';
import { getExportState, getMessages } from '@/lib/messages';
import { getTopics, hasForumTopics } from '@/lib/topics';
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
  const group = getGroup(slug);

  if (!group) {
    return { title: 'Группа не найдена' };
  }

  const title = resolveGroupTitle(group);

  return {
    title: `${title} — Telegram Archive`,
    description: `Архив сообщений группы ${group.chat}`,
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { group: slug } = await params;
  const group = getGroup(slug);

  if (!group) {
    notFound();
  }

  const messages = getMessages(slug);
  const exportState = getExportState(slug);
  const topics = getTopics(slug, messages);
  const showTopics = hasForumTopics(messages) && topics.length > 0;
  const title = resolveGroupTitle(group);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.backLink} href="/">
          ← Все группы
        </Link>

        <ArchiveHeader
          title={title}
          exportState={exportState}
          messageCount={messages.length}
        />

        {messages.length === 0 ? (
          <section className={styles.empty}>
            <h2>Архив пока пуст</h2>
            <p>
              Запустите экспорт Telegram и пересоберите сайт, чтобы появились
              сообщения.
            </p>
          </section>
        ) : (
          <MessageArchive
            messages={messages}
            topics={topics}
            showTopics={showTopics}
            chatHandle={exportState?.chat ?? group.chat}
            isForum={exportState?.is_forum ?? false}
          />
        )}
      </div>
    </main>
  );
}
