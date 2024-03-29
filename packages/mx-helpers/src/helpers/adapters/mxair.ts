import { Bool } from '@mxfriend/common';
import { Bus, Channel, DCA, FxSend, LR, Mixer, MXAIR_UDP_PORT, Return } from '@mxfriend/libmxair';
import { Container, EnumValue, StringValue } from '@mxfriend/oscom';
import {
  HeadroomAdjustmentAdapterInterface,
  MXAirHeadroomAdjustmentAdapter,
} from '../../headroomAdjustment';
import { MXAirStereoLinkAdapter, StereoLinkAdapterInterface } from '../../stereoLink';
import { AbstractMXHelperAdapter } from './mx';

export class MXAirHelperAdapter extends AbstractMXHelperAdapter<Mixer> {
  constructor() {
    super({ port: MXAIR_UDP_PORT });
  }

  getId(): string {
    return 'mxair';
  }

  getChannelNames(channels: Container[]): string[] {
    return channels.map(ch => {
      if (ch instanceof Channel || ch instanceof Return || ch instanceof Bus || ch instanceof FxSend || ch instanceof LR || ch instanceof DCA) {
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
    return new MXAirStereoLinkAdapter(mixer);
  }

  protected createHeadroomAdjustmentAdapter(mixer: Mixer): HeadroomAdjustmentAdapterInterface {
    return new MXAirHeadroomAdjustmentAdapter(mixer);
  }

  protected * getChannelNameNodes(mixer: Mixer): Iterable<StringValue> {
    for (const ch of [...mixer.ch, mixer.rtn.aux, ...mixer.rtn, ...mixer.bus, ...mixer.fxsend, mixer.lr, ...mixer.dca]) {
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
    } else if (idx < 16) {
      return mixer.ch.$get(idx);
    } else if (idx < 17) {
      return mixer.rtn.aux;
    } else if (idx < 21) {
      return mixer.rtn.$get(idx - 17);
    } else if (idx < 39) {
      throw new Error(`Unknown solo target: ${idx}`);
    } else if (idx < 45) {
      return mixer.bus.$get(idx - 39);
    } else if (idx < 49) {
      return mixer.fxsend.$get(idx - 45);
    } else if (idx < 50) {
      return mixer.lr;
    } else if (idx < 54) {
      return mixer.dca.$get(idx - 50);
    } else {
      throw new Error(`Unknown solo target: ${idx}`);
    }
  }
}
