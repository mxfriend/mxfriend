import { ChannelHeadamp, Formatted } from '@mxfriend/common';
import { Collection, Container, ScaledValue, Linear } from '@mxfriend/oscom';


export class ReturnHeadamp extends Container {
  @Formatted('+.1') @Linear(-12, 20, 65) gain: ScaledValue;

  constructor() {
    super(true);
  }
}

export class HeadampList extends Collection<ChannelHeadamp | ReturnHeadamp> {
  constructor() {
    super((i) => i > 15 ? new ReturnHeadamp() : new ChannelHeadamp(), { size: 24, pad: 2 });
  }
}

