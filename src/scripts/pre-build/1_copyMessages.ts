import fs from 'fs';
import path from 'path';
import { enrichGroupWithExportState, isLocalArchiveGroup } from '@/lib/groups';
import { readJsonFile } from '@/lib/readJson';
import type { ExportState, GroupsManifest } from '@/types/telegram';
import type { IScriptParams } from '../runner';

const LOCAL_ARCHIVE_FILES = [
  'messages.json',
  'export_state.json',
  'topics.json',
] as const;

const METADATA_ONLY_FILES = ['export_state.json'] as const;

function copyGroupFiles(
  sourceDir: string,
  targetDir: string,
  slug: string,
  files: readonly string[]
) {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (!fs.existsSync(sourcePath)) {
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Prebuild: copied groups/${slug}/${file}`);
  }
}

function copyGroupData(dataDir: string, publicDir: string, skippedSlugs: Set<string>) {
  const groupsSourceDir = path.join(dataDir, 'groups');
  const groupsTargetDir = path.join(publicDir, 'groups');

  if (!fs.existsSync(groupsSourceDir)) {
    console.warn(`Prebuild: missing ${groupsSourceDir}`);
    return;
  }

  for (const slug of fs.readdirSync(groupsSourceDir, { withFileTypes: true })) {
    if (!slug.isDirectory()) {
      continue;
    }

    const sourceGroupDir = path.join(groupsSourceDir, slug.name);
    const targetGroupDir = path.join(groupsTargetDir, slug.name);
    const isMetadataOnly = skippedSlugs.has(slug.name);
    const files = isMetadataOnly ? METADATA_ONLY_FILES : LOCAL_ARCHIVE_FILES;

    copyGroupFiles(sourceGroupDir, targetGroupDir, slug.name, files);

    if (!isMetadataOnly) {
      continue;
    }

    for (const leftover of ['messages.json', 'topics.json'] as const) {
      const leftoverPath = path.join(targetGroupDir, leftover);

      if (!fs.existsSync(leftoverPath)) {
        continue;
      }

      fs.unlinkSync(leftoverPath);
      console.log(`Prebuild: removed public/groups/${slug.name}/${leftover}`);
    }
  }
}

export default async function copyMessages(_params: IScriptParams) {
  const dataDir = path.join(process.cwd(), 'data');
  const publicDir = path.join(process.cwd(), 'public');

  fs.mkdirSync(publicDir, { recursive: true });

  const manifestPath = path.join(dataDir, 'groups.json');
  const manifestTargetPath = path.join(publicDir, 'groups.json');
  const skippedSlugs = new Set<string>();

  if (fs.existsSync(manifestPath)) {
    const manifest = readJsonFile<GroupsManifest>('data/groups.json', {
      groups: [],
    });
    const enrichedManifest: GroupsManifest = {
      groups: manifest.groups.map((group) => {
        if (!isLocalArchiveGroup(group)) {
          skippedSlugs.add(group.slug);
        }

        const exportState = readJsonFile<ExportState | null>(
          `data/groups/${group.slug}/export_state.json`,
          null
        );

        return enrichGroupWithExportState(group, exportState);
      }),
    };

    fs.writeFileSync(
      manifestTargetPath,
      `${JSON.stringify(enrichedManifest, null, 2)}\n`
    );
    console.log('Prebuild: copied groups.json');
  } else {
    console.warn(`Prebuild: missing ${manifestPath}`);
  }

  copyGroupData(dataDir, publicDir, skippedSlugs);
}
