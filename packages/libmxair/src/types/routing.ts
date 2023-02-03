import { Collection, Enum, EnumValue, Container, Property } from '@mxfriend/oscom';
import { AuxSrc, MainSrc, Tap, UsbSrc } from './enums';


export class MainPatch extends Container {
  @Enum(MainSrc) src: EnumValue<MainSrc>;

  constructor() {
    super(true);
  }
}

export class AuxPatch extends Container {
  @Enum(AuxSrc) src: EnumValue<AuxSrc>;
  @Enum(Tap) pos: EnumValue<Tap>;

  constructor() {
    super(true);
  }
}

export class USBPatch extends Container {
  @Enum(UsbSrc) src: EnumValue<UsbSrc>;
  @Enum(Tap) pos: EnumValue<Tap>;

  constructor() {
    super(true);
  }
}

export class MainList extends Collection<MainPatch> {
  constructor() {
    super(() => new MainPatch(), { size: 2, pad: 2 });
  }
}

export class AuxList extends Collection<AuxPatch> {
  constructor() {
    super(() => new AuxPatch(), { size: 6, pad: 2 });
  }
}

export class P16List extends Collection<AuxPatch> {
  constructor() {
    super(() => new AuxPatch(), { size: 16, pad: 2 });
  }
}

export class USBList extends Collection<USBPatch> {
  constructor() {
    super(() => new USBPatch(), { size: 18, pad: 2 });
  }
}

export class Routing extends Container {
  @Property main: MainList;
  @Property aux: AuxList;
  @Property p16: P16List;
  @Property usb: USBList;
}

