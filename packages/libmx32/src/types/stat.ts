import { Bitmask, BitmaskValue, Bool, RawEnumValue } from '@mxfriend/common';
import {
  Collection,
  Container,
  ContainerPropertyDecorator,
  createFactoryDecorator,
  Enum,
  EnumDefinition,
  EnumValue,
  IntValue,
  Property, StringValue,
} from '@mxfriend/oscom';
import {
  AssignPage,
  BusSendBank,
  ChannelFaderBank,
  EqBand,
  FxPage,
  GroupFaderBank,
  HomePage,
  LibraryPage,
  LockState,
  MetersPage,
  MonitorPage,
  RoutingPage,
  RTAMode,
  ScenePage, Screen,
  SelectedChannel,
  SetupPage, TapeState, URecState,
  USBPage,
  UserBank,
  XCardType,
} from './enums';

export class ScreenStateContainer<P extends number> extends Container {
  page: EnumValue<P>;

  constructor(def: EnumDefinition) {
    super(true);
    Enum(def)(this, 'page');
  }
}

export function ScreenState(def: EnumDefinition): ContainerPropertyDecorator {
  return createFactoryDecorator(() => new ScreenStateContainer(def));
}

export class Screens extends Container {
  @Enum(Screen) screen: EnumValue<Screen>;
  @Enum(Bool) mutegrp: EnumValue<Bool>;
  @Enum(Bool) utils: EnumValue<Bool>;
  @ScreenState(HomePage) CHAN: ScreenStateContainer<HomePage>;
  @ScreenState(MetersPage) METER: ScreenStateContainer<MetersPage>;
  @ScreenState(RoutingPage) ROUTE: ScreenStateContainer<RoutingPage>;
  @ScreenState(SetupPage) SETUP: ScreenStateContainer<SetupPage>;
  @ScreenState(LibraryPage) LIB: ScreenStateContainer<LibraryPage>;
  @ScreenState(FxPage) FX: ScreenStateContainer<FxPage>;
  @ScreenState(MonitorPage) MON: ScreenStateContainer<MonitorPage>;
  @ScreenState(USBPage) USB: ScreenStateContainer<USBPage>;
  @ScreenState(ScenePage) SCENE: ScreenStateContainer<ScenePage>;
  @ScreenState(AssignPage) ASSIGN: ScreenStateContainer<AssignPage>;

  constructor() {
    super(true);
  }
}

export class AES50State extends Container {
  @Bitmask(5) state: BitmaskValue;
  @Property A: StringValue;
  @Property B: StringValue;

  constructor() {
    super(true);
  }
}

export class SoloSwList extends Collection<EnumValue<Bool>> {
  constructor() {
    super(() => new EnumValue(Bool), { size: 81, pad: 2 });
  }
}

export class TalkbackState extends Container {
  @Enum(Bool) A: EnumValue<Bool>;
  @Enum(Bool) B: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class OscillatorState extends Container {
  @Enum(Bool) on: EnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class Tape extends Container {
  @Enum(TapeState) state: EnumValue<TapeState>;
  @Property file: StringValue;
  @Property etime: IntValue;
  @Property rtime: IntValue;

  constructor() {
    super(true);
  }
}

export class UserParam extends Container {
  @Property value: IntValue;

  constructor() {
    super(true);
  }
}

export class UserParams extends Collection<UserParam> {
  constructor() {
    super(() => new UserParam(), { size: 36, pad: 2 });
  }
}

export class URecStat extends Container {
  @Enum(URecState) state: EnumValue<URecState>;
  @Property etime: IntValue;
  @Property rtime: IntValue;

  constructor() {
    super(true);
  }
}

export class Stat extends Container {
  @Enum(SelectedChannel) selidx: EnumValue<SelectedChannel>;
  @Property chfaderbank: RawEnumValue<ChannelFaderBank>;
  @Property grpfaderbank: RawEnumValue<GroupFaderBank>;
  @Enum(Bool) sendsonfader: EnumValue<Bool>;
  @Property bussendbank: RawEnumValue<BusSendBank>;
  @Property eqband: RawEnumValue<EqBand>;
  @Enum(Bool) solo: EnumValue<Bool>;
  @Enum(Bool) keysolo: EnumValue<Bool>;
  @Property userbank: RawEnumValue<UserBank>;
  @Enum(Bool) autosave: EnumValue<Bool>;
  @Property lock: RawEnumValue<LockState>;
  @Enum(Bool) usbmounted: EnumValue<Bool>;
  @Enum(Bool) remote: EnumValue<Bool>;
  @Enum(RTAMode) rtamodeeq: EnumValue<RTAMode>;
  @Enum(RTAMode) rtamodegeq: EnumValue<RTAMode>;
  @Enum(Bool) rtaeqpre: EnumValue<Bool>;
  @Enum(Bool) rtageqpost: EnumValue<Bool>;
  @Property rtasource: IntValue; // should be RawEnum, but we don't know all the values
  @Property xcardtype: RawEnumValue<XCardType>;
  @Enum(Bool) xcardsync: EnumValue<Bool>;
  @Enum(Bool) geqonfdr: EnumValue<Bool>;
  @Property geqpos: IntValue;
  @Property dcaspill: IntValue;
  @Property screen: Screens;
  @Property aes50: AES50State;
  @Property solosw: SoloSwList;
  @Property talk: TalkbackState;
  @Property osc: OscillatorState;
  @Property tape: Tape;
  @Property userpar: UserParams;
  @Property urec: URecStat;

  constructor() {
    super(true);
  }
}
