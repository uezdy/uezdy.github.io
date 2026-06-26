/**
 * Legacy URL scheme from the `uezdy` branch:
 *   /{group}/{topicId}/{page}  — e.g. /uezdy/24122/1
 *
 * Current scheme:
 *   /{group}/messages/{page}/
 *   /{group}/topic/{topicId}/messages/{page}/
 *
 * Prefixes 0–9 block numeric topic IDs without affecting /messages/ or /topic/.
 */

const REMOVED_LEGACY_GROUPS = ['1519967596', '1847780795'] as const;

const LEGACY_TOPIC_ROUTE_GROUPS = ['uezdy'] as const;

const NUMERIC_TOPIC_PREFIXES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function getLegacyRouteDisallowPaths(): string[] {
  const removedGroupPaths = REMOVED_LEGACY_GROUPS.map((slug) => `/${slug}`);

  const legacyTopicPaths = LEGACY_TOPIC_ROUTE_GROUPS.flatMap((slug) =>
    NUMERIC_TOPIC_PREFIXES.map((digit) => `/${slug}/${digit}`)
  );

  return [...removedGroupPaths, ...legacyTopicPaths];
}
