export type SitemapUrlState = {
  lastModified: string;
  fingerprint?: string;
};

export type SitemapState = {
  version: 1;
  urls: Record<string, SitemapUrlState>;
};

export type SitemapUrlCandidate = {
  path: string;
  lastModified?: Date;
  fingerprint?: string;
  /** Group overview pages keep their first lastModified forever. */
  preserveLastModified?: boolean;
};
