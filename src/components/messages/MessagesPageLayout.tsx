import type { ReactNode } from 'react';
import styles from './MessagesPageLayout.module.css';

type MessagesPageLayoutProps = {
  sidebar?: ReactNode;
  children: ReactNode;
};

export function MessagesPageLayout({
  sidebar,
  children,
}: MessagesPageLayoutProps) {
  return (
    <div className={sidebar ? styles.layoutWithSidebar : styles.layoutPlain}>
      {sidebar}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
