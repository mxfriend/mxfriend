import {
  AutomixConfig,
  Bitmask,
  BitmaskValue,
  Bool,
  Fader,
  Formatted,
  Frequency,
  MappedValue,
  RawEnumValue,
  SoloMode,
} from '@mxfriend/common';
import {
  Collection,
  Container,
  Enum,
  EnumValue,
  IntValue,
  Linear,
  Property,
  ScaledValue,
  StringValue,
} from '@mxfriend/oscom';
import {
  AES50Port,
  Color,
  MonoMode,
  OscillatorDestination,
  OscillatorFreqSel,
  OscillatorType,
  SoloSource,
  TalkbackSource,
} from './enums';
import { Routing, UserRouting } from './routing';

export class ChannelLink extends Container {
  @Enum(Bool) '1-2': EnumValue<Bool>;
  @Enum(Bool) '3-4': EnumValue<Bool>;
  @Enum(Bool) '5-6': EnumValue<Bool>;
  @Enum(Bool) '7-8': EnumValue<Bool>;
  @Enum(Bool) '9-10': EnumValue<Bool>;
  @Enum(Bool) '11-12': EnumValue<Bool>;
  @Enum(Bool) '13-14': EnumValue<Bool>;
  @Enum(Bool) '15-16': EnumValue<Bool>;
  @Enum(Bool) '17-18': EnumValue<Bool>;
  @Enum(Bool) '19-20': EnumValue<Bool>;
  @Enum(Bool) '21-22': EnumValue<Bool>;
  @Enum(Bool) '23-24': EnumValue<Bool>;
  @Enum(Bool) '25-26': EnumValue<Bool>;
  @Enum(Bool) '27-28': EnumValue<Bool>;
  @Enum(Bool) '29-30': EnumValue<Bool>;
  @Enum(Bool) '31-32': EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class AuxInLink extends Container {
  @Enum(Bool) '1-2': EnumValue<Bool>;
  @Enum(Bool) '3-4': EnumValue<Bool>;
  @Enum(Bool) '5-6': EnumValue<Bool>;
  @Enum(Bool) '7-8': EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class FxLink extends Container {
  @Enum(Bool) '1-2': EnumValue<Bool>;
  @Enum(Bool) '3-4': EnumValue<Bool>;
  @Enum(Bool) '5-6': EnumValue<Bool>;
  @Enum(Bool) '7-8': EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class BusLink extends Container {
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

export class MatrixLink extends Container {
  @Enum(Bool) '1-2': EnumValue<Bool>;
  @Enum(Bool) '3-4': EnumValue<Bool>;
  @Enum(Bool) '5-6': EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class LinkCfg extends Container {
  @Enum(Bool) hadly: EnumValue<Bool>;
  @Enum(Bool) eq: EnumValue<Bool>;
  @Enum(Bool) dyn: EnumValue<Bool>;
  @Enum(Bool) fdrmute: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class MuteList extends Collection<EnumValue<Bool>> {
  constructor() {
    super(() => new EnumValue(Bool), { size: 6, callable: true });
  }
}

export class MonoCfg extends Container {
  @Enum(MonoMode) mode: EnumValue<MonoMode>;
  @Enum(Bool) link: EnumValue<Bool>;

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
  @Enum(SoloMode) dcamode: EnumValue<SoloMode>;
  @Enum(Bool) exclusive: EnumValue<Bool>;
  @Enum(Bool) followsel: EnumValue<Bool>;
  @Enum(Bool) followsolo: EnumValue<Bool>;
  @Formatted('.0') @Linear(-40, 0, 41) dimatt: ScaledValue;
  @Enum(Bool) dim: EnumValue<Bool>;
  @Enum(Bool) mono: EnumValue<Bool>;
  @Enum(Bool) delay: EnumValue<Bool>;
  @Formatted('.1') @Linear(0.3, 500, 4998) delaytime: ScaledValue;
  @Enum(Bool) masterctrl: EnumValue<Bool>;
  @Enum(Bool) mute: EnumValue<Bool>;
  @Enum(Bool) dimpfl: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class TalkbackChannel extends Container {
  @Fader(161) level: MappedValue;
  @Enum(Bool) dim: EnumValue<Bool>;
  @Enum(Bool) latch: EnumValue<Bool>;
  @Bitmask(18) destmap: BitmaskValue;

  constructor() {
    super(true);
  }
}

export class TalkbackCfg extends Container {
  @Enum(Bool) enable: EnumValue<Bool>;
  @Enum(TalkbackSource) source: EnumValue<TalkbackSource>;
  @Property A: TalkbackChannel;
  @Property B: TalkbackChannel;

  constructor() {
    super(true);
  }
}

export class OscillatorCfg extends Container {
  @Fader(161) level: MappedValue;
  @Frequency(121) f1: MappedValue;
  @Frequency(121) f2: MappedValue;
  @Enum(OscillatorFreqSel) fsel: EnumValue<OscillatorFreqSel>;
  @Enum(OscillatorType) type: EnumValue<OscillatorType>;
  @Property dest: RawEnumValue<OscillatorDestination>;

  constructor() {
    super(true);
  }
}


export class UserCtrlEncoders extends Collection<StringValue> {
  constructor() {
    super(() => new StringValue(), { size: 4, callable: true });
  }
}

export class UserCtrlButtons extends Collection<StringValue> {
  constructor() {
    super(() => new StringValue(), { size: 8, base: 5, callable: true });
  }
}

export class UserCtrlSet extends Container {
  @Enum(Color) color: EnumValue<Color>;
  @Property enc: UserCtrlEncoders;
  @Property btn: UserCtrlButtons;

  constructor() {
    super(true);
  }
}

export class UserControls extends Container {
  @Property A: UserCtrlSet;
  @Property B: UserCtrlSet;
  @Property C: UserCtrlSet;
}



export class TapeCfg extends Container {
  @Formatted('.1') @Linear(-6, 24, 61) gainL: ScaledValue;
  @Formatted('.1') @Linear(-6, 24, 61) gainR: ScaledValue;
  @Enum(Bool) autoplay: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}


export class DP48Links extends Collection<RawEnumValue<Bool>> {
  constructor() {
    super(() => new RawEnumValue(), { size: 24, pad: 2, callable: true });
  }
}

export class DP48Assignments extends Collection<IntValue> {
  constructor() {
    super(() => new IntValue(), { size: 48, pad: 2, callable: true });
  }
}

export class DP48GroupNames extends Collection<StringValue> {
  constructor() {
    super(() => new StringValue(), { size: 24, pad: 2, callable: true });
  }
}

export class DP48Config extends Container {
  @Bitmask(4) scope: BitmaskValue;
  @Property broadcast: RawEnumValue<Bool>;
  @Enum(AES50Port) aesAB: EnumValue<AES50Port>;
  @Property assign: DP48Assignments;
  @Property link: DP48Links;
  @Property grpname: DP48GroupNames;

  constructor() {
    super(true);
  }
}



export class Config extends Container {
  @Property chlink: ChannelLink;
  @Property auxlink: AuxInLink;
  @Property fxlink: FxLink;
  @Property buslink: BusLink;
  @Property mtxlink: MatrixLink;
  @Property mute: MuteList;
  @Property linkcfg: LinkCfg;
  @Property mono: MonoCfg;
  @Property solo: SoloCfg;
  @Property talk: TalkbackCfg;
  @Property osc: OscillatorCfg;
  @Property userrout: UserRouting;
  @Property routing: Routing;
  @Property userctrl: UserControls;
  @Property tape: TapeCfg;
  @Property amixenable: AutomixConfig;
  @Property dp48: DP48Config;
}
