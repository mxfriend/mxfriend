import {
  Bitmask,
  BitmaskValue,
  Bool,
  ClockRate,
  IpAddress,
  Mapped, MappedValue,
  RawEnumValue,
} from '@mxfriend/common';
import {
  Collection,
  Container,
  Enum,
  EnumValue, IntValue,
  Linear,
  Property,
  ScaledValue,
  StringValue, Value,
} from '@mxfriend/oscom';
import {
  ADATSync,
  ADATWordClock,
  ClockMode,
  ClockSource,
  ControlSurfacePort,
  ControlSurfaceProtocol,
  iQEQ,
  iQModelMap,
  iQSpeaker,
  KeyboardLayout,
  MADIIn,
  MADIMode,
  MADIOut,
  MADISrc,
  MuteLedMode,
  RecorderControl,
  RTADetector,
  RTAMode,
  RTAPeakHold,
  RTAPos,
  RTASource,
  RTAVisibility,
  ShowControlMode,
  UFMode,
  URecCard,
  URecOutputSource,
  URecPlaybackSource,
  URecTracks,
  USBMode,
} from './enums';

export class NetworkPrefs extends Container {
  @Enum(Bool) dhcp: EnumValue<Bool>;
  @Property addr: IpAddress;
  @Property mask: IpAddress;
  @Property gateway: IpAddress;

  constructor() {
    super(true);
  }
}

export class ControlSurfacePrefs extends Container {
  @Enum(Bool) enable: EnumValue<Bool>;
  @Enum(ControlSurfaceProtocol) protocol: EnumValue<ControlSurfaceProtocol>;
  @Enum(ControlSurfacePort) port: EnumValue<ControlSurfacePort>;
  @Bitmask(14) ioenable: BitmaskValue;

  constructor() {
    super(true);
  }
}

export class CardPrefs extends Container {
  @Property UFifc: IntValue; // should be enum, but we don't know all possible values
  @Enum(UFMode) UFmode: EnumValue<UFMode>;
  @Enum(USBMode) USBmode: EnumValue<USBMode>;
  @Enum(ADATWordClock) ADATwc: EnumValue<ADATWordClock>;
  @Enum(ADATSync) ADATsync: EnumValue<ADATSync>;
  @Enum(MADIMode) MADImode: EnumValue<MADIMode>;
  @Enum(MADIIn) MADIin: EnumValue<MADIIn>;
  @Enum(MADIOut) MADIout: EnumValue<MADIOut>;
  @Enum(MADISrc) MADIsrc: EnumValue<MADISrc>;
  @Enum(URecCard) URECsdsel: EnumValue<URecCard>;
  @Enum(URecTracks) URECtracks: EnumValue<URecTracks>;
  @Enum(URecPlaybackSource) URECplayb: EnumValue<URecPlaybackSource>;
  @Enum(URecOutputSource) URECrout: EnumValue<URecOutputSource>;

  constructor() {
    super(true);
  }
}

export class RTAPrefs extends Container {
  @Enum(RTAVisibility) visiblity: EnumValue<RTAVisibility>;
  @Linear(0, 60, 11) gain: ScaledValue;
  @Enum(Bool) autogain: EnumValue<Bool>;
  @Enum(RTASource) source: EnumValue<RTASource>;
  @Enum(RTAPos) pos: EnumValue<RTAPos>;
  @Enum(RTAMode) mode: EnumValue<RTAMode>;
  @Bitmask(6) options: BitmaskValue;
  @Enum(RTADetector) det: EnumValue<RTADetector>;
  @Mapped(0.25, 16, 19) decay: MappedValue;
  @Enum(RTAPeakHold) peakhold: EnumValue<RTAPeakHold>;

  constructor() {
    super(true);
  }
}

export class iQPrefs extends Container {
  @Enum(iQSpeaker) iQmodel: EnumValue<iQSpeaker>;
  @Enum(iQEQ) iQeqset: EnumValue<iQEQ>;
  @Property iQsound: IntValue;

  constructor() {
    super(true);
    this.$updateModel = this.$updateModel.bind(this);
  }

  $attach(prop: string | number, node: Container | Value) {
    super.$attach(prop, node);

    if (node instanceof Value && prop === 'iQmodel') {
      node.$on('local-change', this.$updateModel);
      node.$on('remote-change', this.$updateModel);
    }
  }

  private $updateModel(speaker?: iQSpeaker): void {
    if (speaker !== undefined) {
      this.$set('iQsound', speaker !== 0 ? new EnumValue(iQModelMap[speaker]) : new IntValue());
    }
  }
}

export class iQPrefsList extends Collection<iQPrefs> {
  constructor() {
    super(() => new iQPrefs(), { size: 16, pad: 2 });
  }
}

export class KeyboardPrefs extends Collection<StringValue> {
  @Enum(KeyboardLayout) layout: EnumValue<KeyboardLayout>;

  constructor() {
    super(() => new StringValue(), { size: 100, pad: 2, callable: true });
  }
}

export class Prefs extends Container {
  @Property style: StringValue;
  @Linear(10, 100, 19) bright: ScaledValue;
  @Linear(0, 100, 51) lcdcont: ScaledValue;
  @Linear(10, 100, 19) ledbright: ScaledValue;
  @Linear(10, 100, 10) lamp: ScaledValue;
  @Enum(Bool) lampon: EnumValue<Bool>;
  @Enum(ClockRate) clockrate: EnumValue<ClockRate>;
  @Enum(ClockSource) clocksource: EnumValue<ClockSource>;
  @Enum(Bool) confirm_general: EnumValue<Bool>;
  @Enum(Bool) confirm_overwrite: EnumValue<Bool>;
  @Enum(Bool) confirm_sceneload: EnumValue<Bool>;
  @Enum(Bool) viewrtn: EnumValue<Bool>;
  @Enum(Bool) selfollowsbank: EnumValue<Bool>;
  @Enum(Bool) scene_advance: EnumValue<Bool>;
  @Enum(Bool) safe_masterlevels: EnumValue<Bool>;
  @Bitmask(4) haflags: BitmaskValue;
  @Enum(Bool) autosel: EnumValue<Bool>;
  @Enum(ShowControlMode) show_control: EnumValue<ShowControlMode>;
  @Enum(ClockMode) clockmode: EnumValue<ClockMode>;
  @Enum(Bool) hardmute: EnumValue<Bool>;
  @Enum(Bool) dcamute: EnumValue<Bool>;
  @Enum(MuteLedMode) invertmutes: EnumValue<MuteLedMode>;
  @Property name: StringValue;
  @Enum(RecorderControl) rec_control: EnumValue<RecorderControl>;
  @Property fastFaders: RawEnumValue<Bool>;
  @Property ip: NetworkPrefs;
  @Property remote: ControlSurfacePrefs;
  @Property card: CardPrefs;
  @Property rta: RTAPrefs;
  @Property iQ: iQPrefsList;
  @Property key: KeyboardPrefs;

  constructor() {
    super(true);
  }
}
