import { Collection, Container, Enum, EnumValue, Linear, ScaledValue } from '@mxfriend/oscom';
import { Formatted, Frequency, Mapped, MappedValue } from '../oscom';
import { Bool, EqBandType } from './enums';

export class ChannelHeadamp extends Container {
  @Formatted('+.1') @Linear(-12, 60, 145) gain: ScaledValue;
  @Enum(Bool) phantom: EnumValue<Bool>;

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
