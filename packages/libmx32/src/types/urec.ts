import { RawEnumValue } from '@mxfriend/common';
import {
  Collection,
  Container,
  Enum,
  EnumValue,
  IntValue,
  Property,
  StringValue,
} from '@mxfriend/oscom';
import { XLiveSDState, XLiveSpan, XLiveSrate, XLiveTracks } from './enums';

export class URecSession extends Container {
  @Property name: StringValue;

  constructor() {
    super(true);
  }
}

export class URecSessionList extends Collection<URecSession> {
  constructor() {
    super(() => new URecSession(), { size: 100, pad: 3 });
  }
}

export class URecMarker extends Container {
  @Property time: IntValue;

  constructor() {
    super(true);
  }
}

export class URecMarkerList extends Collection<URecMarker> {
  constructor() {
    super(() => new URecMarker(), { size: 100, pad: 3 });
  }
}

export class URec extends Container {
  @Property sessionmax: IntValue;
  @Property markermax: IntValue;
  @Property sessionlen: IntValue;
  @Property sessionpos: IntValue;
  @Property markerpos: IntValue;
  @Property batterystate: IntValue;
  @Property srate: RawEnumValue<XLiveSrate>;
  @Property tracks: RawEnumValue<XLiveTracks>;
  @Property sessionspan: RawEnumValue<XLiveSpan>;
  @Property sessionoffs: IntValue;
  @Enum(XLiveSDState) sd1state: EnumValue<XLiveSDState>;
  @Enum(XLiveSDState) sd2state: EnumValue<XLiveSDState>;
  @Property sd1info: StringValue;
  @Property sd2info: StringValue;
  @Property errormessage: StringValue;
  @Property errorcode: IntValue;
  @Property session: URecSessionList;
  @Property marker: URecMarkerList;

  constructor() {
    super(true);
  }
}
