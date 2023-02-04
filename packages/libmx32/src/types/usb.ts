import { Collection, Container, IntValue, Property, StringValue } from '@mxfriend/oscom';

export class USBDirEntry extends Container {
  @Property type: StringValue;
  @Property name: StringValue;

  constructor() {
    super(true);
  }
}

export class USBDir extends Collection<USBDirEntry> {
  @Property dirpos: IntValue;
  @Property maxpos: IntValue;

  constructor() {
    super(() => new USBDirEntry(), { size: 1000, pad: 3, callable: true });
  }
}

export class USB extends Container {
  @Property path: StringValue;
  @Property title: StringValue;
  @Property dir: USBDir;

  constructor() {
    super(true);
  }
}
