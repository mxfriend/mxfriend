import { sleep } from '@mxfriend/common';
import { osc, OSCMessage } from '@mxfriend/osc';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { DeferrableTimeout, query } from '../utils';
import { AbstractShowControlUtil } from './abstract';
import { getSceneNodes } from './nodes';

export class ShowExporter extends AbstractShowControlUtil {
  async exportShow(path: string): Promise<void> {
    const entries = await this.dumpShow();
    const name = this.extractShowName(entries);
    const basePath = join(path, name);
    await this.writeShowFile(basePath + '.shw', entries);

    for (const entry of entries) {
      const [cmd, ...args] = this.parseLine(entry);
      const [type, idx] = cmd.split('/');

      switch (type) {
        case 'cue': break; // noop
        case 'scene':
          await this.dumpScene(parseInt(idx, 10), `${basePath}.${idx}.scn`, args[0], args[1], this.parseMask(args[2]));
          break;
      }
    }
  }

  private async dumpShow(): Promise<string[]> {
    const entries: string[] = [];
    const done = new Promise<void>((resolve) => {
      const tmr = new DeferrableTimeout(1500, () => {
        this.conn.unsubscribe('node', handleEntry);
        resolve();
      });

      const handleEntry = ({ args: [arg] }: OSCMessage): void => {
        if (osc.is.string(arg)) {
          tmr.postpone();
          entries.push(arg.value.replace(/^\/show\/showfile\//, '').trim());
        }
      };

      this.conn.subscribe('node', handleEntry);
    });

    await this.conn.send('/showdump');
    await done;
    return entries;
  }

  private extractShowName(entries: string[]): string {
    const show = entries.find((entry) => /^show\s+/.test(entry)) ?? '';
    const [, name] = this.parseLine(show);

    if (name !== undefined) {
      const saneName = name.replace(/[^-a-z0-9_.\s]+/ig, ' ').trim();

      if (saneName.length) {
        return saneName;
      }
    }

    return `show.${new Date().toISOString().replace(/\.\d+Z$/, '').replace(/[^-0-9]+/g, '-')}`;
  }

  private async writeShowFile(path: string, entries: string[]): Promise<void> {
    const contents = `#4.0#\n${entries.join('\n')}\n`;
    await writeFile(path, contents);
  }

  private async dumpScene(idx: number, path: string, name: string, note?: string, safes?: number): Promise<void> {
    const idx3 = idx.toString().padStart(3, '0');

    if (safes !== undefined) {
      await this.conn.send(`/‐show/showfile/scene/${idx3}/safes`, osc.compose('i', 0));
      // todo clear show safes
    }

    await this.conn.send('/-action/goscene', osc.compose('i', idx - 1));
    await sleep(500);

    const lines: string[] = [];

    for (const node of getSceneNodes()) {
      const [line] = osc.extract(await query(this.conn, '/node', osc.compose('s', node), 'node'), 's');

      if (line !== undefined) {
        lines.push(line.trim());
      }
    }

    if (safes !== undefined) {
      await this.conn.send(`/‐show/showfile/scene/${idx3}/safes`, osc.compose('i', safes));
      // todo restore show safes
    }

    const mask = (safes ?? 0).toString(2).padStart(9, '0');
    const content = `#4.0# "${name}" "${note ?? ''}" %${mask} 1\n${lines.join('\n')}\n`;
    await writeFile(path, content);
  }
}
