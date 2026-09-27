import { execFileSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packagesDir = fileURLToPath(new URL('../packages/', import.meta.url));
const packages = await readdir(packagesDir, { withFileTypes: true });
let checked = 0;

async function checkScripts(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await checkScripts(path);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      execFileSync(process.execPath, ['--check', path], { stdio: 'inherit' });
      checked++;
    }
  }
}

for (const entry of packages) {
  if (entry.isDirectory()) {
    await checkScripts(join(packagesDir, entry.name, 'src'));
  }
}

console.log(`Syntax checked: ${checked} script(s)`);
