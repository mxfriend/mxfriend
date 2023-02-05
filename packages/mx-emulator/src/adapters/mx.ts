import { AbstractMeterBank, IpAddress, Mixer, SceneLoader } from '@mxfriend/common';
import { StereoLinkAdapterInterface } from '@mxfriend/mx-helpers';
import { Collection } from '@mxfriend/oscom';
import { readFile } from 'node:fs/promises';
import { EmulatorAdapterInterface } from './types';

export type RangeAddressResolver = (pattern: string, index: number) => string;

export abstract class AbstractMXEmulatorAdapter<TMixer extends Mixer> implements EmulatorAdapterInterface {
  protected readonly mixer: TMixer;
  protected readonly model: string;

  constructor(mixer: TMixer, model: string) {
    this.mixer = mixer;
    this.model = model.toUpperCase();
  }

  abstract getPort(): number;
  abstract getMeters(): Collection<AbstractMeterBank>;
  abstract createStereoLinkAdapter(): StereoLinkAdapterInterface;
  protected abstract createRangeAddressResolver(sample: string): RangeAddressResolver;
  protected abstract getBlankSceneFilePath(): string;
  protected abstract getMixerIPNodes(): Iterable<IpAddress>;

  getMixer(): TMixer {
    return this.mixer;
  }

  resolveSubscriptionPatterns(patterns: string[], start: number, end: number): string[] {
    const indices: number[] = [...new Array(end - start + 1).keys()];
    const resolve = this.createRangeAddressResolver(patterns[0]);
    return indices.flatMap((i) => patterns.map((pattern) => resolve(pattern, start + i)));
  }

  async initMixer(ip: string): Promise<void> {
    const scn = new SceneLoader();
    await scn.load(this.mixer, await readFile(this.getBlankSceneFilePath(), 'utf-8'));

    const name = `${this.model} Emulator`;

    this.mixer.info.serverName.$set(name);
    this.mixer.info.serverVersion.$set('1.0');
    this.mixer.info.consoleModel.$set(this.model);
    this.mixer.xinfo.networkAddress.$set(ip);
    this.mixer.xinfo.networkName.$set(name);
    this.mixer.xinfo.consoleModel.$set(this.model);
    this.mixer.status.ip.$set(ip);
    this.mixer.status.name.$set(name);

    const words = ip.split(/\./g).map((v) => parseInt(v, 10));

    for (const node of this.getMixerIPNodes()) {
      for (const [i, b] of words.entries()) {
        node.$get(i).$set(b, true);
      }
    }
  }
}
