import { Collection, IntValue } from '@mxfriend/oscom';

export class IpAddress extends Collection<IntValue> {
  constructor() {
    super(() => new IntValue(), { size: 4, callable: true });
  }
}
