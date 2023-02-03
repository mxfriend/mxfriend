import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { formatted } from '../../../oscom';
import { Bool } from '../../enums';
import {
  Xtec1AHiFreq,
  Xtec1ALoFreq,
  Xtec1AMidFreq,
  XtecQ5HiFreq,
  XtecQ5LoFreq,
  XtecQ5MidFreq,
} from '../enums';
import { FxParamList } from '../fxParamList';


export class GeqParams extends FxParamList {
  protected $createParam(param: number): Value {
    if (param < 32) {
      return formatted(new ScaledValue(getLinearScale(-15, 15, 61)), '.1');
    }

    return super.$createParam(param);
  }
}


export class Xtec1AParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return new EnumValue(Bool);
      case 1: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 3: return new EnumValue(Xtec1ALoFreq);
      case 4: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 6: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 7: return new EnumValue(Xtec1AMidFreq);
      case 8: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 9: return new EnumValue(Xtec1AHiFreq);
      case 10: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class XtecQ5Params extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return new EnumValue(Bool);
      case 1: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 2: return new EnumValue(XtecQ5LoFreq);
      case 3: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 4: return new EnumValue(XtecQ5MidFreq);
      case 5: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 6: return new EnumValue(XtecQ5HiFreq);
      case 7: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 8: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}
