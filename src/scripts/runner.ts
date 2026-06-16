import fs from 'fs';
import path from 'path';
import { loadEnvConfig } from '@next/env';

export interface IScriptParams {
  env: NodeJS.ProcessEnv;
}

loadEnvConfig(process.cwd());

const runAsync = async () => {
  const files = fs
    .readdirSync(path.join(__dirname, 'pre-build'))
    .filter((file) => file.endsWith('.ts'))
    .sort();

  for (const file of files) {
    const { default: defaultFunc }: { default: (params: IScriptParams) => void } =
      await import(`./pre-build/${file}`);

    try {
      console.log(`Running pre-build script '${file}'`);
      await defaultFunc({ env: process.env });
    } catch (error) {
      console.error(
        `SCRIPT RUNNER: failed to execute pre-build script '${file}'`
      );
      console.error(error);
      throw error;
    }
  }
};

(async () => {
  await runAsync();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
