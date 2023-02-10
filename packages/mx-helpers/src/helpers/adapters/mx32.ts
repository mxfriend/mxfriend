import { Bool } from '@mxfriend/common';
import { AuxIn, Bus, Channel, DCA, FxReturn, Main, Mixer, MX32_UDP_PORT } from '@mxfriend/libmx32';
import { Container, EnumValue, StringValue } from '@mxfriend/oscom';
import {
  HeadroomAdjustmentAdapterInterface,
  MX32HeadroomAdjustmentAdapter,
} from '../../headroomAdjustment';
import { MX32StereoLinkAdapter, StereoLinkAdapterInterface } from '../../stereoLink';
import { AbstractMXHelperAdapter } from './mx';


export class MX32HelperAdapter extends AbstractMXHelperAdapter<Mixer> {
  constructor() {
    super({ port: MX32_UDP_PORT });
  }

  getId(): string {
    return 'mx32';
  }

  getChannelNames(channels: Container[]): string[] {
    return channels.map(ch => {
      if (ch instanceof Channel || ch instanceof AuxIn || ch instanceof FxReturn || ch instanceof Bus || ch instanceof Main || ch instanceof DCA) {
        return this.resolveName(ch, ch.config.name.$get());
      } else {
        return '?';
      }
    });
  }

  protected createMixer(): Mixer {
    return new Mixer();
  }

  protected createStereoLinkAdapter(mixer: Mixer): StereoLinkAdapterInterface {
    return new MX32StereoLinkAdapter(mixer);
  }

  protected createHeadroomAdjustmentAdapter(mixer: Mixer): HeadroomAdjustmentAdapterInterface {
    return new MX32HeadroomAdjustmentAdapter(mixer);
  }

  protected * getChannelNameNodes(mixer: Mixer): Iterable<StringValue> {
    for (const ch of [...mixer.ch, ...mixer.auxin, ...mixer.fxrtn, ...mixer.bus, mixer.main.st, mixer.main.m, ...mixer.dca]) {
      yield ch.config.name;
    }
  }

  protected getSoloSwitches(mixer: Mixer): Iterable<EnumValue<Bool>> {
    return mixer['-stat'].solosw;
  }

  protected getSoloTarget(mixer: Mixer, solo: EnumValue<Bool>): Container {
    const idx = mixer['-stat'].solosw.$indexOf(solo);

    if (idx < 0) {
      throw new Error(`Unknown solo target: ${idx}`);
    } else if (idx < 32) {
      return mixer.ch.$get(idx);
    } else if (idx < 40) {
      return mixer.auxin.$get(idx - 32);
    } else if (idx < 48) {
      return mixer.fxrtn.$get(idx - 40);
    } else if (idx < 64) {
      return mixer.bus.$get(idx - 48);
    } else if (idx < 70) {
      return mixer.mtx.$get(idx - 64);
    } else if (idx < 71) {
      return mixer.main.st;
    } else if (idx < 72) {
      return mixer.main.m;
    } else if (idx < 80) {
      return mixer.dca.$get(idx - 72);
    } else {
      throw new Error(`Unknown solo target: ${idx}`);
    }
  }
}
