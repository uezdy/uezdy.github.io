import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GroupOverview } from '@/components/groups/GroupOverview';
import { getGroupArchiveContext } from '@/lib/groupArchive';
import { groupIconMetadata } from '@/lib/groupIcon';
import { getGroups } from '@/lib/groups';
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
  const context = getGroupArchiveContext(slug);

  if (!context) {
    return { title: 'Группа не найдена' };
  }

  return {
    title: `${context.title} — Telegram Archive`,
    description: `Архив сообщений группы ${context.group.chat}`,
    ...groupIconMetadata(slug),
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { group: slug } = await params;
  const context = getGroupArchiveContext(slug);

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
