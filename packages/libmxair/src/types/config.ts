import { AutomixConfig, Bool, Fader, Formatted, MappedValue, SoloMode } from '@mxfriend/common';
import {
  Collection,
  Enum,
  EnumValue,
  Container,
  Property,
  ScaledValue,
  Linear,
} from '@mxfriend/oscom';
import { SoloSource } from './enums';


export class ChannelLink extends Container {
  @Enum(Bool) '1-2': EnumValue<Bool>;
  @Enum(Bool) '3-4': EnumValue<Bool>;
  @Enum(Bool) '5-6': EnumValue<Bool>;
  @Enum(Bool) '7-8': EnumValue<Bool>;
  @Enum(Bool) '9-10': EnumValue<Bool>;
  @Enum(Bool) '11-12': EnumValue<Bool>;
  @Enum(Bool) '13-14': EnumValue<Bool>;
  @Enum(Bool) '15-16': EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class BusLink extends Container {
  @Enum(Bool) '1-2': EnumValue<Bool>;
  @Enum(Bool) '3-4': EnumValue<Bool>;
  @Enum(Bool) '5-6': EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class LinkCfg extends Container {
  @Enum(Bool) preamp: EnumValue<Bool>;
  @Enum(Bool) eq: EnumValue<Bool>;
  @Enum(Bool) dyn: EnumValue<Bool>;
  @Enum(Bool) fdrmute: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class SoloCfg extends Container {
  @Fader(161) level: MappedValue;
  @Enum(SoloSource) source: EnumValue<SoloSource>;
  @Formatted('.1') @Linear(-18, 18, 73) sourcetrim: ScaledValue;
  @Enum(SoloMode) chmode: EnumValue<SoloMode>;
  @Enum(SoloMode) busmode: EnumValue<SoloMode>;
  @Formatted('.0') @Linear(-40, 0, 41) dimatt: ScaledValue;
  @Enum(Bool) dim: EnumValue<Bool>;
  @Enum(Bool) mono: EnumValue<Bool>;
  @Enum(Bool) mute: EnumValue<Bool>;
  @Enum(Bool) dimpfl: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class MuteList extends Collection<EnumValue<Bool>> {
  constructor() {
    super(() => new EnumValue(Bool), { size: 4, callable: true });
  }
}

export class Config extends Container {
  @Property chlink: ChannelLink;
  @Property buslink: BusLink;
  @Property linkcfg: LinkCfg;
  @Property solo: SoloCfg;
  @Property amixenable: AutomixConfig;
  @Property amixlock: AutomixConfig;
  @Property mute: MuteList;
}
