import type { ExportState } from '@/types/telegram';
import { formatExportDate } from '@/lib/dateFormat';
import styles from './ArchiveHeader.module.css';

type ArchiveHeaderProps = {
  exportState: ExportState | null;
  messageCount: number;
};

export function ArchiveHeader({
  exportState,
  messageCount,
}: ArchiveHeaderProps) {
  const chatTitle = exportState?.chat ?? 'Telegram archive';

  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>История группы</p>
      <h1 className={styles.title}>{chatTitle}</h1>
      <dl className={styles.stats}>
        <div>
          <dt>Сообщений</dt>
          <dd>{messageCount}</dd>
        </div>
        <div>
          <dt>Последний id</dt>
          <dd>{exportState?.last_message_id ?? '—'}</dd>
        </div>
        <div>
          <dt>Обновлено</dt>
          <dd>{formatExportDate(exportState?.exported_at ?? null)}</dd>
        </div>
      </dl>
    </header>
  );
}
