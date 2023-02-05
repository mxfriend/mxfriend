import { AbstractFx, FxParamList, FxType, paramListMap } from '@mxfriend/common';
import {
  Collection, Container,
  Enum,
  EnumValue, IntValue,
  Property,
} from '@mxfriend/oscom';
import { FxSource, InsertFxType } from '../enums';
import { insertParamListMap } from './map';

export class SendFxSources extends Container {
  @Enum(FxSource) l: EnumValue<FxSource>;
  @Enum(FxSource) r: EnumValue<FxSource>;

  constructor() {
    super(true);
  }
}

export class SendFx extends AbstractFx {
  @Enum(FxType) type: EnumValue<FxType>;
  @Property source: SendFxSources;
  @Property par: FxParamList;

  constructor() {
    super(paramListMap);
  }
}

export class InsertFx extends AbstractFx {
  @Enum(InsertFxType) type: EnumValue<InsertFxType>;
  @Property par: FxParamList;

  constructor() {
    super(insertParamListMap);
  }
}

export class FxList extends Collection<SendFx | InsertFx> {
  constructor() {
    super((i) => i < 4 ? new SendFx() : new InsertFx(), 8);
  }
}

export class InsertList extends Container {
  @Property fx1L: IntValue;
  @Property fx1R: IntValue;
  @Property fx2L: IntValue;
  @Property fx2R: IntValue;
  @Property fx3L: IntValue;
  @Property fx3R: IntValue;
  @Property fx4L: IntValue;
  @Property fx4R: IntValue;
  @Property fx5L: IntValue;
  @Property fx5R: IntValue;
  @Property fx6L: IntValue;
  @Property fx6R: IntValue;
  @Property fx7L: IntValue;
  @Property fx7R: IntValue;
  @Property fx8L: IntValue;
  @Property fx8R: IntValue;
  @Property aux1: IntValue;
  @Property aux2: IntValue;
  @Property aux3: IntValue;
  @Property aux4: IntValue;
  @Property aux5: IntValue;
  @Property aux6: IntValue;

  constructor() {
    super(true);
  }
}
