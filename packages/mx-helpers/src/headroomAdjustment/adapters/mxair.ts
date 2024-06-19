import { MappedValue } from '@mxfriend/common';
import { AnalogIn, Bus, Channel, FxSend, LR, Mixer, Return, SendTap } from '@mxfriend/libmxair';
import { Collection, Container, ScaledValue, Value } from '@mxfriend/oscom';
import { HeadroomAdjustmentAdapterInterface } from '../types';

export class MXAirHeadroomAdjustmentAdapter implements HeadroomAdjustmentAdapterInterface {
  private readonly mixer: Mixer;

  constructor(mixer: Mixer) {
    this.mixer = mixer;
  }

  * getRequiredNodes(channels: Container[]): Iterable<Value> {
    for (const channel of channels) {
      if (channel instanceof Channel || channel instanceof Return) {
        yield * this.getChannelRequiredNodes(channel);
      } else if (channel instanceof Bus) {
        yield * this.getBusRequiredNodes(channel, this.mixer.bus);
      } else if (channel instanceof FxSend) {
        yield * this.getBusRequiredNodes(channel, this.mixer.fxsend, 6);
      } else if (channel instanceof LR) {
        yield * this.getLRRequiredNodes();
      }
    }
  }

  private * getChannelRequiredNodes(channel: Channel | Return): Iterable<Value> {
    yield channel.preamp.rtnsw;
    yield channel.mix.lr;
    yield channel.mix.fader;

    for (const mix of channel.mix) {
      yield mix.grpon;
      yield mix.tap;
      yield mix.level;
    }

    if (channel instanceof Channel) {
      yield channel.config.insrc;
      yield channel.gate.on;
      yield channel.gate.thr;
      yield channel.dyn.on;
      yield channel.dyn.thr;
    }
  }

  private * getBusRequiredNodes<B extends Bus | FxSend>(bus: B, collection: Collection<B>, offset: number = 0): Iterable<Value> {
    const idx = collection.$indexOf(bus);

    for (const ch of [...this.mixer.ch, this.mixer.rtn.aux, ...this.mixer.rtn]) {
      const mix = ch.mix.$get(idx + offset);
      yield mix.grpon;
      yield mix.tap;
      yield mix.level;
      yield ch.mix.fader;
    }

    if (bus instanceof Bus) {
      yield bus.dyn.on;
      yield bus.dyn.thr;
    }
  }

  private * getLRRequiredNodes(): Iterable<Value> {
    for (const ch of [...this.mixer.ch, this.mixer.rtn.aux, ...this.mixer.rtn, ...this.mixer.bus]) {
      yield ch.mix.lr;
      yield ch.mix.fader;
    }

    for (const rtn of this.mixer.rtn) {
      yield rtn.preamp.rtnsw;
    }

    yield this.mixer.lr.dyn.on;
    yield this.mixer.lr.dyn.thr;
  }

  * getAdjustmentSources(channels: Container[]): Iterable<ScaledValue | MappedValue> {
    for (const channel of channels) {
      if (channel instanceof Channel || channel instanceof Return) {
        if (channel.preamp.rtnsw.$get()) {
          yield channel.preamp.rtntrim;
        } else if (channel === this.mixer.rtn.aux) {
          yield this.mixer.headamp.$get(AnalogIn.AuxL).gain;
        } else if (channel instanceof Channel) {
          yield this.mixer.headamp.$get(channel.config.insrc.$get()!).gain;
        }
      } else if (channel instanceof Bus || channel instanceof FxSend || channel instanceof LR) {
        yield channel.mix.fader;
      }
    }
  }

  * getAdjustmentTargets(channels: Container[]): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    for (const channel of channels) {
      if (channel instanceof Channel) {
        yield * this.getChannelAdjustmentTargets(channel);
        yield * this.getDynAdjustmentTargets(channel);
      } else if (channel instanceof Return) {
        yield * this.getChannelAdjustmentTargets(channel);
      } else if (channel instanceof Bus) {
        yield * this.getBusAdjustmentTargets(channel, this.mixer.bus.$indexOf(channel));
      } else if (channel instanceof FxSend) {
        yield * this.getBusAdjustmentTargets(channel, this.mixer.fxsend.$indexOf(channel) + 6);
      } else if (channel instanceof LR) {
        yield * this.getLRAdjustmentTargets();
      }
    }
  }

  * getChannelAdjustmentTargets(channel: Channel | Return): Iterable<ScaledValue | MappedValue> {
    if (channel.mix.fader.$toValue()! > -Infinity) {
      yield channel.mix.fader;
    }

    for (const mix of channel.mix) {
      if (mix.tap.$get()! < SendTap.Post && mix.level.$toValue()! > -Infinity) {
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

  * getBusAdjustmentTargets(bus: Bus | FxSend, index: number = 0): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    for (const ch of [...this.mixer.ch, this.mixer.rtn.aux, ...this.mixer.rtn]) {
      const mix = ch.mix.$get(index);

      if (mix.tap.$get()! < SendTap.Grp && mix.level.$toValue()! > -Infinity) {
        yield mix.level;
      } else if (mix.tap.$get()! === SendTap.Grp && mix.grpon.$get() && ch.mix.fader.$toValue()! > -Infinity) {
        yield ch.mix.fader;
      }
    }

    if (bus instanceof Bus && bus.dyn.on.$get()) {
      yield bus.dyn.thr;
    }
  }

  * getLRAdjustmentTargets(): Iterable<ScaledValue | MappedValue | [ScaledValue | MappedValue, boolean]> {
    for (const ch of [...this.mixer.ch, this.mixer.rtn.aux, ...this.mixer.bus]) {
      if (ch.mix.lr.$get() && ch.mix.fader.$toValue()! > -Infinity) {
        yield ch.mix.fader;
      }
    }

    for (const rtn of this.mixer.rtn) {
      // returns with rtnsw off are usually post-fader fx returns - adjusting them
      // while also adjusting faders for the channels which feed into them would result
      // in double the adjustment
      if (rtn.mix.lr.$get() && rtn.mix.fader.$toValue()! > -Infinity && rtn.preamp.rtnsw.$get()) {
        yield rtn.mix.fader;
      }
    }

    if (this.mixer.lr.dyn.on.$get()) {
      yield this.mixer.lr.dyn.thr;
    }
  }
}
