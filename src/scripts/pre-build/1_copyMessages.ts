import fs from 'fs';
import path from 'path';
import type { IScriptParams } from '../runner';

const FILES = ['messages.json', 'export_state.json'] as const;

export default async function copyMessages(_params: IScriptParams) {
  const dataDir = path.join(process.cwd(), 'data');
  const publicDir = path.join(process.cwd(), 'public');

  fs.mkdirSync(publicDir, { recursive: true });

  for (const file of FILES) {
    const sourcePath = path.join(dataDir, file);
    const targetPath = path.join(publicDir, file);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Prebuild: missing ${sourcePath}`);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Prebuild: copied ${file}`);
  }
}
