import { isOSCType, osc, OSCArgument } from '@mxfriend/osc';
import {
  Collection,
  Command,
  Container,
  IntValue,
  Property,
  StringValue,
  Value,
} from '@mxfriend/oscom';

export class SnapshotCommand extends Command {
  $call(snapshot: number): void {
    this.$emit('local-call', osc.compose('i', snapshot), this);
  }
}

export type SnapshotScope = {
  ch1: boolean, ch2: boolean, ch3: boolean, ch4: boolean, ch5: boolean, ch6: boolean, ch7: boolean,
  ch8: boolean, ch9: boolean, ch10: boolean, ch11: boolean, ch12: boolean, ch13: boolean, ch14: boolean,
  ch15: boolean, ch16: boolean, aux: boolean, fxrtn1: boolean, fxrtn2: boolean, fxrtn3: boolean, fxrtn4: boolean,
  busmstr1: boolean, busmstr2: boolean, busmstr3: boolean, busmstr4: boolean, busmstr5: boolean, busmstr6: boolean,
  fxsendmstr1: boolean, fxsendmstr2: boolean, fxsendmstr3: boolean, fxsendmstr4: boolean, lr: boolean,
  dca1: boolean, dca2: boolean, dca3: boolean, dca4: boolean, fx1: boolean, fx2: boolean, fx3: boolean, fx4: boolean,
  source: boolean, input: boolean, config: boolean, eq: boolean, dyn: boolean,
  bussend1: boolean, bussend2: boolean, bussend3: boolean, bussend4: boolean, bussend5: boolean, bussend6: boolean,
  fxsend1: boolean, fxsend2: boolean, fxsend3: boolean, fxsend4: boolean, fdrpan: boolean, mute: boolean,
  routing: boolean, consolecfg: boolean,
};

const snapshotScopeKeys: (keyof SnapshotScope)[] = [
  'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9', 'ch10', 'ch11', 'ch12', 'ch13', 'ch14',
  'ch15', 'ch16', 'aux', 'fxrtn1', 'fxrtn2', 'fxrtn3', 'fxrtn4', 'busmstr1', 'busmstr2', 'busmstr3', 'busmstr4', 'busmstr5', 'busmstr6',
  'fxsendmstr1', 'fxsendmstr2', 'fxsendmstr3', 'fxsendmstr4', 'lr', 'dca1', 'dca2', 'dca3', 'dca4', 'fx1', 'fx2', 'fx3', 'fx4',
  'source', 'input', 'config', 'eq', 'dyn', 'bussend1', 'bussend2', 'bussend3', 'bussend4', 'bussend5', 'bussend6',
  'fxsend1', 'fxsend2', 'fxsend3', 'fxsend4', 'fdrpan', 'mute', 'routing', 'consolecfg',
];

export class SnapshotScopeValue extends Value<SnapshotScope> {
  $fromOSC(arg: OSCArgument, local: boolean = false): void {
    if (isOSCType(arg, 's')) {
      this.$fromText(arg.value, local);
    }
  }

  $toOSC(): OSCArgument | undefined {
    return osc.optional.string(this.$toText());
  }

  $fromText(value: string, local: boolean = true): void {
    this.$set(
      Object.fromEntries(snapshotScopeKeys.map((key, i) => [key, value.charAt(i) === '+'])) as SnapshotScope,
      local,
    );
  }

  $toText(): string | undefined {
    const value = this.$get();
    return value
      ? snapshotScopeKeys.map((k) => value[k] ? '+' : '-').join('')
      : undefined;
  }
}

export class Snapshot extends Container {
  @Property name: StringValue;
  @Property scope: SnapshotScopeValue;

  constructor() {
    super(true);
  }
}

export class SnapshotList extends Collection<Snapshot> {
  @Property name: StringValue;
  @Property index: IntValue;
  @Property load: SnapshotCommand;
  @Property save: SnapshotCommand;
  @Property delete: SnapshotCommand;

  constructor() {
    super(() => new Snapshot(), { size: 64, pad: 2, callable: true });
  }
}
