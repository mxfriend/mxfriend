import {
  Fader,
  Bitmask,
  Formatted,
  Mapped,
  BitmaskValue,
  MappedValue,
  Gate as GateCommon,
  Compressor as CompressorCommon,
  Eq4,
  Eq6,
  AutomixGroup,
  Bool,
  Frequency,
  RawEnumValue,
} from '@mxfriend/common';
import {
  Collection,
  Enum,
  EnumValue,
  Container,
  Property,
  ScaledValue,
  StringValue,
  IntValue,
  Linear,
  After,
} from '@mxfriend/oscom';
import {
  InputSource,
  Color,
  GateMode,
  HpSlope,
  InsertPos,
  InsertSlot,
  SendType,
  MatrixSendType,
  ExtendedEqBandType,
} from './enums';
import { Delay } from './misc';


export class ChannelConfig extends Container {
  @Property name: StringValue;
  @Property icon: IntValue;
  @Enum(Color) color: EnumValue<Color>;
  @Property source: RawEnumValue<InputSource>;

  constructor() {
    super(true);
  }
}

export class BusConfig extends Container {
  @Property name: StringValue;
  @Property icon: IntValue;
  @Enum(Color) color: EnumValue<Color>;

  constructor() {
    super(true);
  }
}



export class ChannelPreamp extends Container {
  @Formatted('+~.1') @Linear(-18, 18, 145) trim: ScaledValue;
  @Enum(Bool) invert: EnumValue<Bool>;
  @Enum(Bool) hpon: EnumValue<Bool>;
  @Enum(HpSlope) hpslope: EnumValue<HpSlope>;
  @Formatted('.0') @Mapped(20, 400, 101) hpf: MappedValue;

  constructor() {
    super(true);
  }
}

export class AuxInPreamp extends Container {
  @Formatted('+~.1') @Linear(-18, 18, 145) trim: ScaledValue;
  @Enum(Bool) invert: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class MatrixPreamp extends Container {
  @Enum(Bool) invert: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}


export class Gate extends GateCommon {
  @After('on') @Enum(GateMode) mode: EnumValue<GateMode>;
  @After('release') @Property keysrc: RawEnumValue<InputSource>;
}

export class Compressor extends CompressorCommon {
  @After('release') @Enum(InsertPos) pos: EnumValue<InsertPos>;
}

export class SidechainCompressor extends Compressor {
  @After('pos') @Property keysrc: RawEnumValue<InputSource>;
}

export class Insert extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Enum(InsertPos) pos: EnumValue<InsertPos>;
  @Enum(InsertSlot) sel: EnumValue<InsertSlot>;

  constructor() {
    super(true);
  }
}

export class ExtendedEqBand extends Container {
  @Enum(ExtendedEqBandType) type: EnumValue<ExtendedEqBandType>;
  @Frequency() f: MappedValue;
  @Formatted('+~3') @Linear(-15, 15, 121) g: ScaledValue;
  @Formatted(2) @Mapped(10, 0.3, 72) q: MappedValue;

  constructor() {
    super(true);
  }
}

export class ExtendedEq6 extends Collection<ExtendedEqBand> {
  @Enum(Bool) on: EnumValue<Bool>;

  constructor() {
    super(() => new ExtendedEqBand(), { size: 6, callable: true });
  }
}

const $even = Symbol('even');

export abstract class AbstractSend extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader(161) level: MappedValue;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;
  @Property panFollow: RawEnumValue<Bool>;

  private readonly [$even]: boolean;

  constructor(even: boolean) {
    super(true);
    this[$even] = even;
  }

  $getKnownProperties(): (string | number)[] {
    const props = super.$getKnownProperties();
    return this[$even] ? props.slice(0, 2) : props;
  }
}

export class Send extends AbstractSend {
  @After('pan') @Enum(SendType) type: EnumValue<SendType>;
}

export class MatrixSend extends AbstractSend {
  @After('pan') @Enum(MatrixSendType) type: EnumValue<MatrixSendType>;
}

