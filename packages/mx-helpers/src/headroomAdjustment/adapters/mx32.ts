import { MappedValue } from '@mxfriend/common';
import { AuxIn, Bus, Channel, Main, Mixer, SendType } from '@mxfriend/libmx32';
import { Collection, Container, ScaledValue, Value } from '@mxfriend/oscom';
import { HeadroomAdjustmentAdapterInterface } from '../types';

export class MX32HeadroomAdjustmentAdapter implements HeadroomAdjustmentAdapterInterface {
  private readonly mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer;
  }

  * getRequiredNodes(channels: Container[]): Iterable<Value> {
    yield this.mixer.config.mono.mode;
    yield this.mixer.config.mono.link;
    yield this.mixer['-prefs'].haflags;

    for (const channel of channels) {
      if (channel instanceof Channel || channel instanceof AuxIn) {
        yield * this.getChannelRequiredNodes(channel);
      } else if (channel instanceof Bus) {
        yield * this.getBusRequiredNodes(channel, this.mixer.bus);
      } else if (channel instanceof Main) {
        yield * this.getMainRequiredNodes(channel);
      }
    }
  }

  private * getChannelRequiredNodes(channel: Channel | AuxIn): Iterable<Value> {
    yield channel.mix.st;
    yield channel.mix.fader;
    yield channel.mix.mono;
    yield channel.mix.mlevel;

    for (const [i, mix] of channel.mix.$items(false, true)) {
      yield mix.on;
      yield mix.level;

      if (i % 2 === 0) {
        yield mix.type;
      }
    }

    if (channel instanceof Channel) {
      yield this.mixer['-ha'].$get(this.mixer.ch.$indexOf(channel)).index;
      yield channel.gate.on;
      yield channel.gate.thr;
      yield channel.dyn.on;
      yield channel.dyn.thr;
    } else if (channel instanceof AuxIn) {
      yield this.mixer['-ha'].$get(this.mixer.auxin.$indexOf(channel) + 32).index;
    }
  }

  private * getBusRequiredNodes(bus: Bus, collection: Collection<Bus>): Iterable<Value> {
    const idx = collection.$indexOf(bus);

    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.fxrtn]) {
      const mix = ch.mix.$get(idx);
      yield mix.on;

      if (idx % 2 === 0) {
        yield mix.type;
      }
    }

    if (bus instanceof Bus) {
      yield bus.dyn.on;
      yield bus.dyn.thr;
    }
  }

  private * getMainRequiredNodes(channel: Main): Iterable<Value> {
    const st = channel === this.mixer.main.st;

    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.fxrtn, ...this.mixer.bus]) {
      yield st ? ch.mix.st : ch.mix.mono;
    }

    yield channel.dyn.on;
    yield channel.dyn.thr;
  }

  * getAdjustmentSources(channels: Container[]): Iterable<ScaledValue | MappedValue> {
    for (const channel of channels) {
      if (channel instanceof Channel || channel instanceof AuxIn) {
        if (this.mixer['-prefs'].haflags.$get() ?? 0 & 0b10) {
          yield channel.preamp.trim;
        } else {
          const [src, offs] = channel instanceof AuxIn ? [this.mixer.auxin, 32] : [this.mixer.ch, 0];
          const idx = this.mixer['-ha'].$get(src.$indexOf(channel) + offs).index.$get() ?? -1;

          if (idx < 0) {
            yield channel.preamp.trim;
          } else {
            yield this.mixer.headamp.$get(idx).gain;
          }
        }
      } else if (channel instanceof Bus || channel instanceof Main) {
        yield channel.mix.fader;
      }
    }
  }

  * getAdjustmentTargets(channels: Container[]): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    for (const channel of channels) {
      if (channel instanceof Channel) {
        yield * this.getChannelAdjustmentTargets(channel);
        yield * this.getDynAdjustmentTargets(channel);
      } else if (channel instanceof AuxIn) {
        yield * this.getChannelAdjustmentTargets(channel);
      } else if (channel instanceof Bus) {
        yield * this.getBusAdjustmentTargets(channel, this.mixer.bus.$indexOf(channel));
      } else if (channel instanceof Main) {
        yield * this.getMainAdjustmentTargets(channel);
      }
    }
  }

  * getChannelAdjustmentTargets(channel: Channel | AuxIn): Iterable<ScaledValue | MappedValue> {
    if (channel.mix.fader.$get()! > -Infinity) {
      yield channel.mix.fader;
    }

    let sendType: SendType = SendType.Subgroup;

    for (const [idx, mix] of channel.mix.$items(false, true)) {
      idx % 2 === 0 && (sendType = mix.type.$get()!);

      if (sendType < SendType.PostFader && mix.level.$get()! > -Infinity) {
        yield mix.level;
      }
    }
  }

  * getDynAdjustmentTargets(channel: Channel): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    if (channel.gate.on.$get()) {
      yield [channel.gate.thr, true];
    }

    if (channel.dyn.on.$get()) {
      yield [channel.dyn.thr, true];
    }
  }

  * getBusAdjustmentTargets(bus: Bus, index: number = 0): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.fxrtn]) {
      const mix = ch.mix.$get(index);
      const sendType = index % 2 ? ch.mix.$get(index - 1).type : mix.type;

      if (sendType.$get()! < SendType.Subgroup && mix.level.$get()! > -Infinity) {
        yield mix.level;
      } else if (ch.mix.fader.$get()! > -Infinity) {
        yield ch.mix.fader;
      }
    }

    if (bus instanceof Bus && bus.dyn.on.$get()) {
      yield bus.dyn.thr;
    }
  }

  * getMainAdjustmentTargets(channel: Main): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    const st = channel === this.mixer.main.st;

    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.fxrtn, ...this.mixer.bus]) {
      if (st && ch.mix.st.$get() && ch.mix.fader.$get()! > -Infinity) {
        yield ch.mix.fader;
      } else if (!st && ch.mix.mono.$get() && ch.mix.mlevel.$get()! > -Infinity) {
        yield ch.mix.mlevel;
      }
    }

    if (channel.dyn.on.$get()) {
      yield channel.dyn.thr;
    }
  }
}
