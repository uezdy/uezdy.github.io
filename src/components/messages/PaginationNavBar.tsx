'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './PaginationNav.module.css';

export type PaginationNavItem =
  | { kind: 'ellipsis'; id: string }
  | { kind: 'page'; page: number; href: string; isCurrent: boolean };

type PaginationNavBarProps = {
  previousHref: string | null;
  nextHref: string | null;
  items: PaginationNavItem[];
};

const SCROLL_DELTA_THRESHOLD = 8;
const BOTTOM_OFFSET_PX = 16;

function isNearPageBottom(): boolean {
  return (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - BOTTOM_OFFSET_PX
  );
}

export function PaginationNavBar({
  previousHref,
  nextHref,
  items,
}: PaginationNavBarProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const [visible, setVisible] = useState(true);
  const [fixedStyle, setFixedStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const syncLayout = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }

      const { left, width } = anchor.getBoundingClientRect();
      setFixedStyle({ left, width });
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= BOTTOM_OFFSET_PX || isNearPageBottom()) {
        setVisible(true);
      } else if (delta > SCROLL_DELTA_THRESHOLD) {
        setVisible(true);
      } else if (delta < -SCROLL_DELTA_THRESHOLD) {
        setVisible(false);
      }

      lastScrollYRef.current = currentScrollY;
      syncLayout();
    };

    lastScrollYRef.current = window.scrollY;
    syncLayout();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncLayout);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncLayout);
    };
  }, []);

  const navClassName = visible
    ? styles.nav
    : `${styles.nav} ${styles.navHidden}`;

  return (
    <div ref={anchorRef} className={styles.anchor}>
      <nav
        className={navClassName}
        style={
          fixedStyle
            ? { left: fixedStyle.left, width: fixedStyle.width }
            : undefined
        }
        aria-label="Навигация по страницам"
        aria-hidden={visible ? undefined : true}
      >
        {previousHref ? (
          <Link className={styles.edgeLink} href={previousHref} rel="prev">
            ← Назад
          </Link>
        ) : (
          <span className={styles.edgeLinkDisabled}>← Назад</span>
        )}

        <ol className={styles.pages}>
          {items.map((item) =>
            item.kind === 'ellipsis' ? (
              <li key={item.id} className={styles.ellipsis}>
                …
              </li>
            ) : (
              <li key={item.page}>
                {item.isCurrent ? (
                  <span className={styles.currentPage} aria-current="page">
                    {item.page}
                  </span>
                ) : (
                  <Link className={styles.pageLink} href={item.href}>
                    {item.page}
                  </Link>
                )}
              </li>
            )
          )}
        </ol>

        {nextHref ? (
          <Link className={styles.edgeLink} href={nextHref} rel="next">
            Вперёд →
          </Link>
        ) : (
          <span className={styles.edgeLinkDisabled}>Вперёд →</span>
        )}
      </nav>
    </div>
  );
}
