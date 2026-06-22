import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  description: 'Запрошенная страница не существует',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.description}>
          Такой страницы нет или она была удалена.
        </p>
        <Link className={styles.homeLink} href="/">
          На главную
        </Link>
      </div>
    </main>
  );
}
