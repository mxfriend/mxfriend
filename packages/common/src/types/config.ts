import { Container, Enum, EnumValue } from '@mxfriend/oscom';
import { Bool } from './enums';

export class AutomixConfig extends Container {
  @Enum(Bool) X: EnumValue<Bool>;
  @Enum(Bool) Y: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}
