import { Bool, ChannelHeadamp, MappedValue } from '@mxfriend/common';
import { AnalogIn, Bus, Channel, Mixer, OddSend } from '@mxfriend/libmxair';
import { Container, EnumValue, Node, pairs, ScaledValue, Value } from '@mxfriend/oscom';
import { StereoLinkAdapterInterface } from '../../types';
import { getLinkabilityChecker, LinkableChecker } from './utils';

export class MXAirStereoLinkAdapter implements StereoLinkAdapterInterface {
  private readonly mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer;
  }

  * getLinkPreferenceNodes(): Iterable<EnumValue<Bool>> {
    yield this.mixer.config.linkcfg.preamp;
    yield this.mixer.config.linkcfg.eq;
    yield this.mixer.config.linkcfg.dyn;
    yield this.mixer.config.linkcfg.fdrmute;
  }

  * getNativeLinks(): Iterable<[ch1: Container, ch2: Container, state: EnumValue<Bool>]> {
    for (const [channels, links] of [[this.mixer.ch, this.mixer.config.chlink], [this.mixer.bus, this.mixer.config.buslink]] as const) {
      let i = 0;

      for (const link of links.$children() as Iterable<EnumValue<Bool>>) {
        yield [channels.$get(i), channels.$get(i + 1), link];
        i += 2;
      }
    }
  }

  isChannelLinkable(ch1: Container, ch2?: Container): boolean {
    return ch1 instanceof Channel && (!ch2 || Math.abs(this.mixer.ch.$indexOf(ch1) - this.mixer.ch.$indexOf(ch2)) === 1)
      || ch1 instanceof Bus && (!ch2 || Math.abs(this.mixer.bus.$indexOf(ch1) - this.mixer.bus.$indexOf(ch2)) === 1);
  }

  * getLinkableValuePairs(ch1: Container, ch2: Container): Iterable<[a: Value, b: Value, delay?: boolean]> {
    if (!(ch1 instanceof Channel && ch2 instanceof Channel) && !(ch1 instanceof Bus && ch2 instanceof Bus)) {
      return;
    }

    yield * this.getLinkableValuePairsMatching(getLinkabilityChecker(this.mixer), ch1, ch2);
    yield [this.getSoloSwitch(ch1), this.getSoloSwitch(ch2), true];

    if (this.mixer.config.linkcfg.preamp.$get() && ch1 instanceof Channel && ch2 instanceof Channel) {
      const in1 = !ch1.preamp.rtnsw.$get() ? ch1.config.insrc.$get() : undefined;
      const in2 = !ch2.preamp.rtnsw.$get() ? ch2.config.insrc.$get() : undefined;

      if (in1 !== undefined && in1 < AnalogIn.AuxL && in2 !== undefined && in2 < AnalogIn.AuxL) {
        const ha1 = this.mixer.headamp.$get(in1) as ChannelHeadamp;
        const ha2 = this.mixer.headamp.$get(in2) as ChannelHeadamp;
        yield [ha1.gain, ha2.gain];
        yield [ha1.phantom, ha2.phantom];
      }
    }
  }

  private * getLinkableValuePairsMatching(check: LinkableChecker, a: Node, b: Node): Iterable<[Value, Value]> {
    if (a instanceof Container && b instanceof Container) {
      for (const [ca, cb] of pairs(a.$children(), b.$children())) {
        yield * this.getLinkableValuePairsMatching(check, ca, cb);
      }
    } else if (a instanceof Value && b instanceof Value && check(a)) {
      yield [a, b];
    }
  }

  private getSoloSwitch(ch: Channel | Bus): EnumValue<Bool> {
    const [coll, offs] = ch instanceof Channel ? [this.mixer.ch, 0] : [this.mixer.bus, 39];
    return this.mixer['-stat'].solosw.$get(coll.$indexOf(ch) + offs);
  }

  * getNodesWhichShouldTriggerRelinking(ch: Container): Iterable<Value> {
    if (ch instanceof Channel) {
      yield ch.config.insrc;
      yield ch.preamp.rtnsw;
    }
  }

  * getMixPanNodes(ch: Container): Iterable<ScaledValue | MappedValue> {
    if (ch instanceof Channel) {
      yield ch.mix.pan;

      for (const idx of [0, 2, 4]) {
        yield (ch.mix.$get(idx) as OddSend).pan;
      }
    } else if (ch instanceof Bus) {
      yield ch.mix.pan;
    }
  }
}
