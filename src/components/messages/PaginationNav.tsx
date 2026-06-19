import {
  PaginationNavBar,
  type PaginationNavItem,
} from '@/components/messages/PaginationNavBar';

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

function buildNavItems(
  currentPage: number,
  visiblePages: (number | 'ellipsis')[],
  buildPageHref: (page: number) => string
): PaginationNavItem[] {
  return visiblePages.map((page, index) => {
    if (page === 'ellipsis') {
      return { kind: 'ellipsis', id: `ellipsis-${index}` };
    }

    return {
      kind: 'page',
      page,
      href: buildPageHref(page),
      isCurrent: page === currentPage,
    };
  });
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
    <PaginationNavBar
      previousHref={previousPage ? buildPageHref(previousPage) : null}
      nextHref={nextPage ? buildPageHref(nextPage) : null}
      items={buildNavItems(currentPage, visiblePages, buildPageHref)}
    />
  );
}
