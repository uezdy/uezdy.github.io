import Link from 'next/link';
import styles from './PaginationNav.module.css';

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  buildPageHref: (page: number) => string;
};

function getVisiblePages(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  const result: (number | 'ellipsis')[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const previous = sorted[index - 1];

    if (previous !== undefined && page - previous > 1) {
      result.push('ellipsis');
    }

    result.push(page);
  }

  return result;
}

export function PaginationNav({
  currentPage,
  totalPages,
  buildPageHref,
}: PaginationNavProps) {
  if (totalPages <= 1) {
    return null;
  }

  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className={styles.nav} aria-label="Навигация по страницам">
      {previousPage ? (
        <Link
          className={styles.edgeLink}
          href={buildPageHref(previousPage)}
          rel="prev"
        >
          ← Назад
        </Link>
      ) : (
        <span className={styles.edgeLinkDisabled}>← Назад</span>
      )}

      <ol className={styles.pages}>
        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={styles.ellipsis}>
              …
            </li>
          ) : (
            <li key={page}>
              {page === currentPage ? (
                <span className={styles.currentPage} aria-current="page">
                  {page}
                </span>
              ) : (
                <Link className={styles.pageLink} href={buildPageHref(page)}>
                  {page}
                </Link>
              )}
            </li>
          )
        )}
      </ol>

      {nextPage ? (
        <Link
          className={styles.edgeLink}
          href={buildPageHref(nextPage)}
          rel="next"
        >
          Вперёд →
        </Link>
      ) : (
        <span className={styles.edgeLinkDisabled}>Вперёд →</span>
      )}
    </nav>
  );
}
