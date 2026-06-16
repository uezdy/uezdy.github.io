import { ArchiveHeader } from '@/components/messages/ArchiveHeader';
import { MessageArchive } from '@/components/messages/MessageArchive';
import { getExportState, getMessages } from '@/lib/messages';
import { getTopics, hasForumTopics } from '@/lib/topics';
import styles from './page.module.css';

export default function HomePage() {
  const messages = getMessages();
  const exportState = getExportState();
  const topics = getTopics(messages);
  const showTopics = hasForumTopics(messages) && topics.length > 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <ArchiveHeader
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
            chatHandle={exportState?.chat ?? 'telegram'}
            isForum={exportState?.is_forum ?? false}
          />
        )}
      </div>
    </main>
  );
}
