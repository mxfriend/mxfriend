import {
  Collection,
  Container,
  Enum,
  EnumValue,
  Linear,
  Property,
  ScaledValue,
} from '@mxfriend/oscom';
import { Formatted, Frequency, Mapped, MappedValue } from '../oscom';
import {
  Bool,
  CompressorDetection,
  CompressorEnvelope,
  CompressorMode,
  CompressorRatio,
  EqBandType,
  FilterType,
} from './enums';

export class ChannelHeadamp extends Container {
  @Formatted('+.1') @Linear(-12, 60, 145) gain: ScaledValue;
  @Enum(Bool) phantom: EnumValue<Bool>;

  constructor() {
    super(true);
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
  // needs to be defined in descendant due to incompatible GateMode definitions:
  // @After('on') @Enum(GateMode) mode: EnumValue<GateMode>;
  @Formatted('.1') @Linear(-80, 0, 161) thr: ScaledValue;
  @Formatted('.1') @Linear(3, 60, 58) range: ScaledValue;
  @Formatted('.0') @Linear(0, 120, 121) attack: ScaledValue;
  @Formatted(3) @Mapped(0.02, 2000, 101) hold: MappedValue;
  @Formatted('~.0') @Mapped(5, 4000, 101) release: MappedValue;
  // needs to be defined in descendant due to incompatible InputSource definitions:
  // @After('release') @Enum(InputSource) keysrc: EnumValue<InputSource>;
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
  // needs to be defined in descendant due to incompatible InputSource definitions:
  // @Enum(InputSource) keysrc: EnumValue<InputSource>;
  @Formatted('.0') @Linear(0, 100, 51) mix: ScaledValue;
  @Enum(Bool) auto: EnumValue<Bool>;
  @Property filter: Filter;

  constructor() {
    super(true);
  }
}

export class EqBand extends Container {
  @Enum(EqBandType) type: EnumValue<EqBandType>;
  @Frequency() f: MappedValue;
  @Formatted('+~3') @Linear(-15, 15, 121) g: ScaledValue;
  @Formatted(2) @Mapped(10, 0.3, 72) q: MappedValue;

  constructor() {
    super(true);
  }
}

export class Eq4 extends Collection<EqBand> {
  @Enum(Bool) on: EnumValue<Bool>;

  constructor() {
    super(() => new EqBand(), { size: 4, callable: true });
  }
}

export class Eq6 extends Collection<EqBand> {
  @Enum(Bool) on: EnumValue<Bool>;

  constructor() {
    super(() => new EqBand(), { size: 6, callable: true });
  }
}
