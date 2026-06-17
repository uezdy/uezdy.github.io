export function groupOverviewPath(slug: string): string {
  return `/${slug}/`;
}

export function groupMessagesPagePath(slug: string, page: number): string {
  return `/${slug}/messages/${page}/`;
}

export function topicMessagesPagePath(
  slug: string,
  topicId: number,
  page: number
): string {
  return `/${slug}/topic/${topicId}/messages/${page}/`;
}
