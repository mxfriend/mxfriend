import { Bool, Formatted } from '@mxfriend/common';
import { Container, Enum, EnumValue, Linear, ScaledValue } from '@mxfriend/oscom';

export class Delay extends Container {
  @Enum(Bool) on: EnumValue<Bool>;
  @Formatted('.1') @Linear(0.3, 500, 4998) time: ScaledValue;

  constructor() {
    super(true);
  }
}
