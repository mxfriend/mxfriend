#!/usr/bin/env node

import { parseArgs } from '@mxfriend/common/cli';
import { resolve, extname } from 'path';
import { ShowImporter } from './importer';

const [, action, ip, show] = parseArgs(process.argv, '<action>', '<ip>', '<file>');

(async () => {
  if (action === 'import') {
    const importer = new ShowImporter(ip);

    switch (extname(show)) {
      case 'shw':
        console.log('Importing show...');
        await importer.importShow(resolve(show));
        console.log('Done.');
        break;
      case 'scn':
      case 'snp':
        console.log(`Importing individual scenes and snippets coming soon!`);
        process.exit(1);
    }
  } else {
    // todo export
    console.log(`Unknown action: '${action}'`);
    process.exit(1);
  }
})();
