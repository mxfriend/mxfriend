import {
  Fader,
  Frequency,
  Bitmask,
  Formatted,
  Mapped,
  BitmaskValue,
  MappedValue,
  Eq4,
  Eq6 as Eq6Common,
  FilterType,
  CompressorMode,
  CompressorDetection,
  AutomixGroup,
  Bool,
  CompressorEnvelope,
  CompressorRatio,
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
} from '@mxfriend/oscom';
import {
  AnalogIn,
  EqMode,
  GateMode,
  KeySrc,
  MonoInsertSlot,
  SendTap,
  StereoInsertSlot,
  StereoUsbIn,
  UsbIn,
} from './enums';

export class ChannelConfig extends Container {
  @Property name: StringValue;
  @Property color: IntValue;
  @Enum(AnalogIn) insrc: EnumValue<AnalogIn>;
  @Enum(UsbIn) rtnsrc: EnumValue<UsbIn>;

  constructor() {
    super(true);
  }

  get source(): EnumValue<AnalogIn> {
    return this.insrc;
  }
}

export class ReturnConfig extends Container {
  @Property name: StringValue;
  @Property color: IntValue;
  @Enum(StereoUsbIn) rtnsrc: EnumValue<StereoUsbIn>;

  constructor() {
    super(true);
  }

  get source(): EnumValue<StereoUsbIn> {
    return this.rtnsrc;
  }
}

export class BusConfig extends Container {
  @Property name: StringValue;
  @Property color: IntValue;

  constructor() {
    super(true);
  }
}

export class ChannelPreamp extends Container {
  @Formatted('+~.1') @Linear(-18, 18, 145) rtntrim: ScaledValue;
  @Enum(Bool) rtnsw: EnumValue<Bool>;
  @Enum(Bool) invert: EnumValue<Bool>;
  @Enum(Bool) hpon: EnumValue<Bool>;
  @Formatted('.0') @Mapped(20, 400, 101) hpf: MappedValue;

  constructor() {
    super(true);
  }

  get trim(): ScaledValue | undefined {
    return this.rtnsw.$get() ? this.rtntrim : undefined;
  }
}

export class ReturnPreamp extends Container {
  @Formatted('+~.1') @Linear(-18, 18, 145) rtntrim: ScaledValue;
  @Enum(Bool) rtnsw: EnumValue<Bool>;

  constructor() {
    super(true);
  }

  get trim(): ScaledValue | undefined {
    return this.rtnsw.$get() ? this.rtntrim : undefined;
  }
}

export class Filter extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Enum(FilterType) type: EnumValue<FilterType>;
  @Frequency() f: MappedValue;

  constructor() {
    super(true);
  }
}

export class Gate extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Enum(GateMode) mode: EnumValue<GateMode>;
  @Formatted('.1') @Linear(-80, 0, 161) thr: ScaledValue;
  @Formatted('.1') @Linear(3, 60, 58) range: ScaledValue;
  @Formatted('.0') @Linear(0, 120, 121) attack: ScaledValue;
  @Formatted(3) @Mapped(0.02, 2000, 101) hold: MappedValue;
  @Formatted('~.0') @Mapped(5, 4000, 101) release: MappedValue;
  @Enum(KeySrc) keysrc: EnumValue<KeySrc>;
  @Property filter: Filter;

  constructor() {
    super(true);
  }
}

export class Compressor extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Enum(CompressorMode) mode: EnumValue<CompressorMode>;
  @Enum(CompressorDetection) det: EnumValue<CompressorDetection>;
  @Enum(CompressorEnvelope) env: EnumValue<CompressorEnvelope>;
  @Formatted('.1') @Linear(-60, 0, 121) thr: ScaledValue;
  @Enum(CompressorRatio) ratio: EnumValue<CompressorRatio>;
  @Formatted('.0') @Linear(0, 5, 6) knee: ScaledValue;
  @Formatted(3) @Linear(0, 24, 49) mgain: ScaledValue;
  @Formatted('.0') @Linear(0, 120, 121) attack: ScaledValue;
  @Formatted(3) @Mapped(0.02, 2000, 101) hold: MappedValue;
  @Formatted('.0') @Mapped(5, 4000, 101) release: MappedValue;
  @Formatted('.0') @Linear(0, 100, 51) mix: ScaledValue;
  @Enum(Bool) auto: EnumValue<Bool>;
  @Property filter: Filter;

  constructor() {
    super(true);
  }
}

