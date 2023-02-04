import { RawEnumValue } from '@mxfriend/common';
import { Collection, Container, Enum, EnumValue, Property } from '@mxfriend/oscom';
import {
  AuxInPatch,
  InputBlock, OutputBlockEven, OutputBlockOdd,
  PatchBlock,
  RoutingSwitch,
  UserInSource,
  UserOutDest,
} from './enums';

export class UserOutRouting extends Collection<RawEnumValue<UserOutDest>> {
  constructor() {
    super(() => new RawEnumValue(), { size: 48, pad: 2, callable: true });
  }
}

export class UserInRouting extends Collection<RawEnumValue<UserInSource>> {
  constructor() {
    super(() => new RawEnumValue(), { size: 32, pad: 2, callable: true });
  }
}

export class UserRouting extends Container {
  @Property out: UserOutRouting;
  @Property in: UserInRouting;
}


export class InputRouting extends Container {
  @Enum(InputBlock) '1-8': EnumValue<InputBlock>;
  @Enum(InputBlock) '9-16': EnumValue<InputBlock>;
  @Enum(InputBlock) '17-24': EnumValue<InputBlock>;
  @Enum(InputBlock) '25-32': EnumValue<InputBlock>;
  @Enum(AuxInPatch) AUX: EnumValue<AuxInPatch>;

  constructor() {
    super(true);
  }
}

export class AES50Routing extends Container {
  @Enum(PatchBlock) '1-8': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '9-16': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '17-24': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '25-32': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '33-40': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '41-48': EnumValue<PatchBlock>;

  constructor() {
    super(true);
  }
}

export class CardRouting extends Container {
  @Enum(PatchBlock) '1-8': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '9-16': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '17-24': EnumValue<PatchBlock>;
  @Enum(PatchBlock) '25-32': EnumValue<PatchBlock>;

  constructor() {
    super(true);
  }
}

export class OutputRouting extends Container {
  @Enum(OutputBlockOdd) '1-4': EnumValue<OutputBlockOdd>;
  @Enum(OutputBlockEven) '5-8': EnumValue<OutputBlockEven>;
  @Enum(OutputBlockOdd) '9-12': EnumValue<OutputBlockOdd>;
  @Enum(OutputBlockEven) '13-16': EnumValue<OutputBlockEven>;

  constructor() {
    super(true);
  }
}

export class Routing extends Container {
  @Enum(RoutingSwitch) routswitch: EnumValue<RoutingSwitch>;
  @Property IN: InputRouting;
  @Property AES50A: AES50Routing;
  @Property AES50B: AES50Routing;
  @Property CARD: CardRouting;
  @Property OUT: OutputRouting;
  @Property PLAY: InputRouting;

  constructor() {
    super(true);
  }
}
