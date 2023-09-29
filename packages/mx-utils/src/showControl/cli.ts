#!/usr/bin/env node

import { parseArgs } from '@mxfriend/common/cli';
import { resolve, extname } from 'path';
import { ShowImporter } from './importer';

const [, action, ip, show] = parseArgs(process.argv, '<action>', '<ip>', '<file>');

(async () => {
  if (action === 'import') {
    const importer = new ShowImporter(ip);

    await importer.init();

    switch (extname(show)) {
      case '.shw':
        console.log('Importing show...');
        await importer.importShow(resolve(show));
        console.log('Done.');
        break;
      default:
        console.log(`Importing individual scenes and snippets coming soon!`);
        process.exit(1);
    }

    await importer.cleanup();
  } else {
    // todo export
    console.log(`Unknown action: '${action}'`);
    process.exit(1);
  }
})();