export class SidechainCompressor extends Compressor {
  @Enum(KeySrc) keysrc: EnumValue<KeySrc>;

  $getKnownProperties(): any[] {
    const props = super.$getKnownProperties();

    if (props[props.length - 1] === 'keysrc') {
      props.splice(12, 0, ...props.splice(props.length - 1, 1));
    }

    return props;
  }
}

export class MonoInsert extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Enum(MonoInsertSlot) sel: EnumValue<MonoInsertSlot>;

  constructor() {
    super(true);
  }
}

export class StereoInsert extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Enum(StereoInsertSlot) sel: EnumValue<StereoInsertSlot>;

  constructor() {
    super(true);
  }
}


export class Eq6 extends Eq6Common {
  @Enum(EqMode) mode: EnumValue<EqMode>;
}


export class GEQ extends Container {
  @Formatted('~.1') @Linear(-15, 15, 61) '20': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '25': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '40': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '50': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '63': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '80': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '100': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '125': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '160': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '200': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '250': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '315': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '400': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '500': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '630': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '800': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '31_5': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '1k': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '1k25': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '1k6': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '2k': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '2k5': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '3k15': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '4k': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '5k': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '6k3': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '8k': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '10k': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '12k5': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '16k': ScaledValue;
  @Formatted('~.1') @Linear(-15, 15, 61) '20k': ScaledValue;

  constructor() {
    super(true);
  }
}


export class Send extends Container {
  @Fader(161) level: MappedValue;
  @Enum(Bool) grpon: EnumValue<Bool>;
  @Enum(SendTap) tap: EnumValue<SendTap>;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;

  constructor() {
    super(true);
  }

  get on(): EnumValue<Bool> {
    return this.grpon;
  }
}

export class ChannelMix extends Collection<Send> {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;
  @Enum(Bool) lr: EnumValue<Bool>;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;

  constructor() {
    super(() => new Send(), { size: 10, pad: 2, callable: true });
  }
}

export class BusMix extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;
  @Enum(Bool) lr: EnumValue<Bool>;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;

  constructor() {
    super(true);
  }
}

export class SendMix extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;

  constructor() {
    super(true);
  }
}

export class LRMix extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Fader() fader: MappedValue;
  @Formatted('+.0') @Linear(-100, 100, 101) pan: ScaledValue;

  constructor() {
    super(true);
  }
}

export class Groups extends Container {
  @Bitmask(4) dca: BitmaskValue;
  @Bitmask(4) mute: BitmaskValue;

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
  @Property preamp: ChannelPreamp;
  @Property gate: Gate;
  @Property dyn: SidechainCompressor;
  @Property insert: MonoInsert;
  @Property eq: Eq4;
  @Property mix: ChannelMix;
  @Property grp: Groups;
  @Property automix: Automix;
}

export class Return extends Container {
  @Property config: ReturnConfig;
  @Property preamp: ReturnPreamp;
  @Property eq: Eq4;
  @Property mix: ChannelMix;
  @Property grp: Groups;
}

export class Bus extends Container {
  @Property config: BusConfig;
  @Property dyn: SidechainCompressor;
  @Property insert: MonoInsert;
  @Property eq: Eq6;
  @Property geq: GEQ;
  @Property mix: BusMix;
  @Property grp: Groups;
}

export class FxSend extends Container {
  @Property config: BusConfig;
  @Property mix: SendMix;
  @Property grp: Groups;
}

export class LR extends Container {
  @Property config: BusConfig;
  @Property dyn: Compressor;
  @Property insert: StereoInsert;
  @Property eq: Eq6;
  @Property geq: GEQ;
  @Property mix: LRMix;
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
    super(() => new Channel(), { size: 16, pad: 2 });
  }
}

export class ReturnList extends Collection<Return> {
  @Property aux: Return;

  constructor() {
    super(() => new Return(), 4);
  }
}

export class BusList extends Collection<Bus> {
  constructor() {
    super(() => new Bus(), 6);
  }
}

export class FxSendList extends Collection<FxSend> {
  constructor() {
    super(() => new FxSend(), 4);
  }
}

export class DCAList extends Collection<DCA> {
  constructor() {
    super(() => new DCA(), 4);
  }
}

