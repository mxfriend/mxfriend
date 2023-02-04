import { Bitmask, BitmaskValue, Bool, RawEnumValue } from '@mxfriend/common';
import { Collection, Container, IntValue, Property, StringValue } from '@mxfriend/oscom';

export class Preset extends Container {
  @Property pos: IntValue;
  @Property name: StringValue;
  @Property type: IntValue;
  @Bitmask(16) flags: BitmaskValue;
  @Property hasdata: RawEnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class PresetList extends Collection<Preset> {
  constructor() {
    super(() => new Preset(), { size: 100, pad: 3 });
  }
}

export class PresetLibrary extends Container {
  @Property ch: PresetList;
  @Property fx: PresetList;
  @Property r: PresetList;
  @Property mon: PresetList;
}
