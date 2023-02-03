import { Fx } from '@mxfriend/common';
import { Collection } from '@mxfriend/oscom';

export class FxList extends Collection<Fx> {
  constructor() {
    super(() => new Fx(), 4);
  }
}

