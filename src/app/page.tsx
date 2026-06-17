import type { Metadata } from 'next';
import { GroupsList } from '@/components/groups/GroupsList';
import { getGroupSummaries } from '@/lib/groups';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Telegram Archives',
  description: 'Архивы сообщений Telegram-групп для индексации поисковыми системами',
};

export default function HomePage() {
  const groups = getGroupSummaries();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Архивы Telegram</p>
          <h1 className={styles.title}>Группы</h1>
          <p className={styles.subtitle}>
            Полная история сообщений для поисковой индексации
          </p>
        </header>

        <GroupsList groups={groups} />
      </div>
    </main>
  );
}
