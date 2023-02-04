import { AbstractFx, Bool, FxParamList, FxType, paramListMap } from '@mxfriend/common';
import { Collection, Enum, EnumValue, Property } from '@mxfriend/oscom';

export class Fx extends AbstractFx {
  @Enum(FxType) type: EnumValue<FxType>;
  @Enum(Bool) insert: EnumValue<Bool>;
  @Property par: FxParamList;

  constructor() {
    super(paramListMap);
  }
}

export class FxList extends Collection<Fx> {
  constructor() {
    super(() => new Fx(), 4);
  }
}

