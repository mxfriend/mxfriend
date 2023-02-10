import { osc, OSCArgument } from '@mxfriend/osc';
import { Value } from '@mxfriend/oscom';

export type MixerState = [adapterId: string, mixerId: string, mixerName: string, active: boolean];

export class MixerList extends Value<MixerState[]> {
  $handleCall(peer?: unknown, arg?: OSCArgument): OSCArgument | undefined {
    return super.$handleCall(peer, arg);
  }

  $fromOSC(arg: OSCArgument, local: boolean = false, peer?: unknown): void {
    if (osc.is.array(arg)) {
      const list = arg.value
        .map((v) => osc.is.array(v) && osc.extract(v.value, 's', 's', 's', 'B'))
        .filter(isMixer);

      this.$set(list, local, peer);
    }
  }

  $toOSC(): OSCArgument | undefined {
    const list = this.$get();

    return list ? osc.array(...list.map((m) => osc.array(
      osc.string(m[0]),
      osc.string(m[1]),
      osc.string(m[2]),
      osc.bool(m[3]),
    ))) : undefined;
  }
}

function isMixer(value: Partial<MixerState> | false): value is MixerState {
  return value && value[0] !== undefined;
}
