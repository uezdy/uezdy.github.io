import { ArchiveHeader } from '@/components/messages/ArchiveHeader';
import { MessageItem } from '@/components/messages/MessageItem';
import { MessageSearch } from '@/components/messages/MessageSearch';
import { getExportState, getMessages } from '@/lib/messages';
import styles from './page.module.css';

export default function HomePage() {
  const messages = getMessages();
  const exportState = getExportState();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <ArchiveHeader
          exportState={exportState}
          messageCount={messages.length}
        />

        <MessageSearch totalCount={messages.length} />

        {messages.length === 0 ? (
          <section className={styles.empty}>
            <h2>Архив пока пуст</h2>
            <p>
              Запустите экспорт Telegram и пересоберите сайт, чтобы появились
              сообщения.
            </p>
          </section>
        ) : (
          <section className={styles.list} aria-label="Сообщения">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
