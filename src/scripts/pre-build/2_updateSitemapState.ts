import fs from 'fs';
import path from 'path';
import {
  buildSitemapState,
  SITEMAP_STATE_PATH,
  SITEMAP_STATE_SOURCE_PATH,
} from '@/lib/sitemapState';
import { readJsonFile } from '@/lib/readJson';
import type { SitemapState } from '@/types/sitemap';
import type { IScriptParams } from '../runner';

const EMPTY_STATE: SitemapState = {
  version: 1,
  urls: {},
};

function writeJson(relativePath: string, data: SitemapState) {
  const filePath = path.join(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

export default async function updateSitemapState(_params: IScriptParams) {
  const previousState = readJsonFile<SitemapState>(
    SITEMAP_STATE_SOURCE_PATH,
    EMPTY_STATE
  );
  const nextState = buildSitemapState(previousState);

  writeJson(SITEMAP_STATE_SOURCE_PATH, nextState);
  writeJson(SITEMAP_STATE_PATH, nextState);

  const previousCount = Object.keys(previousState.urls).length;
  const nextCount = Object.keys(nextState.urls).length;
  const updatedCount = Object.entries(nextState.urls).filter(([url, state]) => {
    const previous = previousState.urls[url];

    return (
      !previous ||
      previous.lastModified !== state.lastModified ||
      previous.fingerprint !== state.fingerprint
    );
  }).length;

  console.log(
    `Prebuild: sitemap state ${previousCount} -> ${nextCount} URL(s), ${updatedCount} changed`
  );
}
