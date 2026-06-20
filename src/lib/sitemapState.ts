import {
  getGroupArchiveContext,
  getGroupMessagePageParams,
  getTopicMessagePageParams,
} from '@/lib/groupArchive';
import { getGroups } from '@/lib/groups';
import {
  groupMessagesPagePath,
  groupOverviewPath,
  topicMessagesPagePath,
} from '@/lib/groupRoutes';
import { getDisplayableMessages } from '@/lib/messageFilters';
import { getTotalPages, slicePage } from '@/lib/pagination';
import { readJsonFile } from '@/lib/readJson';
import type {
  SitemapState,
  SitemapUrlCandidate,
  SitemapUrlState,
} from '@/types/sitemap';
import type { TelegramMessage } from '@/types/telegram';

export const SITEMAP_STATE_PATH = 'public/sitemap-state.json';
export const SITEMAP_STATE_SOURCE_PATH = 'data/sitemap-state.json';

const EMPTY_STATE: SitemapState = {
  version: 1,
  urls: {},
};

function maxMessageDate(messages: TelegramMessage[]): Date | undefined {
  const timestamps = messages
    .map((message) => message.date)
    .filter((value): value is string => value !== null)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return undefined;
  }

  return new Date(Math.max(...timestamps));
}

function minMessageDate(messages: TelegramMessage[]): Date | undefined {
  const timestamps = messages
    .map((message) => message.date)
    .filter((value): value is string => value !== null)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return undefined;
  }

  return new Date(Math.min(...timestamps));
}

export function buildPageFingerprint(
  pageMessages: TelegramMessage[]
): string {
  if (pageMessages.length === 0) {
    return '0:0';
  }

  const lastMessage = pageMessages[pageMessages.length - 1];

  return `${lastMessage.id}:${pageMessages.length}`;
}

function buildMessagePageCandidate(
  path: string,
  displayable: TelegramMessage[],
  page: number
): SitemapUrlCandidate {
  const pageMessages = slicePage(displayable, page);

  return {
    path,
    lastModified: maxMessageDate(pageMessages),
    fingerprint: buildPageFingerprint(pageMessages),
  };
}

export function collectSitemapUrlCandidates(): SitemapUrlCandidate[] {
  const candidates: SitemapUrlCandidate[] = [];

  for (const { group, page } of getGroupMessagePageParams()) {
    const context = getGroupArchiveContext(group);

    if (!context) {
      continue;
    }

    const displayable = getDisplayableMessages(context.messages);

    candidates.push(
      buildMessagePageCandidate(
        groupMessagesPagePath(group, Number(page)),
        displayable,
        Number(page)
      )
    );
  }

  for (const { group, topicId, page } of getTopicMessagePageParams()) {
    const context = getGroupArchiveContext(group);

    if (!context) {
      continue;
    }

    const displayable = getDisplayableMessages(
      context.messages,
      Number(topicId)
    );

    candidates.push(
      buildMessagePageCandidate(
        topicMessagesPagePath(group, Number(topicId), Number(page)),
        displayable,
        Number(page)
      )
    );
  }

  for (const group of getGroups()) {
    const context = getGroupArchiveContext(group.slug);

    if (!context) {
      continue;
    }

    const displayable = getDisplayableMessages(context.messages);

    candidates.push({
      path: groupOverviewPath(group.slug),
      lastModified: minMessageDate(displayable),
      preserveLastModified: true,
    });
  }

  return candidates;
}

function toUrlState(
  candidate: SitemapUrlCandidate
): SitemapUrlState | undefined {
  if (!candidate.lastModified) {
    return undefined;
  }

  return {
    lastModified: candidate.lastModified.toISOString(),
    ...(candidate.fingerprint ? { fingerprint: candidate.fingerprint } : {}),
  };
}

function mergeCandidate(
  previous: SitemapUrlState | undefined,
  candidate: SitemapUrlCandidate
): SitemapUrlState | undefined {
  if (candidate.preserveLastModified && previous) {
    return previous;
  }

  const next = toUrlState(candidate);

  if (!next) {
    return previous;
  }

  if (!previous) {
    return next;
  }

  if (
    candidate.fingerprint &&
    previous.fingerprint === candidate.fingerprint
  ) {
    return previous;
  }

  return next;
}

function resolveHomeLastModified(
  previousHome: SitemapUrlState | undefined,
  nextUrls: Record<string, SitemapUrlState>,
  contentChanged: boolean
): SitemapUrlState | undefined {
  if (contentChanged) {
    const timestamps = Object.entries(nextUrls)
      .filter(([path]) => path !== '/')
      .map(([, state]) => new Date(state.lastModified).getTime())
      .filter((value) => !Number.isNaN(value));

    if (timestamps.length === 0) {
      return previousHome;
    }

    return {
      lastModified: new Date(Math.max(...timestamps)).toISOString(),
    };
  }

  if (previousHome) {
    return previousHome;
  }

  const timestamps = Object.values(nextUrls)
    .map((state) => new Date(state.lastModified).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return undefined;
  }

  return {
    lastModified: new Date(Math.max(...timestamps)).toISOString(),
  };
}

export function mergeSitemapState(
  previousState: SitemapState,
  candidates: SitemapUrlCandidate[]
): SitemapState {
  const nextUrls: Record<string, SitemapUrlState> = {};
  let contentChanged = false;

  for (const candidate of candidates) {
    const previous = previousState.urls[candidate.path];
    const merged = mergeCandidate(previous, candidate);

    if (!merged) {
      continue;
    }

    nextUrls[candidate.path] = merged;

    if (
      !previous ||
      previous.lastModified !== merged.lastModified ||
      previous.fingerprint !== merged.fingerprint
    ) {
      contentChanged = true;
    }
  }

  const homeState = resolveHomeLastModified(
    previousState.urls['/'],
    nextUrls,
    contentChanged
  );

  if (homeState) {
    nextUrls['/'] = homeState;
  }

  return {
    version: 1,
    urls: nextUrls,
  };
}

export function buildSitemapState(
  previousState: SitemapState = EMPTY_STATE
): SitemapState {
  return mergeSitemapState(previousState, collectSitemapUrlCandidates());
}

export function readSitemapState(relativePath = SITEMAP_STATE_PATH): SitemapState {
  return readJsonFile<SitemapState>(relativePath, EMPTY_STATE);
}

export function isLastMessagePage(path: string): boolean {
  const groupMatch = path.match(/^\/([^/]+)\/messages\/(\d+)\/$/);

  if (groupMatch) {
    const [, slug, pageValue] = groupMatch;
    const context = getGroupArchiveContext(slug);

    if (!context || context.showTopics) {
      return false;
    }

    const totalPages = getTotalPages(
      getDisplayableMessages(context.messages).length
    );

    return Number(pageValue) === totalPages;
  }

  const topicMatch = path.match(
    /^\/([^/]+)\/topic\/(\d+)\/messages\/(\d+)\/$/
  );

  if (!topicMatch) {
    return false;
  }

  const [, slug, topicIdValue, pageValue] = topicMatch;
  const context = getGroupArchiveContext(slug);

  if (!context) {
    return false;
  }

  const totalPages = getTotalPages(
    getDisplayableMessages(context.messages, Number(topicIdValue)).length
  );

  return Number(pageValue) === totalPages;
}
