import { cp, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packagesDir = fileURLToPath(new URL('../packages/', import.meta.url));
const packages = await readdir(packagesDir, { withFileTypes: true });

for (const entry of packages) {
  if (!entry.isDirectory()) continue;

  const packageDir = join(packagesDir, entry.name);
  await cp(join(packageDir, 'src'), join(packageDir, 'dist'), {
    recursive: true,
    force: true,
    filter: (source) => basename(source) !== '.gitkeep',
  });
  console.log(`Built @aelluxjs/${entry.name}`);
}