export class ChannelMix extends Collection<Send> {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;
  @Enum(Bool) st: EnumValue<Bool>;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;
  @Enum(Bool) mono: EnumValue<Bool>;
  @Fader(161) mlevel: MappedValue;

  constructor() {
    super((i) => new Send(i % 2 > 0), { size: 16, pad: 2, callable: true });
  }
}

export class BusMix extends Collection<MatrixSend> {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;
  @Enum(Bool) st: EnumValue<Bool>;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;
  @Enum(Bool) mono: EnumValue<Bool>;
  @Fader(161) mlevel: MappedValue;

  constructor() {
    super((i) => new MatrixSend(i % 2 > 0), { size: 6, pad: 2, callable: true });
  }
}

export class MatrixMix extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;

  constructor() {
    super(true);
  }
}

export class MainMix extends Collection<MatrixSend> {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;

  constructor() {
    super((i) => new MatrixSend(i % 2 > 0), { size: 6, pad: 2, callable: true });
  }
}

export class Groups extends Container {
  @Bitmask(8) dca: BitmaskValue;
  @Bitmask(6) mute: BitmaskValue;

  constructor() {
    super(true);
  }
}

export class Automix extends Container {
  @Enum(AutomixGroup) group: EnumValue<AutomixGroup>;
  @Formatted('+.1') @Linear(-12, 12, 49) weight: ScaledValue;

  constructor() {
    super(true);
  }
}

export class Channel extends Container {
  @Property config: ChannelConfig;
  @Property delay: Delay;
  @Property preamp: ChannelPreamp;
  @Property gate: Gate;
  @Property dyn: SidechainCompressor;
  @Property insert: Insert;
  @Property eq: Eq4;
  @Property mix: ChannelMix;
  @Property grp: Groups;
  @Property automix: Automix;
}

export class AuxIn extends Container {
  @Property config: ChannelConfig;
  @Property preamp: AuxInPreamp;
  @Property eq: Eq4;
  @Property mix: ChannelMix;
  @Property grp: Groups;
}

export class FxReturn extends Container {
  @Property config: BusConfig;
  @Property eq: Eq4;
  @Property mix: ChannelMix;
  @Property grp: Groups;
}

export class Bus extends Container {
  @Property config: BusConfig;
  @Property dyn: SidechainCompressor;
  @Property insert: Insert;
  @Property eq: Eq6;
  @Property mix: BusMix;
  @Property grp: Groups;
}

export class Matrix extends Container {
  @Property config: BusConfig;
  @Property preamp: MatrixPreamp;
  @Property dyn: Compressor;
  @Property insert: Insert;
  @Property eq: ExtendedEq6;
  @Property mix: MatrixMix;
  @Property grp: Groups;
}

export class Main extends Container {
  @Property config: BusConfig;
  @Property dyn: Compressor;
  @Property insert: Insert;
  @Property eq: ExtendedEq6;
  @Property mix: MainMix;
  @Property grp: Groups;
}

export class DCA extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;
  @Property config: BusConfig;

  constructor() {
    super(true);
  }
}

export class ChannelList extends Collection<Channel> {
  constructor() {
    super(() => new Channel(), { size: 32, pad: 2 });
  }
}

export class AuxInList extends Collection<AuxIn> {
  constructor() {
    super(() => new AuxIn(), { size: 8, pad: 2 });
  }
}

export class FxReturnList extends Collection<FxReturn> {
  constructor() {
    super(() => new FxReturn(), { size: 8, pad: 2 });
  }
}

export class BusList extends Collection<Bus> {
  constructor() {
    super(() => new Bus(), { size: 16, pad: 2 });
  }
}

export class MainList extends Container {
  @Property st: Main;
  @Property m: Main;
}

export class MatrixList extends Collection<Matrix> {
  constructor() {
    super(() => new Matrix(), { size: 6, pad: 2 });
  }
}

export class DCAList extends Collection<DCA> {
  constructor() {
    super(() => new DCA(), 8);
  }
}

