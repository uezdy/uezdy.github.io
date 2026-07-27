import type { ExportState } from '@/types/telegram';
import { formatExportDate } from '@/lib/dateFormat';
import { formatCount } from '@/lib/numberFormat';
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
        {exportState?.member_count != null ? (
          <div>
            <dt>Участников</dt>
            <dd>{formatCount(exportState.member_count)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Сообщений</dt>
          <dd>{formatCount(messageCount)}</dd>
        </div>
        {exportState?.is_forum ? (
          <div>
            <dt>Тем</dt>
            <dd>{formatCount(exportState.topic_count)}</dd>
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
