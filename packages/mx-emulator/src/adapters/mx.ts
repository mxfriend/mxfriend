import {
  AbstractMeterBank,
  BitmaskValue,
  Bool,
  CallCommand,
  IpAddress,
  Mixer,
  SceneLoader,
} from '@mxfriend/common';
import { StereoLinkAdapterInterface } from '@mxfriend/mx-helpers';
import { Collection, EnumValue } from '@mxfriend/oscom';
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
  protected abstract getMuteGroupNodes(): Iterable<EnumValue<Bool>>;
  protected abstract getMuteGroupTargets(): Iterable<[mask: BitmaskValue, on: EnumValue<Bool>]>;
  protected abstract getClearSoloCommand(): CallCommand;
  protected abstract getGlobalSoloState(): EnumValue<Bool>;
  protected abstract getSoloSwitchStates(): Iterable<EnumValue<Bool>>;

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
    scn.load(this.mixer, await readFile(this.getBlankSceneFilePath(), 'utf-8'));

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

    this.initMuteGroups();
    this.initSolo();
  }

  private initMuteGroups(): void {
    const btns = [...this.getMuteGroupNodes()];
    const targets = [...this.getMuteGroupTargets()];

    for (const [grp, btn] of btns.entries()) {
      btn.$on('remote-change', (on) => {
        toggleMuteGroup(grp, on ?? Bool.Off);
      });
    }

    function toggleMuteGroup(grp: number, mute: Bool): void {
      const grpMask = 1 << grp;
      const excludeMask = mute ? 0 : btns.reduce((m, btn, idx) => btn.$get() ? (1 << idx) | m : m, 0);

      for (const [mask, on] of targets) {
        const targetMask = mask.$get() ?? 0;

        if ((targetMask & grpMask) && !(targetMask & excludeMask)) {
          on.$set(mute ? Bool.Off : Bool.On);
        }
      }
    }
  }

  private initSolo(): void {
    const states = [...this.getSoloSwitchStates()];
    const globalState = this.getGlobalSoloState();

    const handleSolo = (on?: Bool): void => {
      if (on) {
        globalState.$set(Bool.On);
      } else if (states.every((sw) => !sw.$get())) {
        globalState.$set(Bool.Off);
      }
    };

    for (const sw of states) {
      sw.$on('remote-change', handleSolo);
    }

    this.getClearSoloCommand().$on('remote-call', () => {
      for (const sw of states) {
        sw.$set(Bool.Off);
      }

      globalState.$set(Bool.Off);
    });
  }
}
