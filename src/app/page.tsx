import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GroupOverview } from '@/components/groups/GroupOverview';
import { getGroupArchiveContext } from '@/lib/groupArchive';
import { groupIconMetadata } from '@/lib/groupIcon';
import { PRIMARY_GROUP_SLUG } from '@/lib/groups';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const context = getGroupArchiveContext(PRIMARY_GROUP_SLUG);

  if (!context) {
    return { title: 'Telegram Archive' };
  }

  return {
    title: `${context.title} — Telegram Archive`,
    description: `Архив сообщений группы ${context.group.chat}`,
    ...groupIconMetadata(PRIMARY_GROUP_SLUG),
  };
}

export default function HomePage() {
  const context = getGroupArchiveContext(PRIMARY_GROUP_SLUG);

  if (!context) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <GroupOverview context={context} />
      </div>
    </main>
  );
}
