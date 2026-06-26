import fs from 'fs';
import path from 'path';
import { enrichGroupWithExportState } from '@/lib/groups';
import { readJsonFile } from '@/lib/readJson';
import type { ExportState, GroupsManifest } from '@/types/telegram';
import type { IScriptParams } from '../runner';

const GROUP_FILES = [
  'messages.json',
  'export_state.json',
  'topics.json',
] as const;

function copyGroupData(dataDir: string, publicDir: string, slugs: string[]) {
  const groupsSourceDir = path.join(dataDir, 'groups');
  const groupsTargetDir = path.join(publicDir, 'groups');

  if (!fs.existsSync(groupsSourceDir)) {
    console.warn(`Prebuild: missing ${groupsSourceDir}`);
    return;
  }

  for (const slug of slugs) {
    const sourceGroupDir = path.join(groupsSourceDir, slug);

    if (!fs.existsSync(sourceGroupDir)) {
      continue;
    }

    const targetGroupDir = path.join(groupsTargetDir, slug);
    fs.mkdirSync(targetGroupDir, { recursive: true });

    for (const file of GROUP_FILES) {
      const sourcePath = path.join(sourceGroupDir, file);
      const targetPath = path.join(targetGroupDir, file);

      if (!fs.existsSync(sourcePath)) {
        continue;
      }

      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Prebuild: copied groups/${slug}/${file}`);
    }
  }
}

export default async function copyMessages(_params: IScriptParams) {
  const dataDir = path.join(process.cwd(), 'data');
  const publicDir = path.join(process.cwd(), 'public');

  fs.mkdirSync(publicDir, { recursive: true });

  const manifestPath = path.join(dataDir, 'groups.json');
  const manifestTargetPath = path.join(publicDir, 'groups.json');

  if (fs.existsSync(manifestPath)) {
    const manifest = readJsonFile<GroupsManifest>('data/groups.json', {
      groups: [],
    });
    const enrichedManifest: GroupsManifest = {
      groups: manifest.groups.map((group) => {
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

    copyGroupData(
      dataDir,
      publicDir,
      manifest.groups.map((group) => group.slug)
    );
  } else {
    console.warn(`Prebuild: missing ${manifestPath}`);
  }
}
