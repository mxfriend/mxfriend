import {
  Container,
  Enum,
  EnumValue,
  Property,
  Value,
} from '@mxfriend/oscom';
import { Bool, FxType } from '../enums';
import { FxParamList } from './fxParamList';
import { paramListMap } from './map';


export class Fx extends Container {
  @Enum(FxType) type: EnumValue<FxType>;
  @Enum(Bool) insert: EnumValue<Bool>;
  @Property par: FxParamList;

  constructor() {
    super(true);
    this.$updateParamList = this.$updateParamList.bind(this);
  }

  $attach(prop: string | number, value: Container | Value) {
    super.$attach(prop, value);

    if (prop === 'type') {
      (value as EnumValue<FxType>).$on('local-change', this.$updateParamList);
      (value as EnumValue<FxType>).$on('remote-change', this.$updateParamList);
    }
  }

  private $updateParamList(type?: FxType): void {
    if (type !== undefined) {
      this.par = new paramListMap[type];
    }
  }
}
