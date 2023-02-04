import {
  Bool,
  ClockRate,
  CompressorDetection,
  IpAddress,
  Mapped,
  MappedValue,
} from '@mxfriend/common';
import {
  Enum,
  EnumValue,
  Container,
  Property,
  StringValue,
  IntValue,
} from '@mxfriend/oscom';
import {
  AccessPointSecurity,
  ClientMode,
  ClientSecurity,
  LanMode,
  UsbInterfaceMode,
} from './enums';

export class LanConfig extends Container {
  @Enum(LanMode) mode: EnumValue<LanMode>;
  @Property addr: IpAddress;
  @Property mask: IpAddress;
  @Property gateway: IpAddress;

  constructor() {
    super(true);
  }
}

export class AccessPointConfig extends Container {
  @Enum(AccessPointSecurity) security: EnumValue<AccessPointSecurity>;
  @Property ssid: StringValue;
  @Property key: StringValue;
  @Property channel: IntValue;

  constructor() {
    super(true);
  }
}

export class ClientConfig extends Container {
  @Enum(ClientSecurity) security: EnumValue<ClientSecurity>;
  @Property ssid: StringValue;
  @Property key: StringValue;
  @Enum(ClientMode) mode: EnumValue<ClientMode>;
  @Property addr: IpAddress;
  @Property mask: IpAddress;
  @Property gateway: IpAddress;

  constructor() {
    super(true);
  }
}

export class RTAConfig extends Container {
  @Enum(CompressorDetection) det: EnumValue<CompressorDetection>;
  @Mapped(0.25, 16, 19) decay: MappedValue;

  constructor() {
    super(true);
  }
}

export class Prefs extends Container {
  @Enum(ClockRate) clockrate: EnumValue<ClockRate>;
  @Enum(Bool) ponmute: EnumValue<Bool>;
  @Enum(UsbInterfaceMode) usbifcmode: EnumValue<UsbInterfaceMode>;
  @Property midiconfig: IntValue;
  @Property name: StringValue;
  @Enum(Bool) playnext: EnumValue<Bool>;
  @Enum(Bool) hardmute: EnumValue<Bool>;
  @Enum(Bool) dcamute: EnumValue<Bool>;
  @Property lan: LanConfig;
  @Property ap: AccessPointConfig;
  @Property is: ClientConfig;
  @Property rta: RTAConfig;

  constructor() {
    super(true);
  }
}
