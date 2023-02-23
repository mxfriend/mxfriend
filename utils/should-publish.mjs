import { resolve } from 'node:path';
import { argv, exit } from 'node:process';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';

if (argv.length < 3) {
  console.log(`Usage: ${argv[0]} ${argv[1]} <package>`);
  exit(1);
}

const pkg = resolve('packages', argv[2], 'package.json');
const localInfo = JSON.parse(await readFile(pkg, 'utf-8'));
const regInfo = await getPublishedVersion();

if (
  regInfo.error?.code === 'E404'
  || !regInfo.error && regInfo.version !== localInfo.version
) {
  console.log(`Publishing new version of ${localInfo.name}...`);
  exit(0);
} else {
  console.log(`Latest version of ${localInfo.name} already published.`);
  exit(1);
}

async function getPublishedVersion() {
  return new Promise((resolve) => {
    execFile('npm', ['view', localInfo.name, '--json'], {
      encoding: 'utf-8',
      shell: true,
    }, (err, stdout) => {
      resolve(JSON.parse(stdout));
    });
  });
}
