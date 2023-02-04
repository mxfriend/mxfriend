import { ChannelHeadamp } from '@mxfriend/common';
import { Collection, Container, IntValue, Property } from '@mxfriend/oscom';

export class HeadampList extends Collection<ChannelHeadamp> {
  constructor() {
    super(() => new ChannelHeadamp(), { size: 128, pad: 3 });
  }
}

export class HaSource extends Container {
  @Property index: IntValue;

  constructor() {
    super(true);
  }
}

export class HaSourceList extends Collection<HaSource> {
  constructor() {
    super(() => new HaSource(), { size: 40, pad: 2 });
  }
}
