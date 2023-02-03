import { Collection, FloatValue, Value } from '@mxfriend/oscom';

export class FxParamList extends Collection<Value<any>> {
  constructor() {
    super((param) => this.$createParam(param), { size: 64, pad: 2, callable: true });
  }

  protected $createParam(param: number): Value {
    return new FloatValue();
  }
}
