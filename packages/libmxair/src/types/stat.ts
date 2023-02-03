import { Bool } from '@mxfriend/common';
import {
  Collection,
  Enum,
  EnumValue,
  Container,
  Property,
  StringValue,
  IntValue,
} from '@mxfriend/oscom';
import { KeySolo, NetworkMode, RTAPos, RTASource, TapeState, UsbFileType } from './enums';

export class SoloSwitchStates extends Collection<EnumValue<Bool>> {
  constructor() {
    super(() => new EnumValue(Bool), { size: 54, pad: 2, callable: true });
  }
}

export class RTAState extends Container {
  @Enum(RTASource) source: EnumValue<RTASource>;
  @Enum(RTAPos) pos: EnumValue<RTAPos>;

  constructor() {
    super(true);
  }
}

export class NetworkInfo extends Container {
  @Property ssid: StringValue;
  @Property strength: IntValue;
  @Property flags: IntValue;

  constructor() {
    super(true);
  }
}

export class NetworkList extends Collection<NetworkInfo> {
  constructor() {
    super(() => new NetworkInfo(), { size: 10, pad: 2 });
  }
}

export class Tape extends Container {
  @Enum(TapeState) state: EnumValue<TapeState>;
  @Property file: StringValue;
  @Property etime: IntValue;
  @Property rtime: IntValue;
}

export class UsbFile extends Container {
  @Enum(UsbFileType) type: EnumValue<UsbFileType>;
  @Property name: StringValue;

  constructor() {
    super(true);
  }
}

export class UsbFileList extends Collection<UsbFile> {
  @Property path: StringValue;
  @Property count: IntValue;

  constructor() {
    super(() => new UsbFile(), { size: 200, pad: 3, callable: true });
  }
}

export class Stat extends Container {
  @Enum(Bool) solo: EnumValue<Bool>;
  @Enum(KeySolo) keysolo: EnumValue<KeySolo>;
  @Enum(Bool) autosave: EnumValue<Bool>;
  @Enum(NetworkMode) netmode: EnumValue<NetworkMode>;
  @Enum(Bool) usbmounted: EnumValue<Bool>;
  @Property solosw: SoloSwitchStates;
  @Property rta: RTAState;
  @Property networks: NetworkList;
  @Property tape: Tape;
  @Property usb: UsbFileList;
}
