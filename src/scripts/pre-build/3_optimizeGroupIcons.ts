import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import type { IScriptParams } from '../runner';

const GROUP_ICON_SOURCE = 'icon.jpg';

const ICON_VARIANTS = [
  { fileName: 'icon-32.webp', size: 32 },
  { fileName: 'icon-48.webp', size: 48 },
  { fileName: 'icon-96.webp', size: 96 },
  { fileName: 'icon-192.webp', size: 192 },
] as const;

async function optimizeGroupIcon(
  sourcePath: string,
  targetDir: string
): Promise<number> {
  let written = 0;

  for (const { fileName, size } of ICON_VARIANTS) {
    const targetPath = path.join(targetDir, fileName);

    await sharp(sourcePath)
      .resize(size, size, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(targetPath);

    written += 1;
  }

  return written;
}

export default async function optimizeGroupIcons(_params: IScriptParams) {
  const dataGroupsDir = path.join(process.cwd(), 'data', 'groups');
  const publicGroupsDir = path.join(process.cwd(), 'public', 'groups');

  if (!fs.existsSync(dataGroupsDir)) {
    console.warn(`Prebuild: missing ${dataGroupsDir}`);
    return;
  }

  let groupCount = 0;
  let fileCount = 0;

  for (const entry of fs.readdirSync(dataGroupsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const sourcePath = path.join(dataGroupsDir, entry.name, GROUP_ICON_SOURCE);

    if (!fs.existsSync(sourcePath)) {
      continue;
    }

    const targetDir = path.join(publicGroupsDir, entry.name);
    fs.mkdirSync(targetDir, { recursive: true });

    const written = await optimizeGroupIcon(sourcePath, targetDir);
    groupCount += 1;
    fileCount += written;

    console.log(
      `Prebuild: optimized groups/${entry.name}/${GROUP_ICON_SOURCE} -> ${written} WebP variant(s)`
    );
  }

  console.log(
    `Prebuild: optimized ${fileCount} icon file(s) for ${groupCount} group(s)`
  );
}
