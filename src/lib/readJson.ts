import fs from 'fs';
import path from 'path';

export function readJsonFile<T>(relativePath: string, fallback: T): T {
  const filePath = path.join(process.cwd(), relativePath);

  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}
