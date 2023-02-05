import { Bool, MappedValue } from '@mxfriend/common';
import { AuxIn, Bus, Channel, FxReturn, Matrix, Mixer } from '@mxfriend/libmx32';
import { Container, EnumValue, IntValue, Node, pairs, ScaledValue, Value } from '@mxfriend/oscom';
import { StereoLinkAdapterInterface } from '../../types';
import { getLinkabilityChecker, LinkableChecker } from './utils';

export class MX32StereoLinkAdapter implements StereoLinkAdapterInterface {
  private readonly mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer;
  }

  * getLinkPreferenceNodes(): Iterable<EnumValue<Bool>> {
    yield this.mixer.config.linkcfg.hadly;
    yield this.mixer.config.linkcfg.eq;
    yield this.mixer.config.linkcfg.dyn;
    yield this.mixer.config.linkcfg.fdrmute;
  }

  * getNativeLinks(): Iterable<[ch1: Container, ch2: Container, state: EnumValue<Bool>]> {
    const sources = [
      [this.mixer.ch, this.mixer.config.chlink],
      [this.mixer.auxin, this.mixer.config.auxlink],
      [this.mixer.fxrtn, this.mixer.config.fxlink],
      [this.mixer.bus, this.mixer.config.buslink],
      [this.mixer.mtx, this.mixer.config.mtxlink],
    ] as const;

    for (const [channels, links] of sources) {
      let i = 0;

      for (const link of links.$children() as Iterable<EnumValue<Bool>>) {
        yield [channels.$get(i), channels.$get(i + 1), link];
        i += 2;
      }
    }
  }

  isChannelLinkable(ch1: Container, ch2?: Container): boolean {
    const sources = [
      [Channel, this.mixer.ch],
      [AuxIn, this.mixer.auxin],
      [FxReturn, this.mixer.fxrtn],
      [Bus, this.mixer.bus],
      [Matrix, this.mixer.mtx],
    ] as const;

    for (const [type, list] of sources) {
      if (ch1 instanceof type) {
        return !ch2 || ch2 instanceof type && Math.abs(list.$indexOf(ch1) - list.$indexOf(ch2)) === 1;
      }
    }

    return false;
  }

  * getLinkableValuePairs(ch1: Container, ch2: Container): Iterable<[Value, Value]> {
    if (
      !(ch1 instanceof Channel && ch2 instanceof Channel)
      && !(ch1 instanceof AuxIn && ch2 instanceof AuxIn)
      && !(ch1 instanceof FxReturn && ch2 instanceof FxReturn)
      && !(ch1 instanceof Bus && ch2 instanceof Bus)
      && !(ch1 instanceof Matrix && ch2 instanceof Matrix)
    ) {
      return;
    }

    yield * this.getLinkableValuePairsMatching(getLinkabilityChecker(this.mixer), ch1, ch2);
    yield [this.getSoloSwitch(ch1), this.getSoloSwitch(ch2)];

    if (!this.mixer.config.linkcfg.hadly.$get()) {
      return;
    }

    if (ch1 instanceof Channel && ch2 instanceof Channel || ch1 instanceof AuxIn && ch2 instanceof AuxIn) {
      const in1 = this.getHeadampIndex(ch1).$get() ?? -1;
      const in2 = this.getHeadampIndex(ch2).$get() ?? -1;

      if (in1 > -1 && in2 > -1) {
        const ha1 = this.mixer.headamp.$get(in1);
        const ha2 = this.mixer.headamp.$get(in2);
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

  private getSoloSwitch(ch: Channel | AuxIn | FxReturn | Bus | Matrix): EnumValue<Bool> {
    const sources = [
      [Channel, this.mixer.ch, 0],
      [AuxIn, this.mixer.auxin, 32],
      [FxReturn, this.mixer.fxrtn, 40],
      [Bus, this.mixer.bus, 48],
      [Matrix, this.mixer.mtx, 64],
    ] as const;

    for (const [type, list, offset] of sources) {
      if (ch instanceof type) {
        return this.mixer['-stat'].solosw.$get(list.$indexOf(ch) + offset);
      }
    }

    throw new Error(`Unknown solo target ${ch.$address}`);
  }

  private getHeadampIndex(ch: Channel | AuxIn): IntValue {
    return ch instanceof AuxIn
      ? this.mixer['-ha'].$get(this.mixer.auxin.$indexOf(ch) + 32).index
      : this.mixer['-ha'].$get(this.mixer.ch.$indexOf(ch)).index;
  }

  * getNodesWhichShouldTriggerRelinking(ch: Container): Iterable<Value> {
    if (ch instanceof Channel || ch instanceof AuxIn) {
      yield this.getHeadampIndex(ch);
    }
  }

  * getMixPanNodes(ch: Container): Iterable<ScaledValue | MappedValue> {
    if (ch instanceof Channel) {
      yield ch.mix.pan;

      for (const idx of [0, 2, 4, 6, 8, 10, 12, 14]) {
        yield ch.mix.$get(idx).pan;
      }
    } else if (ch instanceof Bus) {
      yield ch.mix.pan;
    }
  }
}
