import type { ExportState } from '@/types/telegram';
import { formatExportDate } from '@/lib/dateFormat';
import styles from './ArchiveHeader.module.css';

type ArchiveHeaderProps = {
  title: string;
  exportState: ExportState | null;
  messageCount: number;
};

export function ArchiveHeader({
  title,
  exportState,
  messageCount,
}: ArchiveHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>История группы</p>
      <h1 className={styles.title}>{title}</h1>
      <dl className={styles.stats}>
        <div>
          <dt>Сообщений</dt>
          <dd>{messageCount}</dd>
        </div>
        {exportState?.is_forum ? (
          <div>
            <dt>Тем</dt>
            <dd>{exportState.topic_count ?? '—'}</dd>
          </div>
        ) : null}
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
