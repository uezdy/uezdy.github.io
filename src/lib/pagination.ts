export const PAGE_SIZE = 50;

export function getTotalPages(count: number): number {
  if (count === 0) {
    return 0;
  }

  return Math.ceil(count / PAGE_SIZE);
}

export function slicePage<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;

  return items.slice(start, start + PAGE_SIZE);
}

export function parsePageParam(value: string): number | null {
  const page = Number.parseInt(value, 10);

  if (!Number.isFinite(page) || page < 1) {
    return null;
  }

  return page;
}

export function pageRange(totalPages: number): number[] {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}
