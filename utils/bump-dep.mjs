import { resolve } from 'node:path';
import { argv, exit } from 'node:process';
import { execFile } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { inc } from 'semver';

if (argv.length < 4) {
  console.log(`Usage: ${argv[0]} ${argv[1]} <dependency> <version>`);
  exit(1);
}

const target = argv[2];
const version = argv[3];
const pkgDir = resolve('packages');
const packages = new Map();

for (const dir of await readdir(pkgDir, { withFileTypes: true, encoding: 'utf-8' })) {
  if (!dir.isDirectory()) {
    continue;
  }

  try {
    const pkgJson = await readFile(resolve('packages', dir.name, 'package.json'), 'utf-8');
    packages.set(dir.name, JSON.parse(pkgJson));
  } catch {
    // continue
  }
}

const queue = [{ name: target, version: `^${version}` }];
const modified = new Set();

while (queue.length) {
  const dep = queue.shift();
  console.log(`Bump ${dep.name} to ${dep.version}`);

  for (const [name, info] of packages) if (info.name !== dep.name) {
    if (info.dependencies && dep.name in info.dependencies && info.dependencies[dep.name] !== dep.version) {
      console.log(` - bumping in ${info.name}`);
      info.dependencies[dep.name] = dep.version;
    } else if (info.devDependencies && dep.name in info.devDependencies && info.devDependencies[dep.name] !== dep.version) {
      console.log(` - bumping in ${info.name}`);
      info.devDependencies[dep.name] = dep.version;
    } else {
      continue;
    }

    if (!modified.has(info.name)) {
      modified.add(info.name);

      if (await shouldPatch(name)) {
        info.version = inc(info.version, 'patch');
        queue.push({ name: info.name, version: `^${info.version}` });
      }
    }
  }
}

for (const [name, info] of packages) if (modified.has(info.name)) {
  await writeFile(resolve('packages', name, 'package.json'), JSON.stringify(info, null, 2));
}

async function shouldPatch(pkgName) {
  const filePath = `packages/${pkgName}/package.json`;

  return new Promise((resolve, reject) => {
    execFile('git', ['diff', `-G'"version":'`, '--name-only', 'HEAD', filePath], (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim() === filePath);
      }
    });
  });
}
