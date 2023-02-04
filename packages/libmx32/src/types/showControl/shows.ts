import { Bitmask, BitmaskValue, Bool, RawEnumValue } from '@mxfriend/common';
import { Collection, Container, IntValue, Property, StringValue } from '@mxfriend/oscom';
import { CueMidiType } from '../enums';

export class Show extends Container {
  @Property name: StringValue;
  @Bitmask(8) inputs: BitmaskValue;
  @Bitmask(16) mxsends: BitmaskValue;
  @Bitmask(8) mxbuses: BitmaskValue;
  @Bitmask(7) console: BitmaskValue;
  @Bitmask(16) chan16: BitmaskValue;
  @Bitmask(16) chan32: BitmaskValue;
  @Bitmask(16) return: BitmaskValue;
  @Bitmask(16) buses: BitmaskValue;
  @Bitmask(16) lrmtxdca: BitmaskValue;
  @Bitmask(8) effects: BitmaskValue;

  constructor() {
    super(true);
  }
}

export class Cue extends Container {
  @Property numb: IntValue;
  @Property name: StringValue;
  @Property skip: RawEnumValue<Bool>;
  @Property scene: IntValue;
  @Property bit: IntValue;
  @Property miditype: RawEnumValue<CueMidiType>;
  @Property midichan: IntValue;
  @Property midipara1: IntValue;
  @Property midipara2: IntValue;

  constructor() {
    super(true);
  }
}

export class Scene extends Container {
  @Property name: StringValue;
  @Property notes: StringValue;
  @Bitmask(8) safes: BitmaskValue;
  @Property hasdata: RawEnumValue<Bool>;

  constructor() {
    super(true);
  }
}

export class Snippet extends Container {
  @Property name: StringValue;
  @Bitmask(25) eventtyp: BitmaskValue;
  @Bitmask(32) channels: BitmaskValue;
  @Bitmask(32) auxbuses: BitmaskValue;
  @Bitmask(16) maingrps: BitmaskValue;
  @Property hasdata: RawEnumValue<Bool>;


  constructor() {
    super(true);
  }
}

export class CueList extends Collection<Cue> {
  constructor() {
    super(() => new Cue(), { size: 500, pad: 3, base: 0 });
  }
}

export class SceneList extends Collection<Scene> {
  constructor() {
    super(() => new Scene(), { size: 100, pad: 3, base: 0 });
  }
}

export class SnippetList extends Collection<Snippet> {
  constructor() {
    super(() => new Snippet(), { size: 100, pad: 3, base: 0 });
  }
}

export class ShowFile extends Container {
  @Property show: Show;
  @Property cue: CueList;
  @Property scene: SceneList;
  @Property snippet: SnippetList;
}

export class ShowPageCursor extends Container {
  @Property current: IntValue;

  constructor() {
    super(true);
  }
}

export class ShowData extends Container {
  @Property prepos: ShowPageCursor;
  @Property showfile: ShowFile;
}
