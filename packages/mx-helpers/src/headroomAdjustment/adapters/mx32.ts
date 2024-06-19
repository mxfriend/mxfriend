import { MappedValue } from '@mxfriend/common';
import {
  AuxIn,
  Bus,
  Channel,
  AbstractMain,
  Mixer,
  OddSend,
  SendType,
  MonoMain, StereoMain,
} from '@mxfriend/libmx32';
import { Container, ScaledValue, Value } from '@mxfriend/oscom';
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
        yield * this.getBusRequiredNodes(channel);
      } else if (channel instanceof AbstractMain) {
        yield * this.getMainRequiredNodes(channel);
      }
    }
  }

  private * getChannelRequiredNodes(channel: Channel | AuxIn): Iterable<Value> {
    yield channel.mix.st;
    yield channel.mix.fader;
    yield channel.mix.mono;
    yield channel.mix.mlevel;

    for (const mix of channel.mix.$items()) {
      yield mix.on;
      yield mix.level;

      if (mix instanceof OddSend) {
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

  private * getBusRequiredNodes(bus: Bus): Iterable<Value> {
    const idx = this.mixer.bus.$indexOf(bus);

    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.fxrtn]) {
      const mix = ch.mix.$get(idx);
      const oddMix = (idx % 2 ? ch.mix.$get(idx - 1) : mix) as OddSend;

      yield mix.on;
      yield mix.level;
      yield oddMix.type;
      yield ch.mix.fader;
    }

    if (bus instanceof Bus) {
      yield bus.dyn.on;
      yield bus.dyn.thr;
    }
  }

  private * getMainRequiredNodes(channel: AbstractMain): Iterable<Value> {
    const st = channel === this.mixer.main.st;

    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.fxrtn, ...this.mixer.bus]) {
      yield st ? ch.mix.st : ch.mix.mono;
      yield st ? ch.mix.fader : ch.mix.mlevel;
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
      } else if (channel instanceof Bus || channel instanceof MonoMain || channel instanceof StereoMain) {
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
      } else if (channel instanceof AbstractMain) {
        yield * this.getMainAdjustmentTargets(channel);
      }
    }
  }

  * getChannelAdjustmentTargets(channel: Channel | AuxIn): Iterable<ScaledValue | MappedValue> {
    if (channel.mix.fader.$toValue()! > -Infinity) {
      yield channel.mix.fader;
    }

    let sendType: SendType = SendType.Subgroup;

    for (const mix of channel.mix.$items()) {
      mix instanceof OddSend && (sendType = mix.type.$get()!);

      if (sendType < SendType.PostFader && mix.level.$toValue()! > -Infinity) {
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
      const oddMix = (index % 2 ? ch.mix.$get(index - 1) : mix) as OddSend;
      const sendType = oddMix.type;

      if (sendType.$get()! < SendType.Subgroup && mix.level.$toValue()! > -Infinity) {
        yield mix.level;
      } else if (sendType.$get() === SendType.Subgroup && mix.on.$get() && ch.mix.fader.$toValue()! > -Infinity) {
        yield ch.mix.fader;
      }
    }

    if (bus instanceof Bus && bus.dyn.on.$get()) {
      yield bus.dyn.thr;
    }
  }

  * getMainAdjustmentTargets(channel: AbstractMain): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    const st = channel === this.mixer.main.st;

    // no fxrtn here - those are usually post-fader effect returns; adjusting them here
    // while also adjusting the faders of channels which feed into them would result
    // in double the adjustment
    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.bus]) {
      if (st && ch.mix.st.$get() && ch.mix.fader.$toValue()! > -Infinity) {
        yield ch.mix.fader;
      } else if (!st && ch.mix.mono.$get() && ch.mix.mlevel.$toValue()! > -Infinity) {
        yield ch.mix.mlevel;
      }
    }

    if (channel.dyn.on.$get()) {
      yield channel.dyn.thr;
    }
  }
}
